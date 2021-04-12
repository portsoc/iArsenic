/*
 * This script computes the nearby regions for each region.
 * It adds them as an array in the object representing a region.
 */

import { BasicDataSet, GeoRegion, Region } from './types';

import { computeCentroids } from '../geodata/centroids';
import * as d3 from 'd3';
const RADIUS = 6378.137;

export async function computeNearbyRegions(divisions: BasicDataSet<Region>): Promise<BasicDataSet<Region>> {
  const centroids = await computeCentroids() as GeoRegion[];

  for (const region of centroids) {
    region.nearbyRegions = [];
    region.divisionsObj = divisions[region.div].districts[region.dis].upazilas[region.upa].unions[region.uni];
    region.divisionsObj.nearbyRegions = region.nearbyRegions;
  }

  for (let i = 0; i < centroids.length; i++) {
    for (let j = i + 1; j < centroids.length; j++) {
      const distance = d3.geoDistance(centroids[i].centroid, centroids[j].centroid) * RADIUS;

      centroids[i].nearbyRegions.push({
        distance: distance,
        region: centroids[j].divisionsObj,
      });

      centroids[j].nearbyRegions.push({
        distance: distance,
        region: centroids[i].divisionsObj,
      });
    }
  }

  for (const region of centroids) {
    region.nearbyRegions.sort((a, b) => a.distance - b.distance);
  }

  return divisions;
}

// test
// computeNearbyRegions(require('./load-data')());
