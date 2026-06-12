import os
import re
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional
from scipy.sparse import hstack, csr_matrix
from sklearn.feature_extraction.text import CountVectorizer

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Sigap.ai Sentiment Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL1_DIR = os.path.join(BASE_DIR, "artifacts", "model1")
MODEL2_DIR = os.path.join(BASE_DIR, "artifacts", "model2")

logreg_pipeline = None
label_encoder1 = None

svm_model = None
word_vectorizer = None
char_vectorizer = None
label_encoder2 = None
onehot_encoder = None

models_loaded = False

try:
    logreg_pipeline = joblib.load(os.path.join(MODEL1_DIR, "logistic_regression_pipeline.joblib"))
    label_encoder1 = joblib.load(os.path.join(MODEL1_DIR, "label_encoder.joblib"))
    
    svm_model = joblib.load(os.path.join(MODEL2_DIR, "svm_model.joblib"))
    word_vectorizer = joblib.load(os.path.join(MODEL2_DIR, "word_tfidf_vectorizer.joblib"))
    char_vectorizer = joblib.load(os.path.join(MODEL2_DIR, "char_tfidf_vectorizer.joblib"))
    label_encoder2 = joblib.load(os.path.join(MODEL2_DIR, "label_encoder.joblib"))
    onehot_encoder = joblib.load(os.path.join(MODEL2_DIR, "onehot_encoder.joblib"))
    
    models_loaded = True
except Exception as e:
    print(f"Error loading models: {e}")
    models_loaded = False


def preprocess_text(text: str) -> str:
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def predict_model1(texts: List[str]):
    prep_texts = [preprocess_text(t) for t in texts]
    preds = logreg_pipeline.predict(prep_texts)
    probs = logreg_pipeline.predict_proba(prep_texts)
    return preds, probs


def predict_model2(texts: List[str], df: Optional[pd.DataFrame] = None):
    prep_texts = [preprocess_text(t) for t in texts]
    X_word = word_vectorizer.transform(prep_texts)
    X_char = char_vectorizer.transform(prep_texts)
    
    if df is not None and "Business_Category" in df.columns:
        cat_bus = df["Business_Category"]
    else:
        cat_bus = [None] * len(texts)
        
    if df is not None and "Review_Aspect" in df.columns:
        cat_asp = df["Review_Aspect"]
    else:
        cat_asp = [None] * len(texts)
        
    df_cat = pd.DataFrame({
        'Business_Category': cat_bus,
        'Review_Aspect': cat_asp
    })
    X_cat = onehot_encoder.transform(df_cat)
    
    if df is not None and "Crisis_Flag" in df.columns:
        cf = df["Crisis_Flag"].astype(str).str.strip().map({"Yes": 1, "No": 0, "1": 1, "0": 0}).fillna(0).astype("int32")
    else:
        cf = [0] * len(texts)
        
    if df is not None and "Is_Sarcasm" in df.columns:
        sarc = df["Is_Sarcasm"].astype(str).str.strip().map({"Yes": 1, "No": 0, "1": 1, "0": 0}).fillna(0).astype("int32")
    else:
        sarc = [0] * len(texts)
        
    raw_lens = np.array([len(t.split()) for t in prep_texts])
    scaled_lens = np.clip((raw_lens - 1) / 931.0, 0.0, 1.0)
    
    num_features = np.column_stack((cf, sarc, scaled_lens))
    X_num = csr_matrix(num_features.astype('float32'))
    
    X_final = hstack([X_word, X_char, X_cat, X_num])
    
    preds = svm_model.predict(X_final)
    scores = svm_model.decision_function(X_final)
    if scores.ndim == 1:
        scores = scores[:, np.newaxis]
        
    e_x = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    probs = e_x / e_x.sum(axis=-1, keepdims=True)
    
    return preds, probs


