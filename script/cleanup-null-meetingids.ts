/**
 * Cleanup Script: Remove quiz results with NULL meeting_id
 * 
 * Old quiz results don't have meetingId, which causes History page to show incomplete data
 */

import { db } from "../server/db";
import { quizResults } from "../shared/schema";
import { isNull } from "drizzle-orm";

async function cleanupNullMeetingIds() {
  console.log("🧹 Starting cleanup of quiz_results with NULL meeting_id...");
  
  try {
    // Delete rows where meeting_id is NULL
    const result = await db
      .delete(quizResults)
      .where(isNull(quizResults.meetingId))
      .returning();
    
    console.log(`✅ Cleaned up ${result.length} invalid quiz result(s) with NULL meeting_id`);
    
    if (result.length > 0) {
      console.log("Deleted entries:");
      result.forEach((entry, index) => {
        console.log(`  ${index + 1}. ID: ${entry.id}, Student: ${entry.studentId}, ModuleId: ${entry.moduleId}, Score: ${entry.score}%`);
      });
    } else {
      console.log("✨ No invalid entries found. Database is clean!");
    }
    
    console.log("\n📊 Remaining quiz results after cleanup:");
    const remaining = await db.select().from(quizResults);
    console.log(`Total: ${remaining.length} quiz results`);
    remaining.forEach((entry, index) => {
      console.log(`  ${index + 1}. Student: ${entry.studentId}, Meeting: ${entry.meetingId}, Module: ${entry.moduleId}, Score: ${entry.score}%`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanupNullMeetingIds();
