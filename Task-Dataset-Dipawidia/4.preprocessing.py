# Tujuan : Preprocessing teks untuk kebutuhan pelatihan model
# Input  : output\Dipawidia\3.dataset_labeling.csv
# Output : output\Dipawidia\4.dataset_preprocessing.csv
#          output\Dipawidia\4.laporan_preprocessing.txt

import pandas as pd
import os
import re
import time
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "Dipawidia", "3.dataset_labeling.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Dipawidia")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  PREPROCESSING DATASET DIPAWIDIA E-COMMERCE REVIEWS")
print("=" * 40)

df = pd.read_csv(INPUT_PATH, encoding='utf-8')
print(f"\n  Total data masuk : {len(df):,} baris")
print(f"  Kolom            : {df.columns.tolist()}")

# Menyimpan salinan Review_Text asli sebelum diproses
df['Review_Text_Original'] = df['Review_Text']

# KAMUS SLANG
slang_dict = {
    # Singkatan umum
    "yg"        : "yang",         "dg"       : "dengan",        "dgn"           : "dengan",         "utk"           : "untuk",          "tdk"           : "tidak",          "gak"               : "tidak",              "ga"        : "tidak",          "sdh"           : "sudah",
    "gk"        : "tidak",        "ngga"     : "tidak",         "enggak"        : "tidak",          "nggak"         : "tidak",          "g"             : "tidak",          "krn"               : "karena",             "karna"     : "karena",         "bangt"         : "banget",
    "krna"      : "karena",       "tp"       : "tapi",          "tpi"           : "tapi",           "ttg"           : "tentang",        "sm"            : "sama",           "jg"                : "juga",               "jga"       : "juga",           "dpt"           : "dapat",
    "udah"      : "sudah",        "udh"      : "sudah",         "blm"           : "belum",          "blum"          : "belum",          "blom"          : "belum",          "bgt"               : "banget",             "bngt"      : "banget",         "pd"            : "pada",
    "lbh"       : "lebih",        "lebih"    : "lebih",         "klo"           : "kalau",          "klu"           : "kalau",          "kl"            : "kalau",          "bs"                : "bisa",               "bsa"       : "bisa",           "mksh"          : "makasih",
    "mrk"       : "mereka",       "org"      : "orang",         "orng"          : "orang",          "brg"           : "barang",         "barangnya"     : "barang",         "hrgnya"            : "harga",              "hrg"       : "harga",          "bgmn"          : "bagaimana",
    "msh"       : "masih",        "emg"      : "memang",        "emang"         : "memang",         "gmn"           : "gimana",         "gimana"        : "bagaimana",      "thanks"            : "terima kasih",       "tq"        : "terima kasih",   "recommended"   : "rekomendasi",
    "makasih"   : "terima kasih", "trims"    : "terima kasih",  "trimakasih"    : "terima kasih",   "thx"           : "terima kasih",   "rekomend"      : "rekomendasi",    "bohong"            : "tipu",               "palsu"     : "palsu",          "rekomen"       : "rekomendasi",
    "lu"        : "kamu",         "lo"       : "kamu",          "oke"           : "ok",             "okelah"        : "ok",             "oke lah"       : "ok",              "sip"              : "ok",                 "siip"      : "ok",             "mantap"        : "bagus",
    "keren"     : "bagus",        "jos"      : "bagus",         "josss"         : "bagus",          "juoss"         : "bagus",          "top"           : "bagus",           "topmarkotop"      : "bagus",              "baguss"    : "bagus",          "parah"         : "buruk",
    "ancur"     : "hancur",       "ancor"    : "hancur",        "rusak"         : "rusak",          "puas"          : "puas",           "memuaskan"     : "puas",            "kecewa"           : "kecewa",             "nyesel"    : "menyesal",       "menyesel"      : "menyesal",
    "telat"     : "terlambat",    "lelet"    : "lambat",        "cpt"           : "cepat",          "cpat"          : "cepat",          "niceee"        : "bagus",           "nicee"            : "bagus",              "nice"      : "bagus",          "goodd"         : "bagus",
    "best"      : "bagus",        "worst"    : "buruk",         "bad"           : "buruk",          "worth"         : "sesuai nilai",   "worthit"       : "sesuai nilai",    "worth it"         : "sesuai nilai",       "overpriced": "terlalu mahal",  "murahh"        : "murah",
    "muraaaah"  : "murah",        "mahalll"  : "mahal",         "ori"           : "original",       "origi"         : "original",       "asli"          : "original",        "kw"               : "palsu",              "KW"        : "palsu",          "packaging"     : "kemasan",
    "pake"      : "pakai",        "pk"       : "pakai",         "pkai"          : "pakai",          "nge-cas"       : "mengisi daya",   "ngecas"        : "mengisi daya",    "cas"              : "mengisi daya",       "di cas"    : "mengisi daya",   "dicharge"      : "mengisi daya",
    "charge"    : "mengisi daya", "charger"  : "pengisi daya",  "batre"         : "baterai",        "batrai"        : "baterai",        "bat"           : "baterai",         "gar"              : "garansi",            "grnsi"     : "garansi",        "kualtas"       : "kualitas",
    "kualiti"   : "kualitas",     "respon"   : "respons",       "fast respon"   : "respons cepat",  "fast response" : "respons cepat",  "slow respon"   : "respons lambat",  "slow response"    : "respons lambat",     "pnjual"    : "penjual",        "kece"          : "bagus",
    "seller"    : "penjual",      "toko"     : "toko",          "pengiriman"    : "pengiriman",     "ekspedisi"     : "ekspedisi",      "kurir"         : "kurir",           "kirim"            : "kirim",              "dikirim"   : "dikirim",        "nyampe"        : "sampai",
    "nyampai"   : "sampai",       "ongkir"   : "ongkos kirim",  "retur"         : "return",         "rtrn"          : "return",         "complain"      : "komplain",        "refund"           : "pengembalian dana",  "penipuan"  : "tipu",           "ditipu"        : "tipu",
   }

