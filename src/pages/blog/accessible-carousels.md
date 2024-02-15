---
layout: "../../layouts/BlogPostLayout.astro"
title:  "Accessible carousels"
date:   2024-01-24
description: How to create accessible carousels?
tags: web personal
draft: true

---

<div class="span2-4">
 
<div class="lead">
At work we've been in discussion with some of our a11y specialist about not using carousels. Although, carousels are not really my favourite solution. I'd like to see if I can make an accessible one.
</div>

```css
.carousel {
    display: flex;
    overflow: auto;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 24px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

.carousel .item {
    flex-shrink: 0;
    scroll-snap-align: start;
}
```

```html
<ul class="carousel">
    <li class="item">...</li>
    <li class="item">...</li>
</ul>
<div class="carousel-controls">
    <button class="previous"></button>
    <button class="next"></button>
</div>
```

```js
el.scrollIntoView() {
    behaviour: 'smooth',
    inline: 'start'
}
```

<style>
.carousel {
    margin:0;
    list-style-type: none;
    display: flex;
    gap: 2rem;
    overflow: auto;
    scroll-snap-type: x mandatory;
}

.carousel .item {
    flex-shrink: 0;
    height: 250px;
    width: 250px;
    background-color: var(--information-color);
    scroll-snap-align: start;
}

.item:target {
    background-color:red;
}

</style>
<div role="region" aria-roledescription="carousel" aria-label="Design patterns">
    <ol class="carousel">
        <li class="item"><a href="">First</a></li>
        <li class="item"><a href="">Second</a></li>
        <li class="item"><a href="">Third</a></li>
        <li class="item"><a href="">Fourth</a></li>
        <li class="item"><a href="">Fifth</a></li>
        <li class="item"><a href="">Sixth</a></li>
    </ol>
    <div class="carousel-controls">
        <button class="previous">prev</button>
        <button class="next">next</button>
    </div>
</div>


stuff


<div>d</div>
<p>more</p>


https://www.w3.org/WAI/tutorials/carousels/structure/



https://www.reddit.com/r/webdev/comments/v1rjlk/how_do_nike_and_apple_make_such_smooth_and_touch/

https://jsfiddle.net/54fy6Lo2/

https://www.w3.org/WAI/tutorials/carousels/full-code/


