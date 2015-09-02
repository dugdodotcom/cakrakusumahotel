'use strict';

var mongoose = require('mongoose'),
    Slide = mongoose.model('Slide'),
    _ = require('lodash'),
    fs = require('fs'),
    im = require('imagemagick');
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
            var newPath='./public/img/slide/'+imageName;
            var thumbPath='./public/img/slidethumbs/'+imageName;
            var regPath='./public/img/slideregular/'+imageName;
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
											im.resize({
                        srcPath: newPath,
                        dstPath: regPath,
                        height:   400
                      }, function(err/* , stdout, stderr */){
                          if (err) throw err;
                          if(req.body._id===''){
                              var slide = new Slide({image:imageName,above:req.body.above,bottom:req.body.bottom,rel:req.body.rel});
                              slide.save(function(err,dat) {
                                  res.jsonp(dat);
                              });
                          }else{
                              Slide.update({_id:req.body._id},{image:imageName,above:req.body.above,bottom:req.body.bottom,rel:req.body.rel}).exec(function(err,dat){
                                  res.jsonp(dat);
                              });
                          }
                        });
										});
                
							});
        }
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
		slide:req.signedCookies.slide ?req.signedCookies.slide : 1
		});
};
exports.addslide=function(req,res){
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
exports.choosenslide=function(req,res){
  if(req.signedCookies.choose){
    res.jsonp(req.signedCookies.choose);
  }else{
    res.jsonp({no:0});
  }
};
exports.clearslide=function(req,res){
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
    Slide.find().sort('-created').exec(function(err, galleries) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(galleries);
        }
    });
};
/**
 * Find slide by id
 */
exports.slide = function(req, res, next, id) {
    Slide.load(id, function(err, slide) {
        if (err) return next(err);
        if (!slide) return next(new Error('Failed to load slide ' + id));
        req.slide = slide;
        next();
    });
};

/**
 * Create a slide
 */
exports.create = function(req, res) {
    var slide = new Gallery(req.body);
    slide.user = req.user;
    slide.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                slide: slide
            });
        } else {
            res.jsonp(slide);
        }
    });
};

/**
 * Update a slide
 */
exports.update = function(req, res) {
    var slide = req.slide;

    slide = _.extend(slide, req.body);

    slide.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                slide: slide
            });
        } else {
            res.jsonp(slide);
        }
    });
};

/**
 * Delete an slide
 */
exports.destroy = function(req, res) {		
		var slide = req.slide;
		slide.remove(function(err) {
            if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                slide: slide
            });
        } else {
            res.jsonp(slide._id);
        }
    });
};
/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.slide);
};