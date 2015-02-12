var locationService = {
  addLocation : function(req,res,callback){
    pg.connect(conString, function (err, client, done){

      locationDAO.addLocation(client,locationName, function(err, result){
        done();
        return callback(err, result);
      });
    })
  },

  searchLocation : function(req, res, callback){
    pg.connect(conString, function (err, client, done){

      locationDAO.getLocation(client,locationName, function(err, result){
        done();
        return callback(err, result);
      });
    })
  }
}