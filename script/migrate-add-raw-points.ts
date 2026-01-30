import { db } from "../server/db";
import { sql } from "drizzle-orm";

/**
 * Migration: Add rawPoints column to quiz_results table
 * 
 * This migration adds a new column to store the raw points (correct answers)
 * separately from the calculated weighted score.
 */

async function migrateAddRawPoints() {
  console.log("🔄 Starting migration: Add rawPoints to quiz_results...");

  try {
    // Check if column already exists
    const checkResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quiz_results' 
      AND column_name = 'raw_points';
    `);

    if (checkResult.rows.length > 0) {
      console.log("✅ Column 'raw_points' already exists. Migration skipped.");
      return;
    }

    // Add the raw_points column
    await db.execute(sql`
      ALTER TABLE quiz_results 
      ADD COLUMN raw_points INTEGER NOT NULL DEFAULT 0;
    `);

    console.log("✅ Added 'raw_points' column to quiz_results table");

    // Update existing records to set rawPoints based on score
    // Assuming old scores were calculated as (correct/total) * 100
    // We'll set rawPoints = 0 for old records (they need recalculation)
    await db.execute(sql`
      UPDATE quiz_results 
      SET raw_points = 0 
      WHERE raw_points = 0;
    `);

    console.log("✅ Migration completed successfully");
    console.log("");
    console.log("⚠️  Note: Existing quiz results have rawPoints set to 0.");
    console.log("   Students should retake quizzes for accurate weighted scoring.");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration
migrateAddRawPoints()
  .then(() => {
    console.log("🎉 Migration completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration error:", error);
    process.exit(1);
  });
