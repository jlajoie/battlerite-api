'use strict';

var express = require('express'),
    routes = require('./routes'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

module.exports = function(config) {

    var app = express();

    app.use(cors());

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(methodOverride('X-HTTP-Method-Override'));
    routes(app, config);

    app.listen(config.port, function() {
        console.dir('API started on port: ' + config.port)
    });

    return app
};
