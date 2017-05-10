'use strict';

var request = require('request');

var config = require('../config');

var isSuccess = function (response) {
    return response.statusCode >= 200 && response.statusCode < 300;
}

module.exports = function (name, cb) {
    var options = {
        url: config.api.protocol + config.api.host + '/api/v1/ids/' + name,
        json: true
    }
    request.get(options, function (err, idRes, idBody) {
        if (err) {
            console.error(err);
            cb(new Error('Internal error querying IDs for: ' + name));
        } else if (isSuccess(idRes)) {
            var options = {
                url: config.api.protocol + config.api.host + '/api/v1/teams',
                json: {
                    account_ids: [idBody.data.id]
                }
            };
            request.post(options, function (err, teamRes, teamBody) {
                if (err) {
                    console.error(err);
                    cb(new Error('Internal error querying teams for: ' + JSON.stringify(options.json.account_ids)));
                } else if (isSuccess(teamRes)) {
                    cb(null, idBody.data, teamBody.data);
                } else {
                    cb(new Error(teamRes.statusCode + ' reponse code returned for teams query for user: ' + idBody.data.id));
                }
            });
        } else {
            cb(new Error(idRes.statusCode + ' code returned for ID query for: ' + name));
        }
    });
};
