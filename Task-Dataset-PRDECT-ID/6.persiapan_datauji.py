# Tujuan: Memisahkan data train dan data uji untuk evaluasi model
# Input : output/PRDECT-ID/dataset_preprocessed.csv
# Output: output/PRDECT-ID/dataset_train.csv
#         output/PRDECT-ID/dataset_test.csv
#         output/PRDECT-ID/laporan_data_uji.txt

import pandas as pd
import os
from sklearn.model_selection import train_test_split

# KONFIGURASI PATH
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH  = os.path.join(ROOT_DIR, "output", "PRDECT-ID", "4.dataset_preprocessing.csv")
OUTPUT_DIR  = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# KONFIGURASI SPLIT
TEST_SIZE    = 0.2   # 20% untuk test, 80% untuk train
RANDOM_STATE = 42    # angka acak tetap agar hasil bisa direproduksi

# LOAD DATA
print("=" * 40)
print("  PERSIAPAN DATA UJI DATASET PRDECT-ID")
print("=" * 40)

df = pd.read_csv(INPUT_PATH)
print(f"\n  Total data masuk     : {len(df):,} baris")
print(f"  Rasio split          : {int((1-TEST_SIZE)*100)}:{int(TEST_SIZE*100)} (train:test)")

# CEK DISTRIBUSI SEBELUM SPLIT
print("\n[1] Distribusi Sentiment_Label sebelum split")
dist_before = df['Sentiment_Label'].value_counts()
for label, count in dist_before.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

# SPLIT DATA = proporsi setiap kelas sentimen tetap sama di train & test
print("\n[2] Melakukan split data (Stratified by Sentiment_Label)")

df_train, df_test = train_test_split(
    df,
    test_size    = TEST_SIZE,
    random_state = RANDOM_STATE,
    stratify     = df['Sentiment_Label']  # memastikan proporsi sentimen seimbang
)

print(f"    Data train           : {len(df_train):,} baris ({int((1-TEST_SIZE)*100)}%)")
print(f"    Data test            : {len(df_test):,} baris ({int(TEST_SIZE*100)}%)")
print("    Selesai")

# CEK DISTRIBUSI SETELAH SPLIT
print("\n[3] Distribusi Sentiment_Label setelah split")

print("    DATA TRAIN:")
dist_train = df_train['Sentiment_Label'].value_counts()
for label, count in dist_train.items():
    pct = round(count / len(df_train) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

print("\n    DATA TEST:")
dist_test = df_test['Sentiment_Label'].value_counts()
for label, count in dist_test.items():
    pct = round(count / len(df_test) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

# CEK DISTRIBUSI CRISIS FLAG
print("\n[4] Distribusi Crisis_Flag setelah split")

print("    DATA TRAIN:")
for label, count in df_train['Crisis_Flag'].value_counts().items():
    pct = round(count / len(df_train) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

print("\n    DATA TEST:")
for label, count in df_test['Crisis_Flag'].value_counts().items():
    pct = round(count / len(df_test) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

# RESET INDEX
df_train = df_train.reset_index(drop=True)
df_test  = df_test.reset_index(drop=True)

# MENYIMPAN HASIL
train_path   = os.path.join(OUTPUT_DIR, "6.dataset_train.csv")
test_path    = os.path.join(OUTPUT_DIR, "6.dataset_test.csv")
laporan_path = os.path.join(OUTPUT_DIR, "6.laporan_datauji.txt")

df_train.to_csv(train_path, index=False, encoding='utf-8-sig')
df_test.to_csv(test_path,   index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PERSIAPAN DATA UJI DATASET PRDECT-ID\n")
    f.write("=" * 50 + "\n\n")
    f.write(f"Total data input         : {len(df):,}\n")
    f.write(f"Rasio split              : {int((1-TEST_SIZE)*100)}:{int(TEST_SIZE*100)} (train:test)\n")
    f.write(f"Random state             : {RANDOM_STATE}\n")
    f.write("Metode split             : Stratified by Sentiment_Label (menjaga proporsi setiap kelas sentimen dikedua bagian)\n\n")
    f.write("─" * 10 + "\n")
    f.write("DATA TRAIN\n")
    f.write("─" * 10 + "\n")
    f.write(f"  Total baris                 : {len(df_train):,}\n")
    f.write("  Distribusi Sentiment_Label  :\n")
    for label, count in dist_train.items():
        pct = round(count / len(df_train) * 100, 1)
        f.write(f"    {label:<12} : {count} ({pct}%)\n")
    f.write("\n")
    f.write("─" * 10 + "\n")
    f.write("DATA TEST\n")
    f.write("─" * 10 + "\n")
    f.write(f"  Total baris                : {len(df_test):,}\n")
    f.write("  Distribusi Sentiment_Label :\n")
    for label, count in dist_test.items():
        pct = round(count / len(df_test) * 100, 1)
        f.write(f"    {label:<12} : {count} ({pct}%)\n")

# RINGKASAN
print("\n" + "=" * 30)
print("  RINGKASAN PERSIAPAN DATA UJI")
print("=" * 30)
print(f"  Total data input       : {len(df):,} baris")
print(f"  Data train             : {len(df_train):,} baris (80%)")
print(f"  Data test              : {len(df_test):,} baris (20%)")
print("  Train disimpan di      : output/PRDECT-ID/6.dataset_train.csv")
print("  Test disimpan di       : output/PRDECT-ID/6.dataset_test.csv")
print("  Laporan disimpan di    : output/PRDECT-ID/6.laporan_datauji.txt")
print("\n  Semua proses dataset PRDECT-ID telah selesai")