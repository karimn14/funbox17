# 🔊 Sound Effects Quick Reference

## ✅ Implementation Complete

### What Changed:

**1. BGM Volume Lowered to 30%**
```typescript
// client/src/components/BackgroundMusic.tsx
audio.volume = 0.3;  // Soft ambient background
```

**2. Quiz SFX Added at 100% Volume**
```typescript
// client/src/pages/MeetingDetail.tsx
if (score >= 75%) {
  playSuccessSound();  // applause.mp3 at 100%
} else {
  playFailureSound();  // try-again.mp3 at 100%
}
```

---

## 📁 Required Files

Place in `client/public/assets/`:

- ✅ `bgm.mp3` (exists) - Background music
- ⚠️ `applause.mp3` (ADD THIS) - Success sound
- ⚠️ `try-again.mp3` (ADD THIS) - Encouragement sound

---

## 🎯 Audio Specifications

**SFX Files:**
- Format: MP3
- Duration: 2-4 seconds
- Bitrate: 128-192 kbps
- Size: ~50-100 KB each

**Suggested Sounds:**
- `applause.mp3`: Clapping, cheering, victory fanfare
- `try-again.mp3`: Upbeat encouragement, "let's try again" jingle

---

## 🧪 Quick Test

### Test Success Sound (≥75%):
1. Complete quiz with 4-5 correct answers
2. Hear loud applause at 100% volume
3. Console: "🎉 Playing success sound"

### Test Failure Sound (<75%):
1. Complete quiz with 0-2 correct answers
2. Hear encouragement sound at 100% volume
3. Console: "😔 Playing failure sound"

---

## 🔊 Volume Levels

| Audio Type | Volume | Purpose |
|------------|--------|---------|
| BGM | 30% (0.3) | Ambient background |
| Success SFX | 100% (1.0) | Clear feedback |
| Failure SFX | 100% (1.0) | Clear feedback |

---

## 🎵 KKM Thresholds

```
Quiz Score ≥ 75% → Success (applause.mp3)
Quiz Score < 75% → Failure (try-again.mp3)
```

---

## 📝 Files Modified

1. `client/src/components/BackgroundMusic.tsx` - BGM volume
2. `client/src/pages/MeetingDetail.tsx` - SFX integration
3. `client/src/utils/soundEffects.ts` - SFX utility (NEW)

---

## 🚨 Action Required

**Add these audio files:**
```
client/public/assets/applause.mp3
client/public/assets/try-again.mp3
```

Without these files, console will show:
```
⚠️ Failed to play applause sound: [error]
```

But app will continue working normally (graceful degradation).

---

## 🎧 Sound Effect Resources

**Free Sound Libraries:**
- Freesound.org
- Mixkit.co/free-sound-effects
- Zapsplat.com
- Pixabay.com/sound-effects

**Search Terms:**
- "applause", "clapping", "cheer", "victory"
- "try again", "encouragement", "positive", "upbeat"

---

**Status:** ✅ Code Complete, ⚠️ Audio Files Needed
**Testing:** Ready once audio files added
