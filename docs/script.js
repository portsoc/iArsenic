/* global produceEstimate, dropdownData, aggregateData */

const divDD = document.querySelector('#divisionDD');
const disDD = document.querySelector('#districtDD');
const upaDD = document.querySelector('#upazilaDD');
const uniDD = document.querySelector('#unionDD');
const locationSection = document.querySelector('#locationSection');
const assess = document.querySelector('#assessment');
const submit = document.querySelector('#submit');
const chevron = document.querySelector('#chevron');
const utensilSection = document.querySelector('#utensilSection');
const depth = document.querySelector('#depth');
const depthOutput = document.querySelector('#depthOutput');
const depthSection = document.querySelector('#depthSection');
const stainingSection = document.querySelector('#stainingSection');
const floodingSection = document.querySelector('#floodingSection');
const drinkingSection = document.querySelector('#drinkingSection');
const redStain = document.querySelector('#red');
const blackStain = document.querySelector('#black');
const mixedStain = document.querySelector('#mixed');
const result = document.querySelector('#result');
const inputs = document.querySelectorAll('#inputs select, #inputs input');
const redImg = document.querySelector('#redImg');
const redLabel = document.querySelector('#redLabel');
const blackImg = document.querySelector('#blackImg');
const blackLabel = document.querySelector('#blackLabel');

window.addEventListener('load', init);

function init() {
  divDD.dataset.nameProp = 'division';
  divDD.dataset.subProp = 'districts';
  divDD.nextDropdown = disDD;

  disDD.dataset.nameProp = 'district';
  disDD.dataset.subProp = 'upazilas';
  disDD.nextDropdown = upaDD;

  upaDD.dataset.nameProp = 'upazila';
  upaDD.dataset.subProp = 'unions';
  upaDD.nextDropdown = uniDD;

  divDD.addEventListener('change', handleDropDownSelection);
  disDD.addEventListener('change', handleDropDownSelection);
  upaDD.addEventListener('change', handleDropDownSelection);

  populateDropdown(divDD, divDD.dataset.nameProp, divDD.dataset.subProp, dropdownData); // complete data

  depthOutput.addEventListener('input', updateSlider);

  submit.addEventListener('click', showAssessment);
  chevron.addEventListener('click', chevronClick);

  redLabel.addEventListener('mouseover', () => {swapStainingImage('red')});
  redStain.addEventListener('click', () => {swapStainingImage('red')});
  blackLabel.addEventListener('mouseover', () => {swapStainingImage('black')});
  blackLabel.addEventListener('click', () => {swapStainingImage('black')});

  redStain.addEventListener('change', () => { displayElement(utensilSection, false); });
  blackStain.addEventListener('change', () => { displayElement(utensilSection, false); });
  mixedStain.addEventListener('change', () => { displayElement(utensilSection, true); });

  depth.addEventListener('input', () => { updateRangeLabel(depth.value); });
  depth.addEventListener('change', () => { toggleFlooding() });
  depthOutput.addEventListener('change', () => { toggleFlooding() });

  for (let i = 0; i < inputs.length; i += 1) {
    inputs[i].addEventListener('change', hideAssessment);
  }
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
  if (!retval.division || !retval.district || !retval.upazila || !retval.union) {
    scrollToSection(locationSection);
    return null;
  }

  if (!retval.colour && !retval.utensil) {
    scrollToSection(stainingSection);
    return null;
  }

  if (!retval.depth) {
    // depth 0 is the default and counts as no-value-entered
    scrollToSection(depthSection);
    return null;
  }

  if (!retval.flooding && depthOutput.value < 50 && floodingSection.classList.contains('invalid')) {
    scrollToSection(floodingSection);
    return null;
  }

  if (!retval.drinking) {
    scrollToSection(drinkingSection);
    return null;
  }

  console.log('gathered inputs', retval);
  return retval;
}

