/*
Model 5 is like model 4 but with different approach to dealing
with regions that don't have enough wells.

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
   look for geographically nearby regions within some radius
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

import * as stats from '../lib/stats';
import { computeNearbyRegions } from '../lib/geo-data';
import { BasicDataSet, District, Division, GeoRegion, StatsHierarchyObj, Region, RegionStatistics, RegionWithStrata, Upazila } from '../lib/types';

const MIN_DATA_COUNT = 7;

type PreprocessorRegion = Region & Partial<RegionWithStrata> & Partial<RegionStatistics> & Partial<GeoRegion>;
type PreprocessorRegionWithRequiredStats = Region & Partial<RegionWithStrata> & RegionStatistics & Partial<GeoRegion>;

function isEnoughData(wellsList: number[] | number) {
  if (!Array.isArray(wellsList)) wellsList = [wellsList];
  const length = (typeof wellsList === 'number') ? wellsList : wellsList.length;
  return length >= MIN_DATA_COUNT;
}

// splits wells in the given region by depth
function stratifyWells(locationArr: PreprocessorRegion[]) {
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

const STRATA = ['s15', 's45', 's65', 's90', 's150', 'sD'];

function sortWells(locationArr: PreprocessorRegion[]) {
  const region = locationArr[locationArr.length - 1];

  // sort the arsenic concentration data arrays for the stats library
  for (const stratum of STRATA) {
    (region[stratum as keyof PreprocessorRegion] as number[]).sort(numericalCompare);
    if ((region[stratum + 'Wider' as keyof PreprocessorRegion])) {
      (region[stratum + 'Wider' as keyof PreprocessorRegion] as number[]).sort(numericalCompare);
    }
  }
}

function computeWellStats(locationArr: PreprocessorRegion[]) {
  const location = locationArr[locationArr.length - 1];

  for (const stratum of STRATA) {
    let wells = location[stratum as keyof PreprocessorRegion] as number[];

    if (!isEnoughData(wells)) {
      // get wider wells
      wells = location[stratum + 'Wider' as keyof PreprocessorRegion] as number[];
    }

    if (isEnoughData(wells)) {
      // compute the statistics
      location[`${stratum}_med` as keyof RegionStatistics] = stats.round1(stats.median(wells));
      location[`${stratum}_max` as keyof RegionStatistics] = stats.round1(stats.max(wells));
      location[`${stratum}_low` as keyof RegionStatistics] = stats.quantile(wells, 0.1);
      location[`${stratum}_upp` as keyof RegionStatistics] = stats.quantile(wells, 0.9);
    } else {
      // if we don't have enough well data on a given stratum,
      // getEnoughData should have already reported that, but
      // complain here for consistency check
      const stratumName = stratum === 'sD' ? 'deep' : stratum;
      const unionName = locationArr.map(region => region.name).join(' -> ');
      console.debug(`Union ${unionName} does not have enough ${stratumName} wells`);
    }
  }
}

function getEnoughData(locationArr: PreprocessorRegion[]) {
  const locationsAsRegion = locationArr as (Region & RegionWithStrata & Partial<RegionStatistics> & GeoRegion)[];

  // a shortcut function for notation
  // it finds regions within `km` of locationArr, and extracts wells from them, combining the provided strata.
  // returns an array of well arrays
  function nearbyWells(km: number, ...strata: ('s15' | 's45' | 's65' | 's90' | 's150' | 'sD')[]) {
    const locations = nearbyLocations(locationsAsRegion, km);
    return locations.map(strataSelector(...strata));
  }

  const location = locationsAsRegion[locationsAsRegion.length - 1];
  // if we don't have enough wells somewhere, we can combine strata and
  // look for geographically nearby region within some radius
  // the rules are also at the top of the file

  // * at <15m, first look at <45m, then widen geographically still
  //   at <45m up to 10km, meaning we take <15m together with 15-45
  //         - generate local s45, then s15+s45 up to 10km
  location.s15Wider =
    widen(location.s15, location.s45, ...nearbyWells(10, 's15', 's45'));

  // * at 15-45, first try 15-65, then widen 15-45 geographically
  //   up to 10km, then widen 15-65 up to 20km
  //         - generate local s65
  //         - second try: generate s45 up to 10km
  //         - third try: generate local s65, then s45+s65 up to 20km
  location.s45Wider =
    widen(location.s45, location.s65) ||
    widen(location.s45, ...nearbyWells(10, 's45')) ||
    widen(location.s45.concat(location.s65), ...nearbyWells(20, 's45', 's65'));

  // * at 45-65, first try 45-90, then widen 45-65 up to 10km, then
  //   widen 45-90 up to 20km
  //         - generate local s90
  //         - second try: generate s65 up to 10km
  //         - third try: generate local s90, then s65+s90 up to 20km
  location.s65Wider =
    widen(location.s65, location.s90) ||
    widen(location.s65, ...nearbyWells(10, 's65')) ||
    widen(location.s65.concat(location.s90), ...nearbyWells(20, 's65', 's90'));

  // * at 65-90, first try 65-150, then widen 65-90 up to 20km, then
  //   widen 65 to 150 up to 20km
  //         - generate local s150
  //         - second try: generate s90 up to 20km
  //         - third try: generate local s150, then s90+s150 up to 20km
  location.s90Wider =
    widen(location.s90, location.s150) ||
    widen(location.s90, ...nearbyWells(20, 's90')) ||
    widen(location.s90.concat(location.s150), ...nearbyWells(20, 's90', 's150'));

  // * at 90-150, first try 90+, then widen 90-150 up to 100km, then
  //   widen 90+ up to 100km
  //         - generate local sD
  //         - second try: generate s150 up to 100km
  //         - third try: generate local sD, then s150+sD up to 100km
  location.s150Wider =
    widen(location.s150, location.sD) ||
    widen(location.s150, ...nearbyWells(100, 's150')) ||
    widen(location.s150.concat(location.sD), ...nearbyWells(100, 's150', 'sD'));

  // * at >150m, we can take about 100km radius
  //         - generate sD until 100km
  location.sDWider = widen(location.sD, ...nearbyWells(100, 'sD'));
}

// starting with startingArray, until we reach isEnoughData(), keep adding arrays from
// arraysToAdd
function widen(startingArray: number[], ...arraysToAdd: number[][]) {
  if (isEnoughData(startingArray)) return startingArray;

  let wider = startingArray;

  for (const wells of arraysToAdd) {
    wider = wider.concat(wells);
    if (isEnoughData(wider)) break;
  }

  return isEnoughData(wider) ? wider : undefined;
}

function strataSelector(...strata: ('s15' | 's45' | 's65' | 's90' | 's150' | 'sD')[]) {
  return function (location: PreprocessorRegion) {
    let wellsInLocation: number[] = [];
    for (const stratum of strata) {
      if (location[stratum] === undefined) return [];
      wellsInLocation = wellsInLocation.concat(location[stratum] as number[]);
    }
    return wellsInLocation;
  };
}

/*
 * returns an array of locations (at same administrative depth as locationArr)
 * e.g. if locationArr points to a union, we return an array of unions in order
 * of increasing distance, up to kmDistance.
 */
