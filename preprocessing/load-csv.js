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
function extractLocations(records) {
  const divisions = {};

  for (const r of records) {
    if (!r.Division || !r.District || !r.Upazila || !r.Union) {
      // skip because we don't have location
      continue;
    }

    if (!(r.Division in divisions)) {
      divisions[r.Division] = {
        wells_under_90: [],
        wells_over_90: [],
        districts: {},
        name: r.Division,
      };
    }
    const division = divisions[r.Division];

    if (!(r.District in division.districts)) {
      division.districts[r.District] = {
        wells_under_90: [],
        wells_over_90: [],
        upazilas: {},
        name: r.District,
        parent: division,
      };
    }
    const district = division.districts[r.District];

    if (!(r.Upazila in district.upazilas)) {
      district.upazilas[r.Upazila] = {
        wells_under_90: [],
        wells_over_90: [],
        unions: {},
        name: r.Upazila,
        parent: district,
      };
    }
    const upazila = district.upazilas[r.Upazila];

    if (!(r.Union in upazila.unions)) {
      upazila.unions[r.Union] = {
        wells_under_90: [],
        wells_over_90: [],
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
      division.wells_under_90.push(Number(r.Arsenic));
      district.wells_under_90.push(Number(r.Arsenic));
      upazila.wells_under_90.push(Number(r.Arsenic));
      union.wells_under_90.push(Number(r.Arsenic));
    } else {
      division.wells_over_90.push(Number(r.Arsenic));
      district.wells_over_90.push(Number(r.Arsenic));
      upazila.wells_over_90.push(Number(r.Arsenic));
      union.wells_over_90.push(Number(r.Arsenic));
    }
  }
}

function computeWellStats(location) {
  // sort the arsenic concentration data arrays
  location.wells_under_90.sort(numericalCompare);
  location.wells_over_90.sort(numericalCompare);

  // if we don't have enough data under 90
  //   take the computations from the parent or complain
  if (location.wells_under_90.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough wells under 90`);
    } else {
      location.as_median_under_90 = location.parent.as_median_under_90;
      location.as_max_under_90 = location.parent.as_max_under_90;
      location.lower_quantile_under_90 = location.parent.lower_quantile_under_90;
      location.upper_quantile_under_90 = location.parent.upper_quantile_under_90;
    }
  } else {
    // we do have enough data under 90
    location.as_median_under_90 = stats.median(location.wells_under_90);
    location.as_max_under_90 = stats.max(location.wells_under_90);
    location.lower_quantile_under_90 = stats.quantile(location.wells_under_90, 0.1);
    location.upper_quantile_under_90 = stats.quantile(location.wells_under_90, 0.9);
  }

  // if we don't have enough data over 90
  //   take the computations from the parent or complain
  if (location.wells_over_90.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough wells under 90`);
    } else {
      location.as_mean_over_90 = location.parent.as_mean_over_90;
    }
  } else {
    // we do have enough data over 90
    location.as_mean_over_90 = stats.mean(location.wells_over_90);
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
