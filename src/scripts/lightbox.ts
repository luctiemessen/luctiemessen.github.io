/**
 * Lightbox: images you can view larger.
 *
 * Every image inside a figure with the class `lightbox` becomes a button.
 * Two or three images stand side by side at the same height (each gets a
 * --ratio for its flex-grow); more than three are split into rows of three.
 * Clicking an image opens it full screen in a native <dialog>, which takes
 * care of focus, Escape and the page behind it. With more than one image
 * in a figure, you browse with the buttons, the arrow keys or by swiping.
 *
 * The large view uses the widest image in the srcset if there is one,
 * otherwise the image itself. Without JavaScript, nothing changes: the
 * images simply show in the article.
 *
 * A figure that is also `variants` (variants.ts) gets one button, which
 * enlarges the version that is showing.
 */

type Item = { src: string; alt: string; caption: string };

let dialog: HTMLDialogElement;
let image: HTMLImageElement;
let caption: HTMLParagraphElement;
let counter: HTMLSpanElement;
let prev: HTMLButtonElement;
let next: HTMLButtonElement;
let items: Item[] = [];
let index = 0;

/** The widest candidate in the srcset, or the image itself. */
const largestSource = (img: HTMLImageElement) => {
  let best = img.currentSrc || img.src;
  let bestWidth = 0;
  for (const candidate of img.srcset.split(',')) {
    const [url, descriptor] = candidate.trim().split(/\s+/);
    const width = parseFloat(descriptor ?? '');
    if (url && descriptor?.endsWith('w') && width > bestWidth) {
      bestWidth = width;
      best = url;
    }
  }
  return best;
};

const show = (i: number) => {
  index = (i + items.length) % items.length;
  const item = items[index];
  image.src = item.src;
  image.alt = item.alt;
  caption.textContent = item.caption;
  caption.hidden = !item.caption;
  const many = items.length > 1;
  counter.textContent = many ? `${index + 1} / ${items.length}` : '';
  prev.hidden = !many;
  next.hidden = !many;
};

const button = (className: string, label: string, text: string) => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `lightbox-dialog__button ${className}`;
  el.setAttribute('aria-label', label);
  el.innerHTML = `<span aria-hidden="true">${text}</span>`;
  return el;
};

/** One dialog for the whole page, built the first time it's needed. */
const buildDialog = () => {
  dialog = document.createElement('dialog');
  dialog.className = 'lightbox-dialog';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.tabIndex = -1;

  const bar = document.createElement('div');
  bar.className = 'lightbox-dialog__bar';
  counter = document.createElement('span');
  const close = button('lightbox-dialog__close', 'Close', '×');
  bar.append(counter, close);

  const stage = document.createElement('div');
  stage.className = 'lightbox-dialog__stage';
  image = document.createElement('img');
  image.className = 'lightbox-dialog__image';
  image.decoding = 'async';
  prev = button('lightbox-dialog__nav lightbox-dialog__nav--prev', 'Previous image', '‹');
  next = button('lightbox-dialog__nav lightbox-dialog__nav--next', 'Next image', '›');
  stage.append(prev, image, next);

  caption = document.createElement('p');
  caption.className = 'lightbox-dialog__caption';

  dialog.append(bar, stage, caption);
  document.body.append(dialog);

  close.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  // A click on the empty space around the image closes the viewer.
  let swiped = false;
  dialog.addEventListener('click', (event) => {
    if (swiped) {
      swiped = false;
      return;
    }
    if (event.target === dialog || event.target === stage || event.target === bar) dialog.close();
  });

  // Arrow keys (Escape is handled by the dialog itself).
  dialog.addEventListener('keydown', (event) => {
    if (items.length < 2) return;
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  // Swipe left or right on a touchscreen.
  let startX = 0;
  dialog.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
  });
  dialog.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'mouse' || items.length < 2) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 50) {
      swiped = true;
      show(index + (distance < 0 ? 1 : -1));
    }
  });
};

const open = (group: Item[], start: number) => {
  if (!dialog) buildDialog();
  items = group;
  show(start);
  dialog.showModal();
  // Focus the viewer itself, not its first button: no focus ring after a click.
  dialog.focus();
};

const makeTrigger = () => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'lightbox__trigger';
  el.setAttribute('aria-haspopup', 'dialog');
  return el;
};

const makeRow = () => {
  const el = document.createElement('div');
  el.className = 'lightbox__row';
  return el;
};

export function initLightboxes() {
  document.querySelectorAll<HTMLElement>('figure.lightbox').forEach((figure) => {
    const images = Array.from(figure.querySelectorAll<HTMLImageElement>('img'));
    if (images.length === 0) return;

    const figcaption = figure.querySelector(':scope > figcaption');
    const figureCaption = figcaption?.textContent?.trim() ?? '';

    // Versions of one image (variants.ts): one button that enlarges the version
    // that is showing. Its name is "Enlarge: " plus the alt of that version,
    // because hidden versions don't count.
    const stage = figure.querySelector<HTMLElement>(':scope > .variants__stage');
    if (stage) {
      const button = makeTrigger();
      const hint = document.createElement('span');
      hint.className = 'sr-only';
      hint.textContent = 'Enlarge: ';
      const wrapper = makeRow();
      stage.replaceWith(wrapper);
      button.append(hint, stage);
      wrapper.append(button);
      button.addEventListener('click', () => {
        const img = stage.querySelector<HTMLImageElement>('img.is-active') ?? images[0];
        open([{ src: largestSource(img), alt: img.alt, caption: figureCaption }], 0);
      });
      return;
    }
    const group: Item[] = images.map((img) => ({
      src: largestSource(img),
      alt: img.alt,
      // The image's title, or for a single image the caption of the figure.
      caption: img.title || (images.length === 1 ? figureCaption : ''),
    }));

    const oldParents = new Set(images.map((img) => img.parentElement));
    const rows: HTMLDivElement[] = [];

    images.forEach((img, i) => {
      if (i % 3 === 0) rows.push(makeRow());

      const button = makeTrigger();
      button.setAttribute('aria-label', img.alt ? `Enlarge: ${img.alt}` : 'Enlarge image');

      const setRatio = () => {
        const width = Number(img.getAttribute('width')) || img.naturalWidth;
        const height = Number(img.getAttribute('height')) || img.naturalHeight;
        if (width && height) button.style.setProperty('--ratio', (width / height).toFixed(4));
      };
      setRatio();
      if (!button.style.getPropertyValue('--ratio')) img.addEventListener('load', setRatio, { once: true });

      button.addEventListener('click', () => open(group, i));
      button.append(img);
      rows[rows.length - 1].append(button);
    });

    rows.forEach((row) => figure.insertBefore(row, figcaption));

    // Markdown puts images in paragraphs; remove the ones that are now empty.
    oldParents.forEach((parent) => {
      if (parent && parent !== figure && parent.children.length === 0 && !parent.textContent?.trim()) {
        parent.remove();
      }
    });
  });
}
