# Dataset: Google Maps Reviews
# Tujuan : Memisahkan data train dan data uji untuk evaluasi model dengan undersampling kelas mayoritas
# Input  : output\GoogleMaps\4.dataset_preprocessing.csv
# Output : output\GoogleMaps\6.dataset_balanced.csv
#          output\GoogleMaps\6.dataset_train.csv
#          output\GoogleMaps\6.dataset_test.csv
#          output\GoogleMaps\6.laporan_datauji.txt

import os
import pandas as pd
from sklearn.model_selection import train_test_split

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "GoogleMaps", "4.dataset_preprocessing.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "GoogleMaps")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# KONFIGURASI SPLIT DAN UNDERSAMPLING
TEST_SIZE    = 0.2
RANDOM_STATE = 42
MAX_POSITIVE = 1000

# LOAD DATA
print("  PERSIAPAN DATA UJI DATASET GOOGLE MAPS REVIEWS")
print("=" * 55)

df = pd.read_csv(INPUT_PATH, encoding='utf-8-sig')
total_awal = len(df)
print(f"\n  Total data masuk : {total_awal:,} baris")

# MENGHAPUS BARIS TEKS PROCESSED KOSONG
print("\nMenghapus baris dengan teks kosong setelah preprocessing")

df_bersih = df.dropna(subset=['Review_Text_Processed'])
df_bersih = df_bersih[df_bersih['Review_Text_Processed'].astype(str).str.strip() != '']
df_bersih = df_bersih.reset_index(drop=True)

total_bersih = len(df_bersih)
terhapus     = total_awal - total_bersih

print(f"  Baris dihapus    : {terhapus} (teks kosong)")
print(f"  Sisa data        : {total_bersih:,} baris")

# MENGECEK DISTRIBUSI SEBELUM UNDERSAMPLING
print("\n[DISTRIBUSI] Sebelum undersampling:")
dist_awal = df_bersih['Sentiment_Label'].value_counts()
for label, count in dist_awal.items():
    pct = round(count / total_bersih * 100, 1)
    print(f"  {label:<12} : {count:>6} ({pct}%)")

# UNDERSAMPLING KELAS MAYORITAS
print("\n[UNDERSAMPLING] Menyeimbangkan kelas mayoritas Positive")
print("  Rating_Score dan Sentiment_Label asli tidak diubah")
print(f"  Batas maksimal Positive : {MAX_POSITIVE:,} data")

df_positive = df_bersih[df_bersih['Sentiment_Label'] == 'Positive']
df_lainnya  = df_bersih[df_bersih['Sentiment_Label'] != 'Positive']

if len(df_positive) > MAX_POSITIVE:
    df_positive_sample = df_positive.sample(n=MAX_POSITIVE, random_state=RANDOM_STATE)
else:
    df_positive_sample = df_positive.copy()

df_balanced = pd.concat([df_positive_sample, df_lainnya], ignore_index=True)
df_balanced = df_balanced.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)

total_balanced    = len(df_balanced)
terhapus_sampling = total_bersih - total_balanced

print(f"  Positive sebelum         : {len(df_positive):,}")
print(f"  Positive setelah         : {len(df_positive_sample):,}")
print(f"  Data terhapus sampling   : {terhapus_sampling:,}")
print(f"  Total data balanced      : {total_balanced:,}")

print("\n[DISTRIBUSI] Setelah undersampling:")
dist_balanced = df_balanced['Sentiment_Label'].value_counts()
for label, count in dist_balanced.items():
    pct = round(count / total_balanced * 100, 1)
    print(f"  {label:<12} : {count:>6} ({pct}%)")

# SPLIT DATA : TRAIN 80% & TEST 20%
print(f"\n[SPLIT] Membagi data -> Train {int((1-TEST_SIZE)*100)}% : Test {int(TEST_SIZE*100)}%")
print("  Stratifikasi     : Sentiment_Label")
print(f"  Random state     : {RANDOM_STATE}")

df_train, df_test = train_test_split(
    df_balanced,
    test_size    = TEST_SIZE,
    random_state = RANDOM_STATE,
    stratify     = df_balanced['Sentiment_Label'])

df_train = df_train.reset_index(drop=True)
df_test  = df_test.reset_index(drop=True)

print(f"\n  Total data train : {len(df_train):,} baris")
print(f"  Total data test  : {len(df_test):,} baris")

# MENGECEK DISTRIBUSI SETELAH SPLIT
print("\n[DISTRIBUSI] Data Train:")
for label, count in df_train['Sentiment_Label'].value_counts().items():
    pct = round(count / len(df_train) * 100, 1)
    print(f"  {label:<12} : {count:>6} ({pct}%)")

