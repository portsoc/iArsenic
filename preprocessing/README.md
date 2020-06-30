# iArsenic Data Preprocessing

## Requirements

* Ensure the csv headers are as follows (**Case matters!**):
  * `Division,District,Upazila,Depth,Arsenic,Union`

## How to Use It

* Run ./cli/produce-aggregate-data-files.js
  * This will parse the csv file (using load-data.js)
    * If no file path is provided, it will use the default files in ../data/
  * Produces geographical hierarchy data
  * Model-specific pre-processor will:
    * Describe model-specific data structure
    * Prepare the aggregate data from the output of load-data.js (described below)
  * Puts a copy of <modelid>-estimator.js in ./docs/estimator.js
  * Puts a copy of the geographical hierarchy in ./docs/dropdown-data.js

## Models

1. original model from R scripts
  * Black is safe
  * over 150m deep is safe
  * wells shallower than 90m decided by median
  * wells 90-150m deep decided by mean
  * too few wells => get wells from bigger administrative area
2. ~~skipped~~
3. using only median
  * Black is safe
  * 0-90m, 90-150m, 150m+ decided by median
  * too few wells => get wells from bigger administrative area
4. more stratification
  * Black is safe
  * 0-15.3m, 15.3-45m, 45-65m, 65-90m, 90-150m, 150m+ all decided by median
  * too few wells => get wells from bigger administrative area
5. more sensible widening of location to get enough wells
  * Black is safe
  * 0-15.3m, 15.3-45m, 45-65m, 65-90m, 90-150m, 150m+ all decided by median
  * too few wells => get wells from deeper stratum and nearby geographical locations (going by centroids) – details in model5-preprocessor


more possible models:
* all models with 10% or so overlap between strata
* machine learning


## Output Structures

### load-data.js Output

```
const divisions = {
  'division name': {
    wells: [],
    name: 'division name',
    districts: {
      'district name': {
        wells: [],
        name: 'district name',
        upazilas: {
          'upazila name': {
            wells: [],
            name: 'upazila name',
            unions: {
              'union name': {
                wells: [],
                name: 'union name',
              },
            },
          },
        },
      },
    },
  },
  'next division name': {
    ...
  },
}
```

### dropdown-data.js Output

```
const dropdownData = [
  {
    division: 'division name',
    districts: [
      {
        district: 'district name',
        upazilas: [
          {
            upazila: 'upazila name',
            unions: [
              'union name'
              ...
            ],
          },
          ...
        ],
      },
      ...
    ],
  },
  ...
]
```
