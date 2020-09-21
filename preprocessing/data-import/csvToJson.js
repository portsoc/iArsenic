const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common-copy');
const colors = require('colors');
const fs = require('fs');

function checkForMissingFlags(cliArgs) {
  if (cliArgs.inputFile == null) {
    console.warn(colors.red.bold('Please specify input file (-i flag)'));
    return false;
  }

  if (cliArgs.output == null) {
    console.warn(colors.yellow.bold('No output file specified (-o flag).'));
    cliArgs.output = 'csvToJsonOutput.json';
  }
  return true;
}

function main(cliArgs) {
  if (!checkForMissingFlags(cliArgs)) return;
  const inputJson = csvLoader(cliArgs.inputFile);
  const outputJson = JSON.stringify(inputJson);
  fs.writeFileSync(cliArgs.output, outputJson);
}

main(cli.getParameters());
