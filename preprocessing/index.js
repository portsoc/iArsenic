const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.join(__dirname,'..','rscripts', 'data', 'AdmBnd1b.csv'));

const records = parse(data, {
  columns: true,
  skip_empty_lines: true,
});



console.log(records.length);
console.log(records[100]);


/*
for every area, compute the following:
for now, just to the level of upazila

as_median_under_90   (<90)
as_max_under_90
lower_quantile_under_90
upper_quantile_under_90
as_mean_over_90  (>=90)


*/
