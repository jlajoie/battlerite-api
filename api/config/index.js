module.exports = {
    battlerite: {
        protocol: 'http://',
        host: 'api.battlerite.net',
        season: 3,
        user_agent: null
    },
    steam: {
        accountName: process.env.STEAM_ACCOUNT || null,
        password: process.env.STEAM_PASSWORD || null,
        machineName: 'docker-container'
    },
    port: 8080
};
