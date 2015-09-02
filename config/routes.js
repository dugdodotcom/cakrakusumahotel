'use strict';
var _ = require('lodash');
module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.post('/history/fb', users.history);

    //Setting up the users api
    app.post('/users', users.create);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);
    
    
    //Finish with setting up the userId param
    app.param('userId', users.user);
    //Home route
    var index = require('../app/controllers/index');
    require('../app/controllers/socket');
    app.get('/sitemap.xml', function (req, res) {
      res.render('sitemap');
    });
    app.get('/', index.home);
    app.get('/index.php/home/:link', index.info);
    app.get('/index.php/home/accomodation/:link', index.info);
    app.get('/index.php/home/accomodation/:link', index.info);
    app.get('/index.php/home/guestbook/1', index.guestbook);
    app.get('/index.php/photo-gallery', index.photogallery);
    app.get('/index.php/facilities/:link', index.info);
    app.get('/index.php/package/:link', index.info);
    app.get('/index.php/reservations/:link', index.info);
    app.get('/index.php/contact/:link', index.info);
    app.get('/index.php/career/:link', index.info);
    app.get('/index.php/contact-us', index.contactus);
    app.get('/index.php/testimonials', index.testimonials);
    app.get('/index.php/contact-us/:level', index.contactform);
    app.post('/contactsubmit', index.contactsubmit);
    app.get('/contactconfirm', index.contactconfirm);
    app.get('/testimoniconfirm', index.testimoniconfirm);
    app.get('/guestbookconfirm', index.guestbookconfirm);
    app.get('/index.php/blog', index.blog);
    app.get('/index.php/blog/:url', index.blogdetail);
    app.get('/blogcomment', index.blogcomment);
    //reservation
    var reservation=require('../app/controllers/reservations');
    app.post('/reservationpost',reservation.post);
    app.get('/index.php',reservation.booking);
    app.get('/choosedata',reservation.choosedata);
    app.post('/addroom',reservation.addroom);
    app.post('/onchange',reservation.onchange);
    app.get('/choosenroom',reservation.choosenroom);
    app.get('/clearroom',reservation.clearroom);
    app.get('/cekchoose',reservation.cekchoose);
    app.get('/guestdetail',users.guestdetail);
    app.post('/bookinginput',users.booking);
    app.get('/ticket',users.ticket);
    app.post('/inputdate',reservation.inputdate);
    //Admin
    var admins = require('../app/controllers/admins/index');
    var infos=require('../app/controllers/infos');
    var contacts=require('../app/controllers/contacts');
    var galleries=require('../app/controllers/galleries');
    var slides=require('../app/controllers/slides');
    var bookings=require('../app/controllers/bookings');
    var testimonies=require('../app/controllers/testimonies');
    var guestbooks=require('../app/controllers/guestbooks');
    var blogs=require('../app/controllers/blogs');
    app.get('/admin1234567890/', auth.requiresLogin,auth.admin.hasAuthorization,admins.render);    
    app.get('/rooms',  reservation.all);
    app.post('/server/upload/url', auth.requiresLogin, auth.admin.hasAuthorization, reservation.upload);
    app.post('/rooms', auth.requiresLogin, auth.admin.hasAuthorization, reservation.create);
    app.get('/rooms/:roomId', auth.requiresLogin, auth.admin.hasAuthorization, reservation.show);
    app.put('/rooms/:roomId', auth.requiresLogin, auth.admin.hasAuthorization, reservation.update);
    app.delete('/rooms/:roomId', auth.requiresLogin, auth.admin.hasAuthorization, reservation.destroy);
    app.post('/available', auth.requiresLogin, auth.admin.hasAuthorization,  reservation.available);
    app.get('/infos', auth.requiresLogin, auth.admin.hasAuthorization,  infos.all);
    //app.post('/upload/gallery', infos.upload);
    app.post('/infos/:home/:infoId', auth.requiresLogin, auth.admin.hasAuthorization, infos.create);
    app.get('/infos/:home/:infoId', auth.requiresLogin, auth.admin.hasAuthorization, infos.show);
    app.put('/infos/:home/:infoId', auth.requiresLogin, auth.admin.hasAuthorization, infos.update);
    app.delete('/infos/:home/:infoId', auth.requiresLogin, auth.admin.hasAuthorization, infos.destroy);
    app.post('/contacts/:level', auth.requiresLogin, auth.admin.hasAuthorization, contacts.create);
    app.post('/contacts/:level/update', auth.requiresLogin, auth.admin.hasAuthorization, contacts.update);
    app.get('/contacts/:level', auth.requiresLogin, auth.admin.hasAuthorization, contacts.show);
    app.get('/contacts/:level/:page', auth.requiresLogin, auth.admin.hasAuthorization, contacts.show);
    app.post('/contactreplied', auth.requiresLogin, auth.admin.hasAuthorization,  contacts.contactreplied);
    app.post('/chatadmin', auth.requiresLogin, auth.admin.hasAuthorization, contacts.chatadmin);
    app.post('/submitnotregister',contacts.submitnotregister)
    app.get('/galleries/:galleryId', auth.requiresLogin, auth.admin.hasAuthorization, galleries.show);
    app.post('/galleries/upload', auth.requiresLogin, auth.admin.hasAuthorization, galleries.upload);
    app.get('/galleries', auth.requiresLogin, auth.admin.hasAuthorization,  galleries.all);
    app.get('/galleriessee',  galleries.see);
    app.delete('/galleries/:galleryId', auth.requiresLogin, auth.admin.hasAuthorization, galleries.destroy);
    app.post('/galleryactive', auth.requiresLogin, auth.admin.hasAuthorization,galleries.active);
    app.get('/slides/:slideId', auth.requiresLogin, auth.admin.hasAuthorization, slides.show);
    app.post('/slides/upload', auth.requiresLogin, auth.admin.hasAuthorization, slides.upload);
    app.delete('/slides/:slideId', auth.requiresLogin, auth.admin.hasAuthorization, slides.destroy);
    app.get('/slides', auth.requiresLogin, auth.admin.hasAuthorization,  slides.all);
    app.get('/bookings/page', auth.requiresLogin, auth.admin.hasAuthorization,  bookings.all);
    app.get('/bookings/page/:page', auth.requiresLogin, auth.admin.hasAuthorization,  bookings.all);
    app.delete('/bookings/delete/:bookingId', auth.requiresLogin, auth.admin.hasAuthorization,  bookings.destroy);
    app.post('/bookaction', auth.requiresLogin, auth.admin.hasAuthorization,  bookings.action);
    app.get('/testimonies', auth.requiresLogin, auth.admin.hasAuthorization,testimonies.all);
    app.get('/testimonies/:testimoniId', auth.requiresLogin, auth.admin.hasAuthorization, testimonies.show);
    app.post('/testimoniactive', auth.requiresLogin, auth.admin.hasAuthorization,testimonies.active);
    app.put('/testimonies/:testimoniId', auth.requiresLogin, auth.admin.hasAuthorization, testimonies.update);
    app.delete('/testimonies/:testimoniId', auth.requiresLogin, auth.admin.hasAuthorization, testimonies.destroy);
    app.post('/testimonialpost',testimonies.create);  
    app.get('/guestbooks', auth.requiresLogin, auth.admin.hasAuthorization,guestbooks.all);
    app.get('/guestbooks/:guestbookId', auth.requiresLogin, auth.admin.hasAuthorization, guestbooks.show);
    app.post('/guesbookactive', auth.requiresLogin, auth.admin.hasAuthorization,guestbooks.active);
    app.put('/guestbooks/:guestbookId', auth.requiresLogin, auth.admin.hasAuthorization, guestbooks.update);
    app.delete('/guestbooks/:guestbookId', auth.requiresLogin, auth.admin.hasAuthorization, guestbooks.destroy);
    app.post('/guestbookpost',guestbooks.create);    
    app.get('/blogs',  blogs.all);
    app.post('/blogs', auth.requiresLogin, auth.admin.hasAuthorization, blogs.create);
    app.get('/blogs/page/:page', auth.requiresLogin, auth.admin.hasAuthorization, blogs.all);
    app.get('/blogs/detail/:blogId', auth.requiresLogin, auth.admin.hasAuthorization, blogs.show);
    app.put('/blogs/:blogId', auth.requiresLogin, auth.admin.hasAuthorization, blogs.update);
    app.delete('/blogs/:blogId', auth.requiresLogin, auth.admin.hasAuthorization, blogs.destroy);
    app.post('/blogpublish', auth.requiresLogin, auth.admin.hasAuthorization, blogs.blogpublish);
    app.post('/blog/upload/url', auth.requiresLogin, auth.admin.hasAuthorization, blogs.upload);
    //Finish with setting up the articleId param   
    app.param('link', index.link);    
    app.param('roomId', reservation.room);
    app.param('infoId', infos.info);
    app.param('home', infos.home);
    app.param('galleryId', galleries.gallery);
    app.param('slideId', slides.slide);
    app.param('level', contacts.contact);
    app.param('level', index.contact);
    app.param('bookingId', bookings.booking);
    app.param('testimoniId', testimonies.testimoni);
    app.param('guestbookId', guestbooks.guestbook);
    app.param('blogId', blogs.blog);
};
