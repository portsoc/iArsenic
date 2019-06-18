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


  if (!union) {
    retval.message =  'We are unable to assess your tubewell with the information you supplied, please fill all the sections';
  }

  const notEnoughData =
    (depth < 90 && union.med_s === null) ||
    (depth < 150 && union.med_m === null) ||
    (depth >= 150 && union.med_d === null)
      ? 'not enough data '
      : '';

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
    if (depth < 90) {
      if (union.med_s > 20 && union.med_s <= 50){
          pollutionStatus = 'likely to be Polluted';
          retval.severity = 'polluted'
        } else if (union.med_s > 50 && union.med_s <= 200){
            pollutionStatus = 'likely to be HIGHLY Polluted';
            retval.severity = 'highlyPolluted'
          } else if (union.med_s > 200){
              pollutionStatus =  'likely to be SEVERELY Polluted';
              retval.severity = 'highlyPolluted'
            } else {
              pollutionStatus = 'likely to be arsenic-safe';
              retval.severity = 'safe'
            }

      const chemTestStatus =
        (union.max_s <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      retval.message =  notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + round(union.low_s, 10, 1) + ' to ' + round(union.upp_s, 10, 1) + ' µg/L ';
    } else if (depth < 150) {
      if (union.med_m > 20 && union.med_m <= 50){
          pollutionStatus = 'likely to be Polluted';
          retval.severity = 'polluted'
        } else if (union.med_m > 50 && union.med_m <= 200){
            pollutionStatus = 'likely to be HIGHLY Polluted';
            retval.severity = 'highlyPolluted'
          } else if (union.med_m > 200){
              pollutionStatus =  'likely to be SEVERELY Polluted';
              retval.severity = 'highlyPolluted'
            } else {
              pollutionStatus = 'likely to be arsenic-safe';
              retval.severity = 'safe'
            }

      const chemTestStatus =
        (union.max_m <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      retval.message =  notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + round(union.low_m, 10, 1) + ' to ' + round(union.upp_m, 10, 1) + ' µg/L ';
    } else {
      if (union.med_d > 20 && union.med_d <= 50){
          pollutionStatus = 'likely to be Polluted';
          retval.severity = 'polluted'
        } else if (union.med_d > 50 && union.med_d <= 200){
            pollutionStatus = 'likely to be HIGHLY Polluted';
            retval.severity = 'highlyPolluted'
          } else if (union.med_d > 200){
              pollutionStatus =  'likely to be SEVERELY Polluted';
              retval.severity = 'highlyPolluted'
            } else {
              pollutionStatus = 'likely to be arsenic-safe';
              retval.severity = 'safe'
            }

      const chemTestStatus =
        (union.max_d <= 100)
          ? 'and concentration may be around'
          : ', a chemical test is needed as concentration can be high, ranging around';

      retval.message =  notEnoughData + 'Your tubewell is ' + pollutionStatus + ' ' + chemTestStatus + ' ' + round(union.low_d, 10, 1) + ' to ' + round(union.upp_d, 10, 1) + ' µg/L ';
    }
  } else { retval.message =  'We are unable to assess your tubewell with the information you supplied, please fill all the sections'; }
  return retval
}

module.exports = produceEstimate;
