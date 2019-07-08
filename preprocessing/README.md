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
