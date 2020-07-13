const corrections = {
  'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur': [
    'Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
};

function combineName(o) {
  return `${o.div}#${o.dis}#${o.upa}#${o.uni}`;
}

function replaceName(o, arr) {
  [o.div, o.dis, o.upa, o.uni] = arr;
}

function correctRegionName(region) {
  const correction = corrections[combineName(region)];
  if (correction) {
    replaceName(region, correction);
  }
}

module.exports = {
  correct: correctRegionName,
};
