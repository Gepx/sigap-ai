import type { AnalysisHistory } from "../types/ai.type.js";
import { BaseModel } from "./base.model.js";

export class AnalysisModel extends BaseModel {
  async createAnalysis(
    userId: number,
    title: string,
    detail: string,
    fileName: string,
  ): Promise<AnalysisHistory> {
    const query = `
      INSERT INTO analysis_history (user_id, title, detail, file_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this._db.query(query, [
      userId,
      title,
      detail,
      fileName,
    ]);
    return result.rows[0] as AnalysisHistory;
  }

  async getHistoryByUserId(userId: number): Promise<AnalysisHistory[]> {
    const query = `
      SELECT *
      FROM analysis_history
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await this._db.query(query, [userId]);
    return result.rows as AnalysisHistory[];
  }

  async getAnalysisById(
    uuid: string,
    userId: number,
  ): Promise<AnalysisHistory | null> {
    const query = `
      SELECT *
      FROM analysis_history
      WHERE uuid = $1 AND user_id = $2 AND deleted_at IS NULL
    `;
    const result = await this._db.query(query, [uuid, userId]);
    return (result.rows[0] as AnalysisHistory) || null;
  }

  async updateAnalysisTitle(
    uuid: string,
    userId: number,
    title: string,
  ): Promise<AnalysisHistory | null> {
    const query = `
      UPDATE analysis_history
      SET title = $1, updated_at = NOW()
      WHERE uuid = $2 AND user_id = $3 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [title, uuid, userId]);
    return (result.rows[0] as AnalysisHistory) || null;
  }

  async softDeleteAnalysis(uuid: string, userId: number): Promise<boolean> {
    const query = `
      UPDATE analysis_history
      SET deleted_at = NOW()
      WHERE uuid = $1 AND user_id = $2 AND deleted_at IS NULL
    `;
    const result = await this._db.query(query, [uuid, userId]);
    return (result.rowCount || 0) > 0;
  }

  async saveRecommendation(
    uuid: string,
    userId: number,
    recommendation: string,
  ): Promise<AnalysisHistory | null> {
    const query = `
      UPDATE analysis_history
      SET recommendation = $1, updated_at = NOW()
      WHERE uuid = $2 AND user_id = $3 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [recommendation, uuid, userId]);
    return (result.rows[0] as AnalysisHistory) || null;
  }

  async saveChatHistory(
    uuid: string,
    userId: number,
    chatHistory: any,
  ): Promise<AnalysisHistory | null> {
    const query = `
      UPDATE analysis_history
      SET chat_history = $1, updated_at = NOW()
      WHERE uuid = $2 AND user_id = $3 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await this._db.query(query, [
      JSON.stringify(chatHistory),
      uuid,
      userId,
    ]);
    return (result.rows[0] as AnalysisHistory) || null;
  }
}
