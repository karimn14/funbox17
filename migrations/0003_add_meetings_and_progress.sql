-- Add meetings/pertemuan table for sequential lessons
CREATE TABLE IF NOT EXISTS "meetings" (
  "id" SERIAL PRIMARY KEY,
  "module_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "content" JSONB NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Add student progress tracking table
CREATE TABLE IF NOT EXISTS "student_progress" (
  "id" SERIAL PRIMARY KEY,
  "student_id" INTEGER NOT NULL,
  "meeting_id" INTEGER NOT NULL,
  "is_completed" INTEGER NOT NULL DEFAULT 0,
  "completed_at" TIMESTAMP
);

-- Update modules table structure
ALTER TABLE "modules" DROP COLUMN IF EXISTS "video_url";
ALTER TABLE "modules" DROP COLUMN IF EXISTS "questions";
ALTER TABLE "modules" DROP COLUMN IF EXISTS "content";
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT NOW();

-- Update quiz_results to support meetings
ALTER TABLE "quiz_results" ADD COLUMN IF NOT EXISTS "meeting_id" INTEGER;
ALTER TABLE "quiz_results" ALTER COLUMN "module_id" DROP NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_meetings_module_id" ON "meetings" ("module_id");
CREATE INDEX IF NOT EXISTS "idx_meetings_order" ON "meetings" ("order");
CREATE INDEX IF NOT EXISTS "idx_student_progress_student_id" ON "student_progress" ("student_id");
CREATE INDEX IF NOT EXISTS "idx_student_progress_meeting_id" ON "student_progress" ("meeting_id");
CREATE INDEX IF NOT EXISTS "idx_quiz_results_meeting_id" ON "quiz_results" ("meeting_id");

-- Add unique constraint to prevent duplicate progress entries
CREATE UNIQUE INDEX IF NOT EXISTS "idx_student_progress_unique" ON "student_progress" ("student_id", "meeting_id");
