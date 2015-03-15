/**
 * Created by Pongsakorn on 2/5/2015.
 */
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
var LocalStrategy = require('passport-local').Strategy;
var config = require('./../authconfig.js');
var userService = require('./UserService.js');
var userLoginService = require('./UserLoginService.js');

//NORMAL LOGIN
//passport.use(new BasicStrategy(
//  function(username, password, done) {
//
//    console.log('basic pwd =' + password + ';');
//    userService.login(username,password, function(err, userService, info){
//      return done(null, userService);
//    });
//  }
//));

passport.use(new LocalStrategy(
  function(username, password, done) {

    console.log('local pwd =' + password + ';');
    console.log('local');
    userService.login(username,password, function(err, user, info){
      return done(err, user);
    });
  }
));

//passport.use(new FacebookTokenStrategy({
//    clientID: config.facebook.clientID,
//    clientSecret: config.facebook.clientSecret
//  },
//  function(accessToken, refreshToken, profile, done) {
//    User.findOrCreate({ facebookId: profile.id }, function (err, userService) {
//      return done(err, userService);
//    });
//  }
//));

passport.use(new BearerStrategy(
  function(token, done) {
    // asynchronous validation, for effect...
    console.log('tokenja');
    process.nextTick(function () {

      console.log('token='+token);
      // Find the userService by token.  If there is no userService with the given token, set
      // the userService to `false` to indicate failure.  Otherwise, return the
      // authenticated `userService`.  Note that in a production-ready application, one
      // would want to validate the token for authenticity.
      userLoginService.getToken(token, function(err, userLogin) {
        return done(err, userLogin);
      })
    });
  }
));

exports.isAuthenticated =  passport.authenticate('basic', {session:false});