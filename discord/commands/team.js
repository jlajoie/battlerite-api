'use strict';

var _ = require('lodash');
var request = require('request');

var config = require('../config');
var common = require('./common.js');
var leagues = require('../resources/leagues.js');

var isSuccess = function (response) {
    return response.statusCode >= 200 && response.statusCode < 300;
}

module.exports = function (name, teamSize, cb) {
    common(name, function (err, id, teams) {
        if (err) {
            cb(err);
        } else {
            var filteredTeams = _.filter(teams, function (team) {
                return team.members.length == teamSize && (team.wins > 0 || team.losses > 0);
            }).sort(function (a, b) {
                // Shitty to help rank teams
                return (
                    ((b.league * 1000) + ((10 - b.division) * 100) + b.division_rating) -
                    ((a.league * 1000) + ((10 - a.division) * 100) + a.division_rating)
                );
            }).slice(0, 3);
            if (filteredTeams.length > 0) {
                // Get all unique teammate ids
                var teammateIds = [];
                _.each(filteredTeams, function (team) {
                    _.each(team.members, function (member) {
                        if (teammateIds.indexOf(member) === -1) {
                            teammateIds.push(member);
                        }
                    });
                });

                var options = {
                    url: config.api.protocol + config.api.host + '/api/v1/profiles',
                    json: {
                        account_ids: teammateIds
                    }
                };

                request.post(options, function (err, profileRes, profileBody) {
                    if (err) {
                        console.error(err);
                        cb(err);
                    } else if (isSuccess(profileRes)) {
                        var idNameMap = {};
                        _.each(profileBody.data, function (profile) {
                            idNameMap[profile.user_id] = profile.name;
                        });
                        _.each(filteredTeams, function (team) {
                            team.members = _.map(team.members, function (member) {
                                return idNameMap[member] || member.id;
                            });
                        });
                        cb(null, {
                            id: id.id,
                            name: name,
                            teams: _.map(filteredTeams, function (team) {
                                return {
                                    id: team.id,
                                    name: team.name,
                                    members: team.members,
                                    rating: leagues[team.league] + ' ' +  team.division + ' - ' + team.division_rating,
                                    win_percentage: ((team.wins / (team.wins + team.losses)) * 100).toString().substring(0, 6),
                                    wins: team.wins,
                                    losses: team.losses
                                }
                            })
                        });

                    } else {
                        cb(new Error(teamRes.statusCode + ' reponse code returned for profiles query with users: ' + JSON.stringify(teammateIds)));
                    }
                });
            } else {
                cb(new Error(filteredTeams.length + ' elements found for ' + name +' user query, expected at least 1'));
            }
        }
    });
}
