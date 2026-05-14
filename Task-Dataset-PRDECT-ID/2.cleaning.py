# Dataset PRDECT-ID Indonesian Emotion Classification
# Tujuan: Membersihkan dataset PRDECT-ID dari noise dan duplikat
# Output: output/PRDECT-ID/dataset_cleaned.csv

import pandas as pd
import os
import re

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_PATH  = os.path.join(ROOT_DIR, "Dataset Ulasan",
                          "PRDECT-ID Indonesian Emotion Classification",
                          "PRDECT-ID_Dataset.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("CLEANING DATASET PRDECT-ID")
print("=" * 30)

df = pd.read_csv(DATA_PATH)
total_awal = len(df)
print(f"\n  Total data awal : {total_awal:,} baris")

# FUNGSI CLEANING TEKS
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()                         # lowercase
    text = re.sub(r'http\S+|www\S+', '', text)  # menghapus url
    text = re.sub(r'@\w+|#\w+', '', text)       # menghapus mention dan hastag
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text) # menghapus karakter non alfanumerik kecuali spasi
    text = re.sub(r'\b\d+\b', '', text)         # menghapus angka berdiri sendiri
    text = re.sub(r'\s+', ' ', text).strip()    # menghapus spasi yang berlebihan
    return text

# 1. MENGECEK NOISE SEBELUM CLEANING
print("\n[1] KONDISI SEBELUM CLEANING")

# Duplikat
dup_sebelum = df.duplicated().sum()
print(f"    Duplikat               : {dup_sebelum} baris")

# Review yang terpendek (< 10 karakter) berpontensi noise
df['review_length'] = df['Customer Review'].str.len()
pendek_sebelum = df[df['review_length'] < 10].shape[0]
print(f"    Review pendek (< 10)   : {pendek_sebelum} baris")

# Review yang kosong
kosong_sebelum = df['Customer Review'].isnull().sum()
print(f"    Review kosong          : {kosong_sebelum} baris")

# Estimasi noise awal
noise_awal = dup_sebelum + pendek_sebelum + kosong_sebelum
noise_pct_awal = round(noise_awal / total_awal * 100, 2)
print(f"    Estimasi noise awal    : {noise_awal} baris ({noise_pct_awal}%)")

# 2. MENGHAPUS DUPLIKAT
print("\n[2] MENGHAPUS DUPLIKAT")
df = df.drop_duplicates()
print(f"    Baris setelah hapus duplikat : {len(df):,}")

# 3. MENGHAPUS BARIS DENGAN REVIEW YANG KOSONG
print("\n[3] HAPUS REVIEW KOSONG")
df = df.dropna(subset=['Customer Review'])
print(f"    Baris setelah hapus kosong   : {len(df):,}")

# 4. MEMBERSIHKAN TEKS
print("\n[4] CLEANING TEKS Customer Review")
df['Customer Review Clean'] = df['Customer Review'].apply(clean_text)

# Hapus review yang jadi kosong setelah cleaning
df = df[df['Customer Review Clean'].str.strip() != ""]
print(f"    Baris setelah cleaning teks  : {len(df):,}")

# 5. MENGHAPUS REVIEW TERLALU PENDEK (< 3 KATA)
print("\n[5] MENGHAPUS REVIEW TERLALU PENDEK (< 3 kata)")
df['word_count'] = df['Customer Review Clean'].apply(lambda x: len(x.split()))
df = df[df['word_count'] >= 3]
print(f"    Baris setelah filter pendek  : {len(df):,}")

# 6. MENGECEK KONDISI NOISE SETELAH CLEANING
print("\n[6] KONDISI SETELAH CLEANING")
total_akhir   = len(df)
terhapus      = total_awal - total_akhir
noise_pct_akhir = round(terhapus / total_awal * 100, 2)

print(f"    Total data awal        : {total_awal:,}")
print(f"    Total data setelah     : {total_akhir:,}")
print(f"    Total terhapus         : {terhapus}")
print(f"    Persentase noise       : {noise_pct_akhir}%")
print(f"\n    {'KPI noise terpenuhi < 10%' if noise_pct_akhir < 10 else 'KPI noise belum terpenuhi < 10%'}")

# 7. DISTRIBUSI SENTIMEN SETELAH PROSES CLEANING
print("\n[7] DISTRIBUSI SENTIMEN SETELAH PROSES CLEANING")
sentiment_dist = df['Sentiment'].value_counts()
for label, count in sentiment_dist.items():
    pct = round(count / total_akhir * 100, 1)
    print(f"    {label:<12} : {count:>5} data ({pct}%)")

# 8. MENYIMPAN HASIL
# Membuang kolom bantu
df = df.drop(columns=['review_length', 'word_count'])

output_path = os.path.join(OUTPUT_DIR, "2.dataset_cleaning.csv")
df.to_csv(output_path, index=False, encoding='utf-8-sig')

# Menyimpan laporan cleaning
laporan_path = os.path.join(OUTPUT_DIR, "2.laporan_cleaning.txt")
with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN CLEANING DATASET PRDECT-ID\n")
    f.write("=" * 30 + "\n")
    f.write(f"Total data awal          : {total_awal:,}\n")
    f.write(f"Duplikat dihapus         : {dup_sebelum}\n")
    f.write(f"Review kosong dihapus    : {kosong_sebelum}\n")
    f.write(f"Total data setelah       : {total_akhir:,}\n")
    f.write(f"Total terhapus           : {terhapus}\n")
    f.write(f"Persentase noise awal    : {noise_pct_awal}%\n")
    f.write(f"Persentase noise akhir   : {noise_pct_akhir}%\n")
    f.write(f"KPI noise < 10%          : {'Terpenuhi' if noise_pct_akhir < 10 else 'Tidak terpenuhi'}\n")

# RINGKASAN
print("=" * 25)
print("  RINGKASAN CLEANING")
print("=" * 25)
print(f"  Data awal              : {total_awal:,} baris")
print(f"  Data setelah cleaning  : {total_akhir:,} baris")
print(f"  Data terhapus          : {terhapus} baris")
print(f"  Noise akhir            : {noise_pct_akhir}%")
print("   Output disimpan di     : output/PRDECT-ID/2.dataset_cleaning.csv")
print("   Laporan disimpan di    : output/PRDECT-ID/2.laporan_cleaning.txt")