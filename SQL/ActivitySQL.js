/**
 * Created by Pongsakorn on 2/9/2015.
 */

var sql = {

  FOLLOW :
  ' INSERT INTO activity ( user_id, access_token, create_dt)' +
  ' VALUES ( $1, $2, current_timestamp )',

  UNFOLLOW :
  ' UPDATE user_login ' +
  ' SET EXPIRE_DT = current_timestamp ' +
  ' WHERE access_token = $1 ' +
  ' AND user_id = $2 '


}

module.exports = sql;
