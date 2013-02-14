// Include the taffy library
Ti.taffy = require('/lib/ti.taffydb').taffyDb;

// Create the cache manager (a shared object)
var cacheManager = Ti.taffy();

XHR = function(){
	// Init the DB
	if (cacheManager.exists("cache")) {
		cacheManager.open("cache");
	}
	
};

// Public functions
// ================

// GET 
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object) 
XHR.prototype.get = function(url, onSuccess, onError, extraParams) {
	// Debug
	// Titanium.API.info(url);
	
	// Create some default params
	var onSuccess = onSuccess || function(){};
	var onError = onError || function(){};
	var extraParams = extraParams || {};
	extraParams.async = extraParams.async || true;
	extraParams.ttl = extraParams.ttl || false; 
	extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false; // if you set this to true, pass "username" and "password" as well
	extraParams.contentType = extraParams.contentType || "application/json";
		
	var cache = readCache(url);
	// If there is nothing cached, send the request
	if (!extraParams.ttl || cache == 0) {
		
		// Create the HTTP connection
		var xhr = Titanium.Network.createHTTPClient({
			enableKeepAlive: false
		});
		// Create the result object
		var result = {};
	
		// Open the HTTP connection
		xhr.open("GET", url, extraParams.async);
		xhr.setRequestHeader('Content-Type', extraParams.contentType);

		// If we need to authenticate
		if (extraParams.shouldAuthenticate) {
			var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password); 
			xhr.setRequestHeader('Authorization', authstr);
		}
	
		// When the connection was successful
		xhr.onload = function() {
			// Check the status of this
			result.status = xhr.status == 200 ? "ok" : xhr.status;
			result.data = xhr.responseText;
		
			onSuccess(result);
		
			// Cache this response
			writeCache(result.data, url, extraParams.ttl);
		};
	
		// When there was an error
		xhr.onerror = function(e) {
			// Check the status of this
			result.status = "error";
			result.data = e;
			result.code = xhr.status;
			onError(result);
		};

		xhr.send();
	} else {
		var result = {};

		result.status = "cache";
		result.data = cache;
		
		onSuccess(result);
	}
	
};

// POST requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.post = function(url, data, onSuccess, onError, extraParams) {
	
	// Debug
	Titanium.API.info(url + " " + JSON.stringify(data));
	
	// Create some default params
	var onSuccess = onSuccess || function(){};
	var onError = onError || function(){};
	var extraParams = extraParams || {};
	extraParams.async = extraParams.async || true;
	extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false; // if you set this to true, pass "username" and "password" as well
	extraParams.contentType = extraParams.contentType || "application/json";
	
	// Create the HTTP connection
	var xhr = Titanium.Network.createHTTPClient({
		enableKeepAlive: false
	});
	// Create the result object
	var result = {};
	
	// Open the HTTP connection
	xhr.open("POST", url, extraParams.async);
	xhr.setRequestHeader('Content-Type', extraParams.contentType);
	
	// If we need to authenticate
	if (extraParams.shouldAuthenticate) {
		var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password); 
		xhr.setRequestHeader('Authorization', authstr);
	}
	
	// When the connection was successful
	xhr.onload = function() {
		// Check the status of this
		result.status = xhr.status == 200 ? "ok" : xhr.status;
		result.data = xhr.responseText;
		
		onSuccess(result);
	};
	
	// When there was an error
	xhr.onerror = function(e) {
		// Check the status of this		
		result.status = "error";
		result.data = e.error;
		result.code = xhr.status;
		onError(result);
	};
	
	xhr.send(data);
};

// PUT requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.put = function(url, data, onSuccess, onError, extraParams) {
	// Create some default params
	var onSuccess = onSuccess || function(){};
	var onError = onError || function(){};
	var extraParams = extraParams || {};
	extraParams.async = extraParams.async || true;
	extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false; // if you set this to true, pass "username" and "password" as well
	extraParams.contentType = extraParams.contentType || "application/json";
	
	// Create the HTTP connection
	var xhr = Titanium.Network.createHTTPClient({
		enableKeepAlive: false
	});
	// Create the result object
	var result = {};
	
	// Open the HTTP connection
	xhr.open("PUT", url, extraParams.async);
	xhr.setRequestHeader('Content-Type', extraParams.contentType);
	
	// If we need to authenticate
	if (extraParams.shouldAuthenticate) {
		var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password); 
		xhr.setRequestHeader('Authorization', authstr);
	}
	
	// When the connection was successful
	xhr.onload = function() {
		// Check the status of this
		result.status = xhr.status == 200 ? "ok" : xhr.status;
		result.data = xhr.responseText;
		
		onSuccess(result);
	};
	
	// When there was an error
	xhr.onerror = function(e) {
		// Check the status of this
		result.status = "error";
		result.data = e.error;
		result.code = xhr.status;
		onError(result);
	};
	
	xhr.send(data);
};

