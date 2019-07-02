const loadData = require('../lib/load-data');
const path = require('path');

const DATA = loadData();
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

function main(model) {
  if (!model) model = DEFAULT_MODEL;
  const processorPath = path.join(__dirname, '..', 'models', model + '-preprocessor');

  const modelProcessor = require(processorPath);
  const aggregateData = modelProcessor(DATA);
  const dropdownData = extractNames(DATA, ['division', 'district', 'upazila', 'union']);

  console.log('const aggregateData = \n' + JSON.stringify(aggregateData));
  console.log('const dropdownData = \n' + JSON.stringify(dropdownData));
}

main();
