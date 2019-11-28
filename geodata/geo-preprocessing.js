const d3 = require('d3');
const topojson = require('topojson');
const ADMINISTRATIVE_LEVEL = 'uni';
const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
  const prop = ADMINISTRATIVE_LEVEL;
  const closestRegion = {};
  const RADIUS = 6378.137;

  console.log(`The topo centroid is ${d3.geoCentroid(topo)}`);

  for (const selectedRegion of topo.features) {
    selectedRegion.centroid = d3.geoCentroid(selectedRegion);
  }
  console.log('centroids done');
  console.log('number of features', topo.features.length);

  // Counter variable used to reduce the file size for testing
  let i = 0;

  const retReg = {};

  for (const selectedRegion of topo.features) {
    closestRegion.distance = Infinity;

    let selectedRegionName = selectedRegion.properties[prop];

    retReg[selectedRegionName] = {
      within10km: [],
      within20km: [],
      within100km: [],
      properties: {
        div: selectedRegion.properties.div,
        dis: selectedRegion.properties.dis,
        upa: selectedRegion.properties.upa,
      },
    };

    for (const feature of topo.features) {
      let regionProperties = {
        div: feature.properties.div,
        dis: feature.properties.dis,
        upa: feature.properties.upa,
        uni: feature.properties.uni,
      };

      if (feature !== selectedRegion) {
        let currentDistance = d3.geoDistance(feature.centroid, selectedRegion.centroid) * RADIUS;

        if (currentDistance < 10) {
          retReg[selectedRegionName].within10km.push(regionProperties);
        }

        if (currentDistance < 20) {
          retReg[selectedRegionName].within20km.push(regionProperties);
        }

        if (currentDistance < 100) {
          retReg[selectedRegionName].within100km.push(regionProperties);
        }
      }
    }

    // Reduces output for testing
    if (i++ === 10) break;
  }

  console.log(JSON.stringify(retReg));
}

runDistanceTests();
