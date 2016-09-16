// Create the cache manager (a shared object)
var cacheManager = Ti.App.Properties.getObject("cachedXHRDocuments", {});
var storedExtraParams = addDefaultsToOptions({});

XHR = function() {};

// Public functions
// ================

// GET
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.GET = function(url, onSuccess, onError, extraParams) {
    // Create some default params
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};

    if (extraParams) {
        var extraParams = addDefaultsToOptions(extraParams);
    } else {
        var extraParams = storedExtraParams;
    }

    var cache = readCache(url);

    // If there is nothing cached, send the request
    if (cache === false || !extraParams.ttl) {

        var xhr = initXHRRequest('GET', url, extraParams);

        // When the connection was successful
        xhr.onload = function() {
            var result = handleSuccess(xhr, extraParams);
            onSuccess(result);

            // only cache if there is a ttl
            if (extraParams.ttl) {
                writeCache(result.data, url, extraParams.ttl);
            }
        };

        // When there was an error
        xhr.onerror = function(e) {
            onError(handleError(xhr, e));
        };

        xhr.send();

    } else {

        var result = {};
        result.result = "cache";
        result.status = 304;
        // not modified
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
XHR.prototype.POST = function(url, data, onSuccess, onError, extraParams) {

    // Create some default params
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};

    if (extraParams) {
        var extraParams = addDefaultsToOptions(extraParams);
    } else {
        var extraParams = storedExtraParams;
    }

    var xhr = initXHRRequest('POST', url, extraParams);

    // When the connection was successful
    xhr.onload = function() {
        onSuccess(handleSuccess(xhr, extraParams));
    };

    // When there was an error
    xhr.onerror = function(e) {
        // Check the status of this
        onError(handleError(xhr, e));
    };

    xhr.send(extraParams.parseJSON ? JSON.stringify(data) : data);
};

// PUT requests
// @url (string) URL to fetch
// @data (object)
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.PUT = function(url, data, onSuccess, onError, extraParams) {

    // Create some default params
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};

    if (extraParams) {
        var extraParams = addDefaultsToOptions(extraParams);
    } else {
        var extraParams = storedExtraParams;
    }

    var xhr = initXHRRequest('PUT', url, extraParams);

    // When the connection was successful
    xhr.onload = function() {
        onSuccess(handleSuccess(xhr, extraParams));
    };

    // When there was an error
    xhr.onerror = function(e) {
        // Check the status of this
        onError(handleError(xhr, e));
    };

    xhr.send(extraParams.parseJSON ? JSON.stringify(data) : data);
};

// DELETE requests
// @url (string) URL to fetch
// @onSuccess (function) success callback
// @onError (function) error callback
// @extraParams (object)
XHR.prototype.DELETE = function(url, onSuccess, onError, extraParams) {

    // Create some default params
    var onSuccess = onSuccess || function() {};
    var onError = onError || function() {};

    if (extraParams) {
        var extraParams = addDefaultsToOptions(extraParams);
    } else {
        var extraParams = storedExtraParams;
    }

    var xhr = initXHRRequest('DELETE', url, extraParams);

    // When the connection was successful
    xhr.onload = function() {
        onSuccess(handleSuccess(xhr, extraParams));
    };

    // When there was an error
    xhr.onerror = function(e) {
        // Check the status of this
        onError(handleError(xhr, e));
    };

    xhr.send();
};

// backward compatibilty
XHR.prototype.get = XHR.prototype.GET;
XHR.prototype.post = XHR.prototype.POST;
XHR.prototype.put = XHR.prototype.PUT;
XHR.prototype.destroy = XHR.prototype.DELETE;

// Helper functions
// =================

// Removes the cached content of a given URL (this is useful if you are not satisfied with the data returned that time)
XHR.prototype.clear = function(url) {

    if (url) {
        // Hash the URL
        var hashedURL = Titanium.Utils.md5HexDigest(url);
        // Check if the file exists in the manager
        var cache = cacheManager[hashedURL];

        // If the file was found
        if (cache) {
            // Delete references and file
            var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);
            // Delete the record and file
            delete cacheManager[hashedURL];
            file.deleteFile();

            // Update the cache manager
            updateCacheManager();
        }
    }

};

// Removes all the expired documents from the manager and the file system
XHR.prototype.clean = function() {

    var nowInMilliseconds = new Date().getTime();
    var expiredDocuments = 0;

    for (var key in cacheManager) {
        var cache = cacheManager[key];

        if (cache.timestamp <= nowInMilliseconds) {
            // Delete references and file
            var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, key);
            // Delete the record and file
            delete cacheManager[key];
            file.deleteFile();

            // Update the cache manager
            updateCacheManager();

            // Update the deleted documents count
            expiredDocuments = expiredDocuments + 1;
        }

    }

    // Return the number of files deleted
    return expiredDocuments;
};

