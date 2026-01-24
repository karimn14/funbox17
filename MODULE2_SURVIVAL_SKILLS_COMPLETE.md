# Module 2: Keterampilan Bertahan Hidup - Implementation Complete ✅

## Overview
Successfully implemented **Module 2: Keterampilan Bertahan Hidup** (Survival Skills) with **Meeting 1: Bahaya di Rumah** (Hazards at Home). This module uses an **interactive story-based learning approach** where activities flow like a continuous narrative with contextual questions.

## Implementation Date
**January 23, 2026**

## Database State
- **Module 1 ID:** 35 (Pengenalan Uang & Berhitung - 4 meetings)
- **Module 2 ID:** 36 (Keterampilan Bertahan Hidup - 1 meeting) ← **NEW**
- **Module 3 ID:** 37 (Bahasa Inggris Dasar - placeholder)
- **Module 4 ID:** 38 (Bahasa Indonesia & Literasi - placeholder)

---

## Module 2 Structure

### Module Details
```typescript
{
  id: 36,
  title: "Keterampilan Bertahan Hidup",
  category: "Life Skills",
  description: "Belajar keterampilan penting untuk kehidupan sehari-hari",
  imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
  order: 2
}
```

### Meeting 1: Bahaya di Rumah
**Title:** "Bahaya di Rumah"  
**Order:** 1  
**Module ID:** 36  
**Learning Objective:** Teach children to identify and avoid common household hazards

---

## Interactive Story Flow

### Learning Approach
Unlike traditional isolated activities, Module 2 Meeting 1 uses **narrative-driven learning** where each activity is a chapter in a continuous story. Students experience a day in the life of a child encountering various household dangers.

### Story Arc Structure
```
Morning → Kitchen Hazards → Accident → First Aid → Medicine Safety
```

Each activity builds on the previous one, creating an immersive educational experience.

---

## Video Component

### Video 1: Bahaya di Rumah
- **URL:** `https://youtu.be/ZhyX7SR7kn0`
- **Title:** "Bahaya di Rumah"
- **Interactions:** None (continuous play)
- **Purpose:** Introduction to household safety concepts

---

## Activity Breakdown (Interactive Story Segments)

### Activity 1: Sharp Objects & Electricity
**Context:** Morning routine - entering the kitchen

**Narrative:**
> "Kamu bangun tidur dan ke dapur. Di meja ada PISAU TAJAM, STOP KONTAK terkelupas, dan KOMPOR menyala. Apa yang harus kamu lakukan?"

**Educational Focus:** Identifying multiple hazards simultaneously

**Options:**
- **A (Red):** "Memegang ujung pisau" ❌ (Dangerous)
- **B (Blue):** "Mencolokkan jari ke stop kontak" ❌ (Electrocution risk)
- **C (Green):** "Diam dan jangan sentuh" ✅ **CORRECT** (Safety first)
- **D (Yellow):** "Bermain api" ❌ (Fire hazard)

**Image:** Kitchen hazards scene
**Correct Answer:** Index 2 (Green - "Diam dan jangan sentuh")

**Learning Outcome:** Children learn to recognize danger and avoid touching hazardous items.

---

### Activity 2: Hot Water & Slippery Floor
**Context:** Accident scenario - spilled hot water

**Narrative:**
> "Kamu tersenggol gelas air panas. Lantai jadi basah dan licin. Apa yang kamu lakukan supaya tidak jatuh?"

**Educational Focus:** Emergency response to slipping hazards

**Options:**
- **A (Red):** "Lari kencang" ❌ (Increased fall risk)
- **B (Blue):** "Berdiri diam saja" ❌ (Not helpful)
- **C (Green):** "Berhenti, jalan pelan ke tempat kering, minta tolong" ✅ **CORRECT** (Proper response)
- **D (Yellow):** "Melompat-lompat" ❌ (Dangerous)

