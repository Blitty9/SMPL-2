import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getCorsHeaders, handleOptions, checkRateLimit, validateInputSize, sanitizeInput, createErrorResponse, getClientIdentifier } from '../_shared/security.ts';

type EnhancementType = 
  | 'scroll-animations'
  | 'hover-effects'
  | 'gradient-backgrounds'
  | 'text-animations'
  | 'micro-interactions'
  | 'modern-layouts';

const ENHANCEMENT_PROMPTS: Record<EnhancementType, string> = {
  'scroll-animations': `Add scroll-triggered animations that enhance the user experience:

- Content sections fade in smoothly as users scroll down the page
- List items and cards appear with a subtle staggered effect
- Hero sections and key content areas reveal elegantly on scroll
- Navigation elements animate in when they come into view

Keep animations smooth, subtle, and professional. They should enhance engagement without being distracting.`,

  'hover-effects': `Add interactive hover effects throughout the interface:

- Cards and interactive elements respond to hover with smooth visual feedback
- Buttons and links change appearance on hover to indicate interactivity
- Icons and images have subtle hover states that enhance engagement
- Interactive elements use color transitions, shadows, and subtle transforms

Ensure all hover effects provide clear visual feedback and feel responsive and polished.`,

  'gradient-backgrounds': `Add modern gradient backgrounds and visual depth:

- Use gradient backgrounds to create visual interest and depth
- Add subtle texture patterns and overlays for sophistication
- Implement glassmorphism effects for modern, layered designs
- Create gradient text effects for key headings and accents

Make gradients subtle and professional, enhancing the visual hierarchy without overwhelming the content.`,

  'text-animations': `Add engaging text animations:

- Hero text and key headings animate in on page load
- Text content reveals smoothly as users scroll
- Dynamic text elements use smooth transitions when content changes
- Important messages and calls-to-action have subtle animation effects

Keep text animations readable and purposeful - they should enhance the message, not distract from it.`,

  'micro-interactions': `Add smooth micro-interactions for better user feedback:

- Buttons and interactive elements respond immediately to user actions
- Form inputs provide clear visual feedback on focus and interaction
- Loading states use smooth animations to indicate progress
- Icons and small elements have subtle animations that enhance usability

All interactions should feel responsive, smooth, and provide clear feedback to users.`,

  'modern-layouts': `Implement modern, professional layout patterns:

- Use responsive grid layouts that adapt beautifully to different screen sizes
- Create visual hierarchy with thoughtful spacing and typography
- Implement split-screen and alternating layouts for visual interest
- Ensure consistent spacing, padding, and alignment throughout

Layouts should be clean, organized, and create a polished, professional appearance.`
};

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return handleOptions(corsHeaders);
  }

  // Rate limiting
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId);
  if (!rateLimit.allowed) {
    return createErrorResponse(
      'Rate limit exceeded',
      429,
      corsHeaders,
      `Too many requests. Please try again after ${new Date(rateLimit.resetAt).toISOString()}`
    );
  }

  try {
    const { prompt, enhancementType, enhancementTypes, mode = 'app' } = await req.json();
    
    // Support both single enhancementType and array of enhancementTypes
    const typesToApply = enhancementTypes && Array.isArray(enhancementTypes) && enhancementTypes.length > 0
      ? enhancementTypes
      : enhancementType
        ? [enhancementType]
        : [];

    if (!prompt || typeof prompt !== 'string') {
      return createErrorResponse(
        'Invalid input: prompt field is required',
        400,
        corsHeaders
      );
    }

    if (typesToApply.length === 0) {
      return createErrorResponse(
        'Invalid enhancement type',
        400,
        corsHeaders,
        `Enhancement type(s) required. Must be one or more of: ${Object.keys(ENHANCEMENT_PROMPTS).join(', ')}`
      );
    }
    
    // Validate all enhancement types
    for (const type of typesToApply) {
      if (!ENHANCEMENT_PROMPTS[type as EnhancementType]) {
        return createErrorResponse(
          'Invalid enhancement type',
          400,
          corsHeaders,
          `Invalid enhancement type: ${type}. Must be one of: ${Object.keys(ENHANCEMENT_PROMPTS).join(', ')}`
        );
      }
    }

    // Validate input size
    const inputValidation = validateInputSize(prompt);
    if (!inputValidation.valid) {
      return createErrorResponse(
        inputValidation.error || 'Invalid input',
        400,
        corsHeaders
      );
    }

    // Sanitize input
    const sanitizedPrompt = sanitizeInput(prompt);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return createErrorResponse(
        'Service configuration error',
        500,
        corsHeaders
      );
    }

    // Combine all enhancement instructions
    const allEnhancementInstructions = typesToApply
      .map(type => ENHANCEMENT_PROMPTS[type as EnhancementType])
      .join('\n\n');
    
    const enhancementNames = typesToApply.map(type => {
      const name = type.replace(/-/g, ' ');
      return name.charAt(0).toUpperCase() + name.slice(1);
    }).join(', ');
    
    const systemPrompt = `You are a UI/UX enhancement specialist. Your task is to enhance the given ${mode === 'app' ? 'application description' : 'prompt'} with modern UI/UX improvements.

CRITICAL RULES:
1. Preserve ALL existing functionality and requirements exactly as stated
2. Keep the original structure: list functional features first, then add enhancements separately
3. DO NOT repeat enhancement descriptions for each feature - describe them ONCE at a high level
4. DO NOT include implementation details (e.g., "Framer Motion", "stiffness: 300", "shadow-lg", specific CSS classes)
5. Use high-level, descriptive language about the user experience, not technical implementation
6. Be concise - avoid verbose repetition
7. Add enhancements as a separate section after the functional requirements
8. Apply ALL of the following enhancement types: ${enhancementNames}

STRUCTURE:
- First: List all functional features/requirements (unchanged from original)
- Then: Add a separate "UI/UX Enhancements" section describing ALL enhancements at a high level

Enhancement Instructions (apply ALL of these):
${allEnhancementInstructions}

Return ONLY the enhanced ${mode === 'app' ? 'application description' : 'prompt'} following the structure above. Make sure to include ALL enhancement types in the enhancements section. Do not add explanations or meta-commentary.`;

    const userPrompt = `Original ${mode === 'app' ? 'Application Description' : 'Prompt'}:
${sanitizedPrompt}

Enhance this with the requested UI improvements. Follow these guidelines:
1. Keep all functional requirements exactly as stated - do not modify them
2. List functional features first, unchanged
3. Then add a separate "UI/UX Enhancements" section describing the enhancements at a high level
4. Do NOT repeat enhancement descriptions for each feature - describe them once
5. Use high-level, user-experience focused language
6. Avoid implementation details, technical specifications, or specific library names
7. Be concise and avoid verbose repetition`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    return new Response(
      JSON.stringify({
        enhancedPrompt,
        enhancementType,
        originalLength: sanitizedPrompt.length,
        enhancedLength: enhancedPrompt.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('UI enhancement failed:', error);
    return createErrorResponse(
      'Enhancement failed',
      500,
      corsHeaders
    );
  }
});

