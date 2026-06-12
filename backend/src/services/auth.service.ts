import { AppError } from "../middlewares/error.middleware.js";
import type { AuthModel } from "../models/auth.model.js";
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
} from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenHelper.js";

export const registerService =
  (authModel: AuthModel) => async (payload: RegisterSchema) => {
    const exisitingUser = await authModel.findUser(payload.email);

    if (exisitingUser) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await authModel.createUser({
      ...payload,
      password: hashedPassword,
    });

    if (!newUser) {
      throw new AppError("Failed to register", 400);
    }

    const { password: _, ...safeUser } = newUser;

    return {
      user: safeUser,
    };
  };

export const loginService =
  (authModel: AuthModel) => async (payload: LoginSchema) => {
    const user = await authModel.findUser(payload.email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const password = payload.password;

    if (!password) {
      throw new AppError("Password is required", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
    });

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  };

export const forgotPasswordService =
  (authModel: AuthModel) => async (payload: ForgotPasswordSchema) => {
    const user = await authModel.findUser(payload.email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (payload.newPassword !== payload.confirmPassword) {
      throw new AppError("New password and confirmation do not match", 400);
    }

    const isPasswordSame = await bcrypt.compare(
      payload.newPassword,
      user.password,
    );

    if (isPasswordSame) {
      throw new AppError("New Password cannot be the same as the old one", 400);
    }

    const newPassword = await bcrypt.hash(payload.newPassword, 10);

    const updatedUser = await authModel.updatePassword(
      payload.email,
      newPassword,
    );

    if (!updatedUser) {
      throw new AppError("Failed to change password", 400);
    }

    const { password: _, ...safeUser } = updatedUser;

    return {
      user: safeUser,
    };
  };
