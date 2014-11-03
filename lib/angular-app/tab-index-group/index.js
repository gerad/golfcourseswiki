var mod = angular.module('gcwTabIndexGroup', []);

mod.directive('gcwTabIndexGroup', function() {
  function controller($scope) {
    var inputs = $scope.inputs = [];

    this.addInput = function(input) {
      if (inputs.indexOf(input) >= 0) { return; }
      inputs.push(input);
    }

    this.removeInput = function(input) {
      var index = inputs.indexOf(input);
      if (index >= 0) {
        inputs.splice(index, 1);
      }
    };

    // find the input in the tab group immediately after the provided input
    this.inputAfter = function(input) {
      var ret = null;
      for (var i = 0, l = inputs.length; i < l; i++) {
        var candidate = inputs[i];
        if (candidate.gcwTabIndex > input.gcwTabIndex) {
          if (!ret || candidate.gcwTabIndex < ret.gcwTabIndex) {
            ret = candidate;
          }
        }
      }
      return ret;
    };

    // find the input in the tab group immediately before the provided input
    this.inputBefore = function(input) {
      var ret = null;
      for (var i = 0, l = inputs.length; i < l; i++) {
        var candidate = inputs[i];
        if (candidate.gcwTabIndex < input.gcwTabIndex) {
          if (!ret || candidate.gcwTabIndex > ret.gcwTabIndex) {
            ret = candidate;
          }
        }
      }
      return ret;
    };
  }

  return {
    controller: controller
  };
});

mod.directive('gcwTabIndex', function() {
  function controller($scope) {
    $scope.gcwTabIndex = +$scope.gcwTabIndex;
    $scope.focus = function() {
      /* noop until overriden in `link` below */
    };
  }

  function link(scope, element, attrs, groupCtrl) {
    scope.focus = function() { element[0].focus(); }
    groupCtrl.addInput(scope);

    element.on('keydown', function(e) {
      if (e.keyCode !== 9) { return; } // only act on tabs

      var toFocus = (e.shiftKey ?
        groupCtrl.inputBefore(scope) :
        groupCtrl.inputAfter(scope));

      if (toFocus) {
        toFocus.focus();
        e.preventDefault();
      }
    });

    element.on('$destroy', function() {
      groupCtrl.removeInput(scope);
    });
  }

  return {
    restrict: 'A',
    require: '^gcwTabIndexGroup',
    scope: { gcwTabIndex: '=' },
    controller: controller,
    link: link
  };
});

module.exports = mod;
