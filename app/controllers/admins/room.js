'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    _ = require('lodash');


/**
 * Find room by id
 */
exports.room = function(req, res, next, id) {
    Room.load(id, function(err, room) {
        if (err) return next(err);
        if (!room) return next(new Error('Failed to load room ' + id));
        req.room = room;
        next();
    });
};

/**
 * Create a room
 */
exports.create = function(req, res) {
    var room = new Room(req.body);
    room.user = req.user;

    room.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                room: room
            });
        } else {
            res.jsonp(room);
        }
    });
};

/**
 * Update a room
 */
exports.update = function(req, res) {
    var room = req.room;

    room = _.extend(room, req.body);

    room.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                room: room
            });
        } else {
            res.jsonp(room);
        }
    });
};

/**
 * Delete an room
 */
exports.destroy = function(req, res) {
    var room = req.room;

    room.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                room: room
            });
        } else {
            res.jsonp(room);
        }
    });
};

/**
 * Show an room
 */
exports.show = function(req, res) {
    res.jsonp(req.room);
};

/**
 * List of Rooms
 */
exports.all = function(req, res) {
    Room.find().sort('-created').populate('user', 'name username').exec(function(err, rooms) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(rooms);
        }
    });
};