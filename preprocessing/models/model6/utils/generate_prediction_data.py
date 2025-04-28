import json
import pandas as pd
import os
import multiprocessing as mp
import numpy as np
from utils.load_training_df import load_training_data_df
from utils.find_regions_within_radius import find_regions_within_radius


#  s15: {
#    m: ...,     // short for message ID using median
#    m2: ...,    // message ID using the 25th percentile
#    m7: ...,    // message ID using the 75th percentile
#    m9: ...    // message ID using the 95th percentile
#  },
#  s45: {
#    m: ...
#  },
#  s65: {
#    m: ...
#  },
#  s90: {
#    m: ...
#  },
#  s150: {
#    m: ...
#  },
#  sD: {
#    m: ...
#  }

MAX_WORKERS = mp.cpu_count()

# Globals for use by sub processes
PATCH_LTE_90_DF = None
PATCH_GT_90_DF = None
GEODATA_IN_TRAINING_DATA = None
TRAINING_DATA = None

# Only load patch files once, not for each worker
def init_worker(geodata_in_training_data, training_data):
    global PATCH_LTE_90_DF
    global PATCH_GT_90_DF
    global GEODATA_IN_TRAINING_DATA
    global TRAINING_DATA

    PATCH_LTE_90_DF = pd.read_csv("model_patch/arsenic_statistics_lte_90m_v2.csv")
    PATCH_GT_90_DF = pd.read_csv("model_patch/arsenic_statistics_gt_90m_v2.csv")
    GEODATA_IN_TRAINING_DATA = geodata_in_training_data
    TRAINING_DATA = training_data

def produce_message(med, max_val):
    if med is None:
        return 0

    chem_test_status = 0 if max_val <= 100 else 1

    if med <= 20:
        return 1 + chem_test_status
    elif med <= 50:
        return 3 + chem_test_status
    elif med <= 200:
        return 5 + chem_test_status
    else:
        return 7 + chem_test_status

def write_not_enough_data_warning(region_key, strata):
    error_path = 'logs/generate_prediction_data/not_enough_data.txt'
    with open(error_path, 'a') as err_file:
        err_file.write(f"{strata},{region_key}\n")

def write_patch_used_warning(region_key, strata):
    error_path = 'logs/generate_prediction_data/patch_used.txt'
    with open(error_path, 'a') as err_file:
        err_file.write(f"{strata},{region_key}\n")

def s15_flood_stats(gd, td, region_key, centroid):
    wells_15 = td[(td['region_key'] == region_key) & (td['Depth'] < 15)]

    if len(wells_15) < 7:
        nearby_mouzas = find_regions_within_radius(5000, gd, centroid)
        nearby_keys = nearby_mouzas['region_key'].tolist()
        nearby_wells = td[(td['region_key'].isin(nearby_keys)) & (td['Depth'] < 45)]
        wells_15 = pd.concat([wells_15, nearby_wells]).drop_duplicates()

    arsenic_15 = wells_15['Arsenic'].dropna()

    if len(arsenic_15) >= 7:
        p25, p75, p95 = np.percentile(arsenic_15, [25, 75, 95])
        max_val = arsenic_15.max()

        return {
            "m2": produce_message(p25, max_val),
            "m7": produce_message(p75, max_val),
            "m9": produce_message(p95, max_val),
        }
    write_not_enough_data_warning(region_key, 's15_flood')

