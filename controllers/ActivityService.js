/**
 * Created by Pongsakorn on 2/10/2015.
 */


var activityService = {

  follow : function(req, res, next){
    pg.connect(conString, function (err, client, done){

      activityDAO.follow(client, fromUserId, toUserId, function(err, result){
        done();
        if(err){
          res.send(err);
          res.end();
        }else{
          res.send(err);
          res.end();
        }
        next();
      })

    })
  },

  unfollow : function(req, res, callback){
    pg.connect(conString, function (err, client, done){

      activityDAO.unfollow(client, fromUserId, toUserId, function(err, result){
        done();
        return callback(err, result);
      })

    })
  },

  like : function(req, res, callback) {
    pg.connect(conString, function (err, client, done){

      activityDAO.like(client,fromUserId, toUserId, photoId, function(err, result){
        done();
        return callback(err, result);
      });
    })
  },

  unlike : function(req, res, callback) {
    pg.connect(conString, function (err, client, done){

      activityDAO.unlike(client,fromUserId, toUserId, photoId, function(err, result){
        done();
        return callback(err, result);
      });
    })
  },

  comment : function(req, res, callback) {
    pg.connect(conString, function (err, client, done){

      activityDAO.addComment(client,fromUserId, toUserId, photoId, function(err, result){
        done();
        return callback(err, result);
      });
    })
  },

  deleteComment : function(req, res, callback) {
    pg.connect(conString, function (err, client, done){

      activityDAO.deleteComment(client,fromUserId, toUserId, photoId, function(err, result){
        done();
        return callback(err, result);
      });
    })
  }
}

module.exports = activityService;
