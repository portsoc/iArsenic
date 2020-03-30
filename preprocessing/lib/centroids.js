const getSimpleList = require('../../geodata/create-geo-list.js');
const d3 = require('d3');
const {round1} = require('./stats.js');
const RADIUS = 6378.137;

function computeNearbyWells(data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      let distance = round1(d3.geoDistance(data[i].centroid, data[j].centroid) * RADIUS);

      if (distance <= 100) {
        data[i].nearbyAreas.push({
          km: distance,
          uni: data[j].uni,
        });

        data[j].nearbyAreas.push({
          km: distance,
          uni: data[i].uni,
        });
      }
    }

    data[i].nearbyAreas = data[i].nearbyAreas.sort((a, b) => a.distance - b.distance);
  }

  return data;
}

computeNearbyWells(getSimpleList());

module.exports = computeNearbyWells;
