'use strict';

var mongoose = require('mongoose'),
    Gallery = mongoose.model('Gallery'),
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
            var newPath='./public/img/gallery/'+imageName;
            var thumbPath='./public/img/thumbs/'+imageName;
            var regPath='./public/img/regular/'+imageName;
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
                        width:   900
                      }, function(err/* , stdout, stderr */){
                          if (err) throw err;
                          console.log(req.body);
                          if(req.body._id===''){
                              var gallery = new Gallery({image:imageName,rel:req.body.rel});
                              gallery.save(function(err,dat) {
                                  res.jsonp(dat);
                              });
                          }else{
                              Gallery.update({_id:req.body._id},{image:imageName,rel:req.body.rel}).exec(function(err,dat){
                                  if(err){
                                      console.log(err);
                                  }
                                  res.jsonp(dat);
                              });
                          }
                        });
										});
                
							});
        }
    });
};
exports.active = function(req,res){
    Gallery.update({_id:req.body._id},{$set:{active:req.body.active==1?0:1}}).exec(function(err,dat){
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
		gallery:req.signedCookies.gallery ?req.signedCookies.gallery : 1
		});
};
exports.addgallery=function(req,res){
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
exports.choosengallery=function(req,res){
  if(req.signedCookies.choose){
    res.jsonp(req.signedCookies.choose);
  }else{
    res.jsonp({no:0});
  }
};
exports.cleargallery=function(req,res){
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
    Gallery.find().sort('-created').exec(function(err, galleries) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(galleries);
        }
    });
};
exports.see = function(req, res) {
    Gallery.find({active:1}).sort('-created').limit(8).exec(function(err, galleries) {
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
 * Find gallery by id
 */
exports.gallery = function(req, res, next, id) {
    Gallery.load(id, function(err, gallery) {
        if (err) return next(err);
        if (!gallery) return next(new Error('Failed to load gallery ' + id));
        req.gallery = gallery;
        next();
    });
};

/**
 * Create a gallery
 */
exports.create = function(req, res) {
    var gallery = new Gallery(req.body);
    gallery.user = req.user;
    gallery.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                gallery: gallery
            });
        } else {
            res.jsonp(gallery);
        }
    });
};

/**
 * Update a gallery
 */
exports.update = function(req, res) {
    var gallery = req.gallery;

    gallery = _.extend(gallery, req.body);

    gallery.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                gallery: gallery
            });
        } else {
            res.jsonp(gallery);
        }
    });
};

/**
 * Delete an gallery
 */
exports.destroy = function(req, res) {		
		var gallery = req.gallery;
		gallery.remove(function(err) {
            if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                gallery: gallery
            });
        } else {
            res.jsonp(gallery._id);
        }
    });
};
/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.gallery);
};
