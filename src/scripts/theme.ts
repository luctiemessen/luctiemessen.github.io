/**
 * Light / Dark / System: the colour theme of the whole site.
 *
 * Works for every button with `data-theme-choice` on the page (the switch at
 * the bottom of the menu, and the one in the styleguide), and keeps them in
 * sync. "System" removes `data-theme` from <html>, so the site follows the
 * setting of your device again. The choice is remembered in localStorage;
 * a small inline script in BaseLayout applies it before the first paint.
 */

type Choice = 'light' | 'dark' | 'system';

const KEY = 'theme';
const PAPER = { light: '#f7f5f1', dark: '#1c1d1b' };
const root = document.documentElement;

const current = (): Choice => {
  const theme = root.dataset.theme;
  return theme === 'light' || theme === 'dark' ? theme : 'system';
};

const apply = (choice: Choice) => {
  if (choice === 'system') delete root.dataset.theme;
  else root.dataset.theme = choice;

  // The colour of the browser bar on phones follows along.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const system = meta.media.includes('dark') ? PAPER.dark : PAPER.light;
    meta.content = choice === 'system' ? system : PAPER[choice];
  });

  document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
  });
};

const save = (choice: Choice) => {
  try {
    if (choice === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this page.
  }
};

document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.themeChoice as Choice;
    apply(choice);
    save(choice);
  });
});

// The same choice in another tab.
window.addEventListener('storage', (event) => {
  if (event.key !== KEY) return;
  const value = event.newValue;
  apply(value === 'light' || value === 'dark' ? value : 'system');
});

apply(current());

// A module of its own, so names like `root` don't clash with other scripts.
export {};
