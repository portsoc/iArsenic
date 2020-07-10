const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function main() {
  const inputCsvRaw = fs.readFileSync('../../data/processed-data/wells-per-strata.csv');
  const inputCsv = parse(inputCsvRaw, CSV_PARSE_OPTIONS);
  const inputGeoDataRaw = fs.readFileSync('../../data/processed-data/upazila-geodata-centroids.geojson');
  const geoData = JSON.parse(inputGeoDataRaw);
  const upazilaWellData = getUpazilaWellData(inputCsv);
  const geoDataWithWellCount = addWellsToGeoData(geoData, upazilaWellData);
  const geoDataWithPercentiles = calculatePercentiles(geoDataWithWellCount);
  fs.writeFileSync('../../data/processed-data/upazila-geodata-centroids-well-count.geojson',
    JSON.stringify(geoDataWithPercentiles));
}

function calculatePercentiles(geoData) {
  geoData.features.sort((a, b) => {
    return a.properties.wellCount - b.properties.wellCount;
  });
  const percentileIndexArr = [];
  for (let percentile = 0.1; percentile < 0.9; percentile += 0.1) {
    const index = Math.floor(percentile * geoData.features.length);
    percentileIndexArr.push(index);
  }
  percentileIndexArr.push(geoData.features.length);
  percentileIndexArr.unshift(0);
  for (let i = 0; i < percentileIndexArr.length; i += 1) {
    for (let j = percentileIndexArr[i]; j < percentileIndexArr[i + 1]; j += 1) {
      geoData.features[j].properties.percentile = i;
    }
  }
  return geoData;
}

function addWellsToGeoData(geoData, wellData) {
  const attributeName = 'depth 0+';
  for (const well of wellData) {
    for (const feature of geoData.features) {
      if (feature.properties.upa === well.upazila) {
        feature.properties.wellCount = well[attributeName];
        break;
      }
    }
  }

  for (const feature of geoData.features) {
    if (feature.properties.wellCount === undefined) {
      feature.properties.wellCount = 0;
    }
  }
  return geoData;
}

function getUpazilaWellData(wellDataCsv) {
  const upazilaDataOnly = [];
  for (const record of wellDataCsv) {
    if (record.union === '###' && record.upazila !== '###') {
      upazilaDataOnly.push(record);
    }
  }
  return upazilaDataOnly;
}

main();
