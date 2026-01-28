# 🎵 Audio Assets Guide

## Required Audio Files

Place the following audio files in this directory:

### 1. success-drag.mp3
- **Purpose:** Played when drag & drop activity is completed successfully
- **Duration:** 2-3 seconds
- **Style:** Celebration sound (bells, chimes, applause)
- **Format:** MP3, 128kbps recommended
- **Max Size:** 100KB

**Suggested Sounds:**
- Party horn + applause
- Bells chiming with echo
- "Yay!" with sparkle sound effect

---

### 2. happy-result.mp3
- **Purpose:** Played when student's average score >= KKM (75) on module completion
- **Duration:** 5-7 seconds
- **Style:** Triumphant fanfare, cheerful celebration
- **Format:** MP3, 128kbps recommended
- **Max Size:** 200KB

**Suggested Sounds:**
- Victory fanfare with cheering crowd
- "Thank you for learning!" voiceover
- Upbeat music with applause

---

### 3. sad-result.mp3
- **Purpose:** Played when student's average score < KKM (75)
- **Duration:** 3-4 seconds
- **Style:** Gentle, encouraging, supportive (NOT negative!)
- **Format:** MP3, 128kbps recommended
- **Max Size:** 150KB

**Suggested Sounds:**
- Gentle "aww" with uplifting tone
- "Keep trying, you can do it!" voiceover
- Soft, encouraging music

---

### 4. correct.mp3 (may already exist)
- **Purpose:** Quick feedback for correct answers in activities
- **Duration:** 0.5-1 second
- **Style:** Positive ding/chime
- **Format:** MP3, 64-128kbps
- **Max Size:** 20KB

**Suggested Sounds:**
- "Ding!" bell sound
- Coin collect sound
- Positive beep

---

### 5. wrong.mp3 (may already exist)
- **Purpose:** Quick feedback for wrong answers
- **Duration:** 0.5-1 second
- **Style:** Gentle buzz (NOT harsh!)
- **Format:** MP3, 64-128kbps
- **Max Size:** 20KB

**Suggested Sounds:**
- Soft "boop" sound
- Gentle buzzer
- "Oops" sound effect

---

## Free Audio Resources

### Websites for Kid-Friendly Sound Effects:
1. **Freesound.org** - Community sounds (CC licensed)
2. **Zapsplat.com** - Free sound effects
3. **Mixkit.co** - Free music & sound effects
4. **Pixabay** - Free sounds (no attribution)

### Search Keywords:
- "kids game sound effects"
- "celebration fanfare"
- "positive feedback sound"
- "encouragement sound"
- "quiz correct answer"

---

## Testing Audio

After adding files, test in browser console:
```javascript
const audio = new Audio('/assets/audio/success-drag.mp3');
audio.play();
```

Make sure:
- [ ] Files load without 404 errors
- [ ] Volume is appropriate (not too loud/quiet)
- [ ] Audio plays smoothly on target devices
- [ ] No audio conflicts between different sounds

---

## Current Status

- [ ] success-drag.mp3 - **NEEDED**
- [ ] happy-result.mp3 - **NEEDED**
- [ ] sad-result.mp3 - **NEEDED**
- [ ] correct.mp3 - Check if exists, add if missing
- [ ] wrong.mp3 - Check if exists, add if missing

**Once all audio files are added, the app will have complete audio feedback! 🎵**
