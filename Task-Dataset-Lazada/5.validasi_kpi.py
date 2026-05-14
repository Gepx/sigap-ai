# Dataset: Lazada Indonesian Reviews
# Tujuan : Validasi KPI dataset setelah preprocessing
# Input  : output\Lazada\4.dataset_preprocessing.csv
# Output : output\Lazada\5.validasi_kpi.csv
#          output\Lazada\5.laporan_validasi_kpi.txt

import os
import pandas as pd

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "Lazada", "4.dataset_preprocessing.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Lazada")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  VALIDASI KPI DATASET LAZADA INDONESIAN REVIEWS")
print("=" * 50)

df = pd.read_csv(INPUT_PATH, encoding='utf-8-sig')
total = len(df)
print(f"\n  Total data masuk : {total:,} baris")

# KPI 1 : NOISE DATA < 10%
print("\n" + "=" * 40)
print("  KPI 1 : NOISE DATA (Target: < 10%)")
print("=" * 40)

noise_text_kosong = df['Review_Text'].isna() | (df['Review_Text'].astype(str).str.strip() == '')
jumlah_text_kosong = noise_text_kosong.sum()

noise_processed_kosong = df['Review_Text_Processed'].isna() | (df['Review_Text_Processed'].astype(str).str.strip() == '')
jumlah_processed_kosong = noise_processed_kosong.sum()

noise_rating = ~df['Rating_Score'].isin([1, 2, 3, 4, 5])
jumlah_rating_invalid = noise_rating.sum()

valid_sentiments = ['Positive', 'Negative', 'Neutral']
noise_sentiment = ~df['Sentiment_Label'].isin(valid_sentiments)
jumlah_sentiment_invalid = noise_sentiment.sum()

jumlah_duplikat = df.duplicated(subset=['Review_Text']).sum()

mask_noise = (
    noise_text_kosong |
    noise_processed_kosong |
    noise_rating |
    noise_sentiment
)

total_noise = mask_noise.sum() + jumlah_duplikat
pct_noise   = round(total_noise / total * 100, 2) if total else 100
kpi1_lulus  = pct_noise < 10

print(f"\n  Review_Text kosong          : {jumlah_text_kosong}")
print(f"  Review_Text_Processed kosong: {jumlah_processed_kosong}")
print(f"  Rating_Score tidak valid    : {jumlah_rating_invalid}")
print(f"  Sentiment_Label tidak valid : {jumlah_sentiment_invalid}")
print(f"  Duplikat Review_Text        : {jumlah_duplikat}")
print(f"  Total noise                 : {total_noise} ({pct_noise}%)")
print(f"  Status                      : {'KPI terpenuhi' if kpi1_lulus else 'KPI tidak terpenuhi'}")

# KPI 2 : KONSISTENSI LABELING >= 85%
print("\n" + "=" * 40)
print("  KPI 2 : KONSISTENSI LABELING (Target: >= 85%)")
print("=" * 40)

def cek_konsistensi(row):
    rating    = row['Rating_Score']
    sentiment = row['Sentiment_Label']

    if rating in [1, 2] and sentiment == 'Negative':
        return True
    elif rating == 3 and sentiment == 'Neutral':
        return True
    elif rating in [4, 5] and sentiment == 'Positive':
        return True
    return False

df['is_konsisten'] = df.apply(cek_konsistensi, axis=1)

jumlah_konsisten   = df['is_konsisten'].sum()
jumlah_inkonsisten = total - jumlah_konsisten
pct_konsisten      = round(jumlah_konsisten / total * 100, 2) if total else 0
kpi2_lulus         = pct_konsisten >= 85

print(f"\n  Label konsisten      : {jumlah_konsisten:,} baris")
print(f"  Label inkonsisten    : {jumlah_inkonsisten:,} baris")
print(f"  Persentase konsisten : {pct_konsisten}%")
print(f"  Status               : {'KPI terpenuhi' if kpi2_lulus else 'KPI tidak terpenuhi'}")

