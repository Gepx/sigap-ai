# Dataset: Google Maps Reviews
# Tujuan : Preprocessing teks untuk kebutuhan pelatihan model
# Input  : output\GoogleMaps\3.dataset_labeling.csv
# Output : output\GoogleMaps\4.dataset_preprocessing.csv
#          output\GoogleMaps\4.laporan_preprocessing.txt

import os
import re
import time
import pandas as pd
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "GoogleMaps", "3.dataset_labeling.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "GoogleMaps")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  PREPROCESSING DATASET GOOGLE MAPS REVIEWS")
print("=" * 45)

df = pd.read_csv(INPUT_PATH, encoding='utf-8-sig')
print(f"\n  Total data masuk : {len(df):,} baris")
print(f"  Kolom            : {df.columns.tolist()}")

# KAMUS SLANG
slang_dict = {
    "yg"      : "yang",    "dg"      : "dengan", "dgn"     : "dengan", "utk"     : "untuk",
    "tdk"     : "tidak",   "gak"     : "tidak",  "ga"      : "tidak",  "nggak"   : "tidak",
    "ngga"    : "tidak",   "gk"      : "tidak",  "bgt"     : "banget", "bgtt"    : "banget",
    "tp"      : "tapi",    "tpi"     : "tapi",   "krn"     : "karena", "karna"   : "karena",
    "aja"     : "saja",    "jg"      : "juga",   "jd"      : "jadi",   "sdh"     : "sudah",
    "udh"     : "sudah",   "blm"     : "belum",  "msh"     : "masih",  "mksh"    : "terima kasih",
    "makasih" : "terima kasih", "thanks" : "terima kasih", "thx" : "terima kasih",
    "recomend": "recommended", "rekomen": "recommended", "delecious": "delicious",
    "nyaman"  : "nyaman",  "mantap"  : "bagus",  "keren"   : "bagus",  "jos"     : "bagus"
}

# KAMUS EXCEPTION STEMMING
exception_dict = {
    "google"      : "google",      "maps"       : "maps",       "review"    : "review",
    "rating"      : "rating",      "resto"      : "resto",      "restoran"  : "restoran",
    "recommended" : "recommended", "delicious"  : "delicious",  "refund"    : "refund",
    "return"      : "return",      "komplain"   : "komplain",   "promo"     : "promo",
    "diskon"      : "diskon",      "cashback"   : "cashback",   "ongkir"    : "ongkir",
    "packaging"   : "packaging",   "crispy"     : "crispy",     "enak"      : "enak",
    "lezat"       : "lezat",       "gurih"      : "gurih",      "renyah"    : "renyah",
    "pedas"       : "pedas",       "empuk"      : "empuk",      "lembut"    : "lembut",
    "murah"       : "murah",       "mahal"      : "mahal",      "bagus"     : "bagus",
    "buruk"       : "buruk",       "kecewa"     : "kecewa",     "rusak"     : "rusak"
}

# KAMUS STOPWORD CUSTOM
custom_stopwords = {
    "wah", "wow", "hehe", "haha", "hihi", "dong", "nih", "sih", "deh", "lah", "mah",
    "ini", "itu", "sini", "sana", "saya", "aku", "kami", "kita", "mereka", "anda",
    "the", "is", "are", "and", "but", "please", "food", "place", "service",
    "hari", "minggu", "bulan", "tahun", "jam", "menit", "kemarin", "sekarang", "nanti"
}

# INISIALISASI PYSASTRAWI
print("\n[INISIALISASI] Memuat PySastrawi Stemmer & StopWord Remover")

stop_factory   = StopWordRemoverFactory()
sastrawi_stops = set(stop_factory.get_stop_words())
all_stopwords  = sastrawi_stops | custom_stopwords

stem_factory = StemmerFactory()
stemmer      = stem_factory.create_stemmer()

print(f"  Total stopword : {len(all_stopwords):,} kata")
print("  Stemmer siap digunakan")

