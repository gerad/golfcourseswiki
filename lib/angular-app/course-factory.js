var CourseModel = require('gcw/course-model');

module.exports = angular.module('gcwCourseFactory', ['ngResource']);

module.exports.factory('Course', ['$resource', function($resource) {
  var CourseResource = $resource('/courses/:id', null, {
    'search': { url: '/search', isArray: true }
  });

  // HACK combine the course model with the course resource
  function Course() {
    CourseResource.apply(this, arguments);
    CourseModel.apply(this, arguments);
  }
  // copy / combine the prototypes
  Course.prototype = Object.create(CourseResource.prototype);
  angular.extend(Course.prototype, CourseModel.prototype);
  // copy the class methods
  angular.extend(Course, CourseResource);

  return Course;
}]);