def get_predictions_and_summary(texts: List[str], model_name: str, df: Optional[pd.DataFrame] = None):
    if model_name == "model1":
        preds, probs = predict_model1(texts)
        classes = label_encoder1.classes_
    else:
        preds, probs = predict_model2(texts, df)
        classes = label_encoder2.classes_
        
    predictions_list = []
    total = len(texts)
    
    pos_count = 0
    neu_count = 0
    neg_count = 0
    
    for i in range(total):
        pred_idx = preds[i]
        class_label = classes[pred_idx]  # "Negative", "Neutral", "Positive"
        
        if class_label == "Neutral":
            sentiment = "Netral"
            neu_count += 1
        elif class_label == "Positive":
            sentiment = "Positive"
            pos_count += 1
        else:
            sentiment = "Negative"
            neg_count += 1
            
        confidence = float(probs[i][pred_idx])
        
        predictions_list.append({
            "text": texts[i],
            "sentiment": sentiment,
            "confidence": round(confidence, 2)
        })
        
    summary = {
        "total": total,
        "positive": pos_count,
        "neutral": neu_count,
        "negative": neg_count,
        "positive_pct": round(pos_count / total * 100.0, 2) if total > 0 else 0.0,
        "neutral_pct": round(neu_count / total * 100.0, 2) if total > 0 else 0.0,
        "negative_pct": round(neg_count / total * 100.0, 2) if total > 0 else 0.0
    }
    
    return predictions_list, summary


def extract_top_keywords(texts: List[str], top_n: int = 5):
    if not texts:
        return []
    
    indonesian_stopwords = [
        'dan', 'di', 'dari', 'yang', 'untuk', 'pada', 'ke', 'dengan', 'ini', 'itu',
        'adalah', 'yaitu', 'yakni', 'atau', 'saja', 'juga', 'ada', 'bisa', 'saya', 'kamu',
        'kami', 'mereka', 'dia', 'ia', 'kita', 'telah', 'sudah', 'akan', 'ingin', 'dapat',
        'bila', 'jika', 'kalau', 'karena', 'sehingga', 'maka', 'namun', 'tetapi', 'melainkan',
        'tidak', 'bukan', 'jangan', 'belum', 'habis', 'oleh', 'tentang', 'seperti', 'bagai',
        'sangat', 'amat', 'sekali', 'lebih', 'paling', 'kurang', 'cukup', 'terlalu', 'begitu',
        'kembali', 'kemudian', 'lalu', 'setelah', 'sebelum', 'saat', 'ketika', 'sementara',
        'buat', 'tahu', 'mau', 'sih', 'ya', 'oke', 'ok', 'aja', 'punya', 'yg', 'ga', 'gak', 'tdk'
    ]
    
    try:
        vectorizer = CountVectorizer(stop_words=indonesian_stopwords, max_features=top_n)
        X = vectorizer.fit_transform(texts)
        sum_words = X.sum(axis=0)
        words_freq = [(word, sum_words[0, idx]) for word, idx in vectorizer.vocabulary_.items()]
        words_freq = sorted(words_freq, key=lambda x: x[1], reverse=True)
        return [word for word, freq in words_freq[:top_n]]
    except Exception:
        from collections import Counter
        all_words = []
        for text in texts:
            words = [w for w in text.split() if w not in indonesian_stopwords and len(w) > 1]
            all_words.extend(words)
        counter = Counter(all_words)
        return [word for word, count in counter.most_common(top_n)]


class PredictRequest(BaseModel):
    texts: List[str]
    model: Optional[str] = "model1"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models_loaded": models_loaded
    }


@app.post("/predict")
def predict(request: PredictRequest):
    if not models_loaded:
        raise HTTPException(status_code=500, detail="Models are not successfully loaded on the server.")
        
    if request.model not in ["model1", "model2"]:
        raise HTTPException(status_code=400, detail="Invalid model name. Choose 'model1' or 'model2'.")
        
    predictions_list, summary = get_predictions_and_summary(request.texts, request.model)
    return {
        "predictions": predictions_list,
        "summary": summary
    }


