const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');
const levenshtein = require('fast-levenshtein');

function getIncorrectNames(correctNames, unseenNames) {
  const incorrections = [];
  for (const unseen of unseenNames) {
    if (!correctNames.includes(unseen)) {
      // uncomment for feedback when running script
      // console.error('no match found for: ' + unseen);
      incorrections.push(unseen);
    }
  }
  return incorrections;
}

function getClosestMatch(correctNames, incorrections) {
  const corrections = [];

  // set to infinity to make sure nothing can be higher
  let matchScore = Infinity;
  let closestMatch = '';

  for (const name of incorrections) {
    for (const correctName of correctNames) {
      // levenshtein get the letter difference between the words
      // generating a score based on their similiarity
      // that get compared to previous match score

      const score = levenshtein.get(name, correctName);
      if (matchScore > score) {
        matchScore = score;
        closestMatch = correctName;

        // breaks loop when a close enough match is found
        // could be useful for larger amount of data
        if (matchScore <= 1) break;
      }
    }
    corrections.push({ 'incorrect': name, 'suggested-correction': closestMatch, 'similiarity-score': matchScore });
    matchScore = Infinity;
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
  // assumes that data provided is correct to begin with
  const correctData = csvLoader(cliArgs.paths[0]);

  // data to check for inconsistencies/incorrections
  const unseenData = csvLoader(cliArgs.paths[1]);


  const correctNameDivs = getDivs(correctData);
  const unseenNameDivs = getDivs(unseenData);

  const incorrections = getIncorrectNames(correctNameDivs, unseenNameDivs);
  const corrections = getClosestMatch(correctNameDivs, incorrections);

  console.log(corrections);
}

console.debug = console.error; // redirect debug to stderr
main(cli.getParameters());