// DELETE requests
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.destroy = function(url, onSuccess, onError, extraParams) {
	// Create some default params
	var onSuccess = onSuccess || function(){};
	var onError = onError || function(){};
	var extraParams = extraParams || {};
	extraParams.async = extraParams.async || true;
	extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false; // if you set this to true, pass "username" and "password" as well
	extraParams.contentType = extraParams.contentType || "application/json";
	
	// Create the HTTP connection
	var xhr = Titanium.Network.createHTTPClient({
		enableKeepAlive: false
	});
	// Create the result object
	var result = {};
	
	// Open the HTTP connection
	xhr.open("DELETE", url, extraParams.async);
	xhr.setRequestHeader('Content-Type', extraParams.contentType);
	
	// If we need to authenticate
	if (extraParams.shouldAuthenticate) {
		var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password); 
		xhr.setRequestHeader('Authorization', authstr);
	}
	
	// When the connection was successful
	xhr.onload = function() {
		// Check the status of this
		result.status = xhr.status == 200 ? "ok" : xhr.status;
		result.data = xhr.responseText;
		
		onSuccess(result);
	};
	
	// When there was an error
	xhr.onerror = function(e) {
		// Check the status of this
		result.status = "error";
		result.data = e.error;
		result.code = xhr.status;
		onError(result);
	};
	
	xhr.send();
};


// Private functions
// =================

readCache = function(url) {
	// Hash the URL
	var hashedURL = Titanium.Utils.md5HexDigest(url);
	
	// Check if the file exists in the manager (append the .dat extension?)
	var cache = cacheManager( { "file": hashedURL } ).first();
	// Default the return value to false
	var result = false;
	
	//Titanium.API.info("CHECKING CACHE");
	
	// If the file was found
	if (cache != 0) {
		// Fetch a reference to the cache file
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cache.file);
				
		// Check that the TTL is further than the current date
		if (cache.timestamp >= new Date().getTime()) {
			//Titanium.API.info("CACHE FOUND");

			// Return the content of the file
			result = file.read();

		} else {
			//Titanium.API.info("OLD CACHE");

			// Delete the record and file
			cacheManager(cache).remove();
			file.deleteFile();	
			
			cacheManager.save();		
		}
	} else {
		//Titanium.API.info("NO CACHE FOUND");
	}
		
	return result;
};

writeCache = function(data, url, ttl) {
		
	//Titanium.API.info("WRITING CACHE");

	// hash the url
	var hashedURL = Titanium.Utils.md5HexDigest(url);
		
	// Write the file to the disk
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);
	
	// If the file was saved without any problems
	if (file.write(data)) {
		// Insert the cached object in the cache manager
		cacheManager.insert( { "file": hashedURL, "timestamp": (new Date().getTime()) + (ttl*60*1000) });
		cacheManager.save("cache");
		//Titanium.API.info("WROTE CACHE");
	}
	
};

XHR.prototype.clearCache = function() {
	// Search for all timestamps lower than "right now"
	var cachedDocuments = cacheManager({ "timestamp":{lte: new Date().getTime()}}).get();
	var cachedDocumentsCount = cachedDocuments.length;
		
	if (cachedDocumentsCount > 0) {
		for (var i = 0; i <= cachedDocumentsCount-1; i++) {
			
			// Delete references and file
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, cachedDocuments[i].file);
			cacheManager(cachedDocuments[i].file).remove();
			file.deleteFile();
			
			//Titanium.API.info("REMOVED CACHE FILE " + cachedDocuments[i].file);
		}
		
		cacheManager.save();
	}
	
	// Return the number of files deleted
	return cachedDocumentsCount;	
};

XHR.prototype.paramsToQueryString = function(formdata, numeric_prefix, arg_separator) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   improved by: Michael White (http://getsprink.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +    revised by: stag019
    // +   input by: Dreamer
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
    // %        note 1: If the value is null, key and value is skipped in http_build_query of PHP. But, phpjs is not.
    // -    depends on: urlencode
    // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
    // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
    // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
    // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
    var value, key, tmp = [],
        that = this;

    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }
        if (val != null) {
            if(typeof(val) === "object") {
                for (k in val) {
                    if (val[k] != null) {
                        tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                    }
                }
                return tmp.join(arg_separator);
            } else if (typeof(val) !== "function") {
                return Ti.Network.encodeURIComponent(key) + "=" + Ti.Network.encodeURIComponent(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    };

    if (!arg_separator) {
        arg_separator = "&";
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
        var query=_http_build_query_helper(key, value, arg_separator);
        if(query != '') {
            tmp.push(query);
        }
    }

    return tmp.join(arg_separator);
};

// Return everything
module.exports = XHR;