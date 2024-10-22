import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon, MultiPolygon
import topojson as tp
import json


def intersect_geometries_within_hierarchy(upper_gdf, lower_gdf):
    """
    For each geometry in the upper-level GeoDataFrame, get all geometries
    from the lower-level GeoDataFrame that are entirely or partially within it.

    Then, perform a spatial intersection to get the portions of lower-level
    geometries that intersect with the upper-level boundaries.

    Parameters:
    - upper_gdf: GeoDataFrame of the higher-level regions (e.g., divisions).
    - lower_gdf: GeoDataFrame of the lower-level regions (e.g., districts).

    Returns:
    - A GeoDataFrame of intersected lower-level geometries containing only
      Polygon or MultiPolygon geometries.
    """
    intersected_geometries = []

    # Iterate over each upper-level geometry
    for upper_row in upper_gdf.itertuples():
        print(f'Processing {upper_row.Index + 1} / {len(upper_gdf)}')
        upper_geom = upper_row.geometry

        # Find lower-level geometries that intersect the upper geometry
        lower_geoms_within = lower_gdf[
            lower_gdf.geometry.intersects(upper_geom)
        ]

        # Iterate over the lower-level geometries
        for lower_row in lower_geoms_within.itertuples():
            lower_geom = lower_row.geometry

            if upper_geom.intersects(lower_geom):
                # Perform intersection and keep only the part that falls within
                # the upper-level boundary
                intersection = lower_geom.intersection(upper_geom)

                if not intersection.is_empty:
                    # Only keep Polygon and MultiPolygon types
                    if isinstance(intersection, Polygon):
                        # Convert Polygon to MultiPolygon
                        intersection = MultiPolygon([intersection])
                    elif isinstance(intersection, MultiPolygon):
                        pass
                    else:
                        # Skip non-polygon geometries (LineString, Point, etc.)
                        continue

                    # Append the valid geometry to the list
                    new_geom = lower_row._asdict()
                    new_geom['geometry'] = intersection

                    intersected_geometries.append(
                        new_geom
                    )

    # Create a new GeoDataFrame for the intersected geometries and ensure CRS is set
    intersected_gdf = gpd.GeoDataFrame(intersected_geometries, crs=upper_gdf.crs)

    return intersected_gdf


def get_region_from_parent(child_gdf, parent_gdf, buffer_distance=0):
    """
    For each child geometry, find the parent geometry in the parent_gdf that has the
    highest overlap (largest intersection area) and assign the parent's properties to the child.

    Parameters:
    - child_gdf: GeoDataFrame of child regions (e.g., districts).
    - parent_gdf: GeoDataFrame of parent regions (e.g., divisions).

    Returns:
    - Updated child_gdf with the parent's properties added.
    """
    for child_idx, child_row in child_gdf.iterrows():
        if child_idx % 100 == 0:
            print(f'Processing {child_idx + 1} / {len(child_gdf)}')
        child_geom = child_row.geometry

        # Find parent geometries that intersect the child geometry
        possible_parents = parent_gdf[parent_gdf.geometry.intersects(child_geom)].copy()

        if not possible_parents.empty:
            # Calculate the intersection area for each parent
            possible_parents['intersection_area'] = possible_parents.apply(
                lambda row: row.geometry.intersection(child_geom).area, axis=1
            )

            # Find the parent with the largest intersection area
            best_parent = possible_parents.loc[possible_parents['intersection_area'].idxmax()]

            # Assign the properties of the best parent to the child, using .loc[] to avoid SettingWithCopyWarning
            for key, value in best_parent.items():
                if key in ['div', 'dis', 'upa', 'uni']:
                    child_gdf.loc[child_idx, key] = value
        else:
            print(f"No intersecting parent found for child region at index {child_idx}")

    return child_gdf


