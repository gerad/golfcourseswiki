var express = require('express');
var courses = express.Router();

// http://expressjs.com/api.html#router.param
courses.param(':id', function(req, res, next, id) {
  next();
});

courses.get('/:id', function(req, res, next) {
  res.json(req.params);
});

courses.post('/', function(req, res, next) {
  res.status(404).end();
});

courses.put('/:id', function(req, res, next) {
  res.status(404).end();
});

module.exports = courses;
