import sys
import importlib.util
import pandas as pd
import geopandas as gpd
import requests
import os
from dotenv import load_dotenv
from math import isnan
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix


# Dynamically import produce_estimate
spec = importlib.util.spec_from_file_location("produceEstimate", "../produceEstimate.py")
produce_estimate_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(produce_estimate_module)
produce_estimate = produce_estimate_module.produce_estimate

# Setup
load_dotenv()
API_KEY = os.getenv("API_KEY")
HEADERS = {"x-api-key": API_KEY}
REGION_FROM_POINT_URL = "http://localhost:5000/api/v1/geodata/region-from-point"
MODEL_VERSION = "m150_10"

# File paths
DATA_CSV = "../../../data/vgqd/vgqd-all-data.csv"
GEOJSON_PATH = "../../../preprocessing/models/model6/output/geodata/intersected_unions.geojson"
OUTPUT_CSV = "vgqd_with_predictions.csv"

# Helpers
def is_missing(*values):
    return any(pd.isna(v) or (isinstance(v, float) and isnan(v)) for v in values)

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

# Load data
df = pd.read_csv(DATA_CSV)
gdf = gpd.read_file(GEOJSON_PATH)

# Normalize keys
for col in ["div", "dis", "upa", "uni"]:
    df[col] = df[col].astype(str).str.strip()
    gdf[col] = gdf[col].astype(str).str.strip()

# Output columns
model_outputs = []
risk_assessments = []
patch_used_flags = []
expected_risks = []

for i, row in df.iterrows():
    if is_missing(row["depth"], row["colour"], row["as"]):
        model_outputs.append(None)
        risk_assessments.append(None)
        patch_used_flags.append(None)
        expected_risks.append(None)
        continue

    match = gdf[
        (gdf["div"] == row["div"]) &
        (gdf["dis"] == row["dis"]) &
        (gdf["upa"] == row["upa"]) &
        (gdf["uni"] == row["uni"])
    ]

    if match.empty:
        print(f"No union geometry match for row {i}")
        model_outputs.append(None)
        risk_assessments.append(None)
        patch_used_flags.append(None)
        expected_risks.append(None)
        continue

    centroid = match.iloc[0].geometry.centroid
    lat, lon = centroid.y, centroid.x

    try:
        response = requests.get(REGION_FROM_POINT_URL, params={"lat": lat, "lon": lon}, headers=HEADERS)
        response.raise_for_status()
        region = response.json()
    except Exception as e:
        print(f"API error for row {i} (lat={lat}, lon={lon}): {e}")
        model_outputs.append(None)
        risk_assessments.append(None)
        patch_used_flags.append(None)
        expected_risks.append(None)
        continue

    predictors = {
        "division": region["division"],
        "district": region["district"],
        "upazila": region["upazila"],
        "union": region["union"],
        "mouza": region["mouza"],
        "depth": float(row["depth"]),
        "staining": row["colour"].lower() if isinstance(row["colour"], str) else None,
        "utensilStaining": None,
        "flooding": False
    }

    try:
        estimate, patch_str = produce_estimate(predictors, f'../{MODEL_VERSION}')
        model_outputs.append(estimate)
        risk_assessments.append(model_estimate_to_risk_assessment(estimate))
        patch_used_flags.append(patch_str)
    except Exception as e:
        print(f"Prediction error for row {i}: {e}")
        model_outputs.append(None)
        risk_assessments.append(None)
        patch_used_flags.append(None)

    try:
        expected_risks.append(expected_risk(row["as"]))
    except Exception as e:
        print(f"Expected risk error for row {i}: {e}")
        expected_risks.append(None)

# Save to DataFrame
df[MODEL_VERSION] = model_outputs
df[f"{MODEL_VERSION}_risk_assessment"] = risk_assessments
df[f"{MODEL_VERSION}_patch_used"] = patch_used_flags
df["expected_risk"] = expected_risks

df.to_csv(OUTPUT_CSV, index=False)
print(f"Saved output to {OUTPUT_CSV}")

cm_df = df.dropna(subset=[f"{MODEL_VERSION}_risk_assessment", "expected_risk"]).copy()

# Round to integers if needed
cm_df["predicted"] = cm_df[f"{MODEL_VERSION}_risk_assessment"].round().astype(int)
cm_df["expected"] = cm_df["expected_risk"].round().astype(int)

# Compute confusion matrix
labels = [0, 1, 2, 3, 4]
cm = confusion_matrix(cm_df["expected"], cm_df["predicted"], labels=labels)
cm_matrix = pd.DataFrame(cm, index=labels, columns=labels)

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(cm_matrix, annot=True, fmt="d", cmap="Blues", cbar=False)
plt.title(f"Confusion Matrix for {MODEL_VERSION}")
plt.xlabel("Predicted Risk")
plt.ylabel("Expected Risk")
plt.tight_layout()

# Save and show plot
confusion_output_path = f"{MODEL_VERSION}_confusion_matrix.png"
plt.savefig(confusion_output_path)
plt.show()
print(f"Saved confusion matrix to {confusion_output_path}")
