# Deployment Guide: AI Spend Audit Tool

## Step 1: Create GitHub Repository (Manual)

1. Go to https://github.com/new
2. Name it: **ai-spend-audit** (or your preferred name)
3. Description: "Free AI tool spend analysis for startups"
4. Choose: **Public** (so Credex can see it)
5. Click "Create repository"
6. Copy your repo URL (e.g., `https://github.com/YOUR-USERNAME/ai-spend-audit.git`)

## Step 2: Push Code to GitHub

```bash
# Add the GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/ai-spend-audit.git

# Push your code
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub repo URL
4. Click "Continue"
5. Configure environment variables (see below)
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### Environment Variables to Configure in Vercel Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
ANTHROPIC_API_KEY=your-anthropic-api-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-key
```

**Note:** If you don't have these keys yet, you can skip them for now and add them later. The app will gracefully degrade (forms will still work, email won't send).

## Step 4: Verify Deployment

1. Wait for Vercel to build (should take ~2-3 minutes)
2. Your live URL will appear (usually `https://ai-spend-audit.vercel.app`)
3. Test the app works at that URL
4. Run Lighthouse audit:
   - Open your deployment URL
   - Right-click → Inspect → Lighthouse tab
   - Click "Analyze page load"
   - Verify scores: Performance ≥85, Accessibility ≥90, Best Practices ≥90

## What Gets Deployed

- ✅ All React components
- ✅ API routes
- ✅ TypeScript compilation
- ✅ Tailwind CSS styles
- ⚠️ Supabase integration (needs keys)
- ⚠️ Email sending (needs keys)
- ⚠️ Claude API (needs key)

## Share with Credex

Once deployed, share this URL:
```
https://your-deployment.vercel.app
```

Add to README:
```markdown
## Live Demo
[AI Spend Audit Tool](https://your-deployment.vercel.app) - Try it out!
```

## Troubleshooting

**Build fails**: Check that all environment variables are set in Vercel dashboard
**Form doesn't submit**: Needs API keys set (Supabase, Resend, Anthropic)
**Styles look broken**: Vercel should auto-handle Tailwind (should just work)
**Lighthouse scores low**: Check Performance tab in Vercel Analytics
