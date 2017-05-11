'use strict';

var SteamUser = require('steam-user');
var request = require('request');
var _ = require('lodash');
var async = require('async');
var snakeCaseHelper = require('../helpers/snakeCaseHelper.js')();

var json = require('json-bigint');
JSON.parse = json.parse;
JSON.stringify = json.stringify;

var isSuccess = function (response) {
    return response.statusCode >= 200 && response.statusCode < 300;
}



module.exports = function (config, accountHelper) {
    var service = {};

    var client = new SteamUser();
    var sessionId = null;
    var refreshToken = null;
    var userId = null;

    var ua = config.battlerite.user_agent;

    var sendRefresh = function() {
        if (sessionId && refreshToken && userId) {
            console.log('Sending refresh request');
            var options = {
                url: config.battlerite.protocol + config.battlerite.host + '/auth/refresh/v1',
                headers: ua ? {
                    "User-Agent": ua
                } : {},
                json: {
                    refreshToken: refreshToken,
                    userId: userId
                }
            }
            request.post(options, function (error, response, body) {
                if (error) {
                    console.error(error);
                } else if (isSuccess(response)){
                    refreshToken = body.refreshToken;
                } else {
                    console.error(body.statusCode + ' status code returned for authorization refresh');
                    process.exit(1);
                }
            });
        }
    }

    setInterval(sendRefresh, 1000 * 600);

    if (!sessionId && process.env.NODE_ENV != 'dev') {
        client.logOn(
            config.steam
        );

        client.on('error', function (error) {
            console.error(error);
        });

        client.on('disconnected', function (error) {
            console.log('Disconnected from Steam');
        });

        client.on('loggedOn', function() {
            console.log('Logging on to Steam as user: ' + config.steam.accountName)
            client.getEncryptedAppTicket(504370, new Buffer(0), function (error, steamKey) {
                if (error) {
                    console.error(error)
                } else {
                    console.log('Got Steam Encrypyted App Ticket: ' + steamKey.toString('base64'));
                    var options = {
                        url: config.battlerite.protocol + config.battlerite.host + '/auth/steam-async/v1',
                        headers: ua ? {
                            "User-Agent": ua
                        } : {},
                        json: {
                            key: steamKey.toString('base64')
                        }
                    };

                    request.post(options, function (error, response, body) {
                        if (error) {
                            console.error(error)
                        } else if (isSuccess(response)) {
                            // Need to do this regex parse because... for some reason they return malformed JSON
                            var regex = /{"sessionID":"(\w*)","refreshToken":"(\w*)","timeUntilExpire":(\w*),"userId":(\w*)}/;
                            var matches = regex.exec(body);
                            if (matches) {
                                var jsonBody = JSON.parse(matches[0]);
                                sessionId = jsonBody.sessionID;
                                refreshToken = jsonBody.refreshToken;
                                userId = jsonBody.userId;
                                console.log('Successfully logged into Battlerite with sessionId: ' + sessionId);
                            }
                        } else {
                            console.error(body.statusCode + ' status code returned for authorization request');
                            process.exit(1);
                        }
                    })
                }
            })
        });
    }

    service.getTeamsByAccountIds = function (accountIds, cb) {
        if (sessionId) {
            if (accountIds.length) {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/ranking/teams',
                    headers: ua ? {
                        "User-Agent": ua
                    } : {},
                    authorization: 'Bearer ' + sessionId,
                    json: {
                        users: accountIds,
                        season: config.battlerite.season // TODO eventually get this from the seasons/current endpoint
                    }
                };
                request.post(options, function (error, response, body) {
                    if (error) {
                        console.error(error);
                        cb({code: 500, message: 'Internal server error'});
                    } else if (isSuccess(response)) {
                        // Need to leave this in to cast the IDs to strings
                        _.each(body.teams, function (team) {
                            team.teamID = team.teamID.toString();
                            team.members = _.map(team.members, function (member) {
                                return member.toString();
                            })
                        })
                        snakeCaseHelper.convertCamelKeysToSnake(body.teams);
                        cb(null, {code: 200, message: 'Ok', data: body.teams});
                    } else {
                        console.error(response.statusCode + ' returned for /ranking/teams query for: ' +
                            JSON.stringify(options.json.users))
                        cb({code: 500, message: 'Internal server error'});
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
                        authorization: 'Bearer ' + sessionId,
                    },
                    json: {
                        users: accountIds
                    }
                };

                if (ua) {
                    options.headers['User-Agent'] = ua;
                }

                request.post(options, function (error, response, body) {
                    if (error) {
                        console.error(error());
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        var inventories = _.map(body.inventories, function (inventory) {
                            var stackables = accountHelper.transformIdsToNames(inventory.stackables);
                            stackables.account_id = inventory.userId.toString();
                            return stackables;
                        });
                        cb(null, {code: 200, message: 'Ok', data: inventories});
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_ids' must be an array of strings"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    service.getProfileByAccountIds = function (accountIds, cb) {
        if (sessionId) {
            if (accountIds.length) {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/account/profile/public/v1',
                    headers: {
                        authorization: 'Bearer ' + sessionId
                    },
                    json: {
                        users: accountIds
                    }
                };

                if (ua) {
                    options.headers['User-Agent'] = ua;
                }

                request.post(options, function (error, response, body) {
                    if (error) {
                        cb({code: 500, message: 'Internal server error'});
                    } else {
                        snakeCaseHelper.convertCamelKeysToSnake(body)
                        cb(null, {code: 200, message: 'Ok', data: body.profiles});
                    }
                });
            } else {
                cb({code: 400, message: "Bad request. 'account_ids' must be an array of strings"});
            }
        } else {
            cb({code: 401, message: 'Unauthorized'});
        }
    };

    service.getAccountIdByName = function (accountName, cb) {
        if (sessionId) {
            if (typeof accountName === 'string') {
                var options = {
                    url: config.battlerite.protocol + config.battlerite.host + '/account/profile/id/v1',
                    headers: {
                        'authorization': 'Bearer ' + sessionId
                    },
                    qs: {
                        name: accountName
                    },
                    json: true
                };

                if (ua) {
                    options.headers['User-Agent'] = ua;
                }

                request.get(options, function (error, response, body) {
                    if (error) {
                        console.error(error);
                        cb({code: 500, message: 'Internal server error'});
                    } else if (isSuccess(response)) {
                        if (body.userId) {
                            cb(null, {code: 200, message: 'Ok', data: {id: body.userId}});
                        } else {
                            cb({code: 500, message: 'Internal server error'});
                        }
                    } else {
                        console.error(response.statusCode + ' code returned for ID query for user: ' + accountName);
                        cb({code: 500, message: 'Internal server error'});
                    }
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
