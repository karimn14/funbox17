import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Students ===
  app.post(api.students.login.path, async (req, res) => {
    try {
      const input = api.students.login.input.parse(req.body);
      let student = await storage.getStudentByNameAndClass(input.name, input.className);
      
      if (student) {
        return res.status(200).json(student);
      }
      
      student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getAllStudents();
    res.json(students);
  });

  app.get(api.students.getHistory.path, async (req, res) => {
    const history = await storage.getStudentHistory(Number(req.params.id));
    res.json(history);
  });

  // === Modules ===
  app.get(api.modules.list.path, async (req, res) => {
    const modules = await storage.getAllModules();
    res.json(modules);
  });

  app.get(api.modules.get.path, async (req, res) => {
    const module = await storage.getModule(Number(req.params.id));
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  });

  // === Quiz Results ===
  app.post(api.quizResults.submit.path, async (req, res) => {
    try {
      const input = api.quizResults.submit.input.parse(req.body);
      const result = await storage.createQuizResult(input);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingModules = await storage.getAllModules();
  if (existingModules.length === 0) {
    console.log("Seeding database...");
    
    await storage.createModule({
      title: "Matematika: Penjumlahan",
      category: "Matematika",
      videoUrl: "https://www.youtube.com/watch?v=Fe8u2I3vmHU", // Kids math video
      questions: [
        { text: "Berapa hasil dari 1 + 1?", options: ["2", "3", "4", "5"], correctAnswer: 0 },
        { text: "Hitung jumlah apel: 🍎🍎 + 🍎", options: ["2", "4", "3", "5"], correctAnswer: 2 },
        { text: "Angka setelah 4 adalah?", options: ["3", "6", "5", "7"], correctAnswer: 2 },
        { text: "2 + 2 = ?", options: ["1", "3", "4", "0"], correctAnswer: 2 },
        { text: "Manakah yang lebih besar? 5 atau 2", options: ["2", "5", "Sama", "Tidak Tahu"], correctAnswer: 1 },
      ],
    });

    await storage.createModule({
      title: "Bahasa Indonesia: Mengenal Buah",
      category: "Bahasa",
      videoUrl: "https://www.youtube.com/watch?v=k-S2q7d63zI", // Kids fruits video
      questions: [
        { text: "Buah apakah ini? 🍌", options: ["Apel", "Jeruk", "Pisang", "Anggur"], correctAnswer: 2 },
        { text: "Warna buah Apel adalah?", options: ["Merah", "Biru", "Hitam", "Putih"], correctAnswer: 0 },
        { text: "Buah yang rasanya masam?", options: ["Pisang", "Lemon", "Semangka", "Pepaya"], correctAnswer: 1 },
        { text: "Buah yang kulitnya berduri?", options: ["Durian", "Apel", "Mangga", "Jambu"], correctAnswer: 0 },
        { text: "Hewan suka makan pisang?", options: ["Kucing", "Monyet", "Ikan", "Burung"], correctAnswer: 1 },
      ],
    });

    await storage.createModule({
      title: "Sains: Hewan & Suara",
      category: "Sains",
      videoUrl: "https://www.youtube.com/watch?v=hDt_MhIKpJM", // Animal sounds
      questions: [
        { text: "Suara kucing adalah?", options: ["Meong", "Guk guk", "Moo", "Kwak kwak"], correctAnswer: 0 },
        { text: "Hewan yang menghasilkan susu?", options: ["Ayam", "Sapi", "Bebek", "Ikan"], correctAnswer: 1 },
        { text: "Burung terbang menggunakan?", options: ["Kaki", "Sayap", "Ekor", "Telinga"], correctAnswer: 1 },
        { text: "Ikan hidup di?", options: ["Udara", "Air", "Tanah", "Api"], correctAnswer: 1 },
        { text: "Hewan berkaki empat?", options: ["Ayam", "Kuda", "Ular", "Burung"], correctAnswer: 1 },
      ],
    });
    console.log("Database seeded!");
  }
}
