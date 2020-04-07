/*
This file tests against a "very good quality" data set from Mo, located in the
drive as iArsenic_test_Data_verygoodquality.xlsx
*/

const parse = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');
const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'vgqd', 'vgqd-all-data.csv');
const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function discernAccuracy(arsenic, severity, upperQ, lowerQ) {
  const accuracy = {};

  if (arsenic < 50) {
    if (severity === 'safe') {
      accuracy.safety = 'accurate';
    } else {
      accuracy.safety = "we say polluted, it isn't";
    }
  } else {
    if (severity === 'safe') {
      accuracy.safety = "we say safe, it isn't";
    } else {
      accuracy.safety = 'accurate';
    }
  }

  accuracy.range = (lowerQ > arsenic) ? 'overestimate'
    : (upperQ < arsenic) ? 'underestimate'
      : 'accurate';

  return accuracy;
}

function runTests(produceEstimate, divisions, div, dis, upa, uni, depth, colour, arsenic) {
  const result = produceEstimate(divisions, div, dis, upa, uni, depth, colour, null);

  const accuracy = discernAccuracy(arsenic, result.severity, result.upperQ, result.lowerQ);

  console.log(`"${div}","${dis}","${upa}","${uni}",${depth},${colour},` +
    `${arsenic},"${result.message}","${accuracy.safety}",` +
    `"${accuracy.range}",${(result.lowerQ) ? result.lowerQ : ''},` +
    `${(result.upperQ) ? result.upperQ : ''}`);
}

function main(options) {
  const preprocessor = options.model.preprocessor;
  const produceEstimate = options.model.estimator;

  const data = csvLoader(options.paths);
  const divisions = preprocessor(data);

  console.log('div,dis,upa,uni,depth,stain,arsenic,message,' +
    'accuracy_safety,accuracy_range,lower_quantile,upper_quantile');

  const vgqData = parse(fs.readFileSync(DATA_PATH), CSV_PARSE_OPTIONS);
  for (const well of vgqData) {
    runTests(
      produceEstimate,
      divisions,
      well.div,
      well.dis,
      well.upa,
      well.uni,
      Number(well.depth),
      well.colour,
      Number(well.as));
  }

  // if we wish to see memory stats:
  // console.log(process.memoryUsage());
  // gc();
  // setInterval(() => {
  //   console.log(process.memoryUsage());
  //   gc();
  // }, 2000);
}

main(cli.getParameters());
