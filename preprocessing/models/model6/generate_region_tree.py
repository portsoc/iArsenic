import geopandas as gpd
import json


def generate_region_tree(mouzas):
    region_tree = {}

    for div in mouzas['div'].unique():
        div_mouzas = mouzas[mouzas['div'] == div]
        div_tree = {
            'wells': [],
            'districts': {}
        }

        for dis in div_mouzas['dis'].unique():
            dis_mouzas = div_mouzas[div_mouzas['dis'] == dis]
            dis_tree = {
                'wells': [],
                'upazilas': {}
            }

            for upa in dis_mouzas['upa'].unique():
                upa_mouzas = dis_mouzas[dis_mouzas['upa'] == upa]
                upa_tree = {
                    'wells': [],
                    'unions': {}
                }

                for uni in upa_mouzas['uni'].unique():
                    uni_mouzas = upa_mouzas[upa_mouzas['uni'] == uni]
                    uni_tree = {
                        'wells': [],
                        'mouzas': {}
                    }

                    for mou in uni_mouzas['mou'].unique():
                        mouza_tree = {
                            'wells': [],
                            'wells_within_5km': [],
                            'wells_within_10km': [],
                            'wells_within_20km': [],
                            'wells_within_100km': [],
                        }

                        uni_tree['mouzas'][mou] = mouza_tree

                    upa_tree['unions'][uni] = uni_tree
                dis_tree['upazilas'][upa] = upa_tree
            div_tree['districts'][dis] = dis_tree
        region_tree[div] = div_tree

    return region_tree


def main():
    mouzas = gpd.read_file('output/intersected_mouzas.topojson')
    region_tree = generate_region_tree(mouzas)

    with open('output/region_tree.json', 'w') as f:
        json.dump(region_tree, f)


if __name__ == '__main__':
    main()
