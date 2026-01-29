# 🎯 Vercel Environment Variables - Quick Reference

## Required Environment Variables (2 Total)

### 1️⃣ DATABASE_URL
```bash
postgresql://username:password@host:5432/database?sslmode=require
```
**Where to set:** Vercel Dashboard → Settings → Environment Variables  
**Environments:** ✅ Production, ✅ Preview  
**Source:** Neon.tech / Supabase / Railway.app  

---

### 2️⃣ CLIENT_URL
```bash
https://your-app-name.vercel.app
```
**Where to set:** Vercel Dashboard → Settings → Environment Variables  
**Environments:** ✅ Production, ✅ Preview  
**Note:** Set AFTER first deployment (copy from Vercel domains)

---

## Visual Setup Guide

```
┌─────────────────────────────────────────────────────┐
│  Step 1: Get Database URL                           │
├─────────────────────────────────────────────────────┤
│  1. Sign up at https://neon.tech                    │
│  2. Create new project                              │
│  3. Copy "Pooled Connection" string                 │
│  4. Ensure it ends with ?sslmode=require            │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Step 2: Add to Vercel                              │
├─────────────────────────────────────────────────────┤
│  Vercel Dashboard → Your Project → Settings →       │
│  Environment Variables → Add New                    │
│                                                      │
│  Key: DATABASE_URL                                  │
│  Value: postgresql://...?sslmode=require            │
│  Env: ✅ Production ✅ Preview                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Step 3: Deploy First Time                          │
├─────────────────────────────────────────────────────┤
│  git push origin main                               │
│  (Vercel auto-deploys)                              │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Step 4: Add CLIENT_URL                             │
├─────────────────────────────────────────────────────┤
│  1. Copy your Vercel URL from dashboard             │
│  2. Add new environment variable:                   │
│                                                      │
│  Key: CLIENT_URL                                    │
│  Value: https://your-app.vercel.app                 │
│  Env: ✅ Production ✅ Preview                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Step 5: Redeploy                                   │
├─────────────────────────────────────────────────────┤
│  Deployments → Latest → Redeploy                    │
│  OR                                                  │
│  git commit --allow-empty -m "Update env vars"      │
│  git push                                           │
└─────────────────────────────────────────────────────┘
```

---

## Build Settings (Vercel Dashboard → Settings → General)

| Setting | Value |
|---------|-------|
| Framework Preset | **Other** |
| Build Command | **npm run build** |
| Output Directory | **dist/public** |
| Node.js Version | **20.x** |
| Root Directory | **.** (root) |

---

## Example Values

### DATABASE_URL (Neon):
```
postgresql://funbox_user:abc123xyz@ep-cool-cloud-12345.us-east-1.aws.neon.tech:5432/funbox_db?sslmode=require
```

### CLIENT_URL (After Deploy):
```
https://funbox-learning.vercel.app
```

---

## Test After Deployment

```bash
# 1. Health check
curl https://your-app.vercel.app/api/health
# Expected: {"status":"ok","message":"FunBox API is running","timestamp":"..."}

# 2. Database check
curl https://your-app.vercel.app/api/modules
# Expected: Array of modules from database
```

---

## What NOT to Do

❌ Don't commit `.env` files  
❌ Don't use `localhost` in `DATABASE_URL`  
❌ Don't forget `?sslmode=require` in database URL  
❌ Don't add trailing slash to `CLIENT_URL`  
❌ Don't set `PORT` in Vercel (not needed)  

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Cannot connect to database" | Check `DATABASE_URL` format, ensure `?sslmode=require` |
| "CORS error" | Verify `CLIENT_URL` matches Vercel URL exactly |
| "Module not found" | ✅ Already fixed in `api/_routes.ts` |
| Build fails | Check build logs in Vercel dashboard |

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Signup:** https://neon.tech
- **Environment Variables:** Your Project → Settings → Environment Variables

---

**That's it! Just 2 environment variables needed.** 🎉
