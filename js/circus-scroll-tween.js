(function($) {

    "use strict";

    jQuery.browser = {};
    jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());

    circusScroll = {};
    circusScroll.timeline = {};

    circusScroll.parseValues = function(aValue){
    if(aValue.indexOf(".")>0){
      return parseFloat(aValue);
      }else{
      return parseInt(aValue);
      }
    };

    $.fn.csInit = function(options) { // Circus Scroll Init

        var container = $(this);

        var settings = $.extend({
            container: container,
            wheelDelay: 500,
            wheelDistance: 200
        }, options);


        if (jQuery.browser.webkit) {
            if (container.selector == 'html') {
                container = $('body');
                settings.container = container;
            }
        }

        circusScroll.sets = settings;

        var mac = false;
        if (navigator.appVersion.indexOf("Mac") != -1) mac = true;

        var Selector = window;

        if (mac === false) {
            if (Selector.addEventListener) {
                Selector.addEventListener("mousewheel", circusScroll.wheel, false);
                Selector.addEventListener("DOMMouseScroll", circusScroll.wheel, false);
            } else {
                Selector.attachEvent("onmousewheel", circusScroll.wheel);
            }
        }

        $(window).scroll(function() {
            circusScroll.onScroll();
        });
    };

    $.fn.csTween = function(options) { //Circus Scroll Tween

        options.completed = 0;
        options.started = 0;
        options.revCompleted = 0;
        options.revStarted = 0;
        options.inlineStyle = $(this).attr('style');

        circusScroll.timeline[$(this).selector] = options;
    };

    $.fn.csGoTo = function(options) {

        if (options.scrollPos == 'end') {
            options.scrollPos = $(document).height();
        }

        if (options.scrollPos == 'top') {
            options.scrollPos = 0;
        }

        $(circusScroll.sets.container).stop().animate({
            scrollTop: options.scrollPos
        }, {
            duration: options.duration,
            easing: options.easing
        });
    };

    $.fn.csDestroy = function() {
        $.each(circusScroll.timeline, function(key, value) {
            $(key).removeAttr('style');
            $(key).attr('style', value.inlineStyle);
        });
        circusScroll.timeline = [];
        var Selector = window;
        if (Selector.addEventListener) {
            Selector.removeEventListener("mousewheel", circusScroll.wheel);
            Selector.removeEventListener("DOMMouseScroll", circusScroll.wheel);
        } else {
            Selector.detachEvent("onmousewheel", circusScroll.wheel);
        }
    };

    $.fn.csGetScrollTop = function() {
        return $(circusScroll.sets.container).scrollTop();
    };

    circusScroll.wheel = function(event) {
        var delta = 0;
        if (event.wheelDelta) delta = event.wheelDelta / 120;
        else if (event.detail) delta = -event.detail / 3;

        circusScroll.handle(delta);
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
    };

    circusScroll.handle = function(delta) {
        var time = circusScroll.sets.wheelDelay,
            distance = circusScroll.sets.wheelDistance,
            easing = circusScroll.sets.wheelEase;



        $(circusScroll.sets.container).stop().animate({
            scrollTop: $(circusScroll.sets.container).scrollTop() - (distance * delta)
        }, {
            duration: time,
            easing: easing
        });
    };

    circusScroll.onScroll = function() {

        $.each(circusScroll.timeline, function(el, sets) {

            var scrollTop = $(circusScroll.sets.container).scrollTop(),
                p = (scrollTop - sets.begin) / (sets.end - sets.begin); //progress


            if (p < 1) {
                if (sets.completed > 0) {
                    sets.revStarted++;
                }
                sets.completed = 0;
            }

            if (p >= 1) {
                sets.completed++;
                sets.revStarted = 0;
            }

            if (p <= 0) {
                if (sets.started > 0) {
                    sets.revCompleted++;
                }
                sets.started = 0;
            }

            if (p > 0) {
                sets.started++;
                sets.revCompleted = 0;
            }

            $.each(sets.to, function(prop, value) {

                if(sets.from===undefined){
                    sets.from = {};
                }

                if(sets.from[prop]===undefined){
                    sets.from[prop] = $(el).css(prop);
                }

                var e = circusScroll.parseValues(value), //End
                    b = circusScroll.parseValues(sets.from[prop]), //Begin;
                    c = e - b, //Change
                    d = sets.end-sets.begin, //Duration
                    t = p*d; //Time

                if (sets.completed == 1) {
                    t = d;
                }

                if (sets.revCompleted == 1) {
                    t = 0;
                }

                if (e != value) {
                    unit = value.split(e).join('');
                } else {
                    unit = false;
                }

                if (t >= 0 && t <= d) {

                    newIntVal = $.easing[sets.easing](null,t, b, c, d);

                    if(unit!==false){
                        newVal = newIntVal + unit;
                    } else {
                        newVal = newIntVal;
                    }

                    //support backgroundPositionY and backgroundPositionX//
                    var px, py;
                    if (prop == "backgroundPositionY") {
                        py = newVal;
                        px = $(el).css('background-position').split(" ")[0];
                        newVal = px + " " + py;
                    }

                    if (prop == "backgroundPositionX") {
                        py = $(el).css('background-position').split(" ")[1];
                        px = newVal;
                    }

                    if (prop == "backgroundPositionX" || prop == "backgroundPositionY") {
                        newVal = px + " " + py;
                        prop = 'background-position';
                    }
                    //End of support backgroundPositionY and backgroundPositionX//

                    $(el).css(prop, newVal);
                }
            });

            //Callbacks

            //onStart

            if(sets.started==1){
                if(sets.onStart!==undefined){
                    sets.onStart(el);
                }
            }

            //onComplete

            if(sets.completed==1){
                if(sets.onComplete!==undefined){
                    sets.onComplete(el);
                }
            }

            //onReverseStart

            if (sets.revStarted == 1) {

                if(sets.onReverseStart!==undefined){
                    sets.onReverseStart(el);
                }
                sets.revStarted++;
            }

            //onReverseComplet

            if(sets.revCompleted==1){
                if(sets.onReverseComplete!==undefined){
                    sets.onReverseComplete(el);
                }
                sets.revCompleted++;
            }


            //onProgress

            if(p>=0 && p<=1){
                if(sets.onProgress!==undefined){
                    sets.onProgress(el,p);
                }
            }
        });
    };

    /*
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Uses the built in easing capabilities added In jQuery 1.1
     * to offer multiple easing options
     *
     * TERMS OF USE - jQuery Easing
     *
     * Open source under the BSD License.
     *
     * Copyright 2008 George McGinley Smith
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

    // t: current time, b: begInnIng value, c: change In value, d: duration
    $.easing.jswing = $.easing.swing;

    $.extend($.easing, {
        def: 'easeOutQuad',
        linear: function(x, t, b, c, d) {
            return c * t / d + b;
        },
        swing: function(x, t, b, c, d) {
            //alert($.easing.default);
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function(x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t===0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; s=p/4; }
            else s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
            if (a < Math.abs(c)) { a=c; s=p/4; }
            else s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t===0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
            if (a < Math.abs(c)) { a=c; s=p/4; }
            else s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function(x, t, b, c, d) {
            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * 0.5 + b;
            return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * 0.5 + c* 0.5 + b;
        }
    });

    /*
     *
     * TERMS OF USE - EASING EQUATIONS
     *
     * Open source under the BSD License.
     *
     * Copyright 2001 Robert Penner
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

}(jQuery));
