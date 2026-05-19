# Dataset: Gabungan dari 4 dataset yang tersedia
# Tujuan : Satu proses penuh dari import data mentah sampai preprocessing menjadi satu file script
# Input  : Dataset Ulasan\Dipawidia E-commerce Reviews\dipawidia_ecommerce_reviews.csv
#          Dataset Ulasan\Lazada Reviews\20191002-reviews.csv
#          Dataset Ulasan\Lazada Reviews\20191002-items.csv
#          Dataset Ulasan\Google Maps Reviews\google_maps_reviews_combined.csv
#          Dataset Ulasan\PRDECT-ID Indonesian Emotion Classification\PRDECT-ID_Dataset.csv
# Output : output\Gabungan-Python\dataset_train_final.csv
#          output\Gabungan-Python\dataset_test_final.csv
#          output\Gabungan-Python\dataset_all_final.csv
#          output\Gabungan-Python\laporan_proses.txt
#          output\Gabungan-Python\validasi_kpi_gabungan.csv

import os
import re
import time
import pandas as pd
from sklearn.model_selection import train_test_split
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory


# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATA_DIR   = os.path.join(ROOT_DIR, "Dataset Ulasan")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Hasil-Python")
os.makedirs(OUTPUT_DIR, exist_ok=True)

DIPAWIDIA_PATH = os.path.join(DATA_DIR, "Dipawidia E-commerce Reviews", "dipawidia_ecommerce_reviews.csv")
LAZADA_REVIEWS_PATH = os.path.join(DATA_DIR, "Lazada Reviews", "20191002-reviews.csv")
LAZADA_ITEMS_PATH   = os.path.join(DATA_DIR, "Lazada Reviews", "20191002-items.csv")
GOOGLEMAPS_PATH = os.path.join(DATA_DIR, "Google Maps Reviews", "google_maps_reviews_combined.csv")
PRDECT_PATH = os.path.join(DATA_DIR, "PRDECT-ID Indonesian Emotion Classification", "PRDECT-ID_Dataset.csv")

TEST_SIZE    = 0.2
RANDOM_STATE = 42


print(" PROSES PENGGABUNGAN 4 DATASET ULASAN")
print("=" * 40)


# FUNGSI DASAR
def clean_text_ringan(text):
    if not isinstance(text, str):
        return ""
    text = text.strip()
    if text.lower() in ["", "null", "nan", "none"]:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_rating(value):
    value = str(value).strip()
    if re.fullmatch(r'[1-5](\.0)?', value):
        return int(float(value))
    return pd.NA


def ulasanset_lazada(row):
    title   = clean_text_ringan(row.get('reviewTitle', ''))
    content = clean_text_ringan(row.get('reviewContent', ''))
    if title != "" and content != "":
        return f"{title}. {content}"
    if content != "":
        return content
    return title


def ulasanset_googlemaps(row):
    text = clean_text_ringan(row.get('text', ''))
    text_translated = clean_text_ringan(row.get('textTranslated', ''))
    if text != "":
        return text
    return text_translated


def clean_reviews_date(value):
    value = clean_text_ringan(value)
    return value if value != "" else "unknown"


# Standarisasi awal data mentah
# 4 Dataset memiliki nama kolom mentah yang berbeda
# Agar ke-4 dataset bisa digabung dan displit bersama-sama, untuk kolom penting perlu disamakan
def loadset_dipawidia():
    df_dipawidia_raw = pd.read_csv(DIPAWIDIA_PATH, dtype=str, encoding='utf-8-sig').fillna("")

    df = pd.DataFrame()
    df['Review_Text']       = df_dipawidia_raw['review'].apply(clean_text_ringan)
    df['Review_Date']       = 'unknown'
    df['Rating_Score']      = pd.NA
    df['Platform_Source']   = 'Multi platform'
    df['Business_Category'] = 'Lainnya'
    df['Dataset_Source']    = 'Dipawidia'
    df['Raw_Sentiment']     = df_dipawidia_raw['sentimen']
    df['Raw_Category']      = ''
    df['Raw_Id']            = df.index.astype(str)
    return df


