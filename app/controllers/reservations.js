'use strict';

var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    Booking = mongoose.model('Booking'),
    _ = require('lodash'),
    fs = require('fs'),
    im = require('imagemagick');
function formatDollar(num) {
        var p = num.toFixed(2).split(".");
        return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    }
exports.upload=function(req,res){
    fs.readFile(req.files.file.path, function (err, data) {
        var imageName = req.files.file.name;
        if(err){
            console.log(err);
        }
        if(!imageName){
            console.log('There was an error');
            res.redirect('/');
            res.end();
        }else{
            var newPath='./public/img/rooms/'+imageName;
            var thumbPath='./public/img/thumbs/'+imageName;
            fs.writeFile(newPath, data, function (err) {
								if(err){
									console.log(err);
								}
								im.resize({
										srcPath: newPath,
										dstPath: thumbPath,
										width:   200
									}, function(err/* , stdout, stderr */){
											if (err) throw err;
											res.jsonp({success:1,img:imageName});
										});
							});
        }
    });
};
exports.available = function(req,res){
    Room.update({_id:req.body._id,'type.type':req.body.type},{$set:{'type.$.available':req.body.available==1?2:1}}).exec(function(err,dat){
        res.jsonp({available:req.body.available==1?2:1});
    });
};
exports.post=function(req,res){
    res.cookie('start', req.body.start, { signed: true });
    res.cookie('end', req.body.end, { signed: true });
    res.cookie('adult', req.body.adult, { signed: true });
    res.cookie('children', req.body.children, { signed: true });
    res.redirect('/index.php/');
};
exports.booking=function(req,res){
    res.render('index2', {
        title: 'Booking | Cakrakusumahotel.com',
        id:'accomodation',
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};
exports.choosedata = function(req, res) {
    res.jsonp({start:req.signedCookies.start?req.signedCookies.start : '',
        end:req.signedCookies.end?req.signedCookies.end : '',
        adult:req.signedCookies.adult?req.signedCookies.adult : 0,
        children:req.signedCookies.children?req.signedCookies.children : 0,
		room:req.signedCookies.room ?req.signedCookies.room : 1
		});
};
exports.addroom=function(req,res){
	if(req.signedCookies.choose){
		var data=req.signedCookies.choose;
		data.push(req.body);
		res.cookie('choose', data, { signed: true });
	}else{
		res.cookie('choose', [req.body], { signed: true });
	}
  if(req.signedCookies.choose){
    res.jsonp({success:1});
  }else{
    res.jsonp({success:0});
  }
};
/* function choose(req,res){
  res.jsonp(JSON.stringify(req.signedCookies.choose).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'));
} */
exports.onchange=function(req,res){
	res.cookie(req.body.type, req.body.data, { signed: true });
	res.jsonp({success:1});
};
exports.choosenroom=function(req,res){
  if(req.signedCookies.choose){
    res.jsonp(req.signedCookies.choose);
  }else{
    res.jsonp({no:0});
  }
};
exports.clearroom=function(req,res){
    res.clearCookie('start');
    res.clearCookie('end');
    res.clearCookie('adult');
    res.clearCookie('children');
    res.clearCookie('choose');
    res.send('some html');
};
exports.cekchoose=function(req,res){
  var no=1;
  if(req.signedCookies.choose){
    var data=req.signedCookies.choose;
    for (var i=0; i<data.length; i++) {
      var no=data[i].choose+1;
    }
  }
  res.jsonp({no:no});
}
exports.inputdate=function(req,res){
    res.cookie('start', req.body.start, { signed: true });
    res.cookie('end', req.body.end, { signed: true });
    res.cookie('adult', req.body.adult, { signed: true });
    res.cookie('children', req.body.children, { signed: true });
    res.redirect('/index.php/');
};
exports.all = function(req, res) {
    Room.find().sort('-created').exec(function(err, rooms) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            for(var i=0;i<rooms.length;i++){
                rooms[i].prices=formatDollar(rooms[i].price);            
            }
            res.jsonp(rooms);
        }
    });
};
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
    console.log(req.body);
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
            res.jsonp(room._id);
        }
    });
};
/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.room);
};
