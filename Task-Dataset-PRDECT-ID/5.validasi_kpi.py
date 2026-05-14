# Tujuan: Validasi KPI mengecek kualitas dataset
# Input : output/PRDECT-ID/dataset_preprocessing.csv
# Output: output/PRDECT-ID/laporan_validasi_kpi.txt

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_RAW   = os.path.join(ROOT_DIR, "Dataset Ulasan",
                           "PRDECT-ID Indonesian Emotion Classification",
                           "PRDECT-ID_Dataset.csv")
INPUT_FINAL = os.path.join(ROOT_DIR, "output", "PRDECT-ID", "4.dataset_preprocessing.csv")
OUTPUT_DIR  = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("\n" * 1)
print("  VALIDASI KPI DATASET PRDECT-ID")
print("=" * 33)

df_raw   = pd.read_csv(INPUT_RAW)
df_final = pd.read_csv(INPUT_FINAL)

total_raw   = len(df_raw)
total_final = len(df_final)

print(f"  Data mentah (raw)    : {total_raw:,}   baris")
print(f"  Data final           : {total_final:,} baris")

# KPI 1 : NOISE DATA SETELAH CLEANING < 10%
print("\n" * 1)
print("=" * 38)
print("  KPI 1 : NOISE DATA SETELAH CLEANING")
print("=" * 38)

data_terhapus = total_raw - total_final
noise_pct     = round(data_terhapus / total_raw * 100, 2)

print(f"  Data awal               : {total_raw:,}")
print(f"  Data setelah proses     : {total_final:,}")
print(f"  Data terhapus           : {data_terhapus}")
print(f"  Persentase noise        : {noise_pct}%")
print("  Target KPI              : < 10%")

if noise_pct < 10:
    kpi1_status = "Indikator KPI terpenuhi"
    kpi1_result = "terpenuhi"
else:
    kpi1_status = "Indikator KPI tidak terpenuhi"
    kpi1_result = "tidak terpenuhi"

print("  Status                  : {kpi1_status}")

# KPI 2 : KONSISTENSI LABELING ≥ 85%
print("\n" * 1)
print("=" * 30)
print("  KPI 2 : KONSISTENSI LABELING")
print("=" * 30)

# MENGECEK KONSISTENSI dari Rating_Score dan Sentiment_Label
print("  Metode : mengecek konsisten dari Rating_Score dan Sentiment_Label")

def expected_sentiment(rating):
    if rating <= 2:
        return 'Negative'
    elif rating == 3:
        return 'Neutral'
    else:
        return 'Positive'

df_final['Expected_Sentiment'] = df_final['Rating_Score'].apply(expected_sentiment)
konsisten = (df_final['Sentiment_Label'] == df_final['Expected_Sentiment']).sum()
konsistensi_pct = round(konsisten / total_final * 100, 2)

print(f"  Total data                   : {total_final:,}")
print(f"  Label konsisten              : {konsisten:,}")
print(f"  Label tidak konsisten        : {total_final - konsisten:,}")
print(f"  Persentase konsistensi       : {konsistensi_pct}%")
print("  Target KPI                   : ≥ 85%")

# DISTRIBUSI TIDAK KONSISTEN
tidak_konsisten = df_final[df_final['Sentiment_Label'] != df_final['Expected_Sentiment']]
if len(tidak_konsisten) > 0:
    print("\n  Detail tidak konsisten:")
    for sentiment, count in tidak_konsisten['Sentiment_Label'].value_counts().items():
        print(f"    {sentiment:<12} : {count} data")

if konsistensi_pct >= 85:
    kpi2_status = "Indikator KPI terpenuhi"
    kpi2_result = "terpenuhi"
else:
    kpi2_status = "Indikator KPI tidak terpenuhi"
    kpi2_result = "tidak terpenuhi"

print(f"  Status                       : {kpi2_status}")

# KPI 3 : KELENGKAPAN DATASET ≥ 95%
print("\n" * 1)
print("=" * 30)
print("  KPI 3 : KELENGKAPAN DATASET")
print("=" * 30)

# Kolom penting yang harus terisi
kolom_penting = [
    'Review_Text', 'Rating_Score', 'Platform_Source', 'Sentiment_Label',
    'Review_Aspect', 'Crisis_Flag', 'Business_Category', 'Review_Processed']

