// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.



$('#myTab a').on('click', function (event) {
    event.preventDefault()
    $(this).tab('show')
})

$('.deliveryButton').on('click', function () {
    $('#deliveryModal').modal('toggle')
})

$('.dietaryButton').on('click', function () {
    $('#dietaryModal').modal('toggle')
})

// Dietary Preference Cookies
$(function () {
    // Set cookie, used example from W3 Schools
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        console.log(`Cookie set: ${cname}=${cvalue}; ${expires}`);
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function checkCookie() {
        let dietaryInfo = [];
        $('#dietaryForm input[type=checkbox]:checked').each(function () {
            dietaryInfo.push(this.value);
        });
        let dietaryInfoStr = dietaryInfo.join(',');
        setCookie("dietary_info", dietaryInfoStr, 36500);
        console.log(`Updated cookie with dietary info: ${dietaryInfoStr}`);
    }

    function filterCards() {
        let dietaryInfoStr = getCookie("dietary_info");
        let dietaryInfo = dietaryInfoStr ? dietaryInfoStr.split(',') : [];
        console.log(`Filtering cards with dietary info: ${dietaryInfo}`);

        if (dietaryInfo.length === 0 || dietaryInfoStr.trim() === "") {
            $('.food .card').show();
        } else {
            $('.food .card').each(function () {
                let cardDietaryIds = $(this).attr('data-dietary-id').toString().split(',').map(id => id.trim());
                if (cardDietaryIds.some(id => dietaryInfo.includes(id))) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        noMatches();
    }

    function noMatches() {
        $('.menu-section').each(function () {
            var visibleCards = $(this).find('.card:visible');
            if (visibleCards.length === 0) {
                if (!$(this).find('.no-matches').length) {
                    $(this).append('<p class="no-matches">Sorry, no dish matches your requirements</p>');
                }
            } else {
                $(this).find('.no-matches').remove();
            }
        });
    }

    $(function () {
        let dietaryInfoStr = getCookie("dietary_info");
        if (dietaryInfoStr) {
            let dietaryInfo = dietaryInfoStr.split(',');
            dietaryInfo.forEach(function (value) {
                $(`#dietaryForm input[type=checkbox][value="${value}"]`).prop('checked', true);
            });
        }
        filterCards();
    });

    $('#dietaryForm input[type=checkbox]').on('click', function () {
        checkCookie();
        filterCards();
    });

    $('.clearDietaryButton').on('click', function () {
        $('#dietaryForm input[type=checkbox]').prop('checked', false);

        setCookie("dietary_info", "", -1);
        filterCards();
    });
});



$(function () {

    // Update order buttons with order code to ensure doesn't change on new basket post
    function updateOrderButton() {
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);
        orderCode = params.get('orderCode') || '';

        $('.order-now-btn').each(function () {
            $(this).attr('data-order-code', orderCode);
        });
        $(`.order-code`).attr('data-order-code', orderCode);
    };

    updateOrderButton();

    // On click of order button fetch details and then add/update basket
    $('.order-now-btn').on('click', function (event) {
        event.preventDefault();

        const itemId = $(this).attr('data-item-id');
        const itemName = $(this).attr('data-item-name');
        const itemPrice = parseFloat($(this).attr('data-item-price'));

        addToBasket(itemId, itemName, itemPrice)
        calculateBasketTotal()
        setTimeout(function () {
            updateOrderButton();
        }, 100);

        console.log('Item id: ' + itemId + ' Item price ' + itemPrice);
    });

    // Add items to basket 
    function addToBasket(itemId, itemName, itemPrice) {
        const basketDiv = $('#basket-items');
        const itemDiv = $(`.basket-item-line[data-item-id="${itemId}"]`);

        // Add multiple items to 1 line up to a max quantitiy of 5
        if (itemDiv.length > 0) {
            let quantity = itemDiv.find('.input-quantity');
            let newQuantity = parseInt(quantity.val()) + 1;
            quantity.val(newQuantity).trigger('change');
            return;
        }


        // Add item html in basket card
        const newItemDiv = $(`<div class="col-12 row align-items-start p-0 my-3 mx-0 basket-item-line" data-item-id="${itemId}" data-item-price="${itemPrice.toFixed(2)}" data-item-total-price="${itemPrice.toFixed(2)}" data-item-quantity="1">`)

        newItemDiv.html(`
        <div class="col-auto p-0">
            <button type="button" class="btn btn-danger btn-sm close" data-item-id="${itemId}">
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <div class="col-7 p-0 ms-2 row">
            <p class="card-title text-start p-0 m-0">${itemName}</p>
            <p class="card-text text-start p-0 text-muted">£<span class="item-total-price" data-item-id="@item.Item_Id">${itemPrice.toFixed(2)}</span></p>
        </div>
        <div class="col-auto ms-auto p-0">
            <select class="basket input-quantity form-control-sm" data-item-id="${itemId}" data-item-quantity="1">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
    `);

        basketDiv.append(newItemDiv);

        postBasket(itemId, itemPrice, 1, 1);
    };

    // Update select options with appropriate quantity on load
    $('.input-quantity').each(function () {
        const itemQuantity = parseInt($(this).attr('data-item-quantity'), 10);
        $(this).val(itemQuantity);
    });


    // Update item total on change of select option
    $('#basket-items').on('change', '.input-quantity', function () {
        const itemId = $(this).attr('data-item-id');
        const itemDiv = $(`.basket-item-line[data-item-id=${itemId}]`);

        const itemPrice = parseFloat(itemDiv.attr('data-item-price')) || 0;
        const itemQuantity = parseInt($(this).val()) || 1;
        const itemTotalPrice = (itemPrice * itemQuantity).toFixed(2);

        itemDiv.attr('data-item-total-price', itemTotalPrice);
        itemDiv.attr('data-item-quantity', itemQuantity);
        itemDiv.find('.item-total-price').text(itemTotalPrice);
        $(`.order-now-btn[data-item-id=${itemId}]`).attr('data-item-quantity', itemQuantity);

        postBasket(itemId, itemTotalPrice, itemQuantity, 1);
        calculateBasketTotal();
        disableOrderButton();
        console.log('Item id: ' + itemId + ' Item price ' + itemPrice + ' Total price ' + itemTotalPrice + ' Item quantity ' + itemQuantity);
    });

    // Disable order button when item type exceeds quantity of 5
    function disableOrderButton() {
        $('.order-now-btn').each(function () {
            const itemId = $(this).attr('data-item-id');
            const itemQuantity = parseInt($(`.basket-item-line[data-item-id=${itemId}]`).attr('data-item-quantity')) || 1;
            $(this).attr('data-item-quantity', itemQuantity);

            if (itemQuantity == 5) {
                $(this).prop('disabled', true);
            } else {
                $(this).prop('disabled', false);
            }

        });
    };

    disableOrderButton();

    // Calc total of basket 
    function calculateBasketTotal() {
        let basketTotal = 0;
        $('.item-total-price').each(function () {
            let priceText = $(this).text().trim();
            let totalPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(totalPrice)) {
                basketTotal += totalPrice;
            }
        });

        $('#basketSubTotal').text(basketTotal.toFixed(2));
        console.log('Basket Total: ' + basketTotal.toFixed(2))
    };

    calculateBasketTotal();

    // Remove item lines on click of x
    $('#basket-items').on('click', '.close', function () {
        const itemId = $(this).attr('data-item-id');

        if (itemId) {
            const itemDiv = $(`.basket-item-line[data-item-id=${itemId}]`);
            postBasket(itemId, 0, 0, 0);
            itemDiv.remove();
            calculateBasketTotal()
            console.log(`Item with item id '${itemId}' removed`);
        } else {
            console.error('Item id is undefined');
        }
        disableOrderButton();
    });

    // Post basket to database
    function postBasket(itemId, itemTotalPrice, itemQuantity, itemStatusId) {

        const orderCode = $(`.order-code`).attr('data-order-code'); // Set order code value
        const itemData = {
            order_id: 0,
            order_code: orderCode,
            item_id: itemId,
            price: itemTotalPrice,
            quantity: itemQuantity,
            status_id: itemStatusId
        };

        // Ajax submission
        $.ajax({
            type: "POST",
            url: '/takeaway/SaveBasket',
            data: itemData,
            success: function (data) {
                console.log('Data saved:', data);
                console.log('Sending data:', itemData);

                if (data.id) {
                    setTimeout(function () {
                        $('#basket-items').find(`.basket-item-line[data-item-id=${itemId}] .item-id`).val(data.order_id); // Add id value to input after 100ms (wasn't working instantly)
                    }, 100);

                }

                if (data.order_code) {
                    setTimeout(function () {
                        $('.order-code').attr('data-order-code', data.order_code); // Add order code value to input
                        console.log('Data order code:', data.order_code);
                    }, 100);

                    // Update the url to ensure only one basket code is present
                    const currentUrl = new URL(window.location.href);
                    const params = new URLSearchParams(currentUrl.search);

                    // Replace or set the url orderCode parameter
                    params.set('orderCode', data.order_code);
                    window.history.replaceState(null, null, `${currentUrl.pathname}?${params.toString()}`);

                }
                updateOrderButton();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
                alert("An error has occurred saving the item data.");
            }
        });
    };

    $('#checkoutButton').on('click', function () {
        const promises = [];

        // Post all basket items with the updated status-id
        $('#basket-items .basket-item-line').each(function () {
            const itemId = $(this).attr('data-item-id');
            const itemTotalPrice = parseFloat($(this).attr('data-item-total-price'));
            const itemQuantity = parseInt($(this).attr('data-item-quantity'));
            promises.push(postBasket(itemId, itemTotalPrice, itemQuantity, 2));
        });

        // Redirect to the checkout page after a short delay to ensure all posts are completed
        Promise.all(promises).then(function () {
            const orderCode = $(`.order-code`).attr('data-order-code');
            window.location.href = `/Takeaway/Checkout?orderCode=${orderCode}`;
            /*alert('Checkout order code: ' + orderCode);*/
            console.log('Checkout order code: ', orderCode);
        }).catch(function (error) {
            console.error('Error posting basket items:', error);
        });
    });



    // Takewaway Checkout Form //


    // Get the orderCode parameter from the URL
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    orderCode = params.get('orderCode') || '';

    // Update the value of the input field with the orderCode value

    $('#Order_code').val(orderCode);


    // Update basket total text
    $(function () {
        let total = 0;

        $('.item-total-price').each(function () {
            let priceText = $(this).text().trim();
            let price = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(price)) {
                total += price;
            }
        });

        $('#basketTotal').text(total.toFixed(2));
    });

    // Update checkout total text
    $('#deliveryCost').on('DOMSubtreeModified', function () {
        const basketTotalText = document.getElementById("basketTotal").textContent;
        const deliveryCostText = this.textContent;
        const basketTotal = parseFloat(basketTotalText.replace('£', ''));
        const deliveryCost = parseFloat(deliveryCostText.replace('£', ''));
        const total = basketTotal + deliveryCost;

        $('#checkoutTotal').text('£ ' + total.toFixed(2));
        $('#Total_price').val(total.toFixed(2));
        console.log("Total:", total);
        return total;
    });

    $.validator.addMethod("pattern", function (value, element, pattern) {
        return this.optional(element) || new RegExp(pattern).test(value);
    }, ""); // Add validation rule for post code

    // Form validation
    $('#checkoutForm').validate({

        // Rules
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
            Address_Line_1: {
                required: true,
            },
            Postal_town: {
                required: true,
            },
            County: {
                required: true,
            },
            Postal_code: {
                required: true,
                "pattern": "^[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}$"
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
            Address_Line_1: {
                required: "Please enter an address",
            },
            Postal_town: {
                required: "Please enter the town or city where the address is located",
            },
            County: {
                required: "Please enter the county where the address is located",
            },
            Postal_code: {
                required: "Please enter the post code where the address is located",
                pattern: "Please enter a valid post code"
            }
        },


        // Highlight fields
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


        // Submission
        submitHandler: function (form) {
            let formData = new FormData(form);
            let url = "/takeaway/SaveCheckout";

            $("#saveCheckoutForm").text("Ordering...");

            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var UserID = data.Order_id;
                    $("#saveCheckoutForm").html('<i class="fa fa-check  m-auto ms-0"></i><span class="me-auto">Order Saved</span>');
                    $("#checkoutForm #Order_id").val(UserID);
                    setTimeout(function () {
                        $("#saveCheckoutForm").html('<i class="fa-regular fa-calendar m-auto ms-0"></i><span class="me-auto">Order Now</span>');
                    }, 2000);
                    $('#basket-items .basket-item-line').each(function () {
                        const itemId = $(this).attr('data-item-id');
                        const itemTotalPrice = parseFloat($(this).attr('data-item-total-price'));
                        const itemQuantity = parseInt($(this).attr('data-item-quantity'));
                        postBasket(itemId, itemTotalPrice, itemQuantity, 3);
                    });
                    window.location.href = `/Takeaway/Confirmation`;
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
                    $("#saveCheckoutForm").html('<i class="fa fa-times  m-auto ms-0"></i><span class="me-auto">Order Failed</span>');
                    return 0;
                },
            });
        }
    });

    // Trigger form submission on button click
    $('#saveCheckoutForm').on('click', function () {
        $('#checkoutForm').trigger('submit');
    });

});

