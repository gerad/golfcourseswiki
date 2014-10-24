var app = angular.module('golfCoursesWiki', [
  'ngRoute', 'ngResource', 'colorpicker.module'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when("/", { templateUrl: 'templates/home.html', controller: 'HomeCtrl' })
    .when("/new", { templateUrl: 'templates/form.html', controller: 'NewCtrl' });
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.courseCount = "10,000";
  $scope.timeAgo = "moments ago";
}]);

app.controller('NewCtrl', ['$scope', 'Course', function($scope, Course) {
  $scope.tees = [
    { name: "Blue", color: "#0000ff" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#ff0000" }];
  $scope.distances = [];
  for (var _ in $scope.tees) { $scope.distances.push([]); }

  $scope.pars = { mens: [], womens: [] };
  $scope.handicaps = { mens: [], womens: [] };
  $scope.handicapErrors = { mens: [], womens: [] };

  $scope.numberOfHoles = 18;
  $scope.holes = new Array($scope.numberOfHoles);

  $scope.placeAutocomplete = function(details) {
    $scope.name = details.name;
    $scope.phone = details.formatted_phone_number;
    $scope.address = details.formatted_address;
    $scope.website = details.website;
  };

  function handicapValidator(kind) {
    return function() {
      var handicaps = $scope.handicaps[kind];
      var errors = $scope.handicapErrors[kind];
      var prev, parity;

      for (var i = 0; i < $scope.numberOfHoles; i++) {
        // reset every nine holes

        var handicapVal = handicaps[i];

        // innocent until proven guilty
        delete errors[i];

        // nulls and empty strings are always valid
        if (handicapVal == null || handicapVal === '') { continue; }

        // convert handicap to an integer
        handicap = +handicapVal;

        // ensure it's an integer
        if (handicap % 1 !== 0) {
          errors[i] = "Invalid number: " + handicapVal;
          continue;
        }

        // ensure it's within the right range
        if (handicap < 1 || handicap > $scope.numberOfHoles) {
          errors[i] = "Handicap out of range";
          continue;
        }

        // ensure all handicaps have the same parity
        if (i % 9 === 0) { parity = null; }
        if (parity == null) { parity = handicap % 2; }
        if (handicap % 2 !== parity) {
          errors[i] = "Expecting handicap to be " + (parity ? "odd" : "even");
          continue;
        }

        // ensure handicaps are not repeated
        if (i % 9 === 0) { prev = []; }
        for (var j = 0; j < prev.length; j++) {
          if (handicap === prev[j]) {
            errors[i] = "Handicap already used at hole " + (j+1);
            break;
          }
        }
        prev.push(handicap);
      }
    }
  }

  $scope.$watch("handicaps.mens", handicapValidator("mens"), true);
  $scope.$watch("handicaps.womens", handicapValidator("womens"), true);

  $scope.sumThrough = function(array, index) {
    var ret = 0;
    for (var i = 0; i <= index; i++) {
      ret = ret + (+array[i] || 0);
    }
    return ret;
  };

  function addTeeAt(index) {
    $scope.tees.splice(index, 0, { name: null, color: "#000000" });
    $scope.distances.splice(index, 0, []);
  }

  function removeTeeAt(index) {
    $scope.tees.splice(index, 1);
    $scope.distances.splice(index, 1);
  }

  $scope.addTeeBefore = function(tee) {
    addTeeAt($scope.tees.indexOf(tee));
  }

  $scope.addTeeAfter = function(tee) {
    addTeeAt($scope.tees.indexOf(tee) + 1);
  };

  $scope.removeTee = function(tee) {
    removeTeeAt($scope.tees.indexOf(tee));
    // ensure at least one tee is always present
    if ($scope.tees.length <= 0) { addTeeAt(0); }
  };

  $scope.tabIndexFor = function(hole, column) {
    // 4 columns for mens/womens par/handicap + a column for each tee
    var totalColumnCount = 4 + $scope.tees.length;

    // 9 holes per group * number of columns per group
    var totalInputCount = 9 * totalColumnCount;

    var holeOffset = hole % 9;
    var groupOffset = Math.floor(hole / 9) * totalInputCount;
    var columnOffset = column * 9;

    return groupOffset + holeOffset + columnOffset;
  };
}]);

app.directive('gcwSearch', ['$http', 'Course', function($http, Course) {
  function controller($scope) {
    $scope.search = function() {
      if (!$scope.query) {
        delete $scope.courses;
        delete $scope.searching;
      } else {
        $scope.searching = true;
        $scope.courses = Course.search({ query: $scope.query });
        $scope.courses.$promise
          .finally(function() { $scope.searching = false; });
      }
    };
  }

  return {
    restrict: 'E',
    scope: {},
    templateUrl: "templates/search.html",
    controller: controller
  };
}]);

app.directive('gcwTabIndexGroup', function() {
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
    restrict: 'A',
    controller: controller
  };
});

app.directive('gcwTabIndex', function() {
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

app.directive('gcwGooglePlacesAutocomplete', function() {
  function link(scope, element, attrs) {
    var options = { types: ['establishment'], componentRestrictions: [] };
    autocomplete = new google.maps.places.Autocomplete(element[0], options);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      scope.$apply(function() {
        scope.gcwGooglePlacesAutocomplete({details: autocomplete.getPlace() });
      });
    }); 
  }

  return {
    restrict: 'A',
    scope: { 'gcwGooglePlacesAutocomplete': '&' },
    link: link
  };
});

app.factory('Course', ['$resource', function($resource) {
  return $resource('/courses/:id', null, {
    'search': { url: '/search', isArray: true }
  });
}]);