def s15_stats(mou, gd, td, region_key, centroid):
    wells_15 = td[(td['region_key'] == region_key) & (td['Depth'] < 15)]

    if len(wells_15) < 7:
        extra = td[(td['region_key'] == region_key) & (td['Depth'] < 45)]
        wells_15 = pd.concat([wells_15, extra]).drop_duplicates()

    if len(wells_15) < 7:
        nearby_mouzas = find_regions_within_radius(10000, gd, centroid)
        nearby_keys = nearby_mouzas['region_key'].tolist()
        nearby_wells = td[(td['region_key'].isin(nearby_keys)) & (td['Depth'] < 45)]
        wells_15 = pd.concat([wells_15, nearby_wells]).drop_duplicates()

    arsenic_15 = wells_15['Arsenic'].dropna()

    if len(arsenic_15) >= 7:
        p1, p50, p9 = np.percentile(arsenic_15, [10, 50, 90])
        max_val = arsenic_15.max()

        return {
            "m": produce_message(p50, max_val),
            "l": round(p1, 1),
            "u": round(p9, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()

        patch = PATCH_LTE_90_DF[
            (PATCH_LTE_90_DF['Division'] == div) &
            (PATCH_LTE_90_DF['District'] == dis) &
            (PATCH_LTE_90_DF['Upazila'] == upa)
        ]

        if not patch.empty:
            write_patch_used_warning(region_key, 's15')
            risk = int(patch['Risk'].values[0])
            return {"m": risk}
    write_not_enough_data_warning(region_key, 's15')
    return {"m": 0} 

def s45_stats(mou, gd, td, region_key, centroid):
    wells_45 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 15) & (td['Depth'] < 45)
    ]

    if len(wells_45) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 15) & (td['Depth'] < 65)
        ]
        wells_45 = pd.concat([wells_45, extra]).drop_duplicates()

    if len(wells_45) < 7:
        nearby_mouzas_10k = find_regions_within_radius(10000, gd, centroid)
        nearby_keys_10k = nearby_mouzas_10k['region_key'].tolist()
        nearby_wells_10k = td[
            (td['region_key'].isin(nearby_keys_10k)) &
            (td['Depth'] >= 15) & (td['Depth'] < 45)
        ]
        wells_45 = pd.concat([wells_45, nearby_wells_10k]).drop_duplicates()

    if len(wells_45) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()
        nearby_wells_20k = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 15) & (td['Depth'] < 65)
        ]
        wells_45 = pd.concat([wells_45, nearby_wells_20k]).drop_duplicates()

    arsenic_45 = wells_45['Arsenic'].dropna()

    if len(arsenic_45) >= 7:
        p1, p50, p9 = np.percentile(arsenic_45, [10, 50, 90])
        return {
            "m": produce_message(p50, arsenic_45.max()),
            "l": round(p1, 1),
            "u": round(p9, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()
        match = PATCH_LTE_90_DF[
            (PATCH_LTE_90_DF['Division'] == div) &
            (PATCH_LTE_90_DF['District'] == dis) &
            (PATCH_LTE_90_DF['Upazila'] == upa)
        ]
        if not match.empty:
            write_patch_used_warning(region_key, 's45')
            risk = int(match['Risk'].values[0])
            return {"m": risk}
    write_not_enough_data_warning(region_key, 's45')
    return {"m": 0}

def s65_stats(mou, gd, td, region_key, centroid):
    wells_65 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 45) & (td['Depth'] < 65)
    ]

    if len(wells_65) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 45) & (td['Depth'] < 90)
        ]
        wells_65 = pd.concat([wells_65, extra]).drop_duplicates()

    if len(wells_65) < 7:
        nearby_mouzas_10k = find_regions_within_radius(10000, gd, centroid)
        nearby_keys_10k = nearby_mouzas_10k['region_key'].tolist()
        nearby_wells_10k = td[
            (td['region_key'].isin(nearby_keys_10k)) &
            (td['Depth'] >= 45) & (td['Depth'] < 65)
        ]
        wells_65 = pd.concat([wells_65, nearby_wells_10k]).drop_duplicates()

    if len(wells_65) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()
        nearby_wells_20k = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 45) & (td['Depth'] < 90)
        ]
        wells_65 = pd.concat([wells_65, nearby_wells_20k]).drop_duplicates()

    arsenic_65 = wells_65['Arsenic'].dropna()

    if len(arsenic_65) >= 7:
        p1, p50, p9 = np.percentile(arsenic_65, [10, 50, 90])
        return {
            "m": produce_message(p50, arsenic_65.max()),
            "l": round(p1, 1),
            "u": round(p9, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()
        match = PATCH_LTE_90_DF[
            (PATCH_LTE_90_DF['Division'] == div) &
            (PATCH_LTE_90_DF['District'] == dis) &
            (PATCH_LTE_90_DF['Upazila'] == upa)
        ]
        if not match.empty:
            write_patch_used_warning(region_key, 's65')
            risk = int(match['Risk'].values[0])
            return {"m": risk}
    write_not_enough_data_warning(region_key, 's65')
    return {"m": 0}

def s90_stats(mou, gd, td, region_key, centroid):
    wells_90 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 65) & (td['Depth'] < 90)
    ]

    if len(wells_90) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 65) & (td['Depth'] < 150)
        ]
        wells_90 = pd.concat([wells_90, extra]).drop_duplicates()

    if len(wells_90) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()

        nearby_wells_90 = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 65) & (td['Depth'] < 90)
        ]
        wells_90 = pd.concat([wells_90, nearby_wells_90]).drop_duplicates()

    if len(wells_90) < 7:
        nearby_wells_150 = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 65) & (td['Depth'] < 150)
        ]
        wells_90 = pd.concat([wells_90, nearby_wells_150]).drop_duplicates()

    arsenic_90 = wells_90['Arsenic'].dropna()

    if len(arsenic_90) >= 7:
        p10, p50, p90 = np.percentile(arsenic_90, [10, 50, 90])
        return {
            "m": produce_message(p50, arsenic_90.max()),
            "l": round(p10, 1),
            "u": round(p90, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()
        match = PATCH_LTE_90_DF[
            (PATCH_LTE_90_DF['Division'] == div) &
            (PATCH_LTE_90_DF['District'] == dis) &
            (PATCH_LTE_90_DF['Upazila'] == upa)
        ]
        if not match.empty:
            write_patch_used_warning(region_key, 's90')
            risk = int(match['Risk'].values[0])
            return {"m": risk}

    write_not_enough_data_warning(region_key, 's90')
    return {"m": 0}

def s150_stats(mou, gd, td, region_key, centroid):
    wells_150 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 90) & (td['Depth'] < 150)
    ]

    if len(wells_150) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 90)
        ]
        wells_150 = pd.concat([wells_150, extra]).drop_duplicates()

    if len(wells_150) < 7:
        nearby_mouzas_100k = find_regions_within_radius(100000, gd, centroid)
        nearby_keys_100k = nearby_mouzas_100k['region_key'].tolist()
        nearby_wells_100k = td[
            (td['region_key'].isin(nearby_keys_100k)) &
            (td['Depth'] >= 90)
        ]
        wells_150 = pd.concat([wells_150, nearby_wells_100k]).drop_duplicates()

    arsenic_150 = wells_150['Arsenic'].dropna()

    if len(arsenic_150) >= 7:
        p10, p50, p90 = np.percentile(arsenic_150, [10, 50, 90])
        return {
            "m": produce_message(p50, arsenic_150.max()),
            "l": round(p10, 1),
            "u": round(p90, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()
        match = PATCH_GT_90_DF[
            (PATCH_GT_90_DF['Division'] == div) &
            (PATCH_GT_90_DF['District'] == dis) &
            (PATCH_GT_90_DF['Upazila'] == upa)
        ]
        if not match.empty:
            write_patch_used_warning(region_key, 's150')
            risk = int(match['Risk'].values[0])
            return {"m": risk}

    write_not_enough_data_warning(region_key, 's150')
    return {"m": 0}

def sD_stats(mou, gd, td, region_key, centroid):
    wells_d = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 150)
    ]

    if len(wells_d) < 7:
        nearby_mouzas_100k = find_regions_within_radius(100000, gd, centroid)
        nearby_keys_100k = nearby_mouzas_100k['region_key'].tolist()

        nearby_wells_d = td[
            (td['region_key'].isin(nearby_keys_100k)) &
            (td['Depth'] >= 150)
        ]
        wells_d = pd.concat([wells_d, nearby_wells_d]).drop_duplicates()

    arsenic_d = wells_d['Arsenic'].dropna()

    if len(arsenic_d) >= 7:
        p10, p50, p90 = np.percentile(arsenic_d, [10, 50, 90])
        return {
            "m": produce_message(p50, arsenic_d.max()),
            "l": round(p10, 1),
            "u": round(p90, 1),
        }
    else:
        div, dis, upa = mou['div'].lower(), mou['dis'].lower(), mou['upa'].lower()
        match = PATCH_GT_90_DF[
            (PATCH_GT_90_DF['Division'] == div) &
            (PATCH_GT_90_DF['District'] == dis) &
            (PATCH_GT_90_DF['Upazila'] == upa)
        ]
        if not match.empty:
            write_patch_used_warning(region_key, 'sD')
            risk = int(match['Risk'].values[0])
            return {"m": risk}

    write_not_enough_data_warning(region_key, 'sD')
    return {"m": 0}

