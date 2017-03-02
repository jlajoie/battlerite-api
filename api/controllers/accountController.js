'use strict';

var _ = require('lodash');

module.exports = function (config, db, battleriteService) {
    var controller = {};

    controller.getAccountIdByName = function(req, res) {
        battleriteService.getAccountId(req.params.account_name, function (error, account) {
            if (error) {
                res.status(error.code).json(error);
            } else {
                res.status(account.code).json(account);
            }
        });
    };

    controller.getOrCreate = function (req, res) {
        // TODO may need to parse account_ids for validity
        battleriteService.getAccountsByAccountIds(req.body.account_ids, function (error, accounts) {
            if (error) {
                res.status(error.code).json(error);
            } else {
                res.status(201).json({code: 201, message: 'Created', data: accounts});
            }
        });
    };

    return controller;
};
