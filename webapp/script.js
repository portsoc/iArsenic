const divDD = document.querySelector("#divisionDD");
const disDD = document.querySelector("#districtDD");
const upaDD = document.querySelector("#upazilaDD");
const uniDD = document.querySelector("#unionDD");
const assess = document.querySelector("#assessment");
const submit = document.querySelector('#submit');
const chevron = document.querySelector('#chevron');
const utensilSection = document.querySelector('#utensilSection');
const depth = document.querySelector('#depth');
const depthOutput = document.querySelector('#depthOutput');
const stainingSection = document.querySelector('#stainingSection');
const drinkingSection = document.querySelector('#drinkingSection');

//Depth scale constants
const minPos = 0;
const maxPos = 100;
const minVal = Math.log(5);
const maxVal = Math.log(1000);
const scale = (maxVal - minVal) / (maxPos - minPos);

const resultSection = document.querySelector('#result');

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

  depthOutput.addEventListener("input", updateSlider)

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
  if (selectedStaining && selectedStaining.value !== 'Mixed') {
    retval.colour = selectedStaining.value;
  }

  if (selectedStaining && selectedStaining.value === 'Mixed') {
    const selectedUtensil = document.querySelector('input[name="stainingUtensil"]:checked');
    if (selectedUtensil) {
      retval.utensil = selectedUtensil.value;
    }
  }

  // Feet being converted to metres
  retval.depth = Number(depthOutput.value / 3.2808);

  const selectedDrinking = document.querySelector('input[name="drink"]:checked');
  if (selectedDrinking) {
    retval.drinking = selectedDrinking.value;
  }

  validateInputs();
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
  depthOutput.value = Math.round(Math.exp(minVal + scale * position));
}

function updateSlider(){
  if (depthOutput.value > 0) {
    depth.value = (Math.log(depthOutput.value) - minVal) / scale + minPos;
  } else { depth.value = 0; }
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
  if (!selectedStaining) {
    stainingSection.classList.add("invalid");
  } else if (selectedStaining.value === 'Mixed'){
    stainingSection.classList.remove("invalid");
    const selectedUtensil = document.querySelector('input[name="stainingUtensil"]:checked');
    if (!selectedUtensil) {
      utensilSection.classList.add("invalid");
    } else {
      utensilSection.classList.remove("invalid");
    }
  } else {
    stainingSection.classList.remove("invalid");
  }

  //Handles the depth
  if (depthOutput.value == "0") { depthContainer.classList.add("invalid"); }
  else { depthContainer.classList.remove("invalid"); }

  //Handles the drinking from the well radio buttons
  const selectedDrinking = document.querySelector('input[name="drink"]:checked');
  if (!selectedDrinking) { drinkingSection.classList.add("invalid"); }
  else { drinkingSection.classList.remove("invalid"); }

}

function showAssessment(){
  //removed collapsed class
  //scroll to Assessment
  const inputs = gatherInputs();
  if (inputs) {
    const resultObj = produceEstimate(aggregateData, inputs.division, inputs.district,
      inputs.upazila, inputs.union, inputs.depth, inputs.colour, inputs.utensil);

    resultSection.innerHTML = resultObj.message;
    resultSection.className = resultObj.severity;

    assess.classList.remove('collapsed');
    chevron.scrollIntoView({behavior: 'smooth', block: 'start'});
  } else { assess.classList.add('collapsed'); }
}
