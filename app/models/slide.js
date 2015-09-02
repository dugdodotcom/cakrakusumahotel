'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Slide Schema
 */
var SlideSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    rel: {
        type: String,
        default: '',
        trim: true
    },
    above: {
        type: String,
        default: '',
        trim: true
    },
    bottom: {
        type: String,
        default: '',
        trim: true
    }
});


/**
 * Statics
 */
SlideSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Slide', SlideSchema);
