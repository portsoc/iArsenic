const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const nameCorrections = require('../lib/name-corrections');
const prompt = require('prompt-sync')();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const path = require('path');
const colors = require('colors');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function correct(correctNameData, uncheckedNameData, region) {
  if (correctDataContains(correctNameData, ...findRegionNamePath(region))) {
    // it's already correct
    return true;
  }

  // only shows regions inside misspelt region's parent region
  // corrections to parent region names are made on the fly
  const correctlySpelledSiblings = getCorrectlySpelledSiblingRegions(correctNameData, region);

  const chosenSibling = chooseCorrectSibling(correctlySpelledSiblings, region);

  if (chosenSibling == null) return false; // if the user doesn't select a sibling, move on

  // correct the name in the data
  const correctSpelling = chosenSibling.name;
  region.name = correctSpelling;

  const correction = {
    path: findRegionNamePath(region, 'oldName'),
    correct: findRegionNamePath(region),
  };

  // save the correction
  appendCorrectionToFile(correction);

  return true;
}

function appendCorrectionToFile(correction) {
  const correctionFile = path.join(__dirname, 'corrections.csv');

  // create an empty output file if it doesn't exist yet
  if (!fs.existsSync(correctionFile)) {
    const headers = 'path,correct' + '\n';
    fs.appendFileSync(correctionFile, headers);
  }

  const correctionRecord =
    correction.path.join('#') + ',' +
    correction.correct.join('#') + '\n';
  fs.appendFileSync(correctionFile, correctionRecord); // TODO log error & get path from -o
}

function chooseCorrectSibling(correctSiblings, misspeltRegion) {
  while (true) {
    console.log('');
    for (let i = 0; i < correctSiblings.length; i += 1) {
      const sibling = correctSiblings[i];
      const siblingName = colors.underline(sibling.name);
      const subRegionNames = colors.italic(getSubregionNames(sibling));
      console.log(i + 1, siblingName, subRegionNames);
    }

    const misspeltRegionName = colors.bold(misspeltRegion.name);
    const subRegionNames = colors.italic(getSubregionNames(misspeltRegion));
    console.log('Incorrect region: ', misspeltRegionName, subRegionNames);

    const userInput = prompt('Input ID of correct spelling: ');

    // quit on ctrl-c
    if (userInput == null) process.exit(0);

    // if user presses enter skip this correction
    if (userInput === '') return null;

    const inputIsValid = validInput(userInput, correctSiblings.length);
    if (inputIsValid) {
      return correctSiblings[userInput - 1];
    }

    // input wasn't valid
    console.log(colors.red.bold(`\nINVALID INPUT, please enter a number 1-${correctSiblings.length}`));
  }
}

function getSubregionNames(region) {
  if (region.subRegionsArr == null) return '';

  const namesArr = region.subRegionsArr.map(r => r.name);
  return `(${namesArr.sort().join(', ')})`;
}

function validInput(input, regionArrLength) {
  if (input > regionArrLength || input <= 0) return false; // if answer out of bounds of array
  if (isNaN(input)) return false; // if answer is not a number return false
  return true;
}

