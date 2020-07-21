const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const model5 = require('../models/model5-preprocessor.js');

const STRATA = [
  { min: 0, max: Infinity, header: 'depth 0+' },
  { min: 0, max: 15.3, header: 'depth 0-15.3', strataKey: 's15' },
  { min: 15.3, max: 45, header: 'depth 15.3-45', strataKey: 's45' },
  { min: 45, max: 65, header: 'depth 45-65', strataKey: 's65' },
  { min: 0, max: 90, header: 'depth 0-90', strataKey: 's90' },
  { min: 90, max: 150, header: 'depth 90-150', strataKey: 's150' },
  { min: 150, max: Infinity, header: 'depth 150+', strataKey: 'sD' },
  { min: 90, max: Infinity, header: 'depth 90+' },
  { min: 65, max: 90, header: 'depth 65-90' },
];

function main(options) {
  // get data from CSV files
  const data = csvLoader(options.paths);
  model5.computeWidening(data);

  // define array to hold rows of CSV file and push column headers

  const records = [];
  const headers = [
    'division',
    'district',
    'upazila',
    'union',
  ];

  // Adds all the stratum headers to the headers array
  for (const stratum of STRATA) {
    headers.push(stratum.header);
    headers.push('distKm');
    headers.push('count');
  }

  records.push(headers);

  // loop through each well
  for (const div of Object.keys(data)) {
    const divObj = data[div];
    initStratas(divObj);

    for (const dis of Object.keys(divObj.districts)) {
      const disObj = divObj.districts[dis];
      initStratas(disObj);

      for (const upa of Object.keys(disObj.upazilas)) {
        const upaObj = disObj.upazilas[upa];
        initStratas(upaObj);

        for (const uni of Object.keys(upaObj.unions)) {
          const uniObj = upaObj.unions[uni];
          initStratas(uniObj);

          for (const well of uniObj.wells) {
            const regionArr = [divObj, disObj, upaObj, uniObj];
            countStratas(regionArr, well);
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
  const record = [div, dis, upa, uni];

  for (const stratum of STRATA) {
    record.push(wellCountObj[stratum.header]);
    const wideningKey = stratum.strataKey + 'WideningRequired';
    if (stratum.strataKey === undefined || uni === '###' || wellCountObj[wideningKey] == null) {
      record.push('n/a'); // widening distance
      record.push('n/a'); // widening count
    } else {
      record.push(wellCountObj[wideningKey].distance); // widening distance
      record.push(wellCountObj[wideningKey].count); // widening coun
    }
  }

  records.push(record);
}

function initStratas(obj) {
  for (const stratum of STRATA) {
    obj[stratum.header] = 0;
  }
}

function countStratas(regions, well) {
  for (const stratum of STRATA) {
    if (well.depth >= stratum.min && well.depth < stratum.max) {
      for (const region of regions) {
        region[stratum.header] += 1;
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
