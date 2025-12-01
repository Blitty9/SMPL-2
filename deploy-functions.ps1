# PowerShell script to deploy updated Supabase Edge Functions
# Run this from the project root directory

Write-Host "Deploying updated Supabase Edge Functions..." -ForegroundColor Cyan

# Deploy app-gen function
Write-Host "`nDeploying app-gen..." -ForegroundColor Yellow
supabase functions deploy app-gen

# Deploy prompt-gen function
Write-Host "`nDeploying prompt-gen..." -ForegroundColor Yellow
supabase functions deploy prompt-gen

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "The updated export prompts are now live." -ForegroundColor Green

