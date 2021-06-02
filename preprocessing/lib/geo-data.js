const { getLookupCentroids, getCentroidsIterator } = require('../geodata/centroids');
const d3 = require('d3');
const RADIUS = 6378.137;

function computeNearbyRegions(locationArr) {
  const centroids = getLookupCentroids();

  let region;
  try {
    region = centroids[locationArr[0].name].subRegions[locationArr[1].name].subRegions[locationArr[2].name].subRegions[locationArr[3].name].subRegions[locationArr[4].name];
  } catch (e) {
    locationArr[4].nearbyRegions = [];
    return;
  }

  if (region === undefined) {
    locationArr[4].nearbyRegions = [];
    return;
  }
  region.nearbyRegions = [];
  // region.divisionsObj = locationArr[4];
  region.divisionsObj.nearbyRegions = region.nearbyRegions;

  const centroidsArray = getCentroidsIterator();
  for (let i = 0; i < centroidsArray.length; i++) {
    if (centroids.divisionsObj === undefined) continue;

    const distance = d3.geoDistance(region.centroid, centroidsArray[i].centroid) * RADIUS;

    if (distance > 100) continue;

    region.nearbyRegions.push({
      distance: distance,
      region: centroidsArray[i].divisionsObj,
    });
  }

  region.nearbyRegions.sort((a, b) => a.distance - b.distance);
}

// test
// computeNearbyRegions(require('./load-data')());

module.exports = {
  computeNearbyRegions,
};
