import { AppError } from "../middlewares/error.middleware.js";
import type { AnalysisHistoryModel } from "../models/analysis_history.model.js";
import type { ReviewItemModel } from "../models/review_item.model.js";
import type { UserModel } from "../models/user.model.js";
import type { AnalysisHistory,SummaryJson } from "../types/analysis_history.type.js";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5000";
const ANALYZE_TIMEOUT_MS = 180_000; // 3 minutes

/**
 * Generate a human-readable title automatically.
 * Format: "{business_type} — {date in id-ID locale}"
 * Example: "Kuliner — 11 Jun 2026"
 */
export const generateTitle = (businessType: string): string => {
  const date = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${businessType || "UMKM"} — ${date}`;
};

// ─── Create History ───────────────────────────────────────────────────────────
// Called right after CSV upload to Supabase Storage.

export const createHistoryService =
  (historyModel: AnalysisHistoryModel) =>
  async (payload: {
    uuid: string;
    user_id: number;
    title: string;
    file_name: string;
  }): Promise<AnalysisHistory> => {
    const history = await historyModel.create(payload);

    if (!history) {
      throw new AppError("Failed to create analysis history.", 500);
    }

    return history;
  };


export const getHistoriesService =
  (historyModel: AnalysisHistoryModel) =>
  async (userId: number): Promise<AnalysisHistory[]> => {
    return historyModel.getByUserId(userId);
  };


export const getHistoryDashboardService =
  (historyModel: AnalysisHistoryModel) =>
  async (uuid: string, userId: number) => {
    const history = await historyModel.getByUuid(uuid);

    if (!history) {
      throw new AppError("Analysis history not found.", 404);
    }

    if (Number(history.user_id) !== Number(userId)) {
      throw new AppError("Access denied. This history belongs to another user.", 403);
    }

    return {
      history,
      chat_history: history.chat_history ?? null,
      has_analysis: !!history.recommendation,
    };
  };


export const analyzeHistoryService =
  (
    historyModel: AnalysisHistoryModel,
    reviewItemModel: ReviewItemModel,
    userModel: UserModel,
  ) =>
  async (
    historyUuid: string,
    userId: number,
    userEmail: string,
    signedFileUrl: string,
  ) => {
    const history = await historyModel.getByUuid(historyUuid);
    if (!history) throw new AppError("Analysis history not found.", 404);
    if (Number(history.user_id) !== Number(userId)) throw new AppError("Access denied.", 403);

    if (history.recommendation !== null) {
      throw new AppError("This history has already been analyzed.", 409);
    }

    const userDetails = await userModel.getDetails(userEmail);
    const businessContext =
      userDetails?.business_type && userDetails?.business_name
        ? `${userDetails.business_type} - ${userDetails.business_name}`
        : "UMKM";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

    let pythonResult: { chat_history: SummaryJson; review_items: ReviewItemPayload[] };

    try {
      const response = await fetch(`${PYTHON_SERVICE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_url: signedFileUrl,
          business_context: businessContext,
          session_id: historyUuid, // Python still calls it session_id internally
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "Unknown error");
        throw new AppError(
          `AI service returned an error: ${response.status} — ${errorBody}`,
          502,
        );
      }

      pythonResult = await response.json();
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new AppError(
          "AI analysis timed out. Please try again with a smaller file.",
          504,
        );
      }
      throw err;
    }

    const { chat_history, review_items } = pythonResult;

    await reviewItemModel.bulkInsert(historyUuid, review_items);

    const total = chat_history.summary.total_reviews;
    const crisis = chat_history.summary.crisis_count;
    const detail = `${total.toLocaleString("id-ID")} ulasan${crisis > 0 ? ` · ${crisis} krisis terdeteksi` : ""}`;

    await historyModel.updateAfterAnalysis(historyUuid, {
      recommendation: chat_history.recommendation?.summary ?? "",
      chat_history,
      detail,
    });

    return {
      history_uuid: historyUuid,
      chat_history,
    };
  };


interface ReviewItemPayload {
  review_text: string;
  sentiment: string;
  aspect: string;
  confidence_score: number;
  is_crisis: boolean;
}
