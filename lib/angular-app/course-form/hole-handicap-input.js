var validateHandicaps = require('gcw/hole-handicap-validator');
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
    var ngModel = controllers[1];

    ngModel.$validators.handicap = function(modelValue, viewValue) {
      var holeIndex = +attrs.holeNumber - 1;
      var handicaps = scope.course.handicaps[attrs.handicapType].slice();
      handicaps[holeIndex] = viewValue;
      var error = validateHandicaps(handicaps)[holeIndex];

      return !error;
    };
  }

  return {
    require: ['^gcwCourseForm', '?ngModel'],
    compile: compile
  };
}]);

module.exports = mod;
