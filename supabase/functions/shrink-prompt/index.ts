import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { input, tool = 'cursor' } = await req.json();

    if (!input || typeof input !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input: input field is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const validTools = ['cursor', 'claude', 'bolt', 'v0', 'replit', 'openai', 'anthropic'];
    if (!validTools.includes(tool)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid tool',
          details: `Tool must be one of: ${validTools.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key not configured',
          details: 'Please add OPENAI_API_KEY to your environment variables',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const toolStrategy = TOOL_COMPRESSION_STRATEGIES[tool as keyof typeof TOOL_COMPRESSION_STRATEGIES];

    const userPrompt = `Tool: ${tool}
Compression Strategy: ${toolStrategy.strategy}
Strategy Description: ${toolStrategy.description}

Input to compress:
${input}

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
      return new Response(
        JSON.stringify({
          error: 'OpenAI API request failed',
          details: error,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    const compactPrompt = data.choices[0]?.message?.content?.trim();

    if (!compactPrompt) {
      return new Response(
        JSON.stringify({
          error: 'No compressed prompt generated',
          details: 'The AI model did not return any content',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const inputTokens = Math.ceil(input.length / 4);
    const compactTokens = Math.ceil(compactPrompt.length / 4);
    const compressionRatio = ((inputTokens - compactTokens) / inputTokens * 100).toFixed(1);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: savedRecord, error: dbError } = await supabase
      .from('prompt_memory')
      .insert({
        tool,
        input_text: input,
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
    console.error('Shrink prompt failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Shrink prompt failed',
        details: error.message || 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});