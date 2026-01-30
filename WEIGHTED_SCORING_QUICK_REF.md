# Weighted Scoring System - Quick Reference 🎯

## Overview
The scoring system now uses **weighted calculations** based on curriculum standards instead of simple percentages.

---

## 📊 Scoring Formula

### Meeting Score
```
Score = (Raw Points Earned / Max Points for Meeting) × 100
```

### Module Final Grade
```
Final Grade = Average of 4 Meeting Scores
```

---

## 🎓 KKM Standards

| Type | KKM | Purpose |
|------|-----|---------|
| **Meeting** | 75 | Individual lesson passing grade |
| **Module** | 80 | Overall module completion |

---

## 📋 Module Configuration

| Module | Description | Total | M1 | M2 | M3 | M4 |
|--------|-------------|-------|----|----|----|----|
| **1** | Pengenalan Uang & Berhitung | 25 | 5 | 5 | 5 | 10 |
| **2** | Keterampilan Bertahan Hidup | 24 | 4 | 5 | 5 | 10 |
| **3** | Kesehatan & Kebersihan | 20 | 5 | 5 | 5 | 5 |
| **4** | Bahasa Indonesia & Literasi | 30 | 5 | 5 | 10 | 10 |

---

## 💡 Examples

### Example 1: Module 1, Meeting 1
- **Max Points:** 5
- **Quiz Questions:** 5
- **Student Gets:** 4 correct
- **Calculation:** (4/5) × 100 = **80%** ✓
- **Status:** Passed (≥75)

### Example 2: Module 2, Meeting 1
- **Max Points:** 4
- **Quiz Questions:** 5 
- **Student Gets:** 3 correct
- **Calculation:** (3/4) × 100 = **75%** ✓
- **Status:** Passed (exactly KKM)

### Example 3: Module Final Grade
- **Meeting 1:** 80%
- **Meeting 2:** 85%
- **Meeting 3:** 75%
- **Meeting 4:** 90%
- **Calculation:** (80+85+75+90)/4 = **82.5%** ✓
- **Status:** Module Completed (≥80)

---

## 🚦 Status Indicators

### Meeting Level
- **Green ✓** - Score ≥ 75 (Passed)
- **Red ⚠** - Score < 75 (Remedial needed)

### Module Level
- **Green Box** - Average ≥ 80 (Completed)
- **Red Warning** - Average < 80 (Needs repetition)

---

## 🔧 Quick Setup

### 1. Run Migration
```bash
npx tsx -r dotenv/config script/migrate-add-raw-points.ts
```

### 2. Test Quiz
1. Login as a student
2. Complete a meeting quiz
3. Check console for weighted score calculation
4. Verify in Student Report

### 3. Verify Database
```sql
SELECT raw_points, score, stars 
FROM quiz_results 
ORDER BY completed_at DESC 
LIMIT 5;
```

---

## 📁 Key Files

- **Config:** `shared/module-config.ts`
- **Frontend:** `client/src/pages/MeetingDetail.tsx`
- **Backend:** `server/routes.ts`, `server/storage.ts`
- **Report:** `client/src/pages/StudentReport.tsx`
- **Migration:** `script/migrate-add-raw-points.ts`

---

## 🐛 Debugging

### Check Browser Console
Look for:
```
📊 Quiz Complete - Weighted Scoring: {
  moduleId: 1,
  meetingOrder: 1,
  rawPoints: 4,
  totalQuestions: 5,
  calculatedScore: 80
}
```

### Check Server Logs
Look for:
```
✅ Weighted quiz result saved: {
  moduleId: 1,
  meetingOrder: 1,
  rawPoints: 4,
  calculatedScore: 80
}
```

---

## ✅ Success Indicators

- [ ] Migration completed without errors
- [ ] Quiz completion logs show weighted scores
- [ ] Student Report displays KKM values (75, 80)
- [ ] Scores are color-coded correctly
- [ ] Module warnings show when average < 80
- [ ] Database has `raw_points` column

---

**Status:** Ready for Production ✅  
**Last Updated:** January 30, 2026
