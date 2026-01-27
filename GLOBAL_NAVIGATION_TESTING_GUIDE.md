# 🧪 Global Navigation - Testing Guide

## Pre-Testing Checklist

- [ ] Code deployed to development environment
- [ ] Serial port connection working
- [ ] FunBox hardware connected (or keyboard for simulation)
- [ ] Browser console open for debug logs
- [ ] Test meeting created with videos, activities, and quiz

## Test Scenarios

### Scenario 1: Basic Navigation Flow (Happy Path)

**Setup**: Meeting with 2 videos, 2 activities, 3 quiz questions

**Steps**:
1. Open meeting
2. Verify starts at Video 1
3. Press **E** → Should advance to Video 2
4. Press **E** → Should advance to Activity 1
5. Answer activity (Press A/B/C/D)
6. Press **E** → Should advance to Activity 2
7. Answer activity (Press A/B/C/D)
8. Press **E** → Should advance to Quiz Question 1
9. Answer quiz (Press A/B/C/D)
10. Auto-advance to Question 2
11. Answer quiz
12. Auto-advance to Question 3
13. Answer quiz
14. Should show Result screen
15. Press **E** → Should return to Home

**Expected Console Logs**:
```
➡️ NAV_NEXT triggered (E button)
🎯 Executing step-based next navigation
➡️ Global Next - Current step: video
```

### Scenario 2: Backward Navigation

**Setup**: Same meeting, currently at Quiz

**Steps**:
1. Navigate to Quiz (using Scenario 1)
2. Press **F** → Should go back to Activity 2
3. Press **F** → Should go back to Activity 1
4. Press **F** → Should go back to Video 2
5. Press **F** → Should go back to Video 1
6. Press **F** → Should go back to Home

**Expected Console Logs**:
```
🔙 NAV_BACK triggered (F button)
🎯 Executing step-based back navigation
🔙 Global Back - Current step: quiz
```

### Scenario 3: Skip Empty Sections

**Setup**: Meeting with ONLY videos (no activities)

**Steps**:
1. Open meeting
2. Watch last video
3. Press **E** → Should skip activities, go directly to Quiz

**Setup**: Meeting with ONLY quiz (no videos, no activities)

**Steps**:
1. Open meeting
2. Should start directly at Quiz
3. Press **F** → Should go back to Home (no previous steps)

### Scenario 4: Multiple Items Navigation

**Setup**: Meeting with 5 videos

**Steps**:
1. Start at Video 1
2. Press **E** 4 times → Should cycle through all 5 videos
3. Press **F** 4 times → Should return to Video 1
4. Verify video index updates correctly

### Scenario 5: State Reset on Navigation

**Setup**: Meeting with activities

**Steps**:
1. Start Activity 1
2. Select wrong answer → See red feedback
3. Press **E** → Go to Activity 2
4. Verify feedback is cleared
5. Press **F** → Go back to Activity 1
6. Verify feedback is cleared and can answer again

### Scenario 6: Button Separation (A-D vs E-F)

**Setup**: Quiz question with 4 options

**Steps**:
1. At quiz question
2. Press **A** → Should select Option A (Red)
3. Verify quiz logic processes it (not navigation)
4. Press **F** → Should navigate back (not select option)
5. Return to quiz
6. Press **E** → Should NOT answer quiz (navigation disabled in quiz)
7. Press **B** → Should select Option B (Blue)

### Scenario 7: Keyboard Simulation

**Setup**: Any meeting, development mode

**Steps**:
1. Open meeting
2. Press **'e'** key → Should trigger NAV_NEXT
3. Press **'f'** key → Should trigger NAV_BACK
4. Press **'5'** key → Should trigger NAV_NEXT
5. Press **'6'** key → Should trigger NAV_BACK
6. Press **'ESC'** key → Should trigger NAV_BACK

### Scenario 8: Edge Detection (No Duplicates)

**Setup**: Any meeting

**Steps**:
1. Open meeting
2. Press **E** and hold for 2 seconds
3. Verify navigation only happens once
4. Release and press again
5. Verify navigation happens again

**Expected**: Rising edge detection prevents duplicate triggers while button held

### Scenario 9: Result Screen Navigation

**Setup**: Complete a quiz

**Steps**:
1. Complete quiz → See Result screen
2. Press **F** → Should go back to Quiz
3. Complete quiz again → See Result screen
4. Press **E** → Should return to Home

### Scenario 10: Story Integration

**Setup**: Meeting with Story, Videos, Activities, Quiz

**Steps**:
1. Start at Story
2. Press **E** → Go to Video 1
3. Press **F** → Go back to Story
4. Press **F** → Go back to Home
5. Open meeting again
6. From Story, press **E** multiple times
7. Verify flows: Story → Videos → Activities → Quiz

## Hardware Testing Checklist

### FunBox Hardware Buttons

