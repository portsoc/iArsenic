// model: model4
// generated: overridden date for test output comparability
// input data: default
function round(x, magnitude, dir = 1) {
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

const pollutionOutput = {
  safe: 'likely to be arsenic-safe',
  polluted: 'likely to be polluted',
  highly: 'likely to be HIGHLY polluted',
  severely: 'likely to be SEVERELY polluted',
};

const chemTestOutput = {
  noTest: ' and concentration may be around',
  test: ', a chemical test is needed as concentration can be high, ranging around',
};

const aggregateOutput = {
  0: { message: 'We do not have enough data to make an estimate for your well' },
  1: {
    message: 'Your tubewell is ' + pollutionOutput.safe + chemTestOutput.noTest,
    severity: 'safe',
  },
  2: {
    message: 'Your tubewell is ' + pollutionOutput.safe + chemTestOutput.test,
    severity: 'safe',
  },
  3: {
    message: 'Your tubewell is ' + pollutionOutput.polluted + chemTestOutput.noTest,
    severity: 'polluted',
  },
  4: {
    message: 'Your tubewell is ' + pollutionOutput.polluted + chemTestOutput.test,
    severity: 'polluted',
  },
  5: {
    message: 'Your tubewell is ' + pollutionOutput.highly + chemTestOutput.noTest,
    severity: 'highlyPolluted',
  },
  6: {
    message: 'Your tubewell is ' + pollutionOutput.highly + chemTestOutput.test,
    severity: 'highlyPolluted',
  },
  7: {
    message: 'Your tubewell is ' + pollutionOutput.severely + chemTestOutput.noTest,
    severity: 'highlyPolluted',
  },
  8: {
    message: 'Your tubewell is ' + pollutionOutput.severely + chemTestOutput.test,
    severity: 'highlyPolluted',
  },
};

function createMessage(id) {
  // clone the message because it's changed in produceEstimate
  return Object.assign({}, aggregateOutput[id]);
}

// Flood removed from here for time being
function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  let retval = {};
  let arsenicValues = {};

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  if (depth < 15.3) {
    arsenicValues = union.s15;
  } else if (depth < 45) {
    arsenicValues = union.s45;
  } else if (depth < 65) {
    arsenicValues = union.s65;
  } else if (depth < 90) {
    arsenicValues = union.s90;
  } else if (depth < 150) {
    arsenicValues = union.s150;
  } else {
    arsenicValues = union.sD;
  }

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    // Flood is not yet a provided input so we have commented it out ready for future implementation

    // const floodWarning =
    //   (depth <= 15 && flood === 'No')
    //     ? ' but may be vulnerable to nitrate and pathogens'
    //     : '';
    const floodWarning = '';

    retval.message = 'Your tubewell is ' + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
    retval.severity = 'safe';
  } else if (colour === 'Red' || utensil === 'Red') {
    retval = createMessage(arsenicValues.m);
    if (arsenicValues.m > 0) {
      retval.message += ' ' + round(arsenicValues.l, 10, 1) + ' to ' + round(arsenicValues.u, 10, 1) + ' µg/L ';
    }
  } else {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }
  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
