dojo.provide("plugd.feature._Modernizr");
dojo.require("plugd.feature");
/*!
 * Modernizr JavaScript library 1.5
 * http://www.modernizr.com/
 *
 * Copyright (c) 2009-2010 Faruk Ates - http://farukat.es/
 * Dual-licensed under the BSD and MIT licenses.
 * http://www.modernizr.com/license/
 *
 * Featuring major contributions by
 * Paul Irish  - http://paulirish.com
 */

/*
 * Modernizr is a script that will detect native CSS3 and HTML5 features
 * available in the current UA and provide an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 * 
 * In addition to that, Modernizr will add classes to the <html>
 * element of the page, one for each cutting-edge feature. If the UA
 * supports it, a class like "cssgradients" will be added. If not,
 * the class name will be "no-cssgradients". This allows for simple
 * if-conditionals in CSS styling, making it easily to have fine
 * control over the look and feel of your website.
 * 
 * @author        Faruk Ates
 * @copyright     (c) 2009-2010 Faruk Ates.
 *
 * @contributor   Paul Irish
 * @contributor   Ben Alman
 */

dojo.feature._Modernizr = (function(window, doc, undefined){

    var version = '1.5',

    ret = {},

    addtest = dojo.feature.test,

    /**
     * enableHTML5 is a private property for advanced use only. If enabled,
     * it will make Modernizr.init() run through a brief while() loop in
     * which it will create all HTML5 elements in the DOM to allow for
     * styling them in Internet Explorer, which does not recognize any
     * non-HTML4 elements unless created in the DOM this way.
     * 
     * enableHTML5 is ON by default.
     */
    enableHTML5 = true,

    /**
     * fontfaceCheckDelay is the ms delay before the @font-face test is
     * checked a second time. This is neccessary because both Gecko and
     * WebKit do not load data: URI font data synchronously.
     *   https://bugzilla.mozilla.org/show_bug.cgi?id=512566
     * The check will be done again at fontfaceCheckDelay*2 and then 
     * a fourth time at window's load event. 
     * If you need to query for @font-face support, send a callback to: 
     *  Modernizr._fontfaceready(fn);
     * The callback is passed the boolean value of Modernizr.fontface
     */
    fontfaceCheckDelay = 75,

    docElement = doc.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    m = doc.createElement( mod ),
    m_style = m.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    f = doc.createElement( 'input' ),

    // Reused strings, stored here to allow better minification

    canvas = 'canvas',
    canvastext = 'canvastext',
    rgba = 'rgba',
    hsla = 'hsla',
    multiplebgs = 'multiplebgs',
    backgroundsize = 'backgroundsize',
    borderimage = 'borderimage',
    borderradius = 'borderradius',
    boxshadow = 'boxshadow',
    opacity = 'opacity',
    cssanimations = 'cssanimations',
    csscolumns = 'csscolumns',
    cssgradients = 'cssgradients',
    cssreflections = 'cssreflections',
    csstransforms = 'csstransforms',
    csstransforms3d = 'csstransforms3d',
    csstransitions = 'csstransitions',
    fontface = 'fontface',
    geolocation = 'geolocation',
    video = 'video',
    audio = 'audio',
    input = 'input',
    inputtypes = input + 'types',
    // inputtypes is an object of its own containing individual tests for
    // various new input types, such as search, range, datetime, etc.

    svg = 'svg',
    smil = 'smil',
    svgclippaths = svg+'clippaths',

    background = 'background',
    backgroundColor = background + 'Color',
    canPlayType = 'canPlayType',

    // FF gets really angry if you name local variables as these, but camelCased.
    localstorage = 'localStorage',
    sessionstorage = 'sessionStorage',
    applicationcache = 'applicationCache',

    webWorkers = 'webworkers',
    hashchange = 'hashchange',
    crosswindowmessaging = 'crosswindowmessaging',
    historymanagement = 'historymanagement',
    draganddrop = 'draganddrop',
    websqldatabase = 'websqldatabase',
    indexedDB = 'indexedDB',
    websockets = 'websockets',
    smile = ':)',

    // IE7 gets mad if you name a local variable `toString`
    tostring = Object.prototype.toString,

    // list of property values to set for css tests. see ticket #21
    prefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    /**
      * isEventSupported determines if a given element supports the given event
      * function from http://yura.thinkweb2.com/isEventSupported/
      */
    isEventSupported = dojo.feature.event = (function(){

        var TAGNAMES = {
          'select':'input','change':'input',
          'submit':'form','reset':'form',
          'error':'img','load':'img','abort':'img'
        }, 
        cache = { };

        function isEventSupported(eventName, element) {
            var canCache = (arguments.length == 1);

            // only return cached result when no element is given
            if (canCache && cache[eventName]) {
                return cache[eventName];
            }

            element = element || document.createElement(TAGNAMES[eventName] || 'div');
            eventName = 'on' + eventName;

            // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize"
            // `in` "catches" those
            var isSupported = (eventName in element);

            if (!isSupported && element.setAttribute) {
                element.setAttribute(eventName, 'return;');
                isSupported = typeof element[eventName] == 'function';
            }

            element = null;
            return canCache ? (cache[eventName] = isSupported) : isSupported;
        }

        return isEventSupported;
    })();    

    var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
    if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
      };
    }

    /**
     * set_css applies given styles to the Modernizr DOM node.
     */
    function set_css( str ) {
        m_style.cssText = str;
    }

    /**
     * set_css_all extrapolates all vendor-specific css strings.
     */
    function set_css_all( str1, str2 ) {
        return set_css(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return (''+str).indexOf( substr ) !== -1;
    }

    /**
     * test_props is a generic CSS / DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *   A supported CSS property returns empty string when its not yet set.
     */
    function test_props( props, callback ) {
        for ( var i in props ) {
            if ( m_style[ props[i] ] !== undefined && ( !callback || callback( props[i], m ) ) ) {
                return true;
            }
        }
    }

    /**
     * test_props_all tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on 
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function test_props_all( prop, callback ) {
        var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),

        // following spec is to expose vendor-specific style properties as:
        //   elem.style.WebkitBorderRadius
        // and the following would be incorrect:
        //   elem.style.webkitBorderRadius

        // Webkit ghosts their properties in lowercase but Opera & Moz do not.
        // Microsoft foregoes prefixes entirely <= IE8, but appears to 
        //   use a lowercase `ms` instead of the correct `Ms` in IE9

        // see more here: http://github.com/Modernizr/Modernizr/issues/issue/21
        props = [
            prop,
            'Webkit' + uc_prop,
            'Moz' + uc_prop,
            'O' + uc_prop,
            'ms' + uc_prop,
            'Khtml' + uc_prop
        ];

        return !!test_props( props, callback );
    }


    /**
     * Tests
     */

    addtest(canvas, function() {
        return !!doc.createElement( canvas ).getContext;
    })

    addtest(canvastext, function() {
        return !!(dojo.feature(canvas) && typeof doc.createElement( canvas ).getContext('2d').fillText == 'function');
    });

    /**
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     * Additionally, chrome used to lie about its support on this, but that 
     *    has since been recitifed: http://crbug.com/36415
     * Because there is no way to reliably detect Chrome's false positive 
     *    without UA sniffing we have removed this test from Modernizr. We 
     *    hope to add it in after Chrome 5 has been sunsetted. 
     * See also http://github.com/Modernizr/Modernizr/issues#issue/84

    tests[touch] = function() {

        return !!('ontouchstart' in window);

    };
    */

    /**
     * geolocation tests for the new Geolocation API specification.
     *   This test is a standards compliant-only test; for more complete
     *   testing, including a Google Gears fallback, please see:
     *   http://code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   http://gist.github.com/366184
     */

    addtest(geolocation, function() {
        return !!navigator.geolocation;
    });

    addtest(crosswindowmessaging, function() {
        return !!window.postMessage;
    });

    // in chrome incognito mode, openDatabase is truthy, but using it
    //   will throw an exception: http://crbug.com/42380
    // we create a dummy database. there is no way to delete it afterwards. sorry. 
    addtest(websqldatabase, function() {
      var result = !!window.openDatabase;
      if (result){
        try {
          result = !!openDatabase( mod + "testdb", "1.0", mod + "testdb", 2e4);
        } catch(e) {
          result = false;
        }
      }
      return result;
    });

    addtest(indexedDB, function(){
        return !!window[indexedDB];
    });

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    addtest(hashchange, function() {
        return isEventSupported(hashchange, window) && ( document.documentMode === undefined || document.documentMode > 7 );
    });

    addtest(historymanagement, function() {
        return !!(window.history && history.pushState);
    });

    addtest(draganddrop, function() {
        return isEventSupported('drag')
            && isEventSupported('dragstart')
            && isEventSupported('dragenter')
            && isEventSupported('dragover')
            && isEventSupported('dragleave')
            && isEventSupported('dragend')
            && isEventSupported('drop');
    });

    addtest(websockets, function(){
        return ('WebSocket' in window);
    });

    // http://css-tricks.com/rgba-browser-support/
    addtest(rgba, function() {
        // Set an rgba() color and check the returned value

        set_css( background + '-color:rgba(150,255,150,.5)' );

        return contains( m_style[backgroundColor], rgba );
    });

    addtest(hsla, function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally..
        //   except IE9 who retains it as hsla

        set_css( background + '-color:hsla(120,40%,100%,.5)' );

        return contains( m_style[backgroundColor], rgba ) || contains( m_style[backgroundColor], hsla );
    });

    addtest(multiplebgs, function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        set_css( background + ':url(//:),url(//:),red url(//:)' );

        // If the UA supports multiple backgrounds, there should be three occurrences
        //  of the string "url(" in the return value for elem_style.background

        return new RegExp("(url\\s*\\(.*?){3}").test(m_style[background]);
    });

    // In testing support for a given CSS property, it's legit to test:
    //    elem.style[styleName] !== undefined
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.
    // We'll take advantage of this quick test and skip setting a style 
    // on our modernizr element, but instead just testing undefined vs
    // empty string.
    // The legacy set_css_all calls will remain in the source 
    // (however, commented) in for clarity, yet functionally they are 
    // no longer needed.

    addtest(backgroundsize, function() {
        return test_props_all( background + 'Size' );
    });

    addtest(borderimage, function() {
        //  set_css_all( 'border-image:url(m.png) 1 1 stretch' );
        return test_props_all( 'borderImage' );
    });


    // super comprehensive table about all the unique implementations of 
    // border-radius: http://muddledramblings.com/table-of-css3-border-radius-compliance

    addtest(borderradius, function() {
        //  set_css_all( 'border-radius:10px' );
        return test_props_all( 'borderRadius', '', function( prop ) {
            return contains( prop, 'orderRadius' );
        });
    });

    addtest(boxshadow, function() {
        //  set_css_all( 'box-shadow:#000 1px 1px 3px' );
        return test_props_all( 'boxShadow' );
    });

    addtest(opacity, function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        set_css_all( 'opacity:.5' );

        return contains( m_style[opacity], '0.5' );
    });

    addtest(cssanimations, function() {
        //  set_css_all( 'animation:"animate" 2s ease 2', 'position:relative' );
        return test_props_all( 'animationName' );
    });

    addtest(csscolumns, function() {
        //  set_css_all( 'column-count:3' );
        return test_props_all( 'columnCount' );
    });

    addtest(cssgradients, function() {
        /**
         * For CSS Gradients syntax, please see:
         * http://webkit.org/blog/175/introducing-css-gradients/
         * https://developer.mozilla.org/en/CSS/-moz-linear-gradient
         * https://developer.mozilla.org/en/CSS/-moz-radial-gradient
         * http://dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = background + '-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        set_css(
            (str1 + prefixes.join(str2 + str1) + prefixes.join(str3 + str1)).slice(0,-str1.length)
        );

        return contains( m_style.backgroundImage, 'gradient' );
    });

    addtest(cssreflections, function() {
        //  set_css_all( 'box-reflect:right 1px' );
        return test_props_all( 'boxReflect' );
    });

    addtest(csstransforms, function() {
        //  set_css_all( 'transform:rotate(3deg)' );
        return !!test_props([ 'transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ]);
    });

    addtest(csstransforms3d, function() {
        //  set_css_all( 'perspective:500' );

        var ret = !!test_props([ 'perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective' ]);

        // webkit has 3d transforms disabled for chrome, though
        //   it works fine in safari on leopard and snow leopard
        // as a result, it 'recognizes' the syntax and throws a false positive
        // thus we must do a more thorough check:
        if (ret){
            var st = document.createElement('style'),
                div = doc.createElement('div');

            // webkit allows this media query to succeed only if the feature is enabled.    
            // "@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){#modernizr{height:3px}}"
            st.textContent = '@media ('+prefixes.join('transform-3d),(')+'modernizr){#modernizr{height:3px}}';
            doc.getElementsByTagName('head')[0].appendChild(st);
            div.id = 'modernizr';
            docElement.appendChild(div);

            ret = div.offsetHeight === 3;

            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);
        }
        return ret;
    });

    addtest(csstransitions, function() {
        //  set_css_all( 'transition:all .5s linear' );
        return test_props_all( 'transitionProperty' );
    });

    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // we're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // codec values from : http://github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    addtest(video, function() {
        var elem = doc.createElement(video),
            bool = !!elem[canPlayType];

        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem[canPlayType]('video/ogg; codecs="theora"');
            bool.h264 = elem[canPlayType]('video/mp4; codecs="avc1.42E01E"');
            bool.webm = elem[canPlayType]('video/webm; codecs="vp8, vorbis"');
        }
        return bool;
    });

    addtest(audio, function() {
        var elem = doc.createElement(audio),
            bool = !!elem[canPlayType];

        if (bool){  
            bool      = new Boolean(bool);  
            bool.ogg  = elem[canPlayType]('audio/ogg; codecs="vorbis"');
            bool.mp3  = elem[canPlayType]('audio/mpeg;');

            // mimetypes accepted: 
            //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   http://bit.ly/iphoneoscodecs
            bool.wav  = elem[canPlayType]('audio/wav; codecs="1"');
            bool.m4a  = elem[canPlayType]('audio/x-m4a;') || elem[canPlayType]('audio/aac;');
        }
        return bool;
    });

    // both localStorage and sessionStorage are
    // tested via the `in` operator because otherwise Firefox will
    //   throw an error: https://bugzilla.mozilla.org/show_bug.cgi?id=365772
    // if cookies are disabled

    // they require try/catch because of possible firefox configuration:
    //   http://github.com/Modernizr/Modernizr/issues#issue/92

    // FWIW miller device resolves to [object Storage] in all supporting browsers
    //   except for IE who does [object Object]

    // IE8 Compat mode supports these features completely:
    //   http://www.quirksmode.org/dom/html5.html

    addtest(localstorage, function() {
        try {
            return ('localStorage' in window) && window[localstorage] !== null;
        } catch(e) {
            return false;
        }
    });

    addtest(sessionstorage, function() {
        try {
            return ('sessionStorage' in window) && window[sessionstorage] !== null;
        } catch(e){
            return false;
        }
    });

    addtest(webWorkers, function () {
        return !!window.Worker;
    });

    addtest(applicationcache,  function() {
        var cache = window[applicationcache];
        return !!(cache && (typeof cache.status != 'undefined') && (typeof cache.update == 'function') && (typeof cache.swapCache == 'function'));
    });

    // thanks to Erik Dahlstrom
    addtest(svg, function(){
        return !!doc.createElementNS && !!doc.createElementNS( "http://www.w3.org/2000/svg", "svg").createSVGRect;
    });

    // thanks to F1lt3r and lucideer
    // http://github.com/Modernizr/Modernizr/issues#issue/35
    addtest(smil, function(){
        return !!doc.createElementNS && /SVG/.test(tostring.call(doc.createElementNS('http://www.w3.org/2000/svg','animate')));
    });

    addtest(svgclippaths, function(){
        // returns a false positive in saf 3.2?
        return !!doc.createElementNS && /SVG/.test(tostring.call(doc.createElementNS('http://www.w3.org/2000/svg','clipPath')));
    });

    /**
     * Reset m.style.cssText to nothing to reduce memory footprint.
     */
//    set_css( '' );
//    m = f = null; // we need these because the tests may not nor never have run
// should be be worried?

    // Assign private properties to the return object with prefix
    ret._enableHTML5     = enableHTML5;
    ret._version         = version;

    return ret;

})(dojo.global, dojo.doc);