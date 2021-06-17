const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');

function runTests(produceEstimate, divisions, div, dis, upa, uni, mou) {
  for (const depth of [20, 60, 80, 100, 200]) {
    for (const colour of ['Red', 'Black']) {
      console.log(`"${div}" "${dis}" "${upa}" "${uni}" "${mou}" ${depth} ${colour} - -  ` +
        produceEstimate(divisions, div, dis, upa, uni, mou, depth, colour, null).message);
    }
    for (const utensil of ['Red', 'No colour change to slightly blackish']) {
      const colour = 'none';
      const utensilshort = utensil.substring(0, 2);
      console.log(`"${div}" "${dis}" "${upa}" "${uni}" "${mou}" ${depth} ${colour} "${utensilshort}" -  ` +
        produceEstimate(divisions, div, dis, upa, uni, mou, depth, colour, utensil).message);
    }
  }

  const depth = 10;
  for (const flooding of ['Yes', 'No']) {
    for (const colour of ['Red', 'Black']) {
      console.log(`"${div}" "${dis}" "${upa}" "${uni}" "${mou}" ${depth} ${colour} - "${flooding}"  ` +
        produceEstimate(divisions, div, dis, upa, uni, mou, depth, colour, null, flooding).message);
    }
    for (const utensil of ['Red', 'No colour change to slightly blackish']) {
      const colour = 'none';
      const utensilshort = utensil.substring(0, 2);
      console.log(`"${div}" "${dis}" "${upa}" "${uni}" "${mou}" ${depth} ${colour} "${utensilshort}" "${flooding}"  ` +
        produceEstimate(divisions, div, dis, upa, uni, mou, depth, colour, utensil, flooding).message);
    }
  }
}

function main(options) {
  const preprocessor = options.model.preprocessor;
  const produceEstimate = options.model.estimator;

  const data = csvLoader(options.paths);
  const divisions = preprocessor(data);

  for (const div of Object.keys(divisions)) {
    const divObj = divisions[div];
    for (const dis of Object.keys(divObj.districts)) {
      const disObj = divObj.districts[dis];
      for (const upa of Object.keys(disObj.upazilas)) {
        const upaObj = disObj.upazilas[upa];
        for (const uni of Object.keys(upaObj.unions)) {
          const uniObj = upaObj.unions[uni];
          for (const mou of Object.keys(uniObj.mouzas)) {
            runTests(produceEstimate, divisions, div, dis, upa, uni, mou);
          }
        }
      }
    }
  }
}

main(cli.getParameters());
