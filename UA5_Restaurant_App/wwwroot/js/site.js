// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.



$('#myTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})


function showDeliveryPopup() {
    document.getElementById("myDeliveryCost").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function hideDeliveryPopup() {
    document.getElementById("myDeliveryCost").style = "";
    document.body.style = "";
}