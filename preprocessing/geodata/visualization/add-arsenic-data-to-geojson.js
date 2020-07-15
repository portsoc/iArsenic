const fs = require('fs');
const cli = require('../lib/cli-common');
const csvLoader = require('../lib/load-data');

function main(options) {
  const data = csvLoader(options.paths);
  const geoJson = loadGeoJsonFiles();
  addArsenicAttributes(geoJson);

  // loop through each well
  for (const div of Object.keys(data)) {
    for (const dis of Object.keys(data[div].districts)) {
      for (const upa of Object.keys(data[div].districts[dis].upazilas)) {
        for (const uni of Object.keys(data[div].districts[dis].upazilas[upa].unions)) {
          const regions = { div: div, dis: dis, upa: upa, uni: uni };
          const wells = data[div].districts[dis].upazilas[upa].unions[uni].wells;
          countWells(regions, wells, geoJson);
          for (const well of wells) {
            countArsenic(regions, well, geoJson);
          }
          arsenicPerWell(regions, geoJson);
        }
      }
    }
  }
  writeGeoData(geoJson);
}

function writeGeoData(geoData) {
  for (const region in geoData) {
    const filepath = `../../data/processed-data/arsenic-geodata/${region}-arsenic.geojson`;
    fs.writeFileSync(filepath, JSON.stringify(geoData[region]));
  }
}

function arsenicPerWell(regions, geoJson) {
  for (const region in regions) {
    for (const feature of geoJson[region].features) {
      if (feature.properties[region] === regions[region]) {
        const totalArsenicInRegion = feature.properties.arsenic;
        const wellsInRegion = feature.properties.wellCount;
        feature.properties.arsenicPerWell = totalArsenicInRegion / wellsInRegion;
        break;
      }
    }
  }
}

function countWells(regions, wells, geoJson) {
  for (const region in regions) {
    for (const feature of geoJson[region].features) {
      if (feature.properties[region] === regions[region]) {
        feature.properties.wellCount += wells.length;
        break;
      }
    }
  }
}

function countArsenic(regions, well, geoJson) {
  for (const region in regions) {
    for (const feature of geoJson[region].features) {
      if (feature.properties[region] === regions[region]) {
        feature.properties.arsenic += well.arsenic;
        break;
      }
    }
  }
}

function addArsenicAttributes(geoJson) {
  for (const sector in geoJson) {
    for (const feature of geoJson[sector].features) {
      feature.properties.arsenic = 0;
      feature.properties.wellCount = 0;
      feature.properties.arsenicPerWell = 0;
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
