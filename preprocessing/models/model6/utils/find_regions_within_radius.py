import geopandas as gpd

def find_regions_within_radius(distance, gd, centroid):
    centroid_gdf = gpd.GeoDataFrame(
        {'geometry': [centroid]},
        crs=gd.crs
    )

    return gpd.sjoin_nearest(
        gd,
        centroid_gdf,
        max_distance=distance,
    )
