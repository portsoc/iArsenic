/*
Model 5 is like model 4 but with different approach to dealing
with areas that don't have enough wells.

In model 4 and 5, we use the following depth boundaries:

15.3m, 45m, 65m, 90m, and 150m

The first stratum ends at 15.3m because the users will indicate well depth
in feet and they are likely to round up, so a well under 15m might be reported as
50ft which is just under 15.3m. The stratum is still called s15 below.

Strata are named with the top-boundary, so e.g. s45 covers depths of 15.3 to 45,
including 15.3 and excluding 45. The last stratum is sD for "deeper than 150m".

MODEL 5

In model 5:
 * if we don't have enough wells somewhere, we can combine strata and
   look for geographically nearby areas within some radius
 * at <15m, first look at <45m, then widen geographically still
   at <45m up to 10km, meaning we take <15m together with 15-45
 * at 15-45, first try 15-65, then widen 15-45 geographically
   up to 10km, then widen 15-65 up to 20km
 * at 45-65, first try 45-90, then widen 45-65 up to 10km, then
   widen 45-90 up to 20km
 * at 65-90, first try 65-150, then widen 65-90 up to 20km, then
   widen 65 to 150 up to 20km
 * at 90-150, first try 90+, then widen 90-150 up to 100km, then
   widen 90+ up to 100km
 * at >150m, we can take about 100km radius

For example, if a union doesn't have enough wells at <15m, we will take
all wells at <45m instead. If that's still not enough, we find the nearest
union and add its wells at <45m, and we continue to farther and farther
unions until we reach the distance of 10km, then we give up.

OUTPUT

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
                  m: ...,   // short for message ID
                  l: ...,   // short for lower quantile
                  u: ...,   // short for upper quantile
                },
                s45: {
                  m: ...,
                  l: ...,
                  u: ...,
                },
                s65: {
                  m: ...,
                  l: ...,
                  u: ...,
                },
                s90: {
                  m: ...,
                  l: ...,
                  u: ...,
                },
                s150: {
                  m: ...,
                  l: ...,
                  u: ...,
                },
                sD: {
                  m: ...,
                  l: ...,
                  u: ...,
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

function isEnoughData(wellsList) {
  return wellsList && wellsList.length >= MIN_DATA_COUNT;
}

// splits wells in the given region by depth
function stratifyWells(locationArr) {
  const region = locationArr[locationArr.length - 1];

  region.s15 = [];
  region.s45 = [];
  region.s65 = [];
  region.s90 = [];
  region.s150 = [];
  region.sD = [];

  for (const well of region.wells) {
    if (well.depth < 15.3) {
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

function sortWells(locationArr) {
  const region = locationArr[locationArr.length - 1];

  // sort the arsenic concentration data arrays for the stats library
  for (const stratum of STRATA) {
    region[stratum].sort(numericalCompare);
    if (region[stratum + 'Wider']) region[stratum + 'Wider'].sort(numericalCompare);
  }
}

function formatUnionName(locationArr) {
  return (
    locationArr
      .map(region => region.name)
      .join(' -> ')
  );
}

const STRATA = ['s15', 's45', 's65', 's90', 's150', 'sD'];

function computeWellStats(locationArr) {
  const location = locationArr[locationArr.length - 1];

  for (const stratum of STRATA) {
    let wells = location[stratum];

    if (!isEnoughData(wells)) {
      // get wider wells
      wells = location[stratum + 'Wider'];
    }

    if (isEnoughData(wells)) {
      // compute the statistics
      location[`${stratum}_med`] = stats.round1(stats.median(location[stratum]));
      location[`${stratum}_max`] = stats.round1(stats.max(location[stratum]));
      location[`${stratum}_low`] = stats.quantile(location[stratum], 0.1);
      location[`${stratum}_upp`] = stats.quantile(location[stratum], 0.9);
    } else {
      // if we don't have enough well data on a given stratum,
      // getEnoughData should have already reported that, but
      // complain here for consistency check
      const stratumName = stratum === 'sD' ? 'deep' : stratum;
      console.debug(`Union ${formatUnionName(locationArr)} does not have enough ${stratumName} wells`);
    }
  }
}

function getEnoughData(locationArr) {
  const location = locationArr[locationArr.length - 1];
  // if we don't have enough wells somewhere, we can combine strata and
  // look for geographically nearby areas within some radius
  // the rules are at the top of the file

  // * at <15m, first look at <45m, then widen geographically still
  //   at <45m up to 10km, meaning we take <15m together with 15-45
  //         - generate local s45, then s15+s45 up to 10km
  location.s15Wider =
    widen(location.s15, location.s45, ...near(locationArr, 10).map(strataSelector('s15', 's45')));

  // * at 15-45, first try 15-65, then widen 15-45 geographically
  //   up to 10km, then widen 15-65 up to 20km
  //         - generate local s65
  //         - second try: generate s45 up to 10km
  //         - third try: generate local s65, then s45+s65 up to 20km
  location.s45Wider =
    widen(location.s45, location.s65) ||
    widen(location.s45, ...near(locationArr, 10).map(strataSelector('s45'))) ||
    widen(location.s45, location.s65, ...near(locationArr, 20).map(strataSelector('s45', 's65')));

  // * at 45-65, first try 45-90, then widen 45-65 up to 10km, then
  //   widen 45-90 up to 20km
  //         - generate local s90
  //         - second try: generate s65 up to 10km
  //         - third try: generate local s90, then s65+s90 up to 20km
  location.s65Wider =
    widen(location.s65, location.s90) ||
    widen(location.s65, ...near(locationArr, 10).map(strataSelector('s65'))) ||
    widen(location.s65, location.s90, ...near(locationArr, 20).map(strataSelector('s65', 's90')));

  // * at 65-90, first try 65-150, then widen 65-90 up to 20km, then
  //   widen 65 to 150 up to 20km
  //         - generate local s150
  //         - second try: generate s90 up to 20km
  //         - third try: generate local s150, then s90+s150 up to 20km
  if (!isEnoughData(location.s90)) {
    const nearbyLocations = near(locationArr, 20);

    // this will contain arrays of wells gathered from the given strata in the nearby locations
    const wellsArrays90 = nearbyLocations.map(strataSelector('s90'));
    const wellsArrays90and150 = nearbyLocations.map(strataSelector('s90', 's150'));

    location.s90Wider =
      widen(location.s90, [location.s150]) ||
      widen(location.s90, wellsArrays90) ||
      widen(location.s90.concat(location.s150), wellsArrays90and150);
  }

  // * at 90-150, first try 90+, then widen 90-150 up to 100km, then
  //   widen 90+ up to 100km
  //         - generate local sD
  //         - second try: generate s150 up to 100km
  //         - third try: generate local sD, then s150+sD up to 100km
  if (!isEnoughData(location.s150)) {
    const nearbyLocations = near(locationArr, 100);

    // this will contain arrays of wells gathered from the given strata in the nearby locations
    const wellsArrays150 = nearbyLocations.map(strataSelector('s150'));
    const wellsArrays150plus = nearbyLocations.map(strataSelector('s150', 'sD'));

    location.s150Wider =
      widen(location.s150, [location.sD]) ||
      widen(location.s150, wellsArrays150) ||
      widen(location.s150.concat(location.sD), wellsArrays150plus);
  }

  // * at >150m, we can take about 100km radius
  //         - generate sD until 100km
  if (!isEnoughData(location.sD)) {
    const nearbyLocations = near(locationArr, 100);

    // this will contain arrays of wells gathered from the given strata in the nearby locations
    const wellsArrays = nearbyLocations.map(strataSelector('sD'));

    location.sDWider = widen(location.sD, wellsArrays);
  }

  for (const stratum of STRATA) {
    if (!isEnoughData(location[stratum]) && !isEnoughData(location[stratum + 'Wider'])) {
      // complain if we don't have enough well data on a given stratum
      const stratumName = stratum === 'sD' ? 'deep' : stratum;
      console.debug(`Union ${formatUnionName(locationArr)} does not have enough ${stratumName} wells`);
    }
  }
}

//  for (const wells of  {

// starting with startingArray, until we reach isEnoughData(), keep adding arrays from
// arraysToAdd
function widen(startingArray, ...arraysToAdd) {
  let wider = startingArray;

  for (const wells of arraysToAdd) {
    if (isEnoughData(wider)) break;
    wider = wider.concat(wells);
  }

  return isEnoughData(wider) ? wider : null;
}

function strataSelector(...strata) {
  return function (location) {
    let wellsInLocation = [];
    for (const stratum of strata) {
      wellsInLocation = wellsInLocation.concat(location[stratum]);
    }
    return wellsInLocation;
  };
}

// todo we will want to see stats on how far in the widening did we have to go

function near(locationArr, kmDistance) {
  // todo find locations (at same administrative depth as locationArr)
  // that are near locationArr; sort them from nearest to farthest
  // the array must not include locationArr itself
  return [];

  // get a list of distances with code like geodata/geo-preprocessing.js
  // then construct an array of locations up to the given distance
  // and then sort by distance
}

function numericalCompare(a, b) {
  return a - b;
}

function produceMessage(med, max) {
  if (med == null) return 0;
  let pollutionStatus = '';
  if (med > 20 && med <= 50) {
    pollutionStatus = 3;
  } else if (med > 50 && med <= 200) {
    pollutionStatus = 5;
  } else if (med > 200) {
    pollutionStatus = 7;
  } else {
    pollutionStatus = 1;
  }

  const chemTestStatus = (max <= 100) ? 0 : 1;

  return pollutionStatus + chemTestStatus;
}

function extractStats(data, hierarchyPath) {
  const retval = {};
  for (const item of Object.keys(data)) {
    const dataObj = data[item];
    const hierarchyObj = {};

    if (hierarchyPath.length === 1) {
      for (const stratum of STRATA) {
        hierarchyObj[stratum] = {
          m: produceMessage(dataObj[`${stratum}_med`], dataObj[`${stratum}_max`]),
          l: dataObj[`${stratum}_low`],
          u: dataObj[`${stratum}_upp`],
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

function forEachUnion(divisions, f) {
  for (const div of Object.values(divisions)) {
    for (const dis of Object.values(div.districts)) {
      for (const upa of Object.values(dis.upazilas)) {
        for (const uni of Object.values(upa.unions)) {
          f([div, dis, upa, uni]);
        }
      }
    }
  }
}

function main(divisions) {
  // split wells into strata
  forEachUnion(divisions, stratifyWells);

  // if a stratum doesn't have enough wells, widen the search
  forEachUnion(divisions, getEnoughData);

  // sort the wells so the stats functions work well
  forEachUnion(divisions, sortWells);

  // get the actual stats
  forEachUnion(divisions, computeWellStats);

  const aggregateData = extractStats(divisions, ['division', 'district', 'upazila', 'union']);
  return aggregateData;
}

module.exports = main;
