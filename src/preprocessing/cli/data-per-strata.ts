import { getParameters, CliParameters } from '../lib/cli-common';
import { BasicDataSet, Region, RegionStatistics, RegionWithStrata, Well } from '../lib/types';
import * as csvLoader from '../lib/load-data';
import { computeWidening } from '../models/model5-preprocessor';

const STRATA = [
  { min: 0, max: Infinity, header: 'depth 0+' },
  { min: 0, max: 15.3, header: 'depth 0-15.3', strataKey: 's15' },
  { min: 15.3, max: 45, header: 'depth 15.3-45', strataKey: 's45' },
  { min: 45, max: 65, header: 'depth 45-65', strataKey: 's65' },
  { min: 0, max: 90, header: 'depth 0-90' },
  { min: 90, max: 150, header: 'depth 90-150', strataKey: 's150' },
  { min: 150, max: Infinity, header: 'depth 150+', strataKey: 'sD' },
  { min: 90, max: Infinity, header: 'depth 90+' },
  { min: 65, max: 90, header: 'depth 65-90', strataKey: 's90' },
];

// this keeps track of how many wells are in a region, organised by stratum
export interface RegionWellStats {
  'depth 0+': number,
  'depth 0-15.3': number,
  'depth 15.3-45': number,
  'depth 45-65': number,
  'depth 0-90': number,
  'depth 90-150': number,
  'depth 150+': number,
  'depth 90+': number,
  'depth 65-90': number,
}

type RegionWithStats = Region & Partial<RegionWithStrata> & Partial<RegionStatistics> & Partial<RegionWellStats>;
type RegionWithRequiredStats = Region & Partial<RegionWithStrata> & Partial<RegionStatistics> & RegionWellStats;

async function main(optionsPromise: Promise<CliParameters>) {
  const options = await optionsPromise;

  // get data from CSV files
  const data = csvLoader.loadData(options.paths) as BasicDataSet<Region & RegionWellStats>;
  await computeWidening(data);

  // define array to hold rows of CSV file and push column headers

  const records: string[][] = [];
  const headers = [
    'division',
    'district',
    'upazila',
    'union',
  ];

  // Adds all the stratum headers to the headers array
  for (const stratum of STRATA) {
    headers.push(stratum.header);
    if (stratum.strataKey != null) {
      headers.push('distKm');
      headers.push('count');
    }
  }

  records.push(headers);

  // loop through each well
  for (const div of Object.keys(data)) {
    const divObj = data[div];
    initStratas(divObj);

    for (const dis of Object.keys(divObj.districts)) {
      const disObj = divObj.districts[dis];
      initStratas(disObj);

      for (const upa of Object.keys(disObj.upazilas)) {
        const upaObj = disObj.upazilas[upa];
        initStratas(upaObj);

        for (const uni of Object.keys(upaObj.unions)) {
          const uniObj = upaObj.unions[uni];
          initStratas(uniObj);

          for (const well of uniObj.wells) {
            countStratas([divObj, disObj, upaObj, uniObj], well);
          }
          pushRecord(records, div, dis, upa, uni, uniObj);
        }
        pushRecord(records, div, dis, upa, '###', upaObj);
      }
      pushRecord(records, div, dis, '###', '###', disObj);
    }
    pushRecord(records, div, '###', '###', '###', divObj);
  }

  // write records to csv file
  for (const record of records) {
    record.join(',');
  }
  const contents = records.join('\n');
  console.log(contents);
}

function pushRecord(records: string[][], div: string, dis: string, upa: string, uni: string, wellCountObj: RegionWithRequiredStats) {
  const record = [div, dis, upa, uni];

  for (const stratum of STRATA) {
    record.push(wellCountObj[stratum.header as keyof RegionWellStats].toString());

    if (stratum.strataKey != null) {
      // add information about model 5 widening
      const wideningKey = `${stratum.strataKey}WideningRequired`;
      const widening = wellCountObj[wideningKey as keyof RegionWithStats] as {distance: number, count: number};
      if (uni === '###') {
        record.push('', ''); // we don't aggregate widening information
      } else if (widening == null) {
        record.push('n/a', 'n/a'); // distance and count
      } else {
        record.push(widening.distance.toFixed(2));
        record.push(widening.count.toString());
      }
    }
  }

  records.push(record);
}

function initStratas(obj: RegionWithStats) {
  for (const stratum of STRATA) {
    obj[stratum.header as keyof RegionWellStats] = 0;
  }
}

function countStratas(regions: RegionWithRequiredStats[], well: Well) {
  for (const stratum of STRATA) {
    if (well.depth >= stratum.min && well.depth < stratum.max) {
      for (const region of regions) {
        region[stratum.header as keyof RegionWellStats] += 1;
      }
    }
  }
}

console.debug = console.error; // redirect debug to stderr

main(getParameters()).catch(console.error);
