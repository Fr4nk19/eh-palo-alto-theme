// document.addEventListener('DOMContentLoaded', () => {
//   document.addEventListener('theme:cart:update', function(event) {
//     console.log('El carrito se actualizó', event.detail);
//     const cartItems = document.querySelectorAll('[data-cart-item]');
//     let count = 0;

//     for (const item of cartItems) {
//       const isExcluded =
//         item.hasAttribute('data-wholesale-excluded') &&
//         item.getAttribute('data-wholesale-excluded').trim().toLowerCase() === 'yes';
//       if (!isExcluded) count++;
//     }
//     console.log('[Eligible item lines]', count);
//   });

//   document.addEventListener('theme:cart:open', function(event) {
//     console.log('El cart drawer se abrió', event.detail);
//   });
// });


// document.addEventListener('DOMContentLoaded', () => {
//   const TAG = '[CartQty]';

//   // Lee la cantidad de un line item usando el quantity-counter de Palo Alto
//   function getItemQty(item, idx) {
//     console.groupCollapsed(`${TAG} getItemQty() → item #${idx}`);
//     try {
//       // 1) Caso Palo Alto: dentro de <quantity-counter class="cart__item__quantity">
//       const counter = item.querySelector('quantity-counter.cart__item__quantity');
//       console.log('¿Hay <quantity-counter>?', !!counter);

//       if (counter) {
//         const input =
//           counter.querySelector('input.cart__item__quantity-field') ||
//           counter.querySelector('input[name="updates[]"]') ||
//           counter.querySelector('input[data-quantity-field]');
//         console.log('Input encontrado dentro del counter:', input);

//         if (input) {
//           const propValue = input.value;
//           const attrValue = input.getAttribute('value');
//           let v = parseInt(propValue || attrValue || '0', 10);
//           console.log('Valores crudos → prop:', propValue, 'attr:', attrValue, '→ parse:', v);
//           if (!isNaN(v)) {
//             console.groupEnd();
//             return v;
//           }
//         }

//         // Intento extra: si algún build rellena data-quantity-holder más tarde
//         const rawHolder = counter.dataset?.quantityHolder ?? counter.getAttribute('data-quantity-holder');
//         console.log('data-quantity-holder:', rawHolder);
//         if (rawHolder) {
//           const v = parseInt(rawHolder, 10);
//           if (!isNaN(v)) {
//             console.groupEnd();
//             return v;
//           }
//         }
//       }

//       // 2) Fallbacks genéricos
//       const altInput =
//         item.querySelector('input[name="updates[]"]') ||
//         item.querySelector('input[name="quantity"]') ||
//         item.querySelector('input.quantity__input[type="number"]');
//       console.log('Fallback input fuera del counter:', altInput);
//       if (altInput) {
//         const propValue = altInput.value;
//         const attrValue = altInput.getAttribute('value');
//         let v = parseInt(propValue || attrValue || '0', 10);
//         console.log('Fallback valores → prop:', propValue, 'attr:', attrValue, '→ parse:', v);
//         if (!isNaN(v)) {
//           console.groupEnd();
//           return v;
//         }
//       }

//       // 3) Último recurso: número visible
//       const textEl =
//         item.querySelector('[data-quantity-value]') ||
//         item.querySelector('.quantity__current') ||
//         item.querySelector('.cart-item__quantity') ||
//         item.querySelector('.qty') ||
//         item.querySelector('.product-quantity');
//       console.log('Nodo de texto para qty (fallback):', textEl);

//       if (textEl && textEl.textContent) {
//         const m = textEl.textContent.match(/\d+/);
//         console.log('Regex match en texto:', m);
//         if (m) {
//           const v = parseInt(m[0], 10);
//           if (!isNaN(v)) {
//             console.groupEnd();
//             return v;
//           }
//         }
//       }

//       console.warn('No se pudo determinar qty, devolviendo 0');
//       return 0;
//     } finally {
//       console.groupEnd();
//     }
//   }

//   // Cuenta líneas NO excluidas y suma sus cantidades
//   function countNonExcludedTotals() {
//     console.groupCollapsed(`${TAG} countNonExcludedTotals()`);
//     const items = document.querySelectorAll('[data-cart-item]');
//     console.log('Total de nodos [data-cart-item] encontrados:', items.length);

//     let lines = 0;
//     let units = 0;

