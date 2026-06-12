import { z } from "zod";

export const sessionParamsSchema = z.object({
  uuid: z.uuid("Invalid session UUID"),
});

export type SessionParamsSchema = z.infer<typeof sessionParamsSchema>;
