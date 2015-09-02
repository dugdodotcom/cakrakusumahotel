'use strict';

module.exports = function(sessionStore,io,express,mongoose) {
var Booking = mongoose.model('Booking'),
    passportSocketIo = require("passport.socketio");
io.set('authorization', passportSocketIo.authorize({
  cookieParser: express.cookieParser,
  key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
  secret:      'MEAN',    // the session_secret to parse the cookie
  store:       sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
  fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more bel
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);

  
  accept(null, false);
}

io.sockets.on('connection', function (socket) {
    socket.on('user',function(obj){
      console.log('user-----'+obj.level+socket.handshake.user._id);
      socket.join(obj.level+socket.handshake.user._id);
    });
    socket.on('admin',function(obj){
      console.log('admin-------'+obj.level);
      socket.join('admin'+obj.level);
    });
    socket.on('booking',function(obj){
      if(socket.handshake.user.email==='cakrakusuma@gmail.com'){
          socket.join('booking');
      }
    });
    socket.on('book',function(obj){
      var data='';
      var price=0;
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var firstDate='';
      var secondDate = '';
      var diffDays='';
      Booking.findOne().sort({created:-1}).populate('user bookings.roomsId').exec(function(err,dat){
          if(err){
              console.log(err);
          }
              price=0;
              for (var s=0; s<dat.bookings.length; s++) {
                  price=price+dat.bookings[s].roomsId.price;
              }
              firstDate = dat.start;
              secondDate = dat.end;
              diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
              dat.day=diffDays;
              dat.total=diffDays*price;
          io.sockets.in('booking').emit('booksend',dat);
      });
    });
    socket.on('adminchatadd',function(obj){
        console.log('sendadmin----'+obj.level+obj._id);
          io.sockets.in(obj.level+obj._id).emit('adminchattext', obj);
    });
    socket.on('userchatadd',function(obj){        
        if(socket.handshake.user.logged_in){
            passportSocketIo.filterSocketsByUser(io, function(user){
              return user.email==='cakrakusuma@gmail.com';
            }).forEach(function(socket){
              console.log('senduser----'+obj.level);
              io.sockets.in('admin'+obj.level).emit('userchattext', obj);
            });
        }
    });
});
}
