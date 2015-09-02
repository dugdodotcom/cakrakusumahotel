'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Booking Schema
 */
var BookingSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    specialrequest: {
        type: String,
        default: '',
        trim: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    },
    adult: {
        type: Number
    },
    children: {
        type: Number
    },
    action: {
        type: Number,
        default:1
    },
    day: {
        type: Number,
        default:0
    },
    total: {
        type: Number,
        default:0
    },
    bookings: [{
              roomsId:{
                  type: Schema.ObjectId,
                  ref:'Room'
              },
              choose:{
                  type: Number,
                  default: 0
              },
              type: {
                  type: String,
                  default: '',
                  trim: true
              }
            }]
});

/**
 * Validations
 */


/**
 * Statics
 */
BookingSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Booking', BookingSchema);