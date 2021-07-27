# iArsenic data logging server

This is a Google cloud function for logging requests to a google datastore for
future analysis.

## Notes

* Accepts only GET and POST requests for listing and adding logs
* Accessing logs requires authentication
* Data is NOT validated when logging
* Adapted from google's cloud functions examples, in particular the datastore one
