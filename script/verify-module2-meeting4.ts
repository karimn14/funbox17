import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function verifyModule2Meeting4() {
  console.log("🔍 Verifying Module 2, Meeting 4...\n");

  try {
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
        if (content.activities && content.activities[0]) {
          const storyLength = content.activities[0].instruction?.length || 0;
          console.log(`   Story Length: ${storyLength} characters`);
        }
      }
      console.log("");
    });

    const meeting4 = module2Meetings.find(m => m.order === 4);
    if (meeting4) {
      console.log("✅ Meeting 4 'Simulasi Situasi Darurat' FOUND!");
      console.log(`   Title: ${meeting4.title}`);
      console.log(`   Order: ${meeting4.order}\n`);
      
      const content = meeting4.content as any;
      if (content && content.activities) {
        console.log("📋 Story Activity:");
        const story = content.activities[0];
        console.log(`   Story Title: Saat Bumi Bergoyang`);
        console.log(`   Story Length: ${story.instruction?.length || 0} characters`);
        console.log(`   Question: ${story.instruction?.split('\n\n---\n\n')[1]?.substring(0, 60)}...`);
        console.log(`   Correct Answer: Option ${String.fromCharCode(65 + story.correctIndex)}`);
      }
      
      if (content && content.quiz) {
        console.log(`\n❓ Quiz Questions (${content.quiz.length} total):`);
        content.quiz.forEach((q: any, idx: number) => {
          console.log(`   ${idx + 1}. ${q.question}`);
          console.log(`      Answer: ${q.correctAnswer}`);
        });
      }
    } else {
      console.error("❌ Meeting 4 NOT FOUND!");
    }

  } catch (error) {
    console.error("❌ Verification failed:", error);
    throw error;
  }
}

verifyModule2Meeting4()
  .then(() => {
    console.log("\n✅ Verification complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Verification failed:", error);
    process.exit(1);
  });
