/*
Model 4 is like model 3 but with different stratification of the depths.
In model 4, we use the following depth boundaries:

15m, 45m, 65m, 90m, and 150m

Strata are named with the top-boundary, so e.g. s45 covers depths of 15 to 45,
including 15 and excluding 45. The last stratum is sD for "deeper than 150m".

This script generates a JSON representation of the location hierarchy
including pre-processed arsenic concentration data which looks like this:

[
  {
    division: '..',
    districts: [
      {
        district: '..',
        upazilas: [
          {
            upazila: '..',
            unions: [
              {
                union: '..',
                s15: {
                  md: ...,   // short for median
                  mx: ...,   // short for maximum
                  lo: ...,   // short for lower quantile
                  up: ...,   // short for upper quantile
                },
                s45: {
                  md: ...,
                  mx: ...,
                  lo: ...,
                  up: ...,
                },
                s65: {
                  md: ...,
                  mx: ...,
                  lo: ...,
                  up: ...,
                },
                s90: {
                  md: ...,
                  mx: ...,
                  lo: ...,
                  up: ...,
                },
                s150: {
                  md: ...,
                  mx: ...,
                  lo: ...,
                  up: ...,
                },
                sD: {
                  md: ...,
                  mx: ...,
                  lo: ...,
                  up: ...,
                },
              },
              ... further unions
            ]
          },
          ... further upazilas
        ]
      },
      ... further districts
    ]
  },
  ... further divisions
]
*/

const stats = require('../lib/stats');

const MIN_DATA_COUNT = 7;

// splits wells in the given region by depth
function partitionWells(region) {
  region.s15 = [];
  region.s45 = [];
  region.s65 = [];
  region.s90 = [];
  region.s150 = [];
  region.sD = [];

  for (const well of region.wells) {
    if (well.depth < 15) {
      region.s15.push(well.arsenic);
    } else if (well.depth < 45) {
      region.s45.push(well.arsenic);
    } else if (well.depth < 65) {
      region.s65.push(well.arsenic);
    } else if (well.depth < 90) {
      region.s90.push(well.arsenic);
    } else if (well.depth < 150) {
      region.s150.push(well.arsenic);
    } else {
      region.sD.push(well.arsenic);
    }
  }
}

function organiseArsenicData(divisions) {
  for (const div of Object.values(divisions)) {
    partitionWells(div);
    for (const dis of Object.values(div.districts)) {
      partitionWells(dis);
      for (const upa of Object.values(dis.upazilas)) {
        partitionWells(upa);
        for (const uni of Object.values(upa.unions)) {
          partitionWells(uni);
        }
      }
    }
  }

  return divisions;
}

const STRATA = ['s15', 's45', 's65', 's90', 's150', 'sD'];

function computeWellStats(location, parent) {
  // sort the arsenic concentration data arrays for the stats library
  location.s15.sort(numericalCompare);
  location.s45.sort(numericalCompare);
  location.s65.sort(numericalCompare);
  location.s90.sort(numericalCompare);
  location.s150.sort(numericalCompare);
  location.sD.sort(numericalCompare);

  // compute statistics for each stratum
  for (const stratum of STRATA) {
    // if we don't have enough well data on a given stratum
    //   take the computations from the parent or complain
    if (location[stratum] < MIN_DATA_COUNT) {
      if (!parent) {
        const stratumName = stratum === 'sD' ? 'Deep' : stratum;
        console.debug(`Division ${location.name} does not have enough ${stratumName}`);
      } else {
        location[`${stratum}_med`] = parent[`${stratum}_med`];
        location[`${stratum}_max`] = parent[`${stratum}_max`];
        location[`${stratum}_low`] = parent[`${stratum}_low`];
        location[`${stratum}_upp`] = parent[`${stratum}_upp`];
      }
    } else {
      // we do have enough data
      location[`${stratum}_med`] = stats.round1(stats.median(location[stratum]));
      location[`${stratum}_max`] = stats.round1(stats.max(location[stratum]));
      location[`${stratum}_low`] = stats.quantile(location[stratum], 0.1);
      location[`${stratum}_upp`] = stats.quantile(location[stratum], 0.9);
    }
  }
}

function numericalCompare(a, b) {
  return a - b;
}

function extractStats(data, hierarchyPath) {
  const retval = {};
  for (const item of Object.keys(data)) {
    const dataObj = data[item];
    const hierarchyObj = {};

    if (hierarchyPath.length === 1) {
      for (const stratum of STRATA) {
        hierarchyObj[stratum] = {
          md: dataObj[`${stratum}_med`],
          mx: dataObj[`${stratum}_max`],
          lo: dataObj[`${stratum}_low`],
          up: dataObj[`${stratum}_upp`],
        };
      }
    }

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
