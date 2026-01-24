/**
 * Database Verification Script
 * Checks if meetings have proper data and if JOIN works
 */

import { db } from "../server/db";
import { quizResults, modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function verifyDatabase() {
  console.log("🔍 Verifying Database Structure...\n");

  // Check 1: List all meetings
  console.log("=== CHECK 1: All Meetings ===");
  const allMeetings = await db.select().from(meetings).limit(5);
  console.log(`Found ${allMeetings.length} meetings:`);
  allMeetings.forEach(m => {
    console.log(`  - ID: ${m.id}, Title: "${m.title}", Order: ${m.order}, ModuleId: ${m.moduleId}`);
  });
  console.log("");

  // Check 2: List all quiz results
  console.log("=== CHECK 2: All Quiz Results ===");
  const allQuizResults = await db.select().from(quizResults).limit(5);
  console.log(`Found ${allQuizResults.length} quiz results:`);
  allQuizResults.forEach(qr => {
    console.log(`  - ID: ${qr.id}, StudentId: ${qr.studentId}, MeetingId: ${qr.meetingId}, ModuleId: ${qr.moduleId}, Score: ${qr.score}`);
  });
  console.log("");

  // Check 3: Test JOIN query
  console.log("=== CHECK 3: JOIN Query Test ===");
  const joinedResults = await db
    .select({
      quizId: quizResults.id,
      studentId: quizResults.studentId,
      score: quizResults.score,
      moduleTitle: modules.title,
      meetingTitle: meetings.title,
      meetingOrder: meetings.order,
    })
    .from(quizResults)
    .innerJoin(modules, eq(quizResults.moduleId, modules.id))
    .innerJoin(meetings, eq(quizResults.meetingId, meetings.id))
    .limit(5);
  
  console.log(`Joined results count: ${joinedResults.length}`);
  joinedResults.forEach(r => {
    console.log(`  - Quiz #${r.quizId}: ${r.moduleTitle} / Meeting ${r.meetingOrder}: ${r.meetingTitle} (Score: ${r.score}%)`);
  });
  console.log("");

  // Check 4: Check for NULL values
  console.log("=== CHECK 4: NULL Check ===");
  const nullModuleCount = await db.select().from(quizResults).where(eq(quizResults.moduleId, null as any));
  const nullMeetingCount = await db.select().from(quizResults).where(eq(quizResults.meetingId, null as any));
  console.log(`Quiz results with NULL moduleId: ${nullModuleCount.length}`);
  console.log(`Quiz results with NULL meetingId: ${nullMeetingCount.length}`);
  console.log("");

  console.log("✅ Verification Complete!");
  process.exit(0);
}

verifyDatabase().catch(err => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
