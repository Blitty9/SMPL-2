export type InputType = 'json' | 'code' | 'jsx' | 'prisma' | 'sql' | 'yaml' | 'text';

export function detectInputType(text: string): InputType {
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

export function getInputTypeLabel(type: InputType): string {
  const labels: Record<InputType, string> = {
    json: 'JSON',
    code: 'TypeScript/JavaScript',
    jsx: 'React Component',
    prisma: 'Prisma Schema',
    sql: 'SQL',
    yaml: 'YAML',
    text: 'Natural Language',
  };
  return labels[type];
}
