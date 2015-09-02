'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Info Schema
 */
var InfoSchema = new Schema({
    content: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    id: {
        type: String,
        default: '',
        trim: true
    },
    home: {
        type: String,
        default: '',
        trim: true
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    keyword: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    link: {
        type: Schema.ObjectId,
        ref: 'Link'
    }
});

/**
 * Statics
 */
InfoSchema.statics.load = function(id, cb) {
    this.findOne({
        id: id
    }).exec(cb);
};

mongoose.model('Info', InfoSchema);
