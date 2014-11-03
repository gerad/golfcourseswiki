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
    // copy mensPar -> womensPar on change
    if (attrs.parType === 'mens') {
      var mensParPath = modelPath(attrs);
      scope.$watch(mensParPath, function(mensPar) {
        var womensParPath = modelPath({ holeNumber: attrs.holeNumber, parType: 'womens' });
        scope.$eval(womensParPath + ' = ' + JSON.stringify(mensPar));
      });
    }
  }

  return {
    require: ['^gcwCourseForm'],
    compile: compile
  };
}]);

module.exports = mod;
