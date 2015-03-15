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

var userLoginService = {

  /**
   * 1. select userService from db
   * 2. compare dbpassword and enter password
   * 3. generate token and return to client
   * @param username
   * @param password
   * @param callback
   */
  getToken : function ( accessToken, callback){
    //get userService


    var userLogin;

    pg.connect(config.dbConnectionUrl, function( err, client, done) {
      userLoginDAO.getToken(client, accessToken, function(err, result){
        done();
        if (err) {
          return callback(err);
        } else {
          if (result.rows.length == 0) {
            console.log('row = 0');
            return callback(new restify.ForbiddenError('Unauthorized'));
          } else {

            userLogin = result.rows[0];
            return callback(null);

          }
        }
      })
    })
  }

};

module.exports = userLoginService;

