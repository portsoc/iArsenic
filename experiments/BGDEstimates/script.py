from math import isnan
import numpy as np
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import requests
from dotenv import load_dotenv
load_dotenv()

INPUT_PATH = './BGD_Traverse_ESRC_As_Data_with_Mouza_Information.xlsx'

REGION_FROM_POINT_URL = "http://localhost:5000/api/v1/geodata/region-from-point"
PREDICTION_URL = "http://localhost:5000/api/v1/prediction"

API_KEY = os.getenv("API_KEY")
HEADERS = {"x-api-key": API_KEY}

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

def make_prediction(payload):
    try:
        response = requests.post(PREDICTION_URL, json=payload, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Prediction error for {payload}: {e}")
        return None

def is_missing(*values):
    return any(pd.isna(v) or (isinstance(v, float) and isnan(v)) for v in values)

def run_predictions(df):
    df["model_output"] = None
    df["risk_assessment"] = None

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
            print(f"Skipping row {i}: missing location/depth")
            continue

        payload = {
            "division": str(division),
            "district": str(district),
            "upazila": str(upazila),
            "union": str(union),
            "mouza": str(mouza),
            "depth": float(depth),
            "staining": stain,
            "flooding": False,
            "utensilStaining": None
        }

        prediction = make_prediction(payload)
        if prediction:
            df.at[i, "model_output"] = prediction.get("modelOutput")
            df.at[i, "risk_assessment"] = prediction.get("riskAssesment")

    os.makedirs("output", exist_ok=True)
    df.to_csv('output/bgd-with-predictions.csv', index=False)

    df = df.dropna(subset=["As_ppb", "risk_assessment"]).copy()

def expected_risk(as_ppb):
    if as_ppb < 10:
        return 0
    elif as_ppb <= 50:
        return 1
    elif as_ppb <= 100:
        return 2
    elif as_ppb <= 200:
        return 3
    else:
        return 4

def create_confusion_matrix(df):
    # Drop rows with missing values
    df = df.dropna(subset=["As_ppb", "risk_assessment"])

    # Compute expected values
    df.loc[:, "expected"] = df["As_ppb"].apply(expected_risk).astype(int)
    df.loc[:, "predicted"] = (df["risk_assessment"] - 0.5).astype(int)

    # Generate confusion matrix
    labels = [0, 1, 2, 3, 4]
    cm = confusion_matrix(df["expected"], df["predicted"], labels=labels)
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)

    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm_df, annot=True, fmt="d", cmap="Blues", cbar=False)
    plt.title("Confusion Matrix: Expected vs Predicted Risk Assessment")
    plt.xlabel("Predicted")
    plt.ylabel("Expected")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    df = pd.read_excel(INPUT_PATH)
    if not os.path.exists('output/BGD_Traverse_with_regions.csv'):
        get_region_and_extend_df(df)
    else:
        print(f"output/BGD_Traverse_with_regions.csv already exists — skipping fetch.")

    df = pd.read_csv('output/BGD_Traverse_with_regions.csv')

    if not os.path.exists('output/bgd-with-predictions.csv'):
        run_predictions(df)
    else:
        print(f'output/bgd-with-predictions.csv already exists, skipping')

    df = pd.read_csv('output/bgd-with-predictions.csv')
    create_confusion_matrix(df)
