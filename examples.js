var XHR = require("/xhr");
var xhr = new XHR();

// Normal plain old request without caching
xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback);

// Normal plain old request with a 5mins caching
xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, { ttl: 5 });

function onSuccessCallback(e) {
	// Handle your request in here
	// the module will return an object with two properties
	// data (the actual data retuned
	// status ('ok' for normal requests and 'cache' for requests cached
	Titanium.API.info(JSON.parse(e));
};

function onErrorCallback(e) {
	// Handle your errors in here
};