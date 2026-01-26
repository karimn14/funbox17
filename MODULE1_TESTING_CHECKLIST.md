# Module 1, Meeting 1 - Testing Checklist ✅

## 🧪 Quick Test Guide

Use this checklist to verify all three enhancements work correctly.

---

## 🎯 Test Setup

1. **Start the application:**
   ```powershell
   npm run dev
   ```

2. **Navigate to Module 1, Meeting 1:**
   - URL: `http://localhost:5000/module/136/meeting/1`
   - Or: Home → Module 1 → Meeting 1

3. **Ensure database is seeded:**
   ```powershell
   npm run db:seed
   ```

---

## ✅ Test 1: Number Input Popups (Video 2)

### **Preparation:**
- Click "Mulai Video" to start Video 1
- Watch until Video 1 ends (or skip to Video 2)
- Video 2 should auto-play

### **Test Cases:**

| Time  | Expected Behavior | ✓ |
|-------|-------------------|---|
| 1:25  | Video auto-mutes (no popup) | ☐ |
| 1:31  | Video pauses, bottom overlay: "Tulis jumlah uangnya: [___] OK" | ☐ |
| -     | Input auto-focuses (cursor visible) | ☐ |
| -     | Type "100" + Enter → ✅ Sound, video resumes after 800ms | ☐ |
| 1:35  | Video pauses again, input focused | ☐ |
| -     | Type "999" + Enter → ❌ Sound, input shakes, clears | ☐ |
| -     | Type "200" + Enter → ✅ Sound, video resumes | ☐ |
| 1:38  | Type "500" → Correct | ☐ |
| 1:43  | Type "1000" → Correct | ☐ |
| 1:47  | Type "2000" → Correct | ☐ |
| 1:52  | Type "5000" → Correct | ☐ |
| 1:55  | Type "10000" → Correct | ☐ |
| 1:58  | Type "20000" → Correct | ☐ |
| 2:02  | Type "50000" → Correct | ☐ |
| 2:05  | Image quiz appears (see Test 2) | ☐ |

### **Input Normalization Tests:**
At any number input prompt:
- Type "20000" → Should be accepted ☐
- Type "20.000" → Should be accepted ☐
- Type "20,000" → Should be accepted ☐
- Type "abc" → Should not appear in input (client-side filter) ☐

### **Mobile Tests (Optional):**
- Open on mobile device
- Numeric keyboard should appear automatically ☐
- Typing should feel responsive ☐

---

## ✅ Test 2: Image Quiz (Video 2)

### **Test Cases:**

| Action | Expected Behavior | ✓ |
|--------|-------------------|---|
| Video reaches 2:05 | Video pauses, center modal appears | ☐ |
| Modal content | "Mana yang uang **koin**?" | ☐ |
| - | Two images: Coin (left) and Paper (right) | ☐ |
| Hover over Coin | Border turns blue, image scales up | ☐ |
| Click Paper (wrong) | ❌ Sound, no video resume | ☐ |
| Click Coin (correct) | ✅ Sound, modal closes, video resumes | ☐ |

---

## ✅ Test 3: Image Grid Quiz (Quiz Section)

### **Preparation:**
- Complete both videos (or skip through them)
- Quiz section should appear automatically

### **Test Cases:**

| Question | Expected Layout | ✓ |
|----------|----------------|---|
| Question 1 | Vertical list (text options) | ☐ |
| Question 2 | Vertical list (text options) | ☐ |
| **Question 3** | **2×2 image grid (4 coin images)** | ☐ |
| Question 4 | Vertical list (text options) | ☐ |

### **Question 3 Specific Tests:**

| Action | Expected Behavior | ✓ |
|--------|-------------------|---|
| Visual layout | 4 images in 2×2 grid | ☐ |
| Each image | Rounded corners, shadow, A/B/C/D badge | ☐ |
| Hover over image | Border turns blue, scales up slightly | ☐ |
| Click wrong answer | Red border, shake animation | ☐ |
| Click correct answer | Green border, checkmark, confetti | ☐ |
| Submit quiz | Score calculated, results shown | ☐ |

---

## ✅ Test 4: Overall Flow

### **Complete User Journey:**

| Step | Action | ✓ |
|------|--------|---|
| 1 | Load Module 1, Meeting 1 | ☐ |
| 2 | Click "Mulai Video" | ☐ |
| 3 | Watch Video 1 (or skip) | ☐ |
| 4 | Video 2 auto-plays | ☐ |
| 5 | Complete 9 number inputs (1:31-2:02) | ☐ |
| 6 | Answer image quiz at 2:05 | ☐ |
| 7 | Video completes, quiz section appears | ☐ |
| 8 | Answer Questions 1-2 (list layout) | ☐ |
| 9 | Answer Question 3 (grid layout) | ☐ |
| 10 | Answer Question 4 (list layout) | ☐ |
| 11 | Submit quiz, see results | ☐ |
| 12 | Meeting marked as complete | ☐ |

---

## 🐛 Common Issues & Solutions

### **Issue: Number input doesn't auto-focus**
- **Solution:** Check browser console for errors
- **Fix:** Ensure `useEffect` with `inputRef.current.focus()` is called

### **Issue: Wrong answers not clearing input**
- **Solution:** Verify `setNumberInput('')` is called after wrong answer
- **Fix:** Check `handleNumberInputSubmit` function

### **Issue: Video doesn't resume after correct answer**
- **Solution:** Check console for YouTube player errors
- **Fix:** Ensure `playerRef.current.playVideo()` is called after 800ms

### **Issue: Shake animation not working**
- **Solution:** Verify Tailwind config has `animate-shake` class
- **Fix:** Check `tailwind.config.ts` keyframes section

### **Issue: Image quiz not appearing at 2:05**
- **Solution:** Check database seed data
- **Fix:** Verify interaction timestamp is 125 (2:05 = 2*60 + 5 = 125 seconds)

### **Issue: Question 3 not showing grid**
- **Solution:** Check database seed data
- **Fix:** Ensure Question 3 has `layout: "image_grid"` field

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Test 1 (Number Input): ___/11 passed
Test 2 (Image Quiz): ___/4 passed
Test 3 (Image Grid): ___/6 passed
Test 4 (Overall Flow): ___/12 passed

Total: ___/33 tests passed

Issues Found:
1. _______________________________
2. _______________________________
3. _______________________________

Notes:
_________________________________
_________________________________
```

---

## ✅ Success Criteria

All tests must pass:
- ✅ **33/33 tests passed**
- ✅ No console errors
- ✅ Smooth video playback
- ✅ Responsive on desktop and mobile
- ✅ Audio feedback working
- ✅ Animations smooth

---

## 🚀 Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Number input auto-focus | < 100ms | ____ |
| Video resume delay | 800ms | ____ |
| Wrong answer feedback | < 50ms | ____ |
| Popup animation | < 300ms | ____ |
| Quiz submit response | < 200ms | ____ |

---

## 📝 Notes

- **Number input normalization** should handle: "20000", "20.000", "20,000"
- **Shake animation** duration: 500ms
- **Video resume delay** after correct answer: 800ms
- **Total number inputs**: 9 (timestamps 1:31-2:02)
- **Image quiz timestamp**: 2:05
- **Question 3 layout**: 2×2 grid

---

**Status:** Ready for testing  
**Last Updated:** Implementation complete  
**Next Step:** Run through all test cases and verify functionality
