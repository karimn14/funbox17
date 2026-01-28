# 🔧 Background Visibility Fix - Complete Guide

## 🎯 Problem Summary

The user reported that backgrounds were completely white and images were not showing up. This was due to:
1. **Incorrect path** for quiz background (`/assets/backgrounds/` vs `/assets/background/`)
2. **Low z-index** on SceneryLayer (z: 1 was behind other elements)
3. **Tailwind class issues** on Quiz.tsx (classes not applying properly)

## ✅ Fixes Applied

### 1. Quiz.tsx - Fixed Background Image Path & Styling

**Changes Made:**
- ✅ Changed path from `/assets/backgrounds/quiz-bg.png` to `/assets/background/quiz-bg.png` (singular, matching actual file location)
- ✅ Converted Tailwind classes to inline styles for better reliability
- ✅ Changed overlay from `bg-white/85` to `bg-white/80` (more background visible)

**Before:**
```tsx
<div 
  className="min-h-screen w-full overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat relative"
  style={{ backgroundImage: 'url(/assets/backgrounds/quiz-bg.png)' }}
>
  <div className="absolute inset-0 bg-white/85 z-0" />
```

**After:**
```tsx
<div 
  className="min-h-screen w-full overflow-hidden flex flex-col relative"
  style={{ 
    backgroundImage: "url('/assets/background/quiz-bg.png')", 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="absolute inset-0 bg-white/80 z-0" />
```

**Key Improvements:**
- Inline styles ensure background properties apply correctly
- Corrected file path matches actual asset location
- Lower overlay opacity (80% vs 85%) = more jungle visible

---

### 2. SceneryLayer.tsx - Increased Z-Index & Added Debug Borders

**Changes Made:**
- ✅ Z-index boosted from `1` to `50` (brings scenery to front)
- ✅ Added red borders (`border-4 border-red-500`) to both images for debugging
- ✅ Maintains `pointer-events-none` (clicks pass through)

**Before:**
```tsx
<div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
  <img src="/assets/scenery/grass-bottom.png" className="fixed bottom-0 left-0 w-[430px] h-auto pointer-events-none" />
  <img src="/assets/scenery/vines-top.png" className="absolute top-0 right-0 w-48 md:w-64 h-auto pointer-events-none" />
</div>
```

**After:**
```tsx
<div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
  <img src="/assets/scenery/grass-bottom.png" className="fixed bottom-0 left-0 w-[430px] h-auto pointer-events-none border-4 border-red-500" />
  <img src="/assets/scenery/vines-top.png" className="absolute top-0 right-0 w-48 md:w-64 h-auto pointer-events-none border-4 border-red-500" />
</div>
```

**Why Z-Index 50?**
- Higher than Quiz overlay (z: 0) and content (z: 10)
- Same level as MascotLayer (z: 50) for consistency
- Ensures scenery is always visible on top

**Debug Borders:**
- Red borders make images visible even if the PNG is transparent or fails to load
- Helps identify if images are loading but not visible vs. not loading at all
- Should be removed after testing

---

## 📊 Updated Z-Index Stack

```
Layer 50:  SceneryLayer (grass & vines) ⬅️ UPDATED
Layer 50:  MascotLayer (dinos & bird)
Layer 10:  Quiz content (questions, answers)
Layer 0:   Quiz overlay (white/80)
Layer -1:  Quiz background image
Layer -50: Body::before (global gradient pattern)
```

---

## 🧪 Testing & Verification

### Asset Test Page Created

Created: `client/public/test-assets.html`

**Purpose:** Simple HTML page to test if assets load without React/Tailwind interference

**To Test:**
1. Start the dev server:
   ```powershell
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/test-assets.html`

3. **What to Check:**
   - ✅ All images have RED BORDERS
   - ✅ Quiz background shows jungle scene behind white overlay
   - ✅ Grass, vines, dinos, and bird are visible
   - ✅ Bird GIF is animated
   - ✅ Status indicators show "✓ Loaded" (green) for all images

4. **If images fail here:**
   - Files are missing or paths are wrong
   - Check `client/public/assets/` directory structure

5. **If images work here but not in app:**
   - Issue is in React components, not the files
   - Check component z-index, positioning, or CSS conflicts

---

## 🗂️ Verified Asset Paths

All these files were confirmed to exist:

**Quiz Background:**
- ✅ `/assets/background/quiz-bg.png` (Note: singular "background", not "backgrounds")

**Scenery:**
- ✅ `/assets/scenery/grass-bottom.png`
- ✅ `/assets/scenery/vines-top.png`

**Mascots:**
- ✅ `/assets/mascots/dino-peek.png`
- ✅ `/assets/mascots/dino2-peek.png`
- ✅ `/assets/mascots/bird-fly.gif`

---

## 🚀 Next Steps

### 1. Test the Application
```powershell
npm run dev
```

### 2. Navigate to Quiz Page
- Go to Dashboard → Select a Module → Take Quiz
- Check if jungle background is visible (with 80% white overlay)
- Look for red-bordered scenery in corners

### 3. Check Homepage/Dashboard
- Look for red-bordered grass in bottom-left (430px wide)
- Look for red-bordered vines in top-right
- Wait 10-15 seconds for dinos to peek from bottom-right
- Watch for flying bird GIF crossing horizontally

### 4. Verify Debug Borders
If you see red borders but NO images inside:
- Images are positioned correctly but files are corrupt/missing
- Try re-downloading the asset files

