import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";

async function main() {
  console.log("🌱 Starting simple seed...");

  try {
    // Create module
    const [module1] = await db.insert(modules).values({
      title: "Pengenalan Uang & Berhitung",
      category: "Math",
      description: "Belajar mengenal uang koin dan kertas serta nilai-nilainya",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
      order: 1,
    }).returning();

    console.log("✅ Created Module ID:", module1.id);

    // Create meeting 1
    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Pertemuan 1: Mengenal Uang",
      order: 1,
      content: {
        openingText: "Mari belajar mengenal uang!",
        videos: [{
          url: "https://youtu.be/INbhp1Ktlpo",
          title: "Video Uang",
          interactions: []
        }],
        activities: [],
        quiz: [
          { question: "Q1", options: ["A", "B", "C", "D"], correctAnswer: "A" },
          { question: "Q2", options: ["A", "B", "C", "D"], correctAnswer: "B" },
          { question: "Q3", options: ["A", "B", "C", "D"], correctAnswer: "C" },
          { question: "Q4", options: ["A", "B", "C", "D"], correctAnswer: "D" },
          { question: "Q5", options: ["A", "B", "C", "D"], correctAnswer: "A" }
        ],
        closingText: "Hebat!"
      }
    } as any);

    console.log("✅ Created Meeting 1");

    // Create meeting 2
    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Pertemuan 2: Berhitung Uang (LOCKED)",
      order: 2,
      content: {
        openingText: "Mari berhitung!",
        videos: [{
          url: "https://youtu.be/INbhp1Ktlpo",
          title: "Video Berhitung",
          interactions: []
        }],
        activities: [],
        quiz: [
          { question: "Q1", options: ["A", "B", "C", "D"], correctAnswer: "A" },
          { question: "Q2", options: ["A", "B", "C", "D"], correctAnswer: "B" },
          { question: "Q3", options: ["A", "B", "C", "D"], correctAnswer: "C" },
          { question: "Q4", options: ["A", "B", "C", "D"], correctAnswer: "D" },
          { question: "Q5", options: ["A", "B", "C", "D"], correctAnswer: "A" }
        ],
        closingText: "Selesai!"
      }
    } as any);

    console.log("✅ Created Meeting 2");
    console.log("");
    console.log("🎉 DONE! Module ID:", module1.id);
    console.log(`📡 Test: curl "http://localhost:5000/api/modules/${module1.id}/meetings"`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
