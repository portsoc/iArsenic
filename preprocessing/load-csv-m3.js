const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const stats = require('./stats');

const MIN_DATA_COUNT = 7;

function readTheCSVFile() {
  const filePath = path.join(__dirname, '..', 'rscripts', 'data', 'AdmBnd1b.csv');
  const data = fs.readFileSync(filePath);

  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
}

// prepare the location-based data hierarchy if the location is new
// 3 Strata of wells by depth 'd': shallow(d<90), med(90<=d<150), deep(150<=d)
function extractLocations(records) {
  const divisions = {};

  for (const r of records) {
    if (!r.Division || !r.District || !r.Upazila || !r.Union) {
      // skip because we don't have location
      continue;
    }

    if (!(r.Division in divisions)) {
      divisions[r.Division] = {
        wells_shallow: [],
        wells_med: [],
        wells_deep: [],
        districts: {},
        name: r.Division,
      };
    }
    const division = divisions[r.Division];

    if (!(r.District in division.districts)) {
      division.districts[r.District] = {
        wells_shallow: [],
        wells_med: [],
        wells_deep: [],
        upazilas: {},
        name: r.District,
        parent: division,
      };
    }
    const district = division.districts[r.District];

    if (!(r.Upazila in district.upazilas)) {
      district.upazilas[r.Upazila] = {
        wells_shallow: [],
        wells_med: [],
        wells_deep: [],
        unions: {},
        name: r.Upazila,
        parent: district,
      };
    }
    const upazila = district.upazilas[r.Upazila];

    if (!(r.Union in upazila.unions)) {
      upazila.unions[r.Union] = {
        wells_shallow: [],
        wells_med: [],
        wells_deep: [],
        name: r.Union,
        parent: upazila,
      };
    }
  }

  return divisions;
}

function preprocessRecords(records) {
  const divisions = extractLocations(records);

  fillArsenicData(divisions, records);

  for (const div of Object.values(divisions)) {
    computeWellStats(div);
    for (const dis of Object.values(div.districts)) {
      computeWellStats(dis);
      for (const upa of Object.values(dis.upazilas)) {
        computeWellStats(upa);
        for (const uni of Object.values(upa.unions)) {
          computeWellStats(uni);
        }
      }
    }
  }

  return divisions;
}

// put each well's arsenic level data into the location hierarchy
function fillArsenicData(divisions, records) {
  for (const r of records) {
    if (!r.Division || !r.District || !r.Upazila || !r.Union ||
        !r.Depth || isNaN(r.Depth) || r.Arsenic === '' || isNaN(r.Arsenic)) {
      // skip because we don't have location or depth or arsenic level
      continue;
    }

    const division = divisions[r.Division];
    const district = division.districts[r.District];
    const upazila = district.upazilas[r.Upazila];
    const union = upazila.unions[r.Union];

    if (Number(r.Depth) < 90) {
      division.wells_shallow.push(Number(r.Arsenic));
      district.wells_shallow.push(Number(r.Arsenic));
      upazila.wells_shallow.push(Number(r.Arsenic));
      union.wells_shallow.push(Number(r.Arsenic));
    } else if (Number(r.Depth) < 150){
      division.wells_med.push(Number(r.Arsenic));
      district.wells_med.push(Number(r.Arsenic));
      upazila.wells_med.push(Number(r.Arsenic));
      union.wells_med.push(Number(r.Arsenic));
    } else {
      division.wells_deep.push(Number(r.Arsenic));
      district.wells_deep.push(Number(r.Arsenic));
      upazila.wells_deep.push(Number(r.Arsenic));
      union.wells_deep.push(Number(r.Arsenic));
    }
  }
}

function computeWellStats(location) {
  // sort the arsenic concentration data arrays
  location.wells_shallow.sort(numericalCompare);
  location.wells_med.sort(numericalCompare);
  location.wells_deep.sort(numericalCompare);

  // if we don't have enough shallow well data (d<90)
  //   take the computations from the parent or complain
  if (location.wells_shallow.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.med_s = location.parent.med_s;
      location.max_s = location.parent.max_s;
      location.low_s = location.parent.low_s;
      location.upp_s = location.parent.upp_s;
    }
  } else {
    // we do have enough data
    location.med_s = stats.median(location.wells_shallow);
    location.max_s = stats.max(location.wells_shallow);
    location.low_s = stats.quantile(location.wells_shallow, 0.1);
    location.upp_s = stats.quantile(location.wells_shallow, 0.9);
  }

  // if we don't have enough med well data (90<=d<150)
  //   take the computations from the parent or complain
  if (location.wells_med.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough med wells`);
    } else {
      location.med_m = location.parent.med_m;
      location.max_m = location.parent.max_m;
      location.low_m = location.parent.low_m;
      location.upp_m = location.parent.upp_m;
    }
  } else {
    // we do have enough data
    location.med_m = stats.median(location.wells_med);
    location.max_m = stats.max(location.wells_med);
    location.low_m = stats.quantile(location.wells_med, 0.1);
    location.upp_m = stats.quantile(location.wells_med, 0.9);
  }

  // if we don't have enough deep well data (150<=d)
  //   take the computations from the parent or complain
  if (location.wells_deep.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough deep wells`);
    } else {
      location.med_d = location.parent.med_d;
      location.max_d = location.parent.max_d;
      location.low_d = location.parent.low_d;
      location.upp_d = location.parent.upp_d;
    }
  } else {
    // we do have enough data
    location.med_d = stats.median(location.wells_deep);
    location.max_d = stats.max(location.wells_deep);
    location.low_d = stats.quantile(location.wells_deep, 0.1);
    location.upp_d = stats.quantile(location.wells_deep, 0.9);
  }
}

function numericalCompare(a, b) {
  return a - b;
}

function load() {
  const records = readTheCSVFile();
  console.debug(`Parsed ${records.length} records.`);

  const divisions = preprocessRecords(records);
  return divisions;
}

module.exports = load;
