'use strict';

var _ = require('lodash');

var snakeCaseHelper = require('./snakeCaseHelper.js')();

var characterMap = require('./resources/characterStackables.js')();
var stackableMap = require('./resources/stackables.js');

module.exports = function () {
    var helper = {};

    var findStackableNameById = function (id) {
        var stackable = _.find(stackableMap.Stackables, function (stackable) {
            return stackable.StartId === id && stackable.EndId === id;
        });

        if (stackable) {
            return stackable.Name;
        } else {
            return characterMap[id] || null;
        }
    };

    var getRangedStackables = function () {
        return _.filter(stackableMap.Stackables, function (stackable) {
            return stackable.StartId != stackable.EndId;
        })
    };

    helper.transformIdsToNames = function (stackables) {
        var mappedStackables = {};

        _.each(stackables, function (stackable) {
            var name = findStackableNameById(stackable.type);
            if (name) {
                mappedStackables[name] = stackable.amount;
            }
        });

        snakeCaseHelper.convertCamelKeysToSnake(mappedStackables);

        return mappedStackables;
    };

    helper.transformPgToJson = function(account) {
        return {
            id: account.account_id,
            name: account.name,
            league: 'league',
            division: 'division',
            rating: 'rating',
            characters: {

            }
        }
    }

    return helper;
};
