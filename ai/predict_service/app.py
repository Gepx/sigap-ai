"""
Sigap.ai Prediction Service — FastAPI
Port: 5000

Endpoints:
    POST /analyze  — Analyze a CSV file from Supabase Storage URL
    GET  /health   — Health check
"""

import os
import sys
import uuid
import joblib
import requests
import numpy as np
import pandas as pd
from io import StringIO
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory to path for sibling imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from aspect_detector import detect_aspect
from crisis_detector import detect_crisis, get_suggested_reply
from summary_builder import build_summary_json
from rag_integration import generate_recommendation

# ── Model Loading ──────────────────────────────────────────────────────────────
# Base path to model artifacts — adjust if running from a different directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL1_DIR = os.path.join(BASE_DIR, "artifacts", "model1")

print(f"[STARTUP] Loading ML models from: {MODEL1_DIR}")

try:
    pipeline = joblib.load(os.path.join(MODEL1_DIR, "logistic_regression_pipeline.joblib"))
    label_encoder = joblib.load(os.path.join(MODEL1_DIR, "label_encoder.joblib"))
    print("[STARTUP] Models loaded successfully.")
    print(f"[STARTUP] Label classes: {label_encoder.classes_}")
except Exception as e:
    print(f"[STARTUP ERROR] Failed to load models: {e}")
    raise

# ── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Sigap.ai Prediction Service",
    description="Sentiment analysis API for Indonesian UMKM reviews",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request/Response Models ───────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    file_url: str          # Signed URL from Supabase Storage
    business_context: str  # e.g. "Kuliner - Ayam Geprek Pak Budi"
    session_id: str        # UUID of the analysis session


class AnalyzeResponse(BaseModel):
    chat_history: dict   # stored as JSONB in analysis_history.chat_history
    review_items: list[dict]


# ── Helpers ───────────────────────────────────────────────────────────────────
REVIEW_TEXT_COLUMNS = [
    "review_text", "Review_Text", "review", "ulasan", "komentar",
    "text", "comment", "feedback", "description", "Review_Text_Processed"
]

SENTIMENT_LABEL_MAP = {
    # Map model output labels to Indonesian labels used in DB
    "Positive": "Positif",
    "Positif": "Positif",
    "Negative": "Negatif",
    "Negatif": "Negatif",
    "Netral": "Neutral",
    "Neutral": "Neutral",
    "Negative": "Negatif",
}


def find_review_column(df: pd.DataFrame) -> str:
    """Find the column containing review text."""
    for col in REVIEW_TEXT_COLUMNS:
        if col in df.columns:
            return col
    # Fallback: use first string column
    for col in df.columns:
        if df[col].dtype == object:
            return col
    raise ValueError(
        f"No review text column found. Available columns: {list(df.columns)}. "
        f"Please rename your review column to 'review_text'."
    )


def download_csv_from_url(url: str) -> pd.DataFrame:
    """Download CSV from a URL and return as DataFrame."""
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    
    # Try different encodings
    for encoding in ["utf-8", "utf-8-sig", "latin-1", "cp1252"]:
        try:
            return pd.read_csv(StringIO(response.content.decode(encoding)))
        except UnicodeDecodeError:
            continue
    raise ValueError("Could not decode CSV file with any supported encoding.")


def predict_batch(texts: list[str]) -> tuple[list[str], list[float]]:
    """Run model predictions on a batch of texts."""
    # Handle empty or null texts
    cleaned = [str(t) if t and not pd.isna(t) else "" for t in texts]
    
    raw_predictions = pipeline.predict(cleaned)
    labels = label_encoder.inverse_transform(raw_predictions)
    
    # Get confidence scores
    try:
        proba = pipeline.predict_proba(cleaned)
        confidences = proba.max(axis=1).tolist()
    except AttributeError:
        # SVM without probability=True
        confidences = [0.85] * len(cleaned)
    
    return labels.tolist(), confidences


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Sigap.ai Prediction Service is running."}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    """Analyze a CSV file and return sentiment analysis results."""
    print(f"[ANALYZE] session_id={request.session_id}, context={request.business_context}")

    # 1. Download CSV
    try:
        df = download_csv_from_url(request.file_url)
        print(f"[ANALYZE] Downloaded CSV: {len(df)} rows, columns: {list(df.columns)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download or parse CSV: {str(e)}")

    # 2. Find review column
    try:
        review_col = find_review_column(df)
        print(f"[ANALYZE] Using column '{review_col}' as review text.")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # 3. Remove rows with empty reviews
    df = df[df[review_col].notna() & (df[review_col].astype(str).str.strip() != "")].copy()
    df = df.reset_index(drop=True)
    
    if len(df) == 0:
        raise HTTPException(status_code=422, detail="CSV has no valid review rows after cleaning.")

    texts = df[review_col].astype(str).tolist()

    # 4. Predict sentiment
    print(f"[ANALYZE] Running predictions on {len(texts)} reviews...")
    labels, confidences = predict_batch(texts)

    # Map to Indonesian labels
    labels_id = [SENTIMENT_LABEL_MAP.get(lbl, lbl) for lbl in labels]

    # 5. Detect aspects and crisis
    aspects = [detect_aspect(t) for t in texts]
    crisis_flags = []
    for t, s in zip(texts, labels_id):
        is_crisis, _ = detect_crisis(t, s)
        crisis_flags.append(is_crisis)

    # 6. Build results DataFrame
    df["sentiment"] = labels_id
    df["confidence_score"] = confidences
    df["aspect"] = aspects
    df["is_crisis"] = crisis_flags
    df["review_text"] = texts
    df["temp_id"] = [str(uuid.uuid4()) for _ in range(len(df))]

    # 7. Build review_items for DB insert
    review_items = [
        {
            "review_text": row["review_text"],
            "sentiment": row["sentiment"],
            "aspect": row["aspect"],
            "confidence_score": round(float(row["confidence_score"]), 4),
            "is_crisis": bool(row["is_crisis"]),
        }
        for _, row in df.iterrows()
    ]

    # 8. Build summary data for RAG
    total = len(df)
    summary_data = {
        "total_reviews": total,
        "sentiment_distribution": {
            "positive": int((df["sentiment"] == "Positif").sum()),
            "negative": int((df["sentiment"] == "Negatif").sum()),
            "neutral": int((df["sentiment"] == "Neutral").sum()),
        },
        "average_confidence": float(df["confidence_score"].mean()),
        "crisis_count": int(df["is_crisis"].sum()),
        "aspect_breakdown": [
            {
                "aspect": asp,
                "positive": int((df[df["aspect"] == asp]["sentiment"] == "Positif").sum()),
                "negative": int((df[df["aspect"] == asp]["sentiment"] == "Negatif").sum()),
                "neutral": int((df[df["aspect"] == asp]["sentiment"] == "Neutral").sum()),
            }
            for asp in df["aspect"].unique()
        ]
    }

    # 9. Generate recommendation (template-based, ready for RAG/LLM later)
    print("[ANALYZE] Generating recommendations...")
    recommendation = generate_recommendation(summary_data, request.business_context)

    # 10. Build final chat_history (stored as JSONB in analysis_history.chat_history)
    chat_history = build_summary_json(
        session_uuid=request.session_id,
        business_context=request.business_context,
        df=df,
        rag_recommendation=recommendation
    )

    print(f"[ANALYZE] Done. positive={summary_data['sentiment_distribution']['positive']}, "
          f"negative={summary_data['sentiment_distribution']['negative']}, "
          f"neutral={summary_data['sentiment_distribution']['neutral']}")

    return AnalyzeResponse(chat_history=chat_history, review_items=review_items)


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
