# Module 2 Testing Quick Reference 🧪

## Database IDs (Current Session)
- **Module 1 ID:** 35 (Pengenalan Uang & Berhitung)
- **Module 2 ID:** 36 (Keterampilan Bertahan Hidup) ← **TEST THIS**
- **Module 3 ID:** 37 (Bahasa Inggris Dasar)
- **Module 4 ID:** 38 (Bahasa Indonesia & Literasi)

## Testing Checklist for Meeting 1: Bahaya di Rumah

### ✅ Pre-Test Setup
- [ ] Server running: `npm run dev`
- [ ] Login as student
- [ ] Navigate to Dashboard
- [ ] Locate "Keterampilan Bertahan Hidup" card (Module 2)

### 📹 Video Phase
- [ ] Click "Bahaya di Rumah" meeting
- [ ] Video loads: https://youtu.be/ZhyX7SR7kn0
- [ ] No popup interactions (continuous play)
- [ ] "Lanjut ke Aktivitas" button appears

### 🎮 Activity 1: Kitchen Hazards
**Story:** "Kamu bangun tidur dan ke dapur. Di meja ada PISAU TAJAM, STOP KONTAK terkelupas, dan KOMPOR menyala..."

**Test Sequence:**
- [ ] Press Button 0 (Red - "Memegang ujung pisau") → ❌ Red X, red confetti
- [ ] Press Button 1 (Blue - "Mencolokkan jari") → ❌ Red X, red confetti  
- [ ] Press Button 2 (Green - "Diam dan jangan sentuh") → ✅ Green checkmark, green confetti, advance
- [ ] Press Button 3 (Yellow - "Bermain api") → ❌ Red X, red confetti

**Expected:** Only Button 2 (Green) advances to Activity 2

### 🎮 Activity 2: Slippery Floor
**Story:** "Kamu tersenggol gelas air panas. Lantai jadi basah dan licin..."

**Test Sequence:**
- [ ] Press Button 0 (Red - "Lari kencang") → ❌
- [ ] Press Button 1 (Blue - "Berdiri diam saja") → ❌
- [ ] Press Button 2 (Green - "Berhenti, jalan pelan...") → ✅ Advance to Activity 3
- [ ] Press Button 3 (Yellow - "Melompat-lompat") → ❌

**Expected:** Only Button 2 (Green) advances to Activity 3

### 🎮 Activity 3: Burn Injury
**Story:** "Aduh! Tanganmu kena air panas dan terasa perih..."

**Test Sequence:**
- [ ] Press Button 0 (Red - "Oleskan odol/kecap") → ❌
- [ ] Press Button 1 (Blue - "Basuh dengan air mengalir") → ✅ Advance to Activity 4
- [ ] Press Button 2 (Green - "Menangis di pojokan") → ❌
- [ ] Press Button 3 (Yellow - "Bungkus plastik") → ❌

**Expected:** Only Button 1 (Blue) advances to Activity 4

### 🎮 Activity 4: Medicine Safety
**Story:** "Tanganmu sudah membaik. Lalu kamu melihat obat warna-warni seperti permen..."

**Test Sequence:**
- [ ] Press Button 0 (Red - "Boleh, telan banyak") → ❌
- [ ] Press Button 1 (Blue - "Masukkan mulut lalu buang") → ❌
- [ ] Press Button 2 (Green - "Berikan ke kucing") → ❌
- [ ] Press Button 3 (Yellow - "Tidak boleh, tanya Ibu/Ayah") → ✅ Advance to Quiz

**Expected:** Only Button 3 (Yellow) advances to Quiz

### 📝 Quiz Phase (5 Questions)

#### Q1: Knife on Floor
**Q:** "Ada pisau tajam di lantai. Apa tindakanmu?"
- [ ] A. "Mainkan pisau itu" → ❌
- [ ] B. "Lapor ke orang tua dan jauhi" → ✅
- [ ] C. "Lempar pisau itu" → ❌
- [ ] D. "Simpan di bawah bantal" → ❌

#### Q2: Broken Outlet
**Q:** "Stop kontak kabelnya rusak. Apa tindakanmu?"
- [ ] A. "Colokkan jari ke lubangnya" → ❌
- [ ] B. "Coba perbaiki sendiri" → ❌
- [ ] C. "Jangan disentuh, bilang Ayah" → ✅
- [ ] D. "Siram dengan air" → ❌

#### Q3: Medicine on Table
**Q:** "Ada obat di meja tamu. Itu untuk siapa?"
- [ ] A. "Hanya untuk orang sakit/Dewasa yang tahu" → ✅
- [ ] B. "Untuk semua orang" → ❌
- [ ] C. "Untuk anak-anak" → ❌
- [ ] D. "Untuk hewan peliharaan" → ❌

#### Q4: Slippery Floor
**Q:** "Lantai kamar mandi basah dan licin. Bagaimana cara jalannya?"
- [ ] A. "Lari sekencang-kencangnya" → ❌
- [ ] B. "Jalan pelan-pelan dan hati-hati" → ✅
- [ ] C. "Melompat-lompat" → ❌
- [ ] D. "Merangkak" → ❌

