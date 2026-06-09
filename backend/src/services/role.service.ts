import { AppError } from "../middlewares/error.middleware.js";
import type { PermissionModel } from "../models/permission.model.js";
import type { RoleModel } from "../models/role.model.js";
import type {
  CreateRolePayloaSchema,
  UpdateRolePermissionPayload,
} from "../schemas/role.schema.js";
import type { Role } from "../types/role.type.js";
import type { PaginationInterfaceHelper } from "../utils/queryHelper.js";

export const createRoleService =
  (model: { roleModel: RoleModel; permissionModel: PermissionModel }) =>
  async (payload: CreateRolePayloaSchema) => {
    const { permissionModel, roleModel } = model;
    const permissions_id = await permissionModel.getIdByUuidBulk(
      payload.permissions,
    );
    if (!permissions_id) {
      throw new AppError("Permission not found", 404);
    }
    const role = await roleModel.createRole({
      ...payload,
      permissions: permissions_id,
    });
    if (!role) {
      throw new AppError("Failed to create role", 400);
    }
    return role;
  };

export const getRoleService =
  (roleModel: RoleModel) => async (query: PaginationInterfaceHelper) => {
    const roles = await roleModel.getRoles(query);
    if (!roles) {
      throw new AppError("Role not found", 404);
    }
    return {
      data: roles.data,
      total: roles.total,
      limit: roles.limit,
    };
  };

export const updateRolePermissionService =
  (model: { roleModel: RoleModel; permissionModel: PermissionModel }) =>
  async (uuid: string, payload: UpdateRolePermissionPayload) => {
    const { permissionModel, roleModel } = model;
    const permissionId = await permissionModel.getIdByUuidBulk(
      payload.permissions,
    );

    const updatedRole = await roleModel.updateRolePermission(uuid, {
      ...payload,
      permissions: permissionId,
    });
    if (!updatedRole) {
      throw new AppError("Failed to update role permission", 404);
    }
    return updatedRole;
  };

export const deleteRoleService =
  (roleModel: RoleModel) => async (uuid: string) => {
    const deletedRole = await roleModel.deleteRole(uuid);
    if (!deletedRole) {
      throw new AppError("Failed to delete role", 404);
    }
    return deletedRole as Role;
  };
