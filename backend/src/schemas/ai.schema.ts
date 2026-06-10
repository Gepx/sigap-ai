import { z } from "zod";

export const recommendationBodySchema = z.object({
  warning: z
    .object({
      topic: z.string().min(1, "Missing warning topic"),
      severity: z.string().optional(),
      sentiment_score: z.number().optional(),
    })
    .passthrough(),
  analysisId: z.uuid().optional(),
});

export const historyParamsSchema = z.object({
  id: z.uuid("Invalid analysis ID"),
});

export const createHistoryBodySchema = z.object({
  fileName: z.string().min(1, "Missing fileName"),
});

export const updateHistoryBodySchema = z.object({
  title: z.string().min(1, "Missing title"),
});

export type RecommendationBodySchema = z.infer<typeof recommendationBodySchema>;
export type HistoryParamsSchema = z.infer<typeof historyParamsSchema>;
export type CreateHistoryBodySchema = z.infer<typeof createHistoryBodySchema>;
export type UpdateHistoryBodySchema = z.infer<typeof updateHistoryBodySchema>;

export const draftBodySchema = z.object({
  recommendation: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .passthrough(),
  warningContext: z.any().optional(),
  analysisId: z.uuid().optional(),
});

export const chatBodySchema = z.object({
  message: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(z.object({ text: z.string() })),
      }),
    )
    .optional(),
  warningContext: z.any().optional(),
  analysisId: z.string().uuid().optional(),
});

export type DraftBodySchema = z.infer<typeof draftBodySchema>;
export type ChatBodySchema = z.infer<typeof chatBodySchema>;
