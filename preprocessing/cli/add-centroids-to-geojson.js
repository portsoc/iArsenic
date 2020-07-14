const fs = require('fs');
const d3 = require('d3');

function main() {
  const geoData = loadGeoJsonFiles();
  addCentroids(geoData);
  writeGeoData(geoData);
}

function writeGeoData(geoData) {
  for (const region in geoData) {
    const filepath = `../../data/processed-data/centroid-geodata/${region}-centroids.geojson`;
    fs.writeFileSync(filepath, JSON.stringify(geoData[region]));
  }
}

function addCentroids(geoData) {
  for (const region in geoData) {
    for (const feature of geoData[region].features) {
      feature.properties.centroidLat = d3.geoCentroid(feature)[0];
      feature.properties.centroidLon = d3.geoCentroid(feature)[1];
    }
  }
}

function loadGeoJsonFiles() { // code taken from add-arsenic-data-to-geojson. module? TODO
  const divFilepath = '../geodata/maps/dist/div/div-c005-s010-vw-pr.geojson';
  const disFilepath = '../geodata/maps/dist/dis/dis-c005-s010-vw-pr.geojson';
  const upaFilepath = '../geodata/maps/dist/upa/upa-c005-s010-vw-pr.geojson';
  const uniFilepath = '../geodata/maps/dist/uni/uni-c005-s010-vw-pr.geojson';

  const geoJson = {};

  const geoJsonFileArr = [
    { filepath: divFilepath, region: 'div' },
    { filepath: disFilepath, region: 'dis' },
    { filepath: upaFilepath, region: 'upa' },
    { filepath: uniFilepath, region: 'uni' },
  ];

  for (const file of geoJsonFileArr) {
    const geoDataRaw = fs.readFileSync(file.filepath);
    const geoData = JSON.parse(geoDataRaw);
    geoJson[file.region] = geoData;
  }

  return geoJson;
}

main();
