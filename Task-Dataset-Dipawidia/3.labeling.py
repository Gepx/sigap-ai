# Tujuan: Pelabelan & pemetaan kolom ke format proyek
# Input : output\Dipawidia\2.dataset_cleaning.csv
# Output: output\Dipawidia\3.dataset_labeled.csv
#         output\Dipawidia\3.laporan_labeling.txt

import pandas as pd
import os

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "Dipawidia", "2.dataset_cleaning.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Dipawidia")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  LABELING DATASET DIPAWIDIA E-COMMERCE REVIEWS")
print("=" * 40)

df = pd.read_csv(INPUT_PATH)
print(f"\n  Total data masuk : {len(df):,} baris")

# LABEL 1 : Review_Text
print("\n[1] Review_Text -> rename dari 'review_clean'")
df['Review_Text'] = df['review_clean']
print("Selesai")

# LABEL 2 : Review_Date
print("\n[2] Review_Date -> diisi dengan 'unknown' (tidak tersedia di dataset)")
df['Review_Date'] = 'unknown'
print("Selesai")

# LABEL 3 : Sentiment_Label
# 0 → Negative, 1 → Positive
print("\n[3] Sentiment_Label -> konversi 1/0 + deteksi neutral dari teks")

keyword_neutral = [
    # kata biasa/standar
    'lumayan', 'biasa saja', 'biasa aja', 'cukup', 'standar', 'oke lah', 'okelah', 'tidak buruk',
    'tidak terlalu', 'bisa lah', 'bisalah', 'tidak istimewa', 'ya begitu', 'gitu aja', 'gitu deh',
    'ya gitu', 'so so', 'yaudah', 'seadanya', 'rata rata', 'rata-rata', 'biasa biasa', 'standar lah',
    'standar aja', 'lumayan lah', 'cukup oke', 'masih oke', 'masih bisa', 'masih lumayan',

    # kata yang menunjukkan keseimbangan positif-negatif
    'tidak jelek', 'tidak bagus', 'agak kurang', 'sedikit kurang', 'kurang lebih', 'tidak terlalu bagus',
    'tidak terlalu jelek', 'ada kekurangan', 'ada plus minus', 'plus minus', 'ada minusnya', 'ada kelebihannya',
    'ada kekurangannya', 'kelebihan kekurangan', 'namun sayang', 'tapi sayang', 'sayangnya', 'cuma sayang',
    'hanya sayang', 'kurang sedikit', 'sedikit kurang',

    # kata yang menunjukkan ekspektasi tidak terpenuhi sepenuhnya
    'sesuai harga', 'sesuai ekspektasi', 'sesuai harapan', 'tidak sesuai harapan', 'kurang sesuai', 'hampir sesuai',
    'tidak seperti yang diharapkan', 'agak berbeda',
    
    # kata yang memiliki keraguan
    'mungkin', 'sepertinya', 'kayaknya', 'entah', 'belum tahu', 'belum tau', 'masih dicoba', 'baru dicoba',
    'belum bisa dinilai', 'belum bisa penilaian', 'nanti di update', 'update nanti']

def assign_sentiment(row):
    text  = str(row['review_clean']).lower()
    label = row['sentimen']
    if any(k in text for k in keyword_neutral): # mengecek apakah mengandung keyword neutral
        return 'Neutral'
    elif label == 0:
        return 'Negative'
    else:
        return 'Positive'

df['Sentiment_Label'] = df.apply(assign_sentiment, axis=1)

dist = df['Sentiment_Label'].value_counts()
for label, count in dist.items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>6} ({pct}%)")
print("Selesai")

# LABEL 4 : Rating_Score
# Generate dari Sentiment_Label
print("\n[4] Rating_Score -> generate dari Sentiment_Label")

def assign_rating(sentiment):
    if sentiment == 'Negative':
        return 2
    elif sentiment == 'Neutral':
        return 3
    else:
        return 5

df['Rating_Score'] = df['Sentiment_Label'].apply(assign_rating)

for rating, count in df['Rating_Score'].value_counts().sort_index().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    Rating {rating} : {count:>6} ({pct}%)")
print("Selesai")

