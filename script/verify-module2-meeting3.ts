import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function verifyModule2Meeting3() {
  console.log("🔍 Verifying Module 2, Meeting 3...\n");

  try {
    // Find Module 2
    const module2Results = await db
      .select()
      .from(modules)
      .where(eq(modules.title, "Keterampilan Bertahan Hidup"))
      .execute();

    if (module2Results.length === 0) {
      console.error("❌ Module 2 not found!");
      return;
    }

    const module2 = module2Results[0];
    console.log(`✅ Found Module 2:`);
    console.log(`   ID: ${module2.id}`);
    console.log(`   Title: ${module2.title}\n`);

    // Find all meetings in Module 2
    const module2Meetings = await db
      .select()
      .from(meetings)
      .where(eq(meetings.moduleId, module2.id))
      .execute();

    console.log(`📚 Module 2 has ${module2Meetings.length} meeting(s):\n`);

    module2Meetings.forEach((meeting, index) => {
      console.log(`${index + 1}. ${meeting.title} (Order: ${meeting.order})`);
      const content = meeting.content as any;
      if (content) {
        console.log(`   Activities: ${content.activities ? content.activities.length : 0}`);
        console.log(`   Quiz Questions: ${content.quiz ? content.quiz.length : 0}`);
      }
      console.log("");
    });

    // Verify Meeting 3 specifically
    const meeting3 = module2Meetings.find(m => m.order === 3);
    if (meeting3) {
      console.log("✅ Meeting 3 'Tanggap Darurat' FOUND!");
      console.log(`   Title: ${meeting3.title}`);
      console.log(`   Order: ${meeting3.order}\n`);
      
      const content = meeting3.content as any;
      if (content && content.activities) {
        console.log("📋 Activities:");
        content.activities.forEach((act: any, idx: number) => {
          console.log(`   ${idx + 1}. ${act.instruction?.substring(0, 60)}...`);
          console.log(`      Correct: Option ${String.fromCharCode(65 + act.correctIndex)}`);
        });
      }
      
      if (content && content.quiz) {
        console.log("\n❓ Quiz Questions:");
        content.quiz.forEach((q: any, idx: number) => {
          console.log(`   ${idx + 1}. ${q.question}`);
          console.log(`      Answer: ${q.correctAnswer}`);
        });
      }
    } else {
      console.error("❌ Meeting 3 NOT FOUND!");
    }

  } catch (error) {
    console.error("❌ Verification failed:", error);
    throw error;
  }
}

verifyModule2Meeting3()
  .then(() => {
    console.log("\n✅ Verification complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:", error);
    process.exit(1);
  });
