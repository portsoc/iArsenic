// This file localises the very good quality data to a mouza using the
// latitude and logitude of the datapoint in the input file, and the
// location data in the geodata maps.
//

function usage() {
  console.log(`
Usage: vgqd-mouza-geocoder -i input-file.csv -o output-file.csv
  the input file needs the following columns:
  id,lat,lon,division,district,upazila,union,depth,colour,as

  the output will contains all the wells from the input, with the following columns
  id,lat,lon – copied from the input
  division,district,upazila,union – original location specified in the input file
  div,dis,upa,uni,mou – geocoded location from lat/lon
  depth,colour,as – copied from the input
  `.trim());
}

const cli = require('../lib/cli-common');
const { readTheCSVFiles } = require('../lib/load-data');
const fs = require('fs');
const topojson = require('topojson');
const d3 = require('d3');

function main(options) {
  if (!options.inputFile || !options.output) {
    usage();
    process.exit(-1);
  }

  const input = readTheCSVFiles(options.inputFile);

  const map = require('./maps/dist/mou/mou-c005-s010-vw-pr.json');
  const { features } = topojson.feature(map, map.objects.map);

  const output = [[
    'id', 'lat', 'lon',
    'division', 'district', 'upazila', 'union',
    'div', 'dis', 'upa', 'uni', 'mou',
    'depth', 'colour', 'as']];

  for (const vgqdDataPoint of input) {
    const point = [vgqdDataPoint.lon, vgqdDataPoint.lat];
    let found = ['', '', '', '', ''];
    for (const feature of features) {
      if (feature.properties.mou && d3.geoContains(feature, point)) {
        found = [
          feature.properties.div,
          feature.properties.dis,
          feature.properties.upa,
          feature.properties.uni,
          feature.properties.mou,
        ];
        break;
      }
    }
    output.push([
      vgqdDataPoint.id, vgqdDataPoint.lat, vgqdDataPoint.lon,
      vgqdDataPoint.division, vgqdDataPoint.district, vgqdDataPoint.upazila, vgqdDataPoint.union,
      ...found,
      vgqdDataPoint.depth, vgqdDataPoint.colour, vgqdDataPoint.as,
    ]);
  }

  const outputLines = output.map(line => line.join(','));

  fs.writeFileSync(options.output, outputLines.join('\n'));
}

main(cli.getParameters());
