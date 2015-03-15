/**
 * Created by Pongsakorn on 2/2/2015.
 */

var restify = require('restify');
var passport = require('passport');
var userService = require('./controllers/UserService.js');
var photo = require('./controllers/PhotoService.js');
require('./controllers/auth.js');

global.config = require('./config.js')[process.env.NODE_ENV || 'local'];

var server = restify.createServer();
server.use(restify.queryParser());
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

server.del('/auth',
  function(req, res, next) {
    userService.logout(req, res, function(err, result){
      sendResponse(err, result, res, next);
    })
  });

//server.post('/auth/facebook',
//  passport.authenticate('facebook-token',{ session: false}),
//  function (req, res) {
//    // do something with req.userService
//    res.send(req.userService? 200 : 401);
//  }
//);

//passport normal flow
server.post('/auth/signup',
  function ( req, res, next ){
    userService.signup(req, res, function(err, result){
      sendResponse(err, result, res, next);
  })
});


server.get('/user/:user_id',
  function(req, res, next) {
    passport.authenticate('bearer', function (err, user, info) {

      return next(err);

    })(req, res, next);
  },
  function(req, res, next){
    console.log(req.params);
    userService.getUserProfile( req, res, function (err, result){
      console.log('here');
      sendResponse(err, result, res, next);
  })
});

server.put('/user/:userId', function( req, res, next){
    userService.updateProfile(req, res, next);
});


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


function sendResponse(err, result, res, next){
  if(err){
    res.send(err);
  }else{
    res.send(result);
  }
  res.end();
  next();
}

server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
