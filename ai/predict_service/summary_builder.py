"""
Summary Builder - Constructs the summary_json object saved to ai_insights table.

Builds the complete JSON structure that the frontend dashboard reads.
"""

import pandas as pd
from typing import Any
from crisis_detector import detect_crisis, get_suggested_reply


def build_aspect_breakdown(df: pd.DataFrame) -> list[dict[str, Any]]:
    aspects = df["aspect"].unique().tolist()
    breakdown = []

    for aspect in aspects:
        if not aspect:
            continue
        aspect_df = df[df["aspect"] == aspect]
        breakdown.append({
            "aspect": aspect,
            "positive": int((aspect_df["sentiment"] == "Positif").sum()),
            "negative": int((aspect_df["sentiment"] == "Negatif").sum()),
            "neutral": int((aspect_df["sentiment"] == "Neutral").sum()),
        })

    return sorted(breakdown, key=lambda x: x["positive"] + x["negative"] + x["neutral"], reverse=True)


def build_early_warnings(df: pd.DataFrame) -> list[dict[str, Any]]:
    crisis_df = df[df["is_crisis"] == True].head(10)  # max 10 warnings
    warnings = []

    for _, row in crisis_df.iterrows():
        _, severity = detect_crisis(str(row["review_text"]), str(row["sentiment"]))
        warnings.append({
            "id": str(row.get("temp_id", "")),
            "text": str(row["review_text"]),
            "severity": severity,
            "suggested_reply": get_suggested_reply(severity, str(row["review_text"]))
        })

    return warnings


def build_summary_json(
    session_uuid: str,
    business_context: str,
    df: pd.DataFrame,
    rag_recommendation: dict[str, Any]
) -> dict[str, Any]:
  
    total = len(df)
    positive_count = int((df["sentiment"] == "Positif").sum())
    negative_count = int((df["sentiment"] == "Negatif").sum())
    neutral_count = int((df["sentiment"] == "Neutral").sum())
    crisis_count = int(df["is_crisis"].sum())
    avg_confidence = float(df["confidence_score"].mean()) if "confidence_score" in df.columns else 0.0

    return {
        "status": "success",
        "session_id": session_uuid,
        "business_context": business_context,
        "summary": {
            "total_reviews": total,
            "sentiment_distribution": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": neutral_count,
            },
            "average_confidence": round(avg_confidence, 4),
            "crisis_count": crisis_count,
        },
        "aspect_breakdown": build_aspect_breakdown(df),
        "recommendation": rag_recommendation,
        "early_warning": build_early_warnings(df),
    }
