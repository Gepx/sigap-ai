import { AppError } from "../middlewares/error.middleware.js";
import type { AnalysisModel } from "../models/ai.model.js";
import { parse } from "csv-parse/sync";
import { supabase } from "../config/supabase.js";
import { ReviewItemModel } from "../models/review_item.model.js";
import crypto from "crypto";
import { pool } from "../config/database.js";
import { checkWarnings } from "./warning.service.js";
import {
  generateRecommendation,
  generateRecommendationFromDashboard,
  generateDraft,
  generateChatReply,
  extractAspectsWithGemini,
} from "./rag.service.js";
import type {
  RecommendationBodySchema,
  CreateHistoryBodySchema,
  UpdateHistoryBodySchema,
  DraftBodySchema,
  ChatBodySchema,
} from "../schemas/ai.schema.js";

const MODEL_API_URL = process.env.MODEL_API_URL || "http://localhost:8000";

export interface PredictSentimentPayload {
  text: string;
  business_category?: string;
  review_aspect?: string;
  crisis_flag?: string;
  is_sarcasm?: string;
}

export interface PredictBatchPayload {
  reviews: PredictSentimentPayload[];
}

export const predictSentimentService = async (
  payload: PredictSentimentPayload,
) => {
  try {
    const response = await fetch(`${MODEL_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new AppError(
        `Model API error: ${response.status} - ${errorBody}`,
        502,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to connect to Model API. Is the FastAPI server running?",
      503,
    );
  }
};

export const predictBatchSentimentService = async (
  payload: PredictBatchPayload,
) => {
  try {
    const response = await fetch(`${MODEL_API_URL}/predict/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new AppError(
        `Model API error: ${response.status} - ${errorBody}`,
        502,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to connect to Model API. Is the FastAPI server running?",
      503,
    );
  }
};

export const getModelInfoService = async () => {
  try {
    const response = await fetch(`${MODEL_API_URL}/model-info`);
    if (!response.ok) {
      throw new AppError("Model API unavailable", 503);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to connect to Model API. Is the FastAPI server running?",
      503,
    );
  }
};

// *** Warning ***
export const getWarningsService = () => {
  return [];
};

// *** Recommendation ***
export const generateRecommendationService =
  (analysisModel: AnalysisModel) =>
  async (userId: number, payload: RecommendationBodySchema) => {
    const { warning, dashboardData, analysisId } = payload;

    let recommendation: string;

    if (warning && warning.topic && warning.triggerData) {
      recommendation = await generateRecommendation(warning as any);
    } else if (dashboardData) {
      recommendation = await generateRecommendationFromDashboard(dashboardData);
    } else {
      recommendation = JSON.stringify([
        {
          id: "fallback-1",
          title: "No Data Available",
          priority: "Medium",
          description:
            "Tidak ada data analisis yang tersedia untuk menghasilkan rekomendasi. Silakan unggah file CSV terlebih dahulu.",
          impact: "Rekomendasi akan tersedia setelah data diproses.",
        },
      ]);
    }

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
    const { message, history, warningContext, dashboardData, analysisId } =
      payload;

    if (analysisId) {
      try {
        const reviewItemModel = new ReviewItemModel(pool);
        const { data } = await reviewItemModel.getByHistoryId(
          analysisId,
          50,
          1,
        );
        if (data && data.length > 0) {
          if (!dashboardData) payload.dashboardData = {};
          payload.dashboardData.sample_reviews = data.map((r) => ({
            text: r.review_text,
            sentiment: r.sentiment,
            aspect: r.aspect,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch review items for chat context", error);
      }
    }

    const generatedReply = await generateChatReply(
      message,
      history,
      warningContext,
      payload.dashboardData || dashboardData,
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

export const processCsvAnalysisService = async (
  analysisModel: AnalysisModel,
  userId: number,
  businessContext: string,
  file: Express.Multer.File,
  timeline: string = "1 Month",
) => {
  // 1. Upload to Supabase Storage
  const uniqueFilename = `${userId}-${Date.now()}-${file.originalname}`;
  const { data: storageData, error: storageError } = await supabase.storage
    .from("datasets")
    .upload(uniqueFilename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (storageError) {
    console.warn("Failed to upload to Supabase:", storageError);
  }

  // 2. Parse CSV
  const csvText = file.buffer.toString("utf-8");
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  if (records.length === 0) {
    throw new AppError("The uploaded CSV is empty.", 400);
  }

  // 3. AI Inference (FastAPI)
  const validRecords = records.filter((row: any) => {
    const text =
      row["review_text"] ||
      row["Review/Comment"] ||
      row["review"] ||
      row["Review"] ||
      "";
    return text.trim() !== "";
  });

  if (validRecords.length === 0) {
    throw new AppError("The uploaded CSV contains no valid reviews.", 400);
  }

  const batchPayload: PredictBatchPayload = {
    reviews: validRecords.map((row: any) => ({
      text:
        row["review_text"] ||
        row["Review/Comment"] ||
        row["review"] ||
        row["Review"] ||
        "",
      business_category: row["business_category"] || businessContext,
    })),
  };

  const predictions = await predictBatchSentimentService(batchPayload);
  const results = predictions.predictions || [];

  // 4. Calculate Summaries & Aspect/Channel/Time/Word Breakdown
  let pos = 0;
  let neg = 0;
  let neu = 0;
  let totalConfidence = 0;
  let crisisCount = 0;
  const aspectMap: Record<
    string,
    { positive: number; negative: number; neutral: number }
  > = {};
  const channelMap: Record<
    string,
    { positive: number; negative: number; neutral: number }
  > = {};
  const timeSeriesMap: Record<
    string,
    {
      positive: number;
      negative: number;
      neutral: number;
      channels: Record<string, number>;
    }
  > = {};
  const wordFreqMap: Record<
    string,
    { positive: number; negative: number; neutral: number }
  > = {};
  const earlyWarnings: any[] = [];
  const reviewItemsPayload: any[] = [];

  const stopWords = new Set([
    "dan",
    "di",
    "ke",
    "dari",
    "yang",
    "untuk",
    "ini",
    "itu",
    "dengan",
    "saya",
    "tidak",
    "ada",
    "pada",
    "juga",
    "akan",
    "dalam",
    "bisa",
    "sudah",
    "lagi",
    "karena",
    "kalau",
    "buat",
    "tapi",
    "banyak",
    "sangat",
    "cukup",
    "lebih",
  ]);

  const allReviewTexts = batchPayload.reviews.map((r) => r.text);
  const extractedAspects = await extractAspectsWithGemini(allReviewTexts);
  console.log("DEBUG: First record:", records[0]);
  console.log(
    "DEBUG: First 5 extracted aspects:",
    extractedAspects.slice(0, 5),
  );

  results.forEach((res: any, idx: number) => {
    const sentiment = res.sentiment;
    const originalRecord: any = validRecords[idx] || {};
    const originalText = batchPayload.reviews[idx]?.text || "";

    const aspect = extractedAspects[idx] || "Lainnya";

    const channel =
      originalRecord["platform_source"] ||
      originalRecord["platform"] ||
      originalRecord["Platform"] ||
      "CSV Upload";

    // Use date from CSV row, or fallback to today
    const rawDate =
      originalRecord["date"] ||
      originalRecord["timestamp"] ||
      originalRecord["tanggal"] ||
      originalRecord["Tanggal"] ||
      new Date().toISOString().split("T")[0];
    // Normalize date to YYYY-MM-DD
    const dateStr = rawDate.length > 10 ? rawDate.substring(0, 10) : rawDate;

    const conf = res.confidence || 0.0;
    const isCrisis = conf > 0.7 && sentiment === "Negative";

    if (sentiment === "Positive") pos++;
    else if (sentiment === "Negative") neg++;
    else neu++;

    totalConfidence += conf;
    if (isCrisis) crisisCount++;

    if (!aspectMap[aspect]) {
      aspectMap[aspect] = { positive: 0, negative: 0, neutral: 0 };
    }
    if (sentiment === "Positive") aspectMap[aspect].positive++;
    else if (sentiment === "Negative") aspectMap[aspect].negative++;
    else aspectMap[aspect].neutral++;

    // Channel breakdown (by platform_source)
    if (!channelMap[channel]) {
      channelMap[channel] = { positive: 0, negative: 0, neutral: 0 };
    }
    if (sentiment === "Positive") channelMap[channel].positive++;
    else if (sentiment === "Negative") channelMap[channel].negative++;
    else channelMap[channel].neutral++;

    // Time series breakdown
    if (!timeSeriesMap[dateStr]) {
      timeSeriesMap[dateStr] = {
        positive: 0,
        negative: 0,
        neutral: 0,
        channels: {},
      };
    }
    if (sentiment === "Positive") timeSeriesMap[dateStr].positive++;
    else if (sentiment === "Negative") timeSeriesMap[dateStr].negative++;
    else timeSeriesMap[dateStr].neutral++;

    timeSeriesMap[dateStr].channels[channel] =
      (timeSeriesMap[dateStr].channels[channel] || 0) + 1;

    // Word frequency tokenization
    const words = originalText
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .split(/\s+/);
    words.forEach((word) => {
      if (word.length > 3 && !stopWords.has(word)) {
        if (!wordFreqMap[word]) {
          wordFreqMap[word] = { positive: 0, negative: 0, neutral: 0 };
        }
        if (sentiment === "Positive") wordFreqMap[word].positive++;
        else if (sentiment === "Negative") wordFreqMap[word].negative++;
        else wordFreqMap[word].neutral++;
      }
    });

    reviewItemsPayload.push({
      review_text: originalText,
      sentiment: sentiment,
      aspect: aspect,
      confidence_score: conf,
      is_crisis: isCrisis,
      date: dateStr,
      platform_source: channel,
    });

    if (isCrisis) {
      earlyWarnings.push({
        id: `rev-${idx}`,
        text: originalText,
        message: `Komentar negatif terdeteksi dengan keyakinan tinggi: "${originalText.substring(0, 50)}..."`,
        severity: "High",
        suggested_reply:
          "Mohon maaf atas ketidaknyamanan ini. Kami akan segera menghubungi Anda untuk menyelesaikan masalah ini.",
      });
    }
  });

  const totalReviews = results.length;
  const averageConfidence =
    totalReviews > 0 ? totalConfidence / totalReviews : 0;

  const aspect_breakdown = Object.keys(aspectMap).map((key) => ({
    aspect: key,
    ...aspectMap[key],
  }));

  const channel_breakdown = Object.keys(channelMap).map((key) => ({
    channel: key,
    ...channelMap[key],
  }));

  // Sort time series by date
  const time_series = Object.keys(timeSeriesMap)
    .sort()
    .map((date) => {
      const data = timeSeriesMap[date]!;
      // Format date for chart (e.g. "Jun 17")
      const d = new Date(date);
      let dayName = date;
      if (!isNaN(d.getTime())) {
        dayName = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
      return {
        date,
        day: dayName,
        ...data,
      };
    });

  // Get top 10 most frequent words
  const word_frequency = Object.keys(wordFreqMap)
    .map((word) => {
      const w = wordFreqMap[word]!;
      return { word, total: w.positive + w.negative + w.neutral, ...w };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const summary = {
    total_reviews: totalReviews,
    sentiment_distribution: { positive: pos, negative: neg, neutral: neu },
    average_confidence: averageConfidence,
    crisis_count: crisisCount,
  };

  // 5. Database Storage
  const cleanTitle = file.originalname
    .replace(/\.[^/.]+$/, "")
    .replace(/_/g, " ")
    .replace(/-/g, " ");
  const title = cleanTitle.replace(/\b\w/g, (l) => l.toUpperCase());

  const newHistory = await analysisModel.createAnalysis(
    userId,
    title,
    "Processed CSV",
    uniqueFilename,
  );
  const historyUuid = newHistory.uuid;

  const reviewItemModel = new ReviewItemModel(pool);
  await reviewItemModel.bulkInsert(historyUuid, reviewItemsPayload);

  // 6. Build early warning context
  const negativeReviews = reviewItemsPayload
    .filter((r) => r.sentiment === "Negative")
    .slice(0, 5)
    .map((r) => r.review_text);

  // If the total negative percentage exceeds the threshold, prepend a global warning
  const globalWarnings = checkWarnings(totalReviews, neg, businessContext || "Keseluruhan", negativeReviews);
  if (globalWarnings.length > 0) {
    earlyWarnings.unshift(...globalWarnings);
  }

  // 7. Return requested JSON structure and save to DB
  const finalResponse = {
    status: "success",
    session_id: historyUuid,
    business_context: businessContext,
    summary,
    aspect_breakdown,
    channel_breakdown,
    time_series,
    word_frequency,
    early_warning: earlyWarnings,
  };

  await analysisModel.updateAnalysisDetail(
    historyUuid,
    userId,
    JSON.stringify(finalResponse),
  );

  return finalResponse;
};