If you see images WITH red borders:
- **SUCCESS!** Everything is loading correctly
- Remove debug borders from SceneryLayer.tsx:
  ```tsx
  // Remove: border-4 border-red-500
  className="fixed bottom-0 left-0 w-[430px] h-auto pointer-events-none"
  ```

### 5. If Still White Background on Quiz

**Check Browser Console for Errors:**
```javascript
// Look for 404 errors like:
// GET http://localhost:5173/assets/background/quiz-bg.png 404 (Not Found)
```

**Possible Issues:**
1. **Dev server cache** - Try hard refresh (Ctrl + Shift + R)
2. **Build cache** - Clear node_modules and reinstall
3. **Path case sensitivity** - Windows is case-insensitive but deployment might not be
4. **Image corruption** - Try opening the PNG files directly in browser

**Manual Path Test:**
Open in browser: `http://localhost:5173/assets/background/quiz-bg.png`
- If it loads → React component issue
- If 404 → File path or location issue

---

## 🎨 Fine-Tuning Overlay Opacity

The quiz background uses `bg-white/80` (80% opacity white overlay).

**To adjust readability:**

```tsx
// Less overlay = More jungle visible (but harder to read)
<div className="absolute inset-0 bg-white/70 z-0" />  // 70% white

// More overlay = Less jungle visible (but easier to read)
<div className="absolute inset-0 bg-white/90 z-0" />  // 90% white
```

**Recommended Range:** 70% - 90%
- **70%:** Strong jungle theme, may affect text readability
- **80%:** Current setting, balanced visibility
- **90%:** Subtle jungle hint, maximum text readability

---

## 🐛 Troubleshooting Guide

### Issue: Red borders visible but no images

**Cause:** Image files missing or paths incorrect

**Solution:**
1. Check file exists: `client\public\assets\scenery\grass-bottom.png`
2. Verify file isn't corrupt (open in image viewer)
3. Check file permissions (should be readable)

---

### Issue: No red borders visible at all

**Cause:** Z-index still too low or component not rendering

**Solution:**
1. Check browser DevTools → Elements → Find `SceneryLayer`
2. Verify `style="z-index: 50"` is applied
3. Check if images have `display: none` or `visibility: hidden`
4. Look for parent containers with `overflow: hidden` cutting off images

---

### Issue: Quiz background white despite correct path

**Cause:** Inline style not applying or being overridden

**Solution:**
1. Open DevTools → Inspect quiz container
2. Check "Computed" tab → Look for `background-image`
3. If missing → Style not applying (check React render)
4. If present but no image → Path incorrect or file missing
5. Check for parent with `background: white !important` overriding it

---

### Issue: Images load in test page but not in app

**Cause:** React component CSS conflicts or z-index issues

**Solution:**
1. SceneryLayer z-index should be `50` (not 1)
2. Check `index.css` - `body::before` should be `z-index: -50` (not -1)
3. Verify no parent div has `bg-white` or similar overriding colors
4. Check if images are rendering outside viewport (positioning issue)

---

## 📝 Code Checklist

Before testing, verify these settings:

**Quiz.tsx (Line ~237):**
```tsx
✅ backgroundImage: "url('/assets/background/quiz-bg.png')"
✅ backgroundSize: 'cover'
✅ backgroundPosition: 'center'
✅ backgroundRepeat: 'no-repeat'
✅ Overlay: bg-white/80 (not bg-white/85 or bg-white)
```

**SceneryLayer.tsx:**
```tsx
✅ Container zIndex: 50 (not 1)
✅ Images have: border-4 border-red-500 (for debug)
✅ pointer-events-none maintained
```

**index.css:**
```tsx
✅ body::before has z-index: -50 (not -1)
```

---

## 🎯 Success Criteria

You'll know it's working when:
1. ✅ Quiz page shows jungle background (faded due to overlay)
2. ✅ Text on quiz is easily readable
3. ✅ Red-bordered grass visible in bottom-left corner
4. ✅ Red-bordered vines visible in top-right corner
5. ✅ Dinos peek from bottom-right after 10-15 seconds
6. ✅ Bird GIF flies left-to-right across top periodically
7. ✅ No browser console errors about missing images

---

## 🔄 Cleanup After Testing

Once everything works, remove debug borders:

**SceneryLayer.tsx:**
```tsx
// Remove these from both img tags:
// border-4 border-red-500

<img
  src="/assets/scenery/grass-bottom.png"
  alt=""
  className="fixed bottom-0 left-0 w-[430px] h-auto pointer-events-none"
  // 👆 Clean version without borders
/>
```

---

## 📚 Related Documentation

- `QUIZ_JUNGLE_BACKGROUND.md` - Detailed quiz background implementation
- `SCENERY_LAYER_COMPLETE.md` - Scenery layer documentation
- `MASCOT_LAYER_COMPLETE.md` - Mascot animations
- Asset specs in each `/assets/*/README.md` file

---

## ⚡ Quick Commands

```powershell
# Start dev server
npm run dev

# Test asset page
# Navigate to: http://localhost:5173/test-assets.html

# Check if assets exist
Get-ChildItem -Path "client\public\assets" -Recurse

# View specific image in browser
# http://localhost:5173/assets/background/quiz-bg.png
# http://localhost:5173/assets/scenery/grass-bottom.png
# http://localhost:5173/assets/scenery/vines-top.png
```

---

**Last Updated:** January 28, 2026
**Status:** ✅ Fixes Applied - Ready for Testing
**Priority:** 🔴 HIGH - Core visual feature
