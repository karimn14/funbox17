# Module 4, Meeting 2 - Quiz Layout Update Complete ✅

## 🎯 Changes Applied

### Updated Quiz Layout - Top-and-Bottom Stacked View

**Target:** Module 4, Meeting 2 (Kata Sederhana dan Gambar)

---

## 📐 Layout Specifications

### Container
```tsx
className="flex flex-col h-full w-full max-w-2xl mx-auto overflow-hidden gap-4"
```
- ✅ Centered container
- ✅ Max width: 2xl (672px)
- ✅ No scrolling on container
- ✅ 4-unit gap between cards

### Top Card (Context/Penjelasan)
```tsx
className="h-[35%] bg-yellow-50 rounded-xl p-4 shadow-xl overflow-y-auto"
```
- ✅ **Height:** Exactly 35% of viewport
- ✅ **Background:** Yellow-50 (light yellow)
- ✅ **Text Size:** `text-xl` (larger for readability)
- ✅ **Scrollable:** Yes (overflow-y-auto)
- ✅ **Content:** Displays `currentQuestion.context_text`

### Bottom Card (Question & Options)
```tsx
className="h-[60%] bg-white rounded-xl p-4 shadow-2xl flex flex-col overflow-hidden"
```
- ✅ **Height:** Exactly 60% of viewport (to account for gap)
- ✅ **Background:** White
- ✅ **Layout:** Flex column for vertical stacking
- ✅ **Compact Spacing:**
  - Progress bar: `h-1.5` (thinner)
  - Question: `text-base md:text-lg` (compact)
  - Options gap: `gap-2` (tight)
  - Option buttons: `min-h-[40px]` (compact)
  - Image height: `h-24` (if present)

---

## 🎨 Visual Structure

```
┌──────────────────────────────────────┐
│  Fixed Container (max-w-2xl)         │
│  ┌────────────────────────────────┐  │
│  │  TOP CARD (35% height)         │  │
│  │  bg-yellow-50                  │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ 📚 Penjelasan            │  │  │
│  │  │                          │  │  │
│  │  │ Context text (text-xl)   │  │  │
│  │  │ Scrollable if needed     │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
│              gap-4                    │
│  ┌────────────────────────────────┐  │
│  │  BOTTOM CARD (60% height)      │  │
│  │  bg-white                      │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │ Progress (compact)       │  │  │
│  │  ├──────────────────────────┤  │  │
│  │  │ Question (text-base)     │  │  │
│  │  ├──────────────────────────┤  │  │
│  │  │ [A] Sabun (40px min)     │  │  │
│  │  │ [B] Sisir                │  │  │
│  │  │ [C] Baju                 │  │  │
│  │  │ [D] Topi                 │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Condition Check
```typescript
const isModule4Meeting2 = meeting?.moduleId === 99 && meeting?.order === 2;

if (isModule4Meeting2 && hasQuestionContext) {
  // Render stacked layout for Meeting 2
}
```

### Height Distribution
- **Top Card:** 35% (context)
- **Gap:** ~5% (spacing)
- **Bottom Card:** 60% (question + options)

### Text Sizing
- **Context Title:** `text-base` (16px)
- **Context Text:** `text-xl` (20px) - **Larger for better readability**
- **Question:** `text-base md:text-lg` (16px → 18px)
- **Options:** Dynamic (`text-xs` / `text-sm` / `text-base`)

### Spacing (Compact)
- **Card Padding:** `p-4` (16px)
- **Gap between cards:** `gap-4` (16px)
- **Progress bar height:** `h-1.5` (6px)
- **Option gap:** `gap-2` (8px)
- **Option min-height:** `min-h-[40px]`

---

## 📋 Differences from Meeting 1

| Aspect | Meeting 1 | Meeting 2 |
|--------|-----------|-----------|
| Top Card Height | `h-[30%]` | `h-[35%]` ✨ |
| Bottom Card Height | `h-[65%]` | `h-[60%]` |
| Context Text Size | `text-sm` (14px) | `text-xl` (20px) ✨ |
| Purpose | Compact alphabet info | Larger reading passages |

**Meeting 2 uses more space for context** because the reading comprehension passages are longer and need better readability!

---

## 🎯 Key Changes Made

1. **Added Meeting 2 Check**
   ```typescript
   const isModule4Meeting2 = meeting?.moduleId === 99 && meeting?.order === 2;
   ```

2. **Created Separate Layout Block**
   - Complete stacked layout implementation
   - 35% top / 60% bottom split
   - text-xl for context readability

3. **Fixed Meeting 1 Context Text**
   - Changed from `text-xl` to `text-sm` (as originally intended)

4. **Maintained Separation**
   - Meeting 1: 30% / 65% split, text-sm
   - Meeting 2: 35% / 60% split, text-xl

---

## ✅ Testing Checklist

- [x] Layout applies to Module 4, Meeting 2
- [x] Top card is exactly 35% height
- [x] Bottom card is exactly 60% height
- [x] Context text uses text-xl (larger)
- [x] Question fits without scrolling
- [x] 4 options fit in remaining space
- [x] No vertical scrolling on main container
- [x] Options are scrollable if content is long
- [x] Meeting 1 unaffected (still uses 30%/65%)
- [x] TypeScript errors: None

---

## 📸 Sample Quiz Question (Meeting 2)

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
│ 📚 Penjelasan                     │ ← h-[35%]
│                                   │
│ Rani sedang mandi. Rani memakai   │ ← text-xl
│ sabun agar bersih.                │   (larger!)
│                                   │
├───────────────────────────────────┤
│ Progress: [████████--] 1/5        │
│                                   │ ← h-[60%]
│ Apa yang dipakai Rani saat mandi? │
│                                   │
│ [A] Sabun                         │
│ [B] Sisir                         │
│ [C] Baju                          │
│ [D] Topi                          │
└───────────────────────────────────┘
```

---

## 🎉 Summary

**Module 4, Meeting 2** now has its own stacked layout optimized for reading comprehension:
- ✅ **35% context card** with **text-xl** for better readability
- ✅ **60% question card** with compact spacing
- ✅ **Centered, no-scroll** container
- ✅ **Separate from Meeting 1** layout (which uses 30%/65% + text-sm)

Both meetings now have perfectly optimized layouts for their specific content types! 🎯

---

**Status: ✅ COMPLETE**

Module 4 Quiz Layouts:
- **Meeting 1 (Huruf):** 30% top / 65% bottom, text-sm context
- **Meeting 2 (Kata Sederhana):** 35% top / 60% bottom, text-xl context ✨
