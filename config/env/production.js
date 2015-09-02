'use strict';
var hostdb=process.env.OPENSHIFT_MONGODB_DB_HOST;
module.exports = {
    db: "mongodb://admin:upXgZMjFFg_f@"+hostdb+":$OPENSHIFT_MONGODB_DB_PORT/cakra",
    app: {
        name: "Cakra Kusuma Hotel"
    },
    facebook: {
        "clientID": "1404267519826263",
        "clientSecret": "c7c8a877fa65268ef4c4d946a29cd6ee",
        "callbackURL": "http://www.cakrakusumahotel.com/auth/facebook/callback"
    },
    twitter: {
        clientID: "CONSUMER_KEY",
        clientSecret: "CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}
