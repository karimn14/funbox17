import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === ZOD SCHEMAS FOR MODULE CONTENT ===

// Video Interaction Schema (for pause/mute points)
export const videoInteractionSchema = z.object({
  timestamp: z.string(), // e.g., "01:25"
  action: z.enum(["mute", "pause", "unmute"]),
  activityId: z.string().optional(), // Reference to which activity to show
  message: z.string().optional(), // Message to show in popup (for pause action)
});

// FunBox Activity Option Schema
export const activityOptionSchema = z.object({
  color: z.enum(["red", "blue", "green", "yellow"]),
  text: z.string(),
});

// Word Bank Item Schema (for drag-drop activities)
export const wordBankItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  correctSlotIndex: z.number().nullable(), // null for distractors
});

// Body Parts Activity Schema
const bodyPartsActivitySchema = z.object({
  id: z.string(),
  type: z.literal('body_parts_touch'),
  instruction: z.string(),
  imageUrl: z.string(), // Local path or URL to body diagram
  instructions: z.array(z.object({
    part: z.string(), // Body part name (e.g., "hair", "eye")
    text: z.string(), // Spoken instruction (e.g., "Touch your hair")
    zone: z.object({
      top: z.string(), // Percentage (e.g., "5%")
      left: z.string(), // Percentage (e.g., "55%")
      width: z.string(), // Percentage (e.g., "20%")
      height: z.string(), // Percentage (e.g., "15%")
    }),
  })),
  closingAudio: z.string().optional(), // Final message after completion
});

// Base Activity Schema (for button-based activities)
const buttonActivitySchema = z.object({
  id: z.string(),
  type: z.literal('button').optional(), // Optional for backward compatibility
  instruction: z.string(),
  options: z.array(activityOptionSchema).length(4), // Exactly 4 options
  correctIndex: z.number().min(0).max(3).optional(), // Index 0-3 (for single-select)
  correctIndices: z.array(z.number().min(0).max(3)).optional(), // Multiple indices (for multi-select)
  selectionMode: z.enum(['single', 'multiple']).optional().default('single'), // Selection mode
  maxSelections: z.number().min(1).max(4).optional(), // Max selections allowed
  imageUrl: z.string().url().optional(),
});

// Drag & Drop Activity Schema
const dragDropActivitySchema = z.object({
  id: z.string(),
  type: z.literal('drag_drop'),
  instruction: z.string(),
  storyTemplate: z.string(), // Template with {0}, {1}, etc. placeholders
  wordBank: z.array(wordBankItemSchema), // Words to drag
  imageUrl: z.string().url().optional(),
});

// Match Line Activity Schema
const matchLineActivitySchema = z.object({
  id: z.string(),
  type: z.literal('match_line'),
  instruction: z.string(),
  pairs: z.array(z.object({
    id: z.string(),
    leftImage: z.string(), // Image path for left column
    rightText: z.string(), // Text label for right column
  })),
  closingAudio: z.string().optional(), // Message after completion
});

// Union of all activity types
export const activitySchema = z.discriminatedUnion('type', [
  buttonActivitySchema.extend({ type: z.literal('button') }),
  dragDropActivitySchema,
  bodyPartsActivitySchema,
  matchLineActivitySchema,
]).or(buttonActivitySchema); // Allow backward compatibility for activities without type

// Quiz Question Schema (now supports 4-5 options)
export const quizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(4).max(5), // 4-5 options
  correctAnswer: z.string(),
  imageUrl: z.string().url().optional(),
});

// Meeting Content Schema (New - with story support)
export const meetingContentSchema = z.object({
  openingText: z.string(),
  story: z.string().optional(), // Story text that displays before activities
  storyTitle: z.string().optional(), // Optional title for the story section
  videos: z.array(z.object({
    url: z.string().url(),
    title: z.string().optional(),
    interactions: z.array(videoInteractionSchema).optional(),
  })),
  activities: z.array(activitySchema).optional(),
  quiz: z.array(quizQuestionSchema).length(5), // Exactly 5 quiz questions
  quiz_story: z.string().optional(), // Reference story text that displays alongside quiz questions
  closingText: z.string(),
});

// Complete Module Content Schema (legacy)
export const moduleContentSchema = z.object({
  openingText: z.string(),
  videoUrl: z.string().url(),
  activity: activitySchema,
  quiz: z.array(quizQuestionSchema).length(5), // Exactly 5 quiz questions
  closingText: z.string(),
});

// Export types from schemas
export type VideoInteraction = z.infer<typeof videoInteractionSchema>;
export type ActivityOption = z.infer<typeof activityOptionSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type MeetingContent = z.infer<typeof meetingContentSchema>;
export type ModuleContent = z.infer<typeof moduleContentSchema>;

// Legacy type for backward compatibility (if still used elsewhere)
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
  category: text("category").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meetings/Pertemuan - Sequential lessons within a module
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(), // Sequential order (1, 2, 3...)
  content: jsonb("content").notNull().$type<MeetingContent>(), // FunBox gamification content
  createdAt: timestamp("created_at").defaultNow(),
});

// Student progress tracking for sequential access
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  meetingId: integer("meeting_id").notNull(),
  isCompleted: integer("is_completed").notNull().default(0), // 0 = not completed, 1 = completed
  completedAt: timestamp("completed_at"),
});

// Legacy modules table for backward compatibility
export const legacyModules = pgTable("legacy_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  category: text("category").notNull(),
  questions: jsonb("questions").notNull().$type<Question[]>(), // Legacy field
  content: jsonb("content").$type<ModuleContent>(), // Legacy content
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  moduleId: integer("module_id"),
  meetingId: integer("meeting_id"), // Reference to meeting if applicable
  score: integer("score").notNull(), // 0-100
  stars: integer("stars").notNull(), // 1-3
  completedAt: timestamp("completed_at").defaultNow(),
});

// === SCHEMAS ===
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true });
export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true });
export const insertMeetingSchema = createInsertSchema(meetings).omit({ id: true, createdAt: true });
export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({ id: true, completedAt: true });
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true, completedAt: true });

// === EXPLICIT TYPES ===
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

// Request types
export type LoginRequest = { name: string; className: string };
