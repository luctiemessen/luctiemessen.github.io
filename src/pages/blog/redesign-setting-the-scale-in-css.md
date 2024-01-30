---
layout: "../../layouts/BlogPostLayout.astro"
title:  "Redesign: Setting the scale in CSS"
date:   2024-01-30
description: Redesign process - Setting the typographic scale in CSS.
tags: web personal
draft: false

---

<div class="span2-4">
  <p class="lead">Now we have the headings and body copy in place, it is time to start going to the browser and set the typographic scale.
</p>

## Redesign series
This is part of a 3 chapter series on redesign:
1. [Finding the body typeface](/blog/redesign-finding-the-body-typeface/ "Finding the body copy typeface" )
2. [Creating type hierarchy](/blog/redesign-creating-type-hierarchy/ "Creating type hierarchy") 
3. [Setting the scale in CSS](/blog/redesign-setting-the-scale-in-css/ "Setting the scale in CSS") (this page)

## Responsive scale
Ever since the influential [Responsive design](https://alistapart.com/article/responsive-web-design/ "A List Apart: Responsive Web Design" ) article was published I used media queries to define the styles of all typography (and other components) to fit them properly on different view ports. Sometimes resulting in splitting hairs between 2 breakpoints that are only a few pixels apart since some things just looked off in a specific view port width or height. Over the years I tried to simplify my media queries as much as I can. Thankfully, we now have a lot more fluid type (and space) setting properties at our disposal in CSS. 

My aim was to have a fluid scale that follows a vertical grid that has a `1.5rem` of line height. I just wanted my type to follow a grid (which I'm able to <a onclick="toggleGrid()">show and hide</a>). To me it is just professional honor to have everything align properly to a vertical grid. Obviously images will mess up the grid lines but for all text things it should follow a vertical rhythm. 

There are a lot of tools like [Utopia](https://utopia.fyi/ "Utopia by clearleft" ), [Gridlover](https://gridlover.net/ "Gridlover") and [Modular Scale](https://www.modularscale.com/ "Modular scale by Tim Brown") for defining scales based on a particular base font size. I'm not always a fan of using tools like these since they tend to prevent you from really thinking things through yourself and just pick something from the menu and apply it to your situation. However, what these tools do is give you a lot of additional things you might not have thought about (Gridlover for example provides a lot of styling for HTML elements you might forget about (like `sub`, `sup` `small` etc.)) For me it is just a nice baseline to build upon. 

### Golden ratio
Although there are many scales to chose from (or define your own), I've always found the Golden ratio interesting. The issue that used to prevent me from using it was that at some point to balloon the bigger headings (especially with larger base font sizes). The thing is, is that I already found out that I like my `h1` to be big! So I dialed in the Golden ratio with a `21px` base font size at Gridlover and started from that. 

This went really well for my liking. Apart from the `h4` which was set to 1rem, which would be fine if Playfair would have the same x-height and typographic color but Playfair felt too small compared to the body text so I bumped it up to `1.2rem`. But it needed to scale now, since a `93px` (which is `4.25rem` of `21px` used for the `h1`) is a bit too much on a mobile view port. But first I made sure that all items in my [Style guide](/styleguide/ "This site's style guide") followed the vertical grid properly. 

## Fluid type
Well for 1 view port now I got these proportions roughly figured out. But now how to elegantly scale it down when the view port becomes smaller? Obviously we have media queries to do this but like I mentioned above, I want to reduce my media queries and only use them to fix things that really need fixing. We have enough scalable length units in CSS to create a true fluid font size. 

### Add vw to the mix
Media queries revolve around browser dimensions (among other things) and for me the most relevant one is the view port width. The wider the screen is, the bigger the type can be set. If only, we had a CSS property to measure the view port width. Let me introduce `vw`. It represents 1% of the view port width. So an iPhone 14 Pro in portrait has `393px` as the view port width, in landscape it is `852px`. So `1vw` of portrait on an iPhone 14 is `393 * 1% = 3,93px` (roughly `4px`). Since I was looking for a estimated font size of `18px` I could define the font-size at `calc(16px+0.5vw)` which would result in 18-ish pixels on a mobile device. Once I started with that, it felt a bit too much so I tinkered with it a bit and decided on `0.4vw` as the fluid length to add to the `16px`. It just felt better. 

<figure class="">


  <div style="background-color:var(--information-color);width:2vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">2vw</span></div>
  <div style="background-color:var(--information-color);width:10vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">10vw<span></div>
  <div style="background-color:var(--information-color);width:40vw;height:3rem;margin-bottom:var(--base-line-height)"><span style="background-color:var(--information-color);color:white;line-height:3rem;text-align:center;">40vw<span></div>
<figcaption>
	width of 2, 4 and 40vw
</figcaption>
</figure>


So with the minimum of `16px` it scales up to quite a bit bigger on a desktop screen. On my 16" Macbook it is 1792px wide. In full screen (note; the `vw` view port width is the browsers' width, if you resize the browser, the view port width is changing along with it, so it is not your screen-width). So let's calculate the max font-size on my full screen browser.

```css
/* Full screen on 16" MacBook */
1792 * 1% = 17.92px (= 1vw)

/* 0.4 * 1vw  */
0.4 * 17.92 = 7.168px

/* max fluid font-size */
calc(0.4vw + 16px) = 7.168 + 16 = 23.168px

```

There is however one small issue with this. What happens when we view this on a really large view ports or view ports that have a really wide aspect ratio.

#### 8K Resolution
Let's calculate; an 8K screen renders 7680 x 4320 pixels. `0.4 * 76.8 is 30.72`. Add that to `16px` and we have a `46.72px` font-size for the base copy. And my `h1` is set at 4.25 times this size. That is a whopping `198.56px`. 

<div class="">
  <p style="font-size:198.56px;line-height:200px">198</p>
  <p style="font-size:46.72px;line-height:50px">46</p>
</div>

And yes, I know, the pixels are smaller on those displays and probably nobody will not use the browser in full screen mode on these displays so it will not render as huge as shown here but still, it didn't feel good.

### Clamp() to save the day
With that, I'm in need of a max font size. I could use a fixed proportion to define that (for example with query container length units) but then if I'd change the container size, this would also change my maximum font size which probably wouldn't be the end of the world but there is this `clamp()` function that gives me a bit more control since it dictates a min and max size. 

With this I was able to set the min size on mobile which was an equivalent of `18px` or `1.125rem`. And my max size is `22px` or `1.375rem`. And in the middle we define our fluid value. So the trick is to have a fluid value (using vw) between your minimum width and maximum width which you designed for. So I designed from 320px and I decided that with 22px, my ideal content width is 1232 (actually 62rem (which is 1364px), which is my max width of my grid but I added left and right 3rem padding (66px both sides adds up to 132px)). When you substract the padding, you get 1232px. So now I need to find the value which I can add up to the `18px` size on 320px up until the `22px` for 1232px and above.

I need to bridge `1232 - 320 = 912` pixels of view port width to gradually (linear) increase the size with `4px` (which is the difference between my maximum and minimum font-size).

So basically per pixel view port shift from 320 onward, there are 4/912th pixels (which is 0,00438596 pixel size increase per pixel shift) I need to add. But this is not something I could do in CSS easily with `vw` since it scales along the way. At `320px` 1vw renders in `3.2px` but at `1232px` it renders to `12.32px`. So I need a formula to gradually increase it.

My math skills were not up for this task but Google helped me along to find this method from Pedro Rodriguez: [Linearly scale font size with CSS](https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-view port/ "Linearly scale font size with CSS - CSS Tricks").

It is a brilliant article that goes way further than just fluid type setting but I was particularly interested in that he explained the linear part and how to come up with the values for the ideal value within the clamp() statement. 

```js
slope = (maxFontSize - minFontSize) / (maxWidth - minWidth)
yAxisIntersection = -minWidth * slope + minFontSize
preferredValue = yAxisIntersection[rem] + (slope * 100)[vw]
```

Let's disentangle these individual lines of this formula.

```js
slope = (maxFontSize - minFontSize) / (maxWidth - minWidth)

/* my scenario */
slope = (22 - 18) / (1232 - 320) = 0,00438596
```

So this is where I was with my own journey, Pedro calls it the slope (the slope of the line over which to increase the font-size). I thought this `0.004px` increase per step should be added to the `18px` initially (from 320 onward) but then I walked into the trap that this `vw` value increases over time and it would render my font-size to `22px` earlier than the `1232px` view port width so Pedro came up with this solution.


```js
yAxisIntersection = -minWidth * slope + minFontSize

/* my scenario */
yAxisxIntersection = -320 * 0,00438596 + 18 = 16,5964928
```

He uses the `yAxisIntersection` as the reference point which we can add scalable `vw` value to. The reference point is in my case `16,5964928`. This needs to be converted to rems and we can do that by dividing by `16px` (the assumed rem font-size)

```js
 16,5964928 / 16 = 1,0372808 = 1,0373 (rounded)
```

so our `clamp()` statement would look like this (for now) 

```css
clamp(1.125rem, 1.0373rem + <increase value>, 1.375rem);
```

All we need now is the slope (times 100) to add it to the `yAxisIntersection` in order to create true linear fluidity in our type.

```js
preferredValue = yAxisIntersection[rem] + (slope * 100)[vw]

/* my scenario */
preferredValue = 1.0373rem + (0,00438596 * 100)vw
preferredValue = 1.0373rem + 0,4386vw
```

This renders my final font-size declaration to:
```css
--base-font-size: clamp(1.125rem, 1.0373rem + 0.4386vw, 1.375rem);
```

### Wrapping it up
With the font-size defined at `:root` in this method, now I can create a truly fluid scale that serves as a foundation for all my typesetting. So my line-height will be defined in `rem` so it will be relative to the base-font size. And this will work for everything from now on. So also my vertical grid will adapt to the fluid type from now on, as well as my margins (who are also defined based on the line-height, which is based on the fluid font-size). Jolly good!

```css
:root {
    ...
    --base-font-size: clamp(1.125rem, 1.0373rem + 0.4386vw, 1.375rem);
    --base-line-height: 1.5rem;
    font-size: var(--base-font-size);
    line-height: var(--base-line-height);
    ...
}
```

I'm happy with how my scale is now fluid and works in almost every view port. I might make some adjustments in some view ports when I don't like how it pans out and I'll probably do that within some media queries. But for now this is it!

## Closing remarks
This closes off the three-piece on redesigning my site. I learned a lot from properly describing the process and also learned a lot along the way. I'm happy with the result and also happy this series is finished so I can write about other things onwards. 