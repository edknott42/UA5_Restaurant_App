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


/*

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
        const newItemDiv = $('<div>').addClass('col-12 row align-items-start p-0 my-3 mx-0 basket-item-line').attr('id', `basket-item-${id}`);

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
            <input type="hidden" class="item-id" name="Id" id="Id" value="" data-id="${id}">
            <input type="hidden" class="basket-id" name="basket_id" id="basket_id" value="" data-id="${id}">
            <input type="hidden" class="dish-id" name="Dish_id" id="Dish_Id" value="${id}" data-id="${id}">
            <input type="hidden" class="price" name="Price" id="Price" value="${price.toFixed(2)}" data-id="${id}">
            <input type="hidden" class="quantity" name="Quantity" id="Quantity" value="1" data-id="${id}">
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

    $('#basketButton').on('click', function () {
        $('#basketForm').trigger('submit');
    });

    let basketIdSet = false;

    $('#basketForm').on('submit', function (event) {
        event.preventDefault(); 

        $("#basketButton").text("Checking out...");

        let url = '/takeaway/SaveBasket';
        let items = $('#basketForm .basket-item-line');
        let totalItems = items.length;
        let itemsProcessed = 0;

        items.each(function () {
            let itemData = {
                id: $(this).find('.item-id').val(),
                basket_id: $(this).find('.basket-id').val(),
                dish_id: $(this).find('.dish-id').val(),
                price: $(this).find('.price').val(),
                quantity: $(this).find('.quantity').val(),
            };


            $.ajax({
                type: "POST",
                url: url,
                data: itemData,
                success: function (data) {

                    if (!basketIdSet) {
                        $(".basket-id").val(data.basket_Id);
                        basketIdSet = true;
                    }

                    itemsProcessed++;
                    if (itemsProcessed === totalItems) {
                        $("#basketButton").html('<i class="fa fa-check m-auto ms-0"></i><span class="me-auto">Proceeding to Checkout...</span>');

                        setTimeout(function () {
                            $("#basketButton").html('<i class="fa-solid fa-cart-shopping m-auto ms-0"></i><span class="me-auto">Checkout Now</span>');
                        }, 2000);
                    }


                    console.log('Success:', data);
                    console.log('Basket ID:', $(".basket-id").val());

                },
                timeout: 3000,
                tryCount: 0,
                retryLimit: 3,
                error: function (xhr, textStatus, errorThrown) {
                    console.error('Error:', textStatus, errorThrown);
                    if (textStatus === 'timeout') {
                        this.tryCount++;
                        if (this.tryCount <= this.retryLimit) {
                            $.ajax(this);
                            return;
                        }
                        return;
                    }
                    alert("An error has occurred saving the data.");
                    $("#basketButton").html('<i class="fa fa-times m-auto ms-0"></i><span class="me-auto">Check out Failed</span>');
                    return 0;
                },
            });
        });
    });
});*/
























