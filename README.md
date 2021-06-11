# iArsenic –  Instant Arsenic screening of hand pump tubewells in Bangladesh

Live at https://portsoc.github.io/iArsenic

## About

Web-based application to estimate arsenic levels in untested wells in Bangladesh.

## Components:

* `data/` — source data
  * it specifies measured arsenic concentrations in tubewells around Bangladesh

* `docs/` — the website

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

## CI/CD

There is a GitHub action for linting and testing. It runs eslint and the unit tests. The unit tests only test functions in /lib/stats.
