/*
  # Add Composite Indexes for Better Query Performance

  1. Composite Indexes
    - Add composite index for history queries (user_id + is_saved + created_at)
    - Add composite index for saved prompts queries (user_id + is_saved + created_at)
    - Add composite index for mode-based queries (user_id + mode + created_at)

  2. Benefits
    - Faster history loading
    - Faster saved prompts loading
    - Better performance for filtered queries
*/

-- Composite index for history queries (non-saved prompts, ordered by date)
-- This covers queries like: WHERE user_id = X AND is_saved = false ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_saved_created 
ON prompt_memory(user_id, is_saved, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Composite index for saved prompts queries
-- This covers queries like: WHERE user_id = X AND is_saved = true ORDER BY created_at DESC
-- Note: The above index already covers this, but we can add a partial index for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_saved_true_created 
ON prompt_memory(user_id, created_at DESC) 
WHERE user_id IS NOT NULL AND is_saved = true;

-- Composite index for mode-based queries
-- This covers queries like: WHERE user_id = X AND mode = 'app' ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_mode_created 
ON prompt_memory(user_id, mode, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Index for tool-based queries (if needed in future)
CREATE INDEX IF NOT EXISTS idx_prompt_memory_user_tool_created 
ON prompt_memory(user_id, tool, created_at DESC) 
WHERE user_id IS NOT NULL AND tool IS NOT NULL;

