import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ToolPattern {
  tool: string;
  best_format: string;
  ordering: string[];
  prompt_style: string;
  forbidden: string[];
  required: string[];
  examples: Array<{
    input: string;
    optimized: string;
  }>;
}

interface HistoricalPrompt {
  optimized_prompt: string;
  token_count: number;
  quality_score: number;
}

const TOOL_FORMATTERS = {
  cursor: (appSchema: any, promptSchema: any, smpl: string, pattern: ToolPattern) => {
    const files: string[] = [];

    if (appSchema) {
      files.push(`File: src/types.ts\nDefine types for: ${appSchema.data_models?.map((m: any) => m.name).join(', ') || 'app data'}`);

      appSchema.pages?.forEach((page: any) => {
        files.push(`File: src/pages/${page.id}.tsx\nComponent: ${page.title}\nIncludes: ${page.components.join(', ')}`);
      });
    }

    return files.join('\n\n');
  },

  bolt: (appSchema: any, promptSchema: any, smpl: string) => {
    if (promptSchema) {
      return `${promptSchema.task}\n\n${promptSchema.steps?.join('\n') || ''}`;
    }
    if (appSchema) {
      return `Build ${appSchema.app_name}: ${appSchema.description}. Features: ${appSchema.pages?.map((p: any) => p.title).join(', ') || 'core functionality'}.`;
    }
    return smpl;
  },

  v0: (appSchema: any, promptSchema: any, smpl: string) => {
    if (appSchema) {
      const components = appSchema.pages?.flatMap((p: any) => p.components) || [];
      return `Components: ${[...new Set(components)].join(', ')}. Style: modern, clean. ${appSchema.platform} platform.`;
    }
    if (promptSchema) {
      return `${promptSchema.task}. Focus: ${promptSchema.entities?.map((e: any) => e.name).join(', ') || 'UI components'}.`;
    }
    return smpl;
  },

  claude: (appSchema: any, promptSchema: any, smpl: string, pattern: ToolPattern) => {
    const sections: string[] = [];

    if (promptSchema) {
      sections.push(`Objective: ${promptSchema.task}`);
      sections.push(`Intent: ${promptSchema.intent}`);

      if (promptSchema.context) {
        sections.push(`Context: ${promptSchema.context}`);
      }

      if (promptSchema.entities?.length > 0) {
        sections.push(`Entities:\n${promptSchema.entities.map((e: any) => `- ${e.name} (${e.type}): ${e.description}`).join('\n')}`);
      }

      if (promptSchema.steps?.length > 0) {
        sections.push(`Steps:\n${promptSchema.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}`);
      }

      if (promptSchema.constraints?.length > 0) {
        sections.push(`Constraints:\n${promptSchema.constraints.map((c: string) => `- ${c}`).join('\n')}`);
      }
    } else if (appSchema) {
      sections.push(`Objective: Build ${appSchema.app_name}`);
      sections.push(`Description: ${appSchema.description}`);
      sections.push(`Platform: ${appSchema.platform}`);

      if (appSchema.pages?.length > 0) {
        sections.push(`Pages:\n${appSchema.pages.map((p: any) => `- ${p.title}: ${p.components.join(', ')}`).join('\n')}`);
      }

      if (appSchema.data_models?.length > 0) {
        sections.push(`Data Models:\n${appSchema.data_models.map((m: any) => `- ${m.name}: ${m.fields.map((f: any) => f.name).join(', ')}`).join('\n')}`);
      }

      if (appSchema.actions?.length > 0) {
        sections.push(`Actions:\n${appSchema.actions.map((a: any) => `- ${a.name}: ${a.trigger} -> ${a.steps.join(' > ')}`).join('\n')}`);
      }
    }

    return sections.join('\n\n');
  },

  replit: (appSchema: any, promptSchema: any, smpl: string) => {
    const steps: string[] = [];

    if (appSchema) {
      steps.push(`Goal: Create ${appSchema.app_name}`);
      steps.push('\nDirectory Structure:');
      steps.push('src/');
      steps.push('  components/');
      steps.push('  pages/');
      steps.push('  types/');
      steps.push('  utils/');

      steps.push('\nSteps:');
      steps.push('1. Set up project structure');
      steps.push('2. Define types and interfaces');
      steps.push(`3. Create ${appSchema.pages?.length || 0} pages`);
      steps.push('4. Implement core functionality');
      steps.push('5. Add styling and polish');
      steps.push('6. Test and deploy');
    } else if (promptSchema) {
      steps.push(`Goal: ${promptSchema.task}`);
      steps.push('\nSteps:');
      promptSchema.steps?.forEach((step: string, i: number) => {
        steps.push(`${i + 1}. ${step}`);
      });
    }

    return steps.join('\n');
  }
};

