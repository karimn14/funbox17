# Module 4, Meeting 3: Quick Reference Guide

## Meeting Info
- **Title:** Memahami Teks
- **Module ID:** 104
- **Order:** 3
- **Type:** Reading Comprehension
- **Flow:** Video ❌ → Activity ❌ → Quiz ✅ (Direct to Quiz)
- **Auto-Skip Logic:** ✅ Enabled (skips to quiz if no videos/activities)

## Quiz Structure

### Total Questions: 10

### Story A: "Warisan di Kaki Gunung Merapi" (Q1-Q6)
**Theme:** Environmental conservation and generational responsibility

| Q# | Question Focus | Answer |
|----|---------------|---------|
| 1 | Main theme | B - Ketekunan seseorang... |
| 2 | Why villagers mocked | C - Manfaat tidak instan |
| 3 | Meaning of "estafet" | C - Meneruskan tanggung jawab |
| 4 | Forest function | C - Spons alami |
| 5 | Character of Aris Muda | B - Menghargai sejarah |
| 6 | Moral message | C - Kerja keras menjaga alam |

### Story B: "Gema di Balik Graha Pustaka" (Q7-Q10)
**Theme:** Historical preservation and civic activism

| Q# | Question Focus | Answer |
|----|---------------|---------|
| 7 | Main conflict | B - Identitas sejarah vs ekonomi |
| 8 | Campaign success | C - Menghubungkan nilai emosional |
| 9 | Meaning "Saksi Bisu" | B - Bukti nyata peristiwa sejarah |
| 10 | Government response | B - Pembongkaran dibatalkan |

## Layout Specs

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────┐
│ Left (40%)      │ Right (60%)               │
│ Story Panel     │ Question Panel            │
│ (Scrollable)    │ (Fixed Options)           │
└─────────────────────────────────────────────┘
```

### Mobile (<1024px)
```
┌─────────────────┐
│ Story Panel     │
│ (Top)           │
├─────────────────┤
│ Question Panel  │
│ (Bottom)        │
└─────────────────┘
```

## Code Detection

```typescript
// In MeetingDetail.tsx
const isModule4Meeting3 = meeting?.moduleId === 104 && meeting?.order === 3;
```

## Key Features
- ✅ No video or activity steps
- ✅ Auto-context switching (Q6→Q7)
- ✅ Side-by-side 40/60 layout
- ✅ Text-justified reading material
- ✅ GameButton colored options
- ✅ Progress tracking
- ✅ Mobile responsive

## Testing Checklist
- [ ] Navigate to Module 4
- [ ] Click Meeting 3
- [ ] Verify **no loading/error screen**
- [ ] Verify **direct quiz load** (no video step)
- [ ] Check Story A appears (Q1-Q6)
- [ ] Answer Q6 and verify Story B loads (Q7)
- [ ] Complete all 10 questions
- [ ] Check score calculation
- [ ] Test on mobile device
- [ ] Verify layout doesn't break

## Bug Fix Notes
- ✅ **Auto-skip logic** prevents "Video URL not found" error
- ✅ Meeting loads **directly to quiz** on open
- ✅ No manual navigation required
- See `DIRECT_TO_QUIZ_FIX.md` for technical details

## Database Entry
```sql
SELECT * FROM meetings WHERE moduleId = 104 AND "order" = 3;
-- Should show: Memahami Teks with 10 quiz questions
```

## API Endpoint
```
GET /api/meetings/{meetingId}
-- Returns meeting with content.quiz array (10 questions)
```
