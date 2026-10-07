/**
 * Variants: two or more versions of the same image, with a switch above.
 *
 * Put the images in a figure with the class `variants`. The title of each
 * image becomes the label of its button; `data-label` on the figure names the
 * switch for screen readers. All versions lie on top of each other, so
 * switching doesn't move the page, and the chosen version fades in.
 *
 * Run this before initLightboxes(): a lightbox then enlarges the version
 * that is showing. Without JavaScript, the images simply show one below
 * the other.
 */

export function initVariants() {
  document.querySelectorAll<HTMLElement>('figure.variants').forEach((figure) => {
    const images = Array.from(figure.querySelectorAll<HTMLImageElement>('img'));
    if (images.length < 2) return;

    const oldParents = new Set(images.map((img) => img.parentElement));

    const group = document.createElement('div');
    group.className = 'switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', figure.dataset.label ?? 'Version');

    // A span, so a lightbox can wrap it in a button.
    const stage = document.createElement('span');
    stage.className = 'variants__stage';

    const buttons = images.map((img, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = img.title || `Version ${i + 1}`;
      button.addEventListener('click', () => show(i));
      // The label is on the button now; no tooltip needed.
      img.removeAttribute('title');
      stage.append(img);
      return button;
    });

    const show = (active: number) => {
      images.forEach((img, i) => img.classList.toggle('is-active', i === active));
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    };

    group.append(...buttons);
    figure.prepend(group, stage);
    show(0);

    // Markdown puts images in paragraphs; remove the ones that are now empty.
    oldParents.forEach((parent) => {
      if (parent && parent !== figure && parent.children.length === 0 && !parent.textContent?.trim()) {
        parent.remove();
      }
    });
  });
}
