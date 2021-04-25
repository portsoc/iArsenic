# iArsenic WebServer

## About

Webserver exists to serve the application in production and to log requests to a google firebase database for future analysis 

## Notes
* Accepts only GET and POST requests for listing and adding logs
* Accessing logs requires authentication
* Data is NOT validated when logging
* Adapted from google's cloud functions examples, in particular the datastore one
