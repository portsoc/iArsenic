const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const nameCorrections = require('../lib/name-corrections');
const prompt = require('prompt-sync')();
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const colors = require('colors');

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

function correct(correctNameData, region, correctionFile) {
  if (correctDataContains(correctNameData, ...region.correctParentPath, region.oldName)) {
    // it's already correct
    region.correctName = region.oldName;
    return true;
  }

  const correction = chooseCorrection(region, correctNameData);

  // correct the region name in the data
  region.correctName = correction.region.name;

  if (correction.type === 'cousin') {
    const correctParentRegion = correction.region.parentRegion;
    region.correctParentPath = findRegionNamePath(correctParentRegion);
  } else if (correction.type === 'none') {
    region.correctParentPath = [];
  }

  // save the correction
  const csvCorrection = {
    path: [...region.oldParentPath, region.oldName],
    correct: [...region.correctParentPath, region.correctName],
  };
  appendCorrectionToFile(csvCorrection, correctionFile);

  return correction.type !== 'none';
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
  fs.appendFileSync(correctionFile, correctionRecord);
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
  return retarr.length === 0 ? '' : `(${colors.italic(regionString)})`;
}

const regionLabels = ['division', 'district', 'upazila', 'union'];

function chooseCorrection(misspeltRegion, correctNameData) {
  // only shows regions inside misspelt region's parent region
  // corrections to parent region names are made on the fly
  const misspeltSubregionNames = misspeltRegion.subRegionsArr.map(r => r.oldName).sort();

  const correctedRegionPath = misspeltRegion.correctParentPath;

  const misspeltRegionNameBold = colors.bold(misspeltRegion.oldName);
  const regionLabel = regionLabels[correctedRegionPath.length];
  const commonSubregions = [];

  // returns array of all sibling regions and cousin regions with common sub regions to the misspeltRegion
  // [{ type: 'sibling' OR 'cousin', region: regionObject}]
  const selectableRegions = getSelectableRegions(
    correctNameData,
    misspeltRegion,
    misspeltSubregionNames,
  );

  const optionsList = generateOptionsTable(selectableRegions, misspeltSubregionNames, commonSubregions);

  const misspeltSubregionString = highlightCommonSubregions(misspeltSubregionNames, commonSubregions);

  let promptText = optionsList + '\n\n';
  if (correctedRegionPath.length > 0) {
    promptText += 'In ' + correctedRegionPath.join(' -> ') + '\n';
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
      return { type: 'none', region: { name: nameCorrections.SKIPPED_CORRECTION } };
    }

    const inputIsValid = validInput(userInput, selectableRegions.length);
    if (inputIsValid) {
      const selected = selectableRegions[userInput - 1];
      console.log(colors.brightGreen.bold(`Selected: ${selected.region.name}`));
      return selected;
    }

    // input wasn't valid
    console.log(colors.red.bold(`\nINVALID INPUT, please enter a number 1-${selectableRegions.length}`));
  }
}

// MUST return "sibling" regions before "cousin" regions
function getSelectableRegions(correctNameData, misspeltRegion, misspeltSubregionNames) {
  const selectableRegions = [];

  const correctSiblings = getCorrectlySpelledSiblingRegions(correctNameData, misspeltRegion);

  // put all sibling regions into selectable region array
  for (const sibling of correctSiblings) {
    selectableRegions.push({ type: 'sibling', region: sibling });
  }

  const cousinRegions = getCousinRegions(correctNameData, misspeltRegion);

  // only put cousin regions with common subregions to the misspelt region in the selectable regions array
  for (const cousinRegion of cousinRegions) {
    const cousinSubregionNames = getSubregionNames(cousinRegion);
    if (doArraysIntersect(misspeltSubregionNames, cousinSubregionNames)) {
      selectableRegions.push({ type: 'cousin', region: cousinRegion });
    }
  }

  return selectableRegions;
}

function doArraysIntersect(arr1, arr2) {
  for (const item of arr1) {
    if (arr2.includes(item)) return true;
  }
  return false;
}

function generateOptionsTable(selectableRegions, misspeltSubregionNames, commonSubregions) {
  let optionsString = '';

  // this assumes getSelectableRegions returned sibling regions before cousin regions
  const siblings = selectableRegions.filter(region => region.type === 'sibling');
  const cousins = selectableRegions.filter(region => region.type === 'cousin');

  optionsString = appendOptionsString(0, optionsString, misspeltSubregionNames, commonSubregions, siblings);

  if (cousins.length === 0) return optionsString;

  optionsString += `\n\n${colors.yellow('We also found potential corrections to cousin regions below')}\n`;
  optionsString = appendOptionsString(siblings.length, optionsString, misspeltSubregionNames, commonSubregions, cousins);

  return optionsString;
}

