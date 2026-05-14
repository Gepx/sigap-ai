# Dataset: Dipawidia E-commerce Product Reviews Sentiment
# Tujuan: Pembersihan dataset dari noise, duplikat, dan inkonsistensi label
# Input : Dataset Ulasan\Dipawidia E-commerce Reviews\dipawidia_ecommerce_reviews.csv
# Output: output\Dipawidia\dataset_cleaning.csv
#         output\Dipawidia\laporan_cleaning.txt

import pandas as pd
import os
import re

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_PATH  = os.path.join(ROOT_DIR, "Dataset Ulasan",
                          "Dipawidia E-commerce Reviews",
                          "dipawidia_ecommerce_reviews.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Dipawidia")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("CLEANING DATASET DIPAWIDIA E-COMMERCE REVIEWS")
print("=" * 40)

df = pd.read_csv(DATA_PATH)
total_awal = len(df)
print(f"\n  Total data awal : {total_awal:,} baris")

# KEYWORD UNTUK DETEKSI INKONSISTENSI
keyword_positif = [
    'bagus', 'baik', 'puas', 'senang', 'recommended', 'mantap', 'oke', 'ok', 'memuaskan', 'berkualitas',
    'original', 'ori', 'cepat', 'ramah', 'terbaik', 'suka', 'keren', 'luar biasa', 'worth it', 'worthit',
    'josss', 'jos', 'top', 'kece', 'perfect', 'sempurna', 'enak', 'nyaman', 'awet', 'tahan lama']

keyword_negatif = [
    'rusak', 'kecewa', 'jelek', 'buruk', 'tidak sesuai', 'bohong', 'tipu', 'cacat', 'hancur', 'komplain',
    'refund', 'return', 'lambat', 'lama', 'mahal', 'tidak berfungsi', 'tidak nyala', 'mati', 'error', 'gagal',
    'mengecewakan', 'parah', 'tidak recommended', 'jangan beli', 'sampah', 'robek', 'penyok', 'salah kirim', 'tidak sampai', 'hilang']

def hitung_skor(text, keywords):
    if not isinstance(text, str):
        return 0
    text_lower = text.lower()
    return sum(1 for k in keywords if k in text_lower)

# FUNGSI CLEANING TEKS
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'@\w+|#\w+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\b\d+\b', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# 1. CEK NOISE SEBELUM CLEANING
print("\n[1] KONDISI SEBELUM CLEANING")

dup_sebelum    = df.duplicated().sum()
kosong_sebelum = df['review'].isnull().sum()
df['review_length'] = df['review'].str.len()
pendek_sebelum = df[df['review_length'] < 10].shape[0]

# Hitung inkonsistensi label
df['skor_positif'] = df['review'].apply(lambda x: hitung_skor(x, keyword_positif))
df['skor_negatif'] = df['review'].apply(lambda x: hitung_skor(x, keyword_negatif))

inkonsisten = df[
    ((df['sentimen'] == 0) & (df['skor_positif'] > df['skor_negatif'] + 2)) |
    ((df['sentimen'] == 1) & (df['skor_negatif'] > df['skor_positif'] + 2))
]
inkonsisten_count = len(inkonsisten)

print(f"    Duplikat                  : {dup_sebelum} baris")
print(f"    Review kosong             : {kosong_sebelum} baris")
print(f"    Review pendek (< 10 kar)  : {pendek_sebelum} baris")
print(f"    Label inkonsisten         : {inkonsisten_count} baris ({round(inkonsisten_count/total_awal*100,2)}%)")

noise_awal     = dup_sebelum + kosong_sebelum + pendek_sebelum + inkonsisten_count
noise_pct_awal = round(noise_awal / total_awal * 100, 2)
print(f"\n    Estimasi noise awal       : {noise_awal} baris ({noise_pct_awal}%)")

# 2. HAPUS DUPLIKAT
print("\n[2] HAPUS DUPLIKAT")
df = df.drop_duplicates()
print(f"    Baris setelah menghapus duplikat : {len(df):,}")

# 3. HAPUS REVIEW KOSONG
print("\n[3] HAPUS REVIEW KOSONG")
df = df.dropna(subset=['review'])
print(f"    Baris setelah menghapus review kosong : {len(df):,}")

