import { moduleContentSchema, type ModuleContent } from "../shared/schema";

/**
 * Example FunBox Module Content
 * This demonstrates the complete structure for a gamified learning module
 */
export const exampleModuleContent: ModuleContent = {
  openingText: "Selamat datang di modul Matematika! Hari ini kita akan belajar tentang penjumlahan dengan cara yang menyenangkan!",
  
  videoUrl: "https://www.youtube.com/watch?v=Fe8u2I3vmHU",
  
  activity: {
    instruction: "Tekan tombol dengan warna yang sesuai untuk menjawab: Berapa hasil dari 2 + 2?",
    options: [
      { color: "red", text: "3" },
      { color: "blue", text: "4" },
      { color: "green", text: "5" },
      { color: "yellow", text: "6" }
    ],
    correctIndex: 1 // "blue" with text "4" is correct
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
      question: "2 + 2 = ?",
      options: ["1", "3", "4", "5"],
      correctAnswer: "4"
    },
    {
      question: "Manakah yang lebih besar: 5 atau 2?",
      options: ["2", "5", "Sama", "Tidak Tahu"],
      correctAnswer: "5"
    }
  ],
  
  closingText: "Selamat! Kamu telah menyelesaikan modul Matematika dengan sempurna! 🎉"
};

/**
 * Validate module content against schema
 * @param content - The module content to validate
 * @returns Validated content or throws error
 */
export function validateModuleContent(content: unknown): ModuleContent {
  return moduleContentSchema.parse(content);
}

/**
 * Safe validation that returns errors instead of throwing
 * @param content - The module content to validate
 * @returns Success with data or error with issues
 */
export function safeValidateModuleContent(content: unknown) {
  return moduleContentSchema.safeParse(content);
}
