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

function discernAccuracy(arsenic, upperQ, lowerQ) {
  return (lowerQ > arsenic)
    ? 'overestimate'
    : (upperQ < arsenic)
        ? 'underestimate'
        : 'accurate';
}

function runTests(allModels, div, dis, upa, uni, depth, colour, arsenic) {
  const modelOutputs = [];

  for (const m of Object.values(allModels)) {
    m.res = m.estimator(m.divisions, div, dis, upa, uni, depth, colour, null);
    m.est = discernAccuracy(arsenic, m.res.upperQ, m.res.lowerQ);
    modelOutputs.push(`"${m.res.message}",` +
      `${m.res.severity},` +
      `${(m.res.lowerQ) ? m.res.lowerQ : ''},` +
      `${(m.res.upperQ) ? m.res.upperQ : ''},` +
      `${m.est}`,
    );
  }

  console.log(`"${div}","${dis}","${upa}","${uni}",${depth},${colour},` +
    `${arsenic},${modelOutputs.join()}`);
}

function getModels(data) {
  const modelDir = path.join(__dirname, '..', 'models');
  const retval = {};

  try {
    for (const model of ['model1', 'model3', 'model4', 'model5']) {
      const preprocessor = require(path.join(modelDir, `${model}-preprocessor.js`));
      const estimator = require(path.join(modelDir, `${model}-estimator.js`));

      retval[model] = {
        estimator,
        divisions: preprocessor(data),
      };
    }
    return retval;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function main(options) {
  // disable debug messages
  console.debug = () => {};

  const data = csvLoader(options.paths);

  const allModels = getModels(data);

  console.log('div,dis,upa,uni,depth,stain,arsenic,' +
    'm1-msg,m1-severity,m1-lowerQ,m1-upperQ,m1-estimate,' +
    'm3-msg,m3-severity,m3-lowerQ,m3-upperQ,m3-estimate,' +
    'm4-msg,m4-severity,m4-lowerQ,m4-upperQ,m4-estimate,' +
    'm5-msg,m5-severity,m5-lowerQ,m5-upperQ,m5-estimate');

  const vgqData = parse(fs.readFileSync(DATA_PATH), CSV_PARSE_OPTIONS);
  for (const well of vgqData) {
    runTests(
      allModels,
      well.div,
      well.dis,
      well.upa,
      well.uni,
      well.mou,
      Number(well.depth),
      well.colour,
      Number(well.as));
  }
}

main(cli.getParameters());
