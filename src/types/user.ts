export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  ai_builder_preference: string | null;
  last_used_input: string | null;
}

export interface UserProfileUpdate {
  ai_builder_preference?: string | null;
  last_used_input?: string | null;
}

