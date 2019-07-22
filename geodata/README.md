# iArsenic Geodata Visualisation

NOTES: 
* This is currently under development and not ready for deployment.
* All work has been based on the original map source files, which went down to union level only (no Mauzas).

## Key Resources

* [QGIS](https://qgis.org/) - Geographic Information System used to manipulate and simplify map files
* [mapshaper](https://mapshaper.org) - website used to quickly preview and simplify map files
* [D3.js](https://d3js.org/) - library used to display maps on the web
* [TopoJSON](https://github.com/topojson/topojson) - extension used to encode the topologies of files saved as GeoJSON for improved performance on the web

## Map Files

### Naming and Organisation

Two different sets of map files may be found in maps/:

* /dist - for displaying on the web (.geojson, .json)
* /src - for editing (.shp, .shx, .dbf, .prj, .qgz)

The map files are kept in separate folders and given a suitable prefix to group them by their upper location container (district, division, upazila, or union).

To work with all maps used thus far, open the QGIS project file (all-maps.qgz). This contains each map as its own layer, organised into a group based on any simplification applied.

## Conversion

To convert the original map files to GeoJSON and TopoJSON, follow the steps below.

NOTE: If you use the QGIS project file (all-maps.qgz), you can skip straight to step 3; steps 1 and 2 are for individual map files.

1. Load source files (.shp, .shx, .dbf, .prj) into QGIS
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
4. Run geo2topo from topojson module to convert GeoJSON to TopoJSON

### Simplification

All simplification thus far has been completed by using mapshaper to apply the methods and options, and using QGIS to specify the co-ordinate precision (when exporting to GeoJSON).

For maps that have undergone some simplification, the following characters are used when naming them:

* __c__ - Co-ordinate Precision
    * Followed by a number (original: 15, max: 100, min: 1)

* __s__ - Simplification Factor
    * Followed by a number (original: 100, max: 100, min: 1)
        * Lower numbers denote higher levels of simplification
    * (Optional) Followed by simplification method and option(s) (see Simplification below)

For example, maps/dist/dis/*dis_c005_s020--vw--pr.json* contains:

* *dis* to denote its separation of features into districts
* *c005* to denote its co-ordinate precision value of 5
* *s020* to denote its simplification factor value of 20
* *--vw* to denote is simplification method (Visvalingam / Weighted Area)
* *--pr* to denote is simplification option (Prevent Shape Removal)

#### Methods

The methods that may be applied include:

* Douglas-Peucker (--dp)
* Visvalingam / Effective Area (--ve)
* Visvalingam / Weighted Area (--vw)

#### Options

The options that may be applied include:

* Prevent Shape Removal (--pr)
* Use Planar Geometry (--up)

### Attributes

Individual map files found in maps/src should retain all their original fields as defined in their respective .dbf files. Optimised maps in maps/dist should only contain those that are necessary, such as:

* area
* div
* dis
* upa
* uni

However, there may be additional fields when merging a map for a Bangladeshi administrative region with the map for the surrounding countries (Bhutan, India, Myanmar, Nepal, and Sri Lanka). By default, QGIS will use an ID for these countries and set any of the fields used for such regions to NULL.

#### Process

##### Using mapshaper

* Import a map file (source or converted file format) \*
  * Select the 'detect line intersections' option (optional, but recommended)
* Open the *Simplification* menu found inside the top bar
* Apply simplification method and options as required
* Apply the amount of simplification by moving the slider in the top bar
  * Alternatively enter a percentage value in the input field to the side


\* Please note:
* If using source files, you need to open each file individually i.e. .shp first, then .prj, then .dbf, and so on
* If using GeoJSON or TopoJSON, you need only open the file once

##### Using QGIS

* Import a map file (source or converted file format) \*\*
* Open the *Simplify* window found in Vector > Geometry Tools > Simplify...
* Specify the input layer (defaults to any layer highlighted in the *Layers* panel)
* Select the simplification method and tolerance
* Specify the simplified (output) layer
  * Alternatively leave blank to create a temporary layer without saving

\*\* Please note: 
* QGIS has fewer methods and options to mapshaper.
* If importing TopoJSON, the following warning message may appear: `CRS was undefined: defaulting to CRS EPSG:4326 - WGS 84`. This is due to the spatial reference information missing for the Co-ordinate Reference System in this file format. `EPSG:4326 - WGS 84` has been used thus far as the default, since this was pre-defined in the original source files.