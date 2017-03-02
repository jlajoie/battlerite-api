'use strict';

var moment = require('moment');

module.exports = function (orm, db) {
    var Team = db.define('team', {
        team_id                 :    { type: 'number', required: true , key: true},
        name                    :    { type: 'text' },
        avatar                  :    { type: 'text' },
        league                  :    { type: 'integer' },
        division                :    { type: 'integer' },
        division_rating         :    { type: 'integer' },
        wins                    :    { type: 'integer' },
        losses                  :    { type: 'integer' },
        placement_games_left    :    { type: 'integer' },
    });

    Team.hasMany('accounts', db.models.Account, {}, {
        autoFetch: true,
        reverse: 'accounts'
    });
};
