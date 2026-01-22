# Quick Start Guide - FunBox Sequential Learning System

## 🚀 Getting Started

### 1. **Install Dependencies** (if not already done)
```powershell
npm install
```

### 2. **Run Database Migrations**
```powershell
npm run db:push
```
This creates all necessary tables:
- `students`
- `modules`
- `meetings`
- `student_progress`
- `quiz_results`

### 3. **Seed the Database**
```powershell
npm run db:seed
```
This populates the database with:
- Sample modules (e.g., "Perkenalan Diri", "Matematika Dasar")
- Sequential meetings (Pertemuan 1, 2, 3, etc.)
- Rich content with videos, activities, and quizzes

### 4. **Start the Development Server**
```powershell
npm run dev
```
The app will be available at: **http://localhost:5000**

---

## 🎮 Testing the Application

### Step 1: Login
1. Open http://localhost:5000
2. Enter any name (e.g., "Budi") and class (e.g., "5A")
3. Click "Masuk" or press hardware Button 1

### Step 2: Dashboard
- View all available modules
- Use hardware **Buttons 1-4** or click to select a module
- Press **Button 6** to go back (stays on dashboard)

### Step 3: Meeting List
- See sequential meetings (Pertemuan 1, 2, 3, etc.)
- **First meeting is unlocked** ✅
- **Other meetings are locked** 🔒
- Use hardware **Buttons 1-4** to select meetings
- Press **Button 6** to go back to Dashboard

### Step 4: Meeting Detail (Video + Activities)
1. **Opening Screen** - Shows meeting title and description
2. **Video Playback** - Watch the educational video
   - Video may auto-mute at specific timestamps
   - Video may pause and show activity popups
3. **Activity Popups** - Answer with hardware Buttons 1-4
4. **Quiz** - 5 questions to test learning
5. **Result Screen** - Shows score, stars, and completion

### Step 5: Completion
- After completing a meeting, you return to the **Meeting List**
- The **next meeting is now unlocked** ✅
- Repeat for all meetings in a module

---

## 🎮 Hardware Button Reference

| Button | Physical Pin | Function |
|--------|--------------|----------|
| **Button 1** | Pin A (Red) | Select option A / Meeting 1 |
| **Button 2** | Pin B (Blue) | Select option B / Meeting 2 |
| **Button 3** | Pin C (Green) | Select option C / Meeting 3 |
| **Button 4** | Pin D (Yellow) | Select option D / Meeting 4 |
| **Button 5** | Pin E (Purple) | Extra/Next/Replay |
| **Button 6** | Pin F (White) | **BACK Navigation** |

### Keyboard Fallback (for testing without hardware):
- **A, B, C, D** or **1, 2, 3, 4** → Select options
- **E** or **5** → Extra button
- **F**, **6**, or **Escape** → Back navigation

---

## 📁 Project Structure

```
server/
  ├── routes.ts          ← API endpoints (NEW: meetings, progress)
  ├── storage.ts         ← Database operations (NEW: meeting logic)
  └── db.ts             ← Database connection

client/src/
  ├── pages/
  │   ├── Dashboard.tsx      ← Module selection
  │   ├── MeetingList.tsx    ← NEW: Meeting selector with locking
  │   ├── MeetingDetail.tsx  ← NEW: Smart video + activities + quiz
  │   └── ModuleDetail.tsx   ← Legacy (still works)
  ├── hooks/
  │   ├── use-meetings.ts           ← NEW: Meeting data hooks
  │   ├── use-global-navigation.ts  ← NEW: Hardware back button
  │   └── use-web-serial.ts         ← Hardware button controller
  └── components/
      └── Layout.tsx           ← Main layout (with global navigation)

shared/
  ├── schema.ts    ← Database schema + TypeScript types
  └── routes.ts    ← API route definitions

script/
  └── seed-funbox.ts  ← Database seeding script
```

---

## 🧪 Testing Scenarios

### Scenario 1: Sequential Unlocking
1. Start with Module "Perkenalan Diri"
2. Only Pertemuan 1 should be unlocked
3. Complete Pertemuan 1 with quiz
4. Return to Meeting List
5. ✅ Verify Pertemuan 2 is now unlocked

