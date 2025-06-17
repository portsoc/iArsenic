import csv
import json
from pathlib import Path

# Define input CSV files
CSV_FILES = {
    "Divisions": "divisions.csv",
    "Districts": "districts.csv",
    "Upazilas": "upazilas.csv",
    "Unions": "unions.csv",
    "Mouzas": "mouzas.csv",
}

def load_translation_csv(file_path: Path) -> dict[str, str]:
    translations = {}
    with file_path.open(encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # Skip header
        for english, bengali in reader:
            translations[english.strip()] = bengali.strip()
    return translations

def main():
    base_dir = Path(__file__).parent
    region_translations = {}

    for key, filename in CSV_FILES.items():
        csv_path = base_dir / filename
        region_translations[key] = load_translation_csv(csv_path)

    # Save as JSON
    output_path = base_dir / "region-translations.json"
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(region_translations, f, ensure_ascii=False, indent=2)

    print(f"Region translations saved to: {output_path}")

if __name__ == "__main__":
    main()
