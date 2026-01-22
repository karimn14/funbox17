# 🎮 FunBox Schema Quick Reference

## Import Statements

```typescript
// Import schema and types
import { 
  moduleContentSchema, 
  type ModuleContent,
  type Activity,
  type QuizQuestion,
  type ActivityOption
} from "@shared/schema";

// Import validation helpers
import { 
  validateModuleContent, 
  safeValidateModuleContent,
  exampleModuleContent 
} from "@/server/module-content-example";

// Import example modules
import { 
  matematikaModule, 
  bahasaWarnaModule, 
  sainsHewanModule 
} from "@/server/module-examples";
```

## Type Definitions

```typescript
type ActivityOption = {
  color: "red" | "blue" | "green" | "yellow";
  text: string;
}

type Activity = {
  instruction: string;
  options: [ActivityOption, ActivityOption, ActivityOption, ActivityOption]; // 4
  correctIndex: 0 | 1 | 2 | 3;
}

type QuizQuestion = {
  question: string;
  options: [string, string, string, string]; // 4
  correctAnswer: string;
}

type ModuleContent = {
  openingText: string;
  videoUrl: string;
  activity: Activity;
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion]; // 5
  closingText: string;
}
```

## Validation

```typescript
// Throws error if invalid
const valid = moduleContentSchema.parse(data);

// OR use safe validation
const result = moduleContentSchema.safeParse(data);
if (result.success) {
  console.log(result.data); // ModuleContent
} else {
  console.error(result.error); // ZodError
}

// OR use helper
const valid = validateModuleContent(data);
```

## Creating a Module

```typescript
const newModule: InsertModule = {
  title: "My Module",
  category: "Matematika",
  videoUrl: "https://youtube.com/...",
  questions: [], // Legacy
  content: {
    openingText: "Welcome!",
    videoUrl: "https://youtube.com/...",
    activity: {
      instruction: "Press the correct color!",
      options: [
        { color: "red", text: "A" },
        { color: "blue", text: "B" },
        { color: "green", text: "C" },
        { color: "yellow", text: "D" }
      ],
      correctIndex: 1
    },
    quiz: [
      { question: "Q1?", options: ["A","B","C","D"], correctAnswer: "A" },
      { question: "Q2?", options: ["A","B","C","D"], correctAnswer: "B" },
      { question: "Q3?", options: ["A","B","C","D"], correctAnswer: "C" },
      { question: "Q4?", options: ["A","B","C","D"], correctAnswer: "D" },
      { question: "Q5?", options: ["A","B","C","D"], correctAnswer: "A" }
    ],
    closingText: "Great job! 🎉"
  }
};

await storage.createModule(newModule);
```

## Validation Rules

| Field | Rule |
|-------|------|
| `openingText` | Required string |
| `videoUrl` | Valid URL format |
| `activity.options` | Exactly 4 items |
| `activity.correctIndex` | 0-3 |
| `activity.options[].color` | "red", "blue", "green", or "yellow" |
| `quiz` | Exactly 5 questions |
| `quiz[].options` | Exactly 4 options each |
| `quiz[].correctAnswer` | Must match one option |
| `closingText` | Required string |

## Color → Button Mapping

| Color | Keyboard | Index |
|-------|----------|-------|
| Red | A or 1 | 0 |
| Blue | B or 2 | 1 |
| Green | C or 3 | 2 |
| Yellow | D or 4 | 3 |

## Files Reference

| Purpose | File |
|---------|------|
| Schema Definition | `shared/schema.ts` |
| Example Content | `server/module-content-example.ts` |
| Full Examples | `server/module-examples.ts` |
| Tests | `server/test-schema.ts` |
| Documentation | `docs/MODULE_CONTENT_SCHEMA.md` |
| Summary | `SCHEMA_IMPLEMENTATION_SUMMARY.md` |

## Quick Test

```bash
# Validate schema
npx tsx server/test-schema.ts

# Run migrations
npx tsx script/migrate.ts

# Start dev server
npm run dev
```

## Common Errors

```typescript
// ❌ Wrong number of options
activity: {
  options: [{ color: "red", text: "A" }] // Need 4!
}

// ❌ Invalid color
{ color: "purple", text: "A" } // Use: red, blue, green, yellow

// ❌ Wrong number of quiz questions
quiz: [/* 3 questions */] // Need exactly 5!

// ❌ correctIndex out of range
correctIndex: 5 // Must be 0-3

// ❌ Invalid URL
videoUrl: "not-a-url" // Must be valid URL format
```

## Migration Status

✅ `migrations/0001_initial.sql` - Initial schema
✅ `migrations/0002_add_content_column.sql` - Added content field
✅ All migrations executed successfully

## Database Schema

```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT NOT NULL,
  questions JSONB NOT NULL,  -- Legacy
  content JSONB              -- New FunBox content
);
```
