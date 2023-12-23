---
layout: "../../layouts/BlogPostLayout.astro"
tags: tags css
date: 2011-10-14 10:50:21
[//]: # format date like: yyyy-mm-dd
title: Pure CSS iOS alerts
draft: false
---

ter my workshop at the Fronteers 2011 Conference, Lea Verou showed us some very cool CSS3 stuff. This inspiring session made me think about how to implement some complex interaction patterns without the usage of Javascript and images and theÂ iOS alert dialog seemed like a suitable candidate for a first exercise.

To start this thing we need some markup…

{% highlight html %}
<div class="alert">
  <h1>This is a pure CSS3 iOS alert simulation</h1>
  <p>Do you like this stuff?</p>
  <button>Nope</button><button class="default">Very much</button>
</div>
{% endhighlight %}

The CSS is a little bit more complex but not that hard to understand. I analyzed the alert message and thought there were three interesting things to tinker with in CSS.

the appearing effect
the shiny partial ellipse on top of the dialog
the beveled buttons

## Act 1: The appearance

I interpreted the animation on my iPhone as one animation with four states:

start from the middle of the screen being invisible
scale up
scale slightly down
scale up again to it’s final size and stays visible
At the end of the second state, it seems that the dialog is slightly bigger than the final state. I have not measured this, so it might just be an optical illusion but the result seemed quite accurate.

We all know that this animation effect can be achieved through keyframe animations. I decided that the four steps are divided equally over the entire animation, so the time of the individual states take 1/4 of the entire animation. I used the following CSS for this.

{% highlight html %}
{% endhighlight %}

{% highlight css %}
@-webkit-keyframes iOSpulse {
  0% {
    -webkit-transform: scale(0);
  }
  33% {
    -webkit-transform: scale(1.1);
  }
  67% {
    -webkit-transform: scale(0.8);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
{% endhighlight %}

Note that I only use -webkit prefixes, in the final result I also included the -moz prefix but since the code is apart from the prefix identical I think it is a waste of screen real-estate to put all browser specific stuff here.

The animation starts at 0% and ends at 100% (obviously). The initial scaling size is 0 making the message invisible. After the second stop the message is at a 110% size and then scales down to 80% finishing at 100%.

All good but we got to make this thing actually do something, all we did was define the animation steps. To attach this animation to an element, we simply use the following lines of code.

.alert {
  -webkit-animation-name: iOSpulse;
  -webkit-animation-duration: .38s;
  -webkit-animation-timing-function: ease-in-out;
}
We used the animation name in our keyframe definition so we define that as our animation name. The duration is 0.38 seconds. Don’t ask me how I got to this number. It just felt right. I changed the timing function to ease-in-out for the same reason.

## Act 2: The ellipse

This is the thing where I got into a little trouble, I couldn’t quite get this thing as I wanted it. But the result is …acceptable… The original ellipse on top of the dialog is smoother and even has a little gradient in it. I just used a radial gradient to achieve the effect and positioned the gradient with a little help of background-position and background-size.

.alert {
  background: -webkit-radial-gradient(50% -50%, circle, rgba(255,255,255,.1) 50%, transparent 50%), rgba(5,24,71,0.9);
  background-size: 100% 400%;
  background-position: 0 29%;
}
The radial gradient takes several arguments. First the x and y position, the shape, and finally the gradient with its color stops.

## Act 3: The buttons

The buttons are a bit easier, just regular linear gradients with several color stops. I defined three different appearances for the button. Initially we have the two buttons, one regular button (left) and one primary, default, highlighted or whatever you want to call it button that is located on the right. When each of these two buttons is active or being pressed, they change to a darker color. This dark color is for each of the two buttons identical (as far as I know). Therefore, only three gradients are required.

button {
  background: -webkit-linear-gradient(-90deg, rgba(255,255,255,.38) 1px, rgba(255,255,255,.1) 50%, rgba(255,255,255,.04) 50%, rgba(255,255,255,.04) 100%);
  text-shadow: black 0px -1px 0px;
}
.default {
  background: -webkit-linear-gradient(-90deg, rgba(255,255,255,.68) 0, rgba(255,255,255,.43) 50%, rgba(255,255,255,.25) 50%, rgba(255,255,255,.32) 100%);
}
button:active {
  background: -webkit-linear-gradient(-90deg, rgba(98,98,98,.38) 1px, rgba(98,98,98,.2) 50%, rgba(0,0,0,.5) 50%, rgba(0,0,0,.38) 100%);
}
So, this linear gradient has a minus 90 degrees orientation with a 1px top “border” and after that the gradient speaks for itself. The text shadow is the icing on the cake.

When you put all this together with some other basic styling (not worth mentioning here) we get this final result (works with Webkit and Gecko engines)

If you have any improvements, please let me know.