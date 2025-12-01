/*
  # Add new fields to prompt_memory and create tool_patterns table

  1. Updates to prompt_memory table
    - Add `tool` (text) - Target AI tool (cursor, bolt, v0, replit, claude)
    - Add `input_format` (text) - Original input format detected
    - Add `optimized_prompt` (text) - Optimized prompt version
    - Add `token_count` (integer) - Total token count
    - Add `quality_score` (numeric) - Quality score (0-100)

    Note: Keeping existing fields (json_schema, smpl_dsl, expanded_spec, export_prompts)
    for backward compatibility with existing edge functions

  2. New tool_patterns table
    - `id` (uuid, primary key) - Unique identifier
    - `tool` (text, unique) - Tool name (cursor, bolt, v0, replit, claude)
    - `best_format` (text) - Recommended input format
    - `ordering` (text[]) - Preferred section ordering
    - `prompt_style` (text) - Style guidelines
    - `forbidden` (text[]) - Forbidden patterns
    - `required` (text[]) - Required elements
    - `examples` (jsonb) - Example prompts
    - `updated_at` (timestamptz) - Last update timestamp

  3. Security
    - Enable RLS on tool_patterns table
    - Add public read policy for tool_patterns
    - Add authenticated write policy for tool_patterns

  4. Indexes
    - Add index on prompt_memory.tool
    - Add index on prompt_memory.quality_score
    - Add unique index on tool_patterns.tool
*/

-- Add new columns to prompt_memory
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'tool'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN tool text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'input_format'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN input_format text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'optimized_prompt'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN optimized_prompt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'token_count'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN token_count integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'prompt_memory' AND column_name = 'quality_score'
  ) THEN
    ALTER TABLE prompt_memory ADD COLUMN quality_score numeric(5,2);
  END IF;
END $$;

-- Create tool_patterns table
CREATE TABLE IF NOT EXISTS tool_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text UNIQUE NOT NULL,
  best_format text NOT NULL,
  ordering text[] NOT NULL DEFAULT '{}',
  prompt_style text NOT NULL,
  forbidden text[] NOT NULL DEFAULT '{}',
  required text[] NOT NULL DEFAULT '{}',
  examples jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on tool_patterns
ALTER TABLE tool_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tool_patterns
CREATE POLICY "Allow public read access to tool patterns"
  ON tool_patterns
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert tool patterns"
  ON tool_patterns
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tool patterns"
  ON tool_patterns
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_prompt_memory_tool ON prompt_memory(tool);
CREATE INDEX IF NOT EXISTS idx_prompt_memory_quality_score ON prompt_memory(quality_score DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_patterns_tool ON tool_patterns(tool);

-- Insert default tool patterns
INSERT INTO tool_patterns (tool, best_format, ordering, prompt_style, forbidden, required, examples)
VALUES 
  (
    'cursor',
    'structured',
    ARRAY['context', 'task', 'requirements', 'constraints', 'examples'],
    'Direct and technical. Focus on implementation details and code structure.',
    ARRAY['vague descriptions', 'missing context', 'no file paths'],
    ARRAY['specific file paths', 'clear task', 'type definitions'],
    '[
      {
        "input": "Create a user authentication system",
        "optimized": "In src/auth/: Create UserAuth component with email/password login, JWT token management, and protected route wrapper. Use TypeScript, React Context for state."
      }
    ]'::jsonb
  ),
  (
    'bolt',
    'natural',
    ARRAY['description', 'features', 'tech_stack', 'design'],
    'Conversational and feature-focused. Emphasize user experience and visual design.',
    ARRAY['overly technical jargon', 'missing tech stack', 'no design guidance'],
    ARRAY['feature list', 'tech preferences', 'design direction'],
    '[
      {
        "input": "Make a todo app",
        "optimized": "Build a modern todo application with: task creation/editing, priority levels, due dates, filter/sort options. Use React, Tailwind CSS, and local storage. Clean, minimalist design with smooth animations."
      }
    ]'::jsonb
  ),
  (
    'v0',
    'visual',
    ARRAY['component_type', 'visual_style', 'interactions', 'responsive'],
    'Design-first approach. Focus on UI/UX, component structure, and visual hierarchy.',
    ARRAY['backend logic', 'API details', 'no visual description'],
    ARRAY['component description', 'visual style', 'interaction states'],
    '[
      {
        "input": "Create a dashboard",
        "optimized": "Modern analytics dashboard with: metric cards (gradient backgrounds), line charts, data table. Dark mode, glassmorphism effects, smooth hover states. Responsive grid layout."
      }
    ]'::jsonb
  ),
  (
    'replit',
    'step_by_step',
    ARRAY['goal', 'steps', 'file_structure', 'dependencies'],
    'Sequential and instructional. Break down into clear, actionable steps.',
    ARRAY['single large tasks', 'missing dependencies', 'no file structure'],
    ARRAY['clear goal', 'step breakdown', 'dependency list'],
    '[
      {
        "input": "Build an API",
        "optimized": "Create REST API: 1) Set up Express server, 2) Define routes (GET/POST/PUT/DELETE), 3) Add middleware (CORS, JSON parser), 4) Create controllers, 5) Add error handling. Dependencies: express, cors, dotenv."
      }
    ]'::jsonb
  ),
  (
    'claude',
    'comprehensive',
    ARRAY['objective', 'context', 'requirements', 'constraints', 'success_criteria'],
    'Detailed and thorough. Provide complete context and clear success criteria.',
    ARRAY['ambiguous requirements', 'missing constraints', 'no success criteria'],
    ARRAY['clear objective', 'full context', 'explicit constraints'],
    '[
      {
        "input": "Refactor code",
        "optimized": "Refactor authentication module: Extract JWT logic into utils/, separate validation middleware, add comprehensive error handling, improve type safety. Maintain existing API contract. Success: all tests pass, 0 type errors, improved code coverage."
      }
    ]'::jsonb
  )
ON CONFLICT (tool) DO NOTHING;
