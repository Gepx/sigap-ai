/**
 * TypeScript interface matching the summary_json stored in ai_insights.summary_json
 * This is the single source of truth for the dashboard.
 */
export interface SummaryJson {
  status: string;
  session_id: string;
  business_context: string;
  summary: {
    total_reviews: number;
    sentiment_distribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    average_confidence: number;
    crisis_count: number;
  };
  aspect_breakdown: {
    aspect: string;
    positive: number;
    negative: number;
    neutral: number;
  }[];
  recommendation: {
    summary: string;
    action_items: string[];
  };
  early_warning: {
    id: string;
    text: string;
    severity: "High" | "Medium" | "Low";
    suggested_reply: string;
  }[];
}
