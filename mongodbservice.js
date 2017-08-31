var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;
var db1


function connect(){
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
    db1 = db;
      console.log('Connection established to', MONGODB_URI);
      //console.log(db);
    })
    .catch(function (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      throw err;
    });
}

function add(record){
      db1.collection(collection).insert(record,function(err,data){
        if(err) throw err;

        console.log(JSON.stringify(record));        
    });
      
}

function close(){
  db1.close();
}

var asyncDatastore = {
  // set: set,
  // get: get,
  // remove: remove,
  // removeMany: removeMany,
  connect: connect,
  close: close,
  add : add
};

module.exports = {
  async: asyncDatastore
};