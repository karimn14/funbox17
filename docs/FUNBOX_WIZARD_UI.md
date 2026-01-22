# FunBox Learning Wizard - ModuleDetail.tsx

## 🎮 Overview

The `ModuleDetail.tsx` page has been completely rebuilt to implement the **FunBox Learning Wizard** - an interactive, step-by-step learning experience designed specifically for Special Education students (Tunagrahita).

## 📊 Learning Flow

```
Opening → Video → Activity → Quiz → Closing
```

### 5-Step Wizard States

1. **Opening** - Introduction and motivation
2. **Video** - Educational video with 5-second timer
3. **Activity** - Interactive colored button challenge (hardware simulation)
4. **Quiz** - Sequential multiple-choice questions
5. **Closing** - Results, score, and celebration

## 🎨 UI Design Principles

### Accessibility for Special Ed Students

- ✅ **Large Fonts**: 2xl to 5xl text sizes
- ✅ **High Contrast**: Bold colors with clear borders
- ✅ **Rounded Corners**: 2rem to 3rem border radius
- ✅ **Pastel Colors**: Soft, playful color palette
- ✅ **Clear Feedback**: Immediate visual/audio responses
- ✅ **Simple Navigation**: Linear progression, minimal choices
- ✅ **Animations**: Smooth transitions with Framer Motion

## 🔧 Technical Implementation

### State Management

```typescript
const [step, setStep] = useState<Step>('opening');
const [selectedColor, setSelectedColor] = useState<number | null>(null);
const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
const [score, setScore] = useState(0);
const [stars, setStars] = useState(0);
```

### Data Fetching

- Uses `useModule(id)` hook with TanStack Query
- Safely parses `module.content` (ModuleContent type)
- Falls back gracefully if content is missing

### Hardware Integration

- Uses `useWebSerial()` hook for button simulation
- Maps keyboard keys (A/B/C/D or 1/2/3/4) to colors
- Automatically selects color when button is pressed

## 📝 Step-by-Step Breakdown

### 1. Opening Step

**Purpose**: Motivate and introduce the lesson

**UI Elements**:
- Animated bouncing icon (Sparkles)
- Module title (4xl-5xl font)
- Opening text from content
- Large "Mulai" button

**Colors**:
- Background: Gradient from blue-50 to purple-50
- Button: Primary color with shadow
- Border: 4px white with primary ring

**Animations**:
- Fade in + slide up
- Icon bounce animation

### 2. Video Step

**Purpose**: Educational content delivery

**UI Elements**:
- ReactPlayer component (full width, auto-play)
- 5-second timer button
- "Lanjut" button (disabled initially)

**Features**:
- ✅ Video autoplays when step loads
- ✅ "Next" button disabled for 5 seconds
- ✅ Timer counts down (5...4...3...2...1)
- ✅ Button enables after timer completes
- ✅ Video can be rewatched

**Timer Logic**:
```typescript
useEffect(() => {
  if (step === 'video' && !canProceedFromVideo) {
    const timer = setInterval(() => {
      setVideoTimer((prev) => {
        if (prev <= 1) {
          setCanProceedFromVideo(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [step, canProceedFromVideo]);
```

### 3. Activity Step

**Purpose**: Interactive hardware button challenge

**UI Elements**:
- Title: "Aktivitas Tombol 🎮"
- Instruction text (2xl-3xl font)
- 2x2 grid of colored buttons
- Black "JAWAB" submit button
- Feedback message

**Color Button Grid**:
```tsx
{content.activity.options.map((option, idx) => (
  <button
    className={`bg-${option.color}-500 aspect-square rounded-3xl`}
    onClick={() => setSelectedColor(idx)}
  >
    {option.text}
  </button>
))}
```

**Colors**:
- 🔴 Red: `bg-red-500` / `ring-red-300`
- 🔵 Blue: `bg-blue-500` / `ring-blue-300`
- 🟢 Green: `bg-green-500` / `ring-green-300`
- 🟡 Yellow: `bg-yellow-400` / `ring-yellow-300`

**Interaction Flow**:
1. User clicks colored button (or presses A/B/C/D)
2. Selected button scales up and shows ring
3. User clicks black "JAWAB" button
4. System checks if `selectedColor === correctIndex`
5. Shows feedback (correct/incorrect)
6. Confetti animation if correct
7. Auto-proceeds to quiz after 2 seconds

**Hardware Simulation**:
- Keyboard: A=Red, B=Blue, C=Green, D=Yellow
- Also: 1=Red, 2=Blue, 3=Green, 4=Yellow

### 4. Quiz Step

**Purpose**: Assess comprehension

**UI Elements**:
- Question counter badge
- Question text (3xl-4xl font)
- 4 answer buttons in grid layout
- Letter badges (A/B/C/D)

**Features**:
- ✅ One question at a time
- ✅ Sequential progression
- ✅ No back navigation
- ✅ Immediate answer recording
- ✅ Score calculation on completion

**Answer Button Style**:
- Background: Gradient (blue-50 to purple-50)
- Hover: Darker gradient
- Border: 4px gray-200, hover to primary
- Padding: 6 (p-6)
- Rounded: 3xl