#### Q5: Matches on Floor
**Q:** "Ada korek api jatuh di lantai. Apa tindakanmu?"
- [ ] A. "Main-mainkan korek api itu" → ❌
- [ ] B. "Bakar kertas" → ❌
- [ ] C. "Nyalakan korek api" → ❌
- [ ] D. "Serahkan pada orang tua" → ✅

### 🎉 Result Phase
- [ ] Score displayed correctly (e.g., 100% if 5/5 correct)
- [ ] Stars awarded based on score (≥80% = 3 stars)
- [ ] Closing message displays:
  > "Ingat Pesan Siaga: Benda Tajam & Panas (Jangan sentuh), Lantai Basah (Minta bantuan), Air Panas (Basuh air mengalir), Obat (Tanya Orang Tua)."
- [ ] "Kembali ke Daftar Pertemuan" button works

### 💾 Database Verification
- [ ] Progress saved to `student_progress` table
- [ ] Module ID = 36, Meeting order = 1
- [ ] Score and stars recorded correctly

---

## Hardware Button Reference

### Standard Layout
```
╔════════════════╗
║  🔴 (0)  🔵 (1) ║  Options A & B
║  🟢 (2)  🟡 (3) ║  Options C & D
╚════════════════╝
     🏠 (5)         Home button
```

### Activity-Specific Mappings

**Activity 1 (Kitchen Hazards):**
```
🔴 (0): Memegang ujung pisau ❌
🔵 (1): Mencolokkan jari ❌
🟢 (2): Diam dan jangan sentuh ✅
🟡 (3): Bermain api ❌
```

**Activity 2 (Slippery Floor):**
```
🔴 (0): Lari kencang ❌
🔵 (1): Berdiri diam saja ❌
🟢 (2): Berhenti, jalan pelan... ✅
🟡 (3): Melompat-lompat ❌
```

**Activity 3 (Burn Treatment):**
```
🔴 (0): Oleskan odol/kecap ❌
🔵 (1): Basuh dengan air mengalir ✅
🟢 (2): Menangis di pojokan ❌
🟡 (3): Bungkus plastik ❌
```

**Activity 4 (Medicine Safety):**
```
🔴 (0): Boleh, telan banyak ❌
🔵 (1): Masukkan mulut lalu buang ❌
🟢 (2): Berikan ke kucing ❌
🟡 (3): Tidak boleh, tanya Ibu/Ayah ✅
```

---

## Common Issues & Solutions

### Issue: Meeting not visible in dashboard
**Solution:** 
- Check Module ID = 36 exists
- Verify meeting order = 1
- Check if student is logged in

### Issue: Activities not loading
**Solution:**
- Check console for errors
- Verify content JSON structure
- Check `content.activities` array exists

### Issue: Quiz not starting after Activity 4
**Solution:**
- Verify Activity 4 advances correctly
- Check `currentActivityIndex < activities.length - 1` logic
- Ensure step changes to 'quiz'

### Issue: Closing message not showing
**Solution:**
- Check `content.closingText` exists in seed data
- Verify result step renders correctly

---

## Performance Benchmarks

### Expected Load Times
- **Module list:** < 500ms
- **Meeting content:** < 300ms
- **Video player:** < 2s (depends on YouTube)
- **Activity transition:** < 100ms
- **Quiz question:** < 100ms

### Hardware Response Times
- **Button press → Visual feedback:** < 50ms
- **Validation → Confetti:** < 100ms
- **Feedback display duration:** 1500ms
- **Auto-advance delay:** 1500ms

---

## Test Results Template

```
Date: _______________
Tester: _______________
Student ID: _______________

Module 2 - Meeting 1: Bahaya di Rumah

✅ Video Phase: PASS / FAIL
   Notes: _________________________________

✅ Activity 1: PASS / FAIL
   Correct answer (Green): PASS / FAIL
   Wrong answers show red X: PASS / FAIL
   Notes: _________________________________

✅ Activity 2: PASS / FAIL
   Correct answer (Green): PASS / FAIL
   Wrong answers show red X: PASS / FAIL
   Notes: _________________________________

✅ Activity 3: PASS / FAIL
   Correct answer (Blue): PASS / FAIL
   Wrong answers show red X: PASS / FAIL
   Notes: _________________________________

✅ Activity 4: PASS / FAIL
   Correct answer (Yellow): PASS / FAIL
   Wrong answers show red X: PASS / FAIL
   Notes: _________________________________

✅ Quiz Phase: PASS / FAIL
   All 5 questions loaded: PASS / FAIL
   Correct answers validated: PASS / FAIL
   Notes: _________________________________

✅ Result Phase: PASS / FAIL
   Score calculated correctly: PASS / FAIL
   Closing message displayed: PASS / FAIL
   Progress saved to DB: PASS / FAIL
   Notes: _________________________________

Overall Result: PASS / FAIL
Additional Comments:
_________________________________________
_________________________________________
```

---

**Happy Testing!** 🧪🏠🛡️

