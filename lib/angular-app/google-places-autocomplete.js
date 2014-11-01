var mod = angular.module('gcwGooglePlacesAutcomplete', []);

mod.directive('gcwGooglePlacesAutocomplete', function() {
  function link(scope, element, attrs) {
    if (typeof google === 'undefined') { return; }

    var options = { types: ['establishment'], componentRestrictions: [] };
    var autocomplete = new google.maps.places.Autocomplete(element[0], options);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      scope.$apply(function() {
        var details = autocomplete.getPlace();
        scope.onAutocomplete({details: details });
      });
    }); 
  }

  return {
    restrict: 'A',
    scope: { 'onAutocomplete': '&gcwGooglePlacesAutocomplete' },
    link: link
  };
});

module.exports = mod;