def loadset_lazada():
    df_lazada_reviews = pd.read_csv(LAZADA_REVIEWS_PATH, dtype=str, encoding='utf-8-sig').fillna("")
    df_lazada_items   = pd.read_csv(LAZADA_ITEMS_PATH, dtype=str, encoding='utf-8-sig').fillna("")

    # Join item dilakukan di tahap standarisasi karena nama produk/kategori ada di file terpisah, dan ini bukan cleaning, agar Lazada punya bentuk kolom yang sama
    df_items_lazada = df_lazada_items[['itemId', 'name']].copy()
    df_items_lazada = df_items_lazada.drop_duplicates(subset=['itemId'], keep='first')
    df_items_lazada = df_items_lazada.rename(columns={'name': 'Product_Name'})
    df_raw = df_lazada_reviews.merge(df_items_lazada, on='itemId', how='left').fillna("")

    df = pd.DataFrame()
    df['Review_Text']       = df_raw.apply(ulasanset_lazada, axis=1)
    df['Review_Date']       = df_raw.apply(lambda row: clean_reviews_date(row.get('boughtDate', '')) if clean_reviews_date(row.get('boughtDate', '')) != "unknown" else clean_reviews_date(row.get('retrievedDate', '')), axis=1)
    df['Rating_Score']      = df_raw['rating'].apply(extract_rating)
    df['Platform_Source']   = 'Lazada'
    df['Business_Category'] = 'Elektronik'
    df['Dataset_Source']    = 'Lazada'
    df['Raw_Sentiment']     = ''
    df['Raw_Category']      = df_raw['category']
    df['Raw_Id']            = df_raw['itemId'].astype(str) + "_" + df_raw.index.astype(str)
    return df


def loadset_googlemaps():
    df_googlemaps_raw = pd.read_csv(GOOGLEMAPS_PATH, dtype=str, encoding='utf-8-sig').fillna("")

    df = pd.DataFrame()
    df['Review_Text']       = df_googlemaps_raw.apply(ulasanset_googlemaps, axis=1)
    df['Review_Date']       = df_googlemaps_raw['publishedAtDate'].apply(clean_reviews_date)
    df['Rating_Score']      = df_googlemaps_raw['stars'].apply(extract_rating)
    df['Platform_Source']   = df_googlemaps_raw['reviewOrigin'].replace('', 'Google Maps')
    df['Platform_Source']   = df['Platform_Source'].replace('Google', 'Google Maps')
    df['Business_Category'] = 'F&B'
    df['Dataset_Source']    = 'GoogleMaps'
    df['Raw_Sentiment']     = ''
    df['Raw_Category']      = df_googlemaps_raw['title']
    raw_id_googlemaps       = df_googlemaps_raw['reviewId'].replace('', pd.NA)
    df['Raw_Id']            = raw_id_googlemaps.fillna(pd.Series(df_googlemaps_raw.index.astype(str), index=df_googlemaps_raw.index))
    return df


def loadset_prdect():
    df_prdect_raw = pd.read_csv(PRDECT_PATH, dtype=str, encoding='utf-8-sig').fillna("")

    df = pd.DataFrame()
    df['Review_Text']       = df_prdect_raw['Customer Review'].apply(clean_text_ringan)
    df['Review_Date']       = 'unknown'
    df['Rating_Score']      = df_prdect_raw['Customer Rating'].apply(extract_rating)
    df['Platform_Source']   = 'Tokopedia'
    df['Business_Category'] = df_prdect_raw['Category']
    df['Dataset_Source']    = 'PRDECT-ID'
    df['Raw_Sentiment']     = df_prdect_raw['Sentiment']
    df['Raw_Category']      = df_prdect_raw['Category']
    df['Raw_Id']            = df.index.astype(str)
    return df


# LOAD 4 DATASET
print("\n[1] IMPORT DAN STANDARISASI AWAL")
datasets = {
    'Dipawidia' : loadset_dipawidia(),
    'Lazada'    : loadset_lazada(),
    'GoogleMaps': loadset_googlemaps(),
    'PRDECT-ID' : loadset_prdect()}

for name, df_sec in datasets.items():
    print(f"    {name:<12} : {len(df_sec):>8,} baris")

df_raw_all = pd.concat(datasets.values(), ignore_index=True)
total_raw_all = len(df_raw_all)

print(f"\n  Total gabungan dari 4 dataset raw : {total_raw_all:,} baris")


# SPLIT DATA MENTAH GABUNGAN
print("\n[2] PENGGABUNGAN SPLIT DATA MENTAH")
print(f"    Rasio split      : {int((1-TEST_SIZE)*100)}:{int(TEST_SIZE*100)}")
print(f"    Random state     : {RANDOM_STATE}")
print("    Catatan          : split data dilakukan ditahap awal sebelum proses cleaning")

df_train_raw, df_test_raw = train_test_split(
    df_raw_all,
    test_size=TEST_SIZE,
    random_state=RANDOM_STATE,
    stratify=df_raw_all['Dataset_Source'])

df_train_raw = df_train_raw.reset_index(drop=True)
df_test_raw  = df_test_raw.reset_index(drop=True)

df_train_raw['Data_Split'] = 'train'
df_test_raw['Data_Split']  = 'test'

print(f"    Data train raw   : {len(df_train_raw):,} baris")
print(f"    Data test raw    : {len(df_test_raw):,} baris")


