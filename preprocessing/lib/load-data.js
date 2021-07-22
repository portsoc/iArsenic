/*
 * Loads regions from CSV files, corrects their names, and returns them
 * as the following structure:
 *
 * {
 *   'division name': {
 *     wells: [...], // array of all wells, and depths of arsenic in the division
 *     districts: {
 *       'district name': {
 *         wells: [...],
 *         upazilas: {
 *           'upazila name': {
 *             wells: [...],
 *             unions: {
 *               'union name': {
 *                 wells: [...],
 *                 mouzas: {
 *                   'mouza name': {
 *                     wells: [...]
 *                   },
 *                   ... further mouzas
 *                 }
 *               },
 *               ... further unions
 *             }
 *           },
 *           ... further upazilas
 *         }
 *       },
 *       ... further districts
 *     }
 *   },
 *   ... further divisions
 * }
 */

const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const nameCorrections = require('../lib/name-corrections');

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

function listDefaultFiles(dirPath) {
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
    if (!r.Division || !r.District || !r.Upazila || !r.Union || !r.Mouza) {
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
        mouzas: {},
        name: r.Union,
      };
    }

    const union = upazila.unions[r.Union];

    if (!(r.Mouza in union.mouzas)) {
      union.mouzas[r.Mouza] = {
        wells: [],
        nearbyRegions: [],
        name: r.Mouza,
      };
    }
  }

  return divisions;
}

// put each well's arsenic level and depth data into the location hierarchy
function fillArsenicData(divisions, records) {
  for (const r of records) {
    if (!r.Division || !r.District || !r.Upazila || !r.Union || !r.Mouza ||
        !r.Depth || isNaN(r.Depth) || r.Arsenic === '' || isNaN(r.Arsenic)) {
      // skip because we don't have location or depth or arsenic level
      continue;
    }

    const division = divisions[r.Division];
    const district = division.districts[r.District];
    const upazila = district.upazilas[r.Upazila];
    const union = upazila.unions[r.Union];
    const mouza = union.mouzas[r.Mouza];

    const well = {
      arsenic: Number(r.Arsenic),
      depth: Number(r.Depth),
    };

    division.wells.push(well);
    district.wells.push(well);
    upazila.wells.push(well);
    union.wells.push(well);
    mouza.wells.push(well);
  }
}

function correctNames(records, correctionsLength) {
  if (!correctionsLength) return records;

  const correctedRecords = [];
  for (const r of records) {
    const corrected = nameCorrections.correct([
      r.Division,
      r.District,
      r.Upazila,
      r.Union,
      r.Mouza,
    ]);

    if (corrected != null) {
      [r.Division, r.District, r.Upazila, r.Union, r.Mouza] = corrected;
      correctedRecords.push(r);
    }
  }
  return correctedRecords;
}

function loadCorrections(dataPath, options, records) {
  if (!options.corrections) {
    options.corrections = listDefaultFiles(path.join(dataPath, 'name-corrections'));
  }

  const corrections = readTheCSVFiles(options.corrections);
  nameCorrections.loadCorrections(corrections);

  return correctNames(records, corrections?.length);
}

function loadData(paths, options = {}, corrections = true) {
  const dataPath = path.join(__dirname, '..', '..', 'data');

  if (!paths) paths = listDefaultFiles(dataPath);

  const parsedRecords = readTheCSVFiles(paths);
  const correctedRecords = (corrections) ? loadCorrections(dataPath, options, parsedRecords) : undefined;

  const records = (corrections) ? correctedRecords : parsedRecords;

  const divisions = extractLocations(records);
  fillArsenicData(divisions, records);

  const correctionOutput = ((corrections) ? ` with ${correctedRecords.length} corrected records.` : '.');
  console.debug(`Parsed ${parsedRecords.length} total records` + correctionOutput);

  return divisions;
}

module.exports = {
  loadData,
  readTheCSVFiles,
};
