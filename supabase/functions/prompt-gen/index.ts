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

interface PromptSchema {
  task: string;
  intent: string;
  entities: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  steps: string[];
  constraints: string[];
  context?: string;
}

const PROMPT_SYSTEM_PROMPT = `You are SMPL Prompt Optimizer, an AI that normalizes any prompt into a structured PromptSchema.

You MUST:
1. Analyze the input prompt and extract key components
2. Identify the main task and underlying intent
3. Extract entities (objects, concepts, tools mentioned)
4. Break down into sequential steps
5. Identify constraints and requirements
6. NEVER return conversational text. Only return valid JSON.

The input may be:
- natural language prompt
- incomplete instructions
- chatbot conversation
- technical requirements
- user stories
- mixed format descriptions

RULES:
- Extract the core task concisely
- Identify the user's true intent (what they want to achieve)
- List all entities with their types (feature, component, data, tool, concept)
- Break complex tasks into clear steps
- Extract all constraints (performance, security, format, style)
- Add context if helpful for understanding

OUTPUT FORMAT (MUST MATCH EXACTLY):

{
  "task": string (concise main task),
  "intent": string (underlying goal),
  "entities": [
    { "name": string, "type": string, "description": string }
  ],
  "steps": string[] (ordered steps),
  "constraints": string[] (requirements and limits),
  "context": string (optional background)
}

Always produce a complete, valid, strict JSON object.`;

function formatPromptCompact(schema: PromptSchema): string {
  const lines: string[] = [];

  lines.push(`PROMPT(${schema.task}){`);
  lines.push(`  intent: ${schema.intent}`);

  if (schema.context) {
    lines.push(`  context: ${schema.context}`);
  }

  if (schema.entities.length > 0) {
    lines.push('  entities:');
    schema.entities.forEach((entity) => {
      lines.push(`    ${entity.name}[${entity.type}]: ${entity.description}`);
    });
  }

  if (schema.steps.length > 0) {
    lines.push('  steps:');
    schema.steps.forEach((step, i) => {
      lines.push(`    ${i + 1}. ${step}`);
    });
  }

  if (schema.constraints.length > 0) {
    lines.push('  constraints:');
    schema.constraints.forEach((constraint) => {
      lines.push(`    - ${constraint}`);
    });
  }

  lines.push('}');

  return lines.join('\n');
}

