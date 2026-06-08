import argparse
import csv
import re
from pathlib import Path
from google_play_scraper import Sort, reviews

# keyword layanan food delivery untuk Gofood dan Grabfood
DELIVERY_KEYWORDS = [
    "gofood", "go food", "grabfood", "grab food", "makanan", "minuman",
    "resto", "restoran", "warung", "kedai", "kafe", "cafe", "kuliner",
    "pesanan makanan", "order makanan", "antar makanan", "delivery makanan",
    "driver makanan", "pesan makan", "pesen makan", "pesan minum", "pesen minum",
    "order makan", "order minum", "antar makan", "antar minum", "delivery food",
    "food delivery", "merchant makanan", "merchant resto", "menu makanan",
    "menu minuman", "ongkir makanan", "voucher makanan", "promo makanan",
    "diskon makanan", "makanannya", "minumannya", "pesanan resto", "pesanan warung",
    "pesanan kuliner", "order resto", "order restoran", "order food", "food order",
    "delivery resto", "antar pesanan", "kurir makanan", "kurir resto", "mitra resto",
    "mitra restoran", "merchant food", "menu resto", "menu restoran", "menu kuliner",
    "harga makanan", "harga minuman", "diskon resto", "promo resto", "voucher resto",
    "restonya", "restorannya", "warungnya", "kedainya", "menunya"]


# kata umum Indonesia untuk menyaring review bahasa asing pada aplikasi f&b resmi
INDONESIAN_KEYWORDS = [
    "aku", "anda", "aplikasi", "bagus", "banyak", "beli", "belum", "bisa",
    "buat", "coba", "dari", "dengan", "dong", "gak", "ga", "harus", "harga",
    "ini", "jadi", "jangan", "kak", "karena", "kasih", "kenapa", "kok", "lagi",
    "lama", "lebih", "lumayan", "makanan", "masih", "minuman", "mohon", "nggak",
    "order", "pakai", "pelayanan", "pembayaran", "pesan", "pesanan", "promo",
    "resto", "saja", "sangat", "saya", "sudah", "tapi", "tidak", "tolong",
    "untuk", "yang"]


# Keyword f&b untuk astro dan segari karena kategorinya beragam
GROCERY_FNB_KEYWORDS = [
    "ayam", "bahan makanan", "bakso", "beras", "buah", "buah-buahan", "daging",
    "frozen food", "ikan", "makan", "makanan", "minum", "minuman", "roti",
    "sayur", "sayuran", "sembako", "susu", "telur", "air mineral", "bawang",
    "bumbu", "cabai", "cabe", "cemilan", "camilan", "cookies", "dapur", "galon",
    "grocery", "jajanan", "kopi", "kue", "masak", "mie", "minyak", "snack",
    "soda", "teh", "tepung", "buahnya", "dagingnya", "ikannya", "makanannya",
    "minumannya", "rotinya", "sayurnya", "susunya", "telurnya", "bahan masakan",
    "bahan dapur", "bumbu dapur", "buah segar", "sayur segar", "sayur mayur",
    "daging ayam", "daging sapi", "ikan segar", "makanan beku", "minuman botol",
    "produk makanan", "produk minuman", "belanja sayur", "belanja buah",
    "belanja sembako", "belanja bahan makanan", "kualitas sayur", "kualitas buah",
    "kualitas daging", "stok makanan", "stok minuman", "stok sayur", "stok buah",
    "bawangnya", "cabainya", "sembakonya", "buah-buahan", "alpukat", "apel",
    "ayam potong", "bayam", "brokoli", "coklat", "cokelat", "es krim", "gula",
    "jeruk", "kangkung", "kecap", "kentang", "kerupuk", "kol", "martabak",
    "mie instan", "nasi", "nugget", "pisang", "sambal", "saos", "saus",
    "sawi", "sosis", "tahu", "tempe", "tomat", "toping", "topping",
    "vitamin", "yogurt", "yoghurt", "belanja dapur", "produk segar",
    "kebutuhan dapur", "kebutuhan masak", "biskuit", "buah potong",
    "cabai rawit", "cabe rawit", "cereal", "daging beku", "daging segar",
    "detergen", "gula pasir", "jahe", "jus", "keju", "keripik", "kornet",
    "kuaci", "lada", "madu", "margarin", "mentega", "milo", "oat", "oregano",
    "pasta", "pepaya", "permen", "sarden", "selai", "selada", "sirup",
    "susu cair", "susu uht", "tisu dapur", "udang", "wafer", "zaitun",
    "bumbu masak", "camilan anak", "kebutuhan makanan", "makanan ringan",
    "minuman ringan", "produk dapur", "produk segar", "stok dapur"]


