// This file localises the very good quality data to a mouza using the
// latitude and logitude of the datapoint in the input file, and the
// location data in the geodata maps.

const cli = require('../lib/cli-common');
const { readTheCSVFiles } = require('../lib/load-data');
const fs = require('fs');
const path = require('path');
const topojson = require('topojson');
const d3 = require('d3');

function main(options) {
  const input = readTheCSVFiles(options.inputFile);

  const map = require('./maps/dist/mou/mou-c005-s010-vw-pr.json');
  const { features } = topojson.feature(map, map.objects.map);

  const output = [];

  for (const vgqdDataPoint of input) {
    const point = [vgqdDataPoint.lon, vgqdDataPoint.lat];
    for (const feature of features) {
      if (d3.geoContains(feature, point)) {
        console.log(`Mouza found for datapoint ${vgqdDataPoint.id}: ${feature.properties.mou}`);

        output.push([vgqdDataPoint.id, vgqdDataPoint.lat, vgqdDataPoint.lon, feature.properties.div,
          feature.properties.dis, feature.properties.upa, feature.properties.uni,
          feature.properties.mou, vgqdDataPoint.depth, vgqdDataPoint.as]);
      }
    }
  }

  const columns = ['id', 'lat', 'lon', 'division', 'district', 'upazila', 'union', 'mouza', 'depth', 'colour', 'as'];
  const outputLines = output.map(line => line.join(','));
  outputLines.unshift(columns);

  fs.writeFileSync(path.join(__dirname, options.output), outputLines.join('\n'));
}

main(cli.getParameters());
