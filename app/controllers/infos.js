'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Info = mongoose.model('Info'),
    _ = require('lodash');


/**
 * Find info by id
 */
exports.info = function(req, res, next, id) {
    Info.load(id, function(err, info) {
        if (err) return next(err);
        if (!info){info={no:1}};
        req.info = info;
        next();
    });
};
exports.home = function(req, res, next, id) {    
  req.home = id;
  next();   
};

/**
 * Create a info
 */
exports.create = function(req, res) {
    var infos = new Info(req.body);
    infos.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(infos);
        }
    });
};

/**
 * Update a info
 */
exports.update = function(req, res) {
    var info = req.info;

    info = _.extend(info, req.body);

    info.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                info: info
            });
        } else {
            res.jsonp(info);
        }
    });
};

/**
 * Delete an info
 */
exports.destroy = function(req, res) {
    var info = req.info;

    info.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                info: info
            });
        } else {
            res.jsonp(info);
        }
    });
};

/**
 * Show an info
 */
exports.show = function(req, res) {
    res.jsonp(req.info);
};

/**
 * List of Infos
 */
exports.all = function(req, res) {
    Info.find().sort('-created').populate('user', 'name username').exec(function(err, infos) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(infos);
        }
    });
};