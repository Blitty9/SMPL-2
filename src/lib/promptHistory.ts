import { supabase } from './supabase';
import type { AppSchema } from './utils/schema';

export interface ExportPrompts {
  cursor?: string;
  bolt?: string;
  v0?: string;
  replit?: string;
  vibeCode?: string;
  generic?: string;
  createanything?: string;
  lovable?: string;
  [key: string]: string | undefined;
}

export interface PromptHistoryItem {
  id: string;
  input_text: string;
  input_type: string;
  mode: string;
  json_schema: AppSchema | Record<string, unknown>;
  smpl_dsl: string;
  expanded_spec: string;
  export_prompts: ExportPrompts;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_saved: boolean;
  tool?: string | null;
  input_format?: string | null;
  optimized_prompt?: string | null;
  token_count?: number | null;
  quality_score?: number | null;
}

/**
 * Get user's prompt history (last 50, excluding saved prompts)
 */
export async function getPromptHistory(limit = 50): Promise<PromptHistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('prompt_memory')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_saved', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching prompt history:', error);
    return [];
  }

  return data || [];
}

/**
 * Get user's saved prompts (up to 10)
 */
export async function getSavedPrompts(): Promise<PromptHistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('prompt_memory')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_saved', true)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching saved prompts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a specific prompt by ID
 */
export async function getPromptById(id: string): Promise<PromptHistoryItem | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('prompt_memory')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching prompt:', error);
    return null;
  }

  return data;
}

/**
 * Delete a prompt from history
 */
export async function deletePrompt(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to delete prompts');
  }

  const { error } = await supabase
    .from('prompt_memory')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting prompt:', error);
    return false;
  }

  return true;
}

/**
 * Save a prompt (mark as saved, max 10)
 */
export async function savePrompt(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save prompts');
  }

  // Check current saved count
  const saved = await getSavedPrompts();
  if (saved.length >= 10) {
    throw new Error('You can only save up to 10 prompts. Please unsave one first.');
  }

  const { error } = await supabase
    .from('prompt_memory')
    .update({ is_saved: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error saving prompt:', error);
    return false;
  }

  return true;
}

/**
 * Unsave a prompt
 */
export async function unsavePrompt(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to unsave prompts');
  }

  const { error } = await supabase
    .from('prompt_memory')
    .update({ is_saved: false })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error unsaving prompt:', error);
    return false;
  }

  return true;
}

/**
 * Clear all history (delete all non-saved prompts)
 */
export async function clearAllHistory(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to clear history');
  }

  const { error } = await supabase
    .from('prompt_memory')
    .delete()
    .eq('user_id', user.id)
    .eq('is_saved', false);

  if (error) {
    console.error('Error clearing history:', error);
    return false;
  }

  return true;
}

/**
 * Get history filtered by mode
 */
export async function getPromptHistoryByMode(mode: 'app' | 'prompt', limit = 50): Promise<PromptHistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('prompt_memory')
    .select('*')
    .eq('user_id', user.id)
    .eq('mode', mode)
    .eq('is_saved', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching prompt history:', error);
    return [];
  }

  return data || [];
}

