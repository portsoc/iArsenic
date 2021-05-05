/*
This file tests against a "very good quality" data set from Mo, located in the
drive as iArsenic_test_Data_verygoodquality.xlsx
*/

import * as fs from 'fs';
import { getParameters, CliParameters } from '../lib/cli-common';
import { BasicDataSet, StatsHierarchyObj, EstimatorFunction, Region } from '../lib/types';
import parse from 'csv-parse/lib/sync';
import * as path from 'path';
import { loadData } from '../lib/load-data';

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'vgqd', 'vgqd-all-data.csv');
const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function discernAccuracy(arsenic: number, upperQ: number, lowerQ: number) {
  return (lowerQ > arsenic)
    ? 'overestimate'
    : (upperQ < arsenic)
      ? 'underestimate'
      : 'accurate';
}

interface Model {
  estimator: (divisions: StatsHierarchyObj, div: string, dis: string, upa: string, uni: string, depth: number, colour: string, utensil: string)=> {
    message: string,
    severity: string,
    lowerQ: number,
    upperQ: number,
  },
  divisions: StatsHierarchyObj,
  res?: {
    message: string,
    severity: string,
    lowerQ: number,
    upperQ: number,
  },
  est?: string,
}

function runTests(allModels: Model[], div: string, dis: string, upa: string, uni: string, depth: number, colour: string, arsenic: number) {
  const modelOutputs = [];

  for (const m of Object.values(allModels)) {
    m.res = m.estimator(m.divisions, div, dis, upa, uni, depth, colour, '');
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

async function getModels(data: BasicDataSet<Region>) {
  const modelDir = path.join(__dirname, '..', 'models');
  const retval: Model[] = [];

  try {
    for (const model of ['model1', 'model3', 'model4', 'model5']) {
      const preprocessor = ((
        await import(path.join(modelDir, `${model}-preprocessor`))
      ) as {default: (data: BasicDataSet<Region>)=> StatsHierarchyObj}).default;

      const estimator = ((
        await import(path.join(modelDir, `${model}-estimator`))
      ) as {default: EstimatorFunction}).default;

      if (model === 'model1') {
        const model1: Model = {
          estimator: estimator,
          divisions: preprocessor(data),
        };
        retval.push(model1);
      }
      if (model === 'model3') {
        const model3: Model = {
          estimator: estimator,
          divisions: preprocessor(data),
        };
        retval.push(model3);
      }
      if (model === 'model4') {
        const model4: Model = {
          estimator: estimator,
          divisions: preprocessor(data),
        };
        retval.push(model4);
      }
      if (model === 'model5') {
        const model5: Model = {
          estimator: estimator,
          divisions: preprocessor(data),
        };
        retval.push(model5);
      }
    }
    return retval;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export interface VgqData {
  div: string,
  dis: string,
  upa: string,
  uni: string,
  depth: string,
  colour: string,
  as: string,
}

async function main(optionsPromise: Promise<CliParameters>) {
  const options = await optionsPromise;

  // disable debug messages
  console.debug = () => { return null; };

  const data = loadData(options.paths, options);

  const allModels = await getModels(data);

  console.log('div,dis,upa,uni,depth,stain,arsenic,' +
    'm1-msg,m1-severity,m1-lowerQ,m1-upperQ,m1-estimate,' +
    'm3-msg,m3-severity,m3-lowerQ,m3-upperQ,m3-estimate,' +
    'm4-msg,m4-severity,m4-lowerQ,m4-upperQ,m4-estimate,' +
    'm5-msg,m5-severity,m5-lowerQ,m5-upperQ,m5-estimate');

  const vgqData = parse(fs.readFileSync(DATA_PATH), CSV_PARSE_OPTIONS) as VgqData[];
  for (const well of vgqData) {
    runTests(
      allModels,
      well.div,
      well.dis,
      well.upa,
      well.uni,
      Number(well.depth),
      well.colour,
      Number(well.as));
  }
}

main(getParameters()).catch(console.error);
