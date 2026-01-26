# Animal Mimic Activity - Asset Requirements

## 📦 Required Assets for Module 3, Meeting 4

This document describes all visual and audio assets needed for the "Binatang dan Suaranya" (Animals and Their Sounds) activity to function properly.

---

## 🖼️ Image Asset

### Main Background Image

**File Path:** `/assets/animals-meadow.png`

**Specifications:**
- **Format:** PNG (with transparency support)
- **Recommended Size:** 1920×1080px (Full HD)
- **Aspect Ratio:** 16:9
- **File Size:** < 2 MB (compressed)
- **Color Profile:** sRGB

**Content Requirements:**
The image should depict a cheerful meadow scene with the following 5 animals positioned at these approximate locations:

1. **Cow** (Barnaby)
   - Position: Upper-left area
   - Zone: 20% from top, 10% from left
   - Size: Should occupy ~20% width × 20% height of canvas
   - Style: Friendly, cartoon-style cow (white with black spots preferred)

2. **Sheep** (Shirley)
   - Position: Middle-left area
   - Zone: 50% from top, 20% from left
   - Size: Should occupy ~15% width × 15% height
   - Style: Fluffy white sheep with gentle expression

3. **Duck**
   - Position: Lower-middle area (near pond/water)
   - Zone: 70% from top, 60% from left
   - Size: Should occupy ~10% width × 10% height
   - Style: Yellow or white duck, swimming or standing

4. **Rooster** (Rudy)
   - Position: Upper-right area (fence/perch)
   - Zone: 10% from top, 70% from left
   - Size: Should occupy ~15% width × 15% height
   - Style: Colorful rooster with proud posture

5. **Dog**
   - Position: Middle-right area
   - Zone: 40% from top, 80% from left
   - Size: Should occupy ~15% width × 15% height
   - Style: Friendly dog (golden/brown preferred)

**Scene Elements:**
- Green grass meadow
- Blue sky with white clouds
- Optional: Trees, fence, pond, flowers
- Bright, cheerful color palette
- Child-friendly illustration style

**Design Notes:**
- Animals should be clearly separated (no overlap)
- Each animal should be easily identifiable
- Leave negative space around animals for UI elements
- Use vibrant colors to engage young learners
- Maintain consistent art style across all animals

---

## 🔊 Audio Assets

All audio files should be in **MP3 format** with the following specifications:

### General Audio Specs
- **Format:** MP3
- **Bitrate:** 128 kbps minimum
- **Sample Rate:** 44.1 kHz
- **Duration:** 1-3 seconds per sound
- **Volume:** Normalized to -3dB peak
- **Channels:** Mono or Stereo

### Individual Sound Files

#### 1. Cow Sound
**File Path:** `/sounds/cow.mp3`
- **Sound:** "Moo" or "Moooo"
- **Duration:** 1.5-2 seconds
- **Character:** Deep, gentle, friendly
- **Volume:** Moderate
- **Reference:** Classic cow lowing sound

#### 2. Sheep Sound
**File Path:** `/sounds/sheep.mp3`
- **Sound:** "Baa" or "Baaa"
- **Duration:** 1-1.5 seconds
- **Character:** Mid-pitch, soft, gentle
- **Volume:** Moderate
- **Reference:** Classic sheep bleating

#### 3. Duck Sound
**File Path:** `/sounds/duck.mp3`
- **Sound:** "Quack" or "Quack quack"
- **Duration:** 0.5-1.5 seconds
- **Character:** High-pitch, cheerful
- **Volume:** Moderate to bright
- **Reference:** Classic duck quacking

#### 4. Rooster Sound
**File Path:** `/sounds/rooster.mp3`
- **Sound:** "Cock-a-doodle-doo"
- **Duration:** 2-3 seconds
- **Character:** Loud, proud, clear
- **Volume:** Slightly higher than others
- **Reference:** Classic rooster crow

#### 5. Dog Sound
**File Path:** `/sounds/dog.mp3`
- **Sound:** "Woof" or "Woof woof"
- **Duration:** 0.5-1.5 seconds
- **Character:** Friendly, mid-pitch bark
- **Volume:** Moderate
- **Reference:** Friendly dog bark (not aggressive)

---

## 📁 File Structure

```
project_root/
├── public/
│   ├── assets/
│   │   └── animals-meadow.png    ← Main background image
│   └── sounds/
│       ├── cow.mp3               ← Cow sound
│       ├── sheep.mp3             ← Sheep sound
│       ├── duck.mp3              ← Duck sound
│       ├── rooster.mp3           ← Rooster sound
│       └── dog.mp3               ← Dog sound
```

---

## 🎨 Alternative Asset Sources

