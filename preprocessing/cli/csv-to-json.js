/*
 * Converting CSV files to JSON
 *
 * This tool loads the well data and writes out the JSON internal format,
 * probably for inspection and debugging purposes.
 */

const csvLoader = require('./../lib/load-data');
const cli = require('./../lib/cli-common');
const colors = require('colors');
const fs = require('fs');

function checkForMissingFlags(cliArgs) {
  if (cliArgs.paths == null) {
    console.warn(colors.red.bold('Please specify input files (-p flag)'));
    return false;
  }

  if (cliArgs.output == null) {
    console.warn(colors.yellow.bold('No output file specified (-o flag).'));
    cliArgs.output = 'csv-to-json-output.json';
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
