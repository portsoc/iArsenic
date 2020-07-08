const fs = require('fs');
const cli = require('../lib/cli-common');
const d3 = require('d3');

function main(options) {
  // get input and output file paths from options flags
  const inputFilepath = getInputFilePath(options);
  const outputFilepath = getOutputFilePath(options, inputFilepath);

  const geoDataRaw = fs.readFileSync(inputFilepath);
  const geoData = JSON.parse(geoDataRaw);
  const geoDataPlusCentroids = addCentroids(geoData);
  fs.writeFileSync(outputFilepath, JSON.stringify(geoDataPlusCentroids));
}

function addCentroids(geoData) {
  for (const feature of geoData.features) {
    feature.properties.centroidLon = d3.geoCentroid(feature)[0];
    feature.properties.centroidLat = d3.geoCentroid(feature)[1];
  }
  return geoData;
}

function getOutputFilePath(options, inputFilepath) {
  if (options.output === undefined) {
    // remove .geojson, add -centroids to file name, put .geojson back
    let outputFilepath = inputFilepath.slice(0, inputFilepath.lastIndexOf('.'));
    outputFilepath += '-centrois';
    outputFilepath += inputFilepath.slice(inputFilepath.lastIndexOf('.'), inputFilepath.length);

    console.debug('using default -o: ' + outputFilepath);
    return outputFilepath;
  }
  if (isValidFilepath(options.output)) {
    console.debug('outputting to: ' + options.output);
    return options.output;
  }
}

function getInputFilePath(options) {
  // TODO output files to a more suitable file which can be added to gitignore
  if (options.paths === undefined) {
    const outputFilepath = '../geodata/maps/dist/div/div-c005-s010-vw-pr.geojson';
    console.debug('using default -p: ' + outputFilepath);
    return outputFilepath;
  }
  if (isValidFilepath(options.paths)) {
    console.debug('looking for geoData file in: ' + options.paths);
    return options.paths[0];
  }
}

function isValidFilepath() {
  return true; // TODO
}

main(cli.getParameters());
