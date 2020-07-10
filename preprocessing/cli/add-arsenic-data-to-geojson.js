const fs = require('fs');
const cli = require('../lib/cli-common');
const csvLoader = require('../lib/load-data');

function main(options) {
  const data = csvLoader(options.paths);
  const geoJson = loadGeoJsonFiles();
  addArsenicAttribute(geoJson);

  // loop through each well
  for (const div of Object.keys(data)) {
    for (const dis of Object.keys(data[div].districts)) {
      for (const upa of Object.keys(data[div].districts[dis].upazilas)) {
        for (const uni of Object.keys(data[div].districts[dis].upazilas[upa].unions)) {
          const sectors = {
            div: div,
            dis: dis,
            upa: upa,
            uni: uni,
          };
          const wells = data[div].districts[dis].upazilas[upa].unions[uni].wells;
          for (const well of wells) {
            countArsenic(sectors, well, geoJson);
          }
        }
      }
    }
  }
  fs.writeFileSync('../../data/processed-data/upazila-geodata-arsenic.geojson',
    JSON.stringify(geoJson.upa));
}

function countArsenic(sectors, well, geoJson) {
  for (const sector in sectors) {
    for (const feature of geoJson[sector].features) {
      if (feature.properties[sector] === sectors[sector]) {
        feature.properties.arsenic += well.arsenic;
        break;
      }
    }
  }
}

function addArsenicAttribute(geoJson) {
  for (const sector in geoJson) {
    for (const feature of geoJson[sector].features) {
      feature.properties.arsenic = 0;
    }
  }
}

function loadGeoJsonFiles() {
  const divFilepath = '../geodata/maps/dist/div/div-c005-s010-vw-pr.geojson';
  const disFilepath = '../geodata/maps/dist/dis/dis-c005-s010-vw-pr.geojson';
  const upaFilepath = '../geodata/maps/dist/upa/upa-c005-s010-vw-pr.geojson';
  const uniFilepath = '../geodata/maps/dist/uni/uni-c005-s010-vw-pr.geojson';

  const geoJson = {};

  const geoJsonFileArr = [
    { filepath: divFilepath, sector: 'div' },
    { filepath: disFilepath, sector: 'dis' },
    { filepath: upaFilepath, sector: 'upa' },
    { filepath: uniFilepath, sector: 'uni' },
  ];

  for (const file of geoJsonFileArr) {
    const geoDataRaw = fs.readFileSync(file.filepath);
    const geoData = JSON.parse(geoDataRaw);
    geoJson[file.sector] = geoData;
  }

  return geoJson;
}

main(cli.getParameters());
