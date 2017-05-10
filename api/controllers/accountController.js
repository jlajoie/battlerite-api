'use strict';

var _ = require('lodash');

module.exports = function (config, battleriteService) {
    var controller = {};

    controller.getAccountIdByName = function (req, res) {
        console.log('Received request for accountIdByName with account_name: ' + req.params.account_name);
        battleriteService.getAccountIdByName(req.params.account_name, function (error, account) {
            console.log('Received response ' + account.code + ' for accountIdByName with account_name: ' + req.params.account_name);
            if (error) {
                res.status(error.code).json(error);
            } else {
                res.status(account.code).json(account);
            }
        });
    };

    controller.getProfileByIds = function (req, res) {
        console.log('Received request for getProfileByIds with account_ids: ' + req.body.account_ids);
        battleriteService.getProfileByAccountIds(req.body.account_ids, function (error, profile) {
            console.log('Received response ' + profile.code + ' for getProfileByIds with account_ids: ' + req.body.account_ids);
            if (error) {
                res.status(error.code).json(error);
            } else {
                res.status(profile.code).json(profile);
            }
        });
    };

    controller.getOrCreate = function (req, res) {
        // TODO should likely merge getProfileById into this method
        console.log('Received request for account.getOrCreate with account_ids: ' + req.body.account_ids);
        battleriteService.getAccountsByAccountIds(req.body.account_ids, function (error, accounts) {
            console.log('Received response ' + profile.code + ' for account.getOrCreate with account_ids: ' + req.body.account_ids);
            if (error) {
                res.status(error.code).json(error);
            } else {
                res.status(accounts.code).json(accounts);
            }
        });
    };

    return controller;
};
