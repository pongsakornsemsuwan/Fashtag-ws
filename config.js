/**
 * Created by Pongsakorn on 2/11/2015.
 */
var config =
{
  "local":
  {
    "url" : 123,
    "dbConnectionUrl" : 'postgres://postgres:3zq9hrd5@localhost/postgres'
  },

  "development":
  {
    "url" : 123,
    "dbConnectionUrl" : 'postgres://fashtag:3zq9hrd5@fashtag.cn1670bvaahe.ap-southeast-1.rds.amazonaws.com/postgres'
  },

  "production":
  {
    "port": 3000,
    "dbConnectionUrl": "3F8RRJR30UHERGUH8UERHGIUERHG3987GH8"
  }
}


module.exports = config;