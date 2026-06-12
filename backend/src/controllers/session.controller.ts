import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { pool } from "../config/database.js";
import { createTransaction } from "../config/transaction.js";
import { supabase, STORAGE_BUCKET } from "../config/supabase.js";
import { AppError } from "../middlewares/error.middleware.js";
import { AnalysisHistoryModel } from "../models/analysis_history.model.js";
import { ReviewItemModel } from "../models/review_item.model.js";
import { UserModel } from "../models/user.model.js";
import {
  createHistoryService,
  getHistoriesService,
  getHistoryDashboardService,
  analyzeHistoryService,
  generateTitle,
} from "../services/session.service.js";


export const createSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user!;
    const file = req.file;

    if (!file) {
      throw new AppError("CSV file is required.", 400);
    }

    const historyUuid = randomUUID();
    const storagePath = `${user.uuid}/${historyUuid}.csv`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: "text/csv",
        upsert: false,
      });

    if (uploadError) {
      throw new AppError(`Failed to upload file: ${uploadError.message}`, 500);
    }

    const userModel = new UserModel(pool);
    const userDetails = await userModel.getDetails(user.email);
    const title = generateTitle(userDetails?.business_type ?? "UMKM");

    const history = await createTransaction(pool)(async (db) => {
      return createHistoryService(new AnalysisHistoryModel(db))({
        uuid: historyUuid,
        user_id: user.id,
        title,
        file_name: storagePath,
      });
    });

    res.status(201).json({
      success: true,
      message: "File uploaded and analysis history created.",
      data: {
        uuid: history.uuid,
        title: history.title,
        file_name: history.file_name,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const analyzeSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const uuid = req.params.uuid as string;
    const user = req.user!;

    const historyModel = new AnalysisHistoryModel(pool);
    const history = await historyModel.getByUuid(uuid);

    if (!history) throw new AppError("Analysis history not found.", 404);
    if (Number(history.user_id) !== Number(user.id)) throw new AppError("Access denied.", 403);

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(history.file_name, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new AppError("Failed to generate file access URL.", 500);
    }

    const result = await createTransaction(pool)(async (db) => {
      return analyzeHistoryService(
        new AnalysisHistoryModel(db),
        new ReviewItemModel(db),
        new UserModel(db),
      )(uuid, user.id, user.email, signedUrlData.signedUrl);
    });

    res.status(200).json({
      success: true,
      message: "Analysis completed successfully.",
      data: {
        history_uuid: result.history_uuid,
        total_reviews: result.chat_history.summary.total_reviews,
        crisis_count: result.chat_history.summary.crisis_count,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getSessionsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const histories = await getHistoriesService(
      new AnalysisHistoryModel(pool),
    )(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Histories retrieved successfully.",
      data: histories,
    });
  } catch (error) {
    next(error);
  }
};


export const getSessionDashboardController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const uuid = req.params.uuid as string;

    const data = await getHistoryDashboardService(
      new AnalysisHistoryModel(pool),
    )(uuid, req.user!.id);

    res.status(200).json({
      success: true,
      message: "Analysis history retrieved.",
      data,
    });
  } catch (error) {
    next(error);
  }
};
