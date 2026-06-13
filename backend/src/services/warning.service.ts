import type { EarlyWarning } from "../types/ai.type.js";

const NEGATIVE_THRESHOLD = 30;

export const checkWarnings = (
  totalReviews: number,
  negativeCount: number,
  businessContext: string,
  sampleNegativeReviews: string[],
): EarlyWarning[] => {
  const warnings: EarlyWarning[] = [];

  if (totalReviews > 0) {
    const negativePercentage = (negativeCount / totalReviews) * 100;

    if (negativePercentage > NEGATIVE_THRESHOLD) {
      warnings.push({
        id: `global-warning-${Date.now()}`,
        sentimentId: "global",
        topic: businessContext || "Keseluruhan",
        region: "All",
        severity: "CRITICAL",
        message: `Peringatan: ${negativePercentage.toFixed(1)}% dari total ulasan bersentimen negatif. Diperlukan tindakan segera.`,
        timestamp: new Date().toISOString(),
        triggerData: {
          negative: negativePercentage,
          sampleComments: sampleNegativeReviews,
        },
        text: `Terdapat ${negativeCount} ulasan negatif dari total ${totalReviews} ulasan.`,
      } as any);
    }
  }

  return warnings;
};
