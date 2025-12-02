# Security Recommendations for SMPL

This document outlines critical security measures that should be implemented to protect the SMPL application.

## 🔴 Critical Security Issues

### 1. **CORS Configuration - Overly Permissive**
**Current State:** All functions allow `Access-Control-Allow-Origin: *`
**Risk:** Any website can make requests to your API endpoints
**Recommendation:**
- Restrict CORS to your specific domain(s)
- Use environment variable for allowed origins
- Consider using Supabase's built-in CORS handling

**Implementation:**
```typescript
const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || ['https://yourdomain.com'];
const origin = req.headers.get('origin');
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigins.includes(origin || '') ? origin || '*' : 'null',
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  "Access-Control-Max-Age": "86400",
};
```

### 2. **No Rate Limiting**
**Current State:** No rate limiting on any endpoints
**Risk:** API abuse, cost overruns from OpenAI, DDoS attacks
**Recommendation:**
- Implement rate limiting per IP address
- Use Supabase Edge Functions rate limiting or implement custom solution
- Consider different limits for different endpoints
- Track usage per user/session

**Implementation Options:**
- Use Supabase's built-in rate limiting (if available)
- Implement in-memory rate limiting with Deno KV
- Use a service like Upstash Redis for distributed rate limiting

### 3. **Database Row Level Security - Public Access**
**Current State:** `prompt_memory` table allows public read/write access
**Risk:** Anyone can read/write to your database, potential data leakage
**Recommendation:**
- Remove public access policies
- Implement proper authentication
- Use service role key only in Edge Functions (already done)
- Consider if storing user data is necessary at all

**Implementation:**
```sql
-- Remove public policies
DROP POLICY IF EXISTS "Allow public read access" ON prompt_memory;
DROP POLICY IF EXISTS "Allow public insert access" ON prompt_memory;

-- Add authenticated user policy (if implementing auth)
CREATE POLICY "Users can insert their own prompts"
  ON prompt_memory
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own prompts"
  ON prompt_memory
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### 4. **No Input Size Limits**
**Current State:** No maximum size limit on input text
**Risk:** Large inputs can cause memory issues, high API costs, DoS attacks
**Recommendation:**
- Set maximum input size (e.g., 50KB or 10,000 characters)
- Validate input size before processing
- Return clear error messages for oversized inputs

**Implementation:**
```typescript
const MAX_INPUT_SIZE = 50000; // 50KB
const MAX_INPUT_LENGTH = 10000; // characters

if (text.length > MAX_INPUT_LENGTH) {
  return new Response(
    JSON.stringify({ error: `Input too large. Maximum ${MAX_INPUT_LENGTH} characters allowed.` }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### 5. **Missing Security Headers**
**Current State:** No security headers configured in Vercel
**Risk:** XSS attacks, clickjacking, MIME type sniffing
**Recommendation:**
- Add security headers to `vercel.json`
- Configure Content Security Policy (CSP)
- Add HSTS, X-Frame-Options, etc.

**Implementation:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com;"
        }
      ]
    }
  ]
}
```

### 6. **Error Message Information Disclosure**
**Current State:** Error messages may leak sensitive information
**Risk:** Exposing internal errors, API keys, system details
**Recommendation:**
- Sanitize error messages before returning to client
- Log detailed errors server-side only
- Return generic error messages to clients
- Don't expose OpenAI API errors directly

**Implementation:**
```typescript
catch (error) {
  console.error('Schema generation failed:', error); // Detailed logging server-side
  
  // Generic error message for client
  return new Response(
    JSON.stringify({
      error: 'Schema generation failed',
      details: 'An error occurred while processing your request. Please try again.',
    }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### 7. **No Input Sanitization**
**Current State:** User input sent directly to OpenAI without sanitization
**Risk:** Prompt injection attacks, malicious content
**Recommendation:**
- Validate and sanitize input before sending to OpenAI
- Check for suspicious patterns
- Limit special characters if not needed
- Consider using a content filter

**Implementation:**
```typescript
function sanitizeInput(text: string): string {
  // Remove null bytes
  text = text.replace(/\0/g, '');
  
  // Limit to reasonable characters (adjust based on needs)
  // Remove or escape potentially dangerous patterns
  
  // Truncate to max length
  return text.substring(0, MAX_INPUT_LENGTH);
}
```

## 🟡 Important Security Enhancements

### 8. **Environment Variable Security**
**Current State:** Using environment variables correctly, but should verify
**Recommendation:**
- Ensure all secrets are in environment variables (not hardcoded)
- Use Supabase secrets management
- Rotate API keys regularly
- Never commit secrets to version control
- Use different keys for dev/staging/production

### 9. **Request Validation**
**Current State:** Basic validation exists
**Recommendation:**
- Add more comprehensive input validation
- Validate tool parameter against whitelist (already done)
- Validate mode parameter
- Add type checking for all inputs

### 10. **API Key Protection**
**Current State:** OpenAI API key stored in environment (good)
**Recommendation:**
- Ensure Supabase Edge Functions secrets are properly configured
- Consider using Supabase Vault for sensitive data
- Monitor API key usage for anomalies
- Set up alerts for unusual usage patterns

### 11. **Logging and Monitoring**
**Current State:** Basic console.error logging
**Recommendation:**
- Implement structured logging
- Log security events (rate limit hits, large inputs, errors)
- Set up monitoring and alerts
- Track API usage and costs
- Monitor for abuse patterns

**Implementation:**
```typescript
// Structured logging
const logEvent = {
  timestamp: new Date().toISOString(),
  endpoint: 'app-gen',
  ip: req.headers.get('x-forwarded-for') || 'unknown',
  inputSize: text.length,
  error: error?.message,
};
console.log(JSON.stringify(logEvent));
```

### 12. **Content Security Policy (CSP)**
**Current State:** No CSP headers
**Recommendation:**
- Implement strict CSP
- Allow only necessary sources
- Prevent inline scripts where possible
- Use nonces for inline scripts if needed

### 13. **Authentication (Optional but Recommended)**
**Current State:** No authentication required
**Recommendation:**
- Consider adding Supabase Auth for user accounts
- Implement usage quotas per user
- Track usage per user
- Enable premium features for authenticated users

## 🟢 Best Practices

### 14. **Input Validation Schema**
- Use a validation library like Zod for request validation
- Define schemas for all inputs
- Validate before processing

### 15. **Timeout Configuration**
- Set timeouts for OpenAI API calls
- Set maximum execution time for Edge Functions
- Handle timeout errors gracefully

### 16. **Cost Controls**
- Set up OpenAI usage limits
- Monitor token usage
- Implement cost alerts
- Consider caching common requests

### 17. **Dependency Security**
- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Keep Supabase SDK updated
- Monitor security advisories

### 18. **Backup and Recovery**
- Regular database backups
- Test recovery procedures
- Document disaster recovery plan

## Implementation Priority

1. **Immediate (Critical):**
   - Fix CORS configuration
   - Implement rate limiting
   - Fix database RLS policies
   - Add input size limits

2. **Short-term (High Priority):**
   - Add security headers
   - Sanitize error messages
   - Implement input sanitization
   - Add logging and monitoring

3. **Medium-term (Important):**
   - Consider authentication
   - Enhanced validation
   - Cost controls and alerts
   - Dependency updates

## Testing Security Measures

- Test rate limiting with multiple rapid requests
- Test with oversized inputs
- Test CORS with different origins
- Test error handling for information disclosure
- Perform security audit of dependencies
- Test input sanitization with various payloads

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Vercel Security Headers](https://vercel.com/docs/security/headers)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)

