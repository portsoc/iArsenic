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
  let max10 = 0, max20 = 0, max100 = 0, i = 0;
  const retval = {};


  for (const selectedRegion of topo.features) {
    closestRegion.distance = Infinity;

    let selectedRegionName = selectedRegion.properties[prop];

    let retReg = retval[selectedRegionName] = {
      within10km: [],
      within20km: [],
      within100km: [],
    };

    for (const feature of topo.features) {
      let regionName = feature.properties[prop];

      if (feature !== selectedRegion) {
        let currentDistance = d3.geoDistance(feature.centroid, selectedRegion.centroid) * RADIUS;

        if (++i < 10) console.log({ currentDistance, selectedRegionName, regionName });

        if (currentDistance < 10) {
          retReg.within10km.push(regionName);
        }

        if (currentDistance < 20) {
          retReg.within20km.push(regionName);
        }

        if (currentDistance < 100) {
          retReg.within100km.push(regionName);
        }
      }
    }
    retReg.properties = {
      div: selectedRegion.div,
      dis: selectedRegion.dis,
      upa: selectedRegion.upa,
      uni: selectedRegion.uni,
    };

    if (retReg.within10km.length > max10) max10 = retReg.within10km.length;
    if (retReg.within20km.length > max20) max20 = retReg.within20km.length;
    if (retReg.within100km.length > max100) max100 = retReg.within100km.length;
  }
  console.log('done', { max10, max20, max100 });
  console.log(JSON.stringify(retval));
}

runDistanceTests();
