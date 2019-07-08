const path = require('path');

const loadData = require('../lib/load-data');
const cli = require('../lib/cli-common');

const DEFAULT_MODEL = 'model3';

function extractNames(data, hierarchyPath) {
  const retval = [];
  if (hierarchyPath.length === 1) {
    for (const item of Object.keys(data)) {
      // on leaf level, do only a plain array
      retval.push(item);
    }
    retval.sort();
  } else {
    for (const item of Object.keys(data)) {
      const dataObj = data[item];
      const hierarchyObj = {
        [hierarchyPath[0]]: item,
      };
      if (hierarchyPath.length > 1) {
        const subData = dataObj[hierarchyPath[1] + 's'];
        hierarchyObj[hierarchyPath[1] + 's'] = extractNames(subData, hierarchyPath.slice(1));
      }
      retval.push(hierarchyObj);
    }
    retval.sort(compareByProperty(hierarchyPath[0]));
  }

  return retval;
}

function compareByProperty(prop) {
  return (a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] === b[prop]) return 0;
    return 1;
  };
}

function main(opts) {
  const options = Object.assign({
    model: DEFAULT_MODEL,
  }, opts);

  const processorPath = path.join(__dirname, '..', 'models', options.model + '-preprocessor');

  const data = loadData(options.paths);
  const inputData = (options.paths === null) ? 'default' : options.paths;

  const modelProcessor = require(processorPath);
  const aggregateData = modelProcessor(data);
  const dropdownData = extractNames(data, ['division', 'district', 'upazila', 'union']);

  console.log(
    `// model: ${options.model}` + '\n' +
    `// generated: ${(new Date()).toString()}` + '\n' +
    `// input data: ${inputData}` + '\n' +
    'const aggregateData = \n' +
    JSON.stringify(aggregateData)
  );

  console.log(
    `// model: ${options.model}` + '\n' +
    `// generated: ${(new Date()).toString()}` + '\n' +
    `// input data: ${inputData}` + '\n' +
    'const dropdownData = \n' +
    JSON.stringify(dropdownData)
  );
}

main(cli.getParameters());