# LABEL 5 : Platform_Source
print("\n[5] Platform_Source -> diisi dengan 'Multi-platform'")
df['Platform_Source'] = 'Multi-platform'
print("Selesai")

# LABEL 6 : Review_Aspect (Rasa, Harga, Bentuk, Lainnya)
print("\n[6] Review_Aspect -> deteksi keyword dari teks")

keyword_rasa = [
    'rasa', 'enak', 'lezat', 'gurih', 'manis', 'asin', 'pahit', 'asam', 'nikmat', 'sedap', 'hambar',
    'segar', 'mantap', 'yummy', 'flavor', 'taste', 'bumbu', 'aroma', 'wangi', 'harum', 'bau', 'pedas',
    'crispy', 'renyah', 'tekstur', 'empuk', 'keras', 'lembut', 'nasi', 'masak', 'masakan', 'kuliner',
    'makanan', 'minuman', 'kopi', 'snack']

keyword_harga = [
    'harga', 'murah', 'mahal', 'worth', 'worthit', 'terjangkau', 'ekonomis', 'hemat', 'diskon', 'promo',
    'cashback', 'ongkir', 'gratis', 'sesuai harga', 'overpriced', 'kemahalan', 'budget', 'biaya', 'bayar',
    'tagihan', 'nominal', 'rupiah', 'harganya', 'harga nya', 'sepadan', 'sebanding', 'tidak sebanding']

keyword_bentuk = [
    'bentuk', 'ukuran', 'kemasan', 'packaging', 'tampilan', 'desain', 'warna', 'model', 'penampilan', 'fisik',
    'material', 'bahan', 'kualitas', 'kokoh', 'kuat', 'rapuh', 'tahan lama', 'awet', 'nyaman', 'pas', 'layar',
    'body', 'casing', 'jahitan', 'kain', 'original', 'ori', 'sesuai gambar', 'sesuai deskripsi', 'resolusi',
    'tajam', 'jernih', 'bening', 'mulus', 'halus', 'kasar', 'berat', 'ringan', 'tipis', 'tebal', 'panjang', 'pendek',
    'besar', 'kecil', 'lebar', 'sempit', 'longgar', 'ketat', 'elegan', 'keren', 'cantik', 'bagus', 'jelek', 'rapi', 'rapih',
    'kotor', 'bersih', 'premium', 'mewah', 'simpel', 'minimalis', 'modern', 'klasik', 'unik', 'lucu', 'imut', 'stylish']

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

for label, count in df['Review_Aspect'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>6} ({pct}%)")
print("Selesai")

# LABEL 7 : Crisis_Flag (Yes/No)
# Yes → Sentiment Negative + keyword krisis
print("\n[7] Crisis_Flag -> Sentiment Negative + keyword krisis")

keyword_krisis = [
    'penipuan', 'tipu', 'bohong', 'palsu', 'rusak', 'cacat', 'hancur', 'kecewa', 'tidak sesuai', 'tidak sama',
    'berbeda', 'salah kirim', 'tidak sampai', 'hilang', 'komplain', 'refund', 'return', 'retur', 'tidak berfungsi',
    'tidak nyala', 'mati', 'error', 'gagal', 'mengecewakan', 'parah', 'buruk', 'jelek sekali', 'sangat kecewa',
    'tidak recommended', 'tidak rekomen', 'jangan beli', 'hindari', 'robek', 'penyok', 'lecet', 'pecah', 'retak',
    'gompal', 'tidak sesuai pesanan', 'tidak sesuai foto', 'tidak sesuai gambar', 'barang tidak datang', 'tidak diterima', 'dikomplain']

def assign_crisis(row):
    sentiment = row['Sentiment_Label']
    text      = str(row['Review_Text']).lower()
    if sentiment == 'Negative' and any(n in text for n in keyword_krisis):
        return 'Yes'
    return 'No'

df['Crisis_Flag'] = df.apply(assign_crisis, axis=1)

for label, count in df['Crisis_Flag'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>6} ({pct}%)")
print("Selesai")