function formatPromptExpanded(schema: PromptSchema): string {
  const lines: string[] = [];

  lines.push(`# ${schema.task}`);
  lines.push('');
  lines.push(`**Intent:** ${schema.intent}`);
  lines.push('');

  if (schema.context) {
    lines.push(`**Context:** ${schema.context}`);
    lines.push('');
  }

  if (schema.entities.length > 0) {
    lines.push('## Entities');
    lines.push('');
    schema.entities.forEach((entity) => {
      lines.push(`### ${entity.name}`);
      lines.push(`- **Type:** ${entity.type}`);
      lines.push(`- **Description:** ${entity.description}`);
      lines.push('');
    });
  }

  if (schema.steps.length > 0) {
    lines.push('## Steps');
    lines.push('');
    schema.steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
    lines.push('');
  }

  if (schema.constraints.length > 0) {
    lines.push('## Constraints');
    lines.push('');
    schema.constraints.forEach((constraint) => {
      lines.push(`- ${constraint}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

function calculateTokenStats(original: string, jsonPrompt: string, compactPrompt: string): {
  original: number;
  json: number;
  compact: number;
  savings: number;
  savingsPercent: number;
} {
  const originalTokens = Math.ceil(original.length / 4);
  const jsonTokens = Math.ceil(jsonPrompt.length / 4);
  const compactTokens = Math.ceil(compactPrompt.length / 4);
  const savings = originalTokens - compactTokens;
  const savingsPercent = ((savings / originalTokens) * 100);

  return {
    original: originalTokens,
    json: jsonTokens,
    compact: compactTokens,
    savings,
    savingsPercent: Math.round(savingsPercent * 10) / 10,
  };
}

function generatePromptExports(schema: PromptSchema, jsonPrompt: string, compactPrompt: string): Record<string, string> {
  const stepsList = schema.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
  const entitiesList = schema.entities.map(e => `- ${e.name}: ${e.description}`).join('\n');
  const constraintsList = schema.constraints.map(c => `- ${c}`).join('\n');

  return {
    cursor: `# Cursor AI - File-Based Implementation

${compactPrompt}

## Complete Specification
\`\`\`json
${jsonPrompt}
\`\`\`

## Task Breakdown
${stepsList}

## Implementation Approach
- Create files with proper TypeScript types
- Use React functional components
- Implement proper error handling
- Ensure type safety throughout
- Follow React best practices

Constraints:
${constraintsList}

Build this with clean, maintainable code ready for production.`,

    claude: `# Claude Code - Comprehensive Implementation

## Task Objective
${schema.task}

## Detailed Specification
\`\`\`json
${jsonPrompt}
\`\`\`

## Implementation Steps
${stepsList}

## Entities & Components
${entitiesList}

## Constraints & Requirements
${constraintsList}

## Implementation Guidelines
1. Follow software engineering best practices
2. Implement clean architecture with proper separation of concerns
3. Ensure comprehensive type safety
4. Add robust error handling and validation
5. Write reusable, well-documented code
6. Consider edge cases and error scenarios
7. Optimize for performance and maintainability

Build a complete, production-ready implementation following these guidelines.`,

    bolt: `# Bolt.new - Full-Stack Task

## Task
${schema.task}

## Implementation Steps
${stepsList}

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS for styling
- React Hook Form for forms
- Zod for validation

## Requirements
${constraintsList}

## Entities
${entitiesList}

Create a working, production-ready implementation with:
- Clean, maintainable code
- Proper error handling
- Responsive design
- Type safety
- Form validation
- Loading states

Build the complete feature ready for deployment.`,

    v0: `# v0.dev - UI Component Design

## Design Task
${schema.task}

## Visual Components Needed
${entitiesList}

## Design Requirements
- Modern, beautiful UI using shadcn/ui components
- Tailwind CSS for styling
- Smooth animations and transitions
- Excellent user experience
- Responsive across all screen sizes
- Accessible design patterns

## Implementation Steps
${stepsList}

## Constraints
${constraintsList}

Focus on creating visually appealing, interactive UI components with excellent UX. Use shadcn/ui as the component library base.`,

    replit: `# Replit Agent - Step-by-Step Implementation

${compactPrompt}

## Implementation Plan

### Step 1: Setup
Set up project structure and dependencies.

### Step 2: Core Implementation
${stepsList}

### Step 3: Entities
${entitiesList}

### Step 4: Constraints
${constraintsList}

### Step 5: Testing & Refinement
Test all functionality and fix any issues.

Break this down into clear, actionable steps. Implement each step with clean, well-structured code.`,

    openai: `# OpenAI - Structured Task Implementation

## Task
${schema.task}

## Complete Specification
\`\`\`json
${jsonPrompt}
\`\`\`

## Implementation Steps
${stepsList}

## Components & Entities
${entitiesList}

## Requirements & Constraints
${constraintsList}

## Implementation Standards
- TypeScript with strict typing
- React best practices
- Proper error handling
- Type-safe implementations
- Clean code architecture
- Responsive design
- Form validation

Implement this task following these standards with production-ready code.`,

    anthropic: `# Anthropic Claude - Detailed Implementation

## Task Overview
${schema.task}

## Full Specification
\`\`\`json
${jsonPrompt}
\`\`\`

## Detailed Implementation Plan

### Steps to Follow
${stepsList}

### Components & Entities
${entitiesList}

### Constraints & Requirements
${constraintsList}

## Implementation Approach

1. **Architecture**: Design a clean, scalable architecture
2. **Type Safety**: Use TypeScript with comprehensive type definitions
3. **Error Handling**: Implement robust error handling with user feedback
4. **Code Quality**: Write clean, well-documented, maintainable code
5. **Testing**: Ensure code is testable and handles edge cases
6. **Performance**: Optimize for performance and user experience
7. **Accessibility**: Follow accessibility best practices

## Best Practices
- Follow software engineering principles
- Implement proper separation of concerns
- Use design patterns where appropriate
- Write comprehensive error handling
- Ensure code reusability
- Document complex logic
- Optimize for maintainability

Build a complete, well-architected implementation following these comprehensive guidelines.`
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
    const { text, tool = 'cursor' } = await req.json();

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

    const userPrompt = `Input Prompt:\n${sanitizedText}\n\nConvert this into the structured PromptSchema format. Extract task, intent, entities, steps, and constraints. Return ONLY valid JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: PROMPT_SYSTEM_PROMPT },
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

    let schema: PromptSchema;
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

    const jsonPrompt = JSON.stringify(schema, null, 2);
    const smplCompact = formatPromptCompact(schema);
    const expandedPrompt = formatPromptExpanded(schema);
    const tokenStats = calculateTokenStats(sanitizedText, jsonPrompt, smplCompact);
    const exportPrompts = generatePromptExports(schema, jsonPrompt, smplCompact);

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
        input_type: 'prompt',
        mode: 'prompt',
        json_schema: schema,
        smpl_dsl: smplCompact,
        expanded_spec: expandedPrompt,
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
        jsonPrompt,
        smplCompact,
        expandedPrompt,
        tokenStats,
        exportPrompts: allExports,
        best,
        metadata: {
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