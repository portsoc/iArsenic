const getSimpleList = require('../../geodata/create-geo-list.js');
const d3 = require('d3');
const RADIUS = 6378.137;

function computeNearbyWells() {
  const data = getSimpleList();

  for (const area of data) {
    area.nearbyAreas = [];
  }

  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const distance = d3.geoDistance(data[i].centroid, data[j].centroid) * RADIUS;

      data[i].nearbyAreas.push({
        km: distance,
        area: data[j],
      });

      data[j].nearbyAreas.push({
        km: distance,
        area: data[i],
      });
    }
  }

  for (const area of data) {
    area.nearbyAreas.sort((a, b) => a.km - b.km);
  }

  return data;
}

computeNearbyWells();

module.exports = computeNearbyWells;