**Image:** Wet slippery floor
**Correct Answer:** Index 2 (Green - "Berhenti, jalan pelan ke tempat kering, minta tolong")

**Learning Outcome:** Children learn to move slowly and carefully on wet surfaces and seek help.

---

### Activity 3: Burn Injury
**Context:** First aid scenario - hot water burn

**Narrative:**
> "Aduh! Tanganmu kena air panas dan terasa perih. Apa yang kamu lakukan sekarang?"

**Educational Focus:** Proper burn treatment

**Options:**
- **A (Red):** "Oleskan odol/kecap" ❌ (Common myth - dangerous)
- **B (Blue):** "Basuh dengan air mengalir" ✅ **CORRECT** (Proper first aid)
- **C (Green):** "Menangis di pojokan" ❌ (No action taken)
- **D (Yellow):** "Bungkus plastik" ❌ (Infection risk)

**Image:** Burn injury scenario
**Correct Answer:** Index 1 (Blue - "Basuh dengan air mengalir")

**Learning Outcome:** Children learn the correct first aid response for burns (running water, not folk remedies).

---

### Activity 4: Unknown Medicine
**Context:** Post-recovery scenario - medicine safety

**Narrative:**
> "Tanganmu sudah membaik. Lalu kamu melihat obat warna-warni seperti permen. Bolehkah dimakan?"

**Educational Focus:** Medicine is not candy - ask adults first

**Options:**
- **A (Red):** "Boleh, telan banyak-banyak" ❌ (Poisoning risk)
- **B (Blue):** "Masukkan mulut lalu buang" ❌ (Still dangerous)
- **C (Green):** "Berikan ke kucing" ❌ (Animal harm)
- **D (Yellow):** "Tidak boleh, tanya Ibu/Ayah dulu" ✅ **CORRECT** (Safe choice)

**Image:** Colorful medicine pills
**Correct Answer:** Index 3 (Yellow - "Tidak boleh, tanya Ibu/Ayah dulu")

**Learning Outcome:** Children learn to never take medicine without adult permission.

---

## Quiz Section (5 Questions)

### Question 1: Sharp Object on Floor
**Q:** "Ada pisau tajam di lantai. Apa tindakanmu?"  
**Image:** Knife on floor  
**Options:**
- A. "Mainkan pisau itu" ❌
- B. "Lapor ke orang tua dan jauhi" ✅ **CORRECT**
- C. "Lempar pisau itu" ❌
- D. "Simpan di bawah bantal" ❌

**Learning Point:** Report hazards to adults, don't touch.

---

### Question 2: Damaged Electrical Outlet
**Q:** "Stop kontak kabelnya rusak. Apa tindakanmu?"  
**Image:** Broken outlet  
**Options:**
- A. "Colokkan jari ke lubangnya" ❌
- B. "Coba perbaiki sendiri" ❌
- C. "Jangan disentuh, bilang Ayah" ✅ **CORRECT**
- D. "Siram dengan air" ❌

**Learning Point:** Never touch broken electrical equipment.

---

### Question 3: Medicine on Table
**Q:** "Ada obat di meja tamu. Itu untuk siapa?"  
**Image:** Pills on table  
**Options:**
- A. "Hanya untuk orang sakit/Dewasa yang tahu" ✅ **CORRECT**
- B. "Untuk semua orang" ❌
- C. "Untuk anak-anak" ❌
- D. "Untuk hewan peliharaan" ❌

**Learning Point:** Medicine is only for sick people, adults decide.

---

### Question 4: Slippery Bathroom Floor
**Q:** "Lantai kamar mandi basah dan licin. Bagaimana cara jalannya?"  
**Image:** Wet bathroom floor  
**Options:**
- A. "Lari sekencang-kencangnya" ❌
- B. "Jalan pelan-pelan dan hati-hati" ✅ **CORRECT**
- C. "Melompat-lompat" ❌
- D. "Merangkak" ❌

**Learning Point:** Walk slowly on wet surfaces to avoid falling.

