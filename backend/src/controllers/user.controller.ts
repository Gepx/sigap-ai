import type { NextFunction, Request, Response } from "express";
import {
  changePasswordUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
  updateUserProfileService,
} from "../services/user.service.js";
import { UserModel } from "../models/user.model.js";
import { pool } from "../config/database.js";
import { pickKey } from "../utils/queryHelper.js";
import { createTransaction } from "../config/transaction.js";

export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userModel = new UserModel(pool);
    const { data, total, limit } = await getAllUserService(userModel)(
      res.locals.cleaned,
    );

    const filteredUser = data.map((user) =>
      pickKey(user, [
        "uuid",
        "name",
        "email",
        "role_name",
        "permissions",
        "created_at",
        "updated_at",
      ]),
    );

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: filteredUser,
      pagination: {
        total,
        limit,
        totalPages,
        currentPage: res.locals.cleaned.page ?? 1,
      },
      message: "Get Users Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userModel = new UserModel(pool);

    const uuid: string = res.locals.cleaned.uuid;

    const user = await getUserByIdService(userModel)(uuid);

    res.status(200).json({
      success: true,
      data: user,
      message: "Get User Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const changePasswordUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const userModel = new UserModel(db);

      const userEmail = req.user?.email;

      const user = await changePasswordUserService(userModel)(
        userEmail!,
        req.body,
      );

      const filteredUser = pickKey(user, [
        "uuid",
        "name",
        "email",
        "updated_at",
      ]);

      res.status(200).json({
        success: true,
        data: filteredUser,
        message: "Password Changed Successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const userModel = new UserModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const user = await updateUserService(userModel)(uuid, req.body);

      const filteredUser = pickKey(user, [
        "uuid",
        "name",
        "email",
        "avatar",
        "created_at",
        "updated_at",
      ]);

      res.status(200).json({
        success: true,
        data: filteredUser,
        message: "User Updated Successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const userModel = new UserModel(db);

      const userEmail = req.user?.email;

      const user = await updateUserProfileService(userModel)(
        userEmail!,
        req.body,
      );

      const filteredUser = pickKey(user, [
        "uuid",
        "name",
        "email",
        "business_name",
        "business_type",
        "avatar",
        "updated_at",
      ]);

      res.status(200).json({
        success: true,
        data: filteredUser,
        message: "Profile Updated Successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const userModel = new UserModel(db);

      const uuid: string = res.locals.cleaned.uuid;

      const user = await deleteUserService(userModel)(uuid);

      const filteredUser = pickKey(user, [
        "uuid",
        "name",
        "email",
        "deleted_at",
      ]);

      res.status(200).json({
        success: true,
        data: filteredUser,
        message: "User Deleted Successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};
