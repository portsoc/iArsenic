/* global describe, it, expect */

const corrections = require('../lib/name-corrections');

const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

describe('corrections', () => {
  // let's say corrections is like this:
  // 'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur':
  //   ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
  // 'Rajshahi#Dinajpur':
  //   ['Rangpur', 'Dinajpur']

  // firstly we should load name corrections from the file
  const correctionFiles = listDefaultFiles(path.join(__dirname, '..', '..', 'data', 'name-corrections'));
  const correctionsCSV = readTheCSVFiles(correctionFiles);
  corrections.loadCorrections(correctionsCSV);

  // if we don't have a correct, the array is assumed to be correct
  it('should assume array to be correct if we don\'t have a correct', () => {
    expect(corrections.correct(['a', 'b'])).toEqual(['a', 'b']);
  });

  // if we have a strictly matching correction, we apply it
  it('should apply a correction if we have a strictly matching correction', () => {
    expect(corrections.correct(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin  Sukhairrajapur']))
      .toEqual(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur']))
      .toEqual(['Rangpur', 'Dinajpur']);

    // and with mouzas
    expect(corrections.correct(['Sylhet', 'Sunamganj', 'Dharmapasha', 'Dakshin Sukhairrajapur', 'Subangshapur (Milanpur)']))
      .toEqual(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin  Sukhairra', 'Subangshapur (Milanpu']);
  });

  // if we have a partial correction, we apply it
  it('should apply a correction if there is a partial correction', () => {
    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a']))
      .toEqual(['Rangpur', 'Dinajpur', 'a']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a', 'b']))
      .toEqual(['Rangpur', 'Dinajpur', 'a', 'b']);
  });
});

// helper functions taken from load-data.js
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

function readTheCSVFiles(filePathList) {
  if (!Array.isArray(filePathList)) filePathList = [filePathList];

  const records = [];

  // parse each csv file and merge into records[]
  for (const filePath of filePathList) {
    const file = fs.readFileSync(filePath);
    const data = parse(file, {
      columns: true,
      skip_empty_lines: true,
    });

    for (const record of data) {
      records.push(record);
    }
  }

  return records;
}
