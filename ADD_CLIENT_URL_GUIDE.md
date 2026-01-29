# 🎯 Add CLIENT_URL to Fix Login - Simple Guide

## ❓ What's Happening Now

**Current Status:**
- ✅ App deployed successfully
- ✅ API is running
- ❌ Can't login (CORS blocking requests)

**Why?** Your frontend and backend can't talk to each other due to CORS policy.

---

## 🔧 The Fix: Add CLIENT_URL (5 Minutes)

### Step 1: Get Your Vercel URL

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project
3. You'll see your URL at the top:
   ```
   Production Domain
   https://funbox-xyz.vercel.app  ← COPY THIS
   ```
4. **Copy this URL** (including `https://`)

---

### Step 2: Add CLIENT_URL Environment Variable

1. **In Vercel Dashboard:**
   - Click **Settings** (top navigation)
   - Click **Environment Variables** (left sidebar)

2. **Click "Add New"**

3. **Fill in the form:**
   ```
   Key:   CLIENT_URL
   Value: https://funbox-xyz.vercel.app  (paste YOUR URL)
   
   Environments:
   ✅ Production
   ✅ Preview
   ⬜ Development (optional)
   ```

4. **Click "Save"**

**Screenshot of what you should see:**
```
┌─────────────────────────────────────────────────┐
│ Add Environment Variable                         │
├─────────────────────────────────────────────────┤
│ Key                                              │
│ CLIENT_URL                                       │
│                                                  │
│ Value                                            │
│ https://funbox-xyz.vercel.app                   │
│                                                  │
│ Apply to:                                        │
│ ✅ Production                                   │
│ ✅ Preview                                      │
│ ⬜ Development                                  │
│                                                  │
│ [Cancel]  [Save]                                │
└─────────────────────────────────────────────────┘
```

---

### Step 3: Redeploy

**Environment variables require a redeploy to take effect!**

**Option A: Dashboard (Easiest)**
1. Go to **"Deployments"** tab
2. Find the latest deployment (top of list)
3. Click three dots **⋮** on the right
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

**Option B: Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy to apply CLIENT_URL"
git push origin main
```

**Wait 2-3 minutes** for redeployment to complete.

---

### Step 4: Test Login

1. **Open your app:**
   ```
   https://your-app.vercel.app
   ```

2. **Try to login:**
   - Enter a name (e.g., "Test User")
   - Enter a class (e.g., "5A")
   - Click "Mulai Belajar" or "Login"

3. **Should work now!** ✅
   - If successful: You'll see the dashboard
   - If still fails: Check logs (guide below)

---

## 🧪 How to Check If It's Working

### Before CLIENT_URL (Current State):
```
Browser Console (F12):
❌ Access to fetch at 'https://...' blocked by CORS policy
```

### After CLIENT_URL (Fixed State):
```
Browser Console (F12):
✅ POST /api/students/login 200 OK
✅ No CORS errors
```

---

## 🔍 How to See Vercel Logs

### Check Runtime Logs:

1. **Vercel Dashboard → Your Project**
2. Click **"Deployments"** tab
3. Click on **latest deployment**
4. Click **"Functions"** tab
5. Click **"View Function Logs"** or **"Runtime Logs"**

**You'll see console output like:**
```
[POST] /api/students/login
🔍 Backend received: { name: "Test", className: "5A" }
✅ Student created: { id: 1, name: "Test", ... }
```

---

## 🔍 Check Browser Console for Frontend Errors

### Open DevTools:
1. Open your app: `https://your-app.vercel.app`
2. Press **F12** (Windows) or **Cmd+Option+I** (Mac)
3. Click **"Console"** tab
4. Try to login
5. Look for errors

**Common Errors & Solutions:**

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `blocked by CORS policy` | No CLIENT_URL | Add CLIENT_URL (above) |
| `Failed to fetch` | API not responding | Check /api/health endpoint |
| `500 Internal Server Error` | Database issue | Check DATABASE_URL |
| `400 Bad Request` | Invalid form data | Check form fields |

---

## 📊 Your Current Environment Variables

After adding CLIENT_URL, you should have:

```
DATABASE_URL = postgresql://postgres.xxx@supabase...
CLIENT_URL = https://your-app.vercel.app
```

**That's it! Only 2 variables needed.** ✅

---

## 🚨 Troubleshooting

### Issue 1: Login still fails after adding CLIENT_URL

**Check:**
1. Did you **redeploy** after adding CLIENT_URL?
2. Is CLIENT_URL **exactly** your Vercel URL?
3. Does CLIENT_URL have `https://` prefix?
4. Does CLIENT_URL have **NO** trailing slash?

**Correct:** `https://funbox-xyz.vercel.app`  
**Wrong:** `funbox-xyz.vercel.app` (missing https)  
**Wrong:** `https://funbox-xyz.vercel.app/` (has trailing slash)  

---

### Issue 2: Database connection error

**Test database directly:**
```bash
curl https://your-app.vercel.app/api/students
```

**Expected:** `[]` or array of students  
**If error:** Check DATABASE_URL in Vercel settings

**Common fixes:**
- Ensure Supabase database is active (not paused)
- Check password in DATABASE_URL is correct
- Verify connection string uses "Session" mode

---

### Issue 3: Still can't see logs

**Try these:**
1. **Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel logs --follow
   ```

2. **Direct API test:**
   ```bash
   # Test login directly (should work even without CLIENT_URL)
   curl -X POST https://your-app.vercel.app/api/students/login \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","className":"5A"}'
   ```

---

## ✅ Success Checklist

After completing steps above:

- [ ] CLIENT_URL added to Vercel settings
- [ ] Redeployed (waited 2-3 minutes)
- [ ] Tested /api/health (returns OK)
- [ ] Tested login on live site
- [ ] No CORS errors in browser console
- [ ] Can access dashboard after login

---

## 🎉 Once It Works

Your app is now:
- ✅ Fully deployed to Vercel
- ✅ Connected to Supabase database
- ✅ CORS configured correctly
- ✅ Login working
- ✅ Publicly accessible

**Share your URL with anyone!** 🌍

```
https://your-app.vercel.app
```

---

## 📝 Quick Command Reference

```bash
# Test health
curl https://YOUR-APP.vercel.app/api/health

# Test login directly (bypasses CORS)
curl -X POST https://YOUR-APP.vercel.app/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","className":"5A"}'

# View real-time logs
vercel logs --follow

# Redeploy via git
git commit --allow-empty -m "Redeploy"
git push origin main
```

---

**Next:** Add CLIENT_URL → Redeploy → Test login → Success! 🚀
