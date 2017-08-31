var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;

var state = {
  db: null,
}


function connect(){
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
     state.db = db; 
      console.log('Connection established to', MONGODB_URI);
      //console.log(db);
    })
    .catch(function (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      throw err;
    });
}

function getDb() {
  return state.db;
}

function add(record){
  console.log("add = ", getDb());
       getDb().collection(collection).insert(record,function(err,data){
         if(err) throw err; 
         console.log(JSON.stringify(record));        
     });
     
}


function close(){
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
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