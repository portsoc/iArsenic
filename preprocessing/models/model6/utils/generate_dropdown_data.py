import geopandas as gpd
import json

def generate_dropdown_data(mouzas):
    divisions = []

    for div in sorted(mouzas['div'].unique()):
        div_mouzas = mouzas[mouzas['div'] == div]
        districts = []

        for dis in sorted(div_mouzas['dis'].unique()):
            dis_mouzas = div_mouzas[div_mouzas['dis'] == dis]
            upazilas = []

            for upa in sorted(dis_mouzas['upa'].unique()):
                upa_mouzas = dis_mouzas[dis_mouzas['upa'] == upa]
                unions = []

                for uni in sorted(upa_mouzas['uni'].unique()):
                    uni_mouzas = upa_mouzas[upa_mouzas['uni'] == uni]
                    mouzas_list = sorted(uni_mouzas['mou'].unique().tolist())

                    unions.append({
                        "union": uni,
                        "mouzas": mouzas_list
                    })

                upazilas.append({
                    "upazila": upa,
                    "unions": unions
                })

            districts.append({
                "district": dis,
                "upazilas": upazilas
            })

        divisions.append({
            "division": div,
            "districts": districts
        })

    # Optional: save to file
    with open('output/dropdown-data.json', 'w') as f:
        json.dump(divisions, f, indent=2)

    return divisions
