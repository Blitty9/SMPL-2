export interface AppSchema {
  app_name: string;
  platform: 'web' | 'mobile' | 'fullstack';
  description: string;
  pages: Page[];
  data_models: DataModel[];
  actions: Action[];
}

export interface Page {
  id: string;
  type: string;
  title: string;
  components: string[];
}

export interface DataModel {
  name: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
}

export interface Action {
  name: string;
  triggers: string[];
  steps: string[];
}

export function createEmptySchema(): AppSchema {
  return {
    app_name: 'untitled',
    platform: 'web',
    description: '',
    pages: [],
    data_models: [],
    actions: [],
  };
}

export function validateAppSchema(data: any): data is AppSchema {
  if (!data || typeof data !== 'object') return false;

  const hasRequiredFields =
    typeof data.app_name === 'string' &&
    typeof data.platform === 'string' &&
    typeof data.description === 'string' &&
    Array.isArray(data.pages) &&
    Array.isArray(data.data_models) &&
    Array.isArray(data.actions);

  if (!hasRequiredFields) return false;

  const validPlatform = ['web', 'mobile', 'fullstack'].includes(data.platform);
  if (!validPlatform) return false;

  return true;
}

export function safeParseSchema(json: string): AppSchema | null {
  try {
    const parsed = JSON.parse(json);
    if (validateAppSchema(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
