'use strict';

module.exports = function(app, config, db) {

    var helpers = {
        account: require('./helpers/accountHelper.js')()
    };

    var services = {
        battlerite: require('./services/battleriteService')(config, helpers.account)
    };

    var controllers = {
        admin: require('./controllers/adminController')(),
        // teams: require('./controllers/teamController')(config, db, services.battlerite, ),
        accounts: require('./controllers/accountController')(config, db, services.battlerite, helpers.account)
    };

    // Admin routes
    app.get('/admin/ping', controllers.admin.ping);

    // Account routes
    app.post('/api/v1/accounts', controllers.accounts.getOrCreate);

    // ID route
    // app.get('/api/v1/ids/:account_name', controllers.accounts.getAccountId);
};
