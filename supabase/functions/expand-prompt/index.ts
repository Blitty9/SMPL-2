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

const TOOL_EXPANSION_STRATEGIES = {
  cursor: {
    name: "cursor",
    format: "file_blocks",
    description: "Expand into file-based structure with explicit paths and code blocks",
  },
  claude: {
    name: "claude",
    format: "verbose",
    description: "Expand with full context, detailed descriptions, and clear sections",
  },
  v0: {
    name: "v0",
    format: "minimal_json",
    description: "Expand into minimal JSON with component focus",
  },
  bolt: {
    name: "bolt",
    format: "single_task",
    description: "Expand into single clear task description with tech stack",
  },
  replit: {
    name: "replit",
    format: "directory",
    description: "Expand with directory structure and step-by-step implementation",
  },
  openai: {
    name: "openai",
    format: "structured",
    description: "Expand with clear structure and detailed requirements",
  },
  anthropic: {
    name: "anthropic",
    format: "verbose",
    description: "Expand with full context, detailed descriptions, and clear sections",
  },
};

const EXPAND_SYSTEM_PROMPT = `You are a prompt expansion expert. Convert compact SMPL DSL format into full, detailed prompts optimized for specific AI tools.

Your task:
1. Parse the compact SMPL DSL input
2. Identify all components, models, pages, actions, and flows
3. Expand into the target tool's preferred format
4. Add necessary context and details
5. Follow tool-specific conventions

CRITICAL REQUIREMENTS:
- All functions, features, and capabilities mentioned MUST be fully integrated and usable in the UI
- If a filter function is created, it MUST have UI controls (buttons, dropdowns, etc.) to use it
- If a feature is implemented, it MUST be accessible and functional, not just defined
- Never create functions that are unused or disconnected from the user interface
- All interactive features must have corresponding UI elements
- Code should be complete, functional, and ready to use

Format Guidelines by Tool:

CURSOR (file_blocks):
- Structure as file paths with content
- Example: "File: src/pages/Login.tsx\nComponent with email/password form..."
- Include imports, types, and implementation details
- Ensure all functions are called and all features have UI controls

CLAUDE (verbose):
- Full sections with headings
- Detailed explanations
- Step-by-step instructions
- Context and constraints
- Explicitly connect all features to UI elements

V0 (minimal_json):
- Clean JSON structure
- Component-focused
- Minimal but complete
- All features must be accessible

BOLT (single_task):
- One clear task description
- Tech stack listed
- Features enumerated
- Concise but actionable
- Ensure feature completeness

REPLIT (directory):
- Directory structure first
- Step-by-step setup
- Clear file organization
- Implementation order
- All features must be integrated

Ensure the expanded prompt is complete, actionable, optimized for the target tool, and that ALL features are fully integrated with UI controls.`;

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

    const toolStrategy = TOOL_EXPANSION_STRATEGIES[tool as keyof typeof TOOL_EXPANSION_STRATEGIES];

    const userPrompt = `Tool: ${tool}
Expansion Format: ${toolStrategy.format}
Format Description: ${toolStrategy.description}

Compact SMPL input:
${sanitizedInput}

Expand this into a full, detailed prompt optimized for ${tool} following the ${toolStrategy.format} format.

IMPORTANT: Ensure ALL features, functions, and capabilities are fully integrated with UI controls. If you create a filter function, include filter buttons/dropdowns in the UI. If you create any interactive feature, make sure it has corresponding UI elements that allow users to actually use it. Never create functions that are defined but unused or disconnected from the user interface.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: EXPAND_SYSTEM_PROMPT },
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
    const expandedPrompt = data.choices[0]?.message?.content?.trim();

    if (!expandedPrompt) {
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    const inputTokens = Math.ceil(sanitizedInput.length / 4);
    const expandedTokens = Math.ceil(expandedPrompt.length / 4);
    const expansionRatio = ((expandedTokens - inputTokens) / inputTokens * 100).toFixed(1);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: savedRecord, error: dbError } = await supabase
      .from('prompt_memory')
      .insert({
        tool,
        input_text: sanitizedInput,
        input_type: 'expansion',
        input_format: 'smpl',
        mode: 'expand',
        expanded_spec: expandedPrompt,
        token_count: expandedTokens,
        quality_score: 75,
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
        expandedPrompt,
        metadata: {
          inputTokens,
          expandedTokens,
          expansionRatio: `${expansionRatio}%`,
          format: toolStrategy.format,
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