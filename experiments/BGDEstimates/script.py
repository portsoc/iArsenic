from math import isnan
import numpy as np
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import requests
from produceEstimate import produce_estimate
from dotenv import load_dotenv
load_dotenv()

INPUT_PATH = './BGD_Traverse_ESRC_As_Data_with_Mouza_Information.xlsx'

REGION_FROM_POINT_URL = "http://localhost:5000/api/v1/geodata/region-from-point"
WELL_URL = "http://localhost:5000/api/v1/self/well"
PREDICTION_URL = "http://localhost:5000/api/v1/prediction/well"

API_KEY = os.getenv("API_KEY")
HEADERS = {"x-api-key": API_KEY}

def model_estimate_to_risk_assessment(model_estimate: int) -> float:
    if model_estimate == 0:
        return 2
    elif model_estimate == 1:
        return 0
    elif model_estimate in (2, 3):
        return 1
    elif model_estimate in (4, 5):
        return 2
    elif model_estimate == 6:
        return 3
    elif model_estimate in (7, 8):
        return 4
    else:
        return 2

def get_region_and_extend_df(df):

    print("Fetching region data and adding columns...")

    # Create new columns with default None
    df["coord-div"] = None
    df["coord-dis"] = None
    df["coord-upa"] = None
    df["coord-uni"] = None
    df["coord-mou"] = None
    df["map_url"] = None

    for i, row in df.iterrows():
        lat, lon = row["lat"], row["lon"]
        map_url = f"https://maps.google.com/?q={lat},{lon}"
        df.at[i, "map_url"] = map_url

        try:
            response = requests.get(REGION_FROM_POINT_URL, params={"lat": lat, "lon": lon}, headers=HEADERS)

            if response.status_code == 404:
                print(f"[404] No region found for lat={lat}, lon={lon}")
            else:
                response.raise_for_status()
                data = response.json()
                df.at[i, "coord-div"] = data.get("division")
                df.at[i, "coord-dis"] = data.get("district")
                df.at[i, "coord-upa"] = data.get("upazila")
                df.at[i, "coord-uni"] = data.get("union")
                df.at[i, "coord-mou"] = data.get("mouza")

        except Exception as e:
            print(f"Error for lat={lat}, lon={lon}: {e}")

    os.makedirs("output", exist_ok=True)
    df.to_csv('output/BGD_Traverse_with_regions.csv', index=False)
    print(f"Saved extended DataFrame to {'output/BGD_Traverse_with_regions.csv'}")

VALID_STAINS = {
    "Red": "red",
    "Red?": "red",
    "Black": "black",
    "Black?": "black"
}

def create_well(payload):
    try:
        response = requests.post(WELL_URL, json=payload, headers=HEADERS)
        response.raise_for_status()
        return response.json().get("id")
    except Exception as e:
        print(f"Failed to create well for {payload}: {e}")
        return None

