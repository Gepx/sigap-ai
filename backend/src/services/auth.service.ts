import { AppError } from "../middlewares/error.middleware.js";
import type { AuthModel } from "../models/auth.model.js";
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
} from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenHelper.js";
import { sendVerificationEmail } from "./email.service.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await authModel.updateVerificationCode(newUser.email, otp, expiresAt);
    await sendVerificationEmail(newUser.email, otp);

    const { password: _, ...safeUser } = newUser;

    return {
      user: safeUser,
      message: "Registration successful. Please verify your email.",
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

    if (!user.is_verified) {
      throw new AppError("Please verify your email address to continue", 403);
    }

    const token = generateToken({
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

export const verifyEmailService =
  (authModel: AuthModel) => async (email: string, code: string) => {
    const user = await authModel.findUser(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.is_verified) {
      throw new AppError("Email is already verified", 400);
    }

    if (!user.verification_code || user.verification_code !== code) {
      throw new AppError("Invalid verification code", 400);
    }

    if (!user.verification_code_expires_at || user.verification_code_expires_at < new Date()) {
      throw new AppError("Verification code has expired", 400);
    }

    const verifiedUser = await authModel.verifyUser(email);

    const token = generateToken({
      uuid: verifiedUser.uuid,
      name: verifiedUser.name,
      email: verifiedUser.email,
      role_id: verifiedUser.role_id,
    });

    const { password: _, ...safeUser } = verifiedUser;

    return {
      user: safeUser,
      token,
    };
  };

export const resendVerificationService =
  (authModel: AuthModel) => async (email: string) => {
    const user = await authModel.findUser(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.is_verified) {
      throw new AppError("Email is already verified", 400);
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await authModel.updateVerificationCode(email, otp, expiresAt);
    await sendVerificationEmail(email, otp);

    return {
      message: "Verification code sent to your email",
    };
  };
