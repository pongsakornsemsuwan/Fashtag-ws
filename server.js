/**
 * Created by Pongsakorn on 2/2/2015.
 */

var restify = require('restify');
var passport = require('passport');
var user = require('./controllers/UserService.js');
var photo = require('./controllers/PhotoService.js');
var fs = require('fs');
require('./controllers/auth.js');

global.config = require('./config.js')[process.env.NODE_ENV || 'local'];


restify.defaultResponseHeaders = function(data) {
  this.header('Access-Control-Allow-Origin', '*');
  this.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
};

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(passport.initialize());

server.get(/\/api-doc\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'doc.json'
}));

server.get(/\/swagger\/?.*/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));

server.get('/test',function(req,res,next){
  res.send('ok');
  res.next();
})

//passport custom callback
server.post('/auth',
  function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        res.send(err);
        res.end(err);
      }else{
        res.send(user);
        res.end();
      }

      return next(err);

    })(req, res, next);
  }
);

//server.post('/auth/facebook',
//  passport.authenticate('facebook-token',{ session: false}),
//  function (req, res) {
//    // do something with req.userService
//    res.send(req.user? 200 : 401);
//  }
//);

//passport normal flow
server.post('/signup',
  function ( req, res, next ){
    user.signup(req, res, function(err, result){

      if(err){
        res.send(err);
        res.end();
      }
      res.send(result);
      res.end();
    });
    next();
  }
);

server.post('/logout', function(req, res, next) {
  user.logout(req, res, next);
});

server.post('/editprofile',
  function( req, res){
    user.updateProfile(req, res, next);
  }
);

server.put('/editemail',
  function( req, res){
    user.updateEmail(req, res, function( err, result){
      res.send(result);
      res.end();
    })
  }
);

server.get('/users',
  passport.authenticate('basic',{ session: false}),
  function( req, res ){
      console.log('match');
      res.end('Authorized ja');
  }
);

server.post('/users',
  passport.authenticate('basic',{ session: false},
  function(req,res){
    console.log('done');
    res.end('it\'work');
  })
);

server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
