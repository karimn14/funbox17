/**
 * Debug Quiz Submission Flow
 * 
 * This script tests if quiz results are being saved to the database
 */

import { db } from "./server/db";
import { quizResults, students, meetings, modules } from "./shared/schema";
import { eq } from "drizzle-orm";

async function debugQuizSubmission() {
  console.log("🔍 Starting Quiz Submission Debug...\n");

  try {
    // 1. Check if students exist
    console.log("1️⃣ Checking students...");
    const allStudents = await db.select().from(students);
    console.log(`   ✅ Found ${allStudents.length} students`);
    if (allStudents.length > 0) {
      console.log(`   📋 Sample student:`, allStudents[0]);
    }

    // 2. Check if meetings exist
    console.log("\n2️⃣ Checking meetings...");
    const allMeetings = await db.select().from(meetings);
    console.log(`   ✅ Found ${allMeetings.length} meetings`);
    if (allMeetings.length > 0) {
      console.log(`   📋 Sample meeting:`, allMeetings[0]);
    }

    // 3. Check if modules exist
    console.log("\n3️⃣ Checking modules...");
    const allModules = await db.select().from(modules);
    console.log(`   ✅ Found ${allModules.length} modules`);
    if (allModules.length > 0) {
      console.log(`   📋 Sample module:`, allModules[0]);
    }

    // 4. Check existing quiz results
    console.log("\n4️⃣ Checking existing quiz results...");
    const existingResults = await db.select().from(quizResults);
    console.log(`   ✅ Found ${existingResults.length} quiz results`);
    if (existingResults.length > 0) {
      console.log(`   📋 Sample result:`, existingResults[0]);
      console.log(`   📋 Latest result:`, existingResults[existingResults.length - 1]);
    }

    // 5. Test insert a quiz result
    if (allStudents.length > 0 && allMeetings.length > 0) {
      console.log("\n5️⃣ Testing quiz result insertion...");
      const testStudent = allStudents[0];
      const testMeeting = allMeetings[0];
      
      const testResult = {
        studentId: testStudent.id,
        meetingId: testMeeting.id,
        moduleId: testMeeting.moduleId,
        rawPoints: 5,
        score: 100,
        stars: 3,
      };

      console.log(`   📤 Inserting test result:`, testResult);
      
      const [inserted] = await db.insert(quizResults).values(testResult).returning();
      console.log(`   ✅ Successfully inserted:`, inserted);

      // Clean up test result
      await db.delete(quizResults).where(eq(quizResults.id, inserted.id));
      console.log(`   🧹 Cleaned up test result`);
    }

    // 6. Check database schema
    console.log("\n6️⃣ Checking quiz_results table schema...");
    const schemaQuery = await db.execute(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'quiz_results'
      ORDER BY ordinal_position;
    `);
    console.log(`   ✅ Table schema:`, schemaQuery.rows);

    console.log("\n✅ Debug complete!");

  } catch (error) {
    console.error("❌ Error during debug:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
  }

  process.exit(0);
}

debugQuizSubmission();
