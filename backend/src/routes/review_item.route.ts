import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import {
  getReviewItemsByHistoryIdController,
  getCrisisItemsByHistoryIdController,
} from "../controllers/review_item.controller.js";
import {
  reviewItemHistoryParamsSchema,
  reviewItemQuerySchema,
} from "../schemas/review_item.schema.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/history/:historyId",
  validateSchema(reviewItemHistoryParamsSchema, "params"),
  validateSchema(reviewItemQuerySchema, "query"),
  getReviewItemsByHistoryIdController,
);

router.get(
  "/history/:historyId/crisis",
  validateSchema(reviewItemHistoryParamsSchema, "params"),
  getCrisisItemsByHistoryIdController,
);

export default router;
