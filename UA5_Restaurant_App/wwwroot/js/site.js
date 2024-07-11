// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.



$('#myTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})


$('.checkoutButton').on('click', function () {
    $('#checkoutModal').modal('toggle')
})

$('.dietaryButton').on('click', function () {
    $('#dietaryModal').modal('toggle')
})


$('.paymentButton').on('click', function () {
    $('#deliveryDetails').toggle();
    $('#paymentDetails').toggle();
})

$('.deliveryButton').on('click', function () {
    $('#deliveryDetails').toggle();
    $('#paymentDetails').toggle();
})



$('#saveDietaryButton').on('click', function () {
    $('#dietaryForm').trigger('submit');
})

/*$(function () {
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

    // Function to filter and show/hide cards based on preferences
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
                $(this).append('<p class="no-matches">No dish matches your requirements</p>');
            } else {
                // Remove no matches message if shown
                $(this).find('.no-matches').remove();
            }
        });
    }

    // Load preferences from local storage on page load
    var preferences = loadPreferences();
    $.each(preferences, function (key, value) {
        $('#' + key).prop('checked', value);
    });

    // Filter cards based on loaded preferences
    filterCards(preferences);

    // Form submission
    $('#dietaryForm').on('submit', function (event) {
        event.preventDefault();

        // Serialize form data into preferences object
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = this.checked;
        });

        // Save to local storage
        savePreferences(formData);

        $("#saveDietaryButton").text("Saving...");

        // Ajax submission
        $.ajax({
            success: function () {
                $("#saveDietaryButton").html('<i class="fa fa-check me-2"></i>Saved');
                setTimeout(function () {
                    $("#saveDietaryButton").html('Save Changes');
                }, 500);
            },
            error: function () {
                $("#saveDietaryButton").html('<i class="fa fa-times me-2"></i>Changes Failed');
            }
        });

        filterCards(formData);
    });

    // Clear form checkboxes
    $('#clearDietaryButton').on('click', function () {
        $('#dietaryForm input[type=checkbox]').prop('checked', false);
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = false;
        });
        savePreferences(formData);
        filterCards(formData);
    });
});*/

$(function () {
    // Function to load saved dietary preferences from cookies
    function loadPreferences() {
        var cookie = document.cookie.match('(^|[^;]+)\\s*dietaryPreferences\\s*=\\s*([^;]+)');
        if (cookie) {
            return JSON.parse(decodeURIComponent(cookie.pop()));
        }
        return {};
    }

    // Function to save dietary preferences to cookies
    function savePreferences(preferences) {
        var cookieValue = encodeURIComponent(JSON.stringify(preferences));
        document.cookie = `dietaryPreferences=${cookieValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    }

    // Function to filter and show/hide cards based on preferences
    function filterCards(preferences) {
        var anyPreferenceSelected = false;

        // Check if any preference is selected
        $.each(preferences, function (key, value) {
            if (value) {
                anyPreferenceSelected = true;
                return false; // exit loop early
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
                $(this).append('<p class="no-matches">No dish matches your requirements</p>');
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

    // Form submission using delegated event handling
    $(document).on('submit', '#dietaryForm', function (event) {
        event.preventDefault();

        // Serialize form data into preferences object
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = this.checked;
        });

        // Save to cookies
        savePreferences(formData);

        $("#saveDietaryButton").text("Saving...");

        // Simulate AJAX submission (replace with actual AJAX call as needed)
        setTimeout(function () {
            $("#saveDietaryButton").html('<i class="fa fa-check me-2"></i>Saved');
            setTimeout(function () {
                $("#saveDietaryButton").html('Save Changes');
            }, 500);
        }, 1000); // Simulate 1 second delay for demonstration

        // Filter cards based on current form data
        filterCards(formData);
    });

    // Clear form checkboxes and preferences
    $('#clearDietaryButton').on('click', function () {
        $('#dietaryForm input[type=checkbox]').prop('checked', false);
        var formData = {};
        $('#dietaryForm input[type=checkbox]').each(function () {
            formData[this.id] = false;
        });
        savePreferences(formData);
        filterCards(formData);
    });
});



$(function () {
    $('.order-now-btn').on('click', function (event) {
        event.preventDefault();

        const title = $(this).data('title');
        const price = parseFloat($(this).data('price'));
        const id = $(this).attr('id');

        // Add item to basket
        addToBasket(id, title, price);
    });

    function addToBasket(id, title, price) {
        const basketItemsDiv = $('#basket-items');

        // Create new item div
        const newItemDiv = $('<div>').addClass('col-12 row align-items-start p-0 my-3 mx-0');

        // HTML for the new item
        newItemDiv.html(`
        <div class="col-auto p-0">
            <button type="button" class="close">
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <div class="col-7 p-0 ms-2 row">
            <p class="card-title text-start p-0 m-0">${title}</p>
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
        <input type="hidden" name="id" id="id" value="${id}">
        <input type="hidden" name="name" id="name" value="${title}">
        <input type="hidden" class="price" name="price" value="${price.toFixed(2)}">

    `);

        basketItemsDiv.append(newItemDiv);

        // Attach change event to the select element to update the price
        newItemDiv.find('.input-quantity').on('change', function () {
            const quantity = parseInt($(this).val());
            const basePrice = parseFloat(price); // Assuming price is the base price for this item
            const totalPrice = (basePrice * quantity).toFixed(2);

            // Update displayed price
            newItemDiv.find('.item-price').text(totalPrice);

            // Update hidden input value with total price
            newItemDiv.find('.total-price').val(totalPrice);
        });
    }


});

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
    $.ajax({
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
    });
});


$("#time-select").select2({
    minimumResultsForSearch: Infinity
});