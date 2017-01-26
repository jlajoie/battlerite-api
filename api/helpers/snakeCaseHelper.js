'use strict';

var _ = require('lodash');

module.exports = function() {

    var helper = {};

    helpers.convertCamelStringToSnake = function(string) {
        return string.replace(/([a-z])([A-Z])/g, function(p1, p2, p3) {
            return p2 + '_' + p3
        }).toLowerCase();
    };

    helper.convertCamelKeysToSnake = function (map) {
        if (map) {
            if (typeof map === 'object') {
                _.each(map, function (value, key) {
                    // If the child is an object, we still need to process it
                    if (typeof value === 'object') {
                        helper.convertCamelKeysToSnake(value);
                    }
                    // If the key is a String, it means the object is a map
                    if (typeof key === 'string') {
                        var newKey = helper.convertCamelStringToSnake(key);
                        if (newKey !== key) {
                            map[newKey] = value;
                            delete map[key];
                        }
                    }
                });
            }
        }
    };

    return helper;
};