# Module 1, Meeting 2 - Activities Update

## Overview
Updated **Module 1, Meeting 2** ("Penjumlahan Sederhana") with **2 new activity types**:
1. **Text Input Activity** - Type answer validation
2. **Image Grid Activity** - Multi-select image quiz

---

## 📋 Changes Summary

### Activity 1: Text Input
**Type**: `text_input`  
**Instruction**: "Apa saja yang harus dibeli Sani?"  
**Correct Answer**: "kentang dan wortel"

**Features**:
- ✅ Case-insensitive validation (accepts "Kentang dan Wortel", "KENTANG DAN WORTEL", etc.)
- ✅ Whitespace trimming (ignores leading/trailing spaces)
- ✅ Auto-focus on input field
- ✅ Visual feedback (confetti on correct, shake on incorrect)
- ✅ Auto-advance to next activity on correct answer
- ✅ Allows multiple attempts

### Activity 2: Image Grid
**Type**: `image_grid`  
**Layout**: `image_grid` (2x2 grid)  
**Selection Mode**: `multiple`  
**Max Selections**: `2`  
**Instruction**: "Pilih 2 uang yang jika dijumlahkan hasilnya adalah Rp 7.000!"

**Options**:
1. `/assets/money/10000.png` - Rp 10.000 (incorrect)
2. `/assets/money/5000.png` - Rp 5.000 ✓ (correct)
3. `/assets/money/2000.png` - Rp 2.000 ✓ (correct)
4. `/assets/money/20000.png` - Rp 20.000 (incorrect)

**Correct Answer**: Select images at indices `[1, 2]` (Rp 5.000 + Rp 2.000 = Rp 7.000)

**Features**:
- ✅ 2x2 grid layout with equal-sized image containers
- ✅ Multi-select support (up to 2 selections)
- ✅ Visual selection indicators (blue ring + checkmark)
- ✅ Automatic validation after reaching max selections
- ✅ Visual feedback (confetti on correct, shake on incorrect)
- ✅ Auto-advance to quiz on correct answer
- ✅ Allows multiple attempts

---

## 🔧 Technical Implementation

### 1. Schema Changes (`shared/schema.ts`)

#### Text Input Schema
```typescript
const textInputActivitySchema = z.object({
  id: z.number(),
  type: z.literal("text_input"),
  instruction: z.string(),
  correctAnswer: z.string(), // Case-insensitive validation
});
```

#### Image Grid Schema
```typescript
const imageGridActivitySchema = z.object({
  id: z.number(),
  type: z.literal("image_grid"),
  instruction: z.string(),
  layout: z.literal("image_grid"),
  selectionMode: z.enum(["single", "multiple"]),
  maxSelections: z.number().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      imageUrl: z.string(),
      label: z.string(),
      isCorrect: z.boolean(),
    })
  ),
  correctIndices: z.array(z.number()),
});
```

#### Updated Activity Union
```typescript
export const activitySchema = z.discriminatedUnion("type", [
  // ... existing types ...
  textInputActivitySchema,
  imageGridActivitySchema,
]);
```

### 2. Database Seeding (`script/seed-final.ts`)

```typescript
// Activity 1: Text Input
{
  meetingId: meeting2Id,
  type: "text_input",
  instruction: "Apa saja yang harus dibeli Sani?",
  correctAnswer: "kentang dan wortel",
  order: 1,
}

// Activity 2: Image Grid
{
  meetingId: meeting2Id,
  type: "image_grid",
  instruction: "Pilih 2 uang yang jika dijumlahkan hasilnya adalah Rp 7.000!",
  layout: "image_grid",
  selectionMode: "multiple",
  maxSelections: 2,
  options: [
    { id: "money-1", imageUrl: "/assets/money/10000.png", label: "Rp 10.000", isCorrect: false },
    { id: "money-2", imageUrl: "/assets/money/5000.png", label: "Rp 5.000", isCorrect: true },
    { id: "money-3", imageUrl: "/assets/money/2000.png", label: "Rp 2.000", isCorrect: true },
    { id: "money-4", imageUrl: "/assets/money/20000.png", label: "Rp 20.000", isCorrect: false },
  ],
  correctIndices: [1, 2],
  order: 2,
}
```

