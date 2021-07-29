// This file localises the very good quality data to a mouza using the
// latitude and logitude of the datapoint in the input file, and the
// location data in the geodata maps.

const cli = require('../lib/cli-common');
const { readTheCSVFiles } = require('../lib/load-data');
const fs = require('fs');

function isPointInPolygon(point, polygon) {
  // point is an array of [x,y]
  // polygon is an array of arrays of [x,y]
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  const n = polygon.length;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) &&
        (point[0] <
         (polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) /
             (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
      inside = !inside;
    }
  }
  return inside;
}

function main(options) {
  const input = readTheCSVFiles(options.inputFile);

  const map = JSON.parse(fs.readFileSync('./preprocessing/geodata/maps/dist/mou/mou-c005.geojson'));

  for (const vgqdDataPoint of input) {
    const point = [vgqdDataPoint.lat, vgqdDataPoint.lon];

    let mouza = null;

    for (const feature of map.features) {
      // console.log(feature);
      // console.log(feature.geometry.coordinates);
      // console.log(point);
      if (isPointInPolygon(point, feature.geometry.coordinates)) {
        mouza = feature.properties.N_MAUZA;
        break;
      }
    }

    console.log(mouza);
  }
}

main(cli.getParameters());
