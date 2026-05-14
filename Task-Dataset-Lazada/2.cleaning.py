# Dataset: Lazada Indonesian Reviews
# Tujuan : Pembersihan dataset dari teks kosong, rating tidak valid, dan duplikat
# Input  : Dataset Ulasan\Lazada Reviews\20191002-reviews.csv
#          Dataset Ulasan\Lazada Reviews\20191002-items.csv
# Output : output\Lazada\2.dataset_cleaning.csv
#          output\Lazada\2.laporan_cleaning.txt

import os
import re
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
print("  CLEANING DATASET LAZADA INDONESIAN REVIEWS")
print("=" * 50)

df_reviews = pd.read_csv(REVIEWS_PATH, dtype=str, encoding='utf-8-sig').fillna("")
df_items   = pd.read_csv(ITEMS_PATH, dtype=str, encoding='utf-8-sig').fillna("")
total_awal = len(df_reviews)

print(f"\n  Total data awal : {total_awal:,} baris")

# FUNGSI CLEANING TEKS
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.strip()
    if text.lower() == "null":
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# FUNGSI MEMILIH TEKS REVIEW
def pilih_review_text(row):
    content = clean_text(row.get('reviewContent', ''))
    title   = clean_text(row.get('reviewTitle', ''))
    if content != "" and title != "":
        return f"{title}. {content}"
    if content != "":
        return content
    return title

# FUNGSI NORMALISASI TANGGAL
def clean_date(row):
    bought_date = clean_text(row.get('boughtDate', ''))
    if bought_date != "":
        return bought_date
    retrieved_date = clean_text(row.get('retrievedDate', ''))
    return retrieved_date if retrieved_date != "" else "unknown"

# FUNGSI EKSTRAK RATING
def extract_rating(value):
    value = str(value).strip()
    if re.fullmatch(r'[1-5]', value):
        return int(value)
    return pd.NA

# 1. JOIN REVIEWS DENGAN ITEMS
print("\n[1] JOIN REVIEWS DENGAN ITEMS")
df_items_small = df_items[['itemId', 'name', 'brandName', 'price', 'averageRating', 'totalReviews']].copy()
df_items_small = df_items_small.drop_duplicates(subset=['itemId'], keep='first')
df_items_small = df_items_small.rename(columns={
    'name'         : 'Product_Name',
    'brandName'    : 'Brand_Name',
    'price'        : 'Product_Price',
    'averageRating': 'Product_Average_Rating',
    'totalReviews' : 'Product_Total_Reviews'})

df_raw = df_reviews.merge(df_items_small, on='itemId', how='left')
join_missing = df_raw['Product_Name'].isna().sum()
df_raw = df_raw.fillna("")

print(f"    Item tidak berhasil join : {join_missing:,}")
print(f"    Total setelah join       : {len(df_raw):,}")

# 2. PEMETAAN KOLOM KE FORMAT PROYEK
print("\n[2] PEMETAAN KOLOM")
df = pd.DataFrame()
df['Review_Text']       = df_raw.apply(pilih_review_text, axis=1)
df['Review_Date']       = df_raw.apply(clean_date, axis=1)
df['Rating_Score']      = df_raw['rating'].apply(extract_rating)
df['Platform_Source']   = 'Lazada'
df['Business_Category'] = 'Elektronik'
df['Product_Name']      = df_raw['Product_Name'].replace('', 'unknown')
df['Raw_Category']      = df_raw['category']
df['Item_Id']           = df_raw['itemId']

print("    reviewContent + reviewTitle -> Review_Text")
print("    boughtDate/retrievedDate -> Review_Date")
print("    rating -> Rating_Score")
print("    Platform_Source -> Lazada")
print("    Business_Category -> Elektronik")
print("    items.name -> Product_Name")

