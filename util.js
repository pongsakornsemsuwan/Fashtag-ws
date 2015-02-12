/**
 * Created by Pongsakorn on 2/4/2015.
 */

var util = {

  rowToJSON:function rowToJSON(row){
    try {
      row.data = JSON.parse(row.data);
    } catch (e) {
      row.data = null;
    }
    return row;
  }
};



module.exports = util;