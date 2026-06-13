import { z } from "zod";

export const reviewItemHistoryParamsSchema = z.object({
  historyId: z.uuid("Invalid history ID format"),
});

export const reviewItemQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
});

export type ReviewItemHistoryParamsSchema = z.infer<
  typeof reviewItemHistoryParamsSchema
>;
export type ReviewItemQuerySchema = z.infer<typeof reviewItemQuerySchema>;
