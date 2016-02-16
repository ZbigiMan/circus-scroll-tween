$(window).load(function(){

  $('html').csInit({
    wheelDelay: 300,
    wheelDistance: 100,
    wheelEase: 'easeOutQuad'
});

$('.anim1').csTween({
    begin: 0,
    end: $('.slide1').height(),
    from: {
      letterSpacing: '0',
      opacity: '1'
    },
      to: {
        letterSpacing: '2vw',
        opacity: '0'
    },
    easing: 'easeOutExpo',
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


 $('.anim4').csTween({
    begin: $('.slide1').height()/2,
    end: $('.slide1').height()/2 + ($('.slide1').height()/2)/3,
    from: {
      fontSize: '0vw',
      lineHeight: '0vw',
      opacity: '0'
  },
    to: {
      fontSize: '1.2vw',
      lineHeight: '2vw',
      opacity: '1'
  },
      easing: 'easeOutQuad'
  });


$('.anim3').csTween({
   begin: $('.slide1').height()/2,
   end: $('.slide1').height()/2 + (($('.slide1').height()/2)/3)*2,
   from: {
     fontSize: '0vw',
     lineHeight: '0vw',
     opacity: '0'
 },
   to: {
     fontSize: '1.2vw',
     lineHeight: '2vw',
     opacity: '1'
 },
     easing: 'easeOutQuad'
 });


$('.anim2').csTween({
   begin: $('.slide1').height()/2,
   end: $('.slide1').height()/2 + $('.slide1').height()/2,
   from: {
     fontSize: '0vw',
     lineHeight: '0vw',
     opacity: '0'
 },
   to: {
     fontSize: '2vw',
     lineHeight: '2.5vw',
     opacity: '1'
 },
     easing: 'easeOutQuad'
 });
});