def get_null_names_from_parent(mouzas):
    mouzas_copy = mouzas.copy()

    for mou_idx, mou_row in mouzas_copy.iterrows():
        if mou_idx % 500 == 0:
            print(f'Processing {mou_idx + 1} / {len(mouzas)}')

        if pd.isnull(mou_row['mou']):
            mouzas_copy.loc[mou_idx, 'mou'] = mou_row['uni']

    return mouzas_copy


def add_region_key(gdf):
    gdf_copy = gdf.copy()

    if 'dis' not in gdf_copy.columns:
        gdf_copy['region_key'] = gdf_copy['div']
        return gdf_copy

    if 'upa' not in gdf_copy.columns:
        gdf_copy['region_key'] = gdf_copy['div'] + '@' + gdf_copy['dis']
        return gdf_copy

    if 'uni' not in gdf_copy.columns:
        gdf_copy['region_key'] = gdf_copy['div'] + '@' + gdf_copy['dis'] + '@' + gdf_copy['upa']
        return gdf_copy

    if 'mou' not in gdf_copy.columns:
        gdf_copy['region_key'] = gdf_copy['div'] + '@' + gdf_copy['dis'] + '@' + gdf_copy['upa'] + '@' + gdf_copy['uni']
        return gdf_copy

    if 'mou' in gdf_copy.columns:
        gdf_copy['region_key'] = gdf_copy['div'] + '@' + gdf_copy['dis'] + '@' + gdf_copy['upa'] + '@' + gdf_copy['uni'] + '@' + gdf_copy['mou']
        return gdf_copy


def print_duplicate_region_keys(gdf, region_name):
    # Find duplicate keys
    duplicate_keys = gdf[gdf.duplicated(subset='region_key', keep=False)]
    key_counts = duplicate_keys['region_key'].value_counts()
    duplicate_key_list = key_counts[key_counts > 1]
    sorted_duplicate_keys = duplicate_key_list.sort_values(ascending=False)

    print(f"\n{region_name} - Duplicate 'region_key' values sorted by frequency:")

    if sorted_duplicate_keys.empty:
        print("No duplicate keys found.")
        return gdf  # Return original GeoDataFrame if no duplicates found

    # Log duplicate keys to a CSV file
    sorted_duplicate_keys.to_csv(f'duplicate_{region_name.lower()}_region_keys.csv')

    # Group by 'region_key' and merge geometries for duplicate keys
    gdf = gdf.dissolve(by='region_key', as_index=False, aggfunc='first')

    return gdf


def merge_duplicate_region_keys(gdf, region_name):
    # Find duplicate keys
    duplicate_keys = gdf[gdf.duplicated(subset='region_key', keep=False)]
    key_counts = duplicate_keys['region_key'].value_counts()
    duplicate_key_list = key_counts[key_counts > 1]
    sorted_duplicate_keys = duplicate_key_list.sort_values(ascending=False)

    print(f"\n{region_name} - Duplicate 'region_key' values sorted by frequency:")

    if sorted_duplicate_keys.empty:
        print("No duplicate keys found.")
        return gdf  # Return original GeoDataFrame if no duplicates found

    # Log duplicate keys to a CSV file
    sorted_duplicate_keys.to_csv(f'duplicate_{region_name.lower()}_region_keys.csv')

    # Group by 'region_key' and merge geometries for duplicate keys
    gdf = gdf.dissolve(by='region_key', as_index=False, aggfunc='first')

    return gdf


def generate_region_tree(mouzas):
    region_tree = {}

    for div in mouzas['div'].unique():
        div_mouzas = mouzas[mouzas['div'] == div]
        div_tree = {}

        for dis in div_mouzas['dis'].unique():
            dis_mouzas = div_mouzas[div_mouzas['dis'] == dis]
            dis_tree = {}

            for upa in dis_mouzas['upa'].unique():
                upa_mouzas = dis_mouzas[dis_mouzas['upa'] == upa]
                upa_tree = {}

                for uni in upa_mouzas['uni'].unique():
                    uni_mouzas = upa_mouzas[upa_mouzas['uni'] == uni]
                    uni_tree = uni_mouzas['mou'].unique().tolist()

                    upa_tree[uni] = uni_tree

                dis_tree[upa] = upa_tree

            div_tree[dis] = dis_tree

        region_tree[div] = div_tree

    return region_tree


