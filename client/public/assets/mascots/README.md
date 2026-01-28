# 🦖 Mascot Assets - Peeking & Flying Animations

## Overview

The MascotLayer component uses 3 mascot images that add life and personality to the FunBox app:
- Dino that peeks up from bottom-left
- Bird that peeks down from top-right
- Flying bird that crosses the screen horizontally

---

## Required Assets

### 1. Dino Mascot (Bottom-Left Peek)
**File:** `dino-peek.png`

**Specifications:**
- **Format:** PNG with transparency
- **Recommended Size:** 400x400px (displays at 128-160px)
- **Max File Size:** 100KB (optimized for web)
- **Position:** Bottom-left corner
- **Animation:** Peeks up from below

**Design Requirements:**
- Cute, friendly dinosaur character
- Looking upward/forward (engaged with content)
- Bright, kid-friendly colors (green, blue, yellow)
- Clear silhouette with good contrast
- Waving or smiling pose (welcoming)

**Example Content:**
- T-Rex with big eyes and smile
- Cartoon-style dino with rounded features
- Happy expression
- Optional: Small waving hand/arm

---

### 2. Bird Mascot (Top-Right Peek)
**File:** `bird-peek.png`

**Specifications:**
- **Format:** PNG with transparency
- **Recommended Size:** 300x300px (displays at 96-128px)
- **Max File Size:** 80KB (optimized for web)
- **Position:** Top-right corner
- **Animation:** Peeks down from above

**Design Requirements:**
- Cute, friendly bird character
- Looking downward (peeking at content)
- Bright, kid-friendly colors (blue, yellow, pink)
- Clear silhouette with good contrast
- Cheerful, curious expression

**Example Content:**
- Cartoon bird with large eyes
- Small beak, round body
- Wings slightly spread or folded
- Friendly, inquisitive look
- Optional: Small cloud or motion lines

---

### 3. Flying Bird Mascot (Horizontal Fly-By) 🕊️ ✨ NEW
**File:** `bird-fly.png`

**Specifications:**
- **Format:** PNG with transparency
- **Recommended Size:** 300x300px (displays at 80-96px)
- **Max File Size:** 80KB (optimized for web)
- **Position:** Top of screen (flies across horizontally)
- **Animation:** Flies from right to left (10-second smooth flight)

**Design Requirements:**
- Cute, friendly bird character in flying pose
- **Facing left** (direction of flight)
- Wings spread wide (actively flying)
- Bright, kid-friendly colors (blue, yellow, pink)
- Clear silhouette with good contrast
- Dynamic, energetic pose

**Example Content:**
- Bird with wings fully extended
- Side profile, facing left
- Streamlined flying position
- Happy/focused expression
- Optional: Motion lines behind wings

---

## Directory Structure

```
client/public/assets/mascots/
├── dino-peek.png     (400x400px, ~100KB)
├── bird-peek.png     (300x300px, ~80KB)
└── bird-fly.png      (300x300px, ~80KB) ✨ NEW
```

---

## Where to Get Mascot Images

### Option 1: Create Custom Mascots (Recommended)

**Tools:**
- **Canva** - Easy drag-and-drop design
- **Figma** - Professional design tool
- **Adobe Illustrator** - Vector graphics
- **Procreate/iPad** - Hand-drawn style

**Steps:**
1. Create new canvas (400x400px for dino, 300x300px for bird)
2. Design mascot with bright colors and simple shapes
3. Ensure character is looking in correct direction
4. Export as PNG with transparent background
5. Optimize with TinyPNG or ImageOptim

### Option 2: Download from Free Resources

**Websites:**
- **Flaticon.com** - Free icons and characters
  - Search: "cute dino", "cartoon dinosaur", "friendly bird"
  - Filter by: PNG, transparent background
  - Remember attribution if required

- **Freepik.com** - Free vectors and illustrations
  - Search: "dinosaur character", "bird mascot"
  - Download PNG or convert SVG to PNG
  - Free account required

- **OpenGameArt.org** - Free game assets
  - Search: "character sprites", "mascot"
  - Public domain and Creative Commons

