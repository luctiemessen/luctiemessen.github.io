---
layout: "../../layouts/BlogPostLayout.astro"
title: "Who wins? CSS cascade layers, explained"
date: 2026-09-24 12:00:00
description: A beginner-friendly look at cascade layers in CSS, and how this site uses three simple levels to stop its styles from fighting each other.
tags: css web
draft: true
---

<p class="lead">You know the feeling. You write a perfectly good line of CSS, reload the page, and nothing happens. You open the inspector and there it is: your rule, crossed out, beaten by some other rule you forgot about. Cascade layers are a fairly new CSS feature that makes those fights a lot easier to avoid. This site uses them, so let me show you how they work.</p>

## First: how CSS picks a winner

When two rules want to style the same element, CSS has to decide which one wins. That decision is called the *cascade*, and for most everyday CSS it comes down to two questions.

**1. Which selector is more specific?** CSS gives every selector a kind of score. IDs count the most, then classes, then plain element names like `p` or `li`. The selector with the highest score wins.

```css
li { color: black; }            /* 1 element            */
.menu li { color: grey; }       /* 1 class + 1 element  */
#nav .menu li { color: green; } /* 1 ID + 1 class + ... */
```

Every `li` inside `#nav .menu` turns green, no matter in which order you write these rules. The ID simply beats everything else.

**2. If the scores are equal, which rule comes last?** Then the rule that appears later in your CSS wins.

That's it. Simple enough, until your stylesheet grows.

## The problem on this site

Every article on this site sits inside an element with the class `prose`. That's where I style the running text: paragraphs, headings, links and lists. A list in an article gets a bit of room on the left for its bullets:

```css
.prose ul {
  padding-left: 1.4em;
}

.prose li {
  margin: 0.35em 0;
  padding-left: 0.2em;
}
```

Now look at the little tags at the top of this article. That's a list too, but one that should look nothing like a normal list: no bullets, no room on the left, everything on one line.

```css
.post-tags {
  display: flex;
  padding: 0;
  list-style: none;
}

.post-tags li {
  margin: 0;
}
```

As long as the tags stay above the article, this works fine. But the moment I put them *inside* the article, which I do in the [styleguide](/styleguide/), the two sets of rules start fighting. And the article rules win:

- `.prose ul` has a class and an element. `.post-tags` only has a class. The article rule has the higher score, so the tags get their padding back.
- `.prose li` and `.post-tags li` have exactly the same score. So the one that comes last in the file wins, and in my CSS that's the article rule.

The usual fixes aren't great. You can make the selector more specific, like `.prose .post-tags`, but then you're writing CSS about *where* something is instead of *what* it is. Or you can add `!important`, which works right until you need to override that rule too. Before you know it, you're in an arms race with your own stylesheet.

## Enter cascade layers

Cascade layers add one more question to the cascade, and it comes *before* the specificity score: **which layer is this rule in?**

You create layers with `@layer`, and you decide their order yourself. Rules in a later layer always beat rules in an earlier layer, no matter how specific those earlier rules are. This line sits at the top of `base.css` on this site:

```css
@layer base, prose;
```

That one line says: there are two layers, `base` and `prose`, and `prose` wins from `base`. After that, you can put rules into a layer from anywhere in your CSS:

```css
@layer prose {
  .prose ul {
    padding-left: 1.4em;
  }
}
```

And here's the part that makes it all click: **CSS that isn't in any layer wins from all layers.** Unlayered styles are treated as if they sit in one final, invisible layer on top of everything else.

## How this site uses them

With that, the whole site is split into three levels, from weakest to strongest:

1. **`base`**: the foundation. A small reset, the default look of links, and the focus outline you see when you use the keyboard.
2. **`prose`**: the running text of articles. Paragraphs, headings, lists, quotes, tables and footnotes.
3. **Everything else**, not in a layer: the components. The menu, the tags, the lists of posts, the notes in the margin.

<figure>
<div style="display:grid;gap:.4rem;font:400 .875rem/1.3 var(--font-sans)">
<div style="padding:.65rem .9rem;border-radius:5px;background:var(--accent);color:var(--paper)">Components, not in a layer · <b style="font-weight:600">always win</b></div>
<div style="padding:.65rem .9rem;border-radius:5px;background:var(--accent-tint);color:var(--ink)">@layer prose · articles</div>
<div style="padding:.65rem .9rem;border-radius:5px;box-shadow:inset 0 0 0 1px var(--rule-strong);color:var(--ink-2)">@layer base · reset, links, focus</div>
</div>
<figcaption>The three levels of this site. A rule higher up beats any rule lower down, whatever its selector.</figcaption>
</figure>

So when the tags end up inside an article, `.post-tags` wins from `.prose ul`, even though its selector has the lower score. It isn't in a layer, and `.prose ul` is. No extra classes, no `!important`.

The same trick helps at the bottom. Every link on this site is green with a thin underline. That rule lives in the `base` layer:

```css
@layer base {
  a {
    color: var(--accent);
    text-decoration-thickness: 1px;
  }

  a:hover {
    text-decoration-color: currentColor;
  }
}
```

The site title in the header is a link too, but it should be dark and without an underline. Its rule is short and simple:

```css
.site-title {
  color: var(--ink);
  text-decoration: none;
}
```

Without layers, that would be a gamble. A state like `:hover` counts as much as a class, so `a:hover` scores higher than `.site-title`. Anything I add to the hover style of links would leak into the header. Because the link styles sit in the `base` layer, the site title simply wins, and I never have to think about it.

## See it for yourself

Here's a small live example, right in this page. The first rule uses an ID, so it has by far the highest score. But it sits in an earlier layer than the second one.

```css
@layer demo-first, demo-second;

@layer demo-first {
  #layer-demo p { color: var(--ink-3); }
}

@layer demo-second {
  .winner { color: var(--accent); }
}
```

<style>
@layer demo-first, demo-second;
@layer demo-first { #layer-demo p { color: var(--ink-3); } }
@layer demo-second { .winner { color: var(--accent); } }
</style>

<figure>
<div id="layer-demo"><p class="winner">If this sentence is green, the later layer won.</p></div>
<figcaption>A single class in a later layer beats an ID in an earlier one.</figcaption>
</figure>

## A few things good to know

**Declare the order first.** A layer's position is set the first time CSS mentions it. That's why this site names both layers in the very first line of `base.css`, before anything else. One glance tells you who wins.

**Not being in a layer is the strongest position.** This surprises a lot of people, because it feels like it should be the other way around. It helps to think of layers as a way to make things *weaker* on purpose: a reset or a base style that anything else may override.

**`!important` flips the order.** For rules marked `!important`, earlier layers win from later ones.[^important] You'll rarely need it, but it's good to know when a rule behaves unexpectedly.

**Browsers are ready.** Cascade layers have worked in every major browser since early 2022.[^support] That's also why I removed a build tool that tried to "help" older browsers by rewriting my layers into complicated selectors. I wrote about that in [the article about this redesign](/blog/redesign-2026-notes-in-the-margin/).

## To wrap up

Cascade layers don't replace specificity. Within a layer, the old rules still apply. What they give you is a way to say, up front, which *group* of styles should win. On this site that's three simple levels: a base, the article text, and the components on top.

The result is CSS that's easier to reason about. I can drop any component into an article and know it will look the same as everywhere else. And that crossed-out rule in the inspector? I see it a lot less often now.

[^important]: The same goes for unlayered CSS: an `!important` rule in a layer beats an `!important` rule outside of one. MDN explains it well in its reference for [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).
[^support]: Chrome 99, Firefox 97 and Safari 15.4, all released in the first months of 2022.