def process_mouza(args):
    mou, region_key = args

    gd = GEODATA_IN_TRAINING_DATA
    td = TRAINING_DATA

    filename = f"{mou['div']}-{mou['dis']}-{mou['upa']}-{mou['uni']}-{mou['mou']}.json"

    if os.path.exists(f'model/{filename}'):
        return

    mou_geometry = mou['geometry']
    centroid = mou_geometry.centroid

    mou_dict = {}

    # s15: depth < 15m
    mou_dict["s15"] = s15_flood_stats(gd, td, region_key, centroid)
    mou_dict["s15"] = s15_stats(mou, gd, td, region_key, centroid)

    # s45: 15m <= depth < 45m
    mou_dict["s45"] = s45_stats(mou, gd, td, region_key, centroid)

    # s65: 45m <= depth < 65m
    mou_dict["s65"] = s65_stats(mou, gd, td, region_key, centroid)

    # s90: 65m <= depth < 90m
    mou_dict["s90"] = s90_stats(mou, gd, td, region_key, centroid)

    # s150: depth 90–150+ meters
    mou_dict["s150"] = s150_stats(mou, gd, td, region_key, centroid)

    # sD: depth >= 150m
    mou_dict["sD"] = sD_stats(mou, gd, td, region_key, centroid)

    try:
        with open(f'model/{filename}', 'w') as f:
            json.dump(mou_dict, f, separators=(',', ':'))
    except Exception as e:
        error_path = 'logs/generate_prediction_data/failed_to_write_model.txt'
        with open(error_path, 'a') as err_file:
            err_file.write(f"{filename},{json.dumps(mou_dict)}\n")

