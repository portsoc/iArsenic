const d3 = require('d3');
const topojson = require('topojson');
const nameCorrections = require('./name-corrections');
const ADMINISTRATIVE_LEVEL = 'uni';

function computeCentroids() {
  const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
  const topo = topojson.feature(map, map['objects']['map']);

  const geoList = [];

  for (const selectedRegion of topo.features) {
    const geoObj = {
      div: selectedRegion.properties.div,
      dis: selectedRegion.properties.dis,
      upa: selectedRegion.properties.upa,
      uni: selectedRegion.properties.uni,
      centroid: d3.geoCentroid(selectedRegion),
    };

    nameCorrections.correct(geoObj);
    geoList.push(geoObj);
  }

  return geoList;
}

module.exports = {
  computeCentroids,
};
