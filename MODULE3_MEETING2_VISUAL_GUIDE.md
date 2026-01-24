# 🎯 Body Parts Activity - Quick Visual Guide

## 🖼️ **UI Layout**

```
┌────────────────────────────────────────────────────────────┐
│  [🏠 Home]                                                  │
│                                                            │
│  ┌──────────────────────┬───────────────────────────────┐ │
│  │ Body Parts Activity  │        Body Diagram           │ │
│  │ Step 1 of 7          │                               │ │
│  ├──────────────────────┤      [Body image with zones] │ │
│  │ ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │                               │ │
│  │ 14%                  │       ┌─────────────┐         │ │
│  ├──────────────────────┤       │ 🔵 Hair    │ ← Pulse │ │
│  │  ┌────────────────┐  │       └─────────────┘         │ │
│  │  │     👆         │  │                               │ │
│  │  │                │  │         👁️ Eye               │ │
│  │  │ Touch your     │  │                               │ │
│  │  │    hair        │  │         👃 Nose              │ │
│  │  └────────────────┘  │                               │ │
│  │                      │         👂 Ears              │ │
│  │ Click on body part → │                               │ │
│  └──────────────────────┴───────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

🔊 Browser Voice: "Touch your hair"
```

---

## 🎮 **Interaction States**

### **1. Initial State (Step 1)**
```
Instruction Panel:              Body Diagram:
┌────────────────────┐          ┌──────────────┐
│ Step 1 of 7        │          │ 🔵 Hair      │ ← Current (pulse)
│ ███░░░░░░░░░░░░░░░ │          │              │
│                    │          │   Eye        │
│   👆               │          │   Nose       │
│ Touch your hair    │          │   Ears       │
└────────────────────┘          │   Mouth      │
                                 │   Hand       │
🔊 "Touch your hair"            │   Leg        │
                                 └──────────────┘
```

### **2. Correct Click**
```
                                 ┌──────────────┐
                                 │ ✅ Hair      │ ← Checkmark
                                 └──────────────┘

🔊 Ping! (800Hz)
🗣️ "Good job!"

→ Wait 1.5s → Move to Step 2
```

### **3. Incorrect Click**
```
Instruction Panel:              Body Diagram:
┌────────────────────┐          ┌──────────────┐
│ ❌ SHAKE LEFT/RIGHT│          │ 🔵 Hair      │ ← Still current
│   👆               │          │              │
│ Touch your hair    │          │ ⚠️ Eye       │ ← Clicked (wrong)
└────────────────────┘          └──────────────┘

🗣️ "Try again"
→ Stay on Step 1
```

### **4. After Completion**
```
Instruction Panel:
┌────────────────────┐
│       🎉           │
│                    │
│   Well Done!       │
│                    │
│ You've identified  │
│ all body parts!    │
│                    │
│ [Continue to Quiz] │
└────────────────────┘

🗣️ "Thank you for following my instructions!"
```

---

## 🎯 **Zone Mapping**

### **Visual Reference**
```
        5%, 55%, 20%x15%
        ┌─────────────┐
        │   HAIR      │ Step 1: "Touch your hair"
        └─────────────┘
              │
    30%,30%   │   25%,60%
    ┌──┐    Head    ┌──┐
    │👂│            │👁️│ Step 2: "Touch your eye"
    └──┘            └──┘
       \              /
        \    35%,45% /
         \   ┌────┐ /    Step 3: "Touch your nose"
          \  │👃 │/
           \ └────┘
            \      /
             40%,48%,15%x8%
            ┌────────┐     Step 5: "Touch your mouth"
            │  👄    │
            └────────┘
                │
         ┌──────┴──────┐
         │    BODY     │
    50%,80%             │
    ┌────┐              │
    │✋  │              │ Step 6: "Touch your hand"
    └────┘              │
         │              │
         └──────────────┘
              │
              │ 70%,60%,15%x20%
         ┌────┴────┐
         │  🦵     │    Step 7: "Touch your leg"
         └─────────┘
```

---

## 🔊 **Audio Flow**

### **Step 1: Hair**
```
[Activity Loads]
  ↓ 500ms delay
[TTS]: "Touch your hair"
  ↓
[Student Clicks Hair Zone]
  ↓
[Ping Sound] 🔊
[TTS]: "Good job!"
  ↓ 1.5s
[Move to Step 2]
```

### **Step 2: Eye**
```
[New Step]
  ↓ 500ms delay
[TTS]: "Touch your eye"
  ↓
[Student Clicks Wrong Zone]
  ↓
[Shake Animation]
[TTS]: "Try again"
  ↓
[Wait for correct click]
```

---

## 🎨 **Visual States**

### **Zone Colors**
| State | Border | Background | Icon |
|-------|--------|------------|------|
| Inactive | Transparent | Transparent | None |
| Current | Blue (4px) | Blue 30% | Pulse ⚫ |
| Hover | Gray | Gray 30% | None |
| Correct | Green (2px) | Green 30% | ✅ |

