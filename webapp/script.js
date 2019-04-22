const divDD = document.querySelector("#divisionDD");
const disDD = document.querySelector("#districtDD");
const upaDD = document.querySelector("#upazilaDD");
const uniDD = document.querySelector("#unionDD");
const assess = document.querySelector("#assessment");
const submit = document.querySelector('#submit');
const chevron = document.querySelector('#chevron');
const utensilSection = document.querySelector('#utensilSection');
const depthOutput = document.querySelector('#depthOutput');
const stainingSection = document.querySelector('#stainingSection');

const result = document.querySelector('#result');

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

  submit.addEventListener('click', showAssessment);
  chevron.addEventListener('click', showAssessment);
}

function gatherInputs() {
  const retval = {};

  retval.division = divDD.value;
  retval.district = disDD.value;
  retval.upazila = upaDD.value;
  retval.union = uniDD.value;

  const selectedStaining = document.querySelector('input[name="staining"]:checked');
  if (selectedStaining && selectedStaining.value !== 'mixed') {
    retval.colour = selectedStaining.value;
  }

  if (selectedStaining && selectedStaining.value === 'mixed') {
    const selectedUtensil = document.querySelector('input[name="stainingUtensil"]:checked');
    if (selectedUtensil) {
      retval.utensil = selectedUtensil.value;
    }
  }

  // todo do we need to convert between feet and metres here?
  retval.depth = Number(depthOutput.value / 3.2808);

  const selectedDrinking = document.querySelector('input[name="drink"]:checked');
  if (selectedDrinking) {
    retval.drinking = selectedDrinking.value;
  }


  if (!retval.division) return null;
  if (!retval.district) return null;
  if (!retval.upazila) return null;
  if (!retval.union) return null;
  if (!retval.colour && !retval.utensil) return null;
  if (!retval.depth) return null; // depth 0 is the default and counts as no-value-entered
  if (!retval.drinking) return null;
  console.log('gathered inputs', retval);
  return retval;
}

function handleDropDownSelection(event) {
  const dd = event.target;
  const opt = dd.selectedOptions[0];
  const nextDropdown = dd.nextDropdown;
  populateDropdown(nextDropdown, nextDropdown.dataset.nameProp, nextDropdown.dataset.subProp, opt.subdivisionData);
}

//if district is choosen first, do not shorten list

function populateDropdown(dropdown, nameProp, subdivProp, dropdownData) {
  dropdown.innerHTML = "<option value=''>Please Select&hellip;</option>";
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
  dd.innerHTML = "<option value=''>&hellip;</option>";
  dd.disabled = true;
  cleanupDropdown(dd.nextDropdown);
}


function updateRangeLabel(position) {
  const maxPos = 100;
  const minVal = Math.log(5);
  const maxVal = Math.log(1000);
  const scale = (maxVal - minVal) / maxPos;
  const value = Math.exp(minVal + scale * position);

  depthOutput.value = Math.round(value);
}

function displayUtensil(show) {
  utensilSection.classList.toggle('hidden', !show);
}

function validateInputs(){
  //Handles the dropdowns
  const dropdownInputs = [divDD, disDD, upaDD, uniDD]
  for (let i = 0; i < dropdownInputs.length; i++) {
    if (!dropdownInputs[i].value){ dropdownInputs[i].classList.add("invalid"); }
    else { dropdownInputs[i].classList.remove("invalid"); }
  }
  
  //Handles the staining radio buttons
  const selectedStaining = document.querySelector('input[name="staining"]:checked');
  if (!selectedStaining) { stainingSection.classList.add("invalid"); }
  else if (selectedStaining && selectedStaining.value === 'Mixed'){
    stainingSection.classList.remove("invalid");
    const selectedUtensil = document.querySelector('input[name="stainingUtensil"]:checked');
    if (!selectedUtensil) { utensilSection.classList.add("invalid"); }
  }
  else { 
    stainingSection.classList.remove("invalid");
    utensilSection.classList.remove("invalid"); 
  }
  
  //Handles the depth 
  if (depthOutput.value == "0") { depthContainer.classList.add("invalid"); }
  else { depthContainer.classList.remove("invalid"); }
}

function showAssessment(){
  //removed collapsed class
  //scroll to Assessment
  const inputs = gatherInputs(); 
  validateInputs(); 
  if (!inputs) {
    
    return;
    // todo or highlight the first thing that isn't filled in
  }
  else {
    result.innerHTML = produceEstimate(aggregateData, inputs.division, inputs.district,
      inputs.upazila, inputs.union, inputs.depth, inputs.colour, inputs.utensil);
  }

  assess.classList.remove('collapsed');
  chevron.scrollIntoView({behavior: 'smooth', block: 'start'});
}
