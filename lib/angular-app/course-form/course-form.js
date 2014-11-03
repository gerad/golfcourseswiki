var mod = angular.module('gcwCourseForm', [
  require('./course-name-input').name,
  require('./basic-course-inputs').name,
  require('../tab-index-group').name,
  require('./hole-inputs').name
]);

mod.directive('gcwCourseForm', function() {
  function controller($scope) {}

  return {
    scope: { course: "=" },
    template: require('./course-form.html'),
    controller: controller
  };
});

module.exports = mod;
