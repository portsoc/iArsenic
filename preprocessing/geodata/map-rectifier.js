// This file rectifies a map file for any null mou/uni/upa/dis/div values and
// sets the nulls to the lowest parent with a value

// Not worrying about checking if a div/dis/upa/uni/mou have any parent cousins just yet
// Outputs geojson NOT topojson, can't get it to convert back using topojson.topology()

function usage() {
  console.log(`
Usage: map-rectifier -i input-map.json -o output-map.geojson
  `.trim());
}

const cli = require('../lib/cli-common');
const fs = require('fs');
const topojson = require('topojson');

function main(options) {
  if (!options.inputFile || !options.output) {
    usage();
    process.exit(-1);
  }

  const inputFile = JSON.parse(fs.readFileSync(options.inputFile));
  const inputMap = topojson.feature(inputFile, inputFile.objects.map);

  for (let i = 0; i < inputMap.features.length; i++) {
    const p = inputMap.features[i].properties;
    if (!p.mou) {
      if (!p.uni) {
        if (!p.upa) {
          if (!p.dis) {
            inputMap.features[i].properties.dis = p.div;
          }
          inputMap.features[i].properties.upa = p.dis;
        }
        inputMap.features[i].properties.uni = p.upa;
      }
      inputMap.features[i].properties.mou = p.uni;
    }
  }

  // writes GEOJson NOT TopoJSON
  fs.writeFileSync(options.output, JSON.stringify(inputMap));
}

main(cli.getParameters());

// use as a preloader
function rectifyTopojsonMap(inputFilePath) {
  const inputFile = JSON.parse(fs.readFileSync(inputFilePath));
  const inputMap = topojson.feature(inputFile, inputFile.objects.map);

  for (let i = 0; i < inputMap.features.length; i++) {
    // p is a reference
    const p = inputMap.features[i].properties;
    if (!p.mou) {
      if (!p.uni) {
        if (!p.upa) {
          if (!p.dis) {
            inputMap.features[i].properties.dis = p.div;
          }
          inputMap.features[i].properties.upa = p.dis;
        }
        inputMap.features[i].properties.uni = p.upa;
      }
      inputMap.features[i].properties.mou = p.uni;
    }
  }
  return inputMap;
}

module.exports = {
  rectifyTopojsonMap,
};
