import json
import geopandas as gpd
import pandas as pd
import os
import concurrent.futures
import multiprocessing as mp
from utils.load_training_df import load_training_data_df
from utils.load_region_tree import load_region_tree
from utils.find_regions_within_radius import find_regions_within_radius

MAX_WORKERS = mp.cpu_count()

def extract_wells(mouzas, td):
    wells = []

    for idx, mouza in mouzas.iterrows():
        wells_in_mouza = td[td['Division'] == mouza['div']]
        wells_in_mouza = wells_in_mouza[wells_in_mouza['District'] == mouza['dis']]
        wells_in_mouza = wells_in_mouza[wells_in_mouza['Upazila'] == mouza['upa']]
        wells_in_mouza = wells_in_mouza[wells_in_mouza['Union'] == mouza['uni']]
        wells_in_mouza = wells_in_mouza[wells_in_mouza['Mouza'] == mouza['mou']]

        if not wells_in_mouza.empty:
            wells.extend(wells_in_mouza[['Depth', 'Arsenic']].to_dict('records'))

    return wells

def process_mouza(args):
    mou, gd, td = args
    filename = f"{mou['div']}-{mou['dis']}-{mou['upa']}-{mou['uni']}-{mou['mou']}.json"

    if os.path.exists(f'model/{filename}'):
        return

    mou_geometry = mou.geometry
    centroid = mou_geometry.centroid

    mouzas_within_5k = find_regions_within_radius(5000, gd, centroid)
    mouzas_within_10k = find_regions_within_radius(10000, gd, centroid)
    mouzas_within_20k = find_regions_within_radius(20000, gd, centroid)
    mouzas_within_100k = find_regions_within_radius(100000, gd, centroid)

    mou_dict = {}

    mou_dict['wells_within_5km'] = extract_wells(
        mouzas_within_5k,
        td,
    )
    mou_dict['wells_within_10km'] = extract_wells(
        mouzas_within_10k,
        td,
    )
    mou_dict['wells_within_20km'] = extract_wells(
        mouzas_within_20k,
        td,
    )
    mou_dict['wells_within_100km'] = extract_wells(
        mouzas_within_100k,
        td,
    )

    with open(f'model/{filename}', 'w') as f:
        json.dump(mou_dict, f)

def attribute_region_tree(region_tree, gd, td, gd_in_td):
    total_divisions = len(region_tree)
    jobs = []

    for idx_div, div in enumerate(region_tree, start=1):
        div_dict = region_tree[div]
        num_districts = len(div_dict['districts'])
        print(f"Processing Division {idx_div}/{total_divisions}: {div} (Total Districts: {num_districts})")

        for idx_dis, dis in enumerate(div_dict['districts'], start=1):
            dis_dict = div_dict['districts'][dis]
            num_upazilas = len(dis_dict['upazilas'])
            print(f"  Processing District {idx_dis}/{num_districts}: {dis} (Total Upazilas: {num_upazilas})")

            for idx_upa, upa in enumerate(dis_dict['upazilas'], start=1):
                upa_dict = dis_dict['upazilas'][upa]
                num_unions = len(upa_dict['unions'])
                print(f"    Processing Upazila {idx_upa}/{num_upazilas}: {upa} (Total Unions: {num_unions})")

                for idx_uni, uni in enumerate(upa_dict['unions'], start=1):
                    uni_dict = upa_dict['unions'][uni]
                    num_mouzas = len(uni_dict['mouzas'])
                    print(f"      Processing Union {idx_uni}/{num_unions}: {uni} (Total Mouzas: {num_mouzas})")

                    for idx_mou, mou in enumerate(uni_dict['mouzas'], start=1):
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

    return region_tree


def main():
    region_tree = load_region_tree('output/region_tree.json')
    geodata = gpd.read_file('output/intersected_mouzas.topojson')

    if geodata.crs is None:
        geodata.set_crs(epsg=4326, inplace=True)

    geodata = geodata.to_crs(epsg=32645)
    training_data = load_training_data_df('training-data.json')

    geodata['region_key'] = geodata['div'] + geodata['dis'] + geodata['upa'] + geodata['uni'] + geodata['mou']
    training_data['region_key'] = training_data['Division'] + training_data['District'] + training_data['Upazila'] + training_data['Union'] + training_data['Mouza']

    geodata_in_training_data = geodata[geodata['region_key'].isin(training_data['region_key'])]

    attributed_region_tree = attribute_region_tree(
        region_tree,
        geodata,
        training_data,
        geodata_in_training_data,
    )
    with open('attributed_region_tree.json', 'w') as f:
        json.dump(attributed_region_tree, f)

if __name__ == '__main__':
    main()
