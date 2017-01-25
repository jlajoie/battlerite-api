'use strict';

var _ = require('lodash');

module.exports = function() {

    var helper = {};

    helper.convertKeysToSnakeCase = function(map) {
        var queue = [];
        queue.push(map);
        while (queue.length > 0) {
            _.each(queue.shift(), function(value, key) {
                var newKey = convertStringToSnakeCase(key);
                map[newKey] = value;
                // TODO shit hits the fan when this is an array... dont worry about members for now
                if (typeof value === 'object' && key !== 'members') {
                    queue.push(value);
                }
                if (key !== newKey) {
                    delete map[key];
                }
            });

        }
        return map;
    };

    var convertStringToSnakeCase = function(string) {
        var snakeCaseString = '';
        var firstIteration = true;
        var previousWasUpperCase = false;
        _.each(string, function (char) {
            var asciiChar = char.charCodeAt(0);
            if (65 <= asciiChar && asciiChar <= 90) {
                if (firstIteration || previousWasUpperCase) {
                    snakeCaseString += char.toLowerCase();
                } else {
                    snakeCaseString += '_' + char.toLowerCase();
                }
                previousWasUpperCase = true;
            } else {
                snakeCaseString += char;
                previousWasUpperCase = false;
            }
            firstIteration = false;
        });
        return snakeCaseString;
    };

    return helper;
};