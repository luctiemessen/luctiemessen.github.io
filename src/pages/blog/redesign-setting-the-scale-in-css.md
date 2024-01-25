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
Although there are many scales you can pick and or define your own, also here I found the Golden ratio always interesting but also a bit too much at some point when you get to the bigger sizes (and when your base size is big). The thing is, is that I already found out that I like my `h1` to be big! So I dialed in the Golden ratio with a `21px` base font size at Gridlover and started from that. 

This went really wel for my liking. But it needed to scale now, since a `93px` size on mobile is a bit too much. But first I made sure that all items in my [Styleguide](/styleguide/ "This site's styleguide") followed the grid properly. 

## Fluid type
Well for 1 viewport now I got these proportions roughly figured out. But now how to elegantly scale it down when the viewport becomes smaller? Obviously we have mediaqueries to do this but like I mentioned above, I want to reduce my media queries and only use them to fix things that really need fixing. We have enough scalable length units in CSS to create a true fluid font size. 

### vw to the rescue
Media queries revolve around screen dimensions (among other things) and for me the most relevant one is the viewport width `vw`. It represents 1% of the viewport width. So an iPhone 14 Pro in portrait has `393px` as the viewport width, in landscape it is `852px`. So `1vw` of portrait on an iPhone 14 is `393 * 1% = 3,93px`. 

<div style="background-color:var(--information-color);width:1vw;height:50px;"></div>

</div>

<div class="bleed">


</div>
<div class="span2-4">
</div>