@app.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...), model: str = Form("model1")):
    if not models_loaded:
        raise HTTPException(status_code=500, detail="Models are not successfully loaded on the server.")
        
    if model not in ["model1", "model2"]:
        raise HTTPException(status_code=400, detail="Invalid model name. Choose 'model1' or 'model2'.")
        
    try:
        contents = await file.read()
        from io import StringIO
        df = None
        for encoding in ["utf-8", "utf-8-sig", "latin-1"]:
            try:
                decoded = contents.decode(encoding)
                df = pd.read_csv(StringIO(decoded))
                break
            except Exception:
                continue
                
        if df is None:
            raise HTTPException(status_code=400, detail="Failed to parse CSV file. Ensure it is encoded in UTF-8 or Latin-1.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV file: {str(e)}")
        
    text_col = None
    for col in df.columns:
        col_lower = str(col).lower().strip()
        if col_lower in ['review', 'ulasan', 'text', 'content']:
            text_col = col
            break
            
    if not text_col:
        for col in df.columns:
            col_lower = str(col).lower().strip()
            if any(term in col_lower for term in ['review', 'ulasan', 'text', 'content']):
                text_col = col
                break
                
    if not text_col:
        raise HTTPException(
            status_code=400,
            detail="CSV column for texts not found. Ensure there is a column named 'review', 'ulasan', 'text', or 'content'."
        )
        
    texts = df[text_col].fillna("").astype(str).tolist()
    predictions_list, summary = get_predictions_and_summary(texts, model, df)
    
    negative_texts = [predictions_list[i]["text"] for i in range(len(texts)) if predictions_list[i]["sentiment"] == "Negative"]
    positive_texts = [predictions_list[i]["text"] for i in range(len(texts)) if predictions_list[i]["sentiment"] == "Positive"]
    
    top_negative_keywords = extract_top_keywords(negative_texts, top_n=5)
    top_positive_keywords = extract_top_keywords(positive_texts, top_n=5)
    
    by_channel = {}
    channel_col = None
    for col in df.columns:
        col_lower = str(col).lower().strip()
        if col_lower in ['channel', 'platform']:
            channel_col = col
            break
            
    if channel_col:
        df_temp = df.copy()
        df_temp[channel_col] = df_temp[channel_col].fillna("Unknown").astype(str)
        grouped = df_temp.groupby(channel_col)
        for channel_name, group in grouped:
            indices = group.index.tolist()
            pos_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Positive")
            neu_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Netral")
            neg_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Negative")
            by_channel[str(channel_name)] = {
                "positive": pos_cnt,
                "neutral": neu_cnt,
                "negative": neg_cnt
            }
            
    daily_trend = []
    date_col = None
    for col in df.columns:
        col_lower = str(col).lower().strip()
        if col_lower in ['date', 'tanggal']:
            date_col = col
            break
            
    if date_col:
        dates_parsed = []
        for val in df[date_col]:
            if pd.isna(val):
                dates_parsed.append("Unknown")
            else:
                try:
                    parsed = pd.to_datetime(val).strftime('%Y-%m-%d')
                    dates_parsed.append(parsed)
                except Exception:
                    dates_parsed.append(str(val))
                    
        df_temp = df.copy()
        df_temp['_parsed_date'] = dates_parsed
        grouped = df_temp.groupby('_parsed_date')
        for date_val, group in grouped:
            indices = group.index.tolist()
            pos_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Positive")
            neu_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Netral")
            neg_cnt = sum(1 for idx in indices if predictions_list[idx]["sentiment"] == "Negative")
            daily_trend.append({
                "date": str(date_val),
                "positive": pos_cnt,
                "neutral": neu_cnt,
                "negative": neg_cnt
            })
        daily_trend = sorted(daily_trend, key=lambda x: x['date'])
        
    return {
        "file_name": file.filename,
        "total_rows": len(df),
        "summary": summary,
        "predictions": predictions_list,
        "top_keywords": {
            "negative": top_negative_keywords,
            "positive": top_positive_keywords
        },
        "by_channel": by_channel,
        "daily_trend": daily_trend
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)
