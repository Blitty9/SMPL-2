import type { AppSchema } from '../utils/schema';

export interface ExportPrompts {
  cursor: string;
  bolt: string;
  v0: string;
  replit: string;
  vibeCode: string;
  generic: string;
}

export function generateExports(
  schema: AppSchema,
  jsonSchema: string,
  smpl: string
): ExportPrompts {
  return {
    cursor: generateCursorPrompt(schema, jsonSchema),
    bolt: generateBoltPrompt(schema, jsonSchema),
    v0: generateV0Prompt(schema),
    replit: generateReplitPrompt(schema, smpl),
    vibeCode: generateVibeCodePrompt(schema),
    generic: generateGenericPrompt(schema, jsonSchema),
  };
}

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
${schema.data_models.map((m) => `- ${m.name}: ${m.fields.map((f) => f.name).join(', ')}`).join('\n')}

Implement all features with proper state management, routing, and API integration.`;
}

function generateV0Prompt(schema: AppSchema): string {
  return `You are v0.dev. Convert this schema into beautiful, functional UI components:

App: ${schema.app_name}
Platform: ${schema.platform}
Description: ${schema.description}

Pages to create:
${schema.pages
  .map(
    (p) => `
${p.title}:
  Type: ${p.type}
  Components: ${p.components.join(', ')}
`
  )
  .join('\n')}

Design System:
- Modern, minimal aesthetic
- Consistent spacing and typography
- Proper component hierarchy
- Responsive design
- Accessible UI elements

Generate React components with Tailwind CSS that are ready for production.`;
}

function generateReplitPrompt(schema: AppSchema, smpl: string): string {
  return `You are Replit Agent. Build this application from the following SMPL Format (token-optimized blueprint format):

${smpl}

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
${schema.actions.map((a) => `- ${a.name}: ${a.triggers.join(', ')}`).join('\n')}

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
