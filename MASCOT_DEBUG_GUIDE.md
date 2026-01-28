# 🐛 MascotLayer Visibility Fix - Debug Guide

## ✅ Issues Fixed

### Problem: Mascots Not Visible

**Root Causes Identified:**
1. ❌ Z-index too low (-10, behind everything)
2. ❌ Potential missing/incorrect image paths
3. ❌ Fixed height/width prevented proper aspect ratio
4. ❌ Long delays made testing difficult

---

## 🔧 Changes Made

### 1. Z-Index Adjustment
**Before:**
```tsx
<div style={{ zIndex: -10 }}>  // Behind everything
```

**After:**
```tsx
<div style={{ zIndex: 50 }}>  // On top of content
```

**Why:** Brings mascots to the front for immediate visibility and debugging.

---

### 2. Pointer Events Protection
**Added to all images:**
```tsx
className="... pointer-events-none"
```

**Critical:** This ensures users can still click buttons and links **through** the mascot images, even though they're on top (z-index: 50).

**Test:**
```
✅ Mascot visible on top
✅ Can still click buttons below it
✅ No interaction blocking
```

---

### 3. Size Enforcement
**Before:**
```tsx
// Dino
className="w-32 h-32 md:w-40 md:h-40"  // Fixed width AND height

// Bird
className="w-24 h-24 md:w-32 md:h-32"  // Fixed width AND height

// Flying Bird
className="w-20 h-20 md:w-24 md:h-24"  // Fixed width AND height
```

**After:**
```tsx
// All mascots now use:
className="w-32 md:w-48 pointer-events-none"  // Width only, height auto
```

**Why:**
- Removed fixed `height` - lets image maintain aspect ratio
- Unified sizing across all mascots (128px mobile, 192px desktop)
- Prevents squashing/stretching of images

---

### 4. Debug Timing (Temporary)
**Flying Bird repeatDelay:**
```tsx
// Before: repeatDelay: 25  (25 seconds wait)
// After:  repeatDelay: 2   (2 seconds wait)
```

**Why:** Makes testing much faster - you'll see the flying bird every 12 seconds (10s flight + 2s delay) instead of every 35 seconds.

**Note:** Change back to `25` after debugging!

---

### 5. Console Logging
**Added at component start:**
```tsx
console.log("Mascot rendered");
```

**Check browser console (F12) to verify:**
- Component is mounting
- No errors during render
- Called once on page load

---

## 🧪 Testing Steps

### Step 1: Open Dev Tools
```
Press F12 (or Cmd+Option+I on Mac)
Go to Console tab
```

**Look for:**
```
✅ "Mascot rendered" message
❌ Any error messages
❌ 404 errors for image files
```

### Step 2: Check Network Tab
```
F12 → Network tab → Img filter
Reload page
```

**Look for:**
- `dino-peek.png` - Should show 200 (success) or 404 (missing)
- `bird-peek.png` - Should show 200 (success) or 404 (missing)
- `bird-fly.png` - Should show 200 (success) or 404 (missing)

**If 404:** Images are missing from `client/public/assets/mascots/`

### Step 3: Wait and Observe
```
0s:  Page loads
2s:  🕊️ Flying bird should appear (starts crossing)
12s: 🕊️ Flying bird crosses again (10s + 2s delay)
10-15s: 🦖 Dino should peek up
12-18s: 🐦 Peeking bird should peek down
```

### Step 4: Test Click-Through
```
1. Wait for flying bird to appear
2. Try clicking a button while bird is over it
3. Button should work (pointer-events-none working)
```

---

## 📊 Visual Debugging

### What You Should See

**If Images Exist:**
```
┌────────────────────────────────────┐
│  🐦 (peeking bird)                 │ ← Top-right corner
│                                    │
│         🕊️→                        │ ← Flying across
│                                    │
│  [Your Content]                    │
│  [Buttons work through mascots]   │
│                                    │
│  🦖                                │ ← Bottom-left corner
└────────────────────────────────────┘
```