---

### Question 5: Matches on Floor
**Q:** "Ada korek api jatuh di lantai. Apa tindakanmu?"  
**Image:** Matches on floor  
**Options:**
- A. "Main-mainkan korek api itu" ❌
- B. "Bakar kertas" ❌
- C. "Nyalakan korek api" ❌
- D. "Serahkan pada orang tua" ✅ **CORRECT**

**Learning Point:** Fire-starting tools belong to adults only.

---

## Closing Message

### Final Safety Recap
```
"Ingat Pesan Siaga: 
- Benda Tajam & Panas (Jangan sentuh)
- Lantai Basah (Minta bantuan)
- Air Panas (Basuh air mengalir)
- Obat (Tanya Orang Tua)"
```

This closing text reinforces the four key safety messages learned throughout the meeting.

---

## Educational Pedagogy

### Why Interactive Story Format?

#### 1. **Contextual Learning**
Instead of abstract questions, students experience realistic scenarios:
- "You wake up and go to the kitchen..." (relatable context)
- "Oh no! Your hand touched hot water..." (emotional engagement)

#### 2. **Sequential Consequences**
Each activity flows from the previous one:
- **Activity 1:** Identify hazards → Avoid them
- **Activity 2:** Accident happens → Respond safely
- **Activity 3:** Injury occurs → Apply first aid
- **Activity 4:** Recovery → Learn prevention

#### 3. **Emotional Connection**
The narrative creates investment:
- Students "become" the character
- Decisions feel meaningful
- Mistakes have story consequences
- Success feels rewarding

#### 4. **Real-World Application**
Scenarios mirror actual home situations:
- Kitchen hazards during breakfast
- Bathroom slip risks
- Medicine storage in living areas
- Emergency response protocols

---

## Hardware Button Integration

### Activity Button Mapping
All activities use standard 4-button layout:

```
[Button 0 - Red]    [Button 1 - Blue]
[Button 2 - Green]  [Button 3 - Yellow]
```

### Example: Activity 1 (Kitchen Hazards)
- **Button 0 (Red):** "Memegang ujung pisau" → LOSE feedback
- **Button 1 (Blue):** "Mencolokkan jari ke stop kontak" → LOSE feedback
- **Button 2 (Green):** "Diam dan jangan sentuh" → WIN feedback ✅
- **Button 3 (Yellow):** "Bermain api" → LOSE feedback

---

## Visual Feedback System

### Correct Answer (Activity 3 - Blue)
```
1. Student presses Button 1 (Blue - "Basuh dengan air mengalir")
2. System validates: correctIndex === 1 → TRUE
3. Sends WIN command to FunBox
4. Shows green CheckCircleIcon (180px)
5. Triggers green confetti (150 particles)
6. Delays 1500ms for celebration
7. Auto-advances to Activity 4
```

### Incorrect Answer (Activity 3 - Red)
```
1. Student presses Button 0 (Red - "Oleskan odol/kecap")
2. System validates: correctIndex === 1 → FALSE
3. Sends LOSE command to FunBox
4. Shows red CancelIcon (180px)
5. Triggers red confetti (150 particles)
6. Delays 1500ms
7. Resets to try Activity 3 again
```

---

## Testing Instructions

### Step 1: Navigate to Module 2
1. Start application: `npm run dev`
2. Login with any student
3. Go to Dashboard
4. Select **"Keterampilan Bertahan Hidup"** card (Module ID: 36)

