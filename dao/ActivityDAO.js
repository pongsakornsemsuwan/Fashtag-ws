/**
 * Created by Pongsakorn on 2/9/2015.
 */
var ActivitySQL = require('./../SQL/ActivitySQL.js');

var userLoginDAO = {

  follow : function (client, userId, accessToken, callback){
    console.log('userId='+ userId);
    client.query( ActivitySQL.FOLLOW, [ userId, accessToken], function(err, result){
      return callback(err, result);
    })
  }

}

module.exports = userLoginDAO;