# keyword merchant f&b untuk aplikasi pengelolaan resto dan pesanan GoFood
MERCHANT_FNB_KEYWORDS = [
    "gofood", "go food", "grabfood", "grab food", "grabmart", "shopeefood",
    "shopee food", "resto", "restoran", "warung", "kedai", "kafe",
    "cafe", "merchant", "mitra", "mitra gofood", "mitra grabfood",
    "mitra shopeefood", "mitra resto",
    "mitra restoran", "usaha makanan", "bisnis makanan", "jualan makanan",
    "jualan minuman", "makanan", "minuman", "menu", "menu makanan",
    "menu minuman", "harga menu", "stok menu", "varian menu", "order",
    "pesan", "pesanan", "pesanan masuk", "pesanan makanan", "pesanan resto",
    "orderan", "orderan masuk", "driver", "driver gofood", "pengemudi",
    "kurir", "antar makanan", "delivery makanan", "promo", "promo gofood",
    "voucher", "diskon", "komisi", "saldo", "pencairan", "transaksi",
    "laporan penjualan", "pendapatan", "pembayaran", "gopay", "qris",
    "jam buka", "jam operasional", "tutup toko", "buka toko", "outlet",
    "dapur", "masak", "masakan", "pelanggan", "customer", "rating resto",
    "ulasan pelanggan"]


# keyword marketplace f&b untuk menyaring ShopeeFood
MARKETPLACE_FNB_KEYWORDS = [
    "shopeefood", "shopee food", "okejek", "oke food", "qpon", "coupon",
    "kupon", "voucher", "voucher makanan", "voucher minuman", "voucher resto",
    "voucher restoran", "voucher kopi", "promo makanan", "promo minuman",
    "promo resto", "promo restoran", "diskon makanan", "diskon minuman",
    "diskon resto", "diskon restoran", "makanan", "minuman", "resto",
    "restoran", "warung", "kedai", "kafe", "cafe", "kuliner", "menu",
    "menu makanan", "menu minuman", "pesanan makanan", "pesan makanan",
    "pesen makanan", "order makanan", "antar makanan", "delivery makanan",
    "driver makanan", "merchant makanan", "merchant resto", "merchant restoran",
    "makanannya", "minumannya", "restonya", "restorannya", "kedainya",
    "kopi", "ayam", "burger", "pizza", "mie", "nasi", "snack", "cemilan"]

