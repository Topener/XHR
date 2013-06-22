var XHR = require("/xhr");
var xhr = new XHR();

// Normal plain old request without caching
xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback);

// Normal plain old request with a 5mins caching
xhr.get("http://freegeoip.net/json/", onSuccessCallback, onErrorCallback, { ttl: 5 });

// Request a remote image with 60 mins caching
// note that I am passing the contentType as an image, this tells the library to
// respond with binary content instead of plain text
xhr.get("http://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png", onImageSuccess, onErrorCallback, { ttl: 60, contentType: "image/png" });

function onSuccessCallback(e) {
	// Handle your request in here
	// the module will return an object with two properties
	// data (the actual data retuned
	// status ('ok' for normal requests and 'cache' for requests cached
	Titanium.API.info(JSON.parse(e));
};

function onImageSuccess(e) {
	// Assign the image blob located in e.data directly to an image view
};

function onErrorCallback(e) {
	// Handle your errors in here
};