import json
import geopandas as gpd
import pandas as pd
import os
import concurrent.futures
import multiprocessing as mp
import numpy as np
from utils.load_training_df import load_training_data_df
from utils.find_regions_within_radius import find_regions_within_radius

#  s15: {
#    m: ...,     // short for message ID using median
#    m2: ...,    // message ID using the 25th percentile
#    m7: ...,    // message ID using the 75th percentile
#    m9: ...,    // message ID using the 95th percentile
#    l: ...,     // short for lower quantile
#    u: ...,     // short for upper quantile
#  },
#  s45: {
#    m: ...,
#    l: ...,
#    u: ...,
#  },
#  s65: {
#    m: ...,
#    l: ...,
#    u: ...,
#  },
#  s90: {
#    m: ...,
#    l: ...,
#    u: ...,
#  },
#  s150: {
#    m: ...,
#    l: ...,
#    u: ...,
#  },
#  sD: {
#    m: ...,
#    l: ...,
#    u: ...,
#  }

MAX_WORKERS = mp.cpu_count()

def process_mouza(args):
    mou, gd, td = args
    filename = f"{mou['div']}-{mou['dis']}-{mou['upa']}-{mou['uni']}-{mou['mou']}.json"

    if os.path.exists(f'model/{filename}'):
        return

    mou_geometry = mou.geometry
    centroid = mou_geometry.centroid
    region_key = mou['region_key']

    mou_dict = {}

    # -------------------------
    # s15: depth < 15m
    # -------------------------
    wells_15 = td[(td['region_key'] == region_key) & (td['Depth'] < 15)].copy()
    wells_15['depth_range'] = '<15'
    wells_15['radius'] = '0km'

    if len(wells_15) < 7:
        extra = td[(td['region_key'] == region_key) & (td['Depth'] < 45)].copy()
        extra['depth_range'] = '<45'
        extra['radius'] = '0km'
        wells_15 = pd.concat([wells_15, extra]).drop_duplicates()

    if len(wells_15) < 7:
        nearby_mouzas = find_regions_within_radius(10000, gd, centroid)
        nearby_keys = nearby_mouzas['region_key'].tolist()
        nearby_wells = td[(td['region_key'].isin(nearby_keys)) & (td['Depth'] < 45)].copy()
        nearby_wells['depth_range'] = '<45'
        nearby_wells['radius'] = '10km'
        wells_15 = pd.concat([wells_15, nearby_wells]).drop_duplicates()

    arsenic_15 = wells_15['Arsenic'].dropna()
    wells_15_valid = wells_15.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_15.empty:
        p1, p25, p50, p75, p9, p95 = np.percentile(arsenic_15, [10, 25, 50, 75, 90, 95])
        max = arsenic_15.max()

        mou_dict["s15"] = {
            "m": p50,
            "m2": p25,
            "m7": p75,
            "m9": p95,
            "l": p1,
            "u": p9,
            "max": arsenic_15.max(),
        }

    # -------------------------
    # s45: 15m <= depth < 45m
    # -------------------------
    wells_45 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 15) & (td['Depth'] < 45)
    ].copy()
    wells_45['depth_range'] = '15-45'
    wells_45['radius'] = '0km'

    if len(wells_45) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 15) & (td['Depth'] < 65)
        ].copy()
        extra['depth_range'] = '15-65'
        extra['radius'] = '0km'
        wells_45 = pd.concat([wells_45, extra]).drop_duplicates()

    if len(wells_45) < 7:
        nearby_mouzas_10k = find_regions_within_radius(10000, gd, centroid)
        nearby_keys_10k = nearby_mouzas_10k['region_key'].tolist()
        nearby_wells_10k = td[
            (td['region_key'].isin(nearby_keys_10k)) &
            (td['Depth'] >= 15) & (td['Depth'] < 45)
        ].copy()
        nearby_wells_10k['depth_range'] = '15-45'
        nearby_wells_10k['radius'] = '10km'
        wells_45 = pd.concat([wells_45, nearby_wells_10k]).drop_duplicates()

    if len(wells_45) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()
        nearby_wells_20k = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 15) & (td['Depth'] < 65)
        ].copy()
        nearby_wells_20k['depth_range'] = '15-65'
        nearby_wells_20k['radius'] = '20km'
        wells_45 = pd.concat([wells_45, nearby_wells_20k]).drop_duplicates()

    arsenic_45 = wells_45['Arsenic'].dropna()
    wells_45_valid = wells_45.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_45.empty:
        p1, p50, p9 = np.percentile(arsenic_45, [10, 50, 90])

        mou_dict["s45"] = {
            "m": p50,
            "l": p1,
            "u": p9,
            "max": arsenic_45.max(),
        }

    # -------------------------
    # s65: 45m <= depth < 65m
    # -------------------------
    wells_65 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 45) & (td['Depth'] < 65)
    ].copy()
    wells_65['depth_range'] = '45-65'
    wells_65['radius'] = '0km'

    if len(wells_65) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 45) & (td['Depth'] < 90)
        ].copy()
        extra['depth_range'] = '45-90'
        extra['radius'] = '0km'
        wells_65 = pd.concat([wells_65, extra]).drop_duplicates()

    if len(wells_65) < 7:
        nearby_mouzas_10k = find_regions_within_radius(10000, gd, centroid)
        nearby_keys_10k = nearby_mouzas_10k['region_key'].tolist()
        nearby_wells_10k = td[
            (td['region_key'].isin(nearby_keys_10k)) &
            (td['Depth'] >= 45) & (td['Depth'] < 65)
        ].copy()
        nearby_wells_10k['depth_range'] = '45-65'
        nearby_wells_10k['radius'] = '10km'
        wells_65 = pd.concat([wells_65, nearby_wells_10k]).drop_duplicates()

    if len(wells_65) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()
        nearby_wells_20k = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 45) & (td['Depth'] < 90)
        ].copy()
        nearby_wells_20k['depth_range'] = '45-90'
        nearby_wells_20k['radius'] = '20km'
        wells_65 = pd.concat([wells_65, nearby_wells_20k]).drop_duplicates()

    arsenic_65 = wells_65['Arsenic'].dropna()
    wells_65_valid = wells_65.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_65.empty:
        p1, p50, p9 = np.percentile(arsenic_65, [10, 50, 90])

        mou_dict["s65"] = {
            "m": p50,
            "l": p1,
            "u": p9,
            "max": arsenic_65.max(),
        }

    # -------------------------
    # s90: 65m <= depth < 90m
    # -------------------------
    wells_90 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 65) & (td['Depth'] < 90)
    ].copy()
    wells_90['depth_range'] = '65-90'
    wells_90['radius'] = '0km'

    if len(wells_90) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 65) & (td['Depth'] < 150)
        ].copy()
        extra['depth_range'] = '65-150'
        extra['radius'] = '0km'
        wells_90 = pd.concat([wells_90, extra]).drop_duplicates()

    if len(wells_90) < 7:
        nearby_mouzas_20k = find_regions_within_radius(20000, gd, centroid)
        nearby_keys_20k = nearby_mouzas_20k['region_key'].tolist()

        nearby_wells_90 = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 65) & (td['Depth'] < 90)
        ].copy()
        nearby_wells_90['depth_range'] = '65-90'
        nearby_wells_90['radius'] = '20km'
        wells_90 = pd.concat([wells_90, nearby_wells_90]).drop_duplicates()

    if len(wells_90) < 7:
        nearby_wells_150 = td[
            (td['region_key'].isin(nearby_keys_20k)) &
            (td['Depth'] >= 65) & (td['Depth'] < 150)
        ].copy()
        nearby_wells_150['depth_range'] = '65-150'
        nearby_wells_150['radius'] = '20km'
        wells_90 = pd.concat([wells_90, nearby_wells_150]).drop_duplicates()

    arsenic_90 = wells_90['Arsenic'].dropna()
    wells_90_valid = wells_90.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_90.empty:
        p25, p50, p75 = np.percentile(arsenic_90, [10, 50, 90])
        mou_dict["s90"] = {
            "m": p50,
            "l": p1,
            "u": p9,
            "max": arsenic_90.max(),
        }

    # -------------------------
    # s150: depth 90–150+ meters
    # -------------------------
    wells_150 = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 90) & (td['Depth'] < 150)
    ].copy()
    wells_150['depth_range'] = '90-150'
    wells_150['radius'] = '0km'

    if len(wells_150) < 7:
        extra = td[
            (td['region_key'] == region_key) &
            (td['Depth'] >= 90)
        ].copy()
        extra['depth_range'] = '90+'
        extra['radius'] = '0km'
        wells_150 = pd.concat([wells_150, extra]).drop_duplicates()

    if len(wells_150) < 7:
        nearby_mouzas_100k = find_regions_within_radius(100000, gd, centroid)
        nearby_keys_100k = nearby_mouzas_100k['region_key'].tolist()
        nearby_wells_100k = td[
            (td['region_key'].isin(nearby_keys_100k)) &
            (td['Depth'] >= 90)
        ].copy()
        nearby_wells_100k['depth_range'] = '90+'
        nearby_wells_100k['radius'] = '100km'
        wells_150 = pd.concat([wells_150, nearby_wells_100k]).drop_duplicates()

    arsenic_150 = wells_150['Arsenic'].dropna()
    wells_150_valid = wells_150.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_150.empty:
        p1, p50, p9 = np.percentile(arsenic_150, [10, 50, 90])
        mou_dict["s150"] = {
            "m": p50,
            "l": p1,
            "u": p9,
            "max": arsenic_150.max(),
        }

    # -------------------------
    # sD: depth >= 150m
    # -------------------------
    wells_d = td[
        (td['region_key'] == region_key) &
        (td['Depth'] >= 150)
    ].copy()
    wells_d['depth_range'] = '150+'
    wells_d['radius'] = '0km'

    if len(wells_d) < 7:
        nearby_mouzas_100k = find_regions_within_radius(100000, gd, centroid)
        nearby_keys_100k = nearby_mouzas_100k['region_key'].tolist()

        nearby_wells_d = td[
            (td['region_key'].isin(nearby_keys_100k)) &
            (td['Depth'] >= 150)
        ].copy()
        nearby_wells_d['depth_range'] = '150+'
        nearby_wells_d['radius'] = '100km'
        wells_d = pd.concat([wells_d, nearby_wells_d]).drop_duplicates()

    arsenic_d = wells_d['Arsenic'].dropna()
    wells_d_valid = wells_d.dropna(subset=['Depth', 'Arsenic'])

    if not arsenic_d.empty:
        p1, p50, p9 = np.percentile(arsenic_d, [10, 50, 90])
        mou_dict["sD"] = {
            "m": p50,
            "l": p1,
            "u": p9,
            "max": arsenic_d.max(),
        }

    try:
        with open(f'model/{filename}', 'w') as f:
            json.dump(mou_dict, f, separators=(',', ':'))
    except Exception as e:
        error_path = 'logs/generate_prediction_data/errors.txt'
        with open(error_path, 'a') as err_file:
            err_file.write(f"ERROR writing {filename}\n")
            err_file.write(f"{e}\n")
            err_file.write(json.dumps(mou_dict, separators=(',', ':')) + '\n\n')


