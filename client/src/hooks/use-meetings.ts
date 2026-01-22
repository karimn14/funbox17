import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Meeting } from "@shared/schema";

type MeetingWithLocked = Meeting & { locked: boolean };

// Get all meetings for a module (with locked status)
export function useMeetings(moduleId: number, studentId?: number) {
  return useQuery<MeetingWithLocked[]>({
    queryKey: ["meetings", moduleId, studentId],
    queryFn: async () => {
      const url = studentId 
        ? `/api/modules/${moduleId}/meetings?studentId=${studentId}`
        : `/api/modules/${moduleId}/meetings`;
      const response = await fetch(url);
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
      const response = await fetch(`/api/meetings/${meetingId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch meeting");
      }
      return response.json();
    },
    enabled: meetingId > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });
}

// Record student progress (completion + score)
export function useRecordProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      meetingId,
      score,
      stars,
    }: {
      studentId: number;
      meetingId: number;
      score: number;
      stars: number;
    }) => {
      const response = await fetch(`/api/students/${studentId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, score, stars }),
      });

      if (!response.ok) {
        throw new Error("Failed to record progress");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate meetings query to refresh locked status
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.studentId, "history"] });
    },
  });
}