//     items.forEach((item, idx) => {
//       const hasOnItem  = item.hasAttribute('data-wholesale-excluded');
//       const hasInside  = !!item.querySelector('[data-wholesale-excluded]');
//       const isExcluded = hasOnItem || hasInside;

//       console.groupCollapsed(`${TAG} Item #${idx} exclusión`);
//       console.log('hasOnItem:', hasOnItem, '| hasInside:', hasInside, '| isExcluded:', isExcluded);
//       console.groupEnd();

//       if (!isExcluded) {
//         const qty = getItemQty(item, idx);
//         lines++;
//         units += qty;
//         console.log(`${TAG} Item #${idx} incluido → qty:`, qty, '→ acumulado units:', units, 'lines:', lines);
//       } else {
//         console.log(`${TAG} Item #${idx} EXCLUIDO, no suma`);
//       }
//     });

//     console.log(`${TAG} RESULTADO → líneas no excluidas: ${lines} | unidades: ${units}`);

//     const lineNode = document.querySelector('[data-non-excluded-count]');
//     const unitNode = document.querySelector('[data-non-excluded-qty]');
    
//     if (lineNode) {
//       lineNode.textContent = String(units);
//       console.log('Actualizado [data-non-excluded-count] (UNIDADES) →', units);
//     } else {
//       console.log('Placeholder [data-non-excluded-count] no encontrado (opcional).');
//     }
//     if (unitNode) {
//       unitNode.textContent = String(units);
//       console.log('Actualizado [data-non-excluded-qty] (UNIDADES) →', units);
//     } else {
//       console.log('Placeholder [data-non-excluded-qty] no encontrado (opcional).');
//     }
//   }

//   // Recontar en el próximo frame (después de que el DOM se actualiza)
//   const recount = () => {
//     console.log(`${TAG} Programando recount con requestAnimationFrame…`);
//     requestAnimationFrame(countNonExcludedTotals);
//   };

//   // Hooks del tema
//   document.addEventListener('theme:cart:update', (event) => {
//     console.groupCollapsed(`${TAG} EVENT: theme:cart:update`);
//     console.log('event.detail:', event?.detail ?? null);
//     console.groupEnd();
//     recount();
//   });

//   document.addEventListener('theme:cart:open', (event) => {
//     console.groupCollapsed(`${TAG} EVENT: theme:cart:open`);
//     console.log('event.detail:', event?.detail ?? null);
//     console.groupEnd();
//     recount();
//   });

//   // Recontar cuando cambian inputs de cantidad
//   const qtyInputSelector = [
//     'quantity-counter.cart__item__quantity input.cart__item__quantity-field',
//     'quantity-counter.cart__item__quantity input[name="updates[]"]',
//     'quantity-counter.cart__item__quantity input[data-quantity-field]'
//   ].join(',');

//   document.addEventListener('input', (e) => {
//     const t = e.target;
//     if (t && t.matches(qtyInputSelector)) {
//       console.groupCollapsed(`${TAG} EVENT: input en qty`);
//       console.log('Target:', t, 'value:', t.value);
//       console.groupEnd();
//       recount();
//     }
//   });

//   document.addEventListener('change', (e) => {
//     const t = e.target;
//     if (t && t.matches(qtyInputSelector)) {
//       console.groupCollapsed(`${TAG} EVENT: change en qty`);
//       console.log('Target:', t, 'value:', t.value);
//       console.groupEnd();
//       recount();
//     }
//   });

//   // Recontar cuando se clickean +/- (por si actualizan value en el mismo tick)
//   document.addEventListener('click', (e) => {
//     const btn = e.target.closest('[data-quantity-button]');
//     if (btn) {
//       console.groupCollapsed(`${TAG} EVENT: click en botón +/-`);
//       console.log('Botón:', btn, 'title:', btn.getAttribute('title'));
//       console.groupEnd();
//       // A veces el value cambia en el mismo microtask; RAF asegura leer el valor actualizado
//       recount();
//     }
//   });

//   // Primer conteo
//   console.log(`${TAG} DOM listo → primer recount`);
//   recount();

//   // Útil para debug en consola
//   // Llama manualmente: window.__cartCountNonExcluded()
//   window.__cartCountNonExcluded = countNonExcludedTotals;
// });



