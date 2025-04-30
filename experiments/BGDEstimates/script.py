from math import isnan
import os
import pandas as pd
import requests

INPUT_PATH = './BGD_Traverse_ESRC_As_Data_with_Mouza_Information.xlsx'
OUTPUT_PATH = 'output/BGD_Traverse_with_regions.csv'

API_URL = "http://localhost:5000/api/v1/geodata/region-from-point"
PREDICTION_URL = "http://localhost:5000/api/v1/prediction"
HEADERS = {"x-api-key": "a4611195-de04-44f9-858f-9594a4e06652"}

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
            response = requests.get(API_URL, params={"lat": lat, "lon": lon}, headers=HEADERS)

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
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved extended DataFrame to {OUTPUT_PATH}")

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

if __name__ == "__main__":
    df = pd.read_excel(INPUT_PATH)
    if not os.path.exists(OUTPUT_PATH):
        get_region_and_extend_df(df)
    else:
        print(f"{OUTPUT_PATH} already exists — skipping fetch.")

    df = pd.read_csv(OUTPUT_PATH)

    run_predictions(df)
