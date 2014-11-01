var mod = angular.module('gcwNewCoursePage', [
  'ngRoute', 'colorpicker.module',
  require('../course-factory').name,
  require('../tab-index-group').name,
  require('../course-form').name
]);

mod.controller('NewCourseCtrl', ['$scope', 'Course', function($scope, Course) {
  // === variable initialization ===

  $scope.course = new Course;

  $scope.holeNumbers = [];
  for (var i = 0; i < 18; i++) { $scope.holeNumbers.push(i + 1); }

  $scope.course.addTees([
    { name: "Blue", color: "#0000ff" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#ff0000" }]);
  $scope.course.numberOfHoles = 18;

  // === course tee box header component ===

  function newTee() { return { name: null, color: '#000000' }; }

  $scope.addTeeBefore = function(tee) {
    $scope.course.addTeeBefore(newTee(), tee);
  };

  $scope.addTeeAfter = function(tee) {
    $scope.course.addTeeAfter(newTee(), tee);
  };

  $scope.removeTee = function(tee) {
    $scope.course.removeTee(tee);

    // ensure at least one tee is always present
    if ($scope.course.tees.length <= 0) {
      $scope.course.addTee(newTee());
    }
  };

  // === course hole editor component ===

  $scope.tabIndexFor = function(hole, column) {
    // 4 columns for mens/womens par/handicap + a column for each tee
    var totalColumnCount = 4 + $scope.course.tees.length;

    // 9 holes per group * number of columns per group
    var totalInputCount = 9 * totalColumnCount;

    var holeOffset = hole % 9;
    var groupOffset = Math.floor(hole / 9) * totalInputCount;
    var columnOffset = column * 9;

    return groupOffset + holeOffset + columnOffset;
  };

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

  // === course side totals ===

  $scope.sumThrough = function(array, index) {
    var ret = 0;
    for (var i = 0; i <= index; i++) {
      ret = ret + (+array[i] || 0);
    }
    return ret;
  };

  // === form submission ===

  $scope.add = function(course) {
    course.$save()
  };
}]);

mod.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/new", {
    template: require('./form.html'),
    controller: 'NewCourseCtrl'
  });
}]);

module.exports = mod;
