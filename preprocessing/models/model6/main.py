import geopandas as gpd
from pathlib import Path
import json
from utils.load_training_data import run_training_data_generation
from utils.fix_maps import fix_maps
from utils.load_training_df import load_training_data_df
from utils.generate_prediction_data import generate_prediction_data
from utils.generate_dropdown_data import generate_dropdown_data

def load_or_fix_mou_topo():
    topo_path = Path("output/geodata/intersected_mouzas.topojson")

    if topo_path.exists():
        print("Using existing intersected_mouzas.topojson")
        mou_topo = gpd.read_file(topo_path)
    else:
        print("intersected_mouzas.topojson not found, running fix_maps()...")
        mou_topo = fix_maps()

    return mou_topo

def main():
    # Generate training data
    print('================ LOAD TRAINING DATA ================')
    training_data = run_training_data_generation()
    training_data_df = load_training_data_df(training_data)

    # Apply map fixes and get mou topo file
    print('================ FIX MAPS ================')
    mou_topo = load_or_fix_mou_topo()

    # Generate drop down data from fixed maps
    print('================ GENERATE DROPDOWN DATA ================')
    dropdown_data = generate_dropdown_data(mou_topo)

    # For each item in dropdown data, generate prediction
    print('================ GENERATE PREDICTIONS ================')
    generate_prediction_data([dropdown_data[0]], mou_topo, training_data_df)

if __name__ == '__main__':
    main()