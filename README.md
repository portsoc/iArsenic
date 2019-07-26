# iArsenic –  Instant Arsenic screening of hand pump tubewells in Bangladesh

Live at https://portsoc.github.io/iArsenic

Components:

* `data/` — source data
  * it specifies measured arsenic concentrations in tubewells around Bangladesh

* `docs/` — the website

* `geodata/` – scripts that use Bangladesh geo-boundary data
  * includes experiments with visualization of the various data we have

* `preprocessing/` — processing scripts
  * these turn data from the source CSV form into something consumed by the website and other tools
  * then there are tools for CLI running of estimates and testing

* `rscripts/` — original scripts in R

* `server/` — server for request log database
  * in a Google Cloud Function
