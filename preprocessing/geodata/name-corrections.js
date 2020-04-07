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

function correctAreaName(area) {
  const correction = corrections[combineName(area)];
  if (correction) {
    replaceName(area, correction);
  }
}

module.exports = {
  correct: correctAreaName,
};
