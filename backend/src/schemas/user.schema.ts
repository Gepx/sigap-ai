import { z } from "zod";

export const getUserEmailSchema = z.object({
  email: z.coerce.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const userParamsSchema = z.object({
  uuid: z.uuid(),
});

export const updateUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role_id: z.coerce.number().int().positive(),
  avatar: z.string().nullable().optional(),
});

export const updateProfileBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().nullable().optional(),
});

export const changeUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current Password is required"),
  newPassword: z.string().min(1, "New Password is required"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export type GetUserEmailSchema = z.infer<typeof getUserEmailSchema>;
export type UserParamsSchema = z.infer<typeof userParamsSchema>;
export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;
export type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>;
export type ChangeUserPasswordSchema = z.infer<typeof changeUserPasswordSchema>;
