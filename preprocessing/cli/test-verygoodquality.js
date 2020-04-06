/*
This file tests against a "very good quality" data set from Mo, located in the
drive as iArsenic_test_Data_verygoodquality.xlsx
*/

const parse = require('csv-parse/lib/sync');
const path = require('path');
const fs = require('fs');
const csvLoader = require('../lib/load-data');
const cli = require('../lib/cli-common');

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'vgqd', 'vgqd-all-data.csv');
const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
};

const VGQD_DATA = parse(fs.readFileSync(DATA_PATH), CSV_PARSE_OPTIONS);

function getVGQDArsenicValue(div, dis, upa, uni) {
  for (const well of VGQD_DATA) {
    if (well.Division === div) {
      if (well.District === dis) {
        if (well.Upazila === upa) {
          if (well.Union === uni) {
            return Number(well.Arsenic);
          }
        }
      }
    }
  }
}

function discernAccuracy(arsenic, message) {
  const safeMessage = 'likely to be arsenic-safe';
  let accuracy;

  if (arsenic < 50) {
    if (message.includes(safeMessage)) {
      accuracy = 'accurate';
    } else {
      accuracy = "we say polluted, it isn't";
    }
  } else {
    if (message.includes(safeMessage)) {
      accuracy = "we say safe, it isn't";
    } else {
      accuracy = 'accurate';
    }
  }

  return accuracy;
}

function runTests(produceEstimate, divisions, div, dis, upa, uni, depth, colour) {
  const locationArsenicValue = getVGQDArsenicValue(div, dis, upa, uni);
  const message = produceEstimate(divisions, div, dis, upa, uni, depth, colour, null).message;

  const accuracy = discernAccuracy(locationArsenicValue, message);

  console.log(`"${div}","${dis}","${upa}","${uni}",${depth},${colour},${locationArsenicValue},"${message}","${accuracy}"`);
}

function main(options) {
  const preprocessor = options.model.preprocessor;
  const produceEstimate = options.model.estimator;

  const data = csvLoader(options.paths);
  const divisions = preprocessor(data);

  console.log('div,dis,upa,uni,depth,stain,arsenic,message,accuracy');

  /* eslint-disable */
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 0, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 11, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 14, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 14, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 14, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 14, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 14, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "S.k.b.(sundarpur)", 15, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 15, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 15, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "S.k.b.(sundarpur)", 15, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Jadunandi", 15, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 15, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 15, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 15, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 15, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 17, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "S.k.b.(sundarpur)", 17, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 17, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 18, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 18, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 18, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 20, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 20, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 20, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 20, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 20, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "S.k.b.(sundarpur)", 21, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 21, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 21, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 23, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 23, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Simla Rokonpur", 24, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 24, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Sonapur", 24, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Chatul", 24, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 24, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Sonapur", 24, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Jadunandi", 24, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Simla Rokonpur", 27, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 27, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Chatul", 27, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Jadunandi", 27, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 29, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 30, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 30, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 30, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 32, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 32, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 33, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Chatul", 34, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Kuchiamora", 37, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 37, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 37, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Baluhar", 37, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 37, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Simla Rokonpur", 38, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Chatul", 38, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 38, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 40, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 40, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 40, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 40, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 40, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 41, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 43, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Simla Rokonpur", 43, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Trilochanpur", 43, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 43, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 44, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 44, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Simanta", 44, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "Fatehpur", 44, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 46, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 46, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Maheshpur", "S.k.b.(sundarpur)", 46, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Kotchandpur Paurashava", 46, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Kuchiamora", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Kuchiamora", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 49, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Kuchiamora", 49, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 49, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 49, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 49, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Majhardia", 49, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Trilochanpur", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Balidia", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Trilochanpur", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 50, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 50, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 50, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 50, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 50, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 52, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 52, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 52, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 52, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 52, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 52, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 52, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 52, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 53, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Kuchiamora", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Trilochanpur", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 55, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Balidia", 55, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 55, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 55, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Arpara", 56, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 56, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 56, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 56, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Trilochanpur", 56, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Niamatpur", 56, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 58, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 58, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Baluhar", 58, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Baluhar", 58, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 58, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 58, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 58, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Talkhari", 58, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 58, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Chuadanga", "Jiban Nagar", "Banka", 59, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 59, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 61, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 61, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Shalikha", "Dhaneshwargati", 61, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Rajapur", 62, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kaliganj", "Kola", 64, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 64, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 64, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Magura Sadar", "Gopalgram", 66, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 67, "Black");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Boalmari", "Gunbaha", 69, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Kotchandpur Paurashava", 72, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Kotchandpur Paurashava", 76, "Red");
  runTests(produceEstimate, divisions, "Dhaka", "Faridpur", "Saltha", "Sonapur", 76, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Jhenaidah", "Kotchandpur", "Elangi", 78, "Red");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 79, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 91, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 91, "Black");
  runTests(produceEstimate, divisions, "Khulna", "Magura", "Mohammadpur", "Mohammadpur", 107, "Black");

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
