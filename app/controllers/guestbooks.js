'use strict';

var mongoose = require('mongoose'),
    Guestbook = mongoose.model('Guestbook'),
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
            var newPath='./public/img/guestbooks/'+imageName;
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
    Guestbook.update({_id:req.body._id},{$set:{active:req.body.active==1?0:1}}).exec(function(err,dat){
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
		guestbook:req.signedCookies.guestbook ?req.signedCookies.guestbook : 1
		});
};
exports.addguestbook=function(req,res){
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
exports.choosenguestbook=function(req,res){
  if(req.signedCookies.choose){
    res.jsonp(req.signedCookies.choose);
  }else{
    res.jsonp({no:0});
  }
};
exports.clearguestbook=function(req,res){
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
    Guestbook.find().sort('-created').exec(function(err, guestbooks) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(guestbooks);
        }
    });
};
/**
 * Find guestbook by id
 */
exports.guestbook = function(req, res, next, id) {
    Guestbook.load(id, function(err, guestbook) {
        if (err) return next(err);
        if (!guestbook) return next(new Error('Failed to load guestbook ' + id));
        req.guestbook = guestbook;
        next();
    });
};

/**
 * Create a guestbook
 */
exports.create = function(req, res) {
    var guestbook = new Guestbook(req.body);
    guestbook.user = req.user;
    guestbook.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                guestbook: guestbook
            });
        } else {
            var mailOptions = {
            from: req.body.name+" <"+req.body.email+">", // sender address
            to: "cakrakusumahotel@gmail.com", // list of receivers
            subject: "[Guestbook]", // Subject line
            html: '<p>title: '+req.body.title+'</p>\n\
                  <p>name: '+req.body.name+'</p>\n\
                  <p>email: '+req.body.email+'</p>\n\
                  <p>content: '+req.body.content+'</p>'
            }
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
            });
            res.cookie('url', req.body.url, { signed: true });
            res.redirect('guestbookconfirm');
        }
    });
};

/**
 * Update a guestbook
 */
exports.update = function(req, res) {
    var guestbook = req.guestbook;

    guestbook = _.extend(guestbook, req.body);

    guestbook.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                guestbook: guestbook
            });
        } else {
            res.jsonp(guestbook);
        }
    });
};

/**
 * Delete an guestbook
 */
exports.destroy = function(req, res) {		
		var guestbook = req.guestbook;
		guestbook.remove(function(err) {
            if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                guestbook: guestbook
            });
        } else {
            res.jsonp(guestbook._id);
        }
    });
};
/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.guestbook);
};