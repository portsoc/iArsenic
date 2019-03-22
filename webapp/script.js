const div_dd = document.querySelector("#division_dd");
const dis_dd = document.querySelector("#district_dd");
const upa_dd = document.querySelector("#upazila_dd");
const uni_dd = document.querySelector("#union_dd");

window.addEventListener("load", init);

function init(){
  populateDropdown(div_dd, "division", "districts", dropdownData); //complete data

  div_dd.dataset.nameProp = "division";
  div_dd.dataset.subProp = "districts";
  div_dd.nextDropdown = dis_dd;
  dis_dd.dataset.nameProp = "district";
  dis_dd.dataset.subProp = "upazilas";
  dis_dd.nextDropdown = upa_dd;
  upa_dd.dataset.nameProp = "upazila";
  upa_dd.dataset.subProp = "unions";
  upa_dd.nextDropdown = uni_dd;

  div_dd.addEventListener("change", handleDropDownSelection);
  dis_dd.addEventListener("change", handleDropDownSelection);
  upa_dd.addEventListener("change", handleDropDownSelection);
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
