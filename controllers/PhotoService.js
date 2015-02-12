/**
 * Created by Pongsakorn on 2/3/2015.
 */

var pg = require('pg');
var conString = "postgres://postgres:3zq9hrd5@localhost/postgres";

var photoAPI = {
  getSinglePhoto : function getPhoto( req, res, next ){
    pg.connect(conString, function (err, client, done) {

      var query = 'SELECT ' +
        'photo.photo_url, users.username, photo.create_dt, users.create_dt as user_cre ' +
        'FROM photo,users ' +
        'where ' +
        'photo.photo_id = $1 and ' +
        'users.user_id = photo.user_id ';

      console.log(query);
      client.query( query , [req.params['photo-id']], function (err, result) {

        // handle an error from the query
        if ( err ){
          done(client);
          res.writeHead(500, {'content-type': 'text/plain'});
          res.end('An error occurred');
        } else {
          // return the client to the connection pool for other requests to reuse
          done();

          if (result.rows.length == 0) return res.json(result.rows);

          result.rows.map(function(row){
            try {
              row.data = JSON.parse(row.data);
            } catch (e) {
              row.data = null;
            }

            return row;
          });

          res.json(result.rows);
          res.end('Here\'s your photo ');

        }
      });
    });
  },

  /**
   *
   * @param req
   * @param res
   * @param callback
   */
  getRecentPhoto : function(req, res, callback){

  },

  /**
   *
   * @param req
   * @param res
   * @param callback
   */
  getRecentBookmark : function (req, res, callback){

  }
};

module.exports = photoAPI;
