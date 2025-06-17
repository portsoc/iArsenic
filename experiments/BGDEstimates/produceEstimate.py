import os
import json
from typing import Dict, Union

def check_patched(region_stratum):
    if list(region_stratum.keys()) == ['m']:
        return 'used patch'
    return 'used training data'


def produce_estimate(
    predictors: Dict[str, Union[str, float, bool, None]], 
    model_version: str
) -> tuple[int, str]:
    div = predictors["division"]
    dis = predictors["district"]
    upa = predictors["upazila"]
    uni = predictors["union"]
    mou = predictors["mouza"]
    depth = predictors["depth"]

    if depth is None:
        raise ValueError("depth not found in well data")

    model_dir = f"{model_version}"
    filename = f"{div}-{dis}-{upa}.json"
    path = os.path.join(model_dir, filename)

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")

    with open(path, "r") as f:
        full_model_data = json.load(f)

    # Use union and mouza to extract the model section for this location
    model_data = full_model_data.get(uni, {}).get(mou)
    if model_data is None:
        raise ValueError(f"No model data for union '{uni}', mouza '{mou}' in file '{filename}'")

    print('---------------- PREDICTORS ----------------')
    print(json.dumps(predictors, indent=4))

    # Determine which stratum applies
    if depth < 15.3:
        region_strata_key = "s15"
    elif depth < 45:
        region_strata_key = "s45"
    elif depth < 65:
        region_strata_key = "s65"
    elif depth < 90:
        region_strata_key = "s90"
    elif depth < 150:
        region_strata_key = "s150"
    else:
        region_strata_key = "sD"

    print(f'---------------- MODEL STRATA {region_strata_key} DATA ----------------')
    print(json.dumps(model_data[region_strata_key], indent=4))

    region_stratum = model_data.get(region_strata_key, {})
    patch_str = check_patched(region_stratum)

    # Prediction logic for shallow wells using flooding model
    if region_strata_key == "s15" and "m2" in region_stratum:
        if predictors.get("staining") == "black" and "m2" in region_stratum:
            return (region_stratum["m2"], patch_str)
        elif predictors.get("flooding") and "m9" in region_stratum:
            return (region_stratum["m9"], patch_str)
        elif "m7" in region_stratum:
            return (region_stratum["m7"], patch_str)
        else:
            raise ValueError("Model keys required for flooding model missing")
    else:
        if predictors.get("staining") == "black" or predictors.get("utensilStaining") == "black":
            return (1, patch_str)
        elif predictors.get("staining") == "red" or predictors.get("utensilStaining") == "red":
            if "m" in region_stratum:
                return (region_stratum["m"], patch_str)
            else:
                raise ValueError("Model key required for red staining missing")
        else:
            return (0, patch_str)
