/**
 * Created by Pongsakorn on 2/9/2015.
 */
var userLoginSQL = require('./../SQL/UserLoginSQL.js');

var userLoginDAO = {

  addToken : function (client, userId, accessToken, callback){
    console.log('userId='+ userId);
    client.query( userLoginSQL.ADD_TOKEN, [ userId, accessToken], function(err, result){
      return callback(err, result);
    })
  },

  expireToken : function (client, userId, accessToken, callback){
    client.query( userLoginSQL.EXPIRE_TOKEN, [accessToken, userId], function( err, result ){
      return callback(err, result);
    })
  },

  getToken : function (client, accessToken, callback){
    client.query( userLoginSQL.GET_TOKEN, [accessToken], function (err, result ){
      return callback(err, result);
    })
  }

}

module.exports = userLoginDAO;