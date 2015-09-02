'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contact = mongoose.model('Contact'),
    Chat = mongoose.model('Chat'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    // io = require('socket.io'),
    nodemailer = require("nodemailer");


/**
 * Find contact by id
 */

var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "cakrakusumahotel@gmail.com",
            pass: "cakrakusuma1234567890"
        }
    });
exports.contact = function(req, res, next, id) {
    Contact.load(id, function(err, contact) {
        if (err) return next(err);
        if (!contact){contact={no:1}};
        req.contact = contact;
        next();
    });
};

/**
 * Create a contact
 */
exports.create = function(req, res) {
    var contacts = new Contact(req.body);
    contacts.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(contacts);
        }
    });
};

/**
 * Update a contact
 */
exports.update = function(req, res) {
    var contact = req.contact;

    contact = _.extend(contact, req.body);

    contact.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                contact: contact
            });
        } else {
            res.jsonp(contact);
        }
    });
};

/**
 * Delete an contact
 */
exports.destroy = function(req, res) {
    var contact = req.contact;

    contact.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                contact: contact
            });
        } else {
            res.jsonp(contact);
        }
    });
};

/**
 * Show an contact
 */
exports.show = function(req, res) {
    var page = req.param('page') > 0 ? req.param('page') : 0
    var perPage = 10
    var options = {
      perPage: perPage,
      page:page==0?0:page-1
    }
    Chat.count().exec(function (err, count) {
        Chat.find({level:req.contact.level}).sort({created:-1}).limit(options.perPage).skip(options.perPage * options.page).exec(function(err, chats) {
            if (err) {
                console.log(err);
            }
            res.jsonp({contact:req.contact,contacts:chats,page:page,pages:count/perPage,count:count});
        });
    });
};
exports.contactreplied = function(req, res) {
    Chat.update({_id:req.body._id},{replied:req.body.replied==1?0:1}).exec(function(err,dat){
        res.jsonp({replied:req.body.replied==1?0:1});
    });
};
/* exports.show = function(req, res) {
    res.jsonp(req.contact);
}; */
/**
 * List of Contacts
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
        subject: "[contact us:"+req.body.position+"] "+req.body.subject, // Subject line
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
        res.redirect('contactconfirm');
    });
    
}