// return quantile of the sorted sample (this is type-1 quantile in R)
// the parameter `sorted` must be a sorted array of numbers
// and p must be between 0 and 1 inclusive
function quantile(sorted, p) {
  const n = sorted.length;
  const which = Math.ceil(n*p) || 1; // p=0 uses the first element
  return sorted[which-1];
}

function mean(sorted) {
//sum of all values divided by number of values
}

function max(sorted) {
//highest value in a list
}

function median(sorted) {
//middle value if odd. half way between two middle terms
}

module.exports = {
  quantile,
}
