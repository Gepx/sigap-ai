import type { NextFunction, Request, Response } from "express";
import { pool } from "../config/database.js";
import { PermissionModel } from "../models/permission.model.js";
import {
  createPermissionService,
  deletePermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  getPermissionMenuService,
  getPermissionWithOutMenuService,
  updatePermissionService,
} from "../services/permission.service.js";
import { pickKey } from "../utils/queryHelper.js";
import { createTransaction } from "../config/transaction.js";

export const createPermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const permissionModel = new PermissionModel(db);
      const permission = await createPermissionService(permissionModel)(
        req.body,
      );

      const filteredPermission = pickKey(permission, [
        "uuid",
        "is_menu",
        "route",
        "method",
        "permission_name",
        "created_at",
      ]);

      res.status(201).json({
        success: true,
        data: filteredPermission,
        message: "Permission created successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPermissionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const permissionModel = new PermissionModel(pool);

    const { data, total, limit } = await getAllPermissionsService(
      permissionModel,
    )(res.locals.cleaned);

    const filteredPermissions = data.map((permission) => {
      return pickKey(permission, [
        "uuid",
        "is_menu",
        "method",
        "route",
        "permission_name",
        "created_at",
        "updated_at",
      ]);
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: filteredPermissions,
      pagination: {
        total,
        limit,
        totalPages,
        currentPage: res.locals.cleaned.page ?? 1,
      },
      message: "Get all permissions successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const permissionModel = new PermissionModel(pool);

    const uuid: string = res.locals.cleaned.uuid;

    const permission = await getPermissionByIdService(permissionModel)(uuid);

    const filteredPermission = pickKey(permission, [
      "uuid",
      "route",
      "is_menu",
      "method",
      "permission_name",
      "created_at",
      "updated_at",
    ]);

    res.status(200).json({
      success: true,
      data: filteredPermission,
      message: "Get permission successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const permissionModel = new PermissionModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const permission = await updatePermissionService(permissionModel)(
        uuid,
        req.body,
      );

      const filteredPermission = pickKey(permission, [
        "uuid",
        "route",
        "is_menu",
        "method",
        "permission_name",
        "created_at",
        "updated_at",
      ]);

      res.status(200).json({
        success: true,
        data: filteredPermission,
        message: "Permission updated successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const deletePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const permissionModel = new PermissionModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const permission = await deletePermissionService(permissionModel)(uuid);

      res.status(200).json({
        success: true,
        data: pickKey(permission, [
          "uuid",
          "route",
          "is_menu",
          "method",
          "permission_name",
          "deleted_at",
        ]),
        message: "Permission deleted successfully!",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissionWithOutMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const permissionModel = new PermissionModel(pool);
    const data = await getPermissionWithOutMenuService(permissionModel)();

    const filteredPermissions = data.map((permission) => {
      return pickKey(permission, [
        "uuid",
        "method",
        "route",
        "is_menu",
        "permission_name",
        "created_at",
        "updated_at",
      ]);
    });

    res.status(200).json({
      success: true,
      data: filteredPermissions,
      message: "Get all permissions successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissionMenuController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const permissionModel = new PermissionModel(pool);
    const data = await getPermissionMenuService(permissionModel)();

    const filteredPermissions = data.map((permission) => {
      return pickKey(permission, [
        "uuid",
        "method",
        "route",
        "is_menu",
        "permission_name",
        "created_at",
        "updated_at",
      ]);
    });

    res.status(200).json({
      success: true,
      data: filteredPermissions,
      message: "Get all permissions successfully!",
    });
  } catch (error) {
    next(error);
  }
};
