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

const aggregateOutput = {
  0: { message: 'We do not have enough data to make an estimate for your well' },
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

function createMessage(id) {
  // clone the message because it's changed in produceEstimate
  return Object.assign({}, aggregateOutput[id]);
}

// Flood removed from here for time being
function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil, flood) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  let retval = {};

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  let arsenicValues = {};
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

  const lowerQ = round(arsenicValues.l, 10, 1);
  const upperQ = round(arsenicValues.u, 10, 1);

  // we're checking for m_p25 in arsenicValues, because it's what tells us the
  // flooding model should apply
  if (depth < 15.3 && 'm_p25' in arsenicValues) {
    // flooding model
    if (colour === 'Black') {
      retval = createMessage(arsenicValues.m_p25);
    } else if (flood === 'yes') {
      // here, the colour is red
      retval = createMessage(arsenicValues.m_p95);
    } else {
      retval = createMessage(arsenicValues.m_p75);
    }
  } else {
    // regular model
    if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
      const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

      retval.message = msgStart + warningSeverity + 'likely to be arsenic-safe';
      retval.severity = 'safe';
    } else if (colour === 'Red' || utensil === 'Red') {
      retval = createMessage(arsenicValues.m);
      if (arsenicValues.m > 0) {
        retval.message += ' ' + lowerQ + ' to ' + upperQ + ' µg/L ';
      }
    } else {
      retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    }
  }
  retval.lowerQ = lowerQ;
  retval.upperQ = upperQ;
  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
