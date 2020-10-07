const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function readTheCSVFiles(filePathList) {
  if (!Array.isArray(filePathList)) filePathList = [filePathList];

  const records = [];

  // parse each csv file and merge into records[]
  for (const filePath of filePathList) {
    const file = fs.readFileSync(filePath);
    const data = parse(file, CSV_PARSE_OPTIONS);

    for (const record of data) {
      records.push(record);
    }
  }

  return records;
}

function listDefaultFiles() {
  const dirPath = path.join(__dirname, '..', '..', 'data');

  // gather file paths for each csv file in /data/
  const filePathList = [];
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.csv')) {
      const filePath = path.join(dirPath, file);
      filePathList.push(filePath);
    }
  }

  return filePathList;
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
      };
    }

    const district = division.districts[r.District];

    if (!(r.Upazila in district.upazilas)) {
      district.upazilas[r.Upazila] = {
        wells: [],
        unions: {},
        name: r.Upazila,
      };
    }

    const upazila = district.upazilas[r.Upazila];

    if (!(r.Union in upazila.unions)) {
      upazila.unions[r.Union] = {
        wells: [],
        name: r.Union,
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

    const well = {
      arsenic: Number(r.Arsenic),
      depth: Number(r.Depth),
    };

    division.wells.push(well);
    district.wells.push(well);
    upazila.wells.push(well);
    union.wells.push(well);
  }
}

function correctNames(records, corrections) {
  const correctRecords = [];
  for (const r of records) {
    const corrected = corrections.correct([
      r.Division,
      r.District,
      r.Upazila,
      r.Union,
    ]);

    if (corrected[0] !== 'none') {
      [r.Division, r.District, r.Upazila, r.Union] = corrected;
      correctRecords.push(r);
    }
  }
  return correctRecords;
}

function loadData(paths, options = {}) {
  if (!paths) paths = listDefaultFiles();

  const records = readTheCSVFiles(paths);
  let divisions;
  if (options.nameCorrections) {
    const correctedRecords = correctNames(records, options.nameCorrections);
    divisions = extractLocations(correctedRecords);
    fillArsenicData(divisions, correctedRecords);
    console.debug(`Parsed ${correctedRecords.length} corrected records of ${records.length} total records.`);
  } else {
    divisions = extractLocations(records);
    fillArsenicData(divisions, records);
    console.debug(`Parsed ${records.length} records.`);
  }

  return divisions;
}

module.exports = loadData;
