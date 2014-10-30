module.exports = angular.module('gcwHomePage', [
  'ngRoute', require('../course-factory').name
]);

module.exports.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.courseCount = "10,000";
  $scope.timeAgo = "moments ago";
}]);

module.exports.directive('gcwSearch', ['$http', 'Course', function($http, Course) {
  function controller($scope) {
    $scope.search = function() {
      if (!$scope.query) {
        delete $scope.courses;
        delete $scope.searching;
      } else {
        $scope.searching = true;
        $scope.courses = Course.search({ query: $scope.query });
        $scope.courses.$promise
          .finally(function() { $scope.searching = false; });
      }
    };
  }

  return {
    restrict: 'E',
    scope: {},
    template: require("./search.html"),
    controller: controller
  };
}]);

module.exports.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/", {
    template: require('./home.html'),
    controller: 'HomeCtrl'
  });
}]);
