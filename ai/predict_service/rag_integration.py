

from __future__ import annotations
from typing import Any



def generate_recommendation(
    summary_data: dict[str, Any],
    business_context: str,
) -> dict[str, Any]:


    return _template_recommendation(summary_data, business_context)



def _template_recommendation(
    summary_data: dict[str, Any],
    business_context: str,
) -> dict[str, Any]:
    
    dist = summary_data.get("sentiment_distribution", {})
    total = summary_data.get("total_reviews", 1) or 1
    positive = dist.get("positive", 0)
    negative = dist.get("negative", 0)
    neutral = dist.get("neutral", 0)
    crisis_count = summary_data.get("crisis_count", 0)
    avg_confidence = summary_data.get("average_confidence", 0.0)

    pos_pct = round((positive / total) * 100)
    neg_pct = round((negative / total) * 100)
    neu_pct = round((neutral / total) * 100)

    aspect_breakdown = summary_data.get("aspect_breakdown", [])
    worst_aspect = _find_worst_aspect(aspect_breakdown)
    best_aspect = _find_best_aspect(aspect_breakdown)

    condition = _classify_condition(pos_pct, neg_pct, crisis_count)

    action_items = _build_action_items(
        condition=condition,
        pos_pct=pos_pct,
        neg_pct=neg_pct,
        neu_pct=neu_pct,
        worst_aspect=worst_aspect,
        best_aspect=best_aspect,
        crisis_count=crisis_count,
        total=total,
    )

    summary = _build_summary(
        business_context=business_context,
        total=total,
        pos_pct=pos_pct,
        neg_pct=neg_pct,
        condition=condition,
        worst_aspect=worst_aspect,
        crisis_count=crisis_count,
        avg_confidence=avg_confidence,
    )

    return {"summary": summary, "action_items": action_items}



def _classify_condition(pos_pct: int, neg_pct: int, crisis_count: int) -> str:
    if crisis_count >= 5 or neg_pct >= 50:
        return "critical"
    if neg_pct >= 30 or crisis_count >= 1:
        return "concerning"
    if pos_pct >= 70:
        return "good"
    if pos_pct >= 50:
        return "moderate"
    return "needs_improvement"


def _find_worst_aspect(aspect_breakdown: list[dict]) -> str | None:
    if not aspect_breakdown:
        return None
    worst = max(aspect_breakdown, key=lambda a: a.get("negative", 0), default=None)
    if worst and worst.get("negative", 0) > 0:
        return worst.get("aspect", "")
    return None


def _find_best_aspect(aspect_breakdown: list[dict]) -> str | None:
    if not aspect_breakdown:
        return None
    best = max(aspect_breakdown, key=lambda a: a.get("positive", 0), default=None)
    if best and best.get("positive", 0) > 0:
        return best.get("aspect", "")
    return None


