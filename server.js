 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var mongodbService = require('./mongodbservice').async; 
const db = require('./db');


if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  

app.route('/add/:url')
.get(function(req, res, next){
  mongodbService.shortenUrl(req.params.url)
})
app.route('/close')
.get(function(req, res, next){
  mongodbService.close();
})

app.route('/find')
.get(function(req, res, next){
  mongodbService.findByUrl("http://www.google.com").then(function(result){
    console.log("find = ", result);
  }).then(function(){
      console.log(mongodbService.get());
  })
  mongodbService.close();

  res.send("found done");
             
})

function doAdd(){
    var firstName = "Frankie";
    var lastName = "Strachan";

    var record = {
      "firstName": firstName
    , "lastName": lastName
    }

  var collection = mongodbService.getDb().collection('docs'); 
collection.insert(record,function(err,data){
        if(err) throw err; 
        console.log(JSON.stringify(record));        
    });

} 

// mongodbService.connect();
// addARecord();
// mongodbService.close(); 

// // Use connect method to connect to the Server 
//   mongodb.MongoClient.connect(MONGODB_URI, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     console.log('Connection established to', MONGODB_URI);
//     // do some work here with the database.
//    //addARecord(db);
//     //findTerry(db); 
//     //Close connection
//     setTimeout(function(){db.close();}, 1000); 
    
//   }
// });

function addARecord(){
    var firstName = "Jackson";
    var lastName = "Strachan";

    var record = {
      "firstName": firstName
    , "lastName": lastName
    }
    mongodbService.add(record);      
}



function updateFindCount(db, uid){
            console.log("id = ", uid);
     
    db.collection('docs').update(
      {
        _id: uid
      },
      {
        $inc:{ "findCount" : 1}
      }
      ,function(err,data){
        console.log("error", err);
        console.log("data", data);
        if(err) throw err;
      });
}

app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});


// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  mongodbService.connect();
  console.log('Node.js listening ...');
});

