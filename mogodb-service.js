var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var collection = process.env.COLLECTION;


function connect(){
  mongodb.MongoClient.connect(MONGODB_URI)
    .then(function (db){
      console.log(db);
    })
    .catch(function (err) {
      throw err;
    });
}
 

// Use connect method to connect to the Server
  mongodb.MongoClient.connect(MONGODB_URI, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', MONGODB_URI);
    // do some work here with the database.
   //addARecord(db);
    //findTerry(db); 
    //Close connection
    setTimeout(function(){db.close();}, 1000); 
    
  }
});