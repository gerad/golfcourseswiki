var mod = angular.module('gcwCourseNameInput', [
  require('../google-places-autocomplete').name
]);

mod.directive('gcwCourseNameInput', ['$compile', function($compile) {
  function controller($scope) {
    $scope.placeAutocomplete = function(details) {
      $scope.course.name = details.name;
      $scope.course.phone = details.formatted_phone_number;
      $scope.course.address = details.formatted_address;
      $scope.course.website = details.website;      
    }
  }

  function compile(element, attrs) {
    if (!attrs.ngModel) {
      attrs.$set('ng-model', "course.name");
      attrs.$set("gcw-google-places-autocomplete", "placeAutocomplete(details)");

      // recompile instead of linking
      return recompile;
    } else {
      return link;
    }
  }

  function recompile(scope, element, attrs, controllers) {
    return $compile(element)(scope);
  }

  function link(scope, element, attrs, controllers) {
  }

  return {
    require: ['^gcwCourseForm'],
    compile: compile,
    controller: controller
  };
}]);

module.exports = mod;
