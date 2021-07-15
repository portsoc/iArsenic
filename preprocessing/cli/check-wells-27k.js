// From the wells in the 29k dataset, find the mouza that they are in using geodata
// then make sure the mouza they are in is consistent with the upazilla the 29k dataset
// says they're in

// const cli = require('../lib/cli-common');
const fs = require('fs');

function extractUpa(geodata) {
  for (const upa of geodata.objects.map.geometries) {
    console.log(upa.properties.upa);
  }
}

function main() {

  const geodata = JSON.parse(fs.readFileSync('preprocessing/geodata/maps/dist/upa/upa-c005-s020-vw-pr.json'));

  extractUpa(geodata);
}


main();
