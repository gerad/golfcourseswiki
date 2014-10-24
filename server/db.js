var MongoClient = require('mongodb').MongoClient;
var On = require('./on');

module.exports = function(url) {
  var self = {};
  var on = On('connect');

  var connecting = false;
  self.connect = function(callback) {
    // there's already a connection, callback immediately
    if (self.db) { return callback(void 0, self.db); }

    // else, call the callback after the connection is made
    on.connect(callback);

    // try to establish a new connection
    if (!connecting) {
      connecting = true;

      MongoClient.connect(url, function(err, db) {
        connecting = false;
        if (!err) { self.db = db; }
        on.connect.clear(err, db); // notify the outstanding callbacks
      });
    }
  };

  self.middleware = function(req, res, next) {
    self.connect(function(err, db) {
      if (err) { return next(err); }
      req.db = db;
      next();
    });
  };

  return self;
};
