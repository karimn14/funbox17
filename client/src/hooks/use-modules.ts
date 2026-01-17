import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertQuizResult } from "@shared/schema";

export function useModules() {
  return useQuery({
    queryKey: [api.modules.list.path],
    queryFn: async () => {
      const res = await fetch(api.modules.list.path);
      if (!res.ok) throw new Error("Failed to fetch modules");
      return api.modules.list.responses[200].parse(await res.json());
    },
  });
}

export function useModule(id: number) {
  return useQuery({
    queryKey: [api.modules.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.modules.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch module");
      return api.modules.get.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertQuizResult) => {
      const res = await fetch(api.quizResults.submit.path, {
        method: api.quizResults.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      return api.quizResults.submit.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate history for the specific student
      queryClient.invalidateQueries({ 
        queryKey: [api.students.getHistory.path, variables.studentId] 
      });
    },
  });
}
