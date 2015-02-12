/**
 * Created by Pongsakorn on 2/9/2015.
 */

var sql = {

  ADD_TOKEN :
  ' INSERT INTO user_login ( user_id, access_token, create_dt)' +
  ' VALUES ( $1, $2, current_timestamp )',

  EXPIRE_TOKEN :
  ' UPDATE user_login ' +
  ' SET EXPIRE_DT = current_timestamp ' +
  ' WHERE access_token = $1 ' +
  ' AND user_id = $2 '


}

module.exports = sql;
