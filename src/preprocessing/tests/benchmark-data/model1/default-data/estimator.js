// model: model1
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

function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil, flood) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  const retval = {};

  if (!union) {
    retval.message = 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
    return retval;
  }

  const notEnoughData =
    (depth < 90 && union.as_median_under_90 == null) ||
    (depth >= 90 && union.as_mean_over_90 == null)
      ? 'not enough data '
      : '';

  retval.lowerQ = round(union.lower_quantile_under_90, 10, 1);
  retval.upperQ = round(union.upper_quantile_under_90, 10, 1);

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    const floodWarning =
      (depth <= 15.3 && flood === 'No')
        ? ' but may be vulnerable to nitrate and pathogens'
        : '';

    retval.severity = 'safe';

    retval.message = notEnoughData + 'Your tubewell is ' + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
  } else if (colour === 'Red' | utensil === 'Red') {
    if (depth < 90) {
      const pollutionStatus =
        (union.as_median_under_90 > 20 && union.as_median_under_90 <= 50)
          ? 'likely to be Polluted'
          : (union.as_median_under_90 > 50 && union.as_median_under_90 <= 200)
              ? 'likely to be HIGHLY Polluted'
              : (union.as_median_under_90 > 200)
                  ? 'likely to be SEVERELY Polluted'
                  : 'likely to be arsenic-safe';

      const chemTestStatus =
        (union.as_max_under_90 <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      retval.severity = (union.as_median_under_90 <= 20) ? 'safe' : 'polluted';
      retval.message = notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + retval.lowerQ + ' to ' + retval.upperQ + ' µg/L ';
    } else if (depth <= 150) {
      retval.severity = (union.as_mean_over_90 < 50) ? 'safe' : 'polluted';

      if (union.as_mean_over_90 >= 50) {
        retval.message = notEnoughData + 'Your tubewell is highly likely to be Polluted.';
      } else {
        retval.message = notEnoughData + 'Your tubewell may be arsenic-safe.';
      }
    } else {
      retval.severity = 'safe';
      retval.message = notEnoughData + 'Your tubewell is HIGHLY likely to be arsenic-safe';
    }
  }

  return retval;
}

if (typeof module === 'object') module.exports = produceEstimate;
