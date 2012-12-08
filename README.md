# What is it?:
XHR is a wrapper around Titanium's HTTPClient. It works perfectly with REST API endpoints and has a built in cache system that you can use for your requests.

# Usage:
In your app.js (or elsewhere), call:

    var XHR = require("/lib/xhr");
    var xhr = new XHR();
    xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, options);

For more information check out the [examples.js](https://github.com/raulriera/XHR/blob/master/examples.js) file. Or browse around the [xhr.js](https://github.com/raulriera/XHR/blob/master/xhr.js) file. You can find in there support for GET, POST, PUT and DELETE (called destroy for reserved words problems)

# About:
Created by Raul Riera, [@raulriera](http://twitter.com/raulriera)  
Contributions by Daniel Tamas, [@dan_tamas](http://twitter.com/dan_tamas) and Bob Sims, [@2wheelsburning](http://twitter.com/2wheelsburning)