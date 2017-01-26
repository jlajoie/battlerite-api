'use strict';

var SteamUser = require('steam-user');
var request = require('request');
var _ = require('lodash');
var snakeCaseHelper = require('../helpers/snakeCaseHelper.js')();

module.exports = function (config) {
    var service = {};

    var client = new SteamUser();
    var sessionId = null;

    if (!sessionId) {
        client.logOn(
            config.steam
        );

        client.on('error', function (error) {
            console.error(error);
        });

        client.on('LogonSessionReplaced', function(){console.log('here')});

        client.on('loggedOn', function() {
            client.getEncryptedAppTicket(504370, new Buffer(''), function (error, steamKey) {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Got Steam Encrypyted App Ticket: ' + steamKey.toString('base64'));
                    var options = {
                        url: config.battlerite.protocol + config.battlerite.host + '/auth/steam-async/v1',
                        json: {
                            key: steamKey.toString('base64') // convert the response to base64
                        }
                    };

                    request.post(options, function (error, response, body) {
                        if (error) {
                            console.error(error)
                        } else {
                            // Need to do this regex parse because... for some reason they return malformed JSON
                            var regex = /{"sessionID":"(\w*)","refreshToken":"(\w*)","timeUntilExpire":(\w*),"userId":(\w*)}/;
                            var matches = regex.exec(body);
                            var jsonBody = JSON.parse(matches[0]);
                            sessionId = jsonBody.sessionID;
                            console.log('Successfully logged into Battlerite with sessionId: ' + sessionId);
                        }
                    })
                }
            })
        });
    }

    service.getTeam = function (accountId, cb) {
        if (sessionId) {
            if (typeof accountId === 'string') {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/ranking/teams',
                    authorization: 'Bearer ' + sessionId,
                    json: {
                        users: [accountId],
                        season: config.battlerite.season // TODO eventually get this from the seasons/current endpoint
                    }
                };
                request.post(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        _.map(body.teams, function(team) { // TODO desperately will need to be parsed more appropriately
                            return snakeCaseHelper.convertCamelKeysToSnake(team);
                        });
                        cb(null, {code: 200, message: 'Ok', data: body.teams});
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_id' must be of type 'string', was of type '" + typeof accountId + "'"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    service.getAccount = function (accountId, cb) {
        if (sessionId) {
            if (typeof accountId === 'string') {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/account/profile/public/v1',
                    authorization: 'Bearer ' + sessionId,
                    json: {
                        users: [
                            accountId
                        ]
                    }
                };
                request.post(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        // TODO will be able to be multiple accounts, don't just reference [0]
                        cb(null, {code: 200, message: 'Ok', data: snakeCaseHelper.convertCamelKeysToSnake(body.profiles[0])});
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_id' must be of type 'string', was of type '" + typeof accountId + "'"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    service.getAccountId = function (accountName, cb) {
        if (sessionId) {
            if (typeof accountName === 'string') {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/account/profile/id/v1',
                    headers: {
                        authorization: 'Bearer ' + sessionId
                    },
                    qs: {
                        name: accountName
                    }
                };
                request.get(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    }
                    // TODO receives a JSON string in this request
                    cb(null, {code: 200, message: 'Ok', data: snakeCaseHelper.convertCamelKeysToSnake(JSON.parse(body))});
                });
            } else {
                cb({code: 400, message: "Bad request. 'name' must be of type 'string', was of type '" + typeof accountName + "'"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    return service;
};