**If Images Missing (404):**
```
┌────────────────────────────────────┐
│  [?] (broken image icon)           │
│                                    │
│         [?]→                       │
│                                    │
│  [Your Content]                    │
│                                    │
│  [?]                               │
└────────────────────────────────────┘
```

---

## 🔍 Common Issues & Solutions

### Issue 1: Console Shows "Mascot rendered" but No Mascots Visible

**Possible Causes:**
- Images are 404 (missing files)
- Images exist but are wrong format
- Images are too large (>5MB)

**Solution:**
```powershell
# Check if images exist
dir client\public\assets\mascots

# Should see:
# - dino-peek.png
# - bird-peek.png
# - bird-fly.png

# If missing, add placeholder images for testing
```

**Temporary Test:** Use placeholder images from web:
```tsx
// In MascotLayer.tsx, temporarily change:
src="/assets/mascots/dino-peek.png"
// To:
src="https://via.placeholder.com/300/00FF00/FFFFFF?text=Dino"

src="/assets/mascots/bird-peek.png"
// To:
src="https://via.placeholder.com/300/0000FF/FFFFFF?text=Bird"

src="/assets/mascots/bird-fly.png"
// To:
src="https://via.placeholder.com/300/FFFF00/000000?text=Flying"
```

---

### Issue 2: Console Doesn't Show "Mascot rendered"

**Possible Causes:**
- Component not imported in App.tsx
- Component not included in JSX
- Import path incorrect

**Solution:**
```tsx
// Check App.tsx has:
import { MascotLayer } from "@/components/ui/MascotLayer";

// And in JSX:
<MascotLayer />
```

---

### Issue 3: Mascots Visible but Can't Click Buttons

**Possible Causes:**
- Missing `pointer-events-none` class
- Z-index blocking interactions

**Solution:**
Verify in DevTools:
```
Inspect mascot image
Should see: pointer-events: none;
```

If not, add to both container AND images:
```tsx
<div className="... pointer-events-none">
  <motion.img className="... pointer-events-none" />
</div>
```

---

### Issue 4: Flying Bird Not Appearing

**Check:**
```
1. Console log timing: "Mascot rendered" appears?
2. Wait 2 seconds for first flight
3. Check Network tab for bird-fly.png (200 or 404?)
4. Look at right edge of screen (bird starts there)
```

**Debug:**
```tsx
// Temporarily make bird start on screen:
initial={{ x: "0vw" }}  // Instead of "110vw"
animate={{ x: "-110vw" }}
```

---

### Issue 5: Peeking Mascots (Dino/Bird) Not Appearing

**Check timing:**
- Dino: 10-15 seconds after load
- Bird: 12-18 seconds after load

**Too long to wait?** Temporarily reduce delays:
```tsx
// In useEffect for dino:
const randomDelay = 2000 + Math.random() * 1000; // 2-3 seconds

// In useEffect for bird:
const randomDelay = 3000 + Math.random() * 1000; // 3-4 seconds
```

---

## 📝 Current Configuration

### Z-Index Stack (After Fix)

```
100: Modals/Toasts
 50: 🦖🐦🕊️ Mascots (FRONT - Debug mode)
 10: Floating Stickers
  1: Navigation/Headers
  0: Main Content
 -1: Background patterns
```

### Sizes

| Mascot | Mobile | Desktop |
|--------|--------|---------|
| Dino | 128px | 192px |
| Peeking Bird | 128px | 192px |
| Flying Bird | 128px | 192px |

### Timing (Debug Mode)

| Mascot | First Appearance | Repeat |
|--------|-----------------|--------|
| Flying Bird | 0s (immediate) | Every 12s |
| Dino | 10-15s (random) | Every 20-25s |
| Peeking Bird | 12-18s (random) | Every 25-30s |

---

## ✅ Verification Checklist

