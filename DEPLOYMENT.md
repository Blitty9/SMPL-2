# Vercel Deployment Guide

## Prerequisites
- GitHub repository connected to Vercel
- Supabase project with Edge Functions deployed

## Environment Variables Required

You need to set these in Vercel Dashboard → Settings → Environment Variables:

1. **VITE_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://[project-ref].supabase.co`
   - Example: `https://pldnycevrlbsqclugwms.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Found in: Supabase Dashboard → Settings → API → anon/public key

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `Blitty9/SMPL-2`
4. Vercel will auto-detect it's a Vite project
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

## Post-Deployment

After deployment, your app will be live at: `https://your-project.vercel.app`

Make sure your Supabase Edge Functions are deployed and accessible from the public URL.