document.addEventListener('DOMContentLoaded', () => {
  const TAG = '[CartQty]';

  // --- Debounce util para no spamear recuentos ---
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // --- Lee el mínimo requerido (settings.wholesale_qty) ---
  function getWholesaleQty() {
    if (typeof window.WHOLESALE_QTY !== 'undefined') {
      const v = parseInt(window.WHOLESALE_QTY, 10);
      console.log(`${TAG} WHOLESALE_QTY (global):`, v);
      return isNaN(v) ? 0 : v;
    }
    const el = document.querySelector('[data-wholesale-qty]');
    if (el) {
      const v = parseInt(el.getAttribute('data-wholesale-qty') || el.dataset.wholesaleQty || '0', 10);
      console.log(`${TAG} WHOLESALE_QTY (DOM data-wholesale-qty):`, v);
      return isNaN(v) ? 0 : v;
    }
    console.warn(`${TAG} WHOLESALE_QTY no definido; usando 0`);
    return 0;
  }

  // --- Qty por línea (Palo Alto: quantity-counter) ---
  function getItemQty(item, idx) {
    console.groupCollapsed(`${TAG} getItemQty() → item #${idx}`);
    try {
      const counter = item.querySelector('quantity-counter.cart__item__quantity');
      console.log('¿Hay <quantity-counter>?', !!counter);

      if (counter) {
        const input =
          counter.querySelector('input.cart__item__quantity-field') ||
          counter.querySelector('input[name="updates[]"]') ||
          counter.querySelector('input[data-quantity-field]');
        console.log('Input dentro del counter:', input);

        if (input) {
          const propValue = input.value;
          const attrValue = input.getAttribute('value');
          let v = parseInt(propValue || attrValue || '0', 10);
          console.log('Valores → prop:', propValue, 'attr:', attrValue, '→ parse:', v);
          if (!isNaN(v)) return v;
        }

        const rawHolder = counter.dataset?.quantityHolder ?? counter.getAttribute('data-quantity-holder');
        console.log('data-quantity-holder:', rawHolder);
        if (rawHolder) {
          const v = parseInt(rawHolder, 10);
          if (!isNaN(v)) return v;
        }
      }

      // Fallbacks
      const altInput =
        item.querySelector('input[name="updates[]"]') ||
        item.querySelector('input[name="quantity"]') ||
        item.querySelector('input.quantity__input[type="number"]');
      console.log('Fallback input fuera del counter:', altInput);
      if (altInput) {
        const propValue = altInput.value;
        const attrValue = altInput.getAttribute('value');
        let v = parseInt(propValue || attrValue || '0', 10);
        console.log('Fallback → prop:', propValue, 'attr:', attrValue, '→ parse:', v);
        if (!isNaN(v)) return v;
      }

      // Último recurso: número visible
      const textEl =
        item.querySelector('[data-quantity-value]') ||
        item.querySelector('.quantity__current') ||
        item.querySelector('.cart-item__quantity') ||
        item.querySelector('.qty') ||
        item.querySelector('.product-quantity');
      console.log('Nodo de texto (fallback):', textEl);
      if (textEl && textEl.textContent) {
        const m = textEl.textContent.match(/\d+/);
        console.log('Regex match en texto:', m);
        if (m) {
          const v = parseInt(m[0], 10);
          if (!isNaN(v)) return v;
        }
      }

      console.warn('No se pudo determinar qty, se usa 0');
      return 0;
    } finally {
      console.groupEnd();
    }
  }

  // --- Recuento principal: suma unidades no excluidas y pinta "restantes" ---
  // function countNonExcludedTotals() {
  //   console.groupCollapsed(`${TAG} countNonExcludedTotals()`);
  //   const items = document.querySelectorAll('[data-cart-item]');
  //   console.log('Nodos [data-cart-item]:', items.length);
  
  //   let units = 0;
  //   items.forEach((item, idx) => {
  //     const hasOnItem  = item.hasAttribute('data-wholesale-excluded');
  //     const hasInside  = !!item.querySelector('[data-wholesale-excluded]');
  //     const isExcluded = hasOnItem || hasInside;
  
  //     console.groupCollapsed(`${TAG} Item #${idx} exclusión`);
  //     console.log('hasOnItem:', hasOnItem, 'hasInside:', hasInside, 'isExcluded:', isExcluded);
  //     console.groupEnd();
  
  //     if (!isExcluded) {
  //       const qty = getItemQty(item, idx);
  //       units += qty;
  //       console.log(`${TAG} Item #${idx} incluido → qty:`, qty, '→ acumulado units:', units);
  //     } else {
  //       console.log(`${TAG} Item #${idx} EXCLUIDO`);
  //     }
  //   });
  
  //   const minQty = getWholesaleQty();
  //   const remaining = Math.max(minQty - units, 0);
  
  //   console.log(`${TAG} RESULTADO → units: ${units} | minQty: ${minQty} | remaining: ${remaining}`);
  
  //   // Pintamos **RESTANTES** en ambos spans
  //   const lineNode = document.querySelector('[data-non-excluded-count]');
  //   const unitNode = document.querySelector('[data-non-excluded-qty]');
  //   if (lineNode) {
  //     lineNode.textContent = String(remaining);
  //     console.log('Actualizado [data-non-excluded-count] (RESTANTES) →', remaining);
  //   } else {
  //     console.log('Placeholder [data-non-excluded-count] no encontrado (opcional).');
  //   }
  //   if (unitNode) {
  //     unitNode.textContent = String(remaining);
  //     console.log('Actualizado [data-non-excluded-qty] (RESTANTES) →', remaining);
  //   } else {
  //     console.log('Placeholder [data-non-excluded-qty] no encontrado (opcional).');
  //   }
  
  //   // Mensaje
  //   const msgNode = document.querySelector('[data-wholesale-progress-text]');
  //   if (msgNode) {
  //     if (minQty <= 0) {
  //       msgNode.textContent = 'Configura un mínimo de unidades para activar el descuento.';
  //     } else if (items.length === 0 || units === 0) {
  //       msgNode.textContent = `Añade ${minQty} ${minQty === 1 ? 'producto' : 'productos'} para activar el descuento.`;
  //     } else if (remaining > 0) {
  //       msgNode.textContent = `Te quedan ${remaining} ${remaining === 1 ? 'producto' : 'productos'} para activar el descuento.`;
  //     } else {
  //       msgNode.textContent = '¡Descuento wholesale activado!';
  //     }
  //     console.log('Actualizado [data-wholesale-progress-text]');
  //   }
  
  //   // 👉 Llama al ocultador de "empty cart" **antes** del return
  //   const isCartEmpty = items.length === 0;
  //   console.log(`${TAG} isCartEmpty:`, isCartEmpty);
  //   window.__hideEmptyCartUI?.(isCartEmpty);
  //   document.querySelector('#wholesale-progress-text')?.style.setProperty(
  //     'display',
  //     isCartEmpty ? 'none' : '',
  //     'important'
  //   );
  
  //   console.groupEnd();
  //   return { units, minQty, remaining };
  // }
  function countNonExcludedTotals() {
    console.groupCollapsed(`${TAG} countNonExcludedTotals()`);
    const items = document.querySelectorAll('[data-cart-item]');
    console.log('Nodos [data-cart-item]:', items.length);
  
    let units = 0;
    items.forEach((item, idx) => {
      const hasOnItem  = item.hasAttribute('data-wholesale-excluded');
      const hasInside  = !!item.querySelector('[data-wholesale-excluded]');
      const isExcluded = hasOnItem || hasInside;
  
      console.groupCollapsed(`${TAG} Item #${idx} exclusión`);
      console.log('hasOnItem:', hasOnItem, 'hasInside:', hasInside, 'isExcluded:', isExcluded);
      console.groupEnd();
  
      if (!isExcluded) {
        const qty = getItemQty(item, idx);
        units += qty;
        console.log(`${TAG} Item #${idx} incluido → qty:`, qty, '→ acumulado units:', units);
      } else {
        console.log(`${TAG} Item #${idx} EXCLUIDO`);
      }
    });
  
    const minQty = getWholesaleQty();
    const remaining = Math.max(minQty - units, 0);
  
    console.log(`${TAG} RESULTADO → units: ${units} | minQty: ${minQty} | remaining: ${remaining}`);
  
    // Pintamos **RESTANTES** en ambos spans
    const lineNode = document.querySelector('[data-non-excluded-count]');
    const unitNode = document.querySelector('[data-non-excluded-qty]');
    if (lineNode) {
      lineNode.textContent = String(remaining);
      console.log('Actualizado [data-non-excluded-count] (RESTANTES) →', remaining);
    } else {
      console.log('Placeholder [data-non-excluded-count] no encontrado (opcional).');
    }
    if (unitNode) {
      unitNode.textContent = String(remaining);
      console.log('Actualizado [data-non-excluded-qty] (RESTANTES) →', remaining);
    } else {
      console.log('Placeholder [data-non-excluded-qty] no encontrado (opcional).');
    }
  
    // Mensaje
    // const msgNode = document.querySelector('[data-wholesale-progress-text], #wholesale-progress-text');
    // if (msgNode) {
    //   if (minQty <= 0) {
    //     msgNode.textContent = 'Configura un mínimo de unidades para activar el descuento.';
    //   } else if (items.length === 0 || units === 0) {
    //     msgNode.textContent = `Añade ${minQty} ${minQty === 1 ? 'producto' : 'productos'} para activar el descuento.`;
    //   } else if (remaining > 0) {
    //     msgNode.textContent = `Te quedan ${remaining} ${remaining === 1 ? 'producto' : 'productos'} para activar el descuento.`;
    //   } else {
    //     msgNode.textContent = '¡Descuento wholesale activado!';
    //   }
    //   console.log('Actualizado [data-wholesale-progress-text]');
    // }

      //   // Mensaje
  //   const msgNode = document.querySelector('[data-wholesale-progress-text]');
  //   if (msgNode) {
  //     if (minQty <= 0) {
  //       msgNode.textContent = 'Configura un mínimo de unidades para activar el descuento.';
  //     } else if (items.length === 0 || units === 0) {
  //       msgNode.textContent = `Añade ${minQty} ${minQty === 1 ? 'producto' : 'productos'} para activar el descuento.`;
  //     } else if (remaining > 0) {
  //       msgNode.textContent = `Te quedan ${remaining} ${remaining === 1 ? 'producto' : 'productos'} para activar el descuento.`;
  //     } else {
  //       msgNode.textContent = '¡Descuento wholesale activado!';
  //     }
  //     console.log('Actualizado [data-wholesale-progress-text]');
  //   }
  
    // Mostrar/ocultar el texto de progreso según umbral alcanzado o carrito vacío
    const progressEls = document.querySelectorAll('#wholesale-progress-text, [data-wholesale-progress-text]');
    const isCartEmpty = (items.length === 0) || (units === 0);
    const shouldHideProgress = (remaining <= 0) || isCartEmpty;
  
    progressEls.forEach((el) => {
      el.style.setProperty('display', shouldHideProgress ? 'none' : '', 'important');
    });
    console.log(`${TAG} Progreso ${shouldHideProgress ? 'OCULTO' : 'VISIBLE'} → remaining: ${remaining}, units: ${units}, isCartEmpty: ${isCartEmpty}`);
  
    // 👉 Ocultar estados de "empty cart" del tema
    console.log(`${TAG} isCartEmpty:`, isCartEmpty);
    window.__hideEmptyCartUI?.(isCartEmpty);
  
    console.groupEnd();
    return { units, minQty, remaining };
  }
  
  
  const recount = () => {
    console.log(`${TAG} requestAnimationFrame → recount`);
    requestAnimationFrame(countNonExcludedTotals);
  };
  const debouncedRecount = debounce(recount, 60);

  // --- Eventos del tema (por si se emiten) ---
  ['theme:cart:update','theme:cart:open','cart:updated','cart:change','ajaxCart:updated'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      console.groupCollapsed(`${TAG} EVENT: ${evt}`);
      console.log('event.detail:', e?.detail ?? null);
      console.groupEnd();
      debouncedRecount();
    });
  });

  // --- Inputs y botones +/- ---
  const qtyInputSelector = [
    'quantity-counter.cart__item__quantity input.cart__item__quantity-field',
    'quantity-counter.cart__item__quantity input[name="updates[]"]',
    'quantity-counter.cart__item__quantity input[data-quantity-field]'
  ].join(',');

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t && t.matches(qtyInputSelector)) {
      console.groupCollapsed(`${TAG} EVENT: input en qty`);
      console.log('Target:', t, 'value:', t.value);
      console.groupEnd();
      debouncedRecount();
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t && t.matches(qtyInputSelector)) {
      console.groupCollapsed(`${TAG} EVENT: change en qty`);
      console.log('Target:', t, 'value:', t.value);
      console.groupEnd();
      debouncedRecount();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quantity-button], [data-cart-remove], .cart__item__remove, [data-remove]');
    if (btn) {
      console.groupCollapsed(`${TAG} EVENT: click en qty/remove`);
      console.log('Botón:', btn, 'title:', btn.getAttribute('title'));
      console.groupEnd();
      debouncedRecount();
    }
  });

  // --- OBSERVADOR DE MUTACIONES: detecta alta/baja de líneas en el DOM ---
  const observer = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (m.type === 'childList') {
        const added = [...m.addedNodes].some(n => n.nodeType === 1 && (n.matches?.('[data-cart-item]') || n.querySelector?.('[data-cart-item]')));
        const removed = [...m.removedNodes].some(n => n.nodeType === 1 && (n.matches?.('[data-cart-item]') || n.querySelector?.('[data-cart-item]')));
        if (added || removed) {
          console.log(`${TAG} MutationObserver → childList cambio en [data-cart-item] (added:${added} removed:${removed})`);
          relevant = true;
          break;
        }
      }
      if (m.type === 'attributes' && m.target) {
        if (m.target.matches('[data-cart-item], [data-quantity-holder], quantity-counter.cart__item__quantity input.cart__item__quantity-field')) {
          console.log(`${TAG} MutationObserver → attributes cambio en`, m.target);
          relevant = true;
          break;
        }
      }
    }
    if (relevant) debouncedRecount();
  });

  // Observamos todo el body porque algunos temas re-renderizan el contenedor completo
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-quantity-holder', 'value']
  });
  console.log(`${TAG} MutationObserver iniciado`);

  // Primer conteo
  console.log(`${TAG} DOM listo → primer recount`);
  recount();

  // Exponer para debug
  window.__cartWholesaleProgress = countNonExcludedTotals;

  (function(){
    const TAG = '[CartQty/HideEmpty]';
  
    // Selectores comunes de "estado vacío" en temas (Palo Alto + genéricos)
    const EMPTY_SELECTORS = [
      '[data-cart-empty]',
      '[data-cart-empty-state]',
      '.cart__empty',
      '.cart--empty',
      '.drawer__empty',
      '.cart-drawer__empty',
      '#CartEmpty',
      '[data-empty]'
    ];
  
    // Intenta cerrar el drawer si está vacío
    function closeCartDrawerIfOpen() {
      // Botones/cierres típicos
      const btn = document.querySelector('[data-cart-close], [data-drawer-close], .drawer__close, [data-action="close-drawer"]');
      if (btn) {
        console.log(`${TAG} Cerrando drawer con botón`, btn);
        btn.click();
        return;
      }
  
      // Fallback: quitar clases conocidas
      const drawer = document.querySelector('.drawer, .cart-drawer, [data-drawer="cart"]');
      if (drawer) {
        drawer.classList.remove('is-open', 'open', 'active');
        console.log(`${TAG} Drawer detectado, removiendo clases abiertas`);
      }
      document.documentElement.classList.remove('drawer-open', 'js-drawer-open', 'cart-drawer-open');
    }
  
    // Oculta/recupera UI de "empty cart" y cierra drawer si procede
    function hideEmptyCartUI(isEmpty) {
      console.groupCollapsed(`${TAG} hideEmptyCartUI → isEmpty:`, isEmpty);
      try {
        // Toggle clase global por si quieres estilos condicionales
        document.documentElement.classList.toggle('cart-is-empty', !!isEmpty);
  
        // Forzar ocultar bloques de "empty"
        EMPTY_SELECTORS.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            if (isEmpty) {
              if (!el.__prevDisplay) el.__prevDisplay = el.style.display || '';
              el.style.display = 'none';
              console.log(`${TAG} Ocultando:`, sel, el);
            } else {
              if (el.__prevDisplay !== undefined) {
                el.style.display = el.__prevDisplay;
                delete el.__prevDisplay;
              } else {
                el.style.display = ''; // reset
              }
              console.log(`${TAG} Mostrando (reset):`, sel, el);
            }
          });
        });
  
        // Si está vacío, cierra drawer para que ni siquiera se vea el estado vacío
        if (isEmpty) {
          closeCartDrawerIfOpen();
        }
      } finally {
        console.groupEnd();
      }
    }
  
    // Exponer para usar desde tu script principal
    window.__hideEmptyCartUI = hideEmptyCartUI;
  })();
});


