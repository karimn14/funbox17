# Module 4 Quiz Layouts - Side-by-Side Comparison

## 📊 Overview

Module 4 now has **two different stacked quiz layouts** optimized for different content types.

---

## 🔀 Layout Comparison

### Meeting 1: Huruf (Alphabet)
```
┌─────────────────────────┐
│  Context (30%)          │ ← text-sm (compact)
│  Short alphabet info    │
├─────────────────────────┤
│  Question (65%)         │
│  - Progress             │
│  - Question             │
│  - 4 Options            │
└─────────────────────────┘
```

**Use Case:** Short context snippets about alphabet rules
**Text Size:** `text-sm` (14px) - compact for brief explanations

---

### Meeting 2: Kata Sederhana (Reading)
```
┌─────────────────────────┐
│  Context (35%)          │ ← text-xl (larger)
│  Reading passage        │
│  More space for text    │
├─────────────────────────┤
│  Question (60%)         │
│  - Progress             │
│  - Question             │
│  - 4 Options            │
└─────────────────────────┘
```

**Use Case:** Longer reading comprehension passages
**Text Size:** `text-xl` (20px) - larger for better readability

---

## 📐 Technical Specs

| Feature | Meeting 1 | Meeting 2 |
|---------|-----------|-----------|
| **Module ID** | 99 | 99 |
| **Order** | 1 | 2 |
| **Top Card Height** | `h-[30%]` | `h-[35%]` |
| **Bottom Card Height** | `h-[65%]` | `h-[60%]` |
| **Context Text** | `text-sm` (14px) | `text-xl` (20px) |
| **Context BG** | `bg-yellow-50` | `bg-yellow-50` |
| **Gap** | `gap-4` | `gap-4` |
| **Container** | `max-w-2xl` | `max-w-2xl` |

---

## 🎯 Design Rationale

### Meeting 1 (30% / 65%, text-sm)
**Why compact context?**
- Alphabet rules are brief
- More space needed for question + options
- Quick reading, fast comprehension

**Example Context:**
```
"Dalam alfabet bahasa Indonesia, huruf vokal adalah 
huruf yang melambangkan fonem tanpa hambatan."
```
(Short, concise explanation)

---

### Meeting 2 (35% / 60%, text-xl)
**Why larger context?**
- Reading comprehension passages are longer
- Need better readability for young learners
- More comfortable reading experience

**Example Context:**
```
"Rani sedang mandi. Rani memakai sabun agar bersih."
```
(Simple but needs clarity for comprehension)

---

## 🔧 Implementation

### Condition Checks
```typescript
// Meeting 1
const isModule4Meeting1 = meeting?.moduleId === 99 && meeting?.order === 1;

if (isModule4Meeting1 && hasQuestionContext) {
  // Render 30/65 layout with text-sm
}

// Meeting 2
const isModule4Meeting2 = meeting?.moduleId === 99 && meeting?.order === 2;

if (isModule4Meeting2 && hasQuestionContext) {
  // Render 35/60 layout with text-xl
}
```

---

## 📱 Visual Examples

### Meeting 1 Example
```
┌─────────────────────────────────┐
│ 📚 Penjelasan                   │
│ Huruf vokal adalah A, I, U,     │ ← text-sm
│ E, O.                           │   (compact)
├─────────────────────────────────┤
│ Q: Manakah huruf vokal?         │
│                                 │
│ [A] A, I, U, E, O ✅            │
│ [B] B, C, D, F, G               │
│ [C] K, L, M, N, P               │
│ [D] R, S, T, V, W               │
└─────────────────────────────────┘
```

### Meeting 2 Example
```
┌─────────────────────────────────┐
│ 📚 Penjelasan                   │
│                                 │
│ Rani sedang mandi.              │ ← text-xl
│ Rani memakai sabun              │   (larger)
│ agar bersih.                    │
│                                 │
├─────────────────────────────────┤
│ Q: Apa yang dipakai Rani?      │
│                                 │
│ [A] Sabun ✅                    │
│ [B] Sisir                       │
│ [C] Baju                        │
│ [D] Topi                        │
└─────────────────────────────────┘
```

---

## 🎨 CSS Classes

### Meeting 1 (Top Card)
```tsx
className="h-[30%] bg-yellow-50 rounded-xl p-4 shadow-xl overflow-y-auto"

// Context text
className="text-sm font-body text-gray-800 leading-relaxed"
```

### Meeting 2 (Top Card)
```tsx
className="h-[35%] bg-yellow-50 rounded-xl p-4 shadow-xl overflow-y-auto"

// Context text
className="text-xl font-body text-gray-800 leading-relaxed"
```

---

## ✅ Benefits

### Meeting 1 Layout Benefits
- ✅ Maximizes space for options
- ✅ Quick scanning of context
- ✅ More room for complex questions
- ✅ Efficient use of screen space

### Meeting 2 Layout Benefits
- ✅ Better readability for passages
- ✅ Comfortable reading experience
- ✅ Larger text = easier comprehension
- ✅ More space for context = better understanding

---

## 🎯 When to Use Each

### Use 30/65 Layout (Meeting 1 Style)
- ✅ Short context snippets
- ✅ Technical explanations
- ✅ Rule definitions
- ✅ Brief introductions
- ✅ When options need more space

### Use 35/60 Layout (Meeting 2 Style)
- ✅ Reading comprehension passages
- ✅ Story excerpts
- ✅ Dialogue transcripts
- ✅ Longer contextual information
- ✅ When readability is priority

---

## 📊 Space Allocation

### Meeting 1: 30/65 Split
```
Context:  30% = ~220px (on 1080p screen)
Gap:       5% = ~ 35px
Question: 65% = ~475px
─────────────────────────
Total:   100% = ~730px usable
```

### Meeting 2: 35/60 Split
```
Context:  35% = ~255px (on 1080p screen)
Gap:       5% = ~ 35px
Question: 60% = ~440px
─────────────────────────
Total:   100% = ~730px usable
```

**Meeting 2 gives +35px to context, perfect for 1-2 extra lines!**

---

## 🚀 Future Considerations

If you need to add **Meeting 3 or 4** to Module 4:

### Suggested Layouts

**Meeting 3: Cerita Pendek**
- Use 40/55 split
- text-xl or text-2xl for stories
- Even more space for narrative content

**Meeting 4: Instruksi**
- Use 25/70 split
- text-base for instructions
- More space for step-by-step questions

---

**Both layouts are now live and optimized!** ✅

Choose the right layout based on your content type:
- **Short context** → 30/65 (Meeting 1)
- **Long passages** → 35/60 (Meeting 2)