**Scoring Logic**:
```typescript
let correctCount = 0;
content.quiz.forEach((q, idx) => {
  if (quizAnswers[idx] === q.correctAnswer) {
    correctCount++;
  }
});

const finalScore = Math.round((correctCount / content.quiz.length) * 100);
const finalStars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : 1;
```

### 5. Closing Step

**Purpose**: Celebration and results

**UI Elements**:
- Animated checkmark icon
- Closing text from content
- Score display (large numbers)
- Star rating (⭐⭐⭐)
- "Selesai" button

**Score Display**:
- Background: White card with shadow
- Score: 6xl font, primary color
- Stars: 5xl emoji, filled based on performance

**Star System**:
- ⭐⭐⭐ = 80% or higher
- ⭐⭐ = 60-79%
- ⭐ = Below 60%

**Celebration**:
- Confetti animation on entry
- Animated bounce on checkmark
- Gradient background (green-50 to blue-50)

## 🎯 Progress Indicator

At the top of every screen:

```tsx
<div className="flex gap-2">
  {steps.map((s, idx) => (
    <div className={`h-2 w-12 rounded-full ${
      s === step ? 'bg-primary' :  // Current step
      isCompleted(s) ? 'bg-green-400' :  // Completed
      'bg-gray-200'  // Not reached
    }`} />
  ))}
</div>
```

## 🔄 Data Flow

```
1. Load module data (useModule hook)
2. Extract content (ModuleContent type)
3. Parse opening/video/activity/quiz/closing
4. Track user interactions
5. Calculate score
6. Submit to backend (submitQuiz mutation)
7. Invalidate student history cache
```

## 🎨 Color Palette

### Primary Colors
- **Primary**: `hsl(326 100% 74%)` - Hot Pink
- **Secondary**: `hsl(172 66% 50%)` - Teal
- **Accent**: `hsl(38 100% 65%)` - Orange

### Activity Colors
- **Red**: `#ef4444` (red-500)
- **Blue**: `#3b82f6` (blue-500)
- **Green**: `#22c55e` (green-500)
- **Yellow**: `#facc15` (yellow-400)

### Feedback Colors
- **Success**: green-100 bg, green-800 text
- **Error**: red-100 bg, red-800 text
- **Info**: blue-100 bg, blue-800 text

## 📱 Responsive Design

### Breakpoints
- Mobile: Default styles
- Desktop (md): Larger fonts, wider layout

### Font Sizes
- Mobile: text-2xl to text-4xl
- Desktop: text-3xl to text-5xl

## ✨ Animations

### Framer Motion Variants

**Step Transitions**:
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
```

**Quiz Progression**:
```typescript
initial={{ opacity: 0, x: 50 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -50 }}
```

**Closing Celebration**:
```typescript
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
```

### Confetti Triggers
- Activity correct answer
- Quiz completion (all questions answered)

## 🐛 Error Handling

### Missing Content
```typescript
if (!content) {
  return <ErrorMessage />;
}
```

### Loading State
```typescript
if (isLoading || !module) {
  return <LoadingSpinner />;
}
```

### Network Errors
- Handled by TanStack Query
- Automatic retries
- Error boundaries

## 🎮 Keyboard Controls

### Activity Step
- `A` or `1` → Select Red
- `B` or `2` → Select Blue
- `C` or `3` → Select Green
- `D` or `4` → Select Yellow

### Navigation
- None (linear progression only)

## 📊 Performance

### Optimizations
- Component memoization for expensive renders
- Lazy loading for heavy components
- Debounced state updates
- Efficient re-renders with proper dependencies

### Bundle Size
- react-player: Code-split
- confetti: Dynamically imported
- framer-motion: Tree-shaken

## 🧪 Testing

### Manual Test Checklist
- [ ] Opening displays correctly
- [ ] Video plays and timer works
- [ ] Activity buttons respond to clicks/keys
- [ ] Activity validation works
- [ ] Quiz progresses correctly
- [ ] Score calculation is accurate
- [ ] Closing displays score and stars
- [ ] Backend submission succeeds
- [ ] Navigation works throughout

### Edge Cases
- Missing content field
- Invalid module ID
- Network failures
- No active student

## 📚 Dependencies

```json
{
  "wouter": "Router",
  "@tanstack/react-query": "Data fetching",
  "framer-motion": "Animations",
  "react-player": "Video playback",
  "canvas-confetti": "Celebrations",
  "lucide-react": "Icons"
}
```

## 🚀 Usage

```typescript
// In Dashboard.tsx
<Link to={`/module/${module.id}`}>
  {module.title}
</Link>

// URL: /module/1
// Renders: ModuleDetail component with FunBox wizard
```

## 📝 Future Enhancements

- [ ] Audio narration for instructions
- [ ] Background music toggle
- [ ] Hint system for struggling students
- [ ] Replay/review mode
- [ ] Progress save/resume
- [ ] Parent/teacher analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode

## ✅ Accessibility Checklist

- [x] Large, readable fonts
- [x] High contrast colors
- [x] Clear visual feedback
- [x] Simple, linear progression
- [x] Keyboard navigation
- [x] Touch-friendly buttons
- [x] Error messages in plain language
- [x] Positive reinforcement
