import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function verifyModule2Meeting2() {
  console.log("🔍 Verifying Module 2, Meeting 2...\n");

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
    console.log(`   Title: ${module2.title}`);
    console.log(`   Category: ${module2.category}\n`);

    // Find all meetings in Module 2
    const module2Meetings = await db
      .select()
      .from(meetings)
      .where(eq(meetings.moduleId, module2.id))
      .execute();

    console.log(`📚 Module 2 has ${module2Meetings.length} meeting(s):\n`);

    module2Meetings.forEach((meeting, index) => {
      console.log(`${index + 1}. ${meeting.title} (Order: ${meeting.order})`);
      console.log(`   ID: ${meeting.id}`);
      console.log(`   Module ID: ${meeting.moduleId}`);
      
      // Parse content
      const content = meeting.content as any;
      if (content) {
        console.log(`   Has Video: ${content.videos ? '✅' : '❌'}`);
        console.log(`   Activities: ${content.activities ? content.activities.length : 0}`);
        console.log(`   Quiz Questions: ${content.quiz ? content.quiz.length : 0}`);
        
        if (content.videos && content.videos.length > 0) {
          console.log(`   Video URL: ${content.videos[0].url}`);
        }
        
        if (content.closingText) {
          console.log(`   Closing: ${content.closingText.substring(0, 50)}...`);
        }
      }
      console.log("");
    });

    // Verify Meeting 2 specifically
    const meeting2 = module2Meetings.find(m => m.order === 2);
    if (meeting2) {
      console.log("✅ Meeting 2 'Keselamatan di Luar' FOUND!");
      console.log(`   Title: ${meeting2.title}`);
      console.log(`   Order: ${meeting2.order}`);
      
      const content = meeting2.content as any;
      if (content && content.activities) {
        console.log("\n📋 Activities:");
        content.activities.forEach((act: any, idx: number) => {
          console.log(`   ${idx + 1}. ${act.instruction?.substring(0, 60)}...`);
          console.log(`      Correct Answer: Option ${String.fromCharCode(65 + act.correctIndex)} (Index ${act.correctIndex})`);
        });
      }
      
      if (content && content.quiz) {
        console.log("\n❓ Quiz Questions:");
        content.quiz.forEach((q: any, idx: number) => {
          console.log(`   ${idx + 1}. ${q.question}`);
          console.log(`      Correct Answer: ${q.correctAnswer}`);
        });
      }
    } else {
      console.error("❌ Meeting 2 NOT FOUND in database!");
    }

  } catch (error) {
    console.error("❌ Verification failed:", error);
    throw error;
  }
}

verifyModule2Meeting2()
  .then(() => {
    console.log("\n✅ Verification complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:", error);
    process.exit(1);
  });
