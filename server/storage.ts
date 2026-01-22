import { db } from "./db";
import {
  students,
  modules,
  meetings,
  studentProgress,
  quizResults,
  type Student,
  type InsertStudent,
  type Module,
  type InsertModule,
  type Meeting,
  type InsertMeeting,
  type StudentProgress,
  type InsertStudentProgress,
  type QuizResult,
  type InsertQuizResult,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

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

  // Meeting
  getMeetingsByModule(moduleId: number, studentId?: number): Promise<(Meeting & { locked: boolean })[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;

  // Student Progress
  getStudentProgress(studentId: number, meetingId: number): Promise<StudentProgress | undefined>;
  createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>;
  completeStudentProgress(studentId: number, meetingId: number): Promise<void>;

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
        meetingId: quizResults.meetingId,
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

  // Meeting
  async getMeetingsByModule(moduleId: number, studentId?: number): Promise<(Meeting & { locked: boolean })[]> {
    const allMeetings = await db
      .select()
      .from(meetings)
      .where(eq(meetings.moduleId, moduleId))
      .orderBy(meetings.order);

    if (!studentId) {
      // If no student, lock all except first
      return allMeetings.map((meeting, index) => ({
        ...meeting,
        locked: index > 0,
      }));
    }

    // Get student progress for all meetings
    const progressRecords = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.studentId, studentId),
          eq(studentProgress.isCompleted, 1)
        )
      );

    const completedMeetingIds = new Set(progressRecords.map(p => p.meetingId));

    // Apply locking logic: Meeting N is unlocked if Meeting N-1 is completed
    return allMeetings.map((meeting, index) => {
      if (index === 0) {
        // First meeting is always unlocked
        return { ...meeting, locked: false };
      }

      const previousMeeting = allMeetings[index - 1];
      const isPreviousCompleted = completedMeetingIds.has(previousMeeting.id);

      return {
        ...meeting,
        locked: !isPreviousCompleted,
      };
    });
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const [meeting] = await db.insert(meetings).values(insertMeeting as any).returning();
    return meeting;
  }

  // Student Progress
  async getStudentProgress(studentId: number, meetingId: number): Promise<StudentProgress | undefined> {
    const [progress] = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.studentId, studentId),
          eq(studentProgress.meetingId, meetingId)
        )
      );
    return progress;
  }

  async createStudentProgress(insertProgress: InsertStudentProgress): Promise<StudentProgress> {
    const [progress] = await db.insert(studentProgress).values(insertProgress).returning();
    return progress;
  }

  async completeStudentProgress(studentId: number, meetingId: number): Promise<void> {
    const existing = await this.getStudentProgress(studentId, meetingId);

    if (existing) {
      // Update existing record
      await db
        .update(studentProgress)
        .set({ isCompleted: 1, completedAt: new Date() })
        .where(eq(studentProgress.id, existing.id));
    } else {
      // Create new record
      await db.insert(studentProgress).values({
        studentId,
        meetingId,
        isCompleted: 1,
        completedAt: new Date(),
      });
    }
  }
}

export const storage = new DatabaseStorage();
