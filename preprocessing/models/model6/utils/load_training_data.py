import subprocess
import json
from pathlib import Path

def run_training_data_generation():
    project_root = Path(__file__).resolve().parents[4]
    output_path = project_root / 'preprocessing/models/model6/output/training-data.json'
    command = "npm i && node preprocessing/cli/csv-to-json.js -p data/*.csv -o preprocessing/models/model6/output/training-data.json"

    try:
        subprocess.run(command, shell=True, check=True, cwd=project_root)
        print("Training data generated successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to generate training data: {e}")
        return None

    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data
    except Exception as e:
        print(f"Failed to load training data JSON: {e}")
        return None
