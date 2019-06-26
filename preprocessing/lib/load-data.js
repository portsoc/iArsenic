const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const stats = require('./stats');

const MIN_DATA_COUNT = 7;

function readTheCSVFiles(filePaths) {
  if (!Array.isArray(filePaths)) filePaths = [filePaths];

  const records = [];

  // parse each csv file and merge into records[]
  for (let i = 0; i < filePaths.length; i += 1){
    let file = fs.readFileSync(filePaths[i]);
    let data = parse(file, {
      columns: true,
      skip_empty_lines: true,
    });
    Array.prototype.push.apply(records, data);
  };

  return records;
}

function listDefaultFiles(){
  const dirPath = path.join(__dirname, '..', '..', 'data');

  files = [];

  // gather file paths for each csv file in /data/
  fs.readdirSync(dirPath).forEach(file => {
    if (file.includes(".csv")) {
      let filePath = path.join(dirPath, file);
      files.push(filePath);
    }
  });

  return files;
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
        wells: [],
        districts: {},
        name: r.Division,
      };
    }
    const division = divisions[r.Division];

    if (!(r.District in division.districts)) {
      division.districts[r.District] = {
        wells: [],
        upazilas: {},
        name: r.District,
        parent: division,
      };
    }
    const district = division.districts[r.District];

    if (!(r.Upazila in district.upazilas)) {
      district.upazilas[r.Upazila] = {
        wells: [],
        unions: {},
        name: r.Upazila,
        parent: district,
      };
    }
    const upazila = district.upazilas[r.Upazila];

    if (!(r.Union in upazila.unions)) {
      upazila.unions[r.Union] = {
        wells: [],
        name: r.Union,
        parent: upazila,
      };
    }
  }
  return divisions;
}

// put each well's arsenic level and depth data into the location hierarchy
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

    const wellValues = {
      arsenic: Number(r.Arsenic),
      depth: Number(r.Depth)
    };

      division.wells.push(wellValues);
      district.wells.push(wellValues);
      upazila.wells.push(wellValues);
      union.wells.push(wellValues);
  }
}

function loadData(paths) {
  if (!paths) paths = listDefaultFiles();

  const records = readTheCSVFiles(paths);
  const divisions = extractLocations(records);

  fillArsenicData(divisions, records);
  console.debug(`Parsed ${records.length} records.`);
  console.log(divisions)
  return divisions;
}

loadData();

module.exports = loadData;
