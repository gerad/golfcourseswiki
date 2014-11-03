var mod = angular.module('gcwBasicCourseInputs', []);

function basicCourseInput(name) {
  return ['$compile', function($compile) {
    function compile(element, attrs) {
      if (!attrs.ngModel) {
        attrs.$set('ng-model', "course." + name);
        return recompile;
      }
    }

    function recompile(scope, element, attrs, controllers) {
      return $compile(element)(scope);
    }

    return {
      require: ['^gcwCourseForm'],
      compile: compile
    };
  }];
}

mod.directive('gcwCourseAddressInput', basicCourseInput('address'));
mod.directive('gcwCoursePhoneInput', basicCourseInput('phone'));
mod.directive('gcwCourseWebsiteInput', basicCourseInput('website'));
mod.directive('gcwCourseHoleCountInput', basicCourseInput('holeCount'));

module.exports = mod;
