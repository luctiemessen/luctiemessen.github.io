/**
 * Preview blocks: a piece of HTML, CSS and JavaScript in its own shadow root.
 *
 * Browsers build the shadow root from <template shadowrootmode="open">
 * themselves, but they don't run the scripts inside it. This does:
 * every script gets `root`, the preview's shadow root, so a demo uses
 * `root.querySelector()` where it would normally use `document`.
 *
 * With `data-replay` on the preview, a Replay button appears next to the
 * label. It rebuilds the preview from its original content and runs its
 * scripts again, so animations play again and a demo starts over.
 *
 * Older browsers that don't know `shadowrootmode` get the shadow root
 * attached here instead.
 */

const supportsDeclarativeShadowDom = Object.hasOwn(HTMLTemplateElement.prototype, 'shadowRootMode');

/** Styles for the Replay button, inside the shadow root (site CSS can't reach it). */
const replayStyles = `
  .preview-replay {
    position: absolute;
    top: 0.4rem;
    right: 0.6rem;
    padding: 0.25rem 0.4rem;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--ink-3);
    font: 500 0.75rem/1 var(--font-sans);
    cursor: pointer;
    transition: color 0.15s ease;
  }
  .preview-replay:hover { color: var(--accent); }
  .preview-replay:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
`;

let replaySheet: CSSStyleSheet | undefined;

const runScripts = (root: ShadowRoot) => {
  root.querySelectorAll('script').forEach((script) => {
    try {
      new Function('root', script.textContent ?? '')(root);
    } catch (error) {
      console.error('A preview script failed:', error);
    }
  });
};

const addReplay = (host: HTMLElement, root: ShadowRoot) => {
  // Keep a copy of the untouched content, before any script changes it.
  const original = Array.from(root.childNodes, (node) => node.cloneNode(true));

  if (!replaySheet) {
    replaySheet = new CSSStyleSheet();
    replaySheet.replaceSync(replayStyles);
  }
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, replaySheet];

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'preview-replay';
  button.innerHTML = '<span aria-hidden="true">↻</span> Replay';
  const label = host.dataset.label ?? 'Preview';
  button.setAttribute('aria-label', `Replay ${label.toLowerCase()}`);

  button.addEventListener('click', () => {
    root.replaceChildren(...original.map((node) => node.cloneNode(true)), button);
    runScripts(root);
    button.focus({ preventScroll: true });
  });

  root.append(button);
};

export function initPreviews() {
  document.querySelectorAll<HTMLElement>('.preview').forEach((host) => {
    if (!host.shadowRoot && !supportsDeclarativeShadowDom) {
      const template = host.querySelector<HTMLTemplateElement>(':scope > template[shadowrootmode]');
      if (template) {
        host.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
        template.remove();
      }
    }

    const root = host.shadowRoot;
    if (!root) return;

    if (host.hasAttribute('data-replay')) addReplay(host, root);
    runScripts(root);
  });
}
