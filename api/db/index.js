'use strict';

var orm = require('orm');

var connection = null;

function setup(db) {
    require('./models/account')(orm, db);
    require('./models/team')(orm, db);
};

module.exports = function (config, cb) {
    if (connection) {
        cb(null, connection);
    } else {
        orm.connect(config.postgres.jdbc, function (err, db) {
            if (err) {
                cb(err);
            } else {
                connection = db
                db.settings.set('instance.returnAllErrors', true);
                setup(db);
                db.sync(function(err) {
                    console.log('sync callback');
                    if (err) {
                        console.error('sync error');
                        cb (err);
                    } else {
                        console.log('sync success');
                        cb(null);
                    }
                });
            }
        });
    }
};
