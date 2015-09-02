'use strict';

var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    Booking = mongoose.model('Booking'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    fs = require('fs'),
    im = require('imagemagick');
exports.booking = function(req, res, next, id) {
    Booking.load(id, function(err, booking) {
        if (err) return next(err);
        if (!booking) return next(new Error('Failed to load booking ' + id));
        req.booking = booking;
        next();
    });
};
/* exports.all = function(req, res) {
    var data='';
    var price=0;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate='';
    var secondDate = '';
    var diffDays='';
    Booking.find().sort({created:-1}).populate('user bookings.roomsId').exec(function(err,dat){
        if(err){
            console.log(err);
        }
        for (var i=0; i<dat.length; i++) {
            price=0;
            for (var s=0; s<dat[i].bookings.length; s++) {
                price=price+dat[i].bookings[s].roomsId.price;
            }
            firstDate = dat[i].start;
            secondDate = dat[i].end;
            diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            dat[i].day=diffDays;
            dat[i].total=diffDays*price;
        };
        res.jsonp(dat);
    });
}; */
exports.all = function(req, res){
    var page = req.param('page') > 0 ? req.param('page') : 0
    var perPage = 10
    var options = {
      perPage: perPage,
      page: page==0?0:page-1
    }
    var data='';
    var price=0;
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate='';
    var secondDate = '';
    var diffDays='';
    Booking.count().exec(function (err, count) {
      Booking.find().populate('user bookings.roomsId').sort({created:-1}).limit(options.perPage).skip(options.perPage * options.page).exec(function(err,dat){
          if(err){
              console.log(err);
          }
          if(dat){
              for (var i=0; i<dat.length; i++) {
                  price=0;
                  for (var s=0; s<dat[i].bookings.length; s++) {
                      if(dat[i].bookings[s].roomsId.price){
                          price=price+dat[i].bookings[s].roomsId.price;
                      }
                  }
                  firstDate = dat[i].start;
                  secondDate = dat[i].end;
                  diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                  dat[i].day=diffDays;
                  dat[i].total=diffDays*price;
              };
          }
          data={content:dat,page:page,pages:count/perPage,count:count};
          res.jsonp(data);
      });
    });
}
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
exports.action = function(req, res) {
    Booking.update({_id:req.body._id},{action:req.body.action==1?2:1}).exec(function(err,dat){
        res.jsonp({action:req.body.action==1?2:1});
    });
};
exports.destroy = function(req, res) {		
		var booking = req.booking;
		booking.remove(function(err) {
            if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                booking: booking
            });
        } else {
            res.jsonp({success:1});
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.room);
};