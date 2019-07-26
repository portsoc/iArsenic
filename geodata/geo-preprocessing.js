const d3 = require('d3');
const topojson = require('topojson');
const map = require('./maps/dist/div/div-c005-s010-vw-pr.json');
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
  const prop = 'div';
  const closestRegion = {};

  console.log(`The topo centroid is ${d3.geoCentroid(topo)}`);

  for (const selectedRegion of topo.features) {
    closestRegion.distance = Infinity;

    let selectedRegionName = selectedRegion.properties[prop];
    let selectedRegionCentroid = d3.geoCentroid(selectedRegion);

    for (const feature of topo.features) {
      let regionName = feature.properties[prop];

      if (feature !== selectedRegion) {
        let regionCentroid = d3.geoCentroid(feature);

        let currentDistance = d3.geoDistance(selectedRegionCentroid, regionCentroid);

        if (currentDistance < closestRegion.distance) {
          closestRegion[prop] = regionName;
          closestRegion.distance = currentDistance;
        }
      }
    }
    console.log(`\nThe closest region to ${selectedRegionName} is ${closestRegion[prop]}`);
  }
}

runDistanceTests();
