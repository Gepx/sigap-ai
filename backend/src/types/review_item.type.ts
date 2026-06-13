export interface ReviewItem {
  id: number;
  history_id: string;
  review_text: string;
  sentiment: string;
  aspect: string;
  confidence_score: number;
  is_crisis: boolean;
  date?: string;
  platform_source?: string;
  created_at: Date;
}

export interface ReviewItemPayload {
  review_text: string;
  sentiment: string;
  aspect: string;
  confidence_score: number;
  is_crisis: boolean;
  date?: string;
  platform_source?: string;
}