### 3. Frontend Implementation (`client/src/pages/MeetingDetail.tsx`)

#### State Variables
```typescript
const [textInput, setTextInput] = useState("");
const textInputRef = useRef<HTMLInputElement>(null);
```

#### Text Input Handler
```typescript
const handleTextInputSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  if (currentActivity.type !== "text_input") return;

  const isCorrect = textInput.toLowerCase().trim() === 
                    currentActivity.correctAnswer.toLowerCase().trim();

  if (isCorrect) {
    // Play success sound & confetti
    confetti({/* ... */});
    setFeedback({ show: true, isCorrect: true });
    await sendCommand(currentActivity.id, null, isCorrect);
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false });
      setTextInput("");
      setStep("quiz");
    }, 2000);
  } else {
    // Play error sound & shake
    setFeedback({ show: true, isCorrect: false });
    setTimeout(() => setFeedback({ show: false, isCorrect: false }), 1500);
  }
}, [textInput, currentActivity]);
```

#### Image Grid Handler
```typescript
const handleImageGridSelect = useCallback(async (optionId: string) => {
  if (currentActivity.type !== "image_grid") return;

  const newSelection = selectedOptions.includes(optionId)
    ? selectedOptions.filter(id => id !== optionId) // Deselect
    : [...selectedOptions, optionId]; // Select

  setSelectedOptions(newSelection);

  // Auto-validate when max selections reached
  if (newSelection.length === currentActivity.maxSelections) {
    const selectedIndices = newSelection.map(id =>
      currentActivity.options.findIndex(opt => opt.id === id)
    ).sort();
    
    const isCorrect = JSON.stringify(selectedIndices) === 
                      JSON.stringify([...currentActivity.correctIndices].sort());

    if (isCorrect) {
      // Success flow
      confetti({/* ... */});
      setFeedback({ show: true, isCorrect: true });
      await sendCommand(currentActivity.id, newSelection.join(","), isCorrect);
      
      setTimeout(() => {
        setSelectedOptions([]);
        setStep("quiz");
      }, 2000);
    } else {
      // Error flow
      setFeedback({ show: true, isCorrect: false });
      setTimeout(() => {
        setSelectedOptions([]);
        setFeedback({ show: false, isCorrect: false });
      }, 1500);
    }
  }
}, [selectedOptions, currentActivity, sendCommand]);
```

#### Type Guards (Hardware Button Skip)
```typescript
if (currentActivity.type === 'text_input') {
  console.log("⏭️ Text input activity - hardware buttons disabled");
  return;
}
if (currentActivity.type === 'image_grid') {
  console.log("⏭️ Image grid activity - hardware buttons disabled");
  return;
}
```

---

## 🎨 UI/UX Features

### Text Input Activity
- **Auto-focus**: Input field automatically focused on mount
- **Progress bar**: Shows at top during activity
- **Feedback overlay**: Full-screen success/error messages
- **Confetti animation**: Celebrates correct answers
- **Shake animation**: Visual feedback for incorrect answers
- **Home button**: Allows returning to module selection

### Image Grid Activity
- **2x2 Grid Layout**: Equal-sized containers with aspect ratio preservation
- **Selection Indicators**:
  - Blue ring (`ring-4 ring-blue-500`) around selected images
  - Green checkmark icon overlay on selected images
- **Label Overlays**: Semi-transparent labels at bottom of each image
- **Visual States**:
  - Default: Gray border, white background
  - Selected: Blue ring + checkmark
  - Correct feedback: Green confetti + success overlay
  - Incorrect feedback: Shake animation + error overlay
- **Progress Bar**: Shows at top during activity
- **Home Button**: Allows returning to module selection

---

## 🧪 Testing Guide

### Test Activity 1 (Text Input)

1. **Navigate to Module 1, Meeting 2**
   - Select "Pengenalan Uang & Berhitung"
   - Click "Penjumlahan Sederhana"

2. **Test Case-Insensitive Validation**:
   - Type: `kentang dan wortel` → ✅ Should accept
   - Type: `Kentang dan Wortel` → ✅ Should accept
   - Type: `KENTANG DAN WORTEL` → ✅ Should accept
   - Type: `  kentang dan wortel  ` (with spaces) → ✅ Should accept

