const d3 = require('d3');
const topojson = require('topojson');
const ADMINISTRATIVE_LEVEL = 'uni';
const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
  const prop = ADMINISTRATIVE_LEVEL;
  const closestRegion = {};

  console.log(`The topo centroid is ${d3.geoCentroid(topo)}`);

  for (const selectedRegion of topo.features) {
    selectedRegion.centroid = d3.geoCentroid(selectedRegion);
  }

  for (const selectedRegion of topo.features) {
    closestRegion.distance = Infinity;

    let selectedRegionName = selectedRegion.properties[prop];

    for (const feature of topo.features) {
      let regionName = feature.properties[prop];

      if (feature !== selectedRegion) {
        let currentDistance = d3.geoDistance(feature.centroid, selectedRegion.centroid);

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
