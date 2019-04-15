/*

This script generates a JSON representation of the location hierarchy including pre-processed arsenic level data
which looks like this:

[
  division: '..',

  as_median_under_90: ...,
  as_max_under_90: ...,
  lower_quantile_under_90: ...,
  upper_quantile_under_90: ...,
  as_mean_over_90: ...,

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
      med: dataObj.as_median_under_90,
      max: dataObj.as_max_under_90,
      low: dataObj.lower_quantile_under_90,
      upp: dataObj.upper_quantile_under_90,
      mo9: dataObj.as_mean_over_90,
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
