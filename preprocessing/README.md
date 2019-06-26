# iArsenic Data Preprocessing

## Requirements

* Ensure the csv headers are as follows:
  * 'Division,District,Upazila,Depth,Arsenic,Union'

## How to Use It

* Run ./cli/produce-aggregate-data-files.js
  * Run ./lib/load-data.js to parse the csv reads
    * If no file path is provided, load-data.js will use the default files in ../data/
  * Use CLI to create model-specific output
  * Output:
    * JSON of geographical hierarchy
    * JSON of aggregate data
    * Copy current model's estimator into ../docs/

## Output Structures

```
if (!(r.Division in divisions)) {
  divisions[r.Division] = {
    wells: [],
    districts: {},
    name: r.Division,
  };
}
const division = divisions[r.Division];

if (!(r.District in division.districts)) {
  division.districts[r.District] = {
    wells: [],
    upazilas: {},
    name: r.District,
    parent: division,
  };
}
const district = division.districts[r.District];

if (!(r.Upazila in district.upazilas)) {
  district.upazilas[r.Upazila] = {
    wells: [],
    unions: {},
    name: r.Upazila,
    parent: district,
  };
}
const upazila = district.upazilas[r.Upazila];

if (!(r.Union in upazila.unions)) {
  upazila.unions[r.Union] = {
    wells: [],
    name: r.Union,
    parent: upazila,
  };
}
```
