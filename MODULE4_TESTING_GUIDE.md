# 🧪 Testing Guide: Module 4, Meeting 1

## Prerequisites
✅ Database seeded successfully (Module 4 ID: 94)
✅ Development server running on http://localhost:5000

---

## 📋 Step-by-Step Testing

### Step 1: Navigate to Module 4
1. Open your browser to `http://localhost:5000`
2. Look for **"Bahasa Indonesia & Literasi"** module card (4th module)
3. Click on the module card
4. You should see **"Huruf"** as Meeting 1
5. Click on **"Huruf"** to start

**Expected Result:** Meeting detail page loads with video player

---

### Step 2: Watch the Video (Optional)
1. Video titled **"Lagu Huruf Alfabet"** should be visible
2. Video URL: https://youtu.be/mEFviLxPegs
3. Click play to watch (optional)
4. Click anywhere outside video to continue

**Expected Result:** Video plays normally, can be skipped

---

### Step 3: Test Alphabet Race Activity - Mode 1 (20 seconds)

#### 3.1 Initial State
- **Timer Display:** Shows `00:20` in large text
- **Alphabet Grid:** All 26 letters displayed in 7 columns
  - Letters A-Z should be visible
  - Each letter in a purple/pink gradient card
  - Letters should animate in with rotation
- **Buttons:** Two buttons visible at bottom
  - "Percobaan 1 (Santai)" - Green
  - "Percobaan 2 (Cepat)" - Green

#### 3.2 Start 20-Second Mode
1. Click **"Percobaan 1 (Santai)"** button
2. **Timer** should start counting down: `00:20` → `00:19` → `00:18`...
3. **Button** changes to orange **"Selesai"** button
4. **Instruction** changes to "Baca semua huruf dengan lantang! 📢"

#### 3.3 Test Success Path
1. **BEFORE timer reaches 00:00**, click **"Selesai"** button
2. **Expected Results:**
   - ✅ Success sound plays (high-pitched ping)
   - ✅ Confetti animation appears
   - ✅ Modal appears with:
     - 🎉 emoji
     - "Hebat Sekali!" heading (green)
     - "Kamu berhasil menyelesaikan alphabet race! 🏆"
     - Green "Lanjutkan" button
3. Click **"Lanjutkan"**
4. Should advance to **Quiz**

#### 3.4 Test Timeout Path (Alternative)
1. Start again by going back
2. Click **"Percobaan 1 (Santai)"**
3. **LET THE TIMER REACH 00:00** (do NOT click "Selesai")
4. **Expected Results:**
   - ⏰ Timeout sound plays (low-pitched buzz)
   - ⏰ Modal appears with:
     - ⏰ emoji
     - "Waktu Habis!" heading (red)
     - "Jangan khawatir, coba lagi dengan lebih cepat! 💪"
     - Blue "Coba Lagi" button
5. Click **"Coba Lagi"**
6. Activity resets to initial state

---

### Step 4: Test Fast Mode (10 seconds)

1. If at initial state, click **"Percobaan 2 (Cepat)"**
2. Timer should start from `00:10` instead of `00:20`
3. Test either success or timeout (same as above)
4. Verify all behaviors work the same, just faster

---

### Step 5: Test Quiz with Per-Question Context

#### 5.1 Initial Quiz Layout
- **Left Card (40% width):**
  - Yellow background (`bg-yellow-50`)
  - "Bacaan" heading with book icon
  - Scrollable text area
- **Right Card (60% width):**
  - White background
  - Progress bar showing "Pertanyaan 1/5"
  - Question text
  - 4 colored answer buttons

#### 5.2 Question 1: Huruf Vokal
**Context Text (Left):**
```
"Dalam alfabet bahasa Indonesia, huruf vokal adalah huruf 
yang melambangkan fonem tanpa hambatan. Huruf-huruf ini 
menjadi inti suku kata."
```

**Question (Right):**
```
Manakah kelompok huruf vokal?
□ A, I, U, E, O          (RED - CORRECT ✓)
□ B, C, D, F, G          (BLUE)
□ K, L, M, N, P          (GREEN)
□ R, S, T, V, W          (YELLOW)
```

**Test:**
1. Click **"A, I, U, E, O"** (correct answer)
2. Giant green checkmark should appear
3. Confetti animation
4. Auto-advance to Question 2

#### 5.3 Question 2: Huruf Konsonan
**Context Text (Left) - CHANGES:**
```
"Huruf konsonan adalah huruf yang bunyinya dihasilkan 
dengan menghambat aliran udara. Terdapat 21 huruf konsonan."
```

**Question (Right):**
```
Dari kata 'BELAJAR', manakah huruf konsonan?
□ E, A, A                (RED)
□ B, L, J, R             (BLUE - CORRECT ✓)
□ A, I, U                (GREEN)
□ E, O, I                (YELLOW)
```

