// return quantile of the sorted sample (this is type-1 quantile in R)
// the parameter `sorted` must be a sorted array of numbers
// and p must be between 0 and 1 inclusive
function quantile(sorted, p) {
  const n = sorted.length;
  const which = Math.ceil(n * p) || 1; // p=0 uses the first element
  return sorted[which - 1];
}

function mean(sorted) {
  const average = sorted => sorted.reduce((a, b) => a + b, 0) / sorted.length;
  return average;
}

function max(sorted) {
  let max = Math.max(sorted);
  return max;
}

function median(sorted) {
  let half = Math.floor(sorted.length / 2);

  if (sorted.length % 2 != 0)
    return sorted[half];
  else
    return (sorted[half - 1] + sorted[half]) / 2.0;
}

module.exports = {
  quantile,
  mean,
  max,
  median
}
