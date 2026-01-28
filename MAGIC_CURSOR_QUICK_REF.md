# ✨ Magic Cursor - Quick Reference

## Overview
Magical cursor trail effect with sparkle particles following mouse movement.

---

## Key Files
```
client/src/components/MagicCursor.tsx  ← Cursor component
client/src/App.tsx                     ← Integration point
```

---

## Quick Stats

| Feature | Value |
|---------|-------|
| **Max Particles** | 20 |
| **Spawn Rate** | Every 100ms |
| **Animation Time** | 1 second |
| **Emojis** | ✨ 🌟 💫 ⭐ |
| **Size Range** | 15-25px |
| **Performance** | <2% CPU |

---

## How It Works

1. **Mouse moves** → Spawns particle at cursor position
2. **Particle animates** → Floats up 50px, fades out, shrinks
3. **After 1 second** → Particle auto-removes from memory
4. **Max 20 particles** → Old ones removed first (FIFO)

---

## Customization Quick Edits

### Spawn More/Fewer Particles
```typescript
// In MagicCursor.tsx
const SPAWN_INTERVAL = 100;  // ← Change this (ms)
const MAX_PARTICLES = 20;    // ← Change this (count)
```

### Change Animation Speed
```typescript
transition={{
  duration: 1,  // ← Change this (seconds)
}}
```

### Change Float Distance
```typescript
animate={{
  y: particle.y - 50,  // ← Change this (pixels)
}}
```

### Different Emojis
```typescript
const PARTICLE_EMOJIS = ['✨', '🌟', '💫', '⭐'];  // ← Edit array
```

---

## Testing Checklist

- [ ] Particles spawn on mouse movement
- [ ] No lag during fast mouse movement
- [ ] Clicks work normally (not blocked)
- [ ] Works on all pages
- [ ] No console errors

---

## Performance Tips

✅ **DO:** Keep MAX_PARTICLES under 30  
✅ **DO:** Keep SPAWN_INTERVAL above 50ms  
✅ **DO:** Use GPU-friendly properties (opacity, transform)  

❌ **DON'T:** Set MAX_PARTICLES too high (>50)  
❌ **DON'T:** Use heavy animations (shadows, filters)  

---

## Common Issues

**Problem:** No particles appearing  
**Fix:** Check console, verify imports, ensure Framer Motion installed

**Problem:** Too many particles (lag)  
**Fix:** Increase SPAWN_INTERVAL or decrease MAX_PARTICLES

**Problem:** Particles block clicks  
**Fix:** Verify `pointer-events-none` CSS class

---

## Integration

```tsx
// App.tsx - Already integrated!
import { MagicCursor } from "@/components/MagicCursor";

function App() {
  return (
    <>
      <MagicCursor />  {/* ← Works globally */}
      {/* ...rest of app */}
    </>
  );
}
```

---

## User Experience

```
🖱️ Mouse moves →
   ✨ Fresh particle (bright)
  💫 Fading (75%)
 🌟 Fading more (50%)
⭐ Almost gone (25%)
💨 Disappeared
```

**Creates a magical trailing effect! 🪄✨**
