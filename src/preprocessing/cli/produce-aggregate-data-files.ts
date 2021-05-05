import * as fs from 'fs';
import { getParameters, CliParameters } from '../lib/cli-common';
import { Region, Division, District, Upazila } from '../lib/types';
import * as path from 'path';

import { loadData } from '../lib/load-data';


export interface NameHierarchyObj {
  [index: string]: string| string[] | NameHierarchyObj[],
}

function extractNames(data: {[index: string]: Region}, hierarchyPath: string[]): string[] | NameHierarchyObj[] {
  if (hierarchyPath.length === 1) {
    const retval: string[] = [];
    for (const item of Object.keys(data)) {
      // on leaf level, do only a plain array
      retval.push(item);
    }
    retval.sort();
    return retval;
  } else {
    const retval: NameHierarchyObj[] = [];
    for (const item of Object.keys(data)) {
      const dataObj = data[item];
      const hierarchyObj: NameHierarchyObj = {
        [hierarchyPath[0]]: item,
      };
      if (hierarchyPath.length > 1) {
        let subData: {[index: string]: Region} = {};
        if (Object.prototype.hasOwnProperty.call(dataObj, 'districts')) {
          const dataObjWithSubregions = dataObj as typeof dataObj & Division<typeof dataObj>;
          subData = dataObjWithSubregions.districts;
        } else if (Object.prototype.hasOwnProperty.call(dataObj, 'upazilas')) {
          const dataObjWithSubregions = dataObj as typeof dataObj & District<typeof dataObj>;
          subData = dataObjWithSubregions.upazilas;
        } else if (Object.prototype.hasOwnProperty.call(dataObj, 'unions')) {
          const dataObjWithSubregions = dataObj as typeof dataObj & Upazila<typeof dataObj>;
          subData = dataObjWithSubregions.unions;
        }
        hierarchyObj[hierarchyPath[1] + 's'] = extractNames(subData, hierarchyPath.slice(1));
      }
      retval.push(hierarchyObj);
    }
    retval.sort(compareByProperty(hierarchyPath[0]));
    return retval;
  }
}

function compareByProperty<T>(prop: keyof T) {
  return (a: T, b: T) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] === b[prop]) return 0;
    return 1;
  };
}

async function main(optionsPromise: Promise<CliParameters>) {
  const options = await optionsPromise;
  checkOutputDirectory(options);

  const data = loadData(options.paths, options);

  const modelPreprocessor = options.model.preprocessor;

  const aggregateData = modelPreprocessor(data);
  const dropdownData = extractNames(data, ['division', 'district', 'upazila', 'union']);

  const estimatorContent = fs.readFileSync(options.model.estimatorPath);

  output(options, 'aggregate-data.js', 'const aggregateData = ' + JSON.stringify(aggregateData));
  output(options, 'dropdown-data.js', 'const dropdownData = ' + JSON.stringify(dropdownData));
  output(options, 'estimator.js', estimatorContent);
}

function fileHeading(options: CliParameters) {
  const inputData = (options.paths == null) ? 'default' : `[ ${options.paths.join(', ')} ]`;

  return `// model: ${options.model.id}
// generated: ${process.env.OVERRIDE_DATE || (new Date()).toString()}
// input data: ${inputData}
`;
}

function output(options: CliParameters, filename: string, content: string | Buffer) {
  content = `${fileHeading(options)}${content.toString()}`;
  if (!options.output) {
    // if no output directory, output to console
    console.log(filename + ':');
    console.log(content);
  } else {
    // put it in the file
    const filePath = path.join(options.output, filename);
    console.log('writing', filePath);
    fs.writeFileSync(filePath, content);
  }
}

function checkOutputDirectory(options: CliParameters) {
  // check the output directory exists
  if (options.output) {
    try {
      const fileInfo = fs.statSync(options.output);
      if (!fileInfo.isDirectory()) {
        console.error(`error: not a directory: ${options.output}`);
        process.exit(1);
      }
    } catch (e) {
      const msg = Object.prototype.hasOwnProperty.call(e, 'message') ? (e as Error).message : '';
      console.error(`error: cannot access directory: ${msg}`);
      process.exit(1);
    }
  }
}


main(getParameters()).catch(console.error);
