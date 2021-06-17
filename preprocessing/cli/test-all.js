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
    for (const dis of Object.keys(divisions[div].districts)) {
      for (const upa of Object.keys(divisions[div].districts[dis].upazilas)) {
        for (const uni of Object.keys(divisions[div].districts[dis].upazilas[upa].unions)) {
          for (const mou of Object.keys(divisions[div].districts[dis].upazilas[upa].unions[uni].mouzas)) {
            runTests(produceEstimate, divisions, div, dis, upa, uni, mou);
          }
        }
      }
    }
  }

  /* eslint-disable */
  // runTests(produceEstimate, divisions, "Barisal", "Barguna", "Amtali", "Amtali");
  /* eslint-enable */

  // if we wish to see memory stats:
  // console.log(process.memoryUsage());
  // gc();
  // setInterval(() => {
  //   console.log(process.memoryUsage());
  //   gc();
  // }, 2000);
}

main(cli.getParameters());
