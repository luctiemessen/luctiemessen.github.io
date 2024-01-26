---
layout: "../../layouts/BlogPostLayout.astro"
title:  "Redesign: Setting the scale in CSS"
date:   2024-01-22
description: Redesign process - Setting the typographic scale in CSS.
tags: web personal
draft: true

---

<div class="span2-4">
  <p class="lead">Now we have the headings and body copy in place, it is time to start going to the browser and set the typographic scale.
</p>

## Redesign series
This is part of a 3 chapter series on redesign:
1. [Finding the body typeface](/blog/redesign-finding-the-body-typeface/ "Finding the body copy typeface" )
2. [Creating type hierarchy](/blog/redesign-creating-type-hierarchy/ "Creating type hierarchy") (this page)
3. Setting the scale in CSS

## Responsive scale
Ever since the influential [Responsive design](https://alistapart.com/article/responsive-web-design/ "A List Apart: Responsive Web Design" ) article was published I used media queries to define the styles of all typography (and other components) to fit them properly on different viewports. Sometimes resulting in splitting hairs between 2 breakpoints that are only a few pixels apart since some things just looked off in a specific viewport width or height. Over the years I tried to simplify my media queries to the extend that I want to minimize the use of them nowadays. Thankfully, we now have a lot more fluid type (and space) setting properties at our disposal in CSS. 

My aim was to have a fluid scale that follows a vertical grid that has a `1.5rem` of line height. I just wanted my type to follow a grid (which I'm able to <a onclick="toggleGrid()">show and hide</a>). To me it is just professional honor to have everything align properly to a vertical grid. Obviously images will mess up the grid lines but for all text things it should follow a vertical rythm. 

There are a lot of tools like [Utopia](https://utopia.fyi/ "Utopia by clearleft" ), [Gridlover](https://gridlover.net/ "Gridlover") and [Modular Scale](https://www.modularscale.com/ "Modular scale by Tim Brown") for defining scales based on a particular base font size. I'm not always a fan of using tools like these since they tend to prevent you from really thinking things through yourself and just pick something from the menu and apply it to your situation. However, what these tools do is give you a lot of additional things you might not have thought about (Gridlover for example provides a lot of styling for html elements you might forget about (like `sub`, `sup` `small` etc.)) For me it is just a nice baseline to build upon. 

### Golden ratio
Although there are many scales to chose from (or define your own), I've always found the Golden ratio interesting. The issue that used to prevent me from using it was that at some point to balloon the bigger headings (especially wiht larger base font sizes). The thing is, is that I already found out that I like my `h1` to be big! So I dialed in the Golden ratio with a `21px` base font size at Gridlover and started from that. 

This went really wel for my liking. Apart from the `h4` which was set to 1rem, which would be fine if Playfair would have the same x-height and typographic color but Playfair felt too small compared to the body text so I bumped it up to `1.2rem`. But it needed to scale now, since a `93px` (which is `4.25rem` of `21px` used for the `h1`) is a bit too much on a mobile viewport. But first I made sure that all items in my [Styleguide](/styleguide/ "This site's styleguide") followed the vertical grid properly. 

## Fluid type
Well for 1 viewport now I got these proportions roughly figured out. But now how to elegantly scale it down when the viewport becomes smaller? Obviously we have mediaqueries to do this but like I mentioned above, I want to reduce my media queries and only use them to fix things that really need fixing. We have enough scalable length units in CSS to create a true fluid font size. 

### Add vw to the mix
Media queries revolve around browser dimensions (among other things) and for me the most relevant one is the viewport width. The wider the screen is, the bigger the type can be set. If only we had a CSS property to measure the viewport width. Let me introduce `vw`. It represents 1% of the viewport width. So an iPhone 14 Pro in portrait has `393px` as the viewport width, in landscape it is `852px`. So `1vw` of portrait on an iPhone 14 is `393 * 1% = 3,93px` (roughly `4px`). Since I was looking for a estimated font size of `18px` I could define the font-size at `calc(16px+0.5vw)` which would result in 18-ish pixels on a mobile device. Once I started with that, it felt a bit bit too much so I tinkered with it a bit and decided on `0.4vw` as the fluid length to add to the `16px`. It just felt better. 

<figure class="">


  <div style="background-color:var(--information-color);width:2vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">2vw</span></div>
  <div style="background-color:var(--information-color);width:10vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">10vw<span></div>
  <div style="background-color:var(--information-color);width:40vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">40vw<span></div>
<figcaption>
	width of 2, 4 and 40vw
</figcaption>
</figure>



So with the minimum of `16px` it scales up to quite a bit bigger on a desktop screen. On my 16" Macbook it is 1792px wide. In full screen (note; the `vw` viewport width is the browsers' width, if you resize the browser, the viewport width is changing along with it, so it is not your screen-width). So let's calculate the max font-size on my full screen browser.

```css
/* Full screen on 16" MacBook */
1792 * 1% = 17.92px (= 1vw)

/* 0.4 * 1vw  */
0.4 * 17.92 = 7.168px

/* max fluid font-size */
calc(0.4vw + 16px) = 7.168 + 16 = 23.168px

```

There is however one small issue with this. What happens when we view this on a really large viewports or viewports that have a really wide aspect ratio.

#### 8K Resolution
Let's calculate; an 8K screen renders 7680 x 4320 pixels. `0.4 * 76.8 is 30.72`. Add that to `16px` and we have a `46.72px` font-size for the base copy. And my `h1` is set at 4.25 times this size. That is a whopping `198.56px`. 

<div class="">
  <p style="font-size:198.56px;line-height:200px">198</p>
  <p style="font-size:46.72px;line-height:50px">46</p>
</div>

And yes, I know, the pixels are smaller on those displays and probably people will not use the browser in full screen mode on these displays so it will not render as huge as shown here but still. It didnt feel good.

### Clamp() to save the day
With that, I'm in need of a max font size. I could use a fixed proportion to define that (for example with query container length units) but then if I'd change the container size, this would also change my maximum font size which probably wouldnt be the end of the world but there is this `clamp()` function that gives me a bit more control since it dictates a min and max size. 




</div>

<div class="bleed">


</div>
<div class="span2-4">
</div>
