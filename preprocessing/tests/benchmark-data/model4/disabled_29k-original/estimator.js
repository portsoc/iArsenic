// model: model4
// generated: overridden date for test output comparability
// input data: [ ../../data/disabled/29k-original.csv ]
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

function extractIdMessage(id) {
  const pollutionOutput = [
    'likely to be arsenic-safe',
    'likely to be polluted',
    'likely to be HIGHLY polluted',
    'likely to be SEVERELY polluted',
  ];

  const chemTestOutput = [
    ' and concentration may be around',
    ', a chemical test is needed as concentration can be high, ranging around',
  ];

  const aggregateOutput = {
    0: { message: 'We do not have enough data to make an estimate for your well' },
    1: {
      message: 'Your tubewell is ' + pollutionOutput[0] + chemTestOutput[0],
      severity: 'safe',
    },
    2: {
      message: 'Your tubewell is ' + pollutionOutput[0] + chemTestOutput[1],
      severity: 'safe',
    },
    3: {
      message: 'Your tubewell is ' + pollutionOutput[1] + chemTestOutput[0],
      severity: 'polluted',
    },
    4: {
      message: 'Your tubewell is ' + pollutionOutput[1] + chemTestOutput[1],
      severity: 'polluted',
    },
    5: {
      message: 'Your tubewell is ' + pollutionOutput[2] + chemTestOutput[0],
      severity: 'highlyPolluted',
    },
    6: {
      message: 'Your tubewell is ' + pollutionOutput[2] + chemTestOutput[1],
      severity: 'highlyPolluted',
    },
    7: {
      message: 'Your tubewell is ' + pollutionOutput[3] + chemTestOutput[0],
      severity: 'highlyPolluted',
    },
    8: {
      message: 'Your tubewell is ' + pollutionOutput[3] + chemTestOutput[1],
      severity: 'highlyPolluted',
    },
  };

  return aggregateOutput[id];
}

// Flood removed from here for time being
function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  let arsenicValues = {};
  let retval = {};

  if (depth < 15) {
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

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
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
    retval = extractIdMessage(arsenicValues.id);
    if (arsenicValues.id > 0) {
      retval.message += ' ' + round(arsenicValues.lo, 10, 1) + ' to ' + round(arsenicValues.up, 10, 1) + ' µg/L ';
    }
  } else {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }
  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
