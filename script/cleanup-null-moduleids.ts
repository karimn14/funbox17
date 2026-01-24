/**
 * Cleanup Script: Remove quiz results with NULL module_id
 * 
 * This script removes invalid quiz result entries that were created
 * before the moduleId fix was implemented.
 */

import { db } from "../server/db";
import { quizResults } from "../shared/schema";
import { isNull } from "drizzle-orm";

async function cleanupNullModuleIds() {
  console.log("🧹 Starting cleanup of quiz_results with NULL module_id...");
  
  try {
    // Delete rows where module_id is NULL
    const result = await db
      .delete(quizResults)
      .where(isNull(quizResults.moduleId))
      .returning();
    
    console.log(`✅ Cleaned up ${result.length} invalid quiz result(s)`);
    
    if (result.length > 0) {
      console.log("Deleted entries:");
      result.forEach((entry, index) => {
        console.log(`  ${index + 1}. ID: ${entry.id}, Student: ${entry.studentId}, Score: ${entry.score}%, Meeting: ${entry.meetingId}`);
      });
    } else {
      console.log("✨ No invalid entries found. Database is clean!");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanupNullModuleIds();
