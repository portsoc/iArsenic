const fs = require('fs');
const path = require('path');

const loadData = require('../lib/load-data');
const cli = require('../lib/cli-common');

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

function main(options) {
  checkOutputDirectory(options);

  const data = loadData(options.paths);

  const modelPreprocessor = options.model.preprocessor;

  const aggregateData = modelPreprocessor(data);
  const dropdownData = extractNames(data, ['division', 'district', 'upazila', 'union', 'mouza']);

  const estimatorContent = fs.readFileSync(options.model.estimatorPath);

  output(options, 'aggregate-data.js', 'const aggregateData = ' + JSON.stringify(aggregateData));
  output(options, 'dropdown-data.js', 'const dropdownData = ' + JSON.stringify(dropdownData));
  output(options, 'estimator.js', estimatorContent);
}

function fileHeading(options) {
  const inputData = (options.paths == null) ? 'default' : `[ ${options.paths.join(', ')} ]`;

  return `// model: ${options.model.id}
// generated: ${process.env.OVERRIDE_DATE || (new Date()).toString()}
// input data: ${inputData}
`;
}

function output(options, filename, content) {
  content = fileHeading(options) + content;
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

function checkOutputDirectory(options) {
  // check the output directory exists
  if (options.output) {
    try {
      const fileInfo = fs.statSync(options.output);
      if (!fileInfo.isDirectory()) {
        console.error(`error: not a directory: ${options.output}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(`error: cannot access directory: ${e.message}`);
      process.exit(1);
    }
  }
}

main(cli.getParameters());
