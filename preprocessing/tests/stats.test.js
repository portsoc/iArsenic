/* global describe, it, expect */

const stats = require('../lib/stats');

describe('stats', () => {
  describe('quantile', () => {
    const array = [1.5, 1.8, 2, 3, 3, 4, 5, 10];
    it('gives first for 0th quantile', () => {
      expect(stats.quantile(array, 0)).toBe(1.5);
    });

    it('gives median for 50%', () => {
      expect(stats.quantile(array, 0.5)).toBe(3);
    });

    it('gives last for 100%', () => {
      expect(stats.quantile(array, 1)).toBe(10);
    });

    it('gives second for 15%', () => {
      expect(stats.quantile(array, 0.15)).toBe(1.8);
    });
  });

  describe('median', () => {
    it('gives the middle for odd-long array', () => {
      expect(stats.median([1.5, 1.8, 2, 3, 4, 4, 5])).toBe(3);
    });

    it('gives the in-between value for even-long array', () => {
      expect(stats.median([1.5, 1.8, 2, 3, 4, 4, 5, 10])).toBe(3.5);
    });
  });

  describe('max', () => {
    it('gives max value in array (we assume sorted input, only testing last value)', () => {
      expect(stats.max([1.5, 1.8, 2, 3, 4, 4, 5])).toBe(5);
      expect(stats.max([1.5, 1.8, 2, 3, 4, 5, 5])).toBe(5);
    });
  });

  describe('mean', () => {
    it('works', () => {
      expect(stats.mean([1, 1, 2, 3, 4, 4, 6])).toBe(3);
      expect(stats.mean([1, 1])).toBe(1);
      expect(stats.mean([3])).toBe(3);
    });
  });
});
