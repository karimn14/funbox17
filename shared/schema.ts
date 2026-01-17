import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TYPES ===
export type Question = {
  text: string;
  options: string[]; // Array of 4 strings
  correctAnswer: number; // Index 0-3
};

// === TABLES ===
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  className: text("class_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  category: text("category").notNull(),
  questions: jsonb("questions").notNull().$type<Question[]>(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  moduleId: integer("module_id").notNull(),
  score: integer("score").notNull(), // 0-100
  stars: integer("stars").notNull(), // 1-3
  completedAt: timestamp("completed_at").defaultNow(),
});

// === SCHEMAS ===
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true });
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true, completedAt: true });

// === EXPLICIT TYPES ===
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

// Request types
export type LoginRequest = { name: string; className: string };
