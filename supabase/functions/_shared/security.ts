// Security utilities for Edge Functions

// Configuration constants
const MAX_INPUT_LENGTH = 10000; // 10,000 characters
const MAX_INPUT_SIZE = 50000; // 50KB in bytes
const RATE_LIMIT_REQUESTS = 20; // requests per window
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window

// Allowed origins - can be configured via environment variable
const getAllowedOrigins = (): string[] => {
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  if (envOrigins) {
    return envOrigins.split(',').map(o => o.trim());
  }
  // Default: allow common development and production origins
  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://smplblueprint.com',
    'https://www.smplblueprint.com',
  ];
};

// Get CORS headers based on request origin
export function getCorsHeaders(req: Request): Record<string, string> {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.get('origin');
  
  const corsOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : allowedOrigins[0] || '*';
  
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
    "Access-Control-Max-Age": "86400",
  };
}

// Handle OPTIONS preflight requests
export function handleOptions(corsHeaders: Record<string, string>): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Validate input size
export function validateInputSize(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Invalid input: text field is required' };
  }
  
  if (text.length > MAX_INPUT_LENGTH) {
    return { 
      valid: false, 
      error: `Input too large. Maximum ${MAX_INPUT_LENGTH} characters allowed.` 
    };
  }
  
  // Check byte size (approximate)
  const byteSize = new TextEncoder().encode(text).length;
  if (byteSize > MAX_INPUT_SIZE) {
    return { 
      valid: false, 
      error: `Input too large. Maximum ${MAX_INPUT_SIZE} bytes allowed.` 
    };
  }
  
  return { valid: true };
}

// Sanitize input text
export function sanitizeInput(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove null bytes
  let sanitized = text.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Truncate to max length
  if (sanitized.length > MAX_INPUT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_INPUT_LENGTH);
  }
  
  return sanitized;
}

// Simple in-memory rate limiting
// Note: For production, consider using Deno KV or external service like Upstash Redis
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = RATE_LIMIT_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // New window or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      for (const [k, v] of rateLimitStore.entries()) {
        if (now > v.resetAt) {
          rateLimitStore.delete(k);
        }
      }
    }
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }
  
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

// Get client identifier for rate limiting
export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a default identifier (less secure)
  return 'unknown';
}

// Sanitize error messages for client
export function sanitizeError(error: unknown, defaultMessage: string = 'An error occurred'): string {
  // Log full error server-side
  console.error('Error details:', error);
  
  // Return generic message to client
  if (error instanceof Error) {
    // Only return safe error messages
    const safeMessages = [
      'Invalid input',
      'Input too large',
      'Rate limit exceeded',
      'Service temporarily unavailable',
    ];
    
    if (safeMessages.some(msg => error.message.includes(msg))) {
      return error.message;
    }
  }
  
  return defaultMessage;
}

// Create error response
export function createErrorResponse(
  message: string,
  status: number,
  corsHeaders: Record<string, string>,
  details?: string
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      ...(details && { details }),
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

