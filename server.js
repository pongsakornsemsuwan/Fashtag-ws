/**
 * Created by Pongsakorn on 2/2/2015.
 */

var restify = require('restify');
var passport = require('passport');
var user = require('./controllers/UserService.js');
var photo = require('./controllers/PhotoService.js');
require('./controllers/auth.js');

global.config = require('./config.js')[process.env.NODE_ENV || 'development'];


var server = restify.createServer();
server.use(restify.bodyParser());
server.use(passport.initialize());

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

server.get('/users/:userService-id',
  passport.authenticate('basic',{ session: false}),
  function(req,res){user.getUser(req,res)}
);


server.post('/users/login', function( req,res,next){
  user.login(req, res );
});

server.get('/users/self/feed', function( req,res,next){
  user.getOwnFeed(req, res, next);
});

server.get('/users/:userService-id/media/recent', function ( req, res, next){

});

server.get('/users/search', function searchUsers( req, res, next){

});

/* ------------ PHOTO ---------------- */

//add photo
server.post('/photo/', function addPhoto( req, res, next ){

});

//get single photo
server.get('/photo/:photo-id', function getPhoto( req, res, next ){
  photo.getPhoto( req, res, next);
  next();
});

//get photos
server.get('/photo/search', function searchPhoto( req, res, next ){

});


/* --------- RELATIONSHIP ----------- */

//Get the list of users this userService follows
server.get('/users/:userService-id/follows', function getFollow( req, res, next){

});

//Get the list of users this userService is followed by.  (get follower)
server.get('/users/:userService-id/followed-by', function getFollower( req, res, next){

});

//Modify the relationship between the current userService and the target userService.
//One of follow/unfollow/block/unblock/approve/ignore.
server.post('/users/:userService-id/relationship', function modifyRelation( req, res, next){

});


/* --------- OBJECT ----------- */
server.get('/object/:object-id', function getObject( req, res, next){

});





server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