def main():
    divisions = gpd.read_file('../../preprocessing/geodata/maps/dist/div/div-c005-s020-vw-pr.geojson')
    districts = gpd.read_file('../../preprocessing/geodata/maps/dist/dis/dis-c005-s020-vw-pr.geojson')
    upazilas = gpd.read_file('../../preprocessing/geodata/maps/dist/upa/upa-c005-s020-vw-pr.geojson')
    unions = gpd.read_file('../../preprocessing/geodata/maps/dist/uni/uni-c005-s020-vw-pr.geojson')
    # mouzas = gpd.read_file('../../preprocessing/geodata/maps/dist/mou/mou-c005-s020-vw-pr.geojson')

    dis = intersect_geometries_within_hierarchy(divisions, districts)
    upa = intersect_geometries_within_hierarchy(districts, upazilas)
    uni = intersect_geometries_within_hierarchy(upazilas, unions)
    # mou = intersect_geometries_within_hierarchy(unions, mouzas)

    dis = dis[dis.is_valid]
    upa = upa[upa.is_valid]
    uni = uni[uni.is_valid]
    # mou = mou[mou.is_valid]

    dis = get_region_from_parent(dis, divisions)
    upa = get_region_from_parent(upa, dis)
    uni = get_region_from_parent(uni, upa)
    # mou = get_region_from_parent(mou, uni)

    # mou = get_null_names_from_parent(mou)

    dis = add_region_key(dis)
    upa = add_region_key(upa)
    uni = add_region_key(uni)
    # mou = add_region_key(mou)

    dis = merge_duplicate_region_keys(dis, "Districts")
    upa = merge_duplicate_region_keys(upa, "Upazilas")
    uni = merge_duplicate_region_keys(uni, "Unions")
    # mou = merge_duplicate_region_keys(mou, "Mouzas")

    print_duplicate_region_keys(dis, "Districts")
    print_duplicate_region_keys(upa, "Upazilas")
    print_duplicate_region_keys(uni, "Unions")
    # print_duplicate_region_keys(mou, "Mouzas")

    dis.to_file('output/intersected_districts.geojson', driver='GeoJSON')
    upa.to_file('output/intersected_upazilas.geojson', driver='GeoJSON')
    uni.to_file('output/intersected_unions.geojson', driver='GeoJSON')
    # mou.to_file('output/intersected_mouzas.geojson', driver='GeoJSON')

    dis = gpd.read_file('output/intersected_districts.geojson')
    dis_topo = json.loads(
        tp.Topology(dis).to_json()
    )

    with open('output/intersected_districts.topojson', 'w') as f:
        json.dump(dis_topo, f)

    upa = gpd.read_file('output/intersected_upazilas.geojson')
    upa_topo = json.loads(
        tp.Topology(upa).to_json()
    )

    with open('output/intersected_upazilas.topojson', 'w') as f:
        json.dump(upa_topo, f)

    uni = gpd.read_file('output/intersected_unions.geojson')
    uni_topo = json.loads(
        tp.Topology(uni).to_json()
    )

    with open('output/intersected_unions.topojson', 'w') as f:
        json.dump(uni_topo, f)

    mou = gpd.read_file('output/intersected_mouzas.geojson')

    region_tree = generate_region_tree(mou)

    with open('output/region_tree.json', 'w') as f:
        json.dump(region_tree, f)

    # mou_topo = json.loads(
    #     tp.Topology(mou).to_json()
    # )

    # with open('output/intersected_mouzas.topojson', 'w') as f:
    #     json.dump(mou_topo, f)


if __name__ == '__main__':
    main()
