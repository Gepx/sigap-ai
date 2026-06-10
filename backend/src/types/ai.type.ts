import type { SentimentData } from "../utils/mockData.js";

export interface AnalysisHistory {
  uuid: string;
  user_id: number;
  title: string;
  detail: string;
  file_name: string;
  recommendation?: string;
  chat_history?: any;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface EarlyWarning {
  id: string;
  sentimentId: string;
  topic: string;
  region: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  message: string;
  timestamp: string;
  triggerData: SentimentData;
}
