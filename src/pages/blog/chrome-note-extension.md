---
layout: "../../layouts/BlogPostLayout.astro"
title:  "ChromeNote - A tiny, simple notepad for Chrome"
date:   2025-02-20
description: Small note about my freshly created notepad extension for Chrome.
tags: web personal
draft: false

---

<div class="span2-4">
  <p class="lead">As someone who constantly has a million browser tabs open (I'm working on this), I was in need of a simple notepad that opened everytime I open a new tab. So, I decided to build a simple Chrome extension to take notes and sync these notes across all open tabs.</p>

  ## It has been done before...
  Yes, I've used [Dan Eden's](https://daneden.me) plugin ([Lucid](https://chromewebstore.google.com/detail/lucid/achogfadpkcepkepcpegehpiiioihmik)) before writing my own but somehow (probably due to my organisational settings on my Macbook) Chrome complained about it not being supported anymore so I wanted to fill that gap and learn to create a plugin for myself. It is heavily inspired by [iA Writer](https://ia.net/writer). I even used their typeface iA Writer Mono that is served through [Fontsource](https://fontsource.org/fonts/ia-writer-mono/cdn).

  ## What It Does

  ### 1. Simple Notepad  
   The extension gives me a basic notepad within the browser, where I can quickly jot down and update my notes.

  ### 2. Reveals itself in every newly opened tab
  After enabling the plugin, the notepad reveals itself in every tab you open. Obviously it doesn't move the input-focus to the notepad since I don't want to hinder the logical flow of typing an URL (that would be the primary goal of opening a new tab).

  ### 3. Syncs Notes Across All Tabs  
   Once you update a note in one tab, it automatically syncs to all other tabs (that have the extension active). It uses Chrome’s `chrome.storage.sync` to save and load the notes across the browser.

  ### 4. Real-Time Updates  
   Using `chrome.storage.onChanged`, any update in one tab is reflected instantly in all others, so no need to refresh (and in my case, no need to find the tab that had my notes).

   Ohw yes and it also does Dark mode 🌚!

  ## Where to find it?

  - [Github](https://github.com/luctiemessen/ChromeNote)
  - [Chrome extension page](https://www.chrome.com) (to be updated after publishing)

I'm happy to think along about new features. Please let me know :)

</div>