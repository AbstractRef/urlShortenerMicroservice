var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;

var state = {
  db: null,
}

function connect(){
  if (state.db) return;
  
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
     state.db = db; 
      console.log('Connection established to', MONGODB_URI);
      return;
    })
    .catch(function (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      throw err;
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

function getDb() {
  if (!state.db) {
    connect();
  }
  return state.db;
}

function add(record){
  getDb().collection(collection).insert(record,function(err,data){
    if(err) throw err; 
      console.log(JSON.stringify(record));        
    });
}

function findByUrl(url){
  return true;
}

function findByShortCode

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