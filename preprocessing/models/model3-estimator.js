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

// Flood removed from here for time being
function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  const retval = {};

  let arsenicValues = {};

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  if (depth < 90) {
    arsenicValues = union.s;
  } else if (depth < 150) {
    arsenicValues = union.m;
  } else {
    arsenicValues = union.d;
  }

  retval.lowerQ = round(arsenicValues.lo, 10, 1);
  retval.upperQ = round(arsenicValues.up, 10, 1);

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    // Flood is not yet a provided input so we have commented it out ready for future implementation

    // const floodWarning =
    //   (depth <= 15.3 && flood === 'No')
    //     ? ' but may be vulnerable to nitrate and pathogens'
    //     : '';
    const floodWarning = '';

    retval.message = 'Your tubewell is ' + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
    retval.severity = 'safe';
  } else if (arsenicValues.md == null) {
    // we can't make an estimate
    retval.message = 'We do not have enough data to make an estimate for your well';
  } else if (colour === 'Red' || utensil === 'Red') {
    let pollutionStatus = '';
    if (arsenicValues.md > 20 && arsenicValues.md <= 50) {
      pollutionStatus = 'likely to be Polluted';
      retval.severity = 'polluted';
    } else if (arsenicValues.md > 50 && arsenicValues.md <= 200) {
      pollutionStatus = 'likely to be HIGHLY Polluted';
      retval.severity = 'highlyPolluted';
    } else if (arsenicValues.md > 200) {
      pollutionStatus = 'likely to be SEVERELY Polluted';
      retval.severity = 'highlyPolluted';
    } else {
      pollutionStatus = 'likely to be arsenic-safe';
      retval.severity = 'safe';
    }

    const chemTestStatus =
      (arsenicValues.mx <= 100)
        ? 'and concentration may be around'
        : ', a chemical test is needed as concentration can be high, ranging around';

    retval.message = 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + retval.lowerQ + ' to ' + retval.upperQ + ' µg/L ';
  } else {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }
  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
