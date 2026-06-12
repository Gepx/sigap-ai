import { BaseModel } from "./base.model.js";

// Legacy model — superseded by AnalysisHistoryModel. Kept for type-safety during compile.
interface AnalysisSession {
  uuid: string;
  user_id: number;
  session_name: string;
  original_filename: string;
  created_at: Date;
}

interface CreateSessionPayload {
  user_id: number;
  session_name: string;
  original_filename: string; // Supabase Storage path
}

export class SessionModel extends BaseModel {
  /** Create a new analysis session record. */
  async createSession(payload: CreateSessionPayload): Promise<AnalysisSession> {
    const query = `
      INSERT INTO analysis_sessions (user_id, session_name, original_filename)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this._db.query(query, [
      payload.user_id,
      payload.session_name,
      payload.original_filename,
    ]);
    return result.rows[0] as AnalysisSession;
  }

  /** Get all sessions belonging to a user, newest first. */
  async getSessionsByUserId(userId: number): Promise<AnalysisSession[]> {
    const query = `
      SELECT *
      FROM analysis_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this._db.query(query, [userId]);
    return result.rows as AnalysisSession[];
  }

  /** Get a single session by UUID (used for dashboard + analyze trigger). */
  async getSessionByUuid(uuid: string): Promise<AnalysisSession | null> {
    const query = `
      SELECT *
      FROM analysis_sessions
      WHERE uuid = $1
      LIMIT 1
    `;
    const result = await this._db.query(query, [uuid]);
    return (result.rows[0] as AnalysisSession) ?? null;
  }
}
