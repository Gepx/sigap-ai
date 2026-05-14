# Tujuan: Pelabelan & pemetaan kolom ke format proyek
# Input/Dataset: output/PRDECT-ID/dataset_cleaning.csv
# Output: output/PRDECT-ID/dataset_labeling.csv

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "PRDECT-ID", "2.dataset_cleaning.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "PRDECT-ID")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("LABELING DATASET PRDECT-ID")
print("=" * 30)

df = pd.read_csv(INPUT_PATH)
print(f"\n  Total data masuk : {len(df):,} baris")

# LABEL 1 : Review_Text
print("\n[1] Review_Text -> rename dari 'Customer Review Clean'")
df['Review_Text'] = df['Customer Review Clean']
print("selesai")

# LABEL 2 : Review_Date
print("\n[2] Review_Date -> diisi 'unknown' (tidak tersedia di dataset)")
df['Review_Date'] = 'unknown'
print("selesai")

# LABEL 3 : Rating_Score
print("\n[3] Rating_Score -> rename dari 'Customer Rating'")
df['Rating_Score'] = df['Customer Rating']
print("Selesai")

# LABEL 4 : Platform_Source
print("\n[4] Platform_Source -> diisi dengan 'Tokopedia' semua")
df['Platform_Source'] = 'Tokopedia'
print("Selesai")

# LABEL 5: Sentiment_Label
# Rating 1-2  -> Negative
# Rating 3    -> Neutral
# Rating 4-5  -> Positive
print("\n[5] Sentiment_Label -> kombinasi Rating_Score + Sentiment asli")

def assign_sentiment(row):
    rating = row['Customer Rating']
    if rating == 3:
        return 'Neutral'
    elif rating in [1, 2]:
        return 'Negative'
    elif rating in [4, 5]:
        return 'Positive'
    else:
        return row['Sentiment']

df['Sentiment_Label'] = df.apply(assign_sentiment, axis=1)

dist = df['Sentiment_Label'].value_counts()
for label, count in dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")
print("          Selesai")

# LABEL 6: Review_Aspect
print("\n[6] Review_Aspect -> deteksi keyword dari teks")
keyword_rasa = [
    'rasa', 'enak', 'lezat', 'gurih', 'manis', 'asin', 'pahit', 'asam', 'nikmat', 'sedap',
    'hambar', 'segar', 'mantap', 'yummy', 'delicious', 'flavor', 'taste', 'bumbu', 'aroma',
    'wangi', 'harum', 'bau', 'pedas', 'crispy', 'renyah', 'tekstur', 'empuk', 'keras', 'lembut']

keyword_harga = [
    'harga', 'murah', 'mahal', 'worth', 'worthit', 'worth it', 'terjangkau', 'ekonomis', 'hemat', 'diskon',
    'promo', 'cashback', 'ongkir', 'gratis', 'sesuai harga', 'tidak sesuai harga', 'overpriced', 'kemahalan',
    'budget', 'biaya', 'bayar', 'tagihan', 'nominal', 'rupiah']

keyword_bentuk = [
    'bentuk', 'ukuran', 'kemasan', 'packaging', 'tampilan', 'desain', 'warna', 'model', 'penampilan', 'fisik',
    'dimensi', 'besar', 'kecil', 'panjang', 'pendek', 'tipis', 'tebal', 'berat', 'ringan', 'material', 'bahan',
    'kualitas', 'premium', 'mewah', 'simpel', 'elegan', 'cantik', 'jelek', 'bagus', 'rapi', 'rapih', 'kotor', 'bersih'
    'original', 'ori', 'asli', 'palsu', 'kw', 'sesuai', 'tidak sesuai', 'sesuai gambar', 'sesuai deskripsi', 'berbeda',
    'sama', 'persis', 'kokoh', 'kuat', 'rapuh', 'mudah rusak', 'tahan lama', 'awet', 'nyaman', 'tidak nyaman', 'pas',
    'longgar', 'sempit', 'kebesaran', 'kekecilan', 'muat', 'tidak muat', 'ergonomis', 'praktis', 'tajam', 'tumpul',
    'halus', 'kasar', 'licin', 'grip', 'layar', 'body', 'casing', 'cover', 'pelindung', 'case', 'jahitan', 'kain',
    'fabric', 'kulit', 'plastik', 'metal', 'besi', 'kayu', 'kaca', 'glass', 'mika', 'rubber', 'karet']

