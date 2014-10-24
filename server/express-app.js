var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var db = require('./db');

// TODO change this production
var clientPath = path.join(__dirname, '..', 'client');

app.use(favicon(path.join(clientPath, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(clientPath));

// dynamic routes
app.use(db("mongodb://localhost:27017/golfcourseswiki").middleware);
app.use('/search', require('./search'));
app.use('/courses', require('./courses'));

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
