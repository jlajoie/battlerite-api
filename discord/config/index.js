module.exports = {
    discord: {
        secret: process.env.DISCORD_SECRET || null
    },
    api: {
        protocol: 'http://',
        host: 'api:8080',
    },
    whitelist: {
        enabled: false,
        channel: []
    }
}
