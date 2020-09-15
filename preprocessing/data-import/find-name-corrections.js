const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common-copy');
const nameCorrections = require('../lib/name-corrections');
const prompt = require('prompt-sync')();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const colors = require('colors');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function correct(correctNameData, uncheckedNameData, region, correctionFile) {
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
  appendCorrectionToFile(correction, correctionFile);

  return true;
}

function appendCorrectionToFile(correction, correctionFile) {
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

function highlightCommonSubregions(regionsToList, regionsToHighlight, commonSubregions) {
  const retarr = [];
  for (let name of regionsToList) {
    if (regionsToHighlight.includes(name)) {
      if (commonSubregions) commonSubregions.push(name);
      name = colors.brightBlue(name);
    }
    retarr.push(name);
  }
  const regionString = retarr.join(', ');
  return `(${colors.italic(regionString)})`;
}

const regionLabels = ['division', 'district', 'upazila', 'union'];

function chooseCorrectSibling(correctSiblings, misspeltRegion) {
  const commonSubregions = [];

  const misspeltSubregions = getSubregionNames(misspeltRegion);
  const misspeltRegionPath = findRegionNamePath(misspeltRegion.parentRegion);
  const misspeltRegionNameBold = colors.bold(misspeltRegion.name);

  let siblingsString = '';
  for (let i = 0; i < correctSiblings.length; i += 1) {
    const sibling = correctSiblings[i];
    const siblingName = sibling.name;
    const siblingSubregions = getSubregionNames(sibling);
    const subregionString = highlightCommonSubregions(siblingSubregions, misspeltSubregions, commonSubregions);
    siblingsString += `\n${colors.yellow(i + 1)} ${siblingName} ${subregionString}`;
  }

  const misspeltSubregionString = highlightCommonSubregions(misspeltSubregions, commonSubregions);
  const regionLabel = regionLabels[misspeltRegionPath.length];

  let promptText = siblingsString + '\n\n';
  if (misspeltRegionPath.length > 0) {
    promptText += 'In ' + misspeltRegionPath.join(' -> ') + '\n';
  }
  promptText += 'Incorrect ' + regionLabel + ': ' + misspeltRegionNameBold + ' ' + misspeltSubregionString;

  while (true) {
    console.log(promptText);
    const userInput = prompt('Input ID of correct spelling: ');

    // quit on ctrl-c
    if (userInput == null) process.exit(0);

    // if user presses enter skip this correction
    if (userInput === '') {
      console.log(colors.brightGreen.bold(`SKIPPING ${regionLabel} ${misspeltRegionNameBold}`));
      return null;
    }

    const inputIsValid = validInput(userInput, correctSiblings.length);
    if (inputIsValid) {
      const selected = correctSiblings[userInput - 1];
      console.log(colors.brightGreen.bold(`Selected: ${selected.name}`));
      return selected;
    }

    // input wasn't valid
    console.log(colors.red.bold(`\nINVALID INPUT, please enter a number 1-${correctSiblings.length}`));
  }
}

function getSubregionNames(region) {
  if (region.subRegionsArr == null) return '';

  const namesArr = region.subRegionsArr.map(r => r.name);
  return namesArr.sort();
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

function checkForMissingFlags(cliArgs) {
  if (cliArgs.inputFile == null || cliArgs.output == null) {
    console.warn(colors.red.bold('Please specify input file (-i flag) and output file (-o flag)'));
  }
}

function main(cliArgs) {
  checkForMissingFlags(cliArgs);
  const correctNameData = csvLoader(cliArgs.paths);

  const dataToCorrect = cliArgs.inputFile;
  const uncheckedNameData = csvLoader([dataToCorrect]);

  addRelativeRegionLinks(correctNameData);
  addRelativeRegionLinks(uncheckedNameData);
  addOldNames(uncheckedNameData);

  // load existing corrections
  const correctionFile = cliArgs.output;
  if (fs.existsSync(correctionFile)) {
    const corrections = parse(fs.readFileSync(correctionFile), CSV_PARSE_OPTIONS);
    nameCorrections.loadCorrections(corrections);
    applyCorrections(uncheckedNameData);
  }

  for (const div of Object.values(uncheckedNameData)) {
    const corrected = correct(correctNameData, uncheckedNameData, div, correctionFile);
    if (!corrected) continue; // don't try to correct sub-region names

    for (const dis of Object.values(div.districts)) {
      const corrected = correct(correctNameData, uncheckedNameData, dis, correctionFile);
      if (!corrected) continue; // don't try to correct sub-region names

      for (const upa of Object.values(dis.upazilas)) {
        const corrected = correct(correctNameData, uncheckedNameData, upa, correctionFile);
        if (!corrected) continue; // don't try to correct sub-region names

        for (const uni of Object.values(upa.unions)) {
          correct(correctNameData, uncheckedNameData, uni, correctionFile);
        }
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
