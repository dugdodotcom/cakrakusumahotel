'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Room Schema
 */
var RoomSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    price: {
        type: Number,
        default:0
    },
    prices: {
        type: String,
        default: ''
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
    occupancy: {
        type: Number,
        default:0
    },
    size: {
        type: String,
        default:'',
        trim: true
    },
    view: {
        type: String,
        default:'',
        trim: true
    },
    type: [{type: {
        type: String,
        trim: true
    },
    available: {
        type: Number,
        default: 1
    },    
    created:{
        type: Date,
        default: Date.now
    }
    }]
});


/**
 * Statics
 */
RoomSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Room', RoomSchema);