# 4. FILTER LABEL INKONSISTEN
print("\n[4] FILTER LABEL INKONSISTEN")
sebelum_filter = len(df)

mask_inkonsisten = (
    ((df['sentimen'] == 0) & (df['skor_positif'] > df['skor_negatif'] + 2)) |
    ((df['sentimen'] == 1) & (df['skor_negatif'] > df['skor_positif'] + 2))
)
df = df[~mask_inkonsisten]

print(f"    Label inkonsisten dihapus    : {sebelum_filter - len(df)} baris")
print(f"    Baris setelah filter         : {len(df):,}")

# 5. MEMBERSIHKAN TEKS
print("\n[5] CLEANING TEKS review")
df['review_clean'] = df['review'].apply(clean_text)
df = df[df['review_clean'].str.strip() != ""]
print(f"    Baris setelah cleaning teks  : {len(df):,}")

# 6. MENGHAPUS REVIEW ULASAN YANG PENDEK (< 3 KATA)
print("\n[6] HAPUS REVIEW ULASAN YANG PENDEK (< 3 KATA)")
df['word_count'] = df['review_clean'].apply(lambda x: len(x.split()))
df = df[df['word_count'] >= 3]
print(f"    Baris setelah filter pendek  : {len(df):,}")

# 7. CEK NOISE SETELAH CLEANING
print("\n[7] KONDISI SETELAH CLEANING")
total_akhir     = len(df)
terhapus        = total_awal - total_akhir
noise_pct_akhir = round(terhapus / total_awal * 100, 2)

print(f"    Total data awal        : {total_awal:,}")
print(f"    Total data setelah     : {total_akhir:,}")
print(f"    Total terhapus         : {terhapus}")
print(f"    Persentase noise       : {noise_pct_akhir}%")
print(f"\n    {' KPI noise terpenuhi < 10%' if noise_pct_akhir < 10 else 'KPI noise belum terpenuhi < 10%'}")

# 8. DISTRIBUSI SENTIMEN SETELAH PROSES CLEANING
print("\n[8] DISTRIBUSI SENTIMEN SETELAH CLEANING")
for label, count in df['sentimen'].value_counts().sort_index().items():
    pct     = round(count / total_akhir * 100, 1)
    meaning = 'Negative' if label == 0 else 'Positive'
    print(f"    {label} ({meaning:<10}) : {count:>6} ({pct}%)")

# 9. MENYIMPAN HASIL
df = df.drop(columns=['review_length', 'word_count', 'skor_positif', 'skor_negatif'])

output_path  = os.path.join(OUTPUT_DIR, "2.dataset_cleaning.csv")
laporan_path = os.path.join(OUTPUT_DIR, "2.laporan_cleaning.txt")

df.to_csv(output_path, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN CLEANING DATASET DIPAWIDIA E-COMMERCE REVIEWS\n")
    f.write("=" * 40 + "\n")
    f.write(f"Total data awal          : {total_awal:,}\n")
    f.write(f"Duplikat dihapus         : {dup_sebelum}\n")
    f.write(f"Review kosong dihapus    : {kosong_sebelum}\n")
    f.write(f"Label inkonsisten hapus  : {inkonsisten_count}\n")
    f.write(f"Total data setelah       : {total_akhir:,}\n")
    f.write(f"Total terhapus           : {terhapus}\n")
    f.write(f"Persentase noise awal    : {noise_pct_awal}%\n")
    f.write(f"Persentase noise akhir   : {noise_pct_akhir}%\n")
    f.write(f"KPI noise < 10%          : {'Terpenuhi' if noise_pct_akhir < 10 else 'Belum Terpenuhi'}\n")

# RINGKASAN
print("  RINGKASAN CLEANING")
print("=" * 25)
print(f"  Data awal              : {total_awal:,} baris")
print(f"  Data setelah cleaning  : {total_akhir:,} baris")
print(f"  Data terhapus          : {terhapus} baris")
print(f"  Noise akhir            : {noise_pct_akhir}%")
print("  Output disimpan di     : output\\Dipawidia\\2.dataset_cleaning.csv")
print("  Laporan disimpan di    : output\\Dipawidia\\2.laporan_cleaning.txt")