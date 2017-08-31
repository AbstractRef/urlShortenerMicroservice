var MongoClient = require('mongodb').MongoClient
var tst = "Hello"
var db1 = null;
var state = {
  db: null,
}
exports.connect = function(url, done) {
  //if (db1) return true;
  MongoClient.connect(url, function(err, db) {
    console.log("connecting ");
    if (err) return done(err)
    db1 = db;
    console.log("db1",db1);
  })
}

exports.get = function() {
  tst = "Goodbye";
  return db1;
}

exports.getTst = function(){
  return tst;
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}