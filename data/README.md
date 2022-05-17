# Data files

The CSV files in `data/` represent the underlying data about arsenic concentrations.

* 29k was the original data set
* 29k + 35k (plus/minus Lakshmipur Sadar) was our second dataset
* 1M is the latest data set, until we get mouza locations for the 29k wells
  - we believe there are no duplicate wells between the 1M and 29k data sets
  - the 35k dataset was a subset of the 1M data set
* Danida-20220514.csv
  - 160k wells from the coastal areas, apparently not included in 1M
  - produced by Danida, a european organisation
  - overlap could be identified by checking Mouzas common with the 1M data set,
    and only keeping data from one dataset, whichever has more in that Mouza
  - name corrections from BARISAL#PIROJPUR#Pirojpur Sadar#Sankarpasha,~none~ are skipped due to lack of time
    - remove the lines from line 11, move the data file out of data/, then you can generate more name corrections
* BGS_Ravenscroft.csv
  - combines (BGS, 2001), (Ravenscroft et al. 2018)
  - also presumed non-overlapping with the above
  - name corrections from Dhaka#Dhaka#Savar#Paurashava,~none~ are skipped due to lack of time
    - remove the lines from line 11, move the data file out of data/, then you can generate more name corrections

This data contains arsenic levels and region-level locations of wells tested by the government screening programmes.

## Requirements on input data files

* Ensure the csv headers are as follows (**Case matters!**):
  * `Division,District,Upazila,Union,Mouza,Depth,Arsenic`

## Helper files:

* `mouza-names.csv` is a list of all known mouza names that are taken to be the correct ones, as other data sets can use different spellings of region names.

The `data/name-corrections/` folder contains name corrections to be used when loading the default data files above.

The `data/disabled/` folder contains data sets that we no longer use but keep for comparison.

The `data/vgqd/` folder contains a small dataset where we have guaranteed quality of the arsenic level measurements, we use this data to check the performance of the statistical models

  - we have staining information for every well in VGQD but no flooding information