### Step 2: Start Meeting 1
1. Click **"Bahaya di Rumah"** (Meeting Order: 1)
2. Watch opening video (https://youtu.be/ZhyX7SR7kn0)
3. Click "Lanjut ke Aktivitas"

### Step 3: Test Activity Flow
**Activity 1 (Kitchen Hazards):**
- Read narrative: "Kamu bangun tidur dan ke dapur..."
- Test wrong answers (A, B, D) → Red X
- Test correct answer (C - Green) → Green checkmark, advance to Activity 2

**Activity 2 (Slippery Floor):**
- Read narrative: "Kamu tersenggol gelas air panas..."
- Test wrong answers (A, B, D) → Red X
- Test correct answer (C - Green) → Green checkmark, advance to Activity 3

**Activity 3 (Burn Treatment):**
- Read narrative: "Aduh! Tanganmu kena air panas..."
- Test wrong answers (A, C, D) → Red X
- Test correct answer (B - Blue) → Green checkmark, advance to Activity 4

**Activity 4 (Medicine Safety):**
- Read narrative: "Tanganmu sudah membaik..."
- Test wrong answers (A, B, C) → Red X
- Test correct answer (D - Yellow) → Green checkmark, advance to Quiz

### Step 4: Test Quiz Section
Complete 5 quiz questions:
1. Knife on floor → B (Lapor ke orang tua dan jauhi)
2. Broken outlet → C (Jangan disentuh, bilang Ayah)
3. Medicine on table → A (Hanya untuk orang sakit/Dewasa yang tahu)
4. Slippery floor → B (Jalan pelan-pelan dan hati-hati)
5. Matches on floor → D (Serahkan pada orang tua)

### Step 5: Verify Closing Message
After quiz completion, verify the safety recap message displays:
- "Ingat Pesan Siaga: Benda Tajam & Panas (Jangan sentuh)..."

---

## Key Differences from Module 1

| Aspect | Module 1 (Money) | Module 2 (Safety) |
|--------|------------------|-------------------|
| **Learning Style** | Skill-based (counting, addition) | Scenario-based (danger recognition) |
| **Activity Structure** | Isolated tasks | Continuous story |
| **Context** | Shopping, transactions | Home hazards, emergency response |
| **Emotional Tone** | Adventurous, playful | Educational, cautionary |
| **Question Format** | "What is the answer?" | "What would you do?" |
| **Progression** | Linear skill building | Sequential event chain |

---

## Safety Education Goals

### Primary Objectives
1. ✅ **Hazard Recognition:** Identify sharp objects, electricity, fire, hot liquids
2. ✅ **Risk Avoidance:** Understand "don't touch" principle for dangerous items
3. ✅ **Emergency Response:** Know proper actions when accidents happen
4. ✅ **First Aid Basics:** Treat minor burns with running water
5. ✅ **Medicine Safety:** Never take medicine without adult permission

### Cognitive Skills Developed
- **Situational Awareness:** Notice multiple hazards in environment
- **Decision Making:** Choose safe actions under pressure
- **Cause & Effect:** Understand consequences of unsafe behavior
- **Help-Seeking:** Recognize when to call for adult assistance

### Behavioral Outcomes
Students should be able to:
- **Pause before acting** when seeing potential danger
- **Report hazards** to parents instead of investigating alone
- **Walk carefully** on wet/slippery surfaces
- **Apply basic first aid** for minor injuries
- **Ask permission** before touching unfamiliar items

---

## Content Design Principles

### 1. Age-Appropriate Language
- **Simple vocabulary:** "Diam dan jangan sentuh" (Stop and don't touch)
- **Direct instructions:** "Basuh dengan air mengalir" (Wash with running water)
- **Relatable scenarios:** Morning routine, kitchen activities

### 2. Visual Safety Cues
- **Red options:** Often dangerous/wrong choices
- **Green/Blue options:** Often safe/correct choices
- **Images:** Contextualize each hazard (knife, outlet, pills, wet floor)

### 3. Reinforcement Through Repetition
- **Activities:** Teach concepts through story
- **Quiz:** Reinforce same concepts in different scenarios
- **Closing:** Summarize all key messages

### 4. Positive Framing
Instead of just "don't do this," teach "do this instead":
- ❌ "Don't touch the knife" → ✅ "Stay still and call for help"
- ❌ "Don't run on wet floor" → ✅ "Walk slowly to dry area"
- ❌ "Don't eat medicine" → ✅ "Ask Ibu/Ayah first"

---

## Technical Implementation Notes

### Schema Compatibility
Module 2 Meeting 1 uses **single-select activities only** (no multi-select like Module 1 Meeting 2). This is intentional for simplicity in safety scenarios where there's typically one correct action.

### Activity Configuration
```typescript
{
  id: "sharp_objects_electricity",
  instruction: "Narrative context...",
  imageUrl: "https://...",
  options: [
    { color: "red", text: "Wrong option 1" },
    { color: "blue", text: "Wrong option 2" },
    { color: "green", text: "Correct option" },
    { color: "yellow", text: "Wrong option 3" }
  ],
  correctIndex: 2  // Single correct answer
}
```

### Frontend Rendering
The `MeetingDetail.tsx` component handles this meeting identically to Module 1 meetings:
- Step progression: video → activity → quiz → result
- Single-select validation with immediate feedback
- Hardware button integration (0-3 for A-D, 5 for home)
- Giant feedback overlay with confetti

---

## Future Enhancements

### Additional Meetings for Module 2
1. **Meeting 2:** "Keselamatan di Jalan" (Road Safety)
   - Crossing streets
   - Traffic signs
   - Pedestrian rules
   
2. **Meeting 3:** "Keadaan Darurat" (Emergency Situations)
   - Fire alarm response
   - Earthquake safety
   - Lost child procedures
   
3. **Meeting 4:** "Kebersihan & Kesehatan" (Hygiene & Health)
   - Handwashing
   - Food safety
   - Illness prevention

### Advanced Features
- **Branching narratives:** Different story paths based on choices
- **Timed decisions:** Quick response scenarios
- **Multiple hazards:** Select 2-3 dangers from a scene (multi-select)
- **Parent mode:** Send safety reports to parents' phones

---

## Success Metrics

### Immediate Indicators (Within Session)
- [x] All 4 activities load correctly
- [x] Story narrative displays properly
- [x] Correct answers trigger WIN feedback
- [x] Wrong answers trigger LOSE feedback
- [x] Quiz section loads after activities
- [x] Closing message displays with safety recap

### Learning Outcomes (Post-Session)
Students should demonstrate:
- Improved hazard recognition (pre/post quiz comparison)
- Ability to verbalize safety rules
- Confidence in emergency response knowledge
- Retention of key safety messages (follow-up assessment)

---

## Documentation References

### Related Files
- **Seed Script:** `script/seed-final.ts` (Lines 428-554)
- **Schema:** `shared/schema.ts` (Activity and Meeting types)
- **Frontend:** `client/src/pages/MeetingDetail.tsx` (Activity rendering)
- **Multi-Select Guide:** `MULTISELECT_IMPLEMENTATION_COMPLETE.md`

### API Endpoints
```
GET /api/modules/36/meetings          → List Meeting 1
GET /api/meetings/[meeting_id]        → Get full content
POST /api/progress                    → Record completion
```

### Database Queries
```sql
-- Get Module 2
SELECT * FROM modules WHERE id = 36;

-- Get Meeting 1 content
SELECT * FROM meetings WHERE module_id = 36 AND "order" = 1;

-- Check student progress
SELECT * FROM student_progress WHERE module_id = 36;
```

---

## Implementation Status: ✅ COMPLETE

**Date:** January 23, 2026  
**Module ID:** 36  
**Meeting Count:** 1  
**Total Activities:** 4 (interactive story segments)  
**Total Quiz Questions:** 5  
**Hardware Integration:** ✅ Fully compatible  
**Testing Status:** Ready for user testing  

**Next Steps:**
1. Test Meeting 1 with students
2. Gather feedback on story engagement
3. Measure learning retention
4. Plan Meetings 2-4 for Module 2
5. Consider expanding to other safety topics

---

**Implementation Complete!** 🎉🏠🛡️

