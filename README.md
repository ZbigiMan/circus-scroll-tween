# circus-scroll-tween
Easy to use jQuery plugin for scroll animation.

#### Init script and mouse wheel settings:

```html
<script src="js/circus-scroll-tween.min.js"></script>
```

```javascript
$('html').csInit({
  wheelDelay: 300, // milliseconds
  wheelDistance: 500, // pixels
  wheelEase: 'easeOutQuad' // ease type
});
```
#### Adding Tween:

```javascript

$('.anim1').csTween({
  begin: 0, // scroll position in pixels
  end: 500, // scroll position in pixels
  from: {
    letterSpacing: '0',  
    opacity: '1'
  },
    to: {
      letterSpacing: '2vw',
      opacity: '0'
  },
  easing: 'easeOutExpo', //  ease type
  onStart: function(el){
    //console.log('onStart');
  },
  onProgress: function(el,p){
    //console.log(p);
  },
  onComplete: function(el){
    //console.log('onComplete');
    $(el).hide();
  },
  onReverseStart: function(el){
    //console.log('onReverseStart');
    $(el).show();
  },
  onReverseComplete: function(el){
    //console.log('onReverseComplete');
  }
});

```
###### Note:
* For CSS transform animation like 'rotate' please use qTransform.js (https://github.com/puppybits/QTransform) or similar jQuery plugin.

#### csGoTo - Scrolls to defined position
```javascript
$().csGoTo({
  scrollPos: 500, // pixels
  duration: 500,
  easing: 'easeOutQuad'
});

$().csGoTo({
  scrollPos: 'end', // scrolls to end of document
  duration: 1000,
  easing: 'easeOutQuad'
});
```

#### csDestroy - Removes all scroll tweens and mousewheel events
```javascript
$().csDestroy();
```

#### Easing:
Circus Scroll Tween use jQuery Easing v1.3 plugin - http://gsgd.co.uk/sandbox/jquery/easing/ under BSD Licence
##### Easing types:
* linear
* swing
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInCirc
* easeOutCirc
* easeInOutCirc
* easeInElastic
* easeOutElastic
* easeInOutElastic
* easeInBack
* easeOutBack
* easeInOutBack
* easeInBounce
* easeOutBounce
* easeInOutBounce

#### Licence

Circus Scroll Tween:
* MIT

jQuery Easing v1.3
* BSD
