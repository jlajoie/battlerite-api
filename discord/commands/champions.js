'use strict';

var _ = require('lodash');
var request = require('request');

var config = require('../config');
var leagues = require('../resources/leagues.js');

var isSuccess = function (response) {
    return response.statusCode >= 200 && response.statusCode < 300;
}

var getOrderedTotalGamesPlayed = function (account) {
    var champions = [
        'lucie',
        'sirius',
        'iva',
        'jade',
        'ruh_kaan',
        'oldur',
        'ashka',
        'varesh',
        'pearl',
        'taya',
        'poloma',
        'croak',
        'freya',
        'jumong',
        'shifu',
        'ezmo',
        'bakko',
        'rook',
        'pestilus',
        'raigon',
	'blossom',
	'thorn'
    ];

    return champions.sort(function (a, b) {
        var aTotal = (account[a + '_wins'] || 0) + (account[a + '_losses'] || 0);
        var bTotal = (account[b + '_wins'] || 0) + (account[b + '_losses'] || 0);
        if (aTotal < bTotal) {
            return 1;
        } else if (aTotal > bTotal) {
            return -1;
        } else {
            return 0;
        }
    });
}

module.exports = function (name, cb) {
    // TODO duplication of ids/:name endpoint here, should move to common
    var options = {
        url: config.api.protocol + config.api.host + '/api/v1/ids/' + encodeURIComponent(name),
        json: true
    }
    request.get(options, function (err, idRes, idBody) {
        if (err) {
            console.error(err);
            cb(new Error('Internal error querying IDs for: ' + name));
        } else if (isSuccess(idRes)) {
            var options = {
                url: config.api.protocol + config.api.host + '/api/v1/accounts',
                json: {
                    account_ids: [idBody.data.id]
                }
            };
            request.post(options, function (err, accountRes, accountBody) {
                if (err) {
                    console.error(err);
                    cb(new Error('Internal error querying accounts for: ' + JSON.stringify(options.json.account_ids)));
                } else if (isSuccess(accountRes)) {
                    if (accountBody.data.length == 1) {
                        // modify last number for shown champs
                        var champions = getOrderedTotalGamesPlayed(accountBody.data[0]).slice(0, 3);
                        var totalGamesPlayed = accountBody.data[0].wins + accountBody.data[0].losses;
                        var mostPlayed = {};
                        _.each(champions, function (champion) {
                            var wins = accountBody.data[0][champion + '_wins'];
                            var losses = accountBody.data[0][champion + '_losses'];
                            if ((wins + losses) > 0) {
                                mostPlayed[champion] = {
                                    wins: wins,
                                    losses: losses,
                                    win_percentage: ((wins / (wins + losses)) * 100).toString().substring(0, 6),
                                    play_percentage: (((wins + losses) / (totalGamesPlayed)) * 100).toString().substring(0, 6),
                                }
                            }
                        });
                        cb(null, {
                            id: idBody.data.id,
                            name: name,
                            champions: mostPlayed
                        });
                    } else {
                        cb(new Error(solo.length + ' elements found for user query, expected 1'));
                    }
                } else {
                    cb(new Error(accountBody.statusCode + ' response code returned for accounts query for user: ' + idBody.data.id));
                }
            });
        } else {
            cb(new Error(idRes.statusCode + ' code returned for ID query for: ' + name));
        }
    });
};

