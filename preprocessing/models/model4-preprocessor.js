/*

This script generates a JSON representation of the location hierarchy including pre-processed arsenic level data
which looks like this:

[
  Strata15
  Strata45
  Strata65
  Strata90
  Strata150
  StrataDeep

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
  region.strata15 = [];
  region.strata45 = [];
  region.strata65 = [];
  region.strata90 = [];
  region.strata150 = [];
  region.strataDeep = [];

  for (const well of region.wells) {
    if (well.depth < 15) {
      region.strata15.push(well.arsenic);
    } else if (well.depth < 45) {
      region.strata45.push(well.arsenic);
    } else if (well.depth < 65) {
      region.strata65.push(well.arsenic);
    } else if (well.depth < 90) {
      region.strata90.push(well.arsenic);
    } else if (well.depth < 150) {
      region.strata150.push(well.arsenic);
    } else {
      region.strataDeep.push(well.arsenic);
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
  location.strata15.sort(numericalCompare);
  location.strata45.sort(numericalCompare);
  location.strata65.sort(numericalCompare);
  location.strata90.sort(numericalCompare);
  location.strata150.sort(numericalCompare);
  location.strataDeep.sort(numericalCompare);

  //   take the computations from the parent or complain
  if (location.strata15 < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.s15_med = parent.s15_med;
      location.s15_max = parent.s15_max;
      location.s15_low = parent.s15_low;
      location.s15_upp = parent.s15_upp;
    }
  } else {
    // we do have enough data
    location.s15_med = stats.round1(stats.median(location.strata15));
    location.s15_max = stats.round1(stats.max(location.strata15));
    location.s15_low = stats.quantile(location.strata15, 0.1);
    location.s15_upp = stats.quantile(location.strata15, 0.9);
  }

  //   take the computations from the parent or complain
  if (location.strata45 < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.s45_med = parent.s45_med;
      location.s45_max = parent.s45_max;
      location.s45_low = parent.s45_low;
      location.s45_upp = parent.s45_upp;
    }
  } else {
    // we do have enough data
    location.s45_med = stats.round1(stats.median(location.strata45));
    location.s45_max = stats.round1(stats.max(location.strata45));
    location.s45_low = stats.quantile(location.strata45, 0.1);
    location.s45_upp = stats.quantile(location.strata45, 0.9);
  }

  //   take the computations from the parent or complain
  if (location.strata65 < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.s65_med = parent.s65_med;
      location.s65_max = parent.s65_max;
      location.s65_low = parent.s65_low;
      location.s65_upp = parent.s65_upp;
    }
  } else {
    // we do have enough data
    location.s65_med = stats.round1(stats.median(location.strata65));
    location.s65_max = stats.round1(stats.max(location.strata65));
    location.s65_low = stats.quantile(location.strata65, 0.1);
    location.s65_upp = stats.quantile(location.strata65, 0.9);
  }

  //   take the computations from the parent or complain
  if (location.strata90 < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.s90_med = parent.s90_med;
      location.s90_max = parent.s90_max;
      location.s90_low = parent.s90_low;
      location.s90_upp = parent.s90_upp;
    }
  } else {
    // we do have enough data
    location.s90_med = stats.round1(stats.median(location.strata90));
    location.s90_max = stats.round1(stats.max(location.strata90));
    location.s90_low = stats.quantile(location.strata90, 0.1);
    location.s90_upp = stats.quantile(location.strata90, 0.9);
  }

  //   take the computations from the parent or complain
  if (location.strata150 < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.s150_med = parent.s150_med;
      location.s150_max = parent.s150_max;
      location.s150_low = parent.s150_low;
      location.s150_upp = parent.s150_upp;
    }
  } else {
    // we do have enough data
    location.s150_med = stats.round1(stats.median(location.strata150));
    location.s150_max = stats.round1(stats.max(location.strata150));
    location.s150_low = stats.quantile(location.strata150, 0.1);
    location.s150_upp = stats.quantile(location.strata150, 0.9);
  }

  //   take the computations from the parent or complain
  if (location.strataDeep < MIN_DATA_COUNT) {
    if (!parent) {
      console.debug(`Division ${location.name} does not have enough shallow wells`);
    } else {
      location.sD_med = parent.sD_med;
      location.sD_max = parent.sD_max;
      location.sD_low = parent.sD_low;
      location.sD_upp = parent.sD_upp;
    }
  } else {
    // we do have enough data
    location.sD_med = stats.round1(stats.median(location.strataDeep));
    location.sD_max = stats.round1(stats.max(location.strataDeep));
    location.sD_low = stats.quantile(location.strataDeep, 0.1);
    location.sD_upp = stats.quantile(location.strataDeep, 0.9);
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
      hierarchyObj.s15 = {
        md: dataObj.s15_med,
        mx: dataObj.s15_max,
        lo: dataObj.s15_low,
        up: dataObj.s15_upp,
      };
      hierarchyObj.s45 = {
        md: dataObj.s45_med,
        mx: dataObj.s45_max,
        lo: dataObj.s45_low,
        up: dataObj.s45_upp,
      };
      hierarchyObj.s65 = {
        md: dataObj.s65_med,
        mx: dataObj.s65_max,
        lo: dataObj.s65_low,
        up: dataObj.s65_upp,
      };
      hierarchyObj.s90 = {
        md: dataObj.s90_med,
        mx: dataObj.s90_max,
        lo: dataObj.s90_low,
        up: dataObj.s90_upp,
      };
      hierarchyObj.s150 = {
        md: dataObj.s150_med,
        mx: dataObj.s150_max,
        lo: dataObj.s150_low,
        up: dataObj.s150_upp,
      };
      hierarchyObj.sD = {
        md: dataObj.sD_med,
        mx: dataObj.sD_max,
        lo: dataObj.sD_low,
        up: dataObj.sD_upp,
      };
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
