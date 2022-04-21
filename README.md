# iArsenic –  Instant Arsenic screening of hand pump tubewells in Bangladesh

Live at https://portsoc.github.io/iArsenic

## About

Web-based application to estimate arsenic levels in untested wells in Bangladesh.

## Structure:

1. the main application is a set of static files:
  - the HTML and JS for the page that allows a user estimate arsenic levels
  - JS files with pre-processed data (see below)
  - request log backed by a Google Cloud Function with a database of requests
2. the estimation is based on input data with measured arsenic levels in wells in Bangladesh; this input data lives in `data/`
  - this data is processed statistically using one of the available _models_ (see `models/`)
  - we don't process the data on every user request, but rather we pre-process it so we can satisfy user requests with a simple data lookup
  - a _model_ generates _aggregate data_ files that capture the estimate for every region (i.e. mouza) and every depth stratum and every combination of staining/flooding inputs, these become part of the static files above
3. every user request is logged in a little Google Cloud database (see `server/`) for usage analytics and to show impact

## Components:

* `data/` — source data
  * it specifies measured arsenic concentrations in tubewells around Bangladesh

* `docs/` — the website hosted in GitHub Pages

* `preprocessing/` — processing scripts
  * these turn data from the source CSV form into something consumed by the website and other tools
  * then there are tools for CLI running of estimates and testing

* `preprocessing/geodata/` – scripts that use Bangladesh geo-boundary data
  * includes experiments with visualization of the various data we have

* `server/` — server for request log database
  * in a Google Cloud Function

Original scripts in R can now be found [here](https://github.com/portsoc/iArsenic/releases/tag/rscripts).

## Deploying a Model

The following steps are taken to deploy a new model as the default. It is assumed that the model estimator and preprocessor files are located in `preprocessing/models/` and are named like so:

* `model#-preprocessor.js`
* `model#-estimator.js`

where '`#`' is the model number.

1. In `preprocessing/lib/cli-common.js` there is a global variable called `DEFAULT_MODEL` which should be set to a string like `model#` _(note: there is no dash there)_

2. Next use the following commands in a terminal to deploy the new default to the UI.

  * `node preprocessing/cli/produce-aggregate-data-files.js -o docs`

  * This will replace the preprocessed data and the estimator script in the web files. **If done on the `master` branch, this will affect the running app.**
