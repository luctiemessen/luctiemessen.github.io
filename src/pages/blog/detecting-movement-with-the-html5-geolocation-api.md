---
layout: "../../layouts/BlogPostLayout.astro"
title: Detecting movement with the HTML5 Geolocation API
date: 2011-09-21 10:50:21
description: no description present
tags: tags css
draft: false
---
<div class="span2-4">

<div class="lead">
Determining the location of the visitor of your site has become much easier with the HTML5 API. With a only a few lines of JavaScript we now can indicate the location of the user and we can even check whether the user is moving. This opens interesting ways for us designers and developers to deliver the right content to our users.
</div>

## API?
The [Geolocation API](http://www.w3.org/TR/geolocation-API/ "Geolocation API Specification") lets you share your location with trusted websites. The <code>getCurrentPosition()</code> method requests these coordinates from the browser. How browsers implement this location service is browser specific. Therefore, the accuracy of the request can differ between browsers.


```js
// does the browser support Geolocation?
if (navigator.geolocation) {
  // do geolocation stuff...
  navigator.geolocation.getCurrentPosition(showMap, showError);
}
```

This gets our current position (via the Position Interface) and passes it through the <code>showMap</code> function. This Position Interface contains the Coordinates Interface with all the information you need to determine the location of the user (latitude, longitude, altitude, accuracy, speed etc). The user is prompted to share the location with the website. The <code>getCurrentPosition()</code> method accepts an optional third argument called the PositionOptions object which we will discuss later.

If the location could not be determined, the <code>showError</code> function is called with the error message as argument. With this we can provide useful feedback to the user.


```js
function showError(error) {
  if(error.code==0) {
    alert('An unknown error occurred.');
  } else if(error.code==1) {
    alert('No permission to locate your position.');
  } else if(error.code==2) {
    alert('The location could not be retrieved.');
  } else {
    alert('There was a timeout.');
  }
}
```

## Changing content based on the users’ context

Now that we have all the checks and fallbacks into place, we can start drawing a map within the <code>showMap</code> function. I used the Google Maps API to put together this demo. Very nice but another (more interesting) thing we can do is to determine whether the user is moving. Many people talked already about designing for mobile, small screen websites, touch interfaces, responsive design etc. In my opinion, the content of the website should not (only) be determined by which device is accessing this content, but also the action the user is performing. When a user is trying to catch a train and is visiting the website of the railway operator, this website should not display big buttons only because the user is accessing the website via a smart phone. One could argue the user only wants to know how many minutes are left before the next train is leaving. It does not matter if the user is carrying a smart phone or if the user is checking this website with their laptop in another train hoping he can make the transfer. Screen size, resolution and devices etc. do not matter for this particular situation. If we could determine if the user is moving a few meters between two moments in time we can assume the user is trying to catch a train and the website should display a prominent link to a section of the website that displays trains that depart from the most nearby train station instead of loading the entire home page with their visually appealing “nonsense”.

Luckily the Geolocation API offers us a method to observe the location of the user and call a function every time the location changes. This is the <code>watchPosition()</code> method and like the <code>getCurrentPosition()</code> method, this method accepts three arguments. The first is the success callback, second the error callback and third the previously mentioned PositionOptions object.


```js
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(checkLocationChanges, showError, {enableHighAccuracy:true, maximumAge:5000, timeout:27000});
}
```
The <code>PositionOptions</code> object has three properties. The <code>enableHighAccuracy</code> when set to true your device tries to acquire the exact location. When the property is set to false the information can be accessed quicker but the results can be less accurate (how surprising). The <code>maximumAge</code> is the age (in milliseconds) of the last position request. If you want to compare locations and you don’t want a location older than 5 seconds you pass 5000 into that property. The <code>timeout</code> property takes the time (again in milliseconds) the browser can take to acquire a position until the script throws a timeout error.

If we set these properties we are ready to determine if the user is moving based on the speed of the user. Hey, if the speed is 0 or null the user is not moving so if the value is other than that, we have movement!
What you do after you detected movement is up to you. I decided to add a classname to the body tag. With CSS I can now display a link to a specific part of a website that users can access quickly when they are moving and this link will be invisible by default (for the users behind a desktop computer).


```js
function checkLocationChanges(position) {
  if(position.coords.speed!=0 && position.coords.speed != null) {
    // whee we are moving!!!
    // change classname on body. Yes, jQuery...
    $('body').addClass('movement');
  } else {
    // let the page load normally
  }
}
```

When choosing this solution to display your content you might also want to make sure the change of content is noticed by the user. If the link is visible but not within the viewport, you might want to scroll to the location of the link or perform some other noticable action.

The CSS for the link within the document that should only be visible when movement is detected.


```css
a.movementLink {
  display: none;
  background: #333;
  color: #fff;
  font-size: 3em;
}

body.movement a.movementLink {
  display: block;
}
```

I put together a simple demo for this. (hint: open it on your GPS enabled mobile device while traveling)

## Conclusion

With this easy technique we can make interesting context-aware alterations to our content to facilitate the needs of our users. Obviously, this example is relatively straight forward an one could argue about the solution I suggested (changing a body class and display information based on that class via CSS) but the possibility of having more information about the activity the user is performing is opening new doors to provide the right content to our users.

</div>