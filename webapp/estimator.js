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

//Flood removed from here for time being
function produceEstimate(divisions, div, dis, upa, uni, depth, colour, utensil) {
  const division = divisions[div];
  const district = division ? division.districts[dis] : undefined;
  const upazila = district ? district.upazilas[upa] : undefined;
  const union = upazila ? upazila.unions[uni] : undefined;

  if (!union) {
    return 'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }

  const notEnoughData =
    (depth < 90 && union.med == null) ||
    (depth >= 90 && union.mo9 == null)
      ? 'not enough data '
      : '';

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    const floodWarning =
      (depth <= 15 && flood === 'No')
        ? ' but may be vulnerable to nitrate and pathogens'
        : '';

    return notEnoughData + 'Your tubewell is ' + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
  } else if (colour === 'Red' | utensil === 'Red') {
    if (depth < 90) {
      const pollutionStatus =
        (union.med > 20 && union.med <= 50)
          ? 'likely to be Polluted'
          : (union.med > 50 && union.med <= 200)
            ? 'likely to be HIGHLY Polluted'
            : (union.med > 200)
              ? 'likely to be SEVERELY Polluted'
              : 'likely to be arsenic-safe';

      const chemTestStatus =
        (union.max <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      return notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + round(union.low, 10, 1) + ' to ' + round(union.upp, 10, 1) + ' µg/L ';
    } else if (depth <= 150) {
      if (union.mo9 >= 50) {
        return notEnoughData + 'Your tubewell is highly likely to be Polluted.';
      } else {
        return notEnoughData + 'Your tubewell may be arsenic-safe.';
      }
    } else {
      return notEnoughData + 'Your tubewell is HIGHLY likely to be arsenic-safe';
    }
  }
}
