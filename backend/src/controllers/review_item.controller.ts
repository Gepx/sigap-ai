import type { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { ReviewItemModel } from "../models/review_item.model.js";
import {
  getReviewItemsByHistoryIdService,
  getCrisisItemsByHistoryIdService,
} from "../services/review_item.service.js";

export const getReviewItemsByHistoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const historyId = req.params.historyId as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const page = parseInt(req.query.page as string) || 1;

    const reviewItemModel = new ReviewItemModel(pool);
    const result = await getReviewItemsByHistoryIdService(reviewItemModel)(
      historyId,
      limit,
      page,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Fetched review items successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCrisisItemsByHistoryIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const historyId = req.params.historyId as string;
    const reviewItemModel = new ReviewItemModel(pool);
    const result =
      await getCrisisItemsByHistoryIdService(reviewItemModel)(historyId);

    res.status(200).json({
      success: true,
      data: result,
      message: "Fetched crisis items successfully",
    });
  } catch (error) {
    next(error);
  }
};