3. **Test Incorrect Answers**:
   - Type: `kentang` → ❌ Should show error, allow retry
   - Type: `wortel` → ❌ Should show error, allow retry
   - Type: `random text` → ❌ Should show error, allow retry

4. **Verify Progression**:
   - Correct answer → Should show success overlay → Auto-advance to Activity 2 after 2 seconds

### Test Activity 2 (Image Grid)

1. **Visual Layout**:
   - Verify 2x2 grid of money images
   - Each image should have a label overlay (Rp 10.000, Rp 5.000, etc.)
   - Images should be equal size with proper aspect ratio

2. **Test Selection Logic**:
   - Click Rp 10.000 → Selection ring + checkmark appears
   - Click Rp 5.000 → Second selection appears
   - After 2 selections → Auto-validation occurs

3. **Test Correct Answer**:
   - Select: Rp 5.000 + Rp 2.000 → ✅ Should show success, confetti, auto-advance to quiz

4. **Test Incorrect Answers**:
   - Select: Rp 10.000 + Rp 5.000 → ❌ Should shake, show error, clear selections
   - Select: Rp 2.000 + Rp 20.000 → ❌ Should shake, show error, clear selections
   - Select: Rp 10.000 + Rp 20.000 → ❌ Should shake, show error, clear selections

5. **Test Deselection**:
   - Click Rp 5.000 → Selection appears
   - Click Rp 5.000 again → Selection removed
   - Should allow reselecting different images

6. **Verify Progression**:
   - Correct answer → Success overlay → Auto-advance to quiz after 2 seconds

### Test Hardware Buttons

1. **Text Input Activity**:
   - Hardware buttons (if connected) should be disabled
   - Console should log: "⏭️ Text input activity - hardware buttons disabled"

2. **Image Grid Activity**:
   - Hardware buttons (if connected) should be disabled
   - Console should log: "⏭️ Image grid activity - hardware buttons disabled"

---

## 📁 Asset Requirements

### Money Images (for Image Grid)
Required images in `/public/assets/money/`:
- `10000.png` - Rp 10.000 banknote
- `5000.png` - Rp 5.000 banknote
- `2000.png` - Rp 2.000 banknote
- `20000.png` - Rp 20.000 banknote

**Image specs**:
- Format: PNG with transparency
- Recommended size: 400x200px
- Aspect ratio: 2:1 (standard banknote)

---

## 🐛 Known Issues & Solutions

### Issue: TypeScript errors on discriminated union
**Solution**: Added type guards before accessing type-specific properties:
```typescript
if (currentActivity.type === 'text_input') return;
if (currentActivity.type === 'image_grid') return;
```

### Issue: Hardware buttons trying to handle new activity types
**Solution**: Skip hardware button handling for `text_input` and `image_grid` types in `handleActivityAnswer`.

---

## 🔄 Migration Notes

### From Previous Version
**Activity 1**: 
- **Before**: `type: "button"` with `imageUrl: "/assets/vegetables/potato.png"`
- **After**: `type: "text_input"` with `correctAnswer: "kentang dan wortel"`
- **Impact**: Users now type answer instead of clicking button

**Activity 2**:
- **Before**: `type: "button"` with single money image
- **After**: `type: "image_grid"` with 4 money images, multi-select
- **Impact**: Users select 2 images instead of 1

### Database Reset Required
- Run `npm run db:seed` to apply changes
- All existing progress for Module 1 Meeting 2 will be reset

---

## 📚 Related Documentation

- [Schema Reference](./shared/schema.ts) - Activity type definitions
- [Seed Script](./script/seed-final.ts) - Database seeding
- [Meeting Detail Page](./client/src/pages/MeetingDetail.tsx) - Frontend implementation

---

## ✅ Completion Checklist

- [x] Schema updated with new activity types
- [x] Seed script updated with new activities
- [x] Frontend state variables added
- [x] Text input handler implemented
- [x] Image grid handler implemented
- [x] Type guards added for hardware buttons
- [x] TypeScript errors resolved
- [x] Database reseeded
- [ ] Manual testing completed
- [ ] Assets verified (money images)

---

**Last Updated**: 2025-01-XX  
**Status**: ✅ Implementation Complete, Ready for Testing
