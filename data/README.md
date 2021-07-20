# Data files with arsenic concerntrations based on geographic location and helper files for name corrections, and the correct mouza name list

The CSV files in `data/` represent the underlying data about arsenic concentrations.

* 29k was the original data set
* 29k + 35k (plus/minus Lakshmipur Sadar) was our second dataset
* 29k + 1M is the latest one, we believe there are no duplicate wells across these two data sets. (The 35k dataset was a subset of the 1M dataset).

Helper files:

* mouza-names is a list of all known and correct mouza names

The `data/name-corrections/` folder contains name corrections to be used when loading the default data files above.

The `data/disabled/` folder contains data sets that we no longer use but keep for comparison.

The `data/vgqd/` folder contains a small dataset where we have guaranteed quality of the arsenic level measurements, we use this data to check the performance of the statistical models.
