import { AppError } from "../middlewares/error.middleware.js";
import type { AnalysisModel } from "../models/ai.model.js";
import { checkWarnings } from "./warning.service.js";
import {
  generateRecommendation,
  generateDraft,
  generateChatReply,
} from "./rag.service.js";
import type {
  RecommendationBodySchema,
  CreateHistoryBodySchema,
  UpdateHistoryBodySchema,
  DraftBodySchema,
  ChatBodySchema,
} from "../schemas/ai.schema.js";

// *** Warning ***
export const getWarningsService = () => {
  return checkWarnings();
};

// *** Recommendation ***
export const generateRecommendationService =
  (analysisModel: AnalysisModel) =>
  async (userId: number, payload: RecommendationBodySchema) => {
    const { warning, analysisId } = payload;

    const recommendation = await generateRecommendation(warning as any);

    if (analysisId) {
      await analysisModel.saveRecommendation(
        analysisId,
        userId,
        recommendation,
      );
    }

    return recommendation;
  };

// *** Draft ***
export const generateDraftService =
  (analysisModel: AnalysisModel) =>
  async (userId: number, payload: DraftBodySchema) => {
    const { recommendation, warningContext, analysisId } = payload;
    const generatedDraft = await generateDraft(recommendation, warningContext);

    if (analysisId) {
      const analysis = await analysisModel.getAnalysisById(analysisId, userId);
      if (analysis && analysis.recommendation) {
        try {
          const recStr = analysis.recommendation
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          const recArray = JSON.parse(recStr);

          const updatedArray = Array.isArray(recArray)
            ? recArray.map((r: any) => {
                if (
                  (r.id && r.id === recommendation.id) ||
                  (r.title && r.title === recommendation.title)
                ) {
                  return { ...r, draft: generatedDraft };
                }
                return r;
              })
            : recArray;

          await analysisModel.saveRecommendation(
            analysisId,
            userId,
            JSON.stringify(updatedArray),
          );
        } catch (e) {
          console.error(
            "Failed to parse and update recommendation with draft",
            e,
          );
        }
      }
    }

    return generatedDraft;
  };

// *** Chat ***
export const generateChatReplyService =
  (analysisModel: AnalysisModel) =>
  async (userId: number, payload: ChatBodySchema) => {
    const { message, history, warningContext, analysisId } = payload;
    const generatedReply = await generateChatReply(
      message,
      history,
      warningContext,
    );

    if (analysisId) {
      const newHistory = [
        ...(history || []),
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: generatedReply }] },
      ];
      await analysisModel.saveChatHistory(analysisId, userId, newHistory);
    }

    return generatedReply;
  };

// *** History ***
export const getHistoryService =
  (analysisModel: AnalysisModel) => async (userId: number) => {
    return analysisModel.getHistoryByUserId(userId);
  };

export const getAnalysisByIdService =
  (analysisModel: AnalysisModel) => async (uuid: string, userId: number) => {
    const analysis = await analysisModel.getAnalysisById(uuid, userId);

    if (!analysis) {
      throw new AppError("Analysis not found", 404);
    }

    return analysis;
  };

export const createHistoryService =
  (analysisModel: AnalysisModel) =>
  async (userId: number, payload: CreateHistoryBodySchema) => {
    const title = payload.fileName.replace(".csv", "");
    const detail = "Analysis created";

    const newAnalysis = await analysisModel.createAnalysis(
      userId,
      title,
      detail,
      payload.fileName,
    );

    return newAnalysis;
  };

export const updateHistoryService =
  (analysisModel: AnalysisModel) =>
  async (uuid: string, userId: number, payload: UpdateHistoryBodySchema) => {
    const updated = await analysisModel.updateAnalysisTitle(
      uuid,
      userId,
      payload.title,
    );

    if (!updated) {
      throw new AppError("Analysis not found or could not be updated", 404);
    }

    return updated;
  };

export const deleteHistoryService =
  (analysisModel: AnalysisModel) => async (uuid: string, userId: number) => {
    const deleted = await analysisModel.softDeleteAnalysis(uuid, userId);

    if (!deleted) {
      throw new AppError("Analysis not found or could not be deleted", 404);
    }

    return deleted;
  };
