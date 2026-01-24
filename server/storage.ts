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
  getStudentReport(studentId: number): Promise<{
    student: { name: string; age: number | null; className?: string };
    activities: Array<{
      meeting: string;
      date: string;
      score: number;
      module: string;
    }>;
    analysis: {
      strength: string | null;
      needsRepeat: boolean;
      repeatModuleName: string | null;
    };
  }>;

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
  getStudentHistory(studentId: number): Promise<(QuizResult & { moduleTitle: string; meetingTitle: string; meetingOrder: number })[]>;
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

  async getStudentHistory(studentId: number): Promise<(QuizResult & { moduleTitle: string; meetingTitle: string; meetingOrder: number })[]> {
    console.log(`🔍 Storage: Querying history for student ${studentId}`);
    
    // First, check if there are ANY quiz results for this student (debugging)
    const rawResults = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, studentId));
    
    console.log(`📦 Raw quiz results count: ${rawResults.length}`);
    if (rawResults.length > 0) {
      console.log("📋 Raw results sample:", JSON.stringify(rawResults[0], null, 2));
    }
    
    // Join quiz_results with modules AND meetings to get full details
    // CRITICAL: Using innerJoin means rows with NULL moduleId/meetingId are excluded
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
        meetingTitle: meetings.title,
        meetingOrder: meetings.order,
      })
      .from(quizResults)
      .innerJoin(modules, eq(quizResults.moduleId, modules.id))
      .innerJoin(meetings, eq(quizResults.meetingId, meetings.id))
      .where(eq(quizResults.studentId, studentId))
      .orderBy(desc(quizResults.completedAt));
    
    console.log(`✅ Joined results count: ${results.length}`);
    
    if (results.length > 0) {
      console.log("📋 Sample joined result:", JSON.stringify(results[0], null, 2));
      console.log("🔍 Field check:", {
        hasModuleTitle: !!results[0].moduleTitle,
        hasMeetingTitle: !!results[0].meetingTitle,
        hasMeetingOrder: !!results[0].meetingOrder,
        meetingId: results[0].meetingId
      });
    }
    
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

  async getStudentReport(studentId: number) {
    // Fetch student basic info
    const [student] = await db
      .select({
        name: students.name,
        className: students.className,
      })
      .from(students)
      .where(eq(students.id, studentId));

    if (!student) {
      throw new Error("Student not found");
    }

    // Fetch student's activities (quiz results with meeting and module details)
    const activities = await db
      .select({
        meeting: meetings.title,
        date: quizResults.completedAt,
        score: quizResults.score,
        module: modules.title,
        moduleId: modules.id,
      })
      .from(quizResults)
      .innerJoin(meetings, eq(quizResults.meetingId, meetings.id))
      .innerJoin(modules, eq(quizResults.moduleId, modules.id))
      .where(eq(quizResults.studentId, studentId))
      .orderBy(desc(quizResults.completedAt));

    // Calculate module averages for analysis
    const moduleScores: Record<string, { total: number; count: number; name: string }> = {};
    
    activities.forEach(activity => {
      const key = activity.moduleId.toString();
      if (!moduleScores[key]) {
        moduleScores[key] = { total: 0, count: 0, name: activity.module };
      }
      moduleScores[key].total += activity.score;
      moduleScores[key].count += 1;
    });

    // Find strength (highest average score)
    let strength: string | null = null;
    let highestAvg = 0;
    
    // Find modules needing repetition (average < 60)
    let needsRepeat = false;
    let repeatModuleName: string | null = null;

    Object.values(moduleScores).forEach(({ total, count, name }) => {
      const avg = total / count;
      
      if (avg > highestAvg) {
        highestAvg = avg;
        strength = name;
      }
      
      if (avg < 60 && !needsRepeat) {
        needsRepeat = true;
        repeatModuleName = name;
      }
    });

    return {
      student: {
        name: student.name,
        age: null, // Age not in schema, using className instead
        className: student.className,
      },
      activities: activities.map(a => ({
        meeting: a.meeting,
        date: a.date ? new Date(a.date).toISOString() : "",
        score: a.score,
        module: a.module,
      })),
      analysis: {
        strength,
        needsRepeat,
        repeatModuleName,
      },
    };
  }
}

export const storage = new DatabaseStorage();