def detect_aspect(text):
    if not isinstance(text, str):
        return 'Lainnya'
    text_lower = text.lower()

    skor_rasa   = sum(1 for r in keyword_rasa   if r in text_lower)
    skor_harga  = sum(1 for h in keyword_harga  if h in text_lower)
    skor_bentuk = sum(1 for b in keyword_bentuk if b in text_lower)

    max_skor = max(skor_rasa, skor_harga, skor_bentuk)

    if max_skor == 0:
        return 'Lainnya'
    elif skor_rasa == max_skor:
        return 'Rasa'
    elif skor_harga == max_skor:
        return 'Harga'
    else:
        return 'Bentuk'

df['Review_Aspect'] = df['Review_Text'].apply(detect_aspect)

aspect_dist = df['Review_Aspect'].value_counts()
for label, count in aspect_dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"{label:<12} : {count:>5} ({pct}%)")
print("         Selesai")

# LABEL 7 : Crisis_Flag (negasi boolean)
# Yes -> Rating 1-2 + keyword krisis
# No  -> Rating 3-5
print("\n[7] Crisis_Flag -> rating rendah + keyword krisis")

keyword_krisis = [
    'penipuan', 'tipu', 'bohong', 'palsu', 'rusak', 'cacat', 'hancur', 'kecewa', 'tidak sesuai', 'tidak sama',
    'berbeda', 'salah kirim', 'tidak sampai', 'hilang', 'komplain', 'refund', 'return', 'retur', 'tidak berfungsi',
    'tidak nyala', 'mati', 'error', 'gagal', 'mengecewakan', 'parah', 'buruk', 'jelek sekali', 'sangat kecewa',
    'tidak recommended', 'tidak rekomen', 'jangan beli', 'hindari']

def assign_crisis(row):
    rating = row['Customer Rating']
    text   = str(row['Review_Text']).lower()
    if rating <= 2 and any(k in text for k in keyword_krisis):
        return 'Yes'
    return 'No'

df['Crisis_Flag'] = df.apply(assign_crisis, axis=1)

crisis_dist = df['Crisis_Flag'].value_counts()
for label, count in crisis_dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")
print("          Selesai")

# LABEL 8 : Business_Category
print("\n[8] Business_Category -> mapping dari kolom Category")

# MAPPING KATEGORI
FB                               = ['Food and Drink', 'Kitchen']
ELEKTRONIK                       = ['Computers and Laptops', 'Phones and Tablets', 'Electronics', 'Camera', 'Gaming']
FASHION                          = ["Women's Fashion", "Men's Fashion", 'Muslim Fashion', 'Kids and Baby Fashion']
KESEHATAN_KECANTIKAN             = ['Health', 'Beauty', 'Body Care']
PERABOTAN                        = ['Household', 'Carpentry']
IBU_BAYI                         = ['Mother and Baby']
PERAWATAN_HEWAN                  = ['Animal Care']
HOBI_HIBURAN                     = ['Toys and Hobbies', 'Movies and Music', 'Books', 'Tour and Travel', 'Sport']
OTOMOTIF                         = ['Automotive']
PERLENGKAPAN_KANTOR              = ['Office & Stationery']
KERAJINAN_PESTA                  = ['Party Supplies and Craft']
LAINNYA                          = ['Precious Metal', 'Property', 'Other Products']

category_mapping = {}
for makanan in FB:
    category_mapping[makanan] = 'F&B'

for perangkat in ELEKTRONIK:
    category_mapping[perangkat] = 'Elektronik'

for pakaian in FASHION:
    category_mapping[pakaian] = 'Fashion'

for badan in KESEHATAN_KECANTIKAN:
    category_mapping[badan] = 'Kesehatan & Kecantikan'

for furnitur in PERABOTAN:
    category_mapping[furnitur] = 'Perabotan'

for keluarga in IBU_BAYI:
    category_mapping[keluarga] = 'Ibu & Bayi'

for hewan in PERAWATAN_HEWAN:
    category_mapping[hewan] = 'Perawatan Hewan'

for kegiatan in HOBI_HIBURAN:
    category_mapping[kegiatan] = 'Hobi & Hiburan'

for bengkel in OTOMOTIF:
    category_mapping[bengkel] = 'Otomotif'

