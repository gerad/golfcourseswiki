var mod = angular.module('gcwNewCoursePage', [
  'ngRoute',
  require('../course-factory').name,
  require('../course-form').name
]);

mod.controller('NewCourseCtrl', ['$scope', 'Course', function($scope, Course) {
  // === variable initialization ===

  $scope.course = new Course;

  $scope.course.addTees([
    { name: "Blue", color: "#0000ff" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#ff0000" }]);
  $scope.course.holeCount = 18;

  // === handicap validation component ===

  $scope.handicapErrors = { mens: [], womens: [] };
  $scope.$watch('course.handicaps.mens', handicapValidator('mens'));
  $scope.$watch('course.handicaps.womens', handicapValidator('womens'));

  function handicapValidator(kind) {
    return function() {
      var handicaps = $scope.course.handicaps[kind];
      var errors = $scope.handicapErrors[kind];
      var prev, parity;

      for (var i = 0; i < $scope.numberOfHoles; i++) {
        // reset every nine holes

        var handicapVal = handicaps[i];

        // innocent until proven guilty
        delete errors[i];

        // nulls and empty strings are always valid
        if (handicapVal == null || handicapVal === '') { continue; }

        // convert handicap to an integer
        handicap = +handicapVal;

        // ensure it's an integer
        if (handicap % 1 !== 0) {
          errors[i] = "Invalid number: " + handicapVal;
          continue;
        }

        // ensure it's within the right range
        if (handicap < 1 || handicap > $scope.numberOfHoles) {
          errors[i] = "Handicap out of range";
          continue;
        }

        // ensure all handicaps have the same parity
        if (i % 9 === 0) { parity = null; }
        if (parity == null) { parity = handicap % 2; }
        if (handicap % 2 !== parity) {
          errors[i] = "Expecting handicap to be " + (parity ? "odd" : "even");
          continue;
        }

        // ensure handicaps are not repeated
        if (i % 9 === 0) { prev = []; }
        for (var j = 0; j < prev.length; j++) {
          if (handicap === prev[j]) {
            errors[i] = "Handicap already used at hole " + (j+1);
            break;
          }
        }
        prev.push(handicap);
      }
    }
  }

  // === form submission ===

  $scope.add = function(course) {
    course.$save()
  };
}]);

mod.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/new", {
    template: require('./new-course.html'),
    controller: 'NewCourseCtrl'
  });
}]);

module.exports = mod;
