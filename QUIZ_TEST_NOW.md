 # 🧪 Quick Testing Guide - Quiz Save Fix

## ✅ What We Fixed

1. ✅ Database connection (Transaction Pooler)
2. ✅ Missing `raw_points` column
3. ✅ Module IDs reset to 1-4
4. ✅ 16 meetings seeded correctly
5. ✅ Seed script no longer breaks module IDs

## 🚀 Test NOW

### Start Application
```bash
npm run dev
```
Server: http://localhost:5000
Client: http://localhost:5173

### Quick Test (5 minutes)

**1. Login as Student**
- Open: http://localhost:5173
- Use any student credentials

**2. Complete First Quiz**
- Click **Module 1: Pengenalan Uang & Berhitung**
- Start **Pertemuan 1**
- Watch video, answer questions
- Click **Submit**

**3. Check Console (F12)**
Look for:
```
✅ Weighted quiz result saved successfully
```

**4. Check History Page**
- Navigate to **History**
- Should see: Module 1, Pertemuan 1, Score, Stars

**5. Check Admin Dashboard**
- Logout → Login as admin
- Go to **Student Report**
- Select the student
- Should see: Module 1 score displayed

## ❌ If Quiz Still Not Saving

### Check Browser Console
If you see:
```
⚠️ Module X not found in MODULE_CONFIG
```
**Solution:** Module IDs are wrong again. Run:
```bash
npx tsx -r dotenv/config script/reset-module-ids.ts
```

### Check Network Tab
If API request fails:
1. Open DevTools → Network tab
2. Look for `POST /api/quiz-results`
3. Check response error

### Verify Database
```bash
npx tsx -r dotenv/config script/verify-database.ts
```
Should show:
- 4 modules (IDs 1-4)
- 16 meetings

## 📊 Expected Results

### History Page
```
Module: Pengenalan Uang & Berhitung
Meeting: Mengenal Uang Koin dan Kertas
Score: 80% (⭐⭐⭐ 3 stars)
Date: [timestamp]
```

### Student Report (Admin)
```
Module 1: Pengenalan Uang & Berhitung
├─ Pertemuan 1: 80% (⭐⭐⭐)
├─ Pertemuan 2: - (not completed)
├─ Pertemuan 3: - (not completed)
└─ Pertemuan 4: - (not completed)
Average: 80%
```

## 🎯 Success = All Green

- ✅ Quiz submits without errors
- ✅ Console shows "saved successfully"
- ✅ History page shows result
- ✅ Admin report shows score
- ✅ Database has quiz_results row

## 🆘 Still Having Issues?

Run diagnostics:
```bash
# Check connection
npx tsx -r dotenv/config diagnose-database.ts

# Verify data
npx tsx -r dotenv/config script/verify-database.ts
```

Check `.env` file has:
```env
DATABASE_URL=postgresql://postgres.fivmeksmoatmrhmdognr:funbox17jan@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**If all else fails, report:**
1. Browser console errors
2. Network tab response
3. Server terminal output
