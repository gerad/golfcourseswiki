// TODO figure out how to shim these properly
require('angular');
require('angular-route');
require('angular-resource');
require('angular-bootstrap-colorpicker');

module.exports = angular.module('golfCoursesWiki', [
  require('./home-page').name,
  require('./new-course-page').name
]);
