# FunBox Module Content Schema

This document describes the new gamification content structure for FunBox learning modules.

## Schema Overview

The `moduleContentSchema` provides a comprehensive structure for gamified learning experiences with the following components:

1. **Opening Text** - Introduction/greeting for the module
2. **Video** - Educational video content (YouTube URL)
3. **Activity** - Interactive button-pressing activity with colored options
4. **Quiz** - 5 multiple-choice questions to test comprehension
5. **Closing Text** - Congratulatory message upon completion

## Full Type Definition

```typescript
type ModuleContent = {
  openingText: string;
  videoUrl: string; // Must be a valid URL
  activity: {
    instruction: string;
    options: Array<{
      color: "red" | "blue" | "green" | "yellow";
      text: string;
    }>; // Exactly 4 options
    correctIndex: number; // 0-3
  };
  quiz: Array<{
    question: string;
    options: string[]; // Exactly 4 options
    correctAnswer: string; // Must match one of the options
  }>; // Exactly 5 questions
  closingText: string;
};
```

## Example JSON

```json
{
  "openingText": "Selamat datang di modul Matematika!",
  "videoUrl": "https://www.youtube.com/watch?v=Fe8u2I3vmHU",
  "activity": {
    "instruction": "Tekan tombol dengan warna yang sesuai: Berapa hasil dari 2 + 2?",
    "options": [
      { "color": "red", "text": "3" },
      { "color": "blue", "text": "4" },
      { "color": "green", "text": "5" },
      { "color": "yellow", "text": "6" }
    ],
    "correctIndex": 1
  },
  "quiz": [
    {
      "question": "Berapa hasil dari 1 + 1?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "2"
    },
    {
      "question": "Hitung: 2 + 2 = ?",
      "options": ["1", "3", "4", "5"],
      "correctAnswer": "4"
    },
    {
      "question": "Angka setelah 4 adalah?",
      "options": ["3", "5", "6", "7"],
      "correctAnswer": "5"
    },
    {
      "question": "Berapa jumlah apel? 🍎🍎 + 🍎",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": "3"
    },
    {
      "question": "Manakah yang lebih besar: 5 atau 2?",
      "options": ["2", "5", "Sama", "Tidak Tahu"],
      "correctAnswer": "5"
    }
  ],
  "closingText": "Selamat! Kamu telah menyelesaikan modul! 🎉"
}
```

## Usage in Code

### Import the Schema and Types

```typescript
import { 
  moduleContentSchema, 
  type ModuleContent,
  type Activity,
  type QuizQuestion 
} from "@shared/schema";
```

### Validate Module Content

```typescript
import { validateModuleContent } from "@/server/module-content-example";

// This will throw an error if invalid
const validContent = validateModuleContent(unknownData);

// Or use safe validation
const result = safeValidateModuleContent(unknownData);
if (result.success) {
  console.log("Valid content:", result.data);
} else {
  console.error("Validation errors:", result.error);
}
```

### Database Storage

The `modules` table now has two fields:
- `questions` (JSONB) - Legacy field for backward compatibility
- `content` (JSONB) - **New field** for FunBox gamification content

```typescript
// Creating a new module with FunBox content
await storage.createModule({
  title: "Matematika: Penjumlahan",
  category: "Matematika",
  videoUrl: "https://www.youtube.com/watch?v=...",
  questions: [], // Keep for backward compatibility
  content: {
    openingText: "...",
    videoUrl: "...",
    activity: { ... },
    quiz: [ ... ],
    closingText: "..."
  }
});
```

## Validation Rules

### Activity
- Must have exactly **4 options**
- Colors must be: `red`, `blue`, `green`, or `yellow`
- `correctIndex` must be between 0 and 3

### Quiz
- Must have exactly **5 questions**
- Each question must have exactly **4 options**
- `correctAnswer` must match one of the options exactly

### URLs
- `videoUrl` must be a valid URL format

## Migration Path

For existing modules using the `questions` field:
1. Keep `questions` populated for backward compatibility
2. Gradually populate the `content` field with new structure
3. Update frontend components to use `content` when available
4. Fall back to `questions` for legacy modules

## Frontend Integration

The FunBox hardware simulation (`useWebSerial` hook) maps keyboard keys to colors:
- `A` or `1` → Red (index 0)
- `B` or `2` → Blue (index 1)
- `C` or `3` → Green (index 2)
- `D` or `4` → Yellow (index 3)

Match these with the `activity.options[correctIndex].color` for validation.

## See Also

- `shared/schema.ts` - Schema definitions
- `server/module-content-example.ts` - Example content and validation helpers
- `client/src/hooks/use-web-serial.ts` - Hardware simulation