//   // Intenta obtener la cantidad de un line item, probando distintas variantes de markup
//   function getItemQty(item) {
//     // 1) Inputs más comunes en carritos (Shopify themes)
//     const input =
//       item.querySelector('.cart__item__quantity') 

//     if (input) {
//       // A veces el tema actualiza "value" del atributo pero no la propiedad (o viceversa)
//       let v = parseInt(input.value || input.getAttribute('value') || '0', 10);
//       if (!isNaN(v)) return v;
//     }

//     // 2) Data attributes que algunos temas agregan al contenedor del item
//     const dataKeys = [
//       'cartQuantity', 'quantity', 'qty', 'quantityValue', 'data-quantity-field'
//     ];
//     for (const k of dataKeys) {
//       const raw = item.dataset?.[k] ?? item.getAttribute(`data-${k}`);
//       if (raw != null) {
//         const v = parseInt(String(raw), 10);
//         if (!isNaN(v)) return v;
//       }
//     }

//     // 3) Texto visible en el DOM (último recurso)
//     const textEl =
//       item.querySelector('[data-quantity-value]') ||
//       item.querySelector('.quantity__current') ||
//       item.querySelector('.cart-item__quantity') ||
//       item.querySelector('.qty') ||
//       item.querySelector('.product-quantity');

