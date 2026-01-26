import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { LoginRequest, Student } from "@shared/schema";
import { apiFetch } from "@/lib/api-client";

// Helper to manage student session
const STUDENT_KEY = "active_student";

export function getActiveStudent(): Student | null {
  const stored = localStorage.getItem(STUDENT_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setActiveStudent(student: Student) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearActiveStudent() {
  localStorage.removeItem(STUDENT_KEY);
}

// Hooks
export function useStudentLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiFetch(api.students.login.path, {
        method: api.students.login.method,
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Login failed");
      const student = await res.json();
      return api.students.login.responses[200].parse(student); 
    },
    onSuccess: (data) => {
      setActiveStudent(data);
    }
  });
}

export function useStudents() {
  return useQuery({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await apiFetch(api.students.list.path);
      if (!res.ok) throw new Error("Failed to fetch students");
      return api.students.list.responses[200].parse(await res.json());
    },
  });
}

export function useStudentHistory(studentId: number) {
  return useQuery({
    queryKey: [api.students.getHistory.path, studentId],
    enabled: !!studentId,
    staleTime: 0,
    refetchOnMount: 'always',
    queryFn: async () => {
      const url = buildUrl(api.students.getHistory.path, { id: studentId });
      console.log("🌐 Fetching history from:", url);
      const res = await apiFetch(url);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      console.log("📥 Raw API response:", data);
      return api.students.getHistory.responses[200].parse(data);
    },
  });
}
