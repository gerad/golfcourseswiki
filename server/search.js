var express = require('express');
var search = express.Router();

search.get('/', function(req, res, next) {
  var courses = req.db.collection('courses');

  courses.find({}).toArray(function(err, array) {
    if (err) { return next(err); }
    res.json(array);
  });
});

module.exports = search;
