import pickle
import torch
import torch.nn.functional as F
from transformers import BertTokenizerFast, BertForSequenceClassification
from huggingface_hub import hf_hub_download
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Config ────────────────────────────────────────────────────────────────────
HF_REPO   = "suryahanjaya/sigap-ai"
MAX_LEN   = 128
DEVICE    = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── Globals ───────────────────────────────────────────────────────────────────
tokenizer     = None
model         = None
label_encoder = None

# ── Load ──────────────────────────────────────────────────────────────────────
def load_model():
    global tokenizer, model, label_encoder

    tok_config = hf_hub_download(HF_REPO, "model3/tokenizer/tokenizer_config.json")
    tok_json   = hf_hub_download(HF_REPO, "model3/tokenizer/tokenizer.json")
    tok_dir    = tok_config.rsplit("/", 1)[0] if "/" in tok_config else tok_config.rsplit("\\", 1)[0]

    tokenizer = BertTokenizerFast.from_pretrained(tok_dir)

    le_path = hf_hub_download(HF_REPO, "model3/label_encoder.pkl")
    with open(le_path, "rb") as f:
        label_encoder = pickle.load(f)

    model_path = hf_hub_download(HF_REPO, "model3/model/model.pt")
    num_labels = len(label_encoder.classes_)
    model = BertForSequenceClassification.from_pretrained(
        "indobenchmark/indobert-base-p1",
        num_labels=num_labels,
    )
    state = torch.load(model_path, map_location=DEVICE)
    model.load_state_dict(state)
    model.to(DEVICE)
    model.eval()

# ── FastAPI ───────────────────────────────────────────────────────────────────
app = FastAPI(title="SIGAP-AI", description="Klasifikasi teks ulasan aplikasi.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    load_model()

# ── Schemas ───────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    label: str
    confidence: float
    probabilities: dict[str, float]

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest):
    try:
        enc = tokenizer(
            body.text,
            max_length=MAX_LEN,
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        )
        input_ids      = enc["input_ids"].to(DEVICE)
        attention_mask = enc["attention_mask"].to(DEVICE)

        with torch.no_grad():
            logits = model(input_ids=input_ids, attention_mask=attention_mask).logits

        probs     = F.softmax(logits, dim=-1).squeeze(0).cpu().tolist()
        pred_idx  = int(torch.argmax(torch.tensor(probs)))
        pred_label = label_encoder.inverse_transform([pred_idx])[0]

        return PredictResponse(
            label=pred_label,
            confidence=round(probs[pred_idx], 4),
            probabilities={
                str(label_encoder.inverse_transform([i])[0]): round(p, 4)
                for i, p in enumerate(probs)
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
