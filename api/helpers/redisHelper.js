'use strict';

var redis = require('redis');
var _ = require('lodash');

module.exports = function (config) {
    var client = redis.createClient(config.redis);

    var helper = {};

    helper.getList = function (ids, prefix, cb) {
        if (ids.length > 0) {
            console.dir(ids);
            var multiCommand = [];
            _.each(ids, function (id) {
                multiCommand.push(['GET', prefix + '_' + id]);
            });

            client.multi(multiCommand).exec(function (err, res) {
                if (err) {
                    cb(err);
                } else {
                    console.dir(res);
                    res = _.map(
                        _.filter(res, function(element) {
                            return element !== null;
                        }), function (element) {
                            return JSON.parse(element);
                        }
                    );
                    if (res.length == 1) {
                        cb(null, res[0]);
                    } else if (res.length > 1) {
                        cb(null, res);
                    } else {
                        cb(null, []);
                    }
                }
            });
        } else {
            cb(null, []);
        }
    };

    helper.getAccountId = function (accountName, cb) {
        client.get(accountId, function (err, id) {
            if (err) {
                cb(err);
            } else {
                console.dir(id);
                cb(null, id);
            }
        });
    };

    return helper;
};
