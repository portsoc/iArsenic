1. run the rdata-to-csv.r on the input R data to output this data as a list of CSVs
  Do this by running: Rscript rdata-to-csv.r [directory containing r data] [output directory]
2. run the consolidate-csv.js script on the csvs created by the rdata-to-csv.r
  Do this by running: node consolidate-csv.js [directory containing rdata-to-csv.r output]\*.csv [output directory/filename.csv]
3. a consolidated csv file will be outputted by consolidate-csv.js

