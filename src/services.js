angular.module('ion-google-autocomplete')
.factory('googleAutocompleteService', function($q) {
  var autocompleteService = new google.maps.places.AutocompleteService();
  var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
  return {
    searchAddress: function(input, countryCode) {
      var dfd = $q.defer();

      autocompleteService.getPlacePredictions({
        input: input,
        componentRestrictions: countryCode ? { country: countryCode } : undefined
      }, function(result, status) {
          
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            
          console.log(status);
          dfd.resolve(result);
        }
        else
          dfd.reject(status);
      });

      return dfd.promise;
    },
    getDetails: function(placeId) {
        
      var dfd = $q.defer();
      
      detailsService.getDetails({placeId: placeId}, function(result) {
          
        dfd.resolve(result);
      });
      
      return dfd.promise;
    }
  };
})
