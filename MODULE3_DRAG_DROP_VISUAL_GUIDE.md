# 🎯 Module 3 Drag & Drop - Quick Visual Guide

## 🖼️ **UI Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  [🏠 Home]                                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  💬 Complete the Dialogue                              │ │
│  │                                                         │ │
│  │  🧑 YOU: [___ Hello ___]!                             │ │
│  │                                                         │ │
│  │  👤 STRANGER: 'Hi there!'                              │ │
│  │                                                         │ │
│  │  🧑 YOU: [___ Good morning ___].                       │ │
│  │       It is a very beautiful day.                      │ │
│  │                                                         │ │
│  │  👤 STRANGER: 'Yes it is.'                             │ │
│  │                                                         │ │
│  │  🧑 YOU: 'My name is Budi. [___ What is your name __]? │ │
│  │                                                         │ │
│  │  👤 STRANGER: 'I am Jordan.'                           │ │
│  │                                                         │ │
│  │  🧑 YOU: 'Nice to meet you. [___ How are you ___]?'   │ │
│  │                                                         │ │
│  │  👤 STRANGER: 'I'm fine, thank you!'                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  🎯 Word Bank - Drag to Fill Blanks                    │ │
│  │                                                         │ │
│  │  [Hello] [Good morning] [What is your name] [How are you] │
│  │  [Goodbye] [Good night] [Where are you] [Thank you]   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 **Visual States**

### **1. Empty Drop Zone**
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│         ___             │  ← Gray dashed border
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

### **2. Hover Over Drop Zone**
```
┌━━━━━━━━━━━━━━━━━━━━━━━━━┐
│         ___             │  ← Yellow border, scale-up
└━━━━━━━━━━━━━━━━━━━━━━━━━┘
```

### **3. Correct Placement**
```
┌─────────────────────────┐
│ ✅ Hello               │  ← Green background
└─────────────────────────┘
```

### **4. Incorrect Placement**
```
┌─────────────────────────┐
│ ❌ Goodbye             │  ← Red background, shake
└─────────────────────────┘  ← Bounces back to word bank
```

---

## 🔄 **Interaction Flow**

### **Step 1: Initial State**
```
Story: [___] [___] [___] [___]
Word Bank: [Hello] [Good morning] [What is your name] [How are you]
           [Goodbye] [Good night] [Where are you] [Thank you]
```

### **Step 2: Drag "Hello" to Slot 0**
```
Story: [✅ Hello] [___] [___] [___]
Word Bank: [Good morning] [What is your name] [How are you]
           [Goodbye] [Good night] [Where are you] [Thank you]
```

### **Step 3: Try Drag "Goodbye" to Slot 1 (Wrong)**
```
Story: [✅ Hello] [❌ Goodbye → bounces back] [___] [___]
Word Bank: [Good morning] [What is your name] [How are you]
           [Goodbye] [Good night] [Where are you] [Thank you]
```

### **Step 4: Drag "Good morning" to Slot 1 (Correct)**
```
Story: [✅ Hello] [✅ Good morning] [___] [___]
Word Bank: [What is your name] [How are you]
           [Goodbye] [Good night] [Where are you] [Thank you]
```

### **Step 5: Complete All Slots**
```
Story: [✅ Hello] [✅ Good morning] [✅ What is your name] [✅ How are you]
Word Bank: [Goodbye] [Good night] [Where are you] [Thank you]

┌─────────────────────────────────────────┐
│  🎉 Perfect! Dialogue Complete!         │
│                                         │
│  [Continue →]  [Try Again 🔄]          │
└─────────────────────────────────────────┘
```

---

## 🎮 **Mouse Interactions**

### **Dragging**
```
1. Mouse Down on Word Chip
   ↓
2. Cursor changes to "grabbing"
   ↓
3. Drag overlay follows cursor
   ↓
4. Hover over drop zone (yellow highlight)
   ↓
5. Release mouse (drop)
```

### **Drop Validation**
```
IF word.correctSlotIndex === dropZone.index
  ↓
  ✅ CORRECT
  - Snap into place
  - Turn green
  - Remove from word bank
  - Check completion
ELSE
  ↓
  ❌ INCORRECT
  - Flash red
  - Shake animation (500ms)
  - Return to word bank (800ms)
```

---

## 🎨 **Color Reference**

### **Word Chips**
```css
background: linear-gradient(to right, purple-500, pink-500)
color: white
hover: scale-105
cursor: grab / grabbing
```

