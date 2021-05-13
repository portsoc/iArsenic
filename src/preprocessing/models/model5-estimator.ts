import { ArsenicValues, StatsHierarchyObj } from '../lib/types';

function round(x: number, magnitude: number, dir = 1) {
  if (x % magnitude === 0) {
    return x;
  } else if (dir === 1) {
    // ROUND UP
    return x + (magnitude - x % magnitude);
  } else {
    // ROUND DOWN
    return x - (x % magnitude);
  }
}

const msgStart = 'Your tubewell is ';

const pollutionOutput = {
  safe: msgStart + 'likely to be arsenic-safe',
  polluted: msgStart + 'likely to be polluted',
  highly: msgStart + 'likely to be HIGHLY polluted',
  severely: msgStart + 'likely to be SEVERELY polluted',
};

const chemTestOutput = {
  noTest: ' and concentration may be around',
  test: ', a chemical test is needed as concentration can be high, ranging around',
};

interface AggregateOutput {
  [index: number]: {
    message: string,
    severity: string,
  },
}

const aggregateOutput: AggregateOutput = {
  0: {
    message: 'We do not have enough data to make an estimate for your well',
    severity: '',
  },
  1: {
    message: pollutionOutput.safe + chemTestOutput.noTest,
    severity: 'safe',
  },
  2: {
    message: pollutionOutput.safe + chemTestOutput.test,
    severity: 'safe',
  },
  3: {
    message: pollutionOutput.polluted + chemTestOutput.noTest,
    severity: 'polluted',
  },
  4: {
    message: pollutionOutput.polluted + chemTestOutput.test,
    severity: 'polluted',
  },
  5: {
    message: pollutionOutput.highly + chemTestOutput.noTest,
    severity: 'highlyPolluted',
  },
  6: {
    message: pollutionOutput.highly + chemTestOutput.test,
    severity: 'highlyPolluted',
  },
  7: {
    message: pollutionOutput.severely + chemTestOutput.noTest,
    severity: 'highlyPolluted',
  },
  8: {
    message: pollutionOutput.severely + chemTestOutput.test,
    severity: 'highlyPolluted',
  },
};

function createMessage(id: number) {
  // clone the message because it's changed in produceEstimate
  return Object.assign({}, aggregateOutput[id]);
}

export interface EstimatorOutput {
  message: string,
  severity: string,
  lowerQ: number,
  upperQ: number,
}

// Flood removed from here for time being
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function produceEstimate(divisions: StatsHierarchyObj, div: string, dis: string, upa: string, uni: string, depth: number, colour: string, utensil: string, flooding?: string): EstimatorOutput {
  const division = divisions[div];
  const district = division ? (division as StatsHierarchyObj)[dis] : undefined;
  const upazila = district ? (district as StatsHierarchyObj)[upa] : undefined;
  const union = upazila ? (upazila as StatsHierarchyObj)[uni] as StatsHierarchyObj : undefined;

  const retval: EstimatorOutput = {
    message: '',
    severity: '',
    lowerQ: 0,
    upperQ: 0,
  };

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  let arsenicValues: ArsenicValues = { m: 0, l: 0, u: 0 };
  if (depth < 15.3) {
    arsenicValues = union.s15 as ArsenicValues;
  } else if (depth < 45) {
    arsenicValues = union.s45 as ArsenicValues;
  } else if (depth < 65) {
    arsenicValues = union.s65 as ArsenicValues;
  } else if (depth < 90) {
    arsenicValues = union.s90 as ArsenicValues;
  } else if (depth < 150) {
    arsenicValues = union.s150 as ArsenicValues;
  } else {
    arsenicValues = union.sD as ArsenicValues;
  }

  const lowerQ = round(arsenicValues.l, 10, 1);
  const upperQ = round(arsenicValues.u, 10, 1);

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    // Flood is not yet a provided input so we have commented it out ready for future implementation

    // const floodWarning =
    //   (depth <= 15.3 && flood === 'No')
    //     ? ' but may be vulnerable to nitrate and pathogens'
    //     : '';
    const floodWarning = '';

    retval.message = msgStart + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
    retval.severity = 'safe';
  } else if (colour === 'Red' || utensil === 'Red') {
    const newMessage = createMessage(arsenicValues.m);
    retval.message = newMessage.message;
    retval.severity = newMessage.severity;
    if (arsenicValues.m > 0) {
      retval.message += `' ${lowerQ} to ${upperQ} µg/L `;
    }
  } else {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }

  retval.lowerQ = lowerQ;
  retval.upperQ = upperQ;
  return retval;
}

export default produceEstimate;
