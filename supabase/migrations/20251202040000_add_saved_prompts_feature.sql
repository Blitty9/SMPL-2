/*
  # Add saved prompts feature

  1. Add is_saved column to prompt_memory
    - Boolean field to mark prompts as saved (won't be auto-deleted)
    - Defaults to false

  2. Add index for efficient queries
    - Index on user_id and is_saved for filtering saved prompts
*/

-- Add is_saved column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'is_saved'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN is_saved boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add index for efficient saved prompts queries
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_saved ON prompt_memory(user_id, is_saved) WHERE user_id IS NOT NULL;

-- Add index for efficient history queries (user_id + created_at)
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_created ON prompt_memory(user_id, created_at DESC) WHERE user_id IS NOT NULL;

