
  /*  Copyright 2023 Google LLC

    Licensed under the Apache License, Version 2.0(the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.*/

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            types: ['geocode'],
            componentRestrictions: {
                country: 'gb',
            } // Restrict to the United Kingdom
        }

    );

    // When the user selects an address from the dropdown, populate the address fields in the form.
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();

        // Get each component of the address from the place details, and fill the corresponding field on the form.
        for (var component in componentForm) {
            document.getElementById(component).value = '';
            document.getElementById(component).disabled = false;
        }

        // Loop through the address components and set the values.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                document.getElementById(addressType).value = val;
            }
        }

        $('#postal_town').trigger('blur');
        $('#administrative_area_level_2').trigger('blur');
    });
}

// This will bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

var componentForm = {
    administrative_area_level_2: 'long_name',
    postal_town: 'long_name',
    postal_code: 'short_name'
};


// Initialize the Google Places Autocomplete
google.maps.event.addDomListener(window, 'load', initAutocomplete);

// Change price depending on delivery address in 
$(function () {
    $("#postal_town").on("blur", function () {
        const town = $(this).val().trim();
        let deliveryCost = ""; 

        if (town.toLowerCase() === "rochdale") {
            deliveryCost = "&pound;6.50";
        } else if (town.toLowerCase() === "") { 
            deliveryCost = "Please enter an address";
        } else {
            deliveryCost = "&pound;9.00"; 
        }

        $("#deliveryCostID").html(deliveryCost);
    });

    $("#administrative_area_level_2").on("blur", function () {
        const county = $(this).val().trim();
        let deliveryAvaliable = "";

        if (county.toLowerCase() === "greater manchester") {
            deliveryAvaliable = "";
        } else {
            deliveryAvaliable = "Sorry, we do not deliver outside Greater Manchester";
            $("#deliveryCostID").html("");
        }

        $("#deliveryAvailableID").html(deliveryAvaliable);
    });
});
