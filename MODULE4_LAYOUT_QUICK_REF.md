# 🎯 Module 4 Quiz Layout - Quick Reference

## 📐 Layout Decision Tree

```
Is Module 4? (moduleId === 104)
│
├─ NO → Use default layout
│
└─ YES → Check meeting order
    │
    ├─ Order 1 or 2 → LAYOUT A (Stacked)
    │   ├─ Top: 35% story card (yellow theme)
    │   └─ Bottom: 65% question card
    │
    └─ Order 3 or 4 → LAYOUT B (Side-by-Side)
        ├─ Left: 60% story card (blue theme)
        └─ Right: 40% question card
```

---

## 🎨 Styling Reference

### **Layout A: Stacked**
```tsx
// Container
className="flex flex-col h-full max-w-3xl mx-auto"

// Top Card (Story)
className="h-[35%] bg-gradient-to-br from-yellow-50 to-amber-50 
           rounded-2xl p-6 shadow-xl overflow-y-auto 
           border-2 border-yellow-200"

// Bottom Card (Question)
className="h-[65%] bg-white rounded-2xl p-6 shadow-2xl"
```

### **Layout B: Side-by-Side**
```tsx
// Container
className="flex flex-col lg:flex-row gap-6"

// Left Panel (Story)
className="lg:w-[60%] bg-gradient-to-br from-blue-50 to-indigo-50 
           rounded-2xl p-6 shadow-xl overflow-y-auto 
           border-2 border-blue-200"

// Right Panel (Question)
className="lg:w-[40%] bg-white rounded-2xl p-6 shadow-2xl"
```

---

## 🔍 Detection Code

```typescript
// Module 4 Layout Detection
const isModule4 = meeting?.moduleId === 104;
const isModule4Meeting1or2 = isModule4 && (meeting?.order === 1 || meeting?.order === 2);
const isModule4Meeting3or4 = isModule4 && (meeting?.order === 3 || meeting?.order === 4);

// Render Logic
if (isModule4Meeting1or2 && hasQuestionContext) {
  // Render LAYOUT A
}

if (isModule4Meeting3or4 && hasQuestionContext) {
  // Render LAYOUT B
}
```

---

## 📊 Meeting Configuration

| Meeting | Order | Layout | Story Width | Question Width | Theme |
|---------|-------|--------|-------------|----------------|-------|
| 1 | 1 | Stacked | 100% (35% height) | 100% (65% height) | Yellow |
| 2 | 2 | Stacked | 100% (35% height) | 100% (65% height) | Yellow |
| 3 | 3 | Side-by-Side | 60% | 40% | Blue |
| 4 | 4 | Side-by-Side | 60% | 40% | Blue |

---

## ✅ Common Issues

### **Issue 1**: Layout not applying
**Solution**: Check `moduleId` is **104** (not 109) in database

### **Issue 2**: Story not scrolling
**Solution**: Verify `overflow-y-auto` class is present on story card

### **Issue 3**: Wrong aspect ratio
**Solution**: Check `h-[35%]` and `h-[65%]` for stacked, `w-[60%]` and `w-[40%]` for side-by-side

### **Issue 4**: Mobile layout broken
**Solution**: Ensure `flex-col lg:flex-row` is used for side-by-side layout

---

## 🧪 Testing Commands

```bash
# Start dev server
npm run dev

# Test each meeting
# Navigate to: http://localhost:5173/meeting/{meetingId}

# Module 4 Meeting IDs (example)
Meeting 1: /meeting/4001
Meeting 2: /meeting/4002
Meeting 3: /meeting/4003
Meeting 4: /meeting/4004
```

---

## 🔧 Customization

### **Change Layout Ratio**
```tsx
// Stacked: Change from 35/65 to 40/60
h-[35%] → h-[40%]
h-[65%] → h-[60%]

// Side-by-Side: Change from 60/40 to 50/50
w-[60%] → w-[50%]
w-[40%] → w-[50%]
```

### **Change Theme Colors**
```tsx
// Yellow theme → Green theme
from-yellow-50 to-amber-50 → from-green-50 to-emerald-50
border-yellow-200 → border-green-200
text-yellow-900 → text-green-900

// Blue theme → Purple theme
from-blue-50 to-indigo-50 → from-purple-50 to-pink-50
border-blue-200 → border-purple-200
text-blue-900 → text-purple-900
```

---

## 📦 Dependencies

- **Framer Motion**: `motion.div` for animations
- **Tailwind CSS**: Utility classes for styling
- **React**: State management with `useState`
- **Wouter**: Routing with `useLocation`

---

**Last Updated**: January 25, 2026  
**Version**: 2.0  
**File**: `client/src/pages/MeetingDetail.tsx`
