import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Meeting } from "@shared/schema";
import { apiFetch } from "@/lib/api-client";

type MeetingWithLocked = Meeting & { locked: boolean };

// Get all meetings for a module (with locked status)
export function useMeetings(moduleId: number, studentId?: number) {
  return useQuery<MeetingWithLocked[]>({
    queryKey: ["meetings", moduleId, studentId],
    queryFn: async () => {
      const url = studentId 
        ? `/api/modules/${moduleId}/meetings?studentId=${studentId}`
        : `/api/modules/${moduleId}/meetings`;
      const response = await apiFetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }
      return response.json();
    },
  });
}

// Get single meeting by ID
export function useMeeting(meetingId: number) {
  return useQuery<Meeting>({
    queryKey: ["meeting", meetingId],
    queryFn: async () => {
      const response = await apiFetch(`/api/meetings/${meetingId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch meeting");
      }
      return response.json();
    },
    enabled: meetingId > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

// Record student progress (completion + score)
export function useRecordProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      meetingId,
      moduleId,
      meetingOrder,
      rawPoints,
      totalQuestions,
      score,
      stars,
    }: {
      studentId: number;
      meetingId: number;
      moduleId: number;
      meetingOrder: number;
      rawPoints: number;
      totalQuestions: number;
      score: number;
      stars: number;
    }) => {
      console.log("📤 API Request Body (Weighted):", { 
        meetingId, 
        moduleId, 
        meetingOrder,
        rawPoints,
        totalQuestions,
        score, 
        stars 
      });
      
      const response = await apiFetch(`/api/students/${studentId}/progress`, {
        method: "POST",
        body: JSON.stringify({ 
          meetingId, 
          moduleId, 
          meetingOrder,
          rawPoints,
          totalQuestions,
          score, 
          stars 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record progress");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.studentId, "history"] });
    },
  });
}
