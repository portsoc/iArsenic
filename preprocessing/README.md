# iArsenic data preprocessing

## data structures

We deal with a 4-level hierarchy of administrative units:
division, district, upazila, and union.

For every area, on every level, we compute the following:

* `as_median_under_90`
* `as_max_under_90`
* `lower_quantile_under_90`
* `upper_quantile_under_90`
* `as_mean_over_90`

The in-memory structure that we get from the data looks like this:

```javascript
const divisions = {
  wells_under_90: [],
  wells_over_90: [],
  name: '..',

  as_median_under_90,
  as_max_under_90,
  lower_quantile_under_90,
  upper_quantile_under_90,
  as_mean_over_90,

  districts: {
    wells_under_90: [],
    wells_over_90: [],
    name: '..',
    parent: the division above,

    as_median_under_90,
    as_max_under_90,
    lower_quantile_under_90,
    upper_quantile_under_90,
    as_mean_over_90,

    upazilas: {
      wells_under_90: [],
      wells_over_90: [],
      name: '..',
      parent: the district above,

      as_median_under_90,
      as_max_under_90,
      lower_quantile_under_90,
      upper_quantile_under_90,
      as_mean_over_90,

      unions: {
        wells_under_90: [],
        wells_over_90: [],
        name: '..',
        parent: the upazila above,

        as_median_under_90,
        as_max_under_90,
        lower_quantile_under_90,
        upper_quantile_under_90,
        as_mean_over_90,
      }
    }
  }
}
```

## testing machine in the cloud

Setup:
* install node and npm
  * https://github.com/nodesource/distributions/blob/master/README.md
* install R
  * https://www.linode.com/docs/development/r/how-to-install-r-on-ubuntu-and-debian/
* make directory ~/auto-tests
