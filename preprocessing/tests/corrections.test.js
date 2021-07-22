/* global describe, it, expect */

const path = require('path');

const corrections = require('../lib/name-corrections');
const { readTheCSVFiles } = require('../lib/load-data');

describe('corrections', () => {
  // let's say corrections is like this:
  // 'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur':
  //   ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
  // 'Rajshahi#Dinajpur':
  //   ['Rangpur', 'Dinajpur']

  // firstly we should load name corrections from the test
  const correctionsData = readTheCSVFiles(path.join(__dirname, 'test-corrections.csv'));
  corrections.loadCorrections(correctionsData);

  // if we don't have a correct, the array is assumed to be correct
  it('should assume array to be correct if we don\'t have a correct', () => {
    expect(corrections.correct(['a', 'b'])).toEqual(['a', 'b']);
  });

  // if we have a strictly matching correction, we apply it
  it('should apply a correction if we have a strictly matching correction', () => {
    expect(corrections.correct(['division', 'district', 'upazilla', 'union', 'mouza']))
      .toEqual(['division', 'district', 'upazilla', 'union', 'misspelling']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur']))
      .toEqual(['Rangpur', 'Dinajpur']);

    expect(corrections.correct(['strictly', 'matching']))
      .toEqual(['strict', 'matching']);

    // and with mouzas
    expect(corrections.correct(['match', 'it', 'strictly', 'with', 'mouzas']))
      .toEqual(['mach', 'it', 'strictly', 'with', 'mouzas']);
  });

  // if we have a partial correction, we apply it
  it('should apply a correction if there is a partial correction', () => {
    expect(corrections.correct(['match', 'it']))
      .toEqual(['match', 'it']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a']))
      .toEqual(['Rangpur', 'Dinajpur', 'a']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a', 'b']))
      .toEqual(['Rangpur', 'Dinajpur', 'a', 'b']);
  });
});
