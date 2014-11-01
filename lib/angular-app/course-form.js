var mod = angular.module('gcwCourseForm', [
  require('./google-places-autocomplete').name
]);

// <form gcw-course="course">
mod.directive('gcwCourse', ['$compile', function($compile) {
  return {
    scope: { course: "=gcwCourse" },
    controller: function($scope, $element, $attrs) {
      this.$compile = function(element) {return $compile(element)($scope); };
    }
  };
}]);

// <input type="course-name"> / <input type="course-address">
mod.directive('input', function() {
  var inputTypes = {
    'course-name': 'gcwCourseNameInput'
  };

  function compile(element, attrs) {
    var directiveName = inputTypes[attrs.type];
    if (directiveName && !(directiveName in attrs)) {
      attrs.$set(directiveName, '');

      // recompile after linking
      return function(scope, _, _, controllers) {
        // NOTE: recompile the element in the gcwCourse directive's scope
        // (which provides the `course` variable)
        var gcwCourse = controllers[0];
        if (gcwCourse) { return gcwCourse.$compile(element); }
      };
    }
  }

  return {
    require: ['?^gcwCourse'],
    scope: false,
    compile: compile
  };
});

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
    if (attrs.type !== 'text') {
      attrs.$set('type', 'text');
      attrs.$set('ng-model', "course.name");
      attrs.$set("gcw-google-places-autocomplete", "placeAutocomplete(details)");

      // recompile instead of linking
      return function(scope) { $compile(element)(scope); };
    } else {
      return link;
    }
  }

  function link(scope, element, attrs, controllers) {
  }

  return {
    require: ['^gcwCourse', '?ngModel', '?gcwGooglePlacesAutocomplete'],
    compile: compile,
    controller: controller
  };
}]);

module.exports = mod;
