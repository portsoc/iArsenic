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

function splitAggregateDataIntoDistricts(aggregateData) {
  const retval = [];

  for (const divName of Object.keys(aggregateData)) {
    const div = aggregateData[divName];
    for (const disName of Object.keys(div.districts)) {
      const dis = div.districts[disName];

      // ouput just the given division and district,
      // basically a subset of the aggregateData but in the same structure
      const data = {
        [divName]: {
          districts: {
            [disName]: {
              upazilas: dis.upazilas,
            },
          },
        },
      };
      retval.push({
        divName,
        disName,
        data,
      });
    }
  }

  console.log(retval.length);
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

  const data = loadData(options.paths, options);

  const modelPreprocessor = options.model.preprocessor;
  // we only want to split up the aggregate data if model5 is being used
  const doSplitAggregateData = options.model.id === 'model5';

  const aggregateData = modelPreprocessor(data);
  const dropdownData = extractNames(data, ['division', 'district', 'upazila', 'union', 'mouza']);

  const estimatorContent = fs.readFileSync(options.model.estimatorPath);

  if (doSplitAggregateData) {
    const districts = splitAggregateDataIntoDistricts(aggregateData);
    for (const district of districts) {
      output(options, `${district.divName}-${district.disName}.json`, JSON.stringify(district.data), 'aggregate-data/');
    }
    // write metadata so that we know when it was generated
    output(options, 'metadata.txt', '', 'aggregate-data/');
  } else {
    output(options, 'aggregate-data.js', 'const aggregateData = ' + JSON.stringify(aggregateData));
  }

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

function output(options, filename, content, subdirectory) {
  // if the output is not json, add metadata
  content = filename.endsWith('.json') ? content : fileHeading(options) + content;

  if (!options.output) {
    // if no output directory, output to console
    console.log(filename + ':');
    console.log(content);
  } else {
    // make sure that, if there's a subdirectory, it exists
    if (subdirectory) {
      const subdir = path.join(options.output, subdirectory);
      if (!fs.existsSync(subdir)) {
        fs.mkdirSync(subdir);
      }
    }

    // put it in the file
    const filePath = path.join(options.output, subdirectory ?? '', filename);
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
