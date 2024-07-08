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

$("#time-select").select2({
    minimumResultsForSearch: Infinity
});