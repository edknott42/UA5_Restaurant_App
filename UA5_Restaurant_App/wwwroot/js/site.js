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

$('#saveDietaryButton').on('click', function () {
    $('#dietaryForm').trigger('submit');
})

$('.form-check-input').on('click', function () {
    $('#dietaryForm').trigger('submit');
})


// Dietary Preference Cookies
$(function () {
    // Load saved dietary preferences from cookies
    function loadPreferences() {
        var cookie = document.cookie.match('(^|[^;]+)\\s*dietaryPreferences\\s*=\\s*([^;]+)');
        if (cookie) {
            return JSON.parse(decodeURIComponent(cookie.pop()));
        }
        return {};
    }

    // Save dietary preferences to cookies
    function savePreferences(preferences) {
        var cookieValue = encodeURIComponent(JSON.stringify(preferences));
        document.cookie = `dietaryPreferences=${cookieValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
        $('#Dietary_title').val(cookieValue);
    }

    // Filter cards based on preferences
    function filterCards(preferences) {
        var anyPreferenceSelected = false;

        // Check if any preference is selected
        $.each(preferences, function (key, value) {
            if (value) {
                anyPreferenceSelected = true;
                return false;
            }
        });

        // Show all cards if no preferences are selected
        if (!anyPreferenceSelected) {
            $('.food .card').show();
            $('.menu-section').find('.no-matches').remove();
            return;
        }

        // Reset visibility for all cards
        $('.food .card').hide();

        // Show cards based on preferences
        $.each(preferences, function (key, value) {
            if (value) {
                $('.food .card .allergens:contains("' + key + '")').closest('.card').show();
            }
        });

        // Check if any cards are visible in each menu section
        $('.menu-section').each(function () {
            var visibleCards = $(this).find('.card:visible');
            if (visibleCards.length === 0) {
                // No matching dishes, show no matches message
                $(this).append('<p class="no-matches">Sorry, no dish matches your requirements</p>');
            } else {
                // Remove no matches message if shown
                $(this).find('.no-matches').remove();
            }
        });
    }

    // Load preferences from cookies on page load
    var preferences = loadPreferences();
    $.each(preferences, function (key, value) {
        $('#' + key).prop('checked', value);
    });

    // Filter cards based on loaded preferences
    filterCards(preferences);

    // Form submission
    $('#dietaryForm').on('submit', function (event) {
        event.preventDefault();

        // Serialise form data into preferences object
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = this.checked;
        });

        // Save to cookies
        savePreferences(formData);

        // Filter cards based on current form data
        filterCards(formData);
    });

    // Clear preferences
    $('#clearDietaryButton').on('click', function () {
        $('#dietaryForm input[type=checkbox]').prop('checked', false);
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = false;
        });
        savePreferences(formData);
        filterCards(formData);
    });

    // Update already saved dietary info on page load
    $('#Dietary_title').val(encodeURIComponent(JSON.stringify(preferences)));
});




// Add to basket
$(function () {
    $('.order-now-btn').on('click', function (event) {
        event.preventDefault();

        const dishName = $(this).data('dish-name');
        const price = parseFloat($(this).data('price'));
        const id = $(this).attr('id');


        // Add item to basket
        addToBasket(id, dishName, price);
    });

    function addToBasket(id, dishName, price) {
        const basketItemsDiv = $('#basket-items');

        // Check if item already exists in the basket
        let existingItem = basketItemsDiv.find(`#basket-item-${id}`);
        if (existingItem.length > 0) {
            let quantitySelect = existingItem.find('.input-quantity');
            let newQuantity = parseInt(quantitySelect.val()) + 1;
            quantitySelect.val(newQuantity).trigger('change');
            return;
        }

        // Create new item div
        const newItemDiv = $('<div>').addClass('col-12 row align-items-start p-0 my-3 mx-0').attr('id', `basket-item-${id}`);

        // HTML for the new item
        newItemDiv.html(`
            <div class="col-auto p-0">
                <button type="button" class="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="col-7 p-0 ms-2 row">
                <p class="card-title text-start p-0 m-0">${dishName}</p>
                <p class="card-text text-start p-0 text-muted">£<span class="item-price">${price.toFixed(2)}</span></p>
            </div>
            <div class="col-auto ms-auto p-0">
                <select class="basket input-quantity form-control-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <input type="hidden" name="Id" id="Id" value="">
            <input type="hidden" name="Dish_id" id="Dish_Id" value="${id}">
            <input type="hidden" class="price" name="Price" id="Price" value="${price.toFixed(2)}">
            <input type="hidden" class="quantity" name="Quantity" id="Quantity" value="1">
        `);

        basketItemsDiv.append(newItemDiv);

        // Attach change event to the select element to update the price
        newItemDiv.find('.input-quantity').on('change', function () {
            const quantity = parseInt($(this).val());
            const basePrice = parseFloat(price); // Assuming price is the base price for this item
            const totalPrice = (basePrice * quantity).toFixed(2);

            // Update displayed price
            newItemDiv.find('.item-price').text(totalPrice);

            // Update hidden input value with total price and quantitiy
            newItemDiv.find('.price').val(totalPrice);
            newItemDiv.find('.quantity').val(quantity);
        });

        // Attach click event to the close button to remove the item
        newItemDiv.find('.close').on('click', function () {
            newItemDiv.remove();
        });
    }

    // Handle form submission
    $('#basketButton').on('click', function () {
        $('#basketForm').trigger('submit');
    });

    $('#basketForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        $("#basketButton").text("Checking out...");

        let formData = new FormData(this);
        let url = '/takeaway/SaveBasket';
        $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var UserID = data.Id;
                $("#basketButton").html('<i class="fa fa-check  m-auto ms-0"></i><span class="me-auto">Proceeding to Checkout...</span>');
                $("#basketForm #Id").val(UserID);
                setTimeout(function () {
                    $("#basketButton").html('<i class="fa-solid fa-cart-shopping m-auto ms-0"></i><span class="me-auto">Checkout Now</span>');
                }, 2000);
            },
            timeout: 3000,
            tryCount: 0,
            retryLimit: 3,
            error: function (xhr, textStatus, errorThrown) {
                if (textStatus === 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        $.ajax(this);
                        return;
                    }
                    return;
                }
                alert("An error has occurred saving the data.");
                $("#basketButton").html('<i class="fa fa-times  m-auto ms-0"></i><span class="me-auto">Check out Failed</span>');
                return 0;
            },
        });
    });
});