$(function () {
    // Variable to hold the basket_id
    let basketId = '';

    // Event handler for the "Order Now" button
    $('.order-now-btn').on('click', function (event) {
        event.preventDefault();

        const dishName = $(this).data('dish-name');
        const price = parseFloat($(this).data('price'));
        const dishId = $(this).attr('id'); // dishId from data or attributes

        // Add item to basket
        addToBasket(dishId, dishName, price, 1);
    });

    function addToBasket(dishId, dishName, price) {
        const basketItemsDiv = $('#basket-items');
        const itemSelector = `.basket-item-line[item-id="${dishId}"]`;
        let existingItem = basketItemsDiv.find(itemSelector);

        if (existingItem.length > 0) {
            // Update quantity and price for existing item
            let quantitySelect = existingItem.find('.input-quantity');
            let newQuantity = parseInt(quantitySelect.val()) + 1;
            quantitySelect.val(newQuantity).trigger('change');
            return;
        }

        // Create new item div with placeholders for item-id and other values
        const newItemDiv = $('<div>')
            .addClass('col-12 row align-items-start p-0 my-3 mx-0 basket-item-line')
            .attr('item-id', dishId); // Set item-id to match the dishId

        // HTML for the new item with hidden inputs
        newItemDiv.html(`
        <div class="col-auto p-0">
            <button type="button" class="btn btn-danger btn-sm close" item-id="${dishId}">
                <span aria-hidden="true">×</span>
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
        <input type="hidden" class="item-id" name="Id" value="">
        <input type="hidden" class="basket-id" name="Basket_id" value="">
        <input type="hidden" class="dish-id" name="Dish_id" value="${dishId}">
        <input type="hidden" class="price" name="Price" value="${price.toFixed(2)}">
        <input type="hidden" class="quantity" name="Quantity" value="1">
        <input type="hidden" class="status-id" name="status_id" value="1">
    `);

        basketItemsDiv.append(newItemDiv);

        // Send AJAX request to add the item
        sendItemData(dishId, price, 1, 1);

        // Attach change event to the select element to update the price
        newItemDiv.find('.input-quantity').on('change', function () {
            const quantity = parseInt($(this).val());
            const basePrice = parseFloat(price);
            const totalPrice = (basePrice * quantity).toFixed(2);
            const statusId = parseInt(newItemDiv.find('.status-id').val(), 10);

            // Update displayed price
            newItemDiv.find('.item-price').text(totalPrice);

            // Update hidden input values with total price and quantity
            newItemDiv.find('.price').val(totalPrice);
            newItemDiv.find('.quantity').val(quantity);

            // Send AJAX request to update the item data
            sendItemData(dishId, price, quantity, statusId);
        });
    }


    // Use event delegation for the close button
    $('#basket-items').on('click', '.close', function () {
        console.log(`Delete button clicked`);
        // Get the ID of the clicked close button from item-id attribute
        const dishId = $(this).attr('item-id');

        if (dishId) {
            // Find the basket item line with the matching ID
            const itemDiv = $(`.basket-item-line[item-id=${dishId}]`);

            // Send the extracted data to your function
            sendItemData(dishId, 0, 0, 0);

            // Remove the item from the DOM
            itemDiv.remove();

            // Log the removal
            console.log(`Item with dish ID '${dishId}' removed`);

        } else {
            console.error('Dish ID is undefined');
        }
    });


    function sendItemData(dishId, price, quantity, statusId) {
        // Ensure basketId is set before sending data
        if (!basketId) {
            // This is a placeholder to show basketId needs to be set before adding items
            // Ideally, basketId would be obtained or set earlier in the flow
            basketId = $('#basket-items').find('.basket-id').first().val();
        }

        const itemId = $('#basket-items').find(`#basket-item-${dishId} .item-id`).val();
        const itemData = {
            id: itemId, // Initially empty and set by server
            basket_id: basketId, // Use the same basket_id for all items
            dish_id: dishId,
            price: price.toFixed(2),
            quantity: quantity,
            status_id: statusId
        };

        $.ajax({
            type: "POST",
            url: '/takeaway/SaveBasket', // Ensure this URL is correct
            data: itemData,
            success: function (data) {
                console.log('Item data saved:', data);
                console.log('Sending data:', itemData);


                // Update item-id if not set (assuming response contains the new id)
                if (!itemId && data.id) {
                    $('#basket-items').find(`#basket-item-${dishId} .item-id`).val(data.id);
                }

                // Set basket_id if not already set
                if (!basketId && data.basket_Id) {
                    $('#basket-items').find(`#basket-item-${dishId} .basket-id`).val(data.basket_Id);
                    $('#checkoutButton').attr('href', `/Takeaway/Checkout?id=${data.basket_Id}`);

                    const currentUrl = window.location.href;
                    const separator = currentUrl.includes('?') ? '&' : '?';
                    const newUrl = `${currentUrl}${separator}id=${data.basket_Id}`;
                    window.history.replaceState(null, null, newUrl);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
                alert("An error has occurred saving the item data.");
            }
        });
    }

    /*$('#basketButton').on('click', function () {
        $('#basketForm').trigger('submit');
    });

    $('#basketForm').on('submit', function (event) {
        event.preventDefault();

        $("#basketButton").text("Checking out...");

        // Previous form submission logic removed as per instructions
    });*/
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
