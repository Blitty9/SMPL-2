/*
  # Create prompt_memory table

  1. New Tables
    - `prompt_memory`
      - `id` (uuid, primary key) - Unique identifier for each generation
      - `input_text` (text) - Original input text from user
      - `input_type` (text) - Detected input type (json, code, jsx, prisma, sql, yaml, text)
      - `mode` (text) - Generation mode (app or prompt)
      - `json_schema` (jsonb) - Generated AppSchema in JSON format
      - `smpl_dsl` (text) - Generated SMPL DSL format
      - `expanded_spec` (text) - Generated expanded specification
      - `export_prompts` (jsonb) - Generated export prompts for different tools
      - `created_at` (timestamptz) - Timestamp of generation
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `prompt_memory` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert access (for demo purposes)

  3. Indexes
    - Add index on created_at for efficient time-based queries
    - Add index on input_type for filtering by type
*/

CREATE TABLE IF NOT EXISTS prompt_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  input_type text NOT NULL,
  mode text NOT NULL DEFAULT 'app',
  json_schema jsonb NOT NULL,
  smpl_dsl text NOT NULL,
  expanded_spec text NOT NULL,
  export_prompts jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prompt_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON prompt_memory
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON prompt_memory
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_prompt_memory_created_at ON prompt_memory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_memory_input_type ON prompt_memory(input_type);
CREATE INDEX IF NOT EXISTS idx_prompt_memory_mode ON prompt_memory(mode);
