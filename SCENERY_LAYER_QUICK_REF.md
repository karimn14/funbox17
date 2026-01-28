# 🌿 SceneryLayer - Quick Reference

## Overview
Fixed background scenery elements that create a natural frame around the app content.

---

## 🎯 Component Details

### File
```
client/src/components/ui/SceneryLayer.tsx
```

### Purpose
- Creates a static "frame" with nature elements
- Grass at bottom, vines at top-right
- Stays fixed during scroll for depth effect
- Behind all content (z-index: -20)

---

## 📦 Required Assets

### Grass Image
```
Path: client/public/assets/scenery/grass-bottom.png
Size: 1920x400px (or similar wide aspect ratio)
Position: Bottom, full width
Style: Grass/bushes growing from bottom edge
```

### Vines Image
```
Path: client/public/assets/scenery/vines-top.png
Size: 600x500px (or similar)
Position: Top-right corner
Style: Hanging vines/leaves from top
```

---

## 🎨 Visual Layout

```
┌──────────────────────────────────────┐
│  🌿 Vines (top-right)                │
│                                      │
│                                      │
│         [Main Content]               │
│         [Scrollable]                 │
│                                      │
│                                      │
│  🌱🌱🌱🌱🌱 Grass (bottom, full) 🌱🌱 │
└──────────────────────────────────────┘
```

---

## ⚙️ Technical Specs

### Z-Index Stack
```
 50: Mascots (debug mode)
 10: Floating elements
  1: Navigation
  0: Main content
-10: Mascots (production)
-20: 🌿 Scenery (STATIC FRAME)
-30: Background color/pattern
```

### Positioning
```tsx
// Container
position: fixed
z-index: -20
pointer-events: none

// Grass
position: absolute
bottom: 0, left: 0
width: 100%
max-height: 25vh

// Vines
position: absolute
top: 0, right: 0
max-width: 40vw
max-height: 30vh
```

---

## 🚀 Integration

### Add to App.tsx
```tsx
import { SceneryLayer } from "@/components/ui/SceneryLayer";

function App() {
  return (
    <>
      <SceneryLayer />  {/* Add before or after MascotLayer */}
      <MascotLayer />
      {/* ... rest of app */}
    </>
  );
}
```

### Recommended Order
```tsx
<SceneryLayer />     // Bottom-most (z: -20)
<MascotLayer />      // Above scenery (z: 50 or -10)
<MagicCursor />      // Interactive layer
<Router />           // Main content
```

---

## 🎨 Asset Creation Tips

### Grass Image
**Style Options:**
- Simple grass silhouette
- Bushes and flowers
- Rolling hills
- Cartoon vegetation

**Technical:**
- Transparent top edge (fades into background)
- Green/natural colors
- Optimized PNG (<200KB)
- Tile-able edges (optional)

### Vines Image
**Style Options:**
- Hanging ivy/vines
- Corner leaf decoration
- Tree branch with leaves
- Flowering vines

**Technical:**
- Transparent background
- Hangs naturally from top
- Green/natural colors
- Optimized PNG (<150KB)

---

## ✅ Testing Checklist

### Visual Tests
- [ ] Grass appears at bottom edge
- [ ] Vines appear at top-right corner
- [ ] Both images have transparent backgrounds
- [ ] No white boxes around images
- [ ] Proper size (not too large/small)

### Interaction Tests
- [ ] Can click buttons through scenery (pointer-events-none working)
- [ ] Content scrolls, scenery stays fixed
- [ ] No layout shifts or jumps
- [ ] Works on mobile/tablet/desktop

### Performance Tests
- [ ] Images load quickly
- [ ] No lag during scroll
- [ ] Acceptable file sizes

---

## 🔧 Customization

### Adjust Grass Height
```tsx
style={{
  maxHeight: "20vh", // Smaller (20% viewport)
  // or
  maxHeight: "30vh", // Larger (30% viewport)
}}
```

### Adjust Vines Size
```tsx
style={{
  maxWidth: "30vw",  // Smaller width
  maxHeight: "40vh", // Taller height
}}
```

### Different Positioning

**Grass in corner instead of full width:**
```tsx
className="absolute bottom-0 right-0 w-64 md:w-96"
```

**Vines on left instead of right:**
```tsx
className="absolute top-0 left-0 w-auto h-auto"
```

**Vines spanning full top:**
```tsx
className="absolute top-0 left-0 w-full h-auto"
```

---

## 🎯 Design Intent

### User Experience
- **Depth:** Creates layered visual depth
- **Immersion:** Natural theme reinforces educational content
- **Frame:** Guides eye toward center content
- **Polish:** Professional, complete look

### Technical Benefits
- **Fixed position:** No scroll jank
- **Behind content:** Never blocks interaction
- **Separate layer:** Easy to enable/disable
- **Independent:** Doesn't affect other components

---

## 🐛 Troubleshooting

### Images not appearing
```powershell
# Check files exist
dir client\public\assets\scenery

# Should see:
# - grass-bottom.png
# - vines-top.png
```

### Images have white backgrounds
```
Solution: Re-export with transparency
- Use PNG-24 format
- Enable "Save transparency" in export
- Tools: Photoshop, GIMP, remove.bg
```

### Images too large/small
```tsx
// Adjust max sizes in SceneryLayer.tsx
style={{
  maxHeight: "25vh", // Change these values
  maxWidth: "40vw",
}}
```

### Images blocking clicks
```
Solution: Verify pointer-events-none is on:
- Container div
- Both img elements
```

---

## 📊 Expected Impact

### Before SceneryLayer
```
Simple colored background
Content floating in space
Clean but plain appearance
```

### After SceneryLayer
```
Natural frame with grass and vines
Content feels "grounded" in environment
Professional, themed appearance
Enhanced visual polish
```

---

## 🎊 Summary

**What it does:**
- Adds grass at bottom (full width or corner)
- Adds vines at top-right corner
- Fixed positioning (parallax effect during scroll)
- Non-interactive (behind everything)

**What you need:**
- 2 PNG images with transparency
- Both in `client/public/assets/scenery/`
- Import and add `<SceneryLayer />` to App.tsx

**Result:**
🌿 Beautiful natural frame that enhances the app's educational jungle/nature theme!

---

**Status:** ✅ Component Ready - Add Assets & Integrate
