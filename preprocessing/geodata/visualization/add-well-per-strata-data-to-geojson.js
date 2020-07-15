const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function main() {
  let inputCsvRaw;
  try {
    inputCsvRaw = fs.readFileSync('../../data/processed-data/csv/wells-per-strata.csv');
  } catch (err) {
    console.error('failed reding input csv, try running data-per-strata.js');
    return;
  }

  const inputCsv = parse(inputCsvRaw, CSV_PARSE_OPTIONS);
  const strata = getStrata(inputCsv);
  const geoData = loadGeoJsonFiles();
  addStrataDataToRegions(geoData, inputCsv, strata);
  writeGeoData(geoData);
}

function writeGeoData(geoData) {
  for (const region in geoData) {
    const filepath = `../../data/processed-data/wells-per-strata-geodata/
      ${region}-wells-per-strata.geojson`;
    fs.writeFileSync(filepath, JSON.stringify(geoData[region]));
  }
}


function addStrataDataToRegions(geoData, wellDataCsv, strata) {
  for (const record of wellDataCsv) {
    if (record.union === '###' && record.upazila === '###' && record.distrcit === '###') {
      addRecordData(geoData.div, record, strata);
    } else if (record.union === '###' && record.upazila === '###') {
      addRecordData(geoData.dis, record, strata);
    } else if (record.union === '###') {
      addRecordData(geoData.upa, record, strata);
    } else {
      addRecordData(geoData.uni, record, strata);
    }
  }
}

function addRecordData(regionObj, record, strata) {
  for (const feature of regionObj.features) {
    if (featureMatchesRecord(feature, record)) {
      for (const stratum of strata) {
        feature.properties[stratum] = record[stratum];
      }
      break;
    }
  }
}

function featureMatchesRecord(feature, record) {
  if (record.division === feature.properties.div) {
    if (record.district === feature.properties.dis || feature.properties.dis === undefined) {
      if (record.upazila === feature.properties.upa || feature.properties.upa === undefined) {
        if (record.union === feature.properties.uni || feature.properties.uni === undefined) {
          return true;
        }
      }
    }
  }
  return false;
}

function getStrata(inputCsv) {
  const strata = [];
  for (const header in inputCsv[0]) {
    if (header.includes('depth')) strata.push(header);
  }
  return strata;
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

main();
