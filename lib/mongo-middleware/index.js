var MongoClient = require('mongodb').MongoClient;
var On = require('../on');

module.exports = function(url) {
  return function(req, res, next) {
    connect(url, function(err, db) {
      if (err) { return next(err); }
      req.db = db;
      next();
    });
  };
};

var db;
var on = On('connect');
var connecting = false;
function connect(url, callback) {
  // there's already a connection, callback immediately
  if (db) { return callback(void 0, db); }

  // else, call the callback after the connection is made
  on.connect(callback);

  // try to establish a new connection
  if (!connecting) {
    connecting = true;

    MongoClient.connect(url, function(err, _db) {
      connecting = false;
      if (!err) { db = _db; }
      on.connect.clear(err, db); // notify the outstanding callbacks
    });
  }
};
