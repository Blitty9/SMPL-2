import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SMPL_SYSTEM_PROMPT = `Convert this AppSchema object into SMPL Format, a compact token-efficient DSL.
Only output SMPL Format. Do not output JSON or explanations.

Format example:

APP(MyApp){
  pages:
    home[feed]: header,feed,button
  models:
    User: name:string, age:number?
  actions:
    CreateUser: form.submit -> validate > insert_record > navigate.home
}`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { schema, tool = 'cursor' } = await req.json();

    if (!schema || typeof schema !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid input: schema object is required' }),
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

    const schemaJson = JSON.stringify(schema, null, 2);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SMPL_SYSTEM_PROMPT },
          { role: 'user', content: schemaJson },
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
    const smpl = data.choices[0]?.message?.content;

    if (!smpl) {
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

    return new Response(
      JSON.stringify({ dsl: smpl, tool }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('SMPL Format generation failed:', error);
    return new Response(
      JSON.stringify({
        error: 'SMPL Format generation failed',
        details: error.message || 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});