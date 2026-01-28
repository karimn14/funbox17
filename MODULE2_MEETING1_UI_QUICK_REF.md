# Module 2 Meeting 1 - UI Component Quick Reference

## Context Story Display (Activities 1-4)

### Layout Structure
```
┌────────────────────────────────────────────┐
│         Activity Card (white)              │
│  ┌──────────────────────────────────────┐  │
│  │  Context Story Box (bg-blue-50)      │  │
│  │  "Budi dan Ani pergi ke taman..."    │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Question (text-3xl, font-bold, center)   │
│  "Apa yang harus dilakukan Budi?"         │
│                                            │
│  ┌────────┐  ┌────────┐                   │
│  │   A    │  │   B    │                   │
│  │ Option │  │ Option │                   │
│  └────────┘  └────────┘                   │
│  ┌────────┐  ┌────────┐                   │
│  │   C    │  │   D    │                   │
│  │ Option │  │ Option │                   │
│  └────────┘  └────────┘                   │
└────────────────────────────────────────────┘
```

### Styling Details
- **Story Box**: `bg-blue-50 rounded-2xl p-6 mb-6`
- **Story Text**: `text-lg leading-relaxed text-gray-700`
- **Question**: `text-3xl font-display font-bold text-center mb-6 text-gray-800`

## Info Activity Display (Activity 5)

### Layout Structure
```
┌────────────────────────────────────────────┐
│         Activity Card (white)              │
│  ┌──────────────────────────────────────┐  │
│  │  Context Story Box (bg-blue-50)      │  │
│  │  "Ingat selalu untuk berhati-hati    │  │
│  │   dan jaga keselamatan dirimu!"      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │      [Mulai Kuis]                  │   │
│  │  (green gradient, full width)      │   │
│  └────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### Styling Details
- **Story Box**: `bg-blue-50 rounded-2xl p-6 mb-6`
- **Story Text**: `text-lg leading-relaxed text-gray-700 text-center`
- **Button**: `bg-gradient-to-r from-green-400 to-emerald-500` (full width)
- **Button Text**: `text-white font-black text-2xl`

## Behavior Differences

| Feature | Regular Activities (1-4) | Info Activity (5) |
|---------|-------------------------|-------------------|
| Context Story | ✅ Shows above question | ✅ Shows (centered) |
| Question/Instruction | ✅ Shows as heading | ❌ Hidden |
| A/B/C/D Options | ✅ 4-button grid | ❌ None |
| Action Button | ❌ None (click options) | ✅ "Mulai Kuis" |
| Hardware Buttons | ✅ Enabled | ❌ Disabled |
| On Complete | Next activity | Go to quiz |

## Code Snippets

### Check if Activity Has Context Story
```tsx
{(currentActivity as any).contextStory && (
  <div className="bg-blue-50 rounded-2xl p-6 mb-6">
    <p className="text-lg leading-relaxed text-gray-700">
      {(currentActivity as any).contextStory}
    </p>
  </div>
)}
```

### Check if Activity is Info Type
```tsx
if (currentActivity.type === 'info') {
  // Render info layout (no options, just button)
} else {
  // Render regular layout (with A/B/C/D options)
}
```

### Info Activity Button Handler
```tsx
<button
  onClick={() => setStep('quiz')}
  className="w-full bg-gradient-to-r from-green-400 to-emerald-500..."
>
  Mulai Kuis
</button>
```

## Data Structure

### Regular Activity (with context)
```typescript
{
  id: "m2_meet1_act1",
  contextStory: "Narrative context here...",
  instruction: "Question text here?",
  options: [
    { color: "red", text: "Option A" },
    { color: "blue", text: "Option B" },
    { color: "green", text: "Option C" },
    { color: "yellow", text: "Option D" }
  ],
  correctIndex: 2
}
```

### Info Activity
```typescript
{
  id: "m2_meet1_act5",
  type: "info",
  contextStory: "Closing summary text...",
  instruction: "Safety Reminder" // Optional, not displayed
}
```

## Common Issues & Solutions

### Issue: Context story not showing
**Solution**: Verify `contextStory` field exists in seed data and is not empty string

### Issue: Info activity showing options
**Solution**: Ensure `type: "info"` is set in activity data

### Issue: Hardware buttons triggering on info slide
**Solution**: Type guard added at line ~355 in MeetingDetail.tsx

### Issue: TypeScript errors about 'info' type
**Solution**: Schema updated to include `infoActivitySchema` in discriminated union

---
**Quick Access**: See full implementation in `MODULE2_MEETING1_UI_FIX_COMPLETE.md`