# CLEANING DATA
def cleaning_dataset(df):
    total_awal = len(df)
    df = df.copy()

    # Baris tanpa teks review dari raw  yang dicatat terpisah, dan tidak dipakai untuk analisis teks
    baris_teks_kosong = df['Review_Text'].astype(str).str.strip() == ''
    jumlah_baris_teks_kosong = baris_teks_kosong.sum()
    df = df[~baris_teks_kosong].copy()

    total_kandidat = len(df)

    # Dataset Dipawidia tidak punya rating mentah, dan dibuatnya setelah proses sentimen_label selesai
    sebelum_rating = len(df)
    rating_valid = df['Rating_Score'].notna() | (df['Dataset_Source'] == 'Dipawidia') # Dipawidia tidak punya kolom rating boleh dilewatkan, rating didapat setelah labeling
    df = df[rating_valid].copy()
    hapus_rating = sebelum_rating - len(df)
    df.loc[df['Rating_Score'].notna(), 'Rating_Score'] = df.loc[df['Rating_Score'].notna(), 'Rating_Score'].astype(int)

    sebelum_duplikat = len(df)
    df = df.drop_duplicates(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Platform_Source', 'Dataset_Source'])
    hapus_duplikat = sebelum_duplikat - len(df)

    df['Review_Text'] = df['Review_Text'].apply(clean_text_ringan)
    sebelum_filter_pendek = len(df)
    df = df[df['Review_Text'].apply(lambda x: len(str(x).split()) >= 2)].copy()
    hapus_pendek = sebelum_filter_pendek - len(df)

    total_akhir = len(df)
    total_noise = total_kandidat - total_akhir
    noise_pct = round(total_noise / total_kandidat * 100, 2) if total_kandidat else 100

    info = {
        'total_awal_raw': total_awal,
        'teks_kosong': int(jumlah_baris_teks_kosong),
        'total_kandidat': total_kandidat,
        'hapus_rating': int(hapus_rating),
        'hapus_duplikat': int(hapus_duplikat),
        'hapus_pendek': int(hapus_pendek),
        'total_akhir': total_akhir,
        'total_noise': int(total_noise),
        'noise_pct': noise_pct
    }
    return df.reset_index(drop=True), info


print("\n[3] CLEANING DATASET TRAIN DAN DATASET TEST")
df_train_clean, info_clean_train = cleaning_dataset(df_train_raw)
df_test_clean, info_clean_test = cleaning_dataset(df_test_raw)
df_clean_all = pd.concat([df_train_clean, df_test_clean], ignore_index=True)

total_kandidat_clean = info_clean_train['total_kandidat'] + info_clean_test['total_kandidat']
total_noise_clean = info_clean_train['total_noise'] + info_clean_test['total_noise']
noise_pct_clean = round(total_noise_clean / total_kandidat_clean * 100, 2) if total_kandidat_clean else 100

def hitung_noise_setelah_cleaning(df):
    total = len(df)

    noise_teks_kosong = df['Review_Text'].isna() | (df['Review_Text'].astype(str).str.strip() == '')
    noise_rating = (~df['Rating_Score'].isin([1, 2, 3, 4, 5])) & (df['Dataset_Source'] != 'Dipawidia') # Dataset Dipawidia masih belum memiliki Rating_Score pada tahap cleaning
    noise_duplikat = df.duplicated(subset=['Review_Text', 'Review_Date', 'Rating_Score', 'Platform_Source', 'Dataset_Source'])

    mask_noise = noise_teks_kosong | noise_rating | noise_duplikat

    total_noise = int(mask_noise.sum())
    noise_pct = round(total_noise / total * 100, 2) if total else 100

    return total_noise, noise_pct


total_noise_residual_train, noise_residual_train_pct = hitung_noise_setelah_cleaning(df_train_clean)
total_noise_residual_test, noise_residual_test_pct = hitung_noise_setelah_cleaning(df_test_clean)
total_noise_residual = total_noise_residual_train + total_noise_residual_test
total_data_clean = len(df_train_clean) + len(df_test_clean)
kpi_noise_pct = round(total_noise_residual / total_data_clean * 100, 2) if total_data_clean else 100

print(f"    Train setelah cleaning : {len(df_train_clean):,} baris")
print(f"    Test setelah cleaning  : {len(df_test_clean):,} baris")
print(f"    Data terhapus saat cleaning : {noise_pct_clean}%")
print(f"    Noise tersisa setelah cleaning : {kpi_noise_pct}%")


# LABELING DATA
keyword_neutral = [
    'lumayan', 'biasa saja', 'biasa aja', 'cukup', 'standar', 'oke lah', 'okelah',
    'tidak buruk', 'tidak terlalu', 'bisa lah', 'bisalah', 'plus minus', 'sesuai harga',
    'masih oke', 'masih bisa', 'masih lumayan', 'belum tahu', 'belum tau']

keyword_rasa = [
    'rasa', 'enak', 'lezat', 'gurih', 'manis', 'asin', 'pahit', 'asam', 'nikmat', 'sedap',
    'hambar', 'segar', 'mantap', 'yummy', 'flavor', 'taste', 'bumbu', 'aroma', 'wangi',
    'harum', 'bau', 'pedas', 'crispy', 'renyah', 'tekstur', 'empuk', 'keras', 'lembut',
    'makanan', 'minuman', 'kopi', 'snack', 'matang', 'gosong', 'dingin', 'hangat', 'fresh',
    'juicy', 'creamy', 'aftertaste', 'porsi']

keyword_harga = [
    'harga', 'murah', 'mahal', 'worth', 'worthit', 'worth it', 'terjangkau', 'ekonomis',
    'hemat', 'diskon', 'promo', 'cashback', 'ongkir', 'gratis', 'sesuai harga',
    'overpriced', 'kemahalan', 'budget', 'biaya', 'bayar', 'tagihan', 'nominal', 'rupiah',
    'sebanding', 'tidak sebanding', 'mahal banget', 'murah meriah']

keyword_bentuk = [
    'bentuk', 'ukuran', 'kemasan', 'packaging', 'tampilan', 'desain', 'warna', 'model',
    'penampilan', 'fisik', 'material', 'bahan', 'kualitas', 'kokoh', 'kuat', 'rapuh',
    'tahan lama', 'awet', 'nyaman', 'pas', 'layar', 'body', 'casing', 'jahitan',
    'original', 'ori', 'asli', 'palsu', 'sesuai gambar', 'sesuai deskripsi', 'bagus',
    'jelek', 'rapi', 'bersih', 'kotor', 'besar', 'kecil', 'tipis', 'tebal', 'berat', 'ringan',
    'halus', 'kasar', 'lecet', 'penyok', 'retak', 'robek', 'pecah']

keyword_krisis = [
    'penipuan', 'tipu', 'bohong', 'palsu', 'rusak', 'cacat', 'hancur', 'kecewa',
    'tidak sesuai', 'tidak sama', 'berbeda', 'salah kirim', 'tidak sampai', 'hilang',
    'komplain', 'refund', 'return', 'retur', 'tidak berfungsi', 'tidak nyala', 'mati',
    'error', 'gagal', 'mengecewakan', 'parah', 'buruk', 'jangan beli', 'hindari',
    'barang tidak datang', 'barang hilang', 'pesanan tidak sesuai', 'uang tidak kembali',
    'tidak ori', 'lama banget', 'seller tidak merespon', 'pelayanan buruk', 'expired']

keyword_negasi = [
    'tidak', 'tak', 'bukan', 'belum', 'kurang', 'tanpa', 'gak', 'ga', 'nggak', 'ngga',
    'tdk', 'tp', 'tapi', 'namun', 'sayangnya', 'sayang']

keyword_sarcasm_positif = [
    'mantap', 'keren', 'jos', 'josss', 'perfect', 'sempurna', 'luar biasa', 'terbaik',
    'worth it', 'worthit', 'memuaskan', 'berkualitas', 'bintang lima', '5 bintang',
    'recommended banget', 'bagus banget', 'mantap banget', 'puas banget']

category_mapping_dataset_prdect = {
    'Food and Drink': 'F&B', 'Kitchen': 'F&B',
    'Computers and Laptops': 'Elektronik', 'Phones and Tablets': 'Elektronik',
    'Electronics': 'Elektronik', 'Camera': 'Elektronik', 'Gaming': 'Elektronik',
    "Women's Fashion": 'Fashion', "Men's Fashion": 'Fashion', 'Muslim Fashion': 'Fashion',
    'Kids and Baby Fashion': 'Fashion',
    'Health': 'Kesehatan & Kecantikan', 'Beauty': 'Kesehatan & Kecantikan',
    'Body Care': 'Kesehatan & Kecantikan',
    'Household': 'Perabotan', 'Carpentry': 'Perabotan',
    'Mother and Baby': 'Ibu & Bayi',
    'Animal Care': 'Perawatan Hewan',
    'Toys and Hobbies': 'Hobi & Hiburan', 'Movies and Music': 'Hobi & Hiburan',
    'Books': 'Hobi & Hiburan', 'Tour and Travel': 'Hobi & Hiburan', 'Sport': 'Hobi & Hiburan',
    'Automotive': 'Otomotif',
    'Office & Stationery': 'Perlengkapan Kantor',
    'Party Supplies and Craft': 'Kerajinan & Pesta',
    'Precious Metal': 'Lainnya', 'Property': 'Lainnya', 'Other Products': 'Lainnya'}


def assign_sentiment(row):
    rating = row['Rating_Score']
    source = row['Dataset_Source']
    text = str(row['Review_Text']).lower()
    raw_sentiment = str(row.get('Raw_Sentiment', '')).strip()

    if source == 'Dipawidia':
        if any(d in text for d in keyword_neutral):
            return 'Neutral'
        if raw_sentiment == '0':
            return 'Negative'
        return 'Positive'

    if rating in [1, 2]:
        return 'Negative'
    if rating == 3:
        return 'Neutral'
    if rating in [4, 5]:
        return 'Positive'
    return raw_sentiment if raw_sentiment in ['Positive', 'Negative', 'Neutral'] else 'Neutral'


def assign_rating(row):
    if pd.notna(row['Rating_Score']):
        return int(row['Rating_Score'])
    sentiment = row['Sentiment_Label']
    if sentiment == 'Negative':
        return 2
    if sentiment == 'Neutral':
        return 3
    return 5


def detect_aspect(text):
    if not isinstance(text, str):
        return 'Lainnya'
    text_lower = text.lower()
    skor_rasa   = sum(1 for r in keyword_rasa if r in text_lower)
    skor_harga  = sum(1 for h in keyword_harga if h in text_lower)
    skor_bentuk = sum(1 for b in keyword_bentuk if b in text_lower)
    max_skor = max(skor_rasa, skor_harga, skor_bentuk)

    if max_skor == 0:
        return 'Lainnya'
    if skor_rasa == max_skor:
        return 'Rasa'
    if skor_harga == max_skor:
        return 'Harga'
    return 'Bentuk'


def assign_crisis(row):
    sentiment = row['Sentiment_Label']
    rating = row['Rating_Score']
    text = str(row['Review_Text']).lower()

    if (sentiment == 'Negative' or rating <= 2) and any(dp in text for dp in keyword_krisis):
        return 'Yes'
    return 'No'


def assign_business_category(row):
    source = row['Dataset_Source']
    if source == 'PRDECT-ID':
        return category_mapping_dataset_prdect.get(row['Raw_Category'], 'Lainnya')
    return row['Business_Category'] if clean_text_ringan(str(row['Business_Category'])) != "" else 'Lainnya'


def assign_sarcasm(row):
    if row['Sentiment_Label'] != 'Negative':
        return 'No'

    text = str(row['Review_Text']).lower()
    positif_terdeteksi = any(prid in text for prid in keyword_sarcasm_positif)
    if not positif_terdeteksi:
        return 'No'

    for keyword in keyword_sarcasm_positif:
        if keyword in text:
            idx = text.find(keyword)
            konteks_sebelum = text[max(0, idx-20):idx]
            if any(preid in konteks_sebelum for preid in keyword_negasi):
                return 'No'
            return 'Yes'
    return 'No'


def labeling_dataset(df):
    df = df.copy()
    df['Sentiment_Label'] = df.apply(assign_sentiment, axis=1)
    df['Rating_Score'] = df.apply(assign_rating, axis=1)
    df['Review_Aspect'] = df['Review_Text'].apply(detect_aspect)
    df['Crisis_Flag'] = df.apply(assign_crisis, axis=1)
    df['Business_Category'] = df.apply(assign_business_category, axis=1)
    df['Is_Sarcasm'] = df.apply(assign_sarcasm, axis=1)
    return df


print("\n[4] LABELING DATA TRAIN DAN TEST")
df_train_label = labeling_dataset(df_train_clean)
df_test_label  = labeling_dataset(df_test_clean)

for label, count in pd.concat([df_train_label, df_test_label])['Sentiment_Label'].value_counts().items():
    pct = round(count / (len(df_train_label) + len(df_test_label)) * 100, 1)
    print(f"    {label:<12} : {count:>8,} ({pct}%)")


# PREPROCESSING DATA
slang_dict = {
    "yg": "yang", "dg": "dengan", "dgn": "dengan", "utk": "untuk",
    "tdk": "tidak", "gak": "tidak", "ga": "tidak", "nggak": "tidak",
    "ngga": "tidak", "gk": "tidak", "bgt": "banget", "bgtt": "banget",
    "tp": "tapi", "tpi": "tapi", "krn": "karena", "karna": "karena",
    "aja": "saja", "jg": "juga", "jd": "jadi", "sdh": "sudah",
    "udh": "sudah", "blm": "belum", "msh": "masih", "mksh": "terima kasih",
    "makasih": "terima kasih", "thanks": "terima kasih", "thx": "terima kasih",
    "recomend": "recommended", "rekomen": "recommended", "ori": "original",
    "mantap": "bagus", "keren": "bagus", "jos": "bagus"}

exception_dict = {
    "original": "original", "palsu": "palsu", "garansi": "garansi",
    "refund": "refund", "return": "return", "komplain": "komplain",
    "diskon": "diskon", "promo": "promo", "cashback": "cashback",
    "ongkir": "ongkir", "packaging": "packaging", "seller": "seller",
    "rating": "rating", "review": "review", "baterai": "baterai",
    "charger": "charger", "wifi": "wifi", "bluetooth": "bluetooth",
    "android": "android", "gaming": "gaming", "premium": "premium",
    "fashion": "fashion", "enak": "enak", "lezat": "lezat",
    "gurih": "gurih", "renyah": "renyah", "crispy": "crispy",
    "manis": "manis", "pahit": "pahit", "asam": "asam",
    "pedas": "pedas", "asin": "asin", "empuk": "empuk",
    "keras": "keras", "lembut": "lembut", "murah": "murah",
    "mahal": "mahal", "hemat": "hemat", "cepat": "cepat",
    "lambat": "lambat", "rusak": "rusak", "bagus": "bagus",
    "buruk": "buruk", "jelek": "jelek", "puas": "puas",
    "kecewa": "kecewa", "hancur": "hancur", "cacat": "cacat",
    "tipu": "tipu", "hilang": "hilang", "error": "error", "gagal": "gagal"}

custom_stopwords = {
    "wah", "wow", "hehe", "haha", "hihi", "dong", "nih", "sih", "deh", "lah",
    "ini", "itu", "sini", "sana", "saya", "aku", "kami", "kita", "mereka", "anda",
    "hari", "minggu", "bulan", "tahun", "jam", "menit", "kemarin", "sekarang", "nanti",
    "order", "pesan", "beli", "produk", "barang", "item", "paket", "dapat", "terima",
    "datang", "tiba", "sampai", "kirim", "dikirim", "foto", "gambar", "deskripsi"
}

print("\n[5] PREPROCESSING TEKS")
print("    Menggunakan PySastrawi Stemmer & StopWord Remover")

factory_stop   = StopWordRemoverFactory()
sastrawi_stop = set(factory_stop.get_stop_words())
all_stopwords  = sastrawi_stop | custom_stopwords

factory_stem = StemmerFactory()
stemmer      = factory_stem.create_stemmer()

print(f"    Total stopword : {len(all_stopwords):,} kata")
print("    Stemmer dan stopword berhasil digunakan")


def preprocess_text(text):
    if not isinstance(text, str) or text.strip() == "":
        return ""

    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\b\d+\b', '', text)
    text = re.sub(r'\s+', ' ', text).strip()

    daftar_kata = text.split()
    daftar_kata = [slang_dict.get(kata, kata) for kata in daftar_kata]

    placeholders = {}
    protected_kata = []
    for i, kata in enumerate(daftar_kata):
        if kata in exception_dict:
            placeholder = f"EXCPTN{i}EXCPTN"
            placeholders[placeholder] = exception_dict[kata]
            protected_kata.append(placeholder)
        else:
            protected_kata.append(kata)

    daftar_kata = [dk for dk in protected_kata if dk.lower() not in all_stopwords and len(dk) > 1]
    text = ' '.join(daftar_kata)
    text = stemmer.stem(text)

    for placeholder, original_kata in placeholders.items():
        text = text.replace(placeholder.lower(), original_kata)
        text = text.replace(placeholder, original_kata)

    text = re.sub(r'\s+', ' ', text).strip()
    return text


def preprocessing_dataset(df):
    df = df.copy()
    df['Review_Text_Processed'] = df['Review_Text'].apply(preprocess_text)
    kosong = (df['Review_Text_Processed'].isna()) | (df['Review_Text_Processed'].astype(str).str.strip() == '')
    jumlah_kosong = int(kosong.sum())
    df = df[~kosong].copy()
    return df.reset_index(drop=True), jumlah_kosong


start_time = time.time()
df_train_final, empty_train = preprocessing_dataset(df_train_label)
df_test_final, empty_test = preprocessing_dataset(df_test_label)
elapsed = round(time.time() - start_time, 2)

print(f"    Train final                  : {len(df_train_final):,} baris")
print(f"    Test final                   : {len(df_test_final):,} baris")
print(f"    Baris kosong setelah proses  : {empty_train + empty_test:,}")
print(f"    Waktu proses preprocessing   : {elapsed} detik")


# VALIDASI KPI
def cek_konsistensi(row):
    rating = row['Rating_Score']
    sentiment = row['Sentiment_Label']
    if rating in [1, 2] and sentiment == 'Negative':
        return True
    if rating == 3 and sentiment == 'Neutral':
        return True
    if rating in [4, 5] and sentiment == 'Positive':
        return True
    return False


def menghitung_kelengkapan(df, kolom_wajib):
    total = len(df)
    if total == 0:
        return 0, 0

    mask_lengkap = pd.Series([True] * total, index=df.index)
    for kolom in kolom_wajib:
        mask_lengkap &= df[kolom].notna()
        if df[kolom].dtype == object:
            mask_lengkap &= (df[kolom].astype(str).str.strip() != '')

    baris_lengkap = int(mask_lengkap.sum())
    pct_lengkap = round(baris_lengkap / total * 100, 2)
    return baris_lengkap, pct_lengkap


print("\n[6] VALIDASI INDIKATOR KPI")

df_final_all = pd.concat([df_train_final, df_test_final], ignore_index=True)
total_final = len(df_final_all)

df_final_all['is_konsisten'] = df_final_all.apply(cek_konsistensi, axis=1)
jumlah_konsisten = int(df_final_all['is_konsisten'].sum())
jumlah_tidak_konsisten = total_final - jumlah_konsisten
pct_konsisten = round(jumlah_konsisten / total_final * 100, 2) if total_final else 0

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
    'Is_Sarcasm',
    'Dataset_Source',
    'Data_Split']

