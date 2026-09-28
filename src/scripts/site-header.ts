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

  const setOpen = (next: boolean, returnFocus = false, fromKeyboard = false) => {
    if (next === open) return;
    open = next;
    root.toggleAttribute('data-nav-open', next);
    button.setAttribute('aria-expanded', String(next));
    button.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    drawer.inert = !next;

    if (next) {
      header?.removeAttribute('data-hidden');
      // Geopend met het toetsenbord: focus (met focusring) naar het eerste item.
      // Met muis of vinger: focus naar het menu zelf, zonder ring. Anders toont
      // Safari de ring om het eerste item, omdat het de knop bij een klik geen
      // focus geeft. Tab brengt je daarna vanzelf bij het eerste item.
      const target = fromKeyboard ? drawer.querySelector<HTMLElement>('a[href]') : drawer;
      target?.focus({ preventScroll: true });
    } else if (returnFocus) {
      button.focus({ preventScroll: true });
    }
  };

  // Een klik via Enter of spatie heeft `detail` 0, een echte klik 1 of meer.
  button.addEventListener('click', (event) => setOpen(!open, false, event.detail === 0));
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
    // Tab en Shift+Tab lopen rond binnen knop + links; ook als het menu zelf
    // focus heeft (index -1), of als de focus ergens buiten het menu staat.
    if (event.key === 'Tab') {
      const items = focusables();
      const index = items.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next =
        index === -1
          ? event.shiftKey
            ? items.length - 1
            : Math.min(1, items.length - 1)
          : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    }
  });
}
