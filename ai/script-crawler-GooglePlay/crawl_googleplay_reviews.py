# Crawler Google Play Reviews untuk dataset F&B
import argparse
import csv
import re
from pathlib import Path
from google_play_scraper import Sort, reviews

# konfig apl google play yang relevan dengan layanan pesan antar makanan
APP_CONFIGS = [
    {
        "app_name": "Gojek / GoFood",
        "app_id": "com.gojek.app",
        "output": "gofood_googleplay_reviews.csv",
        "include_keywords": [
            "gofood", "go food", "makanan", "minuman", "resto", "restoran", "warung", "kedai", "kafe", "cafe",
            "kuliner", "pesanan makanan", "order makanan", "antar makanan", "delivery makanan", "driver makanan"],},
    {
        "app_name": "Grab / GrabFood",
        "app_id": "com.grabtaxi.passenger",
        "output": "grabfood_googleplay_reviews.csv",
        "include_keywords": [
            "grabfood", "grab food", "makanan", "minuman", "resto", "restoran",
            "warung", "kedai", "kafe", "cafe", "kuliner", "pesanan makanan",
            "order makanan", "antar makanan", "delivery makanan", "driver makanan"],},]


# kolom output dibuat supaya mudah untuk load ke dalam sigap-ai.ipynb.
OUTPUT_COLUMNS = [
    "app_name",
    "app_id",
    "review_id",
    "user_name",
    "review_text",
    "rating",
    "review_date",
    "review_created_version",
    "thumbs_up_count",
    "reply_content",
    "replied_at",
    "matched_keywords"]

# normalisasi teks filter keyword F&B
def normalize_text(text):
    if text is None:
        return ""
    text = str(text).lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# mengambil keyword F&B yang muncul di review
def get_matched_keywords(text, keywords):
    normalized = normalize_text(text)
    return [keyword for keyword in keywords if keyword in normalized]

# filter review yang relavan dengan keyword F&B
def is_food_related(text, keywords):
    return len(get_matched_keywords(text, keywords)) > 0

# membersihkan review text sebelum ditulis ke csv
def clean_review_text(text):
    if text is None:
        return ""
    text = str(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# mengubah datetime dari scraper menjadi string agar aman disimpan ke csv
def format_datetime(value):
    if value is None:
        return ""
    return str(value)

# mengambil review dari google play lalu memfilter review yang berkaitan dengan F&B
def crawl_app_reviews(app_config, lang, country, batch_size, max_raw, target_filtered):
    collected = []
    continuation_token = None
    raw_seen = 0

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
            review_text = clean_review_text(item.get("content", ""))
            matched_keywords = get_matched_keywords(review_text, app_config["include_keywords"])

            if not matched_keywords:
                continue

            collected.append({
                "app_name": app_config["app_name"],
                "app_id": app_config["app_id"],
                "review_id": item.get("reviewId", ""),
                "user_name": item.get("userName", ""),
                "review_text": review_text,
                "rating": item.get("score", ""),
                "review_date": format_datetime(item.get("at")),
                "review_created_version": item.get("reviewCreatedVersion", ""),
                "thumbs_up_count": item.get("thumbsUpCount", ""),
                "reply_content": clean_review_text(item.get("replyContent", "")),
                "replied_at": format_datetime(item.get("repliedAt")),
                "matched_keywords": ", ".join(matched_keywords)})

            if len(collected) >= target_filtered:
                break
        if continuation_token is None:
            break
    return collected, raw_seen


def write_csv(rows, output_path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)

# memparsing argumen command line
def parse_args():
    parser = argparse.ArgumentParser(
        description="Crawler Google Play Reviews untuk GoFood dan GrabFood.")
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
        default=20000,
        help="Maksimal review mentah yang dicek per apl. Default: 20000")
    parser.add_argument(
        "--target-filtered",
        type=int,
        default=5000,
        help="Target review F&B tersaring per apl. Default: 5000")
    return parser.parse_args()

# menjalankan crawler untuk semua apl yang dikonfig
def main():
    args = parse_args()
    dataset_dir = Path(args.dataset_dir)

    for app_config in APP_CONFIGS:
        print(f"Mulai crawl: {app_config['app_name']}")

        rows, raw_seen = crawl_app_reviews(
            app_config=app_config,
            lang=args.lang,
            country=args.country,
            batch_size=args.batch_size,
            max_raw=args.max_raw,
            target_filtered=args.target_filtered)

        output_path = dataset_dir / app_config["output"]
        write_csv(rows, output_path)

        print(f"  Review mentah dicek : {raw_seen:,}")
        print(f"  Review F&B disimpan : {len(rows):,}")
        print(f"  Output              : {output_path}")


if __name__ == "__main__":
    main()
