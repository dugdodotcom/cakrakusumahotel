'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Chat Schema
 */
var ChatSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    level: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true
    },
    subject: {
        type: String,
        default: '',
        trim: true
    },
    message:{
        type: String,
        default: '',
        trim: true
    },
    replied:{
        type: Number,
        default: 0
    }
});

/**
 * Statics
 */
ChatSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Chat', ChatSchema);
