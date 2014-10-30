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

  // === scope variable setup ===

  $scope.course = new Course;

  $scope.holeNumbers = [];
  for (var i = 0; i < 18; i++) { $scope.holeNumbers.push(i + 1); }

  $scope.course.addTees([
    { name: "Blue", color: "#0000ff" },
    { name: "White", color: "#ffffff" },
    { name: "Red", color: "#ff0000" }]);
  $scope.course.numberOfHoles = 18;

  // === course name autocomplete widget ===

  $scope.placeAutocomplete = function(details) {
    $scope.course.name = details.name;
    $scope.course.phone = details.formatted_phone_number;
    $scope.course.address = details.formatted_address;
    $scope.course.website = details.website;
  };

  // === course tee box header widget ===

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

  // === course hole editor widget ===

  $scope.tabIndexFor = function(hole, column) {
    // 4 columns for mens/womens par/handicap + a column for each tee
    var totalColumnCount = 4 + $scope.course.tees.length;

    // 9 holes per group * number of columns per group
    var totalInputCount = 9 * totalColumnCount;

    var holeOffset = hole % 9;
    var groupOffset = Math.floor(hole / 9) * totalInputCount;
    var columnOffset = column * 9;

    return groupOffset + holeOffset + columnOffset;
  };

  // === handicap validation ===

  $scope.handicapErrors = { mens: [], womens: [] };
  $scope.$watch('course.handicaps.mens', handicapValidator('mens'));
  $scope.$watch('course.handicaps.womens', handicapValidator('womens'));

  function handicapValidator(kind) {
    return function() {
      var handicaps = $scope.course.handicaps[kind];
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

  // === course side totals ===

  $scope.sumThrough = function(array, index) {
    var ret = 0;
    for (var i = 0; i <= index; i++) {
      ret = ret + (+array[i] || 0);
    }
    return ret;
  };

  // === form submission ===

  $scope.add = function(course) {
    course.$save()
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
    if (typeof google === 'undefined') { return; }
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
  var CourseResource = $resource('/courses/:id', null, {
    'search': { url: '/search', isArray: true }
  });

  var Course = function Course() {
    this.tees = [];
    this.distances = [];
    this.pars = { mens: [], womens: [] };
    this.handicaps = { mens: [], womens: [] };
  };

  Course.prototype.addTeeAt = function(tee, index) {
    this.tees.splice(index, 0, tee);
    this.distances.splice(index, 0, []);
  };

  Course.prototype.addTeeBefore = function(tee, nextTee) {
    this.addTeeAt(tee, this.tees.indexOf(nextTee));
  }

  Course.prototype.addTeeAfter = function(tee, prevTee) {
    this.addTeeAt(tee, this.tees.indexOf(prevTee) + 1);
  };

  Course.prototype.addTee = function(tee) {
    this.addTeeAt(tee, this.tees.length);
  }

  Course.prototype.addTees = function(tees) {
    for (var i = 0, l = tees.length; i < l; ++i) {
      this.addTee(tees[i]);
    }
  }

  Course.prototype.removeTeeAt = function(index) {
    this.tees.splice(index, 1);
    this.distances.splice(index, 1);
  };

  Course.prototype.removeTee = function(tee) {
    this.removeTeeAt(this.tees.indexOf(tee));
  };

  // combine the course with the resource
  function CourseCombined() {
    CourseResource.apply(this, arguments);
    Course.apply(this, arguments);
  }
  CourseCombined.prototype = Object.create(CourseResource.prototype);
  angular.extend(CourseCombined.prototype, Course.prototype);

  return CourseCombined;
}]);
