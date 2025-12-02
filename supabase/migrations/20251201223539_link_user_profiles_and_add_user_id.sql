/*
  # Link user_profiles to auth.users and add user_id to prompt_memory

  1. Ensure user_profiles table structure
    - Link `id` to `auth.users.id` via foreign key
    - Add any missing columns if needed

  2. Add user_id to prompt_memory
    - Add `user_id` (uuid) column referencing user_profiles.id
    - Make it nullable for backward compatibility (existing records won't have user_id)
    - Add index for efficient queries

  3. Set up RLS policies
    - user_profiles: Users can only read/update their own profile
    - prompt_memory: Users can only see their own prompts, but public can still insert (for anonymous users)

  4. Create helper functions
    - Function to automatically create profile on user signup
    - Trigger to call the function

  5. Indexes
    - Add index on prompt_memory.user_id for efficient filtering
*/

-- Ensure user_profiles table exists with proper structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ai_builder_preference text,
  last_used_input text
);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add user_id column to prompt_memory if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index on prompt_memory.user_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_id ON prompt_memory(user_id);

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update prompt_memory RLS policies
-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access" ON prompt_memory;
DROP POLICY IF EXISTS "Allow public insert access" ON prompt_memory;

-- New RLS policies for prompt_memory
-- Users can see their own prompts
CREATE POLICY "Users can view own prompts"
  ON prompt_memory
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own prompts
CREATE POLICY "Users can insert own prompts"
  ON prompt_memory
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Users can update their own prompts
CREATE POLICY "Users can update own prompts"
  ON prompt_memory
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own prompts
CREATE POLICY "Users can delete own prompts"
  ON prompt_memory
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Allow anonymous/public access for backward compatibility (prompts without user_id)
CREATE POLICY "Allow public read access to anonymous prompts"
  ON prompt_memory
  FOR SELECT
  TO public
  USING (user_id IS NULL);

CREATE POLICY "Allow public insert anonymous prompts"
  ON prompt_memory
  FOR INSERT
  TO public
  WITH CHECK (user_id IS NULL);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, ai_builder_preference, last_used_input)
  VALUES (
    NEW.id,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to get or create user profile (useful for frontend)
CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  ai_builder_preference text,
  last_used_input text
) AS $$
BEGIN
  -- Ensure profile exists
  INSERT INTO public.user_profiles (id)
  VALUES (auth.uid())
  ON CONFLICT (id) DO NOTHING;
  
  -- Return profile
  RETURN QUERY
  SELECT 
    up.id,
    up.created_at,
    up.updated_at,
    up.ai_builder_preference,
    up.last_used_input
  FROM public.user_profiles up
  WHERE up.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_memory TO authenticated;
GRANT SELECT, INSERT ON public.prompt_memory TO anon;

