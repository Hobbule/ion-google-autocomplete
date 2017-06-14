
angular.module('ion-google-autocomplete', [])
.directive('googleAutocompleteSuggestion', googleAutocompleteSuggestion)
.factory('googleAutocompleteService', googleAutocompleteService);

googleAutocompleteSuggestion.$inject = ['$document', '$ionicModal', '$ionicTemplateLoader', 'googleAutocompleteService'];
googleAutocompleteService.$inject = ['$q'];

function googleAutocompleteSuggestion($document, $ionicModal, $ionicTemplateLoader, googleAutocompleteService) {
    return {
        restrict: 'A',
        scope: {
            location: '=',//Required
            countryCode: '@',//Optional
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

            $scope.$watch('search.query', function(newValue) {

                if (newValue) {

                    googleAutocompleteService.searchAddress(newValue, $scope.countryCode).then(function(result) {

                        $scope.search.error = null;
                        $scope.search.suggestions = result;
                    }, function(status) {

                        $scope.search.error = "There was an error :( " + status;
                    });
                }
            });
        }
    }
}

function googleAutocompleteService($q) {

  var autocompleteService = new google.maps.places.AutocompleteService();
  var detailsService = new google.maps.places.PlacesService(document.createElement("input"));

  return {
    /**
     * Search an address from an input and and option country restriction
     * @param required input string
     * @param optional countryCode two letters code
     */
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
    }
  };
}
