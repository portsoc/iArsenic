/*

This script generates a JSON representation of the location hierarchy including pre-processed arsenic level data
which looks like this:

[
  division: '..',
  s: {
    md: ...,   // short for as_median_shallow
    mx: ...,   // short for as_max_shallow
    lo: ...,   // short for lower_quantile_shallow
    up: ...,   // short for upper_quantile_shallow
  }

  m: {
    md: ...,   // short for as_median_med
    mx: ...,   // short for as_max_med
    lo: ...,   // short for lower_quantile_med
    up: ...,   // short for upper_quantile_med
  }

  d: {
    md: ...,   // short for as_median_med
    mx: ...,   // short for as_max_med
    lo: ...,   // short for lower_quantile_med
    up: ...,   // short for upper_quantile_med
  }

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

const stats = require('../lib/stats');

const MIN_DATA_COUNT = 7;

function structureLocation(region) {
  region.wells_shallow = [];
  region.wells_med = [];
  region.wells_deep = [];

  for (const well of region.wells) {
    if (well.depth < 90) {
      region.wells_shallow.push(well.arsenic);
    } else if (well.depth < 150) {
      region.wells_med.push(well.arsenic);
    } else {
      region.wells_deep.push(well.arsenic);
    }
  }
}

function organiseArsenicData(divisions) {
  for (const div of Object.values(divisions)) {
    structureLocation(div);
    for (const dis of Object.values(div.districts)) {
      structureLocation(dis);
      for (const upa of Object.values(dis.upazilas)) {
        structureLocation(upa);
        for (const uni of Object.values(upa.unions)) {
          structureLocation(uni);
        }
      }
    }
  }

  return divisions;
}

function computeWellStats(location) {
  // sort the arsenic concentration data arrays
  location.wells_shallow.sort(numericalCompare);
  location.wells_med.sort(numericalCompare);
  location.wells_deep.sort(numericalCompare);

  // if we don't have enough shallow well data (d<90)
  //   take the computations from the parent or complain
  if (location.wells_shallow.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.med_s = location.parent.med_s;
      location.max_s = location.parent.max_s;
      location.low_s = location.parent.low_s;
      location.upp_s = location.parent.upp_s;
    }
  } else {
    // we do have enough data
    location.med_s = stats.median(location.wells_shallow);
    location.max_s = stats.max(location.wells_shallow);
    location.low_s = stats.quantile(location.wells_shallow, 0.1);
    location.upp_s = stats.quantile(location.wells_shallow, 0.9);
  }

  // if we don't have enough med well data (90<=d<150)
  //   take the computations from the parent or complain
  if (location.wells_med.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough med wells`);
    } else {
      location.med_m = location.parent.med_m;
      location.max_m = location.parent.max_m;
      location.low_m = location.parent.low_m;
      location.upp_m = location.parent.upp_m;
    }
  } else {
    // we do have enough data
    location.med_m = stats.median(location.wells_med);
    location.max_m = stats.max(location.wells_med);
    location.low_m = stats.quantile(location.wells_med, 0.1);
    location.upp_m = stats.quantile(location.wells_med, 0.9);
  }

  // if we don't have enough deep well data (150<=d)
  //   take the computations from the parent or complain
  if (location.wells_deep.length < MIN_DATA_COUNT) {
    if (!location.parent) {
      console.debug(`Division ${location.name} does not have enough deep wells`);
    } else {
      location.med_d = location.parent.med_d;
      location.max_d = location.parent.max_d;
      location.low_d = location.parent.low_d;
      location.upp_d = location.parent.upp_d;
    }
  } else {
    // we do have enough data
    location.med_d = stats.median(location.wells_deep);
    location.max_d = stats.max(location.wells_deep);
    location.low_d = stats.quantile(location.wells_deep, 0.1);
    location.upp_d = stats.quantile(location.wells_deep, 0.9);
  }
}

function numericalCompare(a, b) {
  return a - b;
}

function extractStats(data, hierarchyPath) {
  const retval = {};
  for (const item of Object.keys(data)) {
    const dataObj = data[item];
    const hierarchyObj = {
      s: {
        md: dataObj.med_s,
        mx: dataObj.max_s,
        lo: dataObj.low_s,
        up: dataObj.upp_s
      },
      m: {
        md: dataObj.med_m,
        mx: dataObj.max_m,
        lo: dataObj.low_m,
        up: dataObj.upp_m
      },
      d: {
        md: dataObj.med_d,
        mx: dataObj.max_d,
        lo: dataObj.low_d,
        up: dataObj.upp_d
      }
    };
    if (hierarchyPath.length > 1) {
      const subData = dataObj[hierarchyPath[1] + 's'];
      hierarchyObj[hierarchyPath[1] + 's'] = extractStats(subData, hierarchyPath.slice(1));
    }
    retval[item] = hierarchyObj;
  }
  return retval;
}

function main(data) {
  const divisions = organiseArsenicData(data);

  for (const div of Object.values(divisions)) {
    computeWellStats(div);
    for (const dis of Object.values(div.districts)) {
      computeWellStats(dis);
      for (const upa of Object.values(dis.upazilas)) {
        computeWellStats(upa);
        for (const uni of Object.values(upa.unions)) {
          computeWellStats(uni);
        }
      }
    }
  }

  const aggregateData = extractStats(divisions, ['division', 'district', 'upazila', 'union']);
  return aggregateData;
}

module.exports = main;
