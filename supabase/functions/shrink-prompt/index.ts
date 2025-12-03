import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  getCorsHeaders,
  handleOptions,
  validateInputSize,
  sanitizeInput,
  checkRateLimit,
  getClientIdentifier,
  sanitizeError,
  createErrorResponse,
} from "../_shared/security.ts";

const TOOL_COMPRESSION_STRATEGIES = {
  v0: {
    name: "v0",
    strategy: "aggressive",
    description: "Maximize compression, focus on component names and minimal structure",
  },
  claude: {
    name: "claude",
    strategy: "structured",
    description: "Keep logical structure, compress descriptions but maintain context",
  },
  cursor: {
    name: "cursor",
    strategy: "reduce_narrative",
    description: "Remove narrative, keep technical specs and file references",
  },
  bolt: {
    name: "bolt",
    strategy: "atomic",
    description: "Break into atomic tasks, compress to single-line directives",
  },
  replit: {
    name: "replit",
    strategy: "procedural",
    description: "Compress into step-by-step procedural format",
  },
  openai: {
    name: "openai",
    strategy: "balanced",
    description: "Balance between clarity and token efficiency",
  },
  anthropic: {
    name: "anthropic",
    strategy: "structured",
    description: "Keep logical structure, compress descriptions but maintain context",
  },
};

const SHRINK_SYSTEM_PROMPT = `You are a prompt compression expert. Convert verbose prompts into SMPL DSL format.

SMPL DSL is a token-efficient language for describing applications and prompts.

Format Rules:
- Use compact syntax: APP(name){ ... } or PROMPT(task){ ... }
- Sections: pages, models, actions, entities, steps, constraints
- Use abbreviations: req=required, opt=optional, str=string, num=number
- Use symbols: ? for optional, ! for required, -> for flow, | for options
- Remove filler words, articles, and unnecessary descriptions
- Keep only essential information

Example compression:
Input: "Create a user authentication page with email and password fields. The page should have a login form, validation for email format, and error messages when login fails."

Output for aggressive (v0):
AUTH_PAGE: form[email:str!, pwd:str!] > validate > login | error

Output for structured (claude):
PAGE(auth){
  form: email:str!, pwd:str!
  flow: submit -> validate -> login | show_error
  constraints: email_format, error_handling
}

Output for atomic (bolt):
1. form: email+pwd
2. validate email
3. POST /login
4. handle err

Adapt compression strategy based on tool requirements while maintaining all critical information.`;

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
    const { input, tool = 'cursor' } = await req.json();

    // Validate input size
    const inputValidation = validateInputSize(input);
    if (!inputValidation.valid) {
      return createErrorResponse(
        inputValidation.error || 'Invalid input',
        400,
        corsHeaders
      );
    }

    // Sanitize input
    const sanitizedInput = sanitizeInput(input);

    const validTools = ['cursor', 'claude', 'bolt', 'v0', 'replit', 'openai', 'anthropic', 'createanything', 'lovable'];
    if (!validTools.includes(tool)) {
      return createErrorResponse(
        'Invalid tool',
        400,
        corsHeaders,
        `Tool must be one of: ${validTools.join(', ')}`
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return createErrorResponse(
        'Service configuration error',
        500,
        corsHeaders
      );
    }

    const toolStrategy = TOOL_COMPRESSION_STRATEGIES[tool as keyof typeof TOOL_COMPRESSION_STRATEGIES];

    const userPrompt = `Tool: ${tool}
Compression Strategy: ${toolStrategy.strategy}
Strategy Description: ${toolStrategy.description}

Input to compress:
${sanitizedInput}

Compress this into SMPL DSL format following the ${toolStrategy.strategy} strategy for ${tool}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SHRINK_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
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
    const compactPrompt = data.choices[0]?.message?.content?.trim();

    if (!compactPrompt) {
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    const inputTokens = Math.ceil(sanitizedInput.length / 4);
    const compactTokens = Math.ceil(compactPrompt.length / 4);
    const compressionRatio = ((inputTokens - compactTokens) / inputTokens * 100).toFixed(1);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: savedRecord, error: dbError } = await supabase
      .from('prompt_memory')
      .insert({
        tool,
        input_text: sanitizedInput,
        input_type: 'compression',
        input_format: 'text',
        mode: 'shrink',
        smpl_dsl: compactPrompt,
        token_count: compactTokens,
        quality_score: parseFloat(compressionRatio),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to save to database:', dbError);
      // Don't fail the request if DB save fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: savedRecord?.id,
        tool,
        compactPrompt,
        metadata: {
          inputTokens,
          compactTokens,
          compressionRatio: `${compressionRatio}%`,
          strategy: toolStrategy.strategy,
          timestamp: new Date().toISOString(),
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const errorMessage = sanitizeError(error, 'An error occurred while processing your request');
    return createErrorResponse(
      errorMessage,
      500,
      corsHeaders
    );
  }
});