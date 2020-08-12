const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')(); // TODO remove ()

function getUserCorrections(correctNameData, uncheckedNameData, regionToCorrect, regionLevel) {
  // console.clear();
  // create a list of all $regionLevels in correctNameData including their sub level
  // show this list to the user in alphabetical order
  const subLevelKey = getSubLevelKey(regionLevel);
  const regionLevelArr = getRegions(correctNameData, regionLevel);

  for (let i = regionLevelArr.length - 1; i >= 0; i -= 1) {
    if (subLevelKey == null) {
      const regionSubRegions = Object.keys(regionLevelArr[i][subLevelKey]);
      console.log(i + 1, regionLevelArr[i].name, ':', regionSubRegions.join(', '));
    } else {
      console.log(i + 1, regionLevelArr[i].name);
    }

    console.log('-------------');
  }

  if (subLevelKey == null) {
    const regionToCorrectSubregions = Object.keys(regionToCorrect[subLevelKey]);
    console.log('unknown name:', regionToCorrect.name, ':', regionToCorrectSubregions.join(', '));
  } else {
    console.log('unknown name:', regionToCorrect.name);
  }

  // returns 0 on CTRL+C
  const correctNameIndex = Number(
    prompt('Enter the number of the correct spelling. Press 0 to skip: '),
  );
  if (correctNameIndex == null) process.exit(0); // quit on ctrl+C
  if (correctNameIndex === 0) return;

  return {
    incorrectName: regionToCorrect.name,
    correctName: regionLevelArr[correctNameIndex - 1].name,
  };
}

function getSubLevelKey(regionLevel) {
  if (regionLevel === 'div') return 'districts';
  if (regionLevel === 'dis') return 'upazilas';
  if (regionLevel === 'upa') return 'unions';
  return null;
}

function getRegions(correctNameData, regionLevel) {
  const regionArr = [];
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
      corrections.push(getUserCorrections(correctNameData, uncheckedNameData, div, 'div'));
    }
    for (const dis of Object.values(div.districts)) {
      if (!correctDataContains(correctNameData, dis.name, 'dis')) {
        corrections.push(getUserCorrections(correctNameData, uncheckedNameData, dis, 'dis'));
      }
      for (const upa of Object.values(dis.upazilas)) {
        if (!correctDataContains(correctNameData, upa.name, 'upa')) {
          corrections.push(getUserCorrections(correctNameData, uncheckedNameData, upa, 'upa'));
        }
        for (const uni of Object.values(upa.unions)) {
          if (!correctDataContains(correctNameData, uni.name, 'uni')) {
            corrections.push(getUserCorrections(correctNameData, uncheckedNameData, uni, 'uni'));
          }
        }
      }
    }
  }

  console.log(corrections); // change to fs writeFileSync
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
