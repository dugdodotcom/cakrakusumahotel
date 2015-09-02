'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Blog Schema
 */
var BlogSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim:true
    },
    url: {
        type: String,
        default: '',
        trim:true
    },
    keyword:{
        type: String,
        default: '',
        trim:true
    },
    description:{
        type: String,
        default: '',
        trim:true
    },
    content:{
        type: String,
        default: '',
        trim:true
    },
    image:{
        type: String,
        default: '',
        trim:true
    },
    limit:{
        type: String,
        default: '',
        trim:true
    },
    comments:[{
        created: {
            type: Date,
            default: Date.now
        },
        name:{
            type:String,
            default: '',
            trim:true
        },
        email:{
            type:String,
            default: '',
            trim:true
        },
        website:{
            type:String,
            default: '',
            trim:true
        },
        comment:{
            type:String,
            default: '',
            trim:true
        }
    }],
    publish: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    }
});

/**
 * Statics
 */
BlogSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Blog', BlogSchema);
