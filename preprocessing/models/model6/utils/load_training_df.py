import pandas as pd

def load_training_data_df(data):
    csv_arr = []

    for div in data:
        div_dict = data[div]
        for dis in div_dict['districts']:
            dis_dict = div_dict['districts'][dis]
            for upa in dis_dict['upazilas']:
                upa_dict = dis_dict['upazilas'][upa]
                for uni in upa_dict['unions']:
                    uni_dict = upa_dict['unions'][uni]
                    for mou in uni_dict['mouzas']:
                        mou_dict = uni_dict['mouzas'][mou]
                        for well in mou_dict['wells']:
                            csv_arr.append([
                                div,
                                dis,
                                upa,
                                uni,
                                mou,
                                well['depth'],
                                well['arsenic'],
                            ])

    return pd.DataFrame(
        csv_arr,
        columns=[
            'Division',
            'District',
            'Upazila',
            'Union',
            'Mouza',
            'Depth',
            'Arsenic',
        ],
    )