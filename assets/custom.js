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


// custom.js — cargar DESPUÉS de Flickity y del JS del tema
(function () {
  const PRESS_SECTION_SEL = '[data-section-type="press"], .section--press, .press-section';
  const SLIDER_SEL   = '[data-press-items]';
  const NAV_SEL      = '[data-logo-slider]';
  const LOGO_SLIDE   = '[data-logo-slide]';

  function patchPressSection(sectionEl) {
    try {
      if (!window.Flickity) {
        console.warn('[patchPressSection] Flickity no está disponible');
        return;
      }

      const slider = sectionEl.querySelector(SLIDER_SEL);
      const navEl  = sectionEl.querySelector(NAV_SEL);
      if (!slider) {
        console.warn('[patchPressSection] No encontré el slider principal dentro de la sección', sectionEl);
        return;
      }

      // Instancia actual creada por el tema
      const main = Flickity.data(slider);
      if (!main) {
        // Aún no lo inicializa el tema; no forzamos nada
        console.info('[patchPressSection] Aún sin instancia principal, me salgo');
        return;
      }

      // Si ya hay dots activos y presentes en el DOM, no hacemos nada
      const dotsYaEnOpts = main.options && main.options.pageDots === true;
      const dotsEnDOM = !!slider.querySelector('.flickity-page-dots');
      if (dotsYaEnOpts && dotsEnDOM) {
        console.info('[patchPressSection] Dots ya activos');
        return;
      }

      const currentIndex = typeof main.selectedIndex === 'number' ? main.selectedIndex : 0;
      const newMainOpts = Object.assign({}, main.options, { pageDots: true });

      // Destruir y reinstanciar con dots
      main.destroy();
      const newMain = new Flickity(slider, newMainOpts);
      newMain.select(currentIndex);

      // Re-sincronizar con el nav si existe
      const nav = navEl ? (Flickity.data(navEl) || null) : null;
      if (nav) {
        if (typeof nav.off === 'function') nav.off('change');
        if (typeof newMain.off === 'function') newMain.off('change');

        nav.on('change', (i) => newMain.select(i));
        newMain.on('change', (i) => nav.select(i));
      }

      // (Opcional) helper del tema
      if (typeof window.flickitySmoothScrolling === 'function') {
        window.flickitySmoothScrolling(slider);
      }

      // (Opcional) reponer el a11y del logoSlide que hacía Press
      sectionEl.querySelectorAll(LOGO_SLIDE).forEach((slide) => {
        slide.addEventListener('keyup', (event) => {
          const code = event.code;
          if (code === 'Enter' || code === 'NumpadEnter' || code === 'Space') {
            const idx = Number(slide.getAttribute('data-logo-slide'));
            if (!Number.isNaN(idx)) newMain.selectCell(idx);
          }
        });
      });

      console.info('[patchPressSection] Reinstanciado con pageDots:true (index %o)', currentIndex);
    } catch (err) {
      console.error('[patchPressSection] Error:', err, sectionEl);
    }
  }

  function runAll() {
    document.querySelectorAll(PRESS_SECTION_SEL).forEach(patchPressSection);
  }

  // Ejecutar cuando el tema YA montó todo
  if (document.readyState === 'complete') {
    setTimeout(runAll, 0);
  } else {
    window.addEventListener('load', runAll);
  }

  // Shopify editor: al recargar una sección
  document.addEventListener('shopify:section:load', (e) => {
    const el = e.target;
    if (!el) return;
    if (el.matches(PRESS_SECTION_SEL)) {
      patchPressSection(el);
    }
  });
})();
