## About

We originally received well data in R (in the `.RData` file format), which needs
to be converted into CSV; files in `data-import/` do this conversion.

To use `.RData` it needs to be converted to `.csv` format and we need to ensure the names
of the regions in the new data match the names in our current `data.#`

The `.RData` is converted to `.csv` with the `rdata-to-csv.r` and `consolidate-csv.js` scripts.

Name corrections for the new data is generated using the `find-name-corrections.js` script.

These name corrections can then be used by `preprocessing/lib/load-data.js` to apply
to any given dataset currently being loaded.

Having a consistent regions names is important so we don't mistake wells in the same
region as wells in different regions.

## Typical Use

1. Insert .RData files into r-data-rdata/
2. Run rdata-to-csv.r with the following command:

  Rscript rdata-to-csv.r r-data-rdata r-data-csv

  _Rscript rdata-to-csv.r [directory containing r data] [output directory]_

  This will convert the files in r-data-rdata/ to csv and ouput them in r-data-csv/

3. Run consolidate-csv.js with the following command:

  node consolidate-csv.js r-data-csv/\*.csv > consolidated-csv.csv

  _node consolidate-csv.js [directory containing rdata-to-csv.r output]\*.csv > [output directory/filename.csv]_

  Note that the consolidate-csv.js script uses the standard output so redirect is used
  to send the output to a file (the name of this file can be anything)

4. find-name-corrections.js can then be used on the output of consolidate-csv.js
to identify and incorrectly spelt regions and record correct alternatives.

  To run find-name-corrections.js:

  node find-name-corrections.js -i [output-of-consolidate-csv.js] -o [name-corrections-file.csv]

  **The output of find-name-corrections should have a .csv extension.**

## File Structure

```
iArsenic/preprocessing/data-import
├── README.md
├── consolidate-csv.js            // Combines multiple csv files into one
├── find-name-corrections.js      // Input a csv and output name corrections
├── rdata-to-csv.r                // Converts .RData files to .csv files
├── r-data-csv/                   // Stores .csv files being imported
└── r-data-rdata/                 // Stores .RData files being imported
```
