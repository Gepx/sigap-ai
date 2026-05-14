# Tujuan : Validasi KPI dataset Dipawidia setelah preprocessing dengan mengecek 3 KPI utama proyek:
#          1. Noise data setelah cleaning     : < 10%
#          2. Konsistensi labeling            : ≥ 85%
#          3. Kelengkapan dataset             : ≥ 95%
# Input  : output\Dipawidia\4.dataset_preprocessing.csv
# Output : output\Dipawidia\5.laporan_validasi_kpi.txt

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "Dipawidia", "4.dataset_preprocessing.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Dipawidia")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  VALIDASI KPI DATASET DIPAWIDIA E-COMMERCE REVIEWS")
print("=" * 40)

df = pd.read_csv(INPUT_PATH, encoding='utf-8')
total = len(df)
print(f"\n  Total data masuk : {total:,} baris")

# KPI 1 : NOISE DATA < 10%
print("\n" + "=" * 40)
print("  KPI 1 : NOISE DATA (Target: < 10%)")
print("=" * 40)

# Mengecek Review_Text kosong
noise_text_kosong = df['Review_Text'].isna() | (df['Review_Text'].str.strip() == '')
jumlah_text_kosong = noise_text_kosong.sum()
print(f"\n  [1a] Review_Text kosong/NaN         : {jumlah_text_kosong}")

# Mengecek Review_Text_Processed kosong
noise_processed_kosong = df['Review_Text_Processed'].isna() | (df['Review_Text_Processed'].str.strip() == '')
jumlah_processed_kosong = noise_processed_kosong.sum()
print(f"  [1b] Review_Text_Processed kosong   : {jumlah_processed_kosong}")

# Mengecek Rating_Score di luar 1 sampai 5
noise_rating = ~df['Rating_Score'].isin([1, 2, 3, 4, 5])
jumlah_rating_invalid = noise_rating.sum()
print(f"  [1c] Rating_Score tidak valid (1-5) : {jumlah_rating_invalid}")

# Mengecek Sentiment_Label yang tidak valid
valid_sentiments = ['Positive', 'Negative', 'Neutral']
noise_sentiment = ~df['Sentiment_Label'].isin(valid_sentiments)
jumlah_sentiment_invalid = noise_sentiment.sum()
print(f"  [1d] Sentiment_Label tidak valid    : {jumlah_sentiment_invalid}")

# Mengecek duplikat Review_Text
jumlah_duplikat = df.duplicated(subset=['Review_Text']).sum()
print(f"  [1e] Duplikat Review_Text           : {jumlah_duplikat}")

# Menggabungkan semua noise
mask_noise = (
    noise_text_kosong |
    noise_processed_kosong |
    noise_rating |
    noise_sentiment
)
# Menghitung duplikat terpisah karena tidak bisa di OR dengan mask baris
total_noise    = mask_noise.sum() + jumlah_duplikat
pct_noise      = round(total_noise / total * 100, 2)
kpi1_lulus     = pct_noise < 10

print(f"\n  Total noise      : {total_noise} baris")
print(f"  Persentase noise : {pct_noise}%")
print("  Target           : < 10%")
print(f"  Status           : {'KPI terpenuhi' if kpi1_lulus else 'KPI tidak terpenuhi'}")

# KPI 2 : KONSISTENSI LABELING ≥ 85%
print("\n" + "=" * 40)
print("  KPI 2 : KONSISTENSI LABELING (Target: ≥ 85%)")
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
    else:
        return False

df['is_konsisten'] = df.apply(cek_konsistensi, axis=1)

jumlah_konsisten    = df['is_konsisten'].sum()
jumlah_inkonsisten  = total - jumlah_konsisten
pct_konsisten       = round(jumlah_konsisten / total * 100, 2)
kpi2_lulus          = pct_konsisten >= 85

print(f"\n  Label konsisten     : {jumlah_konsisten:,} baris")
print(f"  Label inkonsisten   : {jumlah_inkonsisten:,} baris")
print(f"  Persentase konsisten: {pct_konsisten}%")
print("  Target              : ≥ 85%")
print(f"  Status              : {'KPI terpenuhi' if kpi2_lulus else 'KPI tidak terpenuhi'}")

# Detail inkonsistensi per kombinasi
print("\n  Detail inkonsistensi (Rating vs Sentiment):")
inkonsisten_df = df[~df['is_konsisten']][['Rating_Score', 'Sentiment_Label']]
for combo, count in inkonsisten_df.groupby(['Rating_Score', 'Sentiment_Label']).size().items():
    print(f"    Rating {combo[0]} -> {combo[1]:<12} : {count} baris")

# KPI 3 : KELENGKAPAN DATASET ≥ 95%
print("\n" + "=" * 40)
print("  KPI 3 : KELENGKAPAN DATASET (Target: ≥ 95%)")
print("=" * 40)

# Kolom wajib yang harus terisi
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

