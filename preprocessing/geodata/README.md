# iArsenic Geodata Visualisation

NOTES:
* This is currently under development and not ready for deployment.
* All work has been based on the original map source files, which went down to Union-level only (no Mauzas).

## Key Resources

* [QGIS](https://qgis.org/) – Geographic Information System used to manipulate and simplify map files
* [mapshaper](https://mapshaper.org) – website used to quickly preview and simplify map files
* [D3.js](https://d3js.org/) – library used to display maps on the web
* [TopoJSON](https://github.com/topojson/topojson) – extension used to encode the topologies of files saved as GeoJSON for improved performance on the web

## Map Files

### Naming and Organisation

Different sets of map files may be found in `maps/` (on GitHub and the Shared Drive):

* `/dist` – for displaying on the web (`.geojson`, `.json`)
* `/src` – for editing (`.shp`, `.shx`, `.dbf`, `.prj`, `.qgz`)
  * For the time being, this folder is only on the Shared Drive. This is due to there being large binary files.
* `/test` – simple shapes for testing our code

The map files are kept in separate folders and given a suitable prefix to group them by their upper location container (district, division, upazila, or union).

To work with all maps used thus far, open the QGIS project file (`all-maps.qgz`). This contains each map as its own layer, organised into a group based on any simplification applied.

## Conversion

To convert the original map files to GeoJSON and TopoJSON, follow the steps below.

NOTE: If you use the QGIS project file (`all-maps.qgz`), you can skip straight to step 3; steps 1 and 2 are for individual map files.

1. Load source files (`.shp`, `.shx`, `.dbf`, `.prj`) into QGIS
2. Edit attributes for clarity
  * e.g. Rename attributes:
    * 'ADM1\_EN' to 'div'
    * 'ADM2\_EN' to 'dis'
    * 'ADM3\_EN' to 'upa'
    * 'ADM4\_EN' to 'uni'
    * 'Shape\_Area' to 'area'
  * e.g. Remove unused attributes:
    * ADM0\_EN
    * ADM\[0-4\]\_PCODE
    * ADM4\_REF
    * ADM4\_ALT1EN
    * ADM4\_ALT2EN
    * Shape\_Leng
    * date
    * validOn
    * validTo
3. Export > Save Features As...
    * Format: GeoJSON
    * COORDINATE_PRECISION: 5
4. Run `geo2topo` from topojson module to convert GeoJSON to TopoJSON

### Simplification

The map files contain detailed borders, which makes the files large and slow to render.
Simplification reduces the resolution of the borders, which improves the usability at negligible loss of detail.
For the mouza maps, simlification is needed because the resulting files would be too big for GitHub without it.

All simplification thus far has been completed by using mapshaper to apply the methods and options, and using QGIS to specify the co-ordinate precision (when exporting to GeoJSON).

For maps that have undergone some simplification, the following characters are used when naming them:

* __c__ – Co-ordinate Precision
    * Followed by a number (original: 15, max: 100, min: 1)
    * Precision of 5 is accurate to within 4ft

* __s__ – Simplification Factor
    * Followed by a percentage number (original: 100%, min: 1%)
        * Lower numbers denote higher levels of simplification
    * (Optional) Followed by simplification method and option(s) that affect the simplification process (see Methods and Options below)

For example, `maps/dist/dis/dis-c005-s020-vw-pr.json` means:

* `dis` – features are separated into districts
* `-c005` – co-ordinate precision value is 5
* `-s020` – simplification factor value is 20%
* `-vw` – simplification method is Visvalingam / Weighted Area
* `-pr` – simplification option is Prevent Shape Removal

#### Methods

The methods available on mapshaper are:

* Douglas-Peucker (`-dp`)
* Visvalingam / Effective Area (`-ve`)
* Visvalingam / Weighted Area (`-vw`)

#### Options

The options available on mapshaper are:

* Prevent Shape Removal (`-pr`)
* Use Planar Geometry (`-up`)

#### Simplification Process

It is recommended to use mapshaper, as it has more options and is easier to use.

##### Using mapshaper

* Import a map file (source or converted file format)\*
  * Select the 'detect line intersections' option (optional, but recommended)
* Open the *Simplify* menu found inside the top bar
* Apply simplification method and options as required
* Apply the amount of simplification by moving the slider in the top bar
  * Alternatively enter a percentage value in the input field to the side
* Fix the line intersections that happen using the *Repair* button on the top left, if there are any
* Export using the Export menu found inside the top bar


\* Please note:
* If using source files, you need to open each file individually i.e. `.shp` first, then `.prj`, then `.dbf`, and so on
* If using GeoJSON or TopoJSON, you need only open the file once

##### Using QGIS

* Import a map file (source or converted file format)\*\*
* Open the *Simplify* window found in Vector > Geometry Tools > Simplify...
* Specify the input layer (defaults to any layer highlighted in the *Layers* panel)
* Select the simplification method
* Specify the simplified (output) layer
  * Alternatively leave blank to create a temporary layer without saving
* Export > Save Features As...

\*\* Please note:
* QGIS has fewer methods and options to mapshaper.
* QGIS also lets us set _tolerance_ which we haven't investigated yet.
* If importing TopoJSON, the following warning message may appear: `CRS was undefined: defaulting to CRS EPSG:4326 - WGS 84`. This is due to the spatial reference information missing for the Co-ordinate Reference System in this file format. `EPSG:4326 - WGS 84` has been used thus far as the default, since this was pre-defined in the original source files.


### Attributes

Source map files found in `maps/src` retain all their original fields as defined in their respective `.dbf` files. Optimised maps only contain those attributes that are necessary for our further processing:

* div
* dis
* upa
* uni
* area
