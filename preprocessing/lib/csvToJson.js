const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common-copy');
const colors = require('colors');
const fs = require('fs');

function checkForMissingFlags(cliArgs) {
  if (cliArgs.paths == null) {
    console.warn(colors.red.bold('Please specify input files (-p flag)'));
    return false;
  }

  if (cliArgs.output == null) {
    console.warn(colors.yellow.bold('No output file specified (-o flag).'));
    cliArgs.output = 'csvToJsonOutput.json';
  }
  return true;
}

function main(cliArgs) {
  console.log(cliArgs.paths);
  if (!checkForMissingFlags(cliArgs)) return;
  const inputJson = csvLoader(cliArgs.paths);
  const outputJson = JSON.stringify(inputJson);
  fs.writeFileSync(cliArgs.output, outputJson);
}

main(cli.getParameters());
