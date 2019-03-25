const divDD = document.querySelector("#divisionDD");
const disDD = document.querySelector("#districtDD");
const upaDD = document.querySelector("#upazilaDD");
const uniDD = document.querySelector("#unionDD");

window.addEventListener("load", init);

function init(){
  populateDropdown(divDD, "division", "districts", dropdownData); //complete data

  divDD.dataset.nameProp = "division";
  divDD.dataset.subProp = "districts";
  divDD.nextDropdown = disDD;
  disDD.dataset.nameProp = "district";
  disDD.dataset.subProp = "upazilas";
  disDD.nextDropdown = upaDD;
  upaDD.dataset.nameProp = "upazila";
  upaDD.dataset.subProp = "unions";
  upaDD.nextDropdown = uniDD;

  divDD.addEventListener("change", handleDropDownSelection);
  disDD.addEventListener("change", handleDropDownSelection);
  upaDD.addEventListener("change", handleDropDownSelection);
}

function handleDropDownSelection(event) {
  const dd = event.target;
  const opt = dd.selectedOptions[0];
  const nextDropdown = dd.nextDropdown;
  populateDropdown(nextDropdown, nextDropdown.dataset.nameProp, nextDropdown.dataset.subProp, opt.subdivisionData);
}

//if district is choosen first, do not shorten list

function populateDropdown(dropdown, nameProp, subdivProp, dropdownData) {
  dropdown.innerHTML = "<option>Please Select&hellip;</option>";
  dropdown.disabled = false;

  cleanupDropdown(dropdown.nextDropdown);

  for (let i = 0; i < dropdownData.length; i += 1) {
    const opt = document.createElement("option");
    let name = dropdownData[i]; // this works for unions
    if (nameProp) name = name[nameProp]; // for divisions, districts, upazilas
    opt.value = name;
    opt.text = name;
    opt.subdivisionData = dropdownData[i][subdivProp];
    dropdown.add(opt);
  }
}

function cleanupDropdown(dd) {
  if (!dd) return;
  dd.innerHTML = "<option>&hellip;</option>";
  dd.disabled = true;
  cleanupDropdown(dd.nextDropdown);
}


// const testList = ['a', 'b', 'c', 'd', 'e', 'f']
// const elem = 'districtDD';
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

function updateRangeLabel(elemID, position) {
  const maxPos = 100;
  const minVal = Math.log(5);
  const maxVal = Math.log(1000);
  const scale = (maxVal - minVal) / maxPos;
  const value = Math.exp(minVal + scale * position);

  document.getElementById(elemID).value = Math.round(value) + ' ft';
}

function displayUtensil(newClass){
  if (newClass === document.getElementById('utensilHeader').className){ return 0; }
  currentClass = (newClass === 'utensilHidden') ? 'utensilVisible' : 'utensilHidden';
  utensilList = document.querySelectorAll('.' + currentClass);
  for (let i = 0; i < utensilList.length; i += 1){
    utensilList[i].className = newClass;
  }
}
