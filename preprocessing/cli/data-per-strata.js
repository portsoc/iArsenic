const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');

const STRATA = [
  { min: 0, max: Infinity, header: 'depth 0+' },
  { min: 0, max: 90, header: 'depth 0-90' },
  { min: 90, max: Infinity, header: 'depth 90+' },
  { min: 90, max: 150, header: 'depth 90-150'},
  { min: 150, max: Infinity, header: 'depth 150+' },
  { min: 0, max: 15.3, header: 'depth 0-15.3' },
  { min: 15.3, max: 45, header: 'depth 15.3-45' },
  { min: 45, max: 65, header: 'depth 45-65' },
  { min: 65, max: 90, header: 'depth 65-90' },
];

function main(options) {
  // get data from CSV files
  const data = csvLoader(options.paths);

  // define array to hold rows of CSV file and push column headers

  const records = [];
  const headers = [
    'division',
    'district',
    'upazila',
    'union'
  ];

  // Adds all the stratum headers to the headers array
  for (const stratum of STRATA) {
    headers.push(stratum.header);
  }

  records.push(headers);

  // loop through each well
  for (const div of Object.keys(data)) {
    const divObj = data[div];
    initStratas(divObj);
    for (const dis of Object.keys(data[div].districts)) {
      const disObj = data[div].districts[dis];
      initStratas(disObj);
      for (const upa of Object.keys(data[div].districts[dis].upazilas)) {
        const upaObj = data[div].districts[dis].upazilas[upa];
        initStratas(upaObj);
        for (const uni of Object.keys(data[div].districts[dis].upazilas[upa].unions)) {
          const uniObj = data[div].districts[dis].upazilas[upa].unions[uni];
          initStratas(uniObj);
          for (const well of data[div].districts[dis].upazilas[upa].unions[uni].wells) {
            countStratas([divObj, disObj, upaObj, uniObj], well);
          }
          pushRecord(records, div, dis, upa, uni, uniObj);
        }
        pushRecord(records, div, dis, upa, '###', upaObj);
      }
      pushRecord(records, div, dis, '###', '###', disObj);
    }
    pushRecord(records, div, '###', '###', '###', divObj);
  }
  // write records to csv file
  for (const record of records) {
    record.join(',');
  }
  const contents = records.join('\n');
  console.log(contents);
}

function pushRecord(records, div, dis, upa, uni, wellCountObj) {
  let record = [div, dis, upa, uni];
  for (const stratum of STRATA) {
    record.push(wellCountObj[stratum.header]);
  }
  records.push(record);
}

function initStratas(obj) {
  for (const stratum of STRATA) {
    obj[stratum.header] = 0;
  }
}

function countStratas(objects, well) {
  for (const stratum of STRATA) {
    if (well.depth >= stratum.min && well.depth <= stratum.max) {
      for (const obj of objects) {
        obj[stratum.header] += 1;
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
