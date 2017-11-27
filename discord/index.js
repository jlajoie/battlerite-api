'use strict';

var Discord = require('discord.io');
var request = require('request');
var _ = require('lodash');

var config = require('./config');
var commands = require('./commands');

var json = require('json-bigint');

// Overwrite JSON for IDs
JSON.parse = json.parse;
JSON.stringify = json.stringify;

var log = console.log;
console.log = function (body) {
    log('[ts=' + new Date().toISOString() + ']' + '[message=' + body + ']');
};

var bot = new Discord.Client({
    token: config.discord.secret,
    autorun: true,
    messageCacheLimit: 20
});

var sendObjectMessage = function (bot, channelId, object) {
    bot.sendMessage({
        to: channelId,
        message: '```' + JSON.stringify(object, null, 4) + '```'
    });
}

bot.on('ready', function () {
    console.log('Logged in as ' + bot.username + '/' + bot.id);
});

bot.on('message', function (user, userId, channelId, message, event) {
    if (!config.whitelist.enabled ||
        (config.whitelist.enabled && config.whitelist.channel.indexOf(channelId) !== -1) {
        var regex = /^!stats (\w+) {0,1}(.*)$/
        var matches = regex.exec(message);
        if (matches) {
            console.log(user + '/' + userId + ': ' + message);
            switch (matches[1]) {
                case 'help':
                    bot.sendMessage({
                        to: channelId,
                        message: '```!stats <solo|2v2|3v3|champions> <username>```'
                    });
                    break;
                case 'solo':
                    commands.solo(matches[2], function (err, res) {
                        if (err) {
                            console.error(err);
                        } else {
                            sendObjectMessage(bot, channelId, res);
                        }
                    });
                    break;
                case '2v2':
                    commands.team(matches[2], 2, function (err, res) {
                        if (err) {
                            console.error(err);
                        } else {
                            sendObjectMessage(bot, channelId, res);
                        }
                    });
                    break;
                case '3v3':
                    commands.team(matches[2], 3, function (err, res) {
                        if (err) {
                            console.error(err);
                        } else {
                            sendObjectMessage(bot, channelId, res);
                        }
                    });
                    break;
                case 'champions':
                    commands.champions(matches[2], function (err, res) {
                        if (err) {
                            console.error(err);
                        } else {
                            sendObjectMessage(bot, channelId, res);
                        }
                    })
            }
        }
    }
});

