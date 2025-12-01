import { AppSchema } from './formatJSON';

export function formatDSL(schema: AppSchema): string {
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
      const steps = action.steps.join('>');
      lines.push(`    ${action.name}: ${action.trigger} -> ${steps}`);
    });
  }

  lines.push('}');

  return lines.join('\n');
}
