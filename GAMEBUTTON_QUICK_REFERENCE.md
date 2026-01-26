# GameButton Component - Quick Style Reference

## Basic Import
```tsx
import { GameButton } from "@/components/ui/GameButton";
```

## Color Map
```tsx
colorIndex: 0 → RED (A)
colorIndex: 1 → BLUE (B)
colorIndex: 2 → GREEN (C)
colorIndex: 3 → YELLOW (D)
colorIndex: 4 → PURPLE (E)
```

## Common Patterns

### Activity Buttons
```tsx
<div className="grid grid-cols-2 gap-4">
  {options.map((option, index) => (
    <GameButton
      key={index}
      letter={String.fromCharCode(65 + index)}
      text={option.text}
      colorIndex={index}
      onClick={() => handleActivityAnswer(index)}
      disabled={activityFeedback.show}
      isSelected={selectedIndices.includes(index)}
    />
  ))}
</div>
```

### Quiz Buttons (Compact)
```tsx
<div className="grid grid-cols-1 gap-2">
  {options.map((option, index) => (
    <GameButton
      letter={String.fromCharCode(65 + index)}
      text={String(option)}
      colorIndex={index}
      onClick={() => handleQuizAnswer(index)}
      disabled={quizFeedback.show}
      className="min-h-[40px] text-sm"
    />
  ))}
</div>
```

### Quiz Buttons (Standard)
```tsx
<div className="grid grid-cols-1 gap-4">
  {options.map((option, index) => (
    <GameButton
      letter={String.fromCharCode(65 + index)}
      text={String(option)}
      colorIndex={index}
      onClick={() => handleQuizAnswer(index)}
      disabled={quizFeedback.show}
      className="min-h-[60px] text-lg"
    />
  ))}
</div>
```

## CSS Classes Override

### Size Variants
- Compact: `className="min-h-[40px] text-xs"`
- Small: `className="min-h-[50px] text-sm"`
- Medium: `className="min-h-[55px] text-base"`
- Standard: `className="min-h-[60px] text-lg"`
- Large: `className="min-h-[70px] text-xl"`

### Custom Gap
- Tight: Add `gap-2` to parent grid
- Normal: Add `gap-3` to parent grid
- Comfortable: Add `gap-4` to parent grid

## Animation States
- **Hover**: Automatically scales to 102%
- **Click**: Automatically scales to 98% and moves down
- **Disabled**: Automatically shows 50% opacity
- **Selected**: Shows white ring (controlled by `isSelected` prop)

## Props Cheat Sheet
```tsx
interface GameButtonProps {
  letter: string;        // Required: "A", "B", "C", etc.
  text: string;          // Required: Answer text
  colorIndex: number;    // Required: 0-4 for colors
  onClick: () => void;   // Required: Click handler
  disabled?: boolean;    // Optional: default false
  isSelected?: boolean;  // Optional: default false
  className?: string;    // Optional: additional classes
}
```

## Common Pitfalls & Solutions

### ❌ Problem: Button text overflows
```tsx
// Don't do this
<GameButton text="Very long text that doesn't fit..." />
```

✅ **Solution:** Add dynamic text sizing
```tsx
const textSize = text.length > 50 ? 'text-xs' : 'text-base';
<GameButton 
  text={text}
  className={textSize}
/>
```

### ❌ Problem: Colors don't match option order
```tsx
// Don't do this
<GameButton colorIndex={Math.random()} />
```

✅ **Solution:** Use array index
```tsx
{options.map((option, index) => (
  <GameButton colorIndex={index} />
))}
```

### ❌ Problem: Letters don't match colors
```tsx
// Don't do this
<GameButton letter="A" colorIndex={2} /> // A is red, not green
```

✅ **Solution:** Keep letter and colorIndex synchronized
```tsx
{options.map((option, index) => (
  <GameButton 
    letter={String.fromCharCode(65 + index)}
    colorIndex={index}
  />
))}
```

## Responsive Design

### Mobile (< 640px)
- Use 1 column grid
- Smaller min-height (40-50px)
- Smaller text (text-sm or text-xs)

### Tablet (640px - 1024px)
- Use 2 column grid for activities
- Medium min-height (50-60px)
- Medium text (text-base)

### Desktop (> 1024px)
- Use 2 column grid for activities
- Larger min-height (60-70px)
- Larger text (text-lg or text-xl)

## Example: Complete Button Section
```tsx
// Activity with 4 options in 2x2 grid
<div className="grid grid-cols-2 gap-4">
  {currentActivity.options.map((option, index) => {
    const isSelected = selectedIndices.includes(index);
    const optionLetter = String.fromCharCode(65 + index);
    
    return (
      <GameButton
        key={index}
        letter={optionLetter}
        text={option.text}
        colorIndex={index}
        onClick={() => handleActivityAnswer(index)}
        disabled={activityFeedback.show}
        isSelected={isSelected}
      />
    );
  })}
</div>
```
