# 🔍 How to Debug Your Vercel Deployment

## 📊 Method 1: View Logs in Vercel Dashboard (EASIEST)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your **funbox** project

2. **Navigate to Deployments**
   - Click the **"Deployments"** tab at the top
   - You'll see a list of all deployments

3. **Click on Latest Deployment**
   - Click on the most recent deployment (at the top)
   - You'll see deployment details

4. **View Different Types of Logs**

   **A. Build Logs (Did the build succeed?)**
   - Click the **"Building"** tab
   - Shows: npm install, npm run build output
   - Look for errors during compilation
   
   **B. Function Logs (Runtime errors)**
   - Click the **"Functions"** tab
   - Click **"View Function Logs"** or **"Runtime Logs"**
   - Shows: console.log, console.error from your API
   - This is where you'll see login errors!

   **C. Live Request Logs**
   - Scroll down to see real-time requests
   - Shows: Each API call, response codes, timing

---

## 🎯 What to Look For

### Login Issues - Check These Logs:

**When you try to login, look for:**

1. **CORS Error:**
   ```
   Access to fetch at 'https://your-app/api/students/login' 
   blocked by CORS policy
   ```
   **Fix:** Add CLIENT_URL (we'll do this next)

2. **Database Connection Error:**
   ```
   Error: connect ECONNREFUSED
   or
   Error: password authentication failed
   ```
   **Fix:** Check DATABASE_URL is correct

3. **Zod Validation Error:**
   ```
   Validation error: [
     { path: 'name', message: 'Required' }
   ]
   ```
   **Fix:** Frontend not sending correct data

---

## 🛠️ Method 2: View Logs via CLI

### Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

### Login to Vercel:
```bash
vercel login
```

### View Real-Time Logs:
```bash
# View logs from your production deployment
vercel logs --follow

# View logs from a specific deployment
vercel logs [deployment-url]
```

### Example Output:
```
[GET] /api/health → 200 OK
[POST] /api/students/login → 500 Error
❌ Error: Database connection failed
```

---

## 🧪 Method 3: Test API Directly (Debug Without Frontend)

### Test API endpoints to isolate the issue:

```bash
# 1. Test health check (should always work)
curl https://your-app.vercel.app/api/health

# 2. Test login directly (replace YOUR-APP-NAME)
curl -X POST https://YOUR-APP-NAME.vercel.app/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","className":"5A"}'

# Expected success response:
{
  "id": 1,
  "name": "Test User",
  "className": "5A",
  "createdAt": "..."
}

# Common error responses:
{
  "message": "CORS error"  // Need CLIENT_URL
}
{
  "message": "Database connection failed"  // DATABASE_URL issue
}
{
  "message": "Invalid input"  // Missing name or className
}
```

---

## 🔍 Method 4: Browser Developer Console (Frontend Errors)

### Check Browser Console:

1. **Open your deployed app:**
   - Go to: `https://your-app.vercel.app`

2. **Open DevTools:**
   - Press `F12` (Windows) or `Cmd+Option+I` (Mac)
   - Click **"Console"** tab

3. **Look for errors:**

   **CORS Error (Most Common):**
   ```
   Access to fetch at '...' from origin '...' 
   has been blocked by CORS policy
   ```
   → **Solution:** Add CLIENT_URL environment variable

   **Network Error:**
   ```
   POST /api/students/login net::ERR_FAILED
   ```
   → **Solution:** Check if API is working (test /api/health)

   **400/500 Errors:**
   ```
   POST /api/students/login 500 (Internal Server Error)
   ```
   → **Solution:** Check Vercel function logs

4. **Check Network Tab:**
   - Click **"Network"** tab
   - Try to login
   - Click on the failed request
   - View **"Response"** to see error message

---

## 🎯 Debugging Your Login Issue - Step by Step

### Step 1: Test Backend Health
```bash
curl https://YOUR-APP-NAME.vercel.app/api/health
```
**Expected:** `{"status":"ok",...}`
**If fails:** Backend not deployed correctly

---

### Step 2: Check Database Connection
```bash
curl https://YOUR-APP-NAME.vercel.app/api/students
```
**Expected:** `[]` or array of students
**If fails:** Check DATABASE_URL in Vercel settings

---

### Step 3: Test Login API Directly
```bash
curl -X POST https://YOUR-APP-NAME.vercel.app/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","className":"5A"}'
```
**Expected:** Student object with ID
**If fails:** Check Vercel function logs for error

---

### Step 4: Check CORS (Browser)
1. Open: `https://YOUR-APP-NAME.vercel.app`
2. Open DevTools (F12) → Console
3. Try to login
4. Look for CORS error

**If CORS error:** Add CLIENT_URL and redeploy (next section)

---

## 🔧 Most Likely Issue: CORS (Need CLIENT_URL)

Your login probably fails because of CORS. Here's how to fix it:

### Step 1: Get Your Vercel URL
- Copy from Vercel dashboard (e.g., `https://funbox-xyz.vercel.app`)

### Step 2: Add CLIENT_URL Environment Variable

1. **Vercel Dashboard → Settings → Environment Variables**
2. Click **"Add New"**
3. Fill in:
   ```
   Key: CLIENT_URL
   Value: https://YOUR-APP-NAME.vercel.app
   Environments: ✅ Production, ✅ Preview
   ```
4. **Save**

### Step 3: Redeploy
```bash
# Option A: Dashboard
Deployments → Latest → ⋮ → Redeploy

# Option B: Git
git commit --allow-empty -m "Trigger redeploy with CLIENT_URL"
git push origin main
```

### Step 4: Test Again
- Wait 2 minutes for redeploy
- Try login again
- Should work! ✅

---

## 📋 Common Log Messages & What They Mean

| Log Message | Meaning | Fix |
|-------------|---------|-----|
| `CORS policy blocked` | Frontend can't talk to backend | Add CLIENT_URL |
| `DATABASE_URL must be set` | Missing database connection | Add DATABASE_URL |
| `password authentication failed` | Wrong database password | Fix DATABASE_URL |
| `Validation error` | Missing/invalid form data | Check frontend form |
| `Module not found` | Missing dependency | Check package.json |
| `Out of memory` | Build too large | Optimize bundle size |

---

## 🚀 Quick Debug Commands (Copy-Paste Ready)

Replace `YOUR-APP-NAME` with your actual Vercel app name:

```bash
# Test health
curl https://YOUR-APP-NAME.vercel.app/api/health

# Test students endpoint
curl https://YOUR-APP-NAME.vercel.app/api/students

# Test login
curl -X POST https://YOUR-APP-NAME.vercel.app/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"name":"TestUser","className":"5A"}'

# Test modules (database)
curl https://YOUR-APP-NAME.vercel.app/api/modules
```

---

## 💡 Pro Tip: Enable Verbose Logging

If you need more detailed logs, you can temporarily add more console.log statements:

In `api/_routes.ts`, add:
```typescript
app.post(api.students.login.path, async (req, res) => {
  console.log("🔍 Login attempt:", req.body); // ADD THIS
  try {
    const input = api.students.login.input.parse(req.body);
    console.log("✅ Validated input:", input); // ADD THIS
    // ... rest of code
  } catch (err) {
    console.error("❌ Login error:", err); // Already there
    // ...
  }
});
```

Then:
1. Push changes
2. Try login
3. Check Vercel function logs
4. You'll see exactly what's happening

---

## 📝 Summary: How to Debug

1. **Vercel Dashboard Logs** → See runtime errors
2. **Browser Console (F12)** → See frontend errors
3. **curl commands** → Test API directly
4. **Add console.log** → Get more details

**Most likely your issue:** Need to add `CLIENT_URL` for CORS! 🎯

---

**Next Step:** Follow the guide below to add CLIENT_URL and complete your deployment!
