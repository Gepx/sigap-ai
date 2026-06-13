import type { NextFunction, Request, Response } from "express";
import { createTransaction } from "../config/transaction.js";
import { pool } from "../config/database.js";
import { AuthModel } from "../models/auth.model.js";
import {
  loginService,
  registerService,
  forgotPasswordService,
  verifyEmailService,
  resendVerificationService,
} from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const authModel = new AuthModel(db);
      const user = await registerService(authModel)(req.body);

      return res.status(200).json({
        success: true,
        message: "Register successful",
        data: {
          ...user,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const authModel = new AuthModel(db);
      const { user, token } = await loginService(authModel)(req.body);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          ...user,
          token,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const authModel = new AuthModel(db);
      const user = await forgotPasswordService(authModel)(req.body);

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: {
          ...user,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const authModel = new AuthModel(db);
      const { email, code } = req.body;
      const { user, token } = await verifyEmailService(authModel)(email, code);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: {
          ...user,
          token,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createTransaction(pool)(async (db) => {
      const authModel = new AuthModel(db);
      const { email } = req.body;
      const result = await resendVerificationService(authModel)(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    });
  } catch (error) {
    next(error);
  }
};
