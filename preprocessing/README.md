# iArsenic Data Preprocessing

## Requirements on input data files

* Ensure the csv headers are as follows (**Case matters!**):
  * `Division,District,Upazila,Union,Mouza,Depth,Arsenic`

## How to Use It

When the input data or the processing model is updated (see also the last sections in this page), you should do this:

* Run `./cli/produce-aggregate-data-files.js`
  * This will parse the csv file (using `load-data.js`)
    * If no file path is provided, it will use the default files in `../data/`
  * Produces geographical hierarchy data `dropdown-data.js`
  * Model-specific pre-processor will:
    * Prepare the aggregate data from the output of `load-data.js` (described below)
  * Puts a copy of `<modelid>-estimator.js` in `./docs/estimator.js`
  * Puts a copy of the geographical hierarchy in `./docs/dropdown-data.js`
* Commit the changes in `docs/` and push to GitHub to deploy (if appropriate)

## Models

1. original model from R scripts
   * Black is safe
   * over 150m deep is safe
   * wells shallower than 90m decided by median
   * wells 90-150m deep decided by mean
   * too few wells => get wells from bigger administrative region
2. ~~skipped~~
3. using only median
   * Black is safe
   * 0-90m, 90-150m, 150m+ decided by median
   * too few wells => get wells from bigger administrative region
4. more stratification
   * Black is safe
   * 0-15.3m, 15.3-45m, 45-65m, 65-90m, 90-150m, 150m+ all decided by median
   * too few wells => get wells from bigger administrative region
5. more sensible widening of location to get enough wells
   * Black is safe
   * 0-15.3m, 15.3-45m, 45-65m, 65-90m, 90-150m, 150m+ all decided by median
   * too few wells => get wells from deeper stratum and nearby geographical locations (going by centroids) – details in model5-preprocessor
   * if depth is <=15.3m, there may be flooding :
     * if there is flooding AND the well is red, we use the arsenic 95 percentile of available data of the stratum
     * if there is no flooding AND the well is red, we use the arsenic 75 percentile of available data of the stratum
     * if the well is black, we use the arsenic 25 percentile of available data of the stratum no matter if there is flooding or not


For every model, Model-specific pre-processor will:
  * Describe model-specific data structure

More possible models:
* all models with 10% or so overlap between strata
* machine learning

### Deploying a Model

The following steps are taken to deploy a new model as the default. It is assumed that the model estimator and preprocessor files are located in `preprocessing/models/` and are named like so:

* `model#-preprocessor.js`
* `model#-estimator.js`

where '`#`' is the model number.

1. In `preprocessing/lib/cli-common.js` there is a global variable called `DEFAULT_MODEL` which should be set to a string like `model#` _(note: there is no dash there)_

2. Next use the following commands in a terminal to deploy the new default to the UI.

   * `node preprocessing/cli/produce-aggregate-data-files.js -o docs`

   * This will replace the preprocessed data and the estimator script in the web files. **If done on the `master` branch, this will affect the running app.**


## File Structure

```
iArsenic/preprocessing
├── README.md
├── cli/                // Tools for sorting data and testing the models
├── data-import/        // Tools to import data from the .Rdata format
├── geodata/            // Geographic data visualisation (under development)
├── lib/                // Various tools for converting and fixing data
├── models/             // Stores the models used to find the arsenic levels
└── tests/              // Tests for functions in ./lib/stats.js
```

## Output Structures

### load-data.js Output

When we parse input CSV data, we give it to the rest of the scripts in this form:

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
                mouzas: {
                  'mouza name': {
                  wells: [],
                  name: 'mouza name',
                },
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

When we generate the geographical hierarchy from the available input data, we create a JSON file like this, which is then used by the client-side scripts to let the user select their region.

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

## Tests

`npm test` will run unit tests on the stats code.

`sh preprocessing/tests/test-cli.sh` will run all the models against all datasets configures in `test-cli.sh`, produce output for every geographic region and every well depth we care about, and compare the output against benchmark output in `preprocessing/tests/benchmark-data`. If we aren't changing the statistical models or the underlying data sets, we should not see any differences in the generated data.

`preprocessing/tests/benchmark-data` is decompressed from `preprocessing/tests/benchmark-data.tgz` when running tests with `test-cli.sh`.

### When we add/change a model

A changed model should generate different outputs from the benchmark data. We can look at the differences and see that they correspond to the model changes we meant to implement. When satisfied, we can move `preprocessing/outputs/<model>` generated outputs into `benchmark-data`.

`benchmark-data.tgz` is compressed using tar and gzip and stored on GitHub LFS.
When running tests, `test-cli.sh` automatically decompresses
`benchmark-data.tgz` to use the latest benchmark data - in **overwrites** the
existing `benchmark-data` folder! When updating benchmark data, the benchmark
data folder must be recompressed with new benchmark data.

An added model must be added to the list of models run in `test-cli.sh`; it will generate new outputs in `test-outputs` that, if reviewed and satisfactory, should be adopted into `benchmark-data`.

When a model changes, no other models' output should be affected.

### When we add/change a dataset

A changed dataset may generate different outputs in some or all of the models. We should identify and review the output changes, and if satisfied that they correspond to the intended dataset change, adopt the changed outputs from `test-outputs` into `benchmark-data` and re-compress it (see above).

An added dataset needs to be added to the list of datasets in `test-cli.sh`; it will generate new outputs in `test-outputs` that, if reviewed and satisfactory, should be adopted into `benchmark-data` and re-compressed (see above).

When a dataset is added or changed, no test outputs with previous datasets should be affected.