print("\n  Cek kelengkapan per kolom:")
total_missing_per_kolom = {}
for kolom in kolom_wajib:
    if kolom in df.columns:
        missing = df[kolom].isna().sum()
        # Tambahan: cek string kosong untuk kolom teks
        if df[kolom].dtype == object:
            missing += (df[kolom].str.strip() == '').sum()
        total_missing_per_kolom[kolom] = missing
        pct_isi = round((total - missing) / total * 100, 2)
        status  = "Terpenuhi" if missing == 0 else "Tidak terpenuhi"
        print(f"    {status} {kolom:<30} : {missing} kosong ({pct_isi}% terisi)")
    else:
        print(f"    Tidak terpenuhi {kolom:<30} : Kolom tidak ada")

# Menghitung baris yang 100% lengkap
df_wajib        = df[kolom_wajib].copy()
baris_lengkap   = df_wajib.dropna().shape[0]

# Mengurangi baris yang ada string kosong di kolom teks
mask_lengkap = pd.Series([True] * total, index=df.index)
for kolom in kolom_wajib:
    if kolom in df.columns:
        mask_lengkap &= df[kolom].notna()
        if df[kolom].dtype == object:
            mask_lengkap &= (df[kolom].str.strip() != '')

baris_lengkap   = mask_lengkap.sum()
pct_lengkap     = round(baris_lengkap / total * 100, 2)
kpi3_lulus      = pct_lengkap >= 95

print(f"\n  Baris lengkap       : {baris_lengkap:,} dari {total:,}")
print(f"  Persentase lengkap  : {pct_lengkap}%")
print("  Target              : ≥ 95%")
print(f"  Status              : {'KPI terpenuhi' if kpi3_lulus else 'KPI tidak terpenuhi'}")

# RINGKASAN KPI
print("\n" + "=" * 30)
print("  RINGKASAN VALIDASI KPI")
print("=" * 30)
print(f"  KPI 1 - Noise data      : {pct_noise}%     (Target < 10%)  {'KPI terpenuhi' if kpi1_lulus else 'KPI tidak terpenuhi'}")
print(f"  KPI 2 - Konsistensi     : {pct_konsisten}%  (Target ≥ 85%)  {'KPI terpenuhi' if kpi2_lulus else 'KPI tidak terpenuhi'}")
print(f"  KPI 3 - Kelengkapan     : {pct_lengkap}%  (Target ≥ 95%)  {'KPI terpenuhi' if kpi3_lulus else 'KPI tidak terpenuhi'}")

semua_lulus = kpi1_lulus and kpi2_lulus and kpi3_lulus
print(f"\n  {'KPI terpenuhi' if semua_lulus else 'KPI tidak terpenuhi'}")

# SIMPAN LAPORAN
laporan_path = os.path.join(OUTPUT_DIR, "5.laporan_validasi_kpi.txt")

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN VALIDASI KPI DATASET DIPAWIDIA E-COMMERCE REVIEWS\n")
    f.write("=" * 50 + "\n\n")
    f.write(f"Total data divalidasi         : {total:,} baris\n\n")

    f.write("KPI 1 - NOISE DATA (Target: < 10%)\n")
    f.write(f"  Review_Text kosong          : {jumlah_text_kosong}\n")
    f.write(f"  Review_Text_Processed kosong: {jumlah_processed_kosong}\n")
    f.write(f"  Rating_Score tidak valid    : {jumlah_rating_invalid}\n")
    f.write(f"  Sentiment_Label tidak valid : {jumlah_sentiment_invalid}\n")
    f.write(f"  Duplikat Review_Text        : {jumlah_duplikat}\n")
    f.write(f"  Total noise                 : {total_noise} ({pct_noise}%)\n")
    f.write(f"  Status                      : {'LULUS' if kpi1_lulus else 'TIDAK LULUS'}\n\n")

    f.write("KPI 2 - KONSISTENSI LABELING (Target: ≥ 85%)\n")
    f.write(f"  Label konsisten             : {jumlah_konsisten:,}\n")
    f.write(f"  Label inkonsisten           : {jumlah_inkonsisten:,}\n")
    f.write(f"  Persentase konsisten        : {pct_konsisten}%\n")
    f.write(f"  Status                      : {'LULUS' if kpi2_lulus else 'TIDAK LULUS'}\n\n")

    f.write("KPI 3 - KELENGKAPAN DATASET (Target: ≥ 95%)\n")
    f.write(f"  Baris lengkap               : {baris_lengkap:,} dari {total:,}\n")
    f.write(f"  Persentase lengkap          : {pct_lengkap}%\n")
    f.write(f"  Status                      : {'LULUS' if kpi3_lulus else 'TIDAK LULUS'}\n\n")

    f.write("RINGKASAN\n")
    f.write(f"  KPI 1 Noise       : {pct_noise}%    → {'LULUS' if kpi1_lulus else 'TIDAK LULUS'}\n")
    f.write(f"  KPI 2 Konsistensi : {pct_konsisten}% → {'LULUS' if kpi2_lulus else 'TIDAK LULUS'}\n")
    f.write(f"  KPI 3 Kelengkapan : {pct_lengkap}% → {'LULUS' if kpi3_lulus else 'TIDAK LULUS'}\n")
    f.write(f"\n  {'SEMUA KPI TERPENUHI' if semua_lulus else 'ADA KPI YANG BELUM TERPENUHI'}\n")

print(f"\nLaporan tersimpan : {laporan_path}")