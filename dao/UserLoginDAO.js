/**
 * Created by Pongsakorn on 2/9/2015.
 */
var UserLoginSQL = require('./../SQL/UserLoginSQL.js');

var userLoginDAO = {

  addToken : function (client, userId, accessToken, callback){
    console.log('userId='+ userId);
    client.query( UserLoginSQL.ADD_TOKEN, [ userId, accessToken], function(err, result){
      return callback(err, result);
    })
  },

  expireToken : function (client, userId, accessToken, callback){
    client.query( UserLoginSQL.EXPIRE_TOKEN, [accessToken, userId], function( err, result ){
      return callback(err, result);
    })
  }

}

module.exports = userLoginDAO;