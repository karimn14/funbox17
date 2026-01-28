# 🌿 Scenery Assets Directory

This directory contains fixed background scenery images that frame the app.

---

## Required Files

### 1. grass-bottom.png
**Purpose:** Grass/bushes at the bottom of the screen  
**Recommended Size:** 1920x400px  
**Format:** PNG with transparency  
**Max File Size:** 200KB (optimize for web)

**Design Guidelines:**
- Grass/bushes growing from bottom edge
- Transparent top edge (fades into background)
- Green/natural colors (light to dark gradient)
- Can include flowers, bushes, or simple grass blades
- Style: Cartoon/illustrated to match app theme

**Example Composition:**
```
     (transparent)
  /\  /\    /\  /\     ← Grass tips (irregular)
 /  \/  \  /  \/  \    ← Blades of grass
|    |    |    |    |  ← Stems
======================  ← Ground line (bottom edge)
```

---

### 2. vines-top.png
**Purpose:** Hanging vines/leaves from top-right corner  
**Recommended Size:** 600x500px  
**Format:** PNG with transparency  
**Max File Size:** 150KB (optimize for web)

**Design Guidelines:**
- Vines hanging naturally from top
- Transparent background everywhere except vines
- Green leaves with some variation (light/dark)
- Can include flowers or berries for color accent
- Should look like it's hanging from above the screen

**Example Composition:**
```
======================== ← Top edge
    \  \    \           ← Vine stems hanging
     🍃 🍃  🍃         ← Leaves
      \  \              ← More stems
       🍃  🍃          ← More leaves
        \               ← Trailing vine
         🍃            ← Bottom leaf
```

---

## How to Create/Find Assets

### Option 1: Free Resources
- **Freepik.com** - Search: "grass border PNG" or "hanging vines PNG"
- **Flaticon.com** - Search: "grass silhouette" or "ivy border"
- **Pngtree.com** - Search: "cartoon grass" or "decorative vines"
- **OpenGameArt.org** - Look for environment assets

### Option 2: AI Generation
**DALL-E/Midjourney Prompts:**

**For Grass:**
```
"Cartoon grass and bushes border, view from front, growing from 
bottom edge, transparent background, bright green colors, simple 
illustration style, flat design, game asset, kid-friendly"
```

**For Vines:**
```
"Hanging jungle vines with leaves, corner decoration, transparent 
background, bright green leaves, cartoon style, simple design, 
cascading from top, game asset, kid-friendly"
```

### Option 3: Create Your Own

**Tools:**
- **Canva** - Free templates and shapes
- **Figma** - Vector design (export as PNG)
- **Inkscape** - Free vector tool
- **GIMP** - Free Photoshop alternative

**Steps:**
1. Create new document with transparent background
2. Draw grass shapes or vine shapes
3. Add green colors (use gradients for depth)
4. Add details (flowers, berries, texture)
5. Export as PNG-24 (with transparency)
6. Optimize with TinyPNG.com

---

## Technical Specifications

### Grass Image
```yaml
File: grass-bottom.png
Dimensions: 1920x400px (or 2560x400px for 4K)
Aspect Ratio: ~4.8:1 (wide)
Color Mode: RGBA (with alpha channel)
Format: PNG-24
Compression: Optimized for web
File Size: <200KB
DPI: 72 (web standard)
```

**Display:**
- Width: 100% of viewport (stretches)
- Max Height: 25vh (25% of viewport height)
- Position: Fixed at bottom

### Vines Image
```yaml
File: vines-top.png
Dimensions: 600x500px (or 800x600px)
Aspect Ratio: ~1.2:1
Color Mode: RGBA (with alpha channel)
Format: PNG-24
Compression: Optimized for web
File Size: <150KB
DPI: 72 (web standard)
```

**Display:**
- Max Width: 40vw (40% of viewport width)
- Max Height: 30vh (30% of viewport height)
- Position: Fixed at top-right corner

