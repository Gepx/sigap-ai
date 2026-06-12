import { Router } from "express";
import { csvUpload } from "../utils/upload.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { sessionParamsSchema } from "../schemas/session.schema.js";
import {
  createSessionController,
  analyzeSessionController,
  getSessionsController,
  getSessionDashboardController,
} from "../controllers/session.controller.js";

const SessionRouter = Router();

// Create a new session (upload CSV)
SessionRouter.post(
  "/",
  csvUpload.single("file"), // multer processes "file" field from FormData
  createSessionController,
);

// List all sessions for the authenticated user
SessionRouter.get("/", getSessionsController);

// Get session dashboard data (summary_json)
SessionRouter.get(
  "/:uuid",
  validateSchema(sessionParamsSchema, "params"),
  getSessionDashboardController,
);

// Trigger AI analysis for a session
SessionRouter.post(
  "/:uuid/analyze",
  validateSchema(sessionParamsSchema, "params"),
  analyzeSessionController,
);

export default SessionRouter;
