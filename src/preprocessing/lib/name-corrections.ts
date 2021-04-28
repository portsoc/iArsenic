/*
 * This file handles name corrections for division/district/upazila/union/mouza
 * spelling variations. Name corrections are builtin (below) and loaded from
 * files in /data/name-corrections
 */

export const corrections = new Map<string, string[]>();

// built-in corrections for geo-data
// todo this should live in a file of known name corrections
corrections.set(
  'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur',
  ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
);

function combineName(arr: string[]) {
  return arr.join('#');
}

export const SKIPPED_CORRECTION = '~none~';

export function correctRegionName(arr: string[]): string[] | null {
  // start from the complete array, then if we don't find a correction,
  // try to find partial corrections, e.g. just division name
  const arrCopy = arr.slice();
  const arrEnd: string[] = [];
  while (arrCopy.length > 0) {
    const correction = corrections.get(combineName(arrCopy));
    if (correction && correction[0] === SKIPPED_CORRECTION) return null;
    if (correction) return correction.concat(arrEnd);
    const pop = arrCopy.pop();
    if (pop !== undefined) {
      arrEnd.unshift(pop);
    }
  }

  // no corrections available, assume arr is correct already
  return arr;
}

// Commented: needs to be moved to another file
/*
function testCorrectRegionName(expect) {
  // let's say corrections is like this:
  // 'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur':
  //   ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
  // 'Rajshahi#Dinajpur':
  //   ['Rangpur', 'Dinajpur']

  // todo formatted to use Jest expect() but needs to be put in Jest framework and set up corrections like above for testing

  // if we don't have a correct, the array is assumed to be correct
  expect(correctRegionName(['a', 'b'])).toEqual(['a', 'b']);

  // if we have a strictly matching correction, we apply it
  expect(correctRegionName(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin  Sukhairrajapur']))
    .toEqual(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur']);
  expect(correctRegionName(['Rajshahi', 'Dinajpur']))
    .toEqual(['Rangpur', 'Dinajpur']);

  // if we have a partial correction, we apply it
  expect(correctRegionName(['Rajshahi', 'Dinajpur', 'a']))
    .toEqual(['Rangpur', 'Dinajpur', 'a']);
  expect(correctRegionName(['Rajshahi', 'Dinajpur', 'a', 'b']))
    .toEqual(['Rangpur', 'Dinajpur', 'a', 'b']);

  // todo add test cases for none
}
*/

export interface Correction {
  path: string,
  correct: string,
}

/*
 * Corrections loaded from CSV look like this:
 * {
 *   path: 'divName#disName#upaName#uniName',
 *   correct: 'correctedDivName#correctedDisName#correctedUpaName#correctedUniName',
 * }
 */
export function loadCorrections(correctionsCsvArr: Correction[]): void {
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