### **Animations**
```css
/* Pulse (Current Zone) */
@keyframes pulse {
  0%, 100%   { opacity: 0.3; scale: 1; }
  50%        { opacity: 0.6; scale: 1.05; }
}
duration: 1.5s
repeat: infinite

/* Shake (Incorrect) */
@keyframes shake {
  0%, 100%   { translateX: 0 }
  25%        { translateX: -10px }
  75%        { translateX: 10px }
}
duration: 0.5s
```

---

## 📱 **Responsive Layout**

### **Desktop (> 1024px)**
```
┌─────────────────────────────────────┐
│ [Instruction Panel 320px] [Diagram] │
└─────────────────────────────────────┘
```

### **Tablet (768px - 1024px)**
```
┌────────────────────────────┐
│ [Panel 280px] [Diagram]    │
└────────────────────────────┘
```

### **Mobile (< 768px)** - Future
```
┌─────────────────┐
│   [Diagram]     │
├─────────────────┤
│ [Instruction]   │
└─────────────────┘
```

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Perfect Run**
```
Step 1: Click Hair → ✅ → Step 2
Step 2: Click Eye → ✅ → Step 3
Step 3: Click Nose → ✅ → Step 4
Step 4: Click Ears → ✅ → Step 5
Step 5: Click Mouth → ✅ → Step 6
Step 6: Click Hand → ✅ → Step 7
Step 7: Click Leg → ✅ → Celebration!
```

### **Scenario 2: Mistakes**
```
Step 1: Click Eye → ❌ Shake + "Try again"
Step 1: Click Hair → ✅ → Step 2
Step 2: Click Nose → ❌ Shake + "Try again"
Step 2: Click Eye → ✅ → Step 3
...
```

### **Scenario 3: Audio Test**
```
1. Mute browser → Activity still works (visual only)
2. Unmute → TTS works again
3. Click multiple times fast → Only one voice at a time (cancel previous)
```

---

## 🎯 **Correct Sequence**

| Step | Body Part | Instruction | Zone Coordinates |
|------|-----------|-------------|------------------|
| 1 | Hair | "Touch your hair" | 5%, 55%, 20% × 15% |
| 2 | Eye | "Touch your eye" | 25%, 60%, 10% × 10% |
| 3 | Nose | "Touch your nose" | 35%, 45%, 10% × 10% |
| 4 | Ears | "Touch your ears" | 30%, 30%, 10% × 10% |
| 5 | Mouth | "Touch your mouth" | 40%, 48%, 15% × 8% |
| 6 | Hand | "Touch your hand" | 50%, 80%, 15% × 15% |
| 7 | Leg | "Touch your leg" | 70%, 60%, 15% × 20% |

---

## 🔧 **Component Props**

```typescript
<BodyPartsActivity
  imageUrl="/src/assets/body-parts-diagram.png"
  instructions={[
    {
      part: "hair",
      text: "Touch your hair",
      zone: { top: "5%", left: "55%", width: "20%", height: "15%" }
    },
    // ... 6 more
  ]}
  closingAudio="Thank you for following my instructions!"
  onComplete={() => { /* Go to quiz */ }}
/>
```

---

## 🗣️ **TTS Examples**

```javascript
// Instruction
speak("Touch your hair");

// Success
speak("Good job!");

// Error
speak("Try again");

// Completion
speak("Thank you for following my instructions!");
```

**Voice**: English (auto-detected browser voice)
**Rate**: 0.9 (slightly slower)
**Pitch**: 1.0 (normal)

---

## 🎵 **Sound Effects**

### **Ping Sound (Correct Click)**
```
Frequency: 800 Hz
Type: Sine wave
Duration: 0.5 seconds
Volume: 30%
```

**Code**:
```typescript
const oscillator = audioContext.createOscillator();
oscillator.frequency.value = 800;
oscillator.type = 'sine';
oscillator.start();
oscillator.stop(currentTime + 0.5);
```

---

## 📊 **Progress Bar**

```
Step 1/7: ███░░░░░░░░░░░░░░ (14%)
Step 2/7: ██████░░░░░░░░░░░ (28%)
Step 3/7: █████████░░░░░░░░ (43%)
Step 4/7: ████████████░░░░░ (57%)
Step 5/7: ███████████████░░ (71%)
Step 6/7: ██████████████████ (86%)
Step 7/7: ████████████████████ (100%)
```

**Colors**: Gradient orange-400 → red-500

---

## 🚀 **Quick Start**

```bash
# Seed database
npm run db:seed

# Start dev server
npm run dev

# Navigate to
http://localhost:5000/module/3/meetings
# Click "Anggota Tubuh" (Meeting 2)
```

---

## 💡 **Tips**

1. **Browser Must Support TTS**: All modern browsers (Chrome, Edge, Firefox, Safari)
2. **Allow Audio Autoplay**: Some browsers block autoplay (user interaction needed first)
3. **Zone Sizes**: Adjust percentages if body image has different proportions
4. **Step Order**: Sequential (hair → eye → nose → ears → mouth → hand → leg)
5. **Visual Feedback**: Blue = current, Green = done, Shake = wrong

---

🎯 **Visual Guide Complete!**
**See `MODULE3_MEETING2_BODY_PARTS_COMPLETE.md` for full technical documentation.**
