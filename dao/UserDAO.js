/**
 * Created by Pongsakorn on 2/9/2015.
 */
var userSQL = require('./../SQL/userSQL.js');

var userDAO = {

  getUserByUsername : function (client, username, callback) {
    client.query(userSQL.GET_USER_BY_USERNAME, [username], function (err, result) {
      return callback(err, result);
    });
  },

  addUser : function (client, username, hashPassword, callback) {
    client.query(userSQL.ADD_USER, [username, hashPassword], function (err, result) {

      return callback(err, result);
    });
  },

  updateUser : function (client, userModel, callback){
    client.query( userSQL.UPDATE_USER,
      [userModel.username, userModel.displayName,
        userModel.userInfo, userModel.website, userModel.profilePictureBig,
      userModel.profilePictureMedium, userModel.profilePictureSmall, userModel.userId], function( err, result){
      return callback(err, result);
    });
  },

  updateUserEmail : function (client, userId, email, clalback){
    client.query( userSQL.UPDATE_USER_EMAIL, [email, userId], function( err, result){
      return callback(err, result);
    })
  }

}

module.exports = userDAO;