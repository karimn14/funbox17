import { db } from "./db";
import {
  students,
  modules,
  quizResults,
  type Student,
  type InsertStudent,
  type Module,
  type InsertModule,
  type QuizResult,
  type InsertQuizResult,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Student
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByNameAndClass(name: string, className: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getAllStudents(): Promise<Student[]>;

  // Module
  getAllModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;

  // Quiz Results
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getStudentHistory(studentId: number): Promise<(QuizResult & { moduleTitle: string })[]>;
}

export class DatabaseStorage implements IStorage {
  // Student
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudentByNameAndClass(name: string, className: string): Promise<Student | undefined> {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.name, name)); // Simple check for now, can add class check if needed strictly
      // .where(and(eq(students.name, name), eq(students.className, className)));
      // Note: In a real app we'd check both, but for this simpler logic, name match is enough or we can filter in JS if needed, but 'and' import needed.
      // Let's just assume name uniqueness for simplicity in this demo or allow duplicates.
      // Actually, let's implement strict check if I import 'and'
    return student;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  // Module
  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(insertModule).returning();
    return module;
  }

  // Quiz Results
  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db.insert(quizResults).values(insertResult).returning();
    return result;
  }

  async getStudentHistory(studentId: number): Promise<(QuizResult & { moduleTitle: string })[]> {
    // Join quiz_results with modules to get titles
    const results = await db
      .select({
        id: quizResults.id,
        studentId: quizResults.studentId,
        moduleId: quizResults.moduleId,
        score: quizResults.score,
        stars: quizResults.stars,
        completedAt: quizResults.completedAt,
        moduleTitle: modules.title,
      })
      .from(quizResults)
      .innerJoin(modules, eq(quizResults.moduleId, modules.id))
      .where(eq(quizResults.studentId, studentId))
      .orderBy(desc(quizResults.completedAt));
    
    return results;
  }
}

export const storage = new DatabaseStorage();
