/*
 * This script reads a model id, an input CSV file, and an output file
 * or directory. It then loads the corresponding model and returns it
 * along with the parameters.
 */

import commandLineArgs from 'command-line-args';
import path from 'path';
import { BasicDataSet, EstimatorFunction, GeoRegion, StatsHierarchyObj, Region, RegionStatistics, RegionWithStrata } from './types';

const DEFAULT_MODEL = 'model4';

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  {
    name: 'paths',
    alias: 'p',
    type: String,
    defaultOption: true,
    multiple: true,
  },
  {
    name: 'model',
    alias: 'm',
    type: String,
    defaultValue: DEFAULT_MODEL,
  },
  {
    name: 'output',
    alias: 'o',
    type: String,
  },
  {
    name: 'inputFile',
    alias: 'i',
    type: String,
  },
  {
    name: 'corrections',
    alias: 'c',
    type: String,
  },
];

function usage() {
  console.log(`Available command-line options:

Options:

  -h, --help               Show this help

  -m modelid
  --model=modelid          Use model <modelid> instead of the default.
                           To see what models are available, look in models/

  [-p] path1 path2 ...
                           Use the given CSV files as input data.

  -i file                  (only in find-name-corrections.js, see data-import/README.md)
                           An input CSV file that may contain incorrect regions.

  -o directory             (everywhere except in find-name-corrections.js)
                           If any files are produced, they will be in <directory>.
                           Without -o, the content of those files will go in the console.

  -o file                  (in find-name-corrections.js)
                           The file where to store name corrections.
                           The contents of the file will be loaded on start and the
                           name corrections already there will be used when loading
                           the -i file.
`.trim());
}

const options = commandLineArgs(optionDefinitions);

if (options.help) {
  usage();
  process.exit(0);
}

export interface CliParameters {
  help: boolean,
  paths: string[],
  model: {
    id: string,
    preprocessorPath: string,
    preprocessor: (divisions: BasicDataSet<Region>)=> StatsHierarchyObj,
    computeWidening: (dataset: BasicDataSet<Region>)=> BasicDataSet<Region>,
    estimatorPath: string,
    estimator: EstimatorFunction,
  },
  output: string,
  inputFile: string,
  corrections: string,
}

export async function getParameters(): Promise<CliParameters> {
  options.model = await loadModelScripts(options.model);
  return options as CliParameters;
}


async function loadModelScripts(model: string) {
  const preprocessorPath = path.join(__dirname, '..', 'models', model + '-preprocessor.js');
  const estimatorPath = path.join(__dirname, '..', 'models', model + '-estimator.js');

  try {
    return {
      id: model,
      preprocessorPath,
      preprocessor: (
        await import(preprocessorPath) as {
          default: (divisions: BasicDataSet<Region>)=> StatsHierarchyObj,
        }
      ).default,
      computeWidening: (
        await import(preprocessorPath) as {
          computeRegionWidening: (
            locationArr: (Region
            & Partial<RegionWithStrata>
            & Partial<RegionStatistics>
            & Partial<GeoRegion>)[]
          )=> void,
        }
      ).computeRegionWidening,
      estimatorPath,
      estimator: (
        await import(estimatorPath) as {default: EstimatorFunction}
      ).default,
    };
  } catch (e) {
    console.error(`error: cannot find model '${model}-preprocessor' or '${model}-estimator'`);
    console.error(`in ${path.join(__dirname, '..', 'models')}`);
    process.exit(1);
  }
}
