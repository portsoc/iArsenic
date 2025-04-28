const { loadData } = require('../lib/load-data');
const cli = require('../lib/cli-common');
const fs = require('fs');
const path = require('path');

const REGION_LEVEL = 'upa';

function forEachFeature(geojson, data) {
  // deep copy input json
  const geojsonWithAs = JSON.parse(JSON.stringify(geojson));

  for (const feat of geojsonWithAs.features) {
    const div = feat.properties.div;
    const dis = feat.properties.dis;
    const upa = feat.properties.upa;

    if (!data[div]) {
      feat.properties.as = null;
      console.error(`No data for division ${div}`);
      continue;
    }

    const divData = data[div];

    if (!divData.districts[dis]) {
      feat.properties.as = null;
      console.error(`No data for district ${dis}`);
      continue;
    }

    const disData = divData.districts[dis];

    if (!disData.upazilas[upa]) {
      feat.properties.as = null;
      console.error(`No data for upazila ${upa}`);
      continue;
    }

    const upaData = disData.upazilas[upa];

    const meanAs = (() => {
      if (!upaData) return null;
      return upaData.wells.reduce((acc, well) => acc + well.arsenic, 0) / upaData.wells.length;
    })();

    feat.properties.as = meanAs;
  }

  return geojsonWithAs;
}


function main(options) {
  const data = loadData(options.paths);
  const geodata = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        `../geodata/maps/dist/${REGION_LEVEL}/${REGION_LEVEL}-c005-s010-vw-pr.geojson`,
      ),
      'utf8',
    ),
  );

  const output = forEachFeature(geodata, data);
  console.log(JSON.stringify(output));
}

main(cli.getParameters());
