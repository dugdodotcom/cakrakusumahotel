'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Blog = mongoose.model('Blog'),
    Gallery = mongoose.model('Gallery'),
    _ = require('lodash'),
    // io = require('socket.io'),
    nodemailer = require("nodemailer"),
    word = require("word"),
    fs = require('fs'),
    im = require('imagemagick');


/**
 * Find blog by id s
 */

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
											if (err) console.log(err);
											im.resize({
                        srcPath: newPath,
                        dstPath: regPath,
                        width:   900
                      }, function(err/* , stdout, stderr */){
                          res.jsonp({success:1,img:imageName});
                        });
										});
                
							});
        }
    });
};
exports.blog = function(req, res, next, id) {
    Blog.load(id, function(err, blog) {
        if (err) return next(err);
        if (!blog){blog={no:1}};
        req.blog = blog;
        next();
    });
};

/**
 * Create a blog
 */
exports.create = function(req, res) {
    var blog = new Blog(req.body);
    var limit=word.limit(req.body.content, 100);
    blog = _.extend(blog, {limit:limit});
    blog.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(blog);
        }
    });
};

/**
 * Update a blog
 */
exports.update = function(req, res) {
    var blog = req.blog;
    blog = _.extend(blog, req.body);
    var limit=word.limit(req.body.content, 100);
    blog = _.extend(blog, {limit:limit});
    blog.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(blog);
        }
    });
};

/**
 * Delete an blog
 */
exports.destroy = function(req, res) {
    var blog = req.blog;

    blog.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                blog: blog
            });
        } else {
            res.jsonp(blog);
        }
    });
};

/**
 * Show an blog
 */
exports.all = function(req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0
    var perPage = 10
    var options = {
      perPage: perPage,
      page:page==0?0:page-1
    }
    Blog.count().exec(function (err, count) {
        Blog.find().sort({created:-1}).limit(options.perPage).skip(options.perPage * options.page).exec(function(err, chats) {
            if (err) {
                console.log(err);
            }
            res.jsonp({blogs:chats,page:page,pages:count/perPage,count:count});
        });
    });
};
exports.blogpublish = function(req, res) {
    Blog.update({_id:req.body._id},{publish:req.body.publish==1?0:1}).exec(function(err,dat){
        res.jsonp({publish:req.body.publish==1?0:1});
    });
};
exports.show = function(req, res) {
    res.jsonp(req.blog);
};
/**
 * List of Blogss
 */

exports.chatadmin=function(req,res){
    var chats = new Chat(req.body);
    chats.save(function(err,chats) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(chats);
        }
    });
};
exports.submitnotregister = function(req, res) {
    //io.sockets.in('admin'+req.body.level).emit('userchattext', {user:dat._id,subject:req.body.subject,chat:req.body.chat,type:1});
    var chats=new Chat(req.body);
    chats.save(function(err){
        var mailOptions = {
        from: req.body.name+" <"+req.body.email+">", // sender address
        to: "cakrakusumahotel@gmail.com", // list of receivers
        subject: "[blog us:"+req.body.position+"] "+req.body.subject, // Subject line
        text: req.body.message, // plaintext body
        html: req.body.message // html body
        }

        // send mail with defined transport objects
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        });
        res.cookie('url', req.body.url, { signed: true });
        res.redirect('blogconfirm');
    });
    
}
