import type { NextFunction, Request, Response } from "express";
import {
  getWarningsService,
  generateRecommendationService,
  getHistoryService,
  getAnalysisByIdService,
  createHistoryService,
  updateHistoryService,
  deleteHistoryService,
  generateDraftService,
  generateChatReplyService,
} from "../services/ai.service.js";
import { AnalysisModel } from "../models/ai.model.js";
import { UserModel } from "../models/user.model.js";
import { pool } from "../config/database.js";
import { AppError } from "../middlewares/error.middleware.js";

const getUserFromRequest = async (req: Request) => {
  if (!req.user || !req.user.uuid) {
    throw new AppError("Unauthorized", 401);
  }
  const userModel = new UserModel(pool);
  const user = await userModel.getUserById(req.user.uuid);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getWarningsController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const warnings = getWarningsService();
    res.status(200).json({
      success: true,
      data: warnings,
      message: "Fetched warnings successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createRecommendationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const recommendation = await generateRecommendationService(analysisModel)(
      user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: recommendation,
      message: "Recommendation generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateDraftController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const draft = await generateDraftService(analysisModel)(user.id, req.body);

    res.status(200).json({
      success: true,
      data: draft,
      message: "Draft generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateChatReplyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const reply = await generateChatReplyService(analysisModel)(
      user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: reply,
      message: "Chat reply generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const history = await getHistoryService(analysisModel)(user.id);

    res.status(200).json({
      success: true,
      data: history,
      message: "Fetched history successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const { id } = res.locals.cleaned;

    const analysis = await getAnalysisByIdService(analysisModel)(id, user.id);

    res.status(200).json({
      success: true,
      data: analysis,
      message: "Fetched analysis successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const newAnalysis = await createHistoryService(analysisModel)(
      user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: newAnalysis,
      message: "Analysis history created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const id = req.params.id as string;

    const updated = await updateHistoryService(analysisModel)(
      id,
      user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: "Analysis history updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getUserFromRequest(req);
    const analysisModel = new AnalysisModel(pool);

    const id = req.params.id as string;

    await deleteHistoryService(analysisModel)(id, user.id);

    res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