# KPI 3 : KELENGKAPAN DATASET >= 95%
print("\n" + "=" * 40)
print("  KPI 3 : KELENGKAPAN DATASET (Target: >= 95%)")
print("=" * 40)

kolom_wajib = [
    'Review_Text',
    'Review_Text_Processed',
    'Review_Date',
    'Rating_Score',
    'Platform_Source',
    'Sentiment_Label',
    'Review_Aspect',
    'Crisis_Flag',
    'Business_Category',
    'Is_Sarcasm'
]

mask_lengkap = pd.Series([True] * total, index=df.index)

print("\n  Cek kelengkapan per kolom:")
for kolom in kolom_wajib:
    missing = df[kolom].isna().sum()
    if df[kolom].dtype == object:
        missing += (df[kolom].astype(str).str.strip() == '').sum()
    pct_isi = round((total - missing) / total * 100, 2) if total else 0
    mask_lengkap &= df[kolom].notna()
    if df[kolom].dtype == object:
        mask_lengkap &= (df[kolom].astype(str).str.strip() != '')
    print(f"    {kolom:<30} : {missing} kosong ({pct_isi}% terisi)")

baris_lengkap = mask_lengkap.sum()
pct_lengkap   = round(baris_lengkap / total * 100, 2) if total else 0
kpi3_lulus    = pct_lengkap >= 95

print(f"\n  Baris lengkap       : {baris_lengkap:,} dari {total:,}")
print(f"  Persentase lengkap  : {pct_lengkap}%")
print(f"  Status              : {'KPI terpenuhi' if kpi3_lulus else 'KPI tidak terpenuhi'}")

# RINGKASAN KPI
semua_lulus = kpi1_lulus and kpi2_lulus and kpi3_lulus

print("\n" + "=" * 30)
print("  RINGKASAN VALIDASI KPI")
print("=" * 30)
print(f"  KPI 1 - Noise data      : {pct_noise}%")
print(f"  KPI 2 - Konsistensi     : {pct_konsisten}%")
print(f"  KPI 3 - Kelengkapan     : {pct_lengkap}%")
print(f"\n  {'SEMUA KPI TERPENUHI' if semua_lulus else 'ADA KPI YANG BELUM TERPENUHI'}")

# MENYIMPAN HASIL
hasil_kpi = pd.DataFrame([
    {'KPI': 'Noise data setelah cleaning', 'Target': '< 10%',  'Nilai': pct_noise,     'Status': 'Lolos' if kpi1_lulus else 'Belum Lolos'},
    {'KPI': 'Konsistensi labeling',        'Target': '>= 85%', 'Nilai': pct_konsisten, 'Status': 'Lolos' if kpi2_lulus else 'Belum Lolos'},
    {'KPI': 'Kelengkapan dataset',         'Target': '>= 95%', 'Nilai': pct_lengkap,   'Status': 'Lolos' if kpi3_lulus else 'Belum Lolos'}
])

output_csv   = os.path.join(OUTPUT_DIR, "5.validasi_kpi.csv")
laporan_path = os.path.join(OUTPUT_DIR, "5.laporan_validasi_kpi.txt")

hasil_kpi.to_csv(output_csv, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN VALIDASI KPI DATASET LAZADA INDONESIAN REVIEWS\n")
    f.write("=" * 55 + "\n\n")
    f.write(f"Total data divalidasi         : {total:,} baris\n\n")
    f.write(f"KPI 1 Noise                   : {pct_noise}% -> {'LULUS' if kpi1_lulus else 'TIDAK LULUS'}\n")
    f.write(f"KPI 2 Konsistensi             : {pct_konsisten}% -> {'LULUS' if kpi2_lulus else 'TIDAK LULUS'}\n")
    f.write(f"KPI 3 Kelengkapan             : {pct_lengkap}% -> {'LULUS' if kpi3_lulus else 'TIDAK LULUS'}\n")
    f.write(f"\n{'SEMUA KPI TERPENUHI' if semua_lulus else 'ADA KPI YANG BELUM TERPENUHI'}\n")

print(f"\n  CSV KPI tersimpan     : {output_csv}")
print(f"  Laporan tersimpan     : {laporan_path}")
