// function populateDropdown(elemStr, arr) {
//   const dropdown = document.getElementById(elemStr);
//   for (let i = 0; i < testList.length; i += 1) {
//     const opt = document.createElement("option");
//     opt.value = arr[i];
//     opt.text = arr[i];
//     dropdown.add(opt, null);
//   }
// }
//
//
// const testList = ['a', 'b', 'c', 'd', 'e', 'f']
// const elem = 'district_dd';
// populateDropdown(elem, testList);


function pollution_status_u_90() {
  if ((median_under90 > 20) && (median_under90 <= 50)) {
    return "is likely to be Polluted";
  } else if ((median_under90 > 50) && (median_under90 <= 200)) {
    return "is likely to be HIGHLY Polluted";
  } else if (median_under90 > 200) {
    return "likely to be SEVERLY Polluted"
  } else {
    return "likely to be arsenic-safe"
  }
}

function chem_test() {
  if ((max_under90 >= 0) && (max_under90 <= 100)) {
    return "and concentration may be around"
  } else {
    return ", a chemical test is needed as concentration can be high, ranging around"
  }
}

function updateRangeLabel(elemID, val) {
  document.getElementById(elemID).value = val + ' ft';
}

function displayUtensil(newClass){
  if (newClass === document.getElementById('utensil_header').className){ return 0; }
  currentClass = (newClass === 'utensil_hidden') ? 'utensil_visible' : 'utensil_hidden';
  utensilList = document.querySelectorAll('.' + currentClass);
  for (let i = 0; i < utensilList.length; i += 1){
    utensilList[i].className = newClass;
  }
}
