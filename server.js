'use strict';

/**
 * Module dependencies.
 */
 var http    = require('http'), 
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    express = require('express')
    ;
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

//Initializing system variables 
var config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose')
    ;

//Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);

var app = express(),
mongoStore = require('connect-mongo')(express);
//express settings
var sessionStore =new mongoStore({
                db: db.connection.db,
                collection: 'sessions'
            });
require('./config/express')(express,sessionStore,app, passport, db);

//Bootstrap routes
require('./config/routes')(app, passport, auth);
//require('./config/email')(nodemailer);

//Start the app by listening on <port>
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server = http.createServer(app)
// var io = require('socket.io').listen(server);
server.listen(port,ipaddr);
console.log('Express app started on port ' + port);
// require('./config/socket')(sessionStore,io,express,mongoose);
//Initializing logger
logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;
