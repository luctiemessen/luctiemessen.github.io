---
layout: "../../layouts/BlogPostLayout.astro"
title: "Building the reading rail"
date: 2026-09-24 13:00:00
description: How the thin line in the left margin of this site works. Where it gets the headings from, which JavaScript events keep it up to date, and how you could turn it into a metro line.
tags: javascript css web
draft: true
---

<p class="lead">On a wide screen, there's a thin line in the left margin of every article. It has a tick for every heading and slowly fills up as you read. Move your mouse to the left edge and the headings appear. It looks simple, and that was the idea. Here's what happens behind the scenes.</p>

## What it does

The rail, as I call it, has four jobs:

1. Show a tick for every `h2` and `h3`, at the same relative height as that heading in the article. A heading halfway down the article gets a tick halfway down the line. When headings are close together, the ticks make room for their labels.
2. Fill the line as you read, and highlight the section you're in.
3. Show the headings as links when you point at the rail, tab to it or tap it.
4. Share the reading progress with the header, which shows it as a green bar on phones, where there's no room for the rail.

The work is split in three: Astro builds the list at build time, a small script measures and follows along, and CSS draws everything.

## Step 1: reading the page structure

You might expect the script to scan the page for headings. It doesn't have to. When Astro renders a markdown article, it already hands the layout a list of every heading, with its level, text and `id`. The article layout keeps the `h2` and `h3` headings, and skips the hidden heading above the footnotes:

```js
const toc = headings
  .filter((h) => h.depth >= 2 && h.depth <= 3 && h.slug !== 'footnote-label')
  .map((h) => ({ id: h.slug, text: h.text, depth: h.depth }));
```

That list goes to the `TocRail` component, which turns it into plain HTML: an ordered list of links, each with an empty `span` for the tick.

```html
<nav class="toc-rail" data-toc-rail data-target="#top">
  <div class="toc-rail__track"><div class="toc-rail__fill"></div></div>
  <ol class="toc-rail__list">
    <li class="toc-rail__item" data-depth="2" style="--i: 1">
      <span class="toc-rail__tick"></span>
      <a class="toc-rail__link" href="#what-it-does">What it does</a>
    </li>
  </ol>
</nav>
```

Doing this at build time has a nice side effect: the rail is a real list of real links, even before any JavaScript runs. The same list is also used for the table of contents in the menu on phones.

## Step 2: measuring

The script's first job is to work out where every heading is. It finds each heading through the `href` of its link, and measures how far down the article it sits, as a number between 0 and 1:

```js
const rect = container.getBoundingClientRect();
const top = rect.top + window.scrollY;
const height = rect.height;

for (const item of items) {
  const y = item.target.getBoundingClientRect().top + window.scrollY;
  item.frac = clamp((y - top) / height);
}
```

That fraction is the key to the whole component. It doesn't matter how long the article is or how tall your screen is. A heading at 40% of the article gets a tick at 40% of the line, as long as there's room for its label.

Notice that the script doesn't move anything itself. For every item it sets one CSS custom property, `--item-y`, and CSS does the rest. The item holds both the tick and the label. CSS puts the tick next to the middle of the label's first line: half a line height down, minus half a pixel, because the tick is one pixel thick.

```css
.toc-rail__item {
  position: absolute;
  top: var(--item-y, 0);
  font: 400 0.875rem/1.3 var(--font-sans);
}

.toc-rail__tick {
  position: absolute;
  top: calc(0.65em - 0.5px); /* half of line-height 1.3 */
}
```

### Keeping the labels apart

Two headings a few lines apart would get labels that overlap. So the script moves the labels in two passes. From top to bottom, it pushes every label down if the one above is in the way. Then from bottom to top, it pushes them back up if they would run off the end of the line.

```js
const place = (gap) => {
  const boxes = natural.map((box) => ({ ...box }));

  for (let i = 1; i < boxes.length; i++) {
    boxes[i].y = Math.max(boxes[i].y, boxes[i - 1].y + boxes[i - 1].h + gap);
  }

  let limit = bottom;
  for (let i = boxes.length - 1; i >= 0; i--) {
    boxes[i].y = Math.min(boxes[i].y, limit - boxes[i].h);
    limit = boxes[i].y - gap;
  }
  return boxes;
};
```

