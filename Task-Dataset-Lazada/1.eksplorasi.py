# Dataset: Lazada Indonesian Reviews
# Tujuan : Eksplorasi awal dataset Lazada sebelum cleaning
# Input  : Dataset Ulasan\Lazada Reviews\20191002-reviews.csv
#          Dataset Ulasan\Lazada Reviews\20191002-items.csv
# Output : output\Lazada\1.laporan_eksplorasi.txt
#          output\Lazada\1.ringkasan_kolom_eksplorasi.csv

import os
import pandas as pd

# KONFIGURASI PATH
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR     = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_DIR     = os.path.join(ROOT_DIR, "Dataset Ulasan", "Lazada Reviews")
REVIEWS_PATH = os.path.join(DATA_DIR, "20191002-reviews.csv")
ITEMS_PATH   = os.path.join(DATA_DIR, "20191002-items.csv")
OUTPUT_DIR   = os.path.join(ROOT_DIR, "output", "Lazada")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  EKSPLORASI AWAL DATASET LAZADA INDONESIAN REVIEWS")
print("=" * 55)

df_reviews = pd.read_csv(REVIEWS_PATH, dtype=str, encoding='utf-8-sig').fillna("")
df_items   = pd.read_csv(ITEMS_PATH, dtype=str, encoding='utf-8-sig').fillna("")

print(f"\n  Total review mentah : {len(df_reviews):,}")
print(f"  Total item produk   : {len(df_items):,}")
print(f"  Kolom review        : {df_reviews.columns.tolist()}")
print(f"  Kolom item          : {df_items.columns.tolist()}")

# 1. INFORMASI UMUM
print("\n[1] INFORMASI UMUM")
print(f"    File reviews      : {REVIEWS_PATH}")
print(f"    File items        : {ITEMS_PATH}")
print(f"    Jumlah review     : {len(df_reviews):,}")
print(f"    Jumlah item       : {len(df_items):,}")
print(f"    Jumlah kategori   : {df_reviews['category'].nunique()}")

# 2. KELENGKAPAN PER KOLOM REVIEW
print("\n[2] KELENGKAPAN PER KOLOM REVIEW")
ringkasan_kolom = []

for col in df_reviews.columns:
    non_empty = (df_reviews[col].astype(str).str.strip() != "").sum()
    pct       = round(non_empty / len(df_reviews) * 100, 2) if len(df_reviews) else 0
    contoh    = (
        df_reviews[col].astype(str).str.strip()
        .replace("", pd.NA)
        .dropna()
        .drop_duplicates()
        .head(5)
        .tolist())

    ringkasan_kolom.append({
        'Column_Name'          : col,
        'Non_Empty_Count'     : non_empty,
        'Completeness_Percent': pct,
        'Example_Values'      : " | ".join(contoh)})

    print(f"    {col:<20} : {non_empty:>7} data ({pct}%)")

ringkasan_df = pd.DataFrame(ringkasan_kolom)

# 3. CEK TEKS DAN RATING
print("\n[3] CEK TEKS DAN RATING")
review_content_valid = (df_reviews['reviewContent'].astype(str).str.strip() != "") & (df_reviews['reviewContent'].astype(str).str.lower().str.strip() != "null")
review_title_valid   = (df_reviews['reviewTitle'].astype(str).str.strip() != "") & (df_reviews['reviewTitle'].astype(str).str.lower().str.strip() != "null")
jumlah_teks          = (review_content_valid | review_title_valid).sum()
rating_valid         = df_reviews['rating'].astype(str).str.fullmatch(r'[1-5]').sum()
usable_data          = ((review_content_valid | review_title_valid) & df_reviews['rating'].astype(str).str.fullmatch(r'[1-5]')).sum()
join_match           = df_reviews['itemId'].isin(set(df_items['itemId'])).mean() * 100

print(f"    Review dengan teks valid       : {jumlah_teks:,}")
print(f"    Rating 1-5 valid               : {rating_valid:,}")
print(f"    Data usable                    : {usable_data:,}")
print(f"    Kecocokan itemId reviews-items : {round(join_match, 2)}%")

# 4. DISTRIBUSI RATING
print("\n[4] DISTRIBUSI RATING DATA USABLE")
mask_usable = (review_content_valid | review_title_valid) & df_reviews['rating'].astype(str).str.fullmatch(r'[1-5]')
for rating, count in df_reviews.loc[mask_usable, 'rating'].value_counts().sort_index().items():
    pct = round(count / usable_data * 100, 1)
    print(f"    Rating {rating} : {count:>7} ({pct}%)")

# 5. DISTRIBUSI KATEGORI
print("\n[5] DISTRIBUSI KATEGORI")
for category, count in df_reviews['category'].value_counts().items():
    pct = round(count / len(df_reviews) * 100, 1)
    print(f"    {category:<25} : {count:>7} ({pct}%)")

# 6. PEMETAAN KE LABEL PROYEK
print("\n[6] PEMETAAN KE LABEL PROYEK")
mapping_kolom = {
    'Review_Text'       : 'reviewContent + fallback reviewTitle',
    'Review_Date'       : 'boughtDate, fallback retrievedDate',
    'Rating_Score'      : 'rating',
    'Platform_Source'   : 'diisi Lazada',
    'Sentiment_Label'   : 'dibuat dari Rating_Score',
    'Review_Aspect'     : 'deteksi keyword dari Review_Text',
    'Crisis_Flag'       : 'rating <= 2 dan keyword krisis',
    'Business_Category' : 'Elektronik',
    'Is_Sarcasm'        : 'deteksi dari sentimen negatif dan keyword positif kuat',
    'Product_Name'      : 'join items.name berdasarkan itemId'}

for label, sumber in mapping_kolom.items():
    print(f"    {label:<20} : {sumber}")

# SIMPAN OUTPUT
output_csv = os.path.join(OUTPUT_DIR, "1.ringkasan_kolom_eksplorasi.csv")
output_txt = os.path.join(OUTPUT_DIR, "1.laporan_eksplorasi.txt")

ringkasan_df.to_csv(output_csv, index=False, encoding='utf-8-sig')

with open(output_txt, 'w', encoding='utf-8') as f:
    f.write("LAPORAN EKSPLORASI DATASET LAZADA INDONESIAN REVIEWS\n")
    f.write("=" * 55 + "\n")
    f.write(f"Total review mentah          : {len(df_reviews):,}\n")
    f.write(f"Total item produk            : {len(df_items):,}\n")
    f.write(f"Review dengan teks valid     : {jumlah_teks:,}\n")
    f.write(f"Rating 1-5 valid             : {rating_valid:,}\n")
    f.write(f"Data usable                  : {usable_data:,}\n")
    f.write(f"Kecocokan itemId             : {round(join_match, 2)}%\n\n")
    f.write("Distribusi rating data usable:\n")
    for rating, count in df_reviews.loc[mask_usable, 'rating'].value_counts().sort_index().items():
        pct = round(count / usable_data * 100, 1)
        f.write(f"  Rating {rating} : {count} ({pct}%)\n")
    f.write("\nMapping kolom ke struktur label proyek:\n")
    for label, sumber in mapping_kolom.items():
        f.write(f"  {label:<20} : {sumber}\n")

print("\n  Ringkasan disimpan di : output\\Lazada\\1.laporan_eksplorasi.txt")
print("  CSV kolom disimpan di : output\\Lazada\\1.ringkasan_kolom_eksplorasi.csv")