---

## Color Palette Suggestions

### Grass Colors
```
Light Green: #7CCD7C  // Bright grass tips
Medium Green: #4CAF50 // Mid-range leaves
Dark Green: #2E7D32   // Shadows/stems
Accent: #FFEB3B       // Yellow flowers (optional)
```

### Vine Colors
```
Light Green: #81C784  // New leaves
Medium Green: #4CAF50 // Mature leaves
Dark Green: #2E7D32   // Vine stems
Accent: #E91E63       // Pink flowers (optional)
```

---

## Quality Checklist

### Before Adding Assets

**Grass Image:**
- [ ] PNG format with transparency
- [ ] Top edge is transparent (fades)
- [ ] Bottom edge touches image boundary
- [ ] Width is at least 1920px
- [ ] File size under 200KB
- [ ] No white artifacts around edges
- [ ] Looks natural when stretched horizontally

**Vines Image:**
- [ ] PNG format with transparency
- [ ] Hangs naturally from top
- [ ] All background is transparent
- [ ] Asymmetric shape (not perfectly symmetrical)
- [ ] File size under 150KB
- [ ] No white artifacts around edges
- [ ] Clear separation between leaves

---

## Integration Test

After adding both files:

```powershell
# 1. Verify files are in correct location
dir client\public\assets\scenery

# Should see:
# - grass-bottom.png
# - vines-top.png

# 2. Check file sizes
# Both should be under 300KB combined

# 3. Run dev server
npm run dev

# 4. Test in browser:
# - Open DevTools (F12)
# - Network tab → Img filter
# - Refresh page
# - Look for both scenery images (should be 200 status, not 404)
# - Check file sizes in Network tab
```

---

## Optimization Tips

### Reduce File Size (If Too Large)

**Online Tools:**
- TinyPNG.com (automatic compression)
- Squoosh.app (manual control)
- Compressor.io (batch compression)

**Photoshop:**
1. File → Export → Export As
2. Format: PNG
3. Check "Transparency"
4. Uncheck "Metadata"
5. Use "Smaller File (8-bit)" if possible

**GIMP:**
1. Image → Scale Image (reduce if needed)
2. File → Export As → PNG
3. Compression level: 9
4. Don't save resolution, comment, or time

---

## Alternative Layouts

### Corner Bush Instead of Full Grass
```
Option: Place grass only in bottom-left or bottom-right corner
File: Use smaller 500x400px image
Benefit: Less coverage, more subtle
```

### Full Top Vine Border
```
Option: Vines stretch across entire top
File: Create 1920x300px horizontal vine border
Benefit: Symmetrical frame effect
```

### Both Corners
```
Option: Vines in both top corners
Files: vines-top-left.png + vines-top-right.png
Benefit: Balanced composition
```

---

## Example Sources (Placeholder Testing)

While creating your own assets, use these for testing:

```tsx
// Temporary placeholders in SceneryLayer.tsx:

// Grass
src="https://via.placeholder.com/1920x400/4CAF50/FFFFFF?text=Grass"

// Vines
src="https://via.placeholder.com/600x500/4CAF50/FFFFFF?text=Vines"
```

Replace with actual assets once ready!

---

## 🎨 Design Inspiration

### Grass Styles
- **Simple:** Clean silhouette, 3-5 grass blades
- **Detailed:** Multiple layers, varied heights, flowers
- **Cartoony:** Round shapes, bright colors, exaggerated
- **Realistic:** Natural variation, shadows, depth

### Vine Styles
- **Minimal:** Simple curved lines with occasional leaves
- **Lush:** Dense foliage, overlapping leaves
- **Tropical:** Large leaves, exotic flowers
- **Ivy:** Small leaves, climbing pattern

---

**Ready to add your scenery assets!** 🌿

Once added, import `SceneryLayer` in `App.tsx` to see the magic! ✨