for kerja in PERLENGKAPAN_KANTOR:
    category_mapping[kerja] = 'Perlengkapan Kantor'

for acara in KERAJINAN_PESTA:
    category_mapping[acara] = 'Kerajinan & Pesta'

for etc in LAINNYA:
    category_mapping[etc] = 'Lainnya'

df['Business_Category'] = df['Category'].map(category_mapping).fillna('Lainnya')

biz_dist = df['Business_Category'].value_counts().reset_index().drop_duplicates(subset='Business_Category')
for _, row in biz_dist.iterrows():
    pct = round(row['count'] / len(df) * 100, 1)
    print(f"{row['Business_Category']:<25} : {row['count']:>5} ({pct}%)")
print("Selesai")

# LABEL 9 : Is_Sarcasm
print("\n[9] Is_Sarcasm -> Sentiment Negative + keyword positif kuat")

keyword_negasi = [
    'tidak', 'tak', 'bukan', 'belum', 'kurang', 'tanpa', 'gak', 'ga', 'nggak', 'ngga', 'tdk', 'tp', 'tapi',
    'namun', 'sayangnya', 'sayang', 'cuma sayang']

keyword_sarcasm_positif = [
    'mantap', 'keren', 'jos', 'josss', 'perfect', 'sempurna', 'luar biasa', 'terbaik', 'worth it', 'worthit', 'memuaskan',
    'berkualitas', 'bintang lima', '5 bintang', 'dua jempol', 'recommended', 'bagus', 'bagus sekali', 'sangat bagus',
    'mantap', 'puas', 'suka', 'senang', 'top', 'oke banget', 'kece', 'kece banget', 'istimewa', 'luar biasa', 'hebat',
    'canggih', 'yahud', 'nice', 'nice banget', 'good', 'good banget', 'amazing', 'awesome', 'super', 'joss']

def assign_sarcasm(row):
    sentiment = row['Sentiment_Label']
    text      = str(row['Review_Text']).lower()

    if sentiment != 'Negative':
        return 'No'

    ada_positif = any(s in text for s in keyword_sarcasm_positif)
    if not ada_positif:
        return 'No'

    for keyword in keyword_sarcasm_positif:
        if keyword in text:
            idx             = text.find(keyword)
            konteks_sebelum = text[max(0, idx-20):idx]
            if any(neg in konteks_sebelum for neg in keyword_negasi):
                return 'No'
            return 'Yes'
    return 'No'

df['Is_Sarcasm'] = df.apply(assign_sarcasm, axis=1)

for label, count in df['Is_Sarcasm'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>5} ({pct}%)")
print("Selesai")

# SUSUN KOLOM FINAL
kolom_final = [
    'Review_Text',
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
output_path  = os.path.join(OUTPUT_DIR, "3.dataset_labeling.csv")
laporan_path = os.path.join(OUTPUT_DIR, "3.laporan_labeling.txt")

df_final.to_csv(output_path, index=False, encoding='utf-8-sig')

with open(laporan_path, 'w', encoding='utf-8') as f:
    f.write("LAPORAN LABELING DATASET PRDECT-ID\n")
    f.write("=" * 40 + "\n")
    f.write(f"Total data berlabel      : {len(df_final):,}\n\n")
    f.write("Distribusi Sentiment_Label:\n")
    for label, count in df['Sentiment_Label'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")
    f.write("\nDistribusi Review_Aspect:\n")
    for label, count in df['Review_Aspect'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")
    f.write("\nDistribusi Crisis_Flag:\n")
    for label, count in df['Crisis_Flag'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")
    f.write("\nDistribusi Business_Category:\n")
    for label, count in df['Business_Category'].value_counts().items():
        f.write(f"  {label:<25} : {count}\n")
    f.write("\nDistribusi Is_Sarcasm:\n")
    for label, count in df['Is_Sarcasm'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")

# RINGKASAN
print("=" * 30)
print("  RINGKASAN LABELING")
print("=" * 30)
print(f"  Total data berlabel    : {len(df_final):,} baris")
print(f"  Kolom label            : {kolom_final}")
print("  Output disimpan di     : output/PRDECT-ID/3.dataset_labeling.csv")
print("  Laporan disimpan di    : output/PRDECT-ID/3.laporan_labeling.txt")