### Scenario 2: Hardware Navigation
1. Use Button 1-4 to select meetings
2. Use Button 6 to navigate back
3. Verify back button works from:
   - Meeting Detail → Meeting List
   - Meeting List → Dashboard
   - Dashboard → (stays on Dashboard)

### Scenario 3: Video Interactions
1. Start a meeting with video
2. Watch for auto-mute at specific timestamps
3. Watch for auto-pause with activity popup
4. Answer activity with Buttons 1-4
5. Verify video resumes after activity

### Scenario 4: Quiz and Scoring
1. Complete all 5 quiz questions
2. Get different scores:
   - 5/5 correct = ⭐⭐⭐ (3 stars, 100%)
   - 4/5 correct = ⭐⭐⭐ (3 stars, 80%)
   - 3/5 correct = ⭐⭐ (2 stars, 60%)
   - <3 correct = ⭐ (1 star)
3. Verify meeting is marked complete
4. Verify next meeting unlocks

---

## 🛠️ Troubleshooting

### Issue: No modules showing on Dashboard
**Solution:** Run `npm run db:seed` to populate the database

### Issue: All meetings are locked
**Solution:** The first meeting should always be unlocked. Check:
1. Database has meetings: `SELECT * FROM meetings;`
2. Meeting order is correct: `SELECT id, module_id, title, "order" FROM meetings ORDER BY module_id, "order";`

### Issue: Hardware buttons not working
**Solution:**
1. Click "Connect Hardware" button in the UI
2. Select your serial port (ESP32)
3. Or use keyboard fallback: A/B/C/D or 1/2/3/4

### Issue: Video not playing
**Solution:** 
1. Check internet connection (videos are from YouTube)
2. Ensure video URL is valid in the meeting content
3. Check browser console for errors

### Issue: Meeting not unlocking after completion
**Solution:** 
1. Check that quiz was completed successfully
2. Verify API call to `/api/students/:id/progress` succeeded
3. Check database: `SELECT * FROM student_progress WHERE student_id = 1;`

---

## 🔍 Database Queries (for debugging)

### Check all meetings for a module
```sql
SELECT id, module_id, title, "order" 
FROM meetings 
WHERE module_id = 1 
ORDER BY "order";
```

### Check student progress
```sql
SELECT sp.*, m.title as meeting_title
FROM student_progress sp
JOIN meetings m ON sp.meeting_id = m.id
WHERE sp.student_id = 1;
```

### Check quiz results
```sql
SELECT qr.*, m.title as module_title
FROM quiz_results qr
LEFT JOIN modules m ON qr.module_id = m.id
WHERE qr.student_id = 1
ORDER BY qr.completed_at DESC;
```

### Reset student progress (for testing)
```sql
DELETE FROM student_progress WHERE student_id = 1;
DELETE FROM quiz_results WHERE student_id = 1;
```

---

## 📊 API Testing with cURL

### Get meetings (check locked status)
```powershell
curl "http://localhost:5000/api/modules/1/meetings?studentId=1"
```

### Record progress (unlock next meeting)
```powershell
curl -X POST http://localhost:5000/api/students/1/progress `
  -H "Content-Type: application/json" `
  -d '{"meetingId": 1, "score": 80, "stars": 3}'
```

### Get meeting details
```powershell
curl http://localhost:5000/api/meetings/1
```

---

## ✅ Success Checklist

- [ ] Database migrated (`npm run db:push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Server running (`npm run dev`)
- [ ] Can login as a student
- [ ] Can see modules on Dashboard
- [ ] Can click module → go to Meeting List
- [ ] First meeting is unlocked
- [ ] Other meetings are locked
- [ ] Can start first meeting
- [ ] Video plays correctly
- [ ] Activities popup during video
- [ ] Can answer activities with buttons
- [ ] Quiz works after video
- [ ] Score is recorded
- [ ] Next meeting unlocks after completion
- [ ] Hardware buttons work (or keyboard fallback)
- [ ] Back button navigates correctly

---

## 🎉 You're Ready!

The system is fully implemented and ready to use. Enjoy teaching with FunBox! 🚀
