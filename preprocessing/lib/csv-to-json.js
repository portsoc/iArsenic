/*
 * Converting CSV files to JSON
 *
 * This script checks if the path and output flags of the object returned in
 * ./cli-common.js are missing, then writes the input CSV as JSON in the
 * specified file.
 */

const csvLoader = require('./load-data');
const cli = require('./cli-common');
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
