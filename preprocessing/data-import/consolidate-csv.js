// Run script in terminal:
// node [script name/path] [data directory] [output directory]
// output-directory is not essential but will output to script directory

const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify/lib/sync');

const CSV_PARSE_OPTIONS = { columns: true, skip_empty_lines: true };

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
  return (feet * 0.3048).toFixed(2);
}

function getDirectory() {
  // TODO get directory from cli common
  return 'r-data-csv/';
}

function getCsvFilepaths(directory) {
  // gather file paths for each csv file in /data/
  const filePathList = [];
  const files = fs.readdirSync(directory);
  const csvFiles = files.filter(file => file.endsWith('.csv'));
  for (const file of csvFiles) {
    const filePath = path.join(directory, file);
    filePathList.push(filePath);
  }
  return filePathList;
}

function getFiles(filepaths) {
  const inputCsvFiles = [];
  for (const filepath of filepaths) {
    const rawFile = fs.readFileSync(filepath);
    const csvFile = parse(rawFile, CSV_PARSE_OPTIONS);
    inputCsvFiles.push(csvFile);
  }
  return inputCsvFiles;
}

function consolidateCsv(inputCsvFiles) {
  let retArr = [];
  inputCsvFiles.forEach(file => { retArr = retArr.concat(file); });
  return retArr;
}

function formatCsv(inputCsv) {
  const outputCsv = [];
  for (const inputRecord of inputCsv) {
    const outputRecord = {};
    HEADERS.forEach(header => { outputRecord[header.output] = inputRecord[header.input]; });
    outputRecord.Depth = feetToMeters(outputRecord.Depth);
    outputCsv.push(outputRecord);
  }
  return outputCsv;
}

function convertToCsv(outputJson) {
  const outputHeaders = HEADERS.map(header => header.output);
  const outputHeadersRecord = outputHeaders.join(',') + '\n';
  return outputHeadersRecord + stringify(outputJson);
}

function main() {
  const directory = getDirectory(); // get directory from arguments
  const csvFilepaths = getCsvFilepaths(directory); // get filepaths from directory (csv only)
  const inputCsvFiles = getFiles(csvFilepaths); // get csv files from filepaths
  const allInputCsvFiles = consolidateCsv(inputCsvFiles); // join all csv files into one array
  const outputJson = formatCsv(allInputCsvFiles); // format csv files
  const outputCsv = convertToCsv(outputJson); // convert from json format to csv
  console.log(outputCsv);
}

main();
