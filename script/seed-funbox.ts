import { db } from '../server/db';
import { modules } from '../shared/schema';
import type { InsertModule, ModuleContent, Question } from '../shared/schema';
import { moduleContentSchema } from '../shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * FunBox Seeding Script
 * Populates the modules table with initial FunBox content
 */

// Module 1: Pengenalan Uang
const pengenalanUangContent: ModuleContent = {
  openingText: "Halo! Ayo belajar uang.",
  videoUrl: "https://www.youtube.com/watch?v=NnF-2t87PJM",
  activity: {
    instruction: "Pilih tombol MERAH (Uang Kertas)",
    options: [
      { color: "red", text: "Kertas" },      // Correct answer
      { color: "blue", text: "Koin" },
      { color: "green", text: "Daun" },
      { color: "yellow", text: "Batu" }
    ],
    correctIndex: 0  // Red button (Kertas) is correct
  },
  quiz: [
    {
      question: "Apa yang kita gunakan untuk membeli makanan?",
      options: ["Uang", "Batu", "Daun", "Air"],
      correctAnswer: "Uang"
    },
    {
      question: "Uang kertas terbuat dari?",
      options: ["Kertas", "Batu", "Air", "Tanah"],
      correctAnswer: "Kertas"
    },
    {
      question: "Uang koin terbuat dari?",
      options: ["Logam", "Kertas", "Kayu", "Plastik"],
      correctAnswer: "Logam"
    },
    {
      question: "Dimana kita menyimpan uang?",
      options: ["Dompet", "Piring", "Gelas", "Buku"],
      correctAnswer: "Dompet"
    },
    {
      question: "Apa yang bisa kita beli dengan uang?",
      options: ["Makanan", "Udara", "Sinar Matahari", "Hujan"],
      correctAnswer: "Makanan"
    }
  ],
  closingText: "Hebat! Kamu pintar."
};

// Legacy questions array
const legacyQuestions: Question[] = [
  {
    text: "Apa yang kita gunakan untuk membeli makanan?",
    options: ["Uang", "Batu", "Daun", "Air"],
    correctAnswer: 0
  },
  {
    text: "Uang kertas terbuat dari?",
    options: ["Kertas", "Batu", "Air", "Tanah"],
    correctAnswer: 0
  },
  {
    text: "Uang koin terbuat dari?",
    options: ["Logam", "Kertas", "Kayu", "Plastik"],
    correctAnswer: 0
  },
  {
    text: "Dimana kita menyimpan uang?",
    options: ["Dompet", "Piring", "Gelas", "Buku"],
    correctAnswer: 0
  },
  {
    text: "Apa yang bisa kita beli dengan uang?",
    options: ["Makanan", "Udara", "Sinar Matahari", "Hujan"],
    correctAnswer: 0
  }
];

const pengenalanUangModule: InsertModule = {
  title: "Pengenalan Uang",
  category: "Math",
  videoUrl: "https://www.youtube.com/watch?v=NnF-2t87PJM",
  questions: legacyQuestions,
  content: pengenalanUangContent
};

async function seedFunBoxModules() {
  console.log('🌱 Starting FunBox module seeding...\n');

  try {
    // Validate the content schema
    console.log('📋 Validating module content schema...');
    const validatedContent = moduleContentSchema.parse(pengenalanUangContent);
    console.log('✅ Content schema validation passed!\n');

    // Clear existing modules
    console.log('🗑️  Clearing existing modules from database...');
    await db.delete(modules);
    console.log('✅ Existing modules cleared\n');

    // Insert the new module
    console.log('💾 Inserting "Pengenalan Uang" module...');
    const [insertedModule] = await db
      .insert(modules)
      .values({
        title: "Pengenalan Uang",
        category: "Math",
        videoUrl: "https://www.youtube.com/watch?v=NnF-2t87PJM",
        questions: legacyQuestions,
        content: pengenalanUangContent,
      })
      .returning();

    console.log('✅ Module inserted successfully!');
    console.log(`   📌 ID: ${insertedModule.id}`);
    console.log(`   📌 Title: ${insertedModule.title}`);
    console.log(`   📌 Category: ${insertedModule.category}`);
    console.log(`   📌 Video: ${insertedModule.videoUrl}`);
    
    if (insertedModule.content) {
      console.log(`   📌 Has FunBox Content: ✓`);
      console.log(`      - Opening: "${insertedModule.content.openingText}"`);
      console.log(`      - Activity: ${insertedModule.content.activity.instruction}`);
      console.log(`      - Quiz Questions: ${insertedModule.content.quiz.length}`);
      console.log(`      - Closing: "${insertedModule.content.closingText}"`);
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('📊 Total modules in database: 1\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set!');
    }

    await seedFunBoxModules();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding script
main();
