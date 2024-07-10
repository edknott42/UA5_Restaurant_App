// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.



$('#myTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})


$('.deliveryButton').on('click', function () {
    $('#deliveryModal').modal('toggle')
})

$('.dietaryButton').on('click', function () {
    $('#dietaryModal').modal('toggle')
})


$('#saveDeliveryButton').on('click', function () {
    $('#deliveryForm').trigger('submit');
})

$('#deliveryForm').on('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Your custom form submission logic here
    console.log('Form submitted!');


    $("#saveDeliveryButton").text("Saving...");
    // Optionally, you can use AJAX to submit the form data
    // Example using jQuery's $.ajax() method
    $.ajax({
        url: '/takeaway/SaveDelivery',
        method: 'POST',
        data: $(this).serialize(), // Serialize form data
        success: function (response) {
            console.log('Form submission successful');
            // Handle success response
            $("#saveDeliveryButton").html('<i class="fa fa-check me-2"></i>Saved');
            setTimeout(function () {
                $("#saveDeliveryButton").html('Save Changes');
            }, 2000);
        },
        error: function (error) {
            console.error('Form submission failed');
            // Handle error response
            $("#saveDeliveryButton").html('<i class="fa fa-times me-2"></i>Changes Failed');
        }
    });
});

$('#saveDietaryButton').on('click', function () {
    $('#dietaryForm').trigger('submit');
})

$(function () {
    // Function to load saved dietary preferences from local storage
    function loadPreferences() {
        var savedPreferences = localStorage.getItem('dietaryPreferences');
        if (savedPreferences) {
            return JSON.parse(savedPreferences);
        }
        return {};
    }

    // Function to save dietary preferences to local storage
    function savePreferences(preferences) {
        localStorage.setItem('dietaryPreferences', JSON.stringify(preferences));
    }

    // Load saved dietary preferences from local storage
    var preferences = loadPreferences();

    // Populate checkboxes based on saved preferences
    $.each(preferences, function (key, value) {
        $('#' + key).prop('checked', value);
    });

    // Handle form submission
    $('#dietaryForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Serialize form data into preferences object
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = this.checked ? 1 : 0; // Convert boolean to 1 or 0
        });

        // Save preferences to local storage
        savePreferences(formData);

        // Custom form submission logic here
        console.log('Form submitted!', formData); // Log preferences for debugging

        $("#saveDietaryButton").text("Saving...");
        // AJAX submission
        $.ajax({
            url: '/dietary/SaveDietary',
            method: 'POST',
            data: formData, // Send serialized form data
            success: function (response) {
                console.log('Form submission successful', response);
                // Handle success response if needed
                $("#saveDietaryButton").html('<i class="fa fa-check me-2"></i>Saved');
                setTimeout(function () {
                    $("#saveDietaryButton").html('Save Changes');
                }, 2000);
            },
            error: function (error) {
                console.error('Form submission failed', error);
                // Handle error response if needed
                $("#saveDietaryButton").html('<i class="fa fa-times me-2"></i>Changes Failed');
            }
        });
    });
});





$("#time-select").select2({
    minimumResultsForSearch: Infinity
});