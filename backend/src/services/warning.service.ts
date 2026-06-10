import type { EarlyWarning } from "../types/ai.type.js";
import { mockSentiments } from "../utils/mockData.js";

const NEGATIVE_THRESHOLD = 60;

export const checkWarnings = (): EarlyWarning[] => {
  const warnings: EarlyWarning[] = [];

  for (const sentiment of mockSentiments) {
    if (sentiment.negative > NEGATIVE_THRESHOLD) {
      warnings.push({
        id: `warn-${Date.now()}-${sentiment.id}`,
        sentimentId: sentiment.id,
        topic: sentiment.topic,
        region: sentiment.region,
        severity: "HIGH",
        message: `High negative sentiment (${sentiment.negative}%) detected for topic: ${sentiment.topic} in ${sentiment.region}.`,
        timestamp: new Date().toISOString(),
        triggerData: sentiment,
      });
    }
  }

  return warnings;
};