function nearbyLocations(locationArr: GeoRegion[], kmDistance: number) {
  const location = locationArr[locationArr.length - 1];
  const nearbyRegions = location.nearbyRegions;
  const firstOutsideDistance = nearbyRegions.findIndex(a => a.distance > kmDistance);

  const regionsWithinDistance =
    firstOutsideDistance === -1
      ? nearbyRegions
      : nearbyRegions.slice(0, firstOutsideDistance);

  return regionsWithinDistance.map(a => a.region);
}

function numericalCompare(a: number, b: number) {
  return a - b;
}

// model5-estimator has an array of messages in increasing pollution level
// 0 is not enough data
// then odd number is consistent pollution,
// and the following even number is high outliers so we suggest chemical test
function produceMessage(med: number, max: number) {
  if (med == null) return 0;
  let pollutionStatus;
  if (med <= 20) {
    pollutionStatus = 1;
  } else if (med <= 50) {
    pollutionStatus = 3;
  } else if (med <= 200) {
    pollutionStatus = 5;
  } else {
    pollutionStatus = 7;
  }

  const chemTestStatus = (max <= 100) ? 0 : 1;

  return pollutionStatus + chemTestStatus;
}

function extractStats(
  data: {[index: string]: PreprocessorRegionWithRequiredStats},
  hierarchyPath: string[],
) {
  const retval: StatsHierarchyObj = {};
  for (const item of Object.keys(data)) {
    const dataObj = data[item];
    const hierarchyObj: StatsHierarchyObj = {};

    if (hierarchyPath.length === 1) {
      for (const stratum of STRATA) {
        hierarchyObj[stratum as keyof StatsHierarchyObj] = {
          m: produceMessage(dataObj[`${stratum}_med`as keyof RegionStatistics],
            dataObj[`${stratum}_max` as keyof RegionStatistics]),
          l: dataObj[`${stratum}_low` as keyof RegionStatistics],
          u: dataObj[`${stratum}_upp` as keyof RegionStatistics],
        };
      }
    }

    if (hierarchyPath.length > 1) {
      let subData: {[index: string]: PreprocessorRegionWithRequiredStats} = {};
      if (Object.prototype.hasOwnProperty.call(data, 'districts')) {
        const dataObjWithSubregions = dataObj as typeof dataObj & Division<typeof dataObj>;
        subData = dataObjWithSubregions.districts;
      } else if (Object.prototype.hasOwnProperty.call(data, 'upazilas')) {
        const dataObjWithSubregions = dataObj as typeof dataObj & District<typeof dataObj>;
        subData = dataObjWithSubregions.upazilas;
      } else if (Object.prototype.hasOwnProperty.call(data, 'unions')) {
        const dataObjWithSubregions = dataObj as typeof dataObj & Upazila<typeof dataObj>;
        subData = dataObjWithSubregions.unions;
      }
      hierarchyObj[hierarchyPath[1] + 's'] = extractStats(subData, hierarchyPath.slice(1));
    }
    retval[item] = hierarchyObj;
  }
  return retval;
}

