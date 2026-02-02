# ⚠️ AUDIO FILES NEEDED

## Required Files

Place these files in: `client/public/assets/`

### 1. applause.mp3 ⚠️
- **Purpose:** Success sound when quiz score ≥ 75%
- **Duration:** 2-4 seconds
- **Suggested:** Clapping, cheering, victory fanfare
- **Volume:** Will play at 100% (loud and clear)
- **File size:** ~50-100 KB

### 2. try-again.mp3 ⚠️
- **Purpose:** Encouragement sound when quiz score < 75%
- **Duration:** 2-4 seconds
- **Suggested:** Upbeat jingle, "let's try again" tone
- **Volume:** Will play at 100% (motivational)
- **File size:** ~50-100 KB

---

## Free Sound Resources

**Where to find:**
- Freesound.org
- Mixkit.co/free-sound-effects
- Zapsplat.com
- Pixabay.com/sound-effects

**Search terms:**
- For applause.mp3: "applause", "clapping", "cheer", "victory"
- For try-again.mp3: "try again", "encouragement", "positive", "upbeat"

---

## Current Status

- ✅ `bgm.mp3` - Background music (exists)
- ⚠️ `applause.mp3` - Success sound (MISSING)
- ⚠️ `try-again.mp3` - Failure sound (MISSING)

---

## What Happens Without These Files?

**App will:**
- ✅ Continue working normally
- ✅ Show visual feedback (stars, confetti, score)
- ⚠️ Log warning in console: "Failed to play [sound] sound"
- ⚠️ No audio feedback for quiz completion

**Graceful degradation:**
The app won't crash or freeze, it just won't play the sounds.

---

## To Test After Adding Files

```bash
# 1. Start dev server
npm run dev

# 2. Complete a quiz
# - With 4-5 correct → Should hear applause
# - With 0-2 correct → Should hear try-again

# 3. Check console
# Should see: "🔊 Playing SFX: applause at volume 1.0"
```

---

**Action Required:** Add `applause.mp3` and `try-again.mp3` to `client/public/assets/`
