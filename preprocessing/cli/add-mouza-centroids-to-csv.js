/*

This script loads the available data and outputs a CSV view of all of it together with mouza centroids.

*/


const { loadData } = require('../lib/load-data');
const csvStringify = require('csv-stringify/lib/sync');
const { getLookupCentroids } = require('../geodata/centroids');
const cli = require('../lib/cli-common');

const CSV_STRINGIFY_OPTIONS = { header: true };

function forEachMouza(divisions, f) {
  for (const div of Object.values(divisions)) {
    for (const dis of Object.values(div.districts)) {
      for (const upa of Object.values(dis.upazilas)) {
        for (const uni of Object.values(upa.unions)) {
          for (const mou of Object.values(uni.mouzas)) {
            f([div, dis, upa, uni, mou]);
          }
        }
      }
    }
  }
}

function extractWellDataWithMouzaCentroids(divisions, centroids) {
  const retval = [];
  forEachMouza(divisions, (locationArr) => {
    const Division = locationArr[0].name;
    const District = locationArr[1].name;
    const Upazila = locationArr[2].name;
    const Union = locationArr[3].name;
    const Mouza = locationArr[4].name;

    const centroid = centroids[Division].subRegions[District].subRegions[Upazila].subRegions[Union].subRegions[Mouza];

    for (const well of locationArr[4].wells) {
      retval.push({
        Division,
        District,
        Upazila,
        Union,
        Mouza,
        Depth: well.depth,
        Arsenic: well.arsenic,
        MouzaLat: centroid.centroid[1],
        MouzaLon: centroid.centroid[0],
      });
    }
  });
  return retval;
}

function main(options) {
  console.error('loading data');
  console.debug = console.error;
  const data = loadData(options.paths, options);

  console.error('getting centroids');
  const centroids = getLookupCentroids();

  console.error('extracting');
  const dataWithCentroids = extractWellDataWithMouzaCentroids(data, centroids);

  console.error('outputting');
  const outputCsv = csvStringify(dataWithCentroids, CSV_STRINGIFY_OPTIONS);
  console.log(outputCsv);
}

main(cli.getParameters());
