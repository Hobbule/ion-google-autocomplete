ion-google-autocomplete
================
[![Bower version](https://badge.fury.io/bo/ion-google-autocomplete.svg)](https://badge.fury.io/bo/ion-google-autocomplete.svg)

This is a simple directive for Ionic 1 that allows you to add an input text element that enables user to select a place from Google Places with its details in a convenient Ionic Modal

# Demo
See the codepen here: http://codepen.io/sebrojas14/pen/QERQyj

# Installation
You can use bower:
`bower i ion-google-autocomplete`

# Usage
1. Include the library and Google Places in your index.html:
```html
<script src="lib/ion-google-autocomplete/dist/ion-google-autocomplete.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?libraries=places"></script>
```
3. In your controller initialize data and options
```javascript
$scope.data = {};

//Optional
$scope.countryCode = 'US';

//Optional
$scope.onAddressSelection = function (location) {

    //Do something
    var a = location.address_components;
};
```
2. Add the google-autocomplete-suggestion attribute to your text input field
```html
<input type="text" placeholder="Change address" google-autocomplete-suggestion location="data.location" country-code="{{countryCode}}" on-selection="onAddressSelection(location)" ng-model="data.location.formatted_address" readonly required>
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
```

## Release Notes

v1.0.0
- Now is using Ionic Modal service and can be used inside another Ionic Modal