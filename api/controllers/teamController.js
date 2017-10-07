'use strict';

var _ = require('lodash');

module.exports = function (config, battleriteService, teamsHelper) {
    var controller = {};

    controller.getOrCreate = function (req, res) {
        console.log('Received request for team.getOrCreate with account_ids: ' + req.body.account_ids);
        battleriteService.getTeamsByAccountIds(req.body.account_ids, function (error, teams) {
            if (error) {
                res.status(error.code).json(error);
            } else {
                console.log('Received response ' + teams.code + ' for team.getOrCreate with account_ids: ' + req.body.account_ids);
                res.status(teams.code).json({code: teams.code, message: teams.message, data: teams.data});
            }
        });
    };

    return controller;
};
