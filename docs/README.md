# iArsenic Website

## File Structure

```
iArsenic/preprocessing
├── README.md
├── index.html              // Main page
├── script.js               // User input processing - main JS file
├── stylesheet.css          // Stylesheet for the main page
├── dropdown-data.js        // Region data used in the dropdown – updated when we deploy a new model or a new data set
├── estimator.js            // The model for the estimation of the arsenic level - updated when we deploy a new model
├── request-log.html        // Page for displaying logs
├── staining-guide.html     // Page to help the user recognise the staining on wells
├── aggregate-data/
│   └── divison-district.json  // Region data used for estimation, loaded dynamically when the user selects a district
├── css/                    // Stylesheets for logs
├── img/                    // Image assets
└── js/                     // Scripts for displaying logs

3 directories, 9 files
```

Todo cleanups: move CSS into `css/` and JS into `js/` ?
