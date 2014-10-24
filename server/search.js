var express = require('express');
var search = express.Router();

search.get('/', function(req, res, next) {
  res.json(req.query);
});

module.exports = search;
