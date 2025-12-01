export interface AppSchema {
  app_name: string;
  platform: 'web' | 'mobile' | 'desktop';
  description: string;
  pages: Page[];
  data_models: DataModel[];
  actions: Action[];
}

export interface Page {
  id: string;
  type: string;
  components: string[];
  auth_required?: boolean;
}

export interface DataModel {
  name: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  optional?: boolean;
  default?: any;
}

export interface Action {
  name: string;
  trigger: string;
  steps: string[];
}

export function formatJSON(rawText: string): string {
  try {
    const parsed = JSON.parse(rawText);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return rawText;
  }
}

export function validateAppSchema(schema: any): schema is AppSchema {
  return (
    typeof schema === 'object' &&
    typeof schema.app_name === 'string' &&
    typeof schema.platform === 'string' &&
    typeof schema.description === 'string' &&
    Array.isArray(schema.pages) &&
    Array.isArray(schema.data_models) &&
    Array.isArray(schema.actions)
  );
}
