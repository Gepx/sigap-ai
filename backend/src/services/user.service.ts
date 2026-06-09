import { AppError } from "../middlewares/error.middleware.js";
import type { UserModel } from "../models/user.model.js";
import type {
  ChangeUserPasswordSchema,
  UpdateUserBodySchema,
  UpdateProfileBodySchema,
} from "../schemas/user.schema.js";
import type { PaginationInterfaceHelper } from "../utils/queryHelper.js";
import bcrypt from "bcrypt";

export const getAllUserService =
  (userModel: UserModel) => async (query: PaginationInterfaceHelper) => {
    const result = await userModel.getAllUser(query);
    if (result.total > 0 && result.data.length === 0) {
      throw new AppError(
        "Page not found. The requested page does not exist.",
        404,
      );
    }

    return {
      data: result.data,
      total: result.total,
      limit: result.limit,
    };
  };

export const getUserByIdService =
  (userModel: UserModel) => async (uuid: string) => {
    const result = await userModel.getUserById(uuid);

    if (!result) {
      throw new AppError("User not found", 404);
    }

    return result;
  };

export const changePasswordUserService =
  (userModel: UserModel) =>
  async (email: string, payload: ChangeUserPasswordSchema) => {
    if (!email) {
      throw new AppError("User not found", 404);
    }

    if (payload.newPassword !== payload.confirmPassword) {
      throw new AppError(
        "New password and confirmation do not match",
        400,
      );
    }

    const userDetails = await userModel.getDetails(email);

    if (!userDetails) {
      throw new AppError("User not found", 404);
    }

    const isValid = await bcrypt.compare(
      payload.currentPassword,
      userDetails.password,
    );

    if (!isValid) {
      throw new AppError("Current Password is incorrect", 400);
    }

    const isPasswordSame = await bcrypt.compare(
      payload.newPassword,
      userDetails.password,
    );

    if (isPasswordSame) {
      throw new AppError("New Password cannot be the same as the old one", 400);
    }

    const newPassword = await bcrypt.hash(payload.newPassword, 10);

    const user = await userModel.changePasswordUser(email, newPassword);

    if (!user) {
      throw new AppError("Failed to change password", 400);
    }

    return user;
  };

export const updateUserService =
  (userModel: UserModel) =>
  async (uuid: string, payload: UpdateUserBodySchema) => {
    const user = await userModel.updateUser(uuid, payload);

    if (!user) {
      throw new AppError("Failed to update user", 400);
    }

    return user;
  };

export const updateUserProfileService =
  (userModel: UserModel) =>
  async (email: string, payload: UpdateProfileBodySchema) => {
    const user = await userModel.updateUserProfile(email, payload);

    if (!user) {
      throw new AppError("Failed to update user profile", 400);
    }

    return user;
  };

export const deleteUserService =
  (userModel: UserModel) => async (uuid: string) => {
    const user = await userModel.deleteUser(uuid);

    if (!user) {
      throw new AppError("Failed to delete user", 400);
    }

    return user;
  };
