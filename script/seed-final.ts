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
              timestamp: "01:31",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 91, type: "number_input", correctValue: "100", label: "Berapa nilainya?" }
              ]
            },
            {
              timestamp: "01:35",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 95, type: "number_input", correctValue: "200", label: "Nilainya?" }
              ]
            },
            {
              timestamp: "01:38",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 98, type: "number_input", correctValue: "500", label: "Nilainya?" }
              ]
            },
            {
              timestamp: "01:43",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 103, type: "number_input", correctValue: "1000", label: "Ketik angkanya!" }
              ]
            },
            {
              timestamp: "01:47",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 107, type: "number_input", correctValue: "2000", label: "Berapa ini?" }
              ]
            },
            {
              timestamp: "01:52",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 112, type: "number_input", correctValue: "5000", label: "Nilainya?" }
              ]
            },
            {
              timestamp: "01:55",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 115, type: "number_input", correctValue: "10000", label: "Nilainya?" }
              ]
            },
            {
              timestamp: "01:58",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 118, type: "number_input", correctValue: "20000", label: "Berapa?" }
              ]
            },
            {
              timestamp: "02:02",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                { time: 122, type: "number_input", correctValue: "50000", label: "Nilainya?" }
              ]
            },
            {
              timestamp: "02:05",
              action: "pause" as const,
              activityId: undefined,
              popups: [
                {
                  time: 125,
                  type: "image_quiz",
                  question: "Manakah yang merupakan Uang Koin?",
                  options: [
                    { id: "opt1", imageUrl: "/assets/money/200.png", isCorrect: true, label: "Koin" },
                    { id: "opt2", imageUrl: "/assets/money/1000.png", isCorrect: false, label: "Kertas" }
                  ]
                }
              ]
            }
          ]
        }
      ],
      
      activities: [],
      
      quiz: [
        {
          question: "Ini uang kertas atau koin?",
          imageUrl: "/assets/money/5000.png",
          options: ["Uang Koin", "Uang Kertas", "Bukan Uang", "Kartu"],
          correctAnswer: "Uang Kertas"
        },
        {
          question: "Berapa nilai uang ini?",
          imageUrl: "/assets/money/500.png",
          options: ["Rp 100", "Rp 200", "Rp 500", "Rp 1.000"],
          correctAnswer: "Rp 500"
        },
        {
          question: "Pilih gambar uang kertas!",
          layout: "image_grid" as const,
          options: ["/assets/money/200.png", "/assets/money/10000.png", "/assets/colors/black-stone.png", "/assets/colors/red-apple.png"],
          correctAnswer: "/assets/money/10000.png"
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
      story: `Petualangan Sani di Toko Kelontong
Pagi itu, matahari bersinar sangat cerah di atas rumah Sani. Sani sudah selesai mandi dan berpakaian rapi. Hari ini, Ibu ingin memasak sayur sop yang lezat untuk makan siang. Namun, Ibu lupa membeli kentang dan wortel.

Ibu memanggil Sani ke dapur. "Sani, tolong bantu Ibu pergi ke toko depan ya," kata Ibu lembut. Ibu memberikan Sani sebuah kantong belanja berwarna biru dan dua lembar uang kertas dari dompetnya. Sani melihat uang itu. Satu lembar berwarna cokelat senilai Dua Ribu Rupiah, dan satu lembar berwarna hijau senilai Lima Ribu Rupiah.

Sani berjalan kaki menuju toko dengan hati yang senang. Di jalan, Sani bertemu dengan seekor kucing berwarna putih yang sedang berjemur. "Halo kucing!" sapa Sani sambil terus berjalan. Tak lama kemudian, sampailah Sani di toko milik Pak RT.

Di dalam toko, banyak sekali barang yang tertata rapi. Ada sabun, sikat gigi, dan berbagai macam sayuran. Sani mencari kentang dan wortel pesanan Ibu. Sani melihat ada kentang yang sudah dibungkus plastik kecil. Di plastiknya ada tulisan harga: Rp5.000. Sani memasukkan kentang itu ke dalam keranjangnya.

Kemudian, Sani mengambil satu ikat wortel yang segar. Harga satu ikat wortel itu adalah Rp2.000. Sani tersenyum karena semua pesanan Ibu sudah lengkap. Sani membawa keranjang belanjanya ke meja kasir tempat Pak RT menunggu.

"Wah, Sani rajin sekali membantu Ibu," kata Pak RT sambil mulai menghitung belanjaan Sani. Sani bersiap-siap mengeluarkan uang dari saku celananya untuk membayar.
`,
      
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
          type: "text_input" as const,
          instruction: "Apa saja yang harus dibeli Sani?",
          correctAnswer: "kentang dan wortel"
        },
        {
          id: "payment_calculation",
          type: "image_grid" as const,
          instruction: "Pilih 2 uang untuk membayar Rp 7.000. Tekan 2 tombol!",
          selectionMode: "multiple" as const,
          maxSelections: 2,
          layout: "image_grid" as const,
          options: [
            { id: "opt1", imageUrl: "/assets/money/10000.png", label: "Rp 10.000", isCorrect: false },
            { id: "opt2", imageUrl: "/assets/money/5000.png", label: "Rp 5.000", isCorrect: true },
            { id: "opt3", imageUrl: "/assets/money/2000.png", label: "Rp 2.000", isCorrect: true },
            { id: "opt4", imageUrl: "/assets/money/20000.png", label: "Rp 20.000", isCorrect: false }
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
      story: `Pagi itu, suasana di sekolah sangat ramai. Bel istirahat baru saja berbunyi. Bimo duduk di bangkunya sambil memeriksa tas sekolahnya. Tiba-tiba, Bimo teringat pesan Ibu Guru bahwa hari ini mereka akan belajar menggambar dan menulis jurnal. Bimo pun mengecek tempat pensilnya. "Aduh, pensilku sudah pendek sekali, pasti sulit dipakai menulis," bisik Bimo dalam hati. Ia juga melihat buku gambarnya yang tinggal satu lembar terakhir. \n\n
Bimo segera mengambil dompet kecil dari saku tasnya. Di dalam dompet itu, ada uang saku yang diberikan Ibu tadi pagi. Bimo menghitung uangnya pelan-pelan. Ada satu lembar uang Sepuluh Ribu Rupiah yang berwarna ungu, satu lembar uang Lima Ribu Rupiah yang berwarna kuning, dan satu lembar uang Dua Ribu Rupiah yang berwarna abu-abu. Bimo menggenggam dompetnya erat-erat dan berjalan menuju koperasi sekolah. \n\n
Di koperasi, Bimo melihat banyak sekali alat tulis yang tertata rapi di rak kaca. Ada penggaris, penghapus, dan krayon warna-warni. Bimo mencari pensil dan buku gambar. Di pojok rak, Bimo menemukan pensil kayu yang bagus. Di sana tertulis harga Rp1.000. Kemudian, Bimo mengambil sebuah buku gambar besar dengan sampul bergambar pemandangan. Di sampulnya tertulis harga Rp5.000. \n\n
Bimo membawa pensil dan buku gambar itu ke meja kasir. Ibu penjaga koperasi tersenyum melihat Bimo. "Halo Bimo, mau beli apa hari ini?" tanya Ibu kantin. Bimo menjawab, "Saya mau beli pensil dan buku gambar ini, Bu." Ibu kantin menjumlahkan harganya dan berkata, "Semuanya jadi Enam Ribu Rupiah, Bimo. Apakah Bimo punya uang pas agar Ibu tidak perlu mencari kembalian?" Bimo pun mulai mengeluarkan uang dari dompetnya dengan teliti.
`,
      
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
          id: "bimo_shopping_text",
          type: "text_input",
          instruction: "Apa saja benda yang dibeli Bimo di koperasi sekolah?",
          correctAnswer: "Pensil dan Buku gambar",
          // Case-insensitive validation is handled in the frontend component
        },
        {
          id: "money_math_image_select",
          type: "image_grid",
          instruction: "Harga Pensil: Rp1.000\nHarga Buku: Rp5.000\nTotal: Rp6.000\n\nTugasmu: Pilih 2 gambar uang pas agar jumlahnya tepat Rp6.000.",
          selectionMode: "multiple",
          maxSelections: 2,
          options: [
            {
              id: "money_10000",
              imageUrl: "/assets/money/10000.png",
              label: "Rp 10.000",
              value: 10000,
              isCorrect: false
            },
            {
              id: "money_5000",
              imageUrl: "/assets/money/5000.png",
              label: "Rp 5.000",
              value: 5000,
              isCorrect: true
            },
            {
              id: "money_2000",
              imageUrl: "/assets/money/2000.png",
              label: "Rp 2.000",
              value: 2000,
              isCorrect: false
            },
            {
              id: "money_1000",
              imageUrl: "/assets/money/1000.png",
              label: "Rp 1.000",
              value: 1000,
              isCorrect: true
            }
          ],
          correctIndices: [1, 3] // Rp 5.000 and Rp 1.000
        }
      ],
      
      quiz: [
        {
          question: "Bimo ingin beli es jeruk seharga Rp 6.000. Manakah kombinasi uang yang Pas?",
          imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300",
          options: [
            "💵 Rp 10.000",
            "💵 Rp 5.000 + 💵 Rp 2.000",
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
          options: [
            "Uang Lebih",
            "Uang Pas",
            "Uang Kurang",
            "Uang Kembalian"
          ],
          correctAnswer: "Uang Pas"
        },
        {
          question: "Bimo mau beli pulpen seharga Rp 3.000, tapi uang Bimo cuma Rp 2.000. Apa yang terjadi?",          options: [
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
            },
            {
              timestamp: "02:43",
              action: "pause" as const,
              popups: [
                {
                  time: 163,
                  type: "number_input",
                  correctValue: "70000",
                  label: "Berapa harga yang harus dibayar?"
                }
              ]
            },
            {
              timestamp: "02:48",
              action: "pause" as const,
              popups: [
                {
                  time: 168,
                  type: "image_quiz",
                  question: "💰 Total belanja Rp70.000. Pilih uang yang pas untuk membayar!",
                  options: [
                    { 
                      id: "opt1", 
                      imageUrl: "/assets/money/70000.png",
                      label: "Rp 70.000 (Uang Pas)", 
                      isCorrect: true 
                    },
                    { 
                      id: "opt2", 
                      imageUrl: "/assets/money/50000.png",
                      label: "Rp 50.000 (Kurang)", 
                      isCorrect: false 
                    },
                    { 
                      id: "opt3", 
                      imageUrl: "/assets/money/100000.png",
                      label: "Rp 100.000 (Kembalian Rp30.000)", 
                      isCorrect: true 
                    }
                  ]
                }
              ]
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
          question: "Bimo beli 2 penggaris yang masing masing harganya Rp2.000 dan 1 penghapus seharga Rp1.000. Bimo membayar dengan uang Rp5.000. Kondisi apa ini?",
          imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300",
          options: ["Uang Lebih", "Uang Pas", "Uang Kurang", "Perlu Kembalian"],
          correctAnswer: "Uang Pas"
        },
        {
          question: "Bimo beli buku Rp5.000 + pulpen Rp2.000. Bimo membayar dengan Rp10.000. Berapa kembaliannya?",
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300",
          options: ["Rp2.000", "Rp3.000", "Rp4.000", "Rp5.000"],
          correctAnswer: "Rp3.000"
        },
        {
          question: "Bimo punya 3 lembar Rp2.000. Ia ingin beli mainan Rp7.000. Apa yang harus dilakukan?",
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
          question: "Bimo punya uang Rp5.000 + Rp1.000. Bimo membeli 3 permen yang harganya Rp. 1.00 per buah. Berapa sisa uang Bimo?",
          imageUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300",
          options: ["Rp2.000", "Rp3.000", "Rp4.000", "Rp5.000"],
          correctAnswer: "Rp3.000"
        },
        {
          question: "Bimo mau beli barang Rp8.000. Bawa uang Rp5.000 dan 2 lembar Rp2.000. Kondisi apa ini?",          options: [
            "Uang Pas",
            "Uang Kurang",
            "Uang Lebih Rp1.000",
            "Perlu pinjam uang"
          ],
          correctAnswer: "Uang Lebih Rp1.000"
        },
        {
          question: "Bimo beli 5 ikat kangkung, harga satu ikatnya adalah Rp 5.000. Bayar dengan uang Rp5.000. Apa kata penjual?",          options: [
            "Uangnya pas, terima kasih.",
            "Ini kembaliannya Rp1.000",
            "Uangnya kurang",
            "Uangnya terlalu banyak"
          ],
          correctAnswer: "Uangnya pas, terima kasih."
        },
        {
          question: "Bimo ingin beli cokelat seharaga Rp4.000. Ia punya uang Rp2.000 + 3 lembar Rp1.000. Pernyataan yang benar adalah..",          options: [
            "Uang pas",
            "Uang kurang Rp1.000",
            "Bimo akan mendapat kembalian Rp1.000",
            "Perlu tambah uang"
          ],
          correctAnswer: "Bimo akan mendapat kembalian Rp1.000"
        },
        {
          question: "Bimo beli topi sekolah seharga Rp10.000. Bayar dengan 2 lembar Rp5.000. Kondisi ini disebut...",
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
          question: "Harga sebuah jeruk adalah Rp 2.000. Bimo beli 3 jeruk. Tapi uang Bimo cuma Rp5.000. Apa yang terjadi?",
          options: [
            "Uang pas",
            "Uang lebih Rp1.000",
            "Uang Bimo kurang Rp1.000",
            "Dapat diskon"
          ],
          correctAnswer: "Uang Bimo kurang Rp1.000"
        },
        {
          question: "Bimo beli 1 penggaris (Rp2.000), 1 pulpen (Rp3.000), 1 buku tulis (Rp5.000). Ia membayar dengan satu lembar uang Rp10.000. Apa kondisi uang Bimo?",
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
      
      // Interactive story-based activities (Text-only with narrative context)
      activities: [
        {
          id: "sharp_objects_electricity",
          contextStory: "Kamu baru saja bangun tidur dan sendirian di rumah. Kamu merasa lapar dan ingin pergi ke dapur, tetapi kamu harus tetap waspada terhadap benda-benda di sekitarmu.\n\nSaat berjalan ke dapur, kamu melihat tiga benda ini di atas meja dan dinding:\n\n1. Sebuah pisau tajam yang tergeletak di pinggir meja.\n\n2. Stop kontak dengan kabel yang sedikit terkelupas.\n\n 3. Kompor yang tidak sengaja tertinggal dalam keadaan menyala (api kecil).",
          instruction: "Apa yang harus kamu lakukan ketika melihat benda-benda berbahaya ini?",
          options: [
            { color: "red" as const, text: "Memegang ujung pisau" },
            { color: "blue" as const, text: "Mencolokkan jari ke stop kontak" },
            { color: "green" as const, text: "Diam dan jangan sentuh, cari orang dewasa" },
            { color: "yellow" as const, text: "Bermain api di kompor" }
          ],
          correctIndex: 2 // Diam dan jangan sentuh, cari orang dewasa
        },
        {
          id: "hot_water_slippery",
          contextStory: "Setelah itu kamu ingin membuat teh hangat. Namun, tiba-tiba kamu tersenggol gelas berisi air panas dan tumpahannya membuat lantai menjadi sangat licin.",
          instruction: "Lantai jadi basah dan licin. Apa yang kamu lakukan supaya tidak jatuh?",
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
          contextStory: "(Hebat! Kamu tidak jatuh karena kamu hati-hati. Tapi, saat kamu mau ambil gelas lain, tanganmu tidak sengaja terkena air panas di teko...)\n\n'Aduh!'\nTanganmu terasa panas dan merah karena kena air panas. Rasanya perih sekali. Kamu harus cepat-cepat menolong tanganmu.",
          instruction: "Tanganmu kena air panas dan terasa perih. Apa yang harus kamu lakukan sekarang?",
          options: [
            { color: "red" as const, text: "Oleskan odol/kecap" },
            { color: "blue" as const, text: "Basuh dengan air dingin yang mengalir" },
            { color: "green" as const, text: "Menangis di pojokan" },
            { color: "yellow" as const, text: "Bungkus dengan plastik" }
          ],
          correctIndex: 1 // Basuh dengan air dingin yang mengalir
        },
        {
          id: "unknown_medicine",
          contextStory: "(Wah, tanganmu jadi lebih nyaman karena air dingin! Sambil menunggu tanganmu sembuh, kamu melihat ada botol berisi obat warna-warni seperti permen di atas meja...)\n\nObat itu warnanya cantik sekali, merah dan hijau. Kamu merasa penasaran dan ingin memakan obat itu karena bentuknya lucu.",
          instruction: "Kamu melihat obat warna-warni seperti permen. Bolehkah dimakan?",
          options: [
            { color: "red" as const, text: "Boleh, telan banyak-banyak" },
            { color: "blue" as const, text: "Masukkan mulut lalu buang" },
            { color: "green" as const, text: "Berikan ke kucing" },
            { color: "yellow" as const, text: "Tidak boleh, tanya Ibu/Ayah dulu" }
          ],
          correctIndex: 3 // Tidak boleh, tanya Ibu/Ayah dulu
        },
        {
          id: "safety_summary",
          type: "info",
          contextStory: "Setelah berhasil melewati semua rintangan di dapur, sekarang kamu sudah tahu cara menjaga diri agar tetap aman.\n\nIngat Pesan Siaga Ini:\n• **Benda Tajam & Panas:** Cukup dilihat, jangan disentuh.\n• **Lantai Basah:** Berhenti dan minta bantuan untuk mengeringkannya.\n• **Air Panas:** Jika terkena, segera basuh dengan air dingin yang mengalir.\n• **Obat-obatan:** Selalu tanya Ibu atau Ayah sebelum memakan apapun yang bentuknya seperti permen.",
          instruction: "Kamu sekarang adalah Pahlawan Keselamatan! 🦸‍♂️",
          options: [
            { color: "green" as const, text: "Lanjut ke Kuis!" }
          ],
          correctIndex: 0
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
      
      closingText: "Ingat Pesan Siaga: \n\nBenda Tajam & Panas (Jangan sentuh), \n\nLantai Basah (Minta bantuan), \n\nAir Panas (Basuh air mengalir), \n\nObat (Tanya Orang Tua)."
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
          contextStory: "Petualangan Pergi ke Taman Kota\n\nHari ini cuaca sangat cerah! Kamu akan pergi ke taman kota bersama Ibu. Kamu merasa sangat senang dan sudah siap untuk berangkat.\nYuk, ikuti ceritanya dan bantu pilih jalan yang aman!\n\nKamu dan Ibu harus menyeberang jalan raya yang sangat ramai untuk sampai ke halte bus. Banyak mobil dan motor yang berjalan cepat. Di sana ada lampu lalu lintas dan garis-garis putih di jalan.",
          instruction: "Apa yang harus kamu lakukan supaya aman menyeberang jalan raya?",
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
          contextStory: "Hore! Kamu berhasil menyeberang dan sekarang busnya sudah datang. Kamu naik dan duduk di kursi dekat jendela. Perjalanan menuju taman akan dimulai.",
          instruction: "Supaya kamu tidak jatuh atau terluka saat bus berjalan, apa yang kamu lakukan?",
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
          contextStory: "Sampai di taman, kamu duduk sebentar di bangku karena Ibu sedang membuang sampah. Tiba-tiba, ada seorang bapak-bapak yang tidak kamu kenal datang. Ia tersenyum dan memberikan seplastik permen manis, lalu mengajakmu ikut ke mobilnya.",
          instruction: "Apa yang kamu lakukan?",
          options: [
            { color: "red" as const, text: "Makan permen dan ikut" },
            { color: "blue" as const, text: "Menangis diam saja" },
            { color: "green" as const, text: "Bilang 'TIDAK', jangan ambil, lari ke Ibu" },
            { color: "yellow" as const, text: "Memberitahu nama dan alamat rumah" }
          ],
          correctIndex: 2 // Bilang 'TIDAK', jangan ambil, lari ke Ibu
        },
        {
          id: "safe_play",
          type: "info",
          contextStory: "Wah, hebat! Karena kamu pintar memilih, sekarang kamu bisa bermain di taman dengan aman dan ceria bersama Ibu.",
          instruction: "Kamu resmi menjadi Pahlawan Keselamatan hari ini! 🌟🏆",
          options: [
            { color: "green" as const, text: "Lanjut ke Kuis!" }
          ],
          correctIndex: 0
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
      
      closingText: "Ingat Rahasia Anak Hebat:\n\n 🚦 Menyeberang di Zebra Cross \n\n🪑 Duduk tenang di kendaraan \n\n 🚫 Jangan terima makanan dari orang asing\n\nSelamat! \n\n Kamu adalah Pahlawan Keselamatan! 🌟🏆"
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Keselamatan di Luar",
      order: 2,
      content: module2Meeting2Content,
    } as any);

    console.log("✅ Created Meeting 2: Keselamatan di Luar (Interactive Story with Context Cards)");
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
          contextStory: "Petualangan Penyelamat Cilik\n\nHari ini adalah hari yang tenang, sampai tiba-tiba terjadi sesuatu yang mengejutkan! Kamu harus menjadi anak yang sigap dan berani untuk menolong. Yuk, ikuti ceritanya!\n\nSaat sedang berjalan, kamu melihat ada asap keluar dari tumpukan kertas di pojok ruangan. Ada api kecil yang mulai menyala. Kamu tahu api itu bisa berbahaya jika menjadi besar.",
          instruction: "Apa yang harus kamu lakukan?",
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
          contextStory: "Ibu sudah datang, tapi Ibu perlu menelepon bantuan dari luar menggunakan HP. Kamu ingat ada nomor khusus yang bisa dihubungi saat ada bahaya atau kejadian darurat.",
          instruction: "Nomor mana yang harus dihubungi?",
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
          contextStory: "Langkah 3: Menolong Teman yang Terluka\n\nSetelah api padam, kamu melihat temanmu terjatuh saat lari menjauh tadi. Kakinya sakit, berdarah, dan dia menangis sedih. Temanmu butuh bantuan secepatnya.",
          instruction: "Apa yang kamu lakukan untuk menolongnya?",
          imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=300",
          options: [
            { color: "red" as const, text: "Ikut menangis di lantai" },
            { color: "blue" as const, text: "Marah menyuruh diam" },
            { color: "green" as const, text: "Tenang, temani, & panggil bantuan" },
            { color: "yellow" as const, text: "Biarkan saja" }
          ],
          correctIndex: 2 // Tenang, temani, & panggil bantuan
        },
        {
          id: "completion_celebration",
          type: "info",
          contextStory: "Hore! Tugasmu Selesai!\n\nWah, kamu hebat sekali hari ini! Kamu sudah belajar menjadi penolong:\n\n• **Paham Bahaya:** Berteriak dan cari bantuan jika ada api.\n• **Hafal Nomor:** Tahu nomor darurat 112 atau 110.\n• **Sayang Teman:** Segera mencari bantuan jika ada teman yang terluka.\n\nSelamat! Kamu adalah Anak Hebat yang Bisa Diandalkan! 🌟🥇",
          instruction: "Kamu siap menghadapi kuis?",
          options: [
            { color: "green" as const, text: "Lanjut ke Kuis!" }
          ],
          correctIndex: 0
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
      
      closingText: "Selamat! 🎉\n\nKamu telah menyelesaikan semua tantangan dengan baik!\n\nKamu tahu cara:\n✅ Merespons bahaya dengan cepat\n✅ Menghubungi nomor darurat\n✅ Menolong teman yang membutuhkan\n\nKamu benar-benar Pahlawan Penyelamat Cilik! 🌟🥇"
    };

    await db.insert(meetings).values({
      moduleId: module2.id,
      title: "Tanggap Darurat",
      order: 3,
      content: module2Meeting3Content,
    } as any);

    console.log("✅ Created Meeting 3: Tanggap Darurat (Interactive Story with Context Cards)");
    console.log(`   → Module ID: ${module2.id}, Meeting Order: 3`);

    // 6d. Create Meeting 4: Simulasi Situasi Darurat (Long Story + Quiz)
    const module2Meeting4Content = {
      openingText: "Hari ini kita akan belajar cara menghadapi gempa bumi melalui cerita petualangan Saat Bumi Bergoyang. Yuk, ikuti ceritanya!",
      
      // Story that displays before activities (scrollable)
      storyTitle: "Saat Bumi Bergoyang",
      story: `Pagi itu, kamu sedang asyik mewarnai gambar di meja belajar. Tiba-tiba, kamu merasakan meja mulai bergetar. "Duk... duk... duk..." Suaranya terdengar dari lantai. Kamu melihat air di dalam gelasmu bergoyang-goyang sendiri. Ternyata, sedang terjadi gempa bumi!
\n\n Ingat, kamu adalah anak yang tenang dan hebat. Hal pertama yang kamu lakukan adalah merunduk. Kamu segera masuk ke bawah meja belajarmu yang kuat. Di sana, kamu memegang kaki meja dengan erat dan menggunakan tanganmu untuk melindungi kepala agar tidak terkena benda jatuh. Kamu diam di sana dan tetap tenang sampai getarannya benar-benar hilang.
\n\n Setelah getarannya berhenti, kamu melihat jendela kaca di dekatmu. Kamu tahu bahwa kaca bisa pecah dan berbahaya, jadi kamu segera menjauh dari jendela dan lemari kaca. Kamu berjalan pelan menuju pintu keluar sambil tetap melindungi kepala dengan tas atau bantal yang ada di dekatmu.
\n\n Begitu sampai di luar rumah, kamu tidak berlari ke bawah pohon besar atau dekat tiang listrik. Kamu berjalan bersama Ibu menuju lapangan yang luas dan terbuka. Di lapangan itu tidak ada tembok atau bangunan yang bisa jatuh. Kamu duduk di sana bersama teman-teman yang lain sambil menunggu keadaan benar-benar aman.
\n\n Karena kamu tidak panik dan tahu cara melindungi diri, kamu berhasil menjaga dirimu tetap selamat. Ibu tersenyum bangga dan memelukmu. Kamu memang pahlawan keselamatan yang hebat!
`,
      
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
          question: "It is 7:00 AM and you just arrived at school. You see your teacher in the hallway. What should you say?",
          options: [
            "Good night, Teacher",
            "Good morning, Teacher",
            "Good bye, Teacher",
            "Good afternoon, Teacher"
          ],
          correctAnswer: "Good morning, Teacher"
        },
        {
          question: "You are talking to a new student. You want to know their name for the first time. What is the correct question?",
          options: [
            "How are you?",
            "Where are you from?",
            "What's your name?",
            "How old are you?"
          ],
          correctAnswer: "What's your name?"
        },
        {
          question: "Someone asks you, \"What's your name?\". If your name is Sarah, how do you respond correctly?",
          options: [
            "I am fine",
            "Nice to meet you",
            "My name is Sarah",
            "How are you?"
          ],
          correctAnswer: "My name is Sarah"
        },
        {
          question: "After introducing yourself, you want to be polite and ask the other person how they are feeling today. You say:",
          options: [
            "What is your name?",
            "Where are you?",
            "Who are you?",
            "How are you?"
          ],
          correctAnswer: "How are you?"
        },
        {
          question: "Your friend asks you, \"How are you\?\". You feel good and want to thank them for asking. What is the best response?",
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
          imageUrl: "/assets/body-parts-diagram.png",
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
          instruction: "Draw lines to match the words with the correct pictures!",
          pairs: [
            { id: "p1", leftText: "Circle / Lingkaran", rightImage: "/assets/shapes/circle.png" },
            { id: "p2", leftText: "Triangle / Segitiga", rightImage: "/assets/shapes/triangle.png" },
            { id: "p3", leftText: "Square / Persegi", rightImage: "/assets/shapes/square.png" },
            { id: "p4", leftText: "Red / Merah", rightImage: "/assets/colors/red-apple.png" },
            { id: "p5", leftText: "Blue / Biru", rightImage: "/assets/colors/blue-sky.png" },
            { id: "p6", leftText: "Black / Hitam", rightImage: "/assets/colors/black-stone.png" }
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

    // 7d. Create Meeting 4: Binatang dan Suaranya (Animal Mimic Activity)
    const module3Meeting4Content = {
      openingText: "Hari ini kita akan belajar suara binatang dalam Bahasa Inggris. Mari kita tiru suara mereka!",
      
      videos: [
        {
          url: "https://youtu.be/efiWeJbdbxk",
          title: "Animal Sounds Song",
          interactions: []
        }
      ],
      
      // Animal Mimic Activity
      activities: [
        {
          id: "animal_sounds",
          type: "animal_mimic",
          imageUrl: "/assets/animals-meadow.png",
          introAudio: "Make the sound of this animal based on your thoughts!",
          animals: [
            {
              name: "Cow",
              zone: {
                top: "20%",
                left: "10%",
                width: "20%",
                height: "20%"
              },
              soundUrl: "/sounds/cow.mp3"
            },
            {
              name: "Sheep",
              zone: {
                top: "50%",
                left: "20%",
                width: "15%",
                height: "15%"
              },
              soundUrl: "/sounds/sheep.mp3"
            },
            {
              name: "Duck",
              zone: {
                top: "70%",
                left: "60%",
                width: "10%",
                height: "10%"
              },
              soundUrl: "/sounds/duck.mp3"
            },
            {
              name: "Rooster",
              zone: {
                top: "10%",
                left: "70%",
                width: "15%",
                height: "15%"
              },
              soundUrl: "/sounds/rooster.mp3"
            },
            {
              name: "Dog",
              zone: {
                top: "40%",
                left: "80%",
                width: "15%",
                height: "15%"
              },
              soundUrl: "/sounds/dog.mp3"
            }
          ],
          closingAudio: "You sound just like a real animal choir!"
        }
      ],
      
      quiz_story: "The Concert in Musical Meadow\n\nAfter their picnic, Chromy and Shapey walked into the Musical Meadow, a place where animals lived in harmony and made beautiful sounds together.\n\nAs they entered, they heard a deep, gentle voice. \"MOOOO!\" It was Barnaby the Cow, standing under a big oak tree. \"That's how cows greet everyone,\" said Chromy with a smile. Barnaby was the leader of the meadow, always calm and kind.\n\nNext, they met Shirley the Sheep, who was grazing on the soft green grass. \"BAA! BAA!\" she called out happily. \"Sheep say 'baa' when they're happy,\" explained Shapey. Shirley's wool was fluffy and white, like a soft cloud.\n\nNear the pond, they spotted a little duck swimming gracefully. \"QUACK! QUACK!\" the duck said cheerfully. \"Ducks love to talk by the water,\" Chromy giggled. The duck splashed around, making everyone laugh.\n\nSuddenly, from the top of the fence, came a loud and proud sound: \"COCK-A-DOODLE-DOO!\" It was Rudy the Rooster, announcing that it was time for the concert. \"Roosters love to make noise in the morning and all day long!\" said Shapey.\n\nFinally, a friendly dog came running up to them, wagging his tail. \"WOOF! WOOF!\" he barked excitedly. \"Dogs say 'woof' when they want to play!\" said Chromy, petting the dog's soft fur.\n\nAll the animals gathered in a circle and decided to sing together. Barnaby mooed, Shirley baaed, the duck quacked, Rudy crowed, and the dog barked. Chromy and Shapey clapped and danced along.\n\n\"This is the best concert ever!\" shouted Chromy.\n\"Every animal has its own special sound!\" added Shapey.\n\nFrom that day on, Chromy, Shapey, and all their animal friends performed together in the Musical Meadow. It was the loudest, happiest day ever!",
      
      quiz: [
        {
          question: "What sound does Barnaby the Cow make?",
          imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=300",
          options: [
            "Baa",
            "Moo",
            "Woof",
            "Quack"
          ],
          correctAnswer: "Moo"
        },
        {
          question: "How does Shirley the Sheep say hello?",
          imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300",
          options: [
            "Baa",
            "Moo",
            "Quack",
            "Woof"
          ],
          correctAnswer: "Baa"
        },
        {
          question: "What sound does the duck make in the pond?",
          imageUrl: "https://images.unsplash.com/photo-1551376347-075b0121a65b?w=300",
          options: [
            "Moo",
            "Woof",
            "Quack",
            "Baa"
          ],
          correctAnswer: "Quack"
        },
        {
          question: "What does Rudy the Rooster cry out?",
          imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300",
          options: [
            "Cock-a-doodle-doo",
            "Baa",
            "Quack",
            "Moo"
          ],
          correctAnswer: "Cock-a-doodle-doo"
        },
        {
          question: "What sound does the friendly dog make?",
          imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300",
          options: [
            "Quack",
            "Moo",
            "Woof",
            "Baa"
          ],
          correctAnswer: "Woof"
        }
      ],
      
      closingText: "Luar biasa! Kamu sudah tahu suara semua binatang dalam Bahasa Inggris!"
    };

    await db.insert(meetings).values({
      moduleId: module3.id,
      title: "Binatang dan Suaranya",
      order: 4,
      content: module3Meeting4Content,
    } as any);

    console.log("✅ Created Meeting 4: Binatang dan Suaranya (Animal Mimic)");
    console.log(`   → Module ID: ${module3.id}, Meeting Order: 4`);

    // 8. Create Module 4: Bahasa Indonesia & Literasi
    const [module4] = await db.insert(modules).values({
      title: "Bahasa Indonesia & Literasi",
      category: "Literacy",
      description: "Belajar membaca dan menulis dengan baik",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      order: 4,
    } as InsertModule).returning();

    console.log("✅ Created Module:", module4.title);

    // 8a. Create Meeting 1: Huruf (Alphabet Race Activity)
    const module4Meeting1Content = {
      openingText: "Hari ini kita akan belajar huruf alfabet dalam Bahasa Indonesia. Bersiaplah untuk menguji kecepatan membacamu!",
      
      videos: [
        {
          url: "https://youtu.be/mEFviLxPegs",
          title: "Lagu Huruf Alfabet",
          interactions: []
        }
      ],
      
      // Alphabet Race Activity
      activities: [
        {
          id: "alphabet_race",
          type: "alphabet_race",
          letters: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
          modes: [
            { label: "Percobaan 1 (Santai)", duration: 20 },
            { label: "Percobaan 2 (Cepat)", duration: 10 }
          ]
        }
      ],
      
      quiz: [
        {
          question: "Manakah kelompok huruf vokal?",
          context_text: "Dalam alfabet bahasa Indonesia, huruf vokal adalah huruf yang melambangkan fonem tanpa hambatan. Huruf-huruf ini menjadi inti suku kata.",
          options: [
            "A, I, U, E, O",
            "B, C, D, F, G",
            "K, L, M, N, P",
            "R, S, T, V, W"
          ],
          correctAnswer: "A, I, U, E, O"
        },
        {
          question: "Dari kata 'BELAJAR', manakah huruf konsonan?",
          context_text: "Huruf konsonan adalah huruf yang bunyinya dihasilkan dengan menghambat aliran udara. Terdapat 21 huruf konsonan.",
          options: [
            "E, A, A",
            "B, L, J, R",
            "A, I, U",
            "E, O, I"
          ],
          correctAnswer: "B, L, J, R"
        },
        {
          question: "Kata manakah yang mengandung gabungan konsonan?",
          context_text: "Terdapat gabungan huruf konsonan yang melambangkan satu bunyi khusus, seperti kh, ng, ny, dan sy.",
          options: [
            "Bola",
            "Nyanyi",
            "Meja",
            "Roti"
          ],
          correctAnswer: "Nyanyi"
        },
        {
          question: "Kata manakah yang memiliki diftong?",
          context_text: "Diftong adalah gabungan dua huruf vokal dalam satu embusan napas, seperti ai, au, oi, dan ei.",
          options: [
            "Buku",
            "Meja",
            "Pantai",
            "Rumah"
          ],
          correctAnswer: "Pantai"
        },
        {
          question: "Struktur suku kata pertama (KAM) pada kata 'KAMPUS' adalah?",
          context_text: "Struktur suku kata sering mengikuti pola K-V (Konsonan-Vokal) atau K-V-K (Konsonan-Vokal-Konsonan).",
          options: [
            "Konsonan - Konsonan - Vokal",
            "Vokal - Konsonan - Konsonan",
            "Konsonan - Vokal - Konsonan",
            "Vokal - Vokal - Konsonan"
          ],
          correctAnswer: "Konsonan - Vokal - Konsonan"
        }
      ],
      
      closingText: "Luar biasa! Kamu sudah mengenal huruf alfabet dengan baik!"
    };

    await db.insert(meetings).values({
      moduleId: module4.id,
      title: "Huruf",
      order: 1,
      content: module4Meeting1Content,
    } as any);

    console.log("✅ Created Meeting 1: Huruf (Alphabet Race)");
    console.log(`   → Module ID: ${module4.id}, Meeting Order: 1`);

    // 8b. Create Meeting 2: Kata Sederhana dan Gambar (Reading Race Activity)
    const module4Meeting2Content = {
      openingText: "Hari ini kita akan berlatih membaca kata-kata sederhana. Bersiaplah untuk menguji kecepatan membacamu!",
      
      videos: [
        {
          url: "https://youtu.be/lt-hAsZ4bBE",
          title: "Kata Sederhana - Video 1",
          interactions: []
        },
        {
          url: "https://youtu.be/ipmcPCLnRTY",
          title: "Kata Sederhana - Video 2",
          interactions: []
        }
      ],
      
      // Reading Race Activity
      activities: [
        {
          id: "reading_race",
          type: "reading_race",
          sentences: [
            "1. Di sebuah sudut kota yang tersembunyi, terdapat sebuah toko buku tua yang konon hanya bisa ditemukan oleh orang-orang yang sedang merasa tersesat.",
            "2. Proses kimia di dalam baterai litium-ion bekerja dengan memindahkan ion litium dari anoda ke katoda melalui larutan elektrolit.",
            "3. Kucing oranye itu terlihat sangat percaya diri saat berjalan di atas pagar kayu, seolah-olah ia adalah penguasa tunggal di lingkungan tersebut.",
            "4. Robot penjelajah di Mars mengirimkan data sensorik tentang komposisi tanah yang mengandung mineral oksida besi yang sangat tinggi.",
            "5. Aroma kopi hitam yang baru diseduh di pagi hari selalu berhasil membangunkan semangat seseorang untuk menghadapi kemacetan kota."
          ],
          stages: [
            { label: "Percobaan 1 (Santai)", duration: 120 },
            { label: "Percobaan 2 (Cepat)", duration: 60 }
          ]
        }
      ],
      
      quiz: [
        {
          question: "Apa yang dipakai Rani saat mandi?",
          context_text: "Rani sedang mandi. Rani memakai sabun agar bersih.",
          options: [
            "Sabun",
            "Sisir",
            "Baju",
            "Topi"
          ],
          correctAnswer: "Sabun"
        },
        {
          question: "Di mana Adit bermain bola?",
          context_text: "Adit suka bermain bola. Adit bermain di lapangan.",
          options: [
            "Di rumah",
            "Di lapangan",
            "Di sekolah",
            "Di taman"
          ],
          correctAnswer: "Di lapangan"
        },
        {
          question: "Apa yang digoreng oleh Ibu?",
          context_text: "Ibu menggoreng telur. Ibu memasak di dapur.",
          options: [
            "Ikan",
            "Telur",
            "Ayam",
            "Sayur"
          ],
          correctAnswer: "Telur"
        },
        {
          question: "Apa warna topi Budi?",
          context_text: "Budi memakai topi. Topi Budi berwarna biru.",
          options: [
            "Merah",
            "Kuning",
            "Hijau",
            "Biru"
          ],
          correctAnswer: "Biru"
        },
        {
          question: "Naik apa Iwan pulang sekolah?",
          context_text: "Iwan pulang sekolah naik sepeda. Sepeda Iwan ada dua roda.",
          options: [
            "Mobil",
            "Motor",
            "Sepeda",
            "Bus"
          ],
          correctAnswer: "Sepeda"
        }
      ],
      
      closingText: "Luar biasa! Kamu sudah bisa membaca dengan baik!"
    };

    await db.insert(meetings).values({
      moduleId: module4.id,
      title: "Kata Sederhana dan Gambar",
      order: 2,
      content: module4Meeting2Content,
    } as any);

    console.log("✅ Created Meeting 2: Kata Sederhana dan Gambar (Reading Race)");
    console.log(`   → Module ID: ${module4.id}, Meeting Order: 2`);

    // 8c. Create Meeting 3: Memahami Teks (Reading Comprehension with Side-by-Side Layout)
    const module4Meeting3Content = {
      openingText: "Hari ini kita akan berlatih memahami teks bacaan. Mari kita mulai!",
      
      // No videos - straight to quiz
      videos: [],
      
      // No activities - straight to quiz
      activities: [],
      
      // Reading Comprehension Quiz with Two Stories
      quiz: [
        // Questions 1-6: Story A (Warisan di Kaki Gunung Merapi)
        {
          question: "Apa tema utama dari narasi ini?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Pentingnya teknologi modern untuk mengatasi banjir",
            "Ketekunan seseorang dalam menjaga lingkungan untuk generasi masa depan",
            "Kisah persaingan antarwarga desa",
            "Keuntungan ekonomi dari menanam pohon"
          ],
          correctAnswer: "Ketekunan seseorang dalam menjaga lingkungan untuk generasi masa depan"
        },
        {
          question: "Mengapa sebagian penduduk desa mencibir usaha Pak Aris?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Karena mereka tidak suka Pak Aris",
            "Karena menanam pohon adalah pekerjaan yang mudah",
            "Karena manfaat dari usaha tersebut tidak dirasakan secara instan",
            "Karena pohon-pohon yang ditanam selalu mati"
          ],
          correctAnswer: "Karena manfaat dari usaha tersebut tidak dirasakan secara instan"
        },
        {
          question: "Apa makna dari frasa \"melanjutkan estafet sang kakek\" dalam konteks narasi?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Mengikuti jejak kakek dalam berjualan pohon",
            "Mengambil alih tanggung jawab perusahaan kakek",
            "Meneruskan tanggung jawab menjaga lingkungan yang sudah dimulai kakek",
            "Membangun rumah di atas lahan yang ditanami kakek"
          ],
          correctAnswer: "Meneruskan tanggung jawab menjaga lingkungan yang sudah dimulai kakek"
        },
        {
          question: "Apa fungsi utama dari hutan yang ditanam Pak Aris berdasarkan narasi?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Sebagai tempat wisata untuk mendatangkan uang",
            "Sebagai sumber kayu untuk dijual",
            "Sebagai spons alami untuk menyerap air dan mencegah bencana",
            "Sebagai penghalang antara desa dengan desa lain"
          ],
          correctAnswer: "Sebagai spons alami untuk menyerap air dan mencegah bencana"
        },
        {
          question: "Bagaimana karakter Aris muda dapat digambarkan berdasarkan tindakannya?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Egois dan hanya memikirkan diri sendiri",
            "Menghargai sejarah dan bertanggung jawab terhadap lingkungan",
            "Malas dan tidak peduli dengan lingkungan",
            "Hanya ingin terlihat baik di depan kakeknya"
          ],
          correctAnswer: "Menghargai sejarah dan bertanggung jawab terhadap lingkungan"
        },
        {
          question: "Apa amanat atau pesan moral yang dapat diambil dari narasi ini?",
          context_text: "Di sebuah desa terpencil di kaki pegunungan, hiduplah seorang kakek bernama Pak Aris. Selama empat puluh tahun, ia secara rutin mendaki lereng bukit untuk menanam bibit pohon di lahan gundul bekas pembalakan liar. Penduduk desa awalnya mencibir, menganggap usahanya sia-sia karena dampaknya tidak langsung terlihat. \"Untuk apa menanam pohon yang baru akan besar saat kamu sudah tiada?\" ujar salah satu warga kala itu\
\n\n Namun, waktu membuktikan segalanya. Kini, saat musim kemarau panjang melanda dan desa-desa tetangga mengalami kekeringan hebat hingga harus mengantre air bersih, desa Pak Aris menjadi satu-satunya wilayah yang memiliki mata air melimpah. Hutan yang ia tanam telah menjadi spons raksasa yang menyimpan cadangan air bagi seluruh warga. \n\n Keberhasilan Pak Aris akhirnya mengubah cara pandang generasi muda. Kini, mereka membentuk komunitas bernama \"Penjaga Hijau\" untuk melanjutkan estafet pelestarian hutan tersebut. Mereka sadar bahwa di dunia yang kian panas ini, warisan terbaik bukanlah tumpukan harta, melainkan ekosistem yang sehat. Di sisi lain, Aris muda—cucu sang kakek—menemukan sebuah peta usang di perpustakaan tua milik kakeknya. Peta itu bukan menunjukkan lokasi emas, melainkan titik-titik koordinat sumur resapan kuno yang telah terlupakan, yang jika diaktifkan kembali, bisa menyelamatkan kota dari krisis air yang lebih luas.",
          options: [
            "Uang adalah segalanya dalam hidup",
            "Mencari keuntungan jangka pendek lebih penting",
            "Kerja keras dan tanggung jawab terhadap lingkungan akan memberikan manfaat jangka panjang",
            "Mengabaikan pendapat orang lain adalah hal yang buruk"
          ],
          correctAnswer: "Kerja keras dan tanggung jawab terhadap lingkungan akan memberikan manfaat jangka panjang"
        },
        // Questions 7-10: Story B (Gema di Balik Graha Pustaka)
        {
          question: "Apa konflik utama dalam narasi ini?",
          context_text: "Di jantung kota yang bising, berdiri sebuah gedung tua bernama Graha Pustaka. Bangunan itu tampak rapuh dengan cat yang mengelupas dan jendela yang mulai retak. Selama bertahun-tahun, gedung itu terabaikan hingga muncul rencana pemerintah kota untuk meruntuhkannya guna membangun sebuah pusat perbelanjaan (mal) modern yang megah. Mayoritas warga kota bersikap tak acuh; bagi mereka, gedung itu hanyalah sarang debu yang merusak estetika kota. \n\n Namun, bagi sekelompok mahasiswa sejarah yang dipimpin oleh Laras, Graha Pustaka bukan sekadar tumpukan batu bata. Berdasarkan dokumen yang mereka temukan, gedung itu adalah tempat ditandatanganinya sebuah perjanjian perdamaian rahasia pasca-perang yang menentukan garis batas wilayah negara mereka di masa lampau. Tanpa gedung itu, bukti fisik dari diplomasi yang menyelamatkan ribuan nyawa tersebut akan hilang selamanya. \n\n Mereka pun memulai kampanye digital dengan tagar #SaksiBisu. Laras dan teman-temannya mengunggah foto-foto arsip hitam-putih, surat-surat lama, dan narasi heroik tentang apa yang terjadi di balik dinding gedung tersebut puluhan tahun silam. Dalam waktu singkat, opini publik mulai bergeser. Masyarakat yang awalnya mendukung modernisasi kini mulai merasa memiliki keterikatan emosional dengan gedung itu. Narasi di media sosial berubah dari sekadar menyelamatkan bangunan tua menjadi gerakan mempertahankan \"identitas bangsa\". Pemerintah kota yang awalnya bersikeras melakukan pembongkaran kini mulai goyah dan mempertimbangkan kembali rencana pembangunan mal tersebut setelah melihat gelombang protes dan dukungan publik yang kian masif",
          options: [
            "Persaingan antarwarga untuk menguasai gedung",
            "Dilema antara mempertahankan identitas sejarah dan pembangunan ekonomi",
            "Konflik antara mahasiswa dan dosen",
            "Masalah keuangan dalam renovasi gedung"
          ],
          correctAnswer: "Dilema antara mempertahankan identitas sejarah dan pembangunan ekonomi"
        },
        {
          question: "Mengapa kampanye #SaksiBisu berhasil menarik perhatian publik?",
          context_text: "Di jantung kota yang bising, berdiri sebuah gedung tua bernama Graha Pustaka. Bangunan itu tampak rapuh dengan cat yang mengelupas dan jendela yang mulai retak. Selama bertahun-tahun, gedung itu terabaikan hingga muncul rencana pemerintah kota untuk meruntuhkannya guna membangun sebuah pusat perbelanjaan (mal) modern yang megah. Mayoritas warga kota bersikap tak acuh; bagi mereka, gedung itu hanyalah sarang debu yang merusak estetika kota. \n\n Namun, bagi sekelompok mahasiswa sejarah yang dipimpin oleh Laras, Graha Pustaka bukan sekadar tumpukan batu bata. Berdasarkan dokumen yang mereka temukan, gedung itu adalah tempat ditandatanganinya sebuah perjanjian perdamaian rahasia pasca-perang yang menentukan garis batas wilayah negara mereka di masa lampau. Tanpa gedung itu, bukti fisik dari diplomasi yang menyelamatkan ribuan nyawa tersebut akan hilang selamanya. \n\n Mereka pun memulai kampanye digital dengan tagar #SaksiBisu. Laras dan teman-temannya mengunggah foto-foto arsip hitam-putih, surat-surat lama, dan narasi heroik tentang apa yang terjadi di balik dinding gedung tersebut puluhan tahun silam. Dalam waktu singkat, opini publik mulai bergeser. Masyarakat yang awalnya mendukung modernisasi kini mulai merasa memiliki keterikatan emosional dengan gedung itu. Narasi di media sosial berubah dari sekadar menyelamatkan bangunan tua menjadi gerakan mempertahankan \"identitas bangsa\". Pemerintah kota yang awalnya bersikeras melakukan pembongkaran kini mulai goyah dan mempertimbangkan kembali rencana pembangunan mal tersebut setelah melihat gelombang protes dan dukungan publik yang kian masif",
          options: [
            "Karena menggunakan teknologi terbaru",
            "Karena melibatkan selebriti terkenal",
            "Karena berhasil menghubungkan nilai emosional dan bukti historis",
            "Karena memberikan hadiah kepada pendukung"
          ],
          correctAnswer: "Karena berhasil menghubungkan nilai emosional dan bukti historis"
        },
        {
          question: "Apa makna dari frasa \"Saksi Bisu\" dalam konteks narasi?",
          context_text: "Di jantung kota yang bising, berdiri sebuah gedung tua bernama Graha Pustaka. Bangunan itu tampak rapuh dengan cat yang mengelupas dan jendela yang mulai retak. Selama bertahun-tahun, gedung itu terabaikan hingga muncul rencana pemerintah kota untuk meruntuhkannya guna membangun sebuah pusat perbelanjaan (mal) modern yang megah. Mayoritas warga kota bersikap tak acuh; bagi mereka, gedung itu hanyalah sarang debu yang merusak estetika kota. \n\n Namun, bagi sekelompok mahasiswa sejarah yang dipimpin oleh Laras, Graha Pustaka bukan sekadar tumpukan batu bata. Berdasarkan dokumen yang mereka temukan, gedung itu adalah tempat ditandatanganinya sebuah perjanjian perdamaian rahasia pasca-perang yang menentukan garis batas wilayah negara mereka di masa lampau. Tanpa gedung itu, bukti fisik dari diplomasi yang menyelamatkan ribuan nyawa tersebut akan hilang selamanya. \n\n Mereka pun memulai kampanye digital dengan tagar #SaksiBisu. Laras dan teman-temannya mengunggah foto-foto arsip hitam-putih, surat-surat lama, dan narasi heroik tentang apa yang terjadi di balik dinding gedung tersebut puluhan tahun silam. Dalam waktu singkat, opini publik mulai bergeser. Masyarakat yang awalnya mendukung modernisasi kini mulai merasa memiliki keterikatan emosional dengan gedung itu. Narasi di media sosial berubah dari sekadar menyelamatkan bangunan tua menjadi gerakan mempertahankan \"identitas bangsa\". Pemerintah kota yang awalnya bersikeras melakukan pembongkaran kini mulai goyah dan mempertimbangkan kembali rencana pembangunan mal tersebut setelah melihat gelombang protes dan dukungan publik yang kian masif",
          options: [
            "Gedung yang tidak berbunyi saat dimasuki",
            "Bukti nyata dari peristiwa sejarah yang tidak bisa berbicara namun tetap bermakna",
            "Perpustakaan yang tidak memiliki pengunjung",
            "Bangunan yang tidak berguna lagi"
          ],
          correctAnswer: "Bukti nyata dari peristiwa sejarah yang tidak bisa berbicara namun tetap bermakna"
        },
        {
          question: "Apa konsekuensi dari sikap tanggap pemerintah terhadap dukungan publik?",
          context_text: "Di jantung kota yang bising, berdiri sebuah gedung tua bernama Graha Pustaka. Bangunan itu tampak rapuh dengan cat yang mengelupas dan jendela yang mulai retak. Selama bertahun-tahun, gedung itu terabaikan hingga muncul rencana pemerintah kota untuk meruntuhkannya guna membangun sebuah pusat perbelanjaan (mal) modern yang megah. Mayoritas warga kota bersikap tak acuh; bagi mereka, gedung itu hanyalah sarang debu yang merusak estetika kota. \n\n Namun, bagi sekelompok mahasiswa sejarah yang dipimpin oleh Laras, Graha Pustaka bukan sekadar tumpukan batu bata. Berdasarkan dokumen yang mereka temukan, gedung itu adalah tempat ditandatanganinya sebuah perjanjian perdamaian rahasia pasca-perang yang menentukan garis batas wilayah negara mereka di masa lampau. Tanpa gedung itu, bukti fisik dari diplomasi yang menyelamatkan ribuan nyawa tersebut akan hilang selamanya. \n\n Mereka pun memulai kampanye digital dengan tagar #SaksiBisu. Laras dan teman-temannya mengunggah foto-foto arsip hitam-putih, surat-surat lama, dan narasi heroik tentang apa yang terjadi di balik dinding gedung tersebut puluhan tahun silam. Dalam waktu singkat, opini publik mulai bergeser. Masyarakat yang awalnya mendukung modernisasi kini mulai merasa memiliki keterikatan emosional dengan gedung itu. Narasi di media sosial berubah dari sekadar menyelamatkan bangunan tua menjadi gerakan mempertahankan \"identitas bangsa\". Pemerintah kota yang awalnya bersikeras melakukan pembongkaran kini mulai goyah dan mempertimbangkan kembali rencana pembangunan mal tersebut setelah melihat gelombang protes dan dukungan publik yang kian masif",
          options: [
            "Gedung tetap dirobohkan",
            "Rencana pembongkaran dibatalkan dan gedung direnovasi menjadi museum",
            "Pemerintah mengabaikan dukungan publik",
            "Gedung dijual kepada investor asing"
          ],
          correctAnswer: "Rencana pembongkaran dibatalkan dan gedung direnovasi menjadi museum"
        }
      ],
      
      closingText: "Luar biasa! Kamu sudah bisa memahami teks dengan baik!"
    };

    await db.insert(meetings).values({
      moduleId: module4.id,
      title: "Memahami Teks",
      order: 3,
      content: module4Meeting3Content,
    } as any);

    console.log("✅ Created Meeting 3: Memahami Teks (Reading Comprehension)");
    console.log(`   → Module ID: ${module4.id}, Meeting Order: 3`);

    // 8d. Create Meeting 4: Memahami Lebih Dalam (Advanced Reading Comprehension with Top-Bottom Layout)
    const module4Meeting4Content = {
      openingText: "Hari ini kita akan mendalami pemahaman teks tingkat lanjut. Mari kita mulai!",
      
      // No videos - straight to quiz
      videos: [],
      
      // No activities - straight to quiz
      activities: [],
      
      // Advanced Reading Comprehension Quiz with 10 different contexts
      quiz: [
        {
          question: "Apa dampak utama dari fenomena coral bleaching terhadap ekosistem laut?",
          context_text: "Terumbu karang sering disebut sebagai 'hutan hujan lautan' karena keragaman hayati yang luar biasa tinggi. Namun, fenomena coral bleaching (pemutihan karang) yang disebabkan oleh kenaikan suhu air laut akibat perubahan iklim telah mengancam keberadaan ekosistem ini. Ketika suhu air meningkat, karang mengeluarkan zooxanthellae—alga mikroskopis yang hidup bersimbiosis dengannya—sehingga karang kehilangan warna dan sumber nutrisi utama. Tanpa zooxanthellae, karang menjadi rapuh dan rentan terhadap penyakit. Jika kondisi ini berlangsung lama, karang akan mati dan ekosistem yang bergantung padanya—termasuk ribuan spesies ikan, moluska, dan krustasea—akan kehilangan habitat.",
          options: [
            "Meningkatnya populasi ikan di sekitar terumbu karang",
            "Terbentuknya pulau karang baru di lautan",
            "Penurunan daya tahan karang dan hilangnya habitat bagi ribuan spesies laut",
            "Perubahan warna karang menjadi lebih cerah dan menarik"
          ],
          correctAnswer: "Penurunan daya tahan karang dan hilangnya habitat bagi ribuan spesies laut"
        },
        {
          question: "Apa inti dari perdebatan mengenai karya seni yang dibuat oleh Kecerdasan Buatan (AI)?",
          context_text: "Kecerdasan Buatan (AI) kini mampu menciptakan karya seni—mulai dari lukisan digital, musik, hingga puisi—dengan kualitas yang menyaingi karya manusia. Namun, muncul perdebatan filosofis: Apakah karya yang dihasilkan AI dapat dianggap sebagai 'seni sejati'? Sebagian berpendapat bahwa seni memerlukan intensi, emosi, dan pengalaman hidup yang hanya dimiliki manusia. Sementara itu, kelompok lain berargumen bahwa seni adalah tentang hasil akhir dan dampak estetis, bukan siapa atau apa yang menciptakannya. Di sisi hukum, pertanyaan tentang kepemilikan hak cipta juga menjadi isu hangat: Siapa yang berhak atas karya AI—programmer, pengguna, atau AI itu sendiri?",
          options: [
            "Apakah AI dapat menggantikan semua seniman manusia",
            "Penentuan kepemilikan hak cipta dan definisi 'seni sejati'",
            "Bagaimana cara meningkatkan kualitas karya AI",
            "Apakah AI dapat memahami emosi manusia"
          ],
          correctAnswer: "Penentuan kepemilikan hak cipta dan definisi 'seni sejati'"
        },
        {
          question: "Mengapa garam dianggap sangat berharga di masa lalu?",
          context_text: "Dahulu, garam adalah komoditas yang sangat berharga—bahkan digunakan sebagai alat tukar dan upah (dari sinilah istilah 'salary' berasal, dari kata Latin 'salarium' yang berarti 'uang garam'). Nilai tinggi garam bukan hanya karena kelangkaannya di daerah-daerah tertentu, tetapi juga karena fungsinya yang vital dalam mengawetkan makanan sebelum era refrigerasi modern. Di zaman tanpa kulkas, garam adalah satu-satunya cara efektif untuk mencegah pembusukan daging dan ikan, sehingga memungkinkan penyimpanan jangka panjang dan perdagangan antar wilayah. Jalur perdagangan garam seperti Via Salaria di Roma kuno bahkan menjadi jalur utama yang menghubungkan berbagai peradaban.",
          options: [
            "Karena rasanya yang enak dan dapat meningkatkan cita rasa makanan",
            "Karena digunakan dalam upacara keagamaan di seluruh dunia",
            "Fungsinya yang vital dalam mengawetkan makanan sebelum ada kulkas",
            "Karena hanya ditemukan di satu lokasi di dunia"
          ],
          correctAnswer: "Fungsinya yang vital dalam mengawetkan makanan sebelum ada kulkas"
        },
        {
          question: "Apa pemicu utama rasa cemas yang dialami oleh seseorang yang mengalami FOMO?",
          context_text: "Fenomena FOMO (Fear of Missing Out) adalah rasa cemas yang muncul ketika seseorang merasa tertinggal dari pengalaman sosial atau peluang yang dinikmati orang lain. Dipicu oleh media sosial yang menampilkan highlight reel kehidupan orang lain, FOMO membuat individu terus-menerus membandingkan diri mereka dengan standar yang seringkali tidak realistis. Penelitian menunjukkan bahwa FOMO berkaitan erat dengan tingkat kecemasan, depresi, dan kualitas tidur yang buruk. Paradoksnya, semakin seseorang berusaha menghindari 'tertinggal' dengan terus terhubung ke media sosial, semakin besar rasa tidak puas yang dirasakan karena perbandingan sosial yang tidak ada habisnya.",
          options: [
            "Ketidakmampuan mengakses internet atau media sosial",
            "Perbandingan sosial yang tidak realistis di media sosial",
            "Kurangnya waktu luang untuk bersosialisasi",
            "Tekanan dari keluarga untuk selalu update tentang tren terbaru"
          ],
          correctAnswer: "Perbandingan sosial yang tidak realistis di media sosial"
        },
        {
          question: "Mengapa planet Mars memiliki warna kemerahan?",
          context_text: "Planet Mars sering disebut 'Planet Merah' karena penampilannya yang khas berwarna oranye kemerahan. Warna ini berasal dari kandungan oksida besi (Fe₂O₃) atau yang lebih dikenal sebagai karat, yang melimpah di permukaan Mars. Proses oksidasi besi di atmosfer tipis Mars—yang sebagian besar terdiri dari karbon dioksida—telah berlangsung selama miliaran tahun, menciptakan lapisan debu karat yang menutupi hampir seluruh permukaan planet. Debu ini sangat halus dan mudah terangkat oleh badai angin Mars yang dapat mencapai kecepatan hingga 100 km/jam, menyebarkan partikel merah ke seluruh atmosfer dan memberikan langit Mars rona merah muda saat senja.",
          options: [
            "Cahaya matahari yang dipantulkan oleh atmosfer Mars",
            "Kandungan oksida besi (karat) yang melimpah di permukaannya",
            "Temperatur ekstrem yang membuat tanah berubah warna",
            "Aktivitas vulkanik yang menghasilkan lava berwarna merah"
          ],
          correctAnswer: "Kandungan oksida besi (karat) yang melimpah di permukaannya"
        },
        {
          question: "Apa perbedaan mendasar antara ekonomi sirkular dan ekonomi linier?",
          context_text: "Berbeda dengan model ekonomi linier tradisional yang mengikuti pola 'ambil-buat-buang', ekonomi sirkular dirancang untuk menghilangkan konsep 'sampah' dengan menjaga produk, komponen, dan material tetap dalam siklus penggunaan selama mungkin. Dalam sistem ini, limbah dari satu proses menjadi input untuk proses lainnya, menciptakan loop tertutup yang meminimalkan ekstraksi sumber daya alam dan emisi limbah. Contohnya, botol plastik bekas tidak hanya didaur ulang menjadi botol baru, tetapi juga dapat diubah menjadi serat tekstil, komponen otomotif, atau material konstruksi. Konsep ini tidak hanya menguntungkan lingkungan, tetapi juga menciptakan peluang bisnis baru dan efisiensi ekonomi jangka panjang.",
          options: [
            "Ekonomi sirkular lebih mahal dibanding ekonomi linier",
            "Ekonomi linier menggunakan energi terbarukan",
            "Ekonomi sirkular menghilangkan konsep 'sampah' dengan menjaga material tetap dalam siklus",
            "Ekonomi sirkular hanya berlaku untuk industri teknologi"
          ],
          correctAnswer: "Ekonomi sirkular menghilangkan konsep 'sampah' dengan menjaga material tetap dalam siklus"
        },
        {
          question: "Mengapa investasi dianggap lebih baik daripada menabung uang di bawah kasur dalam jangka panjang?",
          context_text: "Inflasi adalah kenaikan harga barang dan jasa secara umum dalam periode waktu tertentu, yang menyebabkan daya beli uang menurun. Jika seseorang menyimpan uang tunai di bawah kasur (atau bahkan di rekening tabungan dengan bunga rendah), nilai riil uangnya akan tergerus oleh inflasi. Misalnya, dengan inflasi 5% per tahun, uang Rp 1.000.000 hari ini hanya akan memiliki daya beli setara Rp 950.000 setahun kemudian. Di sisi lain, investasi pada instrumen seperti saham, obligasi, atau reksa dana berpotensi memberikan return yang dapat menyeimbangkan atau bahkan melampaui tingkat inflasi, sehingga daya beli tetap terjaga atau bahkan meningkat dalam jangka panjang.",
          options: [
            "Karena uang di bawah kasur mudah hilang atau dicuri",
            "Investasi berpotensi memberikan return yang menyeimbangkan penurunan daya beli akibat inflasi",
            "Karena bank akan mengenakan biaya administrasi yang tinggi",
            "Karena uang tunai akan rusak jika disimpan terlalu lama"
          ],
          correctAnswer: "Investasi berpotensi memberikan return yang menyeimbangkan penurunan daya beli akibat inflasi"
        },
        {
          question: "Apa bahaya utama dari tidak menghabiskan antibiotik sesuai resep dokter?",
          context_text: "Penggunaan antibiotik yang tidak tuntas atau tidak sesuai dosis adalah salah satu penyebab utama resistensi antibiotik—fenomena di mana bakteri bermutasi dan menjadi kebal terhadap obat. Ketika seseorang berhenti minum antibiotik sebelum bakteri benar-benar mati (misalnya karena merasa sudah sembuh), bakteri yang tersisa—yang kebetulan memiliki sedikit resistensi terhadap obat—akan bertahan hidup dan berkembang biak. Generasi bakteri berikutnya akan mewarisi gen resistensi ini, menciptakan strain yang semakin sulit dikalahkan. Dalam skala global, resistensi antibiotik telah menyebabkan jutaan kematian dan mengancam efektivitas prosedur medis modern seperti operasi dan kemoterapi yang bergantung pada antibiotik untuk mencegah infeksi.",
          options: [
            "Antibiotik akan menumpuk di dalam tubuh dan meracuni organ",
            "Bakteri dapat bermutasi menjadi kebal terhadap antibiotik",
            "Sistem kekebalan tubuh akan melemah secara permanen",
            "Obat akan kadaluarsa dan berbahaya jika tidak segera dihabiskan"
          ],
          correctAnswer: "Bakteri dapat bermutasi menjadi kebal terhadap antibiotik"
        },
        {
          question: "Mengapa kayu laminasi (cross-laminated timber) dianggap lebih ramah lingkungan dibanding beton untuk konstruksi pencakar langit?",
          context_text: "Gedung pencakar langit masa depan mungkin tidak lagi didominasi oleh beton dan baja, tetapi oleh kayu—khususnya kayu laminasi silang (cross-laminated timber/CLT). Material ini dibuat dengan menumpuk lapisan kayu dalam arah yang berlawanan dan merekatkannya dengan lem ramah lingkungan, menciptakan panel yang sangat kuat dan tahan api. Keunggulan utama CLT adalah kemampuannya menyimpan karbon yang diserap pohon selama masa hidupnya, sehingga mengurangi jejak karbon bangunan. Sebaliknya, produksi semen (bahan utama beton) menghasilkan sekitar 8% dari total emisi CO₂ global. Selain itu, CLT lebih ringan, mempercepat waktu konstruksi, dan dapat diproduksi dari hutan yang dikelola secara berkelanjutan.",
          options: [
            "Kayu lebih murah dan mudah didapat dibanding beton",
            "Kayu dapat menyimpan karbon yang diserap pohon, mengurangi jejak karbon",
            "Kayu tidak memerlukan perawatan seperti beton",
            "Beton lebih mudah terbakar dibanding kayu"
          ],
          correctAnswer: "Kayu dapat menyimpan karbon yang diserap pohon, mengurangi jejak karbon"
        },
        {
          question: "Apa kerugian terbesar jika suatu bahasa daerah punah?",
          context_text: "Bahasa daerah bukan sekadar alat komunikasi, tetapi juga repositori pengetahuan, nilai budaya, dan cara pandang unik terhadap dunia. Ketika sebuah bahasa punah, hilang pula sistem klasifikasi tumbuhan obat tradisional, dongeng yang mengandung ajaran moral, teknik pertanian yang disesuaikan dengan ekologi lokal, dan nuansa filosofis yang tidak dapat diterjemahkan sempurna ke bahasa lain. Fenomena ini disebut sebagai 'kematian linguistik-kognitif'—di mana bukan hanya kata-kata yang hilang, tetapi juga cara berpikir dan pengetahuan generasi yang terakumulasi selama ribuan tahun. UNESCO memperkirakan bahwa setiap dua minggu, satu bahasa punah di dunia, dan bersamaan dengan itu, hilang pula sebagian dari warisan intelektual dan budaya umat manusia.",
          options: [
            "Penurunan jumlah penutur bahasa Indonesia",
            "Hilangnya pengetahuan tradisional, nilai budaya, dan identitas unik masyarakat",
            "Kesulitan dalam perdagangan dengan daerah lain",
            "Berkurangnya wisatawan yang berkunjung ke daerah tersebut"
          ],
          correctAnswer: "Hilangnya pengetahuan tradisional, nilai budaya, dan identitas unik masyarakat"
        }
      ],
      
      closingText: "Luar biasa! Kamu sudah mampu memahami teks tingkat lanjut dengan baik!"
    };

    await db.insert(meetings).values({
      moduleId: module4.id,
      title: "Memahami Lebih Dalam",
      order: 4,
      content: module4Meeting4Content,
    } as any);

    console.log("✅ Created Meeting 4: Memahami Lebih Dalam (Advanced Reading Comprehension)");
    console.log(`   → Module ID: ${module4.id}, Meeting Order: 4`);

    // 9. Create other empty modules (for future expansion)
    // const otherModules = [
    //   {
    //     title: "Seni & Kreativitas",
    //     category: "Art",
    //     description: "Belajar menggambar dan berkarya seni",
    //     imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    //     order: 5,
    //   },
    // ];

    // for (const mod of otherModules) {
    //   await db.insert(modules).values(mod as InsertModule);
    //   console.log(`✅ Created Module: ${mod.title}`);
    // }

    console.log("🎉 Final Seeding Complete!");
    console.log(`📚 Seeded Module 1 ID: ${module1.id} with 4 meetings`);
    console.log(`📚 Seeded Module 2 ID: ${module2.id} with 4 meetings`);
    console.log(`📚 Seeded Module 3 ID: ${module3.id} with 4 meetings`);
    console.log(`📚 Seeded Module 4 ID: ${module4.id} with 4 meetings`);
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
    console.log("   3. Bahasa Inggris Dasar (with 4 meetings)");
    console.log("      - Meeting 1: Perkenalan & Sapaan (Dialogue Completion)");
    console.log("      - Meeting 2: Anggota Tubuh (Body Parts Touch)");
    console.log("      - Meeting 3: Warna dan Bentuk (Match Line Game)");
    console.log("      - Meeting 4: Binatang dan Suaranya (Animal Mimic)");
    console.log("   4. Bahasa Indonesia & Literasi (with 4 meetings)");
    console.log("      - Meeting 1: Huruf (Alphabet Race)");
    console.log("      - Meeting 2: Kata Sederhana dan Gambar (Reading Race)");
    console.log("      - Meeting 3: Memahami Teks (Reading Comprehension)");
    console.log("      - Meeting 4: Memahami Lebih Dalam (Advanced Reading Comprehension)");
    console.log("");
    console.log("✅ TEST THIS NOW:");
    console.log(`   GET /api/modules/${module1.id}/meetings`);
    console.log("   Should return 4 meetings (Pertemuan 1 unlocked, others locked)");
    console.log(`   GET /api/modules/${module2.id}/meetings`);
    console.log("   Should return 4 meetings (All Interactive Story format)");
    console.log(`   GET /api/modules/${module3.id}/meetings`);
    console.log("   Should return 4 meetings (Dialogue + Body Parts + Match Line + Animal Mimic)");
    console.log(`   GET /api/modules/${module4.id}/meetings`);
    console.log("   Should return 4 meetings (Alphabet Race + Reading Race + 2 Reading Comprehension layouts)");



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
