'use strict';

var _ = require('lodash');

module.exports = function() {

    var helper = {};

    helper.convertCamelStringToSnake = function(string) {
        // Only recase ID for now until we encounter other poorly cased acronyms
        // Also make sure the first character is lower case
        return string.substr(0, 1).toLowerCase() + string.substr(1, string.length)
            .replace('ID', 'Id')
            .replace(/([A-Z])/g, function(p1, p2) {
                return '_' + p1
            }
        ).toLowerCase();
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
