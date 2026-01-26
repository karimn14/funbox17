# Module 4, Meeting 1 - Quiz Layout Quick Reference

## 🎯 Layout Applied

**Target:** Module 4, Meeting 1 (Huruf) **ONLY**

---

## 📐 Height Distribution

```
┌─────────────────────────────────────┐
│  Screen Height: 100%                │
│                                     │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ TOP CARD                      ┃  │
│  ┃ Context/Penjelasan            ┃  │ ← 30%
│  ┃ bg-yellow-50                  ┃  │
│  ┃ text-sm (compact)             ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│            ↕ gap-4                  │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ BOTTOM CARD                   ┃  │
│  ┃ Question & Options            ┃  │
│  ┃ bg-white                      ┃  │
│  ┃                               ┃  │
│  ┃ ┌─────────────────────────┐   ┃  │
│  ┃ │ Progress Bar (h-1.5)    │   ┃  │
│  ┃ ├─────────────────────────┤   ┃  │
│  ┃ │ Question (text-base)    │   ┃  │ ← 65%
│  ┃ ├─────────────────────────┤   ┃  │
│  ┃ │ [A] Sabun (40px min)    │   ┃  │
│  ┃ │ [B] Sisir               │   ┃  │
│  ┃ │ [C] Baju                │   ┃  │
│  ┃ │ [D] Topi                │   ┃  │
│  ┃ └─────────────────────────┘   ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└─────────────────────────────────────┘
```

---

## 🎨 Style Specifications

### Top Card (30%)
```tsx
<div className="h-[30%] bg-yellow-50 rounded-xl p-4 shadow-xl overflow-y-auto">
  <h3 className="text-base">Penjelasan</h3>
  <p className="text-sm">{context_text}</p>
</div>
```

### Bottom Card (65%)
```tsx
<div className="h-[65%] bg-white rounded-xl p-4 shadow-2xl">
  {/* Progress: h-1.5, mb-2 */}
  {/* Question: text-base md:text-lg, mb-2 */}
  {/* Options: min-h-[40px], gap-2 */}
</div>
```

---

## 📏 Spacing Breakdown

| Element | Spacing |
|---------|---------|
| Top card height | `h-[30%]` |
| Bottom card height | `h-[65%]` |
| Gap between cards | `gap-4` (16px) |
| Card padding | `p-4` (16px) |
| Progress bar height | `h-1.5` (6px) |
| Question margin bottom | `mb-2` (8px) |
| Options gap | `gap-2` (8px) |
| Option min height | `min-h-[40px]` |
| Option padding | `p-2.5` (10px) |

---

## 🔤 Text Sizing

| Element | Size |
|---------|------|
| Context title | `text-base` (16px) |
| Context text | `text-sm` (14px) |
| Progress text | `text-xs` (12px) |
| Question | `text-base md:text-lg` (16-18px) |
| Options (short) | `text-base` (16px) |
| Options (medium) | `text-sm` (14px) |
| Options (long) | `text-xs` (12px) |

---

## 💻 Code Reference

### Condition
```typescript
const isModule4Meeting1 = meeting?.moduleId === 99 && meeting?.order === 1;

if (isModule4Meeting1 && hasQuestionContext) {
  // Render stacked layout
}
```

### Container
```tsx
<div className="flex flex-col h-full w-full max-w-2xl mx-auto overflow-hidden gap-4">
```

### Top Card
```tsx
<motion.div className="h-[30%] bg-yellow-50 rounded-xl p-4 shadow-xl overflow-y-auto">
  <div className="flex items-center gap-2 mb-2">
    <BookOpen className="w-5 h-5 text-yellow-600" />
    <h3 className="text-base font-display font-bold text-yellow-900">
      Penjelasan
    </h3>
  </div>
  <p className="text-sm font-body text-gray-800 leading-relaxed">
    {currentQuestion.context_text}
  </p>
</motion.div>
```

### Bottom Card
```tsx
<motion.div className="h-[65%] bg-white rounded-xl p-4 shadow-2xl flex flex-col overflow-hidden">
  {/* Progress bar */}
  {/* Question */}
  {/* Options (4 buttons) */}
</motion.div>
```

---

## ✅ Key Features

1. **Fixed Heights:** No flex-grow, exact percentages
2. **Compact Spacing:** Tighter margins and padding
3. **Readable Text:** Small but legible font sizes
4. **No Scrolling:** Container doesn't scroll
5. **Options Scroll:** Only options scroll if too long
6. **Clean Layout:** Centered, max-width constrained

---

## 🎯 Example Question

### Data
```json
{
  "question": "Apa yang dipakai Rani saat mandi?",
  "context_text": "Rani sedang mandi. Rani memakai sabun agar bersih.",
  "options": ["Sabun", "Sisir", "Baju", "Topi"],
  "correctAnswer": "Sabun"
}
```

### Rendered Layout
```
┌───────────────────────────────────┐
│ 📚 Penjelasan                     │ ← h-[30%]
│ Rani sedang mandi. Rani memakai   │
│ sabun agar bersih.                │
├───────────────────────────────────┤
│ Progress: [████████--] 1/5        │
│                                   │ ← h-[65%]
│ Apa yang dipakai Rani saat mandi? │
│                                   │
│ [A] Sabun                         │
│ [B] Sisir                         │
│ [C] Baju                          │
│ [D] Topi                          │
└───────────────────────────────────┘
```

---

**Perfect fit for Module 4, Meeting 1!** ✅
