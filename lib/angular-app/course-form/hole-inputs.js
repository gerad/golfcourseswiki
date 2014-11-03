var mod = angular.module('gcwHoleInputs', [
  require('./tee-box-input').name,
  require('./hole-tab-index').name,
  require('./hole-par-input').name,
  require('./hole-distance-input').name,
  require('./hole-handicap-input').name
]);

mod.directive('gcwHoleInputs', function() {
  function controller($scope, $element, $attrs) {
    var start = $attrs.side === "back" ? 9 : 0;

    // hole numbers
    $scope.holeNumbers = [];
    for (var i = 0; i < 9; i++) { $scope.holeNumbers.push(start + i + 1); }

    // totals
    $scope.sum = function(array) {
      var ret = 0;
      for (var i = 0; i < 9; i++) {
        ret = ret + (+array[start + i] || 0);
      }
      return ret;
    };
  }

  return {
    template: require('./hole-inputs.html'),
    controller: controller
  };
});

module.exports = mod;
