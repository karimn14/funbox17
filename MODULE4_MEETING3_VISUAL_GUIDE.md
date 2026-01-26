# Module 4, Meeting 3: Visual Layout Guide

## Layout Comparison: All Module 4 Meetings

### Meeting 1: Alphabet Race (Stacked 30/65)
```
┌─────────────────────────────────────┐
│  Context Panel (30% height)         │
│  ┌───────────────────────────────┐ │
│  │ 📖 Penjelasan                  │ │
│  │ "Dalam alfabet bahasa..."      │ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│  Question Panel (65% height)        │
│  ┌───────────────────────────────┐ │
│  │ Progress: Q1/5 | Score: 0/0   │ │
│  │                                │ │
│  │ Manakah kelompok huruf vokal? │ │
│  │                                │ │
│  │ [A] A, I, U, E, O             │ │
│  │ [B] B, C, D, F, G             │ │
│  │ [C] K, L, M, N, P             │ │
│  │ [D] R, S, T, V, W             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Meeting 2: Reading Race (Stacked 35/60)
```
┌─────────────────────────────────────┐
│  Context Panel (35% height)         │
│  ┌───────────────────────────────┐ │
│  │ 📖 Penjelasan                  │ │
│  │ "Rani sedang mandi.            │ │
│  │  Rani memakai sabun..."        │ │
│  └───────────────────────────────┘ │
├─────────────────────────────────────┤
│  Question Panel (60% height)        │
│  ┌───────────────────────────────┐ │
│  │ Progress: Q1/5 | Score: 0/0   │ │
│  │                                │ │
│  │ Apa yang dipakai Rani?        │ │
│  │                                │ │
│  │ [A] Sabun                     │ │
│  │ [B] Sisir                     │ │
│  │ [C] Baju                      │ │
│  │ [D] Topi                      │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Meeting 3: Memahami Teks (Side-by-Side 40/60) ⭐ NEW
```
┌───────────────────────┬───────────────────────────────────┐
│ Story Panel (40%)     │ Question Panel (60%)              │
│                       │                                   │
│ ┌──────────────────┐ │ Progress: Q1/10 | Score: 0/0     │
│ │ 📖 Bacaan         │ │ ┌──────────────────────────────┐ │
│ │                   │ │ │ Apa tema utama dari narasi?  │ │
│ │ Di sebuah desa    │ │ │                              │ │
│ │ terpencil di kaki │ │ │ [A] Pentingnya teknologi...  │ │
│ │ pegunungan,       │ │ │                              │ │
│ │ hiduplah seorang  │ │ │ [B] Ketekunan seseorang...   │ │
│ │ kakek bernama Pak │ │ │     ✓ CORRECT               │ │
│ │ Aris.             │ │ │                              │ │
│ │                   │ │ │ [C] Kisah persaingan...      │ │
│ │ Selama empat      │ │ │                              │ │
│ │ puluh tahun, ia   │ │ │ [D] Keuntungan ekonomi...    │ │
│ │ secara rutin      │ │ │                              │ │
│ │ mendaki lereng... │ │ └──────────────────────────────┘ │
│ │                   │ │                                   │
│ │ [Scrollable]      │ │                                   │
│ │ ↕                 │ │                                   │
│ │                   │ │                                   │
│ └──────────────────┘ │                                   │
│                       │                                   │
│ Auto-updates Q7:      │                                   │
│ ┌──────────────────┐ │                                   │
│ │ 📖 Bacaan         │ │                                   │
│ │                   │ │                                   │
│ │ Di jantung kota   │ │                                   │
│ │ yang bising,      │ │                                   │
│ │ berdiri sebuah    │ │                                   │
│ │ gedung tua...     │ │                                   │
│ └──────────────────┘ │                                   │
└───────────────────────┴───────────────────────────────────┘
```

## Auto-Context Switching Flow

```
Question 1-6: Story A "Warisan di Kaki Gunung Merapi"
┌────────────────────────────────────────────────────┐
│ Pak Aris plants trees for 40 years                │
│ → Villagers mock him                               │
│ → Forest prevents floods                           │
│ → Grandson continues his legacy                    │
│ → Map of ancient water reservoirs                 │
└────────────────────────────────────────────────────┘
                    ↓
              Answer Q6
                    ↓
         Smooth Transition (motion.div)
                    ↓
Question 7-10: Story B "Gema di Balik Graha Pustaka"
┌────────────────────────────────────────────────────┐
│ Old library building (Graha Pustaka)               │
│ → Government plans demolition                      │
│ → Laras organizes #SaksiBisu campaign             │
│ → Public support grows                             │
│ → Building saved and converted to museum           │
└────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (≥1024px) - Side-by-Side
```css
.container {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
}

.story-panel {
  width: 40%;
}

.question-panel {
  width: 60%;
}
```

### Tablet/Mobile (<1024px) - Stacked
```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.story-panel {
  width: 100%;
  max-height: 40vh; /* Prevent taking entire screen */
}

.question-panel {
  width: 100%;
  flex: 1;
}
```

## Color Scheme

### Story Panel (Left)
- **Background:** White (`bg-white`)
- **Shadow:** Inner shadow (`shadow-inner`)
- **Border Radius:** Large (`rounded-2xl`)
- **Icon:** Blue book (`text-blue-600`)
- **Title:** Dark blue (`text-blue-900`)
- **Text:** Dark gray (`text-gray-700`)
- **Alignment:** Justified (`text-justify`)

### Question Panel (Right)
- **Background:** White (`bg-white`)
- **Shadow:** Extra large (`shadow-2xl`)
- **Border Radius:** Large (`rounded-2xl`)
- **Title:** Primary color (`text-primary`)
- **Options:** GameButton colored (red, blue, green, yellow)

## Animation Details

### Story Panel Transition (Q6 → Q7)
```typescript
<motion.div
  key={`context-${currentQuizIndex}`}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
>
```
- **Effect:** Fade in from left
- **Duration:** ~300ms
- **Trigger:** `currentQuizIndex` change (6 → 7)

### Question Card Transition
```typescript
<motion.div
  key={currentQuizIndex}
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
>
```
- **Effect:** Fade in from right
- **Duration:** ~300ms
- **Trigger:** Every question change

## Text Sizing Logic

### Story Panel
- **Font Size:** Base (`text-base`)
- **Line Height:** Relaxed (`leading-relaxed`)
- **Never changes** - consistent reading experience

### Question Options
```typescript
const textSize = 
  String(option).length > 50 ? 'text-sm' :
  String(option).length > 30 ? 'text-base' :
  'text-lg';
```
- **Long (>50 chars):** Small (`text-sm`)
- **Medium (30-50 chars):** Base (`text-base`)
- **Short (<30 chars):** Large (`text-lg`)

## Why This Layout Works

### ✅ Advantages
1. **Constant Reference:** Story always visible while answering
2. **No Scrolling Back:** Student doesn't lose their place
3. **Professional Interface:** Similar to standardized tests
4. **Better Context:** See full story context for each question
5. **Efficient Use of Space:** 16:9 screens well-utilized
6. **Clear Separation:** Reading vs. Answering are distinct tasks

### 🎯 User Flow
1. Student reads story in left panel (scroll if needed)
2. Reads question in right panel
3. References story without scrolling
4. Selects answer
5. Story auto-updates at Q7 (seamless transition)
6. Continues with new story context

### 📱 Mobile Consideration
- Story panel collapses to top (40% height)
- Question panel takes remaining space
- Student can scroll story if needed
- Touch-friendly button spacing maintained
