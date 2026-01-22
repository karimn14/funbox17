import { db } from "../server/db";
import { modules, meetings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding Module ID 1 with meetings...");

  try {
    // Check if Module 1 exists
    const [existingModule] = await db.select().from(modules).where(eq(modules.id, 1));

    let moduleId = 1;

    if (existingModule) {
      console.log("✅ Found existing Module ID 1:", existingModule.title);
      
      // Delete existing meetings for Module 1
      await db.delete(meetings).where(eq(meetings.moduleId, 1));
      console.log("🗑️  Cleared old meetings for Module 1");
    } else {
      // Create Module 1
      const [newModule] = await db.insert(modules).values({
        title: "Pengenalan Uang & Berhitung",
        category: "Math",
        description: "Belajar mengenal uang koin dan kertas serta nilai-nilainya",
        imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
        order: 1,
      }).returning();
      
      moduleId = newModule.id;
      console.log("✅ Created new Module ID:", moduleId);
    }

    // Create Meeting 1
    await db.insert(meetings).values({
      moduleId: 1,
      title: "Pertemuan 1: Mengenal Uang Koin dan Kertas",
      order: 1,
      content: {
        openingText: "Hari ini kita akan belajar mengenal uang koin dan uang kertas. Yuk, kita mulai!",
        videos: [{
          url: "https://youtu.be/INbhp1Ktlpo",
          title: "Pengenalan Uang",
          interactions: []
        }],
        activities: [],
        quiz: [
          { question: "Ini uang kertas atau koin?", options: ["Uang Koin", "Uang Kertas", "Bukan Uang", "Kartu"], correctAnswer: "Uang Kertas" },
          { question: "Berapa nilai uang Rp 500?", options: ["Rp 100", "Rp 200", "Rp 500", "Rp 1.000"], correctAnswer: "Rp 500" },
          { question: "Pilih gambar uang kertas!", options: ["Gambar Koin", "Gambar Kertas", "Gambar Pensil", "Gambar Buku"], correctAnswer: "Gambar Kertas" },
          { question: "Bentuk uang koin adalah...", options: ["Persegi", "Segitiga", "Bulat", "Bintang"], correctAnswer: "Bulat" },
          { question: "Warna uang Rp 10.000 adalah...", options: ["Merah", "Biru", "Ungu", "Hijau"], correctAnswer: "Ungu" }
        ],
        closingText: "Hebat! Kamu sudah belajar mengenal uang koin dan kertas. Lanjutkan ke pertemuan berikutnya!"
      }
    } as any);

    console.log("✅ Created Meeting 1 for Module 1");

    // Create Meeting 2 (LOCKED)
    await db.insert(meetings).values({
      moduleId: 1,
      title: "Pertemuan 2: Berhitung Uang (LOCKED)",
      order: 2,
      content: {
        openingText: "Mari belajar menghitung uang dengan benar!",
        videos: [{
          url: "https://youtu.be/INbhp1Ktlpo",
          title: "Berhitung Uang",
          interactions: []
        }],
        activities: [],
        quiz: [
          { question: "Rp 500 + Rp 500 = ?", options: ["Rp 500", "Rp 1.000", "Rp 1.500", "Rp 2.000"], correctAnswer: "Rp 1.000" },
          { question: "Rp 1.000 - Rp 500 = ?", options: ["Rp 100", "Rp 200", "Rp 500", "Rp 1.000"], correctAnswer: "Rp 500" },
          { question: "2 koin Rp 500 sama dengan?", options: ["Rp 500", "Rp 1.000", "Rp 1.500", "Rp 2.000"], correctAnswer: "Rp 1.000" },
          { question: "Rp 2.000 + Rp 1.000 = ?", options: ["Rp 2.000", "Rp 3.000", "Rp 4.000", "Rp 5.000"], correctAnswer: "Rp 3.000" },
          { question: "Rp 5.000 - Rp 2.000 = ?", options: ["Rp 1.000", "Rp 2.000", "Rp 3.000", "Rp 4.000"], correctAnswer: "Rp 3.000" }
        ],
        closingText: "Luar biasa! Kamu sudah bisa berhitung uang!"
      }
    } as any);

    console.log("✅ Created Meeting 2 (LOCKED) for Module 1");
    console.log("");
    console.log("🎉 SUCCESS! Module ID 1 now has 2 meetings!");
    console.log("");
    console.log("📡 Test the API:");
    console.log("   curl \"http://localhost:5000/api/modules/1/meetings\"");
    console.log("");
    console.log("🌐 Test in browser:");
    console.log("   1. Go to http://localhost:5000");
    console.log("   2. Login as any student");
    console.log("   3. Click the first module");
    console.log("   4. You should see 2 meetings!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
