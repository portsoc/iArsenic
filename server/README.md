# iArsenic data logging server

This is a Google cloud function for logging requests to a Google datastore for
future analysis.

## Notes

* Accepts only GET and POST requests for listing and adding logs
* Accessing logs requires authentication
* Data is NOT validated when logging
* Adapted from google's cloud functions examples, in particular the datastore one
* The function is deployed by running `npm run deploy` (requirement: `gcloud` is set up and configured).

## Authorized users

The code in `index.js` hardwires users who are authorized to see the logs; if
the members change, the code needs to be updated and redeployed.
