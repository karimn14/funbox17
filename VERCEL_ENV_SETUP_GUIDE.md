# Vercel Environment Variables & Settings - Quick Guide 🚀

## 🔑 Required Environment Variables

### Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# 1. DATABASE_URL (PostgreSQL Connection String)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# 2. CLIENT_URL (Your Frontend URL)
CLIENT_URL=https://your-app-name.vercel.app
```

---

## 📋 Step-by-Step Setup

### Step 1: Database Setup (Choose One)

#### ⭐ Option A: Neon.tech (Recommended)
1. Go to https://neon.tech
2. Sign up (free tier available)
3. Create new project
4. Copy **Pooled Connection** string from dashboard
5. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech:5432/dbname?sslmode=require`

#### Option B: Supabase
1. Go to https://supabase.com
2. Create project
3. Go to Project Settings → Database
4. Copy **Connection string** (URI format)
5. Change connection mode to **Session**

#### Option C: Railway.app
1. Go to https://railway.app
2. New Project → Add PostgreSQL
3. Copy `DATABASE_URL` from Variables tab

---

### Step 2: Set Environment Variables in Vercel

1. **Open Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings:**
   - Click **Settings** (top navigation)
   - Click **Environment Variables** (left sidebar)

3. **Add DATABASE_URL:**
   - Click **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** Paste your PostgreSQL connection string
   - **Environments:** ✅ Production, ✅ Preview
   - Click **Save**

4. **Add CLIENT_URL:**
   - Click **Add New** again
   - **Key:** `CLIENT_URL`
   - **Value:** `https://your-app-name.vercel.app` (use your actual Vercel URL)
   - **Environments:** ✅ Production, ✅ Preview
   - Click **Save**

---

### Step 3: Vercel Build Settings

**Go to: Settings → General**

| Setting | Recommended Value |
|---------|-------------------|
| **Framework Preset** | `Other` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/public` |
| **Install Command** | `npm install` |
| **Node.js Version** | `20.x` |
| **Root Directory** | `.` (leave as root) |

---

## ⚙️ Important Settings to Check

### 1. **Functions Configuration** (vercel.json)
Your `vercel.json` should include:
```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "includeFiles": "{server,shared}/**"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```
✅ Already configured in your project

---

### 2. **Git Integration**
- Ensure your GitHub repository is connected to Vercel
- Auto-deploy on push: **Settings → Git → Production Branch** = `main`

---

### 3. **Domain Settings**
After first deployment:
1. Copy your Vercel-assigned URL (e.g., `funbox-xyz123.vercel.app`)
2. Update `CLIENT_URL` environment variable with this exact URL
3. Redeploy to apply changes

---

## 🔍 How to Find Your CLIENT_URL

**After deploying to Vercel:**

1. Go to your Vercel project dashboard
2. Look at the **Domains** section
3. Copy the production domain (e.g., `https://funbox-learning.vercel.app`)
4. This is your `CLIENT_URL`

**⚠️ Important:**
- Must include `https://`
- Must NOT have trailing slash
- Must be the exact production URL

---

## 🧪 Testing Your Setup

### After deployment, test these endpoints:

```bash
# 1. Health Check (should return JSON with status "ok")
curl https://your-app.vercel.app/api/health

# 2. Modules API (should return array of modules)
curl https://your-app.vercel.app/api/modules

# 3. Database Connection Test
# If above returns data, your database is working!
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot connect to database"
**Fix:**
- Check `DATABASE_URL` format includes `?sslmode=require`
- Verify database allows connections from anywhere (0.0.0.0/0)
- Test connection string locally first

### Issue: "CORS Error"
**Fix:**
- Verify `CLIENT_URL` matches your Vercel domain exactly
- No trailing slash in `CLIENT_URL`
- Redeploy after changing environment variables

### Issue: "Module not found" errors
**Fix:**
- ✅ Already fixed in `api/_routes.ts`
- Ensure `vercel.json` includes `{server,shared}/**`

---

## 📝 Quick Copy-Paste Templates

### For Neon Database:
```bash
# DATABASE_URL format:
postgresql://username:password@ep-xxxxx.region.aws.neon.tech:5432/dbname?sslmode=require

# Example (replace with your values):
DATABASE_URL=postgresql://funbox_user:secure_pass_123@ep-cool-cloud-12345.us-east-1.aws.neon.tech:5432/funbox_db?sslmode=require
```

### For CLIENT_URL:
```bash
# Production (after first deploy):
CLIENT_URL=https://funbox-learning.vercel.app

# During development/testing:
CLIENT_URL=https://funbox-learning-git-dev-username.vercel.app
```

---

## 🔐 Security Reminders

- ❌ **NEVER** commit `.env` files to Git
- ✅ Always use environment variables in Vercel dashboard
- ✅ Use different databases for production/preview environments
- ✅ Rotate database passwords periodically

---

## 📞 Where to Get Help

- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
- **Neon Docs:** https://neon.tech/docs/get-started-with-neon/signing-up
- **Project Issues:** Check Vercel deployment logs for detailed errors

---

## ✅ Final Checklist Before Deploy

- [ ] Database created (Neon/Supabase/Railway)
- [ ] `DATABASE_URL` added to Vercel environment variables
- [ ] `CLIENT_URL` will be added after first deploy
- [ ] Build settings configured (framework: Other, build: `npm run build`)
- [ ] `vercel.json` has correct function configuration
- [ ] `.env` is in `.gitignore`
- [ ] Code pushed to GitHub main branch

**After first deploy:**
- [ ] Copy Vercel URL and set as `CLIENT_URL`
- [ ] Redeploy to apply `CLIENT_URL` change
- [ ] Test `/api/health` endpoint
- [ ] Test full application flow

---

**Status:** ✅ Ready for deployment  
**Created:** 2026-01-29
