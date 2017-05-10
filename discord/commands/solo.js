'use strict';

var _ = require('lodash');

var common = require('./common.js');
var config = require('../config');
var leagues = require('../resources/leagues.js');

module.exports = function (name, cb) {
    common(name, function (err, id, teams) {
        if (err) {
            cb(err);
        } else {
            var solo = _.filter(teams, function (team) {
                return team.members.length == 1;
            });
            if (solo.length == 1) {
                cb(null, {
                    id: id.id,
                    name: name,
                    rating: leagues[solo[0].league] + ' ' +  solo[0].division + ' - ' + solo[0].division_rating,
                    win_percentage: ((solo[0].wins / (solo[0].wins + solo[0].losses)) * 100).toString().substring(0, 6),
                    wins: solo[0].wins,
                    losses: solo[0].losses
                });
            } else {
                cb(new Error(solo.length + ' elements found for user query, expected 1'));
            }
        }
    });
}