# 3. KONDISI SEBELUM FILTER
print("\n[3] KONDISI SEBELUM FILTER")
teks_kosong    = (df['Review_Text'].str.strip() == "").sum()
rating_invalid = df['Rating_Score'].isna().sum()
duplikat_awal  = df.duplicated(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Item_Id']).sum()

print(f"    Review_Text kosong       : {teks_kosong:,}")
print(f"    Rating tidak valid       : {rating_invalid:,}")
print(f"    Duplikat awal            : {duplikat_awal:,}")

# 4. HAPUS TEKS KOSONG
print("\n[4] HAPUS REVIEW_TEXT KOSONG")
sebelum_teks = len(df)
df = df[df['Review_Text'].str.strip() != ""].copy()
hapus_teks = sebelum_teks - len(df)
print(f"    Baris dihapus            : {hapus_teks:,}")
print(f"    Sisa data                : {len(df):,}")

# 5. HAPUS RATING TIDAK VALID
print("\n[5] HAPUS RATING TIDAK VALID")
sebelum_rating = len(df)
df = df[df['Rating_Score'].notna()].copy()
hapus_rating = sebelum_rating - len(df)
df['Rating_Score'] = df['Rating_Score'].astype(int)
print(f"    Baris dihapus            : {hapus_rating:,}")
print(f"    Sisa data                : {len(df):,}")

# 6. HAPUS DUPLIKAT
print("\n[6] HAPUS DUPLIKAT")
sebelum_duplikat = len(df)
df = df.drop_duplicates(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Item_Id'])
hapus_duplikat = sebelum_duplikat - len(df)
print(f"    Duplikat dihapus         : {hapus_duplikat:,}")
print(f"    Sisa data                : {len(df):,}")

# 7. KELENGKAPAN SETELAH CLEANING
print("\n[7] KELENGKAPAN SETELAH CLEANING")
kolom_output = [
    'Review_Text',
    'Review_Date',
    'Rating_Score',
    'Platform_Source',
    'Business_Category',
    'Product_Name',
    'Raw_Category',
    'Item_Id']

for col in kolom_output:
    missing = df[col].isna().sum()
    if df[col].dtype == object:
        missing += (df[col].astype(str).str.strip() == "").sum()
    pct_isi = round((len(df) - missing) / len(df) * 100, 2) if len(df) else 0
    print(f"    {col:<20} : {pct_isi}% terisi")

# 8. RINGKASAN CLEANING
total_akhir = len(df)
terhapus    = total_awal - total_akhir
noise_pct   = round(terhapus / total_awal * 100, 2) if total_awal else 0

print("\n[8] RINGKASAN CLEANING")
print(f"    Total data awal          : {total_awal:,}")
print(f"    Total data akhir         : {total_akhir:,}")
print(f"    Total terhapus           : {terhapus:,}")
print(f"    Persentase terhapus      : {noise_pct}%")

# MENYIMPAN HASIL
output_path  = os.path.join(OUTPUT_DIR, "2.dataset_cleaning.csv")
laporan_path = os.path.join(OUTPUT_DIR, "2.laporan_cleaning.txt")

df[kolom_output].to_csv(output_path, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN CLEANING DATASET LAZADA INDONESIAN REVIEWS\n")
    f.write("=" * 50 + "\n")
    f.write(f"Total data awal             : {total_awal:,}\n")
    f.write(f"Item gagal join             : {join_missing:,}\n")
    f.write(f"Review_Text kosong dihapus  : {hapus_teks:,}\n")
    f.write(f"Rating tidak valid dihapus  : {hapus_rating:,}\n")
    f.write(f"Duplikat dihapus            : {hapus_duplikat:,}\n")
    f.write(f"Total data setelah cleaning : {total_akhir:,}\n")
    f.write(f"Total terhapus              : {terhapus:,}\n")
    f.write(f"Persentase terhapus         : {noise_pct}%\n")

print("\n  Output disimpan di  : output\\Lazada\\2.dataset_cleaning.csv")
print("  Laporan disimpan di : output\\Lazada\\2.laporan_cleaning.txt")
