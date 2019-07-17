/*

This script generates a JSON representation of the location hierarchy including pre-processed arsenic level data
which looks like this:

[
  division: '..',
    as_median_under_90,
    as_max_under_90,
    lower_quantile_under_90,
    upper_quantile_under_90,
    as_mean_over_90

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
*/

const stats = require('../lib/stats');

const MIN_DATA_COUNT = 7;

function structureLocation(region) {
  region.wells_under_90 = [];
  region.wells_over_90 = [];

  for (const well of region.wells) {
    if (well.depth < 90) {
      region.wells_under_90.push(well.arsenic);
    } else {
      region.wells_over_90.push(well.arsenic);
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

function computeWellStats(location, parent) {
  // sort the arsenic concentration data arrays
  location.wells_under_90.sort(numericalCompare);
  location.wells_over_90.sort(numericalCompare);

  // if we don't have enough data under 90
  //   take the computations from the parent or complain
  if (location.wells_under_90.length < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough wells under 90`);
    } else {
      location.as_median_under_90 = parent.as_median_under_90;
      location.as_max_under_90 = parent.as_max_under_90;
      location.lower_quantile_under_90 = parent.lower_quantile_under_90;
      location.upper_quantile_under_90 = parent.upper_quantile_under_90;
    }
  } else {
    // we do have enough data under 90
    location.as_median_under_90 = stats.median(location.wells_under_90);
    location.as_max_under_90 = stats.max(location.wells_under_90);
    location.lower_quantile_under_90 = stats.quantile(location.wells_under_90, 0.1);
    location.upper_quantile_under_90 = stats.quantile(location.wells_under_90, 0.9);
  }

  // if we don't have enough data over 90
  //   take the computations from the parent or complain
  if (location.wells_over_90.length < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough wells under 90`);
    } else {
      location.as_mean_over_90 = parent.as_mean_over_90;
    }
  } else {
    // we do have enough data over 90
    location.as_mean_over_90 = stats.mean(location.wells_over_90);
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
      as_median_under_90: dataObj.as_median_under_90,
      as_max_under_90: dataObj.as_max_under_90,
      lower_quantile_under_90: dataObj.lower_quantile_under_90,
      upper_quantile_under_90: dataObj.upper_quantile_under_90,
      as_mean_over_90: dataObj.as_mean_over_90,
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
      computeWellStats(dis, div);
      for (const upa of Object.values(dis.upazilas)) {
        computeWellStats(upa, dis);
        for (const uni of Object.values(upa.unions)) {
          computeWellStats(uni, upa);
        }
      }
    }
  }

  const aggregateData = extractStats(divisions, ['division', 'district', 'upazila', 'union']);
  return aggregateData;
}

module.exports = main;
