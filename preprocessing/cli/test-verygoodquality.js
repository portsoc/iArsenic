/*
 * This file tests against a "very good quality" data set from Mo, located in the
 * drive as iArsenic_test_Data_verygoodquality.xlsx
 *
 * IMPORTANT !!!!!!!!!!!!!!!!!!!!!!
 * As of 2021-07-20 this cannot work – model 5 now uses mouzas, but the VGQD testing data does not have mouzas.
 * Also, model 5 deals with flooding, which VGQD doesn't seem to cover either.
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

function runTests(allModels, div, dis, upa, uni, mou, depth, colour, arsenic) {
  const modelOutputs = [];

  for (const m of Object.values(allModels)) {
    m.res = m.estimator(m.divisions, div, dis, upa, uni, mou, depth, colour, null);
    m.est = discernAccuracy(arsenic, m.res.upperQ, m.res.lowerQ);
    modelOutputs.push(`"${m.res.message}",` +
      `${m.res.severity},` +
      `${(m.res.lowerQ) ? m.res.lowerQ : ''},` +
      `${(m.res.upperQ) ? m.res.upperQ : ''},` +
      `${m.est}`,
    );
  }

  console.log(`"${div}","${dis}","${upa}","${uni}","${mou}",${depth},${colour},` +
    `${arsenic},${modelOutputs.join()}`);
}

// const ALL_MODELS = ['model1', 'model3', 'model4', 'model5'];
const ALL_MODELS = ['model5'];

// const ALL_MODELS_ABBR = ['m1', 'm3', 'm4', 'm5'];
const ALL_MODELS_ABBR = ['m5'];

function getModels(data) {
  const modelDir = path.join(__dirname, '..', 'models');
  const retval = {};

  try {
    for (const model of ALL_MODELS) {
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

  const modelColumns = ['-msg', '-severity', '-lowerQ', '-upperQ', '-estimate'];
  const modelColumnNames = ALL_MODELS_ABBR.flatMap(abbr => modelColumns.map(col => abbr + col)).join(',');

  console.log('div,dis,upa,uni,mou,depth,stain,arsenic,' + modelColumnNames);

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

// console.error('As of 2021-07-20 this cannot work – model 5 now uses mouzas, but the VGQD testing data does not have mouzas.');
// process.exit(-1);

/* eslint-disable-next-line no-unreachable */
main(cli.getParameters());