const OPTIMIZATION_PROMPT = `You are an expert at optimizing prompts for AI coding tools.

Given:
- Tool name and style guidelines
- Base prompt content
- Historical successful prompts
- Tool-specific patterns

Your task:
1. Analyze the base prompt structure
2. Apply tool-specific best practices
3. Remove unnecessary verbosity
4. Ensure all required elements are present
5. Avoid forbidden patterns
6. Optimize for clarity and token efficiency

Return ONLY the optimized prompt text. No explanations or metadata.`;

function calculateQualityScore(
  optimizedPrompt: string,
  pattern: ToolPattern,
  historical: HistoricalPrompt[]
): number {
  let score = 50;

  const hasRequired = pattern.required.every(req =>
    optimizedPrompt.toLowerCase().includes(req.toLowerCase())
  );
  if (hasRequired) score += 20;

  const hasForbidden = pattern.forbidden.some(forbidden =>
    optimizedPrompt.toLowerCase().includes(forbidden.toLowerCase())
  );
  if (hasForbidden) score -= 15;

  const tokenCount = Math.ceil(optimizedPrompt.length / 4);
  const avgTokens = historical.length > 0
    ? historical.reduce((sum, h) => sum + (h.token_count || 0), 0) / historical.length
    : 500;

  if (tokenCount < avgTokens * 0.8) {
    score += 15;
  } else if (tokenCount > avgTokens * 1.5) {
    score -= 10;
  }

  const hasStructure = optimizedPrompt.includes('\n\n') || optimizedPrompt.includes(':');
  if (hasStructure) score += 10;

  const avgQuality = historical.length > 0
    ? historical.reduce((sum, h) => sum + (h.quality_score || 50), 0) / historical.length
    : 50;
  score = (score + avgQuality) / 2;

  return Math.max(0, Math.min(100, score));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { tool, appSchema, promptSchema, smpl } = await req.json();

    if (!tool || typeof tool !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input: tool field is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const validTools = ['cursor', 'bolt', 'v0', 'claude', 'replit'];
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: pattern, error: patternError } = await supabase
      .from('tool_patterns')
      .select('*')
      .eq('tool', tool)
      .maybeSingle();

    if (patternError || !pattern) {
      return new Response(
        JSON.stringify({
          error: 'Tool pattern not found',
          details: `No pattern configured for tool: ${tool}`
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: historical, error: histError } = await supabase
      .from('prompt_memory')
      .select('optimized_prompt, token_count, quality_score')
      .eq('tool', tool)
      .not('optimized_prompt', 'is', null)
      .order('quality_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

    const historicalPrompts: HistoricalPrompt[] = historical || [];

    const formatter = TOOL_FORMATTERS[tool as keyof typeof TOOL_FORMATTERS];
    const basePrompt = formatter(appSchema, promptSchema, smpl, pattern);

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

    const bestExamples = historicalPrompts
      .slice(0, 3)
      .map(h => h.optimized_prompt)
      .join('\n\n---\n\n');

    const userPrompt = `Tool: ${tool}
Style: ${pattern.prompt_style}
Required: ${pattern.required.join(', ')}
Forbidden: ${pattern.forbidden.join(', ')}

Base Prompt:
${basePrompt}

${bestExamples ? `Successful Examples:\n${bestExamples}\n\n` : ''}Optimize this prompt for ${tool} following the style guidelines.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: OPTIMIZATION_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
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
    const optimizedPrompt = data.choices[0]?.message?.content?.trim();

    if (!optimizedPrompt) {
      return new Response(
        JSON.stringify({
          error: 'No optimized prompt generated',
          details: 'The AI model did not return any content',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const tokenCount = Math.ceil(optimizedPrompt.length / 4);
    const qualityScore = calculateQualityScore(optimizedPrompt, pattern, historicalPrompts);

    const { data: savedRecord, error: dbError } = await supabase
      .from('prompt_memory')
      .insert({
        tool,
        input_text: basePrompt,
        input_type: 'optimization',
        input_format: pattern.best_format,
        mode: 'export',
        json_schema: { appSchema, promptSchema },
        smpl_dsl: smpl || '',
        expanded_spec: basePrompt,
        optimized_prompt: optimizedPrompt,
        token_count: tokenCount,
        quality_score: qualityScore,
        export_prompts: { [tool]: optimizedPrompt },
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
        optimizedPrompt,
        tokenCount,
        qualityScore,
        metadata: {
          baseTokens: Math.ceil(basePrompt.length / 4),
          historicalCount: historicalPrompts.length,
          avgHistoricalScore: historicalPrompts.length > 0
            ? historicalPrompts.reduce((sum, h) => sum + (h.quality_score || 50), 0) / historicalPrompts.length
            : null,
          timestamp: new Date().toISOString(),
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Optimization failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Optimization failed',
        details: error.message || 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});