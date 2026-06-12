"""
Crisis Detector - Early warning system for critical/dangerous reviews.
Flags reviews that contain crisis keywords (hygiene issues, safety, etc.)
"""

CRISIS_KEYWORDS: list[str] = [
    # Kebersihan & Kesehatan
    "rambut", "kecoak", "ulat", "belatung", "cacing", "tikus", "lalat",
    "busuk", "basi", "kedaluwarsa", "expired", "kadaluarsa",
    "kotor", "menjijikkan", "najis", "jorok", "jijik",
    # Keracunan & Kesehatan
    "keracunan", "muntah", "diare", "sakit perut", "mual", "pusing",
    "alergi", "gatal", "bengkak",
    # Penipuan & Kecurangan  
    "tipu", "menipu", "bohong", "palsu", "tidak sesuai", "berbeda",
    "scam", "penipuan",
    # Kekerasan & Ancaman
    "ancam", "kasar", "bentak", "marah-marah", "memaki",
]

SEVERITY_HIGH: list[str] = [
    "keracunan", "rambut", "kecoak", "ulat", "belatung", "busuk", "basi",
    "tipu", "menipu", "penipuan", "scam"
]

SEVERITY_MEDIUM: list[str] = [
    "kotor", "menjijikkan", "jorok", "expired", "kadaluarsa",
    "muntah", "diare", "sakit perut", "alergi"
]

def detect_crisis(text: str, sentiment: str) -> tuple[bool, str]:
    """
    Detect if a review contains crisis-level content.
    Returns: (is_crisis: bool, severity: str) where severity is 'High', 'Medium', or 'Low'
    Only flags negative sentiment reviews as crisis.
    """
    if not text or not isinstance(text, str):
        return False, "Low"

    if sentiment not in ("Negatif", "Negative"):
        return False, "Low"

    text_lower = text.lower()

    for kw in SEVERITY_HIGH:
        if kw in text_lower:
            return True, "High"

    for kw in SEVERITY_MEDIUM:
        if kw in text_lower:
            return True, "Medium"

    for kw in CRISIS_KEYWORDS:
        if kw in text_lower:
            return True, "Low"

    return False, "Low"


def get_suggested_reply(severity: str, text: str) -> str:
    """Generate a suggested reply template based on crisis severity."""
    if severity == "High":
        return (
            "Mohon maaf atas pengalaman buruk yang Anda alami. "
            "Kami sangat serius menanggapi hal ini dan akan segera melakukan "
            "investigasi internal. Tim kami akan menghubungi Anda secepatnya."
        )
    elif severity == "Medium":
        return (
            "Terima kasih atas masukan Anda. Kami mohon maaf atas ketidaknyamanan ini. "
            "Kami akan segera mengevaluasi dan meningkatkan standar kami."
        )
    else:
        return (
            "Terima kasih atas ulasannya. Kami mohon maaf atas pengalaman yang kurang "
            "memuaskan. Masukan Anda sangat berarti untuk perbaikan kami."
        )
