#!/bin/bash
# Bash script to deploy updated Supabase Edge Functions
# Run this from the project root directory

echo "Deploying updated Supabase Edge Functions..."

# Deploy app-gen function
echo ""
echo "Deploying app-gen..."
supabase functions deploy app-gen

# Deploy prompt-gen function
echo ""
echo "Deploying prompt-gen..."
supabase functions deploy prompt-gen

echo ""
echo "✅ Deployment complete!"
echo "The updated export prompts are now live."

