import type { AppSchema } from '../utils/schema';

export function formatExpanded(schema: AppSchema): string {
  const sections: string[] = [];

  sections.push(`# ${schema.app_name} - Application Specification\n`);

  sections.push(`## Overview`);
  sections.push(`**Platform:** ${schema.platform}`);
  sections.push(`**Description:** ${schema.description}\n`);

  if (schema.pages.length > 0) {
    sections.push(`## Pages & Routes\n`);
    schema.pages.forEach((page, idx) => {
      sections.push(`### ${idx + 1}. ${page.id} (${page.type})`);
      sections.push(`**Components:**`);
      page.components.forEach((comp) => {
        sections.push(`- ${comp}`);
      });
      sections.push('');
    });
  }

  if (schema.data_models.length > 0) {
    sections.push(`## Data Models\n`);
    schema.data_models.forEach((model) => {
      sections.push(`### ${model.name}`);
      sections.push('```');
      model.fields.forEach((field) => {
        const required = field.required ? '' : '?';
        sections.push(`${field.name}${required}: ${field.type}`);
      });
      sections.push('```\n');
    });
  }

  if (schema.actions.length > 0) {
    sections.push(`## Actions & Workflows\n`);
    schema.actions.forEach((action, idx) => {
      sections.push(`### ${idx + 1}. ${action.name}`);
      sections.push(`**Triggers:** ${action.triggers.join(', ')}`);
      sections.push(`**Flow:**`);
      action.steps.forEach((step, stepIdx) => {
        sections.push(`${stepIdx + 1}. ${step}`);
      });
      sections.push('');
    });
  }

  sections.push(`## Technical Architecture\n`);
  sections.push(`### Frontend`);
  sections.push(`- React with TypeScript for type safety`);
  sections.push(`- Component-based architecture`);
  sections.push(`- Responsive design patterns\n`);

  sections.push(`### Backend`);
  sections.push(`- Supabase for database and authentication`);
  sections.push(`- Edge Functions for serverless logic`);
  sections.push(`- Row Level Security for data protection\n`);

  sections.push(`### Database`);
  sections.push(`- PostgreSQL via Supabase`);
  sections.push(`- Automatic migrations`);
  sections.push(`- Real-time subscriptions support`);

  return sections.join('\n');
}
