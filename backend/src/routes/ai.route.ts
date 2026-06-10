import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  getWarningsController,
  createRecommendationController,
  getHistoryController,
  getAnalysisByIdController,
  createHistoryController,
  updateHistoryController,
  deleteHistoryController,
  generateDraftController,
  generateChatReplyController,
} from "../controllers/ai.controller.js";
import {
  recommendationBodySchema,
  historyParamsSchema,
  createHistoryBodySchema,
  updateHistoryBodySchema,
  draftBodySchema,
  chatBodySchema,
} from "../schemas/ai.schema.js";

const router = Router();

router.get("/warnings", getWarningsController);

router.post(
  "/recommendation",
  authMiddleware,
  validateSchema(recommendationBodySchema, "body"),
  createRecommendationController
);

router.post(
  "/draft",
  authMiddleware,
  validateSchema(draftBodySchema, "body"),
  generateDraftController
);

router.post(
  "/chat",
  authMiddleware,
  validateSchema(chatBodySchema, "body"),
  generateChatReplyController
);

router.get("/history", authMiddleware, getHistoryController);

router.get(
  "/history/:id",
  authMiddleware,
  validateSchema(historyParamsSchema, "params"),
  getAnalysisByIdController
);

router.post(
  "/history",
  authMiddleware,
  validateSchema(createHistoryBodySchema, "body"),
  createHistoryController
);

router.patch(
  "/history/:id",
  authMiddleware,
  validateSchema(historyParamsSchema, "params"),
  validateSchema(updateHistoryBodySchema, "body"),
  updateHistoryController
);

router.delete(
  "/history/:id",
  authMiddleware,
  validateSchema(historyParamsSchema, "params"),
  deleteHistoryController
);

export default router;