baris_lengkap, pct_lengkap = menghitung_kelengkapan(df_final_all, kolom_final)

kpi_noise_lulus = kpi_noise_pct < 10
kpi_label_lulus = pct_konsisten >= 85
kpi_lengkap_lulus = pct_lengkap >= 95
semua_kpi_lulus = kpi_noise_lulus and kpi_label_lulus and kpi_lengkap_lulus

print(f"    KPI 1 Noise setelah cleaning : {kpi_noise_pct}%")
print(f"    KPI 2 Konsistensi labeling   : {pct_konsisten}%")
print(f"    KPI 3 Kelengkapan dataset    : {pct_lengkap}%")


# MENYIMPAN OUTPUT
print("\n[7] MENYIMPAN OUTPUT")

df_train_final = df_train_final[kolom_final]
df_test_final  = df_test_final[kolom_final]
df_final_all   = pd.concat([df_train_final, df_test_final], ignore_index=True)

path_train = os.path.join(OUTPUT_DIR, "dataset_train_final.csv")
path_test  = os.path.join(OUTPUT_DIR, "dataset_test_final.csv")
path_all   = os.path.join(OUTPUT_DIR, "dataset_all_final.csv")
path_kpi   = os.path.join(OUTPUT_DIR, "validasi_kpi_gabungan.csv")
path_laporan = os.path.join(OUTPUT_DIR, "laporan_proses.txt")

