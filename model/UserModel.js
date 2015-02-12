/**
 * Created by Pongsakorn on 2/9/2015.
 */

function UserModel(){
  this.userId = null;
  this.username = null;
  this.password = null;
  this.displayName = null;
  this.website = null;
  this.userInfo = null;
  this.profilePictureBig = null;
  this.profilePictureMedium = null;
  this.profilePictureSmall = null;

}

UserModel.prototype = {
  constructor: UserModel,
  getUserId : function(){
    return this.userId;
  },
  getUsername : function() {
    return this.username;
  },
  getPassword : function() {
    return this.password;
  },
  getDisplayName : function() {
    return this.displayName;
  },
  getWebsite : function() {
    return this.website;
  },
  getInfo : function(){
    return this.userInfo;
  }

}

module.exports = UserModel;

