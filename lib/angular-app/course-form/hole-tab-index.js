var mod = angular.module('gcwHoleTabIndex', []);

mod.directive('gcwHoleTabIndex', ['$compile', function($compile) {
  function tabIndexFor($scope, holeIndex, columnIndex) {    
    // 4 columns for mens/womens par/handicap + a column for each tee
    var totalColumnCount = 4 + $scope.course.tees.length;

    // (9 holes per group) * (number of columns per group)
    var totalInputCount = 9 * totalColumnCount;

    var holeOffset = holeIndex % 9;
    var groupOffset = Math.floor(holeIndex / 9) * totalInputCount;
    var columnOffset = columnIndex * 9;

    return groupOffset + holeOffset + columnOffset;
  }

  function compile(element, attrs) {
    if (!attrs.gcwTabIndex) {
      // recompile instead of linking
      return function(scope, element, attrs, controllers) {
        // setup gcw-tab-index
        var tabIndex = tabIndexFor(scope, +attrs.holeNumber-1, +attrs.gcwHoleTabIndex);
        attrs.$set('gcw-tab-index', tabIndex);
        attrs.$set('gcw-hole-tab-index', null);

        return $compile(element)(scope);
      };
    }
  }

  return {
    require: ['^gcwCourseForm'],
    compile: compile
  };
}]);

module.exports = mod;