//     if (textEl && textEl.textContent) {
//       const m = textEl.textContent.match(/\d+/);
//       if (m) {
//         const v = parseInt(m[0], 10);
//         if (!isNaN(v)) return v;
//       }
//     }

//     // 4) Si no encontramos nada, mejor devolver 0 para no sobrecontar
//     return 0;
//   }

//   // Cuenta líneas no excluidas y suma sus cantidades
//   function countNonExcludedTotals() {
//     const items = document.querySelectorAll('[data-cart-item]');
//     let lines = 0;
//     let units = 0;

//     for (const item of items) {
//       // Considera excluido si el atributo está en la línea o en cualquier hijo
//       const hasOnItem  = item.hasAttribute('data-wholesale-excluded');
//       const hasInside  = !!item.querySelector('[data-wholesale-excluded]');
//       const isExcluded = hasOnItem || hasInside;

//       if (!isExcluded) {
//         lines++;
//         units += getItemQty(item);
//       }
//     }

//     console.log('[Non-excluded] lines:', lines, 'units:', units);

//     // Opcional: pinta en el DOM si tienes placeholders
//     document.querySelector('[data-non-excluded-count]')?.textContent = String(lines);
//     document.querySelector('[data-non-excluded-qty]')?.textContent   = String(units);

//     return { lines, units };
//   }

