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
    retRecord.push((recordArr[7] * 0.3048).toFixed(2)); // * 0.3048 to convert depth to meters
    retRecord.push(recordArr[10]);

    retArr.push(retRecord);
    // retArr.push(recordArr); // uncomment to consilate csv without formatting
  }
  return retArr.join('\n');
}

function main() {
  const directory = 'r-data-csv/';
  const files = fs.readdirSync(directory);
  let consolidatedCsvArr = [];
  const headers = ['Division', 'District', 'Upazila', 'Union', 'Mouza', 'Depth', 'Arsenic'];

  // original headers, uncomment to consolidate csv without formatting
  // const headers = ["","DCODE","ZCODE","TCODE","UCODE","MCODE","VCODE","Depth","ArconValue","ArconCode","Concentration","DCODE_name","ZCODE_name","TCODE_name","UCODE_name","MCODE_name","VCODE_name"];
  for (const file of files) {
    const csvRaw = fs.readFileSync(directory + file, 'utf8');
    const csvArr = csvRaw.split('\n');
    csvArr.shift(); // remove headers
    const formattedCsvArr = formatCsv(csvArr);
    consolidatedCsvArr = consolidatedCsvArr.concat(formattedCsvArr);
  }
  consolidatedCsvArr.unshift(headers); // add single set of headers
  fs.writeFileSync('consolidatedCsv.csv', consolidatedCsvArr.join('\n'));
}

main();
