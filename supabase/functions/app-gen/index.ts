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
    { "id": string, "type": string, "title": string, "components": string[], "auth_required": boolean }
  ],
  "data_models": [
    { "name": string, "fields": [ { "name": string, "type": string, "optional": boolean } ] }
  ],
  "actions": [
    { "name": string, "trigger": string, "steps": string[] }
  ]
}

If the input is incomplete, still infer structure.
Always produce a complete, valid, strict JSON object.`;

const DSL_SYSTEM_PROMPT = `Convert this AppSchema object into a compact DSL called SMPL DSL.
Only output the SMPL DSL. No JSON. No explanations.

Format example:

APP(MyApp){
  platform: web
  pages:
    home[feed]: header,feed,button (protected)
  models:
    User: name, age?:number
  actions:
    CreateUser: form.submit -> validate > insert_record > navigate.home
}`;

interface AppSchema {
  app_name: string;
  platform: string;
  description: string;
  pages: Array<{
    id: string;
    type: string;
    title: string;
    components: string[];
    auth_required?: boolean;
  }>;
  data_models: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      optional?: boolean;
    }>;
  }>;
  actions: Array<{
    name: string;
    trigger: string;
    steps: string[];
  }>;
}

function formatDSL(schema: AppSchema): string {
  const lines: string[] = [];

  lines.push(`APP(${schema.app_name}){`);
  lines.push(`  platform: ${schema.platform}`);

  if (schema.pages.length > 0) {
    lines.push('  pages:');
    schema.pages.forEach((page) => {
      const components = page.components.join(',');
      const auth = page.auth_required ? ' (protected)' : '';
      lines.push(`    ${page.id}[${page.type}]: ${components}${auth}`);
    });
  }

  if (schema.data_models.length > 0) {
    lines.push('  models:');
    schema.data_models.forEach((model) => {
      const fields = model.fields
        .map((f) => {
          let field = f.name;
          if (f.optional) field += '?';
          if (f.type !== 'string') field += `:${f.type}`;
          return field;
        })
        .join(', ');
      lines.push(`    ${model.name}: ${fields}`);
    });
  }

  if (schema.actions.length > 0) {
    lines.push('  actions:');
    schema.actions.forEach((action) => {
      const steps = action.steps.join(' > ');
      lines.push(`    ${action.name}: ${action.trigger} -> ${steps}`);
    });
  }

  lines.push('}');

  return lines.join('\n');
}

function formatExpanded(schema: AppSchema): string {
  const lines: string[] = [];

  lines.push(`# ${schema.app_name}`);
  lines.push('');
  lines.push(`**Platform:** ${schema.platform}`);
  lines.push('');
  lines.push(`**Description:** ${schema.description}`);
  lines.push('');

  if (schema.pages.length > 0) {
    lines.push('## Pages');
    lines.push('');
    schema.pages.forEach((page) => {
      lines.push(`### ${page.title} (${page.id})`);
      lines.push(`- **Type:** ${page.type}`);
      lines.push(`- **Components:** ${page.components.join(', ')}`);
      if (page.auth_required) {
        lines.push(`- **Authentication:** Required`);
      }
      lines.push('');
    });
  }

  if (schema.data_models.length > 0) {
    lines.push('## Data Models');
    lines.push('');
    schema.data_models.forEach((model) => {
      lines.push(`### ${model.name}`);
      model.fields.forEach((field) => {
        const optional = field.optional ? ' (optional)' : ' (required)';
        lines.push(`- **${field.name}:** ${field.type}${optional}`);
      });
      lines.push('');
    });
  }

  if (schema.actions.length > 0) {
    lines.push('## Actions');
    lines.push('');
    schema.actions.forEach((action) => {
      lines.push(`### ${action.name}`);
      lines.push(`- **Trigger:** ${action.trigger}`);
      lines.push(`- **Steps:**`);
      action.steps.forEach((step, i) => {
        lines.push(`  ${i + 1}. ${step}`);
      });
      lines.push('');
    });
  }

  return lines.join('\n');
}

