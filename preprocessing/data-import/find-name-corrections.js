const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')();

function getCorrections(corrections, correctNameData, uncheckedNameData, region) {
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
  corrections.push(correction); // TODO write corrections to file (and possible apply to csv??)

  region.name = correctSpelling;
  return true;
}

function chooseCorrectSibling(correctSiblings, misspeltRegion) {
  while (true) {
    console.log('');
    for (let i = 0; i < correctSiblings.length; i += 1) {
      const sibling = correctSiblings[i];
      console.log(i + 1, sibling.name, getSubregionNames(sibling));
      console.log('---------------');
    }

    console.log('Incorrect region: ', misspeltRegion.name, getSubregionNames(misspeltRegion));

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
    console.log(`INVALID INPUT, please enter a number up to ${correctSiblings.length}`);
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
  const uncheckedNameData = csvLoader(['small-test-dataset.csv']); // use -i flag

  addRelativeRegionLinks(correctNameData);
  addRelativeRegionLinks(uncheckedNameData);

  const corrections = [];

  for (const div of Object.values(uncheckedNameData)) {
    let correctionState = false;
    if (!correctDataContains(correctNameData, div.name)) {
      correctionState = getCorrections(corrections, correctNameData, uncheckedNameData, div);
      if (!correctionState) continue;
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, div.name, dis.name)) {
        correctionState = getCorrections(corrections, correctNameData, uncheckedNameData, dis);
        if (!correctionState) continue;
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, div.name, dis.name, upa.name)) {
          correctionState = getCorrections(corrections, correctNameData, uncheckedNameData, upa);
          if (!correctionState) continue;
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, div.name, dis.name, upa.name, uni.name)) {
            getCorrections(corrections, correctNameData, uncheckedNameData, uni);
          }
        }
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
