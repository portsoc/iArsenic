/*

This script generates a JSON representation of the location hierarchy which looks like this:

[
  division: '..',
  districts: [
    district: '..',
    upazilas: [
      upazila: '..',
      unions: [
      ]
    ]
  ]
]
```

*/

const csvLoader = require('./load-csv');

console.debug = () => {};
const data = csvLoader();

// get the admin region hierarchy only

function extractNames(data, hierarchyPath) {
  const retval = [];
  if (hierarchyPath.length === 1) {
    for (const item of Object.keys(data)) {
      // on leaf level, do only a plain array
      retval.push(item);
    }
    retval.sort();
  } else {
    for (const item of Object.keys(data)) {
      const dataObj = data[item];
      const hierarchyObj = {
        [hierarchyPath[0]]: item,
      };
      if (hierarchyPath.length > 1) {
        const subData = dataObj[hierarchyPath[1] + 's'];
        hierarchyObj[hierarchyPath[1] + 's'] = extractNames(subData, hierarchyPath.slice(1));
      }
      retval.push(hierarchyObj);
    }
    retval.sort(compareByProperty(hierarchyPath[0]));
  }
  return retval;
}

function compareByProperty(prop) {
  return (a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] === b[prop]) return 0;
    return 1;
  };
}

// generating various subsets of the hierarchy

// const divisions = extractNames(data, ['division']);

// for (const division of divisions) {
//   const hierarchy = extractNames(data[division].districts, ['district', 'upazila', 'union']);
//
//   // console.log(JSON.stringify(divisions, null, 2));
//   // console.log(JSON.stringify(hierarchy, null, 2));
//   console.log('division ' + division + ' len: ' + JSON.stringify(hierarchy).length);
// }

// const hierarchy = extractNames(data, ['division', 'district', 'upazila', 'union']);
//
// // console.log(JSON.stringify(divisions, null, 2));
// console.log(JSON.stringify(hierarchy, null, 2));
// console.log(JSON.stringify(hierarchy).length);

// let hierarchy = extractNames(data, ['division', 'district', 'upazila', 'union']);
// console.log('all four levels len: ' + JSON.stringify(hierarchy, null, 2).length);
//
// hierarchy = extractNames(data, ['division', 'district', 'upazila']);
// console.log('first three levels len: ' + JSON.stringify(hierarchy).length);
//
// hierarchy = extractNames(data, ['division', 'district']);
// console.log('first two levels len: ' + JSON.stringify(hierarchy).length);

const hierarchy = extractNames(data, ['division', 'district', 'upazila', 'union']);
console.log(JSON.stringify(hierarchy));
