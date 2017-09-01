var mongodb = require('mongodb');
var MONGODB_URI = 'mongodb://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST + ':' + process.env.DB_PORT + '/' + process.env.DB;
var collection = process.env.COLLECTION;

var state = {
	db: null,
	record: null
}

function connect() {
	if (state.db)
		return;

	mongodb.MongoClient.connect(MONGODB_URI)
	.then(function (db) {
		state.db = db;
		console.log('Connection established to', MONGODB_URI);
		return;
	})
	.catch (function (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
		throw err;
	});
}

function close() {
	if (state.db) {
		state.db.close(function (err, result) {
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

function get() {
	return state.record;
}

function add(record) {
	getDb().collection(collection).insert(record, function (err, data) {
		if (err)
			throw err;
		console.log(JSON.stringify(record));
	});
}

function shortCodeUrlInfo(shortCode) {
	if (findByShortCode(shortCode)) {
		returnInfoResponse();
	}
}

function returnInfoResponse() {
	//response json of doc info
}

function redirectShortCode(shortCode) {
  return new Promise(function (resolve, reject) {
    
	  findByShortCode(shortCode).then(function(result) {
      if (result) {
        incrementVisitCount();
        resolve(state.record[0].url);
  	  } else {
  		  reject(returnNoUrlResponse());
  	  }
    });
  });
}

function returnNoUrlResponse() {
	//response ("No URL");
}

function shortenUrl(url) {
  return new Promise(function (resolve, reject) {
  
	  findByUrl(url).then(function(result){
      if(result){
  		  incrementShortenCount();
  	  } else {
  		  if (isUrlValid(url)) {    
  			  storeNewUrl(url);
  		  }
  	  }
      
    resolve(createShortenedResponse());
      
    }).catch(function(err){
      console.err(err);
      throw err;
    })
  });
}

function createShortCode() {
   return Math.random().toString(36).substr(2, 4);

}
function storeNewUrl(url) {
   state.record = {
    "shortCode": createShortCode(),
    "url": url,
    "shortenedCount": 1,
    "redirectCount": 0
    }

  getDb().collection(collection) 
.insert(state.record,function(err,data){
        if(err) throw err; 
        console.log(JSON.stringify(state.record));        
    });

	console.log("Stored new URL");
}

function createShortenedResponse() {
  return state.record;
}


function findByUrl(url) {
	var returnObjMap = {};
	// {
	// 	shortCode: 1,
	// 	url: 1,
	// 	createdDate: 1,
	// 	shortenCount: 1,
	// 	redirectCount: 0,
	// 	_id: 0
	// };
	return new Promise(function (resolve, reject) {
		getDb().collection(collection)
		.find({
			url: {
				$eq: url
			}
		}, returnObjMap).toArray(function (err, doc) {
			if(err){
				reject(err);
			}
      console.log(doc);
			if (doc.length > 0) {
				state.record = doc;
        console.log("Found record - ", state.record);
				resolve(true);
			} else {
				state.record = null;
				resolve(false);
			}			
		});

	});
}

function findByShortCode(shortCode) {
return new Promise(function (resolve, reject) {
		getDb().collection(collection)
		.find({
			shortCode: {
				$eq: +shortCode
			}
		}, {}).toArray(function (err, doc) {
			if(err){
				reject(err);
			}
      console.log("doc ", doc);
			if (doc.length > 0) {
				state.record = doc;
        console.log("Found record - ", state.record);
				resolve(true);
			} else {
				state.record = null;
				resolve(false);
			}			
		});

	});
}

function incrementVisitCount() {
getDb().collection(collection).update(
      {
        _id: state.record[0]._id
      },
      {
        $inc:{ "redirectCount" : 1}
      }
      ,function(err,data){
        if(err) throw err;
      });
  
  state.record.redirectCount += 1;
}

function incrementShortenCount() {
   getDb().collection(collection).update(
      {
        _id: state.record[0]._id
      },
      {
        $inc:{ "shortenedCount" : 1}
      }
      ,function(err,data){
        console.log("error", err);
        console.log("data", data);
        if(err) throw err;
      });
  
  state.record.shortenedCount += 1;
	//return true;
}

function isUrlValid(url) {
	return true;
} 

var asyncDatastore = {
	// set: set,
	// get: get,
	// remove: remove,
	// removeMany: removeMany,
	connect: connect,
	close: close,
	getDb: getDb,
	get: get,
	add: add,
	findByUrl: findByUrl,
  shortenUrl : shortenUrl,
  redirectShortCode : redirectShortCode 
};

module.exports = {
	async: asyncDatastore
};
