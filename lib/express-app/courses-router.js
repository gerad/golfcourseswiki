var express = require('express');
var ObjectId = require('mongodb').BSONPure.ObjectID;
var courses = express.Router();

// create
courses.post('/', function(req, res, next) {
  var courses = req.db.collection('courses');

  // TODO wayyy unsafe to blindly insert req.body
  courses.insert(req.body, function(err, docs) {
    if (err) { return next(err); }

    res.redirect(docs[0]._id);
  });
});


// show
courses.get('/:id', function(req, res, next) {
  res.json(req.course);
});

// update
courses.put('/:id', function(req, res, next) {
  next(); // TODO
  res.status(404).end();
});

// http://expressjs.com/api.html#router.param
courses.param(':id', function(req, res, next, id) {
  if (!ObjectId.isValid(id)) { return next(); }

  var courses = req.db.collection('courses');

  courses.findOne({ _id: ObjectId(id) }, function(err, course) {
    if (err) { return next(err); }

    if (!course) {
      err = new Error('Not Found');
      err.status = 404;
      return next(err);
    }

    req.course = course;
    next();
  });
});

module.exports = courses;
