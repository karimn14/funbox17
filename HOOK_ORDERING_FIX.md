# Hook Ordering Fix - MeetingDetail.tsx ✅

## 🐛 **Problem Identified**

**Error:** "Rendered more hooks than during the previous render"

**Root Cause:**
The component had a **conditional hook call** that violated the Rules of Hooks. Specifically:

1. **Early returns at lines 470, 482, 501** (loading, no meeting, no content states)
2. **`useEffect` hook at line 779** was placed INSIDE the `if (step === 'video')` render block

This meant:
- When `isLoading === true`: Component returns early → Only ~15 hooks called
- When `isLoading === false` AND `step === 'video'`: Component runs past early returns AND executes the conditional useEffect → ~16 hooks called

**React's Rule:** The number of hooks must be identical on every render, regardless of conditions.

---

## ✅ **Solution Applied**

### **1. Moved Conditional Hook to Top Level**

**Before (LINE 779 - WRONG):**
```tsx
if (step === 'video') {
  // ... video rendering logic
  
  // Auto-focus input when number_input popup appears
  useEffect(() => {  // ❌ CONDITIONAL HOOK!
    if (showPopup && currentPopup?.type === 'number_input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopup, currentPopup]);

  return (/* video JSX */);
}
```

**After (LINE 470 - CORRECT):**
```tsx
// Auto-focus input when number_input popup appears (VIDEO STEP)
useEffect(() => {  // ✅ UNCONDITIONAL HOOK!
  if (step === 'video' && showPopup && currentPopup?.type === 'number_input' && inputRef.current) {
    inputRef.current.focus();
  }
}, [step, showPopup, currentPopup]);

// Improved Loading State Check
if (isLoading) {
  return (/* loading JSX */);
}
```

### **2. Added Step Check Inside Hook**

Instead of conditionally calling the hook, we now:
1. **Always call** the hook (every render)
2. **Conditionally execute** the hook's logic based on `step === 'video'`

This ensures the hook count remains constant.

---

## 📋 **Verification Checklist**

- ✅ All hooks (`useState`, `useRef`, `useEffect`, `useCallback`, `useMeeting`, `useRecordProgress`, `useSerial`) are at the top of the component
- ✅ All hooks are called unconditionally (before any `if`/`return` statements)
- ✅ Early returns (loading, error states) are placed AFTER all hooks
- ✅ No compilation errors
- ✅ Hook dependency array updated to include `step`

---

## 🔍 **Hook Order (Final Structure)**

```tsx
export default function MeetingDetail() {
  // 1️⃣ HOOKS - ALWAYS FIRST (Lines 108-475)
  const { meetingId } = useParams();
  const [_, setLocation] = useLocation();
  const { data: meeting, isLoading } = useMeeting(Number(meetingId));
  const recordProgress = useRecordProgress();
  const { activeButton, sendCommand } = useSerial();
  const [step, setStep] = useState<Step>('video');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  // ... all other state hooks
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // ... more refs
  const student = getActiveStudent();
  const content: MeetingContent | null = meeting?.content || null;
  
  // All useEffect hooks
  useEffect(() => { /* debug logging */ }, [meeting, content, isLoading, step]);
  useEffect(() => { /* auto-skip to quiz */ }, [meeting, content, isLoading]);
  
  // All useCallback hooks
  const handleActivityAnswer = useCallback((buttonIndex: number) => { /* ... */ }, [/* deps */]);
  const handleQuizAnswer = useCallback((buttonIndex: number) => { /* ... */ }, [/* deps */]);
  
  // More useEffect hooks
  useEffect(() => { /* hardware button handler */ }, [activeButton, step, activityFeedback.show]);
  useEffect(() => { /* hardware button handler */ }, [activeButton, step, quizFeedback.show]);
  useEffect(() => { /* video cleanup */ }, [step, currentVideoIndex]);
  useEffect(() => { /* reset selections */ }, [currentActivityIndex, step]);
  useEffect(() => { /* auto-focus number input */ }, [step, showPopup, currentPopup]); // ⭐ MOVED HERE

  // 2️⃣ EARLY RETURNS - AFTER ALL HOOKS (Lines 477-527)
  if (isLoading) return <LoadingScreen />;
  if (!meeting) return <ErrorScreen />;
  if (!content) return <ContentMissingScreen />;

  // 3️⃣ RENDER LOGIC - LAST (Lines 529+)
  if (step === 'opening') return <OpeningScreen />;
  if (step === 'story') return <StoryScreen />;
  if (step === 'video') {
    // Video rendering logic
    // NO MORE HOOKS HERE! ✅
    return <VideoScreen />;
  }
  // ... more render logic
}
```

---

## 🎓 **Rules of Hooks Reminder**

1. **Only call hooks at the top level**
   - ❌ Don't call hooks inside loops, conditions, or nested functions
   - ✅ Always call hooks in the same order on every render

2. **Only call hooks from React functions**
   - ✅ Call hooks from React function components
   - ✅ Call hooks from custom hooks (starting with `use`)

3. **Use the ESLint plugin**
   - Install: `eslint-plugin-react-hooks`
   - Catches these errors during development

---

## 🧪 **Testing**

After applying this fix:

1. **No more "Rendered more hooks" error** ✅
2. **Loading state works correctly** ✅
3. **Auto-focus still functions** in number input popups ✅
4. **No performance degradation** (hook runs conditionally via `if` check)

---

## 📝 **Key Takeaway**

**Always structure React components like this:**

```tsx
function Component() {
  // ✅ ALL HOOKS FIRST
  const [state, setState] = useState();
  useEffect(() => { /* logic with conditions inside */ });
  
  // ✅ CONDITIONAL RETURNS AFTER
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  // ✅ MAIN RENDER LAST
  return <UI />;
}
```

**Never do this:**

```tsx
function Component() {
  const [state, setState] = useState();
  
  // ❌ EARLY RETURN BEFORE HOOKS
  if (loading) return <Spinner />;
  
  // ❌ CONDITIONAL HOOK
  useEffect(() => { /* ... */ }); // ERROR!
  
  return <UI />;
}
```

---

**Status:** ✅ **FIXED**  
**Date:** January 26, 2026  
**Files Modified:** `client/src/pages/MeetingDetail.tsx`  
**Lines Changed:** Moved useEffect from line 779 to line 470, added `step` condition inside hook
