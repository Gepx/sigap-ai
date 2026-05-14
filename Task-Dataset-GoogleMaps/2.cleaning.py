# Dataset: Google Maps Reviews
# Tujuan : Pembersihan dataset Apify dari teks kosong, rating tidak valid, dan duplikat
# Input  : Dataset Ulasan\Google Maps Reviews\google_maps_reviews_combined.csv
# Output : output\GoogleMaps\2.dataset_cleaning.csv
#          output\GoogleMaps\2.laporan_cleaning.txt

import os
import re
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
print("  CLEANING DATASET GOOGLE MAPS REVIEWS")
print("=" * 45)

df_raw = pd.read_csv(DATA_PATH, dtype=str, encoding='utf-8-sig').fillna("")
total_awal = len(df_raw)
print(f"\n  Total data awal : {total_awal:,} baris")

# FUNGSI CLEANING TEKS
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# FUNGSI MEMILIH TEKS REVIEW
def pilih_review_text(row):
    text            = clean_text(row.get('text', ''))
    text_translated = clean_text(row.get('textTranslated', ''))
    if text != "":
        return text
    return text_translated

# FUNGSI NORMALISASI TANGGAL
def clean_date(value):
    value = str(value).strip()
    return value if value else 'unknown'

# FUNGSI EKSTRAK RATING
def extract_rating(value):
    value = str(value).strip()
    if re.fullmatch(r'[1-5](\.0)?', value):
        return int(float(value))
    return pd.NA

# 1. PEMETAAN KOLOM SCRAPING KE FORMAT PROYEK
print("\n[1] PEMETAAN KOLOM")
df = pd.DataFrame()
df['Review_Text']       = df_raw.apply(pilih_review_text, axis=1)
df['Review_Date']       = df_raw['publishedAtDate'].apply(clean_date)
df['Rating_Score']      = df_raw['stars'].apply(extract_rating)
df['Platform_Source']   = df_raw['reviewOrigin'].replace('', 'Google Maps')
df['Platform_Source']   = df['Platform_Source'].replace('Google', 'Google Maps')
df['Business_Category'] = 'F&B'
df['Business_Name']     = df_raw['title'].replace('', 'unknown')

print("    text -> Review_Text")
print("    textTranslated -> fallback Review_Text jika text kosong")
print("    publishedAtDate -> Review_Date")
print("    stars -> Rating_Score")
print("    reviewOrigin -> Platform_Source")
print("    title -> Business_Name")
print("    Business_Category -> F&B")

# 2. CEK KONDISI SEBELUM FILTER
print("\n[2] KONDISI SEBELUM FILTER")
teks_kosong    = (df['Review_Text'].str.strip() == "").sum()
rating_invalid = df['Rating_Score'].isna().sum()
duplikat_awal  = df.duplicated(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Business_Name']).sum()

print(f"    Review_Text kosong       : {teks_kosong:,}")
print(f"    Rating tidak valid       : {rating_invalid:,}")
print(f"    Duplikat awal            : {duplikat_awal:,}")

# 3. FILTER TEKS KOSONG
print("\n[3] HAPUS REVIEW_TEXT KOSONG")
sebelum_teks = len(df)
df = df[df['Review_Text'].str.strip() != ""].copy()
hapus_teks = sebelum_teks - len(df)
print(f"    Baris dihapus            : {hapus_teks:,}")
print(f"    Sisa data                : {len(df):,}")

# 4. FILTER RATING TIDAK VALID
print("\n[4] HAPUS RATING TIDAK VALID")
sebelum_rating = len(df)
df = df[df['Rating_Score'].notna()].copy()
hapus_rating = sebelum_rating - len(df)
df['Rating_Score'] = df['Rating_Score'].astype(int)
print(f"    Baris dihapus            : {hapus_rating:,}")
print(f"    Sisa data                : {len(df):,}")

# 5. HAPUS DUPLIKAT
print("\n[5] HAPUS DUPLIKAT")
sebelum_duplikat = len(df)
df = df.drop_duplicates(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Business_Name'])
hapus_duplikat = sebelum_duplikat - len(df)
print(f"    Duplikat dihapus         : {hapus_duplikat:,}")
print(f"    Sisa data                : {len(df):,}")

# 6. CEK KELENGKAPAN SETELAH CLEANING
print("\n[6] KELENGKAPAN SETELAH CLEANING")
kolom_output = [
    'Review_Text',
    'Review_Date',
    'Rating_Score',
    'Platform_Source',
    'Business_Category',
    'Business_Name'
]

for col in kolom_output:
    missing = df[col].isna().sum()
    if df[col].dtype == object:
        missing += (df[col].str.strip() == "").sum()
    pct_isi = round((len(df) - missing) / len(df) * 100, 2) if len(df) else 0
    print(f"    {col:<20} : {pct_isi}% terisi")

# 7. RINGKASAN CLEANING
total_akhir = len(df)
terhapus    = total_awal - total_akhir
noise_pct   = round(terhapus / total_awal * 100, 2) if total_awal else 0

print("\n[7] RINGKASAN CLEANING")
print(f"    Total data awal          : {total_awal:,}")
print(f"    Total data akhir         : {total_akhir:,}")
print(f"    Total terhapus           : {terhapus:,}")
print(f"    Persentase terhapus      : {noise_pct}%")
print("    Catatan                  : rating asli tidak diubah dan teks kosong dihapus.")

# MENYIMPAN HASIL
output_path  = os.path.join(OUTPUT_DIR, "2.dataset_cleaning.csv")
laporan_path = os.path.join(OUTPUT_DIR, "2.laporan_cleaning.txt")

df[kolom_output].to_csv(output_path, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN CLEANING DATASET GOOGLE MAPS REVIEWS\n")
    f.write("=" * 45 + "\n")
    f.write(f"Total data awal             : {total_awal:,}\n")
    f.write(f"Review_Text kosong dihapus  : {hapus_teks:,}\n")
    f.write(f"Rating tidak valid dihapus  : {hapus_rating:,}\n")
    f.write(f"Duplikat dihapus            : {hapus_duplikat:,}\n")
    f.write(f"Total data setelah cleaning : {total_akhir:,}\n")
    f.write(f"Total terhapus              : {terhapus:,}\n")
    f.write(f"Persentase terhapus         : {noise_pct}%\n")
    f.write("Catatan                     : Rating_Score tetap memakai stars asli.\n")

print("\n  Output disimpan di  : output\\GoogleMaps\\2.dataset_cleaning.csv")
print("  Laporan disimpan di : output\\GoogleMaps\\2.laporan_cleaning.txt")
