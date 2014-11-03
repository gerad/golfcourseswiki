var mod = angular.module('gcwHoleHandicapInput', []);

mod.directive('gcwHoleHandicapInput', ['$compile', function($compile) {
  function compile(element, attrs) {
    if (!attrs.ngModel) {
      // recompile instead of linking
      return function(scope, element, attrs, controllers) {
        var holeIndex = +attrs.holeNumber - 1;

        // setup ng-model
        var modelPath = "course.handicaps."+attrs.handicapType+'['+holeIndex+']';
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
