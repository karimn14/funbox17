# 🎵 Audio System Flow Diagram

## Audio Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AUDIO SYSTEM                          │
│                                                          │
│  ┌─────────────────┐         ┌────────────────────┐    │
│  │  Background     │         │   Quiz Feedback    │    │
│  │  Music (BGM)    │         │   SFX System       │    │
│  └─────────────────┘         └────────────────────┘    │
│         │                              │                │
│         ▼                              ▼                │
│   Volume: 30%                    Volume: 100%          │
│   (0.3)                          (1.0)                 │
│                                                          │
│   Continuous Loop                One-off Playback       │
│   Ambient Sound                  Clear Feedback         │
└─────────────────────────────────────────────────────────┘
```

---

## BGM Flow (Background Music)

```
┌────────────────────────────────────────────────────────────┐
│ 1. Page Load                                               │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 2. BackgroundMusic Component Mounts                        │
│    - Create <audio> element                                │
│    - Set src="/assets/bgm.mp3"                            │
│    - Set volume = 0.3 (30%)                               │
│    - Set loop = true                                       │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 3. Attempt Autoplay                                        │
│    ├─ Success → Music starts playing at 30%               │
│    └─ Blocked → Wait for user interaction                 │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 4. User Interaction (click/keypress)                       │
│    → Music starts playing at 30%                           │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Continuous Loop                                         │
│    → BGM plays in background at 30% volume                 │
│    → User can toggle mute button (🔊/🔇)                  │
└────────────────────────────────────────────────────────────┘
```

---

## Quiz SFX Flow (Success/Failure Feedback)

```
┌────────────────────────────────────────────────────────────┐
│ 1. Student Completes Quiz                                  │
│    - All questions answered                                │
│    - Correct count tallied                                 │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Calculate Weighted Score                                │
│    score = calculateMeetingScore(correctCount, moduleId)   │
│    Example: 4/5 correct in Module 1 Meeting 1 = 80%       │
└────────────────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────────────────┐
│ 3. Compare with KKM (75%)                                  │
└────────────────────────────────────────────────────────────┘
         ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│ score >= 75%         │          │ score < 75%          │
│ (PASSING)            │          │ (FAILING)            │
└──────────────────────┘          └──────────────────────┘
         ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│ playSuccessSound()   │          │ playFailureSound()   │
│                      │          │                      │
│ 🔊 applause.mp3     │          │ 🔊 try-again.mp3    │
│ Volume: 1.0 (100%)  │          │ Volume: 1.0 (100%)  │
│ Duration: ~3 sec    │          │ Duration: ~3 sec    │
└──────────────────────┘          └──────────────────────┘
         ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│ Serial: GOOD         │          │ Serial: RETRY        │
│ Confetti animation   │          │ Encouragement UI     │
└──────────────────────┘          └──────────────────────┘
         ▼                                    ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Show Result Screen                                      │
│    - Display score, stars, feedback                        │
│    - Navigate to next meeting or modules list              │
└────────────────────────────────────────────────────────────┘
```

---

## Audio Timing Sequence

```
Quiz Complete Event
│
├─ t=0ms:    Calculate score
│            sendCommand("FINISH")
│
├─ t=0ms:    🔊 Play SFX (applause or try-again)
│            └─ Non-blocking, plays asynchronously
│
├─ t=500ms:  sendCommand("GOOD" or "RETRY")
│
└─ t=1500ms: setStep('result')
             Show result screen
```

---

## Volume Mixing Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    USER AUDIO EXPERIENCE                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🎵 Background Music (Continuous)                       │
│  ▓▓▓░░░░░░░ 30% ───────────────────────────────────▶   │
│  Soft, ambient, doesn't interfere                       │
│                                                          │
│                                                          │
│  🔊 Quiz Feedback SFX (Momentary)                       │
│  ▓▓▓▓▓▓▓▓▓▓ 100% ──▶ (2-3 seconds)                    │
│  Clear, prominent, immediate feedback                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

Result: BGM stays in background, SFX cuts through clearly
```

---

## File Structure

