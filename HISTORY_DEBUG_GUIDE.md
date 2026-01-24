# HISTORY PAGE DEBUG GUIDE

## Debug Steps to Follow

### 1. Complete a Quiz
1. Start the development server: `npm run dev`
2. Login as a student
3. Go to a module and complete a quiz
4. Watch the console logs carefully

### 2. Check Frontend Console Logs

When you complete a quiz, you should see:
```
🚀 Submitting Quiz Result Payload: {
  studentId: 1,
  meetingId: 1,
  moduleId: 1,  // <--- CRITICAL: Must be a number, not undefined
  score: 80,
  stars: 2
}

📤 API Request Body: {
  meetingId: 1,
  moduleId: 1,
  score: 80,
  stars: 2
}
```

**🚨 RED FLAG**: If `moduleId` is `undefined` or missing, the bug is in `MeetingDetail.tsx`

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Complete a quiz
3. Look for POST request to `/api/students/1/progress`
4. Check the **Request Payload**:

**EXPECTED:**
```json
{
  "meetingId": 1,
  "moduleId": 1,
  "score": 80,
  "stars": 2
}
```

**🚨 RED FLAG**: If `moduleId` is missing or null in the payload, check `use-meetings.ts`

### 4. Check Backend Console Logs

After submitting the quiz, the server console should show:
```
🔍 Backend received progress data: {
  studentId: 1,
  meetingId: 1,
  moduleId: 1,
  score: 80,
  stars: 2
}

✅ Quiz result saved with moduleId: 1
```

**🚨 RED FLAG**: If you see validation errors or moduleId is null, check `server/routes.ts`

### 5. Navigate to History Page

When you visit `/history`, check the browser console:
```
🎓 Active Student: { id: 1, name: "Test Student", ... }

🔎 Fetching history for student ID: 1
🔍 Storage: Querying history for student 1
📦 Raw quiz results count: 3
📋 Raw results sample: {
  id: 1,
  studentId: 1,
  moduleId: 1,      // <--- CRITICAL: Must NOT be null
  meetingId: 1,
  score: 80,
  stars: 2,
  completedAt: "2026-01-22T..."
}
✅ Joined results count: 3
📊 Found 3 history item(s) for student 1

📊 History API Response: [
  {
    id: 1,
    studentId: 1,
    moduleId: 1,
    meetingId: 1,
    score: 80,
    stars: 2,
    completedAt: "2026-01-22T...",
    moduleTitle: "Module 1: Pengenalan Sains"  // <--- JOIN successful
  }
]

⏳ Loading State: false
❌ Error State: null
📈 Calculated Stats: { count: 3, average: 85, best: 100 }
```

---

## Troubleshooting Guide

### Issue 1: History Shows "Belum ada petualangan"

**Symptoms:**
- The empty state is displayed
- Console shows: `History API Response: []`

**Diagnosis:**
```
Check Backend Logs:
- 📦 Raw quiz results count: 0  → No data in database
- 📦 Raw quiz results count: 3  → Data exists but JOIN failed
  ✅ Joined results count: 0    → moduleId is NULL
```

**Fix:**
1. If raw count is 0: Complete a quiz first
2. If joined count is 0 but raw count > 0: moduleId is NULL
   - Run cleanup script: `npx tsx script/cleanup-null-moduleids.ts`
   - Complete a new quiz
   - Verify moduleId is saved correctly

---

### Issue 2: Network Error / 500 Response

**Symptoms:**
- History page shows error
- Console shows: `❌ Error State: Error: Failed to fetch history`

**Diagnosis:**
Check backend console for errors:
```
❌ Error fetching history: <error details>
```

**Common Causes:**
1. Database connection issue
2. Invalid JOIN query
3. Missing module for a moduleId

**Fix:**
1. Verify DATABASE_URL is set
2. Check if modules table has data: `SELECT * FROM modules LIMIT 5;`
3. Verify quiz_results have valid moduleIds: `SELECT DISTINCT module_id FROM quiz_results;`

---

### Issue 3: moduleId is NULL in Database

