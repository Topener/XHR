# What is it?:
XHR is a wrapper around Titanium's HTTPClient. It works perfectly with REST API endpoints and has a built in cache system that you can use for your requests.

# Usage:
In your app.js (or elsewhere), call:

    require("/lib/xhr");
    var xhr = new XHR();
    xhr.get("http://google.com", onSuccessCallback, onErrorCallback, options);

For more information check out the `examples.js` file. Or browse around the `xhr.js` file. You can find in there support for GET, POST, PUT and DELETE (called destroy for reserved words problems)

# About:
Created by Raul Riera, @raulriera  
Contributions by Daniel Tamas, @dan_tamas