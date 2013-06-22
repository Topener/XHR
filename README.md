# XHR:
XHR is a wrapper around Titanium's HTTPClient. It works perfectly with REST API endpoints and has a built in cache system that you can use for your requests.

## Usage:
In your app.js (or elsewhere), call:

    var XHR = require("/xhr");
    var xhr = new XHR();
    xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, options);

For more information check out the [examples.js](https://github.com/raulriera/XHR/blob/master/examples.js) file. Or browse around the [xhr.js](https://github.com/raulriera/XHR/blob/master/xhr.js) file. You can find in there support for GET, POST, PUT and DELETE (called destroy for reserved words problems)

## Helpers
Apart from the RESTful way of interacting with your API endpoints, this module also includes the following helper methods:

### clean()
Goes through all the cached documents and delete everything that has been expired (if their TTL timestamp is less than the current time)

This method returns the count of deleted documents

### purge()
Goes through all the documents and delete everything

This method returns the count of deleted documents

## About:
Created by Raul Riera, [@raulriera](http://twitter.com/raulriera)  

Contributions by:

* Daniel Tamas, [@dan_tamas](http://twitter.com/dan_tamas) 
* Bob Sims, [@2wheelsburning](http://twitter.com/2wheelsburning) 
* Mark Ross [@rossman66](https://github.com/rossman66)