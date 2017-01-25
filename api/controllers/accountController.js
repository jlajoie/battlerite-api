'use strict';

var _ = require('lodash');

module.exports = function (config, battleriteService, redisHelper) {
    var controller = {};

    // TODO will be the internal redis read only get a single ID
    // controller.getOne = function (req, res) {
    //     redisHelper.getList([req.params.account_id], 'account', function (error, account) {
    //         if (error) {
    //             console.error(error);
    //             res.status(500).json({code: 500, message: 'Internal server error'});
    //         } else {
    //             res.status(200).json({code: 200, message: 'Ok', data: account});
    //         }
    //     });
    // };

    // TODO will be the internal redis read only get a set of IDs from the query param
    // controller.getAccounts = function (req, res) {
    //     redisHelper.getList([req.query.account_ids], 'account', function (error, accounts) {
    //         if (error) {
    //             console.error(error);
    //             res.status(500).json({code: 500, message: 'Internal server error'});
    //         } else {
    //         res.status(accounts.code).json(accounts);
    //         }
    //     });
    // };

    controller.getAccountId = function(req, res) {
        battleriteService.getAccountId(req.params.account_name, function (error, account) {
            if (error) {
                res.status(error.code).json(error);
            } else {
                // TODO create in redis here
                res.status(account.code).json(account);
            }
        });
    };

    // TODO will eventually be the POST endpoint for creation, also for multiple ids, for now just a simple GET
    controller.getOrCreate = function (req, res) {
        // redisHelper.getList(req.body.account_ids, 'account', function (error, accounts) {
        //     if (error) {
        //         console.error(error);
            //     res.status(500).json({code: 500, message: 'Internal server error'});
        //     } else if (team.length == 0) {
                battleriteService.getAccount(req.params.account_id, function (error, account) {
                    if (error) {
                        res.status(error.code).json(error);
                    } else {
                        // TODO create in redis here
                        res.status(account.code).json(account);
                    }
                });
            // } else {
            //     res.status(200).json({code: 200, message: 'Ok', data: accounts});
            // }
        // });
    };

    return controller;
};
