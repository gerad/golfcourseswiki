var mod = angular.module('gcwHoleDistanceInput', []);

mod.directive('gcwHoleDistanceInput', ['$compile', function($compile) {
  function compile(element, attrs) {
    if (!attrs.ngModel) {
      // recompile with the correct attributes set
      return function(scope, element, attrs, controllers) {
        var holeIndex = +attrs.holeNumber - 1;
        var tee = scope.$eval(attrs.tee);
        var teeIndex = scope.course.tees.indexOf(tee);

        // setup ng-model
        var modelPath = "course.distances["+teeIndex+']['+holeIndex+']';
        attrs.$set('ng-model', modelPath);

        return recompile(scope, element, attrs, controllers);
      };
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
    compile: compile
  };
}]);

module.exports = mod;
