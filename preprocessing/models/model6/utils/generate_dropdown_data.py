import geopandas as gpd
import json


def generate_dropdown_data(mou_topo):
    region_tree = {}

    for div in mouzas['div'].unique():
        div_mouzas = mouzas[mouzas['div'] == div]
        div_tree = { 'districts': {} }

        for dis in div_mouzas['dis'].unique():
            dis_mouzas = div_mouzas[div_mouzas['dis'] == dis]
            dis_tree = { 'upazilas': {} }

            for upa in dis_mouzas['upa'].unique():
                upa_mouzas = dis_mouzas[dis_mouzas['upa'] == upa]
                upa_tree = { 'unions': {} }

                for uni in upa_mouzas['uni'].unique():
                    uni_mouzas = upa_mouzas[upa_mouzas['uni'] == uni]
                    uni_tree = { 'mouzas': {} }

                    uni_tree['mouzas'] = uni_mouzas['mou'].unique().tolist()
                    upa_tree['unions'][uni] = uni_tree
                dis_tree['upazilas'][upa] = upa_tree
            div_tree['districts'][dis] = dis_tree
        region_tree[div] = div_tree

    return region_tree

    with open('output/dropdown-data.json', 'w') as f:
        json.dump(region_tree, f)

    return dropdown_data
