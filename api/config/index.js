module.exports = {
    battlerite: {
        protocol: 'http://',
        host: 'api.battlerite.net',
        season: 1
    },
    redis: {
        host: 'redis',
        port: 6379
    },
    steam: {
        accountName: process.env.STEAM_ACCOUNT || null,
        password: process.env.STEAM_PASSWORD || null,
        machineName: 'docker-container',
        logonID: Math.floor(Math.random() * 10000)
        // TODO only enable if you have a steam guard key
        // authCode: process.env.STEAM_GUARD_KEY || null
    },
    port: 8080
};
