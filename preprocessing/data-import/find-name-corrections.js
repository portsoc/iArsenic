const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const path = require('path');
const colors = require('colors');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function getCorrections(correctNameData, uncheckedNameData, region) {
  // only shows regions inside misspelt region's parent region
  // corrections to parent region names are made on the fly
  const correctlySpelledSiblings = getCorrectlySpelledSiblingRegions(correctNameData, region);

  const chosenSibling = chooseCorrectSibling(correctlySpelledSiblings, region);

  if (chosenSibling == null) return false; // if the user doesn't select a sibling, move on

  const correctSpelling = chosenSibling.name;
  const correction = {
    path: findAncestorRegionNames(region),
    correct: correctSpelling,
    incorrect: region.name,
  };

  appendCorrectionToFile(correction);

  region.name = correctSpelling;
  return true;
}

async function appendCorrectionToFile(correction) {
  let correctionRecord =
    correction.path.join('#') + ',' +
    correction.correct + ',' +
    correction.incorrect + '\n';
  const correctionFile = path.join(__dirname, '/corrections.csv');
  if (!fs.existsSync(correctionFile)) {
    const headers = 'path,correct,incorrect' + '\n';
    correctionRecord = headers + correctionRecord;
  }
  await fs.appendFileSync(correctionFile, correctionRecord); // TODO log error & get path from -o
}

function chooseCorrectSibling(correctSiblings, misspeltRegion) {
  while (true) {
    console.log('');
    let subRegionNames;
    for (let i = 0; i < correctSiblings.length; i += 1) {
      const sibling = correctSiblings[i];
      const siblingName = colors.underline(sibling.name);
      subRegionNames = colors.italic(getSubregionNames(sibling));
      console.log(i + 1, siblingName, subRegionNames);
      console.log('---------------');
    }

    const misspeltRegionName = colors.bold(misspeltRegion.name);
    subRegionNames = colors.italic(getSubregionNames(misspeltRegion))
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
    console.log(colors.red.bold(`\nINVALID INPUT, please enter a number up to ${correctSiblings.length}`));
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
  const parentNameArr = findAncestorRegionNames(region);
  if (parentNameArr.length === 0) {
    // if region is division sibling names are dataset values
    return Object.values(correctNameData);
  }
  const correctlyNamedParent = findRegionByNameArr(correctNameData, parentNameArr);
  return correctlyNamedParent.subRegionsArr;
}

function findAncestorRegionNames(region) {
  let currentRegion = region.parentRegion;
  const names = [];

  while (currentRegion != null) {
    names.unshift(currentRegion.name);
    currentRegion = currentRegion.parentRegion;
  }
  return names;
}

function findRegionByNameArr(dataset, arr) {
  const div = dataset[arr[0]];
  if (arr.length === 1) return div; // FIXME array length can be 0 when region is division

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

function applyCorrections(dataset, corrections) {
  // if corrections is null or undefined; return
  // then if defined but length is not > 0; return
  if (!corrections?.length) return;

  let regionToCorrect;
  for (const correction of corrections) {
    const pathArr = correction.path.split('#');
    if (pathArr[0] !== '') {
      regionToCorrect = dataset[pathArr[0]].subRegions;
      pathArr.shift();
      for (const objectPath of pathArr) {
        regionToCorrect = regionToCorrect[objectPath].subRegions;
      }
      regionToCorrect = regionToCorrect[correction.incorrect];
      regionToCorrect.parentRegion[correction.correct] = regionToCorrect;
      regionToCorrect.parentRegion[correction.correct].name = correction.correct;
      delete regionToCorrect.parentRegion[correction.incorrect];
    } else {
      regionToCorrect = dataset[correction.incorrect];
      regionToCorrect.name = correction.correct;
      dataset[correction.correct] = regionToCorrect;
      delete dataset[correction.incorrect];
    }
  }
}

function addRelativeRegionLinks(dataset) {
  for (const div of Object.values(dataset)) {
    div.siblingRegions = dataset;
    div.subRegions = div.districts;
    div.subRegionsArr = Object.values(div.subRegions);
    for (const dis of Object.values(div.districts)) {
      dis.parentRegion = div;
      dis.siblingRegions = div.districts;
      dis.subRegions = dis.upazilas;
      dis.subRegionsArr = Object.values(dis.subRegions);
      for (const upa of Object.values(dis.upazilas)) {
        upa.parentRegion = dis;
        upa.siblingRegions = dis.upazilas;
        upa.subRegions = upa.unions;
        upa.subRegionsArr = Object.values(upa.subRegions);
        for (const uni of Object.values(upa.unions)) {
          uni.parentRegion = upa;
          uni.siblingRegions = upa.unions;
        }
      }
    }
  }
}

function main(cliArgs) {
  const correctNameData = csvLoader(cliArgs.paths); // use -p flag

  // temporary use of path so the script can be run outside from the data-import directory
  const testFile = path.join(__dirname, '/small-test-dataset.csv');
  const uncheckedNameData = csvLoader([testFile]); // use -i flag

  addRelativeRegionLinks(correctNameData);
  addRelativeRegionLinks(uncheckedNameData);


  // TODO get corrections filepath, probably from -o
  // temporary use of path so the script can be run outside from the data-import directory
  const correctionFile = path.join(__dirname, '/corrections.csv');
  let corrections;
  if (fs.existsSync(correctionFile)) {
    corrections = parse(fs.readFileSync(correctionFile), CSV_PARSE_OPTIONS);
  }

  applyCorrections(uncheckedNameData, corrections);

  for (const div of Object.values(uncheckedNameData)) {
    let correctionState = false;
    if (!correctDataContains(correctNameData, div.name)) {
      correctionState = getCorrections(correctNameData, uncheckedNameData, div);
      if (!correctionState) continue;
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, div.name, dis.name)) {
        correctionState = getCorrections(correctNameData, uncheckedNameData, dis);
        if (!correctionState) continue;
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, div.name, dis.name, upa.name)) {
          correctionState = getCorrections(correctNameData, uncheckedNameData, upa);
          if (!correctionState) continue;
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, div.name, dis.name, upa.name, uni.name)) {
            getCorrections(correctNameData, uncheckedNameData, uni);
          }
        }
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
