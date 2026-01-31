# 🔧 Session Pooler vs Transaction Pooler Fix

## The Issue

You're using **Session Pooler** on Vercel but trying to connect to a non-existent hostname locally.

### Two Connection Types in Supabase:

1. **Session Pooler** (Port 5432)
   - Direct connection mode
   - URL: `db.[project-ref].supabase.co:5432`
   - ⚠️ Your current .env uses this but the hostname is wrong

2. **Transaction Pooler** (Port 6543) 
   - Connection pooling mode (recommended for serverless)
   - URL: `aws-0-[region].pooler.supabase.com:6543`
   - ✅ Better for Vercel/production

---

## Your Current Situation

**Local .env file:**
```
DATABASE_URL=postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
```
❌ This hostname doesn't exist → DNS fails → Nothing saves

**Vercel environment variable:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true
```
✅ This might be working on Vercel (if project exists)

---

## Solution: Get Both Connection Strings from Supabase

### Step 1: Go to Your Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Find your project
3. Go to: **Settings** > **Database**

### Step 2: Get the Correct Connection Strings

You'll see TWO connection string sections:

#### A. **Connection String** (Session Mode)
```
URI format:
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
- Copy the actual project reference (not `fivmeksmoatmrhmdognr`)
- This is what you're using on Vercel

#### B. **Connection Pooling** (Transaction Mode) - RECOMMENDED
```
URI format:
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```
- This is better for serverless environments
- More reliable for Vercel

---

## Fix for Local Development

### Option 1: Use Session Mode (Match Vercel)

Update your `.env` file with the CORRECT session pooler URL:

```bash
# Get this from Supabase Dashboard > Settings > Database > Connection String
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[CORRECT-PROJECT-REF].supabase.co:5432/postgres
```

**Steps:**
1. Go to Supabase Dashboard
2. Copy the **Connection String (Session Mode)**
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. Paste into `.env` file

### Option 2: Use Transaction Mode (Recommended)

Update your `.env` file with transaction pooler URL:

```bash
# Get this from Supabase Dashboard > Settings > Database > Connection Pooling
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Benefits:**
- More reliable
- Better for serverless
- Matches production best practices

---

## Fix for Vercel (if needed)

If you want to update Vercel to use Transaction Pooler:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** > **Environment Variables**
4. Find: `DATABASE_URL`
5. Click: **Edit**
6. Replace with: Transaction Pooler URL (port 6543)
7. Click: **Save**
8. **Redeploy** your app

---

## Quick Fix Commands

### 1. Get Your Current Vercel DATABASE_URL

```powershell
# If you have Vercel CLI installed
vercel env pull .env.vercel
```

Then check `.env.vercel` file to see what Vercel is using

### 2. Update Local .env

Open `d:\project\op_funbox\main2\.env` and update:

**Replace this (BROKEN):**
```bash
DATABASE_URL=postgresql://postgres:funbox17jan@db.fivmeksmoatmrhmdognr.supabase.co:5432/postgres
```

**With this (GET FROM SUPABASE):**
```bash
# Session Mode (Port 5432):
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# OR Transaction Mode (Port 6543) - RECOMMENDED:
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 3. Verify the Fix

```powershell
npx tsx -r dotenv/config diagnose-database.ts
```

Should show:
```
✅ DNS resolution successful!
```

### 4. Test Database

```powershell
npx tsx -r dotenv/config debug-quiz-submission.ts
```

Should show:
```
✅ Found X students
✅ Found X meetings
✅ Successfully inserted test result
```

---

## How to Find Your Project Details

### Method 1: Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Look at your projects list
3. Click on your project
4. The URL will show: `https://supabase.com/dashboard/project/[PROJECT-REF]`
5. Use this `PROJECT-REF` in your connection string

### Method 2: Check Vercel Environment Variables
1. Go to Vercel dashboard
2. Open your project settings
3. Check environment variables
4. Look at `DATABASE_URL` value
5. Copy the working connection string

---

## Common Scenarios

### Scenario 1: Vercel Works, Local Doesn't
**Reason:** Local .env has wrong hostname  
**Fix:** Copy DATABASE_URL from Vercel to local .env

### Scenario 2: Both Don't Work
**Reason:** Supabase project paused or deleted  
**Fix:** 
1. Check Supabase dashboard
2. Resume project if paused
3. Get fresh connection string

### Scenario 3: Different Projects
**Reason:** Local and Vercel using different databases  
**Fix:** Decide which to use, update accordingly

---

## Recommended Setup

For best practices:

### Local Development (.env):
```bash
# Use Transaction Pooler (6543)
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Vercel Production:
```bash
# Use Transaction Pooler (6543) - Same as local
DATABASE_URL=postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Why?**
- ✅ Same connection mode everywhere
- ✅ Better for serverless (Vercel)
- ✅ More reliable
- ✅ Easier to debug

---

## Step-by-Step Fix (Recommended)

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Select Your Project**

3. **Go to Settings > Database**

4. **Copy "Connection Pooling" URL** (Port 6543)
   ```
   postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

5. **Update Local .env**
   ```bash
   DATABASE_URL=<paste-the-url-here>
   ```

6. **Update Vercel Env Vars** (to match)
   - Go to Vercel Dashboard
   - Settings > Environment Variables
   - Update DATABASE_URL
   - Redeploy

7. **Test Locally**
   ```powershell
   npx tsx -r dotenv/config diagnose-database.ts
   npm run dev
   ```

8. **Test Quiz**
   - Login as student
   - Complete quiz
   - Check history page

---

## Troubleshooting

### Still getting ENOTFOUND?
- Verify project exists in Supabase dashboard
- Check if project is paused (Resume it)
- Ensure you copied the FULL connection string
- No extra spaces in .env file

### Connection timeout?
- Check if using correct port (6543 for pooler)
- Verify password is correct
- Try Session Mode (5432) instead

### Data not syncing between local and Vercel?
- Both should point to SAME database
- Check PROJECT-REF matches in both URLs

---

## Quick Check Script

Run this to see what Vercel is using:

```powershell
# Check if Vercel CLI is installed
vercel --version

# If yes, pull environment variables
vercel env pull .env.vercel

# View the file
Get-Content .env.vercel
```

---

## Summary

**Problem:** Local .env has wrong/old hostname  
**Solution:** Get correct connection string from Supabase  
**Best Practice:** Use Transaction Pooler (port 6543) everywhere  
**Next Step:** Update .env with correct DATABASE_URL from Supabase Dashboard

---

**After fixing, your quiz results WILL save and show up in history! 🎉**
