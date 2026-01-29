# 🎯 Deployment Commands Reference

## Before You Start
```bash
# Make sure you're on main branch
git branch

# Make sure everything is committed
git status

# If you see changes, commit them:
git add .
git commit -m "Ready for deployment"
```

---

## Push to GitHub
```bash
git push origin main
```

---

## After First Vercel Deployment (to trigger redeploy)
```bash
# Option 1: Empty commit (cleanest)
git commit --allow-empty -m "chore: Apply CLIENT_URL environment variable"
git push origin main

# Option 2: Update README or add comment
echo "# Last deployed: $(date)" >> README.md
git add README.md
git commit -m "docs: Update deployment timestamp"
git push origin main
```

---

## Test Your Deployed API (Windows PowerShell)
```powershell
# Replace YOUR-APP-NAME with your actual Vercel app name

# Test 1: Health check
curl https://YOUR-APP-NAME.vercel.app/api/health

# Test 2: Get modules (tests database connection)
curl https://YOUR-APP-NAME.vercel.app/api/modules

# Test 3: Get students (admin endpoint)
curl https://YOUR-APP-NAME.vercel.app/api/students
```

---

## If You Need to Check Environment Variables Locally
```bash
# Pull env vars from Vercel to local .env file
npx vercel env pull

# This creates .env.local with your Vercel environment variables
# Useful for local testing with production database
```

---

## Database Commands (If Needed)

### Seed Database (if using Supabase)
```bash
# Option 1: Use Supabase SQL Editor
# 1. Go to https://supabase.com
# 2. Your Project → SQL Editor
# 3. Paste your seed SQL
# 4. Run

# Option 2: Run seed script locally (if connected to Supabase)
npm run db:seed
```

### Check Database Connection String
```bash
# Print your DATABASE_URL (don't share this!)
echo $env:DATABASE_URL
```

---

## Vercel CLI Commands (Advanced - Optional)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy from Terminal
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### View Logs
```bash
# View deployment logs
vercel logs YOUR-APP-NAME
```

### List Environment Variables
```bash
vercel env ls
```

### Add Environment Variable via CLI
```bash
# Add DATABASE_URL
vercel env add DATABASE_URL production

# Add CLIENT_URL  
vercel env add CLIENT_URL production
```

---

## Quick Test Script

Create a file `test-deployment.ps1`:
```powershell
# test-deployment.ps1
$APP_URL = "https://YOUR-APP-NAME.vercel.app"

Write-Host "Testing deployment at $APP_URL" -ForegroundColor Green

Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
curl "$APP_URL/api/health"

Write-Host "`n`n2. Testing Modules Endpoint..." -ForegroundColor Yellow
curl "$APP_URL/api/modules"

Write-Host "`n`n3. Testing Students Endpoint..." -ForegroundColor Yellow
curl "$APP_URL/api/students"

Write-Host "`n`nDone!" -ForegroundColor Green
```

Run it:
```powershell
.\test-deployment.ps1
```

---

## Common Git Commands You Might Need

```bash
# See commit history
git log --oneline -10

# See what changed in last commit
git show

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Check remote URL
git remote -v

# Force push (if needed - be careful!)
git push origin main --force
```

---

## Troubleshooting Commands

### Check if code builds locally
```bash
npm run build

# If this fails, fix errors before deploying
```

### Check TypeScript errors
```bash
npx tsc --noEmit
```

### Clear npm cache (if weird errors)
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────┐
│ MOST USED COMMANDS FOR DEPLOYMENT                 │
├────────────────────────────────────────────────────┤
│                                                     │
│ Deploy:                                            │
│   git add .                                        │
│   git commit -m "your message"                    │
│   git push origin main                            │
│                                                     │
│ Test:                                              │
│   curl https://your-app.vercel.app/api/health    │
│                                                     │
│ Redeploy (after adding CLIENT_URL):               │
│   git commit --allow-empty -m "Redeploy"          │
│   git push origin main                            │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

**That's all you need! Simple as 1-2-3.** 🚀
