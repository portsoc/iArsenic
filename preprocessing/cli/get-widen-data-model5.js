const loadData = require('../lib/load-data');
const cli = require('../lib/cli-common');
const model5 = require('../models/model5-preprocessor.js');


function main(options) {
  const startTime = new Date().getTime();
  const data = loadData(options.paths);
  model5.getWidenData(data);
  const endTime = new Date().getTime();
  const timeTaken = (endTime - startTime) / 1000;
  console.log('time taken: ' + timeTaken + ' seconds');
}

main(cli.getParameters());