def _build_action_items(
    condition: str,
    pos_pct: int,
    neg_pct: int,
    neu_pct: int,
    worst_aspect: str | None,
    best_aspect: str | None,
    crisis_count: int,
    total: int,
) -> list[str]:
    items: list[str] = []

    if condition == "critical":
        items.append(
            f"🚨 Lakukan audit menyeluruh segera — {neg_pct}% ulasan negatif menunjukkan "
            "masalah sistemik yang harus diselesaikan sebelum berdampak pada reputasi jangka panjang."
        )
    elif condition == "concerning":
        items.append(
            f"Bentuk tim kecil khusus untuk menangani {neg_pct}% ulasan negatif. "
            "Identifikasi pola berulang dan buat SOP penanganannya dalam 7 hari ke depan."
        )
    elif condition == "good":
        items.append(
            f"Dokumentasikan praktik terbaik yang menghasilkan {pos_pct}% sentimen positif — "
            "jadikan sebagai standar operasional untuk mempertahankan kualitas."
        )
    else:
        items.append(
            f"Analisis {neu_pct}% ulasan netral lebih dalam: ulasan ini berpotensi menjadi "
            "positif dengan perbaikan kecil yang tepat sasaran."
        )

    if worst_aspect:
        aspect_advice = {
            "Rasa": (
                "Evaluasi konsistensi cita rasa antar waktu dan antar koki. "
                "Pertimbangkan taste test rutin dan standarisasi resep tertulis."
            ),
            "Harga": (
                "Lakukan survei harga kompetitor di area sekitar. "
                "Jika harga sudah kompetitif, komunikasikan value proposition dengan lebih jelas kepada pelanggan."
            ),
            "Pelayanan": (
                "Adakan pelatihan service excellence untuk seluruh staff minimal sebulan sekali. "
                "Tetapkan SLA waktu respons untuk setiap jenis keluhan."
            ),
        }
        advice = aspect_advice.get(
            worst_aspect,
            f"Investigasi akar permasalahan pada aspek '{worst_aspect}' dengan cara mewawancarai "
            "pelanggan yang memberikan ulasan negatif terkait aspek ini."
        )
        items.append(f"Fokus perbaikan pada aspek **{worst_aspect}**: {advice}")

    if best_aspect and best_aspect != worst_aspect:
        items.append(
            f"Manfaatkan keunggulan aspek **{best_aspect}** sebagai USP (Unique Selling Point) "
            "dalam materi pemasaran — ini yang paling disukai pelanggan kamu."
        )

    if crisis_count > 0:
        items.append(
            f"Prioritaskan respons personal terhadap {crisis_count} ulasan krisis yang terdeteksi. "
            "Gunakan template suggested reply yang disediakan, lalu tindak lanjuti secara privat "
            "dalam 24 jam untuk menunjukkan keseriusan penanganan."
        )
    else:
        items.append(
            "Buat program 'review reward' untuk mendorong pelanggan puas memberikan ulasan publik — "
            "volume ulasan yang lebih tinggi meningkatkan kepercayaan calon pelanggan baru."
        )

    if total >= 100:
        items.append(
            "Jadwalkan analisis sentimen rutin setiap bulan untuk memantau tren. "
            "Bandingkan hasil bulan ini dengan bulan depan untuk mengukur efektivitas perbaikan."
        )
    else:
        items.append(
            f"Kumpulkan lebih banyak ulasan — saat ini baru {total} ulasan yang dianalisis. "
            "Semakin banyak data, semakin akurat insight yang dihasilkan Sigap.ai."
        )

    return items[:5]  # Maksimal 5 action items


def _build_summary(
    business_context: str,
    total: int,
    pos_pct: int,
    neg_pct: int,
    condition: str,
    worst_aspect: str | None,
    crisis_count: int,
    avg_confidence: float,
) -> str:
    condition_phrases = {
        "critical": "dalam kondisi kritis yang membutuhkan perhatian segera",
        "concerning": "menunjukkan tanda-tanda yang perlu segera ditangani",
        "good": "berada dalam kondisi positif yang menggembirakan",
        "moderate": "berada pada kondisi yang cukup baik namun masih ada ruang perbaikan",
        "needs_improvement": "memerlukan evaluasi dan perbaikan yang lebih serius",
    }

    confidence_note = ""
    if avg_confidence > 0:
        confidence_note = f" dengan tingkat keyakinan model sebesar {avg_confidence * 100:.0f}%"

    crisis_note = ""
    if crisis_count > 0:
        crisis_note = f" Ditemukan {crisis_count} ulasan krisis yang perlu ditangani segera."

    aspect_note = ""
    if worst_aspect:
        aspect_note = f" Aspek '{worst_aspect}' menjadi prioritas utama untuk diperbaiki."

    phrase = condition_phrases.get(condition, "dalam kondisi yang perlu dievaluasi")

    return (
        f"Dari {total:,} ulasan yang dianalisis untuk {business_context}{confidence_note}, "
        f"bisnis kamu {phrase}. Sebanyak {pos_pct}% ulasan bersifat positif "
        f"dan {neg_pct}% bersifat negatif.{crisis_note}{aspect_note} "
        f"Rekomendasi berikut disusun berdasarkan pola yang ditemukan dalam data ulasan kamu."
    )
