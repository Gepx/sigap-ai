import { Router } from "express";
import {
  changePasswordUserController,
  deleteUserController,
  getAllUserController,
  getUserByIdController,
  updateUserController,
  updateUserProfileController,
} from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  changeUserPasswordSchema,
  getUserEmailSchema,
  updateUserBodySchema,
  updateProfileBodySchema,
  userParamsSchema,
} from "../schemas/user.schema.js";

const UserRouter: Router = Router();

UserRouter.get(
  "/",
  validateSchema(getUserEmailSchema, "query"),
  getAllUserController,
);

UserRouter.get(
  "/:uuid",
  validateSchema(userParamsSchema, "params"),
  getUserByIdController,
);

UserRouter.post(
  "/change-password",
  validateSchema(changeUserPasswordSchema, "body"),
  changePasswordUserController,
);

UserRouter.put(
  "/profile",
  validateSchema(updateProfileBodySchema, "body"),
  updateUserProfileController,
);

UserRouter.put(
  "/:uuid",
  validateSchema(userParamsSchema, "params"),
  validateSchema(updateUserBodySchema, "body"),
  updateUserController,
);

UserRouter.delete(
  "/:uuid",
  validateSchema(userParamsSchema, "params"),
  deleteUserController,
);

export default UserRouter;
