/**
 * Check specific meeting details
 */

import { db } from "../server/db";
import { quizResults, modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkMeetingId9() {
  console.log("🔍 Checking Meeting ID 9...\n");

  // Check if meeting 9 exists
  const meeting = await db.select().from(meetings).where(eq(meetings.id, 9));
  
  if (meeting.length === 0) {
    console.log("❌ Meeting ID 9 does NOT exist in the meetings table!");
  } else {
    console.log("✅ Meeting ID 9 exists:");
    console.log(JSON.stringify(meeting[0], null, 2));
  }
  
  console.log("\n🔍 Checking quiz results with meeting_id = 9...");
  const quizWithMeeting9 = await db.select().from(quizResults).where(eq(quizResults.meetingId, 9));
  console.log(`Found ${quizWithMeeting9.length} quiz result(s) with meeting_id = 9`);
  
  if (quizWithMeeting9.length > 0) {
    console.log("\nQuiz Results:");
    quizWithMeeting9.forEach(qr => {
      console.log(`  - Quiz #${qr.id}: Student ${qr.studentId}, Module ${qr.moduleId}, Meeting ${qr.meetingId}, Score ${qr.score}%`);
    });
  }
  
  console.log("\n🔍 Testing JOIN query for meeting_id = 9...");
  const joined = await db
    .select({
      quizId: quizResults.id,
      score: quizResults.score,
      moduleTitle: modules.title,
      meetingTitle: meetings.title,
      meetingOrder: meetings.order,
    })
    .from(quizResults)
    .innerJoin(modules, eq(quizResults.moduleId, modules.id))
    .innerJoin(meetings, eq(quizResults.meetingId, meetings.id))
    .where(eq(quizResults.meetingId, 9));
  
  console.log(`JOIN returned ${joined.length} result(s)`);
  if (joined.length > 0) {
    console.log("\nJoined Data:");
    joined.forEach(j => {
      console.log(`  - Quiz #${j.quizId}: ${j.moduleTitle} / Meeting ${j.meetingOrder}: ${j.meetingTitle} (${j.score}%)`);
    });
  } else {
    console.log("❌ JOIN returned no results!");
    console.log("\nPossible reasons:");
    console.log("1. Meeting ID 9 doesn't exist");
    console.log("2. Module ID doesn't match");
    console.log("3. Data integrity issue");
  }
  
  process.exit(0);
}

checkMeetingId9().catch(err => {
  console.error("❌ Check failed:", err);
  process.exit(1);
});
