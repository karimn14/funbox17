/**
 * API Routes for Vercel Serverless Deployment
 * 
 * This file is completely self-contained and does not depend on the old server/ directory.
 * All route logic is implemented here to work with Vercel's serverless environment.
 */

import type { Express } from "express";
import type { Server } from "http";
import { storage } from "../server/storage.js"; // Database layer
import { api } from "../shared/routes.js"; // API definitions
import { z } from "zod";

/**
 * Register all API routes
 * 
 * @param httpServer - HTTP server instance
 * @param app - Express application instance
 * @returns Configured HTTP server
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check endpoint for deployment verification
  app.get("/api/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      message: "FunBox API is running",
      timestamp: new Date().toISOString()
    });
  });

  // === STUDENTS ===
  
  // Student Login/Registration
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

  // Get all students (Admin)
  app.get(api.students.list.path, async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get student history
  app.get(api.students.getHistory.path, async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      console.log(`🔎 Fetching history for student ID: ${studentId}`);
      
      const history = await storage.getStudentHistory(studentId);
      
      console.log(`📊 Found ${history.length} history item(s) for student ${studentId}`);
      
      res.json(history);
    } catch (error) {
      console.error("❌ Error fetching history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Get student report (Admin)
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

  // Record student progress (completion + quiz score)
  app.post(api.students.recordProgress.path, async (req, res) => {
    try {
      const studentId = Number(req.params.studentId);
      const input = api.students.recordProgress.input.parse(req.body);
      
      console.log("🔍 Backend received progress data:", { studentId, ...input });
      
      // Mark meeting as completed
      await storage.completeStudentProgress(studentId, input.meetingId);
      
      // Record quiz result with moduleId AND rawPoints
      await storage.createQuizResult({
        studentId,
        meetingId: input.meetingId,
        moduleId: input.moduleId,
        rawPoints: input.rawPoints,  // ✅ Include rawPoints from frontend
        score: input.score,
        stars: input.stars,
      });
      
      console.log("✅ Quiz result saved with moduleId:", input.moduleId, "rawPoints:", input.rawPoints);
      
      res.status(201).json({ message: "Progress recorded successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("❌ Validation error:", err.errors);
        return res.status(400).json({ message: "Invalid input", errors: err.errors });
      }
      console.error("❌ Server error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === MODULES ===
  
  // Get all modules
  app.get(api.modules.list.path, async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Get single module
  app.get(api.modules.get.path, async (req, res) => {
    try {
      const module = await storage.getModule(Number(req.params.id));
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ message: "Failed to fetch module" });
    }
  });

  // Get meetings for a module (with locked status)
  app.get(api.modules.getMeetings.path, async (req, res) => {
    try {
      const moduleId = Number(req.params.id);
      const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
      
      const meetings = await storage.getMeetingsByModule(moduleId, studentId);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  // === MEETINGS ===
  
  // Get single meeting
  app.get(api.meetings.get.path, async (req, res) => {
    try {
      const meeting = await storage.getMeeting(Number(req.params.id));
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error fetching meeting:", error);
      res.status(500).json({ message: "Failed to fetch meeting" });
    }
  });

  // === QUIZ RESULTS ===
  
  // Submit quiz result (legacy endpoint)
  app.post(api.quizResults.submit.path, async (req, res) => {
    try {
      const input = api.quizResults.submit.input.parse(req.body);
      const result = await storage.createQuizResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: err.errors });
      }
      console.error("Error submitting quiz:", err);
      res.status(500).json({ message: "Failed to submit quiz result" });
    }
  });

  console.log("✅ All API routes registered successfully");
  
  return httpServer;
}