- **Kenney.nl** - Free game assets
  - Look in "Animal Pack" or "Character Pack"
  - All assets are CC0 (public domain)

### Option 3: AI Generation (Quick)

**Tools:**
- **DALL-E** - Text to image
- **Midjourney** - High-quality generations
- **Stable Diffusion** - Free and open source

**Prompts:**
```
For Dino:
"Cute cartoon dinosaur character, smiling and waving, bright green color, 
friendly expression, simple design for kids, transparent background, 
game asset style"

For Bird:
"Cute cartoon bird character, looking down curiously, bright blue and yellow, 
friendly expression, simple design for kids, transparent background, 
game asset style"
```

---

## Design Guidelines

### Color Palette

**Dino (Bottom-Left):**
- Primary: Bright green (#22C55E, #10B981)
- Accent: Yellow (#FBBF24) for belly/details
- Eyes: Dark blue/black with white highlights
- Outline: Dark green or black (2-3px)

**Bird (Top-Right):**
- Primary: Sky blue (#60A5FA, #3B82F6)
- Accent: Yellow (#FBBF24) for beak/feet
- Wings: Light pink or purple accent
- Eyes: Dark brown/black with white highlights

### Style Guidelines

**Do:**
- ✅ Use simple, rounded shapes
- ✅ Large, expressive eyes
- ✅ Friendly, welcoming poses
- ✅ High contrast for visibility
- ✅ Thick outlines (2-3px)
- ✅ Smooth edges (anti-aliased)

**Don't:**
- ❌ Too detailed or realistic
- ❌ Scary or intimidating expressions
- ❌ Small or hard-to-see details
- ❌ Low contrast colors
- ❌ Complex patterns
- ❌ Sharp or pointy features (keep rounded)

---

## Image Optimization

### Before Upload

1. **Resize to correct dimensions:**
   ```bash
   # Using ImageMagick (if installed)
   magick dino-peek.png -resize 400x400 dino-peek-optimized.png
   magick bird-peek.png -resize 300x300 bird-peek-optimized.png
   ```

2. **Optimize file size:**
   - Use **TinyPNG.com** - Web-based optimizer
   - Or **ImageOptim** (Mac) / **FileOptimizer** (Windows)
   - Target: <100KB per file

3. **Verify transparency:**
   - Open in image editor
   - Check background is fully transparent (not white)
   - Ensure edges are smooth (anti-aliased)

---

## Installation

Once you have the mascot images:

```powershell
# 1. Create directory
mkdir client\public\assets\mascots

# 2. Copy files
# Place your optimized images here:
# - client/public/assets/mascots/dino-peek.png
# - client/public/assets/mascots/bird-peek.png

# 3. Verify files exist
dir client\public\assets\mascots
```

---

## Animation Behavior

### Dino (Bottom-Left)

**Timing:**
- Appears after **10-15 seconds** (random)
- **Slides up** over 2 seconds (smooth easeInOut)
- Stays visible for **3 seconds**
- **Slides down** over 2 seconds
- Waits **10-15 seconds** before next appearance

**Visual:**
```
[Hidden below screen]
        ↑ (2 seconds)
[Visible peeking up]
   (stays 3 seconds)
        ↓ (2 seconds)
[Hidden below screen]
   (waits 10-15 seconds)
        ↑ (repeat)
```

### Bird (Top-Right)

**Timing:**
- First appearance after **5 seconds** (offset from dino)
- Then appears after **12-18 seconds** (random, slightly longer)
- **Slides down** over 2 seconds (smooth easeInOut)
- Stays visible for **3 seconds**
- **Slides up** over 2 seconds
- Waits **12-18 seconds** before next appearance

**Visual:**
```
[Hidden above screen]
        ↓ (2 seconds)
[Visible peeking down]
   (stays 3 seconds)
        ↑ (2 seconds)
[Hidden above screen]
   (waits 12-18 seconds)
        ↓ (repeat)
```

**Note:** Dino and bird have offset timings so they rarely appear together (keeps it subtle and non-distracting).

---

## Testing Checklist

After adding mascot images:

- [ ] Files exist in correct location
- [ ] File names are correct (exact match)
- [ ] Images have transparent backgrounds
- [ ] File sizes are optimized (<100KB each)
- [ ] Dino peeks up from bottom-left
- [ ] Bird peeks down from top-right
- [ ] Animations are smooth (60fps)
- [ ] Mascots don't block content (z-index: -10)
- [ ] Mascots don't block clicks
- [ ] Random timing works (10-15 second delays)
- [ ] Mascots appear on all pages

---

## Customization

### Change Appearance Frequency

Edit `client/src/components/ui/MascotLayer.tsx`:

```tsx
// Make dino appear MORE often (shorter delay)
const randomDelay = 5000 + Math.random() * 3000; // 5-8 seconds

// Make dino appear LESS often (longer delay)
const randomDelay = 20000 + Math.random() * 10000; // 20-30 seconds
```

### Change Visibility Duration

```tsx
// Make mascots stay visible LONGER
setTimeout(() => {
  setShowDino(false);
}, 5000); // 5 seconds instead of 3

// Make mascots stay visible SHORTER
setTimeout(() => {
  setShowDino(false);
}, 1500); // 1.5 seconds instead of 3
```

### Change Animation Speed

```tsx
transition={{
  duration: 1, // Faster (1 second instead of 2)
  // OR
  duration: 3, // Slower (3 seconds instead of 2)
}}
```

### Change Mascot Size

```tsx
// Make dino BIGGER
className="absolute bottom-0 left-4 w-48 h-48 md:w-56 md:h-56"

// Make dino SMALLER
className="absolute bottom-0 left-4 w-24 h-24 md:w-32 md:h-32"
```

---

## Troubleshooting

**Problem: Mascots not appearing**
```powershell
# Check if files exist
dir client\public\assets\mascots

# Verify file names (exact match, case-sensitive)
# Should be:
# - dino-peek.png (not Dino-Peek.png or dino-peek.PNG)
# - bird-peek.png (not Bird-Peek.png or bird-peek.PNG)
```

**Problem: Images have white background**
```powershell
# Re-export with transparency enabled
# Tools: Photoshop → Save for Web → PNG-24 with transparency
# Or use online tool: remove.bg
```

**Problem: Mascots appear too often/too rarely**
```powershell
# Adjust random delay in MascotLayer.tsx
# See "Change Appearance Frequency" section above
```

**Problem: Mascots block content**
```powershell
# This should NOT happen (z-index: -10)
# Check that no other elements have negative z-index
# If issue persists, lower z-index to -20
```

---

## Future Enhancement Ideas

### Additional Mascots (Optional)

1. **Cloud mascot** - Floats across top of screen
2. **Fish mascot** - Peeks from left side
3. **Star mascot** - Twinkles in corner
4. **Balloon mascot** - Floats up from bottom

### Interactive Features (Optional)

1. **Click to wave** - Mascot waves when clicked
2. **Speak bubbles** - Show encouraging messages
3. **Mood variations** - Different expressions based on score
4. **Holiday themes** - Special mascots for holidays

### Advanced Animations (Optional)

1. **Parallax effect** - Slight movement on mouse move
2. **Eye tracking** - Eyes follow cursor
3. **Breathing animation** - Subtle scale pulse
4. **Idle animations** - Blink, wiggle while visible

---

## Asset Credits

When using downloaded assets, remember to:

1. Check license requirements
2. Provide attribution if required
3. Keep a record in `CREDITS.md`:

```markdown
## Mascot Assets

- Dino Character: [Source/Creator]
  License: [License Type]
  Link: [URL]

- Bird Character: [Source/Creator]
  License: [License Type]
  Link: [URL]
```

---

## Summary

**Required Files:** 2 PNG images
**Total Size:** ~180KB (optimized)
**Format:** PNG with transparency
**Installation:** Copy to `client/public/assets/mascots/`
**Testing:** Start dev server and wait 5-15 seconds

**The mascots will bring your app to life! 🦖🐦✨**