def run_prediction_jobs(region_tree, gd, td, gd_in_td):
    total_divisions = len(region_tree)
    jobs = []

    for idx_div, div_obj in enumerate(region_tree, start=1):
        div = div_obj['division']
        districts = div_obj['districts']
        print(f"Processing Division {idx_div}/{total_divisions}: {div} (Total Districts: {len(districts)})")

        for idx_dis, dis_obj in enumerate(districts, start=1):
            dis = dis_obj['district']
            upazilas = dis_obj['upazilas']
            print(f"  Processing District {idx_dis}/{len(districts)}: {dis} (Total Upazilas: {len(upazilas)})")

            for idx_upa, upa_obj in enumerate(upazilas, start=1):
                upa = upa_obj['upazila']
                unions = upa_obj['unions']
                print(f"    Processing Upazila {idx_upa}/{len(upazilas)}: {upa} (Total Unions: {len(unions)})")

                for idx_uni, uni_obj in enumerate(unions, start=1):
                    uni = uni_obj['union']
                    mouzas = uni_obj['mouzas']
                    print(f"      Processing Union {idx_uni}/{len(unions)}: {uni} (Total Mouzas: {len(mouzas)})")

                    for idx_mou, mou in enumerate(mouzas, start=1):
                        gm_mou = gd[
                            (gd['div'] == div) &
                            (gd['dis'] == dis) &
                            (gd['upa'] == upa) &
                            (gd['uni'] == uni) &
                            (gd['mou'] == mou)
                        ].iloc[0]

                        jobs.append((
                            gm_mou,
                            gd_in_td,
                            td,
                        ))

    print('--------------------------------')
    print('Starting multiprocessing')
    print(f'Total jobs: {len(jobs)}')

    with mp.Pool(processes=MAX_WORKERS) as pool:
        for result in pool.imap_unordered(process_mouza, jobs):
            pass

def generate_prediction_data(dropdown_data, mou_topo, training_data):
    if mou_topo.crs is None:
        mou_topo.set_crs(epsg=4326, inplace=True)

    geodata = mou_topo.to_crs(epsg=32645)

    geodata['region_key'] = geodata['div'] + geodata['dis'] + geodata['upa'] + geodata['uni'] + geodata['mou']
    training_data['region_key'] = training_data['Division'] + training_data['District'] + training_data['Upazila'] + training_data['Union'] + training_data['Mouza']

    geodata_in_training_data = geodata[geodata['region_key'].isin(training_data['region_key'])]

    attributed_region_tree = run_prediction_jobs(
        dropdown_data,
        geodata,
        training_data,
        geodata_in_training_data,
    )
