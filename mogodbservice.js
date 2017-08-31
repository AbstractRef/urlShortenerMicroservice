var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;


function connect(){
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
      console.log('Connection established to', MONGODB_URI);
      console.log(db);
    })
    .catch(function (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      throw err;
    });
}

var asyncDatastore = {
  // set: set,
  // get: get,
  // remove: remove,
  // removeMany: removeMany,
  connect: connect
};

module.exports = {
  async: asyncDatastore
};