function generateExportPrompts(schema: AppSchema, jsonSchema: string, smplDsl: string): Record<string, string> {
  const baseContext = `App: ${schema.app_name}\nPlatform: ${schema.platform}\nDescription: ${schema.description}`;
  
  const pagesList = schema.pages.map(p => `- ${p.title} (${p.type}): ${p.components.join(', ')}`).join('\n');
  const modelsList = schema.data_models.map(m => `- ${m.name}: ${m.fields.map(f => `${f.name}${f.optional ? '?' : ''}: ${f.type}`).join(', ')}`).join('\n');
  const actionsList = schema.actions.map(a => `- ${a.name}: ${a.trigger} -> ${a.steps.join(' > ')}`).join('\n');

  return {
    cursor: `# Cursor AI - File-Based Implementation

${baseContext}

## Project Structure
Create files following this structure:
${schema.pages.map(p => `File: src/pages/${p.id}.tsx`).join('\n')}
${schema.data_models.map(m => `File: src/types/${m.name.toLowerCase()}.ts`).join('\n')}

## SMPL DSL Specification
\`\`\`
${smplDsl}
\`\`\`

## Implementation Guide
Build each file with:
- TypeScript with strict types
- React functional components with hooks
- Proper imports and exports
- Error boundaries where needed
- Responsive design patterns

Pages to implement:
${pagesList}

Data models:
${modelsList}

Actions:
${actionsList}

Focus on code quality, type safety, and maintainable architecture.`,

    claude: `# Claude Code - Comprehensive Implementation

${baseContext}

## Application Overview
This is a ${schema.platform} application that needs to be built from scratch.

## Complete Specification
\`\`\`json
${jsonSchema}
\`\`\`

## SMPL DSL Format
\`\`\`
${smplDsl}
\`\`\`

## Detailed Requirements

### Pages
${pagesList}

### Data Models
${modelsList}

### User Actions
${actionsList}

## Implementation Approach
1. Set up project structure with proper folder organization
2. Define TypeScript interfaces for all data models
3. Create reusable components following composition patterns
4. Implement state management (useContext, useState, or state library)
5. Add proper error handling and loading states
6. Ensure type safety throughout the codebase
7. Write clean, well-documented code
8. Add responsive design considerations

## Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Ensure accessibility (a11y) standards
- Write comprehensive error handling
- Use TypeScript strictly (no any types)
- Implement proper validation for user inputs`,

    bolt: `# Bolt.new - Full-Stack Application

${baseContext}

## Tech Stack
- Frontend: Vite + React + TypeScript
- Styling: Tailwind CSS
- State: React Hooks or Zustand
- Forms: React Hook Form
- Validation: Zod

## Application Specification
\`\`\`json
${jsonSchema}
\`\`\`

## Features to Implement

Pages:
${pagesList}

Data Models:
${modelsList}

Actions:
${actionsList}

## Implementation Requirements
- Production-ready code with proper error handling
- Responsive design (mobile-first)
- Clean component architecture
- Type-safe throughout
- Optimized performance
- Accessible UI components
- Form validation on all inputs
- Loading and error states for async operations

Build a complete, working application ready for deployment.`,

    v0: `# v0.dev - UI Component Design

${baseContext}

## Design Requirements
Build beautiful, modern UI components using shadcn/ui and Tailwind CSS.

## Pages & Components
${pagesList}

## Visual Design Guidelines
- Modern, clean aesthetic
- Smooth animations and transitions
- Excellent user experience
- Responsive across all devices
- Accessible color contrasts
- Intuitive interactions

## Component Structure
For each page, create:
- Layout components
- Interactive elements with hover states
- Form components with validation feedback
- Data display components (lists, cards, tables)
- Navigation components

## Design Focus
- Visual hierarchy
- Consistent spacing and typography
- Micro-interactions
- Loading states with skeletons
- Error states with helpful messages
- Success feedback animations

Use shadcn/ui components as the base and customize for this application's needs.`,

    replit: `# Replit Agent - Step-by-Step Implementation

${baseContext}

## SMPL DSL
\`\`\`
${smplDsl}
\`\`\`

## Implementation Plan

### Step 1: Project Setup
- Initialize project structure
- Install dependencies (React, TypeScript, build tools)
- Set up configuration files

### Step 2: Data Models
Create TypeScript interfaces:
${modelsList}

### Step 3: Core Components
Build reusable components first, then page-specific ones.

### Step 4: Pages
Implement in this order:
${schema.pages.map((p, i) => `${i + 1}. ${p.title} - ${p.components.join(', ')}`).join('\n')}

### Step 5: Actions & Logic
Implement user actions:
${actionsList}

### Step 6: Integration & Testing
- Connect all components
- Test user flows
- Fix any issues
- Optimize performance

## File Structure
\`\`\`
src/
  components/
  pages/
  types/
  utils/
  hooks/
\`\`\`

Follow this order and create clean, well-structured code at each step.`,

    openai: `# OpenAI - Structured Implementation

${baseContext}

## Application Structure

### Pages
${pagesList}

### Data Models
${modelsList}

### Actions
${actionsList}

## Complete Schema
\`\`\`json
${jsonSchema}
\`\`\`

## Implementation Requirements
1. Use TypeScript with strict type checking
2. Implement all pages with their specified components
3. Create all data models with proper types
4. Implement all user actions with proper state management
5. Add error handling for all async operations
6. Ensure responsive design
7. Follow React best practices
8. Write clean, maintainable code

## Technical Stack
- React with TypeScript
- Modern React patterns (hooks, functional components)
- Proper state management
- Type-safe API calls (if applicable)
- Form validation
- Error boundaries

Build a complete, production-ready application matching this specification exactly.`,

    anthropic: `# Anthropic Claude - Detailed Implementation Guide

${baseContext}

## Complete Application Specification

### Full Schema
\`\`\`json
${jsonSchema}
\`\`\`

### SMPL DSL Format
\`\`\`
${smplDsl}
\`\`\`

## Detailed Component Breakdown

### Pages & Their Components
${pagesList}

Each page should be fully functional with all specified components integrated.

### Data Models & Types
${modelsList}

Define TypeScript interfaces for all models with proper typing.

### User Actions & Flows
${actionsList}

Implement each action with proper state updates and user feedback.

## Implementation Strategy

1. **Architecture**: Set up a clean, scalable architecture with proper separation of concerns
2. **Type Safety**: Use TypeScript strictly - define interfaces for all data structures
3. **Component Design**: Create reusable, composable components
4. **State Management**: Choose appropriate state management (local state, context, or library)
5. **Error Handling**: Implement comprehensive error handling with user-friendly messages
6. **Performance**: Optimize renders, use memoization where appropriate
7. **Accessibility**: Ensure WCAG compliance
8. **Testing**: Write testable code with clear separation of logic and presentation

## Code Quality Standards
- Clean, readable code with meaningful variable names
- Proper comments for complex logic
- Consistent code style
- Proper error boundaries
- Loading states for async operations
- Form validation with clear feedback
- Responsive design patterns

Build a comprehensive, well-architected application following software engineering best practices.`
  };
}

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
    const { text, mode = 'app', tool = 'cursor' } = await req.json();

    // Validate input size
    const inputValidation = validateInputSize(text);
    if (!inputValidation.valid) {
      return createErrorResponse(
        inputValidation.error || 'Invalid input',
        400,
        corsHeaders
      );
    }

    // Sanitize input
    const sanitizedText = sanitizeInput(text);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return createErrorResponse(
        'Service configuration error',
        500,
        corsHeaders
      );
    }

    const inputType = detectInputType(sanitizedText);

    const userPrompt = mode === 'prompt'
      ? `Input Type: ${inputType}\n\nInput Content:\n${sanitizedText}\n\nConvert this prompt/description into a structured prompt schema format. Return ONLY valid JSON matching the AppSchema specification but optimized for prompt analysis.`
      : `Input Type: ${inputType}\n\nInput Content:\n${sanitizedText}\n\nConvert this into the canonical AppSchema format. Return ONLY valid JSON matching the AppSchema specification.`;

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
      console.error('OpenAI API error:', error);
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return createErrorResponse(
        'AI service temporarily unavailable',
        500,
        corsHeaders
      );
    }

    let schema: AppSchema;
    try {
      schema = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return createErrorResponse(
        'Failed to process AI response',
        500,
        corsHeaders
      );
    }

    const jsonSchema = JSON.stringify(schema, null, 2);
    const smplDsl = formatDSL(schema);
    const expandedSpec = formatExpanded(schema);
    const exportPrompts = generateExportPrompts(schema, jsonSchema, smplDsl);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth token if available
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (error) {
        // If auth fails, continue without user_id (for anonymous users)
        console.log('Could not extract user from token:', error);
      }
    }

    const { data: savedRecord, error: dbError } = await supabase
      .from('prompt_memory')
      .insert({
        input_text: sanitizedText,
        input_type: inputType,
        mode,
        json_schema: schema,
        smpl_dsl: smplDsl,
        expanded_spec: expandedSpec,
        export_prompts: exportPrompts,
        user_id: userId,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to save to database:', dbError);
      // Don't fail the request if DB save fails
    }

    const allExports = exportPrompts;
    const best = exportPrompts[tool] || exportPrompts.cursor;

    return new Response(
      JSON.stringify({
        success: true,
        id: savedRecord?.id,
        jsonSchema,
        smplDsl,
        expandedSpec,
        exportPrompts: allExports,
        best,
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
    const errorMessage = sanitizeError(error, 'An error occurred while processing your request');
    return createErrorResponse(
      errorMessage,
      500,
      corsHeaders
    );
  }
});