// Takewaway Checkout Form
$('#saveCheckoutButton').on('click', function () {
    $('#checkoutForm').trigger('submit');
})

$('#checkoutForm').on('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Your custom form submission logic here
    console.log('Form submitted!');


    $("#saveCheckoutButton").text("Checking out...");
    // Optionally, you can use AJAX to submit the form data
    // Example using jQuery's $.ajax() method
    /*$.ajax({
        url: '/takeaway/SaveTakeaway',
        method: 'POST',
        data: $(this).serialize(), // Serialize form data
        success: function (response) {
            console.log('Form submission successful');
            // Handle success response
            $("#saveCheckoutButton").html('<i class="fa fa-check  m-auto ms-0""></i><span class="me-auto">Checked out</span>');
            setTimeout(function () {
                $("#saveCheckoutButton").html('<i class="fa-solid fa-cart-shopping m-auto ms-0"></i><span class="me-auto">Checkout</span>');
            }, 2000);
        },
        error: function (error) {
            console.error('Form submission failed');
            // Handle error response
            $("#saveCheckoutButton").html('<i class="fa fa-times  m-auto ms-0""></i>Checkout Failed');
        }
    });*/
    
});






// Booking Form
$(function () {

    // Initalise select2
    $("#Select_booking_time").select2({
        minimumResultsForSearch: Infinity
    });

    // Update input with selected option
    $('#Select_booking_time').on('change', function () {
        var selectedValue = $(this).val();
        $('#Booking_time').val(selectedValue);
        $('#Booking_time-error').hide();
    });

    // Initialise form validation
    $('#bookingForm').validate({

        // Validation rules
        ignore: [],
        rules: {
            First_name: {
                required: true
            },
            Last_name: {
                required: true
            },
            Email_address: {
                required: true,
                email: true
            },
            Booking_date: {
                required: true,
                date: true
            },
            Booking_time: {
                required: true,
            },
            Table_size: {
                required: true,
                digits: true
            }
        },

        // Error messages
        messages: {
            First_name: {
                required: "Please enter your first name"
            },
            Last_name: {
                required: "Please enter your last name"
            },
            Email_address: {
                required: "Please enter your email address",
                email: "Please enter a valid email address"
            },
            Booking_date: {
                required: "Please enter your booking date",
                date: "Please enter a valid date"
            },
            Booking_time: {
                required: "Please enter your booking time",
            },
            Table_size: {
                required: "Please enter the number of guests",
                digits: "Please enter only digits"
            }
        },


        // Highlight/unhighlight fields
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('field-validation-valid');
            error.insertAfter(element);
        },


        // Form submission
        submitHandler: function (form) {
            let formData = new FormData(form);
            let url = "/booking/SaveBooking";

            $("#saveBookingForm").text("Booking...");

            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var UserID = data.Id;
                    $("#saveBookingForm").html('<i class="fa fa-check  m-auto ms-0"></i><span class="me-auto">Booking Saved</span>');
                    $("#bookingForm #Id").val(UserID);
                    setTimeout(function () {
                        $("#saveBookingForm").html('<i class="fa-regular fa-calendar m-auto ms-0"></i><span class="me-auto">Book Now</span>');
                    }, 2000);
                },
                timeout: 3000,
                tryCount: 0,
                retryLimit: 3,
                error: function (xhr, textStatus, errorThrown) {
                    if (textStatus === 'timeout') {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            $.ajax(this);
                            return;
                        }
                        return;
                    }
                    alert("An error has occurred saving the data.");
                    $("#saveBookingForm").html('<i class="fa fa-times  m-auto ms-0"></i><span class="me-auto">Booking Failed</span>');
                    return 0;
                },
            });
        }
    });

    // Trigger form submission on button click
    $('#saveBookingForm').on('click', function () {
        $('#bookingForm').trigger('submit');
    });
});