**Before Testing:**
- [ ] Component has `console.log("Mascot rendered")`
- [ ] Z-index changed to 50
- [ ] All images have `pointer-events-none`
- [ ] Sizes use `w-32 md:w-48` (no height)
- [ ] Flying bird `repeatDelay: 2` (for testing)

**During Testing:**
- [ ] Console shows "Mascot rendered"
- [ ] No 404 errors in Network tab
- [ ] Flying bird appears within 2-12 seconds
- [ ] Can click buttons through mascots
- [ ] Mascots are proper size (not too big/small)
- [ ] Animations smooth (no jitter)

**After Confirming Working:**
- [ ] Change flying bird `repeatDelay` back to `25`
- [ ] Optional: Change z-index back to `-10` (if you want mascots behind content)
- [ ] Remove console.log (or keep for production debugging)

---

## 🚀 Next Steps

### If Mascots Now Visible (Success!)

**Option A: Keep on Top (Current)**
```tsx
// Leave as-is:
style={{ zIndex: 50 }}
// Mascots always visible, buttons still work
```

**Option B: Move Behind Content (Original Design)**
```tsx
// Change back to:
style={{ zIndex: -10 }}
// Mascots peek from behind, more subtle
```

### If Still Not Visible

**1. Add Placeholder Images:**
```powershell
# Download or create simple test images
# Name them:
# - dino-peek.png (any PNG, 300x300px)
# - bird-peek.png (any PNG, 300x300px)
# - bird-fly.png (any PNG, 300x300px)

# Place in:
client\public\assets\mascots\
```

**2. Test with Colored Divs Instead:**
```tsx
// Replace images temporarily with colored boxes:
<motion.div
  className="absolute bottom-0 left-4 w-32 md:w-48 h-32 md:h-48 bg-green-500 pointer-events-none"
  initial={{ y: "100%" }}
  animate={{ y: showDino ? "0%" : "100%" }}
/>
```

**3. Check Browser Console Carefully:**
- Any React errors?
- Any Framer Motion errors?
- Any import errors?

---

## 🎯 Expected Results

### Success Indicators

✅ **Console Output:**
```
Mascot rendered
```

✅ **Visual:**
- Flying bird crosses screen every 12 seconds
- Dino peeks up from bottom-left after 10-15s
- Peeking bird peeks down from top-right after 12-18s
- All mascots visible on top of content

✅ **Interaction:**
- Can click all buttons/links
- Mascots don't block any functionality
- Smooth animations

✅ **Network:**
- All 3 images load successfully (200 status)
- No 404 errors

---

## 📞 Troubleshooting Flowchart

```
Start: Mascots not visible
        ↓
Is "Mascot rendered" in console?
   ↓ No → Check App.tsx imports
   ↓ Yes
        ↓
Are images 404 in Network tab?
   ↓ Yes → Add placeholder images
   ↓ No
        ↓
Wait 15 seconds - Any mascot appears?
   ↓ No → Check console for errors
   ↓ Yes
        ↓
Can you click buttons through them?
   ↓ No → Verify pointer-events-none
   ↓ Yes
        ↓
SUCCESS! 🎉
Adjust timing/z-index as desired
```

---

## 🎊 Summary of Changes

| Change | Before | After | Why |
|--------|--------|-------|-----|
| **Z-Index** | -10 | 50 | Make visible on top |
| **Pointer Events** | Not specified | `pointer-events-none` | Allow clicks through |
| **Size (Dino)** | w-32 h-32 | w-32 (auto height) | Maintain aspect ratio |
| **Size (Birds)** | w-20/24 h-20/24 | w-32 (auto height) | Consistent sizing |
| **Repeat Delay** | 25s | 2s | Faster testing |
| **Debug Log** | None | `console.log()` | Verify mounting |

---

**Test now with:** `npm run dev`

**You should see mascots within 2-15 seconds! 🦖🐦🕊️**

---

**Document Version:** 1.0  
**Created:** January 2026  
**Status:** Debugging Configuration Active