### **Drop Zones**
```css
Empty:     bg-gray-50 border-gray-300 dashed
Hover:     bg-yellow-50 border-yellow-400 solid
Correct:   bg-green-100 border-green-500 solid
Incorrect: bg-red-100 border-red-500 solid
```

### **Completion Card**
```css
background: linear-gradient(to right, green-400, emerald-500)
color: white
animation: bounce-in (0.6s)
```

---

## 📱 **Responsive Behavior**

### **Desktop (> 1024px)**
- Word bank shows 4 words per row
- Story text: text-xl
- Word chips: px-6 py-3

### **Tablet (768px - 1024px)**
- Word bank shows 3 words per row
- Story text: text-lg
- Word chips: px-5 py-2

### **Mobile (< 768px)**
- Word bank shows 2 words per row
- Story text: text-base
- Word chips: px-4 py-2
- Touch-friendly (8px activation constraint)

---

## 🔊 **Audio Feedback (Future)**

```
Drag Start:       "whoosh.mp3"
Drop Correct:     "ding.mp3" + confetti.js
Drop Incorrect:   "error.mp3"
All Complete:     "celebration.mp3" + confetti burst
```

---

## 🎯 **Correct Answers**

### **Slot 0**: "Hello"
- Fits: "You: 'Hello!'"
- Distractors: Goodbye, Good night

### **Slot 1**: "Good morning"
- Fits: "You: 'Good morning. It is a very beautiful day.'"
- Distractors: Good night, Goodbye

### **Slot 2**: "What is your name"
- Fits: "You: 'My name is Budi. What is your name?'"
- Distractors: Where are you, Thank you

### **Slot 3**: "How are you"
- Fits: "You: 'Nice to meet you. How are you?'"
- Distractors: Where are you, Thank you

---

## 📊 **Data Structure Mapping**

```typescript
// Word Bank Item
{
  id: "w1",
  text: "Hello",
  correctSlotIndex: 0  ← Matches slot in template
}

// Template Placeholder
"You: '{0}!'"
       ↑
       Slot 0

// Matching Logic
wordBank[0].correctSlotIndex === 0
→ "Hello" fits in slot 0
```

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Happy Path**
1. Drag "Hello" → Slot 0 ✅
2. Drag "Good morning" → Slot 1 ✅
3. Drag "What is your name" → Slot 2 ✅
4. Drag "How are you" → Slot 3 ✅
5. Celebration appears 🎉
6. Click "Continue" → Quiz

### **Scenario 2: Mistakes**
1. Drag "Goodbye" → Slot 0 ❌ (bounces back)
2. Drag "Hello" → Slot 0 ✅ (correct)
3. Drag "Good night" → Slot 1 ❌ (bounces back)
4. Drag "Good morning" → Slot 1 ✅ (correct)
5. Continue...

### **Scenario 3: Reset**
1. Fill 2-3 slots incorrectly
2. Click "Try Again" 🔄
3. All words return to bank
4. All slots empty again
5. Start fresh

---

## 🎓 **Pedagogical Benefits**

### **Why Drag & Drop?**
- **Kinesthetic Learning**: Physical action reinforces memory
- **Visual Context**: See the whole dialogue, not just fragments
- **Immediate Feedback**: Learn from mistakes instantly
- **Self-Paced**: No time pressure (until Phase 2 enhancements)
- **Game-Like**: Feels like a puzzle, not a test

### **Why These Distractors?**
- **Goodbye** vs **Hello**: Common opposite confusion
- **Good night** vs **Good morning**: Time-of-day awareness
- **Where are you** vs **What is your name**: Question structure
- **Thank you**: Polite phrase, but doesn't fit context

---

## 🚀 **Quick Start Command**

```bash
# Seed database with new drag-drop activity
npm run db:seed

# Start dev server
npm run dev

# Test at
http://localhost:5000/module/3/meetings
```

---

## 📝 **Component Props**

```typescript
<DragDropActivity
  storyTemplate="You: '{0}'!\nStranger: 'Hi there!'\n..."
  wordBank={[
    { id: "w1", text: "Hello", correctSlotIndex: 0 },
    // ...
  ]}
  onComplete={() => {
    // Move to next step (quiz)
  }}
/>
```

---

🎯 **Visual Guide Complete!**
**See `DRAG_DROP_IMPLEMENTATION_COMPLETE.md` for full technical documentation.**
