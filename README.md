ion-google-autocomplete
================
[![GitHub version](https://badge.fury.io/gh/Hobbule%2Fion-google-autocomplete.svg)](https://badge.fury.io/gh/Hobbule%2Fion-google-autocomplete)
[![Bower version](https://badge.fury.io/bo/ion-google-autocomplete.svg)](https://badge.fury.io/bo/ion-google-autocomplete.svg)

This is a simple directive for Ionic 1 that allows you to add an input text element that enables user to select a place from Google Places with its details in a convenient Ionic Modal

# Demo
<img src="https://s3.amazonaws.com/ionic-marketplace/ion-google-autocomplete/screenshot_4.gif" />

See the codepen here: http://codepen.io/sebrojas14/pen/QERQyj

# Installation
You can use bower:
`bower i ion-google-autocomplete`

# Usage
1. Include the library and Google Places in your index.html (remember to replace your_api_key by your Google API Key:
    ```html
    <script src="lib/ion-google-autocomplete/dist/ion-google-autocomplete.js"></script>
    <script src="http://maps.googleapis.com/maps/api/js?key=your_api_key&libraries=places,geocoder"></script>
```
2. Add the `ion-google-autocomplete` module to your app module dependencies
3. In your controller initialize data and options
    ```javascript
    $scope.data = {};
    
    //Optional
    $scope.countryCode = 'US';
    
    //Optional
    $scope.placeType = "(cities)"
    
    //Optional
    $scope.onAddressSelection = function (location) {
    
        //Do something
        var a = location.address_components;
    };
    ```
4. Add the google-autocomplete-suggestion attribute to your text input field
    ```html
    <input type="text" placeholder="Change address" google-autocomplete-suggestion location="data.location" place-type="{{placeType}}" current-location="true" country-code="{{countryCode}}" on-selection="onAddressSelection(location)" ng-model="data.location.formatted_address" readonly required>
    ```

## Configurable options

### The `location`
Required
A object property where place details returned by Google are stored. For example, you can use `$scope.data.location.geometry.location.lat()` to get latitude of the selected place

### The `country-code`
Optional
Use as componentRestrictions, see https://developers.google.com/places/web-service/autocomplete
"components — A grouping of places to which you would like to restrict your results. Currently, you can use components to filter by country. The country must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. For example: components=country:fr would restrict your results to places within France."

### The `on-selection`
Optional
This option receives a function called when a place is selected using the modal. Receives a paramter location with the places details returned by Google.
```javascript
$scope.onAddressSelection = function (location) {

    //Do something
    var a = location.address_components;
};

### The `place-type` (NEW)
Optional
Place Types, see https://developers.google.com/places/web-service/autocomplete#place_types
"You may restrict results from a Place Autocomplete request to be of a certain type by passing a types parameter. The parameter specifies a type or a type collection, as listed in the supported types below. If nothing is specified, all types are returned. In general only a single type is allowed. The exception is that you can safely mix the geocode and establishment types, but note that this will have the same effect as specifying no types."

### The `current-location` (NEW)
Optional
Allows the capability of location the user through $cordovaGeolocation. The result of the currentPosition() will be reverse geocoded and returns a similar location object as the AutocompleteService does.
```

## Release Notes

v1.0.0
- Now is using Ionic Modal service and can be used inside another Ionic Modal

v1.0.1
- Added placeType and currentLocation capability.
