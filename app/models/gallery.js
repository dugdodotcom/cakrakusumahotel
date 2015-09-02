'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Gallery Schema
 */
var GallerySchema = new Schema({
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
    active: {
        type: Number,
        default: 0
    }
});


/**
 * Statics
 */
GallerySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Gallery', GallerySchema);
