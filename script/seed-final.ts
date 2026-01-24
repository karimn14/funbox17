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
            { color: "red" as const, text: "Mainan dan Cokelat" },
            { color: "blue" as const, text: "Kentang dan Wortel" },
            { color: "green" as const, text: "Baju dan Topi" },
            { color: "yellow" as const, text: "Buku dan Pensil" }
          ],
          correctIndex: 1 // Kentang dan Wortel
        },
        {
          id: "payment_calculation",
          instruction: "Pilih 2 uang untuk membayar Rp 7.000. Tekan 2 tombol!",
          imageUrl: "https://images.unsplash.com/photo-1624377638283-93e5c0c8c8ca?w=300",
          selectionMode: "multiple" as const,
          maxSelections: 2,
          options: [
            { color: "red" as const, text: "💵 Rp 10.000" },
            { color: "blue" as const, text: "💵 Rp 5.000" },
            { color: "green" as const, text: "💵 Rp 2.000" },
            { color: "yellow" as const, text: "💵 Rp 20.000" }
          ],
          correctIndices: [1, 2] // Rp 5.000 (index 1) + Rp 2.000 (index 2) = Rp 7.000
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

    // 3. Create Pertemuan 3: Membayar Dengan Uang Pas
    const meeting3Content = {
      openingText: "Hari ini kita akan belajar membayar dengan uang pas seperti Bimo!",
      
      // Story: Petualangan Bimo di Koperasi Sekolah
      storyTitle: "Petualangan Bimo di Koperasi Sekolah",
      story: `Pagi itu, suasana di sekolah sangat ramai. Anak-anak berlarian dengan riang di halaman sekolah sambil menunggu bel masuk berbunyi. Di antara mereka, ada Bimo, seorang anak laki-laki berusia 8 tahun yang penuh semangat.

Hari itu, Bu Guru mengumumkan bahwa koperasi sekolah telah dibuka kembali dengan barang-barang alat tulis yang baru. Bimo sangat senang karena ia membutuhkan pensil dan buku gambar untuk pelajaran seni besok.

Saat istirahat tiba, Bimo segera berlari menuju koperasi sekolah. Ia sudah membawa uang saku dari ayahnya sebesar Rp 10.000. Di depan koperasi, ia melihat teman-temannya sedang antre dengan tertib.

Ketika sampai gilirannya, Bimo menyapa Ibu Sari, penjaga koperasi sekolah.

"Selamat siang, Bu Sari! Bimo mau beli pensil dan buku gambar," kata Bimo dengan sopan.

Bu Sari tersenyum ramah. "Baik, Bimo. Pensilnya harganya Rp 1.000, dan buku gambarnya Rp 5.000. Jadi totalnya Rp 6.000."

Bimo berpikir sejenak sambil mengingat pelajaran matematika yang diajarkan Bu Guru kemarin tentang membayar dengan "uang pas". Uang pas berarti memberikan uang tepat sesuai harga barang tanpa harus meminta kembalian.

"Kalau Rp 1.000 ditambah Rp 5.000, berarti Rp 6.000. Aku harus kasih uang yang tepat," gumam Bimo dalam hati.

Bimo pun mulai mengeluarkan uang dari dompetnya dengan teliti.`,
      
      videos: [
        {
          url: "https://youtu.be/ozVPHo4X0M0",
          title: "Beli Es Krim Yuk!",
          interactions: []
        },
        {
          url: "https://youtu.be/JWvnEWHdMJA",
          title: "Simulasi Uang Pas",
          interactions: []
        }
      ],
      
      activities: [
        {
          id: "bimo_shopping",
          instruction: "Apa saja benda yang dibeli Bimo di koperasi sekolah?",
          imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300",
          options: [
            { color: "red" as const, text: "Penggaris dan Penghapus" },
            { color: "blue" as const, text: "Pensil dan Buku Gambar" },
            { color: "green" as const, text: "Es Krim dan Permen" },
            { color: "yellow" as const, text: "Mainan dan Coklat" }
          ],
          correctIndex: 1 // Pensil dan Buku Gambar
        },
        {
          id: "exact_change",
          instruction: "Pilih kombinasi uang Bimo yang pas untuk membayar Rp 6.000! (Pensil Rp 1.000 + Buku Rp 5.000)",
          imageUrl: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=300",
          options: [
            { color: "red" as const, text: "💵 Rp 5.000 + 💵 Rp 1.000" },
            { color: "blue" as const, text: "💵 Rp 10.000" },
            { color: "green" as const, text: "💵 Rp 2.000 + 💵 Rp 2.000" },
            { color: "yellow" as const, text: "💵 Rp 5.000 + 💵 Rp 5.000" }
          ],
          correctIndex: 0 // Rp 5.000 + Rp 1.000 (Uang Pas)
        }
      ],
      
      quiz: [
        {
          question: "Bimo ingin beli es jeruk seharga Rp 6.000. Manakah kombinasi uang yang Pas?",
          imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300",
          options: [
            "💵 Rp 10.000",
            "💵 Rp 2.000 + 💵 Rp 2.000 + 💵 Rp 2.000",
            "💵 Rp 5.000 + 💵 Rp 1.000",
            "💵 Rp 20.000"
          ],
          correctAnswer: "💵 Rp 5.000 + 💵 Rp 1.000"
        },
        {
          question: "Bimo beli penghapus Rp 1.000, lalu bayar pakai uang Rp 5.000. Apa kata Ibu Kantin?",
          imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300",
          options: [
            "Uangnya kurang ya, Bimo",
            "Ini uangnya pas, terima kasih!",
            "Ini kembaliannya Rp 4.000, Bimo",
            "Bimo tidak perlu bayar"
          ],
          correctAnswer: "Ini kembaliannya Rp 4.000, Bimo"
        },
        {
          question: "Harga barang Rp 6.000. Bimo kasih uang Rp 5.000 + Rp 1.000. Disebut kondisi apa?",
          imageUrl: "https://images.unsplash.com/photo-1624377638283-93e5c0c8c8ca?w=300",
          options: [
            "Uang Lebih",
            "Uang Pas",
            "Uang Kurang",
            "Uang Kembalian"
          ],
          correctAnswer: "Uang Pas"
        },
        {
          question: "Bimo mau beli pulpen seharga Rp 3.000, tapi uang Bimo cuma Rp 2.000. Apa yang terjadi?",
          imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300",
          options: [
            "Bimo dapat kembalian",
            "Uang Bimo kurang, tidak bisa beli",
            "Uang Bimo pas",
            "Bimo dapat diskon"
          ],
          correctAnswer: "Uang Bimo kurang, tidak bisa beli"
        },
        {
          question: "Manakah contoh kondisi Uang Pas?",
          imageUrl: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=300",
          options: [
            "Harga Rp 5.000, membayar dengan Rp 10.000",
            "Harga Rp 8.000, membayar dengan Rp 5.000",
            "Harga Rp 10.000, membayar dengan Rp 10.000",
            "Harga Rp 3.000, membayar dengan Rp 2.000"
          ],
          correctAnswer: "Harga Rp 10.000, membayar dengan Rp 10.000"
        }
      ],
      
      closingText: "Keren! Kamu sudah belajar membayar dengan uang pas seperti Bimo. Terus berlatih ya!"
    };

    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Membayar Dengan Uang Pas",
      order: 3,
      content: meeting3Content,
    } as any);

    console.log("✅ Created Meeting 3: Membayar Dengan Uang Pas");
    console.log(`   → Module ID: ${module1.id}, Meeting Order: 3`);

    // 4. Create Pertemuan 4: Simulasi Belanja Toko (with Video Popups)
    const meeting4Content = {
      openingText: "Hari ini kita akan simulasi belanja di toko! Perhatikan harga barang-barangnya!",
      
      videos: [
        {
          url: "https://youtu.be/rvc_ninxSf4",
          title: "Simulasi Belanja di Toko",
          interactions: [
            {
              timestamp: "02:16",
              action: "pause" as const,
              message: "Susu: Rp15.000"
            },
            {
              timestamp: "02:26",
              action: "pause" as const,
              message: "Pasta Gigi: Rp10.000"
            },
            {
              timestamp: "02:33",
              action: "pause" as const,
              message: "Tissue: Rp20.000"
            },
            {
              timestamp: "02:38",
              action: "pause" as const,
              message: "Pisang: Rp25.000"
            }
          ]
        }
      ],
      
      activities: [
        {
          id: "total_belanja",
          instruction: "Berapa harga total belanjaan (Susu + Pasta Gigi + Tissue + Pisang)?",
          imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300",
          options: [
            { color: "red" as const, text: "Rp 60.000" },
            { color: "blue" as const, text: "Rp 70.000" },
            { color: "green" as const, text: "Rp 80.000" },
            { color: "yellow" as const, text: "Rp 50.000" }
          ],
          correctIndex: 1 // Rp 70.000 (15k + 10k + 20k + 25k)
        }
      ],
      
      quiz: [
        {
          question: "Bimo beli 2 penggaris (@Rp2.000) dan 1 penghapus (Rp1.000). Total Rp5.000, lalu bayar Rp5.000. Kondisi apa ini?",
          imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300",
          options: ["Uang Lebih", "Uang Pas", "Uang Kurang", "Perlu Kembalian"],
          correctAnswer: "Uang Pas"
        },
        {
          question: "Bimo beli buku Rp5.000 + pulpen Rp2.000 (Total Rp7.000). Bayar Rp10.000. Berapa kembaliannya?",
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300",
          options: ["Rp2.000", "Rp3.000", "Rp4.000", "Rp5.000"],
          correctAnswer: "Rp3.000"
        },
        {
          question: "Bimo punya 3 lembar Rp2.000 (Total Rp6.000). Mau beli mainan Rp7.000. Apa yang harus dilakukan?",
          imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300",
          options: [
            "Tidak jadi beli",
            "Menambah uang Rp1.000 lagi",
            "Minta diskon",
            "Bayar Rp6.000 saja"
          ],
          correctAnswer: "Menambah uang Rp1.000 lagi"
        },
        {
          question: "Bimo punya uang Rp5.000 + Rp1.000 (Total Rp6.000). Beli 3 permen (@Rp1.000 = Rp3.000). Sisa uang Bimo berapa?",
          imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300",
          options: ["Rp2.000", "Rp3.000", "Rp4.000", "Rp5.000"],
          correctAnswer: "Rp3.000"
        },
        {
          question: "Bimo mau beli barang Rp8.000. Bawa uang Rp5.000 + 2 lembar Rp2.000 (Total Rp9.000). Kondisi apa ini?",
          imageUrl: "https://images.unsplash.com/photo-1622682010864-91e3f65882b1?w=300",
          options: [
            "Uang Pas",
            "Uang Kurang",
            "Uang Lebih Rp1.000",
            "Perlu pinjam uang"
          ],
          correctAnswer: "Uang Lebih Rp1.000"
        },
        {
          question: "Bimo beli 5 ikat kangkung (@Rp1.000 = Rp5.000). Bayar dengan uang Rp5.000. Apa kata penjual?",
          imageUrl: "https://images.unsplash.com/photo-1590658165737-15a047b7a9c5?w=300",
          options: [
            "Uangnya pas, terima kasih.",
            "Ini kembaliannya Rp1.000",
            "Uangnya kurang",
            "Boleh utang?"
          ],
          correctAnswer: "Uangnya pas, terima kasih."
        },
        {
          question: "Bimo beli barang Rp4.000. Punya uang Rp2.000 + 3 keping Rp1.000 (Total Rp5.000). Apa yang terjadi?",
          imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300",
          options: [
            "Uang pas",
            "Uang kurang Rp1.000",
            "Bimo akan mendapat kembalian Rp1.000",
            "Perlu tambah uang"
          ],
          correctAnswer: "Bimo akan mendapat kembalian Rp1.000"
        },
        {
          question: "Bimo beli barang Rp10.000. Bayar dengan 2 lembar Rp5.000. Kondisi pembayaran ini disebut?",
          imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300",
          options: [
            "Uang Lebih",
            "Uang Kurang",
            "Uang Pas",
            "Perlu Kembalian"
          ],
          correctAnswer: "Uang Pas"
        },
        {
          question: "Bimo beli 3 jeruk (@Rp2.000 = Rp6.000). Tapi uang Bimo cuma Rp5.000. Apa kondisinya?",
          imageUrl: "https://images.unsplash.com/photo-1587132117816-61c6ee6d3d1d?w=300",
          options: [
            "Uang pas",
            "Uang lebih Rp1.000",
            "Uang Bimo kurang Rp1.000",
            "Dapat diskon"
          ],
          correctAnswer: "Uang Bimo kurang Rp1.000"
        },
        {
          question: "Bimo beli 3 barang: Rp2.000 + Rp3.000 + Rp5.000 (Total Rp10.000). Bayar Rp10.000. Apa kondisi uang Bimo?",
          imageUrl: "https://images.unsplash.com/photo-1554224311-beee415c201f?w=300",
          options: [
            "Uang Lebih",
            "Uang Kurang",
            "Uang Bimo Pas",
            "Perlu Kembalian Rp2.000"
          ],
          correctAnswer: "Uang Bimo Pas"
        }
      ],
      
      closingText: "Hebat! Kamu sudah bisa mensimulasikan belanja seperti di toko sungguhan!"
    };

    await db.insert(meetings).values({
      moduleId: module1.id,
      title: "Simulasi Belanja Toko",
      order: 4,
      content: meeting4Content,
    } as any);

    console.log("✅ Created Meeting 4: Simulasi Belanja Toko (with Video Popups)");
    console.log(`   → Module ID: ${module1.id}, Meeting Order: 4`);

    // 5. Create Module 2: Keterampilan Bertahan Hidup
    const [module2] = await db.insert(modules).values({
      title: "Keterampilan Bertahan Hidup",
      category: "Life Skills",
      description: "Belajar keterampilan penting untuk kehidupan sehari-hari",
      imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
      order: 2,
    } as InsertModule).returning();

    console.log("✅ Created Module:", module2.title);

    // 6. Create Meeting 1: Bahaya di Rumah (Interactive Story)
    const module2Meeting1Content = {
      openingText: "Hari ini kita akan belajar mengenali bahaya di rumah dan cara menghindarinya. Yuk, kita ikuti petualangan ini!",
      
      videos: [
        {
          url: "https://youtu.be/ZhyX7SR7kn0",
          title: "Bahaya di Rumah",
          interactions: []
        }
      ],
      
      // Interactive story-based activities
      activities: [
        {
          id: "sharp_objects_electricity",
          instruction: "Kamu bangun tidur dan ke dapur. Di meja ada PISAU TAJAM, STOP KONTAK terkelupas, dan KOMPOR menyala. Apa yang harus kamu lakukan?",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
          options: [
            { color: "red" as const, text: "Memegang ujung pisau" },
            { color: "blue" as const, text: "Mencolokkan jari ke stop kontak" },
            { color: "green" as const, text: "Diam dan jangan sentuh" },
            { color: "yellow" as const, text: "Bermain api" }
          ],
          correctIndex: 2 // Diam dan jangan sentuh
        },
        {
          id: "hot_water_slippery",
          instruction: "Kamu tersenggol gelas air panas. Lantai jadi basah dan licin. Apa yang kamu lakukan supaya tidak jatuh?",
          imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300",
          options: [
            { color: "red" as const, text: "Lari kencang" },
            { color: "blue" as const, text: "Berdiri diam saja" },
            { color: "green" as const, text: "Berhenti, jalan pelan ke tempat kering, minta tolong" },
            { color: "yellow" as const, text: "Melompat-lompat" }
          ],
          correctIndex: 2 // Berhenti, jalan pelan ke tempat kering, minta tolong
        },
        {
          id: "burn_injury",
          instruction: "Aduh! Tanganmu kena air panas dan terasa perih. Apa yang kamu lakukan sekarang?",
          imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300",
          options: [
            { color: "red" as const, text: "Oleskan odol/kecap" },
            { color: "blue" as const, text: "Basuh dengan air mengalir" },
            { color: "green" as const, text: "Menangis di pojokan" },
            { color: "yellow" as const, text: "Bungkus plastik" }
          ],
          correctIndex: 1 // Basuh dengan air mengalir
        },
        {
          id: "unknown_medicine",
          instruction: "Tanganmu sudah membaik. Lalu kamu melihat obat warna-warni seperti permen. Bolehkah dimakan?",
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
          options: [
            { color: "red" as const, text: "Boleh, telan banyak-banyak" },
            { color: "blue" as const, text: "Masukkan mulut lalu buang" },
            { color: "green" as const, text: "Berikan ke kucing" },
            { color: "yellow" as const, text: "Tidak boleh, tanya Ibu/Ayah dulu" }
          ],
          correctIndex: 3 // Tidak boleh, tanya Ibu/Ayah dulu
        }
      ],
      
      quiz: [
        {
          question: "Ada pisau tajam di lantai. Apa tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=300",
          options: [
            "Mainkan pisau itu",
            "Lapor ke orang tua dan jauhi",
            "Lempar pisau itu",
            "Simpan di bawah bantal"
          ],
          correctAnswer: "Lapor ke orang tua dan jauhi"
        },
        {
          question: "Stop kontak kabelnya rusak. Apa tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300",
          options: [
            "Colokkan jari ke lubangnya",
            "Coba perbaiki sendiri",
            "Jangan disentuh, bilang Ayah",
            "Siram dengan air"
          ],
          correctAnswer: "Jangan disentuh, bilang Ayah"
        },
        {
          question: "Ada obat di meja tamu. Itu untuk siapa?",
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
          options: [
            "Hanya untuk orang sakit/Dewasa yang tahu",
            "Untuk semua orang",
            "Untuk anak-anak",
            "Untuk hewan peliharaan"
          ],
          correctAnswer: "Hanya untuk orang sakit/Dewasa yang tahu"
        },
        {
          question: "Lantai kamar mandi basah dan licin. Bagaimana cara jalannya?",
          imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300",
          options: [
            "Lari sekencang-kencangnya",
            "Jalan pelan-pelan dan hati-hati",
            "Melompat-lompat",
            "Merangkak"
          ],
          correctAnswer: "Jalan pelan-pelan dan hati-hati"
        },
        {
          question: "Ada korek api jatuh di lantai. Apa tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1609743522653-52354461eb27?w=300",
          options: [
            "Main-mainkan korek api itu",
            "Bakar kertas",
            "Nyalakan korek api",
            "Serahkan pada orang tua"
          ],
          correctAnswer: "Serahkan pada orang tua"
        }
      ],
      
      closingText: "Ingat Pesan Siaga: Benda Tajam & Panas (Jangan sentuh), Lantai Basah (Minta bantuan), Air Panas (Basuh air mengalir), Obat (Tanya Orang Tua)."
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Bahaya di Rumah",
      order: 1,
      content: module2Meeting1Content,
    } as any);

    console.log("✅ Created Meeting 1: Bahaya di Rumah (Interactive Story)");
    console.log(`   → Module ID: ${module2.id}, Meeting Order: 1`);

    // 6b. Create Meeting 2: Keselamatan di Luar (Interactive Story)
    const module2Meeting2Content = {
      openingText: "Hari ini kita akan belajar tetap aman saat berada di luar rumah. Yuk, ikuti petualangan keselamatan ini!",
      
      videos: [
        {
          url: "https://youtu.be/NgymEgqTNGE",
          title: "Keselamatan di Luar",
          interactions: []
        }
      ],
      
      // Interactive story-based activities
      activities: [
        {
          id: "crossing_street",
          instruction: "Hari ini cuaca cerah! Kamu pergi ke taman kota bersama Ibu. Kamu harus menyeberang jalan raya ramai. Ada lampu lalu lintas dan garis putih. Apa yang harus kamu lakukan supaya aman?",
          imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300",
          options: [
            { color: "red" as const, text: "Berlari kencang" },
            { color: "blue" as const, text: "Berhenti di tengah jalan" },
            { color: "green" as const, text: "Tunggu lampu hijau, jalan di Zebra Cross" },
            { color: "yellow" as const, text: "Menyeberang sambil tutup mata" }
          ],
          correctIndex: 2 // Tunggu lampu hijau, jalan di Zebra Cross
        },
        {
          id: "bus_safety",
          instruction: "Hore! Kamu berhasil menyeberang dan naik bus. Supaya kamu tidak jatuh atau terluka saat bus berjalan, apa yang kamu lakukan?",
          imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300",
          options: [
            { color: "red" as const, text: "Berdiri di kursi teriak-teriak" },
            { color: "blue" as const, text: "Keluarkan kepala dari jendela" },
            { color: "green" as const, text: "Duduk tenang dan pakai sabuk pengaman" },
            { color: "yellow" as const, text: "Berlari di dalam bus" }
          ],
          correctIndex: 2 // Duduk tenang dan pakai sabuk pengaman
        },
        {
          id: "stranger_danger",
          instruction: "Sampai di taman, Ibu membuang sampah sebentar. Tiba-tiba ada Bapak tidak dikenal memberi permen dan mengajakmu ke mobilnya. Apa yang kamu lakukan?",
          imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300",
          options: [
            { color: "red" as const, text: "Makan permen dan ikut" },
            { color: "blue" as const, text: "Menangis diam saja" },
            { color: "green" as const, text: "Bilang 'TIDAK', jangan ambil, lari ke Ibu" },
            { color: "yellow" as const, text: "Memberitahu nama dan alamat rumah" }
          ],
          correctIndex: 2 // Bilang 'TIDAK', jangan ambil, lari ke Ibu
        }
      ],
      
      quiz: [
        {
          question: "Supaya badan aman di dalam mobil saat jalan, pakai apa?",
          imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300",
          options: [
            "Topi",
            "Kacamata",
            "Pakai sabuk pengaman/seatbelt",
            "Sarung tangan"
          ],
          correctAnswer: "Pakai sabuk pengaman/seatbelt"
        },
        {
          question: "Di mana tempat paling aman menyeberang jalan raya?",
          imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300",
          options: [
            "Di mana saja asal cepat",
            "Di tikungan jalan",
            "Zebra Cross/Garis Putih",
            "Di tengah jalan raya"
          ],
          correctAnswer: "Zebra Cross/Garis Putih"
        },
        {
          question: "Ada orang tak dikenal mengajak pergi dan tawarkan mainan. Tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300",
          options: [
            "Terima mainan dan ikut",
            "Diam saja",
            "Bilang TIDAK dan lari ke orang tua",
            "Kasih tau alamat rumah"
          ],
          correctAnswer: "Bilang TIDAK dan lari ke orang tua"
        },
        {
          question: "Main sepeda di taman. Supaya kepala aman jika jatuh pakai apa?",
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
          options: [
            "Topi baseball",
            "Helm pelindung",
            "Bandana",
            "Tidak pakai apa-apa"
          ],
          correctAnswer: "Helm pelindung"
        },
        {
          question: "Tersesat di Mall terlepas dari Ibu. Siapa yang harus dicari?",
          imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300",
          options: [
            "Orang asing yang lewat",
            "Anak kecil lain",
            "Satpam atau petugas berseragam",
            "Keluar Mall sendiri"
          ],
          correctAnswer: "Satpam atau petugas berseragam"
        }
      ],
      
      closingText: "Ingat Rahasia Anak Hebat: Menyeberang di Zebra Cross, Duduk tenang, Jangan terima makanan orang asing. Kamu resmi menjadi Pahlawan Keselamatan hari ini! 🌟🏆"
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Keselamatan di Luar",
      order: 2,
      content: module2Meeting2Content,
    } as any);

    console.log("✅ Created Meeting 2: Keselamatan di Luar (Interactive Story)");
    console.log(`   → Module ID: ${module2.id}, Meeting Order: 2`);

    // 6c. Create Meeting 3: Tanggap Darurat (Interactive Story)
    const module2Meeting3Content = {
      openingText: "Hari ini kamu akan menjadi Penyelamat Cilik! Kita akan belajar cara tanggap darurat. Siap?",
      
      videos: [
        {
          url: "https://youtu.be/NihNPyDagKE",
          title: "Tanggap Darurat",
          interactions: []
        }
      ],
      
      // Interactive story-based activities
      activities: [
        {
          id: "fire_scenario",
          instruction: "Petualangan Penyelamat Cilik dimulai! Kamu melihat asap dan api kecil di pojok ruangan. Api itu bisa berbahaya. Apa yang harus kamu lakukan?",
          imageUrl: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=300",
          options: [
            { color: "red" as const, text: "Tiup api sendirian" },
            { color: "blue" as const, text: "Tepuk tangan menonton api" },
            { color: "green" as const, text: "Teriak 'Kebakaran' & lari cari orang dewasa" },
            { color: "yellow" as const, text: "Sembunyi di bawah meja" }
          ],
          correctIndex: 2 // Teriak 'Kebakaran' & lari cari orang dewasa
        },
        {
          id: "emergency_call",
          instruction: "Ibu datang tapi butuh bantuan. Kamu ingat ada nomor telepon khusus untuk keadaan darurat. Nomor mana yang harus dihubungi?",
          imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300",
          options: [
            { color: "red" as const, text: "123 atau 456" },
            { color: "blue" as const, text: "112, 110, atau 119" },
            { color: "green" as const, text: "000 atau 111" },
            { color: "yellow" as const, text: "888 atau 999" }
          ],
          correctIndex: 1 // 112, 110, atau 119
        },
        {
          id: "injured_friend",
          instruction: "Api sudah padam. Tapi temanmu terjatuh, kakinya berdarah dan menangis. Apa yang kamu lakukan untuk menolongnya?",
          imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=300",
          options: [
            { color: "red" as const, text: "Ikut menangis di lantai" },
            { color: "blue" as const, text: "Marah menyuruh diam" },
            { color: "green" as const, text: "Tenang, temani, & panggil bantuan" },
            { color: "yellow" as const, text: "Biarkan saja" }
          ],
          correctIndex: 2 // Tenang, temani, & panggil bantuan
        }
      ],
      
      quiz: [
        {
          question: "Nomor 112 digunakan untuk menelepon siapa?",
          imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300",
          options: [
            "Teman main",
            "Restoran",
            "Bantuan Darurat/Polisi/Ambulans",
            "Toko mainan"
          ],
          correctAnswer: "Bantuan Darurat/Polisi/Ambulans"
        },
        {
          question: "Ada kebakaran besar di ruangan. Apa tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=300",
          options: [
            "Telepon darurat/Cari bantuan orang dewasa",
            "Nonton aja dari jauh",
            "Ambil foto dulu",
            "Main air sendiri"
          ],
          correctAnswer: "Telepon darurat/Cari bantuan orang dewasa"
        },
        {
          question: "Ada orang pingsan tak bangun lagi. Apa tindakanmu?",
          imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300",
          options: [
            "Pergi saja",
            "Goyang-goyang paksa bangun",
            "Panggil orang dewasa/medis",
            "Foto dan kasih ke media sosial"
          ],
          correctAnswer: "Panggil orang dewasa/medis"
        },
        {
          question: "Jari tergores dan berdarah. Supaya bersih diapakan?",
          imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=300",
          options: [
            "Jilat pakai lidah",
            "Bersihkan air bersih & minta obat",
            "Biarkan kering sendiri",
            "Tutup pakai tissue kotor"
          ],
          correctAnswer: "Bersihkan air bersih & minta obat"
        },
        {
          question: "Ada banjir tinggi di jalan. Apa yang aman?",
          imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=300",
          options: [
            "Berenang melintasi banjir",
            "Main-main di air banjir",
            "Jangan lewat, cari jalan lain",
            "Lompat dari atap"
          ],
          correctAnswer: "Jangan lewat, cari jalan lain"
        }
      ],
      
      closingText: "Wah, kamu hebat! Kamu sudah belajar: Paham Bahaya, Hafal Nomor Darurat, dan Sayang Teman. Kamu adalah Anak Hebat yang Bisa Diandalkan! 🌟🥇"
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Tanggap Darurat",
      order: 3,
      content: module2Meeting3Content,
    } as any);

    console.log("✅ Created Meeting 3: Tanggap Darurat (Interactive Story)");
    console.log(`   → Module ID: ${module2.id}, Meeting Order: 3`);

    // 6d. Create Meeting 4: Simulasi Situasi Darurat (Long Story + Quiz)
    const module2Meeting4Content = {
      openingText: "Hari ini kita akan belajar cara menghadapi gempa bumi melalui cerita petualangan Saat Bumi Bergoyang. Yuk, ikuti ceritanya!",
      
      // Story that displays before activities (scrollable)
      storyTitle: "Saat Bumi Bergoyang",
      story: `Pagi itu, kamu sedang asyik mewarnai gambar rumah bersama adikmu di ruang keluarga. Ibu sedang memasak di dapur, dan suara canda tawa kalian memenuhi rumah. Tiba-tiba, kamu merasakan lantai bergetar. Mula-mula hanya sedikit, seperti ada truk besar lewat di depan rumah.

Tapi getarannya semakin kuat. Lampu gantung mulai berayun-ayun. Gelas di atas meja bergetar dan berbunyi. Adikmu mulai ketakutan dan memanggil, "Kakak... kenapa lantai goyang?"

"Gempa!" teriak Ibu dari dapur. "Anak-anak, cepat merunduk di bawah meja!"

Kamu ingat pelajaran di sekolah tentang gempa bumi. Guru pernah mengajarkan cara melindungi diri. Dengan cepat, kamu menarik tangan adikmu dan merunduk di bawah meja makan yang kokoh. Kamu melindungi kepalamu dengan satu tangan, dan tangan satunya memeluk adikmu erat-erat.

"Jangan takut, Adik. Kita aman di sini," bisikmu menenangkan adik yang mulai menangis.

Ibu berlari dari dapur dan ikut berlindung bersama kalian di bawah meja. Gempa masih berlangsung. Terdengar suara benda-benda jatuh, buku-buku dari rak berjatuhan, dan vas bunga pecah di lantai. Kamu menutup mata adikmu supaya tidak melihat dan semakin takut.

"Tenanglah, anak-anak. Tetap di bawah meja. Lindungi kepala kalian," kata Ibu dengan suara yang tenang meskipun wajahnya terlihat khawatir.

Setelah beberapa saat yang terasa sangat lama, getaran mulai mereda. Gempa perlahan berhenti. Rumah menjadi sunyi. Hanya terdengar suara napas kalian bertiga yang masih terengah-engah.

"Sudah selesai?" tanya adikmu dengan suara pelan.

"Ya, sudah. Tapi kita harus keluar rumah sekarang. Mungkin ada gempa susulan," jawab Ibu.

Kalian bertiga keluar dari bawah meja dengan hati-hati. Ibu memeriksa keadaan sekitar. Lantai penuh pecahan kaca dan barang-barang yang jatuh. Pintu keluar masih utuh dan bisa dibuka.

"Ayo, kita ke lapangan sekolah. Itu tempat yang aman," kata Ibu sambil menggandeng tangan kalian berdua.

Kalian berjalan keluar rumah dengan tenang. Tidak berlari, tidak panik. Di jalan, banyak tetangga juga keluar rumah mereka. Semua orang berjalan menuju lapangan yang luas dan terbuka, jauh dari bangunan tinggi dan tiang listrik.

Sesampainya di lapangan, kamu melihat banyak keluarga lain sudah berkumpul di sana. Pak RT sedang mendata warga dan memastikan semua orang aman. Petugas pemadam kebakaran dan polisi juga datang untuk membantu.

"Kalian hebat sekali. Tidak panik dan tahu apa yang harus dilakukan," puji Ibu sambil memeluk kalian berdua.

Adikmu tersenyum kecil, "Itu karena Kakak melindungi aku, Bu."

Kamu merasa bangga. Kamu ingat semua pelajaran keselamatan: merunduk di bawah meja, lindungi kepala, tetap tenang, dan pergi ke tempat terbuka setelah gempa berhenti. Kamu tidak panik dan tahu cara melindungi diri dan adikmu.

Ibu tersenyum bangga dan memelukmu.`,
      
      videos: [
        {
          url: "https://youtu.be/Z5VkdB6Xbu8",
          title: "Simulasi Situasi Darurat",
          interactions: []
        }
      ],
      
      // Activity with conclusion question after story
      activities: [
        {
          id: "earthquake_conclusion",
          instruction: "Apa yang dapat kamu simpulkan dari cerita tersebut?",
          imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300",
          options: [
            { color: "red" as const, text: "Kita harus lari kencang saat gempa" },
            { color: "blue" as const, text: "Kita harus menangis dan berteriak" },
            { color: "green" as const, text: "Tetap tenang, lindungi kepala, dan pergi ke lapangan luas" },
            { color: "yellow" as const, text: "Kita harus bersembunyi di dalam lemari" }
          ],
          correctIndex: 2 // Tetap tenang, lindungi kepala, dan pergi ke lapangan luas
        }
      ],
      
      quiz: [
        {
          question: "Apa yang dilakukan pertama kali saat gempa?",
          imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300",
          options: [
            "Lari keluar rumah",
            "Menangis dan berteriak",
            "Merunduk dan sembunyi di bawah meja",
            "Berdiri diam di tengah ruangan"
          ],
          correctAnswer: "Merunduk dan sembunyi di bawah meja"
        },
        {
          question: "Bagian tubuh mana yang paling penting dilindungi?",
          imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=300",
          options: [
            "Kaki",
            "Kepala",
            "Tangan",
            "Perut"
          ],
          correctAnswer: "Kepala"
        },
        {
          question: "Mengapa menjauh dari jendela kaca?",
          imageUrl: "https://images.unsplash.com/photo-1545058935-f8d36f906eea?w=300",
          options: [
            "Karena kaca bisa kotor",
            "Karena kaca bisa pecah dan melukai",
            "Karena kaca bisa hilang",
            "Karena kaca bisa meleleh"
          ],
          correctAnswer: "Karena kaca bisa pecah dan melukai"
        },
        {
          question: "Jika tidak ada meja, lindungi kepala pakai apa?",
          imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300",
          options: [
            "Tas atau bantal",
            "Batu",
            "Kertas",
            "Tidak perlu dilindungi"
          ],
          correctAnswer: "Tas atau bantal"
        },
        {
          question: "Tempat paling aman di luar rumah?",
          imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=300",
          options: [
            "Di bawah pohon besar",
            "Di dekat gedung tinggi",
            "Lapangan luas yang terbuka",
            "Di dalam mobil"
          ],
          correctAnswer: "Lapangan luas yang terbuka"
        },
        {
          question: "Apa yang dilakukan jika di dalam lift saat gempa?",
          imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300",
          options: [
            "Melompat-lompat",
            "Duduk diam saja",
            "Tekan semua tombol agar berhenti",
            "Pecahkan pintunya"
          ],
          correctAnswer: "Tekan semua tombol agar berhenti"
        },
        {
          question: "Bolehkah pakai lift untuk keluar gedung?",
          imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300",
          options: [
            "Boleh, lebih cepat",
            "Boleh, kalau liftnya bagus",
            "Tidak boleh, harus lewat tangga",
            "Boleh, kalau ramai"
          ],
          correctAnswer: "Tidak boleh, harus lewat tangga"
        },
        {
          question: "Jika melihat api kecil saat gempa?",
          imageUrl: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=300",
          options: [
            "Tiup sendiri",
            "Panggil orang dewasa/Teriak Kebakaran",
            "Foto dulu",
            "Tambah bensin"
          ],
          correctAnswer: "Panggil orang dewasa/Teriak Kebakaran"
        },
        {
          question: "Cara berjalan keluar gedung bersama teman?",
          imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300",
          options: [
            "Berlari sekencang-kencangnya",
            "Mendorong yang di depan",
            "Berjalan tenang, tertib, tidak mendorong",
            "Melompat dari jendela"
          ],
          correctAnswer: "Berjalan tenang, tertib, tidak mendorong"
        },
        {
          question: "Setelah sampai di lapangan luas?",
          imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=300",
          options: [
            "Langsung pulang ke rumah",
            "Main-main sendiri",
            "Tetap berkumpul bersama guru/orang tua",
            "Pergi ke tempat lain"
          ],
          correctAnswer: "Tetap berkumpul bersama guru/orang tua"
        }
      ],
      
      closingText: "Kamu tidak panik dan tahu cara melindungi diri. Ibu bangga padamu. Kamu memang pahlawan keselamatan yang hebat!"
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Simulasi Situasi Darurat",
      order: 4,
      content: module2Meeting4Content,
    } as any);

    console.log("✅ Created Meeting 4: Simulasi Situasi Darurat (Long Story + Quiz)");
    console.log(`   → Module ID: ${module2.id}, Meeting Order: 4`);

    // 7. Create Module 3: Bahasa Inggris Dasar
    const [module3] = await db.insert(modules).values({
      title: "Bahasa Inggris Dasar",
      category: "English",
      description: "Pengenalan bahasa Inggris untuk pemula",
      imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400",
      order: 3,
    } as InsertModule).returning();

    console.log("✅ Created Module:", module3.title);

    // 7a. Create Meeting 1: Perkenalan & Sapaan (DRAG & DROP)
    const module3Meeting1Content = {
      openingText: "Hari ini kita akan belajar sapaan dan perkenalan dalam Bahasa Inggris. Yuk, kita lengkapi percakapan ini dengan menarik kata yang tepat!",
      
      videos: [
        {
          url: "https://youtu.be/KKh_CallEp8",
          title: "Greetings and Introductions",
          interactions: []
        }
      ],
      
      // Drag & Drop Dialogue Activity
      activities: [
        {
          id: "dialogue_completion",
          type: "drag_drop", // NEW TYPE
          instruction: "Drag the correct words from the Word Bank to complete the conversation!",
          imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
          storyTemplate: "It is a bright and sunny day at the park. You see a new person sitting on a bench. You decide to be friendly and walk towards them.\n\n 🧑 YOU: '{0}!'\n\n👤 STRANGER: 'Hi there!'\n\n🧑 YOU: '{1}. It is a very beautiful day today, isn't it?.'\n\n👤 STRANGER: 'Yes, it really is. I just moved here yesterday.'\n\n🧑 YOU: 'Oh, welcome! {2}. {3}?'\n\n👤 STRANGER: 'Nice to meet you! My name is Jordan.'\n\n🧑 YOU: 'Nice to meet you too, Jordan. {4}?'\n\n👤 STRANGER: '{5}. I am very happy to meet a new friend like you.'",
          wordBank: [
            { id: "w1", text: "Hello", correctSlotIndex: 0 },
            { id: "w2", text: "Good morning", correctSlotIndex: 1 },
            { id: "w3", text: "What is your name", correctSlotIndex: 3 },
            { id: "w4", text: "How are you", correctSlotIndex: 4 },
            // Distractors
            { id: "w5", text: "My name is Budi", correctSlotIndex: 2 },
            { id: "w6", text: "Good night", correctSlotIndex: null },
            { id: "w7", text: "Where are you", correctSlotIndex: null },
            { id: "w8", text: "I'm fine, thank you", correctSlotIndex: 5 }
          ]
        }
      ],
      
      quiz: [
        {
          question: "Jam 7 pagi di sekolah. Kamu bertemu guru. Apa yang kamu katakan?",
          imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300",
          options: [
            "Good night, Teacher",
            "Good morning, Teacher",
            "Good bye, Teacher",
            "Good afternoon, Teacher"
          ],
          correctAnswer: "Good morning, Teacher"
        },
        {
          question: "Kamu ingin tahu nama siswa baru. Apa pertanyaanmu?",
          imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300",
          options: [
            "How are you?",
            "Where are you from?",
            "What's your name?",
            "How old are you?"
          ],
          correctAnswer: "What's your name?"
        },
        {
          question: "Seseorang bertanya 'What's your name?'. Kamu bernama Sarah. Apa jawabanmu?",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
          options: [
            "I am fine",
            "Nice to meet you",
            "My name is Sarah",
            "How are you?"
          ],
          correctAnswer: "My name is Sarah"
        },
        {
          question: "Cara menanyakan kabar seseorang dengan sopan dalam Bahasa Inggris?",
          imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300",
          options: [
            "What is your name?",
            "Where are you?",
            "Who are you?",
            "How are you?"
          ],
          correctAnswer: "How are you?"
        },
        {
          question: "Teman bertanya 'How are you?'. Kamu merasa baik. Apa jawabanmu?",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
          options: [
            "I'm fine, thank you",
            "My name is Budi",
            "Good morning",
            "Nice to meet you"
          ],
          correctAnswer: "I'm fine, thank you"
        }
      ],
      
      closingText: "Hebat! Kamu sudah bisa menyapa dan berkenalan dalam Bahasa Inggris. Keep practicing!"
    };

    await db.insert(meetings).values({
      moduleId: module3.id,
      title: "Perkenalan & Sapaan",
      order: 1,
      content: module3Meeting1Content,
    } as any);

    console.log("✅ Created Meeting 1: Perkenalan & Sapaan (Dialogue Completion)");
    console.log(`   → Module ID: ${module3.id}, Meeting Order: 1`);

    // 7b. Create Meeting 2: Anggota Tubuh (Body Parts Touch Activity)
    const module3Meeting2Content = {
      openingText: "Hari ini kita akan belajar tentang anggota tubuh dalam Bahasa Inggris. Dengarkan instruksi dan sentuh bagian tubuh yang benar!",
      
      videos: [
        {
          url: "https://youtu.be/SUt8q0EKbms",
          title: "Body Parts Song",
          interactions: []
        }
      ],
      
      // Body Parts Touch Activity
      activities: [
        {
          id: "body_parts_touch",
          type: "body_parts_touch",
          instruction: "Listen and click on the correct body part!",
          imageUrl: "/src/assets/body-parts-diagram.png",
          instructions: [
        {
          "part": "hair",
          "text": "Touch your hair",
          "zone": {
            "top": "5%",
            "left": "38%",
            "width": "20%",
            "height": "15%"
          }
        },
        {
          "part": "eye",
          "text": "Touch your eye",
          "zone": {
            "top": "27%",
            "left": "40%",
            "width": "7%",
            "height": "8%"
          }
        },
        {
          "part": "nose",
          "text": "Touch your nose",
          "zone": {
            "top": "32%",
            "left": "45%",
            "width": "5%",
            "height": "6%"
          }
        },
        {
          "part": "ears",
          "text": "Touch your ears",
          "zone": {
            "top": "30%",
            "left": "35%",
            "width": "5%",
            "height": "11%"
          }
        },
        {
          "part": "mouth",
          "text": "Touch your mouth",
          "zone": {
            "top": "38%",
            "left": "43%",
            "width": "9%",
            "height": "7%"
          }
        },
        {
          "part": "hand",
          "text": "Touch your hand",
          "zone": {
            "top": "52%",
            "left": "55%",
            "width": "8%",
            "height": "12%"
          }
        },
        {
          "part": "leg",
          "text": "Touch your leg",
          "zone": {
            "top": "72%",
            "left": "48%",
            "width": "8%",
            "height": "15%"
          }
        }
      ],
          closingAudio: "Thank you for following my instructions!"
        }
      ],
      
      quiz_story: "Body Parts Adventure\n\nEvery morning, Budi wakes up with a smile. He opens his eyes to see the bright sun. He breathes the fresh air through his nose. Then, he hears his mother calling from the kitchen with his ears.\n\nBefore breakfast, Budi washes his hands with soap. He sits down and uses his teeth to chew the bread, and his tongue to taste the sweet jam. After eating, he uses his legs and feet to walk to school. At school, Budi uses his brain to think and learn new things.",
      
      quiz: [
        {
          question: "Budi uses his _____ to see the bright sun.",
          imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300",
          options: [
            "Hands",
            "Eyes",
            "Nose",
            "Mouth"
          ],
          correctAnswer: "Eyes"
        },
        {
          question: "Budi hears his mother's voice using his _____.",
          imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300",
          options: [
            "Eyes",
            "Nose",
            "Ears",
            "Mouth"
          ],
          correctAnswer: "Ears"
        },
        {
          question: "What does Budi use to chew the bread?",
          imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
          options: [
            "Teeth",
            "Hands",
            "Legs",
            "Hair"
          ],
          correctAnswer: "Teeth"
        },
        {
          question: "Budi can taste the sweet jam because he has a _____.",
          imageUrl: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300",
          options: [
            "Nose",
            "Eyes",
            "Tongue",
            "Ears"
          ],
          correctAnswer: "Tongue"
        },
        {
          question: "Which part of the body does Budi use to breathe?",
          imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
          options: [
            "Mouth",
            "Nose",
            "Ears",
            "Eyes"
          ],
          correctAnswer: "Nose"
        }
      ],
      
      closingText: "Hebat! Kamu sudah mengenal anggota tubuh dalam Bahasa Inggris!"
    };

    await db.insert(meetings).values({
      moduleId: module3.id,
      title: "Anggota Tubuh",
      order: 2,
      content: module3Meeting2Content,
    } as any);

    console.log("✅ Created Meeting 2: Anggota Tubuh (Body Parts Touch)");
    console.log(`   → Module ID: ${module3.id}, Meeting Order: 2`);

    // 7c. Create Meeting 3: Warna dan Bentuk (Match Line Game)
    const module3Meeting3Content = {
      openingText: "Hari ini kita akan belajar tentang warna dan bentuk dalam Bahasa Inggris. Tarik garis untuk mencocokkan gambar dengan kata yang tepat!",
      
      videos: [
        {
          url: "https://youtu.be/AM-Kj6mILC0",
          title: "Colors and Shapes Song",
          interactions: []
        }
      ],
      
      // Match Line Activity
      activities: [
        {
          id: "match_colors_shapes",
          type: "match_line",
          instruction: "Draw lines to match the pictures with the correct words!",
          pairs: [
            { id: "p1", leftImage: "/assets/shapes/circle.png", rightText: "Circle / Lingkaran" },
            { id: "p2", leftImage: "/assets/shapes/triangle.png", rightText: "Triangle / Segitiga" },
            { id: "p3", leftImage: "/assets/shapes/square.png", rightText: "Square / Persegi" },
            { id: "p4", leftImage: "/assets/colors/red-apple.png", rightText: "Red / Merah" },
            { id: "p5", leftImage: "/assets/colors/blue-sky.png", rightText: "Blue / Biru" },
            { id: "p6", leftImage: "/assets/colors/black-stone.png", rightText: "Black / Hitam" }
          ],
          closingAudio: "Good job matching the shapes and colors!"
        }
      ],
      
      quiz_story: "The Adventure of Chromy and Shapey\n\nOnce upon a time in a magical land called Colorville, there lived two best friends: Chromy the Color Fairy and Shapey the Shape Wizard.\n\nOne bright morning, Chromy woke up excited. \"Today is the Rainbow Festival!\" she exclaimed. She looked at her red apple on the table. \"Red is the color of love,\" she said with a smile. Then she gazed out the window at the beautiful blue sky. \"Blue is the color of peace,\" she thought.\n\nMeanwhile, Shapey was preparing his magic shapes. He held up a circle. \"This is round like the sun and the moon,\" he said. Then he showed a triangle. \"This has three sides, just like a slice of pizza!\" Finally, he picked up a square. \"This has four equal sides, perfect for building blocks!\"\n\nChromy and Shapey met at the town square. \"Let's teach the children about colors and shapes!\" said Chromy. Shapey agreed, \"Yes! They need to know that a ripe banana is yellow, and a fresh orange is... well, orange!\"\n\nTogether, they showed the children a black stone. \"This is black, the color of the night,\" explained Chromy. Then Shapey drew shapes in the air with his wand: circles, triangles, and squares danced around them.\n\nThe children clapped and cheered. They learned that:\n- Red apples are delicious\n- The blue sky is beautiful\n- Yellow bananas taste sweet\n- Circles are round\n- Triangles have three pointy corners\n- Squares have four equal sides\n\nFrom that day on, the children of Colorville could name every color and shape they saw. And Chromy and Shapey? They became the best teachers in all the land!",
      
      quiz: [
        {
          question: "What color is the apple that Chromy brought?",
          imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300",
          options: [
            "Green",
            "Red",
            "Yellow",
            "Blue"
          ],
          correctAnswer: "Red"
        },
        {
          question: "According to the story, what color is a ripe banana?",
          imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300",
          options: [
            "Red",
            "Blue",
            "Yellow",
            "Green"
          ],
          correctAnswer: "Yellow"
        },
        {
          question: "Which shape is round like the sun and the moon?",
          imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
          options: [
            "Square",
            "Triangle",
            "Circle",
            "Rectangle"
          ],
          correctAnswer: "Circle"
        },
        {
          question: "Which shape has three sides like a slice of pizza?",
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
          options: [
            "Circle",
            "Square",
            "Rectangle",
            "Triangle"
          ],
          correctAnswer: "Triangle"
        },
        {
          question: "What color is the sky according to Chromy?",
          imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=300",
          options: [
            "Blue",
            "Red",
            "Yellow",
            "Green"
          ],
          correctAnswer: "Blue"
        }
      ],
      
      closingText: "Hebat! Kamu sudah bisa mencocokkan warna dan bentuk dalam Bahasa Inggris!"
    };

    await db.insert(meetings).values({
      moduleId: module3.id,
      title: "Warna dan Bentuk",
      order: 3,
      content: module3Meeting3Content,
    } as any);

    console.log("✅ Created Meeting 3: Warna dan Bentuk (Match Line Game)");
    console.log(`   → Module ID: ${module3.id}, Meeting Order: 3`);

    // 8. Create other main topic (Bahasa Indonesia)
    const otherModules = [
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
    console.log(`📚 Seeded Module 1 ID: ${module1.id} with 4 meetings`);
    console.log(`📚 Seeded Module 2 ID: ${module2.id} with 4 meetings`);
    console.log(`📚 Seeded Module 3 ID: ${module3.id} with 3 meetings`);
    console.log("📚 Created 4 main topics:");
    console.log("   1. Pengenalan Uang & Berhitung (with 4 meetings)");
    console.log("      - Meeting 1: Mengenal Uang Koin dan Kertas");
    console.log("      - Meeting 2: Penjumlahan Sederhana");
    console.log("      - Meeting 3: Membayar Dengan Uang Pas");
    console.log("      - Meeting 4: Simulasi Belanja Toko");
    console.log("   2. Keterampilan Bertahan Hidup (with 4 meetings)");
    console.log("      - Meeting 1: Bahaya di Rumah (Interactive Story)");
    console.log("      - Meeting 2: Keselamatan di Luar (Interactive Story)");
    console.log("      - Meeting 3: Tanggap Darurat (Interactive Story)");
    console.log("      - Meeting 4: Simulasi Situasi Darurat (Long Story + Quiz)");
    console.log("   3. Bahasa Inggris Dasar (with 3 meetings)");
    console.log("      - Meeting 1: Perkenalan & Sapaan (Dialogue Completion)");
    console.log("      - Meeting 2: Anggota Tubuh (Body Parts Touch)");
    console.log("      - Meeting 3: Warna dan Bentuk (Match Line Game)");
    console.log("   4. Bahasa Indonesia & Literasi");
    console.log("");
    console.log("✅ TEST THIS NOW:");
    console.log(`   GET /api/modules/${module1.id}/meetings`);
    console.log("   Should return 4 meetings (Pertemuan 1 unlocked, others locked)");
    console.log(`   GET /api/modules/${module2.id}/meetings`);
    console.log("   Should return 4 meetings (All Interactive Story format)");
    console.log(`   GET /api/modules/${module3.id}/meetings`);
    console.log("   Should return 3 meetings (Dialogue + Body Parts + Match Line)");



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
