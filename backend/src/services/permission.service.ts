import { AppError } from "../middlewares/error.middleware.js";
import type { PermissionModel } from "../models/permission.model.js";
import type {
  PermissionBodySchema,
  PermissionUpdatePayloadSchema,
} from "../schemas/permissions.schema.js";
import type { PaginationInterfaceHelper } from "../utils/queryHelper.js";

export const createPermissionService =
  (permissionModel: PermissionModel) =>
  async (payload: PermissionBodySchema) => {
    const permission = await permissionModel.createPermission(payload);
    if (!permission) {
      throw new AppError("Failed to create permission", 400);
    }
    return permission;
  };

export const getAllPermissionsService =
  (permissionModel: PermissionModel) =>
  async (query: PaginationInterfaceHelper) => {
    const permissions = await permissionModel.getAllPermissions(query);
    if (!permissions) {
      throw new AppError("Failed to get permissions", 400);
    }
    return {
      data: permissions.data,
      total: permissions.total,
      limit: permissions.limit,
    };
  };

export const getPermissionByIdService =
  (permissionModel: PermissionModel) => async (uuid: string) => {
    const permission = await permissionModel.getPermissionById(uuid);
    if (!permission) {
      throw new AppError("Permission not found", 404);
    }
    return permission;
  };

export const updatePermissionService =
  (permissionModel: PermissionModel) =>
  async (uuid: string, payload: PermissionUpdatePayloadSchema) => {
    const permission = await permissionModel.updatePermission(uuid, payload);
    if (!permission) {
      throw new AppError("Permission not found or failed to update", 404);
    }
    return permission;
  };

export const deletePermissionService =
  (permissionModel: PermissionModel) => async (uuid: string) => {
    const permission = await permissionModel.deletePermission(uuid);
    if (!permission) {
      throw new AppError("Permission not found or already deleted", 404);
    }
    return permission;
  };

export const getPermissionWithOutMenuService =
  (permissionModel: PermissionModel) => async () => {
    const permissions = await permissionModel.getPermissionWithOutMenu();
    if (!permissions) {
      throw new AppError("Failed to get permissions", 400);
    }
    return permissions;
  };

export const getPermissionMenuService =
  (permissionModel: PermissionModel) => async () => {
    const permissions = await permissionModel.getPermissionMenu();
    if (!permissions) {
      throw new AppError("Failed to get permissions", 400);
    }
    return permissions;
  };
