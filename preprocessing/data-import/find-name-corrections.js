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

function correctDataContains(correctNameData, search, regionLevel) {
  for (const div of Object.values(correctNameData)) {
    if (search === div.name && regionLevel === 'div') return true;
    for (const dis of Object.values(div.districts)) {
      if (search === dis.name && regionLevel === 'dis') return true;
      for (const upa of Object.values(dis.upazilas)) {
        if (search === upa.name && regionLevel === 'upa') return true;
        for (const uni of Object.values(upa.unions)) {
          if (search === uni.name && regionLevel === 'uni') return true;
        }
      }
    }
  }
  return false;
}

function addBackLinks(...datasets) {
  for (const dataset of datasets) {
    for (const div of Object.values(dataset)) {
      div.parentRegion = dataset;
      for (const dis of Object.values(div.districts)) {
        dis.parentRegion = div;
        for (const upa of Object.values(dis.upazilas)) {
          upa.parentRegion = dis;
          for (const uni of Object.values(upa.unions)) {
            uni.parentRegion = upa;
          }
        }
      }
    }
  }
}


function main(cliArgs) {
  const correctNameData = csvLoader(cliArgs.paths); // use -p flag
  const uncheckedNameData = csvLoader(['consolidateCsv.csv']); // use -i flag
  addBackLinks(correctNameData, uncheckedNameData);
  const corrections = [];

  for (const div of Object.values(uncheckedNameData)) {
    if (!correctDataContains(correctNameData, div.name, 'div')) {
      getCorrections(corrections, correctNameData, uncheckedNameData, div);
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, dis.name, 'dis')) {
        getCorrections(corrections, correctNameData, uncheckedNameData, div, dis);
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, upa.name, 'upa')) {
          getCorrections(corrections, correctNameData, uncheckedNameData, div, dis, upa);
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, uni.name, 'uni')) {
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
