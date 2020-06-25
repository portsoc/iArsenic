const csvLoader = require('../lib/load-data'); // should this be called csvLoader (test-all.js) or loadData (produce-aggregate...js)?
const cli = require('../lib/cli-common');

function main(options) {
  console.log(options);
  const preprocessor = options.model.preprocessor;
  const produceEstimate = options.model.estimator;
  checkOutputDirectory(options);
  checkModelId(options);
  const paths = getFilesFromPath(options);
  const data = csvLoader(paths);

  let wellCount = 0;
  let totDepth = 0;
  let totArsenic = 0;

  const preprocessedData = preprocessor(data); // what does preprocessor do?

  // using Obj.keys of preprocessedData gives same output as using data
  for (const division of Object.keys(preprocessedData)) {
    for (const well of data[division].wells) {
      wellCount += 1;
      totDepth += well.depth;
      totArsenic += well.arsenic;
    }
  }

  const avgArsenic = totArsenic / wellCount;
  const avgDepth = totDepth / wellCount;
  console.log('average arsenic content: ' + avgArsenic);
  console.log('average depth: ' + avgDepth);
}

function getFilesFromPath(options) {
  if (options.paths === undefined) {
    console.log(`no path to csv files has been specified.
      /lib/load-data will load every csv file in /data/ by default`);
  } else {
    // can a folder containing csv files be passed via -p?
    console.log('Path to csv file / files: ' + options.paths);
    return options.paths;
  }
}

function checkModelId(options) {
  console.log('model id (-m): ' + options.model.id);
  if (options.model.id === 'model4') {
    console.log(` This is the default model,
      you can select other models with the -m flag`);
  }
}

function checkOutputDirectory(options) {
  if (options.output === undefined) {
    console.log(`No output directory was specified.
      Should there be a default output directory instead of outputting to the console?`);
  } else {
    console.log('output directory (-o): ' + options.output);
  }
}

main(cli.getParameters());
