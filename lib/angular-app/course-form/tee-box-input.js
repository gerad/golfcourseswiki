var mod = angular.module('gcwTeeBoxInput', [
  'colorpicker.module'
]);

mod.directive('gcwTeeBoxInput', function() {
  function controller($scope, $element, $attrs) {
    function newTee() { return { name: null, color: '#000000' }; }

    $scope.addTeeBefore = function(tee) {
      $scope.course.addTeeBefore(newTee(), tee);
    };

    $scope.addTeeAfter = function(tee) {
      $scope.course.addTeeAfter(newTee(), tee);
    };

    $scope.removeTee = function(tee) {
      $scope.course.removeTee(tee);

      // ensure at least one tee is always present
      if ($scope.course.tees.length <= 0) {
        $scope.course.addTee(newTee());
      }
    };
  }

  return {
    template: require('./tee-box-input.html'),
    controller: controller
  };
});


module.exports = mod;
