/**
 * Created by Pongsakorn on 2/5/2015.
 */
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy
var LocalStrategy = require('passport-local').Strategy;
var config = require('./../authconfig.js');
var userService = require('./UserService.js');

//NORMAL LOGIN
passport.use(new BasicStrategy(
  function(username, password, done) {

    console.log('basic pwd =' + password + ';');
    userService.login(username,password, function(err, user, info){
      return done(null, user);
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {

    console.log('local pwd =' + password + ';');
    console.log('local');
    userService.login(username,password, function(err, user, info){
      return done(err, user);
    });
  }
));

//passport.use(new FacebookStrategy({
//    clientID: FACEBOOK_APP_ID,
//    clientSecret: FACEBOOK_APP_SECRET,
//    callbackURL: "http://localhost:3000/auth/facebook/callback",
//    enableProof: false
//  },
//  function(accessToken, refreshToken, profile, done) {
//    User.findOrCreate({ facebookId: profile.id }, function (err, userService) {
//      return done(err, userService);
//    });
//  }
//));

passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

//passport.use(new BearerStrategy({
//  },
//  function(token, done) {
//    // asynchronous validation, for effect...
//    process.nextTick(function () {
//
//      // Find the userService by token.  If there is no userService with the given token, set
//      // the userService to `false` to indicate failure.  Otherwise, return the
//      // authenticated `userService`.  Note that in a production-ready application, one
//      // would want to validate the token for authenticity.
//      findByToken(token, function(err, userService) {
//        if (err) { return done(err); }
//        if (!userService) { return done(null, false); }
//        return done(null, userService);
//      })
//    });
//  }
//));

exports.isAuthenticated =  passport.authenticate('basic', {session:false});