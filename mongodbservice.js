var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;

var state1 = {
  db: null,
}


function connect(){
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
     state1.db = db; 
      console.log('Connection established to', MONGODB_URI);
      //console.log(db);
    })
    .catch(function (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      throw err;
    });
}

function getDb() {
  return state1.db;
}

function add(record){
  console.log("add = ", getDb());
//       getDb().collection(collection).insert(record,function(err,data){
//         if(err) throw err; 

//         console.log(JSON.stringify(record));        
//     });
     
}


function close(){
  if (state1.db) {
    state1.db.close(function(err, result) {
      state1.db = null
      state1.mode = null
    });
  }
}

var asyncDatastore = {
  // set: set,
  // get: get,
  // remove: remove,
  // removeMany: removeMany,
  connect: connect,
  close: close,
  getDb : getDb,
  add : add
};
 
module.exports = {
  async: asyncDatastore
};