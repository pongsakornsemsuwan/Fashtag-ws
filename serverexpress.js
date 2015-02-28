/**
 * Created by Pongsakorn on 2/2/2015.
 */
var express = require('express');

var bodyParser = require('body-parser');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy
var LocalStrategy = require('passport-local').Strategy;
//var userService = require('./userService.js');
//var photo = require('./PhotoService.js');
//var auth = require('./auth.js');

var app = express();

console.log(passport.initialize());
//passport.use(new BasicStrategy(
//  function(username, password, callback) {
//
//    console.log('hello');
//    return callback(null, true);
//
//    // Make sure the password is correct
//    userService.verifyPassword(username, password, function (err, isMatch) {
//      if (err) {
//        return callback(err);
//      }
//
//      // Password did not match
//      if (!isMatch) {
//        return callback(null, false);
//      }
//
//      // Success
//      return callback(null, userService);
//    });
//  }
//));

passport.use(new BasicStrategy(
  function(username, password, done) {
    console.log('instragefy');
    return done(null,true);

    if (username.valueOf() === 'qwe' &&
      password.valueOf() === 'qwe')
      return done(null, true);
    else
      return done(null, false);
  }
));


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());

var router = express.Router();

router.route('/hello/:name').get(respond);

router.route('/hello/:name').post(respond);

router.route('/users')
  .get( passport.authenticate('basic', {session: false}), function(req,res){
    res.end('eya');
  });

router.route('/users').post(
  function(req,res,next) {
    console.log('11');
    //passport.authenticate('local-login', {session: false}, function () {
    //  console.log('done');
    //  res.end();
    //})

    res.end('11');
  }
);

router.route('/usersasd').get(
  //function(req,res,next){
  //  console.log('aaaa');
  //  res.send('heaaallo ' + req.params.name);
  //  next();
  //}
  function(req,res,next) {
    passport.authenticate('local-login', {session: false}, function () {
      console.log('done');
      res.end();
      next();
    })
  }
);

app.use('/api-doc',router);
//app.get('/hello/:name', respond);
//
//app.head('/hello/:name', respond);


/* ------------ USER ----------------- */

//app.post('/users/add',
//  function( req,res,next){
//    userService.addUser(req, res );
//  });
//
//app.post('/users/:userService-id', function( req,res,next) {
//    passport.authenticate('basic',{ session: false}, function(){
//      console.log('done');
//      res.end();
//    });
//
//    //auth.isAuthenticated( res, res, next, function(){
//    //  userService.getUser(req, res);
//    //})
//    //return next;
//  }
//);
//
//app.post('/users/login', function( req,res,next){
//  userService.login(req, res );
//});
//
//app.get('/users/self/feed', function( req,res,next){
//  userService.getOwnFeed(req, res, next);
//});
//
//app.get('/users/:userService-id/media/recent', function ( req, res, next){
//
//});
//
//app.get('/users/search', function searchUsers( req, res, next){
//
//});





app.listen(8080, function() {
  console.log('%s listening at %s', app.name, app.url);
});
