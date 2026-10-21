/**
 * 404: a guess at the page you were looking for.
 *
 * The 404 page lists every page in a JSON script (title and address). This
 * compares the last part of the address you tried with the address and the
 * title of each page, and shows the closest one, if it's close enough.
 */

type Page = { title: string; url: string };

/** "Redesign 2026: Notes" and "/blog/redesign-2026-notes.html" both become "redesign-2026-notes". */
const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\.html?$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** The last meaningful part of an address: /blog/some-post/index.html → some-post. */
const lastPart = (path: string) => {
  const parts = decodeURIComponent(path)
    .split('/')
    .filter((part) => part && !/^index(\.html?)?$/i.test(part));
  return slug(parts[parts.length - 1] ?? '');
};

/** How alike two strings are, from 0 to 1: the best of two measures, so
 *  that both typos in short words and missing words in long ones score well. */
const similarity = (a: string, b: string) => {
  if (!a || !b) return 0;
  if (a === b) return 1;

  // Shared pairs of letters (Dice coefficient).
  const pairs = (text: string) => {
    const list: string[] = [];
    for (let i = 0; i < text.length - 1; i++) list.push(text.slice(i, i + 2));
    return list;
  };
  const left = pairs(a);
  const right = pairs(b);
  let shared = 0;
  const pool = [...right];
  for (const pair of left) {
    const index = pool.indexOf(pair);
    if (index !== -1) {
      shared++;
      pool.splice(index, 1);
    }
  }
  const dice = (2 * shared) / (left.length + right.length || 1);

  // Edits needed to turn one into the other (Levenshtein distance).
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  const edits = 1 - previous[b.length] / Math.max(a.length, b.length);

  return Math.max(dice, edits);
};

const guess = document.querySelector<HTMLElement>('[data-guess]');
const data = document.querySelector<HTMLScriptElement>('[data-pages]');

if (guess && data) {
  const pages: Page[] = JSON.parse(data.textContent || '[]');
  const wanted = lastPart(location.pathname);

  let best: Page | undefined;
  let bestScore = 0;
  for (const page of pages) {
    const score = Math.max(similarity(wanted, lastPart(page.url) || 'home'), similarity(wanted, slug(page.title)));
    if (score > bestScore) {
      best = page;
      bestScore = score;
    }
  }

  const link = guess.querySelector('a');
  if (best && link && bestScore >= 0.5) {
    link.href = best.url;
    link.textContent = best.title;
    guess.hidden = false;
  }
}
