const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const fs = require('fs');

function main(options) {
  // get data from CSV files
  const data = csvLoader(options.paths);

  // define array to hold rows of CSV file and push column headers
  const records = [];
  const headers = ['division',
    'district',
    'upazila',
    'union',
    '0-90',
    '90+',
    '90-150',
    '150+',
    '0-15.3',
    '15.3-45',
    '45-65',
    '65-90',
  ];
  records.push(headers);

  // loop through each well
  for (const division of Object.keys(data)) {
    for (const district of Object.keys(data[division].districts)) {
      for (const upazila of Object.keys(data[division].districts[district].upazilas)) {
        for (const union of Object.keys(data[division].districts[district].upazilas[upazila].unions)) {
          for (const well of data[division].districts[district].upazilas[upazila].unions[union].wells) {
            // for each well create record containing which regions it is in
            // and true or false depending on whether it is in each strata
            const record = [];
            record.push(division, district, upazila, union);
            /* eslint-disable */
            (well.depth >= 0 && well.depth <= 90)   ? record.push('true') : record.push('false');
            (well.depth > 90)                       ? record.push('true') : record.push('false');
            (well.depth >= 90 && well.depth <= 150) ? record.push('true') : record.push('false');
            (well.depth > 150)                      ? record.push('true') : record.push('false');
            (well.depth >= 0 && well.depth <= 15.3) ? record.push('true') : record.push('false');
            (well.depth > 15.3 && well.depth <= 45) ? record.push('true') : record.push('false');
            (well.depth > 45 && well.depth <= 65)   ? record.push('true') : record.push('false');
            (well.depth > 65 && well.depth <= 90)   ? record.push('true') : record.push('false');
            /* eslint-enable */
            records.push(record);
          }
        }
      }
    }
  }

  // write records to csv file
  let file = '';
  for (const record of records) {
    for (const item of record) {
      file += item + ',';
    }
    file += '\n';
  }
  fs.writeFileSync('../tests/scratch/data-per-strata-output.csv', file);
}

main(cli.getParameters());
