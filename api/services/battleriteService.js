'use strict';

var SteamUser = require('steam-user');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var snakeCaseHelper = require('../helpers/snakeCaseHelper.js')();

module.exports = function (config, accountHelper) {
    var service = {};

    var client = new SteamUser();
    var sessionId = null;

    if (!sessionId && process.env.NODE_ENV != 'dev') {
        console.log('no session id');
        client.logOn(
            config.steam
        );

        client.on('error', function (error) {
            console.log('error');
            console.error(error);
        });

        client.on('disconnected', function (error) {
            console.log('disconnected');
        });

        client.on('LogonSessionReplaced', function(){console.log('here')});

        client.on('loggedOn', function() {
            console.log('Logging on to steam as user: ' + config.steam.accountName)
            client.getEncryptedAppTicket(504370, new Buffer(0), function (error, steamKey) {
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

    service.getTeamsByAccountIds = function (accountIds, cb) {
        if (sessionId) {
            if (typeof accountId === 'string') {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/ranking/teams',
                    authorization: 'Bearer ' + sessionId,
                    json: {
                        users: accountIds,
                        season: config.battlerite.season // TODO eventually get this from the seasons/current endpoint
                    }
                };
                request.post(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        cb(null, body.Teams);
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_ids' must be an array of strings"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    service.getAccountsByAccountIds = function (accountIds, cb) {
        if (sessionId) {
            if (accountIds.length) {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/account/public/v1',
                    headers: {
                        authorization: 'Bearer ' + sessionId
                    },
                    json: {
                        users: accountIds
                    }
                };
                request.post(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        var inventories = _.map(body.inventories, function (inventory) {
                            var stackables = accountHelper.transformIdsToNames(inventory.stackables);
                            stackables.account_id = inventory.userId;

                            return stackables;
                        });
                        cb(null, inventories);
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_ids' must be an array of strings"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    // service.getAccountInfoByIds = function (accountIds, cb) {
    //     async.parallel([
    //         function (parallelCb) {
    //             service.getAccountsByAccountIds(accountIds, function (err, res) {
    //                 if (err) {
    //                     parallelCb(err);
    //                 } else {
    //                     parallelCb(res);
    //                 }
    //             });
    //         },
    //         function (parallelCb) {
    //             service.getTeamsByAccountIds(accountIds, function (err, res) {
    //                 if (err) {
    //                     parallelCb(err);
    //                 } else {
    //                     parallelCb(res);
    //                 }
    //             });
    //         }
    //     ], function (err, res) {
    //         if (err) {
    //             cb(err);
    //         } else {
    //             console.dir(JSON.stringify(res[0]));
    //             console.dir(JSON.stringify(res[1]));
    //             // res[0] accounts, res[1] teams
    //             // do transforms in here, save this shit afterward
    //             cb(res);
    //         }
    //     });
    // }

    // service.getAccountId = function (accountName, cb) {
    //     if (sessionId) {
    //         if (typeof accountName === 'string') {
    //             var options = {
    //                 url: config.battlerite.protocol + config.battlerite.host + '/account/profile/id/v1',
    //                 headers: {
    //                     authorization: 'Bearer ' + sessionId
    //                 },
    //                 qs: {
    //                     name: accountName
    //                 }
    //             };
    //             request.get(options, function (error, response, body) {
    //                 if (error) {
    //                     cb({code: 500, message: 'Internal server error'});
    //                 }
    //                 // TODO receives a JSON string in this request
    //                 cb(null, {code: 200, message: 'Ok', data: snakeCaseHelper.convertCamelKeysToSnake(JSON.parse(body))});
    //             });
    //         } else {
    //             cb({code: 400, message: "Bad request. 'name' must be of type 'string', was of type '" + typeof accountName + "'"});
    //         }
    //     } else {
    //         cb({code: 401, message: 'Unauthorized'});
    //     }
    // };

    return service;
};