def create_prediction(well_id):
    try:
        response = requests.post(f"{PREDICTION_URL}/{well_id}", headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Prediction error for well {well_id}: {e}")
        return None

def is_missing(*values):
    return any(pd.isna(v) or (isinstance(v, float) and isnan(v)) for v in values)

MODEL_VERSIONS = {
    "m60": "m60",
    "m100": "m100",
    "m150": "m150",
    "m200": "m200",
    "m150_10": "m150_10",
}

def run_predictions_local(df):
    for model_col in MODEL_VERSIONS:
        df[model_col] = None
        df[model_col + '_patch_used'] = None
        df[model_col + '_risk_assesment'] = None

    df['expected_risk'] = df['As_ppb'].apply(lambda x: expected_risk(x))

    for i, row in df.iterrows():
        stain_raw = str(row.get("Stain", "")).strip()
        stain = VALID_STAINS.get(stain_raw)

        if not stain:
            print(f"Skipping row {i}: invalid stain '{stain_raw}'")
            continue

        division = row.get("coord-div") or row.get("N_DIVISION")
        district = row.get("coord-dis") or row.get("N_DISTRICT")
        upazila = row.get("coord-upa") or row.get("N_UPAZILA")
        union = row.get("coord-uni") or row.get("N_UNION")
        mouza = row.get("coord-mou") or row.get("N_MAUZA")
        depth = row.get("Depth_m")

        if is_missing(division, district, upazila, union, mouza, depth):
            print(f"Skipping row {i}: missing location or depth")
            continue

        predictors = {
            "division": str(division),
            "district": str(district),
            "upazila": str(upazila),
            "union": str(union),
            "mouza": str(mouza),
            "depth": float(depth),
            "staining": stain,
            "utensilStaining": None,
            "flooding": False
        }

        for model_col, model_version in MODEL_VERSIONS.items():
            print(f'================ model_version: {model_version} ================')
            try:
                estimate, patch_str = produce_estimate(predictors, model_version)
                print(f'Model Estimate: {estimate}')

                risk_assesment = model_estimate_to_risk_assessment(estimate)
                print(f'Model Risk Assesment: {risk_assesment}')

                print(f'sample as ppb: {df.at[i, 'As_ppb']}')
                print(f'Correct Risk Assesment: {expected_risk(df.at[i, 'As_ppb'])}')

                df.at[i, model_col] = estimate
                df.at[i, model_col + '_patch_used'] = patch_str
                df.at[i, model_col + '_risk_assesment'] = risk_assesment
            except Exception as e:
                print(f"Prediction error for row {i}, model {model_col}: {e}")
                df.at[i, model_col] = None

    os.makedirs("output", exist_ok=True)
    df.to_csv('output/bgd-with-local-predictions.csv', index=False)
    print("Saved predictions to output/bgd-with-local-predictions.csv")

def expected_risk(as_ppb):
    if as_ppb < 10:
        return 0
    elif as_ppb <= 50:
        return 1
    elif as_ppb <= 100:
        return 2
    elif as_ppb <= 150:
        return 3
    else:
        return 4

def create_confusion_matrices(df, output_dir="output/confusion_matrices"):
    os.makedirs(output_dir, exist_ok=True)

    df = df.dropna(subset=["As_ppb"]).copy()
    df["expected"] = df["As_ppb"].apply(expected_risk).astype(int)

    labels = [0, 1, 2, 3, 4]

    for model in MODEL_VERSIONS.values():
        risk_col = f"{model}_risk_assesment"
        if risk_col not in df.columns:
            print(f"Skipping {model}: column '{risk_col}' not found.")
            continue

        sub_df = df.dropna(subset=[risk_col]).copy()

        # FIX: round before casting to int to avoid truncation errors
        sub_df["predicted"] = sub_df[risk_col].round().astype(int)

        # Optional: Debug info to verify all expected/predicted values are within range
        print(f"{model}: predicted values = {sorted(sub_df['predicted'].unique())}")
        print(f"{model}: expected values = {sorted(sub_df['expected'].unique())}")

        cm = confusion_matrix(sub_df["expected"], sub_df["predicted"], labels=labels)
        cm_df = pd.DataFrame(cm, index=labels, columns=labels)

        plt.figure(figsize=(8, 6))
        sns.heatmap(cm_df, annot=True, fmt="d", cmap="Blues", cbar=False)
        plt.title(f"Confusion Matrix for {model}")
        plt.xlabel("Predicted")
        plt.ylabel("Expected")
        plt.tight_layout()

        output_path = os.path.join(output_dir, f"{model}_confusion_matrix.png")
        plt.savefig(output_path)
        plt.close()

if __name__ == "__main__":
    df = pd.read_excel(INPUT_PATH)
    if not os.path.exists('output/BGD_Traverse_with_regions.csv'):
        get_region_and_extend_df(df)
    else:
        print(f"output/BGD_Traverse_with_regions.csv already exists — skipping fetch.")

    df = pd.read_csv('output/BGD_Traverse_with_regions.csv')

    if not os.path.exists('output/bgd-with-local-predictions.csv'):
        run_predictions_local(df)
    else:
        print(f'output/bgd-with-local-predictions.csv already exists, skipping')

    df = pd.read_csv('output/bgd-with-local-predictions.csv')
    create_confusion_matrices(df)
