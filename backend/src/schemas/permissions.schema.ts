import { z } from "zod";

export const permissionBodySchema = z.object({
  route: z
    .string()
    .min(1, { message: "Route is required." })
    .startsWith("/", { message: "Route must start with a '/'" }),
  permission_name: z
    .string()
    .min(1, { message: "Permission name is required." }),
  method: z.array(z.enum(["GET", "POST", "PUT", "DELETE"])).optional(),
  is_menu: z.boolean(),
});

export const permissionParamsSchema = z.object({
  uuid: z.uuid("Invalid UUID format"),
});

export const permissionUpdatePayloadSchema = z.object({
  permission_name: z.string().min(1, "Permission name is required"),
  route: z
    .string()
    .min(1, "Route is required")
    .startsWith("/", "Route must start with /"),
  method: z.array(z.enum(["GET", "POST", "PUT", "DELETE"])).optional(),
  is_menu: z.boolean(),
});

export const permissionQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  route: z.string().optional(),
  permission_name: z.string().optional(),
});

export type PermissionBodySchema = z.infer<typeof permissionBodySchema>;
export type PermissionParamsSchema = z.infer<typeof permissionParamsSchema>;
export type PermissionQuerySchema = z.infer<typeof permissionQuerySchema>;

export type PermissionUpdatePayloadSchema = z.infer<
  typeof permissionUpdatePayloadSchema
>;