# LABEL 8 : Business_Category
print("\n[8] Business_Category -> deteksi keyword dari teks")

keyword_elektronik = [
    'laptop', 'komputer', 'pc', 'layar', 'monitor', 'baterai', 'charger', 'kabel', 'headset', 'headphone', 'earphone',
    'speaker', 'keyboard', 'mouse', 'remote', 'kipas', 'ac', 'tv', 'televisi', 'kulkas', 'mesin cuci', 'blender', 'dispenser',
    'rice cooker', 'magic com', 'setrika', 'vacuum', 'printer', 'scanner', 'kamera', 'handphone', 'hp', 'smartphone', 'tablet',
    'ipad', 'iphone', 'android', 'resolusi', 'pixel', 'processor', 'ram', 'storage', 'gaming', 'joystick', 'controller', 'drone',
    'powerbank', 'adaptor', 'stop kontak', 'fitting', 'lampu', 'led', 'senter', 'baterai', 'stb', 'set top box', 'polytron', 'sharp',
    'samsung', 'lg', 'sony', 'xiaomi', 'oppo', 'realme', 'vivo', 'asus', 'acer', 'lenovo', 'dell', 'garansi resmi', 'official store',
    'hemat listrik', 'daya', 'watt', 'sinyal', 'antena', 'wifi', 'bluetooth', 'usb', 'hdmi', 'port', 'cas', 'ngecas', 'nge-cas',
    'baterai habis', 'baterai cepat habis', 'suara bass', 'vocal', 'audio', 'sound', 'mic', 'microphone', 'kamera depan', 'kamera belakang',
    'foto', 'video', 'selfie', 'memori', 'internal', 'eksternal', 'sd card', 'flash', 'aplikasi', 'instal', 'update', 'os', 'windows',
    'android', 'ios']

keyword_perabotan = [
    'kursi', 'meja', 'lemari', 'rak', 'kasur', 'bantal', 'sofa', 'furniture', 'perabot', 'rumah tangga', 'dapur', 'panci', 'wajan',
    'spatula', 'sendok', 'garpu', 'piring', 'mangkok', 'gelas', 'tempat tidur', 'selimut', 'sprei', 'karpet', 'tirai', 'gorden',
    'cermin', 'jam dinding', 'vas', 'pot', 'tanaman', 'rak buku', 'laci', 'nakas', 'dipan', 'matras', 'guling', 'ember', 'timba',
    'sapu', 'pel', 'sikat', 'lap', 'wadah', 'toples', 'botol']

keyword_fnb = [
    'makanan', 'minuman', 'rasa', 'enak', 'lezat', 'bumbu', 'masak', 'nasi', 'kuliner', 'kopi', 'snack', 'camilan', 'coklat', 'permen',
    'biskuit', 'keripik', 'mie', 'roti', 'kue', 'teh', 'susu', 'jus', 'syrup', 'saus', 'kecap', 'sambal', 'minyak', 'gula',
    'garam', 'tepung', 'beras', 'frozen food', 'olahan', 'cemilan']

keyword_fashion = [
    'baju', 'celana', 'kaos', 'dress', 'rok', 'jaket', 'hoodie', 'kemeja', 'blouse', 'cardigan', 'sweater', 'coat', 'sepatu',
    'sandal', 'sneakers', 'heels', 'boots', 'tas', 'dompet', 'ikat pinggang', 'topi', 'kacamata', 'jam tangan', 'gelang', 'kalung', 'cincin',
    'anting', 'bros', 'aksesoris', 'pakaian', 'busana', 'fashion', 'ukuran', 'size', 's m l xl', 'jahitan', 'kain', 'bahan pakaian']

keyword_kesehatan = [
    'vitamin', 'obat', 'suplemen', 'sehat', 'kesehatan', 'masker', 'hand sanitizer', 'herbal', 'jamu', 'minyak kayu putih',
    'balsem', 'plester', 'perban', 'termometer', 'tensimeter', 'oximeter', 'timbangan badan', 'timbangan', 'alat kesehatan',
    'sabun', 'antiseptik', 'alkohol', 'kapas', 'kasa']

