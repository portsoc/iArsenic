// Run script in terminal:
// node [script name/path] [data directory] [output directory]
// output-directory is not essential but will output to script directory


const fs = require('fs');

function formatCsv(csvArr) {
  const retArr = [];
  for (const record of csvArr) {
    const recordArr = record.split(',');
    const retRecord = [];

    retRecord.push(recordArr[11]);
    retRecord.push(recordArr[12]);
    retRecord.push(recordArr[13]);
    retRecord.push(recordArr[14]);
    retRecord.push(recordArr[15]);

    retRecord.push(feetToMeters(recordArr[7]));
    retRecord.push(recordArr[10]);

    retArr.push(retRecord);
    // retArr.push(recordArr); // uncomment to consilate csv without formatting
  }
  return retArr.join('\n');
}

function feetToMeters(feet) {
  return (feet * 0.3048).toFixed(2);
}

function main() {
  const args = process.argv; // Passed arguments
  args.splice(0, 2); // Removes default arguments
  console.log(args);

  if (args.length < 1) {
    console.log('No data directory specified');
    return;
  }
  const directory = args[0]+'/';
  const files = fs.readdirSync(directory);
  let consolidatedCsvArr = [];
  const headers = ['Division', 'District', 'Upazila', 'Union', 'Mouza', 'Depth', 'Arsenic'];

  // original headers, uncomment to consolidate csv without formatting
  // const headers = ["","DCODE","ZCODE","TCODE","UCODE","MCODE","VCODE","Depth","ArconValue","ArconCode","Concentration","DCODE_name","ZCODE_name","TCODE_name","UCODE_name","MCODE_name","VCODE_name"];
  for (const file of files) {
    const csvData = fs.readFileSync(directory + file, 'utf8');
    const csvArr = csvData.split('\n');
    csvArr.shift(); // remove headers
    const formattedCsvArr = formatCsv(csvArr);
    consolidatedCsvArr = consolidatedCsvArr.concat(formattedCsvArr);
  }
  consolidatedCsvArr.unshift(headers); // add single set of headers
  const outputFilePath = (args.length > 1) ? args[1]+'/consolidatedCsv.csv' : 'consolidatedCsv.csv';
  fs.writeFileSync(outputFilePath, consolidatedCsvArr.join('\n'));
  console.log('File written to', outputFilePath);
}

main();
