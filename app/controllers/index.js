'use strict';

var mongoose = require('mongoose'),
    Contact = mongoose.model('Contact'),
    Chat = mongoose.model('Chat'),
    Slide = mongoose.model('Slide'),
    Info = mongoose.model('Info'),
    Gallery = mongoose.model('Gallery'),
    Testimoni = mongoose.model('Testimoni'),
    Blog = mongoose.model('Blog'),
    _ = require('lodash');
exports.contact = function(req, res, next, id) {
    Contact.load(id, function(err, contact) {
        if (err) return next(err);
        if (!contact){contact={no:1}};
        req.contact = contact;
        next();
    });
};
exports.link = function(req, res, next, id) {
    Info.load(id, function(err, link) {
        if (err) return next(err);
        if (!link){link={no:1}};
        req.link = link;
        next();
    });
};
exports.home = function(req, res) {
    if(req.signedCookies.url){
        var deta=req.signedCookies.url;
        res.clearCookie('url');
        res.redirect(deta);
    }else{
        Slide.find().exec(function(err,sld){
            Info.findOne({id:'special-offer'}).limit(1).exec(function(err,so){
                Info.findOne({id:'hotel-review'}).limit(1).exec(function(err,hr){
                    res.render('home/home', {
                        title: 'Nearest Hotel To Gadjah mada University, Yogyakarta, Java, Indonesia | cakrakusumahotel.com',
                        message: req.flash('error'),
                        id:'home',
                        sld:sld,
                        so:so.content,
                        hr:hr.content
                    });
                });
            });
        });
    }
};
exports.factsheet = function(req, res) {
    res.render('home/fact-sheet', {
        title: 'Fact Sheet | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'home'
    });
};
exports.roomsasuites = function(req, res) {
    res.render('home/roomsasuites', {
        title: 'Room and Suites | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'home'
    });
};

exports.guestservices = function(req, res) {
    res.render('home/guestservices', {
        title: 'Guest Services | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'home'
    });
};

exports.guestbook = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,dat){
    res.render('home/guestbook', {
        title: 'Guest Book | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'home',
        right:dat.content
    });
    });
};
exports.facilities = function(req, res) {
    res.render('home/facilities', {
        title: 'Guest Book | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'facilities'
    });
};
exports.restaurantabars = function(req, res) {
    res.render('home/restaurantabars', {
        title: 'Guest Book | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'facilities'
    });
};
exports.mice = function(req, res) {
    res.render('home/mice', {
        title: 'M.I.C.E. | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'package'
    });
};
exports.leisures = function(req, res) {
    res.render('home/leisures', {
        title: 'Leisures | Cakrakusumahotel.com',
        message: req.flash('error'),
        id:'package'
    });
};
exports.photogallery = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,dat){
    Gallery.find().exec(function(err,img){
        res.render('home/photogallery', {
            title: 'photo gallery | Cakrakusumahotel.com',
            message: req.flash('error'),
            id:'photo-gallery',
            img:img,
            right:dat.content
        });
    });
    })
};
exports.info = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,dat){
        res.render('home/info', {
            message: req.flash('error'),
            id:req.link.home,
            title:req.link.title,
            content:req.link.content,
            description:req.link.description,
            keyword:req.link.keyword,
            right:dat.content
        });
    });
};
exports.contactus = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,rg){
    Contact.find().exec(function(err,dat){
        res.render('home/contactus', {
            title: 'contact us | Cakrakusumahotel.com',
            message: req.flash('error'),
            id:'contact',
            contacts:dat,
            right:rg.content
        });
    });
    });
};
exports.contactform = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,rg){
    var id='';
    if(req.user!=undefined){
      id=req.user._id;
    }
    Chat.find({user:id}).sort('created').exec(function(err,dat){
        res.render('home/contactusform', {
            title: 'contact us | Cakrakusumahotel.com',
            message: req.flash('error'),
            id:'contact',
            chats:dat,
            contact:req.contact,
            right:rg.content
        });
    });
    });
};
exports.contactsubmit=function(req,res){
    var chat=new Chat(req.body);
    chat.user=req.user._id;
    chat.save(function(err,dat) {
        if(err){
            console.log(err);
        }
        res.jsonp(dat);
    });
}
exports.testimonials = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,rg){
    Testimoni.find({active:1}).exec(function(err,dat){
        res.render('home/testimonials', {
            title: 'Testimonials | Cakrakusumahotel.com',
            message: req.flash('error'),
            id:'testimonials',
            datas:dat,
            right:rg.content
        });
    });
    });
};
exports.testimonialpost = function(req,res){
    var testimoni=new Testimoni(req.body);
    testimoni.save(function(err,dat){
        if(err){
            console.log(err);
        }
        res.redirect('/index.php/testimonials');
    });
}
exports.contactconfirm = function(req, res){
    res.render('home/contactconfirm', {
        url: req.signedCookies.url
    });
    res.clearCookie('url');
}
exports.testimoniconfirm = function(req, res){
    res.render('home/testimoniconfirm', {
        url: req.signedCookies.url
    });
    res.clearCookie('url');
}
exports.guestbookconfirm = function(req, res){
    res.render('home/guestbookconfirm', {
        url: req.signedCookies.url
    });
    res.clearCookie('url');
}
exports.blog = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,rg){
    Blog.find({publish:1}).sort('-created').exec(function(err,dat){
        for(var i=0;i<dat.length;i++){
            Blog.aggregate({$match:{_id:dat._id}},{$unwind:'$comments'},{$group:{id:null,count:{$sum:1}}}).exec(function(err,cnt){
                if(cnt){
                    dat[i].push({count:cnt.count});
                }
            });
        }

        res.render('home/bloglist', {
            title: 'Blogs | Cakrakusumahotel.com',
            message: req.flash('error'),
            id:'home',
            blogs:dat,
            right:rg.content
        });
    });
    });
};
exports.blogdetail = function(req, res) {
    Info.findOne({id:'contact-detail'},{content:1}).exec(function(err,rg){
    Blog.findOne({url:req.param('url')}).exec(function(err,dat){
        Blog.aggregate({$match:{_id:dat._id}},{$unwind:'$comments'},{$group:{id:null,count:{$sum:1}}}).exec(function(err,cnt){
            if(cnt){
                dat[i].push({count:cnt.count});
            }
            res.render('home/blogdetail', {
                title: dat.title+' - Cakrakusumahotel.com',
                message: req.flash('error'),
                id:'home',
                blog:dat,
                description:dat.description,
                keyword:dat.keyword,
                right:rg.content
            });
        });
    });
    });
};
exports.blogcomment = function(req, res) {
        blog.comments.push(req.body);
        blog.save(function(err,dat){
            res.redirect('/index.php/blog/'+req.param('url'));
        });
};
