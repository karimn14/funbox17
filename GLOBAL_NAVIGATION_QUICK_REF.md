# 🎮 Global Navigation - Quick Reference

## Button Functions

| Physical Button | Input | Function | Usage |
|----------------|-------|----------|-------|
| Red | A | Option A | Select first answer |
| Blue | B | Option B | Select second answer |
| Green | C | Option C | Select third answer |
| Yellow | D | Option D | Select fourth answer |
| **Purple** | **E** | **Next/Enter** | **Advance to next step or confirm** |
| **Black** | **F** | **Back** | **Go to previous step or page** |

## Keyboard Shortcuts (Development)

| Key | Function | Same as Button |
|-----|----------|----------------|
| 1 or A | Option A | Red |
| 2 or B | Option B | Blue |
| 3 or C | Option C | Green |
| 4 or D | Option D | Yellow |
| **5 or E** | **Next/Enter** | **Purple** |
| **6 or F or ESC** | **Back** | **Black** |

## Navigation Flow

### Meeting Structure
```
Story (optional)
  ↓
Video 1 → Video 2 → ... → Video N
  ↓
Activity 1 → Activity 2 → ... → Activity N
  ↓
Quiz Question 1 → Question 2 → ... → Question N
  ↓
Result
  ↓
Home
```

### Back Button (F) Behavior

| Current Location | Press F → Goes To |
|-----------------|-------------------|
| Story | Home |
| Video (first) | Story (if exists) or Home |
| Video (middle/last) | Previous Video |
| Activity (first) | Last Video or Story or Home |
| Activity (middle/last) | Previous Activity |
| Quiz | Last Activity or Last Video or Story or Home |
| Result | Quiz |

### Next Button (E) Behavior

| Current Location | Press E → Goes To |
|-----------------|-------------------|
| Story | First Video or First Activity or Quiz |
| Video (not last) | Next Video |
| Video (last) | First Activity or Quiz |
| Activity (not last) | Next Activity |
| Activity (last) | Quiz |
| Quiz | Submit Answer / Next Question |
| Result | Home |

## Usage in Code

### Import the Hook
```typescript
import { useSerialNavigation } from "@/hooks/use-serial-navigation";
```

### Basic Usage
```typescript
// In any component
useSerialNavigation({
  onBack: () => {
    // Custom back logic
  },
  onNext: () => {
    // Custom next logic
  }
});
```

### Step-Based Navigation (Like MeetingDetail)
```typescript
const handleStepBack = useCallback(() => {
  // Logic to go to previous step
}, [dependencies]);

const handleStepNext = useCallback(() => {
  // Logic to go to next step
}, [dependencies]);

useSerialNavigation({
  onStepBack: handleStepBack,
  onStepNext: handleStepNext,
  currentStep: step,
});
```

### Disable One Direction
```typescript
useSerialNavigation({
  enableGlobalBack: true,
  enableGlobalNext: false, // E button won't do anything
  onBack: handleBack,
});
```

### Access Trigger States Directly
```typescript
const { isNavBackTriggered, isNavNextTriggered } = useSerial();

useEffect(() => {
  if (isNavBackTriggered) {
    // React to back button
  }
}, [isNavBackTriggered]);
```

## Console Debug Messages

### When F is Pressed:
```
🔙 NAV_BACK triggered (F button)
🎯 Executing step-based back navigation
🔙 Global Back - Current step: quiz
```

### When E is Pressed:
```
➡️ NAV_NEXT triggered (E button)
🎯 Executing step-based next navigation
➡️ Global Next - Current step: video
```

### When F/E Pressed During Quiz/Activity:
```
⏭️ Navigation button - handled by global navigation
```

## Common Patterns

### Pattern 1: Simple Page Back
```typescript
useSerialNavigation({
  onBack: () => setLocation("/")
});
```

### Pattern 2: Multi-Step Form
```typescript
const [step, setStep] = useState(0);
const totalSteps = 5;

useSerialNavigation({
  onStepBack: () => {
    if (step > 0) setStep(step - 1);
    else setLocation("/");
  },
  onStepNext: () => {
    if (step < totalSteps - 1) setStep(step + 1);
  },
  currentStep: step.toString(),
});
```

### Pattern 3: Confirm Dialog
```typescript
useSerialNavigation({
  onBack: () => setShowDialog(false),
  onNext: () => handleConfirm(),
});
```

## Testing Checklist

- [ ] F button goes back through steps
- [ ] E button advances through steps
- [ ] F at first step goes to home
- [ ] E at last step completes flow
- [ ] Keyboard shortcuts work (f, e keys)
- [ ] No conflicts with quiz buttons (A-D)
- [ ] Console logs show navigation triggers
- [ ] State resets properly when navigating

## Tips

1. **Always use callbacks**: Wrap handlers in `useCallback` to prevent re-renders
2. **Check current step**: Use step state to determine navigation path
3. **Reset state**: Clear feedback/selections when navigating between steps
4. **Provide fallbacks**: Default to home navigation if no previous step
5. **Log everything**: Use console.log to debug navigation flow

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Button does nothing | Check console for "NAV_BACK/NEXT triggered" |
| Navigates twice | Verify rising edge detection is working |
| Wrong navigation | Check step logic in `handleStepBack/Next` |
| Conflicts with quiz | Ensure handlers filter buttons 4 and 5 |

---

**Quick Start**: Import `useSerialNavigation`, provide `onBack` and `onNext` callbacks, and you're done! 🚀
