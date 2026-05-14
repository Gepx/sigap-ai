# Dataset: Google Maps Reviews
# Tujuan : Eksplorasi awal dataset hasil scraping Apify Google Maps Scraper
# Input  : Dataset Ulasan\Google Maps Reviews\google_maps_reviews_combined.csv
# Output : output\GoogleMaps\1.laporan_eksplorasi.txt
#          output\GoogleMaps\1.ringkasan_kolom_eksplorasi.csv

import os
import pandas as pd

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_PATH  = os.path.join(ROOT_DIR, "Dataset Ulasan",
                          "Google Maps Reviews",
                          "google_maps_reviews_combined.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "GoogleMaps")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  EKSPLORASI AWAL DATASET GOOGLE MAPS REVIEWS")
print("=" * 50)

df = pd.read_csv(DATA_PATH, dtype=str, encoding='utf-8-sig').fillna("")

print(f"\n  Total baris mentah : {len(df):,}")
print(f"  Total kolom mentah : {len(df.columns)}")
print(f"  Nama kolom         : {df.columns.tolist()}")

# 1. INFORMASI UMUM
print("\n[1] INFORMASI UMUM")
print(f"    File sumber        : {DATA_PATH}")
print(f"    Jumlah baris       : {len(df):,}")
print(f"    Jumlah kolom       : {len(df.columns)}")

# 2. KELENGKAPAN PER KOLOM
print("\n[2] KELENGKAPAN PER KOLOM")
ringkasan_kolom = []

for col in df.columns:
    non_empty = (df[col].astype(str).str.strip() != "").sum()
    pct       = round(non_empty / len(df) * 100, 2) if len(df) else 0
    contoh    = (
        df[col].astype(str).str.strip()
        .replace("", pd.NA)
        .dropna()
        .drop_duplicates()
        .head(5)
        .tolist()
    )

    ringkasan_kolom.append({
        'Column_Name'          : col,
        'Non_Empty_Count'     : non_empty,
        'Completeness_Percent': pct,
        'Example_Values'      : " | ".join(contoh)
    })

    print(f"    {col:<20} : {non_empty:>6} data ({pct}%)")

ringkasan_df = pd.DataFrame(ringkasan_kolom)

# 3. IDENTIFIKASI KOLOM PENTING
print("\n[3] IDENTIFIKASI KOLOM PENTING")
mapping_kolom = {
    'Review_Text'       : 'text -> teks ulasan, fallback textTranslated',
    'Review_Date'       : 'publishedAtDate -> tanggal ulasan',
    'Rating_Score'      : 'stars -> rating 1-5',
    'Platform_Source'   : 'reviewOrigin -> Google Maps',
    'Sentiment_Label'   : 'dibuat dari Rating_Score',
    'Review_Aspect'     : 'deteksi keyword dari Review_Text',
    'Crisis_Flag'       : 'rating <= 2 dan keyword krisis',
    'Business_Category' : 'diisi otomatis F&B',
    'Is_Sarcasm'        : 'deteksi dari sentimen negatif dan keyword positif kuat',
    'Business_Name'     : 'title -> nama restoran/tempat'
}

for label, sumber in mapping_kolom.items():
    print(f"    {label:<20} : {sumber}")

# 4. CEK TEKS DAN RATING
print("\n[4] CEK TEKS DAN RATING")

jumlah_teks = ((df['text'].astype(str).str.strip() != "") |
               (df['textTranslated'].astype(str).str.strip() != "")).sum()
rating_raw   = df['stars'].astype(str).str.strip()
rating_valid = rating_raw.str.fullmatch(r'[1-5](\.0)?').sum()
jumlah_tempat = df['title'].replace('', pd.NA).dropna().nunique()

print(f"    Baris dengan teks ulasan       : {jumlah_teks:,}")
print(f"    Baris dengan rating 1-5 valid  : {rating_valid:,}")
print(f"    Jumlah restoran/tempat         : {jumlah_tempat:,}")
print("    Catatan: Rating_Score tetap memakai stars asli dari Google Maps.")

# 5. DISTRIBUSI RATING AWAL
print("\n[5] DISTRIBUSI RATING AWAL")
df_rating_valid = df[rating_raw.str.fullmatch(r'[1-5](\.0)?')].copy()
for rating, count in df_rating_valid['stars'].value_counts().sort_index().items():
    pct = round(count / len(df_rating_valid) * 100, 1)
    print(f"    Rating {rating} : {count:>6} ({pct}%)")

# SIMPAN OUTPUT
output_csv  = os.path.join(OUTPUT_DIR, "1.ringkasan_kolom_eksplorasi.csv")
output_txt  = os.path.join(OUTPUT_DIR, "1.laporan_eksplorasi.txt")

ringkasan_df.to_csv(output_csv, index=False, encoding='utf-8-sig')

with open(output_txt, 'w', encoding='utf-8') as f:
    f.write("LAPORAN EKSPLORASI DATASET GOOGLE MAPS REVIEWS\n")
    f.write("=" * 50 + "\n")
    f.write(f"Total baris mentah        : {len(df):,}\n")
    f.write(f"Total kolom mentah        : {len(df.columns)}\n")
    f.write(f"Baris dengan teks ulasan  : {jumlah_teks:,}\n")
    f.write(f"Rating 1-5 valid          : {rating_valid:,}\n")
    f.write(f"Jumlah restoran/tempat    : {jumlah_tempat:,}\n\n")
    f.write("Mapping kolom ke struktur label proyek:\n")
    for label, sumber in mapping_kolom.items():
        f.write(f"  {label:<20} : {sumber}\n")

print("\n  Ringkasan disimpan di : output\\GoogleMaps\\1.laporan_eksplorasi.txt")
print("  CSV kolom disimpan di : output\\GoogleMaps\\1.ringkasan_kolom_eksplorasi.csv")
