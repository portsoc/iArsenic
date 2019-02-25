// return quantile of the sorted sample (this is type-1 quantile in R)
// the parameter `sorted` must be a sorted array of numbers
// and p must be between 0 and 1 inclusive
function quantile(sorted, p) {
  const n = sorted.length;
  const which = Math.ceil(n*p) || 1; // p=0 uses the first element
  return sorted[which-1];
}

module.exports = {
  quantile,
}
