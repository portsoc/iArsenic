const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const model5 = require('../models/model5-preprocessor.js');

const STRATA = [
  { min: 0, max: Infinity, header: 'depth 0+' },
  { min: 0, max: 15.3, header: 'depth 0-15.3', strataKey: 's15' },
  { min: 15.3, max: 45, header: 'depth 15.3-45', strataKey: 's45' },
  { min: 45, max: 65, header: 'depth 45-65', strataKey: 's65' },
  { min: 0, max: 90, header: 'depth 0-90' },
  { min: 90, max: 150, header: 'depth 90-150', strataKey: 's150' },
  { min: 150, max: Infinity, header: 'depth 150+', strataKey: 'sD' },
  { min: 90, max: Infinity, header: 'depth 90+' },
  { min: 65, max: 90, header: 'depth 65-90', strataKey: 's90' },
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
    'mouza',
  ];

  // Adds all the stratum headers to the headers array
  for (const stratum of STRATA) {
    headers.push(stratum.header);
    if (stratum.strataKey != null) {
      headers.push('distKm');
      headers.push('count');
    }
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

          for (const mou of Object.keys(uniObj.mouzas)) {
            const mouObj = uniObj.mouzas[mou];
            initStratas(mouObj);

            for (const well of mouObj.wells) {
              countStratas([divObj, disObj, upaObj, uniObj, mouObj], well);
            }
            pushRecord(records, div, dis, upa, uni, mou, mouObj);
          }
          pushRecord(records, div, dis, upa, uni, '###', uniObj);
        }
        pushRecord(records, div, dis, upa, '###', '###', upaObj);
      }
      pushRecord(records, div, dis, '###', '###', '###', disObj);
    }
    pushRecord(records, div, '###', '###', '###', '###', divObj);
  }

  // write records to csv file
  for (const record of records) {
    record.join(',');
  }
  const contents = records.join('\n');
  console.log(contents);
}

function pushRecord(records, div, dis, upa, uni, mou, wellCountObj) {
  const record = [div, dis, upa, uni, mou];

  for (const stratum of STRATA) {
    record.push(wellCountObj[stratum.header]);

    // add information about model 5 widening
    const wideningKey = stratum.strataKey + 'WideningRequired';
    if (stratum.strataKey != null) {
      const widening = wellCountObj[wideningKey];
      if (uni === '###') {
        record.push('', ''); // we don't aggregate widening information
      } else if (widening == null) {
        record.push('n/a', 'n/a'); // distance and count
      } else {
        record.push(widening.distance.toFixed(2));
        record.push(widening.count);
      }
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
