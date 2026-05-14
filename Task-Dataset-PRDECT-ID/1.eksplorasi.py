# Dataset: PRDECT-ID Indonesian Emotion Classification
# Tujuan: Eksplorasi awal dataset PRDECT-ID dari Kaggle

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_PATH = os.path.join(
    ROOT_DIR,
    "Dataset Ulasan",
    "PRDECT-ID Indonesian Emotion Classification",
    "PRDECT-ID_Dataset.csv",
)
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATASET
print(" EKSPLORASI AWAL DATASET PRDECT-ID")
print("=" * 35)

df = pd.read_csv(DATA_PATH)

# 1. INFORMASI UMUM
print("\n[1] INFORMASI UMUM")
print(f"    Total baris    : {len(df):,}")
print(f"    Total kolom    : {len(df.columns)}")
print(f"    Nama kolom     : {df.columns.tolist()}")

# 2. TIPE DATA
print("\n[2] TIPE DATA PER KOLOM")
print(df.dtypes.to_string())

# 3. MISSING VALUES
print("\n[3] MISSING VALUES")
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)
missing_df = pd.DataFrame({"Jumlah Missing": missing, "Persentase (%)": missing_pct})
print(missing_df.to_string())

total_missing = missing.sum()
completeness = round((1 - total_missing / (len(df) * len(df.columns))) * 100, 2)
print(f"\nTingkat Kelengkapan Dataset : {completeness}%")
print(
    f"    {'INDIKATOR KPI TERPENUHI (≥ 95%)' if completeness >= 95 else 'INDIKATOR KPI TIDAK TERPENUHI (≥ 95%)'}"
)

# 4. DUPLIKAT
print("\n[4] DATA DUPLIKAT")
dup_count = df.duplicated().sum()
print(f"    Jumlah baris duplikat : {dup_count}")
if dup_count > 0:
    print("    Contoh baris duplikat :")
    print(df[df.duplicated(keep=False)].head(6).to_string())

# 5. DISTRIBUSI SENTIMEN
print("\n[5] DISTRIBUSI SENTIMEN")
sentiment_dist = df["Sentiment"].value_counts()
for label, count in sentiment_dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} data ({pct}%)")
print()

# 6. DISTRIBUSI EMOSI
print("\n[6] DISTRIBUSI EMOSI")
emotion_dist = df["Emotion"].value_counts()
for label, count in emotion_dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} data ({pct}%)")

# 7. DISTRIBUSI KATEGORI
print("\n[7] DISTRIBUSI KATEGORI PRODUK")
cat_dist = df["Category"].value_counts()
for cat, count in cat_dist.items():
    print(f"    {cat:<35} : {count} data")

# 8. ANALISIS PANJANG TEKS ULASAN
print("\n[8] ANALISIS PANJANG TEKS (Customer Review)")
df["review_length"] = df["Customer Review"].str.len()
stats = df["review_length"].describe()
print(f"    Rata-rata panjang : {stats['mean']:.1f} karakter")
print(f"    Terpanjang        : {int(stats['max'])} karakter")
print(f"    Terpendek         : {int(stats['min'])} karakter")
print(f"    Median            : {stats['50%']:.1f} karakter")

# Ulasan yang sangat pendek (< 10 karakter) berpotensi noise
short_reviews = df[df["review_length"] < 10]
print(f"\n    Review sangat pendek (< 10 karakter) : {len(short_reviews)} data")
if len(short_reviews) > 0:
    print("    Contoh :")
    for val in short_reviews["Customer Review"].head(5).values:
        print(f"      -> '{val}'")

# 9. PERBARUAN KOLOM
print("\n[9] EVALUASI PROSES LABELING")
label_target = {
    "Review_Text": "Customer Review -> perlu direname",
    "Review_Date": "Tidak ada di dataset -> perlu ditambah manual",
    "Rating_Score": "Customer Rating -> perlu direname",
    "Platform_Source": 'Tidak ada -> akan diisi "Tokopedia" untuk semua baris',
    "Sentiment_Label": "Sentiment -> perlu direname",
    "Review_Aspect": "Tidak ada -> perlu labeling manual (Rasa/Harga/Bentuk)",
    "Crisis_Flag": "Tidak ada -> perlu dibuat berdasarkan aturan/logika",
    "Business_Category": "Category -> perlu mapping label ke F&B, Perabotan, dll",
    "Is_Sarcasm": "Tidak ada -> perlu anotasi manual atau model deteksi",
}

for label, status in label_target.items():
    print(f"    {label:<20} : {status}")

# 10. RINGKASAN KONDISI DATA
print("\n[10]RINGKASAN KONDISI AWAL DATASET")
print("=" * 45)
print(f"  Total data         : {len(df):,} baris")
print(f"  Missing values     : {total_missing} (Kelengkapan {completeness}%)")
print(f"  Duplikat           : {dup_count} baris")
print(f"  Kelas sentimen     : {df['Sentiment'].nunique()} (Positif & Negatif saja)")
print(f"  Review pendek      : {len(short_reviews)} baris (< 10 karakter)")
print("=" * 45)

# MENYIMPAN RINGKASAN KE FILE DENGAN FORMAT TXT
summary_path = os.path.join(OUTPUT_DIR, "1.laporan_eksplorasi.txt")
with open(summary_path, "w", encoding="utf-8") as f:
    f.write("RINGKASAN EKSPLORASI DATASET PRDECT-ID\n")
    f.write("=" * 40 + "\n")
    f.write(f"Total baris          : {len(df):,}\n")
    f.write(f"Total kolom          : {len(df.columns)}\n")
    f.write(f"Missing values       : {total_missing}\n")
    f.write(f"Tingkat kelengkapan  : {completeness}%\n")
    f.write(f"Duplikat             : {dup_count}\n")
    f.write(f"Review pendek (<10)  : {len(short_reviews)}\n")
    f.write(f"Kelas sentimen       : {df['Sentiment'].unique().tolist()}\n")
    f.write(f"Kelas emosi          : {df['Emotion'].unique().tolist()}\n")
    f.write(f"Jumlah kategori      : {df['Category'].nunique()}\n")

print(
    "\nRingkasan disimpan di : output/ringkasan_eksplorasi.txt"
)