- [ ] **Red Button (A)** - Selects Option A
- [ ] **Blue Button (B)** - Selects Option B
- [ ] **Green Button (C)** - Selects Option C
- [ ] **Yellow Button (D)** - Selects Option D
- [ ] **Purple Button (E)** - Navigates Next/Forward
- [ ] **Black Button (F)** - Navigates Back

### Serial Communication

- [ ] Connect FunBox via USB
- [ ] Open browser, click "Connect" button
- [ ] Grant serial port permissions
- [ ] Press each button, verify console shows correct input:
  - A → "INPUT: A" or "A"
  - B → "INPUT: B" or "B"
  - C → "INPUT: C" or "C"
  - D → "INPUT: D" or "D"
  - E → "INPUT: E" or "E"
  - F → "INPUT: F" or "F"

## Debug Checklist

### Console Logs to Verify

**When pressing E**:
```
✅ Parsed Command: "E"
✅ Mapped 'E' → NAV_NEXT (Global Next/Enter)
➡️ NAV_NEXT triggered (E button)
🎯 Executing step-based next navigation
➡️ Global Next - Current step: video
```

**When pressing F**:
```
✅ Parsed Command: "F"
✅ Mapped 'F' → NAV_BACK (Global Back)
🔙 NAV_BACK triggered (F button)
🎯 Executing step-based back navigation
🔙 Global Back - Current step: activity
```

**When pressing A/B/C/D during quiz**:
```
✅ Parsed Command: "A"
✅ Mapped 'A' → Button Index 0 (Red)
(Quiz answer logic executes)
```

**When pressing E/F during quiz**:
```
✅ Parsed Command: "E"
✅ Mapped 'E' → NAV_NEXT (Global Next/Enter)
⏭️ Navigation button - handled by global navigation
(Quiz does NOT process E as answer)
```

## Common Issues & Solutions

### Issue 1: Button Does Nothing
**Symptoms**: Pressing E or F has no effect

**Debug Steps**:
1. Check console for "NAV_NEXT/NAV_BACK triggered"
2. If not present → Serial parsing issue
3. If present → Navigation logic issue

**Solution**:
- Verify `useSerialNavigation` is called in component
- Check `handleStepBack` and `handleStepNext` are defined
- Verify callbacks are in useCallback

### Issue 2: Navigation Triggers Twice
**Symptoms**: Pressing E once advances two steps

**Debug Steps**:
1. Check for "Skipping duplicate serial data processing"
2. Verify `prevBackRef` and `prevNextRef` in hook

**Solution**:
- Rising edge detection should prevent this
- Check if button is being processed multiple times
- Verify debounce logic in serial parser

### Issue 3: Wrong Navigation Path
**Symptoms**: Pressing F doesn't go to expected step

**Debug Steps**:
1. Check console: "Global Back - Current step: X"
2. Verify step state matches expectation
3. Check content structure (videos, activities arrays)

**Solution**:
- Review `handleStepBack` logic for current step
- Verify indices are correctly managed
- Check if content sections exist

### Issue 4: Conflicts with Quiz Buttons
**Symptoms**: Pressing E during quiz selects an answer

**Debug Steps**:
1. Check if "Navigation button - handled by global navigation" appears
2. Verify `handleQuizAnswer` filters buttons 4 and 5

**Solution**:
- Ensure handlers check `if (buttonIndex === 4 || buttonIndex === 5) return;`
- Verify navigation doesn't interfere with answer selection

### Issue 5: State Not Resetting
**Symptoms**: Feedback persists when navigating

**Debug Steps**:
1. Check if `setActivityFeedback({ show: false, isCorrect: false })` is called
2. Verify state reset in navigation handlers

**Solution**:
- Add state reset in `handleStepBack` and `handleStepNext`
- Clear feedback before changing steps

## Performance Testing

### Response Time
- [ ] Button press to navigation: < 100ms
- [ ] State update to render: < 50ms
- [ ] Total navigation time: < 150ms

### Memory Leaks
- [ ] Open meeting
- [ ] Navigate back and forth 20 times
- [ ] Check browser memory usage (should remain stable)
- [ ] Check for unmounted component warnings

### Edge Cases
- [ ] Rapidly press E 10 times → Should handle gracefully
- [ ] Press E and F simultaneously → Should handle one at a time
- [ ] Navigate while video playing → Video should stop/resume correctly
- [ ] Navigate while activity showing feedback → Feedback should clear

## User Acceptance Criteria

- [ ] Students can navigate forward with E button naturally
- [ ] Students can navigate backward with F button naturally
- [ ] Navigation feels intuitive and responsive
- [ ] No confusion between navigation and answer buttons
- [ ] State resets appropriately when navigating
- [ ] Works consistently across all meeting types

## Sign-Off

**Tested By**: _________________
**Date**: _________________
**Hardware Used**: _________________
**Test Result**: [ ] Pass [ ] Fail
**Notes**:

_______________________________________
_______________________________________
_______________________________________

---

**Status**: Ready for testing
**Version**: 1.0
**Last Updated**: January 26, 2026