**Test:**
1. **Verify context text CHANGED** (important!)
2. Click **"B, L, J, R"** (correct)
3. Giant green checkmark
4. Auto-advance

#### 5.4 Question 3: Gabungan Konsonan
**Context Text (Left) - CHANGES AGAIN:**
```
"Terdapat gabungan huruf konsonan yang melambangkan satu 
bunyi khusus, seperti kh, ng, ny, dan sy."
```

**Question (Right):**
```
Kata manakah yang mengandung gabungan konsonan?
□ Bola                   (RED)
□ Nyanyi                 (BLUE - CORRECT ✓)
□ Meja                   (GREEN)
□ Roti                   (YELLOW)
```

#### 5.5 Question 4: Diftong
**Context Text (Left):**
```
"Diftong adalah gabungan dua huruf vokal dalam satu embusan 
napas, seperti ai, au, oi, dan ei."
```

**Question (Right):**
```
Kata manakah yang memiliki diftong?
□ Buku                   (RED)
□ Meja                   (BLUE)
□ Pantai                 (GREEN - CORRECT ✓)
□ Rumah                  (YELLOW)
```

#### 5.6 Question 5: Struktur Suku Kata
**Context Text (Left):**
```
"Struktur suku kata sering mengikuti pola K-V (Konsonan-Vokal) 
atau K-V-K (Konsonan-Vokal-Konsonan)."
```

**Question (Right):**
```
Struktur suku kata pertama (KAM) pada kata 'KAMPUS' adalah?
□ Konsonan - Konsonan - Vokal           (RED)
□ Vokal - Konsonan - Konsonan           (BLUE)
□ Konsonan - Vokal - Konsonan           (GREEN - CORRECT ✓)
□ Vokal - Vokal - Konsonan              (YELLOW)
```

---

### Step 6: Complete the Quiz
1. After answering all 5 questions, verify:
   - Final score is displayed (e.g., "4/5")
   - Completion message appears
   - Confetti animation
   - Meeting marked as completed
2. Return to module list
3. Verify "Huruf" meeting shows checkmark or completion indicator

---

## 🐛 Common Issues & Solutions

### Issue 1: Timer doesn't count down
- **Check:** Browser console for errors
- **Fix:** Refresh page, check state management

### Issue 2: Context text doesn't change between questions
- **Check:** Browser console, look for `currentQuestion.context_text`
- **Fix:** Verify seed data has unique `context_text` for each question

### Issue 3: Confetti doesn't show
- **Check:** Browser console for canvas-confetti errors
- **Fix:** Ensure library is installed: `npm install canvas-confetti`

### Issue 4: Activity doesn't advance after "Selesai"
- **Check:** `onComplete()` callback is called
- **Fix:** Check MeetingDetail.tsx activity completion handler

---

## ✅ Success Criteria

All tests pass if:
- ✅ Module 4 loads and displays
- ✅ Video plays without errors
- ✅ Timer counts down correctly in both modes
- ✅ Success modal shows when "Selesai" clicked before timeout
- ✅ Timeout modal shows when timer reaches 00:00
- ✅ Quiz displays with split-view layout
- ✅ Context text is visible and readable on left side
- ✅ Context text **CHANGES** for each question
- ✅ All 5 questions can be answered
- ✅ Correct/incorrect feedback works
- ✅ Meeting completion is recorded

---

## 📸 Visual Checklist

### Alphabet Race Activity
```
┌────────────────────────────────────┐
│          Timer: 00:15              │
│                                    │
│  [A] [B] [C] [D] [E] [F] [G]      │
│  [H] [I] [J] [K] [L] [M] [N]      │
│  [O] [P] [Q] [R] [S] [T] [U]      │
│  [V] [W] [X] [Y] [Z]               │
│                                    │
│        [    Selesai    ]           │
│                                    │
│  Baca semua huruf dengan lantang! │
└────────────────────────────────────┘
```

### Quiz with Context
```
┌──────────────────┬────────────────────┐
│   📖 Bacaan      │  Pertanyaan 1/5    │
│                  │  Skor: 0/0         │
│  Dalam alfabet   │  ──────────────    │
│  bahasa          │                    │
│  Indonesia,      │  Q: Manakah        │
│  huruf vokal...  │  kelompok huruf    │
│  (scrollable)    │  vokal?            │
│                  │                    │
│                  │  [A, I, U, E, O]   │
│                  │  [B, C, D, F, G]   │
│                  │  [K, L, M, N, P]   │
│                  │  [R, S, T, V, W]   │
└──────────────────┴────────────────────┘
```

---

## 🎯 Happy Testing!

If everything works as described above, your implementation is **100% successful**! 🎉
