# Module 1 - Number Input Quick Reference 🚀

## 🎯 **What Is This?**

A rapid-fire typing interaction system where students type money values during video playback. Video pauses → prompt appears → student types → video resumes.

---

## 🔧 **Implementation (3 Steps)**

### **Step 1: Schema** (`shared/schema.ts`)
```typescript
export const videoPopupSchema = z.object({
  type: z.enum(['continue', 'image_quiz', 'number_input']),
  correctValue: z.string().optional(),  // "100", "2000", etc.
  label: z.string().optional(),         // "Tulis jumlah uangnya:"
  // ... other fields
});
```

### **Step 2: Seed Data** (`script/seed-final.ts`)
```typescript
videoInteractions: [
  { 
    timestamp: 91,  // 1:31 in video
    popup: {
      type: 'number_input',
      label: 'Tulis jumlah uangnya:',
      correctValue: '100'
    }
  },
  // Add 8 more...
]
```

### **Step 3: Frontend Handler** (`MeetingDetail.tsx`)
```typescript
const [numberInput, setNumberInput] = useState('');
const [inputShake, setInputShake] = useState(false);
const inputRef = useRef<HTMLInputElement>(null);

const handleNumberInputSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const normalized = numberInput.replace(/[.,\s]/g, '');
  const expected = currentPopup.correctValue.replace(/[.,\s]/g, '');
  
  if (normalized === expected) {
    playSound('/sounds/correct.mp3');
    setShowPopup(false);
    setTimeout(() => playerRef.current.playVideo(), 800);
  } else {
    playSound('/sounds/wrong.mp3');
    setInputShake(true);
    setTimeout(() => setInputShake(false), 500);
  }
  setNumberInput('');
};
```

---

## 🎨 **UI Component**

```tsx
{currentPopup?.type === 'number_input' ? (
  <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2">
    <form onSubmit={handleNumberInputSubmit}
      className={`bg-black/90 rounded-2xl px-6 py-4 flex gap-4 
                  ${inputShake ? 'animate-shake' : ''}`}
    >
      <label className="text-white font-bold">{currentPopup.label}</label>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={numberInput}
        onChange={(e) => setNumberInput(e.target.value.replace(/[^0-9]/g, ''))}
        className="w-32 px-4 py-2 rounded-lg text-xl font-bold text-center"
      />
      <button type="submit">OK</button>
    </form>
  </motion.div>
) : ...}
```

**Key Props:**
- `inputMode="numeric"` → Mobile numeric keyboard
- `pattern="[0-9]*"` → iOS number pad
- `onChange` filter → Only digits allowed
- `ref={inputRef}` → Auto-focus on mount

---

## ⚡ **User Flow**

```
Video plays → Timestamp hit → Pause video
            ↓
      Show bottom overlay
            ↓
   User types number (e.g., "100")
            ↓
      User presses Enter/OK
            ↓
    ┌─────────┴──────────┐
    │                    │
 CORRECT              WRONG
    │                    │
✅ Sound             ❌ Sound
Hide popup          Shake animation
Resume after 800ms  Clear input
                    User retries
```

---

## 🧪 **Testing Commands**

```bash
# Reseed database
npm run db:seed

# Test Module 1, Meeting 1
# Navigate to: http://localhost:5000/module/136/meeting/1
# Play Video 2 → Should pause 9 times at:
# 1:31, 1:35, 1:38, 1:43, 1:47, 1:52, 1:55, 1:58, 2:02
```

---

## 🎯 **Expected Values (Module 1, Meeting 1)**

| Timestamp | Correct Answer |
|-----------|----------------|
| 1:31      | 100            |
| 1:35      | 200            |
| 1:38      | 500            |
| 1:43      | 1000           |
| 1:47      | 2000           |
| 1:52      | 5000           |
| 1:55      | 10000          |
| 1:58      | 20000          |
| 2:02      | 50000          |

---

## 🔍 **Normalization Logic**

**Input Formats Accepted:**
```typescript
"20000"   → "20000" ✅
"20.000"  → "20000" ✅ (dot removed)
"20,000"  → "20000" ✅ (comma removed)
"20 000"  → "20000" ✅ (space removed)
```

**Code:**
```typescript
const normalized = input.replace(/[.,\s]/g, '');
```

---

## 🎨 **Animation (Tailwind)**

```typescript
// tailwind.config.ts
keyframes: {
  shake: {
    "0%, 100%": { transform: "translateX(0)" },
    "25%": { transform: "translateX(-10px)" },
    "75%": { transform: "translateX(10px)" },
  },
},
animation: {
  shake: "shake 0.5s ease-in-out",
}
```

**Usage:** `className={inputShake ? 'animate-shake' : ''}`

---

## 📦 **Complete Example (Add to Seed)**

```typescript
{
  title: 'Nilai Uang',
  description: 'Kenali nilai uang koin dan kertas',
  duration: 180,
  videos: [
    {
      videoId: 'VIDEO_ID_1',
      caption: 'Intro...',
      videoInteractions: []
    },
    {
      videoId: 'VIDEO_ID_2',
      caption: 'Mari latihan mengetik nilai uang!',
      videoInteractions: [
        { timestamp: 85 },  // Mute point
        { 
          timestamp: 91, 
          popup: { 
            type: 'number_input', 
            label: 'Tulis jumlah uangnya:', 
            correctValue: '100' 
          }
        },
        { 
          timestamp: 95, 
          popup: { 
            type: 'number_input', 
            label: 'Tulis jumlah uangnya:', 
            correctValue: '200' 
          }
        },
        // Add more...
        { 
          timestamp: 125, 
          popup: { 
            type: 'image_quiz', 
            question: 'Mana yang koin?', 
            options: [...]
          }
        }
      ]
    }
  ],
  activities: [],  // Empty - activities removed
  questions: [...]
}
```

---

## 🐛 **Common Issues**

| Issue | Solution |
|-------|----------|
| Input not focusing | Add `useEffect` with `inputRef.current.focus()` |
| Wrong answers not clearing | Add `setNumberInput('')` after wrong answer |
| Video not resuming | Check `playerRef.current.playVideo()` in handler |
| Shake not working | Verify `animate-shake` class in Tailwind config |
| Mobile keyboard wrong type | Add `inputMode="numeric"` to input |

---

## 🔗 **Related Docs**

- `MODULE1_IN_VIDEO_QUIZ_COMPLETE.md` - Image quiz implementation
- `MODULE1_IMAGE_GRID_QUIZ_COMPLETE.md` - Grid layout for quizzes
- `MODULE1_NUMBER_INPUT_COMPLETE.md` - Full technical details

---

**Status:** ✅ Production Ready  
**Last Updated:** Implementation complete  
**Module:** 1 (Pengenalan Uang & Berhitung)  
**Meeting:** 1 (Mengenal Uang Koin dan Kertas)
