// computes the center of a region
// used in preprocessing/lib/geo-data.js to compute the nearby regions.

const d3 = require('d3');
const topojson = require('topojson');
const nameCorrections = require('../lib/name-corrections');
const ADMINISTRATIVE_LEVEL = 'mou';

let centroidsArray;
let centroidsHierarchy;

function computeCentroids() {
  const map = require(`./maps/dist/${ADMINISTRATIVE_LEVEL}/${ADMINISTRATIVE_LEVEL}-c005-s010-vw-pr.json`);
  const topo = topojson.feature(map, map.objects.map);

  const geoList = [];
  const geoHierarchy = {};

  for (const selectedRegion of topo.features) {
    const props = selectedRegion.properties;
    const correctName = nameCorrections.correct([props.div, props.dis, props.upa, props.uni, props.mou]);

    const geoObj = {
      div: correctName[0],
      dis: correctName[1],
      upa: correctName[2],
      uni: correctName[3],
      mou: correctName[4],
      centroid: d3.geoCentroid(selectedRegion),
    };

    geoList.push(geoObj);

    if (geoHierarchy[geoObj.div] === undefined) {
      const division = {
        name: geoObj.div,
        subRegions: {},
      };
      geoHierarchy[geoObj.div] = division;
    }
    const division = geoHierarchy[geoObj.div];

    if (division.subRegions[geoObj.dis] === undefined) {
      const district = {
        name: geoObj.dis,
        parent: geoObj.div,
        subRegions: {},
      };
      division.subRegions[geoObj.dis] = district;
    }
    const district = division.subRegions[geoObj.dis];

    if (district.subRegions[geoObj.upa] === undefined) {
      const upazila = {
        name: geoObj.upa,
        parent: geoObj.dis,
        subRegions: {},
      };
      district.subRegions[geoObj.upa] = upazila;
    }
    const upazila = district.subRegions[geoObj.upa];

    if (upazila.subRegions[geoObj.uni] === undefined) {
      const union = {
        name: geoObj.uni,
        parent: geoObj.upa,
        subRegions: {},
      };
      upazila.subRegions[geoObj.uni] = union;
    }
    const union = upazila.subRegions[geoObj.uni];

    union.subRegions[geoObj.mou] = {
      name: geoObj.mou,
      parent: geoObj.uni,
      centroid: geoObj.centroid,
    };
  }

  centroidsArray = geoList;
  centroidsHierarchy = geoHierarchy;
}

function getLookupCentroids() {
  if (!centroidsHierarchy) {
    computeCentroids();
  }
  return centroidsHierarchy;
}

function getCentroidsIterator() {
  if (!centroidsArray) {
    computeCentroids();
  }
  return centroidsArray;
}

function annotateCentroids(divisions) {
  const arr = getCentroidsIterator();
  const lookup = getLookupCentroids();
  for (const region of arr) {
    try {
      region.divisionsObj = divisions[region.div].districts[region.dis].upazilas[region.upa].unions[region.uni].mouzas[region.mou];
      lookup[region.div].subRegions[region.dis].subRegions[region.upa].subRegions[region.uni].subRegions[region.mou].divisionsObj = region.divisionsObj;
    } catch (e) {
      continue;
    }
  }
}

module.exports = {
  getLookupCentroids,
  getCentroidsIterator,
  annotateCentroids,
};
