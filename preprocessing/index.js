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
for every area, on every level, compute the following:

as_median_under_90   (<90)
as_max_under_90
lower_quantile_under_90
upper_quantile_under_90
as_mean_over_90  (>=90)


have a hash of divisions

for (records.length) {
  do{
    for (let i = 0; i<= records.length; i++){
      if (records(i).depth <= 90) {
        append records(i).arsenic to wells_under_90;
      else{
        append records(i).arsenic to wells_over_90;
      }
    }
  while search division === current division;
  search divsion = current division
  }
}




const divisions = {
  wells_under_90: [],
  wells_over_90: [],

  as_median_under_90,
  as_max_under_90,
  lower_quantile_under_90,
  upper_quantile_under_90,
  as_mean_over_90,

  districts: {
    wells_under_90: [],
    wells_over_90: [],

    as_median_under_90,
    as_max_under_90,
    lower_quantile_under_90,
    upper_quantile_under_90,
    as_mean_over_90,

    upazilas: {
      wells_under_90: [],
      wells_over_90: [],

      as_median_under_90,
      as_max_under_90,
      lower_quantile_under_90,
      upper_quantile_under_90,
      as_mean_over_90,

      unions: {
        wells_under_90: [],
        wells_over_90: [],

        as_median_under_90,
        as_max_under_90,
        lower_quantile_under_90,
        upper_quantile_under_90,
        as_mean_over_90,
      }
    }
  }
}

const divisions = {}

for each record
  if it's missing any data, skip it
  if we don't know the division (!(record.Division in divisions)), add a new object for it
    divisons[record.Division] = {
      wells_under_90: [],
      wells_over_90: [],
      districts: {},
    }
  in the division, add the well in wells_under_90[] or wells_over_90[]
  if we don't know the district, add a new object for it
  in the district, add the well in wells_under_90[] or wells_over_90[]
  if we don't know the upazila, add a new object for it
  in the upazila, add the well in wells_under_90[] or wells_over_90[]
  if we don't know the union, add a new object for it
  in the union, add the well in wells_under_90[] or wells_over_90[]

for each division
  sort the arrays
  if we don't have enough data under 90
    complain
  else
    compute as_median_under_90   (<90)
    compute as_max_under_90
    compute lower_quantile_under_90
    compute upper_quantile_under_90
  if we don't have enough data over 90
    complain
  else
    compute as_mean_over_90  (>=90)

for each district
  sort the arrays
  if we don't have enough data under 90
    take the computations from the division or complain
  else
    compute as_median_under_90   (<90)
    compute as_max_under_90
    compute lower_quantile_under_90
    compute upper_quantile_under_90
  if we don't have enough data over 90
    take the computations from the division or complain
  else
    compute as_mean_over_90  (>=90)

similar for upazila, union

create a function that given all the parameters spits out an estimate

replicate test.sh in javascript
*/
