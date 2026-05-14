# Tujuan: Preprocessing teks untuk kebutuhan pelatihan model
# Input/Dataset : output/PRDECT-ID/dataset_labeling.csv
# Output: output/PRDECT-ID/dataset_preprocessed.csv

import pandas as pd
import os
import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "PRDECT-ID", "3.dataset_labeling.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("PREPROCESSING DATASET PRDECT-ID")
print("=" * 30)

df = pd.read_csv(INPUT_PATH)
print(f"Total data masuk : {len(df):,} baris")

# INISIALISASI TOOLS
print("\nInisialisasi stemmer & stopword remover")
factory        = StemmerFactory()
stemmer        = factory.create_stemmer()

sw_factory     = StopWordRemoverFactory()
stopword_list  = sw_factory.get_stop_words()

# Menambahkan stopword
custom_stopwords = [
    'yg', 'ny', 'nya', 'sih', 'deh', 'nih', 'loh', 'dong', 'banget', 'bgt', 'jg', 'juga',
    'udah', 'udh', 'sudah', 'klo', 'kalo', 'kalau', 'emang', 'memang', 'kayak', 'kyk',
    'aja', 'saja', 'bisa', 'mau', 'msh', 'masih', 'blm', 'belum', 'dgn', 'dengan', 'utk',
    'untuk', 'krn', 'karena', 'tp', 'tapi', 'tdk', 'tidak', 'gak', 'gk', 'ga', 'nggak', 'ngga',
    'dr', 'dari', 'ke', 'di', 'pd', 'pada', 'sbg', 'sebagai']

stopword_list = list(set(stopword_list + custom_stopwords))

print("stemmer & stopword siap")

# KATA NORMALISASI SLANG
slang_dict = {
    # Negasi dan kata umum
    'gak'   : 'tidak', 'gk'    : 'tidak', 'ga'    : 'tidak', 'ngga'  : 'tidak', 'nggak' : 'tidak',
    'tdk'   : 'tidak', 'blm'   : 'belum', 'udah'  : 'sudah', 'udh'   : 'sudah', 'sdh'   : 'sudah', 'msh'   : 'masih',
    # Kata sifat
    'bgs'   : 'bagus', 'bgus'  : 'bagus', 'bgt'   : 'banget', 'ok'    : 'oke',   'oke'   : 'oke',
    'oce'   : 'oke', 'mantul': 'mantap', 'mntap': 'mantap',
    # Layanan
    'ongkir': 'ongkos kirim', 'cod'  : 'bayar ditempat', 'ori'   : 'original',
    # Kata ganti dan sapaan
    'sy'    : 'saya',  'aq'    : 'saya', 'ak'    : 'saya', 'gw'    : 'saya',  'gue'   : 'saya', 'w': 'saya',
    'km'    : 'kamu',  'lo'    : 'kamu', 'lu'    : 'kamu',
    # Kata hubung dan preposisi
    'yg'    : 'yang',  'dgn'   : 'dengan', 'utk'  : 'untuk', 'krn'   : 'karena', 'klo'  : 'kalau', 'kalo' : 'kalau',
    'tp'    : 'tapi',  'tpi'   : 'tapi',   'jg'   : 'juga', 'dl'    : 'dulu',  'dlu'   : 'dulu',
    # Produk dan kualitas
    'kw'    : 'palsu', 'abal'  : 'palsu', 'rusak' : 'rusak', 'jelek' : 'jelek',
    # Pengiriman
    'sampe' : 'sampai', 'nyampe': 'sampai', 'dpt'   : 'dapat',  'dapet' : 'dapat'}

# KAMUS PENGECUALIAN STEMMING
exception_dict = {
    'pengemasan'    : 'kemas', 'kemasan'       : 'kemas', 'pengiriman'    : 'kirim',
    'pembelian'     : 'beli', 'penjualan'     : 'jual', 'pelayanan'     : 'layan', 
    'pembayaran'    : 'bayar', 'penggunaan'    : 'guna', 'kerusakan'     : 'rusak',
    'kekecewaan'    : 'kecewa', 'kepuasan'      : 'puas', 'keterlambatan' : 'lambat',
    'kesesuaian'    : 'sesuai','penampilan'    : 'tampil','pemasangan'    : 'pasang',
    'perawatan'     : 'rawat', 'pemakaian'     : 'pakai','pengalaman'    : 'alami'}

# FUNGSI PREPROCESSING
def normalize_slang(text):
    words  = text.split()
    result = [slang_dict.get(word, word) for word in words]
    return ' '.join(result)

def apply_exception_dict(text):
    words  = text.split()
    result = [exception_dict.get(word, word) for word in words]
    return ' '.join(result)

def remove_stopwords(text):
    words  = text.split()
    result = [w for w in words if w not in stopword_list]
    return ' '.join(result)