```
client/
├── public/
│   └── assets/
│       ├── bgm.mp3          ✅ Background music (loops)
│       ├── applause.mp3     ⚠️ Success sound (one-shot)
│       └── try-again.mp3    ⚠️ Failure sound (one-shot)
│
└── src/
    ├── components/
    │   └── BackgroundMusic.tsx    [Modified] BGM controller
    │
    ├── utils/
    │   └── soundEffects.ts        [NEW] SFX utility
    │
    └── pages/
        └── MeetingDetail.tsx      [Modified] Quiz completion
```

---

## Sound Effect Implementation

### 1. Success Sound (Applause)
```typescript
function playSuccessSound() {
  const audio = new Audio('/assets/applause.mp3');
  audio.volume = 1.0;  // Full volume
  audio.play().catch(err => console.warn(err));
}
```

**Triggers When:**
- Quiz score ≥ 75%
- KKM passing grade met
- Student succeeds

**User Experience:**
- Loud, clear applause
- Positive reinforcement
- Celebration moment

### 2. Failure Sound (Try Again)
```typescript
function playFailureSound() {
  const audio = new Audio('/assets/try-again.mp3');
  audio.volume = 1.0;  // Full volume
  audio.play().catch(err => console.warn(err));
}
```

**Triggers When:**
- Quiz score < 75%
- Below KKM threshold
- Student needs retry

**User Experience:**
- Encouraging, not negative
- Motivational tone
- "Let's try again" vibe

---

## KKM Standards Visualization

```
Quiz Score Distribution:
│
100% ─┤                                    ⭐⭐⭐
 90% ─┤                                    ⭐⭐⭐
 80% ─┤═══════════════════════════════════⭐⭐  } MODULE KKM
 75% ─┼───────────────────────────────────⭐   ─┐
 70% ─┤                    🔊 applause.mp3    │ MEETING KKM
 60% ─┤                                        │ (Passing Grade)
 50% ─┤                                        │
 40% ─┤                                        │
 30% ─┤                                        │
 20% ─┤                    🔊 try-again.mp3   │
 10% ─┤                                        │
  0% ─┴────────────────────────────────────────┘
      └─── Below KKM ───┼─── Passing ────┼─── Excellent ───┘
```

**Key Thresholds:**
- **< 75%**: Failure → try-again.mp3 → Retry encouraged
- **≥ 75%**: Pass → applause.mp3 → Success celebrated
- **≥ 80%**: Module completion grade (average of all meetings)

---

## Error Handling Flow

```
SFX Playback Attempt
│
├─ Audio file exists?
│  ├─ Yes → Continue
│  └─ No  → Log warning, continue without sound ✅
│
├─ Browser allows playback?
│  ├─ Yes → Play at 100% volume
│  └─ No  → Catch error, log, continue ✅
│
└─ Result: Non-blocking, graceful degradation
```

**Benefits:**
- App works even without audio files
- No UI blocking or freezing
- Console warnings for debugging
- User experience not interrupted

---

## Testing Checklist

### ✅ BGM Testing:
- [ ] Music plays at 30% volume (soft, ambient)
- [ ] Music loops continuously
- [ ] Mute button toggles sound (🔊/🔇)
- [ ] Music resumes after page interaction if autoplay blocked

### ✅ Success SFX Testing:
- [ ] Complete quiz with score ≥ 75%
- [ ] Hear applause.mp3 at 100% volume (loud, clear)
- [ ] Console shows: "🎉 Playing success sound"
- [ ] Serial command "GOOD" sent
- [ ] Confetti animation appears

### ✅ Failure SFX Testing:
- [ ] Complete quiz with score < 75%
- [ ] Hear try-again.mp3 at 100% volume (encouraging)
- [ ] Console shows: "😔 Playing failure sound"
- [ ] Serial command "RETRY" sent
- [ ] Result screen shows retry option

---

## Performance Considerations

**BGM (Background Music):**
- ✅ Single audio instance, reused
- ✅ Preloaded on page mount
- ✅ Low CPU usage (native browser audio)

**SFX (Sound Effects):**
- ✅ Fire-and-forget pattern (new Audio())
- ✅ No memory leaks (auto garbage collected)
- ✅ Non-blocking (async playback)
- ✅ Small file size (~50-100 KB)

**Total Audio Memory:**
- BGM: ~1-3 MB (persistent)
- SFX: ~100-200 KB (transient)
- Combined: < 5 MB total

---

**Visual Guide Complete** ✅
**Date:** 2026-01-31
**Feature:** Sound Effects & Audio Mixing
