import { z } from "zod";

export const createRolePayloadSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  permissions: z.array(z.string()).min(1, "Permission is required"),
});

export const createRolePayloadQuery = z.object({
  role_name: z.string().min(1, "Role name is required"),
  permissions: z
    .array(z.number().int().positive())
    .min(1, "Permission is required"),
});

export const roleParamsSchema = z.object({
  uuid: z.uuid("Invalid UUID format"),
});

export const updateRolePermissionPayloadSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  permissions: z.array(z.string()).min(1, "Permission is required"),
});

export const updateRolePermissionQuery = z.object({
  role_name: z.string().min(1, "Role name is required"),
  permissions: z
    .array(z.number().int().positive())
    .min(1, "Permission is required"),
});

export const getRoleQuerySchema = z.object({
  role_name: z.coerce.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

export type CreateRoleQuery = z.infer<typeof createRolePayloadQuery>;
export type CreateRolePayloaSchema = z.infer<typeof createRolePayloadSchema>;
export type UpdateRolePermissionPayload = z.infer<
  typeof updateRolePermissionPayloadSchema
>;
export type UpdateRolePermissionQuery = z.infer<
  typeof updateRolePermissionQuery
>;
export type RoleParamsSchema = z.infer<typeof roleParamsSchema>;
export type GetRoleQuerySchema = z.infer<typeof getRoleQuerySchema>;
