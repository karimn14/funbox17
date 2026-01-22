import { db } from "../server/db";
import { modules, meetings, type InsertModule, type InsertMeeting } from "../shared/schema";

async function seedFinalData() {
  console.log("🌱 Starting FunBox Final Seeding...");

  try {
    // 0. DELETE ALL existing data to prevent duplicates
    console.log("🗑️  Clearing existing data...");
    await db.delete(meetings).execute();
    await db.delete(modules).execute();
    console.log("✅ Cleared all modules and meetings");

    // 1. Create Module 1: Pengenalan Uang & Berhitung
    const [module1] = await db.insert(modules).values({
      title: "Pengenalan Uang & Berhitung",
      category: "Math",
      description: "Belajar mengenal uang koin dan kertas serta nilai-nilainya",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
      order: 1,
    } as InsertModule).returning();

    console.log("✅ Created Module:", module1.title);

    // 2. Create Pertemuan 1: Mengenal Uang Koin dan Kertas
    const meeting1Content = {
      openingText: "Hari ini kita akan belajar mengenal uang koin dan uang kertas. Yuk, kita mulai!",
      
      videos: [
        {
          url: "https://youtu.be/INbhp1Ktlpo?si=p9lZ55dNUsvH-scb",
          title: "Pengenalan Uang",
          interactions: []
        },
        {
          url: "http://www.youtube.com/watch?v=TIAgaP4R4tw",
          title: "Belajar Membedakan Uang",
          interactions: [
            {
              timestamp: "01:25",
              action: "mute" as const,
              activityId: undefined
            },
            {
              timestamp: "02:05",
              action: "pause" as const,
              activityId: "activity1"
            }
          ]
        }
      ],
      
      activities: [
        {
          id: "activity1",
          instruction: "Ini uang koin atau uang kertas?",
          imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=300",
          options: [
            { color: "red" as const, text: "Uang Koin" },
            { color: "blue" as const, text: "Uang Kertas" },
            { color: "green" as const, text: "Bukan Uang" },
            { color: "yellow" as const, text: "Tidak Tahu" }
          ],
          correctIndex: 1 // Uang Kertas
        },
        {
          id: "activity2",
          instruction: "Berapa nilai uang ini?",
          imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300",
          options: [
            { color: "red" as const, text: "Rp 100" },
            { color: "blue" as const, text: "Rp 500" },
            { color: "green" as const, text: "Rp 1.000" },
            { color: "yellow" as const, text: "Rp 5.000" }
          ],
          correctIndex: 1 // Rp 500
        }
      ],
      
      quiz: [
        {
          question: "Ini uang kertas atau koin?",
          imageUrl: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=300",
          options: ["Uang Koin", "Uang Kertas", "Bukan Uang", "Kartu"],
          correctAnswer: "Uang Kertas"
        },
        {
          question: "Berapa nilai uang ini?",
          imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=300",
          options: ["Rp 100", "Rp 200", "Rp 500", "Rp 1.000"],
          correctAnswer: "Rp 500"
        },
        {
          question: "Pilih gambar uang kertas!",
          options: ["Gambar Koin", "Gambar Kertas Rp 10.000", "Gambar Pensil", "Gambar Buku"],
          correctAnswer: "Gambar Kertas Rp 10.000"
        },
        {
          question: "Uang Rp 5.000 nilainya berapa?",
          options: ["Lima Ribu Rupiah", "Lima Ratus Rupiah", "Lima Puluh Ribu", "Lima Juta"],
          correctAnswer: "Lima Ribu Rupiah"
        },
        {
          question: "Bentuk uang koin adalah...",
          options: ["Persegi", "Segitiga", "Bulat/Lingkaran", "Bintang"],
          correctAnswer: "Bulat/Lingkaran"
        }
      ],
      
      closingText: "Hebat! Kamu sudah belajar mengenal uang koin dan kertas. Lanjutkan ke pertemuan berikutnya!"
    };

    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Mengenal Uang Koin dan Kertas",
      order: 1,
      content: meeting1Content,
    } as any);

    console.log("✅ Created Meeting 1: Mengenal Uang Koin dan Kertas");
    console.log(`   → Module ID: ${module1.id}, Meeting Order: 1`);

    // 3. Create Pertemuan 2: Penjumlahan Sederhana (with Story)
    const meeting2Content = {
      openingText: "Hari ini kita akan belajar penjumlahan sederhana sambil mengikuti petualangan Sani!",
      
      // Story that displays before activities
      story: `Pagi itu, matahari bersinar cerah di atas kampung Sani. Sani adalah seorang anak berusia 8 tahun yang senang membantu ibunya. Hari ini, ibu memberikan tugas istimewa kepada Sani: pergi ke toko untuk membeli kentang dan wortel.

"Sani, kamu sudah besar. Ibu percaya kamu bisa belanja sendiri," kata ibu sambil memberikan selembar uang Rp 10.000 kepada Sani.

Sani tersenyum lebar. Ia merasa bangga karena dipercaya ibu. Dengan semangat, ia segera bersiap-siap menuju toko Bu Rina yang tidak jauh dari rumahnya.

Sesampainya di toko, Sani menyapa Bu Rina dengan ramah.

"Selamat pagi, Bu Rina!"

"Selamat pagi, Sani! Ada yang bisa ibu bantu?" tanya Bu Rina dengan senyum.

"Sani mau beli kentang dan wortel, Bu," jawab Sani.

Bu Rina mengambilkan kentang segar seharga Rp 5.000 dan wortel seharga Rp 2.000. Sani mengingat pelajaran matematika di sekolah tentang penjumlahan.

"Kalau kentang Rp 5.000 ditambah wortel Rp 2.000, berarti totalnya Rp 7.000," pikir Sani dalam hati.

Dengan percaya diri, Sani bersiap-siap mengeluarkan uang untuk membayar.`,
      
      videos: [
        {
          url: "http://www.youtube.com/watch?v=_Xi_I9x1yuU",
          title: "Penjumlahan Sederhana",
          interactions: []
        }
      ],
      
      activities: [
        {
          id: "shopping_list",
          instruction: "Apa saja benda yang dibeli Sani di toko?",
          imageUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=300",
          options: [
            { color: "red" as const, text: "Mainan & Permen" },
            { color: "blue" as const, text: "Kentang & Wortel" },
            { color: "green" as const, text: "Baju & Celana" },
            { color: "yellow" as const, text: "Sabun & Sampo" }
          ],
          correctIndex: 1 // Kentang & Wortel
        },
        {
          id: "payment_calculation",
          instruction: "Pilih kombinasi uang untuk membayar Rp 7.000 (Kentang Rp 5.000 + Wortel Rp 2.000)",
          imageUrl: "https://images.unsplash.com/photo-1624377638283-93e5c0c8c8ca?w=300",
          options: [
            { color: "red" as const, text: "5.000 + 2.000" },
            { color: "blue" as const, text: "10.000" },
            { color: "green" as const, text: "20.000" },
            { color: "yellow" as const, text: "5.000 saja" }
          ],
          correctIndex: 0 // 5.000 + 2.000
        }
      ],
      
      quiz: [
        {
          question: "Sani beli biskuit Rp 2.000 + susu Rp 3.000. Berapa total yang harus dibayar?",
          imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300",
          options: ["Rp 4.000", "Rp 5.000", "Rp 6.000", "Rp 7.000"],
          correctAnswer: "Rp 5.000"
        },
        {
          question: "Di saku baju ada Rp 1.000, di saku celana ada Rp 5.000. Berapa total uang Sani?",
          imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=300",
          options: ["Rp 4.000", "Rp 5.000", "Rp 6.000", "Rp 7.000"],
          correctAnswer: "Rp 6.000"
        },
        {
          question: "Ibu memberi Sani dua lembar uang Rp 2.000. Berapa total uang yang Sani terima?",
          imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=300",
          options: ["Rp 2.000", "Rp 3.000", "Rp 4.000", "Rp 5.000"],
          correctAnswer: "Rp 4.000"
        },
        {
          question: "Sani membeli tiga permen. Harga satu permen Rp 1.000. Berapa total yang harus dibayar?",
          imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300",
          options: ["Rp 2.000", "Rp 3.000", "Rp 4.000", "Rp 5.000"],
          correctAnswer: "Rp 3.000"
        },
        {
          question: "Di pasar, apel harganya Rp 5.000 dan jeruk Rp 2.000. Berapa total jika Sani beli keduanya?",
          imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300",
          options: ["Rp 5.000", "Rp 6.000", "Rp 7.000", "Rp 8.000"],
          correctAnswer: "Rp 7.000"
        }
      ],
      
      closingText: "Hebat! Kamu sudah bisa menjumlahkan uang seperti Sani. Terus berlatih ya!"
    };

    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Penjumlahan Sederhana",
      order: 2,
      content: meeting2Content,
    } as any);

    console.log("✅ Created Meeting 2: Penjumlahan Sederhana (with Story)");
    console.log(`   → Module ID: ${module1.id}, Meeting Order: 2`);

    // 4. Create other 3 main topics (placeholders)
    const otherModules = [
      {
        title: "Keterampilan Bertahan Hidup",
        category: "Life Skills",
        description: "Belajar keterampilan penting untuk kehidupan sehari-hari",
        imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
        order: 2,
      },
      {
        title: "Bahasa Inggris Dasar",
        category: "English",
        description: "Pengenalan bahasa Inggris untuk pemula",
        imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
        order: 3,
      },
      {
        title: "Bahasa Indonesia & Literasi",
        category: "Literacy",
        description: "Belajar membaca dan menulis dengan baik",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        order: 4,
      },
    ];

    for (const mod of otherModules) {
      await db.insert(modules).values(mod as InsertModule);
      console.log(`✅ Created Module: ${mod.title}`);
    }

    console.log("🎉 Final Seeding Complete!");
    console.log(`📚 Seeded Module ID: ${module1.id} with 2 meetings`);
    console.log("📚 Created 4 main topics:");
    console.log("   1. Pengenalan Uang & Berhitung (with 2 meetings)");
    console.log("   2. Keterampilan Bertahan Hidup");
    console.log("   3. Bahasa Inggris Dasar");
    console.log("   4. Bahasa Indonesia & Literasi");
    console.log("");
    console.log("✅ TEST THIS NOW:");
    console.log(`   GET /api/modules/${module1.id}/meetings`);
    console.log("   Should return 2 meetings (Pertemuan 1 unlocked, Pertemuan 2 locked)");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run if called directly
seedFinalData()
  .then(() => {
    console.log("✅ Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });

export { seedFinalData };