### Option 1: Create Custom Assets
- Commission an illustrator for the meadow scene
- Record or synthesize animal sounds
- Ensures perfect fit for zone positions

### Option 2: Use Stock Assets
**Image:**
- Shutterstock, Adobe Stock, iStock
- Search: "farm animals meadow illustration children"
- Filter: Vector, PNG, child-friendly

**Audio:**
- Freesound.org (Creative Commons)
- ZapSplat (free sound effects)
- AudioJungle (royalty-free)
- Search: "animal sounds children farm"

### Option 3: Placeholder Assets (Testing)
**Image:**
- Use a simple colored background
- Add text labels for each animal zone
- Example: "COW HERE" at 20% top, 10% left

**Audio:**
- Use text-to-speech for animal names
- Or simple beep sounds as placeholders

---

## 🧪 Testing Assets

### Image Testing Checklist
- [ ] Image loads at `/assets/animals-meadow.png`
- [ ] Image scales properly on different screen sizes
- [ ] All 5 animal zones are clickable
- [ ] Animals are clearly visible and identifiable
- [ ] No distortion or blurriness
- [ ] Colors are vibrant and engaging

### Audio Testing Checklist
- [ ] All 5 MP3 files load correctly
- [ ] Sounds play when zones are clicked
- [ ] Volume levels are consistent across files
- [ ] No clipping or distortion
- [ ] Sounds are clear and recognizable
- [ ] Duration feels appropriate (not too long/short)

---

## 🔧 Asset Optimization

### Image Optimization
```bash
# Using ImageMagick
convert animals-meadow.png -resize 1920x1080 -quality 85 animals-meadow-optimized.png

# Using pngquant
pngquant --quality=80-90 animals-meadow.png
```

### Audio Optimization
```bash
# Using ffmpeg
ffmpeg -i cow.wav -b:a 128k -ar 44100 cow.mp3
ffmpeg -i sheep.wav -b:a 128k -ar 44100 sheep.mp3
# ... repeat for other sounds
```

---

## 📊 Asset Size Budget

| Asset | Recommended Size | Max Size |
|-------|------------------|----------|
| animals-meadow.png | 500 KB - 1 MB | 2 MB |
| cow.mp3 | 20-40 KB | 100 KB |
| sheep.mp3 | 15-30 KB | 100 KB |
| duck.mp3 | 10-20 KB | 100 KB |
| rooster.mp3 | 30-50 KB | 100 KB |
| dog.mp3 | 15-30 KB | 100 KB |
| **Total** | **~600 KB** | **2.5 MB** |

---

## 🚨 Fallback Behavior

If assets are missing, the component will:

### Image Missing
- Component renders but shows blank background
- Zones are still clickable (positioned absolutely)
- Instructions still speak via TTS

### Audio Missing
- Sound playback fails silently
- Console error logged
- Activity still progresses (no sound plays)
- TTS instructions still work

### Complete Fallback Test
Test the activity with NO assets to ensure graceful degradation.

---

## 🎨 Design Guidelines

### Visual Style
- **Art Style:** Cartoon/illustration (not photorealistic)
- **Age Group:** 5-8 years old
- **Color Palette:** Bright, primary colors
- **Mood:** Cheerful, educational, non-threatening

### Audio Style
- **Tone:** Clear, recognizable, child-friendly
- **Quality:** Clean recording, no background noise
- **Realism:** Real animal sounds preferred over synthesized
- **Consistency:** Similar audio quality across all files

---

## 📝 Licensing Requirements

Ensure all assets are properly licensed:

### For Production Use
- ✅ Royalty-free license
- ✅ Commercial use allowed
- ✅ Educational use allowed
- ✅ Modification allowed (if needed)
- ❌ No attribution required (preferred)

### License Types
- **Image:** Commercial or Extended License
- **Audio:** Royalty-free or Creative Commons (CC BY or CC0)

---

## 🔗 Quick Reference

**Main Image:**
- Path: `/assets/animals-meadow.png`
- Size: 1920×1080px
- Format: PNG

**Audio Files:**
- Path: `/sounds/*.mp3`
- Format: MP3 (128 kbps, 44.1 kHz)
- Count: 5 files (cow, sheep, duck, rooster, dog)

---

## ✅ Asset Delivery Checklist

Before deploying:
- [ ] All 6 files created (1 image + 5 audio)
- [ ] Files placed in correct directories
- [ ] File paths match exactly (case-sensitive)
- [ ] Image zones align with animal positions
- [ ] Audio files tested in browser
- [ ] Total asset size under 2.5 MB
- [ ] Licenses verified and documented
- [ ] Assets optimized for web delivery
- [ ] Backup copies stored separately

---

**END OF ASSET REQUIREMENTS**
