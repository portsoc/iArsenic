// model: model5
// generated: Tue May 17 2022 11:02:10 GMT+0100 (British Summer Time)
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

function createMessage(id, lowerQ, upperQ) {
  // clone the message because it's changed below
  const retval = Object.assign({}, aggregateOutput[id]);
  if (id > 0) {
    retval.message += ' ' + lowerQ + ' to ' + upperQ + ' µg/L ';
  }
  return retval;
}

// Returns the arsenic values
function selectArsenicValues(region, depth) {
  if (depth < 15.3) return region.s15;
  else if (depth < 45) return region.s45;
  else if (depth < 65) return region.s65;
  else if (depth < 90) return region.s90;
  else if (depth < 150) return region.s150;
  else return region.sD;
}

function produceEstimate(divisions, div, dis, upa, uni, mou, depth, colour, utensil, flood) {
  const division = divisions[div];
  const district = division?.districts[dis];
  const upazila = district?.upazilas[upa];
  const union = upazila?.unions[uni];
  const mouza = union?.mouzas[mou];

  console.log('--------------------------------')
  console.log(divisions);
  console.log(div)
  console.log(dis)
  console.log(upa)
  console.log(uni)
  console.log(mou)
  console.log(depth)
  console.log(colour)
  console.log(utensil)
  console.log(flood)
  console.log('--------------------------------')

  let retval = {};

  if (!mouza) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  const arsenicValues = selectArsenicValues(mouza, depth);

  const lowerQ = round(arsenicValues.l, 10, 1);
  const upperQ = round(arsenicValues.u, 10, 1);

  // we're checking for m2 in arsenicValues, because it's what tells us the
  // flooding model should apply
  if (depth < 15.3 && 'm2' in arsenicValues) {
    // flooding model
    if (colour === 'Black') {
      retval = createMessage(arsenicValues.m2, lowerQ, upperQ);
    } else if (flood === 'yes') {
      // here, the colour is red
      retval = createMessage(arsenicValues.m9, lowerQ, upperQ);
    } else {
      retval = createMessage(arsenicValues.m7, lowerQ, upperQ);
    }
  } else {
    // regular model
    if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
      const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

      retval.message = msgStart + warningSeverity + 'likely to be arsenic-safe';
      retval.severity = 'safe';
    } else if (colour === 'Red' || utensil === 'Red') {
      retval = createMessage(arsenicValues.m, lowerQ, upperQ);
    } else {
      retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    }
  }

  retval.lowerQ = lowerQ;
  retval.upperQ = upperQ;
  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
