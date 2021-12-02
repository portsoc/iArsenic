/*
 * This script computes the nearby regions for each region.
 * It adds them as an array in the object representing a region.
 */

const { getLookupCentroids, getCentroidsIterator } = require('../geodata/centroids');
const d3 = require('d3');
const RADIUS = 6378.137;

function computeNearbyRegions(locationArr, maxDistance = 100) {
  const centroids = getLookupCentroids();

  const region = centroids[locationArr[0]?.name]
    ?.subRegions[locationArr[1]?.name]
    ?.subRegions[locationArr[2]?.name]
    ?.subRegions[locationArr[3]?.name]
    ?.subRegions[locationArr[4]?.name];

  if (!region) {
    // we don't have a centroid for the region identified by locationArr
    locationArr[4].nearbyRegions = [];
    return;
  }

  region.nearbyRegions = [];
  region.divisionsObj.nearbyRegions = region.nearbyRegions;

  const centroidsArray = getCentroidsIterator();
  for (let i = 0; i < centroidsArray.length; i++) {
    const distance = d3.geoDistance(region.centroid, centroidsArray[i].centroid) * RADIUS;

    if (distance > maxDistance) continue;

    region.nearbyRegions.push({
      distance: distance,
      region: centroidsArray[i].divisionsObj,
    });
  }

  region.nearbyRegions.sort((a, b) => a.distance - b.distance);
}

function cleanNearbyRegions(locationArr) {
  const centroids = getLookupCentroids();

  const region = centroids[locationArr[0]?.name]
    ?.subRegions[locationArr[1]?.name]
    ?.subRegions[locationArr[2]?.name]
    ?.subRegions[locationArr[3]?.name]
    ?.subRegions[locationArr[4]?.name];

  delete region.nearbyRegions;
  delete region.divisionsObj.nearbyRegions;
}

module.exports = {
  computeNearbyRegions,
  cleanNearbyRegions,
};
