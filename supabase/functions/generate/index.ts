import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type InputType = 'json' | 'code' | 'jsx' | 'prisma' | 'sql' | 'yaml' | 'text';

function detectInputType(text: string): InputType {
  const trimmed = text.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  if (/model\s+\w+\s*\{/.test(trimmed)) {
    return 'prisma';
  }

  if (/CREATE\s+TABLE|SELECT\s+|INSERT\s+INTO|ALTER\s+TABLE/i.test(trimmed)) {
    return 'sql';
  }

  if (/<[A-Z]\w*[\s>]/.test(trimmed)) {
    return 'jsx';
  }

  if (/\b(class|function|const|let|var|import|export|interface|type)\b/.test(trimmed)) {
    return 'code';
  }

  if (/^\w+:\s*.+$/m.test(trimmed) && trimmed.includes('\n')) {
    return 'yaml';
  }

  return 'text';
}

const SYSTEM_PROMPT = `You are SMPL, an AI that converts ANY type of project description into a unified AppSchema.

You MUST:
1. Detect the input format automatically.
2. Normalize all inputs into the Canonical AppSchema format.
3. Infer missing fields.
4. NEVER return conversational text. Only return valid JSON.

The input may be:
- natural language description
- broken or valid JSON
- JSON with comments
- YAML
- TypeScript interfaces
- React components
- Express routes
- SQL or Prisma schema
- mixed text and code
- bullet points or messy descriptions

RULES:
- Extract pages, models, actions, and relationships.
- Infer page types from names (home = feed, profile = detail).
- Infer model fields/types when missing.
- Summaries are NOT allowed. Return the FINAL AppSchema only.

OUTPUT FORMAT (MUST MATCH EXACTLY):

{
  "app_name": string,
  "platform": "web" | "mobile" | "fullstack",
  "description": string,
  "pages": [
    { "id": string, "type": string, "title": string, "components": string[] }
  ],
  "data_models": [
    { "name": string, "fields": [ { "name": string, "type": string, "required": boolean } ] }
  ],
  "actions": [
    { "name": string, "triggers": string[], "steps": string[] }
  ]
}

If the input is incomplete, still infer structure.
Always produce a complete, valid, strict JSON object.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text, mode = 'app', tool = 'cursor' } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input: text field is required' }),
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

    const inputType = detectInputType(text);

    const userPrompt = mode === 'prompt'
      ? `Input Type: ${inputType}

Input Content:
${text}

Convert this prompt/description into a structured prompt schema format. Return ONLY valid JSON matching the AppSchema specification but optimized for prompt analysis.`
      : `Input Type: ${inputType}

Input Content:
${text}

Convert this into the canonical AppSchema format. Return ONLY valid JSON matching the AppSchema specification.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
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
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({
          error: 'No response from OpenAI',
          details: 'The AI model did not return any content',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let schema;
    try {
      schema = JSON.parse(content);
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          error: 'Failed to parse LLM response as JSON',
          details: parseError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const requiredFields = ['app_name', 'platform', 'description', 'pages', 'data_models', 'actions'];
    const hasAllFields = requiredFields.every(field => field in schema);

    if (!hasAllFields) {
      return new Response(
        JSON.stringify({
          error: 'Generated schema is missing required fields',
          details: 'Schema must include: ' + requiredFields.join(', '),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        schema,
        metadata: {
          inputType,
          mode,
          tool,
          timestamp: new Date().toISOString(),
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Schema generation failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Schema generation failed',
        details: error.message || 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});