import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes.js";
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
      console.error("Login error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: err.errors });
      }
      res.status(500).json({ 
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get(api.students.list.path, async (req, res) => {
    const students = await storage.getAllStudents();
    res.json(students);
  });

  app.get(api.students.getHistory.path, async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      console.log(`🔎 Fetching history for student ID: ${studentId}`);
      
      const history = await storage.getStudentHistory(studentId);
      
      console.log(`📊 Found ${history.length} history item(s) for student ${studentId}`);
      console.log("📝 History data:", JSON.stringify(history, null, 2));
      
      res.json(history);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Student Report
  app.get(api.students.getReport.path, async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      console.log(`📊 Fetching report for student ID: ${studentId}`);
      
      const report = await storage.getStudentReport(studentId);
      
      console.log(`✅ Generated report for student ${studentId}`);
      res.json(report);
    } catch (error) {
      console.error("❌ Error fetching report:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch report" 
      });
    }
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

  // === Meetings ===
  app.get(api.modules.getMeetings.path, async (req, res) => {
    const moduleId = Number(req.params.id);
    const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
    
    const meetings = await storage.getMeetingsByModule(moduleId, studentId);
    res.json(meetings);
  });

  app.get(api.meetings.get.path, async (req, res) => {
    const meeting = await storage.getMeeting(Number(req.params.id));
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(meeting);
  });

  // === Student Progress ===
  app.post(api.students.recordProgress.path, async (req, res) => {
    try {
      const studentId = Number(req.params.studentId);
      const input = api.students.recordProgress.input.parse(req.body);
      
      console.log("🔍 Backend received weighted progress data:", { studentId, ...input });
      
      // Mark meeting as completed
      await storage.completeStudentProgress(studentId, input.meetingId);
      
      // Record quiz result with weighted scoring
      await storage.createQuizResult({
        studentId,
        meetingId: input.meetingId,
        moduleId: input.moduleId,
        rawPoints: input.rawPoints,
        score: input.score,
        stars: input.stars,
      });
      
      console.log("✅ Weighted quiz result saved:", {
        moduleId: input.moduleId,
        meetingOrder: input.meetingOrder,
        rawPoints: input.rawPoints,
        totalQuestions: input.totalQuestions,
        calculatedScore: input.score
      });
      
      res.status(201).json({ message: "Progress recorded successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("❌ Validation error:", err.errors);
        return res.status(400).json({ message: "Invalid input" });
      }
      console.error("❌ Server error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
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
  // Note: Use `npm run db:seed` to seed the database with proper meeting data
  // Legacy seed function removed - incompatible with new schema

  return httpServer;
}