function appendOptionsString(startingIndex, optionsString, misspeltSubregionNames, commonSubregions, selectableRegions) {
  for (let i = 0; i < selectableRegions.length; i += 1) {
    const optionName = selectableRegions[i].region.name;
    const optionSubregions =
      selectableRegions[i].region.subRegions
        ? getSubregionNames(selectableRegions[i].region)
        : [];
    const optionSubregionsHighlighted = highlightCommonSubregions(optionSubregions, misspeltSubregionNames, commonSubregions);
    const parentName = startingIndex === 0
      ? ''
      : selectableRegions[i].region.parentRegion.name + ' -> ';
    optionsString += `\n${colors.yellow(startingIndex + i + 1)} ${parentName}${optionName} ${optionSubregionsHighlighted}`;
  }
  return optionsString;
}

// return subregions of all subregions (except for region's parent) of region's parent's parent
function getCousinRegions(correctNameData, region) {
  // a division doesn't have any cousins
  if (region.correctParentPath.length < 1) return [];

  const parent = findRegionByNameArr(correctNameData, region.correctParentPath);

  const grandParent = parent.parentRegion;

  // we may not have grandParent if region is a district
  const parentLevelRegions = grandParent != null
    ? grandParent.subRegionsArr
    : Object.values(correctNameData);

  // get all the subregions of grandParent except for parent
  const uncleRegions = parentLevelRegions.filter(r => r !== parent);

  // return subregions of all the uncle regions
  return uncleRegions.flatMap(r => r.subRegionsArr);
}

function getSubregionNames(region) {
  // Region is lowest level region
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
  if (region.oldParentPath.length === 0) {
    // if region is a division, sibling names are values in correctNameData
    return Object.values(correctNameData).sort((a, b) => a.name.localeCompare(b.name));
  } else {
    const parentNameArr = region.correctParentPath;
    const correctlyNamedParent = findRegionByNameArr(correctNameData, parentNameArr);
    return correctlyNamedParent.subRegionsArr.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function findRegionNamePath(region) {
  let currentRegion = region;
  const names = [];

  while (currentRegion != null) {
    names.unshift(currentRegion.name);
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

// turn the hierarchy of possibly misspelt data into a tree like this:
// [
//   {
//     oldName,
//     oldParentPath,
//     subRegionsArr: [...],
//   }
// ]

function extractHierarchyTree(dataset) {
  const retval = [];
  for (const div of Object.values(dataset)) {
    const divObj = {
      oldName: div.name,
      oldParentPath: [],
      correctParentPath: [],
      subRegionsArr: [],
    };
    retval.push(divObj);

    for (const dis of Object.values(div.districts)) {
      const disObj = {
        oldName: dis.name,
        oldParentPath: [div.name],
        subRegionsArr: [],
      };
      divObj.subRegionsArr.push(disObj);

      for (const upa of Object.values(dis.upazilas)) {
        const upaObj = {
          oldName: upa.name,
          oldParentPath: [div.name, dis.name],
          subRegionsArr: [],
        };
        disObj.subRegionsArr.push(upaObj);

        for (const uni of Object.values(upa.unions)) {
          const uniObj = {
            oldName: uni.name,
            oldParentPath: [div.name, dis.name, upa.name],
            subRegionsArr: [],
          };
          upaObj.subRegionsArr.push(uniObj);
        }
      }
    }
  }
  return retval;
}

function checkForMissingFlags(cliArgs) {
  if (cliArgs.inputFile == null || cliArgs.output == null) {
    console.warn(colors.red.bold('Please specify input file (-i flag) and output file (-o flag)'));
  }
}

function main(cliArgs) {
  checkForMissingFlags(cliArgs);
  const correctNameData = csvLoader(cliArgs.paths);

  // load existing corrections
  const correctionFile = cliArgs.output;
  if (fs.existsSync(correctionFile)) {
    const corrections = parse(fs.readFileSync(correctionFile), CSV_PARSE_OPTIONS);
    nameCorrections.loadCorrections(corrections);
  }

  const dataToCorrect = cliArgs.inputFile;
  const uncheckedNameData = extractHierarchyTree(csvLoader([dataToCorrect], { nameCorrections }));

  addRelativeRegionLinks(correctNameData);

  const correctionQueue = Array.from(Object.values(uncheckedNameData));
  while (correctionQueue.length > 0) {
    const region = correctionQueue.shift();

    const corrected = correct(correctNameData, region, correctionFile);
    if (corrected) {
      // add the subregions to the queue
      for (const subRegion of region.subRegionsArr) {
        // give each subRegion a (currently known) correctParentPath
        subRegion.correctParentPath = [...region.correctParentPath, region.correctName];
        correctionQueue.push(subRegion);
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