APP_CONFIGS = [
    # dataset umum gofood dan grabfood: dengan semua rating dan keyword layanan f&b
    {
        "group": "delivery-netral",
        "app_name": "Gojek / Gofood",
        "app_id": "com.gojek.app",
        "output": "gofood_googleplay_reviews.csv",
        "rating_filter": None,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": False,
        "default_max_raw": 20000},

    {
        "group": "delivery-netral",
        "app_name": "Grab / Grabfood",
        "app_id": "com.grabtaxi.passenger",
        "output": "grabfood_googleplay_reviews.csv",
        "rating_filter": None,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": False,
        "default_max_raw": 20000},

    # dataset netral gofood dan grabfood: dengan rating 3 dan keyword layanan f&b
    {
        "group": "delivery netral",
        "app_name": "Gojek / Gofood netral",
        "app_id": "com.gojek.app",
        "output": "gofood_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": False,
        "default_max_raw": 100000},

    {
        "group": "delivery netral",
        "app_name": "Grab / Grabfood netral",
        "app_id": "com.grabtaxi.passenger",
        "output": "grabfood_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": False,
        "default_max_raw": 100000},

    # dataset netral dari aplikasi resmi f&b Indonesia: rating 3 bahasa Indonesia
    {
        "group": "fnb netral",
        "app_name": "Domino's Pizza Indonesia",
        "app_id": "com.phonegap.dominos",
        "output": "dominos_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb netral",
        "app_name": "Pizza Hut Indonesia",
        "app_id": "com.pizzahut.phd",
        "output": "pizzahut_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb netral",
        "app_name": "Kopi Kenangan Indonesia",
        "app_id": "com.kopikenangan",
        "output": "kopikenangan_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb netral",
        "app_name": "Starbucks Indonesia",
        "app_id": "com.starbucks.id",
        "output": "starbucks_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    
    {
        "group": "fnb netral",
        "app_name": "KFCKU",
        "app_id": "com.kfc.mobile",
        "output": "kfcku_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    # dataset netral tambahan dari aplikasi resmi f&b: dengan rating 3 bahasa Indonesia
    {
        "group": "fnb-netral-baru",
        "app_name": "Fore Coffee",
        "app_id": "coffee.fore2.fore",
        "output": "forecoffee_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "TOMORO Coffee",
        "app_id": "com.tomoro.indonesia.android",
        "output": "tomoro_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "HOKBENAJA",
        "app_id": "id.co.hokben.revamp",
        "output": "hokben_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "Richeese Factory Indonesia",
        "app_id": "com.richeese.id",
        "output": "richeese_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "F&B ID / Chatime Indonesia",
        "app_id": "com.klg.chatime",
        "output": "chatime_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "Burger King Indonesia",
        "app_id": "burgerking.id.android",
        "output": "burgerking_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "fnb-netral-baru",
        "app_name": "McDonald's Indonesia",
        "app_id": "com.mcdonalds.mobileapp",
        "output": "mcdonalds_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": [],
        "require_indonesian": True,
        "default_max_raw": 100000},

    # dataset netral v2 dari aplikasi food delivery: tidak menduplikat dataset lama
    {
        "group": "fnb-netral-ekstra",
        "app_name": "Gojek / GoFood Netral v2",
        "app_id": "com.gojek.app",
        "output": "gofood_netral_v2_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 150000},

    {
        "group": "fnb-netral-ekstra",
        "app_name": "Grab / GrabFood Netral v2",
        "app_id": "com.grabtaxi.passenger",
        "output": "grabfood_netral_v2_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": DELIVERY_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 150000},

    {
        "group": "fnb-netral-ekstra",
        "app_name": "Shopee Indonesia / ShopeeFood Netral v2",
        "app_id": "com.shopee.id",
        "output": "shopeefood_netral_v2_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": MARKETPLACE_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 150000},

    # dataset netral tambahan dari aplikasi grocery Indonesia: yang rating 3 dengan keyword f&b
    {
        "group": "grocery-netral-baru",
        "app_name": "Alfagift",
        "app_id": "com.alfamart.alfagift",
        "output": "alfagift_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "Klik Indomaret",
        "app_id": "com.indomaret.klikindomaret",
        "output": "klikindomaret_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "Sayurbox",
        "app_id": "com.sayurbox",
        "output": "sayurbox_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "AlloFresh",
        "app_id": "id.allofresh.ecommerce",
        "output": "allofresh_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "ASTRO versi baru",
        "app_id": "com.astro.shop",
        "output": "astro_full_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "HappyFresh",
        "app_id": "com.happyfresh.android",
        "output": "happyfresh_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "My Super Indo",
        "app_id": "id.co.superindo.mysuperindo",
        "output": "superindo_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "Hypermart Online",
        "app_id": "com.hypermart.mobile",
        "output": "hypermart_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "LOTTE Mart Mall",
        "app_id": "com.lmi.indo",
        "output": "lottemart_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "GoBiz / GoFood Merchant",
        "app_id": "com.gojek.resto",
        "output": "gobiz_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    # dataset netral tambahan dari aplikasi merchant f&b: yang memiliki rating 3
    {
        "group": "merchant-netral",
        "app_name": "GrabMerchant",
        "app_id": "com.grab.merchant",
        "output": "grabmerchant_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "merchant-netral",
        "app_name": "Shopee Partner",
        "app_id": "com.shopeepay.merchant.id",
        "output": "shopeepartner_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    # dataset negatif tambahan dari aplikasi merchant f&b: yang memiliki rating 1 dan 2
    {
        "group": "merchant-negatif",
        "app_name": "GoBiz / GoFood Merchant negatif",
        "app_id": "com.gojek.resto",
        "output": "gobiz_negatif_googleplay_reviews.csv",
        "rating_filter": [1, 2],
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "merchant-negatif",
        "app_name": "GrabMerchant negatif",
        "app_id": "com.grab.merchant",
        "output": "grabmerchant_negatif_googleplay_reviews.csv",
        "rating_filter": [1, 2],
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "merchant-negatif",
        "app_name": "Shopee Partner negatif",
        "app_id": "com.shopeepay.merchant.id",
        "output": "shopeepartner_negatif_googleplay_reviews.csv",
        "rating_filter": [1, 2],
        "include_keywords": MERCHANT_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000},

    {
        "group": "grocery-netral-baru",
        "app_name": "ASTRO",
        "app_id": "com.astro.shop",
        "output": "astro_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000,},

    {
        "group": "grocery-netral-baru",
        "app_name": "Segari",
        "app_id": "id.segari.customer",
        "output": "segari_netral_googleplay_reviews.csv",
        "rating_filter": 3,
        "include_keywords": GROCERY_FNB_KEYWORDS,
        "require_indonesian": True,
        "default_max_raw": 100000}]

OUTPUT_COLUMNS = [
    "app_name",
    "app_id",
    "review_id",
    "user_name",
    "review_text",
    "rating",
    "review_date",
    "thumbs_up_count",
    "matched_keywords"]


def normalize_text(text):
    if text is None:
        return ""
    text = str(text).lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_review_text(text):
    if text is None:
        return ""
    text = str(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_matched_keywords(text, keywords):
    normalized = normalize_text(text)
    return [
        keyword
        for keyword in keywords
        if re.search(rf"\b{re.escape(keyword)}\b", normalized)]


def is_likely_indonesian(text):
    normalized = normalize_text(text)
    if len(normalized.split()) < 3:
        return False
    return bool(get_matched_keywords(normalized, INDONESIAN_KEYWORDS))


def format_datetime(value):
    if value is None:
        return ""
    return str(value)


def deduplicate_rows(rows):
    seen_review_ids = set()
    seen_texts = set()
    unique_rows = []

    for row in rows:
        review_id = row.get("review_id", "")
        review_text = normalize_text(row.get("review_text", ""))

        if review_id and review_id in seen_review_ids:
            continue
        if review_text in seen_texts:
            continue

        if review_id:
            seen_review_ids.add(review_id)
        seen_texts.add(review_text)
        unique_rows.append(row)

    return unique_rows

 # mengambil review googleplay sesuai dengan aturan filter setiap konfig
def crawl_reviews(app_config, lang, country, batch_size, max_raw, target_filtered):
    collected = []
    continuation_token = None
    raw_seen = 0
    rating_match_seen = 0

    while raw_seen < max_raw and len(collected) < target_filtered:
        current_count = min(batch_size, max_raw - raw_seen)
        result, continuation_token = reviews(
            app_config["app_id"],
            lang=lang,
            country=country,
            sort=Sort.NEWEST,
            count=current_count,
            continuation_token=continuation_token)

        if not result:
            break

        raw_seen += len(result)

        for item in result:
            rating = item.get("score", "")
            rating_filter = app_config["rating_filter"]
            if rating_filter is not None:
                if isinstance(rating_filter, list):
                    allowed_ratings = [str(value).strip() for value in rating_filter]
                    if str(rating).strip() not in allowed_ratings:
                        continue
                elif str(rating).strip() != str(rating_filter):
                    continue

            rating_match_seen += 1
            review_text = clean_review_text(item.get("content", ""))

            if app_config["require_indonesian"] and not is_likely_indonesian(review_text):
                continue

            matched_keywords = get_matched_keywords(
                review_text,
                app_config["include_keywords"])
            if app_config["include_keywords"] and not matched_keywords:
                continue

            collected.append({
                "app_name": app_config["app_name"],
                "app_id": app_config["app_id"],
                "review_id": item.get("reviewId", ""),
                "user_name": item.get("userName", ""),
                "review_text": review_text,
                "rating": rating,
                "review_date": format_datetime(item.get("at")),
                "thumbs_up_count": item.get("thumbsUpCount", ""),
                "matched_keywords": ", ".join(matched_keywords)})

            collected = deduplicate_rows(collected)
            if len(collected) >= target_filtered:
                break

        if continuation_token is None:
            break

    return deduplicate_rows(collected), raw_seen, rating_match_seen


def write_csv(rows, output_path):
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)


def parse_args():
    parser = argparse.ArgumentParser(
        description="crawler google play reviews untuk semua dataset F&B")

    parser.add_argument(
        "--group",
        choices=["all", "delivery-netral", "fnb-netral", "grocery-netral", "fnb-netral-baru", "fnb-netral-ekstra", "grocery-netral-baru", "merchant-netral", "merchant-negatif"],
        default="all",
        help="Kelompok dataset yang dicrawl. Default: all")

    parser.add_argument(
        "--dataset-dir",
        default=str(Path(__file__).resolve().parents[1] / "dataset"),
        help="Folder output CSV. Default: ../dataset")

    parser.add_argument(
        "--lang",
        default="id",
        help="Bahasa review Google Play. Default: id")

    parser.add_argument(
        "--country",
        default="id",
        help="Negara Google Play. Default: id")
        
    parser.add_argument(
        "--batch-size",
        type=int,
        default=200,
        help="Jumlah review mentah per request. Default: 200")
        
    parser.add_argument(
        "--max-raw",
        type=int,
        default=None,
        help="Override maksimal review mentah per app. Default mengikuti konfig app")

    parser.add_argument(
        "--target-filtered",
        type=int,
        default=5000,
        help="Target maksimal review tersaring per app. Default: 5000")
    return parser.parse_args()

# menjalankan crawler sesuai kelompok dataset yang dipilih
def main():
    args = parse_args()
    dataset_dir = Path(args.dataset_dir)
    selected_configs = [
        app_config
        for app_config in APP_CONFIGS
        if args.group == "all" or app_config["group"] == args.group]

    for app_config in selected_configs:
        max_raw = args.max_raw or app_config["default_max_raw"]
        print(f"Proses scraping crawl: {app_config['app_name']}")

        rows, raw_seen, rating_match_seen = crawl_reviews(
            app_config=app_config,
            lang=args.lang,
            country=args.country,
            batch_size=args.batch_size,
            max_raw=max_raw,
            target_filtered=args.target_filtered)

        output_path = dataset_dir / app_config["output"]
        write_csv(rows, output_path)

        print(f"  Review mentah dicek       : {raw_seen:,}")
        print(f"  Review sesuai rating      : {rating_match_seen:,}")
        print(f"  Review tersaring disimpan : {len(rows):,}")
        print(f"  Output                    : {output_path}")


if __name__ == "__main__":
    main()
