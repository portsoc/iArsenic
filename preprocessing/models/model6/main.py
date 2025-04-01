from utils.load_training_data import run_training_data_generation
from utils.fix_maps import fix_maps
from utils.load_training_df import load_training_data_df
from utils.generate_prediction_data import generate_prediction_data

def main():
    # Generate training data
    print('================ LOAD TRAINING DATA ================')
    training_data = run_training_data_generation()
    training_data_df = load_training_data_df(training_data)

    # Apply map fixes and get mou topo file
    print('================ FIX MAPS ================')
    mou_topo = fix_maps()

    # Generate drop down data from fixed maps
    print('================ GENERATE DROPDOWN DATA ================')
    dropdown_data = generate_dropdown_data(mou_topo)

    # For each item in dropdown data, generate prediction
    print('================ GENERATE PREDICTIONS ================')
    generate_prediction_data(dropdown_data, mou_topo, training_data_df)

if __name__ == '__main__':
    main()