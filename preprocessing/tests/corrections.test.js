/* global describe, it, expect */

const path = require('path');

const corrections = require('../lib/name-corrections');
const { readTheCSVFiles } = require('../lib/load-data');

describe('corrections', () => {
  // load testing name corrections
  const correctionsData = readTheCSVFiles(path.join(__dirname, 'corrections.test.csv'));
  corrections.loadCorrections(correctionsData);

  it('should assume array to be correct if we don\'t have a correction', () => {
    expect(corrections.correct(['a', 'b'])).toEqual(['a', 'b']);

    expect(corrections.correct(['match', 'it']))
      .toEqual(['match', 'it']);
  });

  it('should correct if we have a strictly matching correction', () => {
    expect(corrections.correct(['division', 'district', 'upazilla', 'union', 'misspelling']))
      .toEqual(['division', 'district', 'upazilla', 'union', 'mouza']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur']))
      .toEqual(['Rangpur', 'Dinajpur']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'somewhere']))
      .toEqual(['actually', 'somewhere', 'else']);

    expect(corrections.correct(['strictly', 'matching']))
      .toEqual(['strict', 'matching']);

    // and with mouzas
    expect(corrections.correct(['mach', 'it', 'strictly', 'with', 'mouzas']))
      .toEqual(['match', 'it', 'strictly', 'with', 'mouzas']);
  });

  it('should apply parial corrections when no strict correction available', () => {
    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a']))
      .toEqual(['Rangpur', 'Dinajpur', 'a']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'a', 'b', 'c']))
      .toEqual(['Rangpur', 'Dinajpur', 'a', 'b', 'c']);

    expect(corrections.correct(['Rajshahi', 'Dinajpur', 'somewhere', 'foo']))
      .toEqual(['actually', 'somewhere', 'else', 'foo']);
  });
});
