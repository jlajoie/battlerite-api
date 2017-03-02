'use strict';

var config = require('./config/index'),
    app = require('./app');

var db = require('./db')(config, function(err, res) {
    if (err) {
        console.error(err);
    } else {
        app(config, db);
    }
});
