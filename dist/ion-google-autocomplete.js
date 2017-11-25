angular.module('ion-google-autocomplete', [])
.directive('googleAutocompleteSuggestion', [
    '$document', '$ionicModal', '$ionicTemplateLoader', 'googleAutocompleteService', '$cordovaGeolocation',
    function($document, $ionicModal, $ionicTemplateLoader, googleAutocompleteService, $cordovaGeolocation) {
    return {
        restrict: 'A',
        scope: {
            location: '=',//Required
            countryCode: '@',//Optional
            placeType: '@',//Optional
            currentLocation: '=',//Optional
            onSelection: '&'//Optional
        },
        link: function($scope, element) {
        
            $scope.search = {};
            $scope.search.suggestions = [];
            $scope.search.query = '';

            var template = [
                '<ion-modal-view>',
                '<ion-header-bar class="item-input-inset">',
                '<label class="item-input-wrapper">',
                '<i class="icon ion-search placeholder-icon"></i>',
                '<input type="search" ng-model="search.query" placeholder="Search">',
                '</label>',
                '<button class="ion-autocomplete-cancel button button-clear button-dark ng-binding" ng-click="close()" translate>Done</button>',
                '</ion-header-bar>',
                '<ion-content>',
                '<ion-list>',
                '<ion-item ng-show="search.error">',
                '{{search.error}}',
                '</ion-item>',
                '<ion-item ng-if="currentLocation" ng-click="getCurrentLocation()">',
                '<ion-spinner ng-if="isLoading"></ion-spinner>',
                '<span ng-if="!isLoading">Current Location</span>',
                '</ion-item>',
                '<ion-item ng-repeat="suggestion in search.suggestions" ng-click="choosePlace(suggestion)">',
                '{{suggestion.description}}',
                '</ion-item>',
                '</ion-list>',
                '<div class="padding">',
                '<img src="https://developers.google.com/maps/documentation/places/images/powered-by-google-on-white.png" style="margin-left: 5px" alt="" />',
                '</div>',
                '</ion-content>',
                '</ion-modal-view>'
            ].join('')            

            $scope.modal = $ionicModal.fromTemplate(template, {
                scope: $scope,
                animation: 'slide-in-up'
            })

            var searchInputElement = angular.element($scope.modal.$el.find('input'));
            
            element[0].addEventListener('focus', function(event) {
                
                $scope.search.query = '';
                $scope.open();
            });
                
            $scope.open = function() {
                
                $scope.modal.show();
                searchInputElement[0].focus();
            };
            
            $scope.close = function() {
                
                $scope.modal.hide();
            };
            
            $scope.choosePlace = function(place) {
                
                googleAutocompleteService.getDetails(place.place_id).then(function(location) {
                    
                    $scope.location = location;
                    $scope.close();
                    
                    if ($scope.onSelection !== undefined)
                        $scope.onSelection({ location: location });
                });
            };

            $scope.getCurrentLocation = function() {
                $scope.isLoading = true;

                var options = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                    var lat  = position.coords.latitude;
                    var lon = position.coords.longitude;
                    
                    googleAutocompleteService.reverseGeocode(lat, lon)
                    .then(function(location) {
                        console.log(location[0]);
                        $scope.isLoading = false;
                        $scope.location = location[0];
                        $scope.close();
                        if ($scope.onSelection !== undefined)
                            $scope.onSelection({ location: location[0] });
                    }, function(err) {
                        $scope.isLoading = false;
                        console.log(err);
                    });
                }, function(err) {
                    $scope.isLoading = false;
                    $scope.currentLocation = false;
                    console.log(err);
                });

            }
            
            $scope.$watch('search.query', function(newValue) {
                
                if (newValue) {
                    
                    googleAutocompleteService.searchAddress(newValue, $scope.countryCode, $scope.placeType).then(function(result) {
                        $scope.search.error = null;
                        $scope.search.suggestions = result;
                    }, function(status) {                        
                        $scope.search.error = "There was an error :( " + status;
                    });
                }
            });
        }
    }
}])

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