# KAMUS EXCEPTION STEMMING
# Kata-kata yang TIDAK boleh di-stem karena bisa berubah makna
exception_dict = {
    # Kata domain e-commerce yang maknanya spesifik
    "original"  : "original",   "palsu"     : "palsu",      "garansi"   : "garansi",    "refund"    : "refund",     "return"    : "return",     "komplain"  : "komplain",   "diskon"    : "diskon",     "promo"     : "promo",      "cashback"  : "cashback",
    "ongkir"    : "ongkir",     "packaging" : "packaging",  "seller"    : "seller",     "rating"    : "rating",     "review"    : "review",     "baterai"   : "baterai",    "charger"   : "charger",    "wifi"      : "wifi",       "bluetooth" : "bluetooth",
    "android"   : "android",    "gaming"    : "gaming",     "premium"   : "premium",    "fashion"   : "fashion",    "frozen"    : "frozen",     "enak"      : "enak",       "lezat"     : "lezat",      "gurih"     : "gurih",      "renyah"    : "renyah",
    "crispy"    : "crispy",     "manis"     : "manis",      "pahit"     : "pahit",      "asam"      : "asam",       "pedas"     : "pedas",      "asin"      : "asin",       "empuk"     : "empuk",      "keras"     : "keras",      "lembut"    : "lembut",     "mulus"     : "mulus",
    "halus"     : "halus",      "kasar"     : "kasar",      "tipis"     : "tipis",      "tebal"     : "tebal",      "besar"     : "besar",      "kecil"     : "kecil",      "ringan"    : "ringan",     "berat"     : "berat",      "murah"     : "murah",      "mahal"     : "mahal",
    "hemat"     : "hemat",      "cepat"     : "cepat",      "lambat"    : "lambat",     "rusak"     : "rusak",      "bagus"     : "bagus",      "buruk"     : "buruk",      "jelek"     : "jelek",      "puas"      : "puas",       "kecewa"    : "kecewa",     "hancur"    : "hancur",
    "cacat"     : "cacat",      "tipu"      : "tipu",       "hilang"    : "hilang",     "error"     : "error",      "gagal"     : "gagal"}

# KAMUS STOPWORD CUSTOM
# Kata-kata yang tidak membawa makna penting untuk analisis sentimen ditambahkan diluar stopword default
custom_stopwords = {
    # Kata seru / ekspresi tanpa makna sentimen
    "wah", "wow", "hehe", "haha", "hihi", "hiks", "hahaha", "duh", "aduh", "nah", "lho", "loh", "dong", "toh",
    "nih", "nih", "sih", "deh", "tuh", "yuk", "yah", "ya", "yo", "yoi", "yup", "yep", "yaps", "yep",

    # Kata transisi / pengisi yang tidak berbobot
    "jadi", "terus", "lalu", "kemudian", "setelah", "sebelum", "awal", "akhir", "akhirnya", "ternyata", "memang", "emang",
    "padahal", "bahkan", "malah", "justru", "baru", "lagi", "masih", "sudah", "telah", "pernah", "belum", "sempat",

    # Kata tunjuk / preposisi / konjungsi
    "ini", "itu", "sini", "sana", "situ", "sana", "di", "ke", "dari", "pada", "untuk", "agar", "supaya", "dengan", "tanpa", "oleh", "karena", "sebab", "akibat",
    "jika", "bila", "kalau", "apabila", "walaupun", "meskipun", "tetapi", "tapi", "namun", "akan", "sedang", "dalam", "antara", "melalui", "tentang", "terhadap", "selama", "sejak",

    # Kata ganti orang
    "saya", "kamu", "dia", "mereka", "kami", "kita", "anda", "beliau", "gue", "gua", "gw", "lo", "lu",

    # Kata kuantitas / waktu generik
    "banyak", "sedikit", "sangat", "amat", "sekali", "cukup", "hampir", "paling", "terlalu", "lebih", "kurang",
    "hari", "minggu", "bulan", "tahun", "jam", "menit", "detik", "kemarin", "besok", "sekarang", "nanti", "lama", "cepat", "pertama", "kedua", "ketiga",

    # Kata e-commerce generik tanpa bobot sentimen
    "order", "pesan", "beli", "checkout", "cart", "keranjang", "toko", "shop", "shopee", "tokopedia", "lazada", "blibli",
    "produk", "barang", "item", "paket", "dapat", "terima", "datang", "tiba", "sampai", "kirim", "dikirim",
    "foto", "gambar", "deskripsi", "info", "informasi", "detail", "update", "status", "nomor", "resi"}

