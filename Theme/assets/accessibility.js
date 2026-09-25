function addIframeTitle() {
    var iframe = $('#PBarNextFrame');
    
    if (iframe.length) {
        iframe.attr('title', 'Preview Bar Frame');
    } else {
        setTimeout(addIframeTitle, 500); 
    }
}
$(document).ready(function() {
    setTimeout(addIframeTitle, 2000);
});


// menu dropdown focusout issue handling

document.querySelectorAll('.header__dropdown').forEach((dropdown) => {
  dropdown.addEventListener('focusout', () => {
    setTimeout(() => {
      const activeElement = document.activeElement;

      // Check if focus moved to top-level nav link
      if (
        activeElement &&
        activeElement.classList.contains('navlink--toplevel')
      ) {
        // Set aria-expanded to false
        dropdown.setAttribute('aria-expanded', 'false');

        // Remove is-visible class from menu item
        const menuItem = dropdown.closest('.menu__item');

        if (menuItem) {
          menuItem.classList.remove('is-visible');
        }

        // Remove inline style from site-header background
        const headerBg = document.querySelector('.site-header__background');

        if (headerBg) {
          headerBg.removeAttribute('style');
        }
      }
    }, 0);
  });
});

//saerch button focus back 

$(document).on('click', '.search-popdown__close', function (e) {

    e.preventDefault();
    e.stopPropagation();

    const $details = $(this).closest('details');
    const $summary = $details.find('.search-popdown__toggle');

    // Close details properly
    $details.prop('open', false);
    $details.removeAttr('open');
    $details.removeClass('is-open');

    // Force browser repaint
    requestAnimationFrame(function () {

        setTimeout(function () {

            // Blur current active element
            if (document.activeElement) {
                document.activeElement.blur();
            }

            // Focus summary toggle
            $summary.attr('tabindex', '-1');

            $summary[0].focus();

            // Remove temporary tabindex
            setTimeout(function () {
                $summary.removeAttr('tabindex');
            }, 10);

        }, 300);

    });

});


$(document).ready(function () {
    setInterval(function () {
        $('#cloud-search-results').removeAttr('role');
        $('.results-block.block-products').removeAttr('role');
        $('.results-block block-pages').removeAttr('role');
        $('.predictive-search__list').removeAttr('role');
        $('.predictive-search__item').removeAttr('role');
        $('.search-popdown__results').removeAttr('tabindex');
    }, 10000); 
});

