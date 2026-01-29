# 🔧 Fix: Frontend Still Using localhost:5000

## The Problem
Your browser console shows:
```
POST http://localhost:5000/api/students/login net::ERR_CONNECTION_REFUSED
```

This means your **frontend is still using localhost** instead of your Vercel backend URL.

## Root Cause
The frontend code uses `VITE_API_URL` environment variable:
```typescript
// client/src/lib/api-client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

When `VITE_API_URL` is not set in Vercel, it defaults to `localhost:5000` ❌

---

## ✅ Solution: Add VITE_API_URL to Vercel

### Step 1: Get Your Vercel URL
Example: `https://funbox-abc123.vercel.app`

### Step 2: Add Environment Variable in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project name
3. Go to **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Click **Add New** button
6. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-project-name.vercel.app` (your actual Vercel URL)
   - **Environment:** Check all boxes (Production, Preview, Development)
7. Click **Save**

### Step 3: Redeploy

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **⋮** menu (three dots)
4. Click **Redeploy**
5. Confirm the redeploy

**Option B: Via Git Push**
```powershell
git commit --allow-empty -m "Apply VITE_API_URL environment variable"
git push origin main
```

### Step 4: Wait & Test
- Wait 2-3 minutes for deployment to complete
- Open your Vercel URL in browser
- Try logging in
- Check browser console (F12) - should now show requests to your Vercel URL, not localhost!

---

## 📋 Complete Environment Variables Checklist

You should have **BOTH** of these in Vercel:

### ✅ Backend Environment Variables
- ✅ `DATABASE_URL` - Your Supabase connection string
- ✅ `CLIENT_URL` - Your Vercel frontend URL (for CORS)

### ✅ Frontend Environment Variables
- ❌ `VITE_API_URL` - Your Vercel backend URL ← **This is what you're missing!**

---

## 🔍 How to Verify It's Fixed

### Before Fix (Current):
```
POST http://localhost:5000/api/students/login net::ERR_CONNECTION_REFUSED
```

### After Fix (Expected):
```
POST https://your-project.vercel.app/api/students/login 200 OK
```

---

## 💡 Why Two URLs?

**CLIENT_URL** (Backend needs this):
- Used by backend to allow CORS from frontend
- Backend checks: "Is this request from my frontend?"
- Example: `https://funbox-xyz.vercel.app`

**VITE_API_URL** (Frontend needs this):
- Used by frontend to know where to send API requests
- Frontend asks: "Where is my backend?"
- Example: `https://funbox-xyz.vercel.app`

Since your frontend and backend are deployed together on Vercel, **both URLs are the same!**

---

## 🚨 Common Mistake

**Wrong:** Adding CLIENT_URL to the **previous deployment**
- Environment variables apply to **future deployments**, not retroactive

**Correct:** Add CLIENT_URL → Then **redeploy** → Changes take effect

Same applies to VITE_API_URL:
- Add VITE_API_URL → **Redeploy** → Frontend rebuilds with correct URL

---

## ⚡ Quick Fix Commands

```powershell
# Option 1: Empty commit to trigger redeploy
git commit --allow-empty -m "Fix: Add VITE_API_URL for production API calls"
git push origin main

# Option 2: Make small change to force rebuild
echo "# Environment configured" >> README.md
git add README.md
git commit -m "Configure VITE_API_URL"
git push origin main
```

---

## ✅ Final Checklist

- [ ] Copy your Vercel URL from dashboard
- [ ] Add `VITE_API_URL` environment variable in Vercel settings
- [ ] Add `CLIENT_URL` environment variable if not already done
- [ ] Redeploy (via dashboard or git push)
- [ ] Wait 2-3 minutes for deployment
- [ ] Test login on production URL
- [ ] Check browser console - should see Vercel URL, not localhost

**Expected Result:** Login works! 🎉
