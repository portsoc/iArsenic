const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const prompt = require('prompt-sync')(); // TODO remove ()

function getUserCorrections(correctNames, uncheckedNames, correctNameData, uncheckedNameData) {
  const corrections = [];
  for (const uncheckedName of uncheckedNames) {
    // add spelling mistakes and remove ! from ! to test
    if (!correctNames.includes(uncheckedName)) continue;

    console.log('\n///////////////');
    console.log('no match found for: ' + uncheckedName);
    console.log(
      uncheckedName +
      ' districts: ' +
      Object.keys(uncheckedNameData[uncheckedName].districts), // TODO Linter says missing trailing comma??
    );

    console.log('-----------------------');

    for (const checkedName of correctNames) {
      console.log(
        checkedName +
        ' districts: ' +
        Object.keys(correctNameData[checkedName].districts), // TODO missing trailing comma??
      );
    }
    const correction = prompt('please enter correct spelling: ');
    corrections.push({ incorrectName: uncheckedName, correctName: correction });
  }
  return corrections;
}

function getDivs(nameData) {
  const divNameArr = [];
  for (const key of Object.keys(nameData)) {
    divNameArr.push(key);
  }
  return divNameArr;
}

function main(cliArgs) {
  const correctNameData = csvLoader(cliArgs.paths);
  const correctNameDivs = getDivs(correctNameData);
  const uncheckedNameData = csvLoader(['consolidateCsv.csv']);
  const uncheckedNameDivs = getDivs(uncheckedNameData);
  const corrections = getUserCorrections(
    correctNameDivs,
    uncheckedNameDivs,
    correctNameData,
    uncheckedNameData,
  );

  console.log(corrections);
}

console.debug = console.error; // redirect debug to stderr 471453
main(cli.getParameters());
