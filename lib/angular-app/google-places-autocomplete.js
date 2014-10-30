var mod = angular.module('gcwGooglePlacesAutcomplete', []);

mod.directive('gcwGooglePlacesAutocomplete', function() {
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

module.exports = mod;
