/*
 * Loads regions from CSV files, corrects their names, and returns them
 * as the following structure:
 *
 * {
 *   <division name>: {
 *     wells: [...], // array of all wells, and depths of arsenic in the division
 *     districts: {
 *       <district name>: {
 *         wells: [...],
 *         upazilas: {
 *           <upazila name>: {
 *             wells: [...],
 *             unions: {
 *               <union name>: {
 *                 wells: [...],
 *                 mouzas: {
 *                   <mouza name>: {
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

import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import path from 'path';
import { BasicDataSet, Region } from './types';

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

interface Record {
  Division: string,
  District: string,
  Upazila: string,
  Depth: number,
  Arsenic: number,
  Union: string,
}

function readTheCSVFiles(filePathList: string[] | string) {
  if (!Array.isArray(filePathList)) filePathList = [filePathList];

  const records = [];

  // parse each csv file and merge into records[]
  for (const filePath of filePathList) {
    const file = fs.readFileSync(filePath);
    const data = parse(file, CSV_PARSE_OPTIONS) as Record[];

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
function extractLocations(records: Record[]) {
  const divisions: BasicDataSet<Region> = {};

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
function fillArsenicData(divisions: BasicDataSet<Region>, records: Record[]) {
  for (const r of records) {
    if (!r.Division || !r.District || !r.Upazila || !r.Union ||
        !r.Depth || isNaN(r.Depth) || r.Arsenic === 0 || isNaN(r.Arsenic)) {
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

function correctNames(
  records: Record[],
  corrections?: {
    correct: (arr: string[])=> string[] | null,
  },
) {
  if (corrections?.correct === undefined) return records;

  const correctRecords = [];
  for (const r of records) {
    const corrected = corrections.correct([
      r.Division,
      r.District,
      r.Upazila,
      r.Union,
    ]);

    if (corrected != null) {
      [r.Division, r.District, r.Upazila, r.Union] = corrected;
      correctRecords.push(r);
    }
  }
  return correctRecords;
}

export function loadData(
  paths: string | string[],
  options?: {
    correct: (arr: string[])=> string[] | null,
  },
): BasicDataSet<Region> {
  if (!paths) paths = listDefaultFiles();

  const records = readTheCSVFiles(paths);
  let correctedRecords: Record[];
  if (options !== undefined) {
    correctedRecords = correctNames(records, options);
  } else {
    correctedRecords = correctNames(records);
  }

  const divisions = extractLocations(correctedRecords);
  fillArsenicData(divisions, correctedRecords);
  console.debug(`Parsed ${correctedRecords.length} corrected records of ${records.length} total records.`);

  return divisions;
}