//   // Recontar después de que el tema re-renderiza el carrito
//   const recount = () => requestAnimationFrame(countNonExcludedTotals);

//   document.addEventListener('theme:cart:update', (event) => {
//     console.log('El carrito se actualizó', event?.detail ?? null);
//     recount();
//   });

//   document.addEventListener('theme:cart:open', (event) => {
//     console.log('El cart drawer se abrió', event?.detail ?? null);
//     recount();
//   });

//   // Primer conteo al cargar
//   recount();
// });



/**este es el ultimo**/

// document.addEventListener('DOMContentLoaded', () => {
//   function countNonExcludedLineItems() {
//     const items = document.querySelectorAll('[data-cart-item]');
//     let count = 0;

//     for (const item of items) {
//       const hasOnItem   = item.hasAttribute('data-wholesale-excluded');
//       const hasInside   = !!item.querySelector('[data-wholesale-excluded]');
//       const isExcluded  = hasOnItem || hasInside;

//       if (!isExcluded) count++;
//     }

//     console.log('[Non-excluded line items]', count);
//     return count;
//   }

//   // Contar después de que el tema re-renderiza el carrito
//   const recount = () => requestAnimationFrame(countNonExcludedLineItems);

//   document.addEventListener('theme:cart:update', (event) => {
//     debugger;
//     console.log('El carrito se actualizó', event.detail ?? null);
//     recount();
//   });

//   document.addEventListener('theme:cart:open', (event) => {
//     debugger;
//     console.log('El cart drawer se abrió', event.detail ?? null);
//     recount();
//   });

//   // Primer conteo al cargar
//   recount();
// });