# INISIALISASI PYSASTRAWI
print("\n[INISIALISASI] Memuat PySastrawi Stemmer & StopWord Remover")

# Stopword remover PySastrawi (bahasa Indonesia baku)
stop_factory    = StopWordRemoverFactory()
sastrawi_stops  = set(stop_factory.get_stop_words())        # set kata stopword bawaan
all_stopwords   = sastrawi_stops | custom_stopwords         # gabungkan dengan custom

# Stemmer PySastrawi
stem_factory = StemmerFactory()
stemmer      = stem_factory.create_stemmer()

print(f"  Total stopword  : {len(all_stopwords):,} kata")
print("  Stemmer siap digunakan")

# Is_Sarcasm
sarcasm_count     = df['Is_Sarcasm'].value_counts().get('Yes', 0)
non_sarcasm_count = df['Is_Sarcasm'].value_counts().get('No', 0)

print(f"\n  Sarkasme terdeteksi  : {sarcasm_count} ({round(sarcasm_count/len(df)*100, 1)}%)")
print(f"  Tidak sarkasme       : {non_sarcasm_count} ({round(non_sarcasm_count/len(df)*100, 1)}%)")

# FUNGSI PREPROCESSING TEKS
def preprocess_text(text):
    if not isinstance(text, str) or text.strip() == "":
        return ""

    text = text.lower()                         # mengubah teks menjadi huruf kecil
    text = re.sub(r'[^a-z\s]', ' ', text)       # menghapus karakter non alfanumerik
    text = re.sub(r'\b\d+\b', '', text)         # menghapus angka berdiri sendiri
    text = re.sub(r'\s+', ' ', text).strip()    # menghapus spasi yang berlebih
    tokens = text.split()                                       # normalisasi slang
    tokens = [slang_dict.get(word, word) for word in tokens]    # normalisasi slang
    text   = ' '.join(tokens)                                   # normalisasi slang

    # Pengecualian stemming
    placeholders = {}
    tokens = text.split()
    protected_tokens = []
    for i, token in enumerate(tokens):
        if token in exception_dict:
            placeholder = f"EXCPTN{i}EXCPTN"
            placeholders[placeholder] = exception_dict[token]
            protected_tokens.append(placeholder)
        else:
            protected_tokens.append(token)
    text = ' '.join(protected_tokens)

    # Stopword removal
    # Filter token yang bukan stopword
    tokens = text.split()
    tokens = [t for t in tokens if t not in all_stopwords and len(t) > 1]
    text   = ' '.join(tokens)

    text = stemmer.stem(text)                # stemming(PySastrawi)

    # Mengembalikan kata yang dilindungi exception
    for placeholder, original_word in placeholders.items():
        text = text.replace(placeholder.lower(), original_word)  # stemmer lowercase placeholder
        text = text.replace(placeholder, original_word)          # jaga-jaga jika tidak ada di-lowercase

    # Membersihkan spasi akhir
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# EKSEKUSI PREPROCESSING
print("\n[PREPROCESSING] Memproses teks Review_Text")
print(f"  Jumlah baris yang akan diproses : {len(df):,}")

start_time = time.time()

# Menerapkan fungsi preprocessing ke kolom Review_Text
df['Review_Text_Processed'] = df['Review_Text'].apply(preprocess_text)

elapsed = round(time.time() - start_time, 2)
print(f"  Preprocessing selesai dalam    : {elapsed} detik")


