const loadData = require('../lib/load-data');
const cli = require('../lib/cli-common');
const model5 = require('../models/model5-preprocessor.js');


function main(options) {
  const data = loadData(options.paths);
  model5.getWidenData(data);
}

main(cli.getParameters());
