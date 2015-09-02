'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Contact Schema
 */
var ContactSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim:true
    },
    position: {
        type: String,
        default: '',
        trim:true
    },
    phone:{
        type: String,
        default: '',
        trim:true
    },
    email:{
        type: String,
        default: '',
        trim:true
    },
    level: {
        type: Number,
        default: 1
    }
});

/**
 * Statics
 */
ContactSchema.statics.load = function(id, cb) {
    this.findOne({
        level: id
    }).exec(cb);
};

mongoose.model('Contact', ContactSchema);