# MENDETEKSI SARKASME (Is_Sarcasm)
# Is_Sarcasm sudah dihitung di 3.labeling.py, cukup teruskan kolomnya
sarcasm_count     = df['Is_Sarcasm'].value_counts().get('Yes', 0)
non_sarcasm_count = df['Is_Sarcasm'].value_counts().get('No', 0)
print("\n[IS_SARCASM] Meneruskan hasil dari 3.labeling.py")
print(f"  Terdeteksi sarkasme     : {sarcasm_count:,} ({round(sarcasm_count/len(df)*100, 1)}%)")
print(f"  Tidak sarkasme          : {non_sarcasm_count:,} ({round(non_sarcasm_count/len(df)*100, 1)}%)")

# STATISTIK HASIL PREPROCESSING
print("\n[STATISTIK] Menghitung statistik preprocessing")

# Menghitung panjang teks sebelum dan sesudah  proses preprocessing
df['len_original']  = df['Review_Text'].apply(lambda x: len(str(x).split()))
df['len_processed'] = df['Review_Text_Processed'].apply(lambda x: len(str(x).split()) if x else 0)

# Mendeteksi baris kosong setelah preprocessing (teks menjadi kosong/menghilang)
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
# Menambahkan Is_Sarcasm ke kolom output (sesuai struktur label proyek)
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

# MENYIMPAN OUTPUT
output_csv  = os.path.join(OUTPUT_DIR, "4.dataset_preprocessing.csv")
output_txt  = os.path.join(OUTPUT_DIR, "4.laporan_preprocessing.txt")

# Menyimpan CSV dengan encoding utf-8-sig agar kompatibel Excel
df_final.to_csv(output_csv, index=False, encoding='utf-8-sig')
print(f"\n[SIMPAN] csv tersimpan  : {output_csv}")


with open(output_txt, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PREPROCESSING DATASET DIPAWIDIA E-COMMERCE REVIEWS\n")
    f.write("=" * 50 + "\n\n")

    f.write(f"Total data diproses           : {len(df_final):,} baris\n")

    f.write(" Statistik Panjang Teks\n")
    f.write(f"  Rata-rata sebelum           : {avg_before} kata\n")
    f.write(f"  Rata-rata sesudah           : {avg_after} kata\n")
    f.write(f"  Reduksi token rata-rata     : {reduksi}%\n")
    f.write(f"  Baris kosong pasca proses   : {empty_count}\n\n")

    f.write("Tahapan Preprocessing:\n")
    f.write("  1. Lowercase\n")
    f.write("  2. Hapus karakter non-alfanumerik\n")
    f.write("  3. Hapus angka berdiri sendiri\n")
    f.write("  4. Hapus spasi berlebih\n")
    f.write(f"  5. Normalisasi slang ({len(slang_dict)} entri)\n")
    f.write(f"  6. Pengecualian stemming ({len(exception_dict)} kata)\n")
    f.write(f"  7. Stopword removal ({len(all_stopwords):,} kata total)\n")
    f.write("  8. Stemming (PySastrawi)\n\n")

    f.write("Is_Sarcasm                     :\n")
    f.write(f"  Terdeteksi sarkasme         : {sarcasm_count:,}\n")
    f.write(f"  Tidak sarkasme              : {non_sarcasm_count:,}\n\n")

    f.write("Sentiment_Label               :\n")
    for label, count in df_final['Sentiment_Label'].value_counts().items():
        pct = round(count / len(df_final) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

    f.write("Review_Aspect                 :\n")
    for label, count in df_final['Review_Aspect'].value_counts().items():
        pct = round(count / len(df_final) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

    f.write("Crisis_Flag                   :\n")
    for label, count in df_final['Crisis_Flag'].value_counts().items():
        pct = round(count / len(df_final) * 100, 1)
        f.write(f"  {label:<12} : {count:>6} ({pct}%)\n")

    f.write("Business_Category             :\n")
    for label, count in df_final['Business_Category'].value_counts().items():
        pct = round(count / len(df_final) * 100, 1)
        f.write(f"  {label:<25} : {count:>6} ({pct}%)\n")

    f.write("\nKolom Final:\n")
    for kf in kolom_final:
        f.write(f"  - {kf}\n")

# RINGKASAN AKHIR
print("\n" + "=" * 30)
print("  RINGKASAN PREPROCESSING")
print("=" * 30)
print(f"  Total data diproses          : {len(df_final):,} baris")
print(f"  Kolom output                 : {len(kolom_final)} kolom")
print(f"  Rata-rata token sebelum      : {avg_before} kata")
print(f"  Rata-rata token sesudah      : {avg_after} kata")
print(f"  Reduksi token                : {reduksi}%")
print(f"  Baris kosong pasca proses    : {empty_count}")
print(f"  Sarkasme terdeteksi          : {sarcasm_count:,}")
print(f"  Waktu eksekusi               : {elapsed} detik")
print("  Output: output\\Dipawidia\\4.dataset_preprocessing.csv")
print("  Output: output\\Dipawidia\\4.laporan_preprocessing.txt")
print("=" * 40)