def detect_category(text):
    if not isinstance(text, str):
        return 'Lainnya'
    text_lower = text.lower()
    skor_elektronik  = sum(1 for e in keyword_elektronik  if e in text_lower)
    skor_perabotan   = sum(1 for p in keyword_perabotan   if p in text_lower)
    skor_fnb         = sum(1 for fb in keyword_fnb         if fb in text_lower)
    skor_fashion     = sum(1 for fs in keyword_fashion     if fs in text_lower)
    skor_kesehatan   = sum(1 for k in keyword_kesehatan   if k in text_lower)

    scores = {
        'Elektronik' : skor_elektronik,
        'Perabotan'  : skor_perabotan,
        'F&B'        : skor_fnb,
        'Fashion'    : skor_fashion,
        'Kesehatan'  : skor_kesehatan}

    max_skor = max(scores.values())
    if max_skor == 0:
        return 'Lainnya'
    return max(scores, key=scores.get)

df['Business_Category'] = df['Review_Text'].apply(detect_category)

for label, count in df['Business_Category'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<25} : {count:>6} ({pct}%)")
print("Selesai")

# lABEL 9 : Is_Sarcsm
print("\n[9] Is_Sarcasm -> Rating Negative + keyword positif di teks")

# Keyword negasi
keyword_negasi = [
    'tidak', 'tak', 'bukan', 'belum', 'kurang', 'tanpa', 'gak', 'ga', 'nggak', 'ngga', 'tdk', 'tp', 'tapi',
    'namun', 'sayangnya', 'sayang', 'cuma sayang']

# Keyword positif yang kuat
keyword_sarcasm_positif = [
    'mantap', 'keren', 'jos', 'josss', 'perfect', 'sempurna', 'luar biasa', 'terbaik', 'worth it', 'worthit', 'memuaskan',
    'berkualitas', 'bintang lima', '5 bintang', 'dua jempol', 'recommended banget', 'top banget', 'bagus banget',
    'mantap banget', 'keren banget', 'puas banget']

def assign_sarcasm(row):
    sentiment = row['Sentiment_Label']
    text      = str(row['Review_Text']).lower()

    if sentiment != 'Negative':
        return 'No'

    # Mengecek apakah ada keyword positif yang kuat
    ada_positif = any(k in text for k in keyword_sarcasm_positif)
    if not ada_positif:
        return 'No'

    # Mengecek apakah keyword positif didahului negasi (bukan sarkasme)
    for keyword in keyword_sarcasm_positif:
        if keyword in text:
            # Mencari posisi keyword
            idx = text.find(keyword)
            # Mengambil 20 karakter sebelum keyword
            konteks_sebelum = text[max(0, idx-20):idx]
            # Jika ada negasi sebelum keyword → bukan sarkasme
            if any(neg in konteks_sebelum for neg in keyword_negasi):
                return 'No'
            return 'Yes'
    return 'No'

df['Is_Sarcasm'] = df.apply(assign_sarcasm, axis=1)

for label, count in df['Is_Sarcasm'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>6} ({pct}%)")
print("Selesai")

# ── SUSUN KOLOM FINA
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
    f.write("LAPORAN LABELING DATASET DIPAWIDIA E-COMMERCE REVIEWS\n")
    f.write("=" * 40 + "\n")
    f.write(f"Total data berlabel      : {len(df_final):,}\n\n")
    f.write("Distribusi Sentiment_Label:\n")
    for label, count in df['Sentiment_Label'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")
    f.write("\nDistribusi Rating_Score:\n")
    for rating, count in df['Rating_Score'].value_counts().sort_index().items():
        f.write(f"  Rating {rating}    : {count}\n")
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
print("\n" + "=" * 30)
print("  RINGKASAN LABELING")
print("=" * 30)
print(f"  Total data berlabel    : {len(df_final):,} baris")
print(f"  Kolom label            : {kolom_final}")
print("  Output disimpan di     : output\\Dipawidia\\3.dataset_labeling.csv")
print("  Laporan disimpan di    : output\\Dipawidia\\3.laporan_labeling.txt")