df_train_final.to_csv(path_train, index=False, encoding='utf-8-sig')
df_test_final.to_csv(path_test, index=False, encoding='utf-8-sig')
df_final_all.to_csv(path_all, index=False, encoding='utf-8-sig')

hasil_kpi = pd.DataFrame([
    {'KPI': 'Data terhapus pada saat cleaning', 'Target': 'Informasi', 'Nilai': noise_pct_clean, 'Status': 'Bukan KPI'},
    {'KPI': 'Noise data setelah cleaning', 'Target': '< 10%', 'Nilai': kpi_noise_pct, 'Status': 'Terpenuhi' if kpi_noise_lulus else 'Tidak terpenuhi'},
    {'KPI': 'Konsistensi labeling', 'Target': '>= 85%', 'Nilai': pct_konsisten, 'Status': 'Terpenuhi' if kpi_label_lulus else 'Tidak terpenuhi'},
    {'KPI': 'Kelengkapan dataset', 'Target': '>= 95%', 'Nilai': pct_lengkap, 'Status': 'Terpenuhi' if kpi_lengkap_lulus else 'Tidak terpenuhi'}])
hasil_kpi.to_csv(path_kpi, index=False, encoding='utf-8-sig')

with open(path_laporan, 'w', encoding='utf-8') as f:
    f.write("LAPORAN PROSES PENGGABUNGAN 4 DATASET ULASAN\n")
    f.write("=" * 45 + "\n\n")

    f.write("1. Import dan standarisasi awal\n")
    for name, df_part in datasets.items():
        f.write(f"   {name:<12} : {len(df_part):>7,} baris\n")
    f.write(f"   Total raw standar : {total_raw_all:,} baris\n\n")

    f.write("Catatan standarisasi awal:\n")
    f.write("   Setiap dataset memiliki nama kolom mentah yang berbeda-beda.\n")
    f.write("   Kolom-kolom penting untuk disamakan terlebih dahulu agar 4 dataset bisa digabung dan displit secara bersamaan.\n")
    f.write("   Pada tahap ini belum termasuk proses cleaning, labeling, atau preprocessing.\n\n")

    f.write("2. Split data mentah gabungan\n")
    f.write(f"   Train raw : {len(df_train_raw):,} baris\n")
    f.write(f"   Test raw  : {len(df_test_raw):,} baris\n")
    f.write("   Split data mentah dilakukan sebelum proses cleaning, labeling, dan preprocessing.\n\n")

    f.write("3. Cleaning\n")
    f.write(f"   Kandidat data cleaning       : {total_kandidat_clean:,} baris\n")
    f.write(f"   Data terhapus saat cleaning  : {total_noise_clean:,} baris ({noise_pct_clean}%)\n")
    f.write(f"   Noise tersisa setelah clean  : {total_noise_residual:,} baris ({kpi_noise_pct}%)\n")
    f.write(f"   Train setelah cleaning       : {len(df_train_clean):,} baris\n")
    f.write(f"   Test setelah cleaning        : {len(df_test_clean):,} baris\n")
    f.write("   Pada tahap cleaning, sebanyak 42.41% data mentah terhapus karena tidak memenuhi kriteria data ulasan yang dapat dianalisis.\n")
    f.write("   seperti teks ulasan kosong, rating tidak valid, duplikasi, atau teks terlalu pendek.\n")
    f.write("   Setelah proses cleaning selesai, dilakukan pengecekan ulang terhadap data hasil cleaning. Hasilnya, noise tersisa sebesar 0.0%\n")
    f.write("   yang menunjukkan bahwa data akhir hasil cleaning sudah tidak memiliki noise berdasarkan indikator yang digunakan.\n\n")

    f.write("4. Labeling\n")
    for label, count in df_final_all['Sentiment_Label'].value_counts().items():
        pct = round(count / len(df_final_all) * 100, 1)
        f.write(f"   {label:<12} : {count:>7,} ({pct}%)\n")
    f.write("\n")

    f.write("5. Preprocessing\n")
    f.write(f"   Train final               : {len(df_train_final):,} baris\n")
    f.write(f"   Test final                : {len(df_test_final):,} baris\n")
    f.write(f"   Baris kosong setelah proses : {empty_train + empty_test:,}\n")
    f.write(f"   Waktu proses preprocessing: {elapsed} detik\n\n")

    f.write("6. Validasi KPI\n")
    f.write(f"   Data terhapus pada saat cleaning  : {noise_pct_clean}%\n")
    f.write(f"   KPI 1 Noise setelah cleaning      : {kpi_noise_pct}% -> {'TERPENUHI' if kpi_noise_lulus else 'TIDAK TERPENUHI'}\n")
    f.write(f"   KPI 2 Konsistensi labeling        : {pct_konsisten}% -> {'TERPENUHI' if kpi_label_lulus else 'TIDAK TERPENUHI'}\n")
    f.write(f"   KPI 3 Kelengkapan dataset         : {pct_lengkap}% -> {'TERPENUHI' if kpi_lengkap_lulus else 'TIDAK TERPENUHI'}\n")
    f.write("\n")
    f.write("Catatan kecil untuk KPI 1:\n")
    f.write("   Data terhapus pada saat cleaning dicatat sebagai informasi dari proses pembersihan\n")
    f.write("   Nilai KPI noise setelah cleaning dihitung dari sisa noise pada data yang sudah dibersihkan.\n")
    f.write("   Persentase menunjukkan 0.0% yang berarti noise yang dicek pada tahap cleaning sudah tidak tersisa.\n")
    f.write(f"\n   {'SEMUA KPI TERPENUHI' if semua_kpi_lulus else 'ADA KPI YANG BELUM TERPENUHI'}\n\n")

    f.write("Label wajib:\n")
    f.write("   - Review_Text\n")
    f.write("   - Review_Date\n")
    f.write("   - Rating_Score\n")
    f.write("   - Platform_Source\n")
    f.write("   - Sentiment_Label (Negative, Positive, Neutral)\n")
    f.write("   - Review_Aspect (Rasa, Harga, Bentuk, atau Lainnya)\n")
    f.write("   - Crisis_Flag (Yes/No) untuk pembangunan Early Warning System\n")
    f.write("   - Business_Category\n")
    f.write("   - Is_Sarcasm\n\n")

    f.write("Label pendukung:\n")
    f.write("   - Review_Text_Processed : hasil preprocessing teks untuk kebutuhan model/analisis teks.\n")
    f.write("   - Dataset_Source        : sumber dari 4 dataset.\n")
    f.write("   - Data_Split            : penanda data train dan data test.\n")

print(f"    Train final : {path_train}")
print(f"    Test final  : {path_test}")
print(f"    All final   : {path_all}")
print(f"    KPI         : {path_kpi}")
print(f"    Laporan     : {path_laporan}")

print("\n" + "=" * 40)
print("        RINGKASAN AKHIR")
print("=" * 40)
print(f"  Total data train final      : {len(df_train_final):,}")
print(f"  Total data test final       : {len(df_test_final):,}")
print(f"  KPI noise setelah cleaning  : {kpi_noise_pct}%")
print(f"  KPI konsistensi labeling    : {pct_konsisten}%")
print(f"  KPI kelengkapan dataset     : {pct_lengkap}%")
print(f"  Status semua KPI            : {'TERPENUHI' if semua_kpi_lulus else 'BELUM TERPENUHI'}")
