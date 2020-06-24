const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const CSV_PARSE_OPTIONS = { // what is this naming convention?
  columns: true,
  skip_empty_lines: true,
};

function readTheCSVFiles(filePathList) {
  // if Array.isArray?? what is Array?? why would this not be an array?? AHH
  if (!Array.isArray(filePathList)) filePathList = [filePathList];

  const records = [];

  // parse each csv file and merge into records[]
  for (const filePath of filePathList) {
    const file = fs.readFileSync(filePath);
    const data = parse(file, CSV_PARSE_OPTIONS);
    records.push(...data); // ...data??? what is ellipses
  }

  return records; // records is an aggregate of EVERY csv file in data/
}

function listDefaultFiles() { // list default files if no specific files given to load-data.js
  // dirPath is the filepath to the data sources
  const dirPath = path.join(__dirname, '..', '..', 'data');

  // gather file paths for each csv file in /data/
  const filePathList = [];

  // readdirSync creates an array containing all the file names in a folder
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.csv')) {
      // loop through each filename and create an array of their location
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

    // if the division of this record hasn't been encountered yet
    // add this division to the divisions object (creating a hierarchy)
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

      // could we have purged these records earlier on when checking if a record doesn't have
      // an upazila / district etc in extractLocations
      continue;
    }

    // get region objects for this record
    const division = divisions[r.Division];
    const district = division.districts[r.District];
    const upazila = district.upazilas[r.Upazila];
    const union = upazila.unions[r.Union];

    // create well object for well data on this record
    const well = {
      arsenic: Number(r.Arsenic),
      depth: Number(r.Depth),
    };

    // push well data into well array for every region
    // if a well is in a union it is also in the upazila that union
    // is in so is also in the district that upazila is in etc
    division.wells.push(well);
    district.wells.push(well);
    upazila.wells.push(well);
    union.wells.push(well);
  }
}

function loadData(paths) {
  // returns filepaths of all csv files in data folder
  if (!paths) paths = listDefaultFiles(); // paths is not false if paths are passed
  // how do you pass paths to load-data.js? -- -p in cli-common

  // records is aggregate of every csv file in data folder
  const records = readTheCSVFiles(paths);

  // hierarchy of data by segment
  const divisions = extractLocations(records);

  // add arsenic data to divisions data
  fillArsenicData(divisions, records);

  console.debug(`Parsed ${records.length} records.`);

  return divisions;
}

module.exports = loadData;
