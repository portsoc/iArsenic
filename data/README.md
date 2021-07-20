# Data files

The CSV files in `data/` represent the underlying data about arsenic concentrations.

* 29k was the original data set
* 29k + 35k (plus/minus Lakshmipur Sadar) was our second dataset
* 1M is the latest data set, until we get mouza locations for the 29k wells
  - we believe there are no duplicate wells between the 1M and 29k data sets
  - the 35k dataset was a subset of the 1M data set

Helper files:

* `mouza-names.csv` is a list of all known mouza names that are taken to be the correct ones, as other data sets can use different spellings of region names.

The `data/name-corrections/` folder contains name corrections to be used when loading the default data files above.

The `data/disabled/` folder contains data sets that we no longer use but keep for comparison.

The `data/vgqd/` folder contains a small dataset where we have guaranteed quality of the arsenic level measurements, we use this data to check the performance of the statistical models.
