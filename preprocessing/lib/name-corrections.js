/*
 * A global list of name corrections for division/district/upazila/union spelling variations.
 */

const corrections = new Map();

// built-in corrections for geo-data
// todo this should live in a file of known name corrections
corrections.set(
  'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur',
  ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
);

function combineName(arr) {
  return arr.join('#');
}

function correctRegionName(arr) {
  const correction = corrections.get(combineName(arr));
  if (correction) return correction;

  // find partial corrections, e.g. just division name
  const arrCopy = arr.slice();
  const arrEnd = [];
  while (arrCopy.length > 0) {
    arrEnd.unshift(arrCopy.pop());
    const correction = corrections.get(combineName(arrCopy));
    if (correction) return correction.concat(arrEnd);
  }

  // todo try to find partial corrections by taking prefixes of arr
  // probably apply only the first correction we find
  // the return on line 28 is already in that direction

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
      const existingCombined = combineName(existingCorrection);
      if (existingCombined !== correction.correct) {
        console.warn(`SKIPPING CORRECTION ${correction.correct} for path ${correction.path} which was previously corrected to ${existingCombined}`);
      }

      // skip the existing correction
      continue;
    }

    corrections.set(correction.path, correction.correct.split('#'));
  }
}

module.exports = {
  correct: correctRegionName,
  loadCorrections,
};