print(f"  Kolom yang dicek : {kolom_penting}")
print()

total_cells    = total_final * len(kolom_penting)
missing_total  = 0

for kolom in kolom_penting:
    missing = df_final[kolom].isnull().sum()
    missing_total += missing
    status = "Lengkap" if missing == 0 else "Tidak Lengkap"
    print(f"  {status} {kolom:<25} : {missing} missing")

kelengkapan_pct = round((1 - missing_total / total_cells) * 100, 2)

print(f"\n  Total missing           : {missing_total}")
print(f"  Kelengkapan dataset     : {kelengkapan_pct}%")
print("  Target KPI              : ≥ 95%")

if kelengkapan_pct >= 95:
    kpi3_status = "Indikator KPI terpenuhi"
    kpi3_result = "terpenuhi"
else:
    kpi3_status = "Indikator KPI tidak terpenuhi"
    kpi3_result = "tidak terpenuhi"

print(f"  Status                  : {kpi3_status}")

# DISTRIBUSI LABEL FINAL
print("\n" * 1)
print("=" * 30)
print("  DISTRIBUSI LABEL FINAL")
print("=" * 30)

print("\n  Sentiment_label :")
for label, count in df_final['Sentiment_Label'].value_counts().items():
    pct = round(count / total_final * 100, 1)
    print(f"    {label:<12}      : {count:>5} ({pct}%)")

print("\n  Review_aspect :")
for label, count in df_final['Review_Aspect'].value_counts().items():
    pct = round(count / total_final * 100, 1)
    print(f"    {label:<12}      : {count:>5} ({pct}%)")

print("\n  Crisis_flag :")
for label, count in df_final['Crisis_Flag'].value_counts().items():
    pct = round(count / total_final * 100, 1)
    print(f"    {label:<12}      : {count:>5} ({pct}%)")

print("\n  Business_category :")
for label, count in df_final['Business_Category'].value_counts().items():
    pct = round(count / total_final * 100, 1)
    print(f"    {label:<25}       : {count:>5} ({pct}%)")

# RINGKASAN KPI
print("\n" * 1)
print("=" * 30)
print("  RINGKASAN VALIDASI KPI")
print("=" * 30)
print(f"  KPI 1 - Noise < 10%          : {noise_pct}%     -> {kpi1_status}")
print(f"  KPI 2 - Konsistensi ≥ 85%    : {konsistensi_pct}%    -> {kpi2_status}")
print(f"  KPI 3 - Kelengkapan ≥ 95%    : {kelengkapan_pct}%    -> {kpi3_status}")

# MENYIMPAN HASIL
laporan_path = os.path.join(OUTPUT_DIR, "5.laporan_validasi_kpi.txt")
with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("=" * 30 + "\n")
    f.write("LAPORAN VALIDASI KPI DATASET PRDECT-ID\n")
    f.write(f"Data mentah (raw)        : {total_raw:,} baris\n")
    f.write(f"Data final               : {total_final:,} baris\n\n")
    f.write("KPI 1 - NOISE DATA SETELAH CLEANING\n")
    f.write("─" * 30 + "\n")
    f.write(f"  Data terhapus          : {data_terhapus}\n")
    f.write(f"  Persentase noise       : {noise_pct}%\n")
    f.write(" Target                  : < 10%\n")
    f.write(f"  Status                 : {kpi1_result}\n\n")
    f.write("─" * 30 + "\n")
    f.write("KPI 2 - KONSISTENSI LABELING\n")
    f.write("─" * 30 + "\n")
    f.write(f"  Label konsisten        : {konsisten:,}\n")
    f.write(f"  Persentase konsistensi : {konsistensi_pct}%\n")
    f.write("  Target                 : >= 85%\n")
    f.write(f"  Status                 : {kpi2_result}\n\n")
    f.write("─" * 30 + "\n")
    f.write("KPI 3 - KELENGKAPAN DATASET\n")
    f.write("─" * 30 + "\n")
    f.write(f"  Total missing          : {missing_total}\n")
    f.write(f"  Kelengkapan            : {kelengkapan_pct}%\n")
    f.write("  Target                 : >= 95%\n")
    f.write(f"  Status                 : {kpi3_result}\n")

print("\n  Laporan disimpan di    : output/PRDECT-ID/5.laporan_validasi_kpi.txt")