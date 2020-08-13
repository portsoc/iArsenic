const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')();

const REGIONS = { div: 1, dis: 2, upa: 3, uni: 4 };

function getCorrections(corrections, correctNameData, uncheckedNameData, ...regionArr) {
  const misspeltRegion = regionArr[regionArr.length - 1].name;

  // only shows regions inside misspelt region's parent region
  // corrections to parent region names are made on the fly
  const regionLevelArr = getRegions(correctNameData, regionArr);

  const userInput = getUserInput(regionArr, regionLevelArr, misspeltRegion);

  if (userInput === '') return; // if user enters space skip correction

  const correctSpelling = regionLevelArr[userInput].name;
  const correction = { correct: correctSpelling, incorrect: misspeltRegion };
  corrections.push(correction); // TODO write corrections to file (and possible apply to csv??)
  applyCorrection(correction, uncheckedNameData, regionArr);
}

function applyCorrection(correction, uncheckedNameData, regionArr) {
  const regionDepth = regionArr.length;
  for (const div of Object.values(uncheckedNameData)) {
    if (regionDepth === REGIONS.div && correction.incorrect === div.name) {
      duplicateDelete(correction, div); // apply correction (duplicate and delete method)
    }
    for (const dis of Object.values(div.districts)) {
      // TODO put big if statement into function
      if (regionDepth === REGIONS.dis && correction.incorrect === dis.name && dis.parentRegion === div) {
        duplicateDelete(correction, dis);
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (regionDepth === REGIONS.upa && correction.incorrect === upa.name && upa.parentRegion === dis) {
          duplicateDelete(correction, upa);
        }
        for (const uni of Object.values(upa.unions)) {
          if (regionDepth === REGIONS.uni && correction.incorrect === uni.name && upa.parentRegion === upa) {
            duplicateDelete(correction, uni);
          }
        }
      }
    }
  }
}

function duplicateDelete(correction, region) {
  // go to region parent
  const parentRegion = region.parentRegion;
  // duplicate parent[region.incorrectName] to parent[region.correctName]
  parentRegion[correction.correct] = region;
  // correct parent[correctName].name to correctName
  parentRegion[correction.correct].name = correction.correct;
  // delete parent[region.incorrectName]
  const regionLevelKey = getLevelKey(region);

  // if null regionLevel is district so no subkey required
  if (regionLevelKey != null) {
    delete parentRegion[regionLevelKey][correction.incorrect];
  } else {
    delete parentRegion[correction.incorrect];
  }
}

function getLevelKey(region) {
  if (region.districts != null) return null;
  if (region.upazilas != null) return 'districts';
  if (region.unions != null) return 'upazilas';
  return 'unions';
}

function getUserInput(regionArr, regionLevelArr, misspeltRegion) {
  let inputIsValid = false;
  let userInput;
  while (!inputIsValid) {
    console.log('');
    for (let i = 0; i < regionLevelArr.length; i += 1) {
      console.log(i, regionLevelArr[i].name);
      // TODO also display child regions (order by alphabetically)
    }

    console.log('Incorrect region: ', misspeltRegion);
    userInput = prompt('Input ID of correct spelling: ');

    // if user presses enter skip this correction
    if (userInput === '') break;

    inputIsValid = validInput(userInput, regionLevelArr.length);
    if (!inputIsValid) console.log('INVALID INPUT');
  }
  return userInput;
}

function validInput(input, regionArrLength) {
  if (input == null) process.exit(0);
  if (input >= regionArrLength || input < 0) return false; // if answer out of bounds of array
  if (isNaN(input)) return false; // if answer is not a number return false
  return true;
}

function getRegions(correctNameData, regionArr) {
  const regionDepth = regionArr.length;
  let regionDepthArr = [];

  for (const div of Object.values(correctNameData)) {
    if (regionDepth === REGIONS.div) {
      regionDepthArr.push(div);
    }
    if (regionArr[1] == null) continue;
    for (const dis of Object.values(div.districts)) {
      if (regionDepth === REGIONS.dis && regionArr[0].name === div.name) {
        regionDepthArr.push(dis);
      }
      if (regionArr[2] == null) continue;
      for (const upa of Object.values(dis.upazilas)) {
        if (regionDepth === REGIONS.upa && regionArr[1].name === dis.name) {
          regionDepthArr.push(upa);
        }
        if (regionArr[3] == null) continue;
        for (const uni of Object.values(upa.unions)) {
          if (regionDepth === REGIONS.uni && regionArr[2].name === upa.name) {
            regionDepthArr.push(uni);
          }
        }
      }
    }
  }
  regionDepthArr = regionDepthArr.sort((a, b) => a.name.localeCompare(b.name));
  return regionDepthArr;
}

function correctDataContains(correctNameData, ...regionNames) {
  const [topLevelName, ...restOfNames] = regionNames;

  const topRegion = correctNameData[topLevelName];

  // check the first name in search matches the top level of correctNameData
  if (topRegion == null) return false;

  // if we're not searching any deeper, we're done
  if (restOfNames.length === 0) return true;

  // check for the deeper names in the subregions
  return correctDataContains(topRegion.subRegions, restOfNames);
}

function addRelativeRegionLinks(dataset) {
  for (const div of Object.values(dataset)) {
    div.siblingRegions = dataset;
    div.subRegions = div.districts;
    for (const dis of Object.values(div.districts)) {
      dis.parentRegion = div;
      dis.siblingRegions = div.districts;
      dis.subRegions = dis.upazilas;
      for (const upa of Object.values(dis.upazilas)) {
        upa.parentRegion = dis;
        upa.siblingRegions = dis.upazilas;
        upa.subRegions = upa.unions;
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
  const uncheckedNameData = csvLoader(['consolidateCsv.csv']); // use -i flag

  addRelativeRegionLinks(correctNameData);
  addRelativeRegionLinks(uncheckedNameData);

  const corrections = [];

  for (const div of Object.values(uncheckedNameData)) {
    if (!correctDataContains(correctNameData, div.name)) {
      getCorrections(corrections, correctNameData, uncheckedNameData, div);
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, div.name, dis.name)) {
        getCorrections(corrections, correctNameData, uncheckedNameData, div, dis);
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, div.name, dis.name, upa.name)) {
          getCorrections(corrections, correctNameData, uncheckedNameData, div, dis, upa);
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, div.name, dis.name, upa.name, uni.name)) {
            getCorrections(corrections, correctNameData, uncheckedNameData, div, dis, upa, uni);
          }
        }
      }
    }
  }

  console.log(corrections); // TODO write to corrections file as corrections are made
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
