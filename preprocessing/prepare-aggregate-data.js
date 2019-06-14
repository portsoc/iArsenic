/*

This script generates a JSON representation of the location hierarchy including pre-processed arsenic level data
which looks like this:

[
  division: '..',  

  med_s: ...,   // short for as_median_shallow
  max_s: ...,   // short for as_max_shallow
  low_s: ...,   // short for lower_quantile_shallow
  upp_s: ...,   // short for upper_quantile_shallow
  
  med_m: ...,   // short for as_median_med
  max_m: ...,   // short for as_max_med
  low_m: ...,   // short for lower_quantile_med
  upp_m: ...,   // short for upper_quantile_med
  
  med_d: ...,   // short for as_median_deep
  max_d: ...,   // short for as_max_deep
  low_d: ...,   // short for lower_quantile_deep
  upp_d: ...,   // short for upper_quantile_deep

  districts: [
    district: '..',
    stats as above,
    upazilas: [
      upazila: '..',
      stats as above,
      unions: [
        union: '..',
        stats as above,
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

function extractStats(data, hierarchyPath) {
  const retval = {};
  for (const item of Object.keys(data)) {
    const dataObj = data[item];
    const hierarchyObj = {
      med_s: dataObj.as_median_shallow,
      max_s: dataObj.as_max_shallow,
      low_s: dataObj.lower_quantile_shallow,
      upp_s: dataObj.upper_quantile_shallow,
      med_m: dataObj.as_median_med,
      max_m: dataObj.as_max_med,
      low_m: dataObj.lower_quantile_med,
      upp_m: dataObj.upper_quantile_med,
      med_d: dataObj.as_median_deep,
      max_d: dataObj.as_max_deep,
      low_d: dataObj.lower_quantile_deep,
      upp_d: dataObj.upper_quantile_deep
    };
    if (hierarchyPath.length > 1) {
      const subData = dataObj[hierarchyPath[1] + 's'];
      hierarchyObj[hierarchyPath[1] + 's'] = extractStats(subData, hierarchyPath.slice(1));
    }
    retval[item] = hierarchyObj;
  }
  return retval;
}

const hierarchy = extractStats(data, ['division', 'district', 'upazila', 'union']);
console.log(JSON.stringify(hierarchy));
