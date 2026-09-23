/**
 * Voetnoten → noten in de rechtermarge.
 *
 * Werkt met de gewone Markdown-voetnoten die Astro genereert
 * (`[^1]` in de tekst en `[^1]: …` onderaan). Het script:
 *
 * 1. kopieert elke voetnoot naar een <aside class="sidenote"> in de notenkolom;
 * 2. zet die op dezelfde basislijn als de regel waarin het nummertje staat,
 *    en schuift noten naar beneden als ze elkaar zouden overlappen;
 * 3. koppelt hover en focus: nummertje aanwijzen licht de noot op, en andersom.
 *
 * Op smallere schermen blijven de voetnoten onderaan staan (CSS regelt dat),
 * en toont het script bij aanwijzen met de muis een klein zwevend venster.
 * Zonder JavaScript werkt alles gewoon als normale voetnoten.
 */

type Note = {
  aside: HTMLElement;
  refs: HTMLAnchorElement[];
  probe: HTMLElement; // basislijn van de regel in de tekst
  innerProbe: HTMLElement; // basislijn van de eerste regel van de noot
};

const WIDE = '(min-width: 70rem)';
const GAP = 12;

/** Elementen die (op brede schermen) in de rechtermarge kunnen staan.
 *  Noten schuiven eronder in plaats van erover heen te vallen. */
const MARGIN_ITEMS = '.bleed, figcaption, [data-in-margin]';

const makeProbe = () => {
  const span = document.createElement('span');
  span.className = 'baseline-probe';
  span.setAttribute('aria-hidden', 'true');
  return span;
};

export function initSidenotes(root: HTMLElement) {
  const body = root.querySelector<HTMLElement>('[data-post-body]');
  const column = root.querySelector<HTMLElement>('[data-sidenotes]');
  if (!body || !column) return;

  const refs = Array.from(body.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]'));
  if (refs.length === 0) return;

  const wide = window.matchMedia(WIDE);
  const canHover = window.matchMedia('(hover: hover)');
  const notes: Note[] = [];
  const byId = new Map<string, Note>();

  /* ---------- Noten opbouwen ---------- */

  for (const ref of refs) {
    const id = decodeURIComponent(ref.hash.slice(1));
    const source = document.getElementById(id);
    if (!source) continue;

    let note = byId.get(id);
    if (!note) {
      const clone = source.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[data-footnote-backref]').forEach((el) => el.remove());
      clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

      const aside = document.createElement('aside');
      aside.className = 'sidenote';
      aside.tabIndex = -1;
      aside.setAttribute('aria-label', `Note ${ref.textContent ?? ''}`.trim());

      const num = document.createElement('span');
      num.className = 'sidenote__num';
      num.textContent = ref.textContent ?? '';

      const innerProbe = makeProbe();
      const first = clone.firstElementChild;
      if (first?.tagName === 'P') first.prepend(innerProbe, num);
      else aside.append(innerProbe, num);
      aside.append(...Array.from(clone.childNodes));
      column.append(aside);

      note = { aside, refs: [], probe: makeProbe(), innerProbe };
      (ref.closest('sup') ?? ref).before(note.probe);
      byId.set(id, note);
      notes.push(note);
    }
    note.refs.push(ref);
  }

  if (notes.length === 0) return;
  root.classList.add('has-sidenotes');

  /* ---------- Positioneren ---------- */

  const layout = () => {
    if (!wide.matches) return;
    const columnTop = column.getBoundingClientRect().top;
    const bodyRight = body.getBoundingClientRect().right;

    // Wat staat er al in de marge? (brede blokken, bijschriften)
    const obstacles = Array.from(body.querySelectorAll<HTMLElement>(MARGIN_ITEMS))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height > 0 && r.right > bodyRight + 4)
      .map((r) => ({ top: r.top - columnTop, bottom: r.bottom - columnTop }))
      .sort((a, b) => a.top - b.top);

    let floor = -Infinity;

    for (const note of notes) {
      const lineBaseline = note.probe.getBoundingClientRect().top;
      const noteBaseline =
        note.innerProbe.getBoundingClientRect().top - note.aside.getBoundingClientRect().top;
      const height = note.aside.offsetHeight;
      let y = Math.max(lineBaseline - columnTop - noteBaseline, floor);

      // Schuif onder alles door wat in de weg staat, tot er niets meer overlapt.
      let moved = true;
      while (moved) {
        moved = false;
        for (const o of obstacles) {
          if (y < o.bottom + GAP && y + height > o.top - GAP) {
            y = o.bottom + GAP;
            moved = true;
          }
        }
      }

      note.aside.style.top = `${Math.round(y)}px`;
      floor = y + height + GAP;
    }
    // Zorg dat een lange laatste noot niet over de onderkant van het artikel valt.
    column.style.minHeight = `${Math.max(0, Math.ceil(floor))}px`;
  };

  new ResizeObserver(() => layout()).observe(body);
  wide.addEventListener('change', layout);
  document.fonts?.ready.then(layout);
  window.addEventListener('load', layout);
  layout();

  /* ---------- Zwevend venster (middelgrote schermen met muis) ---------- */

  let popover: HTMLElement | null = null;
  let hideTimer = 0;

  const hidePopover = (delay = 160) => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => popover?.removeAttribute('data-open'), delay);
  };

  const showPopover = (note: Note, ref: HTMLElement) => {
    if (wide.matches || !canHover.matches) return;
    if (!popover) {
      popover = document.createElement('div');
      popover.className = 'fn-popover';
      popover.setAttribute('aria-hidden', 'true');
      popover.addEventListener('mouseenter', () => window.clearTimeout(hideTimer));
      popover.addEventListener('mouseleave', () => hidePopover());
      document.body.append(popover);
    }
    window.clearTimeout(hideTimer);
    popover.innerHTML = note.aside.innerHTML;

    const r = ref.getBoundingClientRect();
    const w = popover.offsetWidth;
    const h = popover.offsetHeight;
    const left = Math.min(Math.max(12, r.left - 24), window.innerWidth - w - 12);
    let top = r.bottom + 10;
    if (top + h > window.innerHeight - 12) top = r.top - h - 10;
    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
    popover.setAttribute('data-open', '');
  };

  window.addEventListener('scroll', () => hidePopover(0), { passive: true });

  /* ---------- Koppeling nummertje ↔ noot ---------- */

  const highlight = (note: Note, on: boolean) => {
    note.aside.classList.toggle('is-highlighted', on);
    note.refs.forEach((r) => r.classList.toggle('is-highlighted', on));
  };

  for (const note of notes) {
    note.aside.addEventListener('mouseenter', () => highlight(note, true));
    note.aside.addEventListener('mouseleave', () => highlight(note, false));

    for (const ref of note.refs) {
      ref.addEventListener('mouseenter', () => {
        highlight(note, true);
        showPopover(note, ref);
      });
      ref.addEventListener('mouseleave', () => {
        highlight(note, false);
        hidePopover();
      });
      ref.addEventListener('focus', () => highlight(note, true));
      ref.addEventListener('blur', () => highlight(note, false));

      // Op brede schermen niet naar beneden springen: de noot staat er al naast.
      ref.addEventListener('click', (event) => {
        if (!wide.matches) return;
        event.preventDefault();
        highlight(note, true);
        note.aside.focus({ preventScroll: true });
        window.setTimeout(() => {
          if (!note.aside.matches(':hover') && !ref.matches(':hover')) highlight(note, false);
        }, 1400);
      });
    }
  }
}
