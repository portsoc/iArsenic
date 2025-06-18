import json
import pandas as pd
import os
import multiprocessing as mp
import numpy as np
from utils.load_training_df import load_training_data_df
from utils.find_regions_within_radius import find_regions_within_radius
from filelock import FileLock, Timeout
from tqdm import tqdm
from collections import defaultdict


#  s15: {
#    m: ...,     // short for message ID using median
#    m2: ...,    // message ID using the 25th percentile excluded when patch used
#    m7: ...,    // message ID using the 75th percentile excluded when patch used
#    m9: ...    // message ID using the 95th percentile excluded when patch used
#  },
#  s45: {
#    m: ...,
#    l: ...,    // exluded when patch used
#    u: ...    // exluded when patch used
#  },
#  s65: {
#    m: ...,
#    l: ...,    // exluded when patch used
#    u: ...    // exluded when patch used
#  },
#  s90: {
#    m: ...,
#    l: ...,    // exluded when patch used
#    u: ...    // exluded when patch used
#  },
#  s150: {
#    m: ...,
#    l: ...,    // exluded when patch used
#    u: ...    // exluded when patch used
#  },
#  sD: {
#    m: ...,
#    l: ...,    // exluded when patch used
#    u: ...    // exluded when patch used
#  }

# MAX_WORKERS = os.cpu_count()
MAX_WORKERS = 16

# Globals for use by sub processes (reduces memory usage)
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

    if med <= 10:
        return 1 + chem_test_status
    elif med <= 50:
        return 3 + chem_test_status
    elif med <= 150:
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
        p25, p50, p75, p95 = np.percentile(arsenic_15, [25, 50, 75, 95])
        max_val = arsenic_15.max()

        return {
            "m2": produce_message(p25, max_val),
            "m7": produce_message(p75, max_val),
            "m9": produce_message(p95, max_val),
            "median": p50,
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
            "median": p50,
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
            "median": p50,
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
            "median": p50,
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
            "median": p50,
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
            "median": p50,
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
            "median": p50,
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


def process_upa(args):
    filename, mouza_batch = args

    gd = GEODATA_IN_TRAINING_DATA
    td = TRAINING_DATA
    filepath = os.path.join("m150_10", filename)

    if os.path.exists(filepath):
        return

    file_data = {}

    for mou, region_key in mouza_batch:
        uni = mou["uni"]
        mou_key = mou["mou"]
        centroid = mou["geometry"].centroid

        s15_main = s15_stats(mou, gd, td, region_key, centroid)
        s15_flood = s15_flood_stats(gd, td, region_key, centroid)

        if isinstance(s15_main, dict) and isinstance(s15_flood, dict):
            s15_combined = {**s15_main, **s15_flood}
        else:
            s15_combined = s15_main if isinstance(s15_main, dict) else s15_flood

        mou_dict = {
            "s15": s15_combined,
            "s45": s45_stats(mou, gd, td, region_key, centroid),
            "s65": s65_stats(mou, gd, td, region_key, centroid),
            "s90": s90_stats(mou, gd, td, region_key, centroid),
            "s150": s150_stats(mou, gd, td, region_key, centroid),
            "sD": sD_stats(mou, gd, td, region_key, centroid),
        }

        if uni not in file_data:
            file_data[uni] = {}

        file_data[uni][mou_key] = mou_dict

    with open(filepath, "w") as f:
        json.dump(file_data, f, separators=(",", ":"))


        
def run_prediction_jobs(region_tree, gd_index, td, gd_in_td):
    # Group jobs by filename (one file per upazila)
    grouped_jobs = defaultdict(list)

    for div_obj in region_tree:
        div = div_obj["division"]
        for dis_obj in div_obj["districts"]:
            dis = dis_obj["district"]
            for upa_obj in dis_obj["upazilas"]:
                upa = upa_obj["upazila"]
                filename = f"{div}-{dis}-{upa}.json"

                for uni_obj in upa_obj["unions"]:
                    uni = uni_obj["union"]
                    for mou in uni_obj["mouzas"]:
                        region_key = f"{div}-{dis}-{upa}-{uni}-{mou}"
                        gd_mou = gd_index.loc[region_key]
                        grouped_jobs[filename].append((gd_mou, region_key))

    jobs = list(grouped_jobs.items())
    print('--------------------------------')
    print('Starting multiprocessing')
    print(f'Total files to process: {len(jobs)}')

    with mp.Pool(
        processes=MAX_WORKERS,
        initializer=init_worker,
        initargs=(gd_in_td, td),
    ) as pool:
        for _ in tqdm(pool.imap_unordered(process_upa, jobs), total=len(jobs)):
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
