# Dataset: Lazada Indonesian Reviews
# Tujuan : Pelabelan dan penyusunan 9 label wajib proyek
# Input  : output\Lazada\2.dataset_cleaning.csv
# Output : output\Lazada\3.dataset_labeling.csv
#          output\Lazada\3.laporan_labeling.txt

import os
import pandas as pd

# KONFIGURASI PATH
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.abspath(os.path.join(BASE_DIR, ".."))
INPUT_PATH = os.path.join(ROOT_DIR, "output", "Lazada", "2.dataset_cleaning.csv")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output", "Lazada")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# LOAD DATA
print("  LABELING DATASET LAZADA INDONESIAN REVIEWS")
print("=" * 50)

df = pd.read_csv(INPUT_PATH, encoding='utf-8-sig')
print(f"\n  Total data masuk : {len(df):,} baris")

# LABEL 1 : Review_Text
print("\n[1] Review_Text -> sudah tersedia dari hasil cleaning")
df['Review_Text'] = df['Review_Text'].astype(str)
print("Selesai")

# LABEL 2 : Review_Date
print("\n[2] Review_Date -> dari boughtDate/retrievedDate")
df['Review_Date'] = df['Review_Date'].fillna('unknown')
print("Selesai")

# LABEL 3 : Rating_Score
print("\n[3] Rating_Score -> dari kolom rating valid 1-5")
df['Rating_Score'] = df['Rating_Score'].astype(int)
for rating, count in df['Rating_Score'].value_counts().sort_index().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    Rating {rating} : {count:>7} ({pct}%)")
print("Selesai")

# LABEL 4 : Platform_Source
print("\n[4] Platform_Source -> diisi dengan 'Lazada'")
df['Platform_Source'] = 'Lazada'
print("Selesai")

# LABEL 5 : Sentiment_Label
print("\n[5] Sentiment_Label -> Rating 1-2 Negative, 3 Neutral, 4-5 Positive")

def assign_sentiment(rating):
    if rating in [1, 2]:
        return 'Negative'
    elif rating == 3:
        return 'Neutral'
    return 'Positive'

df['Sentiment_Label'] = df['Rating_Score'].apply(assign_sentiment)

for label, count in df['Sentiment_Label'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>7} ({pct}%)")
print("Selesai")

# LABEL 6 : Review_Aspect
print("\n[6] Review_Aspect -> deteksi keyword dari teks")

keyword_rasa = [
    'rasa', 'enak', 'lezat', 'gurih', 'manis', 'asin', 'pahit', 'asam', 'nikmat', 'sedap', 'hambar',
    'segar', 'mantap', 'yummy', 'flavor', 'taste', 'bumbu', 'aroma', 'wangi', 'harum', 'bau', 'pedas',
    'crispy', 'renyah', 'tekstur', 'empuk', 'keras', 'lembut']

keyword_harga = [
    'harga', 'murah', 'mahal', 'worth', 'terjangkau', 'ekonomis', 'hemat', 'diskon', 'promo',
    'cashback', 'ongkir', 'gratis', 'sesuai harga', 'overpriced', 'kemahalan', 'budget', 'biaya',
    'bayar', 'tagihan', 'nominal', 'rupiah']

keyword_bentuk = [
    'bentuk', 'ukuran', 'kemasan', 'packaging', 'tampilan', 'desain', 'warna', 'model', 'material',
    'bahan', 'kualitas', 'kokoh', 'kuat', 'tahan lama', 'awet', 'nyaman', 'layar', 'body', 'casing',
    'jahitan', 'original', 'ori', 'sesuai gambar']

def detect_aspect(text):
    if not isinstance(text, str):
        return 'Lainnya'
    text_lower = text.lower()
    skor_rasa   = sum(1 for k in keyword_rasa if k in text_lower)
    skor_harga  = sum(1 for k in keyword_harga if k in text_lower)
    skor_bentuk = sum(1 for k in keyword_bentuk if k in text_lower)
    max_skor = max(skor_rasa, skor_harga, skor_bentuk)
    if max_skor == 0:
        return 'Lainnya'
    elif skor_rasa == max_skor:
        return 'Rasa'
    elif skor_harga == max_skor:
        return 'Harga'
    return 'Bentuk'

df['Review_Aspect'] = df['Review_Text'].apply(detect_aspect)

for label, count in df['Review_Aspect'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>7} ({pct}%)")
print("Selesai")

# LABEL 7 : Crisis_Flag
print("\n[7] Crisis_Flag -> Rating <= 2 dan keyword krisis")

keyword_krisis = [
    'penipuan', 'tipu', 'bohong', 'palsu', 'rusak', 'cacat', 'hancur', 'kecewa', 'tidak sesuai',
    'salah kirim', 'tidak sampai', 'hilang', 'komplain', 'refund', 'return', 'tidak berfungsi',
    'error', 'gagal', 'parah', 'buruk', 'jangan beli', 'hindari']

def assign_crisis(row):
    text   = str(row['Review_Text']).lower()
    rating = row['Rating_Score']
    if rating <= 2 and any(k in text for k in keyword_krisis):
        return 'Yes'
    return 'No'

df['Crisis_Flag'] = df.apply(assign_crisis, axis=1)

for label, count in df['Crisis_Flag'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>7} ({pct}%)")
print("Selesai")

# LABEL 8 : Business_Category
print("\n[8] Business_Category -> kategori utama dataset Lazada")
df['Business_Category'] = 'Elektronik'
print("Selesai")

# LABEL 9 : Is_Sarcasm
print("\n[9] Is_Sarcasm -> Negative + keyword positif kuat tanpa negasi")

keyword_sarcasm_positif = [
    'mantap', 'keren', 'jos', 'josss', 'perfect', 'sempurna', 'luar biasa', 'terbaik', 'worth it',
    'worthit', 'memuaskan', 'berkualitas', 'bintang lima', '5 bintang', 'recommended banget',
    'bagus banget', 'mantap banget', 'puas banget']

keyword_negasi = [
    'tidak', 'tak', 'bukan', 'belum', 'kurang', 'tanpa', 'gak', 'ga', 'nggak', 'tapi',
    'namun', 'sayangnya', 'sayang']

def assign_sarcasm(row):
    if row['Sentiment_Label'] != 'Negative':
        return 'No'

    text = str(row['Review_Text']).lower()
    ada_positif = any(k in text for k in keyword_sarcasm_positif)
    ada_negasi  = any(k in text for k in keyword_negasi)

    if ada_positif and not ada_negasi:
        return 'Yes'
    return 'No'

df['Is_Sarcasm'] = df.apply(assign_sarcasm, axis=1)

for label, count in df['Is_Sarcasm'].value_counts().items():
    pct = round(count / len(df) * 100, 1)
    print(f"    {label:<12} : {count:>7} ({pct}%)")
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
    f.write("LAPORAN LABELING DATASET LAZADA INDONESIAN REVIEWS\n")
    f.write("=" * 50 + "\n")
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
    f.write("\nDistribusi Is_Sarcasm:\n")
    for label, count in df['Is_Sarcasm'].value_counts().items():
        f.write(f"  {label:<12} : {count}\n")

print("\n" + "=" * 30)
print("  RINGKASAN LABELING")
print("=" * 30)
print(f"  Total data berlabel    : {len(df_final):,} baris")
print(f"  Kolom label            : {kolom_final}")
print("  Output disimpan di     : output\\Lazada\\3.dataset_labeling.csv")
print("  Laporan disimpan di    : output\\Lazada\\3.laporan_labeling.txt")
