# 🔍 How to View Vercel Function Logs (500 Error Debug)

## Current Status
✅ CORS is working on production URL
❌ Getting 500 error on login

**500 error = Server crash/database issue**

---

## Step-by-Step: View Backend Logs

### Method 1: Vercel Dashboard (Easiest)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: Your project `funbox17`
3. **Click**: **Deployments** tab
4. **Find**: Your latest **Production** deployment (green badge)
5. **Click**: On that deployment
6. **Click**: **Functions** tab (in the deployment details)
7. **Click**: `api/index.ts` function
8. **Click**: **Logs** tab
9. **Try logging in** on your site
10. **Refresh** the logs page

**Look for:**
- Red error messages
- Stack traces
- Database connection errors
- "Cannot connect to database"
- "Invalid connection string"

---

### Method 2: Vercel CLI (Real-time)

**Install Vercel CLI:**
```powershell
npm install -g vercel
```

**Login:**
```powershell
vercel login
```

**View real-time logs:**
```powershell
vercel logs --follow
```

Then try logging in and watch the logs appear in real-time!

---

## Common 500 Error Causes

### 1. Database Connection Issue ⚠️ MOST LIKELY

**Symptoms:**
- Login works locally
- 500 error only on Vercel

**Causes:**
- DATABASE_URL not set in Vercel
- DATABASE_URL has wrong format
- Supabase connection mode wrong (should be "Session" mode)

**Fix:**
1. Go to Vercel Settings → Environment Variables
2. Check `DATABASE_URL` exists
3. Value should be: `postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres`
4. Make sure it's set for **Production** environment
5. Redeploy if you just added it

### 2. Missing Environment Variables

**Check you have ALL these:**
```
DATABASE_URL = postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
CLIENT_URL = https://funbox17-mdpa.vercel.app
VITE_API_URL = https://funbox17-mdpa.vercel.app
```

### 3. Import Path Issues

**Symptoms:**
- Error mentions "Cannot find module"
- 500 on specific routes

**Less likely** since health check probably works.

---

## Quick Test: Does Health Check Work?

**Open this URL in browser:**
```
https://funbox17-mdpa.vercel.app/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "FunBox API is running",
  "timestamp": "2026-01-29T..."
}
```

**If health check works but login fails:**
→ Database connection issue!

**If health check also fails:**
→ Backend not starting at all

---

## Debug Steps

### Step 1: Check Health Endpoint
```
https://funbox17-mdpa.vercel.app/api/health
```

### Step 2: Check Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `DATABASE_URL` is set
3. Verify it's enabled for **Production**
4. Copy the value and check for typos

### Step 3: View Function Logs
1. Deployments → Latest Production
2. Functions → api/index.ts → Logs
3. Try login again
4. Look for error messages

### Step 4: Test Database Connection

**Add a test endpoint** (optional debug):

Create `api/test-db.ts`:
```typescript
import { storage } from "../server/storage.js";

export default async function handler(req: any, res: any) {
  try {
    const students = await storage.getAllStudents();
    res.status(200).json({
      success: true,
      studentCount: students.length,
      message: "Database connected!"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Database connection failed"
    });
  }
}
```

Then visit: `https://funbox17-mdpa.vercel.app/api/test-db`

---

## Most Likely Fix

**The issue is probably DATABASE_URL not set correctly.**

### Quick Fix:

1. **Vercel Dashboard → Settings → Environment Variables**
2. **Find `DATABASE_URL`**
3. **Make sure value is:**
   ```
   postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
   ```
4. **Make sure "Production" checkbox is checked** ✅
5. **Redeploy:**
   - Deployments → Latest → ⋮ → Redeploy

**Or via git:**
```powershell
git commit --allow-empty -m "Trigger redeploy to apply DATABASE_URL"
git push origin main
```

---

## What to Share with Me

If still not working, please share:

1. **Health check response**: Visit `/api/health` and paste result
2. **Environment variables screenshot**: (hide password part)
3. **Vercel function logs**: Copy any error messages from Functions → Logs
4. **Exact error**: Full 500 error from browser Network tab (Response section)

---

## Expected Working Flow

### ✅ Correct:
1. Open: `https://funbox17-mdpa.vercel.app`
2. Enter name + class
3. Click login
4. → Dashboard loads

### ❌ Current (500 error):
1. Open: `https://funbox17-mdpa.vercel.app`
2. Enter name + class
3. Click login
4. → 500 error (backend crash)

**Root cause:** Backend can't connect to database because `DATABASE_URL` missing or incorrect.

---

## Quick Checklist

- [ ] DATABASE_URL set in Vercel (Production environment)
- [ ] CLIENT_URL set in Vercel
- [ ] VITE_API_URL set in Vercel
- [ ] No trailing slashes in URLs
- [ ] Using production URL (not preview)
- [ ] Redeployed after adding environment variables
- [ ] Health check works: `/api/health`

**Once DATABASE_URL is correct and redeployed, login will work!** 🎉
