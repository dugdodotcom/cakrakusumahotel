'use strict';

var mongoose = require('mongoose'),
    Testimoni = mongoose.model('Testimoni'),
    _ = require('lodash'),
    fs = require('fs'),
    im = require('imagemagick'),
    nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "cakrakusumahotel@gmail.com",
            pass: "cakrakusuma1234567890"
        }
    });
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
            var newPath='./public/img/testimonis/'+imageName;
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
exports.active = function(req,res){
    Testimoni.update({_id:req.body._id},{$set:{active:req.body.active==1?0:1}}).exec(function(err,dat){
        res.jsonp({active:req.body.active==1?0:1});
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
		testimoni:req.signedCookies.testimoni ?req.signedCookies.testimoni : 1
		});
};
exports.addtestimoni=function(req,res){
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
exports.choosentestimoni=function(req,res){
  if(req.signedCookies.choose){
    res.jsonp(req.signedCookies.choose);
  }else{
    res.jsonp({no:0});
  }
};
exports.cleartestimoni=function(req,res){
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
    Testimoni.find().sort('-created').exec(function(err, testimonis) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(testimonis);
        }
    });
};
/**
 * Find testimoni by id
 */
exports.testimoni = function(req, res, next, id) {
    Testimoni.load(id, function(err, testimoni) {
        if (err) return next(err);
        if (!testimoni) return next(new Error('Failed to load testimoni ' + id));
        req.testimoni = testimoni;
        next();
    });
};

/**
 * Create a testimoni
 */
exports.create = function(req, res) {
    var testimoni = new Testimoni(req.body);
    testimoni.user = req.user;
    testimoni.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                testimoni: testimoni
            });
        } else {
            var mailOptions = {
            from: req.body.name+" <"+req.body.email+">", // sender address
            to: "cakrakusumahotel@gmail.com", // list of receivers
            subject: "[Testimoni]", // Subject line
            html: req.body.comment // html body
            }
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
            });
            res.cookie('url', req.body.url, { signed: true });
            res.redirect('testimoniconfirm');
        }
    });
};

/**
 * Update a testimoni
 */
exports.update = function(req, res) {
    var testimoni = req.testimoni;

    testimoni = _.extend(testimoni, req.body);

    testimoni.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                testimoni: testimoni
            });
        } else {
            res.jsonp(testimoni);
        }
    });
};

/**
 * Delete an testimoni
 */
exports.destroy = function(req, res) {		
		var testimoni = req.testimoni;
		testimoni.remove(function(err) {
            if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                testimoni: testimoni
            });
        } else {
            res.jsonp(testimoni._id);
        }
    });
};
/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.testimoni);
};