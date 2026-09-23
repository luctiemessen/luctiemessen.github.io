/**
 * Header en uitschuifmenu.
 *
 * - De header krijgt `data-scrolled` zodra de pagina gescrold is (subtiele rand)
 *   en `data-hidden` bij naar beneden scrollen; bij omhoog scrollen komt hij terug.
 * - De hamburgerknop opent het menu door `data-nav-open` op <html> te zetten.
 *   Alle animatie zit in CSS (layout.css).
 */

const root = document.documentElement;
const header = document.querySelector<HTMLElement>('[data-site-header]');
const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const drawer = document.querySelector<HTMLElement>('[data-nav-drawer]');
const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]');

/* ---------- Header verbergen bij scrollen ---------- */

if (header) {
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.toggleAttribute('data-scrolled', y > 4);

    const delta = y - lastY;
    if (Math.abs(delta) > 6) {
      const goingDown = delta > 0 && y > 140;
      const hasFocus = header.contains(document.activeElement);
      header.toggleAttribute('data-hidden', goingDown && !hasFocus);
      lastY = y;
    }
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );

  header.addEventListener('focusin', () => header.removeAttribute('data-hidden'));
  onScroll();
}

/* ---------- Uitschuifmenu ---------- */

if (button && drawer) {
  let open = false;

  const focusables = () =>
    [button, ...drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
      (el) => !el.hasAttribute('inert'),
    );

  const setOpen = (next: boolean, returnFocus = false) => {
    if (next === open) return;
    open = next;
    root.toggleAttribute('data-nav-open', next);
    button.setAttribute('aria-expanded', String(next));
    button.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    drawer.inert = !next;

    if (next) {
      header?.removeAttribute('data-hidden');
      // Focus naar het eerste item, zonder dat de pagina verspringt.
      drawer.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true });
    } else if (returnFocus) {
      button.focus({ preventScroll: true });
    }
  };

  button.addEventListener('click', () => setOpen(!open));
  scrim?.addEventListener('click', () => setOpen(false));

  // Klikken op een link in het menu sluit het (belangrijk voor #ankers op dezelfde pagina).
  drawer.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a[href]')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
      return;
    }

    // Houd de focus binnen knop + menu zolang het menu open is.
    if (event.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
