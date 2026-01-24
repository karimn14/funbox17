# Module 2, Meeting 2 - Quick Reference 🎯

## Meeting Info
- **ID:** 39 (in current database)
- **Module:** Keterampilan Bertahan Hidup (ID: 40)
- **Title:** Keselamatan di Luar
- **Order:** 2
- **Format:** Interactive Story (Video → 3 Activities → 5 Quiz Questions)

---

## Content Structure

### 🎬 Video
- URL: `https://youtu.be/NgymEgqTNGE`
- No interactions/popups

### 🎯 Activities (3) - Educational Only
1. **Crossing Street** → Answer: C (Zebra Cross)
2. **Bus Safety** → Answer: C (Duduk tenang + sabuk)
3. **Stranger Danger** → Answer: C (Bilang TIDAK, lari ke Ibu)

### ❓ Quiz (5) - SCORED Assessment
1. **Seatbelt** → C (Sabuk pengaman)
2. **Zebra Cross** → C (Zebra Cross/Garis Putih)
3. **Stranger** → C (Bilang TIDAK dan lari ke orang tua)
4. **Helmet** → B (Helm pelindung)
5. **Lost in Mall** → C (Satpam/petugas berseragam)

---

## Button Mapping (Hardware Controller)
- **Button 0 (Red)** = Option A
- **Button 1 (Blue)** = Option B
- **Button 2 (Green)** = Option C ⭐ (All correct answers in activities!)
- **Button 3 (Yellow)** = Option D
- **Button 5** = Back to home

---

## Scoring System
- Activities: NO SCORE (educational feedback only)
- Quiz: YES SCORE (recorded to database)
  - 5 questions total
  - Score = (correct / 5) × 100
  - Stars: 80%+ = 3⭐, 60%+ = 2⭐, <60% = 1⭐

---

## Key Safety Messages
✅ Cross at zebra crossings with green light  
✅ Always wear seatbelt in vehicles  
✅ Say NO to strangers, run to parents  
✅ Wear helmet when cycling  
✅ Ask uniformed staff when lost  

---

## Testing
```bash
# Re-seed database
npm run db:seed

# Verify Meeting 2 exists
npx tsx -r dotenv/config script/verify-module2-meeting2.ts

# API Test
GET /api/modules/40/meetings
# Should return 2 meetings
```

---

## Files Modified
- ✅ `script/seed-final.ts` - Added meeting 2 content
- ✅ `script/verify-module2-meeting2.ts` - Created verification script
- ✅ `MODULE2_MEETING2_COMPLETE.md` - Full documentation

---

## Status: ✅ COMPLETE & VERIFIED
Date: January 23, 2026
