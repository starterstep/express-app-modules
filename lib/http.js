var _ = require('underscore');
var Emitter = require('events');
var querystring = require('querystring');
var superagent = require('superagent');

var $ = module.exports = _.extend(new Emitter(), {
    baseUrl: '',
    timeout:120000
});

var auth;
var persistentHeaders;

var responseSuccess = function(response, options, callback) {
    $.emit('response', options);
    var cookie = response.headers["set-cookie"];
    if(cookie){
        $.emit('cookie', cookie);
    }
    try {
        var json = JSON.parse(response.text);
    } catch(e) {
        json = {};
    }

    return callback(null,json);
};

var handleNetworkResponse = function(err, request, response, options, callback) {
    console.log('!!!!RESPONSE err='+err);
    if (err && !response) {
        $.emit('error', err);
        return callback(err);
    }
    console.log('!!!!RESPONSE text=' + (response.text.length > 10000 ? response.text.slice(0, 10000) + '...<SLICED>' : response.text));
    console.log('!!!!RESPONSE status=' + response.status);
    console.log('!!!!RESPONSE headers = ', response.headers);
    if (!(response.status >= 200 && response.status <= 299)) {
        try {
            var json = JSON.parse(response.text);
        } catch(e) {}
        if (response.status===0) {
            $.emit('timeout');
        } else if (response.status===426) {
            $.emit('upgrade-required', response.header['x-upgrade-url']);
        } else if (response.status===400) {
            $.emit('bad-request', json);
        } else if (response.status===401) {
            $.emit('unauthorized', json);
        } else {
            $.emit('error', response, json);
        }
        return callback(response);
    }
    return responseSuccess(response, options, callback);
};

$.request = function(request, options, callback) {
    console.log('!!!!CALLING '+request.method+ ' '+request.url);
    //console.log('!!!request.header = '+JSON.stringify(request.header));
    if (!$.isOnline()) {
        $.emit('offline');
        return callback({});
    }
    request.timeout(options.timeout || $.timeout);
    request.set('Accept', 'application/json');

    if (auth) {
        request.set('Authorization', 'Basic '+auth);
    }

    if (persistentHeaders) {
        request.set(persistentHeaders);
    }

    if (options.headers) {
        request.set(options.headers);
    }

    if (options.type !== undefined) {
        request.type(options.type);
    }

    $.emit('request', options);
    request.on('abort', function() {
        $.emit('timeout');
    });
    request.end(function(err, response) {
        request.clearTimeout();
        handleNetworkResponse(err, request, response, options, callback);
    });
};

$.get = function(options,callback) {
    var qs = '?' + querystring.stringify(options.data);
    $.request(superagent.get($.baseUrl+options.path+(qs.length > 1 ? qs : '')), options, callback);
};

$.put = function(options,callback) {
    options.data = options.data || {};
    console.log('!!!PUTTING DATA=' + JSON.stringify(options.data));
    $.request(superagent.put($.baseUrl+options.path).send(options.data), options, callback);
};

$.post = function(options,callback) {
    options.data = options.data || {};
    console.log('!!!POSTING DATA=' + JSON.stringify(options.data));
    $.request(superagent.post($.baseUrl+options.path).send(options.data), options, callback);
};

$.del = function(options,callback) {
    $.request(superagent.del($.baseUrl+options.path), options, callback);
};

$.basicAuth = function(value) {
    auth = value ? new Buffer(value).toString('base64') : null;
};

$.persistentHeaders = function(headers) {
    persistentHeaders = persistentHeaders || {};

    if (headers) {
        _.extend(persistentHeaders, headers);
    }

    return persistentHeaders;
};

$.isNative = function() {
    return typeof Titanium !== 'undefined';
};

$.isOnline = function() {
    return $.isNative() ? Ti.Network.online : true;
};