function getCorrectlySpelledSiblingRegions(correctNameData, region) {
  if (!region.parentRegion) {
    // if region is division sibling names are dataset values
    return Object.values(correctNameData).sort((a, b) => a.name.localeCompare(b.name));
  } else {
    const parentNameArr = findRegionNamePath(region.parentRegion);
    const correctlyNamedParent = findRegionByNameArr(correctNameData, parentNameArr);
    return correctlyNamedParent.subRegionsArr.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function findRegionNamePath(region, nameProp = 'name') {
  let currentRegion = region;
  const names = [];

  while (currentRegion != null) {
    names.unshift(currentRegion[nameProp]);
    currentRegion = currentRegion.parentRegion;
  }
  return names;
}

function findRegionByNameArr(dataset, arr) {
  const div = dataset[arr[0]];
  if (arr.length === 1) return div;

  const dis = div.districts[arr[1]];
  if (arr.length === 2) return dis;

  const upa = dis.upazilas[arr[2]];
  if (arr.length === 3) return upa;

  const uni = upa.unions[arr[3]];
  return uni;
}

function correctDataContains(correctNameData, ...regionNames) {
  const [topLevelName, ...restOfNames] = regionNames;

  const topRegion = correctNameData[topLevelName];

  // check the first name in search matches the top level of correctNameData
  if (topRegion == null) return false;

  // if we're not searching any deeper, we're done
  if (restOfNames.length === 0) return true;

  // check for the deeper names in the subregions
  return correctDataContains(topRegion.subRegions, ...restOfNames);
}

function applyCorrections(dataset) {
  for (const div of Object.values(dataset)) {
    applyCorrection(div);
    for (const dis of Object.values(div.districts)) {
      applyCorrection(dis);
      for (const upa of Object.values(dis.upazilas)) {
        applyCorrection(upa);
        for (const uni of Object.values(upa.unions)) {
          applyCorrection(uni);
        }
      }
    }
  }
}

function applyCorrection(region) {
  const path = findRegionNamePath(region, 'oldName');
  const corrected = nameCorrections.correct(path);

  // apply the inner-most correction
  region.name = corrected[corrected.length - 1];
}

function addRelativeRegionLinks(dataset) {
  for (const div of Object.values(dataset)) {
    div.subRegions = div.districts;
    div.subRegionsArr = Object.values(div.subRegions);
    for (const dis of Object.values(div.districts)) {
      dis.parentRegion = div;
      dis.subRegions = dis.upazilas;
      dis.subRegionsArr = Object.values(dis.subRegions);
      for (const upa of Object.values(dis.upazilas)) {
        upa.parentRegion = dis;
        upa.subRegions = upa.unions;
        upa.subRegionsArr = Object.values(upa.subRegions);
        for (const uni of Object.values(upa.unions)) {
          uni.parentRegion = upa;
        }
      }
    }
  }
}

function addOldNames(dataset) {
  for (const div of Object.values(dataset)) {
    div.oldName = div.name;
    for (const dis of Object.values(div.districts)) {
      dis.oldName = dis.name;
      for (const upa of Object.values(dis.upazilas)) {
        upa.oldName = upa.name;
        for (const uni of Object.values(upa.unions)) {
          uni.oldName = uni.name;
        }
      }
    }
  }
}

function main(cliArgs) {
  const correctNameData = csvLoader(cliArgs.paths); // use -p flag

  // TODO temporary default input file before we support -i
  const testFile = path.join(__dirname, 'small-test-dataset.csv');
  const uncheckedNameData = csvLoader([testFile]);

  addRelativeRegionLinks(correctNameData);
  addRelativeRegionLinks(uncheckedNameData);
  addOldNames(uncheckedNameData);

  // load existing corrections
  // TODO temporary default output file before we support -o
  const correctionFile = path.join(__dirname, 'corrections.csv');
  if (fs.existsSync(correctionFile)) {
    const corrections = parse(fs.readFileSync(correctionFile), CSV_PARSE_OPTIONS);
    nameCorrections.loadCorrections(corrections);
    applyCorrections(uncheckedNameData);
  }

  for (const div of Object.values(uncheckedNameData)) {
    const corrected = correct(correctNameData, uncheckedNameData, div);
    if (!corrected) continue; // don't try to correct sub-region names

    for (const dis of Object.values(div.districts)) {
      const corrected = correct(correctNameData, uncheckedNameData, dis);
      if (!corrected) continue; // don't try to correct sub-region names

      for (const upa of Object.values(dis.upazilas)) {
        const corrected = correct(correctNameData, uncheckedNameData, upa);
        if (!corrected) continue; // don't try to correct sub-region names

        for (const uni of Object.values(upa.unions)) {
          correct(correctNameData, uncheckedNameData, uni);
        }
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