**Symptoms:**
- Raw quiz results exist
- Joined results count is 0
- Database shows `module_id: NULL`

**Diagnosis:**
```sql
SELECT id, student_id, module_id, meeting_id, score
FROM quiz_results
ORDER BY id DESC
LIMIT 5;
```

**If module_id is NULL:**

**Root Cause Analysis:**
1. Check if `meeting.moduleId` exists when quiz is completed
2. Add debug log in `MeetingDetail.tsx`:
   ```javascript
   console.log("Meeting object:", meeting);
   console.log("Meeting moduleId:", meeting.moduleId);
   ```

**Fix:**
1. Ensure `meetings` table has valid `module_id` values
2. Verify the meeting fetch query returns `moduleId`
3. If data is corrupted, run:
   ```sql
   -- Update quiz_results with correct moduleId from meetings
   UPDATE quiz_results qr
   SET module_id = m.module_id
   FROM meetings m
   WHERE qr.meeting_id = m.id
   AND qr.module_id IS NULL;
   ```

---

### Issue 4: Data Shows but No Module Title

**Symptoms:**
- History items appear
- Module title is blank or shows "undefined"

**Diagnosis:**
```
History API Response shows moduleTitle: null or undefined
```

**Fix:**
1. Check if modules table has titles:
   ```sql
   SELECT id, title FROM modules;
   ```
2. Verify the JOIN condition in `storage.ts`
3. Ensure moduleId matches existing module IDs

---

## Database Verification Queries

### Check All Quiz Results
```sql
SELECT 
  qr.id,
  qr.student_id,
  qr.module_id,
  qr.meeting_id,
  qr.score,
  qr.completed_at,
  m.title as module_title
FROM quiz_results qr
LEFT JOIN modules m ON qr.module_id = m.id
ORDER BY qr.id DESC
LIMIT 10;
```

### Check for NULL moduleIds
```sql
SELECT COUNT(*) as null_count
FROM quiz_results
WHERE module_id IS NULL;
```

### Check Meeting → Module Relationship
```sql
SELECT 
  mt.id as meeting_id,
  mt.title as meeting_title,
  mt.module_id,
  m.title as module_title
FROM meetings mt
LEFT JOIN modules m ON mt.module_id = m.id
LIMIT 10;
```

---

## Expected Data Flow

1. **Quiz Completion** → `MeetingDetail.tsx`
   - Payload includes `moduleId` from `meeting.moduleId`

2. **API Request** → `POST /api/students/:id/progress`
   - Body includes `{ meetingId, moduleId, score, stars }`

3. **Backend Validation** → `server/routes.ts`
   - Zod validates moduleId is a number
   - Logs received data

4. **Database Insert** → `server/storage.ts`
   - `createQuizResult()` saves with `moduleId`

5. **History Fetch** → `GET /api/students/:id/history`
   - Query joins `quiz_results` with `modules`
   - Returns array with `moduleTitle`

6. **Frontend Display** → `History.tsx`
   - Maps over history array
   - Renders cards with module titles and scores

---

## Success Criteria

✅ Frontend console shows valid payload with moduleId
✅ Network tab shows moduleId in request body
✅ Backend logs confirm moduleId received and saved
✅ Database has non-NULL module_id values
✅ History API returns array with moduleTitle
✅ History page displays quiz result cards
✅ Stats show correct count, average, and best score

---

## Quick Test Script

Run this in your browser console after completing a quiz:

```javascript
// Test the History API directly
fetch('/api/students/1/history')
  .then(r => r.json())
  .then(data => {
    console.log('✅ History Data:', data);
    console.log('📊 Count:', data.length);
    if (data.length > 0) {
      console.log('📋 Sample:', data[0]);
      console.log('🏷️ Has moduleTitle?', !!data[0].moduleTitle);
      console.log('🔢 Has moduleId?', !!data[0].moduleId);
    }
  })
  .catch(err => console.error('❌ Error:', err));
```

---

**Last Updated**: 2026-01-22
**Status**: Debugging enabled, ready for testing
