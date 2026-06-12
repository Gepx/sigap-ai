import { BaseModel } from "./base.model.js";
import type { ReviewItem } from "../types/review_items.type.js";

interface ReviewItemPayload {
  review_text: string;
  sentiment: string;
  aspect: string;
  confidence_score: number;
  is_crisis: boolean;
}

export class ReviewItemModel extends BaseModel {
  async bulkInsert(historyId: string, items: ReviewItemPayload[]): Promise<void> {
    if (items.length === 0) return;

    const query = `
      INSERT INTO review_items (history_id, review_text, sentiment, aspect, confidence_score, is_crisis)
      SELECT $1, unnest($2::text[]), unnest($3::text[]), unnest($4::text[]),
             unnest($5::float[]), unnest($6::bool[])
    `;

    await this._db.query(query, [
      historyId,
      items.map((i) => i.review_text),
      items.map((i) => i.sentiment),
      items.map((i) => i.aspect),
      items.map((i) => i.confidence_score),
      items.map((i) => i.is_crisis),
    ]);
  }

  async getByHistoryId(
    historyId: string,
    limit = 50,
    page = 1,
  ): Promise<{ data: ReviewItem[]; total: number }> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT *, COUNT(*) OVER() AS total
      FROM review_items
      WHERE history_id = $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
    `;
    const result = await this._db.query(query, [historyId, limit, offset]);
    const rows = result.rows as (ReviewItem & { total: number })[];
    return {
      data: rows,
      total: Number(rows[0]?.total ?? 0),
    };
  }

  async getCrisisByHistoryId(historyId: string): Promise<ReviewItem[]> {
    const query = `
      SELECT *
      FROM review_items
      WHERE history_id = $1 AND is_crisis = true
      ORDER BY id ASC
    `;
    const result = await this._db.query(query, [historyId]);
    return result.rows as ReviewItem[];
  }
}
