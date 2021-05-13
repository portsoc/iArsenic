/* eslint-disable camelcase */
// converts the output of rdata-to-csv.r to a single csv file

// Run script in terminal:
// node [script name/path] [input csv files (use *.csv)] TODO switch to -p flag??
// specify output with > outputFile.csv
// output-directory is not essential but will output to script directory

import * as fs from 'fs';
import { CliParameters, getParameters } from '../lib/cli-common';
import csvParse from 'csv-parse/lib/sync';
import csvStringify from 'csv-stringify/lib/sync';

const CSV_PARSE_OPTIONS = { columns: true, skip_empty_lines: true };
const CSV_STRINGIFY_OPTIONS = { header: true };

function feetToMeters(feet: number): string {
  return (feet * 0.3048).toFixed(1); // our algorithms do not care about fractions of meters
}

interface RecordWell {
  Division: string,
  District: string,
  Upazila: string,
  Union: string,
  Mouza: string,
  Depth: string,
  Arsenic: number,
}

interface CSV {
  Number: string,
  DCODE: number,
  ZCODE: number,
  TCODE: number,
  UCODE: number,
  MCODE: number,
  VCODE: number,
  Depth: string,
  ArconValue: string,
  ArconCode: number,
  Concentration: number,
  DCODE_name: string,
  ZCODE_name: string,
  TCODE_name: string,
  UCODE_name: string,
  MCODE_name: string,
  VCODE_name: string,
}

function readFiles(filepaths: string[] | string): CSV[] {
  const inputCsvFiles: CSV[][] = [];
  for (const filepath of filepaths) {
    const rawFile: Buffer = fs.readFileSync(filepath);
    const csvFile = csvParse(rawFile, CSV_PARSE_OPTIONS) as CSV[];
    inputCsvFiles.push(csvFile);
  }
  return inputCsvFiles.flat();
}

// converts from the input format from rdata into our desired output:
// 1. extracts only the columns we care about (see HEADERS)
// 2. converts depth from feet to meters
function convert(inputCsv: CSV[]) {
  const outputCsv: RecordWell[] = [];
  for (const inputRecordWell of inputCsv) {
    const outputRecordWell: RecordWell = {
      Division: inputRecordWell.DCODE_name,
      District: inputRecordWell.ZCODE_name,
      Upazila: inputRecordWell.TCODE_name,
      Union: inputRecordWell.UCODE_name,
      Mouza: inputRecordWell.MCODE_name,
      Depth: inputRecordWell.Depth,
      Arsenic: inputRecordWell.Concentration,
    };

    // convert depth to meters
    outputRecordWell.Depth = feetToMeters(parseFloat(inputRecordWell.Depth));

    outputCsv.push(outputRecordWell);
  }
  return outputCsv;
}

async function main(optionsPromise: Promise<CliParameters>) {
  const options = await optionsPromise;
  const inputCsvData: CSV[] = readFiles(options.paths);
  const outputData: RecordWell[] = convert(inputCsvData);
  const outputCsv = csvStringify(outputData, CSV_STRINGIFY_OPTIONS);

  // send to stdout
  console.log(outputCsv);
}

console.debug = console.error; // redirect debug to stderr
main(getParameters()).catch(console.error);
