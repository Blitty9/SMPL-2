# SMPL - Project Submission

## Tell us about your project

I built SMPL because I was tired of rewriting the same app descriptions over and over for different AI coding tools. Every time I wanted to try a new tool like Cursor, Bolt, or v0, I'd have to reformat my entire project spec from scratch.

SMPL solves this by taking your app idea (whether it's a messy bullet list, a JSON schema, or just plain English) and turning it into a standardized format that works across all the major AI builders. It's like having a universal translator for app blueprints.

The cool part? It compresses everything into a compact DSL format that saves 60-80% on tokens compared to verbose JSON. So not only do you get consistency across tools, you also save money on API calls.

But honestly, the real value isn't just the token savings - it's the structure. When you describe an app to SMPL, it extracts all the pages, data models, and user actions into a clean schema. Then you can expand that into tool-specific prompts optimized for each platform's strengths. Cursor gets file-based instructions, v0 gets UI-focused prompts, Claude gets comprehensive guides - all from the same source.

I use it daily for my own projects. Instead of copy-pasting and reformatting between tools, I just paste my idea once, generate the schema, and grab the export prompt for whatever tool I'm using that day. It's cut my setup time in half.

The app has two modes: App Mode for full application schemas, and Prompt Mode for optimizing individual tasks. Both generate tool-specific exports, so you're always getting prompts tailored to what you're actually building.

## Additional Links/Resources

**Live Demo:** [Your Vercel URL here]

**GitHub:** https://github.com/Blitty9/SMPL-2

**How it works:**
- Landing page explains the concept
- Product page shows all features
- Editor lets you try it live
- Examples page has starter templates

**Tech Stack:**
- React + TypeScript frontend
- Supabase Edge Functions for AI processing
- OpenAI GPT-4o-mini for schema generation
- Vite for build tooling

**Key Features:**
- Universal input parser (handles natural language, JSON, YAML, code snippets)
- Canonical AppSchema format
- SMPL DSL compression (60-80% token savings)
- Tool-specific export prompts (Cursor, Claude, Bolt, v0, Replit, OpenAI, Anthropic)
- Accurate token counting with tiktoken
- Persistent state (localStorage)
- Privacy and Terms pages

**What makes it different:**
Most prompt tools just compress text. SMPL actually structures your ideas into a parseable schema, then expands that into optimized prompts for each tool. It's the difference between shrinking a document and creating a proper blueprint.

