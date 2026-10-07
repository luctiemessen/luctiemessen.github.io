/**
 * De kantlijn links.
 *
 * Elke hoofdstuktitel krijgt een streepje op de verticale lijn, op dezelfde
 * relatieve hoogte als waar het hoofdstuk in de tekst staat. De lijn loopt vol
 * naarmate je verder leest. De titels zelf worden via CSS zichtbaar bij hover.
 *
 * Titels die te dicht op elkaar zouden staan, worden uit elkaar geschoven.
 * Het streepje schuift mee: het staat altijd naast de eerste regel van zijn
 * titel. Daarom loopt ook de lijn van streepje naar streepje, zodat hij elk
 * streepje precies bereikt als dat hoofdstuk begint. Is er genoeg ruimte,
 * dan staat alles gewoon op schaal.
 *
 * Zet daarnaast `--read-progress` (0–1) op <html>, voor de voortgangsbalk
 * in de header op smalle schermen.
 */

type Item = {
  li: HTMLLIElement;
  link: HTMLAnchorElement;
  target: HTMLElement | null;
  /** Where the section starts in the text, from 0 to 1. */
  frac: number;
  /** Where its tick is on the line, in px. */
  y: number;
};

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export function initTocRail(rail: HTMLElement) {
  const container = document.querySelector<HTMLElement>(rail.dataset.target ?? '');
  const list = rail.querySelector<HTMLElement>('.toc-rail__list');
  if (!container || !list) return;

  const items: Item[] = Array.from(rail.querySelectorAll<HTMLLIElement>('.toc-rail__item')).map(
    (li) => {
      const link = li.querySelector('a') as HTMLAnchorElement;
      const id = decodeURIComponent(link.hash.slice(1));
      return { li, link, target: document.getElementById(id), frac: 0, y: 0 };
    },
  );

  let top = 0;
  let height = 1;
  let trackHeight = 1;

  /** How far the line is filled, in px: from tick to tick, so it reaches
   *  each tick exactly when that section starts. */
  const fillAt = (progress: number) => {
    const first = items[0];
    if (!first) return progress * trackHeight;
    if (progress < first.frac) return first.y * (progress / first.frac);
    let i = 0;
    while (i < items.length - 1 && items[i + 1].frac <= progress) i++;
    const from = items[i];
    const to = items[i + 1];
    const toFrac = to ? to.frac : 1;
    const toY = to ? to.y : trackHeight;
    const t = toFrac > from.frac ? (progress - from.frac) / (toFrac - from.frac) : 1;
    return from.y + clamp(t) * (toY - from.y);
  };

  /** Leesvoortgang en actieve sectie bijwerken (bij elke scroll). */
  const update = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const t = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 1;

    // De "leeslijn": bovenaan de pagina staat hij helemaal bovenin (voortgang 0),
    // na een half scherm scrollen op 25% van het scherm, en richting het einde
    // schuift hij naar de onderkant, zodat de voortgang precies op 100% eindigt.
    const ease = clamp(window.scrollY / (window.innerHeight * 0.5));
    const start = 0.25 * ease * ease * (3 - 2 * ease);
    const line = window.scrollY + window.innerHeight * (start + (1 - start) * t);
    const progress = clamp((line - top) / height);

    rail.style.setProperty('--progress', (fillAt(progress) / trackHeight).toFixed(4));
    doc.style.setProperty('--read-progress', progress.toFixed(4));

    let active = 0;
    items.forEach((item, i) => {
      if (item.frac <= progress + 1e-4) active = i;
    });

    items.forEach((item, i) => {
      item.li.classList.toggle('is-passed', i <= active);
      item.li.classList.toggle('is-active', i === active);
      if (i === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  };

  /** Posities opnieuw berekenen (bij laden, resize, lettertypen geladen). */
  const layout = () => {
    const rect = container.getBoundingClientRect();
    top = rect.top + window.scrollY;
    height = Math.max(1, rect.height);
    trackHeight = Math.max(1, list.clientHeight);

    for (const item of items) {
      const y =
        item.target && item.target !== container
          ? item.target.getBoundingClientRect().top + window.scrollY
          : top;
      item.frac = clamp((y - top) / height);
    }

    // Titels: met hun eerste regel op hun plek op de lijn, maar zonder overlap.
    const GAP = 6;
    const natural = items.map((item) => {
      const lineHeight = parseFloat(getComputedStyle(item.link).lineHeight) || 18;
      return { y: item.frac * trackHeight - lineHeight / 2, h: item.link.offsetHeight, half: lineHeight / 2 };
    });

    // De laatste titel mag iets onder de lijn uitsteken, maar zijn streepje
    // niet: dat blijft binnen de lijn.
    const last = natural[natural.length - 1];
    const bottom = last ? Math.min(trackHeight + 10, trackHeight - last.half + last.h) : trackHeight;

    const place = (gap: number) => {
      const boxes = natural.map((box) => ({ ...box }));
      // Van boven naar beneden: duw naar beneden als de vorige in de weg zit.
      for (let i = 1; i < boxes.length; i++) {
        boxes[i].y = Math.max(boxes[i].y, boxes[i - 1].y + boxes[i - 1].h + gap);
      }
      // Van onder naar boven: blijf binnen de lijn.
      let limit = bottom;
      for (let i = boxes.length - 1; i >= 0; i--) {
        boxes[i].y = Math.min(boxes[i].y, limit - boxes[i].h);
        limit = boxes[i].y - gap;
      }
      return boxes;
    };

    let boxes = place(GAP);
    // Passen alle titels niet onder elkaar, dan schuift de eerste voorbij het
    // begin van de lijn. Maak dan de ruimte ertussen kleiner, zodat alles
    // precies past (en laat ze in het uiterste geval een beetje overlappen).
    const first = boxes[0];
    if (first && first.y + first.half < -0.5) {
      const titles = natural.reduce((sum, box) => sum + box.h, 0);
      const room = bottom + first.half;
      boxes = place((room - titles) / Math.max(1, boxes.length - 1));
    }

    // Het streepje komt midden naast de eerste regel (zie de CSS). Afgerond op
    // een hele pixel, zodat het lijntje van 1px overal even scherp is.
    boxes.forEach((box, i) => {
      // (+ 1e-6: rekenruis als -0.5000001 mag niet een hele pixel schelen.)
      const tick = Math.round(box.y + box.half - 0.5 + 1e-6);
      items[i].y = tick + 0.5;
      items[i].li.style.setProperty('--item-y', `${(tick + 0.5 - box.half).toFixed(2)}px`);
    });
    update();
  };

  /* ---------- Events ---------- */

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    },
    { passive: true },
  );

  const ro = new ResizeObserver(() => layout());
  ro.observe(container);
  ro.observe(rail);
  document.fonts?.ready.then(layout);
  window.addEventListener('load', layout);

  // Na een muisklik de focus loslaten, anders blijven de titels zichtbaar
  // (door :focus-within) terwijl je de muis al hebt weggehaald.
  for (const { link } of items) {
    link.addEventListener('click', (event) => {
      if (event.detail > 0) link.blur();
      rail.removeAttribute('data-expanded');
    });
  }

  // Touchscreens hebben geen hover: een tik op de kantlijn klapt de titels uit.
  const canHover = window.matchMedia('(hover: hover)');
  rail.addEventListener('click', (event) => {
    if (canHover.matches || (event.target as Element).closest('a')) return;
    rail.toggleAttribute('data-expanded');
  });
  document.addEventListener('click', (event) => {
    if (!rail.contains(event.target as Node)) rail.removeAttribute('data-expanded');
  });

  layout();
}
