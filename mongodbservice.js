var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;

var state = {
  db: null,
  record: null
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

function shortCodeUrlInfo(shortCode){
  if(findByShortCode(shortCode)){
    returnInfoResponse();
  }  
}

function returnInfoResponse(){
  //response json of doc info
}

function redirectShortCode(shortCode){
  if(findByShortCode(shortCode)){
     //response.redirect(doc.url)
  } else {
    returnNoUrlResponse();
  }
}

function returnNoUrlResponse(){
//response ("No URL");  
}

function shortenUrl(url){
  if(findByUrl(url)){
    incrementShortenCount();
  } else {
    if (isUrlValid(url)){
      createShortCode();
      storeNewUrl();
    }
  }
    returnShortenedResponse();
}
function createShortCode(){
  
}
function storeNewUrl(){
  
}

function returnShortenedResponse(){
  //return response  
}

// {
//   "shortCode" : "",
//   "url": "",
//   "createdDate" : "",
//   "shortenCount" : 1,
//    "redirectCount" : 0
// }

function findByUrl(url) {
  return new Promise(function(resolve, reject){
  var results = getDb().collection(collection)
     .find({url: { $eq : url } }, {shortCode: 1, url: 1, createdDate : 1, shortenCount:1, redirectCount:1, _id: 1 } ).toArray(function(err, doc) {
       console.log(doc.length);
    if(doc.length>0) { 
      state.record = doc;
      console.log(doc);
      resolve(true);      
    } else {
      console.log(err);
      state.record = null;
      resolve(false);
    }
  });

});
}

function findByShortCode(shortCode){
  return true;
}

function incrementVisitCount(){
  return true;
}

function incrementShortenCount(){
  return true;
}

function isUrlValid(url){
  return true;
}

var asyncDatastore = {
  // set: set,
  // get: get,
  // remove: remove,
  // removeMany: removeMany,
  connect: connect,
  close: close,
  getDb : getDb,
  add : add,
  findByUrl : findByUrl
};
 
module.exports = {
  async: asyncDatastore
};