function scrollToSection(input) {
  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleDropDownSelection(e) {
  const dd = e.target;
  const opt = dd.selectedOptions[0];
  const nextDD = dd.nextDropdown;

  populateDropdown(nextDD, nextDD.dataset.nameProp, nextDD.dataset.subProp, opt.subdivisionData);
}

function populateDropdown(dd, nameProp, subDivProp, ddData) {
  cleanupDropdown(dd);

  if (ddData) {
    dd.innerHTML = "<option value=''>Please Select&hellip;</option>";
    dd.disabled = false;
    for (let i = 0; i < ddData.length; i += 1) {
      let name = ddData[i]; // names for unions
      if (nameProp) name = name[nameProp]; // names for divisions, districts, upazilas

      const opt = document.createElement('option');
      opt.value = name;
      opt.text = name;
      opt.subdivisionData = ddData[i][subDivProp];

      dd.add(opt);
    }
  }
}

function cleanupDropdown(dd) {
  if (!dd) return;

  dd.innerHTML = "<option value=''>&hellip;</option>";
  dd.disabled = true;

  cleanupDropdown(dd.nextDropdown);
}

function hideAssessment() {
  assess.classList.add('hidden');
  chevron.classList.remove('flip');
  result.textContent = '';
  result.className = '';
}

const minPos = 0;
const maxPos = 100;

// //logarithmic code
// const minVal = Math.log(5);
// const maxVal = Math.log(1000);
// const scale = (maxVal - minVal) / (maxPos - minPos);
//
// function updateRangeLabel(position) {
//   depthOutput.value = Math.round(Math.exp(minVal + scale * position));
// }
//
// function updateSlider() {
//   if (depthOutput.value > 0) {
//     depth.value = (Math.log(depthOutput.value) - minVal) / scale + minPos;
//   } else { depth.value = 0; }
// }

// linear code
const minVal = 5;
const maxVal = 1000;
const scale = (maxVal - minVal) / (maxPos - minPos);

function updateRangeLabel(position) {
  depthOutput.value = Math.round(minVal + scale * position);
}

function updateSlider() {
  if (depthOutput.value > 0) {
    depth.value = (depthOutput.value - minVal) / scale + minPos;
  } else { depth.value = 0; }
}

function displayElement(element, show) {
  element.classList.toggle('hidden', !show);
}

function toggleFlooding() {
  if (depthOutput.value < 50) { displayElement(floodingSection, true); }
  else { displayElement(floodingSection, false); }
}

function validateInputs() {
  // Handles the dropdowns
  const dropdownInputs = {
    dropdowns: [divDD, disDD, upaDD, uniDD],
    valid: true,
  };
  for (let dropdown of dropdownInputs.dropdowns) {
    if (!dropdown.value) {
      dropdownInputs.valid = false;
      break;
    }
  }
  if (!dropdownInputs.valid) {
    locationSection.classList.add('invalid');
  } else { locationSection.classList.remove('invalid'); }

  // Handles the staining radio buttons
  const selectedStaining = document.querySelector('input[name="staining"]:checked');
  if (!selectedStaining) {
    stainingSection.classList.add('invalid');
  } else if (selectedStaining.value === 'Mixed') {
    stainingSection.classList.remove('invalid');
    const selectedUtensil = document.querySelector('input[name="stainingUtensil"]:checked');
    if (!selectedUtensil) {
      stainingSection.classList.add('invalid');
    } else {
      stainingSection.classList.remove('invalid');
    }
  } else {
    stainingSection.classList.remove('invalid');
  }

  // Handles the depth
  const depthOutputValue = Number(depthOutput.value);

  if (depthOutputValue === 0 || depthOutputValue > 1000) {
    depthSection.classList.add('invalid');
  } else {
    depthSection.classList.remove('invalid');
  }

  // Handles the flooding
  const selectedFlooding = document.querySelector('input[name="flooding"]:checked');
  if (!selectedFlooding && !floodingSection.classList.contains('hidden')) {
    floodingSection.classList.add('invalid');
  } else {
    floodingSection.classList.remove('invalid');
  }

  // Handles the drinking from the well radio buttons
  const selectedDrinking = document.querySelector('input[name="drink"]:checked');
  if (!selectedDrinking) {
    drinkingSection.classList.add('invalid');
  } else {
    drinkingSection.classList.remove('invalid');
  }
}

let fallbackLogImage; // global to prevent too quick garbage collection before the data is logged
// needs to be kept in sync with request-log.js
const LOG_URL = 'https://europe-west2-uop-iarsenic-01.cloudfunctions.net/requests';
const FALLBACK_URL = 'http://jacek.soc.port.ac.uk/tmp/iArsenic';

function logToServer(data) {
  if (typeof navigator.sendBeacon === 'function') {
    const message = { value: data };
    navigator.sendBeacon(LOG_URL, JSON.stringify(message));
  } else {
    fallbackLogImage = new Image();
    fallbackLogImage.src = FALLBACK_URL + '?inputs=' + encodeURIComponent(btoa(JSON.stringify(data)));
  }
}

// add slight delay to simulate server interaction
function submitDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showAssessment() {
  result.className = 'loading';

  // removed hidden class
  // scroll to Assessment
  const inputs = gatherInputs();

  if (inputs) {
    const estimate = produceEstimate(aggregateData, inputs.division, inputs.district,
      inputs.upazila, inputs.union, inputs.depth, inputs.colour, inputs.utensil);

    // log the inputs
    logToServer({ inputs, estimate });

    chevron.classList.add('flip');
    assess.classList.remove('hidden');
    chevron.scrollIntoView({ behavior: 'smooth', block: 'start' });

    await submitDelay(1500);

    // show the estimate
    result.textContent = estimate.message;
    result.className = estimate.severity || 'unsure';
  } else {
    hideAssessment();
  }
}

function chevronClick() {
  if (!chevron.classList.contains('flip')) {
    showAssessment();
  } else {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // validateInputs();
    chevron.classList.remove('flip');
  }
}

function swapStainingImage(type) {
  if (type === 'red') {
    redImg.classList.remove('hidden');
    redLabel.classList.add('shown');
    blackImg.classList.add('hidden');
    blackLabel.classList.remove('shown');
  } else if (type === 'black') {
    redImg.classList.add('hidden');
    redLabel.classList.remove('shown');
    blackImg.classList.remove('hidden');
    blackLabel.classList.add('shown');
  }
}
