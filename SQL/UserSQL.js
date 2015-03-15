/**
 * Created by Pongsakorn on 2/8/2015.
 */

var sql = {
  ADD_USER :
  ' INSERT INTO users ( ' +
  ' username, ' +
  ' password, ' +
  ' email, ' +
  ' create_dt, ' +
  ' rev_dt )' +
  ' VALUES( $1, $2, $3, current_timestamp , current_timestamp )' +
  ' RETURNING user_id, username',

  GET_USER_BY_TOKEN : 'SELECT ',

  GET_USER_BY_USERNAME :
  ' SELECT user_id, ' +
  ' username, ' +
  ' password, ' +
  ' profile_picture_big,' +
  ' profile_picture_medium, ' +
  ' profile_picture_small, ' +
  ' display_name, ' +
  ' email, ' +
  ' user_info ' +
  ' FROM users ' +
  ' WHERE username = $1 ',

  GET_USER_BY_USERID :
  ' SELECT user_id, ' +
  ' username, ' +
  ' password, ' +
  ' profile_picture_big,' +
  ' profile_picture_medium, ' +
  ' profile_picture_small, ' +
  ' display_name, ' +
  ' email, ' +
  ' user_info, ' +
  ' case (select exists(select activity_id from activity where source_user_id=$1 and target_user_id=$2))' +
  ' when \'t\' then \'following\' ' +
  ' when \'f\' then \'not following\' ' +
  ' end as is_following' +
  ' FROM users u ' +
  ' WHERE u.user_id = $2 ',


  GET_USER_PROFILE :
  ' SELECT user_id, ' +
  ' display_name, ' +
  ' user_info, ' +
  ' website, ' +
  ' coalesce( ' +
  ' (SELECT true ' +
  '   FROM activity a, activity_type at ' +
  '   WHERE source_user_id = 1 ' +
  '   AND target_user_id = 2 ' +
  '   AND a.activity_type_id = at.activity_type_id ' +
  '   AND at.activity_type_cd = \'FLW\') , true ) AS is_following, ' +
  ' (SELECT count(user_id) ' +
  '   FROM activity a, activity_type at ' +
  '   WHERE source_user_id = 2 ' +
  '   AND a.activity_type_id = at.activity_type_id ' +
  '   AND at.activity_type_cd = \'FLW\') AS following_count, ' +
  ' (SELECT count(user_id) ' +
  '   FROM activity a, activity_type at ' +
  '   WHERE target_user_id = 2 ' +
  '   AND a.activity_type_id = at.activity_type_id ' +
  '   AND at.activity_type_cd = \'FLW\') AS follower_count ' +
  ' FROM users ' +
  ' WHERE user_id = 1 ' +
  ' GROUP BY user_id',

  UPDATE_USER_PROFILE :
    ' UPDATE users' +
    ' SET username = $1, ' +
    ' display_name = $2,' +
    ' user_info = $3,' +
    ' website = $4, ' +
    ' profile_picture_big = $5,' +
    ' profile_picture_medium = $6,' +
    ' profile_picture_small = $7,' +
    ' rev_dt = current_timestamp' +
    ' WHERE user_id = $8' +
    ' RETURNING user_id, username, display_name, user_info, website' +
    ' profile_picture_big, profile_picture_medium, profile_picture_small',

  UPDATE_USER_EMAIL :
    ' UPDATE users ' +
    ' SET email = $1, ' +
    ' WHERE user_id = $2 ' +
    ' RETURNING user_id, username, email '


}

module.exports = sql;
