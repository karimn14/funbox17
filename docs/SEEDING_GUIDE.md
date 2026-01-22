# FunBox Database Seeding

## Overview

The `seed-funbox.ts` script populates the Supabase PostgreSQL database with FunBox learning modules using the new `moduleContentSchema` structure.

## Usage

### Run the Seeding Script

```bash
npm run db:seed
```

This will:
1. ✅ Validate the module content against the schema
2. ✅ Clear all existing modules from the database
3. ✅ Insert the new "Pengenalan Uang" module
4. ✅ Display detailed confirmation

### Output Example

```
🌱 Starting FunBox module seeding...

📋 Validating module content schema...
✅ Content schema validation passed!

🗑️  Clearing existing modules from database...
✅ Existing modules cleared

💾 Inserting "Pengenalan Uang" module...
✅ Module inserted successfully!
   📌 ID: 1
   📌 Title: Pengenalan Uang
   📌 Category: Math
   📌 Video: https://www.youtube.com/watch?v=NnF-2t87PJM
   📌 Has FunBox Content: ✓
      - Opening: "Halo! Ayo belajar uang."
      - Activity: Pilih tombol MERAH (Uang Kertas)
      - Quiz Questions: 5
      - Closing: "Hebat! Kamu pintar."

🎉 Seeding completed successfully!
📊 Total modules in database: 1
```

## Module: Pengenalan Uang

### Details

- **Title**: Pengenalan Uang
- **Category**: Math
- **Video**: [YouTube - Pengenalan Uang](https://www.youtube.com/watch?v=NnF-2t87PJM)

### Content Structure

#### Opening Text
```
"Halo! Ayo belajar uang."
```

#### Activity (Hardware Button Interaction)
- **Instruction**: "Pilih tombol MERAH (Uang Kertas)"
- **Options**:
  - 🔴 Red: "Kertas" ✅ (Correct)
  - 🔵 Blue: "Koin"
  - 🟢 Green: "Daun"
  - 🟡 Yellow: "Batu"
- **Correct Index**: 0 (Red button)

#### Quiz Questions (5 total)

1. **Q1**: Apa yang kita gunakan untuk membeli makanan?
   - Options: Uang ✅, Batu, Daun, Air
   - Correct: "Uang"

2. **Q2**: Uang kertas terbuat dari?
   - Options: Kertas ✅, Batu, Air, Tanah
   - Correct: "Kertas"

3. **Q3**: Uang koin terbuat dari?
   - Options: Logam ✅, Kertas, Kayu, Plastik
   - Correct: "Logam"

4. **Q4**: Dimana kita menyimpan uang?
   - Options: Dompet ✅, Piring, Gelas, Buku
   - Correct: "Dompet"

5. **Q5**: Apa yang bisa kita beli dengan uang?
   - Options: Makanan ✅, Udara, Sinar Matahari, Hujan
   - Correct: "Makanan"

#### Closing Text
```
"Hebat! Kamu pintar."
```

## Script Features

### ✅ Schema Validation
- Validates content against `moduleContentSchema` before insertion
- Ensures data integrity and type safety
- Catches errors before database operations

### ✅ Database Cleanup
- Clears existing modules to ensure fresh seed data
- Uses Drizzle ORM's `delete` operation

### ✅ Error Handling
- Comprehensive try-catch blocks
- Detailed error messages
- Graceful exit on failure

### ✅ Detailed Logging
- Step-by-step progress indicators
- Color-coded status messages (✅ success, ❌ error)
- Complete module details on success

## File Structure

```
script/
  └── seed-funbox.ts    # Main seeding script
```

## Database Schema

The script inserts data into the `modules` table:

```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT NOT NULL,
  questions JSONB NOT NULL,  -- Legacy field
  content JSONB              -- FunBox gamification content
);
```

## Customization

To add more modules, edit `script/seed-funbox.ts`:

```typescript
// Add new module content
const newModuleContent: ModuleContent = {
  openingText: "...",
  videoUrl: "...",
  activity: { /* ... */ },
  quiz: [ /* ... */ ],
  closingText: "..."
};

// Insert in the seedFunBoxModules function
await db.insert(modules).values({
  title: "New Module",
  category: "Category",
  videoUrl: "...",
  questions: legacyQuestions,
  content: newModuleContent,
}).returning();
```

## Requirements

- ✅ Node.js with TypeScript support
- ✅ `DATABASE_URL` environment variable set
- ✅ Drizzle ORM configured
- ✅ `dotenv` for environment variables

## Troubleshooting

### Error: DATABASE_URL not found
```bash
# Ensure .env file exists with:
DATABASE_URL=postgresql://...
```

### Schema Validation Errors
- Check that content matches `moduleContentSchema`
- Ensure exactly 4 activity options
- Ensure exactly 5 quiz questions
- Validate URL format

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check network connectivity to Supabase
- Ensure database exists and is accessible

## Related Files

- `shared/schema.ts` - Schema definitions
- `server/db.ts` - Database connection
- `docs/MODULE_CONTENT_SCHEMA.md` - Content schema documentation
- `QUICK_REFERENCE.md` - Quick reference guide

## Next Steps

After seeding:
1. Start the development server: `npm run dev`
2. Navigate to the dashboard to see the module
3. Test the hardware button simulation (A/B/C/D keys)
4. Complete the quiz to verify functionality

## Script Execution Flow

```
Start
  ↓
Load Environment Variables
  ↓
Validate Module Content Schema ✓
  ↓
Connect to Database
  ↓
Clear Existing Modules
  ↓
Insert "Pengenalan Uang" Module
  ↓
Display Success Details
  ↓
Exit (Code 0)
```
