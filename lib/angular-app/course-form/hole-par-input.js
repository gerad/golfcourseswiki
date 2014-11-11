var mod = angular.module('gcwHoleParInput', []);

mod.directive('gcwHoleParInput', ['$compile', function($compile) {
  function modelPath(attrs) {
    var holeIndex = +attrs.holeNumber - 1;
    var modelPath = "course.pars."+attrs.parType+'['+holeIndex+']';
    return modelPath;
  }

  function compile(element, attrs) {
    if (!attrs.ngModel) {
      // recompile instead of linking
      return function(scope, element, attrs, controllers) {
        // setup ng-model
        attrs.$set('ng-model', modelPath(attrs));
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

    // copy mensPar -> womensPar on change
    if (attrs.parType === 'mens') {
      var mensParPath = modelPath(attrs);
      scope.$watch(mensParPath, function(mensPar) {
        var womensParPath = modelPath({ holeNumber: attrs.holeNumber, parType: 'womens' });
        scope.$eval(womensParPath + ' = ' + JSON.stringify(mensPar));
      });
    }

    // validate par is between 3 and 5
    ngModel.$validators.par = function(modelValue, viewValue) {
      var parValue = +viewValue;
      return (parValue >= 3 && parValue <= 5);
    }
  }

  return {
    require: ['^gcwCourseForm', '?ngModel'],
    compile: compile
  };
}]);

module.exports = mod;
