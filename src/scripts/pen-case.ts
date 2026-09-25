/**
 * Pen case: makes the list of pens interactive.
 *
 * The script only keeps track of which pen is active. It sets `is-active`
 * on that pen and its colour dot, copies its details into the card, and
 * moves the card (--card-y). What that looks like is up to pen-case.css.
 *
 * - From 40rem: point at a pen, focus it, or click it. Arrow up and down
 *   move between pens. The card follows the active pen, next to it (and
 *   from 70rem in the margin).
 * - Phones: the pen in the middle of the strip is the active one.
 *   Tap a pen or a colour dot to bring it to the middle. Arrow left and
 *   right move between pens.
 */

/** From this width the pens lie in a tray; below it they stand in a strip. */
const WIDE = '(min-width: 40rem)';

export function initPenCase(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('.pen-case__list');
  const card = root.querySelector<HTMLElement>('.pen-case__card');
  const items = Array.from(root.querySelectorAll<HTMLElement>('.pen-case__item'));
  const pens = items.map((item) => item.querySelector<HTMLButtonElement>('.pen-case__pen')!);
  const infos = items.map((item) => item.querySelector<HTMLElement>('.pen-case__info')!);
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.pen-case__dot'));
  if (!list || !card || items.length === 0) return;

  const wide = window.matchMedia(WIDE);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;

  /* ---------- The tray: the card follows the active pen ---------- */

  const placeCard = () => {
    if (!wide.matches || active < 0) return;
    const item = items[active];
    const middle = item.offsetTop + item.offsetHeight / 2;
    const y = middle - Math.min(card.offsetHeight / 2, 24);
    const max = list.offsetHeight - card.offsetHeight;
    card.style.setProperty('--card-y', `${Math.round(Math.max(0, Math.min(y, max)))}px`);
  };

  /* ---------- Phones: bring a pen to the middle of the strip ---------- */

  const center = (index: number) => {
    const item = items[index];
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  };

  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    pens.forEach((pen, i) => pen.setAttribute('aria-current', String(i === index)));
    card.innerHTML = infos[index].innerHTML;
    placeCard();
  };

  const select = (index: number) => {
    setActive(index);
    if (!wide.matches) center(index);
  };

  /* ---------- Pointer, focus and keyboard ---------- */

  // Only a mouse that actually moves picks a pen. When the page scrolls under a
  // mouse that stands still (scroll wheel, or keyboard focus scrolling a pen
  // into view), the active pen stays where it is.
  list.addEventListener('pointermove', (event) => {
    if (!wide.matches || event.pointerType !== 'mouse') return;
    if (event.movementX === 0 && event.movementY === 0) return;
    const item = (event.target as Element).closest<HTMLElement>('.pen-case__item');
    if (item) setActive(items.indexOf(item));
  });

  pens.forEach((pen, i) => {
    pen.addEventListener('click', () => select(i));
    pen.addEventListener('focus', () => select(i));

    pen.addEventListener('keydown', (event) => {
      const [back, forward] = wide.matches ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
      const step = event.key === back ? -1 : event.key === forward ? 1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = Math.max(0, Math.min(pens.length - 1, i + step));
      // In the strip, center() does the scrolling, smoothly.
      pens[next].focus({ preventScroll: !wide.matches });
    });
  });

  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));

  /* ---------- The strip: the pen in the middle is the active one ---------- */

  let ticking = false;
  list.addEventListener(
    'scroll',
    () => {
      if (wide.matches || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const middle = list.scrollLeft + list.clientWidth / 2;
        let nearest = 0;
        let distance = Infinity;
        items.forEach((item, i) => {
          const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle);
          if (d < distance) {
            distance = d;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    },
    { passive: true },
  );

  /* ---------- Layout changes ---------- */

  wide.addEventListener('change', () => {
    if (wide.matches) placeCard();
    else center(Math.max(0, active));
  });
  new ResizeObserver(placeCard).observe(list);

  root.classList.add('is-ready');
  setActive(0);
}
