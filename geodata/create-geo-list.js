const d3 = require('d3');
const topojson = require('topojson');
const ADMINISTRATIVE_LEVEL = 'uni';
const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
  const prop = ADMINISTRATIVE_LEVEL;
  const closestRegion = {};
  const RADIUS = 6378.137;

  const geoList = [];

  for (const selectedRegion of topo.features) {
    let geoObj = {
      div: selectedRegion.properties.div,
      dis: selectedRegion.properties.dis,
      upa: selectedRegion.properties.upa,
      uni: selectedRegion.properties.uni,
      centroid: d3.geoCentroid(selectedRegion),
      nearbyAreas: [],
    };
    geoList.push(geoObj);
  }

  return geoList;
}

module.exports = runDistanceTests;
