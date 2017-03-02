'use strict';

var _ = require('lodash');

module.exports = function () {
    var helper = {}

    helper.groupTeamsByAccountIds = function (accountIds, teams) {
        _.each(accountIds, function (accountId) {
            _.groupBy(teams, )
        });
    };

    return helper;
}
