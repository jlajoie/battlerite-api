'use strict';

module.exports = function() {

    var controller = {};

    controller.ping = function(req, res) {
        res.status(200).json({code: 200, message: 'Ok'});
    };

    return controller;

};
