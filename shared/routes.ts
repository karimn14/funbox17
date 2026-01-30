import { z } from "zod";
import { insertStudentSchema, insertQuizResultSchema, students, modules, quizResults } from "./schema.js";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  students: {
    login: {
      method: "POST" as const,
      path: "/api/students/login",
      input: z.object({ name: z.string(), className: z.string(), teacherName: z.string().optional() }),
      responses: {
        200: z.custom<typeof students.$inferSelect>(), // Returns existing student
        201: z.custom<typeof students.$inferSelect>(), // Returns new student
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/students",
      responses: {
        200: z.array(z.custom<typeof students.$inferSelect>()),
      },
    },
    getHistory: {
      method: "GET" as const,
      path: "/api/students/:id/history",
      responses: {
        200: z.array(z.custom<typeof quizResults.$inferSelect & { moduleTitle: string; meetingTitle: string; meetingOrder: number }>()),
      },
    },
    getReport: {
      method: "GET" as const,
      path: "/api/admin/students/:id/report",
      responses: {
        200: z.object({
          student: z.object({
            name: z.string(),
            age: z.number().nullable(),
            className: z.string().optional(),
            teacherName: z.string().optional(),
          }),
          activities: z.array(z.object({
            meeting: z.string(),
            date: z.string(),
            score: z.number(),
            module: z.string(),
          })),
          analysis: z.object({
            strength: z.string().nullable(),
            needsRepeat: z.boolean(),
            repeatModuleName: z.string().nullable(),
          }),
        }),
      },
    },
    recordProgress: {
      method: "POST" as const,
      path: "/api/students/:studentId/progress",
      input: z.object({
        meetingId: z.number(),
        moduleId: z.number(),
        meetingOrder: z.number(), // Meeting order (1, 2, 3, 4) for config lookup
        rawPoints: z.number(), // Raw points earned (correct answers count)
        totalQuestions: z.number(), // Total questions in quiz
        score: z.number(), // Calculated 0-100 score
        stars: z.number(),
      }),
      responses: {
        201: z.object({ message: z.string() }),
      },
    },
  },
  modules: {
    list: {
      method: "GET" as const,
      path: "/api/modules",
      responses: {
        200: z.array(z.custom<typeof modules.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/modules/:id",
      responses: {
        200: z.custom<typeof modules.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getMeetings: {
      method: "GET" as const,
      path: "/api/modules/:id/meetings",
      responses: {
        200: z.array(z.any()), // Meeting with locked field
      },
    },
  },
  meetings: {
    get: {
      method: "GET" as const,
      path: "/api/meetings/:id",
      responses: {
        200: z.any(), // Meeting object
        404: errorSchemas.notFound,
      },
    },
  },
  quizResults: {
    submit: {
      method: "POST" as const,
      path: "/api/quiz-results",
      input: insertQuizResultSchema,
      responses: {
        201: z.custom<typeof quizResults.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
