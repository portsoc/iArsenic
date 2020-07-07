const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');

function main(options) {
  // get data from CSV files
  const data = csvLoader(options.paths);

  // define array to hold rows of CSV file and push column headers
  const records = [];
  const headers = [
    'division',
    'district',
    'upazila',
    'union',
    'depth 0-90',
    'depth 90+',
    'depth 90-150',
    'depth 150+',
    'depth 0-15.3',
    'depth 15.3-45',
    'depth 45-65',
    'depth 65-90',
  ];
  records.push(headers);

  // loop through each well
  for (const division of Object.keys(data)) {
    const divisionObj = data[division];
    initStratas(divisionObj);
    for (const district of Object.keys(data[division].districts)) {
      const districtObj = data[division].districts[district];
      initStratas(districtObj);
      for (const upazila of Object.keys(data[division].districts[district].upazilas)) {
        const upazilaObj = data[division].districts[district].upazilas[upazila];
        initStratas(upazilaObj);
        for (const union of Object.keys(data[division].districts[district].upazilas[upazila].unions)) {
          const unionObj = data[division].districts[district].upazilas[upazila].unions[union];
          initStratas(unionObj);
          for (const well of data[division].districts[district].upazilas[upazila].unions[union].wells) {
            countStratas(divisionObj, districtObj, upazilaObj, unionObj, well);
          }
          pushRecord(records, division, district, upazila, union, unionObj);
        }
        pushRecord(records, division, district, upazila, '###', upazilaObj);
      }
      pushRecord(records, division, district, '###', '###', districtObj);
    }
    pushRecord(records, division, '###', '###', '###', divisionObj);
  }

  // write records to csv file
  for (const record of records) {
    record.join(',');
  }
  const contents = records.join('\n');
  console.log(contents);
}

function pushRecord(records, division, district, upazila, union, wellCountObj) {
  records.push([
    division,
    district,
    upazila,
    union,
    wellCountObj.zeroToNinety,
    wellCountObj.ninetyPlus,
    wellCountObj.ninetyToOneFifty,
    wellCountObj.oneFiftyPlus,
    wellCountObj.zeroToFifteenPointThree,
    wellCountObj.fifteenPointThreeToFourtyFive,
    wellCountObj.fortyFiveToSixtyFive,
    wellCountObj.sixtyFiveToNinety,
  ]);
}

function initStratas(object) {
  object.zeroToNinety = 0;
  object.ninetyPlus = 0;
  object.ninetyToOneFifty = 0;
  object.oneFiftyPlus = 0;
  object.zeroToFifteenPointThree = 0;
  object.fifteenPointThreeToFourtyFive = 0;
  object.fortyFiveToSixtyFive = 0;
  object.sixtyFiveToNinety = 0;
  return object;
}

function countStratas(divisionObj, districtObj, upazilaObj, unionObj, well) {
  const tempObj = [divisionObj, districtObj, upazilaObj, unionObj];
  for (const obj of tempObj) {
    if (well.depth > 15.3 && well.depth <= 45) obj.fifteenPointThreeToFourtyFive += 1;
    if (well.depth > 150) obj.oneFiftyPlus += 1;
    if (well.depth > 45 && well.depth <= 65) obj.fortyFiveToSixtyFive += 1;
    if (well.depth > 65 && well.depth <= 90) obj.sixtyFiveToNinety += 1;
    if (well.depth > 90) obj.ninetyPlus += 1;
    if (well.depth >= 0 && well.depth <= 15.3) obj.zeroToFifteenPointThree += 1;
    if (well.depth >= 0 && well.depth <= 90) obj.zeroToNinety += 1;
    if (well.depth >= 90 && well.depth <= 150) obj.ninetyToOneFifty += 1;
  }
}

function countStratasNew(divisionObj, districtObj, upazilaObj, unionObj, well) {
  const objects = [divisionObj, districtObj, upazilaObj, unionObj];
  for (const stratum of STRATA) {
    if (well.depth >= stratum.min && well.depth < stratum.max) {
      const prop = propName(stratum);
      for (const obj of objects) {
        obj[prop] += 1;
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
