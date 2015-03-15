/**
 * Created by Pongsakorn on 2/3/2015.
 */

var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var jwt = require('jwt-simple');
var restify = require('restify');
var util = require('./../util.js');
var userDAO = require('./../dao/UserDAO.js');
var userLoginDAO = require('./../dao/UserLoginDAO.js');

var User = require('./../model/UserModel.js');

var secret = 'shh';

var userService = {

  /**
   * 1. Check if userService already exist
   * 2. Add userService to DB
   * 3. Generate access_token
   * 4. Send userService model + access_token back to client
   * @param req
   * @param res
   */
  signup : function ( req, res, callback){

    var username = req.params['username'];
    var password = req.params['password'];
    var email = req.params['email'];

    //bcrypt.genSaltSync(5);
    var hashPassword = bcrypt.hashSync(password);
    var userModel;

    pg.connect(config.dbConnectionUrl, function (err, client, done){

      async.series([
        function(callback){
          userDAO.getUserByUsername(client, username, function(err,result){

            if(result.rows.length != 0){

              return callback(new restify.ForbiddenError("username already exist"));
            }

            return callback(err);
          })
        },
        function(callback){
          userDAO.addUser(client, username, hashPassword, email, function(err, result){
            try {
              userModel = result.rows[0];
            }catch(e){
              console.log(e);
            }
            return callback(err);
          });
        },
        function(callback){
          var token = jwt.encode(userModel, secret);
          userLoginDAO.addToken(client, userModel.user_id , token, function(err, result){
            if(err){
              done(client);
              return callback(err);
            } else {
              userModel.access_token = token;
            }
            return callback(err);
          });
        }
      ], function (err, results){
        done();
        if(err){
          console.log('err y');

          return callback(err, err);
        } else {
          console.log('no err');
          return callback(null, userModel);
        }
      });
    })
  },

  login : function ( username, password, callback){
    console.log('hellooo' + config.conString);
    var userModel;
    pg.connect(config.dbConnectionUrl, function( err, client, done){

      async.series([
        //SELECT USER
        function (callback) {
          console.log('async1');
          userDAO.getUserByUsername(client, username , function (err, result) {
            if (err) {
              return callback(err);
            } else {
              if (result.rows.length == 0) {
                console.log('row = 0');
                return callback(new restify.ForbiddenError('incorrect username/password'));
              } else {
                console.log('row !=0');
                var dbPassword = result.rows[0].password;
                console.log('dbPassword = ' + dbPassword);
                var isMatch = bcrypt.compareSync(password, dbPassword);
                console.log('isMatch');
                if (!isMatch) {
                  return callback(new restify.ForbiddenError('incorrect username/password'));
                } else {
                  //return callback(null, result.rows[0]);
                  userModel = result.rows[0];
                  return callback(null);
                }
              }
            }
          });
        },
        //ADD RECORD TO USER_LOGIN
        function (callback){
          console.log('async2');
          var userToken = { user_id : userModel.user_id, create_dt : new Date()};
          var token = jwt.encode(userToken, secret);
          console.log('token=' + token);
          console.log('token=' + token.length);
          console.log(jwt.decode(token,secret));
          userLoginDAO.addToken(client, userModel.user_id, token, function(err, result){
            if(err){
              done(client);
              return callback(err);
            } else {
              userModel.access_token = token;
              delete userModel.password;
              return callback(null);
            }
          });
        }
      ], function(err,results){
        done();
        return callback(err, userModel);
      })
    });
  },

  logout : function( req, res, callback ){

    var accessToken = req.params['access_token'];
    var userId = req.params['user_id'];

    pg.connect(config.dbConnectionUrl, function( err, client, done){
      async.series([
        function (callback){
          userLoginDAO.expireToken(client, userId, accessToken, function (err, result) {
            return callback(err);
          })
        }
      ], function(err,results){
        done();
        if(!err){
          var result = {message:'successfully logout'};
        }
        return callback(err, result);
      })
    });
  },

  getUserProfile : function getUser(req, res, callback ){
  console.log(req.params);
    //var userId = jwt.decode(req.params['access_token'], config.bcryptSecret, null).userId;
    var targetUserId = req.params['user_id'];
    var sourceUserId = req.params['src_user_id'];

    console.log(targetUserId);
    console.log(sourceUserId);

    var userModel;
    pg.connect(config.dbConnectionUrl, function (err, client, done) {
      console.log('hi');
      userDAO.getUserByUserId( client, sourceUserId, targetUserId, function (err, result, done){
        console.log('yo');

        if (result.rows.length != 0) {
          userModel = result.rows[0];
          if(targetUserId === sourceUserId ){
            userModel.is_following = 'yourself';
          }
        }


        return callback(err, userModel);

      });

    });
  },

  updateProfile : function (req, res, callback){

    //it should be faster to get from req than decode token.
    //var userId = jwt.decode(req.params['access_token'], secret).userId;
    var userModel = new User();
    userModel.userId = req.params['user_id'];
    userModel.username = req.params['username'];
    userModel.displayName = req.params['display_name'];
    userModel.userInfo = req.params['user_info'];
    userModel.website = req.params['website'];

    pg.connect(config.dbConnectionUrl, function(err, client, done){
      userDAO.updateUser(client, userModel, function(err, result){
        done();
        return callback(err, result);
      })
    })
  }

};

module.exports = userService;

