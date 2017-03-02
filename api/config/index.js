module.exports = {
    battlerite: {
        protocol: 'http://',
        host: 'api.battlerite.net',
        season: 2
    },
    postgres: {
        jdbc: 'postgres://docker:docker@postgres:5432/docker',
        user: 'docker',
        database: 'docker',
        password: 'docker',
        host: 'postgres',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 30000
    },
    steam: {
        accountName: process.env.STEAM_ACCOUNT || null,
        password: process.env.STEAM_PASSWORD || null,
        machineName: 'docker-container'
    },
    port: 8080
};
