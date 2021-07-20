// produce-dropdown.js
// in data/dropdown-data.json is the divisions, districts, upazilas,
// unions and mouzas for the dropdown data on the client.

// i use the 1m dataset to extract the names of mouzas, using the origonal dropdown-data.js
// as a reference for the unions that parent the mouzas

// does not make the assumption that the 1m dataset includes every single union
// in bangladesh

const fs = require('fs');

// eslint won't let me add this as a prototype to Array
function searchArrayProperty(array, property, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === value) return i;
  }
  return false;
}

function loadDataset() {
  return fs.readFileSync('../../data/1Mdataset.csv').toString().split('\n');
}

// returns an object of [{ union: union, mouzas: [] }]
function extractMouzas(dataset) {
  // union, index 3
  // mouza, index 4

  console.log(`Traversing dataset size (${dataset.length}), this may take a while`);

  const ret = [];
  for (let line = 0; line < dataset.length; line++) {
    // ignore the header line
    if (line === 0) continue;
    // if (typeof dataset[line] !== 'string') continue;
    // if (dataset[line].trim() === '') continue;

    const csvValue = dataset[line].split(',');
    const unionName = csvValue[3];
    const mouzaName = csvValue[4];

    // optimisation, only call searchArrayProperty once
    let unionIndex = searchArrayProperty(ret, 'union', unionName);

    if (unionIndex === false) {
      console.log(`New union found (${unionName})`);
      ret.push({
        union: unionName,
        mouzas: [],
      });
      unionIndex = ret.length - 1;
    }

    // push mouza id it doesnt exist
    if (!ret[unionIndex].mouzas.includes(mouzaName)) {
      console.log(`New mouza found (${mouzaName}) of union (${unionName})`);
      ret[unionIndex].mouzas.push(mouzaName);
    }
  }

  console.log(`Found ${ret.length} unions with mouzas`);

  return ret;
}

const datacsv = loadDataset();
const mouzas = extractMouzas(datacsv);

fs.writeFileSync('output.json', JSON.stringify(mouzas, null, 4));
