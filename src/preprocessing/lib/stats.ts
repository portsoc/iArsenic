// return quantile of the sorted sample (this is type-1 quantile in R)
// the parameter `sorted` must be a sorted array of numbers
// and p must be between 0 and 1 inclusive
export function quantile(sorted: number[], p: number): number {
  const n = sorted.length;
  const which = Math.ceil(n * p) || 1; // p=0 uses the first element
  return sorted[which - 1];
}

export function mean(sorted: number[]): number {
  const average = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  return average;
}

export function max(sorted: number[]): number {
  return sorted[sorted.length - 1];
}

export function median(sorted: number[]): number {
  const half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[half];
  } else {
    return (sorted[half - 1] + sorted[half]) / 2;
  }
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
