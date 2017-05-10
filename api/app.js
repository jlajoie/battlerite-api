'use strict';

var express = require('express'),
    routes = require('./routes'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function(config) {
    var app = express();

    app.use(cors());

    // Override logger to include timestamp and parseable format
    var log = console.log;
    console.log = function (body) {
        log('[ts=' + new Date().toISOString() + ']' + '[message=' + body + ']');
    };

    // Overrride defaut JSON.parse due to SLS bigints not as string
    var json = require('json-bigint');
    JSON.parse = json.parse;
    JSON.stringify = json.stringify;

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(methodOverride('X-HTTP-Method-Override'));
    routes(app, config);

    app.listen(config.port, function() {
        console.log('API started on port: ' + config.port)
    });

    return app
};
