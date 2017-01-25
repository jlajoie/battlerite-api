'use strict';

module.exports = function(app, config) {

    var helpers = {
        redis: require('./helpers/redisHelper')(config)
    };

    var services = {
        battlerite: require('./services/battleriteService')(config)
    };

    var controllers = {
        admin: require('./controllers/adminController')(),
        teams: require('./controllers/teamController')(config, services.battlerite, helpers.redis),
        accounts: require('./controllers/accountController')(config, services.battlerite, helpers.redis)
    };

    // Admin routes
    app.get('/admin/ping', controllers.admin.ping);

    // Account routes
    // app.get('/api/v1/accounts', controllers.accounts.getAccountsFromAPI);
    app.get('/api/v1/accounts/:account_id', controllers.accounts.getOrCreate); // TODO make this the POST, make it not a param and use the body instead
    // app.post('/api/v1/accounts', controllers.accounts.createAccount);

    // Team routes
    // app.get('/api/v1/teams', controllers.teams.getTeams);
    app.get('/api/v1/teams/:account_id', controllers.teams.getOrCreate); // TODO make this the POST, make it not a param and use the body instead
    // app.post('/api/v1/teams', controllers.teams.createTeam);

    // ID route
    // TODO merge this in with the accounts.getOrCreate call and not have an "ids" endpoint
    app.get('/api/v1/ids/:account_name', controllers.accounts.getAccountId);
};
