import { Router } from "express";
import {
  loginController,
  registerController,
  forgotPasswordController,
  logoutController,
  getMeController,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../schemas/auth.schema.js";
import { authLimiter } from "../utils/rateLimiter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const AuthRouter: Router = Router();

AuthRouter.post(
  "/register",
  authLimiter,
  validateSchema(registerSchema, "body"),
  registerController,
);
AuthRouter.post("/login", authLimiter, validateSchema(loginSchema, "body"), loginController);
AuthRouter.post("/logout", logoutController);
AuthRouter.post(
  "/forgot-password",
  authLimiter,
  validateSchema(forgotPasswordSchema, "body"),
  forgotPasswordController,
);
// GET current user profile (requires auth)
AuthRouter.get("/me", authMiddleware, getMeController);

export default AuthRouter;