# FUNGSI PREPROCESSING TEKS
def preprocess_text(text):
    if not isinstance(text, str) or text.strip() == "":
        return ""

    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\b\d+\b', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    tokens = text.split()
    tokens = [slang_dict.get(word, word) for word in tokens]

    placeholders = {}
    protected_tokens = []
    for i, token in enumerate(tokens):
        if token in exception_dict:
            placeholder = f"EXCPTN{i}EXCPTN"
            placeholders[placeholder] = exception_dict[token]
            protected_tokens.append(placeholder)
        else:
            protected_tokens.append(token)

    tokens = [t for t in protected_tokens if t.lower() not in all_stopwords and len(t) > 1]
    text = ' '.join(tokens)
    text = stemmer.stem(text)

    for placeholder, original_word in placeholders.items():
        text = text.replace(placeholder.lower(), original_word)
        text = text.replace(placeholder, original_word)

    text = re.sub(r'\s+', ' ', text).strip()
    return text

# EKSEKUSI PREPROCESSING
print("\n[PREPROCESSING] Memproses teks Review_Text")
print(f"  Jumlah baris yang diproses : {len(df):,}")

start_time = time.time()
df['Review_Text_Processed'] = df['Review_Text'].apply(preprocess_text)
elapsed = round(time.time() - start_time, 2)

print(f"  Preprocessing selesai dalam : {elapsed} detik")

# STATISTIK HASIL PREPROCESSING
print("\n[STATISTIK] Menghitung statistik preprocessing")

df['len_original']  = df['Review_Text'].apply(lambda x: len(str(x).split()))
df['len_processed'] = df['Review_Text_Processed'].apply(lambda x: len(str(x).split()) if x else 0)

empty_after = (df['Review_Text_Processed'].str.strip() == '') | (df['Review_Text_Processed'].isna())
empty_count = empty_after.sum()

avg_before = round(df['len_original'].mean(), 2)
avg_after  = round(df['len_processed'].mean(), 2)
reduksi    = round((1 - avg_after / avg_before) * 100, 1) if avg_before > 0 else 0

print(f"  Rata-rata panjang teks sebelum : {avg_before} kata")
print(f"  Rata-rata panjang teks sesudah : {avg_after} kata")
print(f"  Reduksi token rata-rata        : {reduksi}%")
print(f"  Baris kosong setelah proses    : {empty_count}")

# MENYUSUN KOLOM FINAL
kolom_final = [
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

df_final = df[kolom_final]
df_final = df_final[df_final['Review_Text_Processed'].str.strip() != ""].copy()

# MENYIMPAN OUTPUT
output_csv = os.path.join(OUTPUT_DIR, "4.dataset_preprocessing.csv")
output_txt = os.path.join(OUTPUT_DIR, "4.laporan_preprocessing.txt")

df_final.to_csv(output_csv, index=False, encoding='utf-8-sig')

with open(output_txt, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PREPROCESSING DATASET GOOGLE MAPS REVIEWS\n")
    f.write("=" * 50 + "\n\n")
    f.write(f"Total data masuk              : {len(df):,} baris\n")
    f.write(f"Total data output             : {len(df_final):,} baris\n")
    f.write(f"Baris kosong pasca proses     : {empty_count}\n")
    f.write(f"Rata-rata sebelum             : {avg_before} kata\n")
    f.write(f"Rata-rata sesudah             : {avg_after} kata\n")
    f.write(f"Reduksi token rata-rata       : {reduksi}%\n")
    f.write(f"Waktu eksekusi                : {elapsed} detik\n\n")
    f.write("Tahapan Preprocessing:\n")
    f.write("  1. Lowercase\n")
    f.write("  2. Hapus karakter non-alfanumerik\n")
    f.write("  3. Hapus angka berdiri sendiri\n")
    f.write("  4. Hapus spasi berlebih\n")
    f.write(f"  5. Normalisasi slang ({len(slang_dict)} entri)\n")
    f.write(f"  6. Pengecualian stemming ({len(exception_dict)} kata)\n")
    f.write(f"  7. Stopword removal ({len(all_stopwords):,} kata total)\n")
    f.write("  8. Stemming (PySastrawi)\n")

print("\n" + "=" * 30)
print("  RINGKASAN PREPROCESSING")
print("=" * 30)
print(f"  Total data diproses          : {len(df):,} baris")
print(f"  Total data output            : {len(df_final):,} baris")
print(f"  Baris kosong pasca proses    : {empty_count}")
print(f"  Waktu eksekusi               : {elapsed} detik")
print("  Output: output\\GoogleMaps\\4.dataset_preprocessing.csv")
print("  Output: output\\GoogleMaps\\4.laporan_preprocessing.txt")
