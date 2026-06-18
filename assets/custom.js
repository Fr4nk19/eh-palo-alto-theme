/*
* Palo Alto Theme
*
* Use this file to add custom Javascript to Palo Alto.  Keeping your custom
* Javascript in this fill will make it easier to update Palo Alto. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Add custom code below this line

  document.addEventListener('DOMContentLoaded', function() {
    var returnRef = document.referrer;
    document.querySelector('#return_to_wholesale').value = returnRef;
  },false);








  // ^^ Keep your scripts inside this IIFE function call to
  // avoid leaking your variables into the global scope.
})();


$('.product__block.ingredients_popup .product__subheading').click(function(){
    $('.custom-ingredients_popup').addClass('active');
      $('.custom-ingredients_popup').show();
    $('body').addClass('popup_active');
});

$('.ingredients__accordion #open-ingredients-modal').click(function(){
    $('.custom-ingredients_popup').addClass('active');
      $('.custom-ingredients_popup').show();
    $('body').addClass('popup_active');
});

$('.custom-ingredients_popup span.close_button').click(function(){
    $('.custom-ingredients_popup').removeClass('active');
  $('.custom-ingredients_popup').hide();
    $('body').removeClass('popup_active');
});

document.addEventListener('quizKitAddToCartSuccess', function (e) {
  window.cart.getCart()
}, false);

