/*
 * This file handles name corrections for division/district/upazila/union/mouza
 * spelling variations. Name corrections are builtin (below) and loaded from
 * files in /data/name-corrections
 */

const corrections = new Map();

// built-in corrections for geo-data
// todo this should live in a file of known name corrections
corrections.set(
  'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur',
  ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
);

function combinePath(arr) {
  return arr.join('#');
}

function parsePath(str) {
  return str.split('#');
}

const SKIPPED_CORRECTION = '~none~';

function correctRegionName(arr) {
  // start from the complete array, then if we don't find a correction,
  // try to find partial corrections, e.g. just division name
  const arrCopy = arr.slice();
  const arrEnd = [];
  while (arrCopy.length > 0) {
    const correction = corrections.get(combinePath(arrCopy));

    if (correction && correction[0] === SKIPPED_CORRECTION) {
      return null;
    }

    if (correction) {
      return correction.concat(arrEnd);
    }

    // move last part of arr to arrEnd
    arrEnd.unshift(arrCopy.pop());
  }

  // no corrections available, assume arr is correct already
  return arr;
}

/*
 * Corrections loaded from CSV look like this:
 * {
 *   path: 'divName#disName#upaName#uniName',
 *   correct: 'correctedDivName#correctedDisName#correctedUpaName#correctedUniName',
 * }
 */
function loadCorrections(correctionsCsvArr) {
  for (const correction of correctionsCsvArr) {
    // first check if that correction is already there
    const existingCorrection = corrections.get(correction.path);
    if (existingCorrection) {
      const existingCombined = combinePath(existingCorrection);
      if (existingCombined !== correction.correct) {
        console.warn(`SKIPPING CORRECTION ${correction.correct} for path ${correction.path} which was previously corrected to ${existingCombined}`);
      }

      // skip the existing correction
      continue;
    }
    corrections.set(correction.path, parsePath(correction.correct));
  }
}

module.exports = {
  correct: correctRegionName,
  loadCorrections,
  testCorrectRegionName,
  combinePath,
  parsePath,
  SKIPPED_CORRECTION,
};
