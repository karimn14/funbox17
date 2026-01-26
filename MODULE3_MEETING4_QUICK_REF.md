# Module 3, Meeting 4: Animal Mimic - Quick Reference

## 🎯 What Is This?

**Module 3, Meeting 4**: "Binatang dan Suaranya" (Animals and Their Sounds)  
**Activity Type**: `animal_mimic` - Interactive sound mimicry activity

---

## 🚀 Quick Start

### Database
```bash
npm run db:seed
```
✅ Creates Meeting 4 in Module 3 (ID: 89)

### Navigate in App
1. Home → "Bahasa Inggris Dasar"
2. Select Meeting 4: "Binatang dan Suaranya"
3. Watch video → Do activity → Take quiz

---

## 🎮 Activity Flow

```
1. PROMPT (2.5s)
   ↓ "Make the sound of the Cow!"
   ↓ [Auto-advances]
   
2. WAITING
   ↓ Student mimics sound (offline)
   ↓ Student clicks highlighted zone
   
3. REVEAL (2.5s)
   ↓ Real sound plays (cow.mp3)
   ↓ Checkmark appears
   ↓ [Auto-advances to next animal]
   
4. COMPLETE
   ↓ All 5 animals done
   ↓ Confetti + closing audio
   ↓ → Quiz
```

---

## 🐄 Animals (5 Total)

| Animal | Zone Position | Sound File | Sound |
|--------|---------------|------------|-------|
| Cow | 20% top, 10% left | `/sounds/cow.mp3` | Moo |
| Sheep | 50% top, 20% left | `/sounds/sheep.mp3` | Baa |
| Duck | 70% top, 60% left | `/sounds/duck.mp3` | Quack |
| Rooster | 10% top, 70% left | `/sounds/rooster.mp3` | Cock-a-doodle-doo |
| Dog | 40% top, 80% left | `/sounds/dog.mp3` | Woof |

---

## 📦 Required Assets

### Image
```
/assets/animals-meadow.png
```
Full-screen meadow with 5 animals

### Audio (5 files)
```
/sounds/cow.mp3
/sounds/sheep.mp3
/sounds/duck.mp3
/sounds/rooster.mp3
/sounds/dog.mp3
```
All MP3 format, 1-3 seconds each

---

## 🧩 Component Usage

```tsx
import { AnimalMimicActivity } from "@/components/activities/AnimalMimicActivity";

<AnimalMimicActivity
  imageUrl="/assets/animals-meadow.png"
  introAudio="Make the sound of this animal based on your thoughts!"
  animals={[
    {
      name: "Cow",
      zone: { top: "20%", left: "10%", width: "20%", height: "20%" },
      soundUrl: "/sounds/cow.mp3"
    },
    // ... more animals
  ]}
  closingAudio="You sound just like a real animal choir!"
  onComplete={() => { /* next step */ }}
/>
```

---

## 🎨 Visual Design

- **Background**: Green-yellow-blue gradient (meadow theme)
- **Active Zone**: Pulsing yellow border (1.5s loop)
- **Instruction Banner**: White with yellow border (top center)
- **Progress**: "Animal X of 5" (top center, below banner)
- **Completion**: Confetti + celebration modal

---

## ❓ Quiz Questions (5)

All questions are based on "The Concert in Musical Meadow" story.

1. Barnaby the Cow sound? → **Moo** ✓
2. Shirley the Sheep hello? → **Baa** ✓
3. Duck in pond sound? → **Quack** ✓
4. Rudy the Rooster cry? → **Cock-a-doodle-doo** ✓
5. Friendly dog sound? → **Woof** ✓

---

## 🔧 Files Changed

### Created
```
client/src/components/activities/AnimalMimicActivity.tsx (320 lines)
```

### Modified
```
script/seed-final.ts (added Meeting 4)
client/src/pages/MeetingDetail.tsx (added animal_mimic handling)
```

---

## 🧪 Testing

### Manual Test
```
1. npm run db:seed
2. npm run dev
3. Navigate to Module 3 → Meeting 4
4. Test each animal interaction
5. Verify sounds play
6. Complete activity → Check quiz loads
```

### Checklist
- [ ] TTS speaks instructions
- [ ] Zones pulse and are clickable
- [ ] Animal sounds play
- [ ] Progress updates correctly
- [ ] Confetti triggers on completion
- [ ] Quiz loads after activity

---

## 🎓 Learning Goals

- **Vocabulary**: 5 animal names (English)
- **Sounds**: Cow, Sheep, Duck, Rooster, Dog
- **Skills**: Listening, speaking, sound recognition
- **Story**: Reading comprehension via quiz

---

## 🐛 Known Issues

1. **Missing Assets**: Component renders but no sounds if files missing
2. **TTS Unavailable**: Falls back to text-only instructions
3. **Mobile**: Not fully tested on screens <768px

---

## 📚 Related Docs

- **Full Guide**: `MODULE3_MEETING4_ANIMAL_MIMIC_COMPLETE.md`
- **Meeting 1**: `MODULE3_ENGLISH_COMPLETE.md`
- **Meeting 2**: `MODULE3_MEETING2_BODY_PARTS_COMPLETE.md`
- **Meeting 3**: `MODULE3_MEETING3_MATCH_LINE_COMPLETE.md`

---

## 🎉 Quick Summary

**What**: Interactive animal sound mimicry activity  
**Where**: Module 3, Meeting 4  
**How**: 3-stage flow (Prompt → Mimic → Reveal)  
**Why**: Learn animal sounds in English with audio feedback  

**Status**: ✅ Fully Implemented & Seeded

---

**END OF QUICK REFERENCE**
