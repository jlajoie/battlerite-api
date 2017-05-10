'use strict';

module.exports = function(app, config) {

    var helpers = {
        account: require('./helpers/accountHelper.js')(),
        team: require('./helpers/teamHelper.js')()
    };

    var services = {
        battlerite: require('./services/battleriteService')(config, helpers.account)
    };

    var controllers = {
        admin: require('./controllers/adminController')(),
        teams: require('./controllers/teamController')(config, services.battlerite, helpers.team),
        accounts: require('./controllers/accountController')(config, services.battlerite, helpers.account)
    };

    // Admin routes
    app.get('/admin/ping', controllers.admin.ping);

    // Account routes
    app.post('/api/v1/accounts', controllers.accounts.getOrCreate);

    // Team routes
    app.post('/api/v1/teams', controllers.teams.getOrCreate);

    // ID route
    app.get('/api/v1/ids/:account_name', controllers.accounts.getAccountIdByName);

    // Profile route
    app.post('/api/v1/profiles', controllers.accounts.getProfileByIds);
};
