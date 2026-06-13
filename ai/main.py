import csv
from pathlib import Path

import torch
import numpy as np
import joblib
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parent
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
RESULTS_DIR = PROJECT_ROOT / "results"

app = FastAPI(title="Sigap.ai Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: str
    business_category: str = Field(default="Lainnya")
    review_aspect: str = Field(default="Lainnya")
    crisis_flag: str = Field(default="No")
    is_sarcasm: str = Field(default="No")


class PredictResponse(BaseModel):
    sentiment: str
    confidence: float
    probabilities: dict


class BatchPredictRequest(BaseModel):
    reviews: list[PredictRequest]


class BatchPredictResponse(BaseModel):
    predictions: list[PredictResponse]
    total: int


class JoblibModelLoader:
    def __init__(self, model_dir: Path):
        self.model_dir = model_dir
        print(f"Loading pipeline from {model_dir}...")
        self.pipeline = joblib.load(model_dir / "logistic_regression_pipeline.joblib")
        self.label_encoder = joblib.load(model_dir / "label_encoder.joblib")
        
        self.inverse_label_mapping = {
            i: label for i, label in enumerate(self.label_encoder.classes_)
        }

    def _build_text(self, req: PredictRequest) -> str:
        return (
            f"[CATEGORY] {req.business_category} "
            f"[ASPECT] {req.review_aspect} "
            f"[CRISIS] {req.crisis_flag} "
            f"[SARCASM] {req.is_sarcasm} "
            f"[REVIEW] {req.text}"
        )

    def predict(self, req: PredictRequest) -> PredictResponse:
        text = self._build_text(req)
        
        # predict_proba expects a list/array of texts
        proba = self.pipeline.predict_proba([text])[0]
        pred_idx = int(np.argmax(proba))
        
        sentiment = self.inverse_label_mapping[pred_idx]
        confidence = float(proba[pred_idx])
        prob_dict = {
            self.inverse_label_mapping[i]: float(p) for i, p in enumerate(proba)
        }

        return PredictResponse(
            sentiment=sentiment,
            confidence=round(confidence, 4),
            probabilities={k: round(v, 4) for k, v in prob_dict.items()},
        )


# ─── Initialization ────
model_loader = None
loaded_model_type = "None"
loaded_model_id = "None"
loaded_metrics = {}


def load_best_model():
    global model_loader, loaded_model_type, loaded_model_id, loaded_metrics

    model_id = "model1"
    model_dir = ARTIFACTS_DIR / model_id

    print(f"Loading model: {model_id}")

    try:
        model_loader = JoblibModelLoader(model_dir)
        loaded_model_type = "LogisticRegression"
        loaded_model_id = model_id

        metrics_file = RESULTS_DIR / model_id / "metrics_logreg.csv"
        if metrics_file.exists():
            with open(metrics_file, "r") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get("split") == "test":
                        loaded_metrics = {
                            k: float(v) if v.replace(".", "", 1).isdigit() else v
                            for k, v in row.items()
                        }
                        break

        print(f"Model loaded: {loaded_model_type} ({loaded_model_id})")
    except Exception as e:
        print(f"Failed to load Joblib model: {e}")


load_best_model()


# Endpoints
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": model_loader is not None,
        "model_type": loaded_model_type,
    }


@app.get("/model-info")
async def model_info():
    return {
        "model_type": loaded_model_type,
        "model_id": loaded_model_id,
        "metrics": loaded_metrics,
    }


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if model_loader is None:
        raise HTTPException(status_code=503, detail="No model loaded")

    try:
        return model_loader.predict(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/batch", response_model=BatchPredictResponse)
async def predict_batch(request: BatchPredictRequest):
    if model_loader is None:
        raise HTTPException(status_code=503, detail="No model loaded")

    predictions = []
    for review in request.reviews:
        try:
            pred = model_loader.predict(review)
            predictions.append(pred)
        except Exception as e:
            predictions.append(
                PredictResponse(
                    sentiment="Error",
                    confidence=0.0,
                    probabilities={"error": str(e)},
                )
            )

    return BatchPredictResponse(predictions=predictions, total=len(predictions))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