print("\n[DISTRIBUSI] Data Test:")
for label, count in df_test['Sentiment_Label'].value_counts().items():
    pct = round(count / len(df_test) * 100, 1)
    print(f"  {label:<12} : {count:>6} ({pct}%)")

# KOLOM OUTPUT
kolom_train = [
    'Review_Text',
    'Review_Text_Processed',
    'Review_Date',
    'Rating_Score',
    'Platform_Source',
    'Sentiment_Label',
    'Review_Aspect',
    'Crisis_Flag',
    'Business_Category',
    'Is_Sarcasm']

kolom_test = [
    'Review_Text',
    'Review_Text_Processed',
    'Rating_Score',
    'Sentiment_Label',
    'Review_Aspect',
    'Crisis_Flag',
    'Business_Category',
    'Is_Sarcasm']

# MENYIMPAN HASIL
path_balanced = os.path.join(OUTPUT_DIR, "6.dataset_balanced.csv")
path_train    = os.path.join(OUTPUT_DIR, "6.dataset_train.csv")
path_test     = os.path.join(OUTPUT_DIR, "6.dataset_test.csv")
path_laporan  = os.path.join(OUTPUT_DIR, "6.laporan_datauji.txt")

df_balanced[kolom_train].to_csv(path_balanced, index=False, encoding='utf-8-sig')
df_train[kolom_train].to_csv(path_train, index=False, encoding='utf-8-sig')
df_test[kolom_test].to_csv(path_test, index=False, encoding='utf-8-sig')

print(f"\n[SIMPAN] Balanced tersimpan : {path_balanced}")
print(f"[SIMPAN] Train tersimpan    : {path_train}")
print(f"[SIMPAN] Test tersimpan     : {path_test}")

# LAPORAN
with open(path_laporan, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PERSIAPAN DATA UJI DATASET GOOGLE MAPS REVIEWS\n")
    f.write("=" * 55 + "\n\n")

    f.write(f"Total data awal               : {total_awal:,} baris\n")
    f.write(f"Baris dihapus (teks kosong)   : {terhapus}\n")
    f.write(f"Total data bersih             : {total_bersih:,} baris\n\n")

    f.write("UNDERSAMPLING\n")
    f.write(f"  Positive sebelum            : {len(df_positive):,}\n")
    f.write(f"  Positive setelah            : {len(df_positive_sample):,}\n")
    f.write(f"  Data terhapus sampling      : {terhapus_sampling:,}\n")
    f.write(f"  Total data balanced         : {total_balanced:,}\n")
    f.write("  Catatan                     : Rating_Score dan Sentiment_Label asli tidak diubah\n\n")

    f.write("KONFIGURASI SPLIT\n")
    f.write(f"  Rasio train : test           : {int((1-TEST_SIZE)*100)} : {int(TEST_SIZE*100)}\n")
    f.write("  Stratifikasi                 : Sentiment_Label\n")
    f.write(f"  Random state                 : {RANDOM_STATE}\n\n")

    f.write("HASIL SPLIT\n")
    f.write(f"  Total data train             : {len(df_train):,} baris\n")
    f.write(f"  Total data test              : {len(df_test):,} baris\n\n")

    f.write("DISTRIBUSI SENTIMENT - DATA BALANCED\n")
    for label, count in df_balanced['Sentiment_Label'].value_counts().items():
        pct = round(count / len(df_balanced) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

    f.write("\nDISTRIBUSI SENTIMENT - DATA TRAIN\n")
    for label, count in df_train['Sentiment_Label'].value_counts().items():
        pct = round(count / len(df_train) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

    f.write("\nDISTRIBUSI SENTIMENT - DATA TEST\n")
    for label, count in df_test['Sentiment_Label'].value_counts().items():
        pct = round(count / len(df_test) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

print(f"Laporan tersimpan : {path_laporan}")

# RINGKASAN AKHIR
print("\n" + "=" * 30)
print("  RINGKASAN PERSIAPAN DATA UJI")
print("=" * 30)
print(f"  Total data awal        : {total_awal:,} baris")
print(f"  Terhapus (teks kosong) : {terhapus} baris")
print(f"  Total data bersih      : {total_bersih:,} baris")
print(f"  Total data balanced    : {total_balanced:,} baris")
print(f"  Data train (80%)       : {len(df_train):,} baris")
print(f"  Data test  (20%)       : {len(df_test):,} baris")
print("  Stratifikasi           : Sentiment_Label")
print("  Output balanced : output\\GoogleMaps\\6.dataset_balanced.csv")
print("  Output train    : output\\GoogleMaps\\6.dataset_train.csv")
print("  Output test     : output\\GoogleMaps\\6.dataset_test.csv")
print("  Output txt      : output\\GoogleMaps\\6.laporan_datauji.txt")
