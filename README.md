# XHR:
XHR is a wrapper around Titanium's HTTPClient. It works perfectly with REST API endpoints and has a built in cache system that you can use for your requests. But it also can be use for any HTTP requests, you can even cache remote images.

## Usage:
In your app.js (or elsewhere), call:

```javascript
//init xhr.js
var XHR = require("xhr");
var xhr = new XHR();
```

GET and DELETE calls share the same structure
```javascript
xhr.GET("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, options);
xhr.DELETE("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, options);
```

 POST and PUT also share structure, only 1 added field as opposed to GET/DELETE
```javascript
xhr.POST("http://freegeoip.net/json/", data, onSuccessCallback, onErrorCallback, options);
xhr.PUT("http://freegeoip.net/json/", data, onSuccessCallback, onErrorCallback, options);
```

## Options

In the 4 API call methods you can set options, but doing this every time might be a bit frustrating. Especially if you want authentication for every API call. (or other options). You can set it globally like this

```javascript
xhr.setStaticOptions(options);
```

If you do specify options in an API call, it will not ignore global options. This might be useful if all but 1 API call should be authenticated for example.

### Available Options

* `async` (default `true`) - If an API call should be async or not
* `ttl` (default `false`) - Seconds the API response should be cached (only works with `GET()`
* `shouldAuthenticate` (default `false`) - Should the call be made with authentication? BASIC Auth & oAuth supported
* `oAuthToken` - oAuth token. Only works if `shouldAuthenticate` is `true`
* `username` - Username for BASIC authentication. Only works if `shouldAuthenticate` is `true` and `oAuthToken` is not set
* `password` - Password for BASIC authentication. See `username`
* `contentType` (default `application/json`)- contentType for API call.
* `parseJSON` (default `false`) - Should provided data for `POST()` and `PUT()` be stringified and response (for all methods) be parsed.
* `returnXML` (default `false`) - Do you expect XML returned, put this to `true`
* `debug` (default `false`) - Do you want `Ti.API.info` to show API calls made
* `requestHeaders` (default `[]`) - Add custom request headers to the request

For some examples please check out the [examples.js](https://github.com/raulriera/XHR/blob/master/examples.js) file. Or browse around the [xhr.js](https://github.com/raulriera/XHR/blob/master/xhr.js) file. You can find in there support for GET, POST, PUT and DELETE

### requestHeaders property
To add extra, custom, requestHeaders to the http request, you can set an array like this:

```javascript
    xhr.setStaticOptions({
        requestHeaders: [
            {
                key: 'myCustomId',
                value: 'myCustomValue'
            }
        ],
        debug: true
    });
```

This will set the requestHeader like you would do previously:
```js
    xhr.setRequestHeader('myCustomId', 'myCustomValue');
```

## Helpers
Apart from the RESTful way of interacting with your API endpoints, this module also includes the following helper methods:

### clear(url)

* **url**: (required) The URL you want removed from the cache manager

Finds the cached document of the given url (if any) and removes it from the cache manager. This method is useful if you are not satisfied with the results you got at the time.

### clean()
Goes through all the cached documents and delete everything that has been expired (if their TTL timestamp is less than the current time)

This method returns the count of deleted documents

### purge()
Goes through all the documents and deletes everything

This method returns the count of deleted documents

## Backwards Compatibility
Previously `get`, `post`, `put` and `destroy` methods were used. They still work but are deprecated.

## About:
Created by Raul Riera, [@raulriera](http://twitter.com/raulriera)  

Contributions by:

* Daniel Tamas, [@dan_tamas](https://twitter.com/dan_tamas)
* Bob Sims, [@2wheelsburning](https://twitter.com/2wheelsburning)
* Mark Ross [@rossman66](https://github.com/rossman66)
* Rene Pot, [@Wraldpyk](https://twitter.com/wraldpyk)
