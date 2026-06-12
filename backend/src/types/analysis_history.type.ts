export interface SummaryJson {
  status: string;
  session_id: string;
  business_context: string;
  summary: Summary;
  aspect_breakdown: AspectBreakdown[];
  recommendation: Recommendation;
  early_warning: EarlyWarning[];
}

export interface Summary {
  total_reviews: number;
  sentiment_distribution: SentimentDistribution;
  average_confidence: number;
  crisis_count: number;
}

export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}

export interface AspectBreakdown {
  aspect: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface Recommendation {
  summary: string;
  action_items: string[];
}

export interface EarlyWarning {
  id: string;
  text: string;
  severity: "Low" | "Medium" | "High";
  suggested_reply: string;
}

export interface AnalysisHistory {
  uuid: string;
  user_id: number;
  title: string;
  detail: string | null;
  file_name: string; // Supabase Storage path
  created_at: Date;
  updated_at: Date;
  recommendation: string | null;
  deleted_at: Date | null;
  chat_history: SummaryJson | null;
}