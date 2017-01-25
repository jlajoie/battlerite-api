'use strict';

var _ = require('lodash');

module.exports = function (config, battleriteService, redisHelper) {
    var controller = {};

    controller.getOne = function (req, res) {
        redisHelper.getList([req.params.team_id], 'team', function (error, team) {
            if (error) {
                console.error(error);
                res.status(500).json({code: 500, message: 'Internal server error'});
            } else {
                if (team.length > 0) {
                    res.status(200).json({code: 200, message: 'Ok', data: team});
                } else {
                    res.status(404).json({code: 404, message: 'Not found'});
                }
            }
        });
    };

    controller.getTeams = function (req, res) {
        redisHelper.getList([req.query.team_ids], 'team', function (error, teams) {
            if (error) {
                console.error(error);
                res.status(500).json({code: 500, message: 'Internal server error'});
            } else {
                res.status(200).json({code: 200, message: 'Ok', data: teams});
            }
        });
    };

    controller.getOrCreate = function (req, res) {
        // redisHelper.getList(req.body.team_ids, 'account', function (error, team) {
        //     if (error) {
        //         console.error(error);
        //     res.status(500).json({code: 500, message: 'Internal server error'});
        //     } else if (team.length == 0) {
        battleriteService.getTeam(req.params.account_id, function (error, account) {
            if (error) {
                res.status(error.code).json(error);
            } else {
                // TODO create in redis here
                res.status(account.code).json(account);
            }
        });
        // } else {
        //     res.status(200).json({code: 200, message: 'Ok', data: team});
        // }
        // });
    };

    return controller;
};
