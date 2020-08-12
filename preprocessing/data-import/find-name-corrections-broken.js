const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')(); // TODO remove ()

function getUserCorrections(corrections, correctNameData, uncheckedNameData, regionArr, subLevelKey) {
  console.clear();
  // create a list of all $regionLevels in correctNameData including their sub level
  // show this list to the user in alphabetical order

  const regionLevelArr = getRegions(correctNameData, regionArr);
  let regionToCorrectSubRegions;

  const mostCommonRegion = {};
  let mostCommonSubRegions = 0;
  for (let i = regionLevelArr.length - 1; i >= 0; i -= 1) {
    if (subLevelKey != null) {
      const regionSubRegions = Object.keys(regionLevelArr[i][subLevelKey]);
      regionToCorrectSubRegions = Object.keys(regionToCorrect[subLevelKey]);
      const commonSubRegions = countCommonSubRegions(regionSubRegions, regionToCorrectSubRegions);
      if (commonSubRegions > mostCommonSubRegions) {
        mostCommonSubRegions = commonSubRegions;
        mostCommonRegion.region = regionLevelArr[i];
        mostCommonRegion.subRegions = regionSubRegions;
        mostCommonRegion.commonCount = commonSubRegions;
        mostCommonRegion.index = i + 1;
      }
      console.log(i + 1, regionLevelArr[i].name, ':', regionSubRegions.join(', '));
      console.log('common sub regions:', commonSubRegions);
    } else {
      console.log(i + 1, regionLevelArr[i].name);
    }
    console.log('-------------');
  }

  if (mostCommonRegion.index) {
    console.log('######################');
    console.log('Region with most common sub regions:');
    console.log(
      mostCommonRegion.index,
      mostCommonRegion.region.name,
      ':',
      mostCommonRegion.subRegions.join(', '),
    );
    console.log('Number of common sub regions:', mostCommonRegion.commonCount);
    console.log('######################');
  }

  if (subLevelKey != null) {
    console.log(
      'unknown',
      regionLevel,
      ':',
      regionToCorrect.name,
      ':',
      regionToCorrectSubRegions.join(', '),
    );
  } else {
    console.log('unknown', regionLevel, ':', regionToCorrect.name);
  }

  // returns 0 on CTRL+C
  const correctNameIndex = promptForNumber();
  if (correctNameIndex == null) process.exit(0); // quit on ctrl+C
  if (correctNameIndex === 0) return;

  return {
    incorrectName: regionToCorrect.name,
    correctName: regionLevelArr[correctNameIndex - 1].name,
  };
}


function promptForNumber() {
  while (true) {
    const input = prompt('Enter the number of the correct spelling, or just press Enter to skip: ');

    if (input == null) return null;
    if (input === '') return 0;

    const number = parseInt(input, 10);
    if (!isNaN(number)) return number;
  }
}

function countCommonSubRegions(regionList1, regionList2) {
  let commonRegions = 0;
  for (const region of regionList1) {
    if (regionList2.includes(region)) commonRegions += 1;
  }
  return commonRegions;
}

function getRegions(correctNameData, regionLevel) {
  let regionArr = [];
  for (const div of Object.values(correctNameData)) {
    if (regionLevel === 'div') regionArr.push(div);
    for (const dis of Object.values(div.districts)) {
      if (regionLevel === 'dis') regionArr.push(dis);
      for (const upa of Object.values(dis.upazilas)) {
        if (regionLevel === 'upa') regionArr.push(upa);
        for (const uni of Object.values(upa.unions)) {
          if (regionLevel === 'uni') regionArr.push(uni);
        }
      }
    }
  }
  // TODO sort array alphabetically on regionArry[x].name
  regionArr = regionArr.sort((a, b) => a.name.localeCompare(b.name));
  return regionArr;
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


function main(cliArgs) {
  const correctNameData = csvLoader(cliArgs.paths); // use -p flag
  const uncheckedNameData = csvLoader(['small-test-dataset.csv']); // use -i flag
  const corrections = [];

  for (const div of Object.values(uncheckedNameData)) {
    if (!correctDataContains(correctNameData, div.name, 'div')) {
      getUserCorrections(corrections, correctNameData, uncheckedNameData, [div], 'districts');
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, dis.name, 'dis')) {
        getUserCorrections(corrections, correctNameData, uncheckedNameData, [div, dis], 'upazilas');
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, upa.name, 'upa')) {
          getUserCorrections(corrections, correctNameData, uncheckedNameData, [div, dis, upa], 'unions');
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, uni.name, 'uni')) {
            getUserCorrections(corrections, correctNameData, uncheckedNameData, [div, dis, upa, uni]);
          }
        }
      }
    }
  }

  console.log(corrections); // change to fs writeFileSync
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
