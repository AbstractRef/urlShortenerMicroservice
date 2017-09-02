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
        .then(function(db) {
            state.db = db;
            console.log('Connection established to', MONGODB_URI);
            return;
        })
        .catch(function(err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            throw err;
        });
}

function close() {
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

function get() {
    return state.record;
}

function redirectShortCode(shortCode) {
    return new Promise(function(resolve, reject) {

        findByShortCode(shortCode).then(function(result) {
            if (result) {
                incrementVisitCount();
                resolve(state.record[0].url);
            } else {
                reject(returnNoUrlResponse(shortCode));
            }
        });
    });
}

function returnNoUrlResponse(shortCode) {
    var err = {
        "Error": "No URL defined for short code " + shortCode
    }
    return JSON.stringify(err);
}

function shortenUrl(url) {
    return new Promise(function(resolve, reject) {

        findByUrl(url).then(function(result) {
            if (result) {
                incrementShortenCount();
            } else {
                if (isUrlValid(url)) {
                    storeNewUrl(url);
                } else {
                    reject(createMalformedUrlError(url));
                }
            }
            resolve(createShortenedResponse());
        }).catch(function(err) {
            console.err(err);
            throw err;
        })
    });
}

function createShortCode() {
    return Math.random().toString(36).substr(2, 5);
}

function storeNewUrl(url) {
    state.record = {
        "shortCode": createShortCode(),
        "url": url,
        "shortenedCount": 1,
        "redirectCount": 0
    }

    getDb().collection(collection)
        .insert(state.record, function(err, data) {
            if (err) throw err
        });
}

function createShortenedResponse() {
    return state.record;
}

function createMalformedUrlError(url) {
    var err = {
        "Error": url + " is not a valid URL"
    }
    return JSON.stringify(err);
}

function findByUrl(url) {
    var returnObjMap = {};
    return new Promise(function(resolve, reject) {
        getDb().collection(collection)
            .find({
                url: {
                    $eq: url
                }
            }, returnObjMap).toArray(function(err, doc) {
                if (err) {
                    reject(err);
                }
                if (doc.length > 0) {
                    state.record = doc;
                    resolve(true);
                } else {
                    state.record = null;
                    resolve(false);
                }
            });

    });
}

function findByShortCode(shortCode) {
    return new Promise(function(resolve, reject) {
        getDb().collection(collection)
            .find({
                shortCode: {
                    $eq: shortCode
                }
            }, {}).toArray(function(err, doc) {
                if (err) {
                    reject(err);
                }
                if (doc.length > 0) {
                    state.record = doc;
                    resolve(true);
                } else {
                    state.record = null;
                    resolve(false);
                }
            });

    });
}

function incrementVisitCount() {
    getDb().collection(collection).update({
        _id: state.record[0]._id
    }, {
        $inc: {
            "redirectCount": 1
        }
    }, function(err, data) {
        if (err) throw err;
    });

    state.record.redirectCount += 1;
}

function incrementShortenCount() {
    getDb().collection(collection).update({
        _id: state.record[0]._id
    }, {
        $inc: {
            "shortenedCount": 1
        }
    }, function(err, data) {
        if (err) throw err;
    });

    state.record.shortenedCount += 1;
    //return true;
}

function isUrlValid(urlToCheck) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return urlToCheck.length < 2083 && url.test(urlToCheck);
}

var mongoUrlDatastore = {
    connect: connect,
    close: close,
    getDb: getDb,
    get: get,
    findByUrl: findByUrl,
    shortenUrl: shortenUrl,
    redirectShortCode: redirectShortCode
};

module.exports = {
    mongoUrlDatastore: mongoUrlDatastore
};