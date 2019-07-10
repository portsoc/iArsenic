# iArsenic Geodata Visualisation

NOTE: Currently under development and not ready for deployment.

## Map Files

### Naming and Organisation

Two different sets of map files may be found in maps/:

* /dist - for displaying on the web (.geojson, .json)
* /src - for editing (.shp, .shx, .dbf, .prj, .qgz)
  * This is held outside the git repository due to large file sizes.

The map files are kept in separate folders and given a suitable prefix to group them by their upper location container (district, division, upazila, or union).

The following characters are used to name individual map files where applicable:

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

### Simplification

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

Map files found in maps/src should retain all their original fields as defined in their respective .dbf files. Optimised maps in maps/dist should only contain those that are necessary, such as:

* area
* div
* dis
* upa
* uni