Every label starts at its natural place: the middle of its first line on the heading's fraction of the line. Where the label ends up goes into `--item-y`, and because the tick lives inside the same item, it moves along. That wasn't always the case. Why it changed is a story of its own, [further down](#when-ticks-and-labels-drifted-apart).

## Step 3: following the reader

Every time you scroll, the script works out how far you've read. The simplest version would be your scroll position divided by the total scroll distance. But that feels off: at the top of the page nothing is read yet, and at the bottom you can't scroll past the last paragraph.

So the script uses an imaginary *reading line* on the screen. At the very top of the page it sits at the top of the screen. After half a screen of scrolling it has eased down to a quarter of the way, roughly where your eyes are. Towards the end of the page it slides to the bottom, so the rail reaches exactly 100% when you do.

```js
const t = window.scrollY / maxScroll;
const ease = clamp(window.scrollY / (window.innerHeight * 0.5));
const start = 0.25 * ease * ease * (3 - 2 * ease);
const line = window.scrollY + window.innerHeight * (start + (1 - start) * t);
const progress = clamp((line - top) / height);
```

With that number, the rest is bookkeeping:

- `--progress` on the rail tells CSS how far to fill the line. It isn't quite the raw progress: the line runs from tick to tick, so it reaches each tick exactly when that section starts. More on that in the next section.
- `--read-progress` on the `html` element feeds the progress bar in the header.
- The last heading with a fraction below the progress is the active one. Its item gets the class `is-active`, it and every item above it get `is-passed`, and the active link gets `aria-current="location"` for screen readers.

## When ticks and labels drifted apart

The first version of the rail worked slightly differently. The ticks always stayed at their exact place on the line, and only the labels moved out of each other's way. On paper, that's the most honest version: the line is a scale model of the article.

In practice, it went wrong when I changed the height of my browser window. Sometimes a label no longer sat next to its own tick, but next to the one below it. Nothing was broken. The script measured everything again on every resize, and the two passes did exactly what they were told.

The cause is simple once you see it. A label is about 18 pixels tall, and with the gap between labels, two labels need at least 24 pixels. A tick needs only one. In a shorter window the line gets shorter, the ticks move closer together, and more labels get pushed away from their ticks. On the [styleguide](/styleguide/), all 13 labels lined up with their ticks in a window 900 pixels tall. At 520 pixels, 10 of them were up to 16 pixels off.

### Three ways to draw the same moment

The obvious fix is to turn it around: position the whole item where the label goes, and put the tick next to the label's first line. Then a label and its tick can never drift apart. But that creates a new problem. The fill still follows the exact scale, so it reaches a tick that has moved at the wrong moment. A section can turn active while the line hasn't reached its tick yet, or after it has already passed it.

<figure>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;font:400 .8125rem/1.3 var(--font-sans);color:var(--ink-3)">
<div>
<div style="position:relative;height:184px;margin-top:10px">
<div style="position:absolute;left:8px;top:0;bottom:0;width:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:0;height:35px;width:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:0;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:17px;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:29px;width:13px;height:1px;background:var(--ink)"></div>
<div style="position:absolute;left:8px;top:42px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:114px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:166px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:1.6rem;top:-8px">Intro</div>
<div style="position:absolute;left:1.6rem;top:14px">Setup</div>
<div style="position:absolute;left:1.6rem;top:37px;color:var(--ink)">Measuring</div>
<div style="position:absolute;left:1.6rem;top:60px">Spacing</div>
<div style="position:absolute;left:1.6rem;top:106px">Reading</div>
<div style="position:absolute;left:1.6rem;top:158px">Events</div>
</div>
<div style="margin-top:.9rem;color:var(--ink-2)">A. Ticks on scale</div>
</div>
<div>
<div style="position:relative;height:184px;margin-top:10px">
<div style="position:absolute;left:8px;top:0;bottom:0;width:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:0;height:35px;width:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:0;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:23px;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:46px;width:13px;height:1px;background:var(--ink)"></div>
<div style="position:absolute;left:8px;top:69px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:114px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:166px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:1.6rem;top:-8px">Intro</div>
<div style="position:absolute;left:1.6rem;top:14px">Setup</div>
<div style="position:absolute;left:1.6rem;top:37px;color:var(--ink)">Measuring</div>
<div style="position:absolute;left:1.6rem;top:60px">Spacing</div>
<div style="position:absolute;left:1.6rem;top:106px">Reading</div>
<div style="position:absolute;left:1.6rem;top:158px">Events</div>
</div>
<div style="margin-top:.9rem;color:var(--ink-2)">B. Ticks move along</div>
</div>
<div>
<div style="position:relative;height:184px;margin-top:10px">
<div style="position:absolute;left:8px;top:0;bottom:0;width:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:0;height:57px;width:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:0;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:23px;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:46px;width:13px;height:1px;background:var(--ink)"></div>
<div style="position:absolute;left:8px;top:69px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:114px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:166px;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:1.6rem;top:-8px">Intro</div>
<div style="position:absolute;left:1.6rem;top:14px">Setup</div>
<div style="position:absolute;left:1.6rem;top:37px;color:var(--ink)">Measuring</div>
<div style="position:absolute;left:1.6rem;top:60px">Spacing</div>
<div style="position:absolute;left:1.6rem;top:106px">Reading</div>
<div style="position:absolute;left:1.6rem;top:158px">Events</div>
</div>
<div style="margin-top:.9rem;color:var(--ink-2)">C. The line moves along too</div>
</div>
</div>
<figcaption>The same moment three times: halfway through "Measuring". In A, the label sits next to the tick of the next section. In B, the line hasn't reached the tick of the section you're reading. In C, label, tick and line agree.</figcaption>
</figure>

The solution is to let the fill move along too. Between two sections, the line runs from one tick to the next. Wherever a tick ended up, the line reaches it exactly when that section starts.

```js
const fillAt = (progress) => {
  let i = 0;
  while (i < items.length - 1 && items[i + 1].frac <= progress) i++;

  const from = items[i];
  const to = items[i + 1];
  const toFrac = to ? to.frac : 1;
  const toY = to ? to.y : trackHeight;
  const t = toFrac > from.frac ? (progress - from.frac) / (toFrac - from.frac) : 1;
  return from.y + clamp(t) * (toY - from.y);
};

rail.style.setProperty('--progress', fillAt(progress) / trackHeight);
```

That makes the rail a little like a metro map. Where sections are close together, the distances on the line are no longer exactly to scale. Where there's room, nothing moves, and the rail is just as precise as before.

### Two things I found along the way

**Too many headings.** One of my longer articles has 16 headings, a few of them on two lines. In a short window, the labels simply don't fit below each other. The second pass then pushed the first labels past the top of the line: the first tick ended up 24 pixels above it, where the fill could never reach. Now the script checks for that, and makes the gaps between the labels smaller until everything fits.

```js
let boxes = place(GAP);

const first = boxes[0];
if (first.y + first.half < 0) {
  const titles = natural.reduce((sum, box) => sum + box.h, 0);
  const room = bottom + first.half;
  boxes = place((room - titles) / (boxes.length - 1));
}
```

**Sharp ticks.** A tick is a line of one pixel. At a position like 35.4 pixels, the browser spreads it over two rows of pixels, and it looks lighter and thicker than its neighbours. So the script rounds every tick to a whole pixel, and moves the label along with it.

## The events

The rail listens to a handful of events. Each one has a clear reason to be there.

**`scroll`** calls the update above. Scroll events fire very often while you scroll, so the script bundles them: it asks for one `requestAnimationFrame` and ignores the rest until that frame has run. That way the rail is updated at most once per frame, right before the browser draws it. The listener is `passive`, which tells the browser it won't block scrolling.

```js
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
}, { passive: true });
```

**A `ResizeObserver`** watches the article and the rail. When either changes size, because you resized the window or an image finished loading, the ticks are measured again. That's more reliable than listening to `resize`, which only knows about the window.

**`document.fonts.ready`** and **`load`** trigger one more measurement. Web fonts can change the height of every line, and images can push headings down after the page first appears.

**`click`** does three small things. After a mouse click on a link, the link loses focus, otherwise the labels would stay visible while your mouse is already gone. On a touchscreen, where there's no hover, a tap on the rail opens the labels. And a tap anywhere else closes them again.

## Why it scales

A few choices make the rail easy to reuse and to change.

**It doesn't know about articles.** The component gets a list of items and a selector for the content it measures. The [blog overview](/blog/) uses the same rail with years instead of headings, and the [styleguide](/styleguide/) passes its own list.

**The script only writes numbers and states.** Positions go into custom properties (`--item-y`, `--progress`), states into classes (`is-passed`, `is-active`) and one data attribute (`data-expanded`). The heading level is in `data-depth`. What any of it looks like is decided in CSS alone.

**It starts every rail it finds.** The script runs `initTocRail` for every element with `data-toc-rail`, so nothing breaks if a page has two, or none.

**It works without JavaScript.** The links are ordinary anchors. Without the script the ticks can't be placed and nothing fills up, but the contents are still there for keyboard users and screen readers.

## Turning it into a metro line

Because all the visuals live in CSS, you can completely change the look without touching the script. Say you want a metro line: a thicker line in the accent colour, with a station for every heading.

<figure>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;font:400 .8125rem/1.3 var(--font-sans);color:var(--ink-3)">
<div style="position:relative;height:13rem">
<div style="position:absolute;left:8px;top:0;bottom:0;width:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:0;height:55%;width:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:0;width:11px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:20%;width:7px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:38%;width:4px;height:1px;background:var(--ink-2)"></div>
<div style="position:absolute;left:8px;top:55%;width:13px;height:1px;background:var(--ink)"></div>
<div style="position:absolute;left:8px;top:78%;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:8px;top:100%;width:7px;height:1px;background:var(--rule-strong)"></div>
<div style="position:absolute;left:2rem;top:55%;transform:translateY(-50%);color:var(--ink)">Ticks, as it is now</div>
</div>
<div style="position:relative;height:13rem">
<div style="position:absolute;left:6px;top:0;bottom:0;width:4px;border-radius:2px;background:var(--rule)"></div>
<div style="position:absolute;left:6px;top:0;height:55%;width:4px;border-radius:2px;background:var(--accent)"></div>
<div style="position:absolute;left:1px;top:-7px;width:14px;height:14px;border-radius:50%;border:3px solid var(--accent);background:var(--accent)"></div>
<div style="position:absolute;left:1px;top:calc(20% - 7px);width:14px;height:14px;border-radius:50%;border:3px solid var(--accent);background:var(--accent)"></div>
<div style="position:absolute;left:3px;top:calc(38% - 5px);width:10px;height:10px;border-radius:50%;border:2px solid var(--accent);background:var(--accent)"></div>
<div style="position:absolute;left:1px;top:calc(55% - 7px);width:14px;height:14px;border-radius:50%;border:3px solid var(--accent);background:var(--paper);box-shadow:0 0 0 4px var(--accent-tint)"></div>
<div style="position:absolute;left:1px;top:calc(78% - 7px);width:14px;height:14px;border-radius:50%;border:3px solid var(--rule-strong);background:var(--paper)"></div>
<div style="position:absolute;left:1px;top:calc(100% - 7px);width:14px;height:14px;border-radius:50%;border:3px solid var(--rule-strong);background:var(--paper)"></div>
<div style="position:absolute;left:2rem;top:55%;transform:translateY(-50%);color:var(--ink)">A metro line</div>
</div>
</div>
<figcaption>The same state twice: two sections read, the third in progress. Only the CSS is different.</figcaption>
</figure>

The cleanest way is to replace the tick section of `layout.css`, rather than adding overrides on top of it. The current rules make ticks wider on hover and when they're active; a station doesn't need to grow, so those width rules can go. What's left is this:

```css
/* A thicker line in the accent colour */
.toc-rail__track {
  left: calc(var(--rail-x) - 2px);
  width: 4px;
  border-radius: 2px;
  background: var(--rule);
}

.toc-rail__fill {
  border-radius: inherit;
  background: var(--accent);
}

/* Every tick becomes a station, centred on the line
   and next to the first line of its label */
.toc-rail__tick {
  --size: 14px;
  left: calc(var(--rail-x) - var(--size) / 2);
  top: calc(0.65em - var(--size) / 2);
  width: var(--size);
  height: var(--size);
  border: 3px solid var(--rule-strong);
  border-radius: 50%;
  background: var(--paper);
}

/* Smaller stops for h3 headings */
.toc-rail__item[data-depth='3'] .toc-rail__tick {
  --size: 10px;
  border-width: 2px;
}

/* Stations you've passed are filled in */
.toc-rail__item.is-passed .toc-rail__tick {
  border-color: var(--accent);
  background: var(--accent);
}

/* "You are here" */
.toc-rail__item.is-active .toc-rail__tick {
  background: var(--paper);
  box-shadow: 0 0 0 4px var(--accent-tint);
}
```

The script doesn't change at all. It still sets `--item-y`, still marks items as passed or active, and still keeps the labels apart. Because the station size is a custom property too, making the stops for `h3` headings smaller takes just one line.

A few ideas to take it further:

- **Station names that are always visible.** Drop the `opacity: 0` and `pointer-events: none` from `.toc-rail__link`, and the rail becomes a proper route map. The two-pass spacing keeps the names readable, and every station stays next to its name.
- **A different colour per chapter.** Give each item a `--line-colour` from the template, and use it for the station and the stretch of line above it.
- **A horizontal line** for phones. This one needs a small change in the script, but the idea stays the same: the fractions work in any direction. Multiply them by the width of the track instead of the height, and set `--item-x` instead of `--item-y`.

## To wrap up

The rail is a good example of splitting the work. Astro knows the structure of the page, so it builds the list. The script does only what needs JavaScript: measuring, and following the reader. Everything you actually see is CSS, driven by a few numbers and a few classes. That split is what makes it possible to turn a line with ticks into a metro line without writing a single line of JavaScript.