def preprocess(text):
    if not isinstance(text, str) or text.strip() == '':
        return ''
    text = text.lower()                         # mengubah teks menjadi huruf kecil
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text) # menghapus karakter non alfanumerik
    text = re.sub(r'\b\d+\b', '', text)         # menghapus angka berdiri sendiri
    text = re.sub(r'\s+', ' ', text).strip()    # menghapus spasi berlebih
    text = normalize_slang(text)                # normalisasi slang
    text = apply_exception_dict(text)           # Menerapkan kamus pengecualian
    text = remove_stopwords(text)               # menghapus stopword
    text = stemmer.stem(text)                   # melakukan proses stemming
    text = re.sub(r'\s+', ' ', text).strip()    # menghapus spasi berlebih
    return text

# PROSES PREPROCESSING
print("\n[1] Normalisasi slang + Stopword Removal + Stemming")

df['Review_Processed'] = df['Review_Text'].apply(preprocess)
print(" Selesai")

# MENGECEK HASIL
print("\n[2] Sample hasil preprocessing (5 data)")
sample = df[['Review_Text', 'Review_Processed']].head(5)
for i, row in sample.iterrows():
    print(f"\n    Original  : {row['Review_Text'][:80]}")
    print(f"    Processed : {row['Review_Processed'][:80]}")

# MENGECEK HASIL KOSONG SETELAH PREPROCESSING
print("\n[3] Cek hasil kosong setelah preprocessing")
kosong = df[df['Review_Processed'].str.strip() == ''].shape[0]
print(f"    Review jadi kosong setelah preprocessing : {kosong} baris")
if kosong > 0:
    df = df[df['Review_Processed'].str.strip() != '']
    print(f"    Baris kosong dihapus, dan menyisakan data : {len(df):,}")

# STATISTIK PANJANG TEKS
print("\n[4] Statistik panjang teks setelah preprocessing")
df['processed_length'] = df['Review_Processed'].apply(lambda x: len(x.split()))
stats = df['processed_length'].describe()
print(f"    Rata-rata kata : {stats['mean']:.1f}")
print(f"    Minimum kata   : {int(stats['min'])}")
print(f"    Maksimum kata  : {int(stats['max'])}")
print(f"    Median kata    : {stats['50%']:.1f}")

# Distribusi Is_Sarcasm
print("\n[5] Distribusi Is_Sarcasm")
for label, count in df['Is_Sarcasm'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")

# MENYUSUN KOLOM FINAL
kolom_final = [
    'Review_Text',
    'Review_Processed',
    'Review_Date',
    'Rating_Score',
    'Platform_Source',
    'Sentiment_Label',
    'Review_Aspect',
    'Crisis_Flag',
    'Business_Category',
    'Is_Sarcasm']

df_final = df[kolom_final]

# MENYIMPAN HASIL
output_path  = os.path.join(OUTPUT_DIR, "4.dataset_preprocessing.csv")
laporan_path = os.path.join(OUTPUT_DIR, "4.laporan_preprocessing.txt")

# Menyimpan CSV dengan encoding utf-8-sig agar kompatibel Excel
df_final.to_csv(output_path, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PREPROCESSING DATASET PRDECT-ID\n")
    f.write("=" * 50 + "\n")
    f.write("\nDistribusi Is_Sarcasm:\n")
    for label, count in df_final['Is_Sarcasm'].value_counts().items():
        pct = round(count / len(df_final) * 100, 1)
        f.write(f"  {label:<12} : {count} ({pct}%)\n")
    f.write(f"Total data input         : {len(df):,}\n")
    f.write(f"Total data output        : {len(df_final):,}\n")
    f.write(f"Review kosong dihapus    : {kosong}\n")
    f.write(f"Rata-rata kata processed : {stats['mean']:.1f}\n")
    f.write(f"Minimum kata             : {int(stats['min'])}\n")
    f.write(f"Maksimum kata            : {int(stats['max'])}\n")
    f.write("\nProses yang dilakukan:\n")
    f.write("  1. Lowercase\n")
    f.write("  2. Hapus karakter non-alfanumerik\n")
    f.write("  3. Hapus angka\n")
    f.write("  4. Normalisasi slang (kamus custom)\n")
    f.write("  5. Stopword removal (PySastrawi + custom)\n")
    f.write("  6. Stemming (PySastrawi)\n")

# RINGKASAN
print("\n" + "=" * 30)
print("  RINGKASAN PREPROCESSING")
print("=" * 30)
print(f"  Total data output      : {len(df_final):,} baris")
print("   Kolom baru             : Review_Processed")
print("   Output disimpan di     : output/PRDECT-ID/4.dataset_preprocessing.csv")
print("   Laporan disimpan di    : output/PRDECT-ID/4.laporan_preprocessing.txt")