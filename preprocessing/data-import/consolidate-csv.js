// converts the output of rdata-to-csv.r

// Run script in terminal:
// node [script name/path] [input csv files (use *.csv)] TODO switch to -p flag??
// specify output with > outputFile.csv
// output-directory is not essential but will output to script directory

const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const csvStringify = require('csv-stringify/lib/sync');
const cli = require('../lib/cli-common');

const CSV_PARSE_OPTIONS = { columns: true, skip_empty_lines: true };
const CSV_STRINGIFY_OPTIONS = { header: true };

const HEADERS = [
  { input: 'DCODE_name', output: 'Division' },
  { input: 'ZCODE_name', output: 'District' },
  { input: 'TCODE_name', output: 'Upazila' },
  { input: 'UCODE_name', output: 'Union' },
  { input: 'MCODE_name', output: 'Mouza' },
  { input: 'Depth', output: 'Depth' },
  { input: 'Concentration', output: 'Arsenic' },
];

function feetToMeters(feet) {
  return (feet * 0.3048).toFixed(1); // our algorithms do not care about fractions of meters
}

function readFiles(filepaths) {
  const inputCsvFiles = [];
  for (const filepath of filepaths) {
    const rawFile = fs.readFileSync(filepath);
    const csvFile = csvParse(rawFile, CSV_PARSE_OPTIONS);
    inputCsvFiles.push(csvFile);
  }
  return inputCsvFiles.flat();
}

// converts from the input format from rdata into our desired output:
// 1. extracts only the columns we care about (see HEADERS)
// 2. converts depth from feet to meters
function convert(inputCsv) {
  const outputCsv = [];
  for (const inputRecord of inputCsv) {
    const outputRecord = {};

    for (const header of HEADERS) {
      outputRecord[header.output] = inputRecord[header.input];
    }

    // convert depth to meters
    outputRecord.Depth = feetToMeters(outputRecord.Depth);

    outputCsv.push(outputRecord);
  }
  return outputCsv;
}

function main(cliArgs) {
  const inputCsvData = readFiles(cliArgs.paths);
  const outputData = convert(inputCsvData);
  const outputCsv = csvStringify(outputData, CSV_STRINGIFY_OPTIONS);

  // send to stdout
  console.log(outputCsv);
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