def run_prediction_jobs(region_tree, gd_index, td, gd_in_td):
    total_divisions = len(region_tree)
    jobs = []

    for idx_div, div_obj in enumerate(region_tree, start=1):
        div = div_obj['division']
        districts = div_obj['districts']
        print(f"Processing Division {idx_div}/{total_divisions}: {div} (Total Districts: {len(districts)})")

        for idx_dis, dis_obj in enumerate(districts, start=1):
            dis = dis_obj['district']
            upazilas = dis_obj['upazilas']

            for idx_upa, upa_obj in enumerate(upazilas, start=1):
                upa = upa_obj['upazila']
                unions = upa_obj['unions']

                for idx_uni, uni_obj in enumerate(unions, start=1):
                    uni = uni_obj['union']
                    mouzas = uni_obj['mouzas']

                    for idx_mou, mou in enumerate(mouzas, start=1):
                        region_key = f"{div}-{dis}-{upa}-{uni}-{mou}"
                        gd_mou = gd_index.loc[region_key]

                        jobs.append((
                            gd_mou,
                            region_key,
                        ))

    print('--------------------------------')
    print('Starting multiprocessing')
    print(f'Total jobs: {len(jobs)}')

    with mp.Pool(
        processes=MAX_WORKERS, 
        initializer=init_worker,
        initargs=(gd_in_td, td)
    ) as pool:
        for result in pool.imap_unordered(process_mouza, jobs):
            pass

def generate_prediction_data(dropdown_data, mou_topo, training_data):
    if mou_topo.crs is None:
        mou_topo.set_crs(epsg=4326, inplace=True)

    geodata = mou_topo.to_crs(epsg=32645)

    # set region key as index for fast lookup of mouza geodata
    geodata['region_key'] = geodata['div'] + '-' + geodata['dis'] + '-' + geodata['upa'] + '-' + geodata['uni'] + '-' + geodata['mou']
    geodata_index = geodata.set_index('region_key')

    training_data['region_key'] = training_data['Division'] + '-' + training_data['District'] + '-' + training_data['Upazila'] + '-' + training_data['Union'] + '-' + training_data['Mouza']

    # filter geo data with no corresponding training data
    # so we dont check these regions for training data
    # when widening
    geodata_in_training_data = geodata[geodata['region_key'].isin(training_data['region_key'])]

    run_prediction_jobs(
        dropdown_data,
        geodata_index,
        training_data,
        geodata_in_training_data,
    )