function forEachUnion(divisions: BasicDataSet<PreprocessorRegion>, f: (regions: PreprocessorRegion[])=> void) {
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

export async function main(divisions: BasicDataSet<Region>): Promise<StatsHierarchyObj> {
  const extendedRegions = divisions as BasicDataSet<PreprocessorRegion>;

  // split wells into strata
  forEachUnion(extendedRegions, stratifyWells);

  await computeNearbyRegions(extendedRegions);

  // if a stratum doesn't have enough wells, widen the search
  forEachUnion(extendedRegions, getEnoughData);

  // sort the wells so the stats functions work well
  forEachUnion(extendedRegions, sortWells);

  // get the actual stats
  forEachUnion(extendedRegions, computeWellStats);

  const regionsWithStats = extendedRegions as BasicDataSet<PreprocessorRegionWithRequiredStats>;
  const aggregateData = extractStats(regionsWithStats, ['division', 'district', 'upazila', 'union']);
  return aggregateData;
}

/* /////////////////////////////// */
/* get widen data module functions */
/* /////////////////////////////// */

export async function computeWidening(divisions: BasicDataSet<Region>): Promise<BasicDataSet<Region & RegionWithStrata>> {
  forEachUnion(divisions, stratifyWells);

  await computeNearbyRegions(divisions);

  // if a stratum doesn't have enough wells, widen the search
  forEachUnion(divisions, computeRegionWidening);

  return divisions as BasicDataSet<Region & RegionWithStrata>;
}

interface WellList {
  wells: number[],
  distance: number,
}

export function computeRegionWidening(locationArr: PreprocessorRegion[]): void {
  function nearbyWells(km: number, ...strata: ('s15' | 's45' | 's65' | 's90' | 's150' | 'sD')[]) {
    const retval = [];
    const region = locationArr[locationArr.length - 1];
    const nearbyRegions = region.nearbyRegions;
    if (nearbyRegions === undefined) {
      throw new Error('computeRegionWidening called without computing nearby regions first');
    }
    const wellSelector = strataSelector(...strata);

    for (const nearby of nearbyRegions) {
      if (nearby.distance > km) break;

      const wells: WellList = {
        wells: wellSelector(nearby.region),
        distance: nearby.distance,
      };
      retval.push(wells);
    }

    return retval;
  }

  const location = locationArr[locationArr.length - 1];
  if (location.s15 === undefined ||
      location.s45 === undefined ||
      location.s65 === undefined ||
      location.s90 === undefined ||
      location.s150 === undefined ||
      location.sD === undefined) {
    throw new Error('computeRegionWidening called before stratifyWells');
  }
  location.s15WideningRequired =
    wideCount(location.s15, { wells: location.s45, distance: 0 }, ...nearbyWells(10, 's15', 's45'));

  location.s45WideningRequired =
    wideCount(location.s45, location.s65) ||
    wideCount(location.s45, ...nearbyWells(10, 's45')) ||
    wideCount(location.s45.concat(location.s65), ...nearbyWells(20, 's45', 's65'));

  location.s65WideningRequired =
    wideCount(location.s65, location.s90) ||
    wideCount(location.s65, ...nearbyWells(10, 's65')) ||
    wideCount(location.s65.concat(location.s90), ...nearbyWells(20, 's65', 's90'));

  location.s90WideningRequired =
    wideCount(location.s90, location.s150) ||
    wideCount(location.s90, ...nearbyWells(20, 's90')) ||
    wideCount(location.s90.concat(location.s150), ...nearbyWells(20, 's90', 's150'));

  location.s150WideningRequired =
    wideCount(location.s150, location.sD) ||
    wideCount(location.s150, ...nearbyWells(100, 's150')) ||
    wideCount(location.s150.concat(location.sD), ...nearbyWells(100, 's150', 'sD'));

  location.sDWideningRequired = wideCount(location.sD, ...nearbyWells(100, 'sD'));
}

function wideCount(startingArray: number[] | undefined, ...arraysToAdd: number[][] | WellList[]) {
  const retval = { distance: 0, count: 0 };
  if (startingArray === undefined || isEnoughData(startingArray)) return retval;

  let wellsCount = startingArray.length;

  // narrow type of arraysToAdd
  if ('distance' in arraysToAdd[0]) {
    arraysToAdd = arraysToAdd as WellList[];
  } else {
    arraysToAdd = arraysToAdd as number[][];
    const tmp: WellList[] = [];
    for (const list of arraysToAdd) {
      tmp.push({
        wells: list,
        distance: 0,
      });
    }
    arraysToAdd = tmp;
  }

  for (const wellList of arraysToAdd) {
    retval.count += 1;
    retval.distance = wellList.distance || 0;
    wellsCount += wellList.wells.length;
    if (isEnoughData(wellsCount)) break;
  }

  return isEnoughData(wellsCount) ? retval : undefined;
}

export default main;