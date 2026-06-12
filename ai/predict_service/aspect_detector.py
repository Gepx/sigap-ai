"""
Aspect Detector - Rule-based keyword matching for Indonesian UMKM reviews.
Detects which aspect a review is directed at: Rasa, Harga, or Pelayanan.
"""

ASPECT_KEYWORDS: dict[str, list[str]] = {
    "Rasa": [
        "rasa", "enak", "lezat", "bumbu", "gurih", "manis", "asin", "pedas",
        "hambar", "nikmat", "sedap", "makanan", "minuman", "menu", "masakan",
        "dimasak", "fresh", "segar", "porsi", "bau", "aroma", "tekstur",
        "crispy", "renyah", "lembut", "keras", "matang", "mentah", "busuk"
    ],
    "Harga": [
        "harga", "mahal", "murah", "terjangkau", "worth", "hemat",
        "overpriced", "ekonomis", "biaya", "bayar", "charge", "ongkir",
        "promo", "diskon", "bonus", "gratis", "tagihan", "struk", "kemahalan",
        "murahin", "sesuai harga", "harga wajar", "tidak sebanding"
    ],
    "Pelayanan": [
        "pelayanan", "service", "pelayan", "kasir", "lambat", "cepat",
        "lama", "ramah", "sigap", "staff", "pramusaji", "karyawan",
        "respon", "admin", "kurir", "antri", "antrian", "tunggu",
        "menunggu", "respons", "fast respon", "cs", "customer service",
        "melayani", "dilayani", "tidak dilayani", "ignored"
    ]
}

def detect_aspect(text: str) -> str:
    """
    Detect the main aspect a review is about using keyword matching.
    Returns: 'Rasa', 'Harga', 'Pelayanan', or 'Lainnya'
    """
    if not text or not isinstance(text, str):
        return "Lainnya"

    text_lower = text.lower()
    scores: dict[str, int] = {aspect: 0 for aspect in ASPECT_KEYWORDS}

    for aspect, keywords in ASPECT_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                scores[aspect] += 1

    max_score = max(scores.values())
    if max_score == 0:
        return "Lainnya"

    return max(scores, key=lambda k: scores[k])
