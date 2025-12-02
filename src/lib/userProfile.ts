import { supabase } from './supabase';
import { UserProfile, UserProfileUpdate } from '../types/user';

/**
 * Get the current user's profile, creating one if it doesn't exist
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Call the function to ensure profile exists
  const { data, error } = await supabase.rpc('get_user_profile');

  if (error) {
    console.error('Error getting user profile:', error);
    return null;
  }

  return data && data.length > 0 ? data[0] : null;
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: UserProfileUpdate): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to update profile');
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
}

/**
 * Get user's AI builder preference
 */
export async function getAIBuilderPreference(): Promise<string | null> {
  const profile = await getUserProfile();
  return profile?.ai_builder_preference || null;
}

/**
 * Set user's AI builder preference
 */
export async function setAIBuilderPreference(preference: string): Promise<void> {
  await updateUserProfile({ ai_builder_preference: preference });
}

/**
 * Get user's last used input
 */
export async function getLastUsedInput(): Promise<string | null> {
  const profile = await getUserProfile();
  return profile?.last_used_input || null;
}

/**
 * Set user's last used input
 */
export async function setLastUsedInput(input: string): Promise<void> {
  await updateUserProfile({ last_used_input: input });
}

