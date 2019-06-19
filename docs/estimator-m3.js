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

  const retval = {}

  const arsenicValues = {}

  if (!union) {
    retval.message =  'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }

  if (depth < 90){
    arsenicValues.median = union.med_s;
    arsenicValues.max = union.max_s;
    arsenicValues.lowerQuantile = union.low_s;
    arsenicValues.upperQuantile = union.upp_s;
  } else if (depth < 150){
      arsenicValues.median = union.med_m;
      arsenicValues.max = union.max_m;
      arsenicValues.lowerQuantile = union.low_m;
      arsenicValues.upperQuantile = union.upp_m;
  } else {
      arsenicValues.median = union.med_d;
      arsenicValues.max = union.max_d;
      arsenicValues.lowerQuantile = union.low_d;
      arsenicValues.upperQuantile = union.upp_d;
  }

  const notEnoughData = (arsenicValues.median === null) ? 'not enough data ' : '';

  if (colour === 'Black' || utensil === 'No colour change to slightly blackish') {
    const warningSeverity = (depth > 150) ? 'HIGHLY ' : '';

    //Flood is not yet a provided input so I (Dillon) have commented it out ready for future implementation

    // const floodWarning =
    //   (depth <= 15 && flood === 'No')
    //     ? ' but may be vulnerable to nitrate and pathogens'
    //     : '';
    const floodWarning = '';

    retval.message =  notEnoughData + 'Your tubewell is ' + warningSeverity + 'likely to be arsenic-safe' + floodWarning;
    retval.severity = 'safe';
  } else if (colour === 'Red' || utensil === 'Red') {
    let pollutionStatus = '';
      if (arsenicValues.median > 20 && arsenicValues.median <= 50){
          pollutionStatus = 'likely to be Polluted';
          retval.severity = 'polluted';
        } else if (arsenicValues.median > 50 && arsenicValues.median <= 200){
            pollutionStatus = 'likely to be HIGHLY Polluted';
            retval.severity = 'highlyPolluted';
          } else if (arsenicValues.median > 200){
              pollutionStatus =  'likely to be SEVERELY Polluted';
              retval.severity = 'highlyPolluted';
            } else {
                pollutionStatus = 'likely to be arsenic-safe';
                retval.severity = 'safe';
            }

      const chemTestStatus =
        (arsenicValues.max <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      retval.message =  notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + round(arsenicValues.lowerQuantile, 10, 1) + ' to ' + round(arsenicValues.upperQuantile, 10, 1) + ' µg/L ';
  } else { retval.message =  'We are unable to assess your tubewell with the information you supplied, please fill all the sections'; }
  return retval
}

if (typeof module === 'object') module.exports = produceEstimate;
