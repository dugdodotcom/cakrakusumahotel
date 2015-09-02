'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Booking = mongoose.model('Booking'),
    User = mongoose.model('User'),
    Info = mongoose.model('Info'),
    _ = require('lodash'),
    nodemailer = require("nodemailer");

function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
    return  num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
}
var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";
var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "cakrakusumahotel@gmail.com",
            pass: "cakrakusuma1234567890"
        }
    });

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    if(req.body.url){
      res.redirect(req.body.url);
    }else{
      res.redirect('/');
    }
};

/**
 * Create user
 */

exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.render('users/signup', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};
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
exports.booking = function(req, res, next) {
    var userid='';
    if(typeof req.user === "undefined"){
        var user = new User(req.body);
        var message = null;

        user.provider = 'local';
        user.save(function(err,dat) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = 'Username already exists';
                        break;
                    default:
                        message = 'Please fill all the required fields';
                }

                return res.render('users/signup', {
                    message: message,
                    user: user
                });
            }
            userid=dat._id;
            var booking=new Booking({user:dat._id,specialrequest:req.body.specialrequest,start:req.signedCookies.start,end:req.signedCookies.end,adult:req.signedCookies.adult,bookings:req.signedCookies.choose});
            booking.save(function(err){
              
              req.logIn(user, function(err) {
                if (err) return next(err);
                successed();
            });
            });
        });
    }else{
        User.update({_id:req.user._id},req.body).exec(function(err) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    user: user
                });
            } else {
                userid=req.user._id;
                var booking=new Booking({user:req.user._id,specialrequest:req.body.specialrequest,start:req.signedCookies.start,end:req.signedCookies.end,adult:req.signedCookies.adult,bookings:req.signedCookies.choose});
                booking.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    successed();
                });
            }
        });
    }
    function successed(){
        Info.findOne({id:"transfer"}).exec(function(err,info){
            Booking.findOne({user:userid}).sort({created:-1}).limit(1).populate('user bookings.roomsId').exec(function(err,dat){
                if(err){
                    console.log(err);
                }
                var price=0;
                for (var i=0; i<dat.bookings.length; i++) {
                    price=price+dat.bookings[i].roomsId.price;
                }
                var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                var firstDate = dat.start;
                var secondDate = dat.end;
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                var total=diffDays*price;
                var start=firstDate.getDate()+'-'+month[firstDate.getMonth()]+'-'+firstDate.getFullYear();
                var end=secondDate.getDate()+'-'+month[secondDate.getMonth()]+'-'+secondDate.getFullYear();
                var body='';
                var ticket=dat.bookings;
                for (var i=0; i<dat.bookings.length; i++) {
                    body+='<tr>\
                  <td><img ng-src="http://www.cakrakusumahotel.com/img/thumbs/'+ticket[i].roomsId.image+'"></td>\
                  <td>'+ticket[i].roomsId.name+'</td>\
                  <td>'+ticket[i].roomsId.occupancy+'</td>\
                  <td>'+ticket[i].roomsId.size+'</td>\
                  <td>'+ticket[i].roomsId.view+'</td>\
                  <td>'+ticket[i].type+'</td>\
                  <td>IDR '+formatDollar(ticket[i].roomsId.price)+' per night</td>\
                </tr>';
                }
                var mailOptions = {
                from: "cakrakusumahotel@gmail.com", // sender address
                to: dat.user.firstname+" "+dat.user.lastname+" <"+dat.user.email+">", // list of receivers
                subject: "Your reservation for "+start+" | cakrakusumahotel.com",
                html: '<h4>Reservation Complete</h4>\
            <p>This is detail of your reservation:</p>\
            <table border="1" cellpadding="0" cellspacing="0" class="table table-striped">\
              <thead style="background-color:#FFD771">\
                <tr>\
                  <th>Image</th>\
                  <th>Name</th>\
                  <th>Occupancy</th>\
                  <th>Size</th>\
                  <th>View</th>\
                  <th>type</th>\
                  <th>price</th>\
                </tr>\
              </thead>\
              <tbody>\
                '+body+'\
                <tr>\
                  <td colspan="6">\
                    <strong>Total Price per night :</strong>\
                  </td>\
                  <td>\
                    <strong>IDR '+formatDollar(price)+' per night</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="6">\
                    <strong>Nights :</strong>\
                  </td>\
                  <td>\
                    <strong>'+diffDays+' nights</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="6">\
                    <strong>Total Price :</strong>\
                  </td>\
                  <td>\
                    <strong>IDR '+formatDollar(total)+'</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="7">\
                    From '+start+' to '+end+'\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="7">\
                    Special request: '+dat.specialrequest+'\
                  </td>\
                </tr>\
              </tbody>\
            </table>\
            <div class="transfer-info">\
              <p>'+info.content+'</p>\
            </div>'
                };
              smtpTransport.sendMail(mailOptions, function(error, response){
                  if(error){
                      console.log(error);
                  }else{
                      console.log("Message sent: " + response.message);
                  }

                  // if you don't want to use this transport object anymore, uncomment following line
                  //smtpTransport.close(); // shut down the connection pool, no more messages
              });
              var mailOptions = {
                from: "cakrakusumahotel@gmail.com", // sender address
                to: "cakrakusumahotel@gmail.com", // list of receivers
                subject: "[reservation] for "+start+" from "+dat.user.email,
                html: '<h4>Reservation Complete</h4>\
            <p>This is detail of  reservation:</p>\
            <p>name: '+dat.user.firstname+' '+dat.user.lastname+'<br />\
            email: '+dat.user.email+'<br />address: '+dat.user.address+'<br />\
            phone: '+dat.user.phone+'</p>\
            <table border="1" cellpadding="0" cellspacing="0" class="table table-striped" >\
              <thead style="background-color:#FFD771">\
                <tr>\
                  <th>Image</th>\
                  <th>Name</th>\
                  <th>Occupancy</th>\
                  <th>Size</th>\
                  <th>View</th>\
                  <th>type</th>\
                  <th>price</th>\
                </tr>\
              </thead>\
              <tbody>\
                '+body+'\
                <tr>\
                  <td colspan="6">\
                    <strong>Total Price per night :</strong>\
                  </td>\
                  <td>\
                    <strong>IDR '+formatDollar(price)+' per night</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="6">\
                    <strong>Nights :</strong>\
                  </td>\
                  <td>\
                    <strong>'+diffDays+' nights</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="6">\
                    <strong>Total Price :</strong>\
                  </td>\
                  <td>\
                    <strong>IDR '+formatDollar(total)+'</strong>\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="7">\
                    From '+start+' to '+end+'\
                  </td>\
                </tr>\
                <tr>\
                  <td colspan="7">\
                    Special request: '+dat.specialrequest+'\
                  </td>\
                </tr>\
              </tbody>\
            </table>\
            <div class="transfer-info">\
              <p>'+info.content+'</p>\
            </div>'
                };
              smtpTransport.sendMail(mailOptions, function(error, response){
                  if(error){
                      console.log(error);
                  }else{
                      console.log("Message sent: " + response.message);
                  }

                  // if you don't want to use this transport object anymore, uncomment following line
                  //smtpTransport.close(); // shut down the connection pool, no more messages
              });
            });
            res.clearCookie('start');
            res.clearCookie('end');
            res.clearCookie('adult');
            res.clearCookie('children');
            res.clearCookie('choose');
            res.jsonp({success:1});
        });
    };
};
exports.guestdetail=function(req,res){
    if(req.user){
    User.findOne({_id:req.user._id},{password:0}).exec(function(err,user){
        if(err){
            console.log(err);
        }
        res.jsonp(user);
    });
    }
};
/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};
exports.history= function(req,res){
  res.cookie('url', req.body.url, { signed: true });
  res.redirect('/auth/facebook');
}
exports.ticket=function(req,res){
    Info.findOne({id:"transfer"}).exec(function(err,info){
        Booking.findOne({user:req.user._id}).sort({created:-1}).limit(1).populate('bookings.roomsId').exec(function(err,dat){
            if(err){
                console.log(err);
            }
            var price=0;
            for (var i=0; i<dat.bookings.length; i++) {
                price=price+dat.bookings[i].roomsId.price;
                dat.bookings[i].roomsId.prices=formatDollar(dat.bookings[i].roomsId.price);
            }
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            var firstDate = dat.start;
            var secondDate = dat.end;
            
            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            var total=diffDays*price;
            res.jsonp({transfer:info.content,price:formatDollar(price),day:diffDays,total:formatDollar(total),data:dat,start:firstDate.getDate()+' '+firstDate.getUTCMonth()+' '+firstDate.getFullYear(),end:secondDate.getDate()+' '+secondDate.getUTCMonth()+' '+secondDate.getFullYear()});
        });
    });
};
