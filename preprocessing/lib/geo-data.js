const { computeCentroids } = require('../geodata/centroids');
const d3 = require('d3');
const RADIUS = 6378.137;

function computeNearbyAreas(divisions) {
  const centroids = computeCentroids();

  for (const area of centroids) {
    area.nearbyAreas = [];
    area.divisionsObj = divisions[area.div].districts[area.dis].upazilas[area.upa].unions[area.uni];
    area.divisionsObj.nearbyAreas = area.nearbyAreas;
  }

  for (let i = 0; i < centroids.length; i++) {
    for (let j = i + 1; j < centroids.length; j++) {
      const distance = d3.geoDistance(centroids[i].centroid, centroids[j].centroid) * RADIUS;

      centroids[i].nearbyAreas.push({
        distance: distance,
        area: centroids[j].divisionsObj,
      });

      centroids[j].nearbyAreas.push({
        distance: distance,
        area: centroids[i].divisionsObj,
      });
    }
  }

  for (const area of centroids) {
    area.nearbyAreas.sort((a, b) => a.distance - b.distance);
  }

  return divisions;
}

// test
// computeNearbyAreas(require('./load-data')());

module.exports = {
  computeNearbyAreas,
};
