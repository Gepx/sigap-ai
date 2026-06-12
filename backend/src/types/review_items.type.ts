export interface ReviewItem {
  id: number;
  history_id: string; // uuid FK → analysis_history.uuid
  review_text: string;
  sentiment: string;
  aspect: string;
  confidence_score: number;
  is_crisis: boolean;
  created_at?: Date;
}
