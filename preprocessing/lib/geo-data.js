const centroids = require('../../geodata/centroids');
const d3 = require('d3');
const RADIUS = 6378.137;

function computeNearbyAreas(divisions) {
  const data = centroids();

  for (const area of data) {
    area.nearbyAreas = [];
    area.divisionsObj = divisions[area.div].districts[area.dis].upazilas[area.upa].unions[area.uni];
    area.divisionsObj.nearbyAreas = area.nearbyAreas;
  }

  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const distance = d3.geoDistance(data[i].centroid, data[j].centroid) * RADIUS;

      data[i].nearbyAreas.push({
        distance: distance,
        area: data[j].divisionsObj,
      });

      data[j].nearbyAreas.push({
        distance: distance,
        area: data[i].divisionsObj,
      });
    }
  }

  for (const area of data) {
    area.nearbyAreas.sort((a, b) => a.distance - b.distance);
  }

  return divisions;
}

// test
computeNearbyAreas(require('./load-data')());

module.exports = computeNearbyAreas;
