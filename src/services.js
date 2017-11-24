angular.module('ion-google-autocomplete')
.factory('googleAutocompleteService', ['$q', function ($q) {

  var autocompleteService = new google.maps.places.AutocompleteService();
  var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
  var geocoderService = new google.maps.Geocoder();

  return {

    /**
     * Search an address from an input and and option country restriction and option place restriction
     * @param required input string
     * @param optional countryCode two letters code
     * @param optional placeType type from google: (cities) etc
     */
    searchAddress: function(input, countryCode, placeType) {

      var dfd = $q.defer();
      autocompleteService.getPlacePredictions({
            input,
            types: placeType ? [placeType] : undefined,
            componentRestrictions: countryCode ? { country: countryCode } : undefined
        },function(result, status) {
          
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            
          console.log(status);
          dfd.resolve(result);
        }
        else
          dfd.reject(status);
      });

      return dfd.promise;
    },

    /**
     * Gets the details of a placeId
     * @param required placeId
     */
    getDetails: function(placeId) {
        
      var dfd = $q.defer();
      
      detailsService.getDetails({ placeId: placeId }, function(result) {
          
        dfd.resolve(result);
      });
      
      return dfd.promise;
    },

    /**
     * Reverse Geocode the given lat/lng to the location format.
     * @param required lat float
     * @param required lng float
     */
    reverseGeocode: function(lat, lng) {
        console.log("Initiating reverseGeocoding");

        var latlng = new google.maps.LatLng(lat,lng);
        var request = {
          latLng: latlng
        };
        var dfd = $q.defer();
        document.geoCodeRequestCompleteFlag = 0;
        geocoderService.geocode(request, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    dfd.resolve(results);
                } else {
                    dfd.reject(results);
                }
            } else {
                dfd.reject(status);
            }
        });

        return dfd.promise;
    }
  };
}])