// Change price depending on delivery address
$(function () {
    $("#Postal_town").on("blur", function () {
        const town = $(this).val().trim();
        let deliveryCost = "";

        if (town.toLowerCase() === "rochdale") {
            deliveryCost = "&pound; 6.50";
        } else if (town.toLowerCase() === "") {
            deliveryCost = "Please enter an address";
        } else {
            deliveryCost = "&pound; 9.00";
        }

        $("#deliveryCost").html(deliveryCost);
    });

    $("#County").on("blur", function () {
        const county = $(this).val().trim();
        let deliveryAvaliable = "";

        if (county.toLowerCase() === "greater manchester") {
            deliveryAvaliable = '';
            $("#deliveryCost").show();
        } else {
            deliveryAvaliable = "Sorry, we do not deliver outside Greater Manchester";
            $("#deliveryCost").hide();
        }

        $("#deliveryAvailable").html(deliveryAvaliable);
    });

    $("input").on("blur", function () {
        let firstName = $('#First_name').val();
        let lastName = $('#Last_name').val();
        let emailAddress = $('#Email').val();
        let addressLine1 = $('#Autocomplete').val();
        let postalTown = $('#Postal_town').val();
        let county = $('#Administrative_area_level_2').val();
        let postalCode = $('#Postal_code').val();
        var address = addressLine1 + "<br />" +
            postalTown + "<br />" +
            county + "<br />" +
            postalCode;

        $('#yourName').text(firstName + " " + lastName);
        $('#yourEmail').text(emailAddress);
        $('#yourAddress').html(address);
    });
});




// Booking Form
$(function () {

    // Time select2
    $("#Select_booking_time").select2({
        minimumResultsForSearch: Infinity
    });

    // Update input with selected option
    $('#Select_booking_time').on('change', function () {
        var selectedValue = $(this).val();
        $('#Booking_time').val(selectedValue);
        $('#Booking_time-error').hide();
    });

    // Insert dietary id into input (need to do)

    // Form validation
    $('#bookingForm').validate({

        // Rules
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


        // Highlight fields
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


        // Submission
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
                    /*window.location.href = `/Takeaway/Confirmation`;*/

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
