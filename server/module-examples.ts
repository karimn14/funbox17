/**
 * Example: Creating a FunBox Module with Complete Content
 * 
 * This file demonstrates how to create a complete learning module
 * using the new moduleContentSchema structure.
 */

import type { InsertModule, ModuleContent } from "../shared/schema.js";

/**
 * Example 1: Matematika - Penjumlahan
 */
export const matematikaModule: InsertModule = {
  title: "Matematika: Penjumlahan Sederhana",
  category: "Matematika",
  videoUrl: "https://www.youtube.com/watch?v=Fe8u2I3vmHU",
  
  // Legacy field (for backward compatibility)
  questions: [],
  
  // New FunBox gamification content
  content: {
    openingText: "Halo teman-teman! 👋\n\nHari ini kita akan belajar matematika dengan cara yang seru! Siap-siap belajar penjumlahan ya!",
    
    videoUrl: "https://www.youtube.com/watch?v=Fe8u2I3vmHU",
    
    activity: {
      instruction: "Perhatikan tombol warna-warni di hadapanmu! Tekan tombol yang menunjukkan jawaban: Berapa hasil dari 2 + 2?",
      options: [
        { color: "red", text: "3" },
        { color: "blue", text: "4" },      // This is correct!
        { color: "green", text: "5" },
        { color: "yellow", text: "6" }
      ],
      correctIndex: 1  // Blue button (4) is correct
    },
    
    quiz: [
      {
        question: "Berapa hasil dari 1 + 1?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2"
      },
      {
        question: "Hitung jumlah apel: 🍎🍎 + 🍎",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3"
      },
      {
        question: "Angka setelah 4 adalah?",
        options: ["3", "5", "6", "7"],
        correctAnswer: "5"
      },
      {
        question: "Berapa 3 + 1?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4"
      },
      {
        question: "Manakah yang lebih besar: 5 atau 2?",
        options: ["2", "5", "Sama", "Tidak Tahu"],
        correctAnswer: "5"
      }
    ],
    
    closingText: "🎉 Hebat sekali! 🎉\n\nKamu sudah pintar menghitung! Besok kita belajar yang lebih seru lagi ya!"
  }
};

/**
 * Example 2: Bahasa Indonesia - Mengenal Warna
 */
export const bahasaWarnaModule: InsertModule = {
  title: "Bahasa Indonesia: Mengenal Warna",
  category: "Bahasa",
  videoUrl: "https://www.youtube.com/watch?v=example",
  
  questions: [],
  
  content: {
    openingText: "Selamat datang di dunia warna! 🌈\n\nAyo kita belajar nama-nama warna dengan cara yang menyenangkan!",
    
    videoUrl: "https://www.youtube.com/watch?v=example",
    
    activity: {
      instruction: "Lihat tombol-tombol di hadapanmu! Tekan tombol yang berwarna MERAH!",
      options: [
        { color: "red", text: "MERAH" },    // This is correct!
        { color: "blue", text: "BIRU" },
        { color: "green", text: "HIJAU" },
        { color: "yellow", text: "KUNING" }
      ],
      correctIndex: 0  // Red button (MERAH) is correct
    },
    
    quiz: [
      {
        question: "Warna langit adalah?",
        options: ["Merah", "Biru", "Hijau", "Kuning"],
        correctAnswer: "Biru"
      },
      {
        question: "Warna rumput adalah?",
        options: ["Merah", "Biru", "Hijau", "Kuning"],
        correctAnswer: "Hijau"
      },
      {
        question: "Warna matahari adalah?",
        options: ["Merah", "Biru", "Hijau", "Kuning"],
        correctAnswer: "Kuning"
      },
      {
        question: "Warna tomat adalah?",
        options: ["Merah", "Biru", "Hijau", "Kuning"],
        correctAnswer: "Merah"
      },
      {
        question: "Warna apel biasanya?",
        options: ["Merah", "Biru", "Hijau", "Putih"],
        correctAnswer: "Merah"
      }
    ],
    
    closingText: "Wah, kamu pintar sekali! 🌟\n\nSekarang kamu sudah kenal banyak warna. Bagus!"
  }
};

/**
 * Example 3: Sains - Hewan dan Habitatnya
 */
export const sainsHewanModule: InsertModule = {
  title: "Sains: Hewan dan Habitatnya",
  category: "Sains",
  videoUrl: "https://www.youtube.com/watch?v=hDt_MhIKpJM",
  
  questions: [],
  
  content: {
    openingText: "Halo sahabat sains! 🔬\n\nHari ini kita akan belajar tentang hewan dan tempat tinggalnya. Ayo mulai!",
    
    videoUrl: "https://www.youtube.com/watch?v=hDt_MhIKpJM",
    
    activity: {
      instruction: "Dimana ikan hidup? Tekan tombol dengan jawaban yang benar!",
      options: [
        { color: "red", text: "Darat" },
        { color: "blue", text: "Air" },      // This is correct!
        { color: "green", text: "Udara" },
        { color: "yellow", text: "Pohon" }
      ],
      correctIndex: 1  // Blue button (Air) is correct
    },
    
    quiz: [
      {
        question: "Burung terbang menggunakan?",
        options: ["Kaki", "Sayap", "Ekor", "Telinga"],
        correctAnswer: "Sayap"
      },
      {
        question: "Hewan yang hidup di air?",
        options: ["Kucing", "Ikan", "Ayam", "Kambing"],
        correctAnswer: "Ikan"
      },
      {
        question: "Suara kucing adalah?",
        options: ["Meong", "Guk-guk", "Moo", "Kukuruyuk"],
        correctAnswer: "Meong"
      },
      {
        question: "Hewan berkaki empat?",
        options: ["Burung", "Ikan", "Kuda", "Ular"],
        correctAnswer: "Kuda"
      },
      {
        question: "Hewan yang bisa terbang?",
        options: ["Sapi", "Burung", "Kucing", "Ikan"],
        correctAnswer: "Burung"
      }
    ],
    
    closingText: "Luar biasa! 🦁🐟🦅\n\nKamu sekarang tahu banyak tentang hewan. Hebat!"
  }
};

/**
 * Helper function to create a module in the database
 */
export async function createModuleWithContent(storage: any, moduleData: InsertModule) {
  try {
    const module = await storage.createModule(moduleData);
    console.log(`✅ Module created: ${module.title} (ID: ${module.id})`);
    return module;
  } catch (error) {
    console.error(`❌ Failed to create module:`, error);
    throw error;
  }
}

/**
 * Example usage in seed script:
 * 
 * import { storage } from './storage';
 * import { matematikaModule, bahasaWarnaModule, sainsHewanModule } from './module-examples';
 * 
 * await createModuleWithContent(storage, matematikaModule);
 * await createModuleWithContent(storage, bahasaWarnaModule);
 * await createModuleWithContent(storage, sainsHewanModule);
 */
