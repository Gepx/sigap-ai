import type { NextFunction, Request, Response } from "express";
import { createTransaction } from "../config/transaction.js";
import { pool } from "../config/database.js";
import { RoleModel } from "../models/role.model.js";
import { PermissionModel } from "../models/permission.model.js";
import {
  createRoleService,
  deleteRoleService,
  getRoleService,
  updateRolePermissionService,
} from "../services/role.service.js";
import { pickKey } from "../utils/queryHelper.js";

export const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const roleModel = new RoleModel(db);
      const permissionModel = new PermissionModel(db);
      const role = await createRoleService({ roleModel, permissionModel })(
        req.body,
      );
      const filteredRole = pickKey(role, [
        "role_name",
        "uuid",
      ]);
      res.status(201).json({
        success: true,
        data: filteredRole,
        message: "Role created successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const getRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roleModel = new RoleModel(pool);
    const { data, total, limit } = await getRoleService(roleModel)(
      res.locals.cleaned,
    );
    const filteredRole = data.map((item) =>
      pickKey(item, ["id", "role_name", "permissions", "uuid"]),
    );
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: filteredRole,
      pagination: {
        total,
        limit,
        totalPages,
        currentPage: res.locals.cleaned.page ?? 1,
      },
      message: "Roles fetched successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateRolePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const roleModel = new RoleModel(db);
      const permissionModel = new PermissionModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const role = await updateRolePermissionService({
        roleModel,
        permissionModel,
      })(uuid, req.body);

      const filteredRole = pickKey(role, [
        "role_name",
        "uuid",
      ]);

      res.status(200).json({
        success: true,
        data: filteredRole,
        message: "Role permission updated successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const roleModel = new RoleModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const role = await deleteRoleService(roleModel)(uuid);

      res.status(200).json({
        success: true,
        data: pickKey(role, ["role_name", "uuid"]),
        message: "Role deleted successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};
