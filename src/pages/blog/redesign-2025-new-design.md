---
layout: "../../layouts/BlogPostLayout.astro"
title: "Redesign 2025: A new look inspired by Google Stitch"
date: 2026-04-14
description: A walkthrough of the biggest design changes in the 2025 site redesign — new typography, a floating glass nav, an editorial article list, and a warmer color palette, all inspired by a prompt I fed into Google Stitch.
tags: web design personal
draft: true
---

<div class="span2-4">
  <p class="lead">Every few years the site needs a proper rethink. Not just a lick of paint, but a genuine reconsideration of what the thing should feel like. This is a writeup of what changed, why, and where the ideas came from.</p>
</div>

## Where the ideas came from

I'd been vaguely dissatisfied with the old design for a while. The fonts felt a little generic, the layout safe, and the overall impression somewhere between "developer blog" and "not really sure what this is." I knew I wanted something more editorial — something with a clear point of view.

Around this time I tried [Google Stitch](https://stitch.withgoogle.com/), a generative UI tool from Google that takes a prompt and produces a styled HTML prototype. I described the kind of site I was after — a minimal personal blog with an architectural, gallery-like sensibility — and what came back was genuinely good. Not perfect, but good enough to use as a proper design reference.

What Stitch gave me was a complete visual language: a font pairing, a colour palette, a nav component, and a content layout for a blog article page. I used that as my north star and then adapted everything to fit my existing Astro setup.

## Typography: Newsreader replaces Playfair Display

The most visible change is the switch from Playfair Display to [Newsreader](https://fonts.google.com/specimen/Newsreader). Both are serifs, but they feel quite different.

Playfair is a display typeface — dramatic, high contrast, built to look impressive at large sizes. It works well for posters and editorial covers. But for a site where headings live alongside paragraphs of body text, the drama starts to feel like it's trying too hard.

Newsreader is a text serif. It was designed for long-form reading and supports a variable optical size axis (`opsz`), which means the letterforms adapt depending on the size they're rendered at. At large sizes the serifs get finer, the contrast increases, and you get that refined, editorial quality. At smaller sizes the design compensates to stay legible. Setting headings at `font-weight: 400` with `font-optical-sizing: auto` makes the most of this — the h1 looks truly elegant without needing to be bold.

For body copy, [Inter](https://rsms.me/inter/) replaced Source Sans 3. Inter is a workhorse — neutral, highly legible, designed for screens. It gets out of the way and lets the Newsreader headings do the talking.

The heading scale was also adjusted to match the template more precisely:

- **h1**: `clamp(2.75rem, 2.25rem + 2.6vw, 3.5rem)` — substantial but not oversized
- **h2**: `clamp(2rem, 1.75rem + 1.3vw, 2.5rem)` — a clear step down
- **h3**: `1.875rem` — fixed, matching the template exactly
- **h4**: `1.375rem` — subordinate but still in the Newsreader family

## Colour palette: warm and material

The old palette was decent but lacked character. The new one comes directly from the Stitch output and is grounded in Google's Material You colour system — which means the colours have a deliberate tonal relationship rather than being picked individually.

The key values:

- **Surface**: `#f9f9f9` — warm off-white, not harsh
- **On-surface**: `#1a1c1c` — near-black for headings
- **On-surface-variant**: `#4c4634` — warm dark brown for body copy, softer than pure black
- **Primary container**: `#f4d03f` — a confident yellow used for the `hr` divider, blockquote border, and aside accents
- **Tertiary**: `#006879` — teal used for tags and links; the one accent that brings energy to the page

One thing that was easy to get wrong was treating body text and heading text as the same colour. The template uses `#4c4634` for body paragraphs and reserves `#1a1c1c` for headings. The difference is subtle but it creates a visual hierarchy that goes beyond font size alone.

## The floating glass-pill nav

The old navigation was a conventional fixed header — a horizontal bar across the top of the page. Functional, unremarkable.

The new nav is a floating pill, centred at the top of the page, with a frosted glass effect (`backdrop-filter: blur(20px)` over a semi-transparent white background). It looks like it's hovering above the content rather than being part of the chrome. As you scroll past 300px, a scroll-to-top button appears to the right of the pill with a spring animation.

On mobile the desktop nav is hidden entirely. Instead, a hamburger button sits fixed at the bottom-right corner — the same pill shape, same glass effect. Tapping it springs open a vertical menu above it. This pattern is uncommon enough to feel considered without being confusing.

The dark mode version of the glass pill was trickier than expected. A common mistake is setting the background too opaque — `rgba(28, 30, 30, 0.92)` looks fine in isolation but the backdrop blur becomes invisible because nothing shows through. Dropping to around `0.78` opacity lets the blur do its job while keeping the pill clearly dark.

## Editorial article list

The previous home page had a fairly plain list of post titles and dates. The new one is designed to feel more like a magazine contents page.

Each article card shows:
- Tags in teal, uppercase, widely tracked
- A `/` separator in a muted warm tone
- The date in the same small caps style, spelled out in full (e.g. *February 20, 2025*)
- The article title below in Newsreader at a generous size

The home page shows the five most recent articles, with a "View all articles" link at the bottom. The blog index shows everything.

## Dark mode

Dark mode was already in place but needed work. The main issues were:

1. **Hardcoded heading colours** — h1 through h4 had `color: #1a1c1c` baked in, so they stayed near-black on dark backgrounds.
2. **Body text too yellow** — the dark mode `--text-color` was `#cfc6ae`, a warm tan that looks yellowish against dark backgrounds.
3. **Article metadata too dark** — the date colour was also hardcoded to `#4c4634`, effectively invisible in dark mode.
4. **Tags too dark** — `#006879` teal is fine in light mode but nearly disappears on dark backgrounds.

The fixes involved introducing a `--heading-color` CSS variable (separate from `--text-color`), overriding both properly in the dark media query, and setting a lighter teal (`#56d6f2`) for tags in dark mode. Body text in dark mode is now `#e4e2dd` — a warm near-white that reads cleanly without feeling harsh.

## Closing thoughts

Using Stitch as a starting point saved a lot of time that would otherwise have gone into making font pairing decisions and building out a colour system from scratch. But it's worth being clear about what Stitch did and didn't do. It produced a static HTML prototype with inline Tailwind classes — visually polished but not a real design system. Translating that into a maintainable set of CSS custom properties, component abstractions, and proper dark mode support was where the actual work was.

The result feels like the site I wanted. More considered, more editorial, more itself.
