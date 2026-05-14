# Dataset: Dipawidia E-commerce Product Reviews Sentiment
# Tujuan: Eksplorasi awal dataset sebelum cleaning
# Output: output\Dipawidia\ringkasan_eksplorasi.txt

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_PATH  = os.path.join(ROOT_DIR, "Dataset Ulasan",
                          "Dipawidia E-commerce Reviews",
                          "dipawidia_ecommerce_reviews.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Dipawidia")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  EKSPLORASI AWAL DATASET DIPAWIDIA E-COMMERCE REVIEWS")
print("=" * 40)

df = pd.read_csv(DATA_PATH)

# 1.INFORMASI UMUM
print("\n[1] INFORMASI UMUM")
print(f"    Total baris    : {len(df):,}")
print(f"    Total kolom    : {len(df.columns)}")
print(f"    Nama kolom     : {df.columns.tolist()}")

# 2. TIPE DATA
print("\n[2] TIPE DATA PER KOLOM")
print(df.dtypes.to_string())

# 3. MISSING VALUES
print("\n[3] MISSING VALUES")
missing     = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)
missing_df  = pd.DataFrame({
    'Jumlah Missing' : missing,
    'Persentase (%)' : missing_pct})
print(missing_df.to_string())

total_missing = missing.sum()
completeness  = round((1 - total_missing / (len(df) * len(df.columns))) * 100, 2)
print(f"\n    Tingkat Kelengkapan Dataset : {completeness}%")
print(f"    {'KPI Terpenuhi (>= 95%)' if completeness >= 95 else 'KPI Tidak Terpenuhi (>= 95%)'}")

# 4. DUPLIKAT
print("\n[4] DATA DUPLIKAT")
dup_count = df.duplicated().sum()
print(f"    Jumlah baris duplikat : {dup_count}")
if dup_count > 0:
    print("    Contoh baris duplikat :")
    print(df[df.duplicated(keep=False)].head(10).to_string())

# 5. DISTRIBUSI SENTIMEN
print("\n[5] DISTRIBUSI SENTIMEN (label asli: 1/0)")
sentiment_dist = df['sentimen'].value_counts().sort_index()
for label, count in sentiment_dist.items():
    pct     = round(count / len(df) * 100, 1)
    meaning = 'Negative' if label == 0 else 'Positive'
    print(f"    {label} ({meaning:<10}) : {count:>6} ({pct}%)")

print()
print("    Konversi label yang akan dilakukan:")
print("    1 -> Positive")
print("    0 -> Negative")
print("    Neutral -> mendeteksi otomatis dari pola teks")

# 6. ANALISIS PANJANG TEKS
print("\n[6] ANALISIS PANJANG TEKS")
df['review_length'] = df['review'].str.len()
stats = df['review_length'].describe()
print(f"    Rata-rata panjang : {stats['mean']:.1f} karakter")
print(f"    Terpendek         : {int(stats['min'])} karakter")
print(f"    Terpanjang        : {int(stats['max'])} karakter")
print(f"    Median            : {stats['50%']:.1f} karakter")

short_reviews = df[df['review_length'] < 10]
print(f"\n    Review sangat pendek (< 10 karakter) : {len(short_reviews)} data")
if len(short_reviews) > 0:
    print("    Contoh :")
    for val in short_reviews['review'].head(5).values:
        print(f"      -> '{val}'")

# 7. SAMPLE TEKS PER SENTIMEN
print("\n[7] SAMPLE TEKS PER SENTIMEN")
for label in [0, 1]:
    meaning = 'Negative' if label == 0 else 'Positive'
    print(f"\n    Sentimen {label} ({meaning}):")
    samples = df[df['sentimen'] == label]['review'].head(3).tolist()
    for s in samples:
        print(f"    -> {s[:100]}")

# 8. KOLOM YANG PERLU DITAMBAH / DIUBAH
print("\n[8] PEMETAAN KE LABEL PROYEK")
label_target = {
    'Review_Text'       : 'review -> rename',
    'Review_Date'       : 'Tidak ada -> diisi dengan "unknown"',
    'Rating_Score'      : 'Tidak ada -> diisi dengan sentimen (0->2, 1->5)',
    'Platform_Source'   : 'Tidak ada -> diisi dengan "Multi-platform"',
    'Sentiment_Label'   : '0->Negative, 1->Positive, Neutral->deteksi dengan teks',
    'Review_Aspect'     : 'Tidak ada -> deteksi keyword dari teks',
    'Crisis_Flag'       : 'Tidak ada -> logika sentimen Negative + keyword krisis',
    'Business_Category' : 'Tidak ada -> deteksi keyword dari teks',
    'Is_Sarcasm'        : 'Tidak ada -> deteksi dengan pola teks',
}
for label, status in label_target.items():
    print(f"    {label:<20} : {status}")

# 9. RINGKASAN
print("\n" + "=" * 30)
print("  RINGKASAN KONDISI AWAL DATASET")
print("=" * 30)
print(f"  Total data         : {len(df):,} baris")
print(f"  Missing values     : {total_missing}")
print(f"  Kelengkapan        : {completeness}%")
print(f"  Duplikat           : {dup_count} baris")
print("  Kelas sentimen     : 2 (Negative & Positive, belum ada Neutral)")
print(f"  Review pendek      : {len(short_reviews)} baris (< 10 karakter)")
print("=" * 30)

# SIMPAN RINGKASAN
summary_path = os.path.join(OUTPUT_DIR, "1.laporan_eksplorasi.txt")
with open(summary_path, 'w', encoding='utf-8') as f:
    f.write("RINGKASAN EKSPLORASI DATASET DIPAWIDIA E-COMMERCE REVIEWS\n")
    f.write("=" * 40 + "\n")
    f.write(f"Total baris          : {len(df):,}\n")
    f.write(f"Total kolom          : {len(df.columns)}\n")
    f.write(f"Missing values       : {total_missing}\n")
    f.write(f"Tingkat kelengkapan  : {completeness}%\n")
    f.write(f"Duplikat             : {dup_count}\n")
    f.write(f"Review pendek (<10)  : {len(short_reviews)}\n")
    f.write(f"Kelas sentimen       : {df['sentimen'].unique().tolist()}\n")
    f.write("Distribusi sentimen  :\n")
    for label, count in sentiment_dist.items():
        pct     = round(count / len(df) * 100, 1)
        meaning = 'Negative' if label == 0 else 'Positive'
        f.write(f"  {label} ({meaning}) : {count} ({pct}%)\n")

print("\n  Ringkasan disimpan di : output\\Dipawidia\\1.laporan_eksplorasi.txt")