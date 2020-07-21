const loadData = require('../lib/load-data');
const cli = require('../lib/cli-common');
const model5 = require('../models/model5-preprocessor.js');


function main(options) {
  console.time('loading');
  const data = loadData(options.paths);
  console.timeEnd('loading');

  console.time('time taken');
  model5.getWidenData(data);
  console.timeEnd('time taken');
}

main(cli.getParameters());
