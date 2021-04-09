// computes the center of a region
// used in preprocessing/lib/geo-data.js to compute the nearby regions.

const d3 = require('d3');
const topojson = require('topojson');
const nameCorrections = require('../lib/name-corrections');
const ADMINISTRATIVE_LEVEL = 'uni';

function computeCentroids() {
  const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
  const topo = topojson.feature(map, map.objects.map);

  const geoList = [];

  for (const selectedRegion of topo.features) {
    const props = selectedRegion.properties;
    const correctName = nameCorrections.correct([props.div, props.dis, props.upa, props.uni]);

    const geoObj = {
      div: correctName[0],
      dis: correctName[1],
      upa: correctName[2],
      uni: correctName[3],
      centroid: d3.geoCentroid(selectedRegion),
    };

    geoList.push(geoObj);
  }

  return geoList;
}

module.exports = {
  computeCentroids,
};