// Removes all documents from the manager and the file system
XHR.prototype.purge = function() {

    var purgedDocuments = 0;

    for (var key in cacheManager) {
        var cache = cacheManager[key];
        // Delete references and file
        var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, key);
        // Delete the record and file
        delete cacheManager[key];
        file.deleteFile();

        // Update the cache manager
        updateCacheManager();

        // Update the deleted documents count
        purgedDocuments = purgedDocuments + 1;
    }

    // Return the number of files deleted
    return purgedDocuments;
};

XHR.prototype.setStaticOptions = function(params) {
    var params = addDefaultsToOptions(params);
    storedExtraParams = params;

};

// Private Helper Functions
// ========================
function addDefaultsToOptions(providedParams) {
    var extraParams = providedParams || {};
    extraParams.async = (extraParams.hasOwnProperty('async')) ? extraParams.async : true;
    extraParams.ttl = (extraParams.hasOwnProperty('ttl')) ? extraParams.ttl : false;
    extraParams.shouldAuthenticate = extraParams.shouldAuthenticate || false;
    extraParams.contentType = extraParams.contentType || "application/json";
    extraParams.parseJSON = (extraParams.hasOwnProperty('parseJSON')) ? extraParams.parseJSON : false;
    extraParams.returnXML = (extraParams.hasOwnProperty('returnXML')) ? extraParams.returnXML : false;
    extraParams.debug = (extraParams.hasOwnProperty('debug')) ? extraParams.debug : false;
    return extraParams;
}

// Return a standardized response
function handleSuccess(xhr, extraParams) {
    var result = {};
    result.result = "success";
    result.status = xhr.status;

    /**
     * Check if the response is XML, if not try to parse JSON (if that was requested)
     * As a final catch, when that fails too, return the data that was received;
     * xhr.responseXML is null by default unless the response actually is XML
     */
    try {
        if (extraParams.returnXML && xhr.responseXML) {
            result.data = xhr.responseXML;
        } else {
            result.data = extraParams.parseJSON ? JSON.parse(xhr.responseText) : xhr.responseText;
        }
    } catch(e) {
        result.data = xhr.responseData;
    }

    return result;
}

// Return a standardized response
function handleError(xhr, error) {
    var result = {};
    result.result = "error";
    result.status = xhr.status;
    result.error = error.error;
    result.data = xhr.responseData;
    return result;
}

function initXHRRequest(method, url, extraParams) {
    // Create the HTTP connection
    var xhr = Titanium.Network.createHTTPClient({
        enableKeepAlive : false
    });

    // Open the HTTP connection
    xhr.open(method, url, extraParams.async);
    xhr.setRequestHeader('Content-Type', extraParams.contentType);

    if (extraParams.debug) {
        Ti.API.info(method + ': ' + url);
    }

    // If we need to authenticate
    if (extraParams.shouldAuthenticate) {
        if (extraParams.oAuthToken) {
            var authstr = 'Bearer ' + extraParams.oAuthToken;
        } else {
            var authstr = 'Basic ' + Titanium.Utils.base64encode(extraParams.username + ':' + extraParams.password);
        }
        xhr.setRequestHeader('Authorization', authstr);
    }
    return xhr;
}

// Private functions
// =================
function readCache(url) {
    // Hash the URL
    var hashedURL = Titanium.Utils.md5HexDigest(url);

    // Check if the file exists in the manager
    var cache = cacheManager[hashedURL];
    // Default the return value to false
    var result = false;

    //Titanium.API.info("CHECKING CACHE");

    // If the file was found
    if (cache) {
        // Fetch a reference to the cache file
        var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);

        // Check that the TTL is further than the current date
        if (cache.timestamp >= new Date().getTime()) {
            //Titanium.API.info("CACHE FOUND");

            // Return the content of the file
            result = file.read();

        } else {
            //Titanium.API.info("OLD CACHE");

            // Delete the record and file
            delete cacheManager[hashedURL];
            file.deleteFile();

            // Update the cache manager
            updateCacheManager();
        }
    } else {
        //Titanium.API.info("CACHE " + hashedURL + " NOT FOUND");
    }

    return result;
};

function updateCacheManager() {
    Titanium.App.Properties.setObject("cachedXHRDocuments", cacheManager);
};

function writeCache(data, url, ttl) {

    //Titanium.API.info("WRITING CACHE");

    // hash the url
    var hashedURL = Titanium.Utils.md5HexDigest(url);

    // Write the file to the disk
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, hashedURL);

    // Write the file to the disk
    // TODO: There appears to be a bug in Titanium and makes the method
    // below always return false when dealing with binary files
    file.write(data);

    // Insert the cached object in the cache manager
    cacheManager[hashedURL] = {
        "timestamp" : (new Date().getTime()) + (ttl * 60 * 1000)
    };
    updateCacheManager();

    //Titanium.API.info("WROTE CACHE");
};

// Return everything
module.exports = XHR; 
