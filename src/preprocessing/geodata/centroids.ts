// computes the center of a region
// used in preprocessing/lib/geo-data.js to compute the nearby regions.

import * as d3 from 'd3';
import * as topojson from 'topojson';
import { FeatureCollection, GeometryObject, GeoJsonProperties } from 'geojson';
import { correctRegionName } from '../lib/name-corrections';
import { Centroid } from '../lib/types';
import type { Topology } from 'topojson-specification';
const ADMINISTRATIVE_LEVEL = 'uni';

export async function computeCentroids(): Promise<Centroid[]> {
  const map = ((
    await import(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`)
  ) as {default: Topology}).default;
  const topo: FeatureCollection = topojson.feature(map, map.objects.map) as FeatureCollection<GeometryObject, GeoJsonProperties>;

  const geoList: Centroid[] = [];

  for (const selectedRegion of topo.features) {
    const props = selectedRegion.properties;
    if (props == null) break;
    const correctName = correctRegionName([props.div, props.dis, props.upa, props.uni]);
    if (correctName == null) break;

    const geoObj: Centroid = {
      div: correctName[0],
      dis: correctName[1],
      upa: correctName[2],
      uni: correctName[3],
      centroid: d3.geoCentroid(selectedRegion),
    };

    geoList.push(geoObj);
  }

  return geoList;
}

export default computeCentroids;
