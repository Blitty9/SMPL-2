import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AppSchema {
  app_name: string;
  platform: 'web' | 'mobile' | 'desktop';
  description: string;
  pages: any[];
  data_models: any[];
  actions: any[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text } = await req.json();

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

    const systemPrompt = `You are SMPL, an intelligent blueprint generator that converts natural language app descriptions into structured schemas.

Your task is to analyze the user's app description and generate:
1. A canonical JSON AppSchema
2. A compact DSL (APPDSL) representation
3. An expanded specification in markdown

JSON Schema format:
{
  "app_name": string,
  "platform": "web" | "mobile" | "desktop",
  "description": string,
  "pages": [{ "id": string, "type": string, "components": string[], "auth_required": boolean }],
  "data_models": [{ "name": string, "fields": [{ "name": string, "type": string, "optional": boolean }] }],
  "actions": [{ "name": string, "trigger": string, "steps": string[] }]
}

DSL format:
APP(name){
  platform: web|mobile
  pages:
    id[type]: comp1,comp2
  models:
    ModelName: field1, field2?, field3:number
  actions:
    ActionName: trigger -> step1>step2
}

Respond with a JSON object containing these three keys: jsonSchema (as a JSON object, not string), dsl (as a string), expandedSpec (as a markdown string).`;

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
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    const schema: AppSchema = parsed.jsonSchema;
    const dsl: string = parsed.dsl;
    const expandedSpec: string = parsed.expandedSpec;

    const jsonSchemaString = JSON.stringify(schema, null, 2);

    const exports = {
      cursor: generateCursorPrompt(schema, jsonSchemaString),
      bolt: generateBoltPrompt(schema, jsonSchemaString),
      v0: generateV0Prompt(schema),
      replit: generateReplitPrompt(schema, dsl),
      vibeCode: generateVibeCodePrompt(schema),
      generic: generateGenericPrompt(schema, jsonSchemaString),
    };

    const tokenCounts = {
      input: Math.ceil(text.split(/\s+/).length * 1.3),
      json: Math.ceil(jsonSchemaString.length / 4),
      dsl: Math.ceil(dsl.length / 4),
    };

    return new Response(
      JSON.stringify({
        jsonSchema: jsonSchemaString,
        dsl,
        expandedSpec,
        exports,
        tokenCounts,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Schema generation failed:', error);
    return new Response(
      JSON.stringify({
        error: 'Schema generation failed',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateCursorPrompt(schema: AppSchema, jsonSchema: string): string {
  return `You are Cursor AI. Generate a production-ready ${schema.platform} application based on this AppSchema:

${jsonSchema}

Requirements:
- Use React + TypeScript for ${schema.platform === 'web' ? 'web' : 'React Native for mobile'}
- Implement all pages: ${schema.pages.map((p) => p.id).join(', ')}
- Set up Supabase for backend (auth + database)
- Create all data models with proper types
- Implement all actions and workflows
- Add proper error handling and loading states
- Use Tailwind CSS for styling
- Follow best practices for file structure

Deliver complete, working code with proper imports and exports.`;
}

function generateBoltPrompt(schema: AppSchema, jsonSchema: string): string {
  return `You are Bolt AI. Use this schema to scaffold a full-stack project:

${jsonSchema}

Project Structure:
${schema.pages.map((p) => `- /${p.id} page with ${p.components.join(', ')}`).join('\n')}

Tech Stack:
- Frontend: React + TypeScript + Vite
- Backend: Supabase (database + auth)
- Styling: Tailwind CSS

Data Models:
${schema.data_models.map((m) => `- ${m.name}: ${m.fields.map((f: any) => f.name).join(', ')}`).join('\n')}

Implement all features with proper state management, routing, and API integration.`;
}

function generateV0Prompt(schema: AppSchema): string {
  return `You are v0.dev. Convert this schema into beautiful, functional UI components:

App: ${schema.app_name}
Platform: ${schema.platform}
Description: ${schema.description}

Pages to create:
${schema.pages.map(p => `
${p.id}:
  Type: ${p.type}
  Components: ${p.components.join(', ')}
  ${p.auth_required ? 'Auth: Required' : 'Auth: Public'}
`).join('\n')}

Design System:
- Modern, minimal aesthetic
- Consistent spacing and typography
- Proper component hierarchy
- Responsive design
- Accessible UI elements

Generate React components with Tailwind CSS that are ready for production.`;
}

function generateReplitPrompt(schema: AppSchema, dsl: string): string {
  return `You are Replit Agent. Build this application from the following DSL:

${dsl}

Setup Instructions:
1. Initialize a ${schema.platform === 'web' ? 'React + Vite' : 'React Native'} project
2. Configure Supabase connection
3. Create folder structure:
   - /src/pages for all routes
   - /src/components for reusable components
   - /src/lib for utilities
   - /src/types for TypeScript types

4. Implement all pages with proper routing
5. Create database schema and migrations
6. Add authentication flows
7. Implement all actions and business logic

Run the project and ensure everything works end-to-end.`;
}

function generateVibeCodePrompt(schema: AppSchema): string {
  return `You are VibeCode. Create a ${schema.platform} application with this specification:

## App Overview
${schema.description}

## Features
${schema.pages.map((p, i) => `${i + 1}. ${p.id} - ${p.components.join(', ')}`).join('\n')}

## Data Layer
${schema.data_models.map((m) => `- ${m.name} model`).join('\n')}

## Actions
${schema.actions.map((a) => `- ${a.name}: ${a.trigger}`).join('\n')}

Generate clean, production-ready code with:
- TypeScript for type safety
- Modern React patterns (hooks, context)
- Supabase for backend
- Proper error handling
- Loading and empty states
- Responsive design

Make it feel polished and professional.`;
}

function generateGenericPrompt(schema: AppSchema, jsonSchema: string): string {
  return `Build a ${schema.platform} application based on this specification:

${jsonSchema}

Technical Requirements:
- Language: TypeScript
- Framework: React (${schema.platform === 'mobile' ? 'React Native' : 'with Vite'})
- Backend: Supabase
- Styling: Tailwind CSS
- State Management: React hooks + context
- Authentication: Supabase Auth
- Database: PostgreSQL via Supabase

Implementation Checklist:
✓ Set up project with proper tooling
✓ Implement all ${schema.pages.length} pages
✓ Create ${schema.data_models.length} data models with TypeScript types
✓ Build ${schema.actions.length} actions/workflows
✓ Add authentication flows
✓ Configure database with RLS
✓ Implement error handling
✓ Add loading states
✓ Create responsive layouts
✓ Write clean, maintainable code

Deliver a production-ready application with proper project structure and best practices.`;
}
