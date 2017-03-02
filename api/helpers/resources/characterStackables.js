'use strict';

var _ = require('lodash');

module.exports = function () {
    var map = {};

    var characters = [
        'lucie',
        'sirius',
        'iva',
        'jade',
        'ruh_kaan',
        'oldur',
        'ashka',
        'varesh',
        'taya',
        'pearl',
        'poloma',
        'croak',
        'freya',
        'jumong',
        'shifu',
        'ezmo',
        'bakko',
        'rook',
        'pestilus',
        'raigon'
    ]

    map[2] = 'total_wins'
    map['total_wins'] = 2

    map[3] = 'total_losses'
    map['total_losses'] = 3

    // XP
    _.each(characters, function (character, index) {
        map[11000 + index + 1] = character + '_xp';
        map[character + '_xp'] = 11000 + index + 1;
    });

    // Wins
    _.each(characters, function (character, index) {
        map[12000 + index + 1] = character + '_wins';
        map[character + '_wins'] = 12000 + index + 1;
    });

    // Losses
    _.each(characters, function (character, index) {
        map[13000 + index + 1] = character + '_losses';
        map[character + '_losses'] = 13000 + index + 1;
    });

    // Levels
    _.each(characters, function (character, index) {
        map[40000 + index + 1] = character + '_level';
        map[character + '_level'] = 40000 + index + 1;
    });

    return map;
};
