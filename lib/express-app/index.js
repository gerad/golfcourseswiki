var express = require('express');
var app = express();

// path calculation
// TODO precompile assets for production
var path = require('path');
var clientPath = path.join(__dirname, '..', '..', 'client');

// favicon
var favicon = require('serve-favicon');
app.use(favicon(path.join(clientPath, 'favicon.ico')));

// logging
var logger = require('morgan');
app.use(logger('dev'));

// body parsing
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// cookie parsing
var cookieParser = require('cookie-parser');
app.use(cookieParser());


// browserify index.js
var browserify = require('browserify-middleware');
app.get('/index.js', browserify(path.join(clientPath, 'index.js')));

// static routes
app.use(express.static(clientPath));

// TODO different mongodb:// url for production
var mongo = require('gcw/mongo-middleware');
app.use(mongo("mongodb://localhost:27017/golfcourseswiki"));

// dynamic routes
app.use('/search', require('./search-router'));
app.use('/courses', require('./courses-router'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      status: err.status,
      message: err.message,
      stack: err.stack.split(/\n\s*/) });
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message });
});

module.exports = app;
