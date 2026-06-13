import { ReviewItemModel } from "../models/review_item.model.js";
import { AppError } from "../middlewares/error.middleware.js";

export const getReviewItemsByHistoryIdService =
  (reviewItemModel: ReviewItemModel) =>
  async (historyId: string, limit: number = 50, page: number = 1) => {
    if (!historyId) throw new AppError("History ID is required", 400);
    return await reviewItemModel.getByHistoryId(historyId, limit, page);
  };

export const getCrisisItemsByHistoryIdService =
  (reviewItemModel: ReviewItemModel) => async (historyId: string) => {
    if (!historyId) throw new AppError("History ID is required", 400);
    return await reviewItemModel.getCrisisByHistoryId(historyId);
  };
