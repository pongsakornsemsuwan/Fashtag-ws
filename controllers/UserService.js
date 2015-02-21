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

var userAPI = {

  /**
   * 1. Check if user already exist
   * 2. Add user to DB
   * 3. Generate access_token
   * 4. Send user model + access_token back to client
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


  /**
   * 1. select user from db
   * 2. compare dbpassword and enter password
   * 3. generate token and return to client
   * @param username
   * @param password
   * @param callback
   */
  login : function ( username, password, callback){
    //get userService

    console.log('hellooo' + config.conString);

    var userModel;

    pg.connect(config.dbConnectionUrl, function( err, client, done){

      async.series([
        function(callback) {
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
        function(callback){
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
        console.log('async callback');
        if(err){
          console.log('async callback err');
          return callback(err);
        }else {
          console.log('async callback normal');
          return callback(err, userModel);
        }
      })
    });
  },

  logout : function( req, res, next ){

    var accessToken = req.params['access_token'];
    var userId = req.params['user_id'];

    pg.connect(config.dbConnectionUrl, function( err, client, done){
      async.series([
        function(callback){

          userLoginDAO.expireToken(client, userId, accessToken, function (err, result) {
            return callback(err);
          })
        }
      ], function(err,results){
        done();
        if(err) {
          res.send(err);
          res.end();
        } else {
          res.send({message:'successfully logout'});
          res.end();
        }
        next();
      })

    });
  },

  /**
   * 
   * @param req
   * @param res
   */
  getUserProfile : function getUser(req, res ){

    var userId = jwt.decode(req.params['access_token'], config.bcryptSecret, null).userId;
    var targetUserId = req.params['user_id'];

    pg.connect(config.dbConnectionUrl, function (err, client, done) {

      console.log(client);
      var query =


      console.log(query);
      client.query(query, [userId], function (err, result) {

        if ( !err ){
          done();
          result.rows.map(function(row){
            util.rowToJSON(row);
          });
          res.json(result.rows);
          res.end();
        } else {
          done(client);
          res.writeHead(500, {'content-type': 'text/plain'});
          res.end('An error occurred');
        }
      });
    });
  },


  updateProfile : function (req, res, next){

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
        if(err) {
          res.send(err)
          res.end();
        }else{
          res.send(result);
          res.end();
        }
        next();
      })
    })
  },

  updateEmail : function (req, res, callback){

    //var userId = jwt.decode(req.params['access_token'], secret).userId;
    var userId = req.params['user_id'];
    var email = req.params['email'];

    pg.connect(config.dbConnectionUrl, function(err, client, done){

      userDAO.updateUserEmail(client, userId, email, function(err, result){

        done();
        return callback(err, result);
      })

    })
  },


  /**
   *
   * @param req
   * @param res
   */
  getOwnFeed : function getOwnFeed(req, res){
    pg.connect(config.dbConnectionUrl, function (err, client, done) {

      var handleError = function (err) {
        // no error occurred, continue with the request
        if (!err) return false;

        // An error occurred, remove the client from the connection pool.
        // A truthy value passed to done will remove the connection from the pool
        // instead of simply returning it to be reused.
        // In this case, if we have successfully received a client (truthy)
        // then it will be removed from the pool.
        done(client);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('An error occurred');
      };

      client.query('SELECT * FROM USER', function (err, result) {

        // handle an error from the query
        if (handleError(err)) return;

        // return the client to the connection pool for other requests to reuse
        done();
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Here\'s your own feed ');
      });
    });
  }

};

module.exports = userAPI;

