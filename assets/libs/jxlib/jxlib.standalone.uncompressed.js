/******************************************************************************
 * MooTools 1.2.2
 * Copyright (c) 2006-2007 [Valerio Proietti](http://mad4milk.net/).
 * MooTools is distributed under an MIT-style license.
 ******************************************************************************
 * reset.css - Copyright (c) 2006, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License: http://developer.yahoo.net/yui/license.txt
 ******************************************************************************
 * Jx UI Library, 3.0
 * Copyright (c) 2006-2008, DM Solutions Group Inc. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *****************************************************************************/
/*
---

name: Common

description: Jx namespace with methods and classes common to most Jx widgets

license: MIT-style license.

requires:
 - Core/Class
 - Core/Element
 - Core/Browser
 - Core/Element.Style
 - Core/Request
 - Core/Class.Extras
 - More/Class.Binds
 - Core/Array
 - Core/Element.Event
 - Core/Element.Dimensions
 - More/Element.Measure
 - More/Lang
 - Core/Selectors
 - Core/Slick.Finder
 - Core/Slick.Parser

provides: [Jx]

css:
 - license
 - reset
 - common

images:
 - a_pixel.png

...
 */
// $Id$
/**
 * Function: $jx
 * dereferences a DOM Element to a JxLib object if possible and returns
 * a reference to the object, or null if not defined.
 */
function $jx(id) {
  var widget = null;
  id = document.id(id);
  if (id) {
    widget = id.retrieve('jxWidget');
    if (!widget && id != document.body) {
      widget = $jx(id.getParent());
    }
  }
  return widget;
}

/**
 * Class: Jx
 * Jx is a global singleton object that contains the entire Jx library
 * within it.  All Jx functions, attributes and classes are accessed
 * through the global Jx object.  Jx should not create any other
 * global variables, if you discover that it does then please report
 * it as a bug
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

/* firebug console supressor for IE/Safari/Opera */
window.addEvent('load',
function() {
    if (! ("console" in window)) {
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"],
            i;

        window.console = {};
        for (i = 0; i < names.length; ++i) {
            window.console[names[i]] = function() {};
        }
    }
});


// add mutator that sets jxFamily when creating a class so we can check
// its type
Class.Mutators.Family = function(self, name) {
    if ($defined(name)) {
        self.jxFamily = name;
        return self;
    }
    else if(!$defined(this.prototype.jxFamily)) {
        this.implement({
            'jxFamily': self
        });
    }
};

// this replaces the mootools $unlink method with our own version that
// avoids infinite recursion on Jx objects.
function $unlink(object) {
    if (object && object.jxFamily) {
        return object;
    }
    var unlinked, p, i, l;
    switch ($type(object)) {
    case 'object':
        unlinked = {};
        for (p in object) unlinked[p] = $unlink(object[p]);
        break;
    case 'hash':
        unlinked = new Hash(object);
        break;
    case 'array':
        unlinked = [];
        for (i = 0, l = object.length; i < l; i++) unlinked[i] = $unlink(object[i]);
        break;
    default:
        return object;
    }
    return unlinked;
}

/**
 * Override of mootools-core 1.3's typeOf operator to prevent infinite recursion
 * when doing typeOf on JxLib objects.
 *
var typeOf = this.typeOf = function(item){
    if (item == null) return 'null';
    if (item.jxFamily) return item.jxFamily;
    if (item.$family) return item.$family();

    if (item.nodeName){
        if (item.nodeType == 1) return 'element';
        if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
    } else if (typeof item.length == 'number'){
        if (item.callee) return 'arguments';
        if ('item' in item) return 'collection';
    }

    return typeof item;
};

this.$type = function(object){
    var type = typeOf(object);
    if (type == 'elements') return 'array';
    return (type == 'null') ? false : type;
};
*/

/* Setup global namespace.  It is possible to set the global namespace
 * prior to including jxlib.  This would typically be required only if
 * the auto-detection of the jxlib base URL would fail.  For instance,
 * if you combine jxlib with other javascript libraries into a single file
 * build and call it something without jxlib in the file name, then the
 * detection of baseURL would fail.  If this happens to you, try adding
 * Jx = { baseURL: '/path/to/jxlib/'; }
 * where the path to jxlib contains a file called a_pixel.png (it doesn't
 * have to include jxlib, just the a_pixel.png file).
 */
if (typeof Jx === 'undefined') {
  var Jx = {};
}

/**
 * APIProperty: {String} baseURL
 * This is the URL that Jx was loaded from, it is
 * automatically calculated from the script tag
 * src property that included Jx.
 *
 * Note that this assumes that you are loading Jx
 * from a js/ or lib/ folder in parallel to the
 * images/ folder that contains the various images
 * needed by Jx components.  If you have a different
 * folder structure, you can define Jx's base
 * by including the following before including
 * the jxlib javascript file:
 *
 * (code)
 * Jx = {
 *    baseURL: 'some/path'
 * }
 * (end)
 */
if (!$defined(Jx.baseURL)) {
  (function() {
    var aScripts = document.getElementsByTagName('SCRIPT'),
        i, s, n, file;
    for (i = 0; i < aScripts.length; i++) {
      s = aScripts[i].src;
      n = s.lastIndexOf('/');
      file = s.slice(n+1,s.length-1);
      if (file.contains('jxlib')) {
        Jx.baseURL = s.slice(0,n);
        break;
      }
    }
  })();
}
/**
 * APIProperty: {Image} aPixel
 * aPixel is a single transparent pixel and is the only image we actually
 * use directly in JxLib code.  If you want to use your own transparent pixel
 * image or use it from a different location than the install of jxlib
 * javascript files, you can manually declare it before including jxlib code
 * (code)
 * Jx = {
 *   aPixel: new Element('img', {
 *     alt: '',
 *     title: '',
 *     width: 1,
 *     height: 1,
 *     src: 'path/to/a/transparent.png'
 *   });
 * }
 * (end)
 */
if (!$defined(Jx.aPixel)) {
  Jx.aPixel = new Element('img', {
    alt:'',
    title:'',
    src: Jx.baseURL +'/a_pixel.png'
  });
}

/**
 * APIProperty: {Boolean} isAir
 * indicates if JxLib is running in an Adobe Air environment.  This is
 * normally auto-detected but you can manually set it by declaring the Jx
 * namespace before including jxlib:
 * (code)
 * Jx = {
 *   isAir: true
 * }
 * (end)
 */
if (!$defined(Jx.isAir)) {
  (function() {
    /**
     * Determine if we're running in Adobe AIR.
     */
    var aScripts = document.getElementsByTagName('SCRIPT'),
        src = aScripts[0].src;
    if (src.contains('app:')) {
      Jx.isAir = true;
    } else {
      Jx.isAir = false;
    }
  })();
}

/**
 * APIMethod: setLanguage
 * set the current language to be used by Jx widgets.  This uses the MooTools
 * lang module.  If an invalid or missing language is requested, the default
 * rules of MooTools.lang will be used (revert to en-US at time of writing).
 *
 * Parameters:
 * {String} language identifier, the language to set.
 */
Jx.setLanguage = function(lang) {
  Jx.lang = lang;
  MooTools.lang.setLanguage(Jx.lang);
};

/**
 * APIProperty: {String} lang
 * Checks to see if Jx.lang is already set. If not, it sets it to the default
 * 'en-US'. We will then set the Motools.lang language to this setting
 * automatically.
 *
 * The language can be changed on the fly at anytime by calling
 * Jx.setLanguage().
 * By default all Jx.Widget subclasses will listen for the langChange event of
 * the Mootools.lang class. It will then call a method, changeText(), if it
 * exists on the particular widget. You will be able to disable listening for
 * these changes by setting the Jx.Widget option useLang to false.
 */
if (!$defined(Jx.lang)) {
  Jx.lang = 'en-US';
}

Jx.setLanguage(Jx.lang);

/**
 * APIMethod: applyPNGFilter
 *
 * Static method that applies the PNG Filter Hack for IE browsers
 * when showing 24bit PNG's.  Used automatically for img tags with
 * a class of png24.
 *
 * The filter is applied using a nifty feature of IE that allows javascript to
 * be executed as part of a CSS style rule - this ensures that the hack only
 * gets applied on IE browsers.
 *
 * The CSS that triggers this hack is only in the ie6.css files of the various
 * themes.
 *
 * Parameters:
 * object {Object} the object (img) to which the filter needs to be applied.
 */
Jx.applyPNGFilter = function(o) {
    var t = Jx.aPixel.src, 
        s;
    if (o.src != t) {
        s = o.src;
        o.src = t;
        o.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + s + "',sizingMethod='scale')";
    }
};

/**
 * NOTE: We should consider moving the image loading code into a separate
 * class. Perhaps as Jx.Preloader which could extend Jx.Object
 */
Jx.imgQueue = [];
//The queue of images to be loaded
Jx.imgLoaded = {};
//a hash table of images that have been loaded and cached
Jx.imagesLoading = 0;
//counter for number of concurrent image loads
/**
 * APIMethod: addToImgQueue
 * Request that an image be set to a DOM IMG element src attribute.  This puts
 * the image into a queue and there are private methods to manage that queue
 * and limit image loading to 2 at a time.
 *
 * Parameters:
 * obj - {Object} an object containing an element and src
 * property, where element is the element to update and src
 * is the url to the image.
 */
Jx.addToImgQueue = function(obj) {
    if (Jx.imgLoaded[obj.src]) {
        //if this image was already requested (i.e. it's in cache) just set it directly
        obj.element.src = obj.src;
    } else {
        //otherwise stick it in the queue
        Jx.imgQueue.push(obj);
        Jx.imgLoaded[obj.src] = true;
    }
    //start the queue management process
    Jx.checkImgQueue();
};

/**
 * APIMethod: checkImgQueue
 *
 * An internal method that ensures no more than 2 images are loading at a
 * time.
 */
Jx.checkImgQueue = function() {
    while (Jx.imagesLoading < 2 && Jx.imgQueue.length > 0) {
        Jx.loadNextImg();
    }
};

/**
 * Method: loadNextImg
 *
 * An internal method actually populate the DOM element with the image source.
 */
Jx.loadNextImg = function() {
    var obj = Jx.imgQueue.shift();
    if (obj) {
        ++Jx.imagesLoading;
        obj.element.onload = function() {--Jx.imagesLoading;
            Jx.checkImgQueue();
        };
        obj.element.onerror = function() {--Jx.imagesLoading;
            Jx.checkImgQueue();
        };
        obj.element.src = obj.src;
    }
};

/**
 * APIMethod: getNumber
 * safely parse a number and return its integer value.  A NaN value
 * returns 0.  CSS size values are also parsed correctly.
 *
 * Parameters:
 * n - {Mixed} the string or object to parse.
 *
 * Returns:
 * {Integer} the integer value that the parameter represents
 */
Jx.getNumber = function(n, def) {
    var result = n === null || isNaN(parseInt(n, 10)) ? (def || 0) : parseInt(n, 10);
    return result;
};

/**
 * APIMethod: getPageDimensions
 * return the dimensions of the browser client area.
 *
 * Returns:
 * {Object} an object containing a width and height property
 * that represent the width and height of the browser client area.
 */
Jx.getPageDimensions = function() {
    return {
        width: window.getWidth(),
        height: window.getHeight()
    };
};

/**
 * APIMethod: type
 * safely return the type of an object using the mootools type system
 *
 * Returns:
 * {Object} an object containing a width and height property
 * that represent the width and height of the browser client area.
 */
Jx.type = function(obj) {
  return typeof obj == 'undefined' ? false : obj.jxFamily || $type(obj);
};

(function($) {
    // Wrapper for document.id

    /**
     * Class: Element
     *
     * Element is a global object provided by the mootools library.  The
     * functions documented here are extensions to the Element object provided
     * by Jx to make cross-browser compatibility easier to achieve.  Most of
     * the methods are measurement related.
     *
     * While the code in these methods has been converted to use MooTools
     * methods, there may be better MooTools methods to use to accomplish
     * these things.
     * Ultimately, it would be nice to eliminate most or all of these and find
     * the MooTools equivalent or convince MooTools to add them.
     *
     * NOTE: Many of these methods can be replaced with mootools-more's
     * Element.Measure
     */
    Element.implement({
        /**
         * APIMethod: getBoxSizing
         * return the box sizing of an element, one of 'content-box' or
         *'border-box'.
         *
         * Parameters:
         * elem - {Object} the element to get the box sizing of.
         *
         * Returns:
         * {String} the box sizing of the element.
         */
        getBoxSizing: function() {
            var result = 'content-box',
                cm,
                sizing;
            if (Browser.Engine.trident || Browser.Engine.presto) {
                cm = document["compatMode"];
                if (cm == "BackCompat" || cm == "QuirksMode") {
                    result = 'border-box';
                } else {
                    result = 'content-box';
                }
            } else {
                if (arguments.length === 0) {
                    node = document.documentElement;
                }
                sizing = this.getStyle("-moz-box-sizing");
                if (!sizing) {
                    sizing = this.getStyle("box-sizing");
                }
                result = (sizing ? sizing: 'content-box');
            }
            return result;
        },
        /**
         * APIMethod: getContentBoxSize
         * return the size of the content area of an element.  This is the
         * size of the element less margins, padding, and borders.
         *
         * Parameters:
         * elem - {Object} the element to get the content size of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the content area of the measured element.
         */
        getContentBoxSize: function() {
            var s = this.getSizes(['padding', 'border']);
            return {
                width: this.offsetWidth - s.padding.left - s.padding.right - s.border.left - s.border.right,
                height: this.offsetHeight - s.padding.bottom - s.padding.top - s.border.bottom - s.border.top
            };
        },
        /**
         * APIMethod: getBorderBoxSize
         * return the size of the border area of an element.  This is the size
         * of the element less margins.
         *
         * Parameters:
         * elem - {Object} the element to get the border sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the border area of the measured element.
         */
        getBorderBoxSize: function() {
            return {
                width: this.offsetWidth,
                height: this.offsetHeight
            };
        },

        /**
         * APIMethod: getMarginBoxSize
         * return the size of the margin area of an element.  This is the size
         * of the element plus margins.
         *
         * Parameters:
         * elem - {Object} the element to get the margin sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the margin area of the measured element.
         */
        getMarginBoxSize: function() {
            var s = this.getSizes(['margin']);
            return {
                width: this.offsetWidth + s.margin.left + s.margin.right,
                height: this.offsetHeight + s.margin.top + s.margin.bottom
            };
        },
        /**
         * APIMethod: getSizes
         * measure the size of various styles on various edges and return
         * the values.
         *
         * Parameters:
         * styles - array, the styles to compute.  By default, this is
         * ['padding', 'border','margin'].  If you don't need all the styles,
         * just request the ones you need to minimize compute time required.
         * edges - array, the edges to compute styles for.  By default,  this
         * is ['top','right','bottom','left'].  If you don't need all the
         * edges, then request the ones you need to minimize compute time.
         *
         * Returns:
         * {Object} an object with one member for each requested style.  Each
         * style member is an object containing members for each requested
         * edge. Values are the computed style for each edge in pixels.
         */
        getSizes: function(which, edges) {
            which = which || ['padding', 'border', 'margin'];
            edges = edges || ['left', 'top', 'right', 'bottom'];
            var result = {},
                e,
                n;
            which.each(function(style) {
                result[style] = {};
                edges.each(function(edge) {
                    e = (style == 'border') ? edge + '-width': edge;
                    n = this.getStyle(style + '-' + e);
                    result[style][edge] = n === null || isNaN(parseInt(n, 10)) ? 0: parseInt(n, 10);
                },
                this);
            },
            this);
            return result;
        },
        /**
         * APIMethod: setContentBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the content
         * area of the element is the requested size and the resulting
         * size of the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the content area of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
        setContentBoxSize: function(size) {
            var m,
                width,
                height;
            if (this.getBoxSizing() == 'border-box') {
                m = this.measure(function() {
                    return this.getSizes(['padding', 'border']);
                });
                if ($defined(size.width)) {
                    width = size.width + m.padding.left + m.padding.right + m.border.left + m.border.right;
                    if (width < 0) {
                        width = 0;
                    }
                    this.setStyle('width', width);
                }
                if ($defined(size.height)) {
                    height = size.height + m.padding.top + m.padding.bottom + m.border.top + m.border.bottom;
                    if (height < 0) {
                        height = 0;
                    }
                    this.setStyle('height', height);
                }
            } else {
                if ($defined(size.width) && size.width >= 0) {
                  this.setStyle('width', width);
                }
                if ($defined(size.height) && size.height >= 0) {
                  this.setStyle('height', height);
                }
            }
        },
        /**
         * APIMethod: setBorderBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the border
         * size of the element is the requested size and the resulting
         * content areaof the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the border size of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
        setBorderBoxSize: function(size) {
            var m, 
                width, 
                height;
            if (this.getBoxSizing() == 'content-box') {
                m = this.measure(function() {
                    return this.getSizes();
                });

                if ($defined(size.width)) {
                    width = size.width - m.padding.left - m.padding.right - m.border.left - m.border.right - m.margin.left - m.margin.right;
                    if (width < 0) {
                        width = 0;
                    }
                    this.setStyle('width', width);
                }
                if ($defined(size.height)) {
                    height = size.height - m.padding.top - m.padding.bottom - m.border.top - m.border.bottom - m.margin.top - m.margin.bottom;
                    if (height < 0) {
                        height = 0;
                    }
                    this.setStyle('height', height);
                }
            } else {
                if ($defined(size.width) && size.width >= 0) {
                  this.setStyle('width', width);
                }
                if ($defined(size.height) && size.height >= 0) {
                  this.setStyle('height', height);
                }
            }
        },

        /**
         * APIMethod: descendantOf
         * determines if the element is a descendent of the reference node.
         *
         * Parameters:
         * node - {HTMLElement} the reference node
         *
         * Returns:
         * {Boolean} true if the element is a descendent, false otherwise.
         */
        descendantOf: function(node) {
            var parent = document.id(this.parentNode);
            while (parent != node && parent && parent.parentNode && parent.parentNode != parent) {
                parent = document.id(parent.parentNode);
            }
            return parent == node;
        },

        /**
         * APIMethod: findElement
         * search the parentage of the element to find an element of the given
         * tag name.
         *
         * Parameters:
         * type - {String} the tag name of the element type to search for
         *
         * Returns:
         * {HTMLElement} the first node (this one or first parent) with the
         * requested tag name or false if none are found.
         */
        findElement: function(type) {
            var o = this,
                tagName = o.tagName;
            while (o.tagName != type && o && o.parentNode && o.parentNode != o) {
                o = document.id(o.parentNode);
            }
            return o.tagName == type ? o: false;
        }
    });
    /**
     * Class: Array
     * Extensions to the javascript array object
     */
    Array.implement({
        /**
         * APIMethod: swap
         * swaps 2 elements of an array
         *
         * Parameters:
         * a - the first position to swap
         * b - the second position to swap
         */
        'swap': function(a, b) {
            var temp = this[a];
            this[a] = this[b];
            this[b] = temp;
        }
    });
})(document.id || $);
// End Wrapper for document.id
/*
---

name: Jx.Styles

description: A singleton object useful for dynamically creating and manipulating CSS styles

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Styles]

...
 */
/**
 * Class: Jx.Styles
 * Dynamic stylesheet class. Used for creating and manipulating dynamic
 * stylesheets.
 *
 * TBD: should we handle the case of putting the same selector in a stylesheet
 * twice?  Right now the code that stores the index of each rule on the
 * stylesheet is not really safe for that when combined with delete or get
 *
 * This is a singleton and should be called directly, like so:
 *
 * (code)
 *   // create a rule that turns all para text red and 15px.
 *   var rule = Jx.Styles.insertCssRule("p", "color: red;", "myStyle");
 *   rule.style.fontSize = "15px";
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 * Additional code by Paul Spencer
 *
 * This file is licensed under an MIT style license
 *
 * Inspired by dojox.html.styles, VisitSpy by nwhite,
 * http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
 *
 */
Jx.Styles = new(new Class({
    /**
     * dynamicStyleMap - <Hash> used to keep a reference to dynamically
     * created style sheets for quick access
     */
    dynamicStyleMap: new Hash(),
    /**
     * APIMethod: getCssRule
     * retrieve a reference to a CSS rule in a specific style sheet based on
     * its selector.  If the rule does not exist, create it.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to get the rule from
     *
     * Returns:
     * <CSSRule> - the requested rule
     */
    getCssRule: function(selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule = null,
            i;
        if (ss.indicies) {
            i = ss.indicies.indexOf(selector);
            if (i == -1) {
                rule = this.insertCssRule(selector, '', styleSheetName);
            } else {
                if (Browser.Engine.trident) {
                    rule = ss.sheet.rules[i];
                } else {
                    rule = ss.sheet.cssRules[i];
                }
            }
        }
        return rule;
    },
    /**
     * APIMethod: insertCssRule
     * insert a new dynamic rule into the given stylesheet.  If no name is
     * given for the stylesheet then the default stylesheet is used.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * declaration - <String> CSS-formatted rules to include.  May be empty,
     * in which case you may want to use the returned rule object to
     * manipulate styles
     * styleSheetName - <String> the name of the sheet to place the rules in,
     * or empty to put them in a default sheet.
     *
     * Returns:
     * <CSSRule> - a CSS Rule object with properties that are browser
     * dependent.  In general, you can use rule.styles to set any CSS
     * properties in the same way that you would set them on a DOM object.
     */
    insertCssRule: function (selector, declaration, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule,
            text = selector + " {" + declaration + "}",
            index;
        if (Browser.Engine.trident) {
            if (declaration == '') {
                //IE requires SOME text for the declaration. Passing '{}' will
                //create an empty rule.
                declaration = '{}';
            }
            index = ss.styleSheet.addRule(selector,declaration);
            rule = ss.styleSheet.rules[index];
        } else {
            ss.sheet.insertRule(text, ss.indicies.length);
            rule = ss.sheet.cssRules[ss.indicies.length];
        }
        ss.indicies.push(selector);
        return rule;
    },
    /**
     * APIMethod: removeCssRule
     * removes a CSS rule from the named stylesheet.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to remove the rule
     * from,  or empty to remove them from the default sheet.
     *
     * Returns:
     * <Boolean> true if the rule was removed, false if it was not.
     */
    removeCssRule: function (selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            i = ss.indicies.indexOf(selector),
            result = false;
        ss.indicies.splice(i, 1);
        if (Browser.Engine.trident) {
            ss.removeRule(i);
            result = true;
        } else {
            ss.sheet.deleteRule(i);
            result = true;
        }
        return result;
    },
    /**
     * APIMethod: getDynamicStyleSheet
     * return a reference to a styleSheet based on its title.  If the sheet
     * does not already exist, it is created.
     *
     * Parameter:
     * name - <String> the title of the stylesheet to create or obtain
     *
     * Returns:
     * <StyleSheet> a StyleSheet object with browser dependent capabilities.
     */
    getDynamicStyleSheet: function (name) {
        name = (name) ? name : 'default';
        if (!this.dynamicStyleMap.has(name)) {
            var sheet = new Element('style').set('type', 'text/css').inject(document.head);
            sheet.indicies = [];
            this.dynamicStyleMap.set(name, sheet);
        }
        return this.dynamicStyleMap.get(name);
    },
    /**
     * APIMethod: enableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to enable
     */
    enableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = false;
    },
    /**
     * APIMethod: disableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to disable
     */
    disableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = true;
    },
    /**
     * APIMethod: removeStyleSheet
     * Removes a style sheet
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    removeStyleSheet: function (name) {
      this.disableStyleSheet(name);
      this.getDynamicStyleSheet(name).dispose();
      this.dynamicStyleMap.erase(name);
    },
    /**
     * APIMethod: isStyleSheetDefined
     * Determined if the passed in name is a defined dynamic style sheet.
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    isStyleSheetDefined: function (name) {
      return this.dynamicStyleMap.has(name);
    }
}))();/*
---

name: Jx.Object

description: Base class for all other object in the JxLib framework.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Object]

...
 */
// $Id$
/**
 * Class: Jx.Object
 * Base class for all other object in the JxLib framework. This class
 * implements both mootools mixins Events and Options so the rest of the
 * classes don't need to.
 *
 * The Initialization Pipeline:
 * Jx.Object provides a default initialize method to construct new instances
 * of objects that inherit from it.  No sub-class should override initialize
 * unless you know exactly what you're doing.  Instead, the initialization
 * pipeline provides an init() method that is intended to be overridden in
 * sub-classes to provide class-specific initialization as part of the
 * initialization pipeline.
 *
 * The basic initialization pipeline for a Jx.Object is to parse the
 * parameters provided to initialize(), separate out options from other formal
 * parameters based on the parameters property of the class, call init() and
 * initialize plugins.
 *
 * Parsing Parameters:
 * Because each sub-class no longer has an initialize method, it no longer has
 * direct access to parameters passed to the constructor.  Instead, a
 * sub-class is expected to provide a parameters attribute with an array of
 * parameter names in the order expected.  Jx.Object will enumerate the
 * attributes passed to its initialize method and automatically place them
 * in the options object under the appropriate key (the value from the
 * array).  Parameters not found will not be present or will be null.
 *
 * The default parameters are a single options object which is merged with
 * the options attribute of the class.
 *
 * Calling Init:
 * Jx.Object fires the event 'preInit' before calling the init() method,
 * calls the init() method, then fires the 'postInit' event.  It is expected
 * that most sub-class specific initialization will happen in the init()
 * method.  A sub-class may hook preInit and postInit events to perform tasks
 * in one of two ways.
 *
 * First, simply send onPreInit and onPostInit functions via the options
 * object as follows (they could be standalone functions or functions of
 * another object setup using .bind())
 *
 * (code)
 * var preInit = function () {}
 * var postInit = function () {}
 *
 * var options = {
 *   onPreInit: preInit,
 *   onPostInit: postInit,
 *   ...other options...
 * };
 *
 * var dialog = new Jx.Dialog(options);
 * (end)
 *
 * The second method you can use is to override the initialize method
 *
 * (code)
 * var MyClass = new Class({
 *   Family: 'MyClass',
 *   initialize: function() {
 *     this.addEvent('preInit', this.preInit.bind(this));
 *     this.addEvent('postInit', this.postInit.bind(this));
 *     this.parent.apply(this, arguments);
 *   },
 *   preInit: function() {
 *     // something just before init() is called
 *   },
 *   postInit: function() {
 *     // something just after init() is called
 *   },
 *   init: function() {
 *     this.parent();
 *     // initialization code here
 *   }
 * });
 * (end)
 *
 * When the object finishes initializing itself (including the plugin
 * initialization) it will fire off the initializeDone event. You can hook
 * into this event in the same way as the events mentioned above.
 *
 * Plugins:
 * Plugins provide pieces of additional, optional, functionality. They are not
 * necessary for the proper function of an object. All plugins should be
 * located in the Jx.Plugin namespace and they should be further segregated by
 * applicable object. While all objects can support plugins, not all of them
 * have the automatic instantiation of applicable plugins turned on. In order
 * to turn this feature on for an object you need to set the pluginNamespace
 * property of the object. The following is an example of setting the
 * property:
 *
 * (code)
 * var MyClass = new Class({
 *   Extends: Jx.Object,
 *   pluginNamespace: 'MyClass'
 * };
 * (end)
 *
 * The absence of this property does not mean you cannot attach a plugin to an
 * object. It simply means that you can't have Jx.Object create the
 * plugin for you.
 *
 * There are four ways to attach a plugin to an object. First, simply
 * instantiate the plugin yourself and call its attach() method (other class
 * options left out for the sake of simplicity):
 *
 * (code)
 * var MyGrid = new Jx.Grid();
 * var APlugin = new Jx.Plugin.Grid.Selector();
 * APlugin.attach(MyGrid);
 * (end)
 *
 * Second, you can instantiate the plugin first and pass it to the object
 * through the plugins array in the options object.
 *
 * (code)
 * var APlugin = new Jx.Plugin.Grid.Selector();
 * var MyGrid = new Jx.Grid({plugins: [APlugin]});
 * (end)
 *
 * The third way is to pass the information needed to instantiate the plugin
 * in the plugins array of the options object:
 *
 * (code)
 * var MyGrid = new Jx.Grid({
 *   plugins: [{
 *      name: 'Selector',
 *      options: {}    //options needed to create this plugin
 *   },{
 *      name: 'Sorter',
 *      options: {}
 *   }]
 * });
 * (end)
 *
 * The final way, if the plugin has no options, is to pass the name of the
 * plugin as a simple string in the plugins array.
 *
 * (code)
 * var MyGrid = new Jx.Grid({
 *   plugins: ['Selector','Sorter']
 * });
 * (end)
 *
 * Part of the process of initializing plugins is to call prePluginInit() and
 * postPluginInit(). These events provide you access to the object just before
 * and after the plugins are initialized and/or attached to the object using
 * methods 2 and 3 above. You can hook into these in the same way that you
 * hook into the preInit() and postInit() events.
 *
 * Destroying Jx.Object Instances:
 * Jx.Object provides a destroy method that cleans up potential memory leaks
 * when you no longer need an object.  Sub-classes are expected to implement
 * a cleanup() method that provides specific cleanup code for each
 * sub-class.  Remember to call this.parent() when providing a cleanup()
 * method. Destroy will also fire off 2 events: preDestroy and postDestroy.
 * You can hook into these methods in the same way as the init or plugin
 * events.
 *
 * The Family Attribute:
 * the Family attribute of a class is used internally by JxLib to identify Jx
 * objects within mootools.  The actual value of Family is unimportant to Jx.
 * If you do not provide a Family, a class will inherit it's base class family
 * up to Jx.Object.  Family is useful when debugging as you will be able to
 * identify the family in the firebug inspector, but is not as useful for
 * coding purposes as it does not allow for inheritance.
 *
 * Events:
 *
 * preInit
 * postInit
 * prePluginInit
 * postPluginInit
 * initializeDone
 * preDestroy
 * postDestroy
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Object = new Class({
    Family: "Jx.Object",
    Implements: [Options, Events],
    plugins: null,
    pluginNamespace: 'Other',
    /**
     * Constructor: Jx.Object
     * create a new instance of Jx.Object
     *
     * Parameters:
     * options - {Object} optional parameters for creating an object.
     */
    parameters: ['options'],

    options: {
      /**
       * Option: useLang
       * Turns on this widget's ability to react to changes in
       * the default language. Handy for changing text out on the fly.
       *
       * TODO: Should this be enabled or disabled by default?
       */
      useLang: true,
      /**
       * Option: plugins
       * {Array} an array of plugins to add to the object.
       */
      plugins: null
    },

    bound: null,

    initialize: function(){
        this.plugins = new Hash();
        this.bound = {};
        //normalize arguments
        var numArgs = arguments.length,
            options = {},
            parameters = this.parameters,
            numParams,
            index;

        if (numArgs > 0) {
            if (numArgs === 1
                    && (Jx.type(arguments[0])==='object' || Jx.type(arguments[0])==='Hash')
                    && parameters.length === 1
                    && parameters[0] === 'options') {
                options = arguments[0];
            } else {
                numParams = parameters.length;
                index;
                if (numParams <= numArgs) {
                    index = numParams;
                } else {
                    index = numArgs;
                }
                for (var i = 0; i < index; i++) {
                    if (parameters[i] === 'options') {
                        $extend(options, arguments[i]);
                    } else {
                        options[parameters[i]] = arguments[i];
                    }
                }
            }
        }

        this.setOptions(options);

        this.bound.changeText = this.changeText.bind(this);
        if (this.options.useLang) {
            MooTools.lang.addEvent('langChange', this.bound.changeText);
        }

        this.fireEvent('preInit');
        this.init();
        this.fireEvent('postInit');
        this.fireEvent('prePluginInit');
        this.initPlugins();
        this.fireEvent('postPluginInit');
        this.fireEvent('initializeDone');
    },

    /**
     * Method: initPlugins
     * internal function to initialize plugins on object creation
     */
    initPlugins: function () {
        var p;
        // pluginNamespace must be defined in order to pass plugins to the
        // object
        if ($defined(this.pluginNamespace)) {
            if ($defined(this.options.plugins)
                    && Jx.type(this.options.plugins) === 'array') {
                this.options.plugins.each(function (plugin) {
                    if (plugin instanceof Jx.Plugin) {
                        plugin.attach(this);
                        this.plugins.set(plugin.name, plugin);
                    } else if (Jx.type(plugin) === 'object') {
                        // All plugin-enabled objects should define a
                        // pluginNamespace member variable
                        // that is used for locating the plugins. The default
                        // namespace is 'Other' for
                        // now until we come up with a better idea
                      if ($defined(Jx.Plugin[this.pluginNamespace][plugin.name.capitalize()])) {
                        p = new Jx.Plugin[this.pluginNamespace][plugin.name.capitalize()](plugin.options);
                      } else {
                        p = new Jx.Adaptor[this.pluginNamespace][plugin.name.capitalize()](plugin.options);
                      }
                        p.attach(this);
                    } else if (Jx.type(plugin) === 'string') {
                        //this is a name for a plugin.
                      if ($defined(Jx.Plugin[this.pluginNamespace][plugin.capitalize()])) {
                        p = new Jx.Plugin[this.pluginNamespace][plugin.capitalize()]();
                      } else {
                        p = new Jx.Adaptor[this.pluginNamespace][plugin.capitalize()]();
                      }
                        p.attach(this);
                    }
                }, this);
            }
        }
    },

    /**
     * APIMethod: destroy
     * destroy a Jx.Object, safely cleaning up any potential memory
     * leaks along the way.  Uses the cleanup method of an object to
     * actually do the cleanup.
     * Emits the preDestroy event before cleanup and the postDestroy event
     * after cleanup.
     */
    destroy: function () {
        this.fireEvent('preDestroy');
        this.cleanup();
        this.fireEvent('postDestroy');
    },

    /**
     * Method: cleanup
     * to be implemented by subclasses to do the actual work of destroying
     * an object.
     */
    cleanup: function () {
        //detach plugins
        if (this.plugins.getLength > 0) {
            this.plugins.each(function (plugin) {
                plugin.detach();
                plugin.destroy();
            }, this);
        }
        this.plugins.empty();
        if (this.options.useLang && $defined(this.bound.changeText)) {
            MooTools.lang.removeEvent('langChange', this.bound.changeText);
        }
        this.bound = null;
    },

    /**
     * Method: init
     * virtual initialization method to be implemented by sub-classes
     */
    init: $empty,

    /**
     * APIMethod: registerPlugin
     * This method is called by a plugin that has its attach method
     * called.
     *
     * Parameters:
     * plugin - the plugin to register with this object
     */
    registerPlugin: function (plugin) {
        if (!this.plugins.has(plugin.name)) {
            this.plugins.set(plugin.name,  plugin);
        }
    },
    /**
     * APIMethod: deregisterPlugin
     * his method is called by a plugin that has its detach method
     * called.
     *
     * Parameters:
     * plugin - the plugin to deregister.
     */
    deregisterPlugin: function (plugin) {
        if (this.plugins.has(plugin.name)) {
            this.plugins.erase(plugin.name);
        }
    },

    /**
     * APIMethod: getPlugin
     * Allows a developer to get a reference to a plugin with only the
     * name of the plugin.
     *
     * Parameters:
     * name - the name of the plugin as defined in the plugin's name property
     */
    getPlugin: function (name) {
        if (this.plugins.has(name)) {
            return this.plugins.get(name);
        }
    },

    /**
     * APIMethod: getText
     *
     * returns the text for a jx.widget used in a label.
     *
     * Parameters:
     * val - <String> || <Function> || <Object> = { set: '', key: ''[, value: ''] } for a MooTools.lang object
     */
    getText: function(val) {
      var result = '';
      if (Jx.type(val) == 'string' || Jx.type(val) == 'number') {
        result = val;
      } else if (Jx.type(val) == 'function') {
        result = val();
      } else if (Jx.type(val) == 'object' && $defined(val.set) && $defined(val.key)) {
        // COMMENT: just an idea how a localization object could be stored to the instance if needed somewhere else and options change?
        this.i18n = val;
        if($defined(val.value)) {
          result = MooTools.lang.get(val.set, val.key)[val.value];
        }else{
          result = MooTools.lang.get(val.set, val.key);
        }
      }
      return result;
    },

    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - the language being changed to or that had it's data set of
     *    translations changed.
     */
    changeText : $empty,

    /**
     * Method: generateId
     * Used to generate a unique ID for Jx Objects.
     */
    generateId: function(prefix){
        prefix = (prefix) ? prefix : 'jx-';
        var uid = $uid(this);
        delete this.uid;
        return prefix + uid;
    }
});
/*
---

name: Locale.English.US

description: Default translations of text strings used in JX for US english (en-US)

license: MIT-style license.

requires:
 - More/Lang

provides: [Locale.English.US]

...
 */
MooTools.lang.set('en-US', 'Jx', {
	
	'widget': {
		busyMessage: 'Working ...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'close this notice'
	},
	progressbar: {
		messageText: 'Loading...',
		progressText: '{progress} of {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Browse...'
	},
	'formatter.boolean': {
		'true': 'Yes',
		'false': 'No'
	},
	'formatter.currency': {
		sign: '$'
	},
	'formatter.number': {
		decimalSeparator: '.',
    thousandsSeparator: ','
	},
	splitter: {
		barToolTip: 'drag this bar to resize'
	},
  panelset: {
    barToolTip: 'drag this bar to resize'
  },
	panel: {
		collapseTooltip: 'Collapse/Expand Panel',
    collapseLabel: 'Collapse',
    expandLabel: 'Expand',
    maximizeTooltip: 'Maximize Panel',
    maximizeLabel: 'Maximize',
    restoreTooltip: 'Restore Panel',
    restoreLabel: 'Restore',
    closeTooltip: 'Close Panel',
    closeLabel: 'Close'
	},
	confirm: {
		affirmativeLabel: 'Yes',
    negativeLabel: 'No'
	},
	dialog: {
		resizeToolTip: 'Resize dialog'
	},
	message: {
		okButton: 'Ok'
	},
	prompt: {
		okButton: 'Ok',
		cancelButton: 'Cancel'
	},
	upload: {
		buttonText: 'Upload Files'
	},
	'plugin.resize': {
	  tooltip: 'Drag to resize, double click to auto-size.'
	},
  'plugin.editor': {
    submitButton: 'Save',
    cancelButton: 'Cancel'
  }
});/*
---

name: Jx.Widget

description: Base class for all widgets (visual classes) in the JxLib Framework.

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Stack
 - Locale.English.US

provides: [Jx.Widget]

css:
 - chrome

images:
 - spinner_16.gif
 - spinner_24.gif

optional:
 - More/Spinner

...
 */
// $Id$
/**
 * Class: Jx.Widget
 * Base class for all widgets (visual classes) in the JxLib Framework. This
 * class extends <Jx.Object> and adds the Chrome, ContentLoader, Addable, and
 * AutoPosition mixins from the original framework.
 *
 * ContentLoader:
 *
 * ContentLoader functionality provides a consistent
 * mechanism for descendants of Jx.Widget to load content in one of
 * four different ways:
 *
 * o using an existing element, by id
 *
 * o using an existing element, by object reference
 *
 * o using an HTML string
 *
 * o using a URL to get the content remotely
 *
 * Chrome:
 *
 * Chrome is the extraneous visual element that provides the look and feel to
 * some elements i.e. dialogs.  Chrome is added inside the element specified
 * but may bleed outside the element to provide drop shadows etc.  This is
 * done by absolutely positioning the chrome objects in the container based on
 * calculations using the margins, borders, and padding of the jxChrome
 * class and the element it is added to.
 *
 * Chrome can consist of either pure CSS border and background colors, or
 * a background-image on the jxChrome class.  Using a background-image on
 * the jxChrome class creates four images inside the chrome container that
 * are positioned in the top-left, top-right, bottom-left and bottom-right
 * corners of the chrome container and are sized to fill 50% of the width
 * and height.  The images are positioned and clipped such that the
 * appropriate corners of the chrome image are displayed in those locations.
 *
 * Busy States:
 *
 * Any widget can be set as temporarily busy by calling the setBusy(true)
 * method and then as idle by calling setBusy(false).  By default, busy
 * widgets display an event mask that prevents them from being clicked and
 * a spinner image with a message.  By default, there are two configurations
 * for the spinner image and message, one for 'small' widgets like buttons
 * and inputs, and one for larger widgets like panels and dialogs.  The
 * framework automatically chooses the most appropriate configuration so you
 * don't need to worry about it unless you want to customize it.
 *
 * You can disable this behaviour entirely by setting busyMask: false in the
 * widget options when creating the widget.
 *
 * The mask and spinner functionality is provided by the MooTools Spinner
 * class.  You can use any options documented for Spinner or Mask by setting
 * the maskOptions option when creating a widget.
 *
 * Events:
 * Jx.Widget has several events called during it's lifetime (in addition to
 * the ones for its base class <Jx.Object>).
 *
 * preRender - called before rendering begins
 * postRender - called after rendering is done
 * deferRender - called when the deferRender option is set to true. The first
 *      two events (pre- and post- render will NOT be called if deferRender is
 *      set to true).
 * contentLoaded - called after content has been loaded successfully
 * contentLoadFailed - called if content can not be loaded for some reason
 * addTo - called when a widget is added to another element or widget
 * busy - called just before the busy mask is rendered/removed
 *
 * MooTools.Lang Keys:
 * widget.busyMessage - sets the message of the waiter component when used
 */
Jx.Widget = new Class({
    Family: "Jx.Widget",
    Extends: Jx.Object,

    options: {
        /* Option: id
         * (optional) {String} an HTML ID to assign to the widget
         */
        id: null,
        /**
         * Option: content
         * content may be an HTML element reference, the id of an HTML element
         * already in the DOM, or an HTML string that becomes the inner HTML
         * of the element.
         */
        content: null,
        /**
         * Option: contentURL
         * the URL to load content from
         */
        contentURL: null,
        /**
         * Option: loadOnDemand
         * {boolean} ajax content will only be loaded if the action is requested
         * (like loading the content into a tab when activated)
         */
        loadOnDemand : false,
        /**
         * Option: cacheContent
         * {boolean} determine whether the content should be loaded every time
         * or if it's being cached
         */
        cacheContent : true,
        /**
         * Option: template
         * the default HTML structure of this widget.  The default template
         * is just a div with a class of jxWidget in the base class
         */
        template: '<div class="jxWidget"></div>',
        /**
         * Option: busyClass
         * {String} a CSS class name to apply to busy mask when a widget is
         * set as busy.  The default is 'jxBusy'.
         */
        busyClass: 'jxBusy',
        /**
         * Option: busyMask
         * {Object} an object of options to pass to the MooTools Spinner
         * when masking a busy object.  Set to false if you do not want
         * to use the busy mask.
         */
        busyMask: {
          'class': 'jxSpinner jxSpinnerLarge',
          img: {'class':'jxSpinnerImage'},
          content: {'class':'jxSpinnerContent'},
          messageContainer: {'class':'jxSpinnerMessage'},
          useIframeShim: true,
          iframeShimOptions: {
            className: 'jxIframeShim'
          },
          fx: true
        },
        /**
         * Option: deferRender
         * Used to defer rendering of a widget to a later time. Useful when
         * we need data or other information not at hand at the moment
         * of Widget instantiation. If set to true, the user will need to call
         * render() at some later time. The only drawback to doing so will be
         * the loss of preRender and postRender events.
         */
        deferRender: false
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: new Hash({
        domObj: 'jxWidget'
    }),

    /**
     * Property: busy
     * {Boolean} is the widget currently busy?  This should be considered
     * an internal property, use the API methods <Jx.Widget::setBusy> and
     * <Jx.Widget::isBusy> to manage the busy state of a widget.
     */
    busy: false,

    /**
     * Property: domObj
     * The HTMLElement that represents this widget.
     */
    domObj: null,

    /**
     * Property: contentIsLoaded
     * {Boolean} tracks the load state of the content, specifically useful
     * in the case of remote content.
     */
    contentIsLoaded: false,

    /**
     * Property: chrome
     * the DOM element that contains the chrome
     */
    chrome: null,

    /**
     * Method: init
     * sets up the base widget code and runs the render function.  Called
     * by the Jx.Object framework for object initialization, should not be
     * called directly.
     */
    init: function(){
        if (!this.options.deferRender) {
            this.fireEvent('preRender');
            this.render();
            this.fireEvent('postRender');
        } else {
            this.fireEvent('deferRender');
        }
    },

    /**
     * APIMethod: loadContent
     *
     * triggers loading of content based on options set for the current
     * object.
     *
     * Parameters:
     * element - {Object} the element to insert the content into
     *
     * Events:
     *
     * ContentLoader adds the following events to an object.  You can
     * register for these events using the addEvent method or by providing
     * callback functions via the on{EventName} properties in the options
     * object
     *
     * contentLoaded - called when the content has been loaded.  If the
     *     content is not asynchronous then this is called before loadContent
     *     returns.
     * contentLoadFailed - called if the content fails to load, primarily
     *     useful when using the contentURL method of loading content.
     */
    loadContent: function(element) {
        var c,
            options = this.options,
            timeout;
        element = document.id(element);
        if (options.content) {
            if (options.content.domObj) {
                c = document.id(options.content.domObj);
            } else {
                c = document.id(options.content);
            }
            if (c) {
                if (options.content.addTo) {
                    options.content.addTo(element);
                } else {
                    element.appendChild(c);
                }
                this.contentIsLoaded = true;
            } else {
                element.innerHTML = options.content;
                this.contentIsLoaded = true;
            }
        } else if (options.contentURL) {
            this.contentIsLoaded = false;
            this.req = new Request({
                url: options.contentURL,
                method:'get',
                evalScripts:true,
                onRequest:(function() {
                  if(options.loadOnDemand) {
                      this.setBusy(true);
                  }
                }).bind(this),
                onSuccess:(function(html) {
                    element.innerHTML = html;
                    this.contentIsLoaded = true;
                    if (Jx.isAir){
                        $clear(this.reqTimeout);
                    }
                    this.setBusy(false);
                    this.fireEvent('contentLoaded', this);
                }).bind(this),
                onFailure: (function(){
                    this.contentIsLoaded = true;
                    this.fireEvent('contentLoadFailed', this);
                    this.setBusy(false);
                }).bind(this)
            });
            this.req.send();
            if (Jx.isAir) {
                timeout = $defined(options.timeout) ? options.timeout : 10000;
                this.reqTimeout = this.checkRequest.delay(timeout, this);
            }
        } else {
            this.contentIsLoaded = true;
        }
        if (options.contentId) {
            element.id = this.options.contentId;
        }
        if (this.contentIsLoaded) {
            this.fireEvent('contentLoaded', this);
        }
    },

    /**
     * APIMethod: position
     * positions an element relative to another element
     * based on the provided options.  Positioning rules are
     * a string with two space-separated values.  The first value
     * references the parent element and the second value references
     * the thing being positioned.  In general, multiple rules can be
     * considered by passing an array of rules to the horizontal and
     * vertical options.  The position method will attempt to position
     * the element in relation to the relative element using the rules
     * specified in the options.  If the element does not fit in the
     * viewport using the rule, then the next rule is attempted.  If
     * all rules fail, the last rule is used and element may extend
     * outside the viewport.  Horizontal and vertical rules are
     * processed independently.
     *
     * Horizontal Positioning:
     * Horizontal values are 'left', 'center', 'right', and numeric values.
     * Some common rules are:
     * o 'left left' is interpreted as aligning the left
     * edge of the element to be positioned with the left edge of the
     * reference element.
     * o 'right right' aligns the two right edges.
     * o 'right left' aligns the left edge of the element to the right of
     * the reference element.
     * o 'left right' aligns the right edge of the element to the left
     * edge of the reference element.
     *
     * Vertical Positioning:
     * Vertical values are 'top', 'center', 'bottom', and numeric values.
     * Some common rules are:
     * o 'top top' is interpreted as aligning the top
     * edge of the element to be positioned with the top edge of the
     * reference element.
     * o 'bottom bottom' aligns the two bottom edges.
     * o 'bottom top' aligns the top edge of the element to the bottom of
     * the reference element.
     * o 'top bottom' aligns the bottom edge of the element to the top
     * edge of the reference element.
     *
     * Parameters:
     * element - the element to position
     * relative - the element to position relative to
     * options - the positioning options, see list below.
     *
     * Options:
     * horizontal - the horizontal positioning rule to use to position the
     *    element.  Valid values are 'left', 'center', 'right', and a numeric
     *    value.  The default value is 'center center'.
     * vertical - the vertical positioning rule to use to position the
     *    element.  Valid values are 'top', 'center', 'bottom', and a numeric
     *    value.  The default value is 'center center'.
     * offsets - an object containing numeric pixel offset values for the
     *    object being positioned as top, right, bottom and left properties.
     */
    position: function(element, relative, options) {
        element = document.id(element);
        relative = document.id(relative);
        var hor = $splat(options.horizontal || ['center center']),
            ver = $splat(options.vertical || ['center center']),
            offsets = $merge({top:0,right:0,bottom:0,left:0}, options.offsets || {}),
            coords = relative.getCoordinates(), //top, left, width, height,
            page, 
            scroll,
            size,
            left,
            rigbht,
            top,
            bottom,
            n,
            parts;
        if (!document.id(element.parentNode) || element.parentNode ==  document.body) {
            page = Jx.getPageDimensions();
            scroll = document.id(document.body).getScroll();
        } else {
            page = document.id(element.parentNode).getContentBoxSize(); //width, height
            scroll = document.id(element.parentNode).getScroll();
        }
        if (relative == document.body) {
            // adjust coords for the scroll offsets to make the object
            // appear in the right part of the page.
            coords.left += scroll.x;
            coords.top += scroll.y;
        } else if (element.parentNode == relative) {
            // if the element is opening *inside* its relative, we want
            // it to position correctly within it so top/left becomes
            // the reference system.
            coords.left = 0;
            coords.top = 0;
        }
        size = element.getMarginBoxSize(); //width, height
        if (!hor.some(function(opt) {
            parts = opt.split(' ');
            if (parts.length != 2) {
                return false;
            }
            if (!isNaN(parseInt(parts[0],10))) {
                n = parseInt(parts[0],10);
                if (n>=0) {
                    left = n;
                } else {
                    left = coords.left + coords.width + n;
                }
            } else {
                switch(parts[0]) {
                    case 'right':
                        left = coords.left + coords.width;
                        break;
                    case 'center':
                        left = coords.left + Math.round(coords.width/2);
                        break;
                    case 'left':
                    default:
                        left = coords.left;
                        break;
                }
            }
            if (!isNaN(parseInt(parts[1],10))) {
                n = parseInt(parts[1],10);
                if (n<0) {
                    right = left + n;
                    left = right - size.width;
                } else {
                    left += n;
                    right = left + size.width;
                }
                right = coords.left + coords.width + parseInt(parts[1],10);
                left = right - size.width;
            } else {
                switch(parts[1]) {
                    case 'left':
                        left -= offsets.left;
                        right = left + size.width;
                        break;
                    case 'right':
                        left += offsets.right;
                        right = left;
                        left = left - size.width;
                        break;
                    case 'center':
                    default:
                        left = left - Math.round(size.width/2);
                        right = left + size.width;
                        break;
                }
            }
            return (left >= scroll.x && right <= scroll.x + page.width);
        })) {
            // all failed, snap the last position onto the page as best
            // we can - can't do anything if the element is wider than the
            // space available.
            if (right > page.width) {
                left = scroll.x + page.width - size.width;
            }
            if (left < 0) {
                left = 0;
            }
        }
        element.setStyle('left', left);

        if (!ver.some(function(opt) {
          parts = opt.split(' ');
          if (parts.length != 2) {
            return false;
          }
          if (!isNaN(parseInt(parts[0],10))) {
            top = parseInt(parts[0],10);
          } else {
            switch(parts[0]) {
              case 'bottom':
                top = coords.top + coords.height;
                break;
              case 'center':
                top = coords.top + Math.round(coords.height/2);
                break;
              case 'top':
              default:
                top = coords.top;
                break;
            }
          }
          if (!isNaN(parseInt(parts[1],10))) {
              var n = parseInt(parts[1],10);
              if (n>=0) {
                  top += n;
                  bottom = top + size.height;
              } else {
                  bottom = top + n;
                  top = bottom - size.height;
              }
          } else {
              switch(parts[1]) {
                  case 'top':
                      top -= offsets.top;
                      bottom = top + size.height;
                      break;
                  case 'bottom':
                      top += offsets.bottom;
                      bottom = top;
                      top = top - size.height;
                      break;
                  case 'center':
                  default:
                      top = top - Math.round(size.height/2);
                      bottom = top + size.height;
                      break;
              }
          }
          return (top >= scroll.y && bottom <= scroll.y + page.height);
      })) {
          // all failed, snap the last position onto the page as best
          // we can - can't do anything if the element is higher than the
          // space available.
          if (bottom > page.height) {
              top = scroll.y + page.height - size.height;
          }
          if (top < 0) {
              top = 0;
          }
      }
      element.setStyle('top', top);

      /* update the jx layout if necessary */
      var jxl = element.retrieve('jxLayout');
      if (jxl) {
          jxl.options.left = left;
          jxl.options.top = top;
      }
    },

    /**
     * Method: makeChrome
     * create chrome on an element.
     *
     * Parameters:
     * element - {HTMLElement} the element to put the chrome on.
     */
    makeChrome: function(element) {
        var c = new Element('div', {
                'class':'jxChrome',
                events: {
                  contextmenu: function(e) { e.stop(); }
                }
              }),
            src;

        /* add to element so we can get the background image style */
        element.adopt(c);

        /* pick up any offset because of chrome, set
         * through padding on the chrome object.  Other code can then
         * make use of these offset values to fix positioning.
         */
        this.chromeOffsets = c.measure(function() {
            return this.getSizes(['padding']).padding;
        });
        c.setStyle('padding', 0);

        /* get the chrome image from the background image of the element */
        /* the app: protocol check is for adobe air support */
        src = c.getStyle('backgroundImage');
        if (src != null) {
          if (!(src.contains('http://') || src.contains('https://') || src.contains('file://') || src.contains('app:/'))) {
              src = null;
          } else {
              src = src.slice(4,-1);
              /* this only seems to be IE and Opera, but they add quotes
               * around the url - yuck
               */
              if (src.charAt(0) == '"') {
                  src = src.slice(1,-1);
              }

              /* and remove the background image */
              c.setStyle('backgroundImage', 'none');

              /* make chrome */
              ['TR','TL','BL','BR'].each(function(s){
                  c.adopt(
                      new Element('div',{
                          'class':'jxChrome'+s
                      }).adopt(
                      new Element('img',{
                          'class':'png24',
                          src:src,
                          alt: '',
                          title: ''
                      })));
              }, this);
          }
        }
        /* create a shim so selects don't show through the chrome */
        if ($defined(window.IframeShim)) {
          this.shim = new IframeShim(c, {className: 'jxIframeShim'});
        }

        /* remove from DOM so the other resizing logic works as expected */
        c.dispose();
        this.chrome = c;
    },

    /**
     * APIMethod: showChrome
     * show the chrome on an element.  This creates the chrome if necessary.
     * If the chrome has been previously created and not removed, you can
     * call this without an element and it will just resize the chrome within
     * its existing element.  You can also pass in a different element from
     * which the chrome was previously attached to and it will move the chrome
     * to the new element.
     *
     * Parameters:
     * element - {HTMLElement} the element to show the chrome on.
     */
    showChrome: function(element) {
        element = document.id(element) || document.id(this);
        if (element) {
            if (!this.chrome) {
                this.makeChrome(element);
                element.addClass('jxHasChrome');
            }
            this.resizeChrome(element);
            if (this.shim) {
              this.shim.show();
            }
            if (element && this.chrome.parentNode !== element) {
                element.adopt(this.chrome);
                this.chrome.setStyle('z-index',-1);
            }
        }
    },

    /**
     * APIMethod: hideChrome
     * removes the chrome from the DOM.  If you do this, you can't
     * call showChrome with no arguments.
     */
    hideChrome: function() {
        if (this.chrome) {
            if (this.shim) {
              this.shim.hide();
            }
            this.chrome.parentNode.removeClass('jxHasChrome');
            this.chrome.dispose();
        }
    },

    /**
     * APIMethod: resizeChrome
     * manually resize the chrome on an element.
     *
     * Parameters:
     * element: {DOMElement} the element to resize the chrome for
     */
    resizeChrome: function(o) {
        if (this.chrome && Browser.Engine.trident4) {
            this.chrome.setContentBoxSize(document.id(o).getBorderBoxSize());
            if (this.shim) {
              this.shim.position();
            }
        }
    },

    /**
     * APIMethod: addTo
     * adds the object to the DOM relative to another element.  If you use
     * 'top' or 'bottom' then the element is added to the relative
     * element (becomes a child node).  If you use 'before' or 'after'
     * then the element is inserted adjacent to the reference node.
     *
     * Parameters:
     * reference - {Object} the DOM element or id of a DOM element
     * to append the object relative to
     * where - {String} where to append the element in relation to the
     * reference node.  Can be 'top', 'bottom', 'before' or 'after'.
     * The default is 'bottom'.
     *
     * Returns:
     * the object itself, which is useful for chaining calls together
     */
    addTo: function(reference, where) {
        var el = document.id(this.addable) || document.id(this.domObj);
        if (el) {
            if (reference instanceof Jx.Widget && $defined(reference.add)) {
                reference.add(el);
            } else {
                ref = document.id(reference);
                el.inject(ref,where);
            }
            this.fireEvent('addTo',this);
        }
        return this;
    },

    /**
     * APIMethod: toElement
     * return a DOM element reference for this widget, by default this
     * returns the local domObj reference.  This is used by the mootools
     * framework with the document.id() or $() methods allowing you to
     * manipulate a Jx.Widget sub class as if it were a DOM element.
     *
     * (code)
     * var button = new Jx.Button({label: 'test'});
     * $(button).inject('someElement');
     * (end)
     */
    toElement: function() {
        return this.domObj;
    },

    /**
     * APIMethod: processTemplate
     * This function pulls the needed elements from a provided template
     *
     * Parameters:
     * template - the template to use in grabbing elements
     * classes - an array of class names to use in grabbing elements
     * container - the container to add the template into
     *
     * Returns:
     * a hash object containing the requested Elements keyed by the class
     * names
     */
    processTemplate: function(template,classes,container){
        var h = new Hash(),
            element,
            el;
        if ($defined(container)){
            element = container.set('html',template);
        } else {
            element = new Element('div',{html:template});
        }
        classes.each(function(klass){
            el = element.getElement('.'+klass);
            if ($defined(el)){
                h.set(klass,el);
            }
        });
        return h;
    },

    /**
     * APIMethod: dispose
     * remove the widget from the DOM
     */
    dispose: function(){
        var el = document.id(this.addable) || document.id(this.domObj);
        if (el) {
            el.dispose();
        }
    },

    /**
     * Method: cleanup
     * destroy the widget and clean up any potential memory leaks
     */
    cleanup: function(){
        if ($defined(this.domObj)) {
            this.domObj.eliminate('jxWidget');
            this.domObj.destroy();
        }
        if ($defined(this.addable)) {
            this.addable.destroy();
        }
        if ($defined(this.domA)) {
            this.domA.destroy();
        }
        if ($defined(this.classes)) {
          this.classes.each(function(v, k) {
            this[k] = null;
          }, this);
        }
        this.elements.empty();
        this.elements = null;
        this.parent();
    },

    /**
     * Method: render
     * render the widget, internal function called by the framework.
     */
    render: function() {
        this.elements = this.processElements(this.options.template,
            this.classes);
        if ($defined(this.domObj)) {
          if ( $defined(this.options.id)) {
            this.domObj.set('id', this.options.id);
          }
          //TODO: Should we autogenerate an id when one is not provided? like so...
          // this.domObj.set('id',this.generateId());
          this.domObj.store('jxWidget', this);
        }
    },

    /**
     * Property: elements
     * a hash of elements extracted by processing the widget template
     */
    elements: null,

    /**
     * Method: processElements
     * process the template of the widget and populate the elements hash
     * with any objects.  Also set any object references based on the classes
     * hash.
     */
    processElements: function(template, classes) {
        var keys = classes.getValues();
        elements = this.processTemplate(template, keys);
        classes.each(function(value, key) {
            if (key != 'elements' && elements.get(value)) {
                this[key] = elements.get(value);
            }
        }, this);
        return elements;
    },

    /**
     * APIMethod: isBusy
     * indicate if the widget is currently busy or not
     *
     * Returns:
     * {Boolean} true if busy, false otherwise.
     */
    isBusy: function() {
      return this.busy;
    },

    /**
     * APIMethod: setBusy
     * set the busy state of the widget
     *
     * Parameters:
     * busy         - {Boolean} true to set the widget as busy, false to set it as idle.
     * message      - {String||Jx Localized Object} (Optional) set a custom message directly
     *                next to the loading icon. Default is {set:'Jx',key:'widget',value:'busyMessage'}
     * forceMessage - {Boolean} force displaying a message for larger areas than 60px of height
     */
    setBusy: function(state, message, forceMessage) {
      if (this.busy == state) {
        return;
      }
      var options = this.options,
          z,
          size,
          opts,
          domObj = this.domObj;
      message = $defined(message) ? message : {
        set:'Jx',
        key:'widget',
        value:'busyMessage'
      };
      forceMessage = $defined(forceMessage) ? forceMessage : false;
      this.busy = state;
      this.fireEvent('busy', state);
      if (state) {
        if (options.busyClass) {
          domObj.addClass(options.busyClass);
        }
        if (options.busyMask && domObj.spin) {
          /* put the spinner above the element in the z-index */
          z = Jx.getNumber(domObj.getStyle('z-index'));
          opts = {
            style: {
              'z-index': z+1
            }
          };
          /* switch to the small size if the element is less than
           * 60 pixels high
           */
          size = domObj.getBorderBoxSize();
          if (size.height < 60 || forceMessage) {
            opts['class'] = 'jxSpinner jxSpinnerSmall';
            opts.img = null;
            opts.message = new Element('p',{
              'class':'jxSpinnerMessage',
              html: '<span class="jxSpinnerImage"></span>'+this.getText(message)
            });
          }
          opts = $merge(options.busyMask, opts);
          domObj.get('spinner', opts).show(!options.busyMask.fx);
        }
      } else {
        if (options.busyClass) {
          domObj.removeClass(options.busyClass);
        }
        if (options.busyMask && this.domObj.unspin) {
          domObj.get('spinner').hide(!options.busyMask.fx);
        }
      }
    },

    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - {string} the language being changed to or that had it's data set of
     *    translations changed.
     */
    changeText: function (lang) {
        //if the mask is being used then recreate it. The code will pull
        //the new text automatically
        if (this.busy) {
            this.setBusy(false);
            this.setBusy(true);
        }
    },

    /**
     * APIMethod: stack
     * stack this widget in the z-index of the DOM relative to other stacked
     * objects.
     *
     * Parameters:
     * el - {DOMElement} optional, the element to stack.  By default, the
     * element to stack is the one returned by the toElement method which
     * is typically this.domObj unless the method has been overloaded.
     */
    stack: function(el) {
      Jx.Stack.stack(el || document.id(this));
    },

    /**
     * APIMethod: unstack
     * remove this widget from the stack.
     *
     * Parameters:
     * el - {DOMElement} optional, the element to unstack.  By default, the
     * element to unstack is the one returned by the toElement method which
     * is typically this.domObj unless the method has been overloaded.
     */
    unstack: function(el) {
      Jx.Stack.unstack(el = el || document.id(this));
    }
});


/**
 * It seems AIR never returns an XHR that "fails" by not finding the
 * appropriate file when run in the application sandbox and retrieving a local
 * file. This affects Jx.ContentLoader in that a "failed" event is never fired.
 *
 * To fix this, I've added a timeout that waits about 10 seconds or so in the code above
 * for the XHR to return, if it hasn't returned at the end of the timeout, we cancel the
 * XHR and fire the failure event.
 *
 * This code only gets added if we're in AIR.
 */
if (Jx.isAir){
    Jx.Widget.implement({
        /**
         * Method: checkRequest
         * Is fired after a delay to check the request to make sure it's not
         * failing in AIR.
         */
        checkRequest: function(){
            if (this.req.xhr.readyState === 1) {
                //we still haven't gotten the file. Cancel and fire the
                //failure
                $clear(this.reqTimeout);
                this.req.cancel();
                this.contentIsLoaded = true;
                this.fireEvent('contentLoadFailed', this);
            }
        }
    });
}/*
---

name: Jx.Selection

description: A class to manage selection across multiple list objects

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Selection]

...
 */
// $Id$
/**
 * Class: Jx.Selection
 *
 * Manage selection of objects.
 *
 * Example:
 * (code)
 * var selection = new Jx.Selection();
 * (end)
 *
 * Events:
 * select - fired when an item is added to the selection.  This event may be
 *    changed by passing the eventToFire option when creating the selection
 *    object.
 * unselect - fired when an item is removed from the selection.  This event
 *    may be changed by passing the eventToFire option when creating the
 *    selection object.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */


Jx.Selection = new Class({
    Family: 'Jx.Selection',
    Extends: Jx.Object,
    options: {
        /**
         * Option: eventToFire
         * Allows the developer to change the event that is fired in case one
         * object is using multiple selectionManager instances.  The default
         * is to use 'select' and 'unselect'.  To modify the event names,
         * pass different values:
         * (code)
         * new Jx.Selection({
         *   eventToFire: {
         *     select: 'newSelect',
         *     unselect: 'newUnselect'
         *   }
         * });
         * (end)
         */
        eventToFire: {
            select: 'select',
            unselect: 'unselect'
        },
        /**
         * APIProperty: selectClass
         * the CSS class name to add to the wrapper element when it is
         * selected
         */
        selectClass: 'jxSelected',
        /**
         * Option: selectMode
         * {string} default single.  May be single or multiple.  In single
         * mode only one item may be selected.  Selecting a new item will
         * implicitly unselect the currently selected item.
         */
        selectMode: 'single',
        /**
         * Option: selectToggle
         * {Boolean} Default true.  Selection of a selected item will unselect
         * it.
         */
        selectToggle: true,
        /**
         * Option: minimumSelection
         * {Integer} Default 0.  The minimum number of items that must be
         * selected.  If set to a number higher than 0, items added to a list
         * are automatically selected until this minimum is met.  The user may
         * not unselect items if unselecting them will drop the total number
         * of items selected below the minimum.
         */
        minimumSelection: 0
    },

    /**
     * Property: selection
     * {Array} an array holding the current selection
     */
    selection: null,

    /**
     * Constructor: Jx.Selection
     * create a new instance of Jx.Selection
     *
     * Parameters:
     * options - {Object} options for the new instance
     */
    init: function () {
        this.selection = [];
        this.parent();
    },

    cleanup: function() {
      this.selection = null;
      this.parent();
    },

    /**
     * APIMethod: defaultSelect
     * select an item if the selection does not yet contain the minimum
     * number of selected items.  Uses <Jx.Selection::select> to select
     * the item, so the same criteria is applied to the item if it is
     * to be selected.
     */
    defaultSelect: function(item) {
        if (this.selection.length < this.options.minimumSelection) {
            this.select(item);
        }
    },

    /**
     * APIMethod: select
     * select an item.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     */
    select: function (item) {
        var options = this.options,
            selection = this.selection;
        item = document.id(item);
        if (options.selectMode === 'multiple') {
            if (selection.contains(item)) {
                this.unselect(item);
            } else {
                document.id(item).addClass(options.selectClass);
                selection.push(item);
                this.fireEvent(options.eventToFire.select, item);
            }
        } else if (options.selectMode == 'single') {
            if (!this.selection.contains(item)) {
                document.id(item).addClass(options.selectClass);
                selection.push(item);
                if (selection.length > 1) {
                    this.unselect(selection[0]);
                }
                this.fireEvent(options.eventToFire.select, item);
            } else {
                if (options.selectToggle) {
                  this.unselect(item);
                }
            }
        }
    },

    /**
     * APIMethod: unselect
     * remove an item from the selection.  The item must already be in the
     * selection.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     */
    unselect: function (item) {
        var selection = this.selection,
            options = this.options;
        if (selection.contains(item) &&
            selection.length > options.minimumSelection) {
            document.id(item).removeClass(options.selectClass);
            selection.erase(item);
            this.fireEvent(options.eventToFire.unselect, [item, this]);
        }
    },

    /**
     * APIMethod: selected
     * returns the items in the current selection.
     *
     * Returns:
     * {Array} an array of DOM elements in the current selection
     */
    selected: function () {
        return this.selection;
    },

    /**
     * APIMethod: isSelected
     * test if an item is in the current selection.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     *
     * Returns:
     * {Boolean} true if the current selection contains the item, false
     * otherwise
     */
    isSelected: function(item) {
        return this.selection.contains(item);
    }
});/*
---

name: Jx.List

description: A class that is used to manage lists of DOM elements

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Selection

provides: [Jx.List]

...
 */
// $Id$
/**
 * Class: Jx.List
 *
 * Manage a list of DOM elements and provide an API and events for managing
 * those items within a container.  Works with Jx.Selection to manage
 * selection of items in the list.  You have two options for managing
 * selections.  The first, and default, option is to specify select: true
 * in the constructor options and any of the <Jx.Selection> options as well.
 * This will create a default Jx.Selection object to manage selections.  The
 * second option is to pass a Jx.Selection object as the third constructor
 * argument.  This allows sharing selection between multiple lists.
 *
 * Example:
 * (code)
 * var list = new Jx.List('container',{
 *   hover: true,
 *   select: true,
 *   onSelect: function(el) {
 *     alert(el.get('html'));
 *   }
 * });
 * list.add(new Element('li', {html:'1'}));
 * list.add(new Element('li', {html:'2'}));
 * list.add(new Element('li', {html:'3'}));
 *
 * (end)
 *
 * Events:
 * add - fired when an item is added
 * remove - fired when an item is removed
 * mouseenter - fired when the user mouses over an element
 * mouseleave - fired when the user mouses out of an element
 * select - fired when an item is selected
 * unselect - fired when an item is selected
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.List = new Class({
    Family: 'Jx.List',
    Extends: Jx.Object,
    /**
     * Constructor: Jx.List
     * create a new instance of Jx.List
     *
     * Parameters:
     * container - {Mixed} an element reference or id of an element that will
     * contain the items in the list
     * options - {Object} an object containing optional parameters
     * selection - {<Jx.Selection>} null or a Jx.Selection object. If the
     * select option is set to true, then list will use this selection object
     * to track selections or create its own if no selection object is
     * supplied.
     */
    parameters: ['container', 'options', 'selection'],
    /* does this object own the selection object (and should clean it up) */
    ownsSelection: false,
    /**
     * APIProperty: container
     * the element that will contain items as they are added
     */
    container: null,
    /**
     * APIProperty: selection
     * <Jx.Selection> a selection object if selection is enabled
     */
    selection: null,
    options: {
        /**
         * Option: items
         * an array of items to add to the list right away
         */
        items: null,
        /**
         * Option: hover
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined hoverClass if set and mouseenter/mouseleave
         * events will be emitted when the user hovers over and out of elements
         */
        hover: false,
        /**
         * Option: hoverClass
         * the CSS class name to add to the wrapper element when the mouse is
         * over an item
         */
        hoverClass: 'jxHover',

        /**
         * Option: press
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined pressClass if set and mousedown/mouseup
         * events will be emitted when the user clicks on elements
         */
        press: false,
        /**
         * Option: pressedClass
         * the CSS class name to add to the wrapper element when the mouse is
         * down on an item
         */
        pressClass: 'jxPressed',

        /**
         * Option: select
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined selectClass if set and select/unselect events
         * will be emitted when items are selected and unselected.  For other
         * selection objects, see <Jx.Selection>
         */
        select: false
    },

    /**
     * Method: init
     * internal method to initialize this object
     */
    init: function() {
        this.container = document.id(this.options.container);
        this.container.store('jxList', this);

        var target = this,
            options = this.options,
            isEnabled = function(el) {
                var item = el.retrieve('jxListTargetItem') || el;
                return !item.hasClass('jxDisabled');
            },
            isSelectable = function(el) {
                var item = el.retrieve('jxListTargetItem') || el;
                return !item.hasClass('jxUnselectable');
            };
        this.bound = $merge(this.bound, {
            mousedown: function() {
                if (isEnabled(this)) {
                    this.addClass(options.pressClass);
                    target.fireEvent('mousedown', this, target);
                }
            },
            mouseup: function() {
                if (isEnabled(this)) {
                    this.removeClass(options.pressClass);
                    target.fireEvent('mouseup', this, target);
                }
            },
            mouseenter: function() {
                if (isEnabled(this)) {
                    this.addClass(options.hoverClass);
                    target.fireEvent('mouseenter', this, target);
                }
            },
            mouseleave: function() {
                if (isEnabled(this)) {
                    this.removeClass(options.hoverClass);
                    target.fireEvent('mouseleave', this, target);
                }
            },
            keydown: function(e) {
                if (e.key == 'enter' && isEnabled(this)) {
                    this.addClass('jxPressed');
                }
            },
            keyup: function(e) {
                if (e.key == 'enter' && isEnabled(this)) {
                    this.removeClass('jxPressed');
                }
            },
            click: function (e) {
                if (target.selection &&
                    isEnabled(this) &&
                    isSelectable(this)) {
                    target.selection.select(this, target);
                }
                target.fireEvent('click', this, target);
            },
            select: function(item) {
                if (isEnabled(item)) {
                    var itemTarget = item.retrieve('jxListTargetItem') || item;
                    target.fireEvent('select', itemTarget);
                }
            },
            unselect: function(item) {
                if (isEnabled(item)) {
                    var itemTarget = item.retrieve('jxListTargetItem') || item;
                    target.fireEvent('unselect', itemTarget);
                }
            },
            contextmenu: function(e) {
              var cm = this.retrieve('jxContextMenu');
              if (cm) {
                cm.show(e);
                this.removeClass(options.pressClass);
              }
              e.stop();
            }
        });

        if (options.selection) {
            this.setSelection(options.selection);
            options.select = true;
        } else if (options.select) {
            this.selection = new Jx.Selection(options);
            this.ownsSelection = true;
        }

        if ($defined(options.items)) {
            this.add(options.items);
        }
    },

    /**
     * Method: cleanup
     * destroy the list and release anything it references
     */
    cleanup: function() {
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents();
            this.selection.destroy();
        }
        this.setSelection(null);
        this.container.eliminate('jxList');
        var bound = this.bound;
        bound.mousedown=null;
        bound.mouseup=null;
        bound.mouseenter=null;
        bound.mouseleave=null;
        bound.keydown=null;
        bound.keyup=null;
        bound.click=null;
        bound.select=null;
        bound.unselect=null;
        bound.contextmenu=null;
        this.parent();
    },

    /**
     * APIMethod: add
     * add an item to the list of items at the specified position
     *
     * Parameters:
     * item - {mixed} the object to add, a DOM element or an
     * object that provides a getElement method.  An array of items may also
     * be provided.  All items are inserted sequentially at the indicated
     * position.
     * position - {mixed} optional, the position to add the element, either
     * an integer position in the list or another item to place this item
     * after
     */
    add: function(item, position) {
        if (Jx.type(item) == 'array') {
            item.each(function(what){
              this.add(what, position);
            }.bind(this) );
            return;
        }
        /* the element being wrapped */
        var el = document.id(item),
            target = el.retrieve('jxListTarget') || el,
            bound = this.bound,
            options = this.options,
            container = this.container;
        if (target) {
            target.store('jxListTargetItem', el);
            target.addEvents({
              contextmenu: this.bound.contextmenu
            });
            if (options.press && options.pressClass) {
                target.addEvents({
                    mousedown: bound.mousedown,
                    mouseup: bound.mouseup,
                    keyup: bound.keyup,
                    keydown: bound.keydown
                });
            }
            if (options.hover && options.hoverClass) {
                target.addEvents({
                    mouseenter: bound.mouseenter,
                    mouseleave: bound.mouseleave
                });
            }
            if (this.selection) {
                target.addEvents({
                    click: bound.click
                });
            }
            if ($defined(position)) {
                if ($type(position) == 'number') {
                    if (position < container.childNodes.length) {
                        el.inject(container.childNodes[position],'before');
                    } else {
                        el.inject(container, 'bottom');
                    }
                } else if (container.hasChild(position)) {
                    el.inject(position,'after');
                }
                this.fireEvent('add', item, this);
            } else {
                el.inject(container, 'bottom');
                this.fireEvent('add', item, this);
            }
            if (this.selection) {
                this.selection.defaultSelect(el);
            }
        }
    },
    /**
     * APIMethod: remove
     * remove an item from the list of items
     *
     * Parameters:
     * item - {mixed} the item to remove or the index of the item to remove.
     * An array of items may also be provided.
     *
     * Returns:
     * {mixed} the item that was removed or null if the item is not a member
     * of this list.
     */
    remove: function(item) {
        var el = document.id(item),
            target;
        if (el && this.container.hasChild(el)) {
            this.unselect(el, true);
            el.dispose();
            target = el.retrieve('jxListTarget') || el;
            target.removeEvents(this.bound);
            this.fireEvent('remove', item, this);
            return item;
        }
        return null;
    },
    /**
     * APIMethod: replace
     * replace one item with another
     *
     * Parameters:
     * item - {mixed} the item to replace or the index of the item to replace
     * withItem - {mixed} the object, DOM element, Jx.Object or an object
     * implementing getElement to add
     *
     * Returns:
     * {mixed} the item that was removed
     */
    replace: function(item, withItem) {
        if (this.container.hasChild(item)) {
            this.add(withItem, item);
            this.remove(item);
        }
    },
    /**
     * APIMethod: indexOf
     * find the index of an item in the list
     *
     * Parameters:
     * item - {mixed} the object, DOM element, Jx.Object or an object
     * implementing getElement to find the index of
     *
     * Returns:
     * {integer} the position of the item or -1 if not found
     */
    indexOf: function(item) {
        return $A(this.container.childNodes).indexOf(item);
    },
    /**
     * APIMethod: count
     * returns the number of items in the list
     */
    count: function() {
        return this.container.childNodes.length;
    },
    /**
     * APIMethod: items
     * returns an array of the items in the list
     */
    items: function() {
        return $A(this.container.childNodes);
    },
    /**
     * APIMethod: each
     * applies the supplied function to each item
     *
     * Parameters:
     * func - {function} the function to apply, it will receive the item and
     * index of the item as parameters
     * context - {object} the context to execute the function in, null by
     * default.
     */
    each: function(f, context) {
        $A(this.container.childNodes).each(f, context);
    },
    /**
     * APIMethod: select
     * select an item
     *
     * Parameters:
     * item - {mixed} the object to select, a DOM element, a Jx.Object, or an
     * object that provides a getElement method.  An array of items may also be
     * provided.
     */
    select: function(item) {
        if (this.selection) {
            this.selection.select(item);
        }
    },
    /**
     * APIMethod: unselect
     * unselect an item or items
     *
     * Parameters:
     * item - {mixed} the object to select, a DOM element, a Jx.Object, or an
     * object that provides a getElement method.  An array of elements may also
     * be provided.
     * force - {Boolean} force deselection even if this violates the minimum
     * selection constraint (used internally when removing items)
     */
    unselect: function(item, force) {
        if (this.selection) {
            this.selection.unselect(item);
        }
    },
    /**
     * APIMethod: selected
     * returns the selected item or items
     *
     * Returns:
     * {mixed} the selected item or an array of selected items
     */
    selected: function() {
        return this.selection ? this.selection.selected : [];
    },
    /**
     * APIMethod: empty
     * clears all of the items from the list
     */
    empty: function(){
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
    },
    /**
     * APIMethod: setSelection
     * sets the <Jx.Selection> object that this list will use for selection
     * events.
     *
     * Parameters:
     * {<Jx.Selection>} the selection object, or null to remove it.
     */
    setSelection: function(selection) {
        var sel = this.selection;
        if (sel == selection) return;

        if (sel) {
            sel.removeEvents(this.bound);
            if (this.ownsSelection) {
                sel.destroy();
                this.ownsSelection = false;
            }
        }

        this.selection = selection;
        if (selection) {
            selection.addEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
        }
    }

});/*
---

name: Jx.Stack

description: A singleton object for managing a global z-index stack for widgets that need to order themselves in the z-index of the page relative to other such widgets.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Stack]

...
 */
/**
 * Class: Jx.Stack
 * Manage the zIndex of widgets
 *
 * This is a singleton and should be called directly, like so:
 *
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2010 Paul Spencer
 *
 * This file is licensed under an MIT style license
 */
Jx.Stack = new(new Class({
  /**
   * Property: els
   * {Array} the elements in the stack
   */
  els: [],

  /**
   * Property: base
   * {Integer} the base z-index value of the first element in the stack
   */
  base: 1000,

  /**
   * Property: increment
   * {Integer} the amount to increment the z-index between elements of the
   * stack
   */
  increment: 100,

  /**
   * APIMethod: stack
   * push an element onto the stack and set its z-index appropriately
   *
   * Parameters:
   * el - {DOMElement} a DOM element to push on the stack
   */
  stack: function(el) {
    this.unstack(el);
    this.els.push(el);
    this.setZIndex(el, this.els.length-1);
  },

  /**
   * APIMethod: unstack
   * pull an element off the stack and reflow the z-index of the remaining
   * elements in the stack if necessary
   *
   * Parameters:
   * el - {DOMElement} the DOM element to pull off the stack
   */
  unstack: function(el) {
    var elements = this.els;
    if (elements.contains(el)) {
      el.setStyle('z-index', '');
      var idx = elements.indexOf(el);
      elements.erase(el);
      for (var i=idx; i<elements.length; i++) {
        this.setZIndex(elements[i], i);
      }
    }
  },

  /**
   * Method: setZIndex
   * set the z-index of an element based on its position in the stack
   *
   * Parameters:
   * el - {DOMElement} the element to set the z-index for
   * idx - {Integer} optional, the index to assume for this object
   */
  setZIndex: function(obj, idx) {
    idx = idx || this.els.indexOf(obj);
    if (idx !== false) {
      document.id(obj).setStyle('z-index', this.base + (idx*this.increment));
    }
  }

}))();/*
---
name: Locale.German

description: Default translations of text strings used in JX for German (Germany) (de-DE)

license: MIT-style license.

requires:
 - More/Lang

provides: [Locale.German]

...
 */

MooTools.lang.set('de-DE', 'Date', {
  // need to overwrite 'M&auml;rz' to 'März' for jx.select fields
  months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
});

MooTools.lang.set('de-DE', 'Jx', {

	'widget': {
		busyMessage: 'Arbeite ...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'Notiz schließen'
	},
	progressbar: {
		messageText: 'Lade...',
		progressText: '{progress} von {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Durchsuchen...'
	},
	'formatter.boolean': {
		'true': 'Ja',
		'false': 'Nein'
	},
	'formatter.currency': {
		sign: '€'
	},
	'formatter.number': {
		decimalSeparator: ',',
    thousandsSeparator: '.'
	},
	splitter: {
		barToolTip: 'Ziehen Sie diese Leiste um die Größe zu verändern'
	},
	panelset: {
		barToolTip: 'Ziehen Sie diese Leiste um die Größe zu verändern'
	},
	panel: {
        collapseTooltip: 'Panel ein-/ausklappen', //colB
        collapseLabel: 'Einklappen',  //colM
        expandLabel: 'Ausklappen', //colM
        maximizeTooltip: 'Panel maximieren',
        maximizeLabel: 'maximieren',
        restoreTooltip: 'Panel wieder herstellen', //maxB
        restoreLabel: 'wieder herstellen', //maxM
        closeTooltip: 'Panel schließen', //closeB
        closeLabel: 'Schließen' //closeM
	},
	confirm: {
		affirmativeLabel: 'Ja',
    negativeLabel: 'Nein'
	},
	dialog: {
		label: 'Neues Fenster'
	},
	message: {
		okButton: 'Ok'
	},
	prompt: {
		okButton: 'Ok',
		cancelButton: 'Abbrechen'
	},
	upload: {
		buttonText: 'Dateien hochladen'
	},
	'plugin.resize': {
	  tooltip: 'Klicken um Größe zu verändern. Doppelklick für automatische Anpassung.'
	},
  'plugin.editor': {
    submitButton: 'Speichern',
    cancelButton: 'Abbrechen'
  }
});
/*
---

name: Locale.Russian

description: Default translations of text strings used in JX for Russia (Russia) (ru-RU)

license: MIT-style license.

requires:
 - More/Lang

provides: [Locale.Russian]

...
 */
MooTools.lang.set('ru-RU-unicode', 'Jx', {
	
	'widget': {
		busyMessage: 'Обработка...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'закрыть это сообщение'
	},
	progressbar: {
		messageText: 'Загрузка...',
		progressText: '{progress} из {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Выбрать...'
	},
	'formatter.boolean': {
		'true': 'Да',
		'false': 'Нет'
	},
	'formatter.currency': {
		sign: 'р.'
	},
	'formatter.number': {
		decimalSeparator: ',',
    thousandsSeparator: ' '
	},
	splitter: {
		barToolTip: 'потяни, чтобы изменить размер'
	},
	panelset: {
		barToolTip: 'потяни, чтобы изменить размер'
	},
	panel: {
		collapseTooltip: 'Свернуть/Развернуть Панель',
    collapseLabel: 'Свернуть',
    expandLabel: 'Развернуть',
    maximizeTooltip: 'Увеличить Панель',
    maximizeLabel: 'Увеличить',
    restoreTooltip: 'Восстановить Панель',
    restoreLabel: 'Восстановить',
    closeTooltip: 'Закрыть Панель',
    closeLabel: 'Закрыть'
	},
	confirm: {
		affirmativeLabel: 'Да',
    negativeLabel: 'Нет'
	},
	dialog: {
		resizeToolTip: 'Изменить размер'
	},
	message: {
		okButton: 'Ок'
	},
	prompt: {
		okButton: 'Ок',
		cancelButton: 'Отмена'
	},
	upload: {
		buttonText: 'Загрузка файла'
	},
	'plugin.resize': {
	  tooltip: 'Потяни, чтобы изменить, двойной щелчок для авто размера.'
	},
  'plugin.editor': {
    submitButton: 'Сохранить',
    cancelButton: 'Отмена'
  }
});/*
---

name: Jx.Record

description: The basic record implementation. A store uses records to handle and manipulate data.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Record]

...
 */
// $Id$
/**
 * Class: Jx.Record
 *
 * Extends: <Jx.Object>
 *
 * This class is used as a representation (or container) for a single row
 * of data in a <Jx.Store>. It is not usually directly instantiated by the
 * developer but rather by the store itself.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Record = new Class({

    Extends: Jx.Object,
    Family: 'Jx.Record',

    options: {
        /**
         * Option: separator
         * The separator to pass to the comparator
         * constructor (<Jx.Compare>) - defaults to '.'
         */
        separator : '.',

        primaryKey: null
    },
    /**
     * Property: data
     * The data for this record
     */
    data: null,
    /**
     * Property: state
     * used to determine the state of this record. When not null (meaning no
     * changes were made) this should be one of
     *
     * - Jx.Record.UPDATE
     * - Jx.Record.DELETE
     * - Jx.Record.INSERT
     */
    state: null,
    /**
     * Property: columns
     * Holds a reference to the columns for this record. These are usually
     * passed to the record from the store. This should be an array of objects
     * where the objects represent the columns. The object should take the form:
     *
     * (code)
     * {
     *     name: <column name>,
     *     type: <column type>,
     *     ..additional options required by the record implementation...
     * }
     * (end)
     *
     * The type of the column should be one of alphanumeric, numeric, date,
     * boolean, or currency.
     */
    columns: null,

    parameters: ['store', 'columns', 'data', 'options'],

    init: function () {
        this.parent();
        if ($defined(this.options.columns)) {
            this.columns = this.options.columns;
        }

        if ($defined(this.options.data)) {
            this.processData(this.options.data);
        } else {
            this.data = new Hash();
        }

        if ($defined(this.options.store)) {
            this.store = this.options.store;
        }

    },
    /**
     * APIMethod: get
     * returns the value of the requested column. Can be programmed to handle
     * pseudo-columns (such as the primaryKey column implemented in this base
     * record).
     *
     * Parameters:
     * column - the string, index, or object of the requested column
     */
    get: function (column) {
        var type = Jx.type(column);
        if (type !== 'object') {
            if (column === 'primaryKey') {
                column = this.resolveCol(this.options.primaryKey);
            } else {
                column = this.resolveCol(column);
            }
        }
        if (this.data.has(column.name)) {
            return this.data.get(column.name);
        } else {
            return null;
        }
    },
    /**
     * APIMethod: set
     * Sets a given value into the requested column.
     *
     *  Parameters:
     *  column - the object, index, or string name of the target column
     *  data - the data to add to the column
     */
    set: function (column, data) {
        var type = Jx.type(column),
            oldValue;
        if (type !== 'object') {
            column = this.resolveCol(column);
        }

        if (!$defined(this.data)) {
            this.data = new Hash();
        }

        oldValue = this.get(column);
        this.data.set(column.name, data);
        this.state = Jx.Record.UPDATE;
        return [column.name, oldValue, data];
        //this.store.fireEvent('storeColumnChanged', [this, column.name, oldValue, data]);

    },
    /**
     * APIMethod: equals
     * Compares the value of a particular column with a given value
     *
     * Parameters:
     * column - the column to compare with (either column name or index)
     * value - the value to compare to.
     *
     * Returns:
     * True | False depending on the outcome of the comparison.
     */
    equals: function (column, value) {
        if (column === 'primaryKey') {
            column = this.resolveCol(this.options.primaryKey);
        } else {
            column = this.resolveCol(column);
        }
        if (!this.data.has(column.name)) {
            return null;
        } else {
            if (!$defined(this.comparator)) {
                this.comparator = new Jx.Compare({
                    separator : this.options.separator
                });
            }
            var fn = this.comparator[column.type].bind(this.comparator);
            return (fn(this.get(column), value) === 0);
        }
    },
    /**
     * Method: processData
     * This method takes the data passed in and puts it into the form the
     * record needs it in. This default implementation does nothing but
     * assign the data to the data property but it can be overridden in
     * subclasses to massge the data in any way needed.
     *
     * Parameters:
     * data - the data to process
     */
    processData: function (data) {
        this.data = $H(data);
    },

    /**
     * Method: resolveCol
     * Determines which column is being asked for and returns it.
     *
     * Parameters:
     * col - a number referencing a column in the store
     *
     * Returns:
     * the column object referred to
     */
    resolveCol : function (col) {
        var t = Jx.type(col);
        if (t === 'number') {
            col = this.columns[col];
        } else if (t === 'string') {
            this.columns.each(function (column) {
                if (column.name === col) {
                    col = column;
                }
            }, this);
        }
        return col;
    },
    /**
     * APIMethod: asHash
     * Returns the data for this record as a Hash
     */
    asHash: function() {
        return this.data;
    }
});

Jx.Record.UPDATE = 1;
Jx.Record.DELETE = 2;
Jx.Record.INSERT = 3;/*
---

name: Jx.Store

description: An implementation of a basic data store.

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Record

provides: [Jx.Store]

...
 */
// $Id$
/**
 * Class: Jx.Store
 *
 * Extends: <Jx.Object>
 *
 * This class is the  store. It keeps track of data. It
 * allows adding, deleting, iterating, sorting etc...
 *
 * For the most part the store is pretty "dumb" meaning it
 * starts with very limited functionality. Actually, it can't
 * even load data by itself. Instead, it needs to have protocols,
 * strategies, and a record class passed to it that it can use.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Store = new Class({

    Family: 'Jx.Store',
    Extends: Jx.Object,

    options: {
        /**
         * Option: id
         * the identifier for this store
         */
        id : null,
        /**
         * Option: columns
         * an array listing the columns of the store in order of their
         * appearance in the data object formatted as an object
         *      {name: 'column name', type: 'column type'}
         * where type can be one of alphanumeric, numeric, date, boolean,
         * or currency.
         */
        columns : [],
        /**
         * Option: protocol
         * The protocol to use for communication in this store. The store
         * itself doesn't actually use it but it is accessed by the strategies
         * to do their work. This option is required and the store won't work
         * without it.
         */
        protocol: null,
        /**
         * Option: strategies
         * This is an array of instantiated strategy objects that will work
         * on this store. They provide many services such as loading data,
         * paging data, saving, and sorting (and anything else you may need
         * can be written). If none are passed in it will use the default
         * Jx.Store.Strategy.Full
         */
        strategies: null,
        /**
         * Option: record
         * This is a Jx.Store.Record instance or one of its subclasses. This is
         * the class that will be used to hold each individual record in the
         * store. Don't pass in a instance of the class but rather the class
         * name itself. If none is passed in it will default to Jx.Record
         */
        record: null,
        /**
         * Option: recordOptions
         * Options to pass to each record as it's created.
         */
        recordOptions: {
            primaryKey: null
        }
    },

    /**
     * Property: data
     * Holds the data for this store
     */
    data : null,
    /**
     * Property: index
     * Holds the current position of the store relative to the data and the pageIndex.
     * Zero-based index.
     */
    index : 0,
    /**
     * APIProperty: id
     * The id of this store.
     */
    id : null,
    /**
     * Property: loaded
     * Tells whether the store has been loaded or not
     */
    loaded: false,
    /**
     * Property: ready
     * Used to determine if the store is completely initialized.
     */
    ready: false,
    
    /**
     * Property: deleted
     * track deleted records before they are purged
     */
    deleted: null,

    /**
     * Method: init
     * initialize the store, should be called by sub-classes
     */
    init: function () {
        this.parent();

        this.deleted = [];
        
        if ($defined(this.options.id)) {
            this.id = this.options.id;
        }

        if (!$defined(this.options.protocol)) {
            this.ready = false;
            return;
        } else {
            this.protocol = this.options.protocol;
        }

        this.strategies = new Hash();

        if ($defined(this.options.strategies)) {
            this.options.strategies.each(function(strategy){
                this.addStrategy(strategy);
            },this);
        } else {
            var strategy = new Jx.Store.Strategy.Full();
            this.addStrategy(strategy);
        }

        if ($defined(this.options.record)) {
            this.record = this.options.record;
        } else {
            this.record = Jx.Record;
        }


    },

    /**
     * Method: cleanup
     * avoid memory leaks when a store is destroyed, should be called
     * by sub-classes if overridden
     */
    cleanup: function () {
        this.strategies.each(function(strategy){
            strategy.destroy();
        },this);
        this.strategies = null;
        this.protocol.destroy();
        this.protocol = null;
        this.record = null;
    },
    /**
     * APIMethod: getStrategy
     * returns the named strategy if it is present, null otherwise.
     *
     * Parameters:
     * name - the name of the strategy we're looking for
     */
    getStrategy: function (name) {
        if (this.strategies.has(name)) {
            return this.strategies.get(name);
        }
        return null;
    },
    /**
     * APIMethod: addStrategy
     * Allows the addition of strategies after store initialization. Handy to
     * have if some other class needs a strategy that is not present.
     *
     * Parameters:
     * strategy - the strategy to add to the store
     */
    addStrategy: function (strategy) {
        this.strategies.set(strategy.name, strategy);
        strategy.setStore(this);
        strategy.activate();
    },
    /**
     * APIMethod: load
     * used to load the store. It simply fires an event that the strategies
     * are listening for.
     *
     * Parameters:
     * params - a hash of parameters passed to the strategy for determining
     *     what records to load.
     */
    load: function (params) {
        this.fireEvent('storeLoad', params);
    },
    /**
     * APIMethod: empty
     * Clears the store of data
     */
    empty: function () {
        if ($defined(this.data)) {
            this.data.empty();
        }
    },

    /**
     * APIMethod: hasNext
     * Determines if there are more records past the current
     * one.
     *
     * Returns: true | false (Null if there's a problem)
     */
    hasNext : function () {
        if ($defined(this.data)) {
            return this.index < this.data.length - 1;
        }
        return null;
    },

    /**
     * APIMethod: hasPrevious
     * Determines if there are records before the current
     * one.
     *
     * Returns: true | false
     */
    hasPrevious : function () {
        if ($defined(this.data)) {
            return this.index > 0;
        }
        return null;
    },

    /**
     * APIMethod: valid
     * Tells us if the current index has any data (i.e. that the
     * index is valid).
     *
     * Returns: true | false
     */
    valid : function () {
        return ($defined(this.data) && $defined(this.data[this.index]));
    },

    /**
     * APIMethod: next
     * Moves the store to the next record
     *
     * Returns: nothing | null if error
     */
    next : function () {
        if ($defined(this.data)) {
            this.index++;
            if (this.index === this.data.length) {
                this.index = this.data.length - 1;
            }
            this.fireEvent('storeMove', this);
            return true;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: previous
     * moves the store to the previous record
     *
     * Returns: nothing | null if error
     *
     */
    previous : function () {
        if ($defined(this.data)) {
            this.index--;
            if (this.index < 0) {
                this.index = 0;
            }
            this.fireEvent('storeMove', this);
            return true;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: first
     * Moves the store to the first record
     *
     * Returns: nothing | null if error
     *
     */
    first : function () {
        if ($defined(this.data)) {
            this.index = 0;
            this.fireEvent('storeMove', this);
            return true;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: last
     * Moves to the last record in the store
     *
     * Returns: nothing | null if error
     */
    last : function () {
        if ($defined(this.data)) {
            this.index = this.data.length - 1;
            this.fireEvent('storeMove', this);
            return true;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: count
     * Returns the number of records in the store
     *
     * Returns: an integer indicating the number of records in the store or null
     * if there's an error
     */
    count : function () {
        if ($defined(this.data)) {
            return this.data.length;
        }
        return null;
    },

    /**
     * APIMethod: getPosition
     * Tells us where we are in the store
     *
     * Returns: an integer indicating the position in the store or null if
     * there's an error
     */
    getPosition : function () {
        if ($defined(this.data)) {
            return this.index;
        }
        return null;
    },

    /**
     * APIMethod: moveTo
     * Moves the index to a specific record in the store
     *
     * Parameters:
     * index - the record to move to
     *
     * Returns: true - if successful false - if not successful null - on error
     */
    moveTo : function (index) {
        if ($defined(this.data) && index >= 0 && index < this.data.length) {
            this.index = index;
            this.fireEvent('storeMove', this);
            return true;
        } else if (!$defined(this.data)) {
            return null;
        } else {
            return false;
        }
    },
    /**
     * APIMethod: each
     * allows iteration through the store's records.
     * NOTE: this function is untested
     *
     * Parameters:
     * fn - the function to execute for each record
     * bind - the scope of the function
     * ignoreDeleted - flag that tells the function whether to ignore records
     *                  marked as deleted.
     */
    each: function (fn, bind, ignoreDeleted) {
        if ($defined(this.data)) {
          var data;
          if (ignoreDeleted) {
              data = this.data.filter(function (record) {
                  return record.state !== Jx.Record.DELETE;
              }, this);
          } else {
              data = this.data;
          }
          data.each(fn, bind);
        }
    },
    /**
     * APIMethod: get
     * gets the data for the specified column
     *
     * Parameters:
     * column - indicator of the column to set. Either a string (the name of
     *          the column) or an integer (the index of the column in the
     *          record).
     * index - the index of the record in the internal array. Optional.
     *          defaults to the current index.
     */
    get: function (column, index) {
        if (!$defined(index)) {
            index = this.index;
        }
        return this.data[index].get(column);
    },
    /**
     * APIMethod: set
     * Sets the passed data for a particular column on the indicated record.
     *
     * Parameters:
     * column - indicator of the column to set. Either a string (the name of
     *          the column) or an integer (the index of the column in the
     *          record).
     * data - the data to set in the column of the record
     * index - the index of the record in the internal array. Optional.
     *          defaults to the current index.
     */
    set: function (column, data, index) {
        if (!$defined(index)) {
            index = this.index;
        }
        var ret = this.data[index].set(column, data);
        ret.reverse();
        ret.push(index);
        ret.reverse();
        //fire event with array [index, column, oldvalue, newValue]
        this.fireEvent('storeColumnChanged', ret);
    },
    /**
     * APIMethod: refresh
     * Simply fires the storeRefresh event for strategies to listen for.
     */
    refresh: function () {
        this.fireEvent('storeRefresh', this);
    },
    /**
     * APIMethod: addRecord
     * Adds given data to the end of the current store.
     *
     * Parameters:
     * data - The data to use in creating a record. This should be in whatever
     *        form Jx.Store.Record, or the current subclass, needs it in.
     * position - whether the record is added to the 'top' or 'bottom' of the
     *      store.
     * insert - flag whether this is an "insert"
     */
    addRecord: function (data, position, insert) {
        if (!$defined(this.data)) {
            this.data = [];
        }

        position = $defined(position)? position : 'bottom';

        var record = data;
        if (!(data instanceof Jx.Record)) {
            record = new (this.record)(this, this.options.columns, data, this.options.recordOptions);
        }
        if (insert) {
            record.state = Jx.Record.INSERT;
        }
        if (position === 'top') {
            //some literature claims that .shift() and .unshift() don't work reliably in IE
            //so we do it this way.
            this.data.reverse();
            this.data.push(record);
            this.data.reverse();
        } else {
            this.data.push(record);
        }
        this.fireEvent('storeRecordAdded', [this, record, position]);
    },
    /**
     * APIMethod: addRecords
     * Used to add multiple records to the store at one time.
     *
     * Parameters:
     * data - an array of data to add.
     * position - 'top' or 'bottom'. Indicates whether to add at the top or
     * the bottom of the store
     */
    addRecords: function (data, position) {
        var def = $defined(data),
            type = Jx.type(data);
        if (def && type === 'array') {
            this.fireEvent('storeBeginAddRecords', this);
            //if position is top, reverse the array or we'll add them in the
            // wrong order.
            if (position === 'top') {
                data.reverse();
            }
            data.each(function(d){
                this.addRecord(d, position);
            },this);
            this.fireEvent('storeEndAddRecords', this);
            return true;
        }
        return false;
    },

    /**
     * APIMethod: getRecord
     * Returns the record at the given index or the current store index
     *
     * Parameters:
     * index - the index from which to return the record. Optional. Defaults
     * to the current store index
     */
    getRecord: function (index) {
        if (!$defined(index)) {
            index = this.index;
        }

        if (Jx.type(index) === 'number') {
            if ($defined(this.data) && $defined(this.data[index])) {
                return this.data[index];
            }
        } else {
            //Not sure what the point of this part is. It compares the
            //record to the index directly as if we passed in the record which
            //means we already have the record... huh???
            var r;
            this.data.each(function(record){
                if (record === index) {
                    r = record;
                }
            },this);
            return r;
        }
        return null;
    },
    /**
     * APIMethod: replaceRecord
     * Replaces the record at an existing index with a new record containing
     * the passed in data.
     *
     * Parameters:
     * data - the data to use in creating the new record
     * index - the index at which to place the new record. Optional.
     *          defaults to the current store index.
     */
    replace: function(data, index) {
        if ($defined(data)) {
            if (!$defined(index)) {
                index = this.index;
            }
            var record = new this.record(this.options.columns,data),
            oldRecord = this.data[index];
            this.data[index] = record;
            this.fireEvent('storeRecordReplaced', [oldRecord, record]);
            return true;
        }
        return false;
    },
    /**
     * APIMethod: deleteRecord
     * Marks a record for deletion and removes it from the regular array of
     * records. It adds it to a special holding array so it can be disposed
     * of later.
     *
     * Parameters:
     * index - the index at which to place the new record. Optional.
     *          defaults to the current store index.
     */
    deleteRecord: function(index) {
        if (!$defined(index)) {
            index = this.index;
        }
        var record = this.data[index];
        record.state = Jx.Record.DELETE;
        // Set to Null or slice it out and compact the array???
        //this.data[index] = null;
        this.data.splice(index,1);
        // TODO: I moved this to a property that is always an array so I don't
        // get an error in the save strategy.
        // if (!$defined(this.deleted)) {
        //     this.deleted = [];
        // }
        this.deleted.push(record);
        this.fireEvent('storeRecordDeleted', [this, record]);
    },
    /**
     * APIMethod: insertRecord
     * Shortcut to addRecord which facilitates marking a record as inserted.
     *
     * Parameters:
     * data - the data to use in creating this inserted record. Should be in
     *          whatever form the current implementation of Jx.Record needs
     * position - where to place the record. Should be either 'top' or
     *    'bottom'.
     */
    insertRecord: function (data, position) {
        this.addRecord(data, position, true);
    },

    /**
     * APIMethod: getColumns
     * Allows retrieving the columns array
     */
    getColumns: function () {
        return this.options.columns;
    },

    /**
     * APIMethod: findByColumn
     * Used to find a specific record by the value in a specific column. This
     * is particularly useful for finding records by a unique id column. The
     * search will stop on the first instance of the value
     *
     * Parameters:
     * column - the name (or index) of the column to search by
     * value - the value to look for
     */
    findByColumn: function (column, value) {
        if (typeof StopIteration === "undefined") {
            StopIteration = new Error("StopIteration");
        }

        var index;
        try {
            this.data.each(function(record, idx){
                if (record.equals(column, value)) {
                    index = idx;
                    throw StopIteration;
                }
            },this);
        } catch (error) {
            if (error !== StopIteration) {
                throw error;
            }
            return index;
        }
        return null;
    },
    /**
     * APIMethod: removeRecord
     * removes (but does not mark for deletion) a record at the given index
     * or the current store index if none is passed in.
     *
     * Parameters:
     * index - Optional. The store index of the record to remove.
     */
    removeRecord: function (index) {
        if (!$defined(index)) {
            index = this.index;
        }
        this.data.splice(index,1);
        this.fireEvent('storeRecordRemoved', [this, index])
    },
    /**
     * APIMethod: removeRecords
     * Used to remove multiple contiguous records from a store.
     *
     * Parameters:
     * first - where to start removing records (zero-based)
     * last - where to stop removing records (zero-based, inclusive)
     */
    removeRecords: function (first, last) {
        for (var i = first; i <= last; i++) {
            this.removeRecord(first);
        }
        this.fireEvent('storeMultipleRecordsRemoved', [this, first, last]);
    },

    /**
   * APIMethod: parseTemplate
   * parses the provided template to determine which store columns are
   * required to complete it.
   *
   * Parameters:
   * template - the template to parse
   */
  parseTemplate: function (template) {
      //we parse the template based on the columns in the data store looking
      //for the pattern {column-name}. If it's in there we add it to the
      //array of ones to look fo
      var arr = [],
          s;
      this.options.columns.each(function (col) {
          s = '{' + col.name + '}';
          if (template.contains(s)) {
              arr.push(col.name);
          }
      }, this);
      return arr;
  },

  /**
   * APIMethod: fillTemplate
   * Actually does the work of getting the data from the store
   * and creating a single item based on the provided template
   *
   * Parameters:
   * index - the index of the data in the store to use in populating the
   *          template.
   * template - the template to fill
   * columnsNeeded - the array of columns needed by this template. should be
   *      obtained by calling parseTemplate().
     * obj - an object with some prefilled keys to use in substituting.
     *      Ones that are also in the store will be overwritten.
   */
  fillTemplate: function (index, template, columnsNeeded, obj) {
      var record = null,
          itemObj;
      if ($defined(index)) {
          if (index instanceof Jx.Record) {
              record = index;
          } else {
              record = this.getRecord(index);
          }
        } else {
            record = this.getRecord(this.index);
        }

      //create the item
      itemObj = $defined(obj) ? obj : {};
      columnsNeeded.each(function (col) {
          itemObj[col] = record.get(col);
      }, this);
      return template.substitute(itemObj);
  }
});/*
---

name: Jx.Compare

description: Class that provides functions for comparing various data types. Used by the Jx.Sort class and it's descendants

license: MIT-style license.

requires:
 - Jx.Object
 - More/Date.Extras

provides: [Jx.Compare]

...
 */
// $Id$
/**
 * Class: Jx.Compare
 *
 * Extends: <Jx.Object>
 *
 * Class that holds functions for doing comparison operations.
 * This class requires the mootools-more Date() extensions.
 *
 * notes:
 * Each function that does a comparison returns
 *
 * 0 - if equal.
 * 1 - if the first value is greater that the second.
 * -1 - if the first value is less than the second.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */

Jx.Compare = new Class({
    Family: 'Jx.Compare',
    Extends: Jx.Object,

    options: { separator: '.' },

    /**
     * APIMethod: alphanumeric
     * Compare alphanumeric variables. This is case sensitive
     *
     * Parameters:
     * a - a value
     * b - another value
     */
    alphanumeric: function (a, b) {
        return (a === b) ? 0 :(a < b) ? -1 : 1;
    },

    /**
     * APIMethod: numeric
     * Compares numbers
     *
     * Parameters:
     * a - a number
     * b - another number
     */
    numeric: function (a, b) {
        return this.alphanumeric(this.convert(a), this.convert(b));
    },

    /**
     * Method: _convert
     * Normalizes numbers relative to the separator.
     *
     * Parameters:
     * val - the number to normalize
     *
     * Returns:
     * the normalized value
     */
    convert: function (val) {
        if (Jx.type(val) === 'string') {
            var neg = false;
            if (val.substr(0,1) == '-') {
                neg = true;
            }
            val = parseFloat(val.replace(/^[^\d\.]*([\d., ]+).*/g, "$1").replace(new RegExp("[^\\\d" + this.options.separator + "]", "g"), '').replace(/,/, '.')) || 0;
            if (neg) {
                val = val * -1;
            }
        }
        return val || 0;
    },

    /**
     * APIMethod: ignorecase
     * Compares to alphanumeric strings without regard to case.
     *
     * Parameters:
     * a - a value
     * b - another value
     */
    ignorecase: function (a, b) {
        return this.alphanumeric(("" + a).toLowerCase(), ("" + b).toLowerCase());
    },

    /**
     * APIMethod: currency
     * Compares to currency values.
     *
     * Parameters:
     * a - a currency value without the $
     * b - another currency value without the $
     */
    currency: function (a, b) {
        return this.numeric(a, b);
    },

    /**
     * APIMethod: date
     * Compares 2 date values (either a string or an object)
     *
     * Parameters:
     * a - a date value
     * b - another date value
     */
    date: function (a, b) {
        var x = new Date().parse(a),
            y = new Date().parse(b);
        return (x < y) ? -1 : (x > y) ? 1 : 0;
    },
    /**
     * APIMethod: boolean
     * Compares 2 bolean values
     *
     * Parameters:
     * a - a boolean value
     * b - another boolean value
     */
    'boolean': function (a, b) {
        return (a === true && b === false) ? -1 : (a === b) ? 0 : 1;
    }

});/*
---

name: Jx.Sort

description: Base class for the sort algorithm implementations

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Compare

provides: [Jx.Sort]

...
 */
// $Id$
/**
 * Class: Jx.Sort
 * Base class for all of the sorting algorithm classes.
 *
 * Extends: <Jx.Object>
 *
 * Events:
 * onStart() - called when the sort starts
 * onEnd() - called when the sort stops
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort = new Class({

    Family : 'Jx.Sort',

    Extends : Jx.Object,

    options : {
        /**
         * Option: timeIt
         * whether to time the sort
         */
        timeIt : false,
        /**
         * Event: onStart
         */
        onStart : $empty,
        /**
         * Event: onEnd
         */
        onEnd : $empty
    },

    /**
     * Property: timer
     * holds the timer instance
     */
    timer : null,
    /**
     * Property: data
     * The data to sort
     */
    data : null,
    /**
     * Property: Comparator
     * The comparator to use in sorting
     */
    comparator : $empty,
    /**
     * Property: col
     * The column to sort by
     */
    col : null,

    parameters: ['data','fn','col','options'],

    /**
     * APIMethod: init
     */
    init : function () {
        this.parent();
        if (this.options.timeIt) {
            this.addEvent('start', this.startTimer.bind(this));
            this.addEvent('stop', this.stopTimer.bind(this));
        }
        this.data = this.options.data;
        this.comparator = this.options.fn;
        this.col = this.options.col;
    },

    /**
     * APIMethod: sort
     * Actually does the sorting. Must be overridden by subclasses.
     */
    sort : $empty,

    /**
     * Method: startTimer
     * Saves the starting time of the sort
     */
    startTimer : function () {
        this.timer = new Date();
    },

    /**
     * Method: stopTimer
     * Determines the time the sort took.
     */
    stopTimer : function () {
        this.end = new Date();
        this.dif = this.timer.diff(this.end, 'ms');
    },

    /**
     * APIMethod: setData
     * sets the data to sort
     *
     * Parameters:
     * data - the data to sort
     */
    setData : function (data) {
        if ($defined(data)) {
            this.data = data;
        }
    },

    /**
     * APIMethod: setColumn
     * Sets the column to sort by
     *
     * Parameters:
     * col - the column to sort by
     */
    setColumn : function (col) {
        if ($defined(col)) {
            this.col = col;
        }
    },

    /**
     * APIMethod: setComparator
     * Sets the comparator to use in sorting
     *
     * Parameters:
     * fn - the function to use as the comparator
     */
    setComparator : function (fn) {
        this.comparator = fn;
    }
});
/*
---

name: Jx.Sort.Mergesort

description: An implementation of the merge sort algorithm

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Mergesort]

...
 */
// $Id$
/**
 * class: Jx.Sort.Mergesort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a mergesort algorithm designed to
 * work on <Jx.Store> data.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort.Mergesort = new Class({
    Family: 'Jx.Sort.Mergesort',
    Extends : Jx.Sort,

    name : 'mergesort',

    /**
     * APIMethod: sort
     * Actually runs the sort on the data
     *
     * returns: the sorted data
     */
    sort : function () {
        this.fireEvent('start');
        var d = this.mergeSort(this.data);
        this.fireEvent('stop');
        return d;

    },

    /**
     * Method: mergeSort
     * Does the physical sorting. Called
     * recursively.
     *
     * Parameters:
     * arr - the array to sort
     *
     * returns: the sorted array
     */
    mergeSort : function (arr) {
        if (arr.length <= 1) {
            return arr;
        }

        var middle = (arr.length) / 2,
            left = arr.slice(0, middle),
            right = arr.slice(middle),
            result;
        left = this.mergeSort(left);
        right = this.mergeSort(right);
        result = this.merge(left, right);
        return result;
    },

    /**
     * Method: merge
     * Does the work of merging to arrays in order.
     *
     * parameters:
     * left - the left hand array
     * right - the right hand array
     *
     * returns: the merged array
     */
    merge : function (left, right) {
        var result = [];

        while (left.length > 0 && right.length > 0) {
            if (this.comparator((left[0]).get(this.col), (right[0])
                    .get(this.col)) <= 0) {
                result.push(left[0]);
                left = left.slice(1);
            } else {
                result.push(right[0]);
                right = right.slice(1);
            }
        }
        while (left.length > 0) {
            result.push(left[0]);
            left = left.slice(1);
        }
        while (right.length > 0) {
            result.push(right[0]);
            right = right.slice(1);
        }
        return result;
    }

});
/*
---

name: Jx.Sort.Heapsort

description: An implementation of the heap sort algorithm

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Heapsort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Heapsort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a heapsort algorithm designed to
 * work on <Jx.Store> data.
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort.Heapsort = new Class({
    Family: 'Jx.Sort.Heapsort',
    Extends : Jx.Sort,

    name : 'heapsort',

    /**
     * APIMethod: sort
     * Actually runs the sort on the data
     *
     * Returns: the sorted data
     */
    sort : function () {
        this.fireEvent('start');

        var count = this.data.length,
            end;

        if (count === 1) {
            return this.data;
        }

        if (count > 2) {
            this.heapify(count);

            end = count - 1;
            while (end > 1) {
                this.data.swap(end, 0);
                end = end - 1;
                this.siftDown(0, end);
            }
        } else {
            // check then order the two we have
            if ((this.comparator((this.data[0]).get(this.col), (this.data[1])
                    .get(this.col)) > 0)) {
                this.data.swap(0, 1);
            }
        }

        this.fireEvent('stop');
        return this.data;
    },

    /**
     * Method: heapify
     * Puts the data in Max-heap order
     *
     * Parameters: count - the number of records we're sorting
     */
    heapify : function (count) {
        var start = Math.round((count - 2) / 2);

        while (start >= 0) {
            this.siftDown(start, count - 1);
            start = start - 1;
        }
    },

    /**
     * Method: siftDown
     *
     * Parameters: start - the beginning of the sort range end - the end of the
     * sort range
     */
    siftDown : function (start, end) {
        var root = start,
            child;

        while (root * 2 <= end) {
            child = root * 2;
            if ((child + 1 < end) && (this.comparator((this.data[child]).get(this.col),
                            (this.data[child + 1]).get(this.col)) < 0)) {
                child = child + 1;
            }
            if ((this.comparator((this.data[root]).get(this.col),
                    (this.data[child]).get(this.col)) < 0)) {
                this.data.swap(root, child);
                root = child;
            } else {
                return;
            }
        }
    }

});
/*
---

name: Jx.Sort.Quicksort

description: An implementation of the quick sort algorithm.

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Quicksort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Quicksort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a quicksort algorithm designed to
 * work on <Jx.Store> data.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort.Quicksort = new Class({
    Family: 'Jx.Sort.Quicksort',
    Extends : Jx.Sort,

    name : 'quicksort',

    /**
     * APIMethod: sort
     * Actually runs the sort on the data
     *
     * returns: the sorted data
     */
    sort : function (left, right) {
        this.fireEvent('start');

        if (!$defined(left)) {
            left = 0;
        }
        if (!$defined(right)) {
            right = this.data.length - 1;
        }

        this.quicksort(left, right);

        this.fireEvent('stop');

        return this.data;

    },

    /**
     * Method: quicksort
     * Initiates the sorting. Is
     * called recursively
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    quicksort : function (left, right) {
        if (left >= right) {
            return;
        }

        var index = this.partition(left, right);
        this.quicksort(left, index - 1);
        this.quicksort(index + 1, right);
    },

    /**
     * Method: partition
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    partition : function (left, right) {
        this.findMedianOfMedians(left, right);
        var pivotIndex = left,
            pivotValue = (this.data[pivotIndex]).get(this.col),
            index = left,
            i;

        this.data.swap(pivotIndex, right);
        for (i = left; i < right; i++) {
            if (this.comparator((this.data[i]).get(this.col),
                    pivotValue) < 0) {
                this.data.swap(i, index);
                index = index + 1;
            }
        }
        this.data.swap(right, index);

        return index;

    },

    /**
     * Method: findMedianOfMedians
     *
     * Parameters: l
     * eft - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    findMedianOfMedians : function (left, right) {
        if (left === right) {
            return this.data[left];
        }

        var i,
            shift = 1,
            endIndex,
            medianIndex;
        while (shift <= (right - left)) {
            for (i = left; i <= right; i += shift * 5) {
                endIndex = (i + shift * 5 - 1 < right) ? i + shift * 5 - 1 : right;
                medianIndex = this.findMedianIndex(i, endIndex,
                        shift);

                this.data.swap(i, medianIndex);
            }
            shift *= 5;
        }

        return this.data[left];
    },

    /**
     * Method: findMedianIndex
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    findMedianIndex : function (left, right, shift) {
        var groups = Math.round((right - left) / shift + 1),
            k = Math.round(left + groups / 2 * shift),
            i,
            minIndex,
            v,
            minValue,
            j;
        if (k > this.data.length - 1) {
            k = this.data.length - 1;
        }
        for (i = left; i < k; i += shift) {
            minIndex = i;
            v = this.data[minIndex];
            minValue = v.get(this.col);

            for (j = i; j <= right; j += shift) {
                if (this.comparator((this.data[j]).get(this.col),
                        minValue) < 0) {
                    minIndex = j;
                    minValue = (this.data[minIndex]).get(this.col);
                }
            }
            this.data.swap(i, minIndex);
        }

        return k;
    }
});
/*
---

name: Jx.Sort.Nativesort

description: An implementation of the Javascript native sorting with the Jx.Sort interface

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Nativesort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Nativesort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a native sort algorithm designed to work on <Jx.Store> data.
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort.Nativesort = new Class({
    Family: 'Jx.Sort.Nativesort',
    Extends : Jx.Sort,

    name : 'nativesort',

    /**
     * Method: sort
     * Actually runs the sort on the data
     *
     * Returns:
     * the sorted data
     */
    sort : function () {
        this.fireEvent('start');

        var compare = function (a, b) {
            return this.comparator((this.data[a]).get(this.col), (this.data[b])
                    .get(this.col));
        };

        this.data.sort(compare);
        this.fireEvent('stop');
        return this.data;
    }

});
/*
---

name: Jx.Store.Response

description: The object used to return response information to strategies.

license: MIT-style license.

requires:
 - Jx.Store

provides: [Jx.Store.Response]

...
 */
// $Id$
/**
 * Class: Jx.Store.Response
 * 
 * Extends: <Jx.Object>
 * 
 * This class is used by the protocol to send information back to the calling 
 * strategy (or other caller).
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Response = new Class({

    Family: 'Jx.Store.Response',
    Extends: Jx.Object,

    /**
     * Property: code
     * This is the success/failure code
     */
    code: null,
    /**
     * Property: data
     * The data passed received by the protocol.
     */
    data: null,
    /**
     * Property: meta
     * The metadata received by the protocol
     */
    meta: null,
    /**
     * Property: requestType
     * one of 'read', 'insert', 'delete', or 'update'
     */
    requestType: null,
    /**
     * Property: requestParams
     * The parameters passed to the method that created this response
     */
    requestParams: null,
    /**
     * Property: request
     * the mootools Request object used in this operation (if one is actually
     * used)
     */
    request: null,
    /**
     * Property: error
     * the error data received from the called page if any.
     */
    error: null,
    /**
     * APIMethod: success
     * determines if this response represents a successful response
     */
    success: function () {
        return this.code > 0;
    }
});

Jx.Store.Response.WAITING = 2;
Jx.Store.Response.SUCCESS = 1;
Jx.Store.Response.FAILURE = 0;
/*
---

name: Jx.Store.Protocol

description: Base class for all store protocols.

license: MIT-style license.

requires:
 - Jx.Store.Response

provides: [Jx.Store.Protocol]

...
 */
// $Id$
/**
 * Class: Jx.Store.Protocol
 *
 * Extends: <Jx.Object>
 *
 * Base class for all protocols. Protocols are used for communication, primarily,
 * in Jx.Store. It may be possible to adapt them to be used in other places but
 * that is not their intended function.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Store.Protocol = new Class({

    Extends: Jx.Object,
    Family: 'Jx.Store.Protocol',

    parser: null,

    options: {
      combine: {
        insert: false,
        update: false,
        'delete': false
      }
    },

    init: function () {
        this.parent();

        if ($defined(this.options.parser)) {
            this.parser = this.options.parser;
        }
    },

    cleanup: function () {
        this.parser = null;
        this.parent();
    },

    /**
     * APIMethod: read
     * Supports reading data from a location. Abstract method that subclasses
     * should implement.
     *
     * Parameters:
     * options - optional options for configuring the request
     */
    read: $empty,
    /**
     * APIMethod: insert
     * Supports inserting data from a location. Abstract method that subclasses
     * should implement.
     *
     * Parameters:
     * data - the data to use in creating the record in the form of one or more
     *        Jx.Store.Record instances
     * options - optional options for configuring the request
     */
    insert: $empty,
    /**
     * APIMethod: update
     * Supports updating data at a location. Abstract method that subclasses
     * should implement.
     *
     * Parameters:
     * data - the data to update (one or more Jx.Store.Record objects)
     * options - optional options for configuring the request
     */
    update: $empty,
    /**
     * APIMethod: delete
     * Supports deleting data from a location. Abstract method that subclasses
     * should implement.
     *
     * Parameters:
     * data - the data to update (one or more Jx.Store.Record objects)
     * options - optional options for configuring the request
     */
    "delete": $empty,
    /**
     * APIMethod: abort
     * used to abort any of the above methods (where practical). Abstract method
     * that subclasses should implement.
     */
    abort: $empty,
    /**
     * APIMethod: combineRequests
     * tests whether the protocol supports combining multiple records for a given operation
     * 
     * Parameter:
     * operation - {String} the operation to test for multiple record support
     * 
     * Returns {Boolean} true if the operation supports it, false otherwise
     */
    combineRequests: function(op) {
      return $defined(this.options.combine[op]) ? this.options.combine[op] : false;
    }
});/*
---

name: Jx.Store.Protocol.Local

description: Store protocol used to load data that is already present in a page as an object.

license: MIT-style license.

requires:
 - Jx.Store.Protocol

provides: [Jx.Store.Protocol.Local]

...
 */
// $Id$
/**
 * Class: Jx.Store.Protocol.Local
 * 
 * Extends: Jx.Store.Protocol
 * 
 * Based on the Protocol base class, the local protocol uses data that it is
 * handed upon instantiation to process requests.
 * 
 * Constructor Parameters:
 * data - The data to use 
 * options - any options for the base protocol class
 * 
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * inspired by the openlayers.org implementation of a similar system
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Protocol.Local = new Class({
    
    Extends: Jx.Store.Protocol,
    
    parameters: ['data', 'options'],
    /**
     * Property: data
     * The data passed to the protocol
     */
    data: null,
    
    init: function () {
        this.parent();
        
        if ($defined(this.options.data)) {
            this.data = this.parser.parse(this.options.data);
        }
    },
    /**
     * APIMethod: read
     * process requests for data and sends the appropriate response via the
     * dataLoaded event.
     * 
     * Parameters: 
     * options - options to use in processing the request.
     */
    read: function (options) {
        var resp = new Jx.Store.Response(),
            page = options.data.page,
            itemsPerPage = options.data.itemsPerPage,
            start,
            end,
            data = this.data;

        resp.requestType = 'read';
        resp.requestParams = arguments;
        
        
        if ($defined(data)) {
            if (page <= 1 && itemsPerPage === -1) {
                //send them all
                resp.data = data;
                resp.meta = { count: data.length };
            } else {
                start = (page - 1) * itemsPerPage;
                end = start + itemsPerPage;
                resp.data = data.slice(start, end);
                resp.meta = { 
                    page: page, 
                    itemsPerPage: itemsPerPage,
                    totalItems: data.length,
                    totalPages: Math.ceil(data.length/itemsPerPage)
                };
            }
            resp.code = Jx.Store.Response.SUCCESS;
            this.fireEvent('dataLoaded', resp);
        } else {
            resp.code = Jx.Store.Response.SUCCESS;
            this.fireEvent('dataLoaded', resp);
        }                        
    }
    
    /**
     * The following methods are not implemented as they make no sense for a
     * local protocol:
     * - create
     * - update 
     * - delete
     * - commit
     * - abort
     */
});/*
---

name: Jx.Store.Protocol.Ajax

description: Store protocol used to load data from a remote data source via Ajax.

license: MIT-style license.

requires:
 - Jx.Store.Protocol
 - more/Request.Queue

provides: [Jx.Store.Protocol.Ajax]

...
 */
// $Id$
/**
 * Class: Jx.Store.Protocol.Ajax
 *
 * Extends: <Jx.Store.Protocol>
 *
 * This protocol is used to send and receive data via AJAX. It also has the
 * capability to use a REST-style API.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Store.Protocol.Ajax = new Class({

    Extends: Jx.Store.Protocol,

    options: {
        /**
         * Option: requestOptions
         * Options to pass to the mootools Request class
         */
        requestOptions: {
            method: 'get'
        },
        /**
         * Option: rest
         * Flag indicating whether this protocol is operating against a RESTful
         * web service
         */
        rest: false,
        /**
         * Option: urls
         * This is a hash of the urls to use for each method. If the rest
         * option is set to true the only one needed will be the urls.rest.
         * These can be overridden if needed by passing an options object into
         * the various methods with the appropriate urls.
         */
        urls: {
            rest: null,
            insert: null,
            read: null,
            update: null,
            'delete': null
        },
        /**
         * Option: queue
         * an object containing options suitable for <Request.Queue>.
         * By default, autoAdvance is set to true and concurrent is set to 1.
         */
        queue: {
          autoAdvance: true,
          concurrent: 1
        }
    },
    
    queue: null,

    init: function() {
        if (!$defined(Jx.Store.Protocol.Ajax.UniqueId)) {
          Jx.Store.Protocol.Ajax.UniqueId = 1;
        }
      
        this.queue = new Request.Queue({
          autoAdvance: this.options.queue.autoAdvance,
          concurrent: this.options.queue.concurrent
        });
        this.parent();
    },
    /**
     * APIMethod: read
     * Send a read request via AJAX
     *
     * Parameters:
     * options - the options to pass to the request.
     */
    read: function (options) {
        var resp = new Jx.Store.Response(),
            temp = {},
            opts,
            req,
            uniqueId = Jx.Store.Protocol.Ajax.UniqueId();
        resp.requestType = 'read';
        resp.requestParams = arguments;


        // set up options
        if (this.options.rest) {
            temp.url = this.options.urls.rest;
        } else {
            temp.url = this.options.urls.read;
        }

        opts = $merge(this.options.requestOptions, temp, options);
        opts.onSuccess = this.handleResponse.bind(this,resp);

        req = new Request(opts);
        resp.request = req;
        
        this.queue.addRequest(uniqueId, req);
        req.send();

        resp.code = Jx.Store.Response.WAITING;

        return resp;

    },
    /**
     * Method: handleResponse
     * Called as an event handler for a returning request. Parses the request's
     * response into the actual response object.
     *
     * Parameters:
     * response - the response related to teh returning request.
     */
    handleResponse: function (response) {
        var req = response.request,
            str = req.xhr.responseText,
            data = this.parser.parse(str);
        if ($defined(data)) {
            if ($defined(data.success) && data.success) {
                if ($defined(data.data)) {
                    response.data = data.data;
                }
                if ($defined(data.meta)) {
                    response.meta = data.meta;
                }
                response.code = Jx.Store.Response.SUCCESS;
            } else {
                response.code = Jx.Store.Response.FAILURE;
                response.error = $defined(data.error) ? data.error : null;
            }
        } else {
            response.code = Jx.Store.Response.FAILURE;
        }
        this.fireEvent('dataLoaded', response);
    },
    /**
     * APIMethod: insert
     * Takes a Jx.Record instance and saves it
     *
     * Parameters:
     * record - a Jx.Store.Record or array of them
     * options - options to pass to the request
     */
    insert: function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
        } else {
            options = $merge({url: this.options.urls.insert},options);
        }
        this.options.requestOptions.method = 'POST';
        return this.run(record, options, "insert");
    },
    /**
     * APIMethod: update
     * Takes a Jx.Record and updates it via AJAX
     *
     * Parameters:
     * record - a Jx.Record instance
     * options - Options to pass to the request
     */
    update: function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'PUT';
        } else {
            options = $merge({url: this.options.urls.update},options);
            this.options.requestOptions.method = 'POST';
        }
        return this.run(record, options, "update");
    },
    /**
     * APIMethod: delete
     * Takes a Jx.Record and deletes it via AJAX
     *
     * Parameters:
     * record - a Jx.Record instance
     * options - Options to pass to the request
     */
    "delete": function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'DELETE';
        } else {
            options = $merge({url: this.options.urls['delete']},options);
            this.options.requestOptions.method = 'POST';
        }
        return this.run(record, options, "delete");
    },
    /**
     * APIMethod: abort
     * aborts the request related to the passed in response.
     *
     * Parameters:
     * response - the response with the request to abort
     */
    abort: function (response) {
        response.request.cancel();

    },
    /**
     * Method: run
     * called by update, delete, and insert methods that actually does the work
     * of kicking off the request.
     *
     * Parameters:
     * record - The Jx.Record to work with
     * options - Options to pass to the request
     * method - The name of the method calling this function
     */
    run: function (record, options, method) {
        var resp = new Jx.Store.Response(),
            opts,
            req,
            data,
            uniqueId = Jx.Store.Protocol.Ajax.UniqueId();
        
        if (Jx.type(record) == 'array') {
          if (!this.combineRequests(method)) {
            record.each(function(r) {
              this.run(r, options, method);
            }, this);
          } else {
            data = [];
            record.each(function(r) {
              data.push(this.parser.encode(r));
            }, this);
          }
        } else {
          data = this.parser.encode(record);
        }

        this.options.requestOptions.data = $merge(this.options.requestOptions.data, {
          data: data
        });

        resp.requestType = method;
        resp.requestParams = [record, options, method];

        //set up options
        opts = $merge(this.options.requestOptions, options);
        opts.onSuccess = this.handleResponse.bind(this,resp);
        req = new Request(opts);
        resp.request = req;
        this.queue.addRequest(uniqueId, req);
        req.send();

        resp.code = Jx.Store.Response.WAITING;

        return resp;
    }
    
});
/**
 * Method: uniqueId
 * returns a unique identifier to be used with queued requests
 */
Jx.Store.Protocol.Ajax.UniqueId = (function() {
  var uniqueId = 1;
  return function() {
    return 'req-'+(uniqueId++);
  };
})();
/*
---

name: Jx.Store.Strategy

description: Base class for all store strategies.

license: MIT-style license.

requires:
 - Jx.Store

provides: [Jx.Store.Strategy]


...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy
 * 
 * Extends: <Jx.Object>
 * 
 * Base class for all Jx.Store strategies
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy = new Class({
    
    Extends: Jx.Object,
    Family: 'Jx.Store.Strategy',
    /**
     * APIProperty: store
     * The store this strategy is associated with
     */
    store: null,
    /**
     * APIProperty: active
     * whether this strategy has been activated or not.
     */
    active: null,
    
    /**
     * Method: init
     * initialize the strategy, should be called by subclasses
     */
    init: function () {
        this.parent();
        this.active = false;
    },
    /**
     * APIMethod: setStore
     * Associates this strategy with a particular store.
     */
    setStore: function (store) {
        if (store instanceof Jx.Store) {
            this.store = store;
            return true;
        }
        return false;
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        if (!this.active) {
            this.active = true;
            return true;
        }
        return false;
    },
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        if (this.active) {
            this.active = false;
            return true;
        }
        return false;
    }
});/*
---

name: Jx.Store.Strategy.Full

description: Strategy for loading the full data set from a source.

license: MIT-style license.

requires:
 - Jx.Store.Strategy

provides: [Jx.Store.Strategy.Full]

...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Full
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * This is a strategy for loading all of the data from a source at one time.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

Jx.Store.Strategy.Full = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'full',
    
    options:{},
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        this.bound.load = this.load.bind(this);
        this.bound.loadStore = this.loadStore.bind(this);
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        this.parent();
        this.store.addEvent('storeLoad', this.bound.load);
        
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        this.parent();
        this.store.removeEvent('storeLoad', this.bound.load);
        
    },
    /**
     * APIMethod: load
     * Called as the eventhandler for the store load method. Can also
     * be called independently to load data into the current store.
     * 
     * Parameters:
     * params - a hash of parameters to use in loading the data.
     */
    load: function (params) {
        this.store.fireEvent('storeBeginDataLoad', this.store);
        this.store.protocol.addEvent('dataLoaded', this.bound.loadStore);
        var opts = {}
        if ($defined(params)) {
            opts.data = params;
        } else {
            opts.data = {};
        }
        opts.data.page = 0;
        opts.data.itemsPerPage = -1;
        this.store.protocol.read(opts);
    },
    
    /**
     * Method: loadStore
     * Called as the event handler for the protocol's dataLoaded event. Checks
     * the response for success and loads the data into the store if needed.
     * 
     * Parameters:
     * resp - the response from the protocol
     */
    loadStore: function (resp) {
        this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
        if (resp.success()) {
            this.store.empty();
            if ($defined(resp.meta)) {
                this.parseMetaData(resp.meta);
            }
            this.store.addRecords(resp.data);
            this.store.loaded = true;
            this.store.fireEvent('storeDataLoaded',this.store);
        } else {
            this.store.loaded = false;
            this.store.fireEvent('storeDataLoadFailed', [this.store, resp]);
        }
    },
    /**
     * Method: parseMetaData
     * Takes the meta property of the response object and puts the data 
     * where it belongs.
     * 
     * Parameters:
     * meta - the meta data object from the response.
     */
    parseMetaData: function (meta) {
        if ($defined(meta.columns)) {
            this.store.options.columns = meta.columns;
        }
        if ($defined(meta.primaryKey)) {
            this.store.options.recordOptions.primaryKey = meta.primaryKey;
        }
    }
});/*
---

name: Jx.Store.Strategy.Paginate

description: Strategy for loading data in pages and moving between them. This strategy makes sure the store only contains the current page's data.

license: MIT-style license.

requires:
 - Jx.Store.Strategy

provides: [Jx.Store.Strategy.Paginate]


...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Paginate
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * Store strategy for paginating results in a store.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Paginate = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'paginate',
    
    options: {
        /**
         * Option: getPaginationParams
         * a function that returns an object that holds the parameters
         * necessary for getting paginated data from a protocol.
         */
        getPaginationParams: function () {
            return {
                page: this.page,
                itemsPerPage: this.itemsPerPage
            };
        },
        /**
         * Option: startingItemsPerPage
         * Used to set the intial itemsPerPage for the strategy. the pageSize 
         * can be changed using the setPageSize() method.
         */
        startingItemsPerPage: 25,
        /**
         * Option: startingPage
         * The page to start on. Defaults to 1 but can be set to any other 
         * page.
         */
        startingPage: 1,
        /**
         * Option: expirationInterval
         * The interval, in milliseconds (1000 = 1 sec), to hold a page of
         * data before it expires. If the page is expired, the next time the
         * page is accessed it must be retrieved again. Default is 5 minutes
         * (1000 * 60 * 5)
         */
        expirationInterval: (1000 * 60 * 5),
        /**
         * Option: ignoreExpiration
         * Set to TRUE to ignore the expirationInterval setting and never
         * expire pages.
         */
        ignoreExpiration: false
    },
    /**
     * Property: data
     * holds the pages of data keyed by page number.
     */
    data: null,
    /**
     * property: cacheTimer
     * holds one or more cache timer ids - one per page. Each page is set to 
     * expire after a certain amount of time.
     */
    cacheTimer: null,
    /**
     * Property: page
     * Tracks the page the store currently holds.
     */
    page: null,
    /**
     * Property: itemsPerPage
     * The number of items on each page
     */
    itemsPerPage: null,
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        this.data = new Hash();
        this.cacheTimer = new Hash();
        //set up bindings that we need here
        this.bound.load = this.load.bind(this);
        this.bound.loadStore = this.loadStore.bind(this);
        this.itemsPerPage = this.options.startingItemsPerPage;
        this.page = this.options.startingPage;
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        this.parent();
        this.store.addEvent('storeLoad', this.bound.load);
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        this.parent();
        this.store.removeEvent('storeLoad', this.bound.load);
    },
    /**
     * APIMethod: load
     * Called to load data into the store
     * 
     * Parameters:
     * params - a Hash of parameters to use in getting data from the protocol.
     */
    load: function (params) {
        this.store.fireEvent('storeBeginDataLoad', this.store);
        this.store.protocol.addEvent('dataLoaded', this.bound.loadStore);
        this.params = params;
        var opts = {
            data: $merge(params, this.options.getPaginationParams.apply(this))
        };
        this.store.protocol.read(opts);
    },
    /**
     * Method: loadStore
     * Used to assist in the loading of data into the store. This is 
     * called as a response to the protocol finishing.
     * 
     *  Parameters:
     *  resp - the response object
     */
    loadStore: function (resp) {
        this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
        if (resp.success()) {
            if ($defined(resp.meta)) {
                this.parseMetaData(resp.meta);
            }
            this.data.set(this.page,resp.data);
            this.loadData(resp.data);
        } else {
            this.store.fireEvent('storeDataLoadFailed', this.store);
        }
    },
    /**
     * Method: loadData
     * This method does the actual work of loading data to the store. It is
     * called when either the protocol finishes or setPage() has the data and
     * it's not expired.
     * 
     * Parameters:
     * data - the data to load into the store.
     */
    loadData: function (data) {
        this.store.empty();
        this.store.loaded = false;
        if (!this.options.ignoreExpiration) {
            var id = this.expirePage.delay(this.options.expirationInterval, this, this.page);
            this.cacheTimer.set(this.page,id);
        }
        this.store.addRecords(data);
        this.store.loaded = true;
        this.store.fireEvent('storeDataLoaded',this.store);
    },
    /**
     * Method: parseMetaData
     * Takes the metadata returned from the protocol and places it in the
     * appropriate Vplaces.
     * 
     * Parameters:
     * meta - the meta data object returned from the protocol.
     */
    parseMetaData: function (meta) {
        if ($defined(meta.columns)) {
            this.store.options.columns = meta.columns;
        }
        if ($defined(meta.totalItems)) {
            this.totalItems = meta.totalItems;
        }
        if ($defined(meta.totalPages)) {
            this.totalPages = meta.totalPages;
        }
        if ($defined(meta.primaryKey)) {
            this.store.options.recordOptions.primaryKey = meta.primaryKey;
        }
            
    },
    /**
     * Method: expirePage
     * Is called when a pages cache timer expires. Will expire the page by 
     * erasing the page and timer. This will force a reload of the data the 
     * next time the page is accessed.
     * 
     * Parameters:
     * page - the page number to expire.
     */
    expirePage: function (page) {
        this.data.erase(page);
        this.cacheTimer.erase(page);
    },
    /**
     * APIMethod: setPage
     * Allows a caller (i.e. a paging toolbar) to move to a specific page.
     * 
     * Parameters:
     * page - the page to move to. Can be any absolute page number, any number
     *        prefaced with '-' or '+' (i.e. '-1', '+3'), 'first', 'last', 
     *        'next', or 'previous'
     */
    setPage: function (page) {
        if (Jx.type(page) === 'string') {
            switch (page) {
                case 'first':
                    this.page = 1;
                    break;
                case 'last':
                    this.page = this.totalPages;
                    break;
                case 'next':
                    this.page++;
                    break;
                case 'previous':
                    this.page--;
                    break;
                default:
                    this.page = this.page + Jx.getNumber(page);
                    break;
            }
        } else {
            this.page = page;
        }
        if (this.cacheTimer.has(this.page)) {
            $clear(this.cacheTimer.get(this.page));
            this.cacheTimer.erase(this.page);
        }
        if (this.data.has(this.page)){
            this.loadData(this.data.get(this.page));
        } else {
            this.load(this.params);
        }
    },
    /**
     * APIMethod: getPage
     * returns the current page
     */
    getPage: function () {
        return this.page;
    },
    /**
     * APIMethod: getNumberOfPages
     * returns the total number of pages.
     */
    getNumberOfPages: function () {
        return this.totalPages;
    },
    /**
     * APIMethod: setPageSize
     * sets the current size of the pages. Calling this will expire every page 
     * and force the current one to reload with the new size.
     */
    setPageSize: function (size) {
        //set the page size 
        this.itemsPerPage = size;
        //invalidate all pages cached and reload the current one only
        this.cacheTimer.each(function(val){
            $clear(val);
        },this);
        this.cacheTimer.empty();
        this.data.empty();
        this.load();
    },
    /**
     * APIMethod: getPageSize
     * returns the current page size
     */
    getPageSize: function () {
        return this.itemsPerPage;
    },
    /**
     * APIMethod: getTotalCount
     * returns the total number of items as received from the protocol.
     */
    getTotalCount: function () {
        return this.totalItems;
    }
});/*
---

name: Jx.Store.Strategy.Progressive

description: Strategy based on Strategy.Paginate but loads data progressively without removing old or curent data from the store.

license: MIT-style license.

requires:
 - Jx.Store.Strategy.Paginate

provides: [Jx.Store.Strategy.Progressive]

...
 */
/**
 * Class: Jx.Store.Strategy.Progressive
 *
 * Extends: <Jx.Store.Strategy.Paginate>
 *
 * Store strategy for progressively obtaining results in a store. You can
 * continually call nextPage() to get the next page and the store will retain
 * all current data. You can set a maximum number of records the store should
 * hold and whether it should dropRecords when that max is hit.
 *
 * License:
 * Copyright (c) 2010, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Progressive = new Class({
    
    Extends: Jx.Store.Strategy.Paginate,
    
    name: 'progressive',
    
    options: {
        /**
         * Option: maxRecords
         * The maximum number of records we want in the store at any one time.
         */
        maxRecords: 1000,
        /**
         * Option: dropRecords
         * Whether the strategy should drop records when the maxRecords limit 
         * is reached. if this is false then maxRecords is ignored and data is
         * always added to the bottom of the store. 
         */
        dropRecords: true
    },
    /**
     * Property: startingPage
     */
    startingPage: 0,
    /**
     * Property: maxPages
     */
    maxPages: null,
    /**
     * Property: loadedPages
     */
    loadedPages: 0,
    /**
     * Property: loadAt
     * Options are 'top' or 'bottom'. Defaults to 'bottom'.
     */
    loadAt: 'bottom',
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        if (this.options.dropPages) {
            this.maxPages = Math.ceil(this.options.maxRecords/this.itemsPerPage);
        }
    },
    
    /**
     * Method: loadStore
     * Used to assist in the loading of data into the store. This is 
     * called as a response to the protocol finishing.
     * 
     *  Parameters:
     *  resp - the response object
     */
    loadStore: function (resp) {
        this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
        if (resp.success()) {
            if ($defined(resp.meta)) {
                this.parseMetaData(resp.meta);
            }
            this.loadData(resp.data);
        } else {
            this.store.fireEvent('storeDataLoadFailed', this.store);
        }
    },
    
    /**
     * Method: loadData
     * This method does the actual work of loading data to the store. It is
     * called when either the protocol finishes or setPage() has the data and
     * it's not expired.
     * 
     * Parameters:
     * data - the data to load into the store.
     */
    loadData: function (data) {
        this.store.loaded = false;
        this.store.addRecords(data, this.loadAt);
        this.store.loaded = true;
        this.loadedPages++;
        this.store.fireEvent('storeDataLoaded',this.store);
    },
    
    /**
     * APIMethod: nextPage
     * Allows a caller (i.e. a paging toolbar) to load more data to the end of 
     * the store
     * 
     * Parameters:
     * params - a hash of parameters to pass to the request if needed.
     */
    nextPage: function (params) {
        if (!$defined(params)) {
            params = {};
        }
        if (this.options.dropRecords && this.totalPages > this.startingPage + this.loadedPages) {
            this.loadAt = 'bottom';
            if (this.loadedPages >= this.maxPages) {
                //drop records before getting more
                this.startingPage++;
                this.store.removeRecords(0,this.itemsPerPage - 1);
                this.loadedPages--;
            }
        }
        this.page = this.startingPage + this.loadedPages + 1;
        this.load($merge(this.params, params));
    },
    /**
     * APIMethod: previousPage
     * Allows a caller to move back to the previous page.
     *
     * Parameters:
     * params - a hash of parameters to pass to the request if needed.
     */
    previousPage: function (params) {
        //if we're not dropping pages there's nothing to do
        if (!this.options.dropRecords) {
            return;
        }
        
        if (!$defined(params)) {
            params = {};
        }
        if (this.startingPage > 0) {
            this.loadAt = 'top';
            if (this.loadedPages >= this.maxPages) {
                //drop off end before loading previous pages
                this.startingPage--;
                this.store.removeRecords(this.options.maxRecords - this.itemsPerPage, this.options.maxRecords);
                this.loadedPages--;
            }
            this.page = this.startingPage;
            this.load($merge(this.params, params));
        }
    }
});/*
---

name: Jx.Store.Strategy.Save

description: Strategy used for saving data back to a source. Can be called manually or setup to automatically save on every change.

license: MIT-style license.

requires:
 - Jx.Store.Strategy

provides: [Jx.Store.Strategy.Save]

...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Save 
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * A Store strategy class for saving data via protocols
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Save = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'save',
    
    options: {
        /**
         * Option: autoSave
         * Whether the strategy should be watching the store to save changes
         * automatically. Set to True to watch events, set it to a number of 
         * milliseconds to have the strategy save every so many seconds
         */
        autoSave: false
    },
    /**
     * Property: failedChanges
     * an array holding all failed requests
     */
    failedChanges: [],
    /**
     * Property: successfulChanges
     * an array holding all successful requests
     */
    successfulChanges: [],
    /**
     * Property: totalChanges
     * The total number of changes being processed. Used to determine
     * when to fire off the storeChangesCompleted event on the store
     */
    totalChanges: 0,
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.bound.save = this.saveRecord.bind(this);
        this.bound.update = this.updateRecord.bind(this);
        this.bound.completed = this.onComplete.bind(this);
        this.parent();
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        this.parent();
        if (Jx.type(this.options.autoSave) === 'number') {
            this.periodicalId = this.save.periodical(this.options.autoSave, this);
        } else if (this.options.autoSave) {
            this.store.addEvent('storeRecordAdded', this.bound.save);
            this.store.addEvent('storeColumnChanged', this.bound.update);
            this.store.addEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        this.parent();
        if ($defined(this.periodicalId)) {
            $clear(this.periodicalId);
        } else if (this.options.autoSave) {
            this.store.removeEvent('storeRecordAdded', this.bound.save);
            this.store.removeEvent('storeColumnChanged', this.bound.update);
            this.store.removeEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    /**
     * APIMethod: updateRecord
     * called by event handlers when store data is updated
     *
     * Parameters:
     * index - {Integer} the row that was affected
     * column - {String} the column that was affected
     * oldValue - {Mixed} the previous value
     * newValue - {Mixed} the new value
     */
    updateRecord: function(index, column, oldValue, newValue) {
      var resp = this.saveRecord(this.store, this.store.getRecord(index));
      // no response if updating or record state not set
      if (resp) {
        resp.index = index;
      }
    },
    /**
     * APIMethod: saveRecord
     * Called by event handlers when a store record is added, or deleted. 
     * If deleted, the record will be removed from the deleted array.
     * 
     * Parameters:
     * record - The Jx.Record instance that was changed
     * store - The instance of the store
     */
    saveRecord: function (store, record) {
        //determine the status and route based on that
        if (!this.updating && $defined(record.state)) {
            if (this.totalChanges === 0) {
                store.protocol.addEvent('dataLoaded', this.bound.completed);
            }
            this.totalChanges++;
            var ret;
            switch (record.state) {
                case Jx.Record.UPDATE:
                    ret = store.protocol.update(record);
                    break;
                case Jx.Record.DELETE:
                    ret = store.protocol['delete'](record);
                    break;
                case Jx.Record.INSERT:
                    ret = store.protocol.insert(record);
                    break;
                default:
                  break;
            }
            return ret;
        }
    },
    /**
     * APIMethod: save
     * Called manually when the developer wants to save all data changes 
     * in one shot. It will empty the deleted array and reset all other status 
     * flags
     */
    save: function () {
        //go through all of the data and figure out what needs to be acted on
        if (this.store.loaded) {
            var records = [];
            records[Jx.Record.UPDATE] = [];
            records[Jx.Record.INSERT] = [];
            
            this.store.data.each(function (record) {
                if ($defined(record) && $defined(record.state)) {
                    records[record.state].push(record);
                }
            }, this);
            records[Jx.Record.DELETE] = this.store.deleted;
            
            if (!this.updating) {
              if (this.totalChanges === 0) {
                  store.protocol.addEvent('dataLoaded', this.bound.completed);
              }
              this.totalChanges += records[Jx.Record.UPDATE].length + 
                                   records[Jx.Record.INSERT].length +
                                   records[Jx.Record.DELETE].length;
              if (records[Jx.Record.UPDATE].length) {
                this.store.protocol.update(records[Jx.Record.UPDATE]);
              }
              if (records[Jx.Record.INSERT].length) {
                this.store.protocol.insert(records[Jx.Record.INSERT]);
              }
              if (records[Jx.Record.DELETE].length) {
                this.store.protocol['delete'](records[Jx.Record.DELETE]);
              }
            }
            
            // records.flatten().each(function (record) {
            //     this.saveRecord(this.store, record);
            // }, this);
        }
        
    },
    /**
     * Method: onComplete
     * Handles processing of the response(s) from the protocol. Each 
     * update/insert/delete will have an individual response. If any responses 
     * come back failed we will hold that response and send it to the caller
     * via the fired event. This method is responsible for updating the status
     * of each record as it returns and on inserts, it updates the primary key
     * of the record. If it was a delete it will remove it permanently from
     * the store's deleted array (provided it returns successful - based on
     * the success attribute of the meta object). When all changes have been 
     * accounted for the method fires a finished event and passes all of the 
     * failed responses to the caller so they can be handled appropriately.
     * 
     * Parameters:
     * response - the response returned from the protocol
     */
    onComplete: function (response) {
        if (!response.success() || ($defined(response.meta) && !response.meta.success)) {
            this.failedChanges.push(response);
        } else {
            //process the response
            var records = [response.requestParams[0]].flatten(),
                responseData = $defined(response.data) ? [response.data].flatten() : null;
            records.each(function(record, index) {
              if (response.requestType === 'delete') {
                  this.store.deleted.erase(record);
              } else { 
                  if (response.requestType === 'insert' || response.requestType == 'update') {
                      if (responseData && $defined(responseData[index])) {
                          this.updating = true;
                          $H(responseData[index]).each(function (val, key) {
                              var d = record.set(key, val);
                              if (d[1] != val) {
                                d.unshift(index);
                                record.store.fireEvent('storeColumnChanged', d);
                              }
                          });
                          this.updating = false;
                      }
                  }
                  record.state = null;
              } 
              this.totalChanges--;
          }, this);
          this.successfulChanges.push(response);
        }
        if (this.totalChanges === 0) {
            this.store.protocol.removeEvent('dataLoaded', this.bound.completed);
            this.store.fireEvent('storeChangesCompleted', {
                successful: this.successfulChanges,
                failed: this.failedChanges
            });
        }
    }
});/*
---

name: Jx.Store.Strategy.Sort

description: Strategy used for sorting results in a store after they are loaded.

license: MIT-style license.

requires:
 - Jx.Store.Strategy
 - Jx.Sort.Mergesort
 - Jx.Compare

provides: [Jx.Store.Strategy.Sort]
...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Sort
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * Strategy used for sorting stores. It can either be called manually or it
 * can listen for specific events from the store.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Sort = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'sort',
    
    options: {
        /**
         * Option: sortOnStoreEvents
         * an array of events this strategy should listen for on the store and
         * sort when it sees them.
         */
        sortOnStoreEvents: ['storeColumnChanged','storeDataLoaded'],
        /**
         * Option: defaultSort
         * The default sorting type, currently set to merge but can be any of
         * the sorters available
         */
        defaultSort : 'merge',
        /**
         * Option: separator
         * The separator to pass to the comparator
         * constructor (<Jx.Compare>) - defaults to '.'
         */
        separator : '.',
        /**
         * Option: sortCols
         * An array of columns to sort by arranged in the order you want 
         * them sorted.
         */
        sortCols : []
    },
    
    /**
     * Property: sorters
     * an object listing the different sorters available
     */
    sorters : {
        quick : "Quicksort",
        merge : "Mergesort",
        heap : "Heapsort",
        'native' : "Nativesort"
    },
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        this.bound.sort = this.sort.bind(this);
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        if ($defined(this.options.sortOnStoreEvents)) {
            this.options.sortOnStoreEvents.each(function (ev) {
                this.store.addEvent(ev, this.bound.sort);
            },this);
        }
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        if ($defined(this.options.sortOnStoreEvents)) {
            this.options.sortOnStoreEvents.each(function (ev) {
                this.store.removeEvent(ev, this.bound.sort);
            },this);
        }
    },
    
    /**
     * APIMethod: sort 
     * Runs the sorting and grouping
     * 
     * Parameters: 
     * cols - Optional. An array of columns to sort/group by 
     * sort - the sort type (quick,heap,merge,native),defaults to
     *     options.defaultSort
     * dir - the direction to sort. Set to "desc" for descending,
     * anything else implies ascending (even null). 
     */
    sort : function (cols, sort, dir) {
        if (this.store.count()) {
            this.store.fireEvent('sortStart', this);
            var c;
            if ($defined(cols) && Jx.type(cols) === 'array') {
                c = this.options.sortCols = cols;
            } else if ($defined(cols) && Jx.type(cols) === 'string') {
                this.options.sortCols = [];
                this.options.sortCols.push(cols);
                c = this.options.sortCols;
            } else if ($defined(this.options.sortCols)) {
                c = this.options.sortCols;
            } else {
                return null;
            }
            
            this.sortType = sort;
            // first sort on the first array item
            this.store.data = this.doSort(c[0], sort, this.store.data, true);
        
            if (c.length > 1) {
                this.store.data = this.subSort(this.store.data, 0, 1);
            }
        
            if ($defined(dir) && dir === 'desc') {
                this.store.data.reverse();
            }
        
            this.store.fireEvent('storeSortFinished', this);
        }
    },
    
    /**
     * Method: subSort 
     * Does the actual group sorting.
     * 
     * Parameters: 
     * data - what to sort 
     * groupByCol - the column that determines the groups 
     * sortCol - the column to sort by
     * 
     * returns: the result of the grouping/sorting
     */
    subSort : function (data, groupByCol, sortByCol) {
        
        if (sortByCol >= this.options.sortCols.length) {
            return data;
        }
        /**
         *  loop through the data array and create another array with just the
         *  items for each group. Sort that sub-array and then concat it 
         *  to the result.
         */
        var result = [];
        var sub = [];
        
        var groupCol = this.options.sortCols[groupByCol];
        var sortCol = this.options.sortCols[sortByCol];
    
        var group = data[0].get(groupCol);
        this.sorter.setColumn(sortCol);
        for (var i = 0; i < data.length; i++) {
            if (group === (data[i]).get(groupCol)) {
                sub.push(data[i]);
            } else {
                // sort
    
                if (sub.length > 1) {
                    result = result.concat(this.subSort(this.doSort(sortCol, this.sortType, sub, true), groupByCol + 1, sortByCol + 1));
                } else {
                    result = result.concat(sub);
                }
            
                // change group
                group = (data[i]).get(groupCol);
                // clear sub
                sub.empty();
                // add to sub
                sub.push(data[i]);
            }
        }
        
        if (sub.length > 1) {
            this.sorter.setData(sub);
            result = result.concat(this.subSort(this.doSort(sortCol, this.sortType, sub, true), groupByCol + 1, sortByCol + 1));
        } else {
            result = result.concat(sub);
        }
        
        //this.data = result;
        
        return result;
    },
    
    /**
     * Method: doSort 
     * Called to change the sorting of the data
     * 
     * Parameters: 
     * col - the column to sort by 
     * sort - the kind of sort to use (see list above) 
     * data - the data to sort (leave blank or pass null to sort data
     * existing in the store) 
     * ret - flag that tells the function whether to pass
     * back the sorted data or store it in the store 
     * options - any options needed to pass to the sorter upon creation
     * 
     * returns: nothing or the data depending on the value of ret parameter.
     */
    doSort : function (col, sort, data, ret, options) {
        options = {} || options;
        
        sort = (sort) ? this.sorters[sort] : this.sorters[this.options.defaultSort];
        data = data ? data : this.data;
        ret = ret ? true : false;
        
        if (!$defined(this.comparator)) {
            this.comparator = new Jx.Compare({
                separator : this.options.separator
            });
        }
        
        this.col = col = this.resolveCol(col);
        
        var fn = this.comparator[col.type].bind(this.comparator);
        if (!$defined(this.sorter)) {
            this.sorter = new Jx.Sort[sort](data, fn, col.name, options);
        } else {
            this.sorter.setComparator(fn);
            this.sorter.setColumn(col.name);
            this.sorter.setData(data);
        }
        var d = this.sorter.sort();
        
        if (ret) {
            return d;
        } else {
            this.data = d;
        }
    },
    /**
     * Method: resolveCol
     * resolves the given column identifier and resolves it to the 
     * actual column object in the store.
     * 
     * Parameters:
     * col - the name or index of the required column.
     */
    resolveCol: function (col) {
        var t = Jx.type(col);
        if (t === 'number') {
            col = this.store.options.columns[col];
        } else if (t === 'string') {
            this.store.options.columns.each(function (column) {
                if (column.name === col) {
                    col = column;
                }
            }, this);
        }
        return col;   
    }
});/*
---

name: Jx.Store.Parser

description: Base class for all data parsers. Parsers are used by protocols to get data received or sent in the proper formats.

license: MIT-style license.

requires:
 - Jx.Store

provides: [Jx.Store.Parser]

...
 */
// $Id$
/**
 * Class: Jx.Store.Parser
 * 
 * Extends: <Jx.Object>
 * 
 * Base class for all parsers
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

Jx.Store.Parser = new Class({
    
    Extends: Jx.Object,
    Family: 'Jx.Store.Parser',
    
    /**
     * APIMethod: parse
     * Reads data passed to it by a protocol and parses it into a specific
     * format needed by the store/record.
     * 
     * Parameters:
     * data - string of data to parse
     */
    parse: $empty,
    /**
     * APIMethod: encode
     * Takes an Jx.Record object and encodes it into a format that can be transmitted 
     * by a protocol.
     * 
     * Parameters:
     * object - an object to encode
     */
    encode: $empty
});/*
---

name: Jx.Store.Parser.JSON

description: Parser for reading and writting JSON formatted data.

license: MIT-style license.

requires:
 - Jx.Store.Parser
 - Core/JSON

provides: [Jx.Store.Parser.JSON]

...
 */
// $Id$
/**
 * Class: Jx.Store.Parser.JSON
 *
 * Extends: <Jx.Store.Parser>
 *
 * A Parser that handles encoding and decoding JSON strings
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Store.Parser.JSON = new Class({

    Extends: Jx.Store.Parser,

    options: {
        /**
         * Option: secure
         * Whether to use secure decoding. When using secure decoding the
         * parser will return null if any invalid JSON characters are in the
         * passed in string. Defaults to false.
         */
        secure: false
    },
    /**
     * APIMethod: parse
     * Turns a string into a JSON object if possible.
     *
     * Parameters:
     * data - the string representation of the data we're parsing
     */
    parse: function (data) {
        var type = Jx.type(data);

        if (type === 'string') {
            return JSON.decode(data, this.options.secure);
        }
        //otherwise just return the data object
        return data;
    },

    /**
     * APIMethod: encode
     * Takes an object and turns it into JSON.
     *
     * Parameters:
     * object - the object to encode
     */
    encode: function (object) {
        var data;
        if (object instanceof Jx.Record) {
            data = object.asHash();
        } else {
            data = object;
        }

        return JSON.encode(data);
    }
});/*
---

name: Jx.Button

description: Jx.Button creates a clickable element that can be added to a web page.

license: MIT-style license.

requires:
 - Jx.Widget

optional:
 - Core/Drag

provides: [Jx.Button]

css:
 - button

images:
 - button.png

...
 */
// $Id$
/**
 * Class: Jx.Button
 *
 * Extends: <Jx.Widget>
 *
 * Jx.Button creates a clickable element that can be added to a web page.
 * When the button is clicked, it fires a 'click' event.
 *
 * When you construct a new instance of Jx.Button, the button does not
 * automatically get inserted into the web page.  Typically a button
 * is used as part of building another capability such as a Jx.Toolbar.
 * However, if you want to manually insert the button into your application,
 * you may use the <Jx.Button::addTo> method to append or insert the button into the
 * page.
 *
 * There are two modes for a button, normal and toggle.  A toggle button
 * has an active state analogous to a checkbox.  A toggle button generates
 * different events (down and up) from a normal button (click).  To create
 * a toggle button, pass toggle: true to the Jx.Button constructor.
 *
 * To use a Jx.Button in an application, you should to register for the
 * 'click' event.  You can pass a function in the 'onClick' option when
 * constructing a button or you can call the addEvent('click', myFunction)
 * method.  The addEvent method can be called several times, allowing more
 * than one function to be called when a button is clicked.  You can use the
 * removeEvent('click', myFunction) method to stop receiving click events.
 *
 * Example:
 *
 * (code)
 * var button = new Jx.Button(options);
 * button.addTo('myListItem'); // the id of an LI in the page.
 * (end)
 *
 * (code)
 * Example:
 * var options = {
 *     imgPath: 'images/mybutton.png',
 *     tooltip: 'click me!',
 *     label: 'click me',
 *     onClick: function() {
 *         alert('you clicked me');
 *     }
 * };
 * var button = new Jx.Button(options);
 * button.addEvent('click', anotherFunction);
 *
 * function anotherFunction() {
 *   alert('a second alert for a single click');
 * }
 * (end)
 *
 * Events:
 * click - the button was pressed and released (only if type is not 'toggle').
 * down - the button is down (only if type is 'toggle')
 * up - the button is up (only if the type is 'toggle').
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button = new Class({
    Family: 'Jx.Button',
    Extends: Jx.Widget,

    options: {
        /* Option: image
         * optional.  A string value that is the url to load the image to
         * display in this button.  The default styles size this image to 16 x
         * 16.  If not provided, then the button will have no icon.
         */
        image: '',
        /* Option: tooltip
         * optional.  A string value to use as the alt/title attribute of the
         * <A> tag that wraps the button, resulting in a tooltip that appears
         * when the user hovers the mouse over a button in most browsers.  If
         * not provided, the button will have no tooltip.
         */
        tooltip: '',
        /* Option: label
         * optional, default is no label.  A string value that is used as a
         * label on the button. - use an object for localization: { set: 'Examples', key: 'lanKey', value: 'langValue' }
         * see widget.js for details
         */
        label: '',
        /* Option: toggle
         * default true, whether the button is a toggle button or not.
         */
        toggle: false,
        /* Option: toggleClass
         * A class to apply to the button if it is a toggle button,
         * 'jxButtonToggle' by default.
         */
        toggleClass: 'jxButtonToggle',
        /* Option: pressedClass
         * A class to apply to the button when it is pressed,
         * 'jxButtonPressed' by default.
         */
        pressedClass: 'jxButtonPressed',
        /* Option: activeClass
         * A class to apply to the buttonwhen it is active,
         * 'jxButtonActive' by default.
         */
        activeClass: 'jxButtonActive',

        /* Option: active
         * optional, default false.  Controls the initial state of toggle
         * buttons.
         */
        active: false,
        /* Option: enabled
         * whether the button is enabled or not.
         */
        enabled: true,
        /* Option: href
         * set an href on the button's action object, typically an <a> tag.
         * Default is javascript:void(0) and use onClick.
         */
        href: 'javascript:void(0);',
        /* Option: target
         * for buttons that have an href, allow setting the target
         */
        target: '',
        /* Option: template
         * the HTML structure of the button.  As a minimum, there must be a
         * containing element with a class of jxButtonContainer and an
         * internal element with a class of jxButton.  jxButtonIcon and
         * jxButtonLabel are used if present to put the image and label into
         * the button.
         */
        template: '<span class="jxButtonContainer"><a class="jxButton"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel"></span></span></a></span>'
    },

    /**
     * Property: classes
     * used to auto-populate this object with element references when
     * processing templates
     */
    classes: new Hash({
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        domImg: 'jxButtonIcon',
        domLabel: 'jxButtonLabel'
    }),

    /**
     * Method: render
     * create a new button.
     */
    render: function() {
        this.parent();
        var options = this.options,
            hasFocus,
            mouseDown;
        /* is the button toggle-able? */
        if (options.toggle) {
            this.domObj.addClass(options.toggleClass);
        }

        // the clickable part of the button
        if (this.domA) {
            this.domA.set({
                target: options.target,
                href: options.href,
                title: this.getText(options.tooltip),
                alt: this.getText(options.tooltip)
            });
            this.domA.addEvents({
                click: this.clicked.bindWithEvent(this),
                drag: (function(e) {e.stop();}).bindWithEvent(this),
                mousedown: (function(e) {
                    this.domA.addClass(options.pressedClass);
                    hasFocus = true;
                    mouseDown = true;
                    this.focus();
                }).bindWithEvent(this),
                mouseup: (function(e) {
                    this.domA.removeClass(options.pressedClass);
                    mouseDown = false;
                }).bindWithEvent(this),
                mouseleave: (function(e) {
                    this.domA.removeClass(options.pressedClass);
                }).bindWithEvent(this),
                mouseenter: (function(e) {
                    if (hasFocus && mouseDown) {
                        this.domA.addClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                keydown: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.addClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                keyup: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.removeClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                blur: function() { hasFocus = false; }
            });

            if (typeof Drag != 'undefined') {
                new Drag(this.domA, {
                    onStart: function() {this.stop();}
                });
            }
        }

        if (this.domImg) {
            if (options.image || !options.label) {
                this.domImg.set({
                    title: this.getText(options.tooltip),
                    alt: this.getText(options.tooltip)
                });
                if (options.image && options.image.indexOf(Jx.aPixel.src) == -1) {
                    this.domImg.setStyle('backgroundImage',"url("+options.image+")");
                }
                if (options.imageClass) {
                    this.domImg.addClass(options.imageClass);
                }
            } else {
                //remove the image if we don't need it
                this.domImg.setStyle('display','none');
            }
        }

        if (this.domLabel) {
            if (options.label || this.domA.hasClass('jxDiscloser')) {
                this.setLabel(options.label);
            } else {
                //this.domLabel.removeClass('jx'+this.type+'Label');
                this.domLabel.setStyle('display','none');
            }
        }

        if (options.id) {
            this.domObj.set('id', options.id);
        }

        //update the enabled state
        this.setEnabled(options.enabled);

        //update the active state if necessary
        if (options.active) {
            options.active = false;
            this.setActive(true);
        }
    },
    /**
     * APIMethod: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     *
     * Parameters:
     * evt - {Event} the user click event
     */
    clicked : function(evt) {
        var options = this.options;
        if (options.enabled && !this.isBusy()) {
            if (options.toggle) {
                this.setActive(!options.active);
            } else {
                this.fireEvent('click', {obj: this, event: evt});
            }
        }
        //return false;
    },
    /**
     * APIMethod: isEnabled
     * This returns true if the button is enabled, false otherwise
     *
     * Returns:
     * {Boolean} whether the button is enabled or not
     */
    isEnabled: function() {
        return this.options.enabled;
    },

    /**
     * APIMethod: setEnabled
     * enable or disable the button.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the button
     */
    setEnabled: function(enabled) {
        this.options.enabled = enabled;
        if (enabled) {
            this.domObj.removeClass('jxDisabled');
        } else {
            this.domObj.addClass('jxDisabled');
        }
    },
    /**
     * APIMethod: isActive
     * For toggle buttons, this returns true if the toggle button is
     * currently active and false otherwise.
     *
     * Returns:
     * {Boolean} the active state of a toggle button
     */
    isActive: function() {
        return this.options.active;
    },
    /**
     * APIMethod: setActive
     * Set the active state of the button
     *
     * Parameters:
     * active - {Boolean} the new active state of the button
     */
    setActive: function(active) {
        var options = this.options;
        if (options.enabled && !this.isBusy()) {
          if (options.active == active) {
              return;
          }
          options.active = active;
          if (this.domA) {
              if (options.active) {
                  this.domA.addClass(options.activeClass);
              } else {
                  this.domA.removeClass(options.activeClass);
              }
          }
          this.fireEvent(active ? 'down':'up', this);
        }
    },
    /**
     * APIMethod: setImage
     * set the image of this button to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this button
     */
    setImage: function(path) {
        this.options.image = path;
        if (this.domImg) {
            this.domImg.setStyle('backgroundImage',
                                 "url("+path+")");
            this.domImg.setStyle('display', path ? null : 'none');
        }
    },
    /**
     * APIMethod: setLabel
     * sets the text of the button.
     *
     * Parameters:
     * label - {String} the new label for the button
     */
    setLabel: function(label) {
        this.options.label = label;
        if (this.domLabel) {
            this.domLabel.set('html', this.getText(label));
            this.domLabel.setStyle('display', label || this.domA.hasClass('jxDiscloser') ? null : 'none');
        }
    },
    /**
     * APIMethod: getLabel
     * returns the text of the button.
     */
    getLabel: function() {
        return this.options.label;
    },
    /**
     * APIMethod: setTooltip
     * sets the tooltip displayed by the button
     *
     * Parameters:
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        if (this.domA) {
            this.domA.set({
                'title':this.getText(tooltip),
                'alt':this.getText(tooltip)
            });
        }
        //need to account for the tooltip on the image as well
        if (this.domImg) {
            //check if title and alt are set...
            var t = this.domImg.get('title');
            if ($defined(t)) {
                //change it...
                this.domImg.set({
                    'title':this.getText(tooltip),
                    'alt':this.getText(tooltip)
                });
            }
        }
    },
    /**
     * APIMethod: focus
     * capture the keyboard focus on this button
     */
    focus: function() {
        if (this.domA) {
            this.domA.focus();
        }
    },
    /**
     * APIMethod: blur
     * remove the keyboard focus from this button
     */
    blur: function() {
        if (this.domA) {
            this.domA.blur();
        }
    },

    /**
     * APIMethod: changeText
     *
     * updates the label of the button on langChange Event for
     * Internationalization
     */
    changeText : function(lang) {
        this.parent();
        this.setLabel(this.options.label);
        this.setTooltip(this.options.tooltip);
    }
});
/*
---

name: Jx.Button.Flyout

description: Flyout buttons expose a panel when the user clicks the button.

license: MIT-style license.

requires:
 - Jx.Button

provides: [Jx.Button.Flyout]

images:
 - flyout_chrome.png
 - emblems.png

...
 */
// $Id$
/**
 * Class: Jx.Button.Flyout
 *
 * Extends: <Jx.Button>
 *
 * Flyout buttons expose a panel when the user clicks the button.  The
 * panel can have arbitrary content.  You must provide any necessary
 * code to hook up elements in the panel to your application.
 *
 * When the panel is opened, the 'open' event is fired.  When the panel is
 * closed, the 'close' event is fired.  You can register functions to handle
 * these events in the options passed to the constructor (onOpen, onClose).
 *
 * The user can close the flyout panel by clicking the button again, by
 * clicking anywhere outside the panel and other buttons, or by pressing the
 * 'esc' key.
 *
 * Flyout buttons implement <Jx.ContentLoader> which provides the hooks to
 * insert content into the Flyout element.  Note that the Flyout element
 * is not appended to the DOM until the first time it is opened, and it is
 * removed from the DOM when closed.
 *
 * It is generally best to specify a width and height for your flyout content
 * area through CSS to ensure that it works correctly across all browsers.
 * You can do this for all flyouts using the .jxFlyout CSS selector, or you
 * can apply specific styles to your content elements.
 *
 * A flyout closes other flyouts when it is opened.  It is possible to embed
 * flyout buttons inside the content area of another flyout button.  In this
 * case, opening the inner flyout will not close the outer flyout but it will
 * close any other flyouts that are siblings.
 *
 * Example:
 * (code)
 * var flyout = new Jx.Button.Flyout({
 *      label: 'flyout',
 *      content: 'flyoutContent',
 *      onOpen: function(flyout) {
 *          console.log('flyout opened');
 *      },
 *      onClose: function(flyout) {
 *          console.log('flyout closed');
 *      }
 * });
 * (end)
 *
 * Events:
 * open - this event is triggered when the flyout is opened.
 * close - this event is triggered when the flyout is closed.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button.Flyout = new Class({
    Family: 'Jx.Button.Flyout',
    Extends: Jx.Button,
    Binds: ['keypressHandler', 'clickHandler'],
    options: {
        /* Option: template
         * the HTML structure of the flyout button
         */
        template: '<span class="jxButtonContainer"><a class="jxButton jxButtonFlyout jxDiscloser"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel "></span></a></span>',
        /* Option: contentTemplate
         * the HTML structure of the flyout content area
         */
        contentTemplate: '<div class="jxFlyout"><div class="jxFlyoutContent"></div></div>',
        /* Option: position
         * where to position the flyout, see Jx.Widget::position
         * for details on how to specify this option
         */
        position: {
          horizontal: ['left left', 'right right'],
          vertical: ['bottom top', 'top bottom']
        },
        /* Option: positionElement
         * the element to position the flyout relative to, by default
         * it is the domObj of this button and should only be changed
         * if you really know what you are doing
         */
        positionElement: null
    },

    /**
     * Property: contentClasses
     * the classes array for processing the contentTemplate
     */
    contentClasses: new Hash({
        contentContainer: 'jxFlyout',
        content: 'jxFlyoutContent'
    }),

    /**
     * Property: content
     * the HTML element that contains the flyout content
     */
    content: null,
    /**
     * Method: render
     * construct a new instance of a flyout button.
     */
    render: function() {
        var options = this.options;
        if (!Jx.Button.Flyout.Stack) {
            Jx.Button.Flyout.Stack = [];
        }
        this.parent();
        this.processElements(options.contentTemplate, this.contentClasses);

        if (options.contentClass) {
            this.content.addClass(options.contentClass);
        }

        this.content.store('jxFlyout', this);
        if(!options.loadOnDemand || options.active) {
          this.loadContent(this.content);
        }else{
          this.addEvent('contentLoaded', function(ev) {
            this.show(ev);
          }.bind(this));
        }
    },
    cleanup: function() {
      this.content.eliminate('jxFlyout');
      this.content.destroy();
      this.contentClasses.each(function(v,k){
        this[k] = null;
      }, this);
      this.parent();
    },
    /**
     * APIMethod: clicked
     * Override <Jx.Button::clicked> to hide/show the content area of the
     * flyout.
     *
     * Parameters:
     * e - {Event} the user event
     */
    clicked: function(e) {
        var options = this.options;
        if (!options.enabled) {
            return;
        }
        if (this.contentIsLoaded && options.cacheContent) {
          this.show(e);
        // load on demand or reload content if caching is disabled
        } else if (options.loadOnDemand || !options.cacheContent) {
          this.loadContent(this.content);
        } else {
          this.show(e);
        }
    },
   /**
    * Private Method: show
    * Shows the Flyout after the content is loaded asynchronously
    *
    * Parameters:
    * e - {Event} - the user or contentLoaded event
    */
    show: function(e) {
        var node,
            flyout,
            owner = this.owner,
            stack = Jx.Button.Flyout.Stack,
            options = this.options;
       /* find out what we are contained by if we don't already know */
        if (!owner) {
            this.owner = owner = document.body;
            var node = document.id(this.domObj.parentNode);
            while (node != document.body && owner == document.body) {
                var flyout = node.retrieve('jxFlyout');
                if (flyout) {
                    this.owner = owner = flyout;
                    break;
                } else {
                    node = document.id(node.parentNode);
                }
            }
        }
        if (stack[stack.length - 1] == this) {
            this.hide();
            return;
        } else if (owner != document.body) {
            /* if we are part of another flyout, close any open flyouts
             * inside the parent and register this as the current flyout
             */
            if (owner.currentFlyout == this) {
                /* if the flyout to close is this flyout,
                 * hide this and return */
                this.hide();
                return;
            } else if (owner.currentFlyout) {
                owner.currentFlyout.hide();
            }
            owner.currentFlyout = this;
        } else {
            /* if we are at the top level, close the entire stack before
             * we open
             */
            while (stack.length) {
                stack[stack.length - 1].hide();
            }
        }
        // now we go on the stack.
        stack.push(this);
        this.fireEvent('beforeOpen');

        options.active = true;
        this.domA.addClass(options.activeClass);
        this.contentContainer.setStyle('visibility','hidden');
        document.id(document.body).adopt(this.contentContainer);
        this.content.getChildren().each(function(child) {
            if (child.resize) {
                child.resize();
            }
        });
        this.showChrome(this.contentContainer);

        var rel = options.positionElement || this.domObj;
        var pos = $merge(options.position, {
          offsets: this.chromeOffsets
        });
        this.position(this.contentContainer, rel, pos);

        /* we have to size the container for IE to render the chrome correctly
         * there is some horrible peekaboo bug in IE 6
         */
        this.contentContainer.setContentBoxSize(document.id(this.content).getMarginBoxSize());

        this.stack(this.contentContainer);
        this.contentContainer.setStyle('visibility','');

        document.addEvent('keydown', this.keypressHandler);
        document.addEvent('click', this.clickHandler);
        this.fireEvent('open', this);
    },

    /**
     * APIMethod: hide
     * Closes the flyout if open
     */
    hide: function() {
        if (this.owner != document.body) {
            this.owner.currentFlyout = null;
        }
        Jx.Button.Flyout.Stack.pop();
        this.setActive(false);
        this.contentContainer.dispose();
        this.unstack(this.contentContainer);
        document.removeEvent('keydown', this.keypressHandler);
        document.removeEvent('click', this.clickHandler);
        this.fireEvent('close', this);
    },
    /**
     * Method: clickHandler
     * hide flyout if the user clicks outside of the flyout
     */
    clickHandler: function(e) {
        e = new Event(e);
        var elm = document.id(e.target),
            flyout = Jx.Button.Flyout.Stack[Jx.Button.Flyout.Stack.length - 1];
        if (!elm.descendantOf(flyout.content) &&
            !elm.descendantOf(flyout.domObj)) {
            flyout.hide();
        }
    },
    /**
     * Method: keypressHandler
     * hide flyout if the user presses the ESC key
     */
    keypressHandler: function(e) {
        e = new Event(e);
        if (e.key == 'esc') {
            Jx.Button.Flyout.Stack[Jx.Button.Flyout.Stack.length - 1].hide();
        }
    }
});/*
---

name: Jx.ColorPalette

description: A Jx.ColorPalette presents a user interface for selecting colors.  This is typically combined with a Jx.Button.Color which embeds the color palette in a flyout.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.ColorPalette]

css:
 - color

images:
 - grid.png

...
 */
// $Id$
/**
 * Class: Jx.ColorPalette
 *
 * Extends: <Jx.Widget>
 *
 * A Jx.ColorPalette presents a user interface for selecting colors.
 * Currently, the user can either enter a HEX colour value or select from a
 * palette of web-safe colours.  The user can also enter an opacity value.
 *
 * A Jx.ColorPalette can be embedded anywhere in a web page using its addTo
 * method.  However, a <Jx.Button> suJx.Tooltipbclass is provided
 * (<Jx.Button.Color>) that embeds a colour panel inside a button for easy use
 * in toolbars.
 *
 * Colour changes are propogated via a change event.  To be notified
 * of changes in a Jx.ColorPalette, use the addEvent method.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * change - triggered when the color changes.
 * click - the user clicked on a color swatch (emitted after a change event)
 *
 * MooTools.lang keys:
 * - colorpalette.alphaLabel
 * 
 * 
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.ColorPalette = new Class({
    Family: 'Jx.ColorPalette',
    Extends: Jx.Widget,
    /**
     * Property: {HTMLElement} domObj
     * the HTML element representing the color panel
     */
    domObj: null,
    options: {
        /* Option: parent
         * default null, the DOM element to add the palette to.
         */
        parent: null,
        /* Option: color
         * default #000000, the initially selected color
         */
        color: '#000000',
        /* Option: alpha
         * default 100, the initial alpha value
         */
        alpha: 1,
        /* Option: hexColors
         * an array of hex colors for creating the palette, defaults to a
         * set of web safe colors.
         */
        hexColors: ['00', '33', '66', '99', 'CC', 'FF']
    },
    /**
     * Method: render
     * initialize a new instance of Jx.ColorPalette
     */
    render: function() {
        this.domObj = new Element('div', {
            id: this.options.id,
            'class':'jxColorPalette'
        });

        var top = new Element('div', {'class':'jxColorBar'});
        var d = new Element('div', {'class':'jxColorPreview'});

        this.selectedSwatch = new Element('div', {'class':'jxColorSelected'});
        this.previewSwatch = new Element('div', {'class':'jxColorHover'});
        d.adopt(this.selectedSwatch);
        d.adopt(this.previewSwatch);

        top.adopt(d);

        this.colorInputLabel = new Element('label', {
          'class':'jxColorLabel', 
          html:'#'
        });
        top.adopt(this.colorInputLabel);

        var cc = this.changed.bind(this);
        this.colorInput = new Element('input', {
            'class':'jxHexInput',
            'type':'text',
            'maxLength':6,
            events: {
                'keyup':cc,
                'blur':cc,
                'change':cc
            }
        });

        top.adopt(this.colorInput);

        this.alphaLabel = new Element('label', {'class':'jxAlphaLabel', 'html':this.getText({set:'Jx',key:'colorpalette',value:'alphaLabel'}) });
        top.adopt(this.alphaLabel);

        this.alphaInput = new Element('input', {
            'class':'jxAlphaInput',
            'type':'text',
            'maxLength':3,
            events: {
                'keyup': this.alphaChanged.bind(this)
            }
        });
        top.adopt(this.alphaInput);

        this.domObj.adopt(top);

        var swatchClick = this.swatchClick.bindWithEvent(this);
        var swatchOver = this.swatchOver.bindWithEvent(this);

        var table = new Element('table', {'class':'jxColorGrid'});
        var tbody = new Element('tbody');
        table.adopt(tbody);
        for (var i=0; i<12; i++) {
            var tr = new Element('tr');
            for (var j=-3; j<18; j++) {
                var bSkip = false;
                var r, g, b;
                /* hacky approach to building first three columns
                 * because I couldn't find a good way to do it
                 * programmatically
                 */

                if (j < 0) {
                    if (j == -3 || j == -1) {
                        r = g = b = 0;
                        bSkip = true;
                    } else {
                        if (i<6) {
                            r = g = b = i;
                        } else {
                            if (i == 6) {
                                r = 5; g = 0; b = 0;
                            } else if (i == 7) {
                                r = 0; g = 5; b = 0;
                            } else if (i == 8) {
                                r = 0; g = 0; b = 5;
                            } else if (i == 9) {
                                r = 5; g = 5; b = 0;
                            } else if (i == 10) {
                                r = 0; g = 5; b = 5;
                            } else if (i == 11) {
                                r = 5; g = 0; b = 5;
                            }
                        }
                    }
                } else {
                    /* remainder of the columns are built
                     * based on the current row/column
                     */
                    r = parseInt(i/6,10)*3 + parseInt(j/6,10);
                    g = j%6;
                    b = i%6;
                }
                var bgColor = '#'+this.options.hexColors[r]+
                                  this.options.hexColors[g]+
                                  this.options.hexColors[b];

                var td = new Element('td');
                if (!bSkip) {
                    td.setStyle('backgroundColor', bgColor);

                    var a = new Element('a', {
                        'class': 'colorSwatch ' + (((r > 2 && g > 2) || (r > 2 && b > 2) || (g > 2 && b > 2)) ? 'borderBlack': 'borderWhite'),
                        'href':'javascript:void(0)',
                        'title':bgColor,
                        'alt':bgColor,
                        events: {
                            'mouseover': swatchOver,
                            'click': swatchClick
                        }
                    });
                    a.store('swatchColor', bgColor);
                    td.adopt(a);
                } else {
                    var span = new Element('span', {'class':'emptyCell'});
                    td.adopt(span);
                }
                tr.adopt(td);
            }
            tbody.adopt(tr);
        }
        this.domObj.adopt(table);
        this.updateSelected();
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },

    /**
     * Method: swatchOver
     * handle the mouse moving over a colour swatch by updating the preview
     *
     * Parameters:
     * e - {Event} the mousemove event object
     */
    swatchOver: function(e) {
        var a = e.target;

        this.previewSwatch.setStyle('backgroundColor', a.retrieve('swatchColor'));
    },

    /**
     * Method: swatchClick
     * handle mouse click on a swatch by updating the color and hiding the
     * panel.
     *
     * Parameters:
     * e - {Event} the mouseclick event object
     */
    swatchClick: function(e) {
        var a = e.target;

        this.options.color = a.retrieve('swatchColor');
        this.updateSelected();
        this.fireEvent('click', this);
    },

    /**
     * Method: changed
     * handle the user entering a new colour value manually by updating the
     * selected colour if the entered value is valid HEX.
     */
    changed: function() {
        var color = this.colorInput.value;
        if (color.substring(0,1) == '#') {
            color = color.substring(1);
        }
        if (color.toLowerCase().match(/^[0-9a-f]{6}$/)) {
            this.options.color = '#' +color.toUpperCase();
            this.updateSelected();
        }
    },

    /**
     * Method: alphaChanged
     * handle the user entering a new alpha value manually by updating the
     * selected alpha if the entered value is valid alpha (0-100).
     */
    alphaChanged: function() {
        var alpha = this.alphaInput.value;
        if (alpha.match(/^[0-9]{1,3}$/)) {
            this.options.alpha = parseFloat(alpha/100);
            this.updateSelected();
        }
    },

    /**
     * APIMethod: setColor
     * set the colour represented by this colour panel
     *
     * Parameters:
     * color - {String} the new hex color value
     */
    setColor: function( color ) {
        this.colorInput.value = color;
        this.changed();
    },

    /**
     * APIMethod: setAlpha
     * set the alpha represented by this colour panel
     *
     * Parameters:
     * alpha - {Integer} the new alpha value (between 0 and 100)
     */
    setAlpha: function( alpha ) {
        this.alphaInput.value = alpha;
        this.alphaChanged();
    },

    /**
     * Method: updateSelected
     * update the colour panel user interface based on the current
     * colour and alpha values
     */
    updateSelected: function() {
        var styles = {'backgroundColor':this.options.color};

        this.colorInput.value = this.options.color.substring(1);

        this.alphaInput.value = parseInt(this.options.alpha*100,10);
        if (this.options.alpha < 1) {
            styles.opacity = this.options.alpha;
            styles.filter = 'Alpha(opacity='+(this.options.alpha*100)+')';
            
        } else {
            styles.opacity = 1;
            //not sure what the proper way to remove the filter would be since
            // I don't have IE to test against.
            styles.filter = '';  
        }
        this.selectedSwatch.setStyles(styles);
        this.previewSwatch.setStyles(styles);
        
        this.fireEvent('change', this);
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the
     * widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     *    translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	
    	if ($defined(this.alphaLabel)) {
    		this.alphaLabel.set('html', this.getText({set:'Jx',key:'colorpalette',value:'alphaLabel'}));
    	}
    }
});

/*
---

name: Jx.Button.Color

description:

license: MIT-style license.

requires:
 - Jx.Button.Flyout
 - Jx.ColorPalette

provides: [Jx.Button.Color]

...
 */
// $Id$
/**
 * Class: Jx.Button.Color
 *
 * Extends: <Jx.Button.Flyout>
 *
 * A <Jx.ColorPalette> wrapped up in a Jx.Button.  The button includes a
 * preview of the currently selected color.  Clicking the button opens
 * the color panel.
 *
 * A color button is essentially a <Jx.Button.Flyout> where the content
 * of the flyout is a <Jx.ColorPalette>.  For performance, all color buttons
 * share an instance of <Jx.ColorPalette> which means only one button can be
 * open at a time.  This isn't a huge restriction as flyouts already close
 * each other when opened.
 *
 * Example:
 * (code)
 * var colorButton = new Jx.Button.Color({
 *     onChange: function(button) {
 *         console.log('color:' + button.options.color + ' alpha: ' +
 *                     button.options.alpha);
 *     }
 * });
 * (end)
 *
 * Events:
 * change - fired when the color is changed.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button.Color = new Class({
    Family: 'Jx.Button.Color',
    Extends: Jx.Button.Flyout,

    /**
     * Property: swatch
     * the color swatch element used to portray the currently selected
     * color
     */
    swatch: null,

    options: {
        /**
         * Option: color
         * a color to initialize the panel with, defaults to #000000
         * (black) if not specified.
         */
        color: '#000000',
        /**
         * Option: alpha
         * an alpha value to initialize the panel with, defaults to 1
         *  (opaque) if not specified.
         *
         */
        alpha: 100,
        /*
         * Option: template
         * the HTML template for the color button
         */
        template: '<span class="jxButtonContainer"><a class="jxButton jxButtonFlyout jxDiscloser"><span class="jxButtonContent"><span class="jxButtonSwatch"><span class="jxButtonSwatchColor"></span></span><span class="jxButtonLabel"></span></span></a></span>'
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: new Hash({
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        swatch: 'jxButtonSwatchColor',
        domLabel: 'jxButtonLabel'
    }),

    /**
     * Method: render
     * creates a new color button.
     */
    render: function() {
        if (!Jx.Button.Color.ColorPalette) {
            Jx.Button.Color.ColorPalette = new Jx.ColorPalette(this.options);
        }

        /* we need to have an image to replace, but if a label is
           requested, there wouldn't normally be an image. */
        this.options.image = Jx.aPixel.src;

        /* now we can safely initialize */
        this.parent();
        this.updateSwatch();

        this.bound.changed = this.changed.bind(this);
        this.bound.hide = this.hide.bind(this);
    },
    cleanup: function() {
      this.bound.changed = false;
      this.bound.hide = false;
      this.parent();
    },
    /**
     * APIMethod: clicked
     * override <Jx.Button.Flyout> to use a singleton color palette.
     */
    clicked: function() {
        var cp = Jx.Button.Color.ColorPalette;
        if (cp.currentButton) {
            cp.currentButton.hide();
        }
        cp.currentButton = this;
        cp.addEvent('change', this.bound.changed);
        cp.addEvent('click', this.bound.hide);
        this.content.appendChild(cp.domObj);
        cp.domObj.setStyle('display', 'block');
        Jx.Button.Flyout.prototype.clicked.apply(this, arguments);
        /* setting these before causes an update problem when clicking on
         * a second color button when another one is open - the color
         * wasn't updating properly
         */

        cp.options.color = this.options.color;
        cp.options.alpha = this.options.alpha/100;
        cp.updateSelected();
},

    /**
     * APIMethod: hide
     * hide the color panel
     */
    hide: function() {
        var cp = Jx.Button.Color.ColorPalette;
        this.setActive(false);
        cp.removeEvent('change', this.bound.changed);
        cp.removeEvent('click', this.bound.hide);
        Jx.Button.Flyout.prototype.hide.apply(this, arguments);
        cp.currentButton = null;
    },

    /**
     * APIMethod: setColor
     * set the color represented by this color panel
     *
     * Parameters:
     * color - {String} the new hex color value
     */
    setColor: function(color) {
        this.options.color = color;
        this.updateSwatch();
    },

    /**
     * APIMethod: setAlpha
     * set the alpha represented by this color panel
     *
     * Parameters:
     * alpha - {Integer} the new alpha value (between 0 and 100)
     */
    setAlpha: function(alpha) {
        this.options.alpha = alpha;
        this.updateSwatch();
    },

    /**
     * Method: changed
     * handle the color changing in the palette by updating the preview swatch
     * in the button and firing the change event.
     *
     * Parameters:
     * panel - <Jx.ColorPalette> the palette that changed.
     */
    changed: function(panel) {
        var changed = false;
        if (this.options.color != panel.options.color) {
            this.options.color = panel.options.color;
            changed = true;
        }
        if (this.options.alpha != panel.options.alpha * 100) {
            this.options.alpha = panel.options.alpha * 100;
            changed = true;
        }
        if (changed) {
            this.updateSwatch();
            this.fireEvent('change',this);
        }
    },

    /**
     * Method: updateSwatch
     * Update the swatch color for the current color
     */
    updateSwatch: function() {
        var styles = {'backgroundColor':this.options.color};
        if (this.options.alpha < 100) {
            styles.filter = 'Alpha(opacity='+(this.options.alpha)+')';
            styles.opacity = this.options.alpha / 100;

        } else {
            styles.opacity = 1;
            styles.filter = '';
        }
        this.swatch.setStyles(styles);
    }
});
/*
---

name: Jx.Menu

description: A main menu as opposed to a sub menu that lives inside the menu.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.List

provides: [Jx.Menu]

css:
 - menu

images:
 - flyout_chrome.png
 - emblems.png
...
 */
// $Id$
/**
 * Class: Jx.Menu
 *
 * Extends: <Jx.Widget>
 *
 * A main menu as opposed to a sub menu that lives inside the menu.
 *
 * TODO: Jx.Menu
 * revisit this to see if Jx.Menu and Jx.SubMenu can be merged into
 * a single implementation.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu = new Class({
    Family: 'Jx.Menu',
    Extends: Jx.Widget,
    // Binds: ['onMouseEnter','onMouseLeave','hide','keypressHandler'],
    /**
     * Property: button
     * {<Jx.Button>} The button that represents this menu in a toolbar and
     * opens the menu.
     */
    button : null,
    /**
     * Property: subDomObj
     * {HTMLElement} the HTML element that contains the menu items
     * within the menu.
     */
    subDomObj : null,
    /**
     * Property: list
     * {<Jx.List>} the list of items in the menu
     */
    list: null,

    parameters: ['buttonOptions', 'options'],

    options: {
        /**
         * Option: exposeOnHover
         * {Boolean} default false, if set to true the menu will show
         * when the mouse hovers over it rather than when it is clicked.
         */
        exposeOnHover: false,
        /**
         * Option: hideDelay
         * {Integer} default 0, if greater than 0, this is the number of
         * milliseconds to delay before hiding a menu when the mouse leaves
         * the menu button or list.
         */
        hideDelay: 0,
        template: "<div class='jxMenuContainer'><ul class='jxMenu'></ul></div>",
        buttonTemplate: '<span class="jxButtonContainer"><a class="jxButton jxButtonMenu jxDiscloser"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel"></span></span></a></span>',
        position: {
            horizontal: ['left left'],
            vertical: ['bottom top', 'top bottom']
        }
    },

    classes: new Hash({
        contentContainer: 'jxMenuContainer',
        subDomObj: 'jxMenu'
    }),
    
    init: function() {
        this.bound.stop = function(e){e.stop();};
        this.bound.remove = function(item) {if (item.setOwner) item.setOwner(null);};
        this.bound.show = this.show.bind(this);
        this.bound.mouseenter = this.onMouseEnter.bind(this);
        this.bound.mouseleave = this.onMouseLeave.bind(this);
        this.bound.keypress = this.keypressHandler.bind(this);
        this.bound.hide = this.hide.bind(this);
        this.parent();
    },

    /**
     * APIMethod: render
     * Create a new instance of Jx.Menu.
     */
    render : function() {
        this.parent();
        if (!Jx.Menu.Menus) {
            Jx.Menu.Menus = [];
        }

        this.contentClone = this.contentContainer.clone();
        this.list = new Jx.List(this.subDomObj, {
            onRemove: this.bound.remove
        });

        /* if options are passed, make a button inside an LI so the
           menu can be embedded inside a toolbar */
        if (this.options.buttonOptions) {
            this.button = new Jx.Button($merge(this.options.buttonOptions,{
                template: this.options.buttonTemplate,
                onClick:this.bound.show
            }));

            this.button.domA.addEvent('mouseenter', this.bound.mouseenter);
            this.button.domA.addEvent('mouseleave', this.bound.mouseleave);

            this.domObj = this.button.domObj;
            this.domObj.store('jxMenu', this);
        }
        
        this.subDomObj.addEvent('mouseenter', this.bound.mouseenter);
        this.subDomObj.addEvent('mouseleave', this.bound.mouseleave);
        this.subDomObj.store('jxSubMenu', this);
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    cleanup: function() {
      if (this.hideTimer) {
        window.clearTimeout(this.hideTimer);
      }
      this.list.removeEvent('remove', this.bound.remove);
      this.list.destroy();
      this.list = null;
      if (this.button) {
        this.domObj.eliminate('jxMenu');
        this.domObj = null;
        this.button.removeEvent('click', this.bound.show);
        this.button.domA.removeEvents({
          mouseenter: this.bound.mouseenter,
          mouseleave: this.bound.mouseleave
        });
        
        this.button.destroy();
        this.button = null;
      }
      this.subDomObj.removeEvents({
        mouseenter: this.bound.mouseenter,
        mouseleave: this.bound.mouseleave
      });
      this.subDomObj.removeEvents();
      this.contentContainer.removeEvent('contextmenu', this.bound.stop);
      this.subDomObj.destroy();
      this.contentContainer.destroy();
      this.contentClone.destroy();
      this.bound.remove = null;
      this.bound.show = null;
      this.bound.stop = null;
      this.bound.mouseenter = null;
      this.bound.mouseleave = null;
      this.bound.keypress = null;
      this.bound.hide = null;
      this.parent();
    },
    /**
     * APIMethod: add
     * Add menu items to the sub menu.
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to add.  Multiple menu items
     *     can be added by passing an array of menu items.
     * position - the index to add the item at, defaults to the end of the
     *     menu
     */
    add: function(item, position, owner) {
        if (Jx.type(item) == 'array') {
            item.each(function(i){
                if (i.setOwner) {
                    i.setOwner(owner||this);
                }
            }, this);
        } else {
            if (item.setOwner) {
                item.setOwner(owner||this);
            }
        }
        this.list.add(item, position);
        return this;
    },
    /**
     * APIMethod: remove
     * Remove a menu item from the menu
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to remove
     */
    remove: function(item) {
        this.list.remove(item);
        return this;
    },
    /**
     * APIMethod: replace
     * Replace a menu item with another menu item
     *
     * Parameters:
     * what - {<Jx.MenuItem>} the menu item to replace
     * withWhat - {<Jx.MenuItem>} the menu item to replace it with
     */
    replace: function(item, withItem) {
        this.list.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: empty
     * Empty the menu of items
     */
    empty: function() {
      this.list.each(function(item){
        if (item.empty) {
          item.empty();
        }
        if (item.setOwner) {
            item.setOwner(null);
        }
      }, this);
      this.list.empty();
    },
    /**
     * Method: deactivate
     * Deactivate the menu by hiding it.
     */
    deactivate: function() {this.hide();},
    /**
     * Method: onMouseOver
     * Handle the user moving the mouse over the button for this menu
     * by showing this menu and hiding the other menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    onMouseEnter: function(e) {
      if (this.hideTimer) {
        window.clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] != this) {
          this.show.delay(1,this);
      } else if (this.options.exposeOnHover) {
        if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] == this) {
          Jx.Menu.Menus[0] = null;
        }
        this.show.delay(1,this);
      }
    },
    /**
     * Method: onMouseLeave
     * Handle the user moving the mouse off this button or menu by
     * starting the hide process if so configured.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    onMouseLeave: function(e) {
      if (this.options.hideDelay > 0) {
        this.hideTimer = (function(){
          this.deactivate();
        }).delay(this.options.hideDelay, this);
      }
    },
    
    /**
     * Method: eventInMenu
     * determine if an event happened inside this menu or a sub menu
     * of this menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     *
     * Returns:
     * {Boolean} true if the event happened in the menu or
     * a sub menu of this menu, false otherwise
     */
    eventInMenu: function(e) {
        var target = document.id(e.target);
        if (!target) {
            return false;
        }
        if (target.descendantOf(this.domObj) ||
            target.descendantOf(this.subDomObj)) {
            return true;
        } else {
            var ul = target.getParent('ul');
            if (ul) {
                var sm = ul.retrieve('jxSubMenu');
                if (sm) {
                    if (sm.eventInMenu(e)) {
                      return true;
                    }
                    var owner = sm.owner;
                    while (owner) {
                        if (owner == this) {
                            return true;
                        }
                        owner = owner.owner;
                    }
                }
            }
            return false;
        }
    },

    /**
     * APIMethod: hide
     * Hide the menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    hide: function(e) {
        if (e) {
            if (this.visibleItem && this.visibleItem.eventInMenu) {
                if (this.visibleItem.eventInMenu(e)) {
                    return;
                }
            } else if (this.eventInMenu(e)) {
                return;
            }
        }
        if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] == this) {
            Jx.Menu.Menus[0] = null;
        }
        if (this.button && this.button.domA) {
            this.button.domA.removeClass(this.button.options.activeClass);
        }
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }
        this.list.each(function(item){item.retrieve('jxMenuItem').hide(e);});
        document.removeEvent('mousedown', this.bound.hide);
        document.removeEvent('keydown', this.bound.keypress);
        this.unstack(this.contentContainer);
        this.contentContainer.dispose();
        this.visibleItem = null;
        this.fireEvent('hide', this);
    },
    /**
     * APIMethod: show
     * Show the menu
     */
    show : function() {
        if (this.button) {
            if (Jx.Menu.Menus[0]) {
                if (Jx.Menu.Menus[0] != this) {
                    Jx.Menu.Menus[0].button.blur();
                    Jx.Menu.Menus[0].hide();
                } else {
                    this.hide();
                    return;
                }
            }
            Jx.Menu.Menus[0] = this;
            this.button.focus();
            if (this.list.count() == 0) {
                return;
            }
        }
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }

        this.subDomObj.dispose();
        this.contentContainer.destroy();
        this.contentContainer = this.contentClone.clone();
        this.contentContainer.empty().adopt(this.subDomObj);
        this.contentContainer.addEvent('contextmenu', this.bound.stop);
        this.contentContainer.setStyle('display','none');
        document.id(document.body).adopt(this.contentContainer);
        this.contentContainer.setStyles({
            visibility: 'hidden',
            display: 'block'
        });
        this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
        this.showChrome(this.contentContainer);

        this.position(this.contentContainer, this.domObj, $merge({
            offsets: this.chromeOffsets
        }, this.options.position));
        this.stack(this.contentContainer);
        this.contentContainer.setStyle('visibility','visible');

        if (this.button && this.button.domA) {
            this.button.domA.addClass(this.button.options.activeClass);
        }

        /* fix bug in IE that closes the menu as it opens 
         * because of bubbling (I think)
         */
        document.addEvent('mousedown', this.bound.hide);
        document.addEvent('keydown', this.bound.keypress);
        this.fireEvent('show', this);
    },
    /**
     * APIMethod: setVisibleItem
     * Set the sub menu that is currently open
     *
     * Parameters:
     * obj- {<Jx.SubMenu>} the sub menu that just became visible
     */
    setVisibleItem: function(obj) {
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }
        if (this.visibleItem != obj) {
            if (this.visibleItem && this.visibleItem.hide) {
                this.visibleItem.hide();
            }
            this.visibleItem = obj;
            this.visibleItem.show();
        }
    },

    /* hide flyout if the user presses the ESC key */
    keypressHandler: function(e) {
        e = new Event(e);
        if (e.key == 'esc') {
            this.hide();
        }
    },
    /**
     * APIMethod: isEnabled
     * This returns true if the menu is enabled, false otherwise
     *
     * Returns:
     * {Boolean} whether the menu is enabled or not
     */
    isEnabled: function() {
        return this.button ? this.button.isEnabled() : this.options.enabled ;
    },

    /**
     * APIMethod: setEnabled
     * enable or disable the menu.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the menu
     */
    setEnabled: function(enabled) {
        return this.button ? this.button.setEnabled(enabled) : this.options.enable;
    },
    /**
     * APIMethod: isActive
     * returns true if the menu is open.
     *
     * Returns:
     * {Boolean} the active state of the menu
     */
    isActive: function() {
        return this.button ? this.button.isActive() : this.options.active;
    },
    /**
     * APIMethod: setActive
     * Set the active state of the menu
     *
     * Parameters:
     * active - {Boolean} the new active state of the menu
     */
    setActive: function(active) {
        if (this.button) {
          this.button.setActive(active);
        }
    },
    /**
     * APIMethod: setImage
     * set the image of this menu to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this menu
     */
    setImage: function(path) {
        if (this.button) {
          this.button.setImage(path);
        }
    },
    /**
     * APIMethod: setLabel
     *
     * sets the text of the menu.
     *
     * Parameters:
     *
     * label - {String} the new label for the menu
     */
    setLabel: function(label) {
        if (this.button) {
          this.button.setLabel(label);
        }
    },
    /**
     * APIMethod: getLabel
     *
     * returns the text of the menu.
     */
    getLabel: function() {
        return this.button ? this.button.getLabel() : '';
    },
    /**
     * APIMethod: setTooltip
     * sets the tooltip displayed by the menu
     *
     * Parameters:
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        if (this.button) {
          this.button.setTooltip(tooltip);
        }
    },
    /**
     * APIMethod: focus
     * capture the keyboard focus on this menu
     */
    focus: function() {
        if (this.button) {
          this.button.focus();
        }
    },
    /**
     * APIMethod: blur
     * remove the keyboard focus from this menu
     */
    blur: function() {
        if (this.button) {
          this.button.blur();
        }
    }
});

/*
---

name: Jx.Menu.Item

description: A menu item is a single entry in a menu.

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Item]

images:
 - menuitem.png
...
 */
// $Id$
/**
 * Class: Jx.Menu.Item
 *
 * Extends: <Jx.Button>
 *
 * A menu item is a single entry in a menu.  It is typically composed of
 * a label and an optional icon.  Selecting the menu item emits an event.
 *
 * Jx.Menu.Item is represented by a <Jx.Button> with type MenuItem and the
 * associated CSS changes noted in <Jx.Button>.  The container of a MenuItem
 * is an 'li' element.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * click - fired when the menu item is clicked.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu.Item = new Class({
    Family: 'Jx.Menu.Item',
    Extends: Jx.Button,
    // Binds: ['onMouseOver'],
    /**
     * Property: owner
     * {<Jx.SubMenu> or <Jx.Menu>} the menu that contains the menu item.
     */
    owner: null,
    options: {
        //image: null,
        label: '&nbsp;',
        toggleClass: 'jxMenuItemToggle',
        pressedClass: 'jxMenuItemPressed',
        activeClass: 'jxMenuItemActive',
        /* Option: template
         * the HTML structure of the button.  As a minimum, there must be a
         * containing element with a class of jxMenuItemContainer and an
         * internal element with a class of jxMenuItem.  jxMenuItemIcon and
         * jxMenuItemLabel are used if present to put the image and label into
         * the button.
         */
        template: '<li class="jxMenuItemContainer"><a class="jxMenuItem"><span class="jxMenuItemContent"><img class="jxMenuItemIcon" src="'+Jx.aPixel.src+'"><span class="jxMenuItemLabel"></span></span></a></li>'
    },
    classes: new Hash({
        domObj:'jxMenuItemContainer',
        domA: 'jxMenuItem',
        domImg: 'jxMenuItemIcon',
        domLabel: 'jxMenuItemLabel'
    }),
    init: function() {
      this.bound.mouseover = this.onMouseOver.bind(this);
      this.parent();
    },
    /**
     * APIMethod: render
     * Create a new instance of Jx.Menu.Item
     */
    render: function() {
        if (!this.options.image) {
            this.options.image = Jx.aPixel.src;
        }
        this.parent();
        if (this.options.image && this.options.image != Jx.aPixel.src) {
            this.domObj.removeClass(this.options.toggleClass);
        }
        if (this.options.target) {
          this.domA.set('target', this.options.target);
        }
        this.domObj.addEvent('mouseover', this.bound.mouseover);
        this.domObj.store('jxMenuItem', this);
    },
    cleanup: function() {
      this.domObj.eliminate('jxMenuItem');
      this.domObj.removeEvent('mouseover', this.bound.mouseover);
      this.bound.mouseover = null;
      this.owner = null;
      this.parent();
    },
    /**
     * Method: setOwner
     * Set the owner of this menu item
     *
     * Parameters:
     * obj - {Object} the new owner
     */
    setOwner: function(obj) {
        this.owner = obj;
    },
    /**
     * Method: hide
     * Hide the menu item.
     */
    hide: function() {this.blur.delay(1,this);},
    /**
     * Method: show
     * Show the menu item
     */
    show: $empty,
    /**
     * Method: clicked
     * Handle the user clicking on the menu item, overriding the <Jx.Button::clicked>
     * method to facilitate menu tracking
     *
     * Parameters:
     * obj - {Object} an object containing an event property that was the user
     * event.
     */
    clicked: function(obj) {
        var href = this.options.href && this.options.href.indexOf('javascript:') != 0;
        if (this.options.enabled) {
          if (!href) {
            if (this.options.toggle) {
                this.setActive.delay(1,this,!this.options.active);
            }
            this.fireEvent.delay(1, this, ['click', {obj: this}]);
            this.blur();
          }
          if (this.owner && this.owner.deactivate) {
              this.owner.deactivate.delay(1, this.owner, obj.event);
          }
        }
        return href ? true : false;
    },
    /**
     * Method: onmouseover
     * handle the mouse moving over the menu item
     */
    onMouseOver: function(e) {
        e.stop();
        if (this.owner && this.owner.setVisibleItem) {
            this.owner.setVisibleItem(this);
        }
        return false;
    },
    
    /**
     * APIMethod: changeText
     *
     * updates the label of the menu item on langChange Event for
     * Internationalization
     */
    changeText: function(lang) {
        this.parent();
        if (this.owner && this.owner.deactivate) {
            this.owner.deactivate();
        }
    }
});

/*
---

name: Jx.ButtonSet

description: A ButtonSet manages a set of Jx.Button instances by ensuring that only one of the buttons is active.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.ButtonSet]


...
 */
// $Id$
/**
 * Class: Jx.ButtonSet
 *
 * Extends: <Jx.Object>
 *
 * A ButtonSet manages a set of <Jx.Button> instances by ensuring that only
 * one of the buttons is active.  All the buttons need to have been created
 * with the toggle option set to true for this to work.
 *
 * Example:
 * (code)
 * var toolbar = new Jx.Toolbar('bar');
 * var buttonSet = new Jx.ButtonSet();
 *
 * var b1 = new Jx.Button({label: 'b1', toggle:true, contentID: 'content1'});
 * var b2 = new Jx.Button({label: 'b2', toggle:true, contentID: 'content2'});
 * var b3 = new Jx.Button({label: 'b3', toggle:true, contentID: 'content3'});
 * var b4 = new Jx.Button({label: 'b4', toggle:true, contentID: 'content4'});
 *
 * buttonSet.add(b1,b2,b3,b4);
 * (end)
 *
 * Events:
 * change - the current button has changed
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.ButtonSet = new Class({
    Family: 'Jx.ButtonSet',
    Extends: Jx.Object,
    Binds: ['buttonChanged'],
    /**
     * Property: buttons
     * {Array} array of buttons that are managed by this button set
     */
    buttons: [],
    
    cleanup: function() {
      this.buttons.each(function(b){
        b.removeEvent('down', this.buttonChanged);
        b.setActive = null;
      },this);
      this.activeButton = null;
      this.buttons = null;
      this.parent();
    },

    /**
     * APIMethod: add
     * Add one or more <Jx.Button>s to the ButtonSet.
     *
     * Parameters:
     * button - {<Jx.Button>} an instance of <Jx.Button> to add to the button
     * set.  More than one button can be added by passing extra parameters to
     * this method.
     */
    add : function() {
        $A(arguments).each(function(button) {
            if (button.domObj.hasClass(button.options.toggleClass)) {
                button.domObj.removeClass(button.options.toggleClass);
                button.domObj.addClass(button.options.toggleClass+'Set');
            }
            button.addEvent('down',this.buttonChanged);
            button.setActive = function(active) {
                if (button.options.active && this.activeButton == button) {
                    return;
                } else {
                    Jx.Button.prototype.setActive.apply(button, [active]);
                }
            }.bind(this);
            if (!this.activeButton || button.options.active) {
                button.options.active = false;
                button.setActive(true);
            }
            this.buttons.push(button);
        }, this);
        return this;
    },
    /**
     * APIMethod: remove
     * Remove a button from this Button.
     *
     * Parameters:
     * button - {<Jx.Button>} the button to remove.
     */
    remove : function(button) {
        this.buttons.erase(button);
        if (this.activeButton == button) {
            if (this.buttons.length) {
                this.buttons[0].setActive(true);
            }
            button.removeEvent('down',this.buttonChanged);
            button.setActive = Jx.Button.prototype.setActive;
        }
    },
    /**
     * APIMethod: empty
     * empty the button set and clear the active button
     */
    empty: function() {
      this.buttons = [];
      this.activeButton = null;
    },
    /**
     * APIMethod: setActiveButton
     * Set the active button to the one passed to this method
     *
     * Parameters:
     * button - {<Jx.Button>} the button to make active.
     */
    setActiveButton: function(button) {
        var b = this.activeButton;
        this.activeButton = button;
        if (b && b != button) {
            b.setActive(false);
        }
    },
    /**
     * Method: buttonChanged
     * Handle selection changing on the buttons themselves and activate the
     * appropriate button in response.
     *
     * Parameters:
     * button - {<Jx.Button>} the button to make active.
     */
    buttonChanged: function(button) {
        this.setActiveButton(button);
        this.fireEvent('change', this);
    }
});/*
---

name: Jx.Button.Multi

description: Multi buttons are used to contain multiple buttons in a drop down list where only one button is actually visible and clickable in the interface.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.Menu
 - Jx.ButtonSet

provides: [Jx.Button.Multi]

images:
 - button_multi.png
 - button_multi_disclose.png

...
 */
// $Id$
/**
 * Class: Jx.Button.Multi
 *
 * Extends: <Jx.Button>
 *
 * Implements:
 *
 * Multi buttons are used to contain multiple buttons in a drop down list
 * where only one button is actually visible and clickable in the interface.
 *
 * When the user clicks the active button, it performs its normal action.
 * The user may also click a drop-down arrow to the right of the button and
 * access the full list of buttons.  Clicking a button in the list causes
 * that button to replace the active button in the toolbar and performs
 * the button's regular action.
 *
 * Other buttons can be added to the Multi button using the add method.
 *
 * This is not really a button, but rather a container for buttons.  The
 * button structure is a div containing two buttons, a normal button and
 * a flyout button.  The flyout contains a toolbar into which all the
 * added buttons are placed.  The main button content is cloned from the
 * last button clicked (or first button added).
 *
 * The Multi button does not trigger any events itself, only the contained
 * buttons trigger events.
 *
 * Example:
 * (code)
 * var b1 = new Jx.Button({
 *     label: 'b1',
 *     onClick: function(button) {
 *         console.log('b1 clicked');
 *     }
 * });
 * var b2 = new Jx.Button({
 *     label: 'b2',
 *     onClick: function(button) {
 *         console.log('b2 clicked');
 *     }
 * });
 * var b3 = new Jx.Button({
 *     label: 'b3',
 *     onClick: function(button) {
 *         console.log('b3 clicked');
 *     }
 * });
 * var multiButton = new Jx.Button.Multi();
 * multiButton.add(b1, b2, b3);
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button.Multi = new Class({
    Family: 'Jx.Button.Multi',
    Extends: Jx.Button,

    /**
     * Property: {<Jx.Button>} activeButton
     * the currently selected button
     */
    activeButton: null,

    /**
     * Property: buttons
     * {Array} the buttons added to this multi button
     */
    buttons: null,

    options: {
        /* Option: template
         * the button template for a multi button
         */
        template: '<span class="jxButtonContainer"><a class="jxButton jxButtonMulti jxDiscloser"><span class="jxButtonContent"><img src="'+Jx.aPixel.src+'" class="jxButtonIcon"><span class="jxButtonLabel"></span></span></a><a class="jxButtonDisclose" href="javascript:void(0)"><img src="'+Jx.aPixel.src+'"></a></span>',
        menuOptions: {}
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: new Hash({
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        domImg: 'jxButtonIcon',
        domLabel: 'jxButtonLabel',
        domDisclose: 'jxButtonDisclose'
    }),

    /**
     * Method: render
     * construct a new instance of Jx.Button.Multi.
     */
    render: function() {
        this.parent();
        this.buttons = [];

        this.menu = new Jx.Menu({}, this.options.menuOptions);
        this.menu.button = this;
        this.buttonSet = new Jx.ButtonSet();

        this.bound.click = this.clicked.bind(this);

        if (this.domDisclose) {
            var button = this;
            var hasFocus;

            this.bound.disclose = {
              click: function(e) {
                  if (this.list.count() === 0) {
                      return;
                  }
                  if (!button.options.enabled) {
                      return;
                  }
                  this.contentContainer.setStyle('visibility','hidden');
                  this.contentContainer.setStyle('display','block');
                  document.id(document.body).adopt(this.contentContainer);
                  /* we have to size the container for IE to render the chrome
                   * correctly but just in the menu/sub menu case - there is
                   * some horrible peekaboo bug in IE related to ULs that we
                   * just couldn't figure out
                   */
                  this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

                  this.showChrome(this.contentContainer);

                  this.position(this.contentContainer, this.button.domObj, {
                      horizontal: ['right right'],
                      vertical: ['bottom top', 'top bottom'],
                      offsets: this.chromeOffsets
                  });

                  this.contentContainer.setStyle('visibility','');

                  document.addEvent('mousedown', this.bound.hide);
                  document.addEvent('keyup', this.bound.keypress);

                  this.fireEvent('show', this);
              }.bindWithEvent(this.menu),
              mouseenter:function(){
                  document.id(this.domObj.firstChild).addClass('jxButtonHover');
                  if (hasFocus) {
                      this.domDisclose.addClass(this.options.pressedClass);
                  }
              }.bind(this),
              mouseleave:function(){
                  document.id(this.domObj.firstChild).removeClass('jxButtonHover');
                  this.domDisclose.removeClass(this.options.pressedClass);
              }.bind(this),
              mousedown: function(e) {
                  this.domDisclose.addClass(this.options.pressedClass);
                  hasFocus = true;
                  this.focus();
              }.bindWithEvent(this),
              mouseup: function(e) {
                  this.domDisclose.removeClass(this.options.pressedClass);
              }.bindWithEvent(this),
              keydown: function(e) {
                  if (e.key == 'enter') {
                      this.domDisclose.addClass(this.options.pressedClass);
                  }
              }.bindWithEvent(this),
              keyup: function(e) {
                  if (e.key == 'enter') {
                      this.domDisclose.removeClass(this.options.pressedClass);
                  }
              }.bindWithEvent(this),
              blur: function() { hasFocus = false; }
            };

            this.domDisclose.addEvents({
              click: this.bound.disclose.click,
              mouseenter: this.bound.disclose.mouseenter,
              mouseleave: this.bound.disclose.mouseleave,
              mousedown: this.bound.disclose.mousedown,
              mouseup: this.bound.disclose.mouseup,
              keydown: this.bound.disclose.keydown,
              keyup: this.bound.disclose.keyup,
              blur: this.bound.disclose.blur
            });
            if (typeof Drag != 'undefined') {
                new Drag(this.domDisclose, {
                    onStart: function() {this.stop();}
                });
            }
        }
        this.bound.show = function() {
            this.domA.addClass(this.options.activeClass);
        }.bind(this);
        this.bound.hide = function() {
            if (this.options.active) {
                this.domA.addClass(this.options.activeClass);
            }
        }.bind(this);

        this.menu.addEvents({
            'show': this.bound.show,
            'hide': this.bound.hide
        });
        if (this.options.items) {
            this.add(this.options.items);
        }
    },
    cleanup: function() {
      var self = this,
          bound = this.bound;
      // clean up the discloser
      if (self.domDisclose) {
        self.domDisclose.removeEvents({
          click: bound.disclose.click,
          mouseenter: bound.disclose.mouseenter,
          mouseleave: bound.disclose.mouseleave,
          mousedown: bound.disclose.mousedown,
          mouseup: bound.disclose.mouseup,
          keydown: bound.disclose.keydown,
          keyup: bound.disclose.keyup,
          blur: bound.disclose.blur
        });
      }

      // clean up the button set
      self.buttonSet.destroy();
      self.buttonSet = null;

      // clean up the buttons array
      self.buttons.each(function(b){
        b.removeEvents();
        self.menu.remove(b.multiButton);
        b.multiButton.destroy();
        b.multiButton = null;
        b.destroy();
      });
      self.buttons.empty();
      self.buttons = null;

      // clean up the menu object
      self.menu.removeEvents({
        'show': bound.show,
        'hide': bound.hide
      });
      // unset the menu button because it references this object
      self.menu.button = null;
      self.menu.destroy();
      self.menu = null;

      // clean up binds and call parent to finish
      self.bound.show = null;
      self.bound.hide = null;
      self.bound.clicked = null;
      self.bound.disclose = null;
      self.activeButton = null;
      self.parent();
    },
    /**
     * APIMethod: add
     * adds one or more buttons to the Multi button.  The first button
     * added becomes the active button initialize.  This function
     * takes a variable number of arguments, each of which is expected
     * to be an instance of <Jx.Button>.
     *
     * Parameters:
     * button - {<Jx.Button>} a <Jx.Button> instance, may be repeated in the parameter list
     */
    add: function() {
        $A(arguments).flatten().each(function(theButton){
          var f,
              opts,
              button;
            if (!theButton instanceof Jx.Button) {
                return;
            }
            theButton.domA.addClass('jxDiscloser');
            theButton.setLabel(theButton.options.label);
            this.buttons.push(theButton);
            f = this.setButton.bind(this, theButton);
            opts = {
                image: theButton.options.image,
                imageClass: theButton.options.imageClass,
                label: theButton.options.label || '&nbsp;',
                enabled: theButton.options.enabled,
                tooltip: theButton.options.tooltip,
                toggle: true,
                onClick: f
            };
            if (!opts.image || opts.image.indexOf('a_pixel') != -1) {
                delete opts.image;
            }
            button = new Jx.Menu.Item(opts);
            this.buttonSet.add(button);
            this.menu.add(button);
            theButton.multiButton = button;
            theButton.domA.addClass('jxButtonMulti');
            if (!this.activeButton) {
                this.domA.dispose();
                this.setActiveButton(theButton);
            }
        }, this);
    },
    /**
     * APIMethod: remove
     * remove a button from a multi button
     *
     * Parameters:
     * button - {<Jx.Button>} the button to remove
     */
    remove: function(button) {
        if (!button || !button.multiButton) {
            return;
        }
        // the toolbar will only remove the li.toolItem, which is
        // the parent node of the multiButton's domObj.
        if (this.menu.remove(button.multiButton)) {
            button.multiButton = null;
            if (this.activeButton == button) {
                // if any buttons are left that are not this button
                // then set the first one to be the active button
                // otherwise set the active button to nothing
                if (!this.buttons.some(function(b) {
                    if (b != button) {
                        this.setActiveButton(b);
                        return true;
                    } else {
                        return false;
                    }
                }, this)) {
                    this.setActiveButton(null);
                }
            }
            this.buttons.erase(button);
        }
    },
    /**
     * APIMethod: empty
     * remove all buttons from the multi button
     */
    empty: function() {
      this.buttons.each(function(b){this.remove(b);}, this);
    },
    /**
     * APIMethod: setActiveButton
     * update the menu item to be the requested button.
     *
     * Parameters:
     * button - {<Jx.Button>} a <Jx.Button> instance that was added to this multi button.
     */
    setActiveButton: function(button) {
        if (this.activeButton) {
            this.activeButton.domA.dispose();
            this.activeButton.domA.removeEvent('click', this.bound.click);
        }
        if (button && button.domA) {
            this.domObj.grab(button.domA, 'top');
            this.domA = button.domA;
            this.domA.addEvent('click', this.bound.click);
            if (this.options.toggle) {
                this.options.active = false;
                this.setActive(true);
            }
        }
        this.activeButton = button;
    },
    /**
     * Method: setButton
     * update the active button in the menu item, trigger the button's action
     * and hide the flyout that contains the buttons.
     *
     * Parameters:
     * button - {<Jx.Button>} The button to set as the active button
     */
    setButton: function(button) {
        this.setActiveButton(button);
        button.clicked();
    }
});/*
---

name: Jx.Layout

description: Jx.Layout is used to provide more flexible layout options for applications

license: MIT-style license.

requires:
 - Jx.Object


provides: [Jx.Layout]

css:
 - layout

...
 */
// $Id$
/**
 * Class: Jx.Layout
 *
 * Extends: <Jx.Object>
 *
 * Jx.Layout is used to provide more flexible layout options for applications
 *
 * Jx.Layout wraps an existing DOM element (typically a div) and provides
 * extra functionality for sizing that element within its parent and sizing
 * elements contained within it that have a 'resize' function attached to them.
 *
 * To create a Jx.Layout, pass the element or id plus an options object to
 * the constructor.
 *
 * Example:
 * (code)
 * var myContainer = new Jx.Layout('myDiv', options);
 * (end)
 *
 * Events:
 * sizeChange - fired when the size of the container changes
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

Jx.Layout = new Class({
    Family: 'Jx.Layout',
    Extends: Jx.Object,

    options: {
        /* Option: resizeWithWindow
         * boolean, automatically resize this layout when the window size
         * changes, even if the element is not a direct descendant of the
         * BODY.  False by default.
         */
        resizeWithWindow: false,
        /* Option: propagate
         * boolean, controls propogation of resize to child nodes.
         * True by default. If set to false, changes in size will not be
         * propogated to child nodes.
         */
        propagate: true,
        /* Option: position
         * how to position the element, either 'absolute' or 'relative'.
         * The default (if not passed) is 'absolute'.  When using
         * 'absolute' positioning, both the width and height are
         * controlled by Jx.Layout.  If 'relative' positioning is used
         * then only the width is controlled, allowing the height to
         * be controlled by its content.
         */
        position: 'absolute',
        /* Option: left
         * the distance (in pixels) to maintain the left edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the left edge can be any distance from its parent
         * based on other parameters.
         */
        left: 0,
        /* Option: right
         * the distance (in pixels) to maintain the right edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the right edge can be any distance from its parent
         * based on other parameters.
         */
        right: 0,
        /* Option: top
         * the distance (in pixels) to maintain the top edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the top edge can be any distance from its parent
         * based on other parameters.
         */
        top: 0,
        /* Option: bottom
         * the distance (in pixels) to maintain the bottom edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the bottom edge can be any distance from its parent
         * based on other parameters.
         */
        bottom: 0,
        /* Option: width
         * the width (in pixels) of the element.  The default value is null.
         * If this is set to 'null', then the width can be any value based on
         * other parameters.
         */
        width: null,
        /* Option: height
         * the height (in pixels) of the element.  The default value is null.
         * If this is set to 'null', then the height can be any value based on
         * other parameters.
         */
        height: null,
        /* Option: minWidth
         * the minimum width that the element can be sized to.  The default
         * value is 0.
         */
        minWidth: 0,
        /* Option: minHeight
         * the minimum height that the element can be sized to.  The
         * default value is 0.
         */
        minHeight: 0,
        /* Option: maxWidth
         * the maximum width that the element can be sized to.  The default
         * value is -1, which means no maximum.
         */
        maxWidth: -1,
        /* Option: maxHeight
         * the maximum height that the element can be sized to.  The
         * default value is -1, which means no maximum.
         */
        maxHeight: -1
    },

    /**
     * Parameters:
     * domObj - {HTMLElement} element or id to apply the layout to
     * options - <Jx.Layout.Options>
     */
    parameters: ['domObj','options'],

    /**
     * APIMethod: init
     * Create a new instance of Jx.Layout.
     */
    init: function() {
        this.domObj = document.id(this.options.domObj);
        this.domObj.resize = this.resize.bind(this);
        this.domObj.setStyle('position', this.options.position);
        this.domObj.store('jxLayout', this);

        if (this.options.resizeWithWindow || document.body == this.domObj.parentNode) {
            window.addEvent('resize', this.windowResize.bindWithEvent(this));
            window.addEvent('load', this.windowResize.bind(this));
        }
        //this.resize();
    },

    /**
     * Method: windowResize
     * when the window is resized, any Jx.Layout controlled elements that are
     * direct children of the BODY element are resized
     */
     windowResize: function() {
         this.resize();
         if (this.resizeTimer) {
             $clear(this.resizeTimer);
             this.resizeTimer = null;
         }
         this.resizeTimer = this.resize.delay(50, this);
    },

    /**
     * Method: resize
     * resize the element controlled by this Jx.Layout object.
     *
     * Parameters:
     * options - new options to apply, see <Jx.Layout.Options>
     */
    resize: function(options) {
         /* this looks like a really big function but actually not
          * much code gets executed in the two big if statements
          */
        this.resizeTimer = null;
        var needsResize = false;
        if (options) {
            for (var i in options) {
                //prevent forceResize: false from causing a resize
                if (i == 'forceResize') {
                    continue;
                }
                if (this.options[i] != options[i]) {
                    needsResize = true;
                    this.options[i] = options[i];
                }
            }
            if (options.forceResize) {
                needsResize = true;
            }
        }
        if (!document.id(this.domObj.parentNode)) {
            return;
        }

        var parentSize;
        if (this.domObj.parentNode.tagName == 'BODY') {
            parentSize = Jx.getPageDimensions();
        } else {
            parentSize = document.id(this.domObj.parentNode).getContentBoxSize();
        }

        if (this.lastParentSize && !needsResize) {
            needsResize = (this.lastParentSize.width != parentSize.width ||
                          this.lastParentSize.height != parentSize.height);
        } else {
            needsResize = true;
        }
        this.lastParentSize = parentSize;

        if (!needsResize) {
            return;
        }

        var l, t, w, h;

        /* calculate left and width */
        if (this.options.left != null) {
            /* fixed left */
            l = this.options.left;
            if (this.options.right == null) {
                /* variable right */
                if (this.options.width == null) {
                    /* variable right and width
                     * set right to min, stretch width */
                    w = parentSize.width - l;
                    if (w < this.options.minWidth ) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        w = this.options.maxWidth;
                    }
                } else {
                    /* variable right, fixed width
                     * use width
                     */
                    w = this.options.width;
                }
            } else {
                /* fixed right */
                if (this.options.width == null) {
                    /* fixed right, variable width
                     * stretch width
                     */
                    w = parentSize.width - l - this.options.right;
                    if (w < this.options.minWidth) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        w = this.options.maxWidth;
                    }
                } else {
                    /* fixed right, fixed width
                     * respect left and width, allow right to stretch
                     */
                    w = this.options.width;
                }
            }

        } else {
            if (this.options.right == null) {
                if (this.options.width == null) {
                    /* variable left, width and right
                     * set left, right to min, stretch width
                     */
                     l = 0;
                     w = parentSize.width;
                     if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                         l = l + parseInt(w - this.options.maxWidth,10)/2;
                         w = this.options.maxWidth;
                     }
                } else {
                    /* variable left, fixed width, variable right
                     * distribute space between left and right
                     */
                    w = this.options.width;
                    l = parseInt((parentSize.width - w)/2,10);
                    if (l < 0) {
                        l = 0;
                    }
                }
            } else {
                if (this.options.width != null) {
                    /* variable left, fixed width, fixed right
                     * left is calculated directly
                     */
                    w = this.options.width;
                    l = parentSize.width - w - this.options.right;
                    if (l < 0) {
                        l = 0;
                    }
                } else {
                    /* variable left and width, fixed right
                     * set left to min value and stretch width
                     */
                    l = 0;
                    w = parentSize.width - this.options.right;
                    if (w < this.options.minWidth) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        l = w - this.options.maxWidth - this.options.right;
                        w = this.options.maxWidth;
                    }
                }
            }
        }

        /* calculate the top and height */
        if (this.options.top != null) {
            /* fixed top */
            t = this.options.top;
            if (this.options.bottom == null) {
                /* variable bottom */
                if (this.options.height == null) {
                    /* variable bottom and height
                     * set bottom to min, stretch height */
                    h = parentSize.height - t;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        h = this.options.maxHeight;
                    }
                } else {
                    /* variable bottom, fixed height
                     * stretch height
                     */
                    h = this.options.height;
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        t = h - this.options.maxHeight;
                        h = this.options.maxHeight;
                    }
                }
            } else {
                /* fixed bottom */
                if (this.options.height == null) {
                    /* fixed bottom, variable height
                     * stretch height
                     */
                    h = parentSize.height - t - this.options.bottom;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        h = this.options.maxHeight;
                    }
                } else {
                    /* fixed bottom, fixed height
                     * respect top and height, allow bottom to stretch
                     */
                    h = this.options.height;
                }
            }
        } else {
            if (this.options.bottom == null) {
                if (this.options.height == null) {
                    /* variable top, height and bottom
                     * set top, bottom to min, stretch height
                     */
                     t = 0;
                     h = parentSize.height;
                     if (h < this.options.minHeight) {
                         h = this.options.minHeight;
                     }
                     if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                         t = parseInt((parentSize.height - this.options.maxHeight)/2,10);
                         h = this.options.maxHeight;
                     }
                } else {
                    /* variable top, fixed height, variable bottom
                     * distribute space between top and bottom
                     */
                    h = this.options.height;
                    t = parseInt((parentSize.height - h)/2,10);
                    if (t < 0) {
                        t = 0;
                    }
                }
            } else {
                if (this.options.height != null) {
                    /* variable top, fixed height, fixed bottom
                     * top is calculated directly
                     */
                    h = this.options.height;
                    t = parentSize.height - h - this.options.bottom;
                    if (t < 0) {
                        t = 0;
                    }
                } else {
                    /* variable top and height, fixed bottom
                     * set top to min value and stretch height
                     */
                    t = 0;
                    h = parentSize.height - this.options.bottom;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        t = parentSize.height - this.options.maxHeight - this.options.bottom;
                        h = this.options.maxHeight;
                    }
                }
            }
        }

        //TODO: check left, top, width, height against current styles
        // and only apply changes if they are not the same.

        /* apply the new sizes */
        var sizeOpts = {width: w};
        if (this.options.position == 'absolute') {
            var m = document.id(this.domObj.parentNode).measure(function(){
                return this.getSizes(['padding'],['left','top']).padding;
            });
            this.domObj.setStyles({
                position: this.options.position,
                left: l+m.left,
                top: t+m.top
            });
            sizeOpts.height = h;
        } else {
            if (this.options.height) {
                sizeOpts.height = this.options.height;
            }
        }
        this.domObj.setBorderBoxSize(sizeOpts);

        if (this.options.propagate) {
            // propogate changes to children
            var o = {forceResize: options ? options.forceResize : false};
            $A(this.domObj.childNodes).each(function(child){
                if (child.resize && child.getStyle('display') != 'none') {
                    child.resize.delay(0,child,o);
                }
            });
        }

        this.fireEvent('sizeChange',this);
    }
});/*
---

name: Jx.Toolbar

description: A toolbar is a container object that contains other objects such as buttons.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.List

provides: [Jx.Toolbar]

css:
 - toolbar

images:
 - toolbar.png
...
 */
// $Id$
/**
 * Class: Jx.Toolbar
 *
 * Extends: <Jx.Widget>
 *
 * A toolbar is a container object that contains other objects such as
 * buttons.  The toolbar organizes the objects it contains automatically,
 * wrapping them as necessary.  Multiple toolbars may be placed within
 * the same containing object.
 *
 * Jx.Toolbar includes CSS classes for styling the appearance of a
 * toolbar to be similar to traditional desktop application toolbars.
 *
 * There is one special object, Jx.ToolbarSeparator, that provides
 * a visual separation between objects in a toolbar.
 *
 * While a toolbar is generally a *dumb* container, it serves a special
 * purpose for menus by providing some infrastructure so that menus can behave
 * properly.
 *
 * In general, almost anything can be placed in a Toolbar, and mixed with
 * anything else.
 *
 * Example:
 * The following example shows how to create a Jx.Toolbar instance and place
 * two objects in it.
 *
 * (code)
 * //myToolbarContainer is the id of a <div> in the HTML page.
 * function myFunction() {}
 * var myToolbar = new Jx.Toolbar('myToolbarContainer');
 *
 * var myButton = new Jx.Button(buttonOptions);
 *
 * var myElement = document.createElement('select');
 *
 * myToolbar.add(myButton, new Jx.ToolbarSeparator(), myElement);
 * (end)
 *
 * Events:
 * add - fired when one or more buttons are added to a toolbar
 * remove - fired when on eor more buttons are removed from a toolbar
 *
 * Implements:
 * Options
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Toolbar = new Class({
    Family: 'Jx.Toolbar',
    Extends: Jx.Widget,
    /**
     * Property: list
     * {<Jx.List>} the list that holds the items in this toolbar
     */
    list : null,
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the toolbar lives in
     */
    domObj : null,
    /**
     * Property: isActive
     * When a toolbar contains <Jx.Menu> instances, they want to know
     * if any menu in the toolbar is active and this is how they
     * find out.
     */
    isActive : false,
    options: {
        /* Option: position
         * the position of this toolbar in the container.  The position
         * affects some items in the toolbar, such as menus and flyouts, which
         * need to open in a manner sensitive to the position.  May be one of
         * 'top', 'right', 'bottom' or 'left'.  Default is 'top'.
         */
        position: 'top',
        /* Option: parent
         * a DOM element to add this toolbar to
         */
        parent: null,
        /* Option: autoSize
         * if true, the toolbar will attempt to set its size based on the
         * things it contains.  Default is false.
         */
        autoSize: false,
        /**
         * Option: align
         * Determines whether the toolbar is aligned left, center, or right.
         * Mutually exclusive with the scroll option. If scroll is set to true
         * this option does nothing. Default: 'left', valid values: 'left',
         * 'center', or 'right'
         */
        align: 'left',
        /* Option: scroll
         * if true, the toolbar may scroll if the contents are wider than
         * the size of the toolbar
         */
        scroll: true,
        template: '<ul class="jxToolbar"></ul>'
    },
    classes: new Hash({
        domObj: 'jxToolbar'
    }),
    /**
     * APIMethod: render
     * Create a new instance of Jx.Toolbar.
     */
    render: function() {
        this.parent();
        this.domObj.store('jxToolbar', this);
        if ($defined(this.options.id)) {
            this.domObj.id = this.options.id;
        }

        this.list = new Jx.List(this.domObj, {
            onAdd: function(item) {
                this.fireEvent('add', this);
            }.bind(this),
            onRemove: function(item) {
                this.fireEvent('remove', this);
            }.bind(this)
        });

        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
        this.deactivateWatcher = this.deactivate.bindWithEvent(this);
        if (this.options.items) {
            this.add(this.options.items);
        }
    },

    /**
     * Method: addTo
     * add this toolbar to a DOM element automatically creating a toolbar
     * container if necessary
     *
     * Parameters:
     * parent - the DOM element or toolbar container to add this toolbar to.
     */
    addTo: function(parent) {
        var tbc = document.id(parent).retrieve('jxBarContainer');
        if (!tbc) {
            tbc = new Jx.Toolbar.Container({
                parent: parent,
                position: this.options.position,
                autoSize: this.options.autoSize,
                align: this.options.align,
                scroll: this.options.scroll
            });
        }
        tbc.add(this);
        return this;
    },

    /**
     * Method: add
     * Add an item to the toolbar.  If the item being added is a Jx component
     * with a domObj property, the domObj is added.  If the item being added
     * is an LI element, then it is given a CSS class of *jxToolItem*.
     * Otherwise, the thing is wrapped in a <Jx.ToolbarItem>.
     *
     * Parameters:
     * thing - {Object} the thing to add.  More than one thing can be added
     * by passing multiple arguments.
     */
    add: function( ) {
        $A(arguments).flatten().each(function(thing) {
            var item = thing;
            if (item.domObj) {
                item = item.domObj;
            }

            if (item.tagName == 'LI') {
                if (!item.hasClass('jxToolItem')) {
                    item.addClass('jxToolItem');
                }
            } else {
                item = new Jx.Toolbar.Item(thing);
            }
            this.list.add(item);
        }, this);
        
        //Update the size of the toolbar container.
        this.update();
        
        return this;
    },
    /**
     * Method: remove
     * remove an item from a toolbar.  If the item is not in this toolbar
     * nothing happens
     *
     * Parameters:
     * item - {Object} the object to remove
     *
     * Returns:
     * {Object} the item that was removed, or null if the item was not
     * removed.
     */
    remove: function(item) {
        if (item.domObj) {
            item = item.domObj;
        }
        var li = item.findElement('LI');
        this.list.remove(li);
        this.update();
        return this;
    },
    /**
     * APIMethod: empty
     * remove all items from the toolbar
     */
    empty: function() {
      this.list.each(function(item){this.remove(item);},this);
    },
    /**
     * Method: deactivate
     * Deactivate the Toolbar (when it is acting as a menu bar).
     */
    deactivate: function() {
        this.list.each(function(item){
            if (item.retrieve('jxMenu')) {
                item.retrieve('jxMenu').hide();
            }
        });
        this.setActive(false);
    },
    /**
     * Method: isActive
     * Indicate if the toolbar is currently active (as a menu bar)
     *
     * Returns:
     * {Boolean}
     */
    isActive: function() {
        return this.isActive;
    },
    /**
     * Method: setActive
     * Set the active state of the toolbar (for menus)
     *
     * Parameters:
     * b - {Boolean} the new state
     */
    setActive: function(b) {
        this.isActive = b;
        if (this.isActive) {
            document.addEvent('click', this.deactivateWatcher);
        } else {
            document.removeEvent('click', this.deactivateWatcher);
        }
    },
    /**
     * Method: setVisibleItem
     * For menus, they want to know which menu is currently open.
     *
     * Parameters:
     * obj - {<Jx.Menu>} the menu that just opened.
     */
    setVisibleItem: function(obj) {
        if (this.visibleItem && this.visibleItem.hide && this.visibleItem != obj) {
            this.visibleItem.hide();
        }
        this.visibleItem = obj;
        if (this.isActive()) {
            this.visibleItem.show();
        }
    },
    
    showItem: function(item) {
        this.fireEvent('show', item);
    },
    /**
     * Method: update
     * Updates the size of the UL so that the size is always consistently the 
     * exact size of the size of the sum of the buttons. This will keep all of 
     * the buttons on one line.
     */
    update: function () {
        // if (['top','bottom'].contains(this.options.position)) {
        //     (function(){
        //         var s = 0;
        //         var children = this.domObj.getChildren();
        //         children.each(function(button){
        //             var size = button.getMarginBoxSize();
        //             s += size.width +0.5;
        //         },this);
        //         if (s !== 0) {
        //             this.domObj.setStyle('width', Math.round(s));
        //         } else {
        //             this.domObj.setStyle('width','auto');
        //         }
        //     }).delay(1,this);
        // }
        this.fireEvent('update');
    },
    changeText : function(lang) {
      this.update();
    }
});
/*
---

name: Jx.Toolbar.Container

description: A toolbar container contains toolbars.  This has an optional dependency on Fx.Tween that, if included, will allow toolbars that contain more elements than can be displayed to be smoothly scrolled left and right.  Without this optional dependency, the toolbar will jump in fixed increments rather than smoothly scrolling.

license: MIT-style license.

requires:
 - Jx.Toolbar
 - Jx.Button

optional:
 - Core/Fx.Tween

provides: [Jx.Toolbar.Container]

images:
 - emblems.png

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Container
 *
 * Extends: <Jx.Widget>
 *
 * A toolbar container contains toolbars.  A single toolbar container fills
 * the available space horizontally.  Toolbars placed in a toolbar container
 * do not wrap when they exceed the available space.
 *
 * Events:
 * add - fired when one or more toolbars are added to a container
 * remove - fired when one or more toolbars are removed from a container
 *
 * Implements:
 * Options
 * Events
 * {<Jx.Addable>}
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

Jx.Toolbar.Container = new Class({

    Family: 'Jx.Toolbar.Container',
    Extends: Jx.Widget,
    Binds: ['update'],
    pluginNamespace: 'ToolbarContainer',
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the container lives in
     */
    domObj: null,
    options: {
        /* Option: parent
         * a DOM element to add this to
         */
        parent: null,
        /* Option: position
         * the position of the toolbar container in its parent, one of 'top',
         * 'right', 'bottom', or 'left'.  Default is 'top'
         */
        position: 'top',
        /* Option: autoSize
         * automatically size the toolbar container to fill its container.
         * Default is false
         */
        autoSize: false,
        /* Option: scroll
         * Control whether the user can scroll of the content of the
         * container if the content exceeds the size of the container.
         * Default is true.
         */
        scroll: true,
        /**
         * Option: align
         * Determines whether the toolbar is aligned left, center, or right.
         * Mutually exclusive with the scroll option. This option overrides
         * scroll if set to something other than the default. Default: 'left',
         * valid values are 'left','center', or 'right'
         */
        align: 'left',
        template: "<div class='jxBarContainer'><div class='jxBarControls'></div></div>",
        scrollerTemplate: "<div class='jxBarScroller'><div class='jxBarWrapper'></div></div>"
    },
    classes: new Hash({
        domObj: 'jxBarContainer',
        scroller: 'jxBarScroller',
        //used to hide the overflow of the wrapper
        wrapper: 'jxBarWrapper',
        controls: 'jxBarControls'
        //used to allow multiple toolbars to float next to each other
    }),

    updating: false,

    /**
     * APIMethod: render
     * Create a new instance of Jx.Toolbar.Container
     */
    render: function() {
        this.parent();
        /* if a container was passed in, use it instead of the one from the
         * template
         */
        if (document.id(this.options.parent)) {
            this.domObj = document.id(this.options.parent);
            this.elements = new Hash({
                'jxBarContainer': this.domObj
            });
            this.domObj.addClass('jxBarContainer');
            this.domObj.grab(this.controls);
            this.domObj.addEvent('sizeChange', this.update);
        }

        if (!['center', 'right'].contains(this.options.align) && this.options.scroll) {
            this.processElements(this.options.scrollerTemplate, this.classes);
            this.domObj.grab(this.scroller, 'top');
        }
        
        //add the alignment option... not sure why this keeps getting removed??
        this.domObj.addClass('jxToolbarAlign' + 
                this.options.align.capitalize());

        /* this allows toolbars to add themselves to this bar container
         * once it already exists without requiring an explicit reference
         * to the toolbar container
         */
        this.domObj.store('jxBarContainer', this);

        if (['top', 'right', 'bottom', 'left'].contains(this.options.position)) {
            this.domObj.addClass('jxBar' +
            this.options.position.capitalize());
        } else {
            this.domObj.addClass('jxBarTop');
            this.options.position = 'top';
        }

        if (this.options.scroll && ['top', 'bottom'].contains(this.options.position)) {
            // make sure we update our size when we get added to the DOM
            this.addEvent('addTo', function(){
              this.domObj.getParent().addEvent('sizeChange', this.update);
              this.update();
            });

            this.scrollLeft = new Jx.Button({
                image: Jx.aPixel.src
            }).addTo(this.controls, 'bottom');
            document.id(this.scrollLeft).addClass('jxBarScrollLeft');
            this.scrollLeft.addEvents({
                click: this.scroll.bind(this, 'left')
            });

            this.scrollRight = new Jx.Button({
                image: Jx.aPixel.src
            }).addTo(this.controls, 'bottom');
            document.id(this.scrollRight).addClass('jxBarScrollRight');
            this.scrollRight.addEvents({
                click: this.scroll.bind(this, 'right')
            });

        } else if (this.options.scroll && ['left', 'right'].contains(this.options.position)) {
            //do we do scrolling up and down?
            //for now disable scroll in this case
            this.options.scroll = false;
        } else {
            this.options.scroll = false;
        }

        this.addEvent('add', this.update);
        if (this.options.toolbars) {
            this.add(this.options.toolbars);
        }
    },

    /**
     * APIMethod: update
     * Updates the scroller enablement dependent on the total size of the
     * toolbar(s).
     */
    update: function() {
        if (this.options.scroll) {
            if (['top', 'bottom'].contains(this.options.position)) {
                var tbcSize = this.domObj.getContentBoxSize().width;

                var s = 0;
                //next check to see if we need the scrollers or not.
                var children = this.wrapper.getChildren();
                if (children.length > 0) {
                    children.each(function(tb) {
                        s += tb.getMarginBoxSize().width;
                    },
                    this);

                    var scrollerSize = tbcSize;

                    if (s === 0) {
                        this.scrollLeft.setEnabled(false);
                        this.scrollRight.setEnabled(false);
                    } else {


                        var leftMargin = this.wrapper.getStyle('margin-left').toInt();
                        scrollerSize -= this.controls.getMarginBoxSize().width;


                        if (leftMargin < 0) {
                            //has been scrolled left so activate the right scroller
                            this.scrollLeft.setEnabled(true);
                        } else {
                            //we don't need it
                            this.scrollLeft.setEnabled(false);
                        }

                        if (s + leftMargin > scrollerSize) {
                            //we need the right one
                            this.scrollRight.setEnabled(true);
                        } else {
                            //we don't need it
                            this.scrollRight.setEnabled(false);
                        }
                    }

                } else {
                    this.scrollRight.setEnabled(false);
                    this.scrollLeft.setEnabled(false);
                }
                this.scroller.setStyle('width', scrollerSize);

                this.findFirstVisible();
                this.updating = false;
            }
        }
    },
    /**
     * Method: findFirstVisible
     * Finds the first visible button on the toolbar and saves a reference in 
     * the scroller object
     */
    findFirstVisible: function() {
        if ($defined(this.scroller.retrieve('buttonPointer'))) {
            return;
        };

        var children = this.wrapper.getChildren();

        if (children.length > 0) {
            children.each(function(toolbar) {
                var buttons = toolbar.getChildren();
                if (buttons.length > 1) {
                    buttons.each(function(button) {
                        var pos = button.getCoordinates(this.scroller);
                        if (pos.left >= 0 && !$defined(this.scroller.retrieve('buttonPointer'))) {
                            //this is the first visible button
                            this.scroller.store('buttonPointer', button);
                        }
                    },
                    this);
                }
            },
            this);
        }
    },

    /**
     * APIMethod: add
     * Add a toolbar to the container.
     *
     * Parameters:
     * toolbar - {Object} the toolbar to add.  More than one toolbar
     *    can be added by passing multiple arguments.
     */
    add: function() {
        $A(arguments).flatten().each(function(thing) {
            if (this.options.scroll) {
                /* we potentially need to show or hide scroller buttons
                 * when the toolbar contents change
                 */
                thing.addEvent('update', this.update.bind(this));
                thing.addEvent('show', this.scrollIntoView.bind(this));
            }
            if (this.wrapper) {
                this.wrapper.adopt(thing.domObj);
            } else {
                this.domObj.adopt(thing.domObj);
            }
            this.domObj.addClass('jxBar' + this.options.position.capitalize());
        },
        this);
        if (arguments.length > 0) {
            this.fireEvent('add', this);
        }
        return this;
    },

    /**
     * Method: scroll
     * Does the work of scrolling the toolbar to a specific position.
     *
     * Parameters:
     * direction - whether to scroll left or right
     */
    scroll: function(direction) {
        if (this.updating) {
            return
        };
        this.updating = true;

        var currentButton = this.scroller.retrieve('buttonPointer');
        if (direction === 'left') {
            //need to tween the amount of the previous button
            var previousButton = this.scroller.retrieve('previousPointer');
            if (!previousButton) {
                previousButton = this.getPreviousButton(currentButton);
            }
            if (previousButton) {
                var w = previousButton.getMarginBoxSize().width;
                var ml = this.wrapper.getStyle('margin-left').toInt();
                ml += w;
                if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                    //scroll it
                    this.wrapper.get('tween', {
                        property: 'margin-left',
                        onComplete: this.afterTweenLeft.bind(this, previousButton)
                    }).start(ml);
                } else {
                    //set it
                    this.wrapper.setStyle('margin-left', ml);
                    this.afterTweenLeft(previousButton);
                }
            } else {
                this.update();
            }
        } else {
            //must be right
            var w = currentButton.getMarginBoxSize().width;

            var ml = this.wrapper.getStyle('margin-left').toInt();
            ml -= w;

            //now, if Fx is defined tween the margin to the left to
            //hide the current button
            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenRight.bind(this, currentButton)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenRight(currentButton);
            }

        }
    },

    /**
     * Method: afterTweenRight
     * Updates pointers to buttons after the toolbar scrolls right
     *
     * Parameters:
     * currentButton - the button that was currently first before the scroll
     */
    afterTweenRight: function(currentButton) {
        var np = this.getNextButton(currentButton);
        if (!np) {
            np = currentButton;
        }
        this.scroller.store('buttonPointer', np);
        if (np !== currentButton) {
            this.scroller.store('previousPointer', currentButton);
        }
        this.update();
    },
    /**
     * Method: afterTweenLeft
     * Updates pointers to buttons after the toolbar scrolls left
     *
     * Parameters:
     * previousButton - the button that was to the left of the first visible
     *      button.
     */
    afterTweenLeft: function(previousButton) {
        this.scroller.store('buttonPointer', previousButton);
        var pp = this.getPreviousButton(previousButton);
        if ($defined(pp)) {
            this.scroller.store('previousPointer', pp);
        } else {
            this.scroller.eliminate('previousPointer');
        }
        this.update();
    },
    /**
     * APIMethod: remove
     * remove an item from a toolbar.  If the item is not in this toolbar
     * nothing happens
     *
     * Parameters:
     * item - {Object} the object to remove
     *
     * Returns:
     * {Object} the item that was removed, or null if the item was not
     * removed.
     */
    remove: function(item) {
        if (item instanceof Jx.Widget) {
            item.dispose();
        } else {
            document.id(item).dispose();
        }
        this.update();
    },
    /**
     * APIMethod: scrollIntoView
     * scrolls an item in one of the toolbars into the currently visible
     * area of the container if it is not already fully visible
     *
     * Parameters:
     * item - the item to scroll.
     */
    scrollIntoView: function(item) {
        var currentButton = this.scroller.retrieve('buttonPointer');

        if (!$defined(currentButton)) return;

        if ($defined(item.domObj)) {
            item = item.domObj;
            while (!item.hasClass('jxToolItem')) {
                item = item.getParent();
            }
        }
        var pos = item.getCoordinates(this.scroller);
        var scrollerSize = this.scroller.getStyle('width').toInt();

        if (pos.right > 0 && pos.right <= scrollerSize && pos.left > 0 && pos.left <= scrollerSize) {
           //we are completely on screen 
            return;
        };

        if (pos.right > scrollerSize) {
            //it's right of the scroller
            var diff = pos.right - scrollerSize;

            //loop through toolbar items until we have enough width to
            //make the item visible
            var ml = this.wrapper.getStyle('margin-left').toInt();
            var w = currentButton.getMarginBoxSize().width;
            var np;
            while (w < diff && $defined(currentButton)) {
                np = this.getNextButton(currentButton);
                if (np) {
                    w += np.getMarginBoxSize().width;
                } else {
                    break;
                }
                currentButton = np;
            }

            ml -= w;

            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenRight.bind(this, currentButton)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenRight(currentButton);
            }
        } else {
            //it's left of the scroller
            var ml = this.wrapper.getStyle('margin-left').toInt();
            ml -= pos.left;

            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenLeft.bind(this, item)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenLeft(item);
            }
        }

    },
    /**
     * Method: getPreviousButton
     * Finds the button to the left of the first visible button
     *
     * Parameters:
     * currentButton - the first visible button
     */
    getPreviousButton: function(currentButton) {
        pp = currentButton.getPrevious();
        if (!$defined(pp)) {
            //check for a new toolbar
            pp = currentButton.getParent().getPrevious();
            if (pp) {
                pp = pp.getLast();
            }
        }
        return pp;
    },
    /**
     * Method: getNextButton
     * Finds the button to the right of the first visible button
     *
     * Parameters:
     * currentButton - the first visible button
     */
    getNextButton: function(currentButton) {
        np = currentButton.getNext();
        if (!np) {
            np = currentButton.getParent().getNext();
            if (np) {
                np = np.getFirst();
            }
        }
        return np;
    }

});
/*
---

name: Jx.Toolbar.Item

description: A helper class to provide a container for something to go into a Jx.Toolbar.

license: MIT-style license.

requires:
 - Jx.Toolbar

provides: [Jx.Toolbar.Item]

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Item
 *
 * Extends: Object
 *
 * Implements: Options
 *
 * A helper class to provide a container for something to go into
 * a <Jx.Toolbar>.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Item = new Class( {
    Family: 'Jx.Toolbar.Item',
    Extends: Jx.Widget,
    options: {
        /* Option: active
         * is this item active or not?  Default is true.
         */
        active: true,
        template: '<li class="jxToolItem"></li>'
    },
    classes: new Hash({
        domObj: 'jxToolItem'
    }),

    parameters: ['jxThing', 'options'],

    /**
     * APIMethod: render
     * Create a new instance of Jx.Toolbar.Item.
     */
    render: function() {
        this.parent();
        var el = document.id(this.options.jxThing);
        if (el) {
            this.domObj.adopt(el);
        }
    }
});/*
---

name: Jx.Panel

description: A panel is a fundamental container object that has a content area and optional toolbars around the content area.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Menu.Item
 - Jx.Layout
 - Jx.Toolbar.Container
 - Jx.Toolbar.Item

provides: [Jx.Panel]

css:
 - panel

images:
 - panel_controls.png
 - panelbar.png

...
 */
// $Id$
/**
 * Class: Jx.Panel
 *
 * Extends: <Jx.Widget>
 *
 * A panel is a fundamental container object that has a content
 * area and optional toolbars around the content area.  It also
 * has a title bar area that contains an optional label and
 * some user controls as determined by the options passed to the
 * constructor.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * close - fired when the panel is closed
 * collapse - fired when the panel is collapsed
 * expand - fired when the panel is opened
 * 
 * MooTools.lang Keys:
 * - panel.collapseTooltip
 * - panel.collapseLabel
 * - panel.expandlabel
 * - panel.maximizeTooltip
 * - panel.maximizeLabel
 * - panel.restoreTooltip
 * - panel.restoreLabel
 * - panel.closeTooltip
 * - panel.closeLabel
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel = new Class({
    Family: 'Jx.Panel',
    Extends: Jx.Widget,

    toolbarContainers: {
        top: null,
        right: null,
        bottom: null,
        left: null
    },

     options: {
        position: null,
        collapsedClass: 'jxPanelMin',
        collapseClass: 'jxPanelCollapse',
        menuClass: 'jxPanelMenu',
        maximizeClass: 'jxPanelMaximize',
        closeClass: 'jxPanelClose',

        /* Option: label
         * String, the title of the Jx Panel
         */
        label: '&nbsp;',
        /* Option: height
         * integer, fixed height to give the panel - no fixed height by
         * default.
         */
        height: null,
        /* Option: collapse
         * boolean, determine if the panel can be collapsed and expanded
         * by the user.  This puts a control into the title bar for the user
         * to control the state of the panel.
         */
        collapse: true,
        /* Option: close
         * boolean, determine if the panel can be closed (hidden) by the user.
         * The application needs to provide a way to re-open the panel after
         * it is closed.  The closeable property extends to dialogs created by
         * floating panels.  This option puts a control in the title bar of
         * the panel.
         */
        close: false,
        /* Option: closed
         * boolean, initial state of the panel (true to start the panel
         *  closed), default is false
         */
        closed: false,
        /* Option: hideTitle
         * Boolean, hide the title bar if true.  False by default.
         */
        hideTitle: false,
        /* Option: toolbars
         * array of Jx.Toolbar objects to put in the panel.  The position
         * of each toolbar is used to position the toolbar within the panel.
         */
        toolbars: [],
        type: 'panel',
        template: '<div class="jxPanel"><div class="jxPanelTitle"><img class="jxPanelIcon" src="'+Jx.aPixel.src+'" alt="" title=""/><span class="jxPanelLabel"></span><div class="jxPanelControls"></div></div><div class="jxPanelContentContainer"><div class="jxPanelContent"></div></div></div>',
        controlButtonTemplate: '<a class="jxButtonContainer jxButton"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>'
    },
    classes: new Hash({
        domObj: 'jxPanel',
        title: 'jxPanelTitle',
        domImg: 'jxPanelIcon',
        domLabel: 'jxPanelLabel',
        domControls: 'jxPanelControls',
        contentContainer: 'jxPanelContentContainer',
        content: 'jxPanelContent'
    }),

    /**
     * APIMethod: render
     * Initialize a new Jx.Panel instance
     */
    render : function(){
        this.parent();

        this.toolbars = this.options ? this.options.toolbars || [] : [];

        this.options.position = ($defined(this.options.height) && !$defined(this.options.position)) ? 'relative' : 'absolute';

        if (this.options.image && this.domImg) {
            this.domImg.setStyle('backgroundImage', 'url('+this.options.image+')');
        }
        if (this.options.label && this.domLabel) {
            this.setLabel(this.options.label);
        }

        var tbDiv = new Element('div');
        this.domControls.adopt(tbDiv);
        this.toolbar = new Jx.Toolbar({parent:tbDiv, scroll: false});

        var that = this;
        if (this.options.menu) {
            this.menu = new Jx.Menu({
                image: Jx.aPixel.src
            }, {
              buttonTemplate: this.options.controlButtonTemplate
            });
            this.menu.domObj.addClass(this.options.menuClass);
            this.menu.domObj.addClass('jxButtonContentLeft');
            this.toolbar.add(this.menu);
        }

        //var b, item;
        if (this.options.collapse) {
            if (this.title) {
              this.title.addEvent('dblclick', function() {
                that.toggleCollapse();
              });
            }
            this.colB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: {set:'Jx',key:'panel',value:'collapseTooltip'},
                onClick: function() {
                    that.toggleCollapse();
                }
            });
            this.colB.domObj.addClass(this.options.collapseClass);
            this.addEvents({
                collapse: function() {
                    this.colB.setTooltip({set:'Jx',key:'panel',value:'expandTooltip'});
                }.bind(this),
                expand: function() {
                    this.colB.setTooltip({set:'Jx',key:'panel',value:'collapseTooltip'});
                }.bind(this)
            });
            this.toolbar.add(this.colB);
            if (this.menu) {
                this.colM = new Jx.Menu.Item({
                    label: this.options.collapseLabel,
                    onClick: function() { that.toggleCollapse(); }
                });
                var item = this.colM
                this.addEvents({
                    collapse: function() {
                        this.colM.setLabel({set:'Jx',key:'panel',value:'expandLabel'});
                    }.bind(this),
                    expand: function() {
                        this.colM.setLabel({set:'Jx',key:'panel',value:'collapseLabel'});
                    }.bind(this)
                });
                this.menu.add(item);
            }
        }

        if (this.options.maximize) {
            this.maxB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: {set:'Jx',key:'panel',value:'maximizeTooltip'},
                onClick: function() {
                    that.maximize();
                }
            });
            this.maxB.domObj.addClass(this.options.maximizeClass);
            this.addEvents({
                maximize: function() {
                    this.maxB.setTooltip({set:'Jx',key:'panel',value:'restoreTooltip'});
                }.bind(this),
                restore: function() {
                    this.maxB.setTooltip({set:'Jx',key:'panel',value:'maximizeTooltip'});
                }.bind(this)
            });
            this.toolbar.add(this.maxB);
            if (this.menu) {
                this.maxM = new Jx.Menu.Item({
                    label: this.options.maximizeLabel,
                    onClick: function() { that.maximize(); }
                });
                
                this.addEvents({
                    maximize: function() {
                        this.maxM.setLabel({set:'Jx',key:'panel',value:'maximizeLabel'});
                    }.bind(this),
                    restore: function() {
                        this.maxM.setLabel({set:'Jx',key:'panel',value:'restoreLabel'});
                    }.bind(this)
                });
                this.menu.add(this.maxM);
            }
        }

        if (this.options.close) {
            this.closeB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: {set:'Jx',key:'panel',value:'closeTooltip'},
                onClick: function() {
                    that.close();
                }
            });
            this.closeB.domObj.addClass(this.options.closeClass);
            this.toolbar.add(this.closeB);
            if (this.menu) {
                this.closeM = new Jx.Menu.Item({
                    label: {set:'Jx',key:'panel',value:'closeLabel'},
                    onClick: function() {
                        that.close();
                    }
                });
                this.menu.add(item);
            }

        }

        if (this.options.id) {
            this.domObj.id = this.options.id;
        }
        var jxl = new Jx.Layout(this.domObj, $merge(this.options, {propagate:false}));
        var layoutHandler = this.layoutContent.bind(this);
        jxl.addEvent('sizeChange', layoutHandler);

        if (this.options.hideTitle) {
            this.title.dispose();
        }

        if (Jx.type(this.options.toolbars) == 'array') {
            this.options.toolbars.each(function(tb){
                var position = tb.options.position;
                var tbc = this.toolbarContainers[position];
                if (!tbc) {
                    tbc = new Element('div');
                    new Jx.Layout(tbc);
                    this.contentContainer.adopt(tbc);
                    this.toolbarContainers[position] = tbc;
                }
                tb.addTo(tbc);
            }, this);
        }

        new Jx.Layout(this.contentContainer);
        new Jx.Layout(this.content);

        if(this.shouldLoadContent()) {
          this.loadContent(this.content);
        }

        this.toggleCollapse(this.options.closed);

        this.addEvent('addTo', function() {
            this.domObj.resize();
        });
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },

    /**
     * Method: layoutContent
     * the sizeChange event of the <Jx.Layout> that manages the outer container
     * is intercepted and passed through this method to handle resizing of the
     * panel contents because we need to do some calculations if the panel
     * is collapsed and if there are toolbars to put around the content area.
     */
    layoutContent: function() {
        var titleHeight = 0;
        var top = 0;
        var bottom = 0;
        var left = 0;
        var right = 0;
        var tbc;
        var tb;
        var position;
        if (!this.options.hideTitle && this.title.parentNode == this.domObj) {
            titleHeight = this.title.getMarginBoxSize().height;
        }
        var domSize = this.domObj.getContentBoxSize();
        if (domSize.height > titleHeight) {
            this.contentContainer.setStyle('display','block');
            this.options.closed = false;
            this.contentContainer.resize({
                top: titleHeight,
                height: null,
                bottom: 0
            });
            ['left','right'].each(function(position){
                if (this.toolbarContainers[position]) {
                    this.toolbarContainers[position].style.width = 'auto';
                }
            }, this);
            ['top','bottom'].each(function(position){
                if (this.toolbarContainers[position]) {
                    this.toolbarContainers[position].style.height = '';
                }
            }, this);
            if (Jx.type(this.options.toolbars) == 'array') {
                this.options.toolbars.each(function(tb){
                    tb.update();
                    position = tb.options.position;
                    tbc = this.toolbarContainers[position];
                    // IE 6 doesn't seem to want to measure the width of
                    // things correctly
                    if (Browser.Engine.trident4) {
                        var oldParent = document.id(tbc.parentNode);
                        tbc.style.visibility = 'hidden';
                        document.id(document.body).adopt(tbc);
                    }
                    var size = tbc.getBorderBoxSize();
                    // put it back into its real parent now we are done
                    // measuring
                    if (Browser.Engine.trident4) {
                        oldParent.adopt(tbc);
                        tbc.style.visibility = '';
                    }
                    switch(position) {
                        case 'bottom':
                            bottom = size.height;
                            break;
                        case 'left':
                            left = size.width;
                            break;
                        case 'right':
                            right = size.width;
                            break;
                        case 'top':
                        default:
                            top = size.height;
                            break;
                    }
                },this);
            }
            tbc = this.toolbarContainers['top'];
            if (tbc) {
                tbc.resize({top: 0, left: left, right: right, bottom: null, height: top, width: null});
            }
            tbc = this.toolbarContainers['bottom'];
            if (tbc) {
                tbc.resize({top: null, left: left, right: right, bottom: 0, height: bottom, width: null});
            }
            tbc = this.toolbarContainers['left'];
            if (tbc) {
                tbc.resize({top: top, left: 0, right: null, bottom: bottom, height: null, width: left});
            }
            tbc = this.toolbarContainers['right'];
            if (tbc) {
                tbc.resize({top: top, left: null, right: 0, bottom: bottom, height: null, width: right});
            }
            this.content.resize({top: top, bottom: bottom, left: left, right: right});
        } else {
            this.contentContainer.setStyle('display','none');
            this.options.closed = true;
        }
        this.fireEvent('sizeChange', this);
    },

    /**
     * Method: setLabel
     * Set the label in the title bar of this panel
     *
     * Parameters:
     * s - {String} the new label
     */
    setLabel: function(s) {
        this.domLabel.set('html',this.getText(s));
    },
    /**
     * Method: getLabel
     * Get the label of the title bar of this panel
     *
     * Returns:
     * {String} the label
     */
    getLabel: function() {
        return this.domLabel.get('html');
    },
    /**
     * Method: finalize
     * Clean up the panel
     */
    finalize: function() {
        this.domObj = null;
        this.deregisterIds();
    },
    /**
     * Method: maximize
     * Maximize this panel
     */
    maximize: function() {
        if (this.manager) {
            this.manager.maximizePanel(this);
        }
    },
    /**
     * Method: setContent
     * set the content of this panel to some HTML
     *
     * Parameters:
     * html - {String} the new HTML to go in the panel
     */
    setContent : function (html) {
        this.content.innerHTML = html;
        this.bContentReady = true;
    },
    /**
     * Method: setContentURL
     * Set the content of this panel to come from some URL.
     *
     * Parameters:
     * url - {String} URL to some HTML content for this panel
     */
    setContentURL : function (url) {
        this.bContentReady = false;
        this.setBusy(true);
        if (arguments[1]) {
            this.onContentReady = arguments[1];
        }
        if (url.indexOf('?') == -1) {
            url = url + '?';
        }
        var a = new Request({
            url: url,
            method: 'get',
            evalScripts:true,
            onSuccess:this.panelContentLoaded.bind(this),
            requestHeaders: ['If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT']
        }).send();
    },
    /**
     * Method: panelContentLoaded
     * When the content of the panel is loaded from a remote URL, this
     * method is called when the ajax request returns.
     *
     * Parameters:
     * html - {String} the html return from xhr.onSuccess
     */
    panelContentLoaded: function(html) {
        this.content.innerHTML = html;
        this.bContentReady = true;
        this.setBusy(false);
        if (this.onContentReady) {
            window.setTimeout(this.onContentReady.bind(this),1);
        }
    },

    /**
     * Method: toggleCollapse
     * sets or toggles the collapsed state of the panel.  If a
     * new state is passed, it is used, otherwise the current
     * state is toggled.
     *
     * Parameters:
     * state - optional, if passed then the state is used,
     * otherwise the state is toggled.
     */
    toggleCollapse: function(state) {
        if ($defined(state)) {
            this.options.closed = state;
        } else {
            this.options.closed = !this.options.closed;
        }
        if (this.options.closed) {
            if (!this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.addClass(this.options.collapsedClass);
                this.contentContainer.setStyle('display','none');
                var m = this.domObj.measure(function(){
                    return this.getSizes(['margin'],['top','bottom']).margin;
                });
                var height = m.top + m.bottom;
                if (this.title.parentNode == this.domObj) {
                    height += this.title.getMarginBoxSize().height;
                }
                this.domObj.resize({height: height});
                this.fireEvent('collapse', this);
            }
        } else {
            if (this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.removeClass(this.options.collapsedClass);
                this.contentContainer.setStyle('display','block');
                this.domObj.resize({height: this.options.height});
                this.fireEvent('expand', this);
            }
        }
    },

    /**
     * Method: close
     * Closes the panel (completely hiding it).
     */
    close: function() {
        this.domObj.dispose();
        this.fireEvent('close', this);
    },
    
    changeText: function (lang) {
    	this.parent();	//TODO: change this class so that we can access these properties without too much voodoo...
    	if($defined(this.closeB)) {
    		this.closeB.setTooltip({set:'Jx',key:'panel',value:'closeTooltip'});
    	}
    	if ($defined(this.closeM)) {
    		this.closeM.setLabel({set:'Jx',key:'panel',value:'closeLabel'});
    	}
    	if ($defined(this.maxB)) {
    		this.maxB.setTooltip({set:'Jx',key:'panel',value:'maximizeTooltip'});
    	}
    	if ($defined(this.colB)) {
    		this.colB.setTooltip({set:'Jx',key:'panel',value:'collapseTooltip'});
    	}
    	if ($defined(this.colM)) {
	    	if (this.options.closed == true) {
	    		this.colM.setLabel({set:'Jx',key:'panel',value:'expandLabel'});
	    	} else {
	    		this.colM.setLabel({set:'Jx',key:'panel',value:'collapseLabel'});
	    	}
    	}
      if (this.options.label && this.domLabel) {
          this.setLabel(this.options.label);
      }
      // TODO: is this the right method to call?
      // if toolbars left/right are used and localized, they may change their size..
      this.layoutContent();
    },

    /**
     * Method to be able to allow loadingOnDemand in subclasses but not here
     */
    shouldLoadContent: function() {
      return true;
    }
});/*
---

name: Jx.Dialog

description: A Jx.Panel that implements a floating dialog.

license: MIT-style license.

requires:
 - Jx.Panel
 - more/Keyboard

optional:
 - More/Drag

provides: [Jx.Dialog]

css:
 - dialog

images:
 - dialog_chrome.png
 - dialog_resize.png

...
 */
// $Id$
/**
 * Class: Jx.Dialog
 *
 * Extends: <Jx.Panel>
 *
 * A Jx.Dialog implements a floating dialog.  Dialogs represent a useful way
 * to present users with certain information or application controls.
 * Jx.Dialog is designed to provide the same types of features as traditional
 * operating system dialog boxes, including:
 *
 * - dialogs may be modal (user must dismiss the dialog to continue) or
 * non-modal
 *
 * - dialogs are movable (user can drag the title bar to move the dialog
 * around)
 *
 * - dialogs may be a fixed size or allow user resizing.
 *
 * Jx.Dialog uses <Jx.ContentLoader> to load content into the content area
 * of the dialog.  Refer to the <Jx.ContentLoader> documentation for details
 * on content options.
 *
 * Example:
 * (code)
 * var dialog = new Jx.Dialog();
 * (end)
 *
 * Events:
 * open - triggered when the dialog is opened
 * close - triggered when the dialog is closed
 * change - triggered when the value of an input in the dialog is changed
 * resize - triggered when the dialog is resized
 *
 * Extends:
 * Jx.Dialog extends <Jx.Panel>, please go there for more details.
 * 
 * MooTools.lang Keys:
 * - dialog.resizeToolTip
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog = new Class({
    Family: 'Jx.Dialog',
    Extends: Jx.Panel,

    options: {
        /* Option: modal
         * (optional) {Boolean} controls whether the dialog will be modal
         * or not.  The default is to create modal dialogs.
         */
        modal: true,
        /** 
         * Option: maskOptions
         */
        maskOptions: {
          'class':'jxModalMask',
          maskMargins: true,
          useIframeShim: true,
          iframeShimOptions: {
            className: 'jxIframeShim'
          }
        },
        eventMaskOptions: {
          'class':'jxEventMask',
          maskMargins: false,
          useIframeShim: false,
          destroyOnHide: true
        },
        /* just overrides default position of panel, don't document this */
        position: 'absolute',
        /* Option: width
         * (optional) {Integer} the initial width in pixels of the dialog.
         * The default value is 250 if not specified.
         */
        width: 250,
        /* Option: height
         * (optional) {Integer} the initial height in pixels of the
         * dialog. The default value is 250 if not specified.
         */
        height: 250,
        /* Option: horizontal
         * (optional) {String} the horizontal rule for positioning the
         * dialog.  The default is 'center center' meaning the dialog will be
         * centered on the page.  See {<Jx.AutoPosition>} for details.
         */
        horizontal: 'center center',
        /* Option: vertical
         * (optional) {String} the vertical rule for positioning the
         * dialog.  The default is 'center center' meaning the dialog will be
         * centered on the page.  See {<Jx.AutoPosition>} for details.
         */
        vertical: 'center center',
        /* Option: label
         * (optional) {String} the title of the dialog box.
         */
        label: '',
        /* Option: parent
         * (optional) {HTMLElement} a reference to an HTML element that
         * the dialog is to be contained by.  The default value is for the dialog
         * to be contained by the body element.
         */
        //parent: null,
        /* Option: resize
         * (optional) {Boolean} determines whether the dialog is
         * resizeable by the user or not.  Default is false.
         */
        resize: false,

        /* Option: move
         * (optional) {Boolean} determines whether the dialog is
         * moveable by the user or not.  Default is true.
         */
        move: true,
        /*
         * Option: limit
         * (optional) {Object} || false
         * passed to the Drag instance of this dialog to limit the movement
         * {Object} must have x&y coordinates with a range, like {x:[0,500],y:[0,500]}.
         * Set an id or a reference of a DOM Element (ie 'document', 'myContainerWithId', 
         * $('myContainer'), $('domID').getParent()) to use these dimensions
         * as boundaries. Default is false.
         */
        limit : false,
        /* Option: close
         * (optional) {Boolean} determines whether the dialog is
         * closeable by the user or not.  Default is true.
         */
        close: true,
        /**
         * Option: destroyOnClose
         * (optional) {Boolean} determines whether closing the dialog also
         * destrpys it completely. Default is false
         */
        destroyOnClose: false,
        /**
         * Option: useKeyboard
         * (optional) {Boolean} determines whether the Dialog listens to keyboard events globally
         * Default is false
         */
        useKeyboard : false,
        /**
         * Option: keys
         * (optional) {Object} refers with the syntax for MooTools Keyboard Class
         * to functions. Set key to false to disable it manually 
         */
        keys: {
          'esc' : 'close'
        },
        /**
         * Option: keyboardMethods
         *
         * can be used to overwrite existing keyboard methods that are used inside
         * this.options.keys - also possible to add new ones.
         * Functions are bound to the dialog when using 'this'
         *
         * example:
         *  keys : {
         *    'alt+enter' : 'maximizeDialog'
         *  },
         *  keyboardMethods: {
         *    'maximizeDialog' : function(ev){
         *      ev.preventDefault();
         *      this.maximize();
         *    }
         *  }
         */
        keyboardMethods : {},
        collapsedClass: 'jxDialogMin',
        collapseClass: 'jxDialogCollapse',
        menuClass: 'jxDialogMenu',
        maximizeClass: 'jxDialogMaximize',
        closeClass: 'jxDialogClose',
        type: 'dialog',
        template: '<div class="jxDialog"><div class="jxDialogTitle"><img class="jxDialogIcon" src="'+Jx.aPixel.src+'" alt="" title=""/><span class="jxDialogLabel"></span><div class="jxDialogControls"></div></div><div class="jxDialogContentContainer"><div class="jxDialogContent"></div></div></div>'
    },
    classes: new Hash({
        domObj: 'jxDialog',
        title: 'jxDialogTitle',
        domImg: 'jxDialogIcon',
        domLabel: 'jxDialogLabel',
        domControls: 'jxDialogControls',
        contentContainer: 'jxDialogContentContainer',
        content: 'jxDialogContent'
    }),
    /**
     * MooTools Keyboard class for Events (mostly used in Dialog.Confirm, Prompt or Message)
     * But also optional here with esc to close
     */
    keyboard : null,
    /**
     * APIMethod: render
     * renders Jx.Dialog
     */
    render: function() {
        this.isOpening = false;
        this.firstShow = true;

        this.options = $merge(
            {parent:document.body}, // these are defaults that can be overridden
            this.options,
            {position: 'absolute'} // these override anything passed to the options
        );

        /* initialize the panel overriding the type and position */
        this.parent();
        this.openOnLoaded = this.open.bind(this);
        this.options.parent = document.id(this.options.parent);

        this.domObj.setStyle('display','none');
        this.options.parent.adopt(this.domObj);

        /* the dialog is moveable by its title bar */
        if (this.options.move && typeof Drag != 'undefined') {
            this.title.addClass('jxDialogMoveable');

            this.options.limit = this.setDragLimit(this.options.limit);
            // local reference to use Drag instance variables inside onDrag()
            var self = this;
            // COMMENT: any reason why the drag instance isn't referenced to the dialog?
            new Drag(this.domObj, {
                handle: this.title,
                limit: this.options.limit,
                onBeforeStart: (function(){
                    this.stack();
                }).bind(this),
                onStart: function() {
                    if (!self.options.modal && self.options.parent.mask) {
                      self.options.parent.mask(self.options.eventMaskOptions);
                    }
                    self.contentContainer.setStyle('visibility','hidden');
                    self.chrome.addClass('jxChromeDrag');
                    if(self.options.limit) {
                      var coords = self.options.limitOrig.getCoordinates();
                      for(var i in coords) {
                        window.console ? console.log(i, coords[i]) : false;
                      }
                      this.options.limit = self.setDragLimit(self.options.limitOrig);
                    }
                }, // COMMENT: removed bind(this) for setting the limit to the drag instance
                onDrag: function() {
                  if(this.options.limit) {
                    // find out if the right border of the dragged element is out of range
                    if(this.value.now.x+self.options.width >= this.options.limit.x[1]) {
                      this.value.now.x = this.options.limit.x[1] - self.options.width;
                      this.element.setStyle('left',this.value.now.x);
                    }
                    // find out if the bottom border of the dragged element is out of range
                    if(this.value.now.y+self.options.height >= this.options.limit.y[1]) {
                      this.value.now.y = this.options.limit.y[1] - self.options.height;
                      this.element.setStyle('top',this.value.now.y);
                    }
                  }
                },
                onComplete: (function() {
                    if (!this.options.modal && this.options.parent.unmask) {
                      this.options.parent.unmask();
                    }
                    this.chrome.removeClass('jxChromeDrag');
                    this.contentContainer.setStyle('visibility','');
                    var left = Math.max(this.chromeOffsets.left, parseInt(this.domObj.style.left,10));
                    var top = Math.max(this.chromeOffsets.top, parseInt(this.domObj.style.top,10));
                    this.options.horizontal = left + ' left';
                    this.options.vertical = top + ' top';
                    this.position(this.domObj, this.options.parent, this.options);
                    this.options.left = parseInt(this.domObj.style.left,10);
                    this.options.top = parseInt(this.domObj.style.top,10);
                    if (!this.options.closed) {
                        this.domObj.resize(this.options);
                    }
                }).bind(this)
            });
        }

        /* the dialog is resizeable */
        if (this.options.resize && typeof Drag != 'undefined') {
            this.resizeHandle = new Element('div', {
                'class':'jxDialogResize',
                title: this.getText({set:'Jx',key:'panel',value:'resizeTooltip'}),
                styles: {
                    'display':this.options.closed?'none':'block'
                }
            });
            this.domObj.appendChild(this.resizeHandle);

            this.resizeHandleSize = this.resizeHandle.getSize();
            this.resizeHandle.setStyles({
                bottom: this.resizeHandleSize.height,
                right: this.resizeHandleSize.width
            });
            this.domObj.makeResizable({
                handle:this.resizeHandle,
                onStart: (function() {
                    if (!this.options.modal && this.options.parent.mask) {
                      this.options.parent.mask(this.options.eventMaskOptions);
                    }
                    this.contentContainer.setStyle('visibility','hidden');
                    this.chrome.addClass('jxChromeDrag');
                }).bind(this),
                onDrag: (function() {
                    this.resizeChrome(this.domObj);
                }).bind(this),
                onComplete: (function() {
                    if (!this.options.modal && this.options.parent.unmask) {
                      this.options.parent.unmask();
                    }
                    this.chrome.removeClass('jxChromeDrag');
                    var size = this.domObj.getMarginBoxSize();
                    this.options.width = size.width;
                    this.options.height = size.height;
                    this.layoutContent();
                    this.domObj.resize(this.options);
                    this.contentContainer.setStyle('visibility','');
                    this.fireEvent('resize');
                    this.resizeChrome(this.domObj);

                }).bind(this)
            });
        }
        /* this adjusts the zIndex of the dialogs when activated */
        this.domObj.addEvent('mousedown', (function(){
            this.stack();
        }).bind(this));

        // initialize keyboard class
        this.initializeKeyboard();
    },

    /**
     * Method: resize
     * resize the dialog.  This can be called when the dialog is closed
     * or open.
     *
     * Parameters:
     * width - the new width
     * height - the new height
     * autoPosition - boolean, false by default, if resizing an open dialog
     * setting this to true will reposition it according to its position
     * rules.
     */
    resize: function(width, height, autoPosition) {
        this.options.width = width;
        this.options.height = height;
        if (this.domObj.getStyle('display') != 'none') {
            this.layoutContent();
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            if (autoPosition) {
                this.position(this.domObj, this.options.parent, this.options);
            }
        } else {
            this.firstShow = false;
        }
    },

    /**
     * Method: sizeChanged
     * overload panel's sizeChanged method
     */
    sizeChanged: function() {
        if (!this.options.closed) {
            this.layoutContent();
        }
    },

    /**
     * Method: toggleCollapse
     * sets or toggles the collapsed state of the panel.  If a
     * new state is passed, it is used, otherwise the current
     * state is toggled.
     *
     * Parameters:
     * state - optional, if passed then the state is used,
     * otherwise the state is toggled.
     */
    toggleCollapse: function(state) {
        if ($defined(state)) {
            this.options.closed = state;
        } else {
            this.options.closed = !this.options.closed;
        }
        if (this.options.closed) {
            if (!this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.addClass(this.options.collapsedClass);
            }
            this.contentContainer.setStyle('display','none');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','none');
            }
        } else {
            if (this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.removeClass(this.options.collapsedClass);
            }
            this.contentContainer.setStyle('display','block');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','block');
            }
        }

        if (this.options.closed) {
            var m = this.domObj.measure(function(){
                return this.getSizes(['margin'],['top','bottom']).margin;
            });
            var size = this.title.getMarginBoxSize();
            this.domObj.resize({height: m.top + size.height + m.bottom});
            this.fireEvent('collapse');
        } else {
            this.domObj.resize(this.options);
            this.fireEvent('expand');
        }
        this.showChrome(this.domObj);
    },
    
    /**
     * Method: maximize
     * Called when the maximize button of a dialog is clicked. It will maximize
     * the dialog to match the size of its parent.
     */
    maximize: function () {
        
        if (!this.maximized) {
            //get size of parent
            var p = this.options.parent;
            var size;
            
            if (p === document.body) {
                size = Jx.getPageDimensions();
            } else {
                size = p.getBorderBoxSize();
            }
            this.previousSettings = {
                width: this.options.width,
                height: this.options.height,
                horizontal: this.options.horizontal,
                vertical: this.options.vertical,
                left: this.options.left,
                right: this.options.right,
                top: this.options.top,
                bottom: this.options.bottom
            };
            this.options.width = size.width;
            this.options.height = size.height;
            this.options.vertical = '0 top';
            this.options.horizontal = '0 left';
            this.options.right = 0;
            this.options.left = 0;
            this.options.top = 0;
            this.options.bottom = 0;
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            this.maximized = true;
            this.domObj.addClass('jxDialogMaximized');
            this.fireEvent('maximize');
        } else {
            this.options = $merge(this.options, this.previousSettings);
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            this.maximized = false;
            if (this.domObj.hasClass('jxDialogMaximized')) {
                this.domObj.removeClass('jxDialogMaximized');
            }
            this.fireEvent('restore');
        }
    },

    /**
     * Method: show
     * show the dialog, external code should use the <Jx.Dialog::open> method
     * to make the dialog visible.
     */
    show : function( ) {
        /* prepare the dialog for display */
        this.domObj.setStyles({
            'display': 'block',
            'visibility': 'hidden'
        });
        this.toolbar.update();
        
        /* do the modal thing */
        if (this.options.modal && this.options.parent.mask) {
          var opts = $merge(this.options.maskOptions || {}, {
            style: {
              'z-index': Jx.getNumber(this.domObj.getStyle('z-index')) - 1
            }
          });
          this.options.parent.mask(opts);
          Jx.Stack.stack(this.options.parent.get('mask').element);
        }
        /* stack the dialog */
        this.stack();

        if (this.options.closed) {
            var m = this.domObj.measure(function(){
                return this.getSizes(['margin'],['top','bottom']).margin;
            });
            var size = this.title.getMarginBoxSize();
            this.domObj.resize({height: m.top + size.height + m.bottom});
        } else {
            this.domObj.resize(this.options);
        }
        
        if (this.firstShow) {
            this.contentContainer.resize({forceResize: true});
            this.layoutContent();
            this.firstShow = false;
            /* if the chrome got built before the first dialog show, it might
             * not have been properly created and we should clear it so it
             * does get built properly
             */
            if (this.chrome) {
                this.chrome.dispose();
                this.chrome = null;
            }
        }
        /* update or create the chrome */
        this.showChrome(this.domObj);
        /* put it in the right place using auto-positioning */
        this.position(this.domObj, this.options.parent, this.options);
        this.domObj.setStyle('visibility', 'visible');
    },
    /**
     * Method: hide
     * hide the dialog, external code should use the <Jx.Dialog::close>
     * method to hide the dialog.
     */
    hide : function() {
        this.domObj.setStyle('display','none');
        this.unstack();
        if (this.options.modal && this.options.parent.unmask) {
          Jx.Stack.unstack(this.options.parent.get('mask').element);
          this.options.parent.unmask();
        }
        if(this.options.useKeyboard && this.keyboard != null) {
          this.keyboard.deactivate();
        }
    },
    /**
     * Method: openURL
     * open the dialog and load content from the provided url.  If you don't
     * provide a URL then the dialog opens normally.
     *
     * Parameters:
     * url - <String> the url to load when opening.
     */
    openURL: function(url) {
        if (url) {
            this.options.contentURL = url;
            this.options.content = null;  //force Url loading
            this.setBusy();
            this.loadContent(this.content);
            this.addEvent('contentLoaded', this.openOnLoaded);
        } else {
            this.open();
        }
    },

    /**
     * Method: open
     * open the dialog.  This may be delayed depending on the
     * asynchronous loading of dialog content.  The onOpen
     * callback function is called when the dialog actually
     * opens
     */
    open: function() {
        if (!this.isOpening) {
            this.isOpening = true;
        }
        // COMMENT: this works only for onDemand -> NOT for cacheContent = false..
        // for this loading an URL everytime, use this.openURL(url) 
        if(!this.contentIsLoaded && this.options.loadOnDemand) {
          this.loadContent(this.content);
        }
        if (this.contentIsLoaded) {
            this.removeEvent('contentLoaded', this.openOnLoaded);
            this.show();
            this.fireEvent('open', this);
            this.isOpening = false;
        } else {
            this.addEvent('contentLoaded', this.openOnLoaded);
        }
        if(this.options.useKeyboard && this.keyboard != null) {
          this.keyboard.activate();
        }
    },
    /**
     * Method: close
     * close the dialog and trigger the onClose callback function
     * if necessary
     */
    close: function() {
        this.isOpening = false;
        this.hide();
        if (this.options.destroyOnClose) {
            if(this.blanket) {
                this.blanket.dispose();
            }
            this.domObj.dispose();
            this.unstack();
        }
        this.fireEvent('close');
    },

    cleanup: function() { },
    
    /**
     * APIMethod: isOpen
     * returns true if the dialog is currently open, false otherwise
     */
    isOpen: function () {
        //check to see if we're visible
        return !((this.domObj.getStyle('display') === 'none') || (this.domObj.getStyle('visibility') === 'hidden'));
    },
    
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.maxM)) {
			if (this.maximize) {
				this.maxM.setLabel(this.getText({set:'Jx',key:'panel',value:'restoreLabel'}));
	    	} else {
	    		this.maxM.setLabel(this.getText({set:'Jx',key:'panel',value:'maximizeLabel'}));
	    	}
    	}
    	if ($defined(this.resizeHandle)) {
    		this.resizeHandle.set('title', this.getText({set:'Jx',key:'dialog',value:'resizeTooltip'}));
    	}
      this.toggleCollapse(false);
    },

    initializeKeyboard: function() {
      if(this.options.useKeyboard) {
        var self = this;
        this.keyboardEvents = {};
        this.keyboardMethods = {
          close : function(ev) {ev.preventDefault();self.close()}
        }
        this.keyboard = new Keyboard({
          events: this.getKeyboardEvents()
        });
      }
    },

    /**
     * Method: getKeyboardMethods
     * used by this and all child classes to have methods listen to keyboard events,
     * returned object will be parsed to the events object of a MooTools Keyboard instance
     *
     * @return Object
     */
    getKeyboardEvents : function() {
      var self = this;
      for(var i in this.options.keys) {
        // only add a reference once, otherwise keyboard events will be fired twice in subclasses
        if(!$defined(this.keyboardEvents[i])) {
          if($defined(this.keyboardMethods[this.options.keys[i]])) {
            this.keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
          }else if($defined(this.options.keyboardMethods[this.options.keys[i]])){
            this.keyboardEvents[i] = this.options.keyboardMethods[this.options.keys[i]].bind(self);
          }else if(Jx.type(this.options.keys[i]) == 'function') {
            this.keyboardEvents[i] = this.options.keys[i].bind(self);
          }else{
            // allow disabling of special keys by setting them to false or null with having a warning
            if(this.options.keyboardMethods[this.options.keys[i]] != false) {
              $defined(console) ? console.warn("keyboard method %o not defined for %o", this.options.keys[i], this) : false;
            }
          }
        }
      }
      return this.keyboardEvents;
    },

    /**
     * Method: setDragLimit
     * calculates the drag-dimensions of an given element to drag
     *
     * Parameters:
     * - reference {Object} (optional) the element|elementId|object to set the limits
     */
    setDragLimit : function(reference) {
      if($defined(reference)) this.options.limit = reference;
      
      // check drag limit if it is an container or string for an element and use dimensions
      var limitType = this.options.limit != null ? Jx.type(this.options.limit) : false;
      if(this.options.limit && limitType != 'object') {
        var coords = false;
        switch(limitType) {
          case 'string':
            if(document.id(this.options.limit)) {
              coords = document.id(this.options.limit).getCoordinates();
            }
            break;
          case 'element':
          case 'document':
          case 'window':
            coords = this.options.limit.getCoordinates();
            break;
        }
        if(coords) {
          this.options.limitOrig = this.options.limit;
          this.options.limit = {
            x : [coords.left, coords.right],
            y : [coords.top, coords.bottom]
          }
        }else{
          this.options.limit = false;
        }
      }
      return this.options.limit;
    },

    /**
     * gets called by parent class Jx.Panel and decides whether to load content or not
     */
    shouldLoadContent: function() {
      return !this.options.loadOnDemand;
    }
});

/*
---

name: Jx.Splitter

description: A Jx.Splitter creates two or more containers within a parent container and provides user control over the size of the containers.

license: MIT-style license.

requires:
 - Jx.Layout

optional:
 - More/Drag

provides: [Jx.Splitter]

css:
 - splitter

...
 */
// $Id$
/**
 * Class: Jx.Splitter
 *
 * Extends: <Jx.Object>
 *
 * a Jx.Splitter creates two or more containers within a parent container
 * and provides user control over the size of the containers.  The split
 * can be made horizontally or vertically.
 *
 * A horizontal split creates containers that divide the space horizontally
 * with vertical bars between the containers.  A vertical split divides
 * the space vertically and creates horizontal bars between the containers.
 *
 * Example:
 * (code)
 * (end)
 * 
 * MooTools.lang Keys:
 * - splitter.barToolTip
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

Jx.Splitter = new Class({
    Family: 'Jx.Splitter',
    Extends: Jx.Object,
    /**
     * Property: domObj
     * {HTMLElement} the element being split
     */
    domObj: null,
    /**
     * Property: elements
     * {Array} an array of elements that are displayed in each of the split
     * areas
     */
    elements: null,
    /**
     * Property: bars
     * {Array} an array of the bars between each of the elements used to
     * resize the split areas.
     */
    bars: null,
    /**
     * Property: firstUpdate
     * {Boolean} track the first resize event so that unexposed Jx things
     * can be forced to calculate their size the first time they are exposed.
     */
    firstUpdate: true,
    options: {
        /* Option: useChildren
         * {Boolean} if set to true, then the children of the
         * element to be split are used as the elements.  The default value is
         * false.  If this is set, then the elements and splitInto options
         * are ignored.
         */
        useChildren: false,
        /* Option: splitInto
         * {Integer} the number of elements to split the domObj into.
         * If not set, then the length of the elements option is used, or 2 if
         * elements is not specified.  If splitInto is specified and elements
         * is specified, then splitInto is used.  If there are more elements than
         * splitInto specifies, then the extras are ignored.  If there are less
         * elements than splitInto specifies, then extras are created.
         */
        splitInto: 2,
        /* Option: elements
         * {Array} an array of elements to put into the split areas.
         * If splitInto is not set, then it is calculated from the length of
         * this array.
         */
        elements: null,
        /* Option: containerOptions
         * {Array} an array of objects that provide options
         *  for the <Jx.Layout> constraints on each element.
         */
        containerOptions: [],
        /* Option: barOptions
         * {Array} an array of object that provide options for the bars,
         * this array should be one less than the number of elements in the
         * splitter.  The barOptions objects can contain a snap property indicating
         * that a default snap object should be created in the bar and the value
         * of 'before' or 'after' indicates which element it snaps open/shut.
         */
        barOptions: [],
        /* Option: layout
         * {String} either 'horizontal' or 'vertical', indicating the
         * direction in which the domObj is to be split.
         */
        layout: 'horizontal',
        /* Option: snaps
         * {Array} an array of objects which can be used to snap
         * elements open or closed.
         */
        snaps: [],
        /* Option: onStart
         * an optional function to call when a bar starts dragging
         */
        onStart: null,
        /* Option: onFinish
         * an optional function to call when a bar finishes dragging
         */
        onFinish: null
    },

    parameters: ['domObj','options'],

    /**
     * APIMethod: init
     * Create a new instance of Jx.Splitter
     */
    init: function() {
        this.domObj = document.id(this.options.domObj);
        this.domObj.addClass('jxSplitContainer');
        var jxLayout = this.domObj.retrieve('jxLayout');
        if (jxLayout) {
            jxLayout.addEvent('sizeChange', this.sizeChanged.bind(this));
        }

        this.elements = [];
        this.bars = [];
        var i;
        var nSplits = 2;
        if (this.options.useChildren) {
            this.elements = this.domObj.getChildren();
            nSplits = this.elements.length;
        } else {
            nSplits = this.options.elements ?
                            this.options.elements.length :
                            this.options.splitInto;
            for (i=0; i<nSplits; i++) {
                var el;
                if (this.options.elements && this.options.elements[i]) {
                    if (this.options.elements[i].domObj) {
                        el = this.options.elements[i].domObj;
                    } else {
                        el = document.id(this.options.elements[i]);
                    }
                    if (!el) {
                        el = this.prepareElement();
                        el.id = this.options.elements[i];
                    }
                } else {
                    el = this.prepareElement();
                }
                this.elements[i] = el;
                this.domObj.adopt(this.elements[i]);
            }
        }
        this.elements.each(function(el) { el.addClass('jxSplitArea'); });
        for (i=0; i<nSplits; i++) {
            var jxl = this.elements[i].retrieve('jxLayout');
            if (!jxl) {
                new Jx.Layout(this.elements[i], this.options.containerOptions[i]);
            } else {
                if (this.options.containerOptions[i]) {
                    jxl.resize($merge(this.options.containerOptions[i],
                        {position:'absolute'}));
                } else {
                    jxl.resize({position: 'absolute'});
                }
            }
        }

        for (i=1; i<nSplits; i++) {
            var bar;
            if (this.options.prepareBar) {
                bar = this.options.prepareBar(i-1);
            } else {
                bar = this.prepareBar();
            }
            bar.store('splitterObj', this);
            bar.store('leftSide',this.elements[i-1]);
            bar.store('rightSide', this.elements[i]);
            this.elements[i-1].store('rightBar', bar);
            this.elements[i].store('leftBar', bar);
            this.domObj.adopt(bar);
            this.bars[i-1] = bar;
        }

        //making dragging dependent on mootools Drag class
        if ($defined(Drag)) {
            this.establishConstraints();
        }

        for (i=0; i<this.options.barOptions.length; i++) {
            if (!this.bars[i]) {
                continue;
            }
            var opt = this.options.barOptions[i];
            if (opt && opt.snap && (opt.snap == 'before' || opt.snap == 'after')) {
                var element;
                if (opt.snap == 'before') {
                    element = this.bars[i].retrieve('leftSide');
                } else if (opt.snap == 'after') {
                    element = this.bars[i].retrieve('rightSide');
                }
                var snap;
                var snapEvents;
                if (opt.snapElement) {
                    snap = opt.snapElement;
                    snapEvents = opt.snapEvents || ['click', 'dblclick'];
                } else {
                    snap = this.bars[i];
                    snapEvents = opt.snapEvents || ['dblclick'];
                }
                if (!snap.parentNode) {
                    this.bars[i].adopt(snap);
                }
                new Jx.Splitter.Snap(snap, element, this, snapEvents);
            }
        }

        for (i=0; i<this.options.snaps.length; i++) {
            if (this.options.snaps[i]) {
                new Jx.Splitter.Snap(this.options.snaps[i], this.elements[i], this);
            }
        }

        this.sizeChanged();
    },
    /**
     * Method: prepareElement
     * Prepare a new, empty element to go into a split area.
     *
     * Returns:
     * {HTMLElement} an HTMLElement that goes into a split area.
     */
    prepareElement: function(){
        var o = new Element('div', {styles:{position:'absolute'}});
        return o;
    },

    /**
     * Method: prepareBar
     * Prepare a new, empty bar to go into between split areas.
     *
     * Returns:
     * {HTMLElement} an HTMLElement that becomes a bar.
     */
    prepareBar: function() {
        var o = new Element('div', {
            'class': 'jxSplitBar'+this.options.layout.capitalize(),
            'title': this.getText({set:'Jx',key:'splitter',value:'barToolTip'})
        });
        return o;
    },

    /**
     * Method: establishConstraints
     * Setup the initial set of constraints that set the behaviour of the
     * bars between the elements in the split area.
     */
    establishConstraints: function() {
        var modifiers = {x:null,y:null};
        var fn;
        if (this.options.layout == 'horizontal') {
            modifiers.x = "left";
            fn = this.dragHorizontal;
        } else {
            modifiers.y = "top";
            fn = this.dragVertical;
        }
        if (typeof Drag != 'undefined') {
            this.bars.each(function(bar){
                var mask;
                new Drag(bar, {
                    //limit: limit,
                    modifiers: modifiers,
                    onSnap : (function(obj) {
                        obj.addClass('jxSplitBarDrag');
                        this.fireEvent('snap',[obj]);
                    }).bind(this),
                    onCancel: (function(obj){
                        mask.destroy();
                        this.fireEvent('cancel',[obj]);
                    }).bind(this),
                    onDrag: (function(obj, event){
                        this.fireEvent('drag',[obj,event]);
                    }).bind(this),
                    onComplete : (function(obj) {
                        mask.destroy();
                        obj.removeClass('jxSplitBarDrag');
                        if (obj.retrieve('splitterObj') != this) {
                            return;
                        }
                        fn.apply(this,[obj]);
                        this.fireEvent('complete',[obj]);
                        this.fireEvent('finish',[obj]);
                    }).bind(this),
                    onBeforeStart: (function(obj) {
                        this.fireEvent('beforeStart',[obj]);
                        mask = new Element('div',{'class':'jxSplitterMask'}).inject(obj, 'after');
                    }).bind(this),
                    onStart: (function(obj, event) {
                        this.fireEvent('start',[obj, event]);
                    }).bind(this)
                });
            }, this);
        }
    },

    /**
     * Method: dragHorizontal
     * In a horizontally split container, handle a bar being dragged left or
     * right by resizing the elements on either side of the bar.
     *
     * Parameters:
     * obj - {HTMLElement} the bar that was dragged
     */
    dragHorizontal: function(obj) {
        var leftEdge = parseInt(obj.style.left,10);
        var leftSide = obj.retrieve('leftSide');
        var rightSide = obj.retrieve('rightSide');
        var leftJxl = leftSide.retrieve('jxLayout');
        var rightJxl = rightSide.retrieve('jxLayout');

        var paddingLeft = this.domObj.measure(function(){
            var m = this.getSizes(['padding'], ['left']);
            return m.padding.left;
        });

        /* process right side first */
        var rsLeft, rsWidth, rsRight;

        var size = obj.retrieve('size');
        if (!size) {
            size = obj.getBorderBoxSize();
            obj.store('size',size);
        }
        rsLeft = leftEdge + size.width - paddingLeft;

        var parentSize = this.domObj.getContentBoxSize();

        if (rightJxl.options.width != null) {
            rsWidth = rightJxl.options.width + rightJxl.options.left - rsLeft;
            rsRight = parentSize.width - rsLeft - rsWidth;
        } else {
            rsWidth = parentSize.width - rightJxl.options.right - rsLeft;
            rsRight = rightJxl.options.right;
        }

        /* enforce constraints on right side */
        if (rsWidth < 0) {
            rsWidth = 0;
        }

        if (rsWidth < rightJxl.options.minWidth) {
            rsWidth = rightJxl.options.minWidth;
        }
        if (rightJxl.options.maxWidth >= 0 && rsWidth > rightJxl.options.maxWidth) {
            rsWidth = rightJxl.options.maxWidth;
        }

        rsLeft = parentSize.width - rsRight - rsWidth;
        leftEdge = rsLeft - size.width;

        /* process left side */
        var lsLeft, lsWidth;
        lsLeft = leftJxl.options.left;
        lsWidth = leftEdge - lsLeft;

        /* enforce constraints on left */
        if (lsWidth < 0) {
            lsWidth = 0;
        }
        if (lsWidth < leftJxl.options.minWidth) {
            lsWidth = leftJxl.options.minWidth;
        }
        if (leftJxl.options.maxWidth >= 0 &&
            lsWidth > leftJxl.options.maxWidth) {
            lsWidth = leftJxl.options.maxWidth;
        }

        /* update the leftEdge to accomodate constraints */
        if (lsLeft + lsWidth != leftEdge) {
            /* need to update right side, ignoring constraints because left side
               constraints take precedence (arbitrary decision)
             */
            leftEdge = lsLeft + lsWidth;
            var delta = leftEdge + size.width - rsLeft;
            rsLeft += delta;
            rsWidth -= delta;
        }

        /* put bar in its final location based on constraints */
        obj.style.left = paddingLeft + leftEdge + 'px';

        /* update leftSide positions */
        if (leftJxl.options.width == null) {
            parentSize = this.domObj.getContentBoxSize();
            leftSide.resize({right: parentSize.width - lsLeft-lsWidth});
        } else {
            leftSide.resize({width: lsWidth});
        }

        /* update rightSide position */
        if (rightJxl.options.width == null) {
            rightSide.resize({left:rsLeft});
        } else {
            rightSide.resize({left: rsLeft, width: rsWidth});
        }
    },

    /**
     * Method: dragVertical
     * In a vertically split container, handle a bar being dragged up or
     * down by resizing the elements on either side of the bar.
     *
     * Parameters:
     * obj - {HTMLElement} the bar that was dragged
     */
    dragVertical: function(obj) {
        /* top edge of the bar */
        var topEdge = parseInt(obj.style.top,10);

        /* the containers on either side of the bar */
        var topSide = obj.retrieve('leftSide');
        var bottomSide = obj.retrieve('rightSide');
        var topJxl = topSide.retrieve('jxLayout');
        var bottomJxl = bottomSide.retrieve('jxLayout');

        var paddingTop = this.domObj.measure(function(){
            var m = this.getSizes(['padding'], ['top']);
            return m.padding.top;
        });


        /* measure the bar and parent container for later use */
        var size = obj.retrieve('size');
        if (!size) {
            size = obj.getBorderBoxSize();
            obj.store('size', size);
        }
        var parentSize = this.domObj.getContentBoxSize();

        /* process top side first */
        var bsTop, bsHeight, bsBottom;

        /* top edge of bottom side is the top edge of bar plus the height of the bar */
        bsTop = topEdge + size.height - paddingTop;

        if (bottomJxl.options.height != null) {
            /* bottom side height is fixed */
            bsHeight = bottomJxl.options.height + bottomJxl.options.top - bsTop;
            bsBottom = parentSize.height - bsTop - bsHeight;
        } else {
            /* bottom side height is not fixed. */
            bsHeight = parentSize.height - bottomJxl.options.bottom - bsTop;
            bsBottom = bottomJxl.options.bottom;
        }

        /* enforce constraints on bottom side */
        if (bsHeight < 0) {
            bsHeight = 0;
        }

        if (bsHeight < bottomJxl.options.minHeight) {
            bsHeight = bottomJxl.options.minHeight;
        }

        if (bottomJxl.options.maxHeight >= 0 && bsHeight > bottomJxl.options.maxHeight) {
            bsHeight = bottomJxl.options.maxHeight;
        }

        /* recalculate the top of the bottom side in case it changed
           due to a constraint.  The bar may have moved also.
         */
        bsTop = parentSize.height - bsBottom - bsHeight;
        topEdge = bsTop - size.height;

        /* process left side */
        var tsTop, tsHeight;
        tsTop = topJxl.options.top;
        tsHeight = topEdge - tsTop;

        /* enforce constraints on left */
        if (tsHeight < 0) {
            tsHeight = 0;
        }
        if (tsHeight < topJxl.options.minHeight) {
            tsHeight = topJxl.options.minHeight;
        }
        if (topJxl.options.maxHeight >= 0 &&
            tsHeight > topJxl.options.maxHeight) {
            tsHeight = topJxl.options.maxHeight;
        }

        /* update the topEdge to accomodate constraints */
        if (tsTop + tsHeight != topEdge) {
            /* need to update right side, ignoring constraints because left side
               constraints take precedence (arbitrary decision)
             */
            topEdge = tsTop + tsHeight;
            var delta = topEdge + size.height - bsTop;
            bsTop += delta;
            bsHeight -= delta;
        }

        /* put bar in its final location based on constraints */
        obj.style.top = paddingTop + topEdge + 'px';

        /* update topSide positions */
        if (topJxl.options.height == null) {
            topSide.resize({bottom: parentSize.height - tsTop-tsHeight});
        } else {
            topSide.resize({height: tsHeight});
        }

        /* update bottomSide position */
        if (bottomJxl.options.height == null) {
            bottomSide.resize({top:bsTop});
        } else {
            bottomSide.resize({top: bsTop, height: bsHeight});
        }
    },

    /**
     * Method: sizeChanged
     * handle the size of the container being changed.
     */
    sizeChanged: function() {
        if (this.options.layout == 'horizontal') {
            this.horizontalResize();
        } else {
            this.verticalResize();
        }
    },

    /**
     * Method: horizontalResize
     * Resize a horizontally layed-out container
     */
    horizontalResize: function() {
        var availableSpace = this.domObj.getContentBoxSize().width;
        var overallWidth = availableSpace;
        var i,e,jxo;
        for (i=0; i<this.bars.length; i++) {
            var bar = this.bars[i];
            var size = bar.retrieve('size');
            if (!size || size.width == 0) {
                size = bar.getBorderBoxSize();
                bar.store('size',size);
            }
            availableSpace -= size.width;
        }

        var nVariable = 0, w = 0;
        for (i=0; i<this.elements.length; i++) {
            e = this.elements[i];
            jxo = e.retrieve('jxLayout').options;
            if (jxo.width != null) {
                availableSpace -= parseInt(jxo.width,10);
            } else {
                w = 0;
                if (jxo.right != 0 ||
                    jxo.left != 0) {
                    w = e.getBorderBoxSize().width;
                }

                availableSpace -= w;
                nVariable++;
            }
        }

        if (nVariable == 0) { /* all fixed */
            /* stick all available space in the last one */
            availableSpace += jxo.width;
            jxo.width = null;
            nVariable = 1;
        }

        var amount = parseInt(availableSpace / nVariable,10);
        /* account for rounding errors */
        var remainder = availableSpace % nVariable;

        var leftPadding = this.domObj.measure(function(){
            var m = this.getSizes(['padding'], ['left']);
            return m.padding.left;
        });

        var currentPosition = 0;

        for (i=0; i<this.elements.length; i++) {
             e = this.elements[i];
             var jxl = e.retrieve('jxLayout');
             jxo = jxl.options;
             if (jxo.width != null) {
                 jxl.resize({left: currentPosition});
                 currentPosition += jxo.width;
             } else {
                 var a = amount;
                 if (nVariable == 1) {
                     a += remainder;
                 }
                 nVariable--;

                 if (jxo.right != 0 || jxo.left != 0) {
                     w = e.getBorderBoxSize().width + a;
                 } else {
                     w = a;
                 }

                 if (w < 0) {
                     if (nVariable > 0) {
                         amount = amount + w/nVariable;
                     }
                     w = 0;
                 }
                 if (w < jxo.minWidth) {
                     if (nVariable > 0) {
                         amount = amount + (w - jxo.minWidth)/nVariable;
                     }
                     w = jxo.minWidth;
                 }
                 if (jxo.maxWidth >= 0 && w > jxo.maxWidth) {
                     if (nVariable > 0) {
                         amount = amount + (w - jxo.maxWidth)/nVariable;
                     }
                     w = e.options.maxWidth;
                 }

                 var r = overallWidth - currentPosition - w;
                 jxl.resize({left: currentPosition, right: r});
                 currentPosition += w;
             }
             var rightBar = e.retrieve('rightBar');
             if (rightBar) {
                 rightBar.setStyle('left', leftPadding + currentPosition);
                 currentPosition += rightBar.retrieve('size').width;
             }
         }
    },

    /**
     * Method: verticalResize
     * Resize a vertically layed out container.
     */
    verticalResize: function() {
        var availableSpace = this.domObj.getContentBoxSize().height;
        var overallHeight = availableSpace;
        var i,e,jxo;
        for (i=0; i<this.bars.length; i++) {
            var bar = this.bars[i];
            var size = bar.retrieve('size');
            if (!size || size.height == 0) {
                size = bar.getBorderBoxSize();
                bar.store('size', size);
            }
            availableSpace -= size.height;
        }

        var nVariable = 0, h=0;
        for (i=0; i<this.elements.length; i++) {
            e = this.elements[i];
            jxo = e.retrieve('jxLayout').options;
            if (jxo.height != null) {
                availableSpace -= parseInt(jxo.height,10);
            } else {
                if (jxo.bottom != 0 || jxo.top != 0) {
                    h = e.getBorderBoxSize().height;
                }

                availableSpace -= h;
                nVariable++;
            }
        }

        if (nVariable == 0) { /* all fixed */
            /* stick all available space in the last one */
            availableSpace += jxo.height;
            jxo.height = null;
            nVariable = 1;
        }

        var amount = parseInt(availableSpace / nVariable,10);
        /* account for rounding errors */
        var remainder = availableSpace % nVariable;

        var paddingTop = this.domObj.measure(function(){
            var m = this.getSizes(['padding'], ['top']);
            return m.padding.top;
        });

        var currentPosition = 0;

        for (i=0; i<this.elements.length; i++) {
             e = this.elements[i];
             var jxl = e.retrieve('jxLayout');
             jxo = jxl.options;
             if (jxo.height != null) {
                 jxl.resize({top: currentPosition});
                 currentPosition += jxo.height;
             } else {
                 var a = amount;
                 if (nVariable == 1) {
                     a += remainder;
                 }
                 nVariable--;

                 h = 0;
                 if (jxo.bottom != 0 || jxo.top != 0) {
                     h = e.getBorderBoxSize().height + a;
                 } else {
                     h = a;
                 }

                 if (h < 0) {
                     if (nVariable > 0) {
                         amount = amount + h/nVariable;
                     }
                     h = 0;
                 }
                 if (h < jxo.minHeight) {
                     if (nVariable > 0) {
                         amount = amount + (h - jxo.minHeight)/nVariable;
                     }
                     h = jxo.minHeight;
                 }
                 if (jxo.maxHeight >= 0 && h > jxo.maxHeight) {
                     if (nVariable > 0) {
                         amount = amount + (h - jxo.maxHeight)/nVariable;
                     }
                     h = jxo.maxHeight;
                 }

                 var r = overallHeight - currentPosition - h;
                 jxl.resize({top: currentPosition, bottom: r});
                 currentPosition += h;
             }
             var rightBar = e.retrieve('rightBar');
             if (rightBar) {
                 rightBar.style.top = paddingTop + currentPosition + 'px';
                 currentPosition += rightBar.retrieve('size').height;
             }
         }
    },
    
    changeText: function (lang) {
    	this.parent();
    	this.bars.each(function(bar){
    		document.id(bar).set('title', this.getText({set:'Jx',key:'splitter',value:'barToolTip'}));
    	},this);	
    }
});/*
---

name: Jx.PanelSet

description: A panel set manages a set of panels within a DOM element.

license: MIT-style license.

requires:
 - Jx.Splitter
 - Jx.Panel

provides: [Jx.PanelSet]

...
 */
// $Id$
/**
 * Class: Jx.PanelSet
 *
 * Extends: <Jx.Widget>
 *
 * A panel set manages a set of panels within a DOM element.  The PanelSet
 * fills its container by resizing the panels in the set to fill the width and
 * then distributing the height of the container across all the panels. 
 * Panels can be resized by dragging their respective title bars to make them
 * taller or shorter.  The maximize button on the panel title will cause all
 * other panels to be closed and the target panel to be expanded to fill the
 * remaining space.  In this respect, PanelSet works like a traditional
 * Accordion control.
 *
 * When creating panels for use within a panel set, it is important to use the
 * proper options.  You must override the collapse option and set it to false
 * and add a maximize option set to true.  You must also not include options
 * for menu and close.
 *
 * Example:
 * (code)
 * var p1 = new Jx.Panel({collapse: false, maximize: true, content: 'c1'});
 * var p2 = new Jx.Panel({collapse: false, maximize: true, content: 'c2'});
 * var p3 = new Jx.Panel({collapse: false, maximize: true, content: 'c3'});
 * var panelSet = new Jx.PanelSet('panels', [p1,p2,p3]);
 * (end)
 * 
 * MooTools.lang Keys:
 * - panelset.barTooltip
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.PanelSet = new Class({
    Family: 'Jx.PanelSet',
    Extends: Jx.Widget,

    options: {
        /* Option: parent
         * the object to add the panel set to
         */
        parent: null,
        /* Option: panels
         * an array of <Jx.Panel> objects that will be managed by the set.
         */
        panels: []
    },

    /**
     * Property: panels
     * {Array} the panels being managed by the set
     */
    panels: null,
    /**
     * Property: height
     * {Integer} the height of the container, cached for speed
     */
    height: null,
    /**
     * Property: firstLayout
     * {Boolean} true until the panel set has first been resized
     */
    firstLayout: true,
    /**
     * APIMethod: render
     * Create a new instance of Jx.PanelSet.
     */
    render: function() {
        if (this.options.panels) {
            this.panels = this.options.panels;
            this.options.panels = null;
        }
        this.domObj = new Element('div');
        new Jx.Layout(this.domObj);

        //make a fake panel so we get the right number of splitters
        var d = new Element('div', {styles:{position:'absolute'}});
        new Jx.Layout(d, {minHeight:0,maxHeight:0,height:0});
        var elements = [d];
        this.panels.each(function(panel){
            elements.push(panel.domObj);
            panel.options.hideTitle = true;
            panel.contentContainer.resize({top:0});
            panel.toggleCollapse = this.maximizePanel.bind(this,panel);
            panel.domObj.store('Jx.Panel', panel);
            panel.manager = this;
        }, this);

        this.splitter = new Jx.Splitter(this.domObj, {
            splitInto: this.panels.length+1,
            layout: 'vertical',
            elements: elements,
            prepareBar: (function(i) {
                var bar = new Element('div', {
                    'class': 'jxPanelBar',
                    'title': this.getText({set:'Jx',key:'panelset',value:'barToolTip'})
                });

                var panel = this.panels[i];
                panel.title.setStyle('visibility', 'hidden');
                document.id(document.body).adopt(panel.title);
                var size = panel.title.getBorderBoxSize();
                bar.adopt(panel.title);
                panel.title.setStyle('visibility','');

                bar.setStyle('height', size.height);
                bar.store('size', size);

                return bar;
            }).bind(this)
        });
        this.addEvent('addTo', function() {
            document.id(this.domObj.parentNode).setStyle('overflow', 'hidden');
            this.domObj.resize();
        });
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },

    /**
     * Method: maximizePanel
     * Maximize a panel, taking up all available space (taking into
     * consideration any minimum or maximum values)
     */
    maximizePanel: function(panel) {
        var domHeight = this.domObj.getContentBoxSize().height;
        var space = domHeight;
        var panelSize = panel.domObj.retrieve('jxLayout').options.maxHeight;
        var panelIndex,i,p,thePanel,o,panelHeight;
        /* calculate how much space might be left after setting all the panels to
         * their minimum height (except the one we are resizing of course)
         */
        for (i=1; i<this.splitter.elements.length; i++) {
            p = this.splitter.elements[i];
            space -= p.retrieve('leftBar').getBorderBoxSize().height;
            if (p !== panel.domObj) {
                thePanel = p.retrieve('Jx.Panel');
                o = p.retrieve('jxLayout').options;
                space -= o.minHeight;
            } else {
                panelIndex = i;
            }
        }

        // calculate how much space the panel will take and what will be left over
        if (panelSize == -1 || panelSize >= space) {
            panelSize = space;
            space = 0;
        } else {
            space = space - panelSize;
        }
        var top = 0;
        for (i=1; i<this.splitter.elements.length; i++) {
            p = this.splitter.elements[i];
            top += p.retrieve('leftBar').getBorderBoxSize().height;
            if (p !== panel.domObj) {
                thePanel = p.retrieve('Jx.Panel');
                o = p.retrieve('jxLayout').options;
                panelHeight = $chk(o.height) ? o.height : p.getBorderBoxSize().height;
                if (space > 0) {
                    if (space >= panelHeight) {
                        // this panel can stay open at its current height
                        space -= panelHeight;
                        p.resize({top: top, height: panelHeight});
                        top += panelHeight;
                    } else {
                        // this panel needs to shrink some
                        if (space > o.minHeight) {
                            // it can use all the space
                            p.resize({top: top, height: space});
                            top += space;
                            space = 0;
                        } else {
                            p.resize({top: top, height: o.minHeight});
                            top += o.minHeight;
                        }
                    }
                } else {
                    // no more space, just shrink away
                    p.resize({top:top, height: o.minHeight});
                    top += o.minHeight;
                }
                p.retrieve('rightBar').style.top = top + 'px';
            } else {
                break;
            }
        }

        /* now work from the bottom up */
        var bottom = domHeight;
        for (i=this.splitter.elements.length - 1; i > 0; i--) {
            p = this.splitter.elements[i];
            if (p !== panel.domObj) {
                o = p.retrieve('jxLayout').options;
                panelHeight = $chk(o.height) ? o.height : p.getBorderBoxSize().height;
                if (space > 0) {
                    if (space >= panelHeight) {
                        // panel can stay open
                        bottom -= panelHeight;
                        space -= panelHeight;
                        p.resize({top: bottom, height: panelHeight});
                    } else {
                        if (space > o.minHeight) {
                            bottom -= space;
                            p.resize({top: bottom, height: space});
                            space = 0;
                        } else {
                            bottom -= o.minHeight;
                            p.resize({top: bottom, height: o.minHeight});
                        }
                    }
                } else {
                    bottom -= o.minHeight;
                    p.resize({top: bottom, height: o.minHeight, bottom: null});
                }
                bottom -= p.retrieve('leftBar').getBorderBoxSize().height;
                p.retrieve('leftBar').style.top = bottom + 'px';

            } else {
                break;
            }
        }
        panel.domObj.resize({top: top, height:panelSize, bottom: null});
        this.fireEvent('panelMaximize',panel);
    },
    
    createText: function (lang) {
      this.parent();
      //barTooltip is handled by the splitter's createText() function
    }
});/*
---

name: Jx.Dialog.Message

description: A subclass of jx.Dialog for displaying messages w/a single OK button.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item

provides: [Jx.Dialog.Message]

css:
 - message

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Message
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Message is an extension of Jx.Dialog that allows the developer
 * to display a message to the user. It only presents an OK button.
 * 
 * MooTools.lang Keys:
 * - message.okButton
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Message = new Class({
    Family: 'Jx.Dialog.Message',
    Extends: Jx.Dialog,
    Binds: ['onOk'],
    options: {
        /**
         * Option: message
         * The message to display to the user
         */
        message: '',
        /**
         * Option: width
         * default width of message dialogs is 300px
         */
        width: 300,
        /**
         * Option: height
         * default height of message dialogs is 150px
         */
        height: 150,
        /**
         * Option: close
         * by default, message dialogs are closable
         */
        close: true,
        /**
         * Option: resize
         * by default, message dialogs are resizable
         */
        resize: true,
        /**
         * Option: collapse
         * by default, message dialogs are not collapsible
         */
        collapse: false,
        useKeyboard : true,
        keys : {
          'enter' : 'ok'
        }
    },
    /**
     * Method: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll:false});
        this.ok = new Jx.Button({
            label: this.getText({set:'Jx',key:'message',value:'okButton'}),
            onClick: this.onOk
        });
        this.buttons.add(this.ok);
        this.options.toolbars = [this.buttons];
        var type = Jx.type(this.options.message);
        if (type === 'string' || type == 'object' || type == 'element') {
            this.question = new Element('div', {
                'class': 'jxMessage'
            });
            switch(type) {
              case 'string':
              case 'object':
                this.question.set('html', this.getText(this.options.message));
              break;
              case 'element':
                this.options.message.inject(this.question);
                break;
            }
        } else {
            this.question = this.options.question;
            document.id(this.question).addClass('jxMessage');
        }
        this.options.content = this.question;
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.ok = function(ev) { ev.preventDefault(); self.close(); }
        }
        this.parent();
        if(this.options.useKeyboard) {
          this.keyboard.addEvents(this.getKeyboardEvents());
        }
    },
    /**
     * Method: onOk
     * Called when the OK button is clicked. Closes the dialog.
     */
    onOk: function () {
        this.close();
    },
    
    /**
     * APIMethod: setMessage
     * set the message of the dialog, useful for responding to language
     * changes on the fly.
     *
     * Parameters
     * message - {String} the new message
     */
    setMessage: function(message) {
      this.options.message = message;
      if ($defined(this.question)) {
        this.question.set('html',this.getText(message));
      }
    },
    
    /**
     * Method: createText
     * handle change in language
     */
    changeText: function (lang) {
      this.parent();
      if ($defined(this.ok)) {
        this.ok.setLabel({set:'Jx',key:'message',value:'okButton'});
      }
      if(Jx.type(this.options.message) === 'object') {
        this.question.set('html', this.getText(this.options.message))
      }
    }
});
/*
---

name: Jx.Dialog.Confirm

description: A subclass of Jx.dialog for asking a yes/no type question of the user.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item

provides: [Jx.Dialog.Confirm]

css:
 - confirm

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Confirm
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Confirm is an extension of Jx.Dialog that allows the developer
 * to prompt their user with e yes/no question.
 * 
 * MooTools.lang Keys:
 * - confirm.affirmitiveLabel
 * - confirm.negativeLabel
 * 
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Confirm = new Class({

    Extends: Jx.Dialog,

    options: {
        /**
         * Option: question
         * The question to ask the user
         */
        question: '',
        /**
         * Jx.Dialog option defaults
         */
        useKeyboard : true,
        keys : {
          'esc'   : 'cancel',
          'enter' : 'ok'
        },
        width: 300,
        height: 150,
        close: false,
        resize: true,
        collapse: false
    },
    /**
     * Reference to MooTools keyboards Class for handling keypress events like Enter or ESC
     */
    keyboard : null,
    /**
     * APIMethod: render
     * creates the dialog
     */
    render: function () {
        //create content to be added
        //turn scrolling off as confirm only has 2 buttons.
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll: false});

        // COMMENT: returning boolean would be more what people expect instead of a localized label of a button?
        this.ok = new Jx.Button({
            label: this.getText({set:'Jx',key:'confirm',value:'affirmativeLabel'}),
            onClick: this.onClick.bind(this, true)
        }),
        this.cancel = new Jx.Button({
            label: this.getText({set:'Jx',key:'confirm',value:'negativeLabel'}),
            onClick: this.onClick.bind(this, false)
        })
        this.buttons.add(this.ok, this.cancel);
        this.options.toolbars = [this.buttons];
        var type = Jx.type(this.options.question);
        if (type === 'string' || type === 'object' || type == 'element'){
            this.question = new Element('div', {
                'class': 'jxConfirmQuestion'
            });
            switch(type) {
              case 'string':
              case 'object':
                this.question.set('html', this.getText(this.options.question));
              break;
              case 'element':
                this.options.question.inject(this.question);
                break;
            }
        } else {
            this.question = this.options.question;
            document.id(this.question).addClass('jxConfirmQuestion');
        }
        this.options.content = this.question;

        // add default key functions
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.ok     = function(ev) { ev.preventDefault(); self.onClick(true); }
          this.options.keyboardMethods.cancel = function(ev) { ev.preventDefault(); self.onClick(false); }
        }
        this.parent();
        // add new ones
        if(this.options.useKeyboard) {
          this.keyboard.addEvents(this.getKeyboardEvents());
        }
    },
    /**
     * Method: onClick
     * called when any button is clicked. It hides the dialog and fires
     * the close event passing it the value of the button that was pressed.
     */
    onClick: function (value) {
        this.isOpening = false;
        this.hide();
        this.fireEvent('close', [this, value]);
    },
    
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.ok)) {
    		this.ok.setLabel({set:'Jx',key:'confirm',value:'affirmativeLabel'});
    	}
    	if ($defined(this.cancel)) {
    		this.cancel.setLabel({set:'Jx',key:'confirm',value:'negativeLabel'});
    	}
      if(Jx.type(this.options.question) === 'object') {
        this.question.set('html', this.getText(this.options.question))
      }
    }

});/*
---

name: Jx.Tooltip

description: These are very simple tooltips that are designed to be instantiated in javascript and directly attached to the object that they are the tip for.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Tooltip]

css:
 - tooltip

...
 */
// $Id$
/**
 * Class: Jx.Tooltip
 *
 * Extends: <Jx.Widget>
 *
 * An implementation of tooltips. These are very simple tooltips that are
 * designed to be instantiated in javascript and directly attached to the
 * object that they are the tip for. We can only have one Tip per element so
 * we use element storage to store the tip object and check for it's presence
 * before creating a new tip. If one is there we remove it and create this new
 * one.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tooltip = new Class({
    Family: 'Jx.Widget',
    Extends : Jx.Widget,
    Binds: ['enter', 'leave', 'move'],
    options : {
        /**
         * Option: offsets
         * An object with x and y components for where to put the tip related
         * to the mouse cursor.
         */
        offsets : {
            x : 15,
            y : 15
        },
        /**
         * Option: showDelay
         * The amount of time to delay before showing the tip. This ensures we
         * don't show a tip if we're just passing over an element quickly.
         */
        showDelay : 100,
        /**
         * Option: cssClass
         * a class to be added to the tip's container. This can be used to
         * style the tip.
         */
        cssClass : null
    },

    /**
     * Parameters:
     * target - The DOM element that triggers the toltip when moused over.
     * tip - The contents of the tip itself. This can be either a string or
     *       an Element.
     * options - <Jx.Tooltip.Options> and <Jx.Widget.Options>
     */
    parameters: ['target','tip','options'],

    /**
     * Method: render
     * Creates the tooltip
     *
     */
    render : function () {
        this.parent();
        this.target = document.id(this.options.target);

        var t = this.target.retrieve('Tip');
        if (t) {
            this.target.eliminate('Tip');
        }

        //set up the tip options
        this.domObj = new Element('div', {
            styles : {
                'position' : 'absolute',
                'top' : 0,
                'left' : 0,
                'visibility' : 'hidden'
            }
        }).inject(document.body);

        if (Jx.type(this.options.tip) === 'string' || Jx.type(this.options.tip) == 'object') {
            this.domObj.set('html', this.getText(this.options.tip));
        } else {
            this.domObj.grab(this.options.tip);
        }

        this.domObj.addClass('jxTooltip');
        if ($defined(this.options.cssClass)) {
            this.domObj.addClass(this.options.cssClass);
        }

        this.options.target.store('Tip', this);

        //add events
        this.options.target.addEvent('mouseenter', this.enter);
        this.options.target.addEvent('mouseleave', this.leave);
        this.options.target.addEvent('mousemove', this.move);
    },

    /**
     * Method: enter
     * Method run when the cursor passes over an element with a tip
     *
     * Parameters:
     * event - the event object
     */
    enter : function (event) {
        this.timer = $clear(this.timer);
        this.timer = (function () {
            this.domObj.setStyle('visibility', 'visible');
            this.position(event);
        }).delay(this.options.delay, this);
    },
    /**
     * Method: leave
     * Executed when the mouse moves out of an element with a tip
     *
     * Parameters:
     * event - the event object
     */
    leave : function (event) {
        this.timer = $clear(this.timer);
        this.timer = (function () {
            this.domObj.setStyle('visibility', 'hidden');
        }).delay(this.options.delay, this);
    },
    /**
     * Method: move
     * Called when the mouse moves over an element with a tip.
     *
     * Parameters:
     * event - the event object
     */
    move : function (event) {
        this.position(event);
    },
    /**
     * Method: position
     * Called to position the tooltip.
     *
     * Parameters:
     * event - the event object
     */
    position : function (event) {
        var size = window.getSize(), scroll = window.getScroll();
        var tipSize = this.domObj.getMarginBoxSize();
        var tip = {
            x : this.domObj.offsetWidth,
            y : this.domObj.offsetHeight
        };
        var tipPlacement = {
            x: event.page.x + this.options.offsets.x,
            y: event.page.y + this.options.offsets.y
        };

        if (event.page.y + this.options.offsets.y + tip.y + tipSize.height - scroll.y > size.y) {
            tipPlacement.y = event.page.y - this.options.offsets.y - tipSize.height - scroll.y;
        }

        if (event.page.x + this.options.offsets.x + tip.x + tipSize.width - scroll.x > size.x) {
            tipPlacement.x = event.page.x - this.options.offsets.x - tipSize.width - scroll.x;
        }

        this.domObj.setStyle('top', tipPlacement.y);
        this.domObj.setStyle('left', tipPlacement.x);
    },
    /**
     * APIMethod: detach
     * Called to manually remove a tooltip.
     */
    detach : function () {
        this.target.eliminate('Tip');
        this.destroy();
    }
});
/*
---

name: Jx.Fieldset

description: Used to create fieldsets in Forms

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Fieldset]

...
 */
// $Id$
/**
 * Class: Jx.Fieldset
 *
 * Extends: <Jx.Widget>
 *
 * This class represents a fieldset. It can be used to group fields together.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 *
 */
Jx.Fieldset = new Class({
    Family: 'Jx.Fieldset',
    Extends : Jx.Widget,

    options : {
        /**
         * Option: legend
         * The text for the legend of a fieldset. Default is null
         * or no legend.
         */
        legend : null,
        /**
         * Option: id
         * The id to assign to this element
         */
        id : null,
        /**
         * Option: fieldsetClass
         * A CSS class to assign to the fieldset. Useful for custom styling of
         * the element
         */
        fieldsetClass : null,
        /**
         * Option: legendClass
         * A CSS class to assign to the legend. Useful for custom styling of
         * the element
         */
        legendClass : null,
        /**
         * Option: template
         * a template for how this element should be rendered
         */
        template : '<fieldset class="jxFieldset"><legend><span class="jxFieldsetLegend"></span></legend></fieldset>',
        /**
         * Option: form
         * The <Jx.Form> that this fieldset should be added to
         */
        form : null
    },

    classes: new Hash({
        domObj: 'jxFieldset',
        legend: 'jxFieldsetLegend'
    }),

    /**
     * Property: legend
     * a holder for the legend Element
     */
    legend : null,

    /**
     * APIMethod: render
     * Creates a fieldset.
     */
    render : function () {
        this.parent();

        this.id = this.options.id;

        if ($defined(this.options.form)
                && this.options.form instanceof Jx.Form) {
            this.form = this.options.form;
        }

        //FIELDSET
        if (this.domObj) {
            if ($defined(this.options.id)) {
                this.domObj.set('id', this.options.id);
            }
            if ($defined(this.options.fieldsetClass)) {
                this.domObj.addClass(this.options.fieldsetClass);
            }
        }

        if (this.legend) {
            if ($defined(this.options.legend)) {
                this.legend.set('html', this.getText(this.options.legend));
                if ($defined(this.options.legendClass)) {
                    this.legend.addClass(this.options.legendClass);
                }
            } else {
                this.legend.destroy();
            }
        }
    },
    /**
     * APIMethod: add
     * Adds fields to this fieldset
     *
     * Parameters:
     * pass as many fields to this method as you like. They should be
     * <Jx.Field> objects
     */
    add : function () {
        var field;
        for (var x = 0; x < arguments.length; x++) {
            field = arguments[x];
            //add form to the field and field to the form if not already there
            if ($defined(field.jxFamily) && !$defined(field.form) && $defined(this.form)) {
                field.form = this.form;
                this.form.addField(field);
            }
            this.domObj.grab(field);
        }
        return this;
    },
    
    /**
     * APIMethod: addTo
     *
     */
    addTo: function(what) {
        if (what instanceof Jx.Form) {
            this.form = what;
        } else if (what instanceof Jx.Fieldset) {
            this.form = what.form;
        }
        return this.parent(what);
    }
    
});
/*
---

name: Jx.Form

description: Represents a HTML Form

license: MIT-style license.

requires:
 - Jx.Widget
 - More/String.QueryString
 - More/Form.Validator

provides: [Jx.Form]

css:
 - form
 
images:
 - emblems.png

...
 */
// $Id$
/**
 * Class: Jx.Form
 *
 * Extends: <Jx.Widget>
 *
 * A class that represents an HTML form. You add fields using either
 * Jx.Form.add() or by using the field's .addTo() method. You can get all form
 * values or set them using this class. It also handles validation of fields
 * through the use of a plugin (Jx.Plugin.Form.Validator).
 *
 * Jx.Form has the ability to submit itself via normal HTTP submit as well as
 * via AJAX. To submit normally you simply call the submit() function. To submit by
 * AJAX, call ajaxSubmit().  If the form contains Jx.Field.File instances it will
 * either submit all of the files individually and then the data, or it will submit
 * data with the last File instance it finds. This behavior is dependant on the
 * uploadFilesFirst option (which defaults to false).
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Form = new Class({
    Family: 'Jx.Form',
    Extends: Jx.Widget,

    options: {
        /**
         * Option: method
         * the method used to submit the form
         */
        method: 'post',
        /**
         * Option: action
         * where to submit it to
         */
        action: '',
        /**
         * Option: fileUpload
         * whether this form handles file uploads or not.
         */
        fileUpload: false,
        /**
         * Option: formClass
         */
        formClass: null,
        /**
         * Option: name
         * the name property for the form
         */
        name: '',
        /**
         * Option: acceptCharset
         * the character encoding to be used. Defaults to utf-8.
         */
        acceptCharset: 'utf-8',
        /**
         * Option: uploadFilesFirst
         * Whether to upload all of the files in the form before
         * uploading the rest of the form. If set to false the form will
         * upload the data with the last file that it finds,
         */
        uploadFilesFirst: false,

        template: '<form class="jxForm"></form>'
    },
    
    /**
     * Property: defaultAction
     * the default field to activate if the user hits the enter key in this
     * form.  Set by specifying default: true as an option to a field.  Will
     * only work if the default is a Jx button field or an input of a type
     * that is a button
     */
    defaultAction: null,

    /**
     * Property: fields
     * An array of all of the single fields (not contained in a fieldset) for
     * this form
     */
    fields : null,
    /**
     * Property: pluginNamespace
     * required variable for plugins
     */
    pluginNamespace: 'Form',

    classes: $H({
        domObj: 'jxForm'
    }),
    
    init: function() {
      this.parent();
      this.fields = new Hash();
      this.data = {};
    },
    /**
     * APIMethod: render
     * Constructs the form but does not add it to anything to be shown. The
     * caller should use form.addTo() to add the form to the DOM.
     */
    render : function () {
        this.parent();
        //create the form first
        this.domObj.set({
            'method' : this.options.method,
            'action' : this.options.action,
            'name' : this.options.name,
            'accept-charset': this.options.acceptCharset,
            events: {
                keypress: function(e) {
                    if (e.key == 'enter' && 
                        e.target.tagName != "TEXTAREA" && 
                        this.defaultAction &&
                        this.defaultAction.click) {
                        document.id(this.defaultAction).focus();
                        this.defaultAction.click();
                        e.stop();
                    }
                }.bind(this)
            }
        });

        if (this.options.fileUpload) {
            this.domObj.set('enctype', 'multipart/form-data');
        }
        
        if ($defined(this.options.formClass)) {
            this.domObj.addClass(this.options.formClass);
        }
    },

    /**
     * APIMethod: addField
     * Adds a <Jx.Field> subclass to this form's fields hash
     *
     * Parameters:
     * field - <Jx.Field> to add
     */
    addField : function (field) {
        this.fields.set(field.id, field);
        if (field.options.defaultAction) {
            this.defaultAction = field;
        }
    },

    /**
     * Method: isValid
     * Determines if the form passes validation
     *
     * Parameters:
     * evt - the MooTools event object
     */
    isValid : function (evt) {
        return true;
    },

    /**
     * APIMethod: getValues
     * Gets the values of all the fields in the form as a Hash object. This
     * uses the mootools function Element.toQueryString to get the values and
     * will either return the values as a querystring or as an object (using
     * mootools-more's String.parseQueryString method).
     *
     * Parameters:
     * asQueryString - {boolean} indicates whether to return the value as a
     *                  query string or an object.
     */
    getValues : function (asQueryString) {
        var queryString = this.domObj.toQueryString();
        if ($defined(asQueryString) && asQueryString) {
            return queryString;
        } else {
            return queryString.parseQueryString();
        }
    },
    /**
     * APIMethod: setValues
     * Used to set values on the form
     *
     * Parameters:
     * values - A Hash of values to set keyed by field name.
     */
    setValues : function (values) {
        if (Jx.type(values) === 'object') {
            values = new Hash(values);
        }
        this.fields.each(function (item) {
            item.setValue(values.get(item.name));
        }, this);
    },

    /**
     * APIMethod: add
     *
     * Parameters:
     * Pass as many parameters as you like. However, they should all be
     * <Jx.Field> objects.
     */
    add : function () {
        var field;
        for (var x = 0; x < arguments.length; x++) {
            field = arguments[x];
            //add form to the field and field to the form if not already there
            if (field instanceof Jx.Field && !$defined(field.form)) {
                field.form = this;
                this.addField(field);
            } else if (field instanceof Jx.Fieldset && !$defined(field.form)) {
                field.form = this;
            }
            
            this.domObj.grab(field);
        }
        return this;
    },

    /**
     * APIMethod: reset
     * Resets all fields back to their original value
     */
    reset : function () {
        this.fields.each(function (field, name) {
            field.reset();
        }, this);
        this.fireEvent('reset',this);
    },
    /**
     * APIMethod: getFieldsByName
     * Allows retrieving a field from a form by the name of the field (NOT the
     * ID).
     *
     * Parameters:
     * name - {string} the name of the field to find
     */
    getFieldsByName: function (name) {
        var fields = [];
        this.fields.each(function(val, id){
            if (val.name === name) {
                fields.push(val);
            }
        },this);
        return fields;
    },
    /**
     * APIMethod: getField
     * Returns a Jx.Field object by its ID.
     *
     * Parameters:
     * id - {string} the id of the field to find.
     */
    getField: function (id) {
        if (this.fields.has(id)) {
            return this.fields.get(id);
        } 
        return null;
    },
    /**
     * APIMethod: setBusy
     * Sets the busy state of the Form and all of it's fields.
     *
     * Parameters:
     * state - {boolean} indicated whether the form is busy or not.
     */
    setBusy: function(state) {
      if (this.busy == state) {
        return;
      }
      this.parent(state);
      this.fields.each(function(field) {
        field.setBusy(state, true);
      });
    },

    submit: function() {
        //are there any files in this form?
        var opts = this.options;
        if (opts.fileUpload) {
            //grab all of the files and pull them into the main domObj
            var files = this.findFiles();
            files.each(function(file){
                var inputs = file.getFileInputs();
                if (inputs.length > 1) {
                    //we need to make these an array...
                    inputs.each(function(input){
                        input.set('name',input.get('name') + '[]');
                    },this);
                }
                file.destroy();
                this.domObj.adopt(inputs);
            },this);
        }
        this.domObj.submit();
    },

    ajaxSubmit: function() {
        var opts = this.options;
        if (opts.fileUpload) {
            var files = this.findFiles();
            this.files = files.length;
            this.completed = 0;
            files.each(function(file, index){
                file.addEvent('onFileUploadComplete',this.fileUploadComplete.bind(this));
                if (index==(this.files - 1) && !opts.uploadFilesFirst) {
                    file.upload(this);
                } else {
                    file.upload();
                }
            },this);
        } else {
            this.submitForm();
        }
    },

    submitForm: function() {
        //otherwise if no file field(s) present, just get the values and
        //submit to the action via the method
        var data = this.getValues();
        var req = new Request.JSON({
            url: this.action,
            method: this.method,
            data: data,
            urlEncoded: true,
            onSuccess: function(responseJSON, responseText) {
                this.fileUploadComplete(responseJSON, true);
            }.bind(this)
        });
        req.send();
    },

    findFiles: function() {
        var files = [];
        this.fields.each(function(field){
            if (field instanceof Jx.Field.File) {
                files.push(field);
            }
        },this);
        return files;
    },

    fileUploadComplete: function(data){
        this.completed++;
        $each(data,function(value,key){
            this.data[key] = value;
        },this);
        if (this.completed == this.files && this.options.uploadFilesFirst) {
            this.submitForm();
        } else {
            this.fireEvent('formSubmitComplete',[this.data]);
        }
    }

});
/*
---

name: Jx.Field

description: Base class for all inputs

license: MIT-style license.

requires:
 - Jx.Fieldset
 - Jx.Form

provides: [Jx.Field]


...
 */
// $Id$
/**
 * Class: Jx.Field
 *
 * Extends: <Jx.Widget>
 *
 * This class is the base class for all form fields.
 *
 *
 * Example:
 * (code)
 * (end)
 * 
 * MooTools.lang Keys:
 * - field.requiredText
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field = new Class({
    Family: 'Jx.Field',
    Extends : Jx.Widget,
    pluginNamespace: 'Field',
    Binds: ['changeText'],
    
    options : {
        /**
         * Option: id
         * The ID assigned to the container of the Jx.Field element, this is
         * not the id of the input element (which is internally computed to be
         * unique)
         */
        id : null,
        /**
         * Option: name
         * The name of the field (used when submitting to the server). Will also be used for the
         * name attribute of the field.
         */
        name : null,
        /**
         * Option: label
         * The text that goes next to the field.
         */
        label : null,
        /**
         * Option: labelSeparator
         * A character to use as the separator between the label and the input.
         * Make it an empty string for no separator.
         */
        labelSeparator : ":",
        /**
         * Option: value
         * A default value to populate the field with.
         */
        value : null,
        /**
         * Option: tag
         * a string to use as the HTML of the tag element (default is a
         * <span> element).
         */
        tag : null,
        /**
         * Option: tip
         * A string that will eventually serve as a tooltip for an input field.
         * Currently only implemented as OverText for text fields.
         */
        tip : null,
        /**
         * Option: template
         * A string holding the template for the field.
         */
        template : null,
        /**
         * Option: containerClass
         * a CSS class that will be added to the containing element.
         */
        containerClass : null,
        /**
         * Option: labelClass
         * a CSS to add to the label
         */
        labelClass : null,
        /**
         * Option: fieldClass
         * a CSS class to add to the input field
         */
        fieldClass : null,
        /**
         * Option: tagClass
         * a CSS class to add to the tag field
         */
        tagClass : null,
        /**
         * Option: required
         * Whether the field is required. Setting this to true will trigger
         * the addition of a "required" validator class and the form
         * will not submit until it is filled in and validates provided
         * that the plugin Jx.Plugin.Field.Validator has been added to this
         * field.
         */
        required : false,
        /**
         * Option: readonly
         * {True|False} defaults to false. Whether this field is readonly.
         */
        readonly : false,
        /**
         * Option: disabled
         * {True|False} defaults to false. Whether this field is disabled.
         */
        disabled : false,
        /**
         * Option: defaultAction
         * {Boolean} defaults to false, if true and this field is a button
         * of some kind (Jx.Button, a button or an input of type submit) then
         * if the user hits the enter key on any field in the form except a
         * textarea, this field will be activated as if clicked
         */
        defaultAction: false
    },

    /**
     * Property: overtextOptions
     * The default options Jx uses for mootools-more's OverText
     * plugin
     */
    overtextOptions : {
        element : 'label'
    },

    /**
     * Property: field
     * An element representing the input field itself.
     */
    field : null,
    /**
     * Property: label
     * A reference to the label element for this field
     */
    label : null,
    /**
     * Property: tag
     * A reference to the "tag" field of this input if available
     */
    tag : null,
    /**
     * Property: id
     * A computed, unique id attached to the input element of this field.
     */
    id : null,
    /**
     * Property: overText
     * The overText instance for this field.
     */
    overText : null,
    /**
     * Property: type
     * Indicates that this is a field type
     */
    type : 'field',
    /**
     * Property: classes
     * The classes to search for in the template. Not
     * required, but we look for them.
     */
    classes : new Hash({
        domObj: 'jxInputContainer',
        label: 'jxInputLabel',
        tag: 'jxInputTag'
    }),

    /**
     * APIMethod: render
     */
    render : function () {
        this.classes.set('field', 'jxInput'+this.type);
        var name = $defined(this.options.name) ? this.options.name : '';
        this.options.template = this.options.template.substitute({name:name});
        this.parent();

        this.id = this.generateId();
        this.name = this.options.name;

        if ($defined(this.type)) {
            this.domObj.addClass('jxInputContainer'+this.type);
        }

        if ($defined(this.options.containerClass)) {
            this.domObj.addClass(this.options.containerClass);
        }
        if ($defined(this.options.required) && this.options.required) {
            this.domObj.addClass('jxFieldRequired');
            if ($defined(this.options.validatorClasses)) {
                this.options.validatorClasses = 'required ' + this.options.validatorClasses;
            } else {
                this.options.validatorClasses = 'required';
            }
        }


        // FIELD
        if (this.field) {
            if ($defined(this.options.fieldClass)) {
                this.field.addClass(this.options.fieldClass);
            }

            if ($defined(this.options.value)) {
                this.field.set('value', this.options.value);
            }

            this.field.set('id', this.id);

            if ($defined(this.options.readonly)
                    && this.options.readonly) {
                this.field.set("readonly", "readonly");
                this.field.addClass('jxFieldReadonly');
            }

            if ($defined(this.options.disabled)
                    && this.options.disabled) {
                this.field.set("disabled", "disabled");
                this.field.addClass('jxFieldDisabled');
            }
            
            //add events
            this.field.addEvents({
              'focus': this.onFocus.bind(this),
              'blur': this.onBlur.bind(this),
              'change': this.onChange.bind(this)
            });

            this.field.store('field', this);

            // add click event to label to set the focus to the field
            // COMMENT: tried it without a function using addEvent('click', this.field.focus.bind(this)) but crashed in IE
            if(this.label) {
              this.label.addEvent('click', function() {
                this.field.focus();
              }.bind(this));
            }
        }
        // LABEL
        if (this.label) {
            if ($defined(this.options.labelClass)) {
                this.label.addClass(this.options.labelClass);
            }
            if ($defined(this.options.label)) {
                this.label.set('html', this.getText(this.options.label)
                        + this.options.labelSeparator);
            }

            this.label.set('for', this.id);

            if (this.options.required) {
                this.requiredText = new Element('em', {
                    'html' : this.getText({set:'Jx',key:'field',value:'requiredText'}),
                    'class' : 'required'
                });
                this.requiredText.inject(this.label);
            }

        }

        // TAG
        if (this.tag) {
            if ($defined(this.options.tagClass)) {
                this.tag.addClass(this.options.tagClass);
            }
            if ($defined(this.options.tag)) {
                this.tag.set('html', this.options.tag);
            }
        }

        if ($defined(this.options.form)
                && this.options.form instanceof Jx.Form) {
            this.form = this.options.form;
            this.form.addField(this);
        }

    },
    /**
     * APIMethod: setValue 
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to.
     */
    setValue : function (v) {
        if (!this.options.readonly) {
            this.field.set('value', v);
        }
    },

    /**
     * APIMethod: getValue
     * Returns the current value of the field.
     */
    getValue : function () {
        return this.field.get("value");
    },

    /**
     * APIMethod: reset
     * Sets the field back to the value passed in the
     * original options
     */
    reset : function () {
        this.setValue(this.options.value);
        this.fireEvent('reset', this);
    },
    /**
     * APIMethod: disable
     * Disabled the field
     */
    disable : function () {
        this.options.disabled = true;
        this.field.set("disabled", "disabled");
        this.field.addClass('jxFieldDisabled');
    },
    /**
     * APIMethod: enable
     * Enables the field
     */
    enable : function () {
        this.options.disabled = false;
        this.field.erase("disabled");
        this.field.removeClass('jxFieldDisabled');
    },
    
    /**
     * APIMethod: addTo
     * Overrides default Jx.Widget AddTo() so that we can call .add() if
     * adding to a Jx.Form or Jx.Fieldset object.
     *
     * Parameters:
     * what - the element or object to add this field to.
     * where - where in the object to place it. Not valid if adding to Jx.Form
     *      or Jx.Fieldset.
     */
    addTo: function(what, where) {
        if (what instanceof Jx.Fieldset || what instanceof Jx.Form) {
            what.add(this);
        } else {
            this.parent(what, where);
        }
        return this;
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     *    translations changed.
     */
    changeText: function (lang) {
        this.parent();
        if ($defined(this.options.label) && this.label) {
          this.label.set('html', this.getText(this.options.label) + this.options.labelSeparator);
        }
        if(this.options.required) {
          this.requiredText = new Element('em', {
              'html' : this.getText({set:'Jx',key:'field',value:'requiredText'}),
              'class' : 'required'
          });
          this.requiredText.inject(this.label);
        }
        if ($defined(this.requiredText)) {
          this.requiredText.set('html',this.getText({set:'Jx',key:'field',value:'requiredText'}));
        }
    }, 
    
    onFocus: function() {
      this.fireEvent('focus', this);
    },
    
    onBlur: function () {
      this.fireEvent('blur',this);
    },
    
    onChange: function () {
      this.fireEvent('change', this);
    },
    
    setBusy: function(state, withoutMask) {
      if (!withoutMask) {
        this.parent(state);
      }
      this.field.set('readonly', state || this.options.readonly);
    }

});
/*
---

name: Jx.Field.Text

description: Represents a text input

license: MIT-style license.

requires:
 - Jx.Field

optional:
 - More/OverText

provides: [Jx.Field.Text]

...
 */
// $Id$
/**
 * Class: Jx.Field.Text
 *
 * Extends: <Jx.Field>
 *
 * This class represents a text input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Text = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: overText
         * an object holding options for mootools-more's OverText class. Leave it null to
         * not enable it, make it an object to enable.
         */
        overText: null,
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><input class="jxInputText" type="text" name="{name}"/><span class="jxInputTag"></span></span>'
    },
    /**
     * Property: type
     * The type of this field
     */
    type: 'Text',

    /**
     * APIMethod: render
     * Creates a text input field.
     */
    render: function () {
        this.parent();

        //create the overText instance if needed
        if ($defined(this.options.overText)) {
            var opts = $extend({}, this.options.overText);
            this.field.set('alt', this.options.tip);
            this.overText = new OverText(this.field, opts);
            this.overText.show();
        }

    }

});/*
---

name: Jx.Dialog.Prompt

description: A subclass of Jx.dialog for prompting the user for text input.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item
 - Jx.Field.Text

provides: [Jx.Dialog.Prompt]

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Prompt
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Prompt is an extension of Jx.Dialog that allows the developer
 * to display a message to the user and ask for a text response. 
 * 
 * MooTools.lang Keys:
 * - prompt.okButton
 * - prompt.cancelButton
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Prompt = new Class({

    Extends: Jx.Dialog,

    options: {
        /**
         * Option: prompt
         * The message to display to the user
         */
        prompt: '',
        /**
         * Option: startingValue
         * The startingvalue to place in the input field
         */
        startingValue: '',
        /**
         * Option: fieldOptions,
         * Object with various
         */
        fieldOptions: {
          type : 'Text',
          options: {},
          validate : true,
          validatorOptions: {
            validators: ['required'],
            validateOnBlur: true,
            validateOnChange : false
          },
          showErrorMsg : true
        },
        /**
         * Jx.Dialog option defaults
         */
        width: 400,
        height: 200,
        close: true,
        resize: true,
        collapse: false,
        useKeyboard : true,
        keys : {
          'esc'   : 'cancel',
          'enter' : 'ok'
        }
    },
    /**
     * APIMethod: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll:false});
        this.ok = new Jx.Button({
                label: this.getText({set:'Jx',key:'prompt',value:'okButton'}),
                onClick: this.onClick.bind(this, true)
            });
        this.cancel = new Jx.Button({
                label: this.getText({set:'Jx',key:'prompt',value:'cancelButton'}),
                onClick: this.onClick.bind(this, false)
            });
        this.buttons.add(this.ok, this.cancel);
        this.options.toolbars = [this.buttons];

        var fOpts = this.options.fieldOptions;
            fOpts.options.label = this.getText(this.options.prompt);
            fOpts.options.value = this.options.startingValue;
            fOpts.options.containerClass = 'jxPrompt';

        if(Jx.type(fOpts.type) === 'string' && $defined(Jx.Field[fOpts.type.capitalize()])) {
          this.field = new Jx.Field[fOpts.type.capitalize()](fOpts.options);
        }else if(Jx.type(fOpts.type) === 'Jx.Object'){
          this.field = fOpts.type;
        }else{
          // warning and fallback?
          window.console ? console.warn("Field type does not exist %o, using Jx.Field.Text", fOpts.type) : false;
          this.field = new Jx.Field.Text(fOpts.options);
        }

        if(this.options.fieldOptions.validate) {
          this.validator = new Jx.Plugin.Field.Validator(this.options.fieldOptions.validatorOptions);
          this.validator.attach(this.field);
        }

        this.options.content = document.id(this.field);
        
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.ok     = function(ev) { ev.preventDefault(); self.onClick(true); }
          this.options.keyboardMethods.cancel = function(ev) { ev.preventDefault(); self.onClick(false); }
        }
        this.parent();
        if(this.options.useKeyboard) {
          this.keyboard.addEvents(this.getKeyboardEvents());
        }
    },
    /**
     * Method: onClick
     * Called when the OK button is clicked. Closes the dialog.
     */
    onClick: function (value) {
        if(value && $defined(this.validator)) {
          if(this.validator.isValid()) {
            this.isOpening = false;
            this.hide();
            this.fireEvent('close', [this, value, this.field.getValue()]);
          }else{
            //this.options.content.adopt(this.validator.getError());
            this.field.field.focus.delay(50, this.field.field);
            //todo: show error messages ?
          }
        }else{
          this.isOpening = false;
          this.hide();
          this.fireEvent('close', [this, value, this.field.getValue()]);
        }
    },
    
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.ok)) {
    		this.ok.setLabel({set:'Jx',key:'prompt',value:'okButton'});
    	}
    	if ($defined(this.cancel)) {
    		this.cancel.setLabel({set:'Jx',key:'prompt',value:'cancelButton'});
    	}
      this.field.label.set('html', this.getText(this.options.prompt));
    }


});
/*
---

name: Jx.Panel.DataView

description: A panel used for displaying records from a store in a list-style interface rather than a grid.

license: MIT-style license.

requires:
 - Jx.Panel
 - Jx.Store
 - Jx.List

provides: [Jx.Panel.DataView]

...
 */
// $Id$
/**
 * Class: Jx.Panel.DataView
 *
 * Extends: <Jx.Panel>
 *
 * This panel extension takes a standard Jx.Store (or subclass) and displays
 * each record as an item using a provided template. It sorts the store as requested
 * before doing so. The class only creates the HTML and has no default CSS display. All
 * styling must be done by the developer using the control.
 *
 *
 * Events:
 * renderDone - fires when the panel completes creating all of the items.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel.DataView = new Class({

    Extends: Jx.Panel,

    options: {
        /**
         * Option: data
         * The store containing the data
         */
        data: null,
        /**
         * Option: sortColumns
         * An array of columns to sort the store by.
         */
        sortColumns: null,
        /**
         * Option: itemTemplate
         * The template to use in rendering records
         */
        itemTemplate: null,
        /**
         * Option: emptyTemplate
         * the template that is displayed when there are no records in the
         * store.
         */
        emptyTemplate: null,
        /**
         * Option: containerClass
         * The class added to the container. It can be used to target the items
         * in the panel.
         */
        containerClass: null,
        /**
         * Option: itemClass
         * The class to add to each item. Used for styling purposes
         */
        itemClass: null,
        /**
         * Option: itemOptions
         * Options to pass to the list object
         */
        listOptions: {
            select: true,
            hover: true
        }
    },

    init: function () {
        this.domA = new Element('div');
        this.list = this.createList(this.domA, this.options.listOptions);
        this.parent();
    },
    /**
     * APIMethod: render
     * Renders the dataview. If the store already has data loaded it will be rendered
     * at the end of the method.
     */
    render: function () {
        if (!$defined(this.options.data)) {
            //we can't do anything without data
            return;
        }

        this.options.content = this.domA;

        //pass to parent
        this.parent();

        this.domA.addClass(this.options.containerClass);

        //parse templates so we know what values are needed in each
        this.itemCols = this.parseTemplate(this.options.itemTemplate);

        this.bound.update = this.update.bind(this);
        //listen for data updates
        this.options.data.addEvent('storeDataLoaded', this.bound.update);
        this.options.data.addEvent('storeSortFinished', this.bound.update);
        this.options.data.addEvent('storeDataLoadFailed', this.bound.update);

        if (this.options.data.loaded) {
            this.update();
        }

    },

    /**
     * Method: draw
     * begins the process of creating the items
     */
    draw: function () {
        var n = this.options.data.count();
        if ($defined(n) && n > 0) {
            for (var i = 0; i < n; i++) {
                this.options.data.moveTo(i);

                var item = this.createItem();
                this.list.add(item);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            this.list.add(item);
        }
        this.fireEvent('renderDone', this);
    },
    /**
     * Method: createItem
     * Actually does the work of getting the data from the store
     * and creating a single item based on the provided template
     */
    createItem: function () {
        //create the item
        var itemObj = {};
        this.itemCols.each(function (col) {
            itemObj[col] = this.options.data.get(col);
        }, this);
        var itemTemp = this.options.itemTemplate.substitute(itemObj);
        var item = new Element('div', {
            'class': this.options.itemClass,
            html: itemTemp
        });
        return item;
    },
    /**
     * APIMethod: update
     * This method begins the process of creating the items. It is called when
     * the store is loaded or can be called to manually recreate the view.
     */
    update: function () {
        if (!this.updating) {
            this.updating = true;
            this.list.empty();
            this.options.data.sort(this.options.sortColumns);
            this.draw();
            this.updating = false;
        }
    },
    /**
     * Method: parseTemplate
     * parses the provided template to determine which store columns are
     * required to complete it.
     *
     * Parameters:
     * template - the template to parse
     */
    parseTemplate: function (template) {
        //we parse the template based on the columns in the data store looking
        //for the pattern {column-name}. If it's in there we add it to the
        //array of ones to look for
        var columns = this.options.data.getColumns();
        var arr = [];
        columns.each(function (col) {
            var s = '{' + col.name + '}';
            if (template.contains(s)) {
                arr.push(col.name);
            }
        }, this);
        return arr;
    },
    /**
     * Method: enterItem
     * Fires mouseenter event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    enterItem: function(item, list){
        this.fireEvent('mouseenter', item, list);
    },
    /**
     * Method: leaveItem
     * Fires mouseleave event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    leaveItem: function(item, list){
        this.fireEvent('mouseleave', item, list);
    },
    /**
     * Method: selectItem
     * Fires select event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    selectItem: function(item, list){
        this.fireEvent('select', item, list);
    },
    /**
     * Method: unselectItem
     * Fires unselect event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    unselectItem: function(item, list){
        this.fireEvent('unselect', item, list);
    },
    /**
     * Method: addItem
     * Fires add event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    addItem: function(item, list) {
        this.fireEvent('add', item, list);
    },
    /**
     * Method: removeItem
     * Fires remove event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    removeItem: function(item, list) {
        this.fireEvent('remove', item, list);
    },
    /**
     * Method: createList
     * Creates the list object
     *
     * Parameters:
     * container - the container to use in the list
     * options - the options for the list
     */
    createList: function(container, options){
        return new Jx.List(container, $extend({
            onMouseenter: this.enterItem.bind(this),
            onMouseleave: this.leaveItem.bind(this),
            onSelect:  this.selectItem.bind(this),
            onAdd: this.addItem.bind(this),
            onRemove: this.removeItem.bind(this),
            onUnselect: this.unselectItem.bind(this)
        }, options));
    }
});
/*
---

name: Jx.Panel.DataView.Group

description: A subclass of Dataview that can display records in groups.

license: MIT-style license.

requires:
 - Jx.Panel.DataView
 - Jx.Selection

provides: [Jx.Panel.DataView.Group]

...
 */
// $Id$
/**
 * Class: Jx.Panel.DataView.Group
 *
 * Extends: <Jx.Panel.DataView>
 *
 * This extension of Jx.Panel.DataView that provides for grouping the items
 * by a particular column.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel.DataView.Group = new Class({

    Extends: Jx.Panel.DataView,

    options: {
        /**
         * Option: groupTemplate
         * The template used to render the group heading
         */
        groupTemplate: null,
        /**
         * Option: groupContainerClass
         * The class added to the group container. All of the items and header
         * for a single grouping is contained by a div that has this class added.
         */
        groupContainerClass: null,
        /**
         * Option: groupHeaderClass
         * The class added to the heading. Used for styling.
         */
        groupHeaderClass: null,
        /**
         * Option: listOption
         * Options to pass to the main list
         */
        listOptions: {
            select: false,
            hover: false
        },
        /**
         * Option: itemOption
         * Options to pass to the item lists
         */
        itemOptions: {
            select: true,
            hover: true,
            hoverClass: 'jxItemHover',
            selectClass: 'jxItemSelect'
        }
    },

    init: function() {
        this.groupCols = this.parseTemplate(this.options.groupTemplate);
        this.itemManager = new Jx.Selection({
            eventToFire: {
                select: 'itemselect',
                unselect: 'itemunselect'
            },
            selectClass: 'jxItemSelected'
        });
        this.groupManager = new Jx.Selection({
            eventToFire: {
                select: 'groupselect',
                unselect: 'groupunselect'
            },
            selectClass: 'jxGroupSelected'
        });
        this.parent();

    },
    /**
     * APIMethod: render
     * sets up the list container and calls the parent class' render function.
     */
    render: function () {
        this.list = this.createList(this.domA, this.listOptions, this.groupManager);
        this.parent();

    },
    /**
     * Method: draw
     * actually does the work of creating the view
     */
    draw: function () {
        var d = this.options.data;
        var n = d.count();

        if ($defined(n) && n > 0) {
            var currentGroup = '';
            var itemList = null;

            for (var i = 0; i < n; i++) {
                d.moveTo(i);
                var group = d.get(this.options.sortColumns[0]);

                if (group !== currentGroup) {
                    //we have a new grouping

                    //group container
                    var container =  new Element('div', {
                        'class': this.options.groupContainerClass
                    });
                    var l = this.createList(container,{
                        select: false,
                        hover: false
                    });
                    this.list.add(l.container);

                    //group header
                    currentGroup = group;
                    var obj = {};
                    this.groupCols.each(function (col) {
                        obj[col] = d.get(col);
                    }, this);
                    var temp = this.options.groupTemplate.substitute(obj);
                    var g = new Element('div', {
                        'class': this.options.groupHeaderClass,
                        'html': temp,
                        id: 'group-' + group.replace(" ","-","g")
                    });
                    l.add(g);

                    //items container
                    var currentItemContainer = new Element('div', {
                        'class': this.options.containerClass
                    });
                    itemList = this.createList(currentItemContainer, this.options.itemOptions, this.itemManager);
                    l.add(itemList.container);
                }

                var item = this.createItem();
                itemList.add(item);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            this.list.add(empty);
        }
        this.fireEvent('renderDone', this);
    },

    /**
     * Method: createList
     * Creates the list object
     *
     * Parameters:
     * container - the container to use in the list
     * options - the options for the list
     * manager - <Jx.Selection> which selection obj to connect to this list
     */
    createList: function(container, options, manager){
        return new Jx.List(container, $extend({
            onMouseenter: this.enterItem.bind(this),
            onMouseleave: this.leaveItem.bind(this),
            onAdd: this.addItem.bind(this),
            onRemove: this.removeItem.bind(this)
        }, options), manager);
    }

});
/*
---

name: Jx.ListItem

description: Represents a single item in a listview.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.ListItem]

...
 */
// $Id$
/**
 * Class: Jx.ListItem
 *
 * Extends: <Jx.Widget>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.ListItem = new Class({
    Family: 'Jx.ListItem',
    Extends: Jx.Widget,

    options: {
        enabled: true,
        template: '<li class="jxListItemContainer jxListItem"></li>'
    },

    classes: new Hash({
        domObj: 'jxListItemContainer',
        domContent: 'jxListItem'
    }),

    /**
     * APIMethod: render
     */
    render: function () {
        this.parent();
        this.domContent.store('jxListItem', this);
        this.domObj.store('jxListTarget', this.domContent);
        this.loadContent(this.domContent);
    },

    enable: function(state) {

    }
});/*
---

name: Jx.ListView

description: A widget that displays items in a list format.

license: MIT-style license.

requires:
 - Jx.List
 - Jx.ListItem

provides: [Jx.ListView]

css:
 - list

images:
 - listitem.png
...
 */
// $Id$
/**
 * Class: Jx.ListView
 *
 * Extends: <Jx.Widget>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.ListView = new Class({
    Family: 'Jx.Widget',
    Extends: Jx.Widget,

    pluginNamespace: 'ListView',

    options: {
        template: '<ul class="jxListView jxList"></ul>',
        /**
         * Option: listOptions
         * control the behaviour of the list, see <Jx.List>
         */
        listOptions: {
            hover: true,
            press: true,
            select: true
        }
    },

    classes: new Hash({
        domObj: 'jxListView',
        listObj: 'jxList'
    }),

    /**
     * APIMethod: render
     */
    render: function () {
        this.parent();

        if (this.options.selection) {
            this.selection = this.options.selection;
        } else if (this.options.select) {
            this.selection = new Jx.Selection(this.options);
            this.ownsSelection = true;
        }

        this.list = new Jx.List(this.listObj, this.options.listOptions, this.selection);

    },

    cleanup: function() {
        if (this.ownsSelection) {
            this.selection.destroy();
        }
        this.list.destroy();
    },

    add: function(item, where) {
        this.list.add(item, where);
        return this;
    },

    remove: function(item) {
        this.list.remove(item);
        return this;
    },

    replace: function(item, withItem) {
        this.list.replace(item, withItem);
        return this;
    },

    empty: function () {
        this.list.empty();
        return this;
    }
});/*
---

name: Jx.Field.Hidden

description: Represents a hidden input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Hidden]

...
 */
// $Id$
/**
 * Class: Jx.Field.Hidden
 *
 * Extends: <Jx.Field>
 *
 * This class represents a hidden input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Hidden = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<span class="jxInputContainer"><input class="jxInputHidden" type="hidden" name="{name}"/></span>'
    },
    /**
     * Property: type
     * The type of this field
     */
    type: 'Hidden'

});




/*
---

name: Jx.Field.File

description: Represents a file input w/upload and progress tracking capabilities (requires APC for progress)

license: MIT-style license.

requires:
 - Jx.Field.Text
 - Jx.Button
 - Core/Request.JSON
 - Jx.Field.Hidden
 - Jx.Form

provides: [Jx.Field.File]

css:
 - file


...
 */
/**
 * Class: Jx.Field.File
 *
 * Extends: <Jx.Field>
 *
 * This class is designed to work with an iFrame and APC upload progress.
 * APC is a php specific technology but any server side implementation that
 * works in the same manner should work. You can then wire this class to the
 * progress bar class to show progress.
 *
 * The other option is to not use progress tracking and just use the base
 * upload which works through a hidden iFrame. In order to use this with Jx.Form
 * you'll need to add it normally but keep a reference to it. When you call
 * Jx.Form.getValues() it will not return any file information. You can then
 * call the Jx.Field.File.upload() method for each file input directly and
 * then submit the rest of the form via ajax.
 *
 * MooTools.lang Keys:
 * - file.browseLabel
 * 
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.File = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: template
         * The template used to render the field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><div class="jxFileInputs"><input class="jxInputFile" type="file" name="{name}" /></div><span class="jxInputTag"></span></span>',
        /**
         * Option: autoUpload
         * Whether to upload the file immediatelly upon selection
         */
        autoUpload: false,
        /**
         * Option: Progress
         * Whether to use the APC, or similar, progress method.
         */
        progress: false,
        /**
         * Option: progressIDUrl
         * The url to call in order to get the ID, or key, to use
         * with the APC upload process
         */
        progressIDUrl: '',
        /**
         * Option: progressName
         * The name to give the field that holds the generated progress ID retrieved
         * from the server. Defaults to 'APC_UPLOAD_PROGRESS' which is the default
         * for APC.
         */
        progressName: 'APC_UPLOAD_PROGRESS',
        /**
         * Option: progressId
         * The id to give the form element that holds the generated progress ID
         * retrieved from the server. Defaults to 'progress_key'.
         */
        progressId: 'progress_key',
        /**
         * Option: handlerUrl
         * The url to send the file to.
         */
        handlerUrl: '',
        /**
         * Option: progressUrl
         * The url used to retrieve the upload prgress of the file.
         */
        progressUrl: '',
        /**
         * Option: debug
         * Defaults to false. If set to true it will prevent the hidden form
         * and IFrame from being destroyed at the end of the upload so it can be
         * inspected during development
         */
        debug: false,
        /**
         * Option: mode
         * determines whether this file field acts in single upload mode or
         * multiple file upload mode. The multiple upload mode was done to work with
         * Jx.Panel.FileUpload. When in multiple mode, this field will remove the actual
         * file control after a file is selected, fires an event to signify the selection but will
         * hold on to the files until told to upload them. Obviously 'multiple' mode isn't designed
         * to be used when the control is outside of the Upload Panel (unless the user designs
         * their own upload panel around it).
         */
        mode: 'single'

    },
    /**
     * Property: type
     * The Field type used in rendering
     */
    type: 'File',
    /**
     * Property: forms
     * holds all form references when we're in multiple mode
     */
    forms: null,

    init: function () {
        this.parent();

        this.forms = new Hash();
        //create the iframe
        //we use the same iFrame for each so we don't have to recreate it each time
        this.isIFrameSetup = true;
        this.iframe = new Element('iframe', {
          name: this.generateId(),
          styles: {
            'display':'none',
            'visibility':'hidden'
          }
        });
        // this.iframe = new IFrame(null, {
        //     styles: {
        //         'display':'none',
        //         'visibility':'hidden'
        //     },
        //     name : this.generateId()
        // });
        this.iframe.inject(document.body);
        this.iframe.addEvent('load', this.processIFrameUpload.bind(this));

    },

    /**
     * APIMethod: render
     * renders the file input
     */
    render: function () {
        this.parent();

        //add a unique ID if no id is defined
        if (!$defined(this.options.id)) {
            this.field.set('id', this.generateId());
        }

        //now, create the fake inputs

        this.fake = new Element('div', {
            'class' : 'jxFileFake'
        });
        this.text = new Jx.Field.Text({
            template : '<span class="jxInputContainer"><input class="jxInputText" type="text" /></span>'
        });
        this.browseButton = new Jx.Button({
            label: this.getText({set:'Jx',key:'file',value:'browseLabel'})
        });

        this.fake.adopt(this.text, this.browseButton);
        this.field.grab(this.fake, 'after');

        this.field.addEvents({
            change : this.copyValue.bind(this),
            //mouseout : this.copyValue.bind(this),
            mouseenter : this.mouseEnter.bind(this),
            mouseleave : this.mouseLeave.bind(this)
        });

    },
    /**
     * Method: copyValue
     * Called when the value in the actual file input changes and when
     * the mouse moves out of it to copy the value into the "fake" text box.
     */
    copyValue: function () {
        if (this.options.mode=='single' && this.field.value !== '' && (this.text.field.value !== this.field.value)) {
            this.text.field.value = this.field.value;
            this.fireEvent('fileSelected', this);
            this.forms.set(this.field.value, this.prepForm());
            if (this.options.autoUpload) {
                this.uploadSingle();
            }
        } else if (this.options.mode=='multiple') {
            var filename = this.field.value;
            var form = this.prepForm();
            this.forms.set(filename, form);
            this.text.setValue('');
            //fire the selected event.
            this.fireEvent('fileSelected', filename);
        }
    },
    /**
     * Method: mouseEnter
     * Called when the mouse enters the actual file input to make the
     * fake button highlight.
     */
    mouseEnter: function () {
        this.browseButton.domA.addClass('jxButtonPressed');
    },
    /**
     * Method: mouseLeave
     * called when the mouse leaves the actual file input to turn off
     * the highlight of the fake button.
     */
    mouseLeave: function () {
        this.browseButton.domA.removeClass('jxButtonPressed');
    },

    prepForm: function () {
        //load in the form
        var form = new Jx.Form({
            action : this.options.handlerUrl,
            name : 'jxUploadForm',
            fileUpload: true
        });

        //move the form input into it (cloneNode)
        var parent = document.id(this.field.getParent());
        var sibling = document.id(this.field).getPrevious();
        var clone = this.field.clone().cloneEvents(this.field);
        document.id(form).grab(this.field);
        // tried clone.replaces(this.field) but it didn't seem to work
        if (sibling) {
          clone.inject(sibling, 'after');
        } else if (parent) {
            clone.inject(parent, 'top');
        }
        this.field = clone;

        this.mouseLeave();

        return form;
    },

    upload: function (externalForm) {
        //do we have files to upload?
        if (this.forms.getLength() > 0) {
            var keys = this.forms.getKeys();
            this.currentKey = keys[0];
            var form = this.forms.get(this.currentKey);
            this.forms.erase(this.currentKey);
            if ($defined(externalForm) && this.forms.getLength() == 0) {
                var fields = externalForm.fields;
                fields.each(function(field){
                    if (!(field instanceof Jx.Field.File)) {
                        document.id(field).clone().inject(form);
                    }
                },this);
            }
            this.uploadSingle(form);
        } else {
            //fire finished event...
            this.fireEvent('allUploadsComplete', this);
        }
    },
    /**
     * APIMethod: uploadSingle
     * Call this to upload the file to the server
     */
    uploadSingle: function (form) {
        this.form = $defined(form) ? form : this.prepForm();

        this.fireEvent('fileUploadBegin', [this.currentKey, this]);

        this.text.setValue('');

        document.id(this.form).set('target', this.iframe.get('name')).setStyles({
            visibility: 'hidden',
            display: 'none'
        }).inject(document.body);

        //if polling the server we need an APC_UPLOAD_PROGRESS id.
        //get it from the server.
        if (this.options.progress) {
            var req = new Request.JSON({
                url: this.options.progressIDUrl,
                method: 'get',
                onSuccess: this.submitUpload.bind(this)
            });
            req.send();
        } else {
            this.submitUpload();
        }
    },
    /**
     * Method: submitUpload
     * Called either after upload() or as a result of a successful call
     * to get a progress ID.
     *
     * Parameters:
     * data - Optional. The data returned from the call for a progress ID.
     */
    submitUpload: function (data) {
        //check for ID in data
        if ($defined(data) && data.success && $defined(data.id)) {
            this.progressID = data.id;
            //if have id, create hidden progress field
            var id = new Jx.Field.Hidden({
                name : this.options.progressName,
                id : this.options.progressId,
                value : this.progressID
            });
            id.addTo(this.form, 'top');
        }

        //submit the form
        document.id(this.form).submit();
        //begin polling if needed
        if (this.options.progress && $defined(this.progressID)) {
            this.pollUpload();
        }
    },
    /**
     * Method: pollUpload
     * polls the server for upload progress information
     */
    pollUpload: function () {
        var d = { id : this.progressID };
        var r = new Request.JSON({
            data: d,
            url : this.options.progressUrl,
            method : 'get',
            onSuccess : this.processProgress.bind(this),
            onFailure : this.uploadFailure.bind(this)
        });
        r.send();
    },

    /**
     * Method: processProgress
     * process the data returned from the request
     *
     * Parameters:
     * data - The data from the request as an object.
     */
    processProgress: function (data) {
        if ($defined(data)) {
            this.fireEvent('fileUploadProgress', [data, this.currentKey, this]);
            if (data.current < data.total) {
                this.polling = true;
                this.pollUpload();
            } else {
                this.polling = false;
            }
        }
    },
    /**
     * Method: uploadFailure
     * called if there is a problem getting progress on the upload
     */
    uploadFailure: function (xhr) {
        this.fireEvent('fileUploadProgressError', [this, xhr]);
    },
    /**
     * Method: processIFrameUpload
     * Called if we are not using progress and the IFrame finished loading the
     * server response.
     */
    processIFrameUpload: function () {
        //the body text should be a JSON structure
        //get the body
        if (this.isIFrameSetup) {
            if (this.iframe.contentDocument  && this.iframe.contentDocument.defaultView) {
              var iframeBody = this.iframe.contentDocument.defaultView.document.body.innerHTML;
            } else {
              // seems to be needed for ie7
              var iframeBody = this.iframe.contentWindow.document.body.innerHTML;
            }

            var data = JSON.decode(iframeBody);
            if ($defined(data) && $defined(data.success) && data.success) {
                this.done = true;
                this.doneData = data;
                this.uploadCleanUp();
                this.fireEvent('fileUploadComplete', [data, this.currentKey, this]);
            } else {
                this.fireEvent('fileUploadError', [data , this.currentKey, this]);
            }

            if (this.options.mode == 'multiple') {
                this.upload();
            } else {
                this.fireEvent('allUploadsComplete', this);
            }
        }
    },
    /**
     * Method: uploadCleanUp
     * Cleans up the hidden form and IFrame after a completed upload. Set
     * this.options.debug to true to keep this from happening
     */
    uploadCleanUp: function () {
        if (!this.options.debug) {
            this.form.destroy();
        }
    },
    /**
     * APIMethod: remove
     * Removes a file from the hash of forms to upload.
     *
     * Parameters:
     * filename - the filename indicating which file to remove.
     */
    remove: function (filename) {
        if (this.forms.has(filename)) {
            this.forms.erase(filename);
        }
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.browseButton)) {
    		this.browseButton.setLabel( this.getText({set:'Jx',key:'file',value:'browseLabel'}) );
    	}
    },
    
    /**
     * APIMethod: getFileInputs
     * Used to get an array of all of the basic file inputs. This is mainly 
     * here for use by Jx.Form to be able to suck in the file inputs
     * before a standard submit.
     * 
     */
    getFileInputs: function () {
        var inputs = [];
        this.forms.each(function(form){
            var input = document.id(form).getElement('input[type=file]');
            inputs.push(input);
        },this);
        return inputs;
    }
});/*
---

name: Jx.Progressbar

description: A css-based progress bar.

license: MIT-style license.

requires:
 - Jx.Widget
 - Core/Fx.Tween

provides: [Jx.Progressbar]

css:
 - progressbar

images:
 - progressbar.png

...
 */
/**
 * Class: Jx.Progressbar
 *
 * 
 * Example:
 * The following just uses the defaults.
 * (code)
 * var progressBar = new Jx.Progressbar();
 * progressBar.addEvent('update',function(){alert('updated!');});
 * progressBar.addEvent('complete',function(){
 *      alert('completed!');
 *      this.destroy();
 * });
 * 
 * progressbar.addTo('container');
 * 
 * var total = 90;
 * for (i=0; i < total; i++) {
 *      progressbar.update(total, i);
 * }
 * (end)
 * 
 * Events:
 * onUpdate - Fired when the bar is updated
 * onComplete - fires when the progress bar completes it's fill
 * 
 * MooTools.lang keys:
 * - progressbar.messageText
 * - progressbar.progressText
 *
 * Copyright (c) 2010 by Jonathan Bomgardner
 * Licensed under an mit-style license
 */
Jx.Progressbar = new Class({
    Family: 'Jx.Progressbar',
    Extends: Jx.Widget,
    
    options: {
        onUpdate: $empty,
        onComplete: $empty,
        /**
         * Option: parent
         * The element to put this progressbar into
         */
        parent: null,
        /**
         * Option: progressText
         * Text to show while processing, uses 
         * {progress} von {total}
         */
        progressText : null,
        /**
         * Option: template
         * The template used to create the progressbar
         */
        template: '<div class="jxProgressBar-container"><div class="jxProgressBar-message"></div><div class="jxProgressBar"><div class="jxProgressBar-outline"></div><div class="jxProgressBar-fill"></div><div class="jxProgressBar-text"></div></div></div>'
    },
    /**
     * Property: classes
     * The classes used in the template
     */
    classes: new Hash({
        domObj: 'jxProgressBar-container',
        message: 'jxProgressBar-message', 
        container: 'jxProgressBar',
        outline: 'jxProgressBar-outline',
        fill: 'jxProgressBar-fill',
        text: 'jxProgressBar-text'
    }),
    /**
     * Property: bar
     * the bar that is filled
     */
    bar: null,
    /**
     * Property: text
     * the element that contains the text that's shown on the bar (if any).
     */
    text: null,
    
    /**
     * APIMethod: render
     * Creates a new progressbar.
     */
    render: function () {
        this.parent();
        
        if ($defined(this.options.parent)) {
            this.domObj.inject(document.id(this.options.parent));
        }
        
        this.domObj.addClass('jxProgressStarting');

        //we need to know the width of the bar
        this.width = document.id(this.domObj).getContentBoxSize().width;
        
        //Message
        if (this.message) {
            if ($defined(MooTools.lang.get('Jx','progressbar').messageText)) {
                this.message.set('html', this.getText({set:'Jx',key:'progressbar',value:'messageText'}));
            } else {
                this.message.destroy();
            }
        }

        //Fill
        if (this.fill) {
            this.fill.setStyles({
                'width': 0
            });
        }
        
        //TODO: check for {progress} and {total} in progressText
        var obj = {};
        var progressText = this.options.progressText == null ? 
                              this.getText({set:'Jx',key:'progressbar',value:'progressText'}) :
                              this.getText(this.options.progressText);
        if (progressText.contains('{progress}')) {
            obj.progress = 0;
        }
        if (progressText.contains('{total}')) {
            obj.total = 0;
        }
        
        //Progress text
        if (this.text) {
            this.text.set('html', progressText.substitute(obj));
        }
        
    },
    /**
     * APIMethod: update
     * called to update the progress bar with new percentage.
     * 
     * Parameters: 
     * total - the total # to progress up to
     * progress - the current position in the progress (must be less than or
     *              equal to the total)
     */
    update: function (total, progress) {
    	
    	//check for starting class
    	if (this.domObj.hasClass('jxProgressStarting')) {
    		this.domObj.removeClass('jxProgressStarting').addClass('jxProgressWorking');
    	}
    	
        var newWidth = (progress * this.width) / total;
        
        //update bar width
        this.text.get('tween', {property:'width', onComplete: function() {
            var obj = {};
            var progressText = this.options.progressText == null ?
                                  this.getText({set:'Jx',key:'progressbar',value:'progressText'}) :
                                  this.getText(this.options.progressText);
            if (progressText.contains('{progress}')) {
                obj.progress = progress;
            }
            if (progressText.contains('{total}')) {
                obj.total = total;
            }
            var t = progressText.substitute(obj);
            this.text.set('text', t);
        }.bind(this)}).start(newWidth);
        
        this.fill.get('tween', {property: 'width', onComplete: (function () {
            
            if (total === progress) {
                this.complete = true;
                this.domObj.removeClass('jxProgressWorking').addClass('jxProgressFinished');
                this.fireEvent('complete');
            } else {
                this.fireEvent('update');
            }
        }).bind(this)}).start(newWidth);
        
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	if (this.message) {
    		this.message.set('html',this.getText({set:'Jx',key:'progressbar',value:'messageText'}));
    	}
        //progress text will update on next update.
    }
    
});/*
---

name: Jx.Panel.FileUpload

description: A panel subclass that is designed to be a multiple file upload panel with a queue listing.

license: MIT-style license.

requires:
 - Jx.Panel
 - Jx.ListView
 - Jx.Field.File
 - Jx.Progressbar
 - Jx.Button
 - Jx.Toolbar.Item
 - Jx.Tooltip

provides: [Jx.Panel.FileUpload]

css:
 - upload

images:
 - icons.png
...
 */
// $Id$
/**
 * Class: Jx.Panel.FileUpload
 *
 * Extends: <Jx.Panel>
 *
 * This class extends Jx.Panel to provide a consistent interface for uploading
 * files in an application.
 * 
 * MooTools.lang Keys:
 * - upload.buttonText
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel.FileUpload = new Class({

    Family: 'Jx.Panel.FileUpload',
    Extends: Jx.Panel,
    Binds: ['moveToQueue','fileUploadBegin', 'fileUploadComplete','allUploadsComplete', 'fileUploadProgressError,', 'fileUploadError', 'fileUploadProgress'],

    options: {
        /**
         * Option: file
         * An object containing the options for Jx.Field.File
         */
        file: {
            autoUpload: false,
            progress: false,
            progressIDUrl: '',
            handlerUrl: '',
            progressUrl: ''
        },

        progressOptions: {
            template: "<li class='jxListItemContainer jxProgressBar-container' id='{id}'><div class='jxProgressBar'><div class='jxProgressBar-outline'></div><div class='jxProgressBar-fill'></div><div class='jxProgressBar-text'></div></div></li>",
            containerClass: 'progress-container',
            messageText: null,
            messageClass: 'progress-message',
            progressText: 'Uploading {filename}',
            progressClass: 'progress-bar'
        },
        /**
         * Option: onFileComplete
         * An event handler that is called when a file has been uploaded
         */
        onFileComplete: $empty,
        /**
         * Option: onComplete
         * An event handler that is called when all files have been uploaded
         */
        onComplete: $empty,
        /**
         * Option: prompt
         * The prompt to display at the top of the panel - before the
         * file input
         */
        prompt: null,
        /**
         * Option: removeOnComplete
         * Determines whether a file is removed from the queue after uploading
         */
        removeOnComplete: false
    },
    /**
     * Property: domObjA
     * An HTML Element used to hold the interface while it is being
     * constructed.
     */
    domObjA: null,
    /**
     * Property: fileQueue
     * An array holding Jx.Field.File elements that are to be uploaded
     */
    fileQueue: [],

    listTemplate: "<li class='jxListItemContainer' id='{id}'><a class='jxListItem' href='javascript:void(0);'><span class='itemLabel jxUploadFileName'>{name}</span><span class='jxUploadFileDelete' title='Remove this file from the queue.'></span></a></li>",
    /**
     * Method: render
     * Sets up the upload panel.
     */
    render: function () {
        //first create panel content
        this.domObjA = new Element('div', {'class' : 'jxFileUploadPanel'});


        if ($defined(this.options.prompt)) {
            var desc;
            if (Jx.type(this.options.prompt === 'string')) {
                desc = new Element('p', {
                    html: this.options.prompt
                });
            } else {
                desc = this.options.prompt;
            }
            desc.inject(this.domObjA);
        }

        //add the file field
        this.fileOpt = this.options.file;
        this.fileOpt.template = '<div class="jxInputContainer jxFileInputs"><input class="jxInputFile" type="file" name={name} /></div>';

        this.file = new Jx.Field.File(this.fileOpt);
        this.file.addEvent('fileSelected', this.moveToQueue);
        this.file.addTo(this.domObjA);

        this.listView = new Jx.ListView({
            template: '<ul class="jxListView jxList jxUploadQueue"></ul>'
            
        }).addTo(this.domObjA);

        if (!this.options.file.autoUpload) {
            //this is the upload button at the bottom of the panel.
            this.uploadBtn = new Jx.Button({
                label : this.getText({set:'Jx',key:'upload',value:'buttonText'}),
                onClick: this.upload.bind(this)
            });
            var tlb = new Jx.Toolbar({position: 'bottom', scroll: false}).add(this.uploadBtn);
            this.uploadBtn.setEnabled(false);
            this.options.toolbars = [tlb];
        }
        //then pass it on to the Panel constructor
        this.options.content = this.domObjA;
        this.parent(this.options);
    },
    /**
     * Method: moveToQueue
     * Called by Jx.Field.File's fileSelected event. Moves the selected file
     * into the upload queue.
     */
    moveToQueue: function (filename) {
        var theTemplate = new String(this.listTemplate).substitute({
            name: filename,
            id: filename
        });
        var item = new Jx.ListItem({template:theTemplate, enabled: true});

        $(item).getElement('.jxUploadFileDelete').addEvent('click', function(){
            this.listView.remove(item);
            this.file.remove(filename);
            if (this.listView.list.count() == 0) {
                this.uploadBtn.setEnabled(false);
            }
        }.bind(this));
        this.listView.add(item);

        if (!this.uploadBtn.isEnabled()) {
            this.uploadBtn.setEnabled(true);
        }

    },
    /**
     * Method: upload
     * Called when the user clicks the upload button. Runs the upload process.
     */
    upload: function () {

        this.file.addEvents({
            'fileUploadBegin': this.fileUploadBegin ,
            'fileUploadComplete': this.fileUploadComplete,
            'allUploadsComplete': this.allUploadsComplete,
            'fileUploadError': this.fileUploadError,
            'fileUploadProgress': this.fileUploadProgress,
            'fileUploadProgressError': this.fileUploadError
        });


        this.file.upload();
    },

    fileUploadBegin: function (filename) {
        if (this.options.file.progress) {
            //progressbar
            //setup options
            // TODO: should (at least some of) these options be available to
            // the developer?
            var options = $merge({},this.options.progressOptions);
            options.progressText = options.progressText.substitute({filename: filename});
            options.template = options.template.substitute({id: filename});
            this.pb = new Jx.Progressbar(options);
            var item = document.id(filename);
            this.oldContents = item;
            this.listView.replace(item,$(this.pb));
        } else {
            var icon = document.id(filename).getElement('.jxUploadFileDelete')
            icon.addClass('jxUploadFileProgress').set('title','File Uploading...');
        }
    },

    /**
     * Method: fileUploadComplete
     * Called when a single file is uploaded completely .
     *
     * Parameters:
     * data - the data returned from the event
     * filename - the filename of the file we're tracking
     */
    fileUploadComplete: function (data, file) {
        if ($defined(data.success) && data.success ){
            this.removeUploadedFile(file);
        } else {
            this.fileUploadError(data, file);
        }
    },
    /**
     * Method: fileUploadError
     * Called when there is an error uploading a file.
     *
     * Parameters:
     * data - the data passed back from the server, if any.
     * file - the file we're tracking
     */
    fileUploadError: function (data, filename) {

        if (this.options.file.progress) {
            //show this old contents...
            this.listView.replace(document.id(filename),this.oldContents);
        }
        var icon = document.id(filename).getElement('.jxUploadFileDelete');
        icon.erase('title');
        if (icon.hasClass('jxUploadFileProgress')) {
            icon.removeClass('jxUploadFileProgress').addClass('jxUploadFileError');
        } else {
            icon.addClass('jxUploadFileError');
        }
        if ($defined(data.error) && $defined(data.error.message)) {
            var tt = new Jx.Tooltip(icon, data.error.message, {
                cssClass : 'jxUploadFileErrorTip'
            });
        }
    },
    /**
     * Method: removeUploadedFile
     * Removes the passed file from the upload queue upon it's completion.
     *
     * Parameters:
     * file - the file we're tracking
     */
    removeUploadedFile: function (filename) {

        if (this.options.removeOnComplete) {
           this.listView.remove(document.id(filename));
        } else {
            if (this.options.file.progress) {
                this.listView.replace(document.id(filename),this.oldContents);
            }
            var l = document.id(filename).getElement('.jxUploadFileDelete');
            if (l.hasClass('jxUploadFileDelete')) {
                l.addClass('jxUploadFileComplete');
            } else if (l.hasClass('jxUploadFileProgress')) {
                l.removeClass('jxUploadFileProgress').addClass('jxUploadFileComplete');
            }
        }

        this.fireEvent('fileUploadComplete', filename);
    },
    /**
     * Method: fileUploadProgress
     * Function to pass progress information to the progressbar instance
     * in the file. Only used if we're tracking progress.
     */
    fileUploadProgress: function (data, file) {
        if (this.options.progress) {
            this.pb.update(data.total, data.current);
        }
    },
    /**
     * Method: allUploadCompleted
     * Called when the Jx.Field.File completes uploading
     * all files. Sets upload button to disabled and fires the allUploadCompleted
     * event.
     */
    allUploadsComplete: function () {
        this.uploadBtn.setEnabled(false);
        this.fireEvent('allUploadsCompleted',this);
    },
    /**
     * Method: createText
     * handle change in language
     */
    changeText: function (lang) {
      this.parent();
      if ($defined(this.uploadBtn)) {
        this.uploadBtn.setLabel({set:'Jx',key:'upload',value:'buttonText'});
      }
    }
});
/*
---

name: Jx.Column

description: A representation of a single grid column

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Column]

...
 */
// $Id$
/**
 * Class: Jx.Column
 *
 * Extends: <Jx.Object>
 *
 * The class used for defining columns for grids.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Column = new Class({

    Family: 'Jx.Column',
    Extends: Jx.Widget,

    options: {
        /**
         * Option: renderMode
         * The mode to use in rendering this column to determine its width.
         * Valid options include
         *
         * fit - auto calculates the width for the best fit to the text. This
         *      is the default.
         * fixed - uses the value passed in the width option, doesn't
         *      auto calculate.
         * expand - uses the value in the width option as a minimum width and
         *      allows this column to expand and take up any leftover space.
         *      NOTE: there can be only 1 expand column in a grid. The
         *      Jx.Columns object will only take the first column with this
         *      option as the expanding column. All remaining columns marked
         *      "expand" will be treated as "fixed".
         */
        renderMode: 'fixed',
        /**
         * Option: width
         * Determines the width of the column when using 'fixed' rendering mode
         * or acts as a minimum width when using 'expand' mode.
         */
        width: 100,

        /**
         * Option: isEditable
         * allows/disallows editing of the column contents
         */
        isEditable: false,
        /**
         * Option: isSortable
         * allows/disallows sorting based on this column
         */
        isSortable: false,
        /**
         * Option: isResizable
         * allows/disallows resizing this column dynamically
         */
        isResizable: false,
        /**
         * Option: isHidden
         * determines if this column can be shown or not
         */
        isHidden: false,
        /**
         * Option: name
         * The name given to this column
         */
        name: '',

        /**
         * Option: template
         */
        template: null,
        /**
         * Option: renderer
         * an instance of a Jx.Grid.Renderer to use in rendering the content
         * of this column or a config object for creating one like so:
         *
         * (code)
         * {
         *     name: 'Text',
         *     options: { ... renderer options ... }
         * }
         */
        renderer: null
    },

    classes: $H({
      domObj: 'jxGridCellContent'
    }),

    /**
     * Property: grid
     * holds a reference to the grid (an instance of <Jx.Grid>)
     */
    grid: null,

    parameters: ['options','grid'],

    /**
     * Constructor: Jx.Column
     * initializes the column object
     */
    init : function () {

        this.name = this.options.name;

        //adjust header for column
        if (!$defined(this.options.template)) {
            this.options.template = '<span class="jxGridCellContent">' + this.name.capitalize() + '</span>';
        }

        this.parent();
        if ($defined(this.options.grid) && this.options.grid instanceof Jx.Grid) {
            this.grid = this.options.grid;
        }

        //check renderer
        if (!$defined(this.options.renderer)) {
            //set a default renderer
            this.options.renderer = new Jx.Grid.Renderer.Text({
                textTemplate: '{' + this.name + '}'
            });
        } else {
            if (!(this.options.renderer instanceof Jx.Grid.Renderer)) {
                var t = Jx.type(this.options.renderer);
                if (t === 'object') {
                    if(!$defined(this.options.renderer.options.textTemplate)) {
                      this.options.renderer.options.textTemplate = '{' + this.name + '}';
                    }
                    if(!$defined(this.options.renderer.name)) {
                      this.options.renderer.name = 'Text';
                    }
                    this.options.renderer = new Jx.Grid.Renderer[this.options.renderer.name.capitalize()](
                            this.options.renderer.options);
                }
            }
        }

        this.options.renderer.setColumn(this);
    },

    getTemplate: function(idx) {
      return "<span class='jxGridCellContent' title='{col"+idx+"}'>{col"+idx+"}</span>";
    },

    /**
     * APIMethod: getHeaderHTML
     */
    getHeaderHTML : function () {
      if (this.isSortable() && !this.sortImage) {
        this.sortImage = new Element('img', {
            src: Jx.aPixel.src
        });
        this.sortImage.inject(this.domObj);
      } else {
        if (!this.isSortable() && this.sortImage) {
          this.sortImage.dispose();
          this.sortImage = null;
        }
      }
      return this.domObj;
    },

    setWidth: function(newWidth, asCellWidth) {
        asCellWidth = $defined(asCellWidth) ? asCellWidth : false;

        var delta = this.cellWidth - this.width;
        if (!asCellWidth) {
          this.width = parseInt(newWidth,10);
          this.cellWidth = this.width + delta;
          this.options.width = newWidth;
        } else {
            this.width = parseInt(newWidth,10) - delta;
            this.cellWidth = newWidth;
            this.options.width = this.width;
        }
      if (this.rule && parseInt(this.width,10) >= 0) {
          this.rule.style.width = parseInt(this.width,10) + "px";
      }
      if (this.cellRule && parseInt(this.cellWidth,10) >= 0) {
          this.cellRule.style.width = parseInt(this.cellWidth,10) + "px";
      }
    },

    /**
     * APIMethod: getWidth
     * return the width of the column
     */
    getWidth: function () {
      return this.width;
    },

    /**
     * APIMethod: getCellWidth
     * return the cellWidth of the column
     */
    getCellWidth: function() {
      return this.cellWidth;
    },

    /**
     * APIMethod: calculateWidth
     * returns the width of the column.
     *
     * Parameters:
     * rowHeader - flag to tell us if this calculation is for the row header
     */
    calculateWidth : function (rowHeader) {
        //if this gets called then we assume that we want to calculate the width
      rowHeader = $defined(rowHeader) ? rowHeader : false;
      var maxWidth,
          maxCellWidth,
          store = this.grid.getStore(),
          t,
          s,
          oldPos,
          text,
          klass;
      store.first();
      if ((this.options.renderMode == 'fixed' ||
           this.options.renderMode == 'expand') &&
          store.valid()) {
        t = new Element('span', {
          'class': 'jxGridCellContent',
          html: 'a',
          styles: {
            width: this.options.width
          }
        });
        s = this.measure(t,'jxGridCell');
        maxWidth = s.content.width;
        maxCellWidth = s.cell.width;
      } else {
          //calculate the width
          oldPos = store.getPosition();
          maxWidth = maxCellWidth = 0;
          while (store.valid()) {
              //check size by placing text into a TD and measuring it.
              this.options.renderer.render();
              text = document.id(this.options.renderer);
              klass = 'jxGridCell';
              if (this.grid.row.useHeaders()
                      && this.options.name === this.grid.row
                      .getRowHeaderColumn()) {
                  klass = 'jxGridRowHead';
              }
              s = this.measure(text, klass, rowHeader, store.getPosition());
              if (s.content.width > maxWidth) {
                  maxWidth = s.content.width;
              }
              if (s.cell.width > maxCellWidth) {
                maxCellWidth = s.cell.width;
              }
              if (store.hasNext()) {
                  store.next();
              } else {
                  break;
              }
          }

          //check the column header as well (unless this is the row header)
          if (!(this.grid.row.useHeaders() &&
              this.options.name === this.grid.row.getRowHeaderColumn())) {
              klass = 'jxGridColHead';
              if (this.isEditable()) {
                  klass += ' jxColEditable';
              }
              if (this.isResizable()) {
                  klass += ' jxColResizable';
              }
              if (this.isSortable()) {
                  klass += ' jxColSortable';
              }
              s = this.measure(this.domObj.clone(), klass);
              if (s.content.width > maxWidth) {
                  maxWidth = s.content.width;
              }
              if (s.cell.width > maxCellWidth) {
                maxCellWidth = s.cell.width;
              }
          }
      }

      this.width = maxWidth;
      this.cellWidth = maxCellWidth;
      store.moveTo(oldPos);
      return this.width;
    },
    /**
     * Method: measure
     * This method does the dirty work of actually measuring a cell
     *
     * Parameters:
     * text - the text to measure
     * klass - a string indicating and extra classes to add so that
     *          css classes can be taken into account.
     * rowHeader -
     * row -
     */
    measure : function (text, klass, rowHeader, row) {
        var d = new Element('span', {
            'class' : klass
        }),
        s;
        text.inject(d);
        //d.setStyle('height', this.grid.row.getHeight(row));
        d.setStyles({
            'visibility' : 'hidden',
            'width' : 'auto'
        });

        d.inject(document.body, 'bottom');
        s = d.measure(function () {
            var el = this;
            //if not rowHeader, get size of innner span
            if (!rowHeader) {
                el = el.getFirst();
            }
            return {
              content: el.getMarginBoxSize(),
              cell: el.getMarginBoxSize()
            };
        });
        d.destroy();
        return s;
    },
    /**
     * APIMethod: isEditable
     * Returns whether this column can be edited
     */
    isEditable : function () {
        return this.options.isEditable;
    },
    /**
     * APIMethod: isSortable
     * Returns whether this column can be sorted
     */
    isSortable : function () {
        return this.options.isSortable;
    },
    /**
     * APIMethod: isResizable
     * Returns whether this column can be resized
     */
    isResizable : function () {
        return this.options.isResizable;
    },
    /**
     * APIMethod: isHidden
     * Returns whether this column is hidden
     */
    isHidden : function () {
        return this.options.isHidden;
    },
    /**
     * APIMethod: isAttached
     * returns whether this column is attached to a store.
     */
    isAttached: function () {
        return this.options.renderer.attached;
    },

    /**
     * APIMethod: getHTML
     * calls render method of the renderer object passed in.
     */
    getHTML : function () {
        this.options.renderer.render();
        return document.id(this.options.renderer);
    }

});/*
---

name: Jx.Columns

description: A container for defining and holding individual columns

license: MIT-style license.

requires:
 - Jx.Column
 - Jx.Object

provides: [Jx.Columns]

...
 */
// $Id$
/**
 * Class: Jx.Columns
 *
 * Extends: <Jx.Object>
 *
 * This class is the container for all columns needed for a grid. It
 * consolidates many functions that didn't make sense to put directly
 * in the column class. Think of it as a model for columns.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Columns = new Class({

  Family: 'Jx.Columns',
    Extends : Jx.Object,

    options : {
        /**
         * Option: headerRowHeight
         * the default height of the header row. Set to null or 'auto' to
         * have this class attempt to figure out a suitable height.
         */
        headerRowHeight : 20,
        /**
         * Option: useHeaders
         * Determines if the column headers should be displayed or not
         */
        useHeaders : false,
        /**
         * Option: columns
         * an array holding all of the column instances or objects containing
         * configuration info for the column
         */
        columns : []
    },
    /**
     * Property: columns
     * an array holding the actual instantiated column objects
     */
    columns : [],
    
    /**
     * Property: rowTemplate
     * a string holding a template for a single row of cells to be populated
     * when rendering the store into a grid.  The template is constructed from
     * the individual column templates once the store has been loaded.
     */
    rowTemplate: null,

    parameters: ['options','grid'],
    /**
     * Property: hasExpandable
     * boolean indicates whether any of the columns are expandable or not,
     * which affects some calculations for column widths
     */
    hasExpandable: null,

    /**
     * APIMethod: init
     * Creates the class.
     */
    init : function () {
        this.parent();

        if ($defined(this.options.grid) && 
            this.options.grid instanceof Jx.Grid) {
          this.grid = this.options.grid;
        }

        this.hasExpandable = false;

        this.options.columns.each(function (col) {
            //check the column to see if it's a Jx.Grid.Column or an object
            if (col instanceof Jx.Column) {
                this.columns.push(col);
            } else if (Jx.type(col) === "object") {
                this.columns.push(new Jx.Column(col,this.grid));
            }
            var c = this.columns[this.columns.length - 1 ];
        }, this);
        
        this.buildTemplates();
    },
    
    /**
     * APIMethod: addColumns
     * add new columns to the columns object after construction.  Causes
     * the template to change.
     * 
     * Parameters:
     * columns - {Array} an array of columns to add
     */
    addColumns: function(columns) {
      this.columns.extend(columns);
      this.buildTemplates();
    },
    
    /**
     * Method: buildTemplates
     * create the row template based on the current columns
     */
    buildTemplates: function() {
      if (!this.grid) {
        return;
      }
      var rowTemplate = '',
          hasExpandable = false,
          grid = this.grid,
          row = grid.row,
          rhc = grid.row.useHeaders() ? this.getByName(row.options.headerColumn) : null,
          colTemplate;
      
      this.columns.each(function(col, idx) {
        var colTemplate = '';
        if (!col.isHidden() && col != rhc) {
          hasExpandable |= col.options.renderMode == 'expand';
          if (!col.options.renderer || !col.options.renderer.domInsert) {
            colTemplate = col.getTemplate(idx);
          }
          rowTemplate += "<td class='jxGridCell jxGridCol"+idx+" jxGridCol"+col.options.name+"'>" + colTemplate + "</td>";
        }
      });
      if (!hasExpandable) {
        rowTemplate += "<td><span class='jxGridCellUnattached'></span></td>";
      }
      this.rowTemplate = rowTemplate;
      this.hasExpandable = hasExpandable;
    },
    /**
     * APIMethod: getHeaderHeight
     * returns the height of the column header row
     *
     * Parameters:
     * recalculate - determines if we should recalculate the height. Currently
     * does nothing.
     */
    getHeaderHeight : function (recalculate) {
        if (!$defined(this.height) || recalculate) {
            if ($defined(this.options.headerRowHeight)
                    && this.options.headerRowHeight !== 'auto') {
                this.height = this.options.headerRowHeight;
            } //else {
                //figure out a height.
            //}
        }
        return this.height;
    },
    /**
     * APIMethod: useHeaders
     * returns whether the grid is/should display headers or not
     */
    useHeaders : function () {
        return this.options.useHeaders;
    },
    /**
     * APIMethod: getByName
     * Used to get a column object by the name of the column
     *
     * Parameters:
     * colName - the name of the column
     */
    getByName : function (colName) {
        var ret;
        this.columns.each(function (col) {
            if (col.name === colName) {
                ret = col;
            }
        }, this);
        return ret;
    },
    /**
     * APIMethod: getByField
     * Used to get a column by the model field it represents
     *
     *  Parameters:
     *  field - the field name to search by
     */
    getByField : function (field) {
        var ret;
        this.columns.each(function (col) {
            if (col.options.modelField === field) {
                ret = col;
            }
        }, this);
        return ret;
    },
    /**
     * APIMethod: getByGridIndex
     * Used to get a column when all you know is the cell index in the grid
     *
     * Parameters:
     * index - an integer denoting the placement of the column in the grid
     * (zero-based)
     */
    getByGridIndex : function (index) {
        var headers = this.options.useHeaders ? 
                        this.grid.colTableBody.getFirst().getChildren() :
                        this.grid.gridTableBody.getFirst().getChildren();
        var cell = headers[index];
          var hClasses = cell.get('class').split(' ').filter(function (cls) {
            if(this.options.useHeaders)
              return cls.test('jxColHead-');
            else
              return cls.test('jxCol-');
          }.bind(this));
        var parts = hClasses[0].split('-');
        return this.getByName(parts[1]);
    },

    /**
     * APIMethod: getHeaders
     * Returns a row with the headers in it.
     *
     * Parameters:
     * row - the row to add the headers to.
     */
    getHeaders : function (tr) {
      var grid = this.grid,
          row = grid.row,
          rhc = grid.row.useHeaders() ? this.getByName(row.options.headerColumn) : null;
      if (this.useHeaders()) {
        this.columns.each(function(col, idx) {
          if (!col.isHidden() && col != rhc) {
            var classes = ['jxGridColHead', 'jxGridCol'+idx, 'jxCol-'+col.options.name, 'jxColHead-'+col.options.name],
                th;
            if (col.isEditable()) { classes.push('jxColEditable'); }
            if (col.isResizable()) { classes.push('jxColResizable'); }
            if (col.isSortable()) { classes.push('jxColSortable'); }
            th = new Element('th', {
              'class': classes.join(' ')
            });
            th.store('jxCellData', {
              column: col,
              colHeader: true,
              index: idx
            });
            th.adopt(col.getHeaderHTML());
            th.inject(tr);
          }
        });
        if (!this.hasExpandable) {
          new Element('th', {
            'class': 'jxGridColHead jxGridCellUnattached'
          }).inject(tr);
        }
      }
    },
    
    /**
     * Method: getRow
     * create a single row in the grid for a single record and populate
     * the DOM elements for it.
     *
     * Parameters:
     * tr - {DOMElement} the TR element to insert the row into
     * record - {<Jx.Record>} the record to create the row for
     */
    getRow: function(tr, record) {
      var data = {},
          grid = this.grid,
          store = grid.store,
          row = grid.row,
          rhc = grid.row.useHeaders() ? 
                     this.getByName(row.options.headerColumn) : null,
          domInserts = [],
          i = 0;
      this.columns.each(function(column, index) {
        if (!column.isHidden() && column != rhc) {
          if (column.options.renderer && column.options.renderer.domInsert) {
            domInserts.push({column: column, index: i});
          } else {
            var renderer = column.options.renderer,
                formatter = renderer.options.formatter,
                text = '';
            if (renderer.options.textTemplate) {
              text = store.fillTemplate(null, renderer.options.textTemplate, renderer.columnsNeeded);
            } else {
              text = record.data.get(column.name);
            }
            if (formatter) {
              text = formatter.format(text);
            }
            data['col'+index] = text;
          }
          i++;
        }
      });
      tr.set('html', this.rowTemplate.substitute(data));
      domInserts.each(function(obj) {
        tr.childNodes[obj.index].adopt(obj.column.getHTML());
      });
    },

    /**
     * APIMethod: calculateWidths
     * force calculation of column widths.  For columns with 'fit' this will
     * cause the column to test every value in the store to compute the
     * optimal width of the column.  Columns marked as 'expand' will get
     * any extra space left over between the column widths and the width
     * of the grid container (if any).
     */
    calculateWidths: function () {
      //to calculate widths we loop through each column
      var expand = null,
          totalWidth = 0,
          rowHeaderWidth = 0,
          gridSize = this.grid.contentContainer.getContentBoxSize(),
          leftOverSpace = 0;
      this.columns.each(function(col,idx){
        //are we checking the rowheader?
        var rowHeader = false;
        // if (col.name == this.grid.row.options.headerColumn) {
        //   rowHeader = true;
        // }
        //if it's fixed, set the width to the passed in width
        if (col.options.renderMode == 'fixed') {
          col.calculateWidth(); //col.setWidth(col.options.width);
          
        } else if (col.options.renderMode == 'fit') {
          col.calculateWidth(rowHeader);
        } else if (col.options.renderMode == 'expand' && !$defined(expand)) {
          expand = col;
        } else {
          //treat it as fixed if has width, otherwise as fit
          if ($defined(col.options.width)) {
            col.setWidth(col.options.width);
          } else {
            col.calculateWidth(rowHeader);
          }
        }
        if (!col.isHidden() /* && !(col.name == this.grid.row.options.headerColumn) */) {
            totalWidth += Jx.getNumber(col.getCellWidth());
            if (rowHeader) {
                rowHeaderWidth = col.getWidth();
            }
        }
      },this);
      
      // width of the container
      if (gridSize.width > totalWidth) {
        //now figure the expand column
        if ($defined(expand)) {
          // var leftOverSpace = gridSize.width - totalWidth + rowHeaderWidth;
          leftOverSpace = gridSize.width - totalWidth;
          //account for right borders in firefox...
          if (Browser.Engine.gecko) {
            leftOverSpace -= this.getColumnCount(true);
          } else {
            // -2 is for the right hand border on the cell and the table for all other browsers
            leftOverSpace -= 2;
          }
          if (leftOverSpace >= expand.options.width) {
            //in order for this to be set properly the cellWidth must be the
            //leftover space. we need to figure out the delta value and
            //subtract it from the leftover width
            expand.options.width = leftOverSpace;
            expand.calculateWidth();
            expand.setWidth(leftOverSpace, true);
            totalWidth += leftOverSpace;
          } else {
            expand.setWidth(expand.options.width);
          }
        }
      }
      this.grid.gridObj.setContentBoxSize({'width': totalWidth});
      this.grid.colObj.setContentBoxSize({'width': totalWidth});
    },

    /**
     * Method: createRules
     * create CSS rules for the current grid object
     */
    createRules: function(styleSheet, scope) {
      var autoRowHeight = this.grid.row.options.rowHeight == 'auto';
      this.columns.each(function(col, idx) {
        var selector = scope+' .jxGridCol'+idx,
            dec = '';
        if (autoRowHeight) {
          //set the white-space to 'normal !important'
          dec = 'white-space: normal !important';
        }
        col.cellRule = Jx.Styles.insertCssRule(selector, dec, styleSheet);
        col.cellRule.style.width = col.getCellWidth() + "px";

        selector = scope+" .jxGridCol" + idx + " .jxGridCellContent";
        col.rule = Jx.Styles.insertCssRule(selector, dec, styleSheet);
        col.rule.style.width = col.getWidth() + "px";
      }, this);
    },

    updateRule: function(column) {
        var col = this.getByName(column);
        if (col.options.renderMode === 'fit') {
          col.calculateWidth();
        }
        col.rule.style.width = col.getWidth() + "px";
        col.cellRule.style.width = col.getCellWidth() + "px";
    },
    
    /**
     * APIMethod: getColumnCount
     * returns the number of columns in this model (including hidden).
     */
    getColumnCount : function (noHidden) {
        noHidden = $defined(noHidden) ? false : true;
        var total = this.columns.length;
        if (noHidden) {
            this.columns.each(function(col){
                if (col.isHidden()) {
                    total -= 1;
                }
            },this);
        }
        return total;
    },
    /**
     * APIMethod: getIndexFromGrid
     * Gets the index of a column from its place in the grid.
     *
     * Parameters:
     * name - the name of the column to get an index for
     */
    getIndexFromGrid : function (name) {
        var headers = this.options.useHeaders ? 
                        this.grid.colTableBody.getFirst().getChildren() :
                        this.grid.gridTableBody.getFirst().getChildren(),
            c,
            i = -1,
            self = this;
        headers.each(function (h) {
            i++;
            var hClasses = h.get('class').split(' ').filter(function (cls) {
                if(self.options.useHeaders)
                  return cls.test('jxColHead-');
                else
                  return cls.test('jxCol-');
            });
            hClasses.each(function (cls) {
                if (cls.test(name)) {
                    c = i;
                }
            });
        }, this);
        return c;
    }

});
/*
---

name: Jx.Row

description: Holds information related to display of rows in the grid.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Row]

...
 */
// $Id$
/**
 * Class: Jx.Row
 *
 * Extends: <Jx.Object>
 *
 * A class defining a grid row.
 *
 * Inspired by code in the original Jx.Grid class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Row = new Class({

  Family: 'Jx.Row',
    Extends : Jx.Object,

    options : {
        /**
         * Option: useHeaders
         * defaults to false.  If set to true, then a column of row header
         * cells are displayed.
         */
        useHeaders : false,
        /**
         * Option: alternateRowColors
         * defaults to false.  If set to true, then alternating CSS classes
         * are used for rows.
         */
        alternateRowColors : false,
        /**
         * Option: rowClasses
         * object containing class names to apply to rows
         */
        rowClasses : {
            odd : 'jxGridRowOdd',
            even : 'jxGridRowEven',
            all : 'jxGridRowAll'
        },
        /**
         * Option: rowHeight
         * The height of the row. Make it null or 'auto' to auto-calculate.
         */
        rowHeight : 20,
        /**
         * Option: headerWidth
         * The width of the row header. Make it null or 'auto' to auto-calculate
         */
        headerWidth : 40,
        /**
         * Option: headerColumn
         * The name of the column in the model to use as the header
         */
        headerColumn : null
    },
    /**
     * Property: grid
     * A reference to the grid that this row model belongs to
     */
    grid : null,
    /**
     * Property: heights
     * This will hold the calculated height of each row in the grid.
     */
    heights: [],
    /**
     * Property: rules
     * A hash that will hold all of the CSS rules for the rows.
     */
    rules: $H(),

    parameters: ['options','grid'],

    /**
     * APIMethod: init
     * Creates the row model object.
     */
    init : function () {
        this.parent();

        if ($defined(this.options.grid) && this.options.grid instanceof Jx.Grid) {
            this.grid = this.options.grid;
        }
    },
    /**
     * APIMethod: getGridRowElement
     * Used to create the TR for the main grid row
     */
    getGridRowElement : function (row, text) {
        var o = this.options,
            rc = o.rowClasses,
            c = o.alternateRowColors ?(row % 2 ? rc.even : rc.odd) : rc.all,
            tr = new Element('tr', {
              'class' : 'jxGridRow'+row+' '+ c,
              html: text || ''
            });
        return tr;
    },
    /**
     * Method: getRowHeaderCell
     * creates the TH for the row's header
     */
    getRowHeaderCell : function (text) {
      text = text ? '<span class="jxGridCellContent">'+text + '</span>' : '';
      return new Element('th', {
        'class' : 'jxGridRowHead',
        html: text
      });
    },
    /**
     * APIMethod: getRowHeaderWidth
     * determines the row header's width.
     */
    getRowHeaderWidth : function () {
      var col, width;
      if (this.options.headerColumn) {
        col = this.grid.columns.getByName(this.options.headerColumn);
        if (!$defined(col.getWidth())) {
          col.calculateWidth(true);
        }
        width = col.getWidth();
      } else {
        width = this.options.headerWidth;
      }
      return width;
    },

    /**
     * APIMethod: getHeight
     * determines and returns the height of a row
     */
    getHeight : function (row) {
      var h = this.options.rowHeight,
          rowEl;
      //this should eventually compute a height, however, we would need
      //a fixed width to do so reliably. For right now, we use a fixed height
      //for all rows.
      if ($defined(this.heights[row])) {
        h = this.heights[row];
      } else if ($defined(this.options.rowHeight)) {
        if (this.options.rowHeight == 'auto') {
          // this.calculateHeight(row);
          h = 20; // TODO calculate?
          rowEl = this.grid.gridTableBody.rows[row]
          if (rowEl) {
            h = rowEl.getContentBoxSize().height; 
          }
        } else if (Jx.type(this.options.rowHeight) !== 'number') {
          h = 20; // TODO calculate?
        }
      }
      return h;
    },
    /**
     * Method: calculateHeights
     */
    calculateHeights : function () {
      if (this.options.rowHeight === 'auto' ||
          !$defined(this.options.rowHeight)) {
        //grab all rows in the grid body
        document.id(this.grid.gridTableBody).getChildren().each(function(row){
          row = document.id(row);
          var data = row.retrieve('jxRowData');
          var s = row.getContentBoxSize();
          this.heights[data.row] = s.height;
        },this);
        document.id(this.grid.rowTableHead).getChildren().each(function(row){
          row = document.id(row);
          var data = row.retrieve('jxRowData');
          if (data) {
            var s = row.getContentBoxSize();
            this.heights[data.row] = Math.max(this.heights[data.row],s.height);
            if (Browser.Engine.webkit) {
                //for some reason webkit (Safari and Chrome)
                this.heights[data.row] -= 1;
            }
          }
        },this);
      } else {
        document.id(this.grid.rowTableHead).getChildren().each(function(row,idx){
          this.heights[idx] = this.options.rowHeight;
        }, this);
      }
    },

    /**
     * APIMethod: useHeaders
     * determines and returns whether row headers should be used
     */
    useHeaders : function () {
        return this.options.useHeaders;
    },
    /**
     * APIMethod: getRowHeader
     * creates and returns the header for the current row
     *
     * Parameters:
     * list - Jx.List instance to add the header to
     */
    getRowHeader : function (list) {
        var th = this.getRowHeaderCell();
        //if (this.grid.model.getPosition() === 0) {
        //    var rowWidth = this.getRowHeaderWidth();
        //    th.setStyle("width", rowWidth);
        //}
        th.store('jxCellData', {
            rowHeader: true,
            row: this.grid.model.getPosition()
        });
        list.add(th);
    },
    /**
     * APIMethod: getRowHeaderColumn
     * returns the name of the column that is used for the row header
     */
    getRowHeaderColumn : function () {
        return this.options.headerColumn;
    }
});
/*
---

name: Jx.Plugin

description: Base class for all plugins

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Plugin]

...
 */
// $Id$
/**
 * Class: Jx.Plugin
 *
 * Extend: <Jx.Object>
 *
 * Base class for all plugins. In order for a plugin to be used it must
 * extend from this class.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin = new Class({

    Family: "Jx.Plugin",

    Extends: Jx.Object,

    options: {},

    /**
     * APIMethod: attach
     * Empty method that must be overridden by subclasses. It is
     * called by the user of the plugin to setup the plugin for use.
     */
    attach: function(obj){
        obj.registerPlugin(this);
    },

    /**
     * APIMethod: detach
     * Empty method that must be overridden by subclasses. It is
     * called by the user of the plugin to remove the plugin.
     */
    detach: function(obj){
        obj.deregisterPlugin(this);
    },

    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - the language being changed to or that had it's data set of
     *    translations changed.
     */
    changeText: function (lang) {
        //if the mask is being used then recreate it. The code will pull
        //the new text automatically
        if (this.busy) {
            this.setBusy(false);
            this.setBusy(true);
        }
    }
});/*
---

name: Jx.Plugin.Grid

description: Namespace for grid plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Grid]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid
 * Grid plugin namespace
 *
 *
 * License:
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid = {};/*
---

name: Jx.Grid

description: A tabular control that has fixed scrolling headers on the rows and columns like a spreadsheet.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Styles
 - Jx.Layout
 - Jx.Columns
 - Jx.Row
 - Jx.Plugin.Grid
 - Jx.Store
 - Jx.List

provides: [Jx.Grid]

css:
 - grid

images:
 - table_col.png
 - table_row.png

...
 */
// $Id$
/**
 * Class: Jx.Grid
 *
 * Extends: <Jx.Widget>
 *
 * A tabular control that has fixed, optional, scrolling headers on the rows
 * and columns like a spreadsheet.
 *
 * Jx.Grid is a tabular control with convenient controls for resizing columns,
 * sorting, and inline editing.  It is created inside another element,
 * typically a div.  If the div is resizable (for instance it fills the page
 * or there is a user control allowing it to be resized), you must call the
 * resize() method of the grid to let it know that its container has been
 * resized.
 *
 * When creating a new Jx.Grid, you can specify a number of options for the
 * grid that control its appearance and functionality. You can also specify
 * plugins to load for additional functionality. Currently Jx provides the
 * following plugins
 *
 * Prelighter - prelights rows, columns, and cells
 * Selector - selects rows, columns, and cells
 * Sorter - sorts rows by specific column
 * Editor - allows editing of cells if the column permits editing
 *
 * Jx.Grid renders data that comes from an external source.  This external
 * source, called the store, must be a Jx.Store or extended from it.
 *
 * Events:
 * gridCellEnter(cell, list) - called when the mouse enters a cell
 * gridCellLeave(cell, list) - called when the mouse leaves a cell
 * gridCellClick(cell) - called when a cell is clicked
 * gridRowEnter(cell, list) - called when the mouse enters a row header
 * gridRowLeave(cell, list) - called when the mouse leaves a row header
 * gridRowClick(cell) - called when a row header is clicked
 * gridColumnEnter(cell, list) - called when the mouse enters a column header
 * gridColumnLeave(cell, list) - called when the mouse leaves a column header
 * gridColumnClick(cell) - called when a column header is clicked
 * gridMouseLeave() - called when the mouse leaves the grid at any point.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Grid = new Class({
  Family : 'Jx.Grid',
  Extends: Jx.Widget,
  Binds: ['storeLoaded', 'clickColumnHeader', 'moveColumnHeader', 'clickRowHeader', 'moveRowHeader', 'clickCell', 'dblclickCell', 'moveCell', 'leaveGrid', 'resize', 'drawStore', 'scroll', 'addRow', 'removeRow', 'removeRows', 'updateRow', 'storeChangesCompleted'],

  /**
   * Property: pluginNamespace
   * the required variable for plugins
   */
  pluginNamespace: 'Grid',
  
  options: {
    /**
     * Option: parent
     * the HTML element to create the grid inside. The grid will resize
     * to fill the domObj.
     */
    parent: null,
    
    template: "<div class='jxWidget'><div class='jxGridContainer jxGridRowCol'></div><div class='jxGridContainer jxGridColumnsContainer'><table class='jxGridTable jxGridHeader jxGridColumns'><thead class='jxGridColumnHead'></thead></table></div><div class='jxGridContainer jxGridHeader jxGridRowContainer'><table class='jxGridTable jxGridRows'><thead class='jxGridRowBody'></thead></table></div><div class='jxGridContainer jxGridContentContainer'><table class='jxGridTable jxGridContent'><tbody class='jxGridTableBody'></tbody></table></div></div>",
    
    /**
     * Options: columns
     * an object consisting of a columns array that defines the individuals
     * columns as well as containing any options for Jx.Grid.Columns or
     * a Jx.Grid.Columns object itself.
     */
    columns: null,
    
    /**
     * Option: row
     * Either a Jx.Grid.Row object or a json object defining options for
     * the class
     */
    row : null,

    /**
     * Option: store
     * An instance of Jx.Store
     */
    store: null
  },
   
  classes: $H({
    domObj: 'jxWidget',
    columnContainer: 'jxGridColumnsContainer',
    colObj: 'jxGridColumns',
    colTableBody: 'jxGridColumnHead',
    rowContainer: 'jxGridRowContainer',
    rowObj: 'jxGridRows',
    rowColContainer: 'jxGridRowCol',
    rowTableBody: 'jxGridRowBody',
    contentContainer: 'jxGridContentContainer',
    gridObj: 'jxGridContent',
    gridTableBody: 'jxGridTableBody'
  }),
  
  /**
   * Property: columns
   * holds a reference to the columns object
   */
  columns: null,
  
  /**
   * Property: row
   * Holds a reference to the row object
   */
  row: null,
  
  parameters: ['store', 'options'],
  
  /**
   * Property: store
   * holds a reference to the <Jx.Store> that is the store for this
   * grid
   */
  store: null,
  
  /**
   * Property: styleSheet
   * the name of the dynamic style sheet to use for manipulating styles
   */
  styleSheet: 'JxGridStyles',
  
  /**
   * Property: hooks
   * a {Hash} of event names for tracking which events have actually been attached
   * to the grid.
   */
  hooks: null,
  
  /**
   * Property: uniqueId
   * an auto-generated id that is assigned as a class name to the grid's
   * container for scoping generated CSS rules to just this grid
   */
  uniqueId: null,
  
  /**
   * Constructor: Jx.Grid
   */
  init: function() {
    this.uniqueId = this.generateId('jxGrid_');
    this.store = this.options.store;
    var options = this.options,
        opts;

    if ($defined(options.row)) {
      if (options.row instanceof Jx.Row) {
        this.row = options.row;
        this.row.grid = this;
      } else if (Jx.type(options.row) == 'object') {
        this.row = new Jx.Row($extend({grid: this}, options.row));
      }
    } else {
      this.row = new Jx.Row({grid: this});
    }

    if ($defined(options.columns)) {
        if (options.columns instanceof Jx.Columns) {
            this.columns = options.columns;
            this.columns.grid = this;
        } else if (Jx.type(options.columns) === 'object') {
            this.columns = new Jx.Columns($extend({grid:this}, options.columns));
        }
    } else {
      this.columns = new Jx.Columns({grid: this});
    }
    
    this.hooks = $H({
      'gridScroll': false,
      'gridColumnEnter': false,
      'gridColumnLeave': false,
      'gridColumnClick': false,
      'gridRowEnter': false,
      'gridRowLeave': false,
      'gridRowClick': false,
      'gridCellClick': false,
      'gridCellDblClick': false,
      'gridCellEnter': false,
      'gridCellLeave': false,
      'gridMouseLeave': false
    });
    
    this.storeEvents = {
      'storeDataLoaded': this.storeLoaded,
      // 'storeSortFinished': this.drawStore,
      'storeRecordAdded': this.addRow,
      'storeColumnChanged': this.updateRow,
      'storeRecordRemoved': this.removeRow,
      'storeMultipleRecordsRemoved': this.removeRows,
      'storeChangesCompleted': this.storeChangesCompleted
    };
    
    
    this.parent();
  },
  
  wantEvent: function(eventName) {
    var hook = this.hooks.get(eventName);
    if (hook === false) {
      switch(eventName) {
        case 'gridColumnEnter':
        case 'gridColumnLeave':
          this.colObj.addEvent('mousemove', this.moveColumnHeader);
          this.hooks.set({
            'gridColumnEnter': true,
            'gridColumnLeave': true
          });
          break;
        case 'gridColumnClick':
          this.colObj.addEvent('click', this.clickColumnHeader);
          this.hooks.set({
            'gridColumnClick': true
          });
          break;
        case 'gridRowEnter':
        case 'gridRowLeave':
          this.rowObj.addEvent('mousemove', this.moveRowHeader);
          this.hooks.set({
            'gridRowEnter': true,
            'gridRowLeave': true
          });
          break;
        case 'gridRowClick':
          this.rowObj.addEvent('click', this.clickRowHeader);
          this.hooks.set({
            'gridRowClick': true
          });
          break;
        case 'gridCellEnter':
        case 'gridCellLeave':
          this.gridObj.addEvent('mousemove', this.moveCell);
          this.hooks.set({
            'gridCellEnter': true,
            'gridCellLeave': true
          });
          break;
        case 'gridCellClick':
          this.gridObj.addEvent('click', this.clickCell);
          this.hooks.set('gridCellClick', true);
          break;
        case 'gridCellDblClick':
          this.gridObj.addEvent('dblclick', this.dblclickCell);
          this.hooks.set('gridCellDblClick', true);
          break;
        case 'gridMouseLeave':
          this.rowObj.addEvent('mouseleave', this.leaveGrid);
          this.colObj.addEvent('mouseleave', this.leaveGrid);
          this.gridObj.addEvent('mouseleave', this.leaveGrid);
          this.hooks.set('gridMouseLeave', true);
          break;
        case 'gridScroll':
          this.contentContainer.addEvent('scroll', this.scroll);
        default:
          break;
      }
    }
  },
  
  /**
   * Method: scroll
   * handle the grid scrolling by updating the position of the headers
   */
  scroll : function () {
      this.columnContainer.scrollLeft = this.contentContainer.scrollLeft;
      this.rowContainer.scrollTop = this.contentContainer.scrollTop;
  },
  
  /**
   * APIMethod: render
   * Create the grid for the current model
   */
  render: function() {
    if (this.domObj) {
      this.redraw();
      return;
    }
    this.parent();
    var store = this.store;
    
    this.domObj.addClass(this.uniqueId);
    new Jx.Layout(this.domObj, {
      onSizeChange: this.resize
    });
    
    if (store instanceof Jx.Store) {
      store.addEvents(this.storeEvents);
      if (store.loaded) {
        this.storeLoaded(store);
      }
    }
    if (!this.columns.useHeaders()) {
      this.columnContainer.dispose();
    } else {
      this.wantEvent('gridScroll');
    }
    
    if (!this.row.useHeaders()) {
      this.rowContainer.dispose();
    } else {
      this.wantEvent('gridScroll');
    }

    this.contentContainer.setStyle('overflow', 'auto');
    
    // todo: very hacky!  can plugins 'wantEvent' between init and render?
    this.hooks.each(function(value, key) {
      if (value) {
        this.hooks.set(key, false);
        this.wantEvent(key);
      }
    }, this);
    
    if (document.id(this.options.parent)) {
      this.addTo(this.options.parent);
      this.resize();
    }
  },
  
  /**
   * APIMethod: resize
   * resize the grid to fit inside its container.  This involves knowing
   * something about the model it is displaying (the height of the column
   * header and the width of the row header) so nothing happens if no model is
   * set
   */
  resize: function() {
    var p = this.domObj.getParent(),
        parentSize = p.getSize(),
        colHeaderHeight = 0,
        rowHeaderWidth = 0;
    
    if (this.columns.useHeaders()) {
      colHeaderHeight = this.columns.getHeaderHeight();
    }
    
    if (this.row.useHeaders()) {
      rowHeaderWidth = this.row.getRowHeaderWidth();
    }
    
    this.rowColContainer.setBorderBoxSize({
        width : rowHeaderWidth,
        height : colHeaderHeight
    });
    
    this.columnContainer.setStyles({
      top: 0,
      left: rowHeaderWidth
    }).setBorderBoxSize({
      width: parentSize.x - rowHeaderWidth,
      height: colHeaderHeight
    });

    this.rowContainer.setStyles({
      top: colHeaderHeight,
      left: 0
    }).setBorderBoxSize({
      width: rowHeaderWidth,
      height: parentSize.y - colHeaderHeight
    });

    this.contentContainer.setStyles({
      top: colHeaderHeight,
      left: rowHeaderWidth
    }).setBorderBoxSize({
      width: parentSize.x - rowHeaderWidth,
      height: parentSize.y - colHeaderHeight
    });
  },
  
  /**
   * APIMethod: setStore
   * set the store for the grid to display.  If a store is attached to the
   * grid it is removed and the new store is displayed.
   *
   * Parameters:
   * store - {Object} the store to use for this grid
   */
  setStore: function(store) {
    if (this.store) {
      this.store.removeEvents(this.storeEvents);
    }
    if (store instanceof Jx.Store) {
      this.store = store;
      store.addEvents(this.storeEvents);
      if (store.loaded) {
        this.storeLoaded(store);
      }
      this.render();
      this.domObj.resize();
    } else {
      this.destroyGrid();
    }
  },
  
  /**
   * APIMethod: getStore
   * gets the store set for this grid.
   */
  getStore: function() { 
    return this.store;
  },
  
  storeLoaded: function(store) {
    this.redraw();
  },
  
  /**
   */
  storeChangesCompleted: function(results) {
    if (results && results.successful) {
      
    }
  },
  
  redraw: function() {
    var store = this.store,
        template = '',
        tr,
        columns = [],
        useRowHeaders = this.row.useHeaders();
    this.fireEvent('beginCreateGrid');
    
    this.gridObj.getElement('tbody').empty();
    
    this.hoverColumn = this.hoverRow = this.hoverCell = null;
    
    // TODO: consider moving whole thing into Jx.Columns ??
    // create a suitable column representation for everything
    // in the store that doesn't already have a representation
    store.options.columns.each(function(col, index) {
      if (!this.columns.getByName(col.name)) {
        var renderer = new Jx.Grid.Renderer.Text(),
            format = $defined(col.format) ? col.format : null,
            template = "<span class='jxGridCellContent'>"+ ($defined(col.label) ? col.label : col.name).capitalize() + "</span>",
            column;
        if ($defined(col.renderer)) {
          if ($type(col.renderer) == 'string') {
            if (Jx.Grid.Renderer[col.renderer.capitalize()]) {
              renderer = new Jx.Grid.Renderer[col.renderer.capitalize()]();
            }
          } else if ($type(col.renderer) == 'object' && 
                     $defined(col.renderer.type) && 
                     Jx.Grid.Renderer[col.renderer.type.capitalize()]) {
            renderer = new Jx.Grid.Renderer[col.renderer.type.capitalize()](col.renderer);
          }
        }
        if (format) {
          if ($type(format) == 'string' && 
              $defined(Jx.Formatter[format.capitalize()])) {
            renderer.options.formatter = new Jx.Formatter[format.capitalize()]();
          } else if ($type(format) == 'object' && 
                     $defined(format.type) && 
                     $defined(Jx.Formatter[format.type.capitalize()])) {
             renderer.options.formatter = new Jx.Formatter[format.type.capitalize()](format);
          }
        }
        column = new Jx.Column({
          grid: this,
          template: template,
          renderMode: $defined(col.renderMode) ? col.renderMode : $defined(col.width) ? 'fixed' : 'fit',
          width: $defined(col.width) ? col.width : null,
          isEditable: $defined(col.editable) ? col.editable : false,
          isSortable: $defined(col.sortable) ? col.sortable : false,
          isResizable: $defined(col.resizable) ? col.resizable : false,
          isHidden: $defined(col.hidden) ? col.hidden : false,
          name: col.name || '',
          renderer: renderer 
        });
        columns.push(column);
      }
    }, this);
    this.columns.addColumns(columns);
    if (this.columns.useHeaders()) {
      tr = new Element('tr');
      this.columns.getHeaders(tr);
      tr.adopt(new Element('th', {
        'class': 'jxGridColHead',
        'html': '&nbsp',
        styles: {
          width: 1000
        }
      }))
      this.colObj.getElement('thead').empty().adopt(tr);
    }
    this.columns.calculateWidths();
    this.columns.createRules(this.styleSheet+'Columns', '.'+this.uniqueId);
    this.drawStore();
    this.fireEvent('doneCreateGrid');
  },
  
  /**
   * APIMethod: addRow
   * Adds a row to the table. Can add to either the beginning or the end 
   * based on passed flag
   */
  addRow: function (store, record, position) {
    if (this.store.loaded) {
      if (position === 'bottom') {
        this.store.last();
      } else {
        this.store.first();
      }
      this.drawRow(record, this.store.index, position);
    }
  },
  
  /**
   * APIMethod: updateRow
   * update a single row in the grid
   *
   * Parameters:
   * index - the row to update
   */
  updateRow: function(index) {
    var record = this.store.getRecord(index);
    this.drawRow(record, index, 'replace');
  },
  
  /**
   * APIMethod: removeRow
   * remove a single row from the grid
   *
   * Parameters:
   * store
   * index
   */
  removeRow: function (store, index) {
    this.gridObj.deleteRow(index);
    this.rowObj.deleteRow(index);
  },
  
  /**
   * APIMethod: removeRows
   * removes multiple rows from the grid
   *
   * Parameters:
   * store
   * index
   */
  removeRows: function (store, first, last) {
    for (var i = first; i <= last; i++) {
        this.removeRow(store, first);
    }
  },
  
  /**
   * APIMethod: setColumnWidth
   * set the width of a column in pixels
   *
   * Parameters:
   * column
   * width
   */
  setColumnWidth: function(column, width) {
    if (column) {
      column.width = width;
      if (column.rule) {
        column.rule.style.width = width + 'px';
      }
      if (column.cellRule) {
        column.cellRule.style.width = width + 'px';
      }
    }
  },
  
  /**
   * Method: drawStore
   * clears the grid and redraws the store.  Does not draw the column headers,
   * that is handled by the render() method
   */
  drawStore: function() {
    var useHeaders = this.row.useHeaders(), 
        blank;
    this.domObj.resize();
    this.gridTableBody.empty();
    if (useHeaders) {
      this.rowTableBody.empty();
    }
    this.store.each(function(record,index) {
      this.store.index = index;
      this.drawRow(record, index);
    }, this);
    if (useHeaders) {
      blank = new Element('tr', {
        styles: { height: 1000 }
      });
      blank.adopt(new Element('th', {
        'class':'jxGridRowHead', 
        html: '&nbsp'
      }));
      this.rowTableBody.adopt(blank);
    }
  },
  
  /**
   * Method: drawRow
   * this method does the heavy lifting of drawing a single record into the
   * grid
   *
   * Parameters:
   * record - {Jx.Record} the record to render
   * index - {Integer} the row index of the record in the store
   * position - {String} 'top' or 'bottom' (default 'bottom') position to put
   *     the new row in the grid.
   */
  drawRow: function(record, index, position) {
    var columns = this.columns,
        body = this.gridTableBody,
        row = this.row,
        store = this.store,
        rowHeaders = row.useHeaders(),
        autoRowHeight = row.options.rowHeight == 'auto',
        rowBody = this.rowTableBody,
        rowHeaderColumn,
        rowHeaderColumnIndex,
        renderer,
        formatter, 
        getData,
        tr,
        th,
        text = index + 1,
        rh;
    if (!$defined(position) || !['top','bottom','replace'].contains(position)) {
      position = 'bottom';
    }
    tr = row.getGridRowElement(index, '');
    if (position == 'replace' && index < body.childNodes.length) {
      tr.inject(body.childNodes[index], 'after');
      body.childNodes[index].dispose();
    } else {
      tr.inject(body, position);
    }
    columns.getRow(tr, record);
    if (rowHeaders) {
      if (row.options.headerColumn) {
        rowHeaderColumn = columns.getByName(row.options.headerColumn);
        renderer = rowHeaderColumn.options.renderer;
        if (!renderer.domInsert) {
          formatter = rowHeaderColumn.options.formatter;
          rowHeaderColumnIndex = columns.columns.indexOf(rowHeaderColumn);
          getData = function(record) {
            var data = {},
                text = '';
            if (renderer.options.textTemplate) {
              text = store.fillTemplate(null, renderer.options.textTemplate, renderer.columnsNeeded);
            } else {
              text = record.data.get(rowHeaderColumn.name);
            }
            data['col'+rowHeaderColumnIndex] = text;
            return data;
          };
          text = rowHeaderColumn.getTemplate(rowHeaderColumnIndex).substitute(getData(record));
        } else {
          text = '';
        }
      }
      th = row.getRowHeaderCell(text);
      if (row.options.headerColumn && renderer.domInsert) {
        th.adopt(rowHeaderColumn.getHTML());
      }
      rh = new Element('tr').adopt(th);
      if (position == 'replace' && index < rowBody.childNodes.length) {
        rh.inject(rowBody.childNodes[index], 'after');
        rowBody.childNodes[index].dispose();
      } else {
        rh.inject(rowBody, position);
      }
      if (autoRowHeight) {
        // th.setBorderBoxSize({height: tr.childNodes[0].getBorderBoxSize().height});
        rh.setBorderBoxSize({height: tr.getBorderBoxSize().height});
      }
    }
    this.fireEvent('gridDrawRow', [index, record]);
  },
  
  /**
   * Method: clickColumnHeader
   * handle clicks on the column header
   */
  clickColumnHeader: function(e) {
    var target = e.target;
    if (target.getParent('thead')) {
      target = target.tagName == 'TH' ? target : target.getParent('th');
      this.fireEvent('gridColumnClick', target);
    }
  },
  
  /**
   * Method: moveColumnHeader
   * handle the mouse moving over the column header
   */
  moveColumnHeader: function(e) {
    var target = e.target;
    target = target.tagName == 'TH' ? target : target.getParent('th.jxGridColHead');
    if (target) {
      if (this.hoverColumn != target) {
        if (this.hoverColumn) {
          this.fireEvent('gridColumnLeave', this.hoverColumn);
        }
        if (!target.hasClass('jxGridColHead')) {
          this.leaveGrid(e);
        } else {
          this.hoverColumn = target;
          this.fireEvent('gridColumnEnter', target);
        }
      }
    }
  },

  /**
   * Method: clickRowHeader
   * handle clicks on the row header
   */
  clickRowHeader: function(e) {
    var target = e.target;
    if (target.getParent('tbody')) {
      target = target.tagName == 'TH' ? target : target.getParent('th');
      this.fireEvent('gridRowClick', target);
    }
  },
  
  /**
   * Method: moveRowHeader
   * handle the mouse moving over the row header
   */
  moveRowHeader: function(e) {
    var target = e.target;
    target = target.tagName == 'TH' ? target : target.getParent('th.jxGridRowHead');
    if (target) {
      if (this.hoverRow != target) {
        if (this.hoverRow) {
          this.fireEvent('gridRowLeave', this.hoverRow);
        }
        if (!target.hasClass('jxGridRowHead')) {
          this.leaveGrid(e);
        } else {
          this.hoverRow = target;
          this.fireEvent('gridRowEnter', target);
        }
      }
    }
  },
  
  /**
   * Method: clickCell
   * handle clicks on cells in the grid
   */
  clickCell: function(e) {
    var target = e.target;
    if (target.getParent('tbody')) {
      target = target.tagName == 'TD' ? target : target.getParent('td');
      this.fireEvent('gridCellClick', target);
    }
  },
  
  /**
   * Method: dblclickCell
   * handle doubleclicks on cells in the grid
   */
  dblclickCell: function(e) {
    var target = e.target;
    if (target.getParent('tbody')) {
      target = target.tagName == 'TD' ? target : target.getParent('td');
      this.fireEvent('gridCellDblClick', target);
    }
  },
  
  /**
   * Method: moveCell
   * handle the mouse moving over cells in the grid
   */
  moveCell: function(e) {
    var target = e.target,
        data,
        body,
        row,
        index,
        column;
    target = target.tagName == 'TD' ? target : target.getParent('td.jxGridCell');
    if (target) {
      if (this.hoverCell != target) {
        if (this.hoverCell) {
          this.fireEvent('gridCellLeave', this.hoverCell);
        }
        if (!target.hasClass('jxGridCell')) {
          this.leaveGrid(e);
        } else {
          this.hoverCell = target;
          this.getCellData(target);
          this.fireEvent('gridCellEnter', target);
        }
      }
    }
  },
  
  getCellData: function(cell) {
    var data = null,
        index,
        column,
        row;
    if (!cell.hasClass('jxGridCell')) {
      cell = cell.getParent('td.jxGridCell');
    }
    if (cell) {
      body = this.gridTableBody;
      row = body.getChildren().indexOf(cell.getParent('tr'));
      this.columns.columns.some(function(col,idx){
        if (cell.hasClass('jxGridCol'+idx)) {
          index = idx;
          column = col;
          return true;
        }
        return false;
      });
      data = {
        row: row,
        column: column,
        index: index
      };
      cell.store('jxCellData', data);
    }
    return data;
  },
  
  /**
   * Method: leaveGrid
   * handle the mouse leaving the grid
   */
  leaveGrid: function(e) {
    this.hoverCell = null;
    this.fireEvent('gridMouseLeave');
  },
  
  /**
   * Method: changeText
   * rerender the grid when the language changes
   */
  changeText : function(lang) {
      this.parent();
      this.render();
  },
  
  /**
   * Method: addEvent
   * override default addEvent to also trigger wanting the event
   * which will then cause the underlying events to be registered
   */
  addEvent: function(name, fn) {
    this.wantEvent(name);
    this.parent(name, fn);
  }
});
/*
---

name: Jx.Grid.Renderer

description: Base class for all renderers. Used to create the contents of column.

license: MIT-style license.

requires:
 - Jx.Grid

provides: [Jx.Grid.Renderer]

...
 */
/**
 * Class: Jx.Grid.Renderer
 * This is the base class and namespace for all grid renderers.
 * 
 * Extends: <Jx.Widget>
 * We extended Jx.Widget to take advantage of templating support.
 */
Jx.Grid.Renderer = new Class({
  
  Family: 'Jx.Grid.Renderer',
  Extends: Jx.Widget,
  
  parameters: ['options'],
  
  options: {
    deferRender: true,
    /**
     * Option: template
     * The template for rendering this cell. Will be processed as per
     * the Jx.Widget standard.
     */
    template: '<span class="jxGridCellContent"></span>'
  },
    /**
     * APIProperty: attached
     * tells whether this renderer is used in attached mode
     * or not. Should be set by renderers that get a reference to
     * the store.
     */
  attached: null,
  
  /**
   * Property: domInsert
   * boolean, indicates if the renderer needs to insert a DOM element
   * instead of just outputing some templated HTML.  Renderers that
   * do use domInsert will be slower.
   */
  domInsert: false,

  classes: $H({
    domObj: 'jxGridCellContent'
  }),

  column: null,

  init: function () {
    this.parent();
    this.attached = false;
  },
  
  render: function () {
    this.parent();
  },
  
  setColumn: function (column) {
    if (column instanceof Jx.Column) {
      this.column = column;
    }
  }
  
});/*
---

name: Jx.Grid.Renderer.Text

description: Renders data as straight text.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer

provides: [Jx.Grid.Renderer.Text]

...
 */
/**
 * Class: Jx.Grid.Renderer.Text
 * This is the default renderer for grid cells. It works the same as the
 * original column implementation. It needs a store, a field name, and an
 * optional formatter as well as other options.
 *
 * Extends: <Jx.Grid.Renderer>
 *
 */
Jx.Grid.Renderer.Text = new Class({

  Family: 'Jx.Grid.Renderer.Text',
  Extends: Jx.Grid.Renderer,

  options: {
        /**
         * Option: formatter
         * an instance of <Jx.Formatter> or one of its subclasses which
         * will be used to format the data in this column. It can also be
         * an object containing the name (This should be the part after
         * Jx.Formatter in the class name. For instance, to get a currency
         * formatter, specify 'Currency' as the name.) and options for the
         * needed formatter (see individual formatters for options).
         * (code)
         * {
         *    name: 'formatter name',
         *    options: {}
         * }
         * (end)
         */
        formatter: null,
        /**
         * Option: textTemplate
         * Will be used for creating the text that goes iside the template. Use
         * placeholders for indicating the field(s). You can add as much text
         * as you want. for example, if you wanted to display someone's full
         * name that is brokem up in the model with first and last names you
         * can write a template like '{lastName}, {firstName}' and as long as
         * the text between { and } are field names in the store they will be
         * substituted properly.
         */
        textTemplate: null,
        /**
         * Option: css
         * A string or function to use in adding classes to the text
         */
        css: null
  },

  store: null,

  columnsNeeded: null,

  init: function () {
      this.parent();
      var options = this.options,
          t;
      //check the formatter
      if ($defined(options.formatter) &&
          !(options.formatter instanceof Jx.Formatter)) {
          t = Jx.type(options.formatter);
          if (t === 'object') {
              // allow users to leave the options object blank
              if(!$defined(options.formatter.options)) {
                  options.formatter.options = {};
              }
              options.formatter = new Jx.Formatter[options.formatter.name](
                      options.formatter.options);
          }
      }
  },

  setColumn: function (column) {
    this.parent();

    this.store = column.grid.getStore();
    this.attached = true;

    if ($defined(this.options.textTemplate)) {
      this.columnsNeeded = this.store.parseTemplate(this.options.textTemplate);
    }
  },

  render: function () {
    this.parent();

    var text = '';
    if ($defined(this.options.textTemplate)) {
        if (!$defined(this.columnsNeeded) || (Jx.type(this.columnsNeeded) === 'array' && this.columnsNeeded.length === 0)) {
            this.columnsNeeded = this.store.parseTemplate(this.options.textTemplate);
        }
        text = this.store.fillTemplate(null,this.options.textTemplate,this.columnsNeeded);
    }
    if ($defined(this.options.formatter)) {
        text = this.options.formatter.format(text);
    }

    this.domObj.set('html',text);

    if ($defined(this.options.css) && Jx.type(this.options.css) === 'function') {
      this.domObj.addClass(this.options.css.run(text));
    } else if ($defined(this.options.css) && Jx.type(this.options.css) === 'string'){
      this.domObj.addClass(this.options.css);
    }

  }

});/*
---

name: Jx.Grid.Renderer.Checkbox

description: Renders a checkbox in a column. Can be connected to a store column or as a standalone check column.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer
 - Jx.Field.Checkbox

provides: [Jx.Grid.Renderer.Checkbox]

...
 */
/**
 * Class: Jx.Grid.Renderer.CheckBox
 * Renders a checkbox into the cell. Allows options for connecting the cell
 * to a model field and propogating changes back to the store.
 * 
 * Extends: <Jx.Grid.Renderer>
 * 
 */
Jx.Grid.Renderer.Checkbox = new Class({
  
  Family: 'Jx.Grid.Renderer.Checkbox',
  Extends: Jx.Grid.Renderer,
  
  Binds: ['onBlur','onChange'],
  
  options: {
    useStore: false,
    field: null,
    updateStore: false,
    checkboxOptions: {
      template : '<input class="jxInputContainer jxInputCheck" type="checkbox" name="{name}"/>',
      name: ''
    }
  },
  
  domInsert: true,
  
  init: function () {
    this.parent();
  },
  
  render: function () {
    this.parent();
    var checkbox = new Jx.Field.Checkbox(this.options.checkboxOptions);
    this.domObj.adopt(document.id(checkbox));
    
    if (this.options.useStore) {
      //set initial state
      checkbox.setValue(this.store.get(this.options.field));
    }
    
    //hook up change and blur events to change store field
    checkbox.addEvents({
      'blur': this.onBlur,
      'change': this.onChange
    });
  },
  
  setColumn: function (column) {
    this.column = column;
    
    if (this.options.useStore) {
      this.store = this.column.grid.getStore();
      this.attached = true;
    }
  },
  
  onBlur: function (field) {
    if (this.options.updateStore) {
      this.updateStore(field);
    }
    this.column.grid.fireEvent('checkBlur',[this.column, field]);
  },
  
  onChange: function (field) {
    if (this.options.updateStore) {
      this.updateStore(field);
    }
    this.fireEvent('change',[this.column, field]);
  },
  
  updateStore: function (field) {
    var newValue = field.getValue();
    
    var data = document.id(field).getParent().retrieve('jxCellData');
    var row = data.row;
    
    if (this.store.get(this.options.field, row) !== newValue) {
      this.store.set(this.options.field, newValue, row);
    }
  }
  
  
});/*
---

name: Jx.Grid.Renderer.Button

description: "Renders one or more buttons in a single column.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer
 - Jx.Button


provides: [Jx.Grid.Renderer.Button]

...
 */
/**
 * Class: Jx.Grid.Renderer.Button
 * Renders a <Jx.Button> into the cell. You can add s many buttons as you'd like per column by passing button configs
 * in as an array option to options.buttonOptions
 *
 * Extends: <Jx.Grid.Renderer>
 *
 */
Jx.Grid.Renderer.Button = new Class({

    Family: 'Jx.Grid.Renderer.Button',
    Extends: Jx.Grid.Renderer,

    Binds: [],

    options: {
        template: '<span class="buttons"></span>',
        /**
         * Option: buttonOptions
         * an array of option configurations for <Jx.Button>
         */
        buttonOptions: null
    },
    
    domInsert: true,

    classes:  $H({
        domObj: 'buttons'
    }),

    init: function () {
        this.parent();
    },

    render: function () {
        this.parent();

        $A(this.options.buttonOptions).each(function(opts){
            var button = new Jx.Button(opts);
            this.domObj.grab(document.id(button));
        },this);

    }
});/*
---

name: Jx.Plugin.Grid.Selector

description: Allows selecting rows, columns, and cells in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Selector]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Selector
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to select rows, columns, and/or cells.
 *
 * Original selection code from Jx.Grid's original class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Selector = new Class({

    Family: 'Jx.Plugin.Grid.Selector',
    Extends : Jx.Plugin,
    
    name: 'Selector',

    Binds: ['select','checkSelection','checkAll','afterGridRender','onCellClick', 'sort', 'updateCheckColumn', 'updateSelectedRows'],

    options : {
        /**
         * Option: cell
         * determines if cells are selectable
         */
        cell : false,
        /**
         * Option: row
         * determines if rows are selectable
         */
        row : false,
        /**
         * Option: column
         * determines if columns are selectable
         */
        column : false,
        /**
         * Option: multiple
         * Allow multiple selections
         */
        multiple: false,
        /**
         * Option: useCheckColumn
         * Whether to use a check box column as the row header or as the
         * first column in the grid and use it for manipulating selections.
         */
        useCheckColumn: false,
        /**
         * Option: checkAsHeader
         * Determines if the check column is the header of the rows
         */
        checkAsHeader: false,
        /**
         * Option: sortableColumn
         * Determines if the check column is sortable
         */
        sortableColumn: false
    },
    
    domInsert: true,
    
    /**
     * Property: selected
     * Holds arrays of selected rows and/or columns and their headers
     */
    selected: null,

    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.selected = $H({
            cells: [],
            columns: [],
            rows: [],
            rowHeads: [],
            columnHeads: []
        });
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     *
     * Parameters:
     * grid - The instance of Jx.Grid to attach to
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }
        this.parent(grid);
        var options = this.options,
            template;
        this.grid = grid;
        
        this.grid.addEvent('gridSortFinished', this.updateSelectedRows);
        
        //setup check column if needed
        if (options.useCheckColumn) {
          grid.addEvent('gridDrawRow', this.updateCheckColumn);
          template = '<span class="jxGridCellContent">';
          if (options.multiple) {
            template += '<span class="jxInputContainer jxInputContainerCheck"><input class="jxInputCheck" type="checkbox" name="checkAll" id="checkAll"/></span>';
          } else {
            template += '</span>';
          }

          template += "</span>";

          this.checkColumn = new Jx.Column({
            template: template,
            renderMode: 'fixed',
            width: 20,
            renderer: null,
            name: 'selection',
            isSortable: options.sortableColumn || false,
            sort: options.sortableColumn ? this.sort : null
          }, grid);
          this.checkColumn.options.renderer = this;
          grid.columns.columns.reverse();
          grid.columns.columns.push(this.checkColumn);
          grid.columns.columns.reverse();

          if (options.checkAsHeader) {
              this.oldHeaderColumn = grid.row.options.headerColumn;
              grid.row.options.useHeaders = true;
              grid.row.options.headerColumn = 'selection';

              if (options.multiple) {
                  grid.addEvent('doneCreateGrid', this.afterGridRender);
              }
          }
          //attach event to header
          if (options.multiple) {
              document.id(this.checkColumn).getElement('input').addEvents({
                  'change': this.checkAll
              });
          }
        } else {
          grid.addEvent('gridCellClick', this.onCellClick);
        }
    },
    
    /**
     * Method: render
     * required for the renderer interface
     */
    render: function() {
      this.domObj = new Element('span', {
        'class': 'jxGridCellContent'
      });
      new Element('input', {
        'class': 'jxGridSelector',
        type: 'checkbox',
        events: {
          change: this.checkSelection
        }
      }).inject(this.domObj);
    },
    
    /**
     * Method: toElement
     * required for the Renderer interface
     */
    toElement: function() {
      return this.domObj;
    },
    
    /**
     * Method: updateCheckColumn
     * check to see if a row needs to have its checkbox updated after its been drawn
     *
     * Parameters:
     * index - {Integer} the row that was just rendered
     * record - {<Jx.Record>} the record that was rendered into that row
     */
    updateCheckColumn: function(index, record) {
      var state = this.selected.get('rows').contains(index),
          r = this.grid.gridTableBody.rows,
          tr = document.id((index >= 0 && index < r.length) ? r[index] : null);
      
      if (tr) {
        tr.store('jxRowData', {row: index});
        if (state) {
          tr.addClass('jxGridRowSelected');
        } else {
          tr.removeClass('jxGridRowSelected');
        }
        this.setCheckField(index, state);
      }
    },

    /**
     * Method: afterGridRender
     */
    afterGridRender: function () {
        if (this.options.checkAsHeader) {
            var chkCol = document.id(this.checkColumn).clone();
            chkCol.getElement('input').addEvent('change',this.checkAll);
            this.grid.rowColContainer.adopt(chkCol);
        }
        this.grid.removeEvent('doneCreateGrid',this.afterGridRender);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        var grid = this.grid,
            options = this.options,
            col;
        if (grid) {
            grid.gridTableBody.removeEvents({
              click: this.onCellClick
            });
            if (this.checkColumn) {
                grid.columns.columns.erase(this.checkColumn);
                this.checkColumn.destroy();
                this.checkColumn = null;
            }
            if (options.useCheckColumn) {
                grid.removeEvent('gridDrawRow', this.updateCheckColumn);
                if (options.checkAsHeader) {
                    grid.row.options.headerColumn = this.oldHeaderColumn;
                }
            }
        }
        this.grid.removeEvent('gridSortFinished', this.updateSelectedRows);
        
        this.grid = null;
    },
    /**
     * APIMethod: activate
     * Allows programatic access to turning selections on.
     *
     * Parameters:
     * opt - the option to turn on. One of 'cell', 'column', or 'row'
     */
    activate: function (opt) {
        this.options[opt] = true;
    },
    /**
     * APIMethod: deactivate
     * Allows programatic access to turning selections off.
     *
     * Parameters:
     * opt - the option to turn off. One of 'cell', 'column', or 'row'
     */
    deactivate: function (opt) {
        var gridTableRows = this.grid.gridTableBody.rows,
            selected = this.selected,
            i;
        this.options[opt] = false;
        if (opt === 'cell') {
            selected.get('cells').each(function(cell) {
              cell.removeClass('jxGridCellSelected');
            });
            selected.set('cells',[]);
        } else if (opt === 'row') {
          this.getSelectedRows().each(function(row){
            idx = row.retrieve('jxRowData').row;
            row.removeClass('jxGridRowSelected');
            this.setCheckField(idx,false);
          }, this);
          selected.set('rows',[]);
          selected.get('rowHeads').each(function(rowHead){
            rowHead.removeClass('jxGridRowHeaderSelected');
          });
          selected.set('rowHeads',[]);
        } else {
            selected.get('columns').each(function(column){
                for (i = 0; i < gridTableRows.length; i++) {
                    gridTableRows[i].cells[column].removeClass('jxGridColumnSelected');
                }
            });
            selected.set('columns',[]);

            selected.get('columnHeads').each(function(rowHead){
            rowHead.removeClass('jxGridColumnHeaderSelected');
          },this);
          selected.set('columnHeads',[]);
        }
    },
    
    /**
     * Method: onCellClick
     * dispatch clicking on a table cell
     */
    onCellClick: function(cell) {
        if (cell) {
            this.select(cell);
        }
    },
    
    /**
     * Method: select
     * dispatches the grid click to the various selection methods
     */
    select : function (cell) {
        var data = cell.retrieve('jxCellData'),
            options = this.options,
            col;

        if (options.cell && $defined(data.row) && $defined(data.index)) {
          this.selectCell(cell);
        }
        
        if (options.row && $defined(data.row)) {
            this.selectRow(data.row);
        }

        if (options.column && $defined(data.index)) {
            if (this.grid.row.useHeaders()) {
                this.selectColumn(data.index - 1);
            } else {
                this.selectColumn(data.index);
            }
        }
    },
    
    /**
     * Method: selectCell
     * select a cell
     *
     * Parameters: 
     * cell - {DOMElement} the cell element to select
     */
    selectCell: function(cell) {
        if (!this.options.cell) { return; }
        var cells = this.selected.get('cells');
        if (cell.hasClass('jxGridCellSelected')) {
          cell.removeClass('jxGridCellSelected');
          cells.erase(cell);
          this.fireEvent('unselectCell', cell);
        } else {
          cell.addClass('jxGridCellSelected');
          cells.push(cell);
          this.fireEvent('selectCell', cell);
        }
    },
    
    updateSelectedRows: function() {
      if (!this.options.row) { return; }
      var options = this.options,
          r = this.grid.gridTableBody.rows,
          rows = [];
          
      for (var i=0; i<r.length; i++) {
        if (r[i].hasClass('jxGridRowSelected')) {
          rows.push(i);
        }
      }
      this.selected.set('rows', rows);
    },
    
    /**
     * Method: selectRow
     * Select a row and apply the jxGridRowSelected style to it.
     *
     * Parameters:
     * row - {Integer} the row to select
     */
    selectRow: function (row, silently) {
        if (!this.options.row) { return; }
        var options = this.options,
            r = this.grid.gridTableBody.rows,
            tr = document.id((row >= 0 && row < r.length) ? r[row] : null),
            rows = this.selected.get('rows'),
            silently = $defined(silently) ? silently : false;
        if (tr) {
            if (tr.hasClass('jxGridRowSelected')) {
                tr.removeClass('jxGridRowSelected');
                this.setCheckField(row, false);
                if (options.multiple && options.useCheckColumn) {
                    if (options.checkAsHeader) {
                        document.id(this.grid.rowColContainer).getElement('input').removeProperty('checked');
                    } else {
                        document.id(this.checkColumn).getElement('input').removeProperty('checked');
                    }
                }
                //search array and remove this item
                rows.erase(row);
                if (!silently) {
                  this.fireEvent('unselectRow', row);
                }
            } else {
                tr.store('jxRowData', {row: row});
                rows.push(row);
                tr.addClass('jxGridRowSelected');
                this.setCheckField(row, true);
                if (!silently) {
                  this.fireEvent('selectRow', row);
                }
            }

            if (!this.options.multiple) {
                var unselected = [];
                this.getSelectedRows().each(function(row) {
                  var idx;
                  if (row !== tr) {
                    idx = row.retrieve('jxRowData').row;
                    row.removeClass('jxGridRowSelected');
                    this.setCheckField(idx,false);
                    rows.erase(row);
                    unselected.push(idx);
                    if (!silently) {
                      this.fireEvent('unselectRow', row);
                    }
                  }
                  
                }, this);
                if (unselected.length && !silently) {
                  this.fireEvent('unselectRows', [unselected]);
                }
            }
        }
        this.selectRowHeader(row);
    },

    /**
     * Method: setCheckField
     */
    setCheckField: function (row, checked) {
        var grid = this.grid,
            options = this.options,
            check,
            col,
            cell;
        if (options.useCheckColumn) {
            if (options.checkAsHeader) {
              cell = document.id(grid.rowTableBody.rows[row].cells[0]);
            } else {
              col = grid.columns.getIndexFromGrid(this.checkColumn.name);
              cell = document.id(grid.gridTableBody.rows[row].cells[col]);
            }
            check = cell.getElement('.jxGridSelector');
            check.set('checked', checked);
        }
    },
    /**
     * Method: selectRowHeader
     * Apply the jxGridRowHeaderSelected style to the row header cell of a
     * selected row.
     *
     * Parameters:
     * row - {Integer} the row header to select
     */
    selectRowHeader: function (row) {
        if (!this.grid.row.useHeaders()) {
            return;
        }
        var rows = this.grid.rowTableBody.rows,
            cell = document.id((row >= 0 && row < rows.length) ? 
                              rows[row].cells[0] : null),
            cells;

        if (!cell) {
            return;
        }
        cells = this.selected.get('rowHeads');
        if (cells.contains(cell)) {
            cell.removeClass('jxGridRowHeaderSelected');
            cells.erase(cell);
        } else {
          cell.addClass('jxGridRowHeaderSelected');
          cells.push(cell);
        }

        if (!this.options.multiple) {
          cells.each(function(c){
            if (c !== cell) {
              c.removeClass('jxGridRowHeaderSelected');
              cells.erase(c);
            }
          },this);
        }

    },
    /**
     * Method: selectColumn
     * Select a column.
     * This deselects a previously selected column.
     *
     * Parameters:
     * col - {Integer} the column to select
     */
    selectColumn: function (col) {
        var gridTable = this.grid.gridTableBody,
            cols = this.selected.get('columns'),
            m = '',
            i;
        if (col >= 0 && col < gridTable.rows[0].cells.length) {
            if (cols.contains(col)) {
                //deselect
                m = 'removeClass';
                cols.erase(col);
                this.fireEvent('unselectColumn', col);
            } else {
                //select
                m = 'addClass';
                cols.push(col);
                this.fireEvent('selectColumn', col);
            }
            for (i = 0; i < gridTable.rows.length; i++) {
                gridTable.rows[i].cells[col][m]('jxGridColumnSelected');
            }

            if (!this.options.multiple) {
                cols.each(function(c){
                  if (c !== col) {
                      for (i = 0; i < gridTable.rows.length; i++) {
                          gridTable.rows[i].cells[c].removeClass('jxGridColumnSelected');
                      }
                      cols.erase(c);
                      this.fireEvent('unselectColumn', c);
                  }
                }, this);
            }
            this.selectColumnHeader(col);
        }
    },
    /**
     * method: selectColumnHeader
     * Apply the jxGridColumnHeaderSelected style to the column header cell of a
     * selected column.
     *
     * Parameters:
     * col - {Integer} the column header to select
     */
    selectColumnHeader: function (col) {
        var rows = this.grid.colTableBody;
        if (rows.length === 0 || !this.grid.row.useHeaders()) {
            return;
        }

        var cell = (col >= 0 && col < rows[0].cells.length) ?
            rows[0].cells[col] : null;

        if (cell === null) {
            return;
        }

        cell = document.id(cell);
        cells = this.selected.get('columnHeads');

        if (cells.contains(cell)) {
            cell.removeClass('jxGridColumnHeaderSelected');
            cells.erase(cell);
        } else {
          cell.addClass('jxGridColumnHeaderSelected');
          cells.push(cell);
        }

        if (!this.options.multiple) {
          cells.each(function(c){
            if (c !== cell) {
              c.removeClass('jxGridColumnHeaderSelected');
              cells.erase(c);
            }
          });
        }
    },
    /**
     * Method: checkSelection
     * Checks whether a row's check box is/isn't checked and modifies the
     * selection appropriately.
     *
     * Parameters:
     * column - <Jx.Column> that created the checkbox
     * field - <Jx.Field.Checkbox> instance that was checked/unchecked
     * created the checkbox
     */
    checkSelection: function (event) {
      var cell =  event.target.getParent('tr'),
          row;
      if (cell) {
        row = cell.getParent().getChildren().indexOf(cell);
        this.selectRow(row);
      }
    },
    /**
     * Method: checkAll
     * Checks all checkboxes in the column the selector inserted.
     */
    checkAll: function () {
        var grid = this.grid,
            col,
            rows,
            selection = [],
            checked = this.options.checkAsHeader ? 
                          grid.rowColContainer.getElement('input').get('checked') :
                          this.checkColumn.domObj.getElement('input').get('checked'),
            event = checked ? 'selectRows' : 'unselectRows';

        if (this.options.checkAsHeader) {
            col = 0;
            rows = grid.rowTableBody.rows;
        } else {
            col = grid.columns.getIndexFromGrid(this.checkColumn.name);
            rows = grid.gridTableBody.rows;
        }

        $A(rows).each(function(row, idx) {
            var check = row.cells[col].getElement('input');
            if ($defined(check)) {
                var rowChecked = check.get('checked');
                if (rowChecked !== checked) {
                    this.selectRow(idx, true);
                    selection.push(idx);
                }
            }
        }, this);
        
        this.fireEvent(event, [selection]);
    },
    
    sort: function(dir) {
      var grid = this.grid,
          store = grid.store,
          data = store.data,
          gridTableBody= grid.gridTableBody,
          gridParent = gridTableBody.getParent(),
          useHeaders = grid.row.useHeaders(),
          rowTableBody = grid.rowTableBody,
          rowParent = rowTableBody.getParent(),
          selected = this.getSelectedRows();
      
      // sorting only works for rows and when more than zero are selected
      // in fact it is probably only useful if multiple selections are also enabled
      // but that is not a hard rule for this method
      if (!this.options.row || selected.length == 0) {
        console.log('not sorting by selection, nothing to sort');
        return;
      }
      
      store.each(function(record, index) {
        record.dom = {
          cell: gridTableBody.childNodes[index],
          row: useHeaders ? rowTableBody.childNodes[index] : null
        };
      });

      gridTableBody.dispose();
      if (useHeaders) {
        rowTableBody.dispose();
      }
      selected.sort(function(a,b) {
        return a.retrieve('jxRowData').row - b.retrieve('jxRowData').row;
      }).each(function(row) {
        console.log('moving row ' + row.retrieve('jxRowData').row + ' to beginning of array');
        data.unshift(data.splice(row.retrieve('jxRowData').row,1)[0]);
      });

      if (dir == 'desc') {
        data.reverse();
      }

      store.each(function(record, index) {
        record.dom.cell.inject(gridTableBody);
        record.dom.cell.store('jxRowData', {row: index});
        if (useHeaders) {
          record.dom.row.inject(rowTableBody);
        }
      });

      if (gridParent) {
        gridParent.adopt(gridTableBody);
      }
      if (useHeaders && rowParent) {
        rowParent.adopt(rowTableBody);
      }
    },
    
    getSelectedRows: function() {
      var rows = [],
          selected = this.selected.get('rows'),
          r = this.grid.gridTableBody.rows;
      selected.each(function(row) {
        var tr = document.id((row >= 0 && row < r.length) ? r[row] : null);
        if (tr) {
          rows.push(tr);
        }
      });
      return rows;
    }
});
/*
---

name: Jx.Plugin.Grid.Prelighter

description: Highlights rows, columns, cells, and headers in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Prelighter]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Prelighter
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to prelight rows, columns, and cells
 *
 * Inspired by the original code in Jx.Grid
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Prelighter = new Class({

    Extends : Jx.Plugin,
    
    name: 'Prelighter',
    
    options : {
        /**
         * Option: cell
         * defaults to false.  If set to true, the cell under the mouse is
         * highlighted as the mouse moves.
         */
        cell : false,
        /**
         * Option: row
         * defaults to false.  If set to true, the row under the mouse is
         * highlighted as the mouse moves.
         */
        row : false,
        /**
         * Option: column
         * defaults to false.  If set to true, the column under the mouse is
         * highlighted as the mouse moves.
         */
        column : false,
        /**
         * Option: rowHeader
         * defaults to false.  If set to true, the row header of the row under
         * the mouse is highlighted as the mouse moves.
         */
        rowHeader : false,
        /**
         * Option: columnHeader
         * defaults to false.  If set to true, the column header of the column
         * under the mouse is highlighted as the mouse moves.
         */
        columnHeader : false
    },
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.bound.lighton = this.lighton.bind(this);
        this.bound.lightoff = this.lightoff.bind(this);
        this.bound.mouseleave = this.mouseleave.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the grid
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }
        this.parent(grid);
        this.grid = grid;
        // this.grid.wantEvent('gridCellEnter');
        // this.grid.wantEvent('gridCellLeave');
        // this.grid.wantEvent('gridRowEnter');
        // this.grid.wantEvent('gridRowLeave');
        // this.grid.wantEvent('gridColumnEnter');
        // this.grid.wantEvent('gridColumnLeave');
        // this.grid.wantEvent('gridMouseLeave');
        
        this.grid.addEvent('gridCellEnter', this.bound.lighton);
        this.grid.addEvent('gridCellLeave', this.bound.lightoff);
        this.grid.addEvent('gridRowEnter', this.bound.lighton);
        this.grid.addEvent('gridRowLeave', this.bound.lightoff);
        this.grid.addEvent('gridColumnEnter', this.bound.lighton);
        this.grid.addEvent('gridColumnLeave', this.bound.lightoff);
        this.grid.addEvent('gridMouseLeave', this.bound.mouseleave);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridCellEnter', this.bound.lighton);
            this.grid.removeEvent('gridCellLeave', this.bound.lightoff);
            this.grid.removeEvent('gridRowEnter', this.bound.lighton);
            this.grid.removeEvent('gridRowLeave', this.bound.lightoff);
            this.grid.removeEvent('gridColumnEnter', this.bound.lighton);
            this.grid.removeEvent('gridColumnLeave', this.bound.lightoff);
            this.grid.removeEvent('gridMouseLeave', this.bound.mouseleave);
        }
        this.grid = null;
    },
    /**
     * APIMethod: activate
     * Allows programatic access to turning prelighting on.
     * 
     * Parameters:
     * opt - the option to turn on. One of 'cell', 'row', 'rowHeader', 'column', or 'columnHeader'
     */
    activate: function (opt) {
        this.options[opt] = true;
    },
    /**
     * APIMethod: deactivate
     * Allows programatic access to turning prelighting off.
     * 
     * Parameters:
     * opt - the option to turn off. One of 'cell', 'row', 'rowHeader', 'column', or 'columnHeader'
     */
    deactivate: function (opt) {
        this.options[opt] = false;
    },
    /**
     * Method: lighton
     */
    lighton : function (cell) {
        this.light(cell, true);

    },
    /**
     * Method: lightoff
     */
    lightoff : function (cell) {
        this.light(cell, false);

    },
    /**
     * Method: light
     * dispatches the event to the various prelight methods.
     */
    light: function (cell, on) {
        var parent = cell.getParent(),
            rowIndex = parent.getParent().getChildren().indexOf(parent),
            colIndex = cell.getParent().getChildren().indexOf(cell);

        if (this.options.cell) {
            this.prelightCell(cell, on);
        }
        if (this.options.row) {
            this.prelightRow(rowIndex, on);
        }
        if (this.options.column) {
            this.prelightColumn(colIndex, on);
        }
        if (this.options.rowHeader) {
            this.prelightRowHeader(rowIndex, on);
        }
        if (this.options.columnHeader) {
            this.prelightColumnHeader(colIndex, on);
        }
    },

    /**
     * Method: prelightRowHeader
     * apply the jxGridRowHeaderPrelight style to the header cell of a row.
     * This removes the style from the previously pre-lit row header.
     *
     * Parameters:
     * row - {Integer} the row to pre-light the header cell of
     */
    prelightRowHeader : function (row, on) {
        if ($defined(this.prelitRowHeader) && !on) {
            this.prelitRowHeader.removeClass('jxGridRowHeaderPrelight');
        } else if (on) {
            this.prelitRowHeader = (row >= 0 && row < this.grid.rowTableBody.rows.length) ? this.grid.rowTableBody.rows[row].cells[0] : null;
            if (this.prelitRowHeader) {
                this.prelitRowHeader.addClass('jxGridRowHeaderPrelight');
            }
        }
    },
    /**
     * Method: prelightColumnHeader
     * apply the jxGridColumnHeaderPrelight style to the header cell of a column.
     * This removes the style from the previously pre-lit column header.
     *
     * Parameters:
     * col - {Integer} the column to pre-light the header cell of
     * on - flag to tell if we're lighting on or off
     */
    prelightColumnHeader : function (col, on) {
        if (this.grid.colTableBody.rows.length === 0) {
            return;
        }

        if ($defined(this.prelitColumnHeader) && !on) {
            this.prelitColumnHeader.removeClass('jxGridColumnHeaderPrelight');
        } else if (on) {
            this.prelitColumnHeader = (col >= 0 && col < this.grid.colTableBody.rows[0].cells.length) ? this.grid.colTableBody.rows[0].cells[col] : null;
            if (this.prelitColumnHeader) {
                this.prelitColumnHeader.addClass('jxGridColumnHeaderPrelight');
            }
        }

    },
    /**
     * Method: prelightRow
     * apply the jxGridRowPrelight style to row.
     * This removes the style from the previously pre-lit row.
     *
     * Parameters:
     * row - {Integer} the row to pre-light
     * on - flag to tell if we're lighting on or off
     */
    prelightRow : function (row, on) {
       if ($defined(this.prelitRow) && !on) {
            this.prelitRow.removeClass('jxGridRowPrelight');
        } else if (on) {
            this.prelitRow = (row >= 0 && row < this.grid.gridTableBody.rows.length) ? this.grid.gridTableBody.rows[row] : null;
            if (this.prelitRow) {
                this.prelitRow.addClass('jxGridRowPrelight');
            }
        }
        this.prelightRowHeader(row, on);
    },
    /**
     * Method: prelightColumn
     * apply the jxGridColumnPrelight style to a column.
     * This removes the style from the previously pre-lit column.
     *
     * Parameters:
     * col - {Integer} the column to pre-light
     * on - flag to tell if we're lighting on or off
     */
    prelightColumn : function (col, on) {
        if (col >= 0 && col < this.grid.gridTableBody.rows[0].cells.length) {
            if ($defined(this.prelitColumn) && !on) {
                for (var i = 0; i < this.grid.gridTableBody.rows.length; i++) {
                    this.grid.gridTableBody.rows[i].cells[this.prelitColumn].removeClass('jxGridColumnPrelight');
                }
            } else if (on) {
                this.prelitColumn = col;
                for (i = 0; i < this.grid.gridTableBody.rows.length; i++) {
                    this.grid.gridTableBody.rows[i].cells[col].addClass('jxGridColumnPrelight');
                }
            }
            this.prelightColumnHeader(col, on);
        }
    },
    /**
     * Method: prelightCell
     * apply the jxGridCellPrelight style to a cell.
     * This removes the style from the previously pre-lit cell.
     *
     * Parameters:
     * cell - the cell to lighton/off
     * on - flag to tell if we're lighting on or off
     */
    prelightCell : function (cell, on) {
        if ($defined(this.prelitCell) && !on) {
            this.prelitCell.removeClass('jxGridCellPrelight');
        } else if (on) {
            this.prelitCell = cell;
            if (this.prelitCell) {
                this.prelitCell.addClass('jxGridCellPrelight');
            }
        }
    },
    
    mouseleave: function() {
        //turn off all prelights when the mouse leaves the grid
        if ($defined(this.prelitCell)) {
            this.prelitCell.removeClass('jxGridCellPrelight');
        }
        if ($defined(this.prelitColumn)) {
            for (var i = 0; i < this.grid.gridTableBody.rows.length; i++) {
                this.grid.gridTableBody.rows[i].cells[this.prelitColumn].removeClass('jxGridColumnPrelight');
            }
        }
        if ($defined(this.prelitRow)) {
            this.prelitRow.removeClass('jxGridRowPrelight');
        }
        if ($defined(this.prelitColumnHeader)) {
            this.prelitColumnHeader.removeClass('jxGridColumnHeaderPrelight');
        }
        if ($defined(this.prelitRowHeader)) {
            this.prelitRowHeader.removeClass('jxGridRowHeaderPrelight');
        }
    }
});
/*
---

name: Jx.Plugin.Grid.Sorter

description: Enables column sorting in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Sorter]

images:
 - emblems.png
...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Sorter
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to sort the grid by a single column.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Sorter = new Class({
  Family: 'Jx.Plugin.Grid.Sorter',
  Extends: Jx.Plugin,
  name: 'Sorter',

  Binds: ['sort', 'modifyHeaders'],

  /**
   * Property: current
   * refernce to the currently sorted column
   */
  current: null,

  /**
   * Property: direction
   * tell us what direction the sort is in (either 'asc' or 'desc')
   */
  direction: null,

  options: {
    sortableClass: 'jxColSortable',
    ascendingClass: 'jxGridColumnSortedAsc',
    descendingClass: 'jxGridColumnSortedDesc'
  },

  /**
   * APIMethod: attach
   * Sets up the plugin and attaches the plugin to the grid events it
   * will be monitoring
   */
  attach: function(grid) {
    if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
        return;
    }
    this.parent(grid);

    this.grid = grid;

    // this.grid.wantEvent('gridColumnClick');
    this.grid.addEvent('gridColumnClick', this.sort);
    this.grid.addEvent('doneCreateGrid', this.modifyHeaders);
  },

  /**
   * APIMethod: detach
   */
  detach: function() {
    if (this.grid) {
        this.grid.removeEvent('gridColumnClick', this.sort);
    }
    this.grid = null;
  },

  /**
   * Method: modifyHeaders
   */
  modifyHeaders: function() {
    var grid = this.grid,
        columnTable = grid.colObj,
        store = grid.store,
        c = this.options.sortableClass;
    if (grid.columns.useHeaders()) {
      grid.columns.columns.each(function(col, index) {
        if (!col.isHidden() && col.isSortable()) {
          var th = columnTable.getElement('.jxGridCol'+index);
          th.addClass(c);
        }
      });
    }
  },

  /**
   * Method: sort
   * called when a grid header is clicked.
   *
   * Parameters:
   * cell - The cell clicked
   */
  sort: function(el) {
    var current = this.current,
        grid = this.grid,
        gridTableBody = grid.gridTableBody,
        gridParent = gridTableBody.getParent(),
        rowTableBody = grid.rowTableBody,
        rowParent = rowTableBody.getParent(),
        useHeaders = grid.row.useHeaders(),
        store = grid.store,
        sorter = store.getStrategy('sort'),
        data = el.retrieve('jxCellData'),
        dir = 'asc',
        opt = this.options;
    
    if ($defined(data.column) && data.column.isSortable()){
      if (el.hasClass(opt.ascendingClass)) {
        el.removeClass(opt.ascendingClass).addClass(opt.descendingClass);
        dir = 'desc';
      } else if (el.hasClass(opt.descendingClass)) {
        el.removeClass(opt.descendingClass).addClass(opt.ascendingClass);
      } else {
        el.addClass(opt.ascendingClass);
      }
      if (current && el != current) {
        current.removeClass(opt.ascendingClass).removeClass(opt.descendingClass);
      }
      this.current = el;
      
      this.grid.fireEvent('gridSortStarting');
      
      if ($defined(data.column.options.sort) && Jx.type(data.column.options.sort) == 'function') {
        data.column.options.sort(dir);
      } else {
        if (sorter) {
          gridTableBody.dispose();
          if (useHeaders) {
            rowTableBody.dispose();
          }
          store.each(function(record, index) {
            record.dom = {
              cell: gridTableBody.childNodes[index],
              row: useHeaders ? rowTableBody.childNodes[index] : null
            };
          });
    
          sorter.sort(data.column.name, null, dir);
    
          store.each(function(record, index) {
            record.dom.cell.inject(gridTableBody);
            if (useHeaders) {
              record.dom.row.inject(rowTableBody);
            }
          });
    
          if (gridParent) {
            gridParent.adopt(gridTableBody);
          }
          if (useHeaders && rowParent) {
            rowParent.adopt(rowTableBody);
          }
        }
      }
      this.grid.fireEvent('gridSortFinished');
    }
  }
});/*
---

name: Jx.Plugin.Grid.Resize

description: Enables column resizing in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Resize]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Resize
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to enable dynamic resizing of column width and row height
 *
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Resize = new Class({

    Extends : Jx.Plugin,
    
    name: 'Resize',
    
    Binds: ['createHandles','removeHandles'],
    options: {
        /**
         * Option: column
         * set to true to make column widths resizeable
         */
        column: false,
        /**
         * Option: row
         * set to true to make row heights resizeable
         */
        row: false,
        /**
         * Option: tooltip
         * the tooltip to display for the draggable portion of the
         * cell header, localized with MooTools.lang.get('Jx','plugin.resize').tooltip for default
         */
        tooltip: ''
    },
    /**
     * Property: els
     * the DOM elements by which the rows/columns are resized.
     */
    els: {
      column: [],
      row: []
    },

    /**
     * Property: drags
     * the Drag instances
     */
    drags: {
      column: [],
      row: []
    },

    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the grid
     */
    attach: function (grid) {
      if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
          return;
      }
      this.parent(grid);
      this.grid = grid;
      if (grid.columns.useHeaders()) {
        this.grid.addEvent('doneCreateGrid', this.createHandles);
        this.grid.addEvent('beginCreateGrid', this.removeHandles);
        this.createHandles();
      }
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
      this.parent();
      if (this.grid) {
          this.grid.removeEvent('doneCreateGrid', this.createHandles);
          this.grid.removeEvent('beginCreateGrid', this.removeHandles);
      }
      this.grid = null;
    },

    /**
     * APIMethod: activate
     */
    activate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = true;
        }
        if (this.grid.columns.useHeaders()) {
          this.createHandles();
        }
    },

    /**
     * APIMethod: deactivate
     */
    deactivate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = false;
        }
        this.createHandles();
    },
    /**
     * Method: removeHandles
     * clean up any handles we created
     */
    removeHandles: function() {
        ['column','row'].each(function(option) {
          this.els[option].each(function(el) { el.dispose(); } );
          this.els[option] = [];
          this.drags[option].each(function(drag){ drag.detach(); });
          this.drags[option] = [];
        }, this);
    },
    /**
     * Method: createHandles
     * create handles that let the user drag to resize columns and rows
     */
    createHandles: function() {
      var grid = this.grid,
          store = grid.store;
      this.removeHandles();
      if (this.options.column && grid.columns.useHeaders()) {
        grid.columns.columns.each(function(col, idx) {
          if (col.isResizable() && !col.isHidden()) {
            var colEl = grid.colObj.getElement('.jxGridCol'+idx+ ' .jxGridCellContent');
            var el = new Element('div', {
              'class':'jxGridColumnResize',
              title: this.options.tooltip == '' ? this.getText({set:'Jx',key:'plugin.resize',value:'tooltip'}) : this.getText(this.options.tooltip),
              events: {
                dblclick: function() {
                  // size to fit?
                }
              }
            }).inject(colEl);
            this.els.column.push(el);
            this.drags.column.push(new Drag(el, {
                limit: {y:[0,0]},
                snap: 2,
                onBeforeStart: function(el) {
                  var l = el.getPosition(el.parentNode).x.toInt();
                  el.setStyles({
                    left: l,
                    right: null
                  });

                },
                onStart: function(el) {
                  var l = el.getPosition(el.parentNode).x.toInt();
                  el.setStyles({
                    left: l,
                    right: null
                  });
                },
                onDrag: function(el) {
                    var w = el.getPosition(el.parentNode).x.toInt();
                    col.setWidth(w);
                },
                onComplete: function(el) {
                  el.setStyle('left', null);
                }
            }));
          }
        }, this);
      }
      //if (this.options.row && this.grid.row.useHeaders()) {}
    },
    /**
     * Method: createText
     * respond to a language change by updating the tooltip
     */
    changeText: function (lang) {
      this.parent();
      var txt = this.options.tooltip == '' ? this.getText({set:'Jx',key:'plugin.resize',value:'tooltip'}) : this.getText(this.options.tooltip);
      ['column','row'].each(function(option) {
        this.els[option].each(function(el) { el.set('title',txt); } );
      }, this);
    }
});/*
---

name: Jx.Plugin.Grid.Editor

description: Enables inline editing in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid
 - More/Keyboard

provides: [Jx.Plugin.Grid.Editor]

images:
 - icons.png
...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Editor
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to enable inline editing within a cell
 *
 * Original selection code from Jx.Grid's original class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Conrad Barthelmes.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Editor = new Class({

    Extends : Jx.Plugin,
    
    name: 'Editor',
    
    Binds: ['activate','deactivate','changeText','onCellClick'],

    options : {
      /**
       * Option: enabled
       * Determines if inline editing is avaiable
       */
      enabled : true,
      /**
       * Option: blurDelay
       * Set the time in miliseconds when the inputfield/popup shall hide. When
       * the user refocuses the input/popup within this time, the timeout will be cleared
       *
       * set to 'false' if no hiding on blur is wanted
       */
      blurDelay : 500,
      /**
       * Option: popup
       *
       * Definitions for a PopUp to use.
       * - use        - determines whether to use a PopUp or simply the input
       * - useLabel   - determines whether to use labels on top of the input.
       *                Text will be the column header
       * - useButtons - determines whether to use Submit and Cancel Buttons
       * - buttonLabel.submit - Text for Submit Button, uses MooTools.lang.get('Jx', 'plugin.editor').submitButton for default
       * - buttonLabel.cancel - Text for Cancel Button, uses MooTools.lang.get('Jx', 'plugin.editor').cancelButton for default
       */
      popup : {
        use           : true,
        useLabels     : false,
        useButtons    : true,
        button        : {
          submit : {
            label : '',
            image : 'images/accept.png'
          },
          cancel : {
            label : '',
            image : 'images/cancel.png'
          }
        },
        template: '<div class="jxGridEditorPopup"><div class="jxGridEditorPopupInnerWrapper"></div></div>'
      },
      /**
       * Option {boolean} validate
       * - set to true to have all editable input fields as mandatory field
       *   if they don't have 'mandatory:true' in their colOptions
       */
      validate : true,
      /**
       * Option: {Array} fieldOptions with objects
       * Contains objects with options for the Jx.Field instances to show up.
       * Default options will be added automatically if custom options are entered.
       *
       * Preferences:
       *   field             - Default * for all types or the name of the column in the store (Jx.Store)
       *   type              - Input type to show (Text, Password, Textarea, Select, Checkbox)
       *   options           - All Jx.Field options for this column. More options depend on what type you are using.
       *                       See Jx.Form.[yourField] for details
       *   validatorOptions: - See Jx.Plugin.Field.Validator Options for details
       *                       will only be used if this.options.validate is set to true
       */
      fieldOptions : [
        {
          field   : '*',
          type    : 'Text',
          options : {},
          validatorOptions: {
            validators : [],
            validateOnBlur: true,
            validateOnChange : false
          }
        }
      ],
      /**
       * Option: {Boolean} fieldFormatted
       * Displays the cell value also inside the input field as formatted
       */
      fieldFormatted : true,
      /**
       * Option cellChangeFx
       * set use to false if no highlighting effect is wanted.
       *
       * this is just an idea how successfully changing could be highlighed for the user
       */
      cellChangeFx : {
        use     : true,
        success : '#090',
        error   : '#F00'
      },
      /**
       * Option cellOutline
       * shows an outline style to the currently active cell to make it easier to see
       * which cell is active
       */
      cellOutline : {
        use   : true,
        style : '2px solid #88c3e7'
      },
      /**
       * Option: useKeyboard
       * Set to false if no keyboard support is needed
       */
      useKeyboard : true,
      /**
       * Option: keys
       * Contains the event codes for several commands that can be used when
       * a field is active. Syntax is the same like for the Mootools Keyboard Class
       * http://mootools.net/docs/more/Interface/Keyboard
       */
      keys : {
        'ctrl+shift+enter' : 'saveNGoUp',
        'tab'              : 'saveNGoRight',
        'ctrl+enter'       : 'saveNGoDown',
        'shift+tab'        : 'saveNGoLeft',
        'enter'            : 'saveNClose',
        'ctrl+up'          : 'cancelNGoUp',
        'ctrl+right'       : 'cancelNGoRight',
        'ctrl+down'        : 'cancelNGoDown',
        'ctrl+left'        : 'cancelNGoLeft',
        'esc'              : 'cancelNClose',
        'up'               : 'valueIncrement',
        'down'             : 'valueDecrement'
      },
      /**
       * Option: keyboardMethods
       *
       * can be used to overwrite existing keyboard methods that are used inside
       * this.options.keys - also possible to add new ones.
       * Functions are bound to the editor plugin when using 'this'
       *
       * example:
       *  keys : {
       *    'ctrl+u' : 'cancelNGoRightNDown'
       *  },
       *  keyboardMethods: {
       *    'cancelNGoRightNDown' : function(ev){
       *      ev.preventDefault();
       *      this.getNextCellInRow(false);
       *      this.getNextCellInCol(false);
       *    }
       *  }
       */
      keyboardMethods : {},
      /**
       * Option: keypressLoop
       * loop through the grid when pressing TAB (or some other method that uses
       * this.getNextCellInRow() or this.getPrevCellInRow()). If set to false,
       * the input field/popup will not start at the opposite site of the grid
       * Defaults to true
       */
      keypressLoop : true,
      /**
       * Option: linkClickListener
       * disables all click events on links that are formatted with Jx.Formatter.Uri
       * - otherwise the link will open directly instead of open the input editor)
       * - hold [ctrl] to open the link in a new tab
       */
      linkClickListener : true
    },
    classes: ['jxGridEditorPopup', 'jxGridEditorPopupInnerWrapper'],
    /**
     * Property: activeCell
     *
     * Containing Objects:
     *   field        : Reference to the Jx.Field instance that will be created
     *   cell         : Reference to the cell inside the table 
     *   span         : Reference to the Dom Element inside the selected cell of the grid
     *   oldValue     : Old value of the cell from the grid's store
     *   newValue     : Object with <data> and <error> for better validation possibilites
     *   timeoutId    : TimeoutId if the focus blurs the input.
     *   data         : Reference to the cell data
     *   fieldOptions : Reference to the field options of this column
     */
    activeCell : {
      field       : null,
      cell        : null,
      span        : null,
      oldValue    : null,
      newValue    : { data: null, error: false },
      timeoutId   : null,
      data        : {},
      fieldOptions: {}
    },
    /**
     * Property : popup
     *
     * References to all contents within a popup (only 1 popup for 1 grid initialization)
     *
     * COMMENT: I don't know how deep we need to go into that.. innerWrapper and closeLink probably don't need
     * own references.. I just made them here in case they are needed at some time..
     *
     * Containing Objects:
     *   domObj         : Reference to the Dom Element of the popup (absolutely positioned)
     *   innerWrapper   : Reference to the inner Wrapper inside the popup to provide relative positioning
     *   closeIcon      : Reference to the Dom Element of a little [x] in the upper right to close it (not saving)
     *   buttons        : References to all Jx.Buttons used inside the popup
     *   buttons.submit : Reference to the Submit Button
     *   buttons.cancel : Reference to the Cancel Button
     */
    popup : {
      domObj       : null,
      innerWarpper : null,
      closeIcon    : null,
      button       : {
        submit : null,
        cancel : null
      }
    },
    /**
     * Property: keyboard
     * Instance of a Mootols Keyboard Class
     */
    keyboard : null,
    /**
     * Property keyboardMethods
     * Editing and grid functions for keyboard functionality.
     * Methods are defined and implemented inside this.attach() because of referencing troubles
     */
    keyboardMethods : {},
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
      this.parent();
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     *
     * @var {Object} grid - Instance of Class Jx.Grid
     */
    attach: function (grid) {
      if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
        return;
      }
      this.parent(grid);
      this.grid = grid;

      //this.grid.gridTableBody.addEvent('click', this.onCellClick);
      // this.grid.wantEvent('gridCellClick');
      this.grid.addEvent('gridCellClick', this.onCellClick);

      /*
       * add default field options to the options in case some new options were entered
       * to be still able to use them for the rest of the fields
       */
      if(this.getFieldOptionsByColName('*').field != '*') {
        this.options.fieldOptions.unshift({
          field   : '*',
          type    : 'Text',
          options : {},
          validatorOptions: {
            validators : [],
            validateOnBlur: true,
            validateOnChange : false
          }
        });
      }

      /**
       * set the keyboard methods here to have a correct reference to the instance of
       * the editor plugin
       *
       * @todo other names maybe? or even completely different way of handling the keyboard events?
       * @todo more documentation than method name
       */
      var self = this;
      this.keyboardMethods = {
        saveNClose     : function(ev) {
          if(self.activeCell.fieldOptions.type != 'Textarea' || (self.activeCell.fieldOptions.type == 'Textarea' && ev.key != 'enter')) {
            self.deactivate();
          }
        },
        saveNGoUp      : function(ev) {ev.preventDefault();self.getPrevCellInCol();},
        saveNGoRight   : function(ev) {ev.preventDefault();self.getNextCellInRow();},
        saveNGoDown    : function(ev) {ev.preventDefault();self.getNextCellInCol();},
        saveNGoLeft    : function(ev) {ev.preventDefault();self.getPrevCellInRow();},
        cancelNClose   : function(ev) {ev.preventDefault();self.deactivate(false);},
        cancelNGoUp    : function(ev) {ev.preventDefault();self.getPrevCellInCol(false);},
        cancelNGoRight : function(ev) {ev.preventDefault();self.getNextCellInRow(false);},
        cancelNGoDown  : function(ev) {ev.preventDefault();self.getNextCellInCol(false);},
        cancelNGoLeft  : function(ev) {ev.preventDefault();self.getPrevCellInRow(false);},
        valueIncrement : function(ev) {ev.preventDefault();self.cellValueIncrement(true);},
        valueDecrement : function(ev) {ev.preventDefault();self.cellValueIncrement(false);}
      };

      var keyboardEvents = {};
      for(var i in this.options.keys) {
        if($defined(this.keyboardMethods[this.options.keys[i]])) {
          keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
        }else if($defined(this.options.keyboardMethods[this.options.keys[i]])){
          keyboardEvents[i] = this.options.keyboardMethods[this.options.keys[i]].bind(self);
        }else if(Jx.type(this.options.keys[i]) == 'function') {
          keyboardEvents[i] = this.options.keys[i].bind(self);
        }else{
          $defined(console) ? console.warn("keyboard method %o not defined", this.options.keys[i]) : false;
        }
      }

      // initalize keyboard support but do NOT activate it (this is done inside this.activate()).
      this.keyboard = new Keyboard({
        events: keyboardEvents
      });

      this.addFormatterUriClickListener();
    },
    /**
     * APIMethod: detach
     * detaches from the grid
     * 
     * @return void
     */
    detach: function() {
      if (this.grid) {
        this.grid.removeEvent('gridCellClick', this.onCellClick);
      }
      this.grid = null;
      this.keyboard = null;
    },
    /**
     * APIMethod: enable
     * enables the grid 'externally'
     *
     * @return void
     */
    enable : function () {
      this.options.enabled = true;
    },
    /**
     * APIMethod: disable
     * disables the grid 'externally'
     *
     * @var Boolean close - default true: also closes the currently open input/popup
     * @var Boolean save - default false: also changes the currently open input/popup
     * @return void
     */
    disable : function(close, save) {
      close = $defined(close) ? close : true;
      save = $defined(save) ? save : false;
      if(close && this.activeCell.cell != null) {
        this.deactivate(save);
      }
      this.options.enabled = false;
    },

    /**
     * Method: onCellClick
     * dispatch clicking on a table cell
     */
    onCellClick: function(cell) {
      this.activate(cell);
    },
    /**
     * Method: activate
     * activates the input field or breaks up if conditions are not fulfilled
     *
     * @todo Field validation
     *
     * Parameters:
     * @var {Object} cell Table Element
     * @return void
     */
    activate: function(cell) {
      // if not enabled or the cell is null, do nothing at all
      if(!this.options.enabled || !cell)
        return;

      // activate can be called by clicking on the same cell or a
      // different one
      if (this.activeCell.cell) {
        if (this.activeCell.cell != cell) {
          if (!this.deactivate()) {
            return;
          }
        } else {
          // they are the same, ignore?
          return;
        }
      }
      
      var data  = this.grid.getCellData(cell); //.retrieve('jxCellData');

      if (!data || !$defined(data.row) || !$defined(data.column)) {
        if($defined(console)) {
          console.warn('out of grid %o',cell);
          console.warn('data was %o', data);
        }
        return;
      }

      // column marked as not editable
      if (!data.column.options.isEditable) {
        return;
      }

      if (this.activeCell.timeoutId) {
        clearTimeout(activeCell.timeoutId);
      }

      // set active record index to selected row
      this.grid.store.moveTo(data.row);

      // set up the data objects we need
      var options = this.options,
          grid = this.grid,
          store = grid.getStore(),
          index = grid.columns.getIndexFromGrid(data.column.name),
          colOptions = data.column.options,
          activeCell = {
            oldValue      : store.get(data.column.name),
            newValue      : {data: null, error: false},
            fieldOptions  : this.getFieldOptionsByColName(data.column.name),
            data          : data,
            cell          : cell,
            span          : cell.getElement('span.jxGridCellContent'),
            validator     : null,
            field         : null,
            timeoutId     : null
          },
          jxFieldOptions = activeCell.fieldOptions.options,
          oldValue,
          groups,
          k,
          n;

      // check if this column has special validation settings - 
      // otherwise use default from this.options.validate
      if(!$defined(data.column.options.validate) || typeof(data.column.options.validate) != 'boolean') {
        data.column.options.validate = options.validate;
        cell.store('jxCellData', data);
      }

      // check for different input field types
      switch(activeCell.fieldOptions.type) {
        case 'Text':
        case 'Color':
        case 'Password':
        case 'File':
          jxFieldOptions.value = activeCell.oldValue;
          break;
        case 'Textarea':
          jxFieldOptions.value = activeCell.oldValue.replace(/<br \/>/gi, '\n');
          break;
        case 'Select':
          // find out which visible value fits to the value inside
          // <option>{value}</option> and set it to selected
          jxFieldOptions.value = oldValue  = activeCell.oldValue.toString();
          function setCombos(opts, oldValue) {
            for(var i = 0, j = opts.length; i < j; i++) {
              if(opts[i].value == oldValue) {
                opts[i].selected = true;
              }else{
                opts[i].selected = false;
              }
            }
            return opts;
          }

          if(jxFieldOptions.comboOpts) {
            jxFieldOptions.comboOpts = setCombos(jxFieldOptions.comboOpts, oldValue);
          }else if(jxFieldOptions.optGroups) {
            groups = jxFieldOptions.optGroups;
            for(k = 0, n = groups.length; k < n; k++) {
              groups[k].options = setCombos(groups[k].options, oldValue);
            }
            jxFieldOptions.optGroups = groups;
          }
          break;
        case 'Radio':
        case 'Checkbox':
        default:
          $defined(console) ? console.warn("Fieldtype %o is not supported yet. If you have set a validator for a column, you maybe have forgotton to enter a field type.", activeCell.fieldOptions.type) : false;
          return;
          break;
      }

      // update the 'oldValue' to the formatted style, to compare the new value with the formatted one instead with the non-formatted-one
      if(options.fieldFormatted && colOptions.renderer.options.formatter != null) {
        if(!$defined(colOptions.fieldFormatted) || colOptions.fieldFormatted == true ) {
          jxFieldOptions.value = colOptions.renderer.options.formatter.format(jxFieldOptions.value);
          activeCell.oldValue = jxFieldOptions.value;
        }
      }

      // create jx.field
      activeCell.field = new Jx.Field[activeCell.fieldOptions.type.capitalize()](jxFieldOptions);
      // create validator
      if(options.validate && colOptions.validate) {
        activeCell.validator = new Jx.Plugin.Field.Validator(activeCell.fieldOptions.validatorOptions);
        activeCell.validator.attach(activeCell.field);
      }

      // store properties of the active cell
      this.activeCell = activeCell;
      this.setStyles(cell);

      if(options.useKeyboard) {
        this.keyboard.activate();
      }

      // convert a string to an integer if somebody entered a numeric value in quotes, if it failes: make false
      if(typeof(options.blurDelay) == 'string') {
        options.blurDelay = options.blurDelay.toInt() ? options.blurDelay.toInt() : false;
      }

      // add a onblur() and onfocus() event to the input field if enabled.
      if(options.blurDelay !== false && typeof(options.blurDelay) == 'number') {
        activeCell.field.field.addEvents({
          // activate the timeout to close the input/poup
          'blur' : function() {
            // @todo For some reason, webkit does not clear the timeout correctly when navigating through the grid with keyboard
            clearTimeout(activeCell.timeoutId);
            activeCell.timeoutId = this.deactivate.delay(this.options.blurDelay);
          }.bind(this),
          // clear the timeout when the user focusses again
          'focus' : function() {
            clearTimeout(activeCell.timeoutId);
          }, 
          // clear the timeout when the user puts the mouse over the input
          'mouseover' : function() {
            clearTimeout(activeCell.timeoutId);
          }
        });
        if(this.popup.domObj != null) {
          this.popup.domObj.addEvent('mouseenter', function() {
            clearTimeout(activeCell.timeoutId);
          });
        }
      }

      activeCell.field.field.focus();
    }, 
    /**
     * APIMethod: deactivate
     * hides the currently active field and stores the new entered data if the
     * value has changed
     *
     * Parameters:
     * @var {Boolean} save (Optional, default: true) - force aborting
     * @return true if no data error occured, false if error (popup/input stays visible)
     */
    deactivate: function(save) {
      var newValue = {data : null, error : false},
          index,
          activeCell = this.activeCell,
          grid = this.grid,
          store = grid.store,
          options = this.options,
          highlighter,
          cellBg;

      clearTimeout(activeCell.timeoutId);

      if(activeCell.field !== null) {
        save = $defined(save) ? save : true;


        // update the value in the column
        if(save && activeCell.field.getValue().toString() != activeCell.oldValue.toString()) {
          store.moveTo(activeCell.data.row);
          /*
           * @todo webkit shrinks the rows when the value is updated... but refreshing the grid
           *       immidiately returns in a wrong calculating of the cell position (getCoordinates)
           */
          switch (activeCell.fieldOptions.type) {
            case 'Select':
              index = activeCell.field.field.selectedIndex;
              newValue.data = document.id(activeCell.field.field.options[index]).get('value');
              break;
            case 'Textarea':
              newValue.data = activeCell.field.getValue().replace(/\n/gi, '<br />');
              break;
            default:
              newValue.data = activeCell.field.getValue();
              break;
          }
          if (save) {
            activeCell.newValue.data = newValue.data;
          }
          // validation only if it should be saved!
          if (activeCell.validator != null && !activeCell.validator.isValid()) {
            newValue.error = true;
            activeCell.field.field.focus.delay(50, activeCell.field.field);
          }
        } else {
          activeCell.span.show();
        }

        // var data = activeCell.cell.retrieve('jxCellData');
        if (save && newValue.data != null && newValue.error == false) {
          store.set(activeCell.data.column.name, newValue.data);
          this.addFormatterUriClickListener();
        // else show error message and cell
        } else if (newValue.error == true) {
          activeCell.span.show();
        }

        // update reference to activeCell
        if ($defined(activeCell.data.row) && $defined(activeCell.data.index)) {
          var colIndex = grid.row.useHeaders() ? activeCell.data.index-1 : activeCell.data.index;
          this.activeCell.cell = grid.gridTableBody.rows[this.activeCell.data.row].cells[colIndex];
        }

        if (options.useKeyboard) {
          activeCell.field.removeEvent('keypress', this.setKeyboard);
        }

        /**
         * COMMENT: this is just an idea how changing a value could be visualized
         * we could also pass an Fx.Tween element?
         * the row could probably be highlighted as well?
         */
        if(options.cellChangeFx.use) {
          highlighter = new Fx.Tween(this.activeCell.cell, {
            duration: 250,
            onComplete: function(ev) {
              this.element.removeProperty('style');
            }
          });
          cellBg = activeCell.cell.getStyle('background-color');
          cellBg = cellBg == 'transparent' ? '#fff' : cellBg;
          if (newValue.data != null && newValue.error == false) {
            highlighter.start('background-color',options.cellChangeFx.success, cellBg);
          } else if (newValue.error){
            highlighter.start('background-color',options.cellChangeFx.error, cellBg);
          }
        }

        // check for error and keep input field alive
        if (newValue.error) {
          if(options.cellChangeFx.use) {
            activeCell.field.field.highlight(options.cellChangeFx.error);
          }
          activeCell.field.field.setStyle('border','1px solid '+options.cellChangeFx.error);
          activeCell.field.field.focus();
          return false;
        // otherwise hide it
        }else{
          this.keyboard.deactivate();
          this.unsetActiveField();
          return true;
        }
      }
    },
    /**
     * Method: setStyles
     * 
     * sets some styles for the Jx.Field elements...
     *
     * Parameters:
     * @var cell - table cell of the grid
     * @return void
     */
    setStyles : function(cell) {
      var styles, 
          size,
          options = this.options,
          activeCell = this.activeCell;
      // popup
      if (options.popup.use) {
        if (options.popup.useLabels) {
          activeCell.field.options.label = activeCell.data.column.options.header;
          activeCell.field.render();
        }
        styles = {
          field : {
            'width'  : activeCell.field.type == 'Select' ?
                         cell.getContentBoxSize().width + 5 + "px" :
                         cell.getContentBoxSize().width - 14 + "px",
            'margin' : 'auto 0'
          }
        };
        activeCell.field.field.setStyles(styles.field);
        this.showPopUp(cell);
      // No popup
      } else {
        size   = cell.getContentBoxSize();
        styles = {
          domObj : {
            position: 'absolute'
          },
          field : {
            width : size.width + "px",
            'margin-left' : 0
          }
        };

        activeCell.field.domObj.setStyles(styles.domObj);
        activeCell.field.field.setStyles(styles.field);

        activeCell.field.domObj.inject(document.body);
        Jx.Widget.prototype.position(activeCell.field.domObj, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
        });

        activeCell.span.hide();
      }

      // COMMENT: an outline of the cell helps identifying the currently active cell
      if(options.cellOutline.use) {
        cell.setStyle('outline', options.cellOutline.style);
      }
    },
    /**
     * Method: showPopUp
     *
     * Shows the PopUp of of the editor if it already exists, otherwise calls Method
     * this.createPopUp
     *
     * Parameters:
     * @var cell - table cell of the grid
     */
    showPopUp : function(cell) {
      if(this.popup.domObj != null) {
        Jx.Widget.prototype.position(this.popup.domObj, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
        });
        this.activeCell.field.domObj.inject(this.popup.innerWrapper, 'top');
        this.popup.domObj.show();
        this.setPopUpButtons();
        this.setPopUpStylesAfterRendering();
      }else{
        this.createPopUp(cell);
      }
    },
    /**
     * Method: createPopUp
     *
     * creates the popup for the requested cell.
     *
     * COMMENT: this could also be an jx.dialog..? if we use jx.dialog, maybe without a title element?
     *          Maybe a jx.dialog is too much for this little thing?
     *
     * Parameters:
     * @var cell - table cell of the grid
     */
    createPopUp : function(cell) {
      var coords = cell.getCoordinates(),
          self      = this, popup  = null, innerWrapper = null,
          closeIcon = null, submit = null, cancel       = null,
          template  = Jx.Widget.prototype.processTemplate(this.options.popup.template, this.classes);

      popup = template.jxGridEditorPopup;

      innerWrapper = template.jxGridEditorPopupInnerWrapper;
      /**
       * COMMENT: first positioning is always in the top left of the grid..
       * don't know why
       * manual positioning is needed..?
       */
      popup.setStyles({
        'left' : coords.left+'px',
        'top'  : coords.top +'px'
      });
      /*
      Jx.Widget.prototype.position(popup, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
      });
      */

      this.popup.domObj         = popup;
      this.popup.innerWrapper   = innerWrapper;
      this.popup.closeIcon      = closeIcon;
      this.setPopUpButtons();

      this.activeCell.field.domObj.inject(this.popup.innerWrapper, 'top');
      this.popup.domObj.inject(document.body);

      this.setPopUpStylesAfterRendering();
    },
    /**
     * Method: setPopUpStylesAfterRendering
     *
     * - measures the widths of the buttons to set a new min-width for the popup
     *   because custom labels could break the min-width and force a line-break
     * - resets the size of the field to make it fit inside the popup (looks nicer)
     *
     * @return void
     */
    setPopUpStylesAfterRendering: function() {
      if(this.options.popup.useButtons && this.popup.button.submit != null && this.popup.button.cancel != null) {
        this.popup.domObj.setStyle('min-width', this.popup.button.submit.domObj.getSize().x + this.popup.button.cancel.domObj.getSize().x + "px");
      }else{
        if(this.popup.button.submit != null)
          this.popup.button.submit.domObj.hide();
        if(this.popup.button.cancel != null)
          this.popup.button.cancel.domObj.hide();
      }
      this.activeCell.field.field.setStyle('width',
        this.activeCell.field.type == 'Select' ?
          this.popup.domObj.getSize().x - 7 + "px" :
          this.popup.domObj.getSize().x - 17 + "px");
    },
    /**
     * Method: setPopUpButtons
     * creates the PopUp Buttons if enabled in options or deletes them if set to false
     *
     * @return void
     */
    setPopUpButtons : function() {
      var self = this,
          button = {
            submit : null,
            cancel : null
          };
      // check if buttons are needed, innerWrapper exists and no buttons already exist
      if(this.options.popup.useButtons && this.popup.innerWrapper != null && this.popup.button.submit == null) {
        button.submit = new Jx.Button({
          label : this.options.popup.button.submit.label.length == 0 ? 
                    this.getText({set:'Jx',key:'plugin.editor',value:'submitButton'}) :
                    this.getText(this.options.popup.button.submit.label),
          image : this.options.popup.button.submit.image,
          onClick: function() {
            self.deactivate(true);
          }
        }).addTo(this.popup.innerWrapper);
        button.cancel = new Jx.Button({
          label : this.options.popup.button.cancel.label.length == 0 ? 
                    this.getText({set:'Jx',key:'plugin.editor',value:'cancelButton'}) :
                    this.getText(this.options.popup.button.cancel.label),
          image : this.options.popup.button.cancel.image,
          onClick: function() {
            self.deactivate(false);
          }
        }).addTo(this.popup.innerWrapper);
      }else if(this.options.popup.useButtons && this.popup.button.submit != null) {
        button = {
          submit : this.popup.button.submit,
          cancel : this.popup.button.cancel
        };
      // check if buttons are not needed and buttons already exist to remove them
      }else if(this.options.popup.useButtons == false && this.popup.button.submit != null) {
        this.popup.button.submit.cleanup();
        this.popup.button.cancel.cleanup();
      }

      this.popup.button = button;
    },
    /**
     * Method: unsetActiveField
     * resets the activeField and hides the popup
     *
     * @return void
     */
    unsetActiveField: function() {
      this.activeCell.field.destroy();
      if(this.popup.domObj != null) {
        this.popup.domObj.removeEvent('mouseenter');
        this.popup.domObj.hide();
      }

      this.activeCell.cell.setStyle('outline', '0px');

      this.activeCell = {
        field         : null,
        oldValue      : null,
        newValue      : { data: null, error: false},
        cell          : null,
        span          : null,
        timeoutId     : null,
        //popup         : null,   // do not destroy the popup, it might be used again
        data           : {},
        fieldOptions  : {},
        validator     : null
      };
    },
    /**
     * Method: unsetPopUp
     * resets the popup manually to be able to use it with different settings
     */
    unsetPopUp : function() {
      if(this.popup.domObj != null) {
        this.popup.domObj.destroy();
        this.popup.innerWrapper   = null;
        this.popup.closeIcon      = null;
        this.popup.button.submit = null;
        this.popup.button.cancel = null;
      }
    },
    /**
     * APIMethod: getNextCellInRow
     * activates the next cell in a row if it is editable
     * otherwise the focus jumps to the next editable cell in the next row
     * or starts at the beginning
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getNextCellInRow: function(save) {
      save = $defined(save) ? save : true;
      var nextCell = true,
          nextRow = true,
          sumCols = this.grid.columns.columns.length,
          jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)',
          i = 0,
          data,
          cell = this.activeCell.cell,
          options = this.options;
      if (this.activeCell.cell != null) {
        do {
          nextCell = i > 0 ? nextCell.getNext(jxCellClass) : cell.getNext(jxCellClass);
          // check if cell is still in row, otherwise returns null
          if (nextCell == null) {
            nextRow  = cell.getParent('tr').getNext();
            // check if this was the last row in the table
            if (nextRow == null && options.keypressLoop) {
              nextRow = cell.getParent('tbody').getFirst();
            } else if(nextRow == null && !options.keypressLoop){
              return;
            }
            nextCell = nextRow.getFirst(jxCellClass);
          }
          data = this.grid.getCellData(nextCell);
          i++;
          // if all columns are set to uneditable during runtime, jump out of the loop after
          // running through 2 times to prevent an endless-loop and browser crash :)
          if (i == sumCols*2) {
            this.deactivate(save);
            return;
          }
        } while(data && !data.column.options.isEditable);

        if (save === false) {
          this.deactivate(save);
        }
        this.activate(nextCell);
      }
    },
    /**
     * APIMethod: getPrevCellInRow
     * activates the previous cell in a row if it is editable
     * otherwise the focus jumps to the previous editable cell in the previous row
     * or starts at the last cell in the last row at the end
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getPrevCellInRow: function(save) {
      save = $defined(save) ? save : true;
      var prevCell, 
          prevRow, 
          i = 0,
          data,
          row,
          index,
          cell = this.activeCell.cell,
          sumCols = this.grid.columns.columns.length,
          jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)',
          options = this.options;
      if(cell != null) {
        do {
          prevCell = i > 0 ? prevCell.getPrevious(jxCellClass) : cell.getPrevious(jxCellClass);
          // check if cell is still in row, otherwise returns null
          if(prevCell == null) {
            prevRow  = cell.getParent('tr').getPrevious();
            // check if this was the last row in the table
            if(prevRow == null && options.keypressLoop) {
              prevRow = cell.getParent('tbody').getLast();
            }else if(prevRow == null && !options.keypressLoop) {
              return;
            }
            prevCell = prevRow.getLast(jxCellClass);
          }
          data  = this.grid.getCellData(prevCell);
          row   = data.row;
          index = data.index;
          i++;
          // if all columns are set to uneditable during runtime, jump out of the loop after
          // running through 2 times to prevent an endless-loop and browser crash :)
          if(i == sumCols*2) {
            this.deactivate(save);
            return;
          }
        }while(data && !data.column.options.isEditable);

        if(save === false) {
          this.deactivate(save);
        }
        this.activate(prevCell);
      }
    },
    /**
     * APIMethod: getNextCellInCol
     * activates the next cell in a column under the currently active one
     * if the active cell is in the last row, the first one will be used
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getNextCellInCol : function(save) {
      var nextRow,
          nextCell,
          activeCell = this.activeCell;
      save = $defined(save) ? save : true;
      if (activeCell.cell != null) {
        nextRow = activeCell.cell.getParent().getNext();
        if (nextRow == null) {
          nextRow = activeCell.cell.getParent('tbody').getFirst();
        }
        nextCell = nextRow.getElement('td.jxGridCol'+activeCell.data.index);
        if (save === false) {
          this.deactivate(save);
        }
        this.activate(nextCell);
      }
    },
    /**
     * APIMethod: getPrevCellInCol
     * activates the previous cell in a column above the currently active one
     * if the active cell is in the first row, the last one will be used
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getPrevCellInCol : function(save) {
      var prevRow,
          prevCell,
          activeCell = this.activeCell;
      save = $defined(save) ? save : true;
      if (activeCell.cell != null) {
        prevRow = activeCell.cell.getParent().getPrevious();
        if (prevRow == null) {
          prevRow = activeCell.cell.getParent('tbody').getLast();
        }
        prevCell = prevRow.getElement('td.jxGridCol'+activeCell.data.index);
        if (save === false) {
          this.deactivate(save);
        }
        this.activate(prevCell);
      }
    },
    /**
     * Method: cellValueIncrement
     * Whether increments or decrements the value of the active cell if the dataType is numeric
     *
     * Parameters
     * @var {Boolean} bool
     * @return void
     */
    cellValueIncrement : function(bool) {
      var activeCell = this.activeCell,
          dataType = activeCell.data.column.options.dataType,
          valueNew = null,
          formatter;
      switch (dataType) {
        case 'numeric':
        case 'currency':
          valueNew = activeCell.field.getValue().toInt();
          if (typeof(valueNew) == 'number') {
            if (bool) {
              valueNew++;
            } else {
              valueNew--;
            }
          }
          break;
        case 'date':
          valueNew = Date.parse(activeCell.field.getValue());
          if (valueNew instanceof Date) {
            if (bool) {
              valueNew.increment();
            } else {
              valueNew.decrement();
            }
            formatter = new Jx.Formatter.Date();
            valueNew = formatter.format(valueNew);
          }
          break;
      }
      if (valueNew != null) {
        activeCell.field.setValue(valueNew);
      }
    },
    /**
     * Method: cellIsInGrid
     * determins if the given coordinates are within the grid
     *
     * Parameters:
     * @var {Integer} row
     * @var {Integer} index
     * @return {Boolean}
     */
    cellIsInGrid: function(row, index) {
      if($defined(row) && $defined(index)) {
        //console.log("Row %i - max Rows: %i, Col %i - max Cols %i", row, this.grid.gridTableBody.rows.length, index, this.grid.gridTableBody.rows[row].cells.length);
        if( row >= 0 && index >= 0 &&
            row <= this.grid.gridTableBody.rows.length &&
            index <= this.grid.gridTableBody.rows[row].cells.length
        ) {
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    /**
     * APIMethod: getFieldOptionsByColName
     * checks for the name of a column inside the fieldOptions and returns
     * the object if found, otherwise the default options for the field
     *
     * Parameters:
     * @var {String} colName
     * @return {Object} default field options
     */
    getFieldOptionsByColName : function(colName) {
      var fo = this.options.fieldOptions,
          r  = this.options.fieldOptions[0];
      for(var i = 0, j = fo.length; i < j; i++) {
        if(fo[i].field == colName) {
          r = fo[i];
          break;
        }
      }
      return r;
    },
    /**
     * Method: addFormatterUriClickListener
     *
     * looks up for Jx.Formatter.Uri columns to disable the link and open the
     * inline editor instead when CTRL is NOT pressed.
     * set option linkClickListener to false to disable this
     *
     */
    addFormatterUriClickListener : function() {
      if(this.options.linkClickListener) {
        // prevent a link from beeing opened if the editor should appear and the uri formatter is activated
        var uriCols = [], tableCols, anchor;
        // find out which columns are using a Jx.Formatter.Uri
        this.grid.columns.columns.each(function(col,i) {
          if(col.options.renderer.options.formatter != null && col.options.renderer.options.formatter instanceof Jx.Formatter.Uri) {
            uriCols.push(i);
          }
        });
        // add an event to all anchors inside these columns
        this.grid.gridObj.getElements('tr').each(function(tr,i) {
          tableCols = tr.getElements('td.jxGridCell');
          for(var j = 0, k = uriCols.length; j < k; j++) {
            anchor = tableCols[uriCols[j]-1].getElement('a');
            if(anchor) {
              anchor.removeEvent('click');
              anchor.addEvent('click', function(ev) {
                // open link if ctrl was clicked
                if(!ev.control) {
                  ev.preventDefault();
                }
              });
            }
          }
        });
      }
    },
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - the language being changed to or that had it's data set of
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	if (this.options.popup.use && this.options.popup.useButtons) {
        if(this.popup.button.submit != null) {
          this.popup.button.submit.cleanup();
          this.popup.button.cancel.cleanup();
          this.popup.button.submit = null;
          this.popup.button.cancel = null;
          this.setPopUpButtons();
        }
    	}
    }
}); 
/*
---

name: Jx.Plugin.DataView

description: Namespace for DataView plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.DataView]
...
 */
/**
 * Namespace: Jx.Plugin.DataView
 * The namespace for all dataview plugins
 */
Jx.Plugin.DataView = {};/*
---

name: Jx.Slide

description: A class that shows and hides elements using a slide effect. Does not use a wrapper element or require a fixed width or height.

license: MIT-style license.

requires:
 - Jx.Object
 - Core/Fx.Tween

provides: [Jx.Slide]

...
 */
// $Id$
/**
 * Class: Jx.Slide
 * Hides and shows an element without depending on a fixed width or height
 *
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
Jx.Slide = new Class({
    Family: 'Jx.Slide',
    Implements: Jx.Object,
    Binds: ['handleClick'],
    options: {
        /**
         * Option: target
         * The element to slide
         */
        target: null,
        /**
         * Option: trigger
         * The element that will have a click event added to start the slide
         */
        trigger: null,
        /**
         * Option: type
         * The type of slide. Can be either "width" or "height". defaults to "height"
         */
        type: 'height',
        /**
         * Option: setOpenTo
         * Allows the caller to determine what the open target is set to. Defaults to 'auto'.
         */
        setOpenTo: 'auto',
        /**
         * Option: onSlideOut
         * function called when the target is revealed.
         */
        onSlideOut: $empty,
        /**
         * Option: onSlideIn
         * function called when a panel is hidden.
         */
        onSlideIn: $empty
    },
    /**
     * Method: init
     * sets up the slide
     */
    init: function () {

        this.target = document.id(this.options.target);

        this.target.set('tween', {onComplete: this.setDisplay.bind(this)});

        if ($defined(this.options.trigger)) {
            this.trigger = document.id(this.options.trigger);
            this.trigger.addEvent('click', this.handleClick);
        }

        this.target.store('slider', this);

    },
    /**
     * Method: handleClick
     * event handler for clicks on the trigger. Starts the slide process
     */
    handleClick: function () {
        var sizes = this.target.getMarginBoxSize();
        if (sizes.height === 0) {
            this.slide('in');
        } else {
            this.slide('out');
        }
    },
    /**
     * Method: setDisplay
     * called at the end of the animation to set the target's width or
     * height as well as other css values to the appropriate values
     */
    setDisplay: function () {
        var h = this.target.getStyle(this.options.type).toInt();
        if (h === 0) {
            this.target.setStyle('display', 'none');
            this.fireEvent('slideOut', this.target);
        } else {
            //this.target.setStyle('overflow', 'auto');
            if (this.target.getStyle('position') !== 'absolute') {
                this.target.setStyle(this.options.type, this.options.setOpenTo);
            }
            this.fireEvent('slideIn', this.target);
        }
    },
    /**
     * APIMethod: slide
     * Actually determines how to slide and initiates the animation.
     *
     * Parameters:
     * dir - the direction to slide (either "in" or "out")
     */
    slide: function (dir) {
        var h;
        if (dir === 'in') {
            h = this.target.retrieve(this.options.type);
            this.target.setStyles({
                overflow: 'hidden',
                display: 'block'
            });
            this.target.setStyles(this.options.type, 0);
            this.target.tween(this.options.type, h);
        } else {
            if (this.options.type === 'height') {
                h = this.target.getMarginBoxSize().height;
            } else {
                h = this.target.getMarginBoxSize().width;
            }
            this.target.store(this.options.type, h);
            this.target.setStyle('overflow', 'hidden');
            this.target.setStyle(this.options.type, h);
            this.target.tween(this.options.type, 0);
        }
    }
});/*
---

name: Jx.Plugin.DataView.GroupFolder

description: Enables closing and opening groups in a group dataview

license: MIT-style license.

requires:
 - Jx.Plugin.DataView
 - Jx.Slide

provides: [Jx.Plugin.DataView.GroupFolder]

...
 */
/**
 * Class: Jx.Plugin.DataView.GroupFolder
 *
 * Extends: <Jx.Plugin>
 *
 * Plugin for DataView - allows folding/unfolding of the groups in the
 * grouped dataview
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.DataView.GroupFolder = new Class({

    Extends: Jx.Plugin,

    options: {
        /**
         * Option: headerClass
         * The base for styling the header. Gets '-open' or '-closed' added
         * to it.
         */
        headerClass: null
    },
    /**
     * Property: headerState
     * Hash that holds the open/closed state of each header
     */
    headerState: null,
    init: function() {
      this.headerState = new Hash();
    },
    /**
     * APIMethod: attach
     * Attaches this plugin to a dataview
     */
    attach: function (dataView) {
        if (!$defined(dataView) && !(dataview instanceof Jx.Panel.DataView)) {
            return;
        }

        this.dv = dataView;
        this.dv.addEvent('renderDone', this.setHeaders.bind(this));
    },
    /**
     * Method: setHeaders
     * Called after the dataview is rendered. Sets up the Jx.Slide instance
     * for each header. It also sets the initial state of each header so that
     * if the dataview is redrawn for some reason the open/closed state is
     * preserved.
     */
    setHeaders: function () {
        var headers = this.dv.domA.getElements('.' + this.dv.options.groupHeaderClass);

        headers.each(function (header) {
            var id = header.get('id');
            var s = new Jx.Slide({
                target: header.getNext(),
                trigger: id,
                onSlideOut: this.onSlideOut.bind(this, header),
                onSlideIn: this.onSlideIn.bind(this, header)
            });

            if (this.headerState.has(id)) {
                var state = this.headerState.get(id);
                if (state === 'open') {
                    s.slide('in');
                } else {
                    s.slide('out');
                }
            } else {
                s.slide('in');
            }
        }, this);
    },

    /**
     * Method: onSlideIn
     * Called when a group opens.
     *
     * Parameters:
     * header - the header that was clicked.
     */
    onSlideIn: function (header) {
        this.headerState.set(header.get('id'), 'open');
        if (header.hasClass(this.options.headerClass + '-closed')) {
            header.removeClass(this.options.headerClass + '-closed');
        }
        header.addClass(this.options.headerClass + '-open');
    },
    /**
     * Method: onSlideOut
     * Called when a group closes.
     *
     * Parameters:
     * header - the header that was clicked.
     */
    onSlideOut: function (header) {
        this.headerState.set(header.get('id'), 'closed');
        if (header.hasClass(this.options.headerClass + '-open')) {
            header.removeClass(this.options.headerClass + '-open');
        }
        header.addClass(this.options.headerClass + '-closed');
    }
});
/*
---

name: Jx.Plugin.Field

description: Namespace for Jx.Field plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Field]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Field
 * Field plugin namespace
 *
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Field = {};/*
---

name: Jx.Plugin.Field.Validator

description: Provides validation services for Jx.Field subclasses

license: MIT-style license.

requires:
 - Jx.Plugin.Field
 - More/Form.Validator
 - More/Form.Validator.Extras

provides: [Jx.Plugin.Field.Validator]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Field.Validator
 *
 * Extends: <Jx.Plugin>
 *
 * Field plugin for enforcing validation when a field is not used in a form.
 *
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 * Parts inspired by mootools-more's Form.Validator class
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Field.Validator = new Class({

    Extends : Jx.Plugin,
    name: 'Field.Validator',

    options: {
        /**
         * Option: validators
         * An array that contains either a string that names the predefined
         * validator to use with its needed options or an object that defines
         * the options of an InputValidator (also with needed options) defined
         * like so:
         *
         * (code)
         * {
         *     validatorClass: 'name:with options',    //gets applied to the field
         *     validator: {                         //used to create the InputValidator
         *         name: 'validatorName',
         *         options: {
         *             errorMsg: 'error message',
         *             test: function(field,props){}
         *         }
         *     }
         * }
         * (end)
         */
        validators: [],
        /**
         * Option: validateOnBlur
         * Determines whether the plugin will validate the field on blur.
         * Defaults to true.
         */
        validateOnBlur: true,
        /**
         * Option: validateOnChange
         * Determines whether the plugin will validate the field on change.
         * Defaults to true.
         */
        validateOnChange: true
    },
    /**
     * Property: valid
     * tells whether this field passed validation or not.
     */
    valid: null,
    /**
     * Property: errors
     * array of errors found on this field
     */
    errors: null,
    validators : null,
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function () {
        this.parent();
        this.errors = [];
        this.validators = new Hash();
        this.bound.validate = this.validate.bind(this);
        this.bound.reset = this.reset.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the field
     */
    attach: function (field) {
        if (!$defined(field) && !(field instanceof Jx.Field)) {
            return;
        }
        this.field = field;
        if (this.field.options.required && !this.options.validators.contains('required')) {
            //would have used unshift() but reading tells me it may not work in IE.
            this.options.validators.reverse().push('required');
            this.options.validators.reverse();
        }
        //add validation classes
        this.options.validators.each(function (v) {
            var t = Jx.type(v);
            if (t === 'string') {
                this.field.field.addClass(v);
            } else if (t === 'object') {
                this.validators.set(v.validator.name, new InputValidator(v.validator.name, v.validator.options));
                this.field.field.addClass(v.validatorClass);
            }
        }, this);
        if (this.options.validateOnBlur) {
            this.field.field.addEvent('blur', this.bound.validate);
        }
        if (this.options.validateOnChange) {
            this.field.field.addEvent('change', this.bound.validate);
        }
        this.field.addEvent('reset', this.bound.reset);
    },
    /**
     * APIMethod: detach
     */
    detach: function () {
        if (this.field) {
            this.field.field.removeEvent('blur', this.bound.validate);
            this.field.field.removeEvent('change', this.bound.validate);
        }
        this.field.removeEvent('reset', this.bound.reset);
        this.field = null;
        this.validators = null;
    },

    validate: function () {
        $clear(this.timer);
        this.timer = this.validateField.delay(50, this);
    },

    validateField: function () {
        //loop through the validators
        this.valid = true;
        this.errors = [];
        this.options.validators.each(function (v) {
            var val = (Jx.type(v) === 'string') ? Form.Validator.getValidator(v) : this.validators.get(v.validator.name);
            if (val) {
                if (!val.test(this.field.field)) {
                    this.valid = false;
                    this.errors.push(val.getError(this.field.field));
                }
            }
        }, this);
        if (!this.valid) {
            this.field.domObj.removeClass('jxFieldSuccess').addClass('jxFieldError');
            this.fireEvent('fieldValidationFailed', [this.field, this]);
        } else {
            this.field.domObj.removeClass('jxFieldError').addClass('jxFieldSuccess');
            this.fireEvent('fieldValidationPassed', [this.field, this]);
        }
        return this.valid;
    },

    isValid: function () {
        return this.validateField();
    },

    reset: function () {
        this.valid = null;
        this.errors = [];
        this.field.field.removeClass('jxFieldError').removeClass('jxFieldSuccess');
    },
    /**
     * APIMethod: getErrors
     * USe this method to retrieve all of the errors noted for this field.
     */
    getErrors: function () {
        return this.errors;
    }


});
/*
---

name: Jx.Plugin.Form

description: Namespace for Jx.Form plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Form]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form
 * Form plugin namespace
 *
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Form = {};/*
---

name: Jx.Plugin.Form.Validator

description: Provides validation services for Jx.Form

license: MIT-style license.

requires:
 - Jx.Plugin.Form
 - Jx.Plugin.Field.Validator

provides: [Jx.Plugin.Form.Validator]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form.Validator
 *
 * Extends: <Jx.Plugin>
 *
 * Form plugin for enforcing validation on the fields in a form.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 * Parts inspired by mootools-more's Form.Validator class
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Form.Validator = new Class({

    Extends : Jx.Plugin,
    name: 'Form.Validator',

    options: {
        /**
         * Option: fields
         * This will be key/value pairs for each of the fields as shown here:
         * (code)
         * {
         *     fieldID: {
         *          ... options for Field.Validator plugin ...
         *     },
         *     fieldID: {...
         *     }
         * }
         * (end)
         */
        fields: null,
        /**
         * Option: fieldDefaults
         * {Object} contains named defaults for field validators to be
         * triggered on blur or change.  Default is:
         * (code)
         * {
         *    validateOnBlur: true
         *    validateOnChange: false
         * }
         * (end)
         */
        fieldDefaults: {
            validateOnBlur: true,
            validateOnChange: true
        },
        /**
         * Option: validateOnSubmit
         * {Boolean} default true.  Trigger validation on submission of
         * form if true.
         */
        validateOnSubmit: true,
        /**
         * Option: suspendSubmit
         * {Boolean} default false.  Stop form submission when validator is
         * attached.
         */
        suspendSubmit: false
    },
    /**
     * Property: errorMessagess
     * element holding
     */
    errorMessage: null,
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.bound.validate = this.validate.bind(this);
        this.bound.failed = this.fieldFailed.bind(this);
        this.bound.passed = this.fieldPassed.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the form
     */
    attach: function (form) {
        if (!$defined(form) && !(form instanceof Jx.Form)) {
            return;
        }
        this.form = form;
        var plugin = this,
            options = this.options;
        //override the isValid function in the form
        form.isValid = function () {
            return plugin.isValid();
        };

        if (options.validateOnSubmit && !options.suspendSubmit) {
            document.id(this.form).addEvent('submit', this.bound.validate);
        } else if (options.suspendSubmit) {
            document.id(this.form).addEvent('submit', function (ev) {
                ev.stop();
            });
        }

        this.plugins = $H();

        //setup the fields
        $H(options.fields).each(function (val, key) {
            var opts = $merge(this.options.fieldDefaults, val),
                fields = this.form.getFieldsByName(key).
                p;
            if (fields && fields.length) {
                p = new Jx.Plugin.Field.Validator(opts);
                this.plugins.set(key, p);
                p.attach(fields[0]);
                p.addEvent('fieldValidationFailed', this.bound.failed);
                p.addEvent('fieldValidationPassed', this.bound.passed);
            }
        }, this);

    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.form) {
            document.id(this.form).removeEvent('submit');
        }
        this.form = null;
        this.plugins.each(function(plugin){
            plugin.detach();
            plugin = null;
        },this);
        this.plugins = null;
    },
    /**
     * APIMethod: isValid
     * Call this to determine whether the form validates.
     */
    isValid: function () {
        return this.validate();
    },
    /**
     * Method: validate
     * Method that actually does the work of validating the fields in the form.
     */
    validate: function () {
        var valid = true;
        this.errors = $H();
        this.plugins.each(function(plugin){
            if (!plugin.isValid()) {
                valid = false;
                this.errors.set(plugin.field.id,plugin.getErrors());
            }
        }, this);
        if (valid) {
            this.fireEvent('formValidationPassed', [this.form, this]);
        } else {
            this.fireEvent('formValidationFailed', [this.form, this]);
        }
        return valid;
    },
    /**
     * Method: fieldFailed
     * Refires the fieldValidationFailed event from the field validators it contains
     */
    fieldFailed: function (field, validator) {
        this.fireEvent('fieldValidationFailed', [field, validator]);
    },
    /**
     * Method: fieldPassed
     * Refires the fieldValidationPassed event from the field validators it contains
     */
    fieldPassed: function (field, validator) {
        this.fireEvent('fieldValidationPassed', [field, validator]);
    },
    /**
     * APIMethod: getErrors
     * Use this method to get all of the errors from all of the fields.
     */
    getErrors: function () {
        if (!$defined(this.errors)) {
           this.validate();
        }
        return this.errors;
    }


});
/*
---

name: Jx.Plugin.ToolbarContainer

description: Namespace for Jx.Toolbar.Container

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.ToolbarContainer]

...
 */
/**
 * Class: Jx.Plugin.Toolbar
 * Toolbar plugin namespace
 *
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.ToolbarContainer = {};/*
---

name: Jx.Plugin.ToolbarContainer.TabMenu

description: Adds a menu of tabs to the toolbar container for easy access to all tabs.

license: MIT-style license.

requires:
 - Jx.Plugin.ToolbarContainer

provides: [Jx.Plugin.ToolbarContainer.TabMenu]

...
 */
/**
 * Class: Jx.Plugin.ToolbarContainer.TabMenu
 *
 * Extends: <Jx.Plugin>
 *
 * This plugin provides a menu of tabs in a toolbar (similar to the button in firefox at the end of the row of tabs).
 * It is designed to be used only when the toolbar contains tabs and only when the container is allowed to scroll. Also,
 * this plugin must be added directly to the Toolbar container. You can get a reference to the container for a
 * <Jx.TabBox> by doing
 *
 * (code)
 * var tabbox = new Jx.TabBox();
 * var toolbarContainer = document.id(tabBox.tabBar).getParent('.jxBarContainer').retrieve('jxBarContainer');
 * (end)
 *
 * You can then use the attach method to connect the plugin. Otherwise, you can add it via any normal means to a
 * directly instantiated Container.
 *
 * License:
 * Copyright (c) 2010, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.ToolbarContainer.TabMenu = new Class({

    Family: 'Jx.Plugin.ToolbarContainer.TabMenu',
    Extends: Jx.Plugin,

    Binds: ['addButton'],

    options: {
    },
    /**
     * Property: tabs
     * holds all of the tabs that we're tracking
     */
    tabs: [],

    init: function () {
        this.parent();
    },

    attach: function (toolbarContainer) {
        this.parent(toolbarContainer);

        this.container = toolbarContainer;

        //we will only be used if the container is allowed to scroll
        if (!this.container.options.scroll) {
            return;
        }

        this.menu = new Jx.Menu({},{
            buttonTemplate: '<span class="jxButtonContainer"><a class="jxButton jxButtonMenu jxDiscloser"><span class="jxButtonContent"><span class="jxButtonLabel"></span></span></a></span>'
        }).addTo(this.container.controls,'bottom');
        document.id(this.menu).addClass('jxTabMenuRevealer');
        this.container.update();

        //go through all of the existing tabs and add them to the menu
        //grab the toolbar...
        var tb = document.id(this.container).getElement('ul').retrieve('jxToolbar');
        tb.list.each(function(item){
            this.addButton(item);
        },this);

        //connect to the add event of the toolbar list to monitor the addition of buttons
        tb.list.addEvent('add',this.addButton);
    },

    detach: function () {
        this.parent();
    },

    addButton: function (item) {
        var tab;
        tab = (item instanceof Jx.Tab) ? item : document.id(item).getFirst().retrieve('jxTab');


        var l = tab.getLabel();
        if (!$defined(l)) {
            l = '';
        }
        var mi = new Jx.Menu.Item({
            label: l,
            image: tab.options.image,
            onClick: function() {
                if (tab.isActive()) {
                    this.container.scrollIntoView(tab);
                } else {
                    tab.setActive(true);
                }
            }.bind(this)
        });

        document.id(tab).store('menuItem', mi);

        tab.addEvent('close', function() {
            this.menu.remove(mi);
        }.bind(this));

        this.menu.add([mi]);
    }
});/*
---

name: Jx.Adaptor

description: Base class for all Adaptors.

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Adaptor]

...
 */
/**
 * Class: Jx.Adaptor
 * Base class for all adaptor implementations. Provides a place to locate all
 * common code and the Jx.Adaptor namespace.  Since it extends <Jx.Plugin> all
 * adaptors will be able to be used as plugins for their respective classes.
 * Also as such, they must have the attach() and detach() methods.
 *
 * Adaptors are specifically used to conform a <Jx.Store> to any one of
 * the different widgets (i.e. Jx.Tree, Jx.ListView, etc...) that could
 * benefit from integration with the store. This approach was taken to minimize
 * data access code in the widgets themselves. Widgets should have no idea where
 * the data/items come from so that they will be usable in the broadest number
 * of situations.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor = new Class({


  Extends: Jx.Plugin,
  Family: 'Jx.Adaptor',

  name: 'Jx.Adaptor',

  options: {
        /**
         * Option: template
         * The text template to use in creating the items for this adaptor
         */
      template: '',
        /**
         * Option: useTemplate
         * Whether or not to use the text template above. Defaults to true.
         */
      useTemplate: true,
        /**
         * Option: store
         * The store to use with the adaptor.
         */
      store: null
  },
    /**
     * Property: columnsNeeded
     * Will hold an array of the column names needed for processing the
     * template
     */
  columnsNeeded: null,

  init: function () {
      var options = this.options;
      this.parent();

      this.store = options.store;

      if (options.useTemplate && $defined(this.store.getColumns())) {
          this.columnsNeeded = this.store.parseTemplate(options.template);
      }
  },

  attach: function (widget) {
    this.parent(widget);
    this.widget = widget;
  },

  detach: function () {
    this.parent();
  }

});/*
---

name: Jx.Adaptor.Tree

description: Base class for all adaptors that fill Jx.Tree widgets. Also acts as the namespace for other Jx.Tree adaptors.

license: MIT-style license.

requires:
 - Jx.Adaptor

provides: [Jx.Adaptor.Tree]

...
 */
/**
 * Class: Jx.Adaptor.Tree
 * This base class is used to change a store (a flat list of records) into the
 * data structure needed for a Jx.Tree. It will have 2 subclasses:
 * <Jx.Adapter.Tree.Mptt> and <Jx.Adapter.Tree.Parent>.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor.Tree = new Class({


    Extends: Jx.Adaptor,
    Family: 'Jx.Adaptor.Tree',

    Binds: ['fill','checkFolder'],

    options: {
        /**
         * Option: monitorFolders
         * Determines if this adapter should use monitor the TreeFolder items in
         * order to request any items they should contain if they are empty.
         */
        monitorFolders: false,
        /**
         * Option: startingNodeKey
         * The store primary key to use as the node that we're requesting.
         * Initially set to -1 to indicate that we're request the first set of
         * data
         */
        startingNodeKey: -1,
        /**
         * Option: folderOptions
         * A Hash containing the options for <Jx.TreeFolder>. Defaults to null.
         */
        folderOptions: null,
        /**
         * Option: itemOptions
         * A Hash containing the options for <Jx.TreeItem>. Defaults to null.
         */
        itemOptions: null
    },
    /**
     * Property: folders
     * A Hash containing all of the <Jx.TreeFolders> in this tree.
     */
    folders: null,
    /**
     * Property: currentRecord
     * An integer indicating the last position we were at in the store. Used to
     * allow the adaptor to pick up rendering items after we request additional
     * data.
     */
    currentRecord: -1,
    init: function() {
      this.folders = new Hash();
      this.parent();
    },
    /**
     * APIMethod: attach
     * Attaches this adaptor to a specific tree instance.
     *
     * Parameters:
     * tree - an instance of <Jx.Tree>
     */
    attach: function (tree) {
        this.parent(tree);

        this.tree = tree;

        if (this.options.monitorFolders) {
            this.strategy = this.store.getStrategy('progressive');

            if (!$defined(this.strategy)) {
                this.strategy = new Jx.Store.Strategy.Progressive({
                    dropRecords: false,
                    getPaginationParams: function () { return {}; }
                });
                this.store.addStrategy(this.strategy);
            } else {
                this.strategy.options.dropRecords = false;
                this.strategy.options.getPaginationParams = function () { return {}; };
            }

        }

        this.store.addEvent('storeDataLoaded', this.fill);


    },
    /**
     * APIMethod: detach
     * removes this adaptor from the current tree.
     */
    detach: function () {
      this.parent();
      this.store.removeEvent('storeDataLoaded', this.fill);
    },
    /**
     * APIMethod: firstLoad
     * Method used to start the first store load.
     */
    firstLoad: function () {
      //initial store load
      this.busy = 'tree';
      this.tree.setBusy(true);
        this.store.load({
            node: this.options.startingNodeKey
        });
    },

    /**
     * APIMethod: fill
     * This function will start at this.currentRecord and add the remaining
     * items to the tree.
     */
    fill: function () {
      var i,
          template,
          item,
          p,
          folder,
          options = this.options;

      if (this.busy == 'tree') {
        this.tree.setBusy(false);
        this.busy = 'none';
      } else if (this.busy == 'folder') {
        this.busyFolder.setBusy(false);
        this.busy = 'none';
      }
        var l = this.store.count() - 1;
        for (i = this.currentRecord + 1; i <= l; i++) {
            template = this.store.fillTemplate(i,options.template,this.columnsNeeded);

            if (this.hasChildren(i)) {
                //add as folder
                item = new Jx.TreeFolder($merge(options.folderOptions, {
                    label: template
                }));

                if (options.monitorFolders) {
                  item.addEvent('disclosed', this.checkFolder);
                }

                this.folders.set(i,item);
            } else {
                //add as item
                item = new Jx.TreeItem($merge(options.itemOptions, {
                    label: template
                }));
            }
            document.id(item).store('index', i).store('jxAdaptor', this);
            //check for a parent
            if (this.hasParent(i)) {
                //add as child of parent
                var p = this.getParentIndex(i);
                var folder = this.folders.get(p);
                folder.add(item);
            } else {
                //otherwise add to the tree itself
                this.tree.add(item);
            }
        }
        this.currentRecord = l;
    },
    /**
     * Method: checkFolder
     * Called by the disclose event of the tree to determine if we need to
     * request additional items for a branch of the tree.
     */
    checkFolder: function (folder) {
        var items = folder.items(),
            index,
            node;
        if (!$defined(items) || items.length === 0) {
            //get items via the store
          index = document.id(folder).retrieve('index');
          node = this.store.get('primaryKey', index);
          this.busyFolder = folder;
          this.busyFolder.setBusy(true);
          this.busy = 'folder';
            this.store.load({
                node: node
            });
        }
    },
    /**
     * Method: hasChildren
     * Virtual method to be overridden by sublcasses. Determines if a specific
     * node has any children.
     */
    hasChildren: $empty,
    /**
     * Method: hasParent
     * Virtual method to be overridden by sublcasses. Determines if a specific
     * node has a parent node.
     */
    hasParent: $empty,
    /**
     * Method: getParentIndex
     * Virtual method to be overridden by sublcasses. Determines the store index
     * of the parent node.
     */
    getParentIndex: $empty
});/*
---

name: Jx.Adaptor.Tree.Mptt

description: Fills a Jx.Tree instance from a remote table that represents an MPTT (Modified Preorder Table Traversal) data source.

license: MIT-style license.

requires:
 - Jx.Adaptor.Tree

provides: [Jx.Adaptor.Tree.Mptt]

...
 */
/**
 * Class: Jx.Adaptor.Tree.Mptt
 * This class adapts a table adhering to the classic Parent-style "tree table".
 *
 * This class requires an MPTT (Modified Preorder Tree Traversal) table. The MPTT
 * has a 'left' and a 'right' column that indicates the order of nesting. For
 * more details see the sitepoint.com article at
 * http://articles.sitepoint.com/article/hierarchical-data-database
 *
 * if useAjax option is set to true then this adapter will send an Ajax request
 * to the server, through the store's strategy (should be Jx.Store.Strategy.Progressive)
 * to request additional nodes.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor.Tree.Mptt = new Class({


    Family: 'Jx.Adaptor.Tree.Mptt',
    Extends: Jx.Adaptor.Tree,

    name: 'tree.mptt',

    options: {
        left: 'left',
        right: 'right'
    },

    /**
     * APIMethod: hasChildren
     *
     * Parameters:
     * index - {integer} the array index of the row in the store (not the
     *          primary key).
     */
    hasChildren: function (index) {
        var l = this.store.get(this.options.left, index).toInt(),
            r = this.store.get(this.options.right, index).toInt();
        return (l + 1 !== r);
    },

    /**
     * APIMethod: hasParent
     *
     * Parameters:
     * index - {integer} the array index of the row in the store (not the
     *          primary key).
     */
    hasParent: function (index) {
        var i = this.getParentIndex(index),
            result = false;
        if ($defined(i)) {
            result = true;
        }
        return result;
    },

    /**
     * APIMethod: getParentIndex
     *
     * Parameters:
     * index - {integer} the array index of the row in the store (not the
     *          primary key).
     */
    getParentIndex: function (index) {
        var store = this.store,
            options = this.options,
            l,
            r,
            i,
            pl,
            pr;
        l = store.get(options.left, index).toInt();
        r = store.get(options.right, index).toInt();
        for (i = index-1; i >= 0; i--) {
            pl = store.get(options.left, i).toInt();
            pr = store.get(options.right, i).toInt();
            if (pl < l && pr > r) {
                return i;
            }
        }
        return null;
    }
});/*
---

name: Jx.Adaptor.Tree.Parent

description: Fills a Jx.Tree instance from a standard parent/child/folder style data table.

license: MIT-style license.

requires:
 - Jx.Adaptor.Tree

provides: [Jx.Adaptor.Tree.Parent]


...
 */
/**
 * Class: Jx.Adapter.Tree.Parent
 * This class adapts a table adhering to the classic Parent-style "tree table".
 * 
 * Basically, the store needs to have a column that will indicate the
 * parent of each row. The root(s) of the tree should be indicated by a "-1" 
 * in this column. The name of the "parent" column is configurable in the 
 * options.
 * 
 * if the monitorFolders option is set to true then this adapter will send
 * an Ajax request to the server, through the store's strategy (should be
 * Jx.Store.Strategy.Progressive) to request additional nodes. Also, a column
 * indicating whether this is a folder needs to be set as there is no way to
 * tell if a node has children without it.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor.Tree.Parent = new Class({
    

    Extends: Jx.Adaptor.Tree,
    Family: 'Jx.Adaptor.Tree.Parent',
    
    options: {
        parentColumn: 'parent',
        folderColumn: 'folder'
    },
        
    /**
     * APIMethod: hasChildren
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasChildren: function (index) {
    	return this.store.get(this.options.folderColumn, index);
    },
    
    /**
     * APIMethod: hasParent
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasParent: function (index) {
        if (this.store.get(this.options.parentColumn, index).toInt() !== -1) {
            return true;
        } 
        return false;
    },
    
    /**
     * APIMethod: getParentIndex
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    getParentIndex: function (index) {
        //get the parent based on the index
        var pk = this.store.get(this.options.parentColumn, index);
        return this.store.findByColumn('primaryKey', pk);
    }
});/*
---

name: Jx.Adaptor.Combo

description: Namespace for all Jx.Combo adaptors.

license: MIT-style license.

requires:
 - Jx.Adaptor

provides: [Jx.Adaptor.Combo]

...
*/
/**
 * Class: Jx.Adaptor.Combo
 * The namespace for all combo adaptors
 */
Jx.Adaptor.Combo = {};/*
---

name: Jx.Adaptor.Combo.Fill

description: Loads data into a Jx.Combo instance from designated column(s) of a data source.

license: MIT-style license.

requires:
 - Jx.Adaptor.Combo

provides: [Jx.Adaptor.Combo.Fill]

...
 */
Jx.Adaptor.Combo.Fill = new Class({

    Family: 'Jx.Adaptor.Combo.Fill',
    Extends: Jx.Adaptor,
    name: 'combo.fill',
    Binds: ['fill'],

    /**
     * Note: option.template is used for constructing the text for the label
     */
    options: {
        /**
         * Option: imagePathColumn
         * points to a store column that holds the image information
         * for the combo items.
         */
        imagePathColumn: null,
        /**
         * Option: imageClassColumn
         * Points to a store column that holds the image class
         * information for the combo items
         */
        imageClassColumn: null,
        /**
         * Option: selectedFn
         * This should be a function that could be run to determine if
         * an item should be selected. It will get passed the current store
         * record as the only parameter. It should return either true or false.
         */
        selectedFn: null,
        /**
         * Option: noRepeats
         * This option allows you to use any store even if it has duplicate
         * values in it. With this option set to true the adaptor will keep
         * track of all of teh labels it adds and will not add anything that's
         * a duplicate.
         */
        noRepeats: false
    },

    labels: null,

    init: function () {
        this.parent();

        if (this.options.noRepeat) {
            this.labels = [];
        }
    },

    attach: function (combo) {
        this.parent(combo);

        this.store.addEvent('storeDataLoaded', this.fill);
        if (this.store.loaded) {
            this.fill();
        }
    },

    detach: function () {
        this.parent();

        this.store.removeEvent('storeDataLoaded', this.fill);
    },

    fill: function () {
        var template,
            items=[],
            selected,
            obj,
            options = this.options,
            noRepeat = this.options.noRepeat;
        //empty the combo
        this.widget.empty();
        //reset the store and cycle through creating the objects
        //to pass to combo.add()
        this.store.first();
        items = [];
        this.store.each(function(record){
            template = this.store.fillTemplate(record,options.template,this.columnsNeeded);
            if (!noRepeat || (noRepeat && !this.labels.contains(template))) {
                selected = false;
                if ($type(options.selectedFn) == 'function') {
                    selected = options.selectedFn.run(record);
                }
                obj = {
                    label: template,
                    image: record.get(options.imagePathColumn),
                    imageClass: record.get(options.imageClassColumn),
                    selected: selected
                };
                items.push(obj);

                if (noRepeat) {
                    this.labels.push(template);
                }
            }

        },this);
        //pass all of the objects at once
        this.widget.add(items);
    }
});/*
---

name: Jx.Menu.Context

description: A Jx.Menu that has no button but can be opened at a specific browser location to implement context menus (for instance).

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Context]

css:
 - menu

...
 */
// $Id$
/**
 * Class: Jx.Menu.Context
 *
 * Extends: Jx.Menu
 *
 * A <Jx.Menu> that has no button but can be opened at a specific
 * browser location to implement context menus (for instance).
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * TODO - add open/close events?
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu.Context = new Class({
    Family: 'Jx.Menu.Context',
    Extends: Jx.Menu,

    parameters: ['id'],

    /**
     * APIMethod: render
     * create a new context menu
     */
    render: function() {
        this.id = document.id(this.options.id);
        if (this.id) {
            this.id.addEvent('contextmenu', this.show.bindWithEvent(this));
        }
        this.parent();
    },
    /**
     * Method: show
     * Show the context menu at the location of the mouse click
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    show : function(e) {
        if (this.list.count() ==0) {
            return;
        }
        
        this.target = e.target;

        this.contentContainer.setStyle('visibility','hidden');
        this.contentContainer.setStyle('display','block');
        document.id(document.body).adopt(this.contentContainer);
        /* we have to size the container for IE to render the chrome correctly
         * but just in the menu/sub menu case - there is some horrible peekaboo
         * bug in IE related to ULs that we just couldn't figure out
         */
         this.contentContainer.setStyles({
           width: null,
           height: null
         });
        this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

        this.position(this.contentContainer, document.body, {
            horizontal: [e.page.x + ' left'],
            vertical: [e.page.y + ' top', e.page.y + ' bottom'],
            offsets: this.chromeOffsets
        });

        this.contentContainer.setStyle('visibility','');
        this.showChrome(this.contentContainer);

        document.addEvent('mousedown', this.bound.hide);
        document.addEvent('keyup', this.bound.keypress);

        e.stop();
    }
});/*
---

name: Jx.Menu.Separator

description: Convenience class to create a visual separator in a menu.

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Separator]

images:
 - toolbar_separator_v.png

...
 */
// $Id$
/**
 * Class: Jx.Menu.Separator
 *
 * Extends: <Jx.Object>
 *
 * A convenience class to create a visual separator in a menu.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu.Separator = new Class({
    Family: 'Jx.Menu.Separator',
    Extends: Jx.Widget,
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the separator is contained
     * within
     */
    domObj: null,
    /**
     * Property: owner
     * {<Jx.Menu>, <Jx.Menu.SubMenu>} the menu that the separator is in.
     */
    owner: null,
    options: {
        template: "<li class='jxMenuItemContainer jxMenuItem'><span class='jxMenuSeparator'>&nbsp;</span></li>"
    },
    classes: new Hash({
        domObj: 'jxMenuItem'
    }),
    /**
     * APIMethod: render
     * Create a new instance of a menu separator
     */
    render: function() {
        this.parent();
        this.domObj.store('jxMenuItem', this);
    },
    cleanup: function() {
      this.domObj.eliminate('jxMenuItem');
      this.owner = null;
      this.parent();
    },
    /**
     * Method: setOwner
     * Set the ownder of this menu item
     *
     * Parameters:
     * obj - {Object} the new owner
     */
    setOwner: function(obj) {
        this.owner = obj;
    },
    /**
     * Method: hide
     * Hide the menu item.
     */
    hide: $empty,
    /**
     * Method: show
     * Show the menu item
     */
    show: $empty
});/*
---

name: Jx.Menu.SubMenu

description: A sub menu contains menu items within a main menu or another sub menu.

license: MIT-style license.

requires:
 - Jx.Menu.Item
 - Jx.Menu

provides: [Jx.Menu.SubMenu]

...
 */
// $Id$
/**
 * Class: Jx.Menu.SubMenu
 *
 * Extends: <Jx.Menu.Item>
 *
 * Implements: <Jx.AutoPosition>, <Jx.Chrome>
 *
 * A sub menu contains menu items within a main menu or another
 * sub menu.
 *
 * The structure of a SubMenu is the same as a <Jx.Menu.Item> with
 * an additional unordered list element appended to the container.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu.SubMenu = new Class({
    Family: 'Jx.Menu.SubMenu',
    Extends: Jx.Menu.Item,
    /**
     * Property: subDomObj
     * {HTMLElement} the HTML container for the sub menu.
     */
    subDomObj: null,
    /**
     * Property: owner
     * {<Jx.Menu> or <Jx.SubMenu>} the menu or sub menu that this sub menu
     * belongs
     */
    owner: null,
    /**
     * Property: visibleItem
     * {<Jx.MenuItem>} the visible item within the menu
     */
    visibleItem: null,
    /**
     * Property: list
     * {<Jx.List>} a list to manage menu items
     */
    list: null,
    options: {
        template: '<li class="jxMenuItemContainer"><a class="jxMenuItem jxButtonSubMenu"><span class="jxMenuItemContent"><img class="jxMenuItemIcon" src="'+Jx.aPixel.src+'"><span class="jxMenuItemLabel"></span></span></a></li>',
        position: {
            horizontal: ['right left', 'left right'],
            vertical: ['top top']
        }
    },

    /**
     * APIMethod: render
     * Create a new instance of Jx.SubMenu
     */
    render: function() {
        this.parent();
        this.open = false;

        this.menu = new Jx.Menu(null, {
            position: this.options.position
        });
        this.menu.domObj = this.domObj;
    },
    cleanup: function() {
      this.menu.domObj = null;
      this.menu.destroy();
      this.menu = null;
      this.parent();
    },
    /**
     * Method: setOwner
     * Set the owner of this sub menu
     *
     * Parameters:
     * obj - {Object} the owner
     */
    setOwner: function(obj) {
        this.owner = obj;
        this.menu.owner = obj;
    },
    /**
     * Method: show
     * Show the sub menu
     */
    show: function() {
        if (this.open || this.menu.list.count() == 0) {
            return;
        }
        this.menu.show();
        this.open = true;
        // this.setActive(true);
    },

    eventInMenu: function(e) {
        if (this.visibleItem &&
            this.visibleItem.eventInMenu &&
            this.visibleItem.eventInMenu(e)) {
            return true;
        }
        return document.id(e.target).descendantOf(this.domObj) ||
               this.menu.eventInMenu(e);
    },

    /**
     * Method: hide
     * Hide the sub menu
     */
    hide: function() {
        if (!this.open) {
            return;
        }
        this.open = false;
        this.menu.hide();
        this.visibleItem = null;
    },
    /**
     * Method: add
     * Add menu items to the sub menu.
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to add.  Multiple menu items
     * can be added by passing multiple arguments to this function.
     */
    add: function(item, position) {
        this.menu.add(item, position, this);
        return this;
    },
    /**
     * Method: remove
     * Remove a menu item from the menu
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to remove
     */
    remove: function(item) {
        this.menu.remove(item);
        return this;
    },
    /**
     * Method: replace
     * Replace a menu item with another menu item
     *
     * Parameters:
     * what - {<Jx.MenuItem>} the menu item to replace
     * withWhat - {<Jx.MenuItem>} the menu item to replace it with
     */
    replace: function(item, withItem) {
        this.menu.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: empty
     * remove all items from the sub menu
     */
    empty: function() {
      this.menu.empty();
    },
    /**
     * Method: deactivate
     * Deactivate the sub menu
     *
     * Parameters:
     * e - {Event} the event that triggered the menu being
     * deactivated.
     */
    deactivate: function(e) {
        if (this.owner) {
            this.owner.deactivate(e);
        }
    },
    /**
     * Method: isActive
     * Indicate if this sub menu is active
     *
     * Returns:
     * {Boolean} true if the <Jx.Menu> that ultimately contains
     * this sub menu is active, false otherwise.
     */
    isActive: function() {
        if (this.owner) {
            return this.owner.isActive();
        } else {
            return false;
        }
    },
    /**
     * Method: setActive
     * Set the active state of the <Jx.Menu> that contains this sub menu
     *
     * Parameters:
     * isActive - {Boolean} the new active state
     */
    setActive: function(isActive) {
        if (this.owner && this.owner.setActive) {
            this.owner.setActive(isActive);
        }
    },
    /**
     * Method: setVisibleItem
     * Set a sub menu of this menu to be visible and hide the previously
     * visible one.
     *
     * Parameters:
     * obj - {<Jx.SubMenu>} the sub menu that should be visible
     */
    setVisibleItem: function(obj) {
        if (this.visibleItem != obj) {
            if (this.visibleItem && this.visibleItem.hide) {
                this.visibleItem.hide();
            }
            this.visibleItem = obj;
            this.visibleItem.show();
        }
    }
});/*
---

name: Jx.Splitter.Snap

description: A helper class to create an element that can snap a split panel open or closed.

license: MIT-style license.

requires:
 - Jx.Splitter

provides: [Jx.Splitter.Snap]

...
 */
// $Id$
/**
 * Class: Jx.Splitter.Snap
 *
 * Extends: <Jx.Object>
 *
 * A helper class to create an element that can snap a split panel open or
 * closed.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Splitter.Snap = new Class({
    Family: 'Jx.Splitter.Snap',
    Extends: Jx.Object,
    /**
     * Property: snap
     * {HTMLElement} the DOM element of the snap (the thing that gets
     * clicked).
     */
    snap: null,
    /**
     * Property: element
     * {HTMLElement} An element of the <Jx.Splitter> that gets controlled
     * by this snap
     */
    element: null,
    /**
     * Property: splitter
     * {<Jx.Splitter>} the splitter that this snap is associated with.
     */
    splitter: null,
    /**
     * Property: layout
     * {String} track the layout of the splitter for convenience.
     */
    layout: 'vertical',
    /**
     * Parameters:
     * snap - {HTMLElement} the clickable thing that snaps the element
     *           open and closed
     * element - {HTMLElement} the element that gets controlled by the snap
     * splitter - {<Jx.Splitter>} the splitter that this all happens inside of.
     */
    parameters: ['snap','element','splitter','events'],

    /**
     * APIMethod: init
     * Create a new Jx.Splitter.Snap
     */
    init: function() {
        this.snap = this.options.snap;
        this.element = this.options.element;
        this.splitter = this.options.splitter;
        this.events = this.options.events;
        var jxl = this.element.retrieve('jxLayout');
        jxl.addEvent('sizeChange', this.sizeChange.bind(this));
        this.layout = this.splitter.options.layout;
        var jxo = jxl.options;
        var size = this.element.getContentBoxSize();
        if (this.layout == 'vertical') {
            this.originalSize = size.height;
            this.minimumSize = jxo.minHeight ? jxo.minHeight : 0;
        } else {
            this.originalSize = size.width;
            this.minimumSize = jxo.minWidth ? jxo.minWidth : 0;
        }
        this.events.each(function(eventName) {
            this.snap.addEvent(eventName, this.toggleElement.bind(this));
        }, this);
    },

    /**
     * Method: toggleElement
     * Snap the element open or closed.
     */
    toggleElement: function() {
        var size = this.element.getContentBoxSize();
        var newSize = {};
        if (this.layout == 'vertical') {
            if (size.height == this.minimumSize) {
                newSize.height = this.originalSize;
            } else {
                this.originalSize = size.height;
                newSize.height = this.minimumSize;
            }
        } else {
            if (size.width == this.minimumSize) {
                newSize.width = this.originalSize;
            } else {
                this.originalSize = size.width;
                newSize.width = this.minimumSize;
            }
        }
        this.element.resize(newSize);
        this.splitter.sizeChanged();
    },

    /**
     * Method: sizeChanged
     * Handle the size of the element changing to see if the
     * toggle state has changed.
     */
    sizeChange: function() {
        var size = this.element.getContentBoxSize();
        if (this.layout == 'vertical') {
            if (size.height == this.minimumSize) {
                this.snap.addClass('jxSnapClosed');
                this.snap.removeClass('jxSnapOpened');
            } else {
                this.snap.addClass('jxSnapOpened');
                this.snap.removeClass('jxSnapClosed');
            }
        } else {
            if (size.width == this.minimumSize) {
                this.snap.addClass('jxSnapClosed');
                this.snap.removeClass('jxSnapOpened');
            } else {
                this.snap.addClass('jxSnapOpened');
                this.snap.removeClass('jxSnapClosed');
            }
        }
    }
});/*
---

name: Jx.Tab

description: A single tab in a tab set.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.Layout

provides: [Jx.Tab]

css:
 - tab

images:
 - tab_top.png
 - tab_bottom.png
 - tab_left.png
 - tab_right.png
 - tab_close.png

...
 */
// $Id$
/**
 * Class: Jx.Tab
 *
 * Extends: <Jx.Button>
 *
 * A single tab in a tab set.  A tab has a label (displayed in the tab) and a
 * content area that is displayed when the tab is active.  A tab has to be
 * added to both a <Jx.TabSet> (for the content) and <Jx.Toolbar> (for the
 * actual tab itself) in order to be useful.  Alternately, you can use
 * a <Jx.TabBox> which combines both into a single control at the cost of
 * some flexibility in layout options.
 *
 * A tab is a <Jx.ContentLoader> and you can specify the initial content of
 * the tab using any of the methods supported by
 * <Jx.ContentLoader::loadContent>.  You can acccess the actual DOM element
 * that contains the content (if you want to dynamically insert content
 * for instance) via the <Jx.Tab::content> property.
 *
 * A tab is a button of type *toggle* which means that it emits the *up*
 * and *down* events.
 *
 * Example:
 * (code)
 * var tab1 = new Jx.Tab({
 *     label: 'tab 1',
 *     content: 'content1',
 *     onDown: function(tab) {
 *         console.log('tab became active');
 *     },
 *     onUp: function(tab) {
 *         console.log('tab became inactive');
 *     }
 * });
 * (end)
 *
 *
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tab = new Class({
    Family: 'Jx.Tab',
    Extends: Jx.Button,
    /**
     * Property: content
     * {HTMLElement} The content area that is displayed when the tab is
     * active.
     */
    content: null,

    options: {
        /* Option: toggleClass
         * the CSS class to use for the button, 'jxTabToggle' by default
         */
        toggleClass: 'jxTabToggle',
        /* Option: pressedClass
         * the CSS class to use when the tab is pressed, 'jxTabPressed' by
         * default
         */
        pressedClass: 'jxTabPressed',
        /* Option: activeClass
         * the CSS class to use when the tab is active, 'jxTabActive' by 
         * default.
         */
        activeClass: 'jxTabActive',
        /* Option: activeTabClass
         * the CSS class to use on the content area of the active tab,
         * 'tabContentActive' by default.
         */
        activeTabClass: 'tabContentActive',
        /* Option: template
         * the HTML template for a tab
         */
        template: '<span class="jxTabContainer"><a class="jxTab"><span class="jxTabContent"><img class="jxTabIcon" src="'+Jx.aPixel.src+'"><span class="jxTabLabel"></span></span></a><a class="jxTabClose"></a></span>',
        /* Option: contentTemplate
         * the HTML template for a tab's content area
         */
        contentTemplate: '<div class="tabContent"></div>',
        /* Option: close
         * {Boolean} can the tab be closed by the user?  False by default.
         */
        close: false,
        /* Option: shouldClose
         * {Mixed} when a tab is closeable, the shouldClose option is checked
         * first to see if the tab should close.  You can provide a function
         * for this option that can be used to return a boolean value.  This
         * is useful if your tab contains something the user can edit and you
         * want to see if they want to discard the changes before closing.
         * The default value is true, meaning the tab will close immediately.
         * (code)
         * new Jx.Tab({
         *   label: 'test close',
         *   close: true,
         *   shouldClose: function() {
         *     return window.confirm('Are you sure?');
         *   }
         * });
         * (end)
         */
        shouldClose: true
    },
    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: new Hash({
        domObj: 'jxTabContainer',
        domA: 'jxTab',
        domImg: 'jxTabIcon',
        domLabel: 'jxTabLabel',
        domClose: 'jxTabClose',
        content: 'tabContent'
    }),

    /**
     * Method: render
     * Create a new instance of Jx.Tab.  Any layout options passed are used
     * to create a <Jx.Layout> for the tab content area.
     */
    render : function( ) {
        this.options = $merge(this.options, {toggle:true});
        this.parent();
        this.domObj.store('jxTab', this);
        this.processElements(this.options.contentTemplate, this.classes);
        new Jx.Layout(this.content, this.options);
        
        // load content onDemand if needed
        if(!this.options.loadOnDemand || this.options.active) {
          this.loadContent(this.content);
          // set active if needed
          if(this.options.active) {
            this.clicked();
          }
        }else{
          this.addEvent('contentLoaded', function(ev) {
            this.setActive(true);
          }.bind(this));
        }
        this.addEvent('down', function(){
            this.content.addClass(this.options.activeTabClass);
        }.bind(this));
        this.addEvent('up', function(){
            this.content.removeClass(this.options.activeTabClass);
        }.bind(this));

        //remove the close button if necessary
        if (this.domClose) {
            if (this.options.close) {
                this.domObj.addClass('jxTabClose');
                this.domClose.addEvent('click', (function(){
                  var shouldClose = true;
                  if ($defined(this.options.shouldClose)) {
                    if (typeof this.options.shouldClose == 'function') {
                      shouldClose = this.options.shouldClose();
                    } else {
                      shouldClose = this.options.shouldClose;
                    }
                  }
                  if (shouldClose) {
                    this.fireEvent('close');
                  }
                }).bind(this));
            } else {
                this.domClose.dispose();
            }
        }
    },
    /**
     * APIMethod: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     */
    clicked : function(evt) {
      if(this.options.enabled) {
        // just set active when caching is enabled
        if(this.contentIsLoaded && this.options.cacheContent) {
          this.setActive(true);
        // load on demand or reload content if caching is disabled
        }else if(this.options.loadOnDemand || !this.options.cacheContent){
          this.loadContent(this.content);
        }else{
          this.setActive(true);
        }
      }
    }
});

/* keep the old location temporarily */
Jx.Button.Tab = new Class({
  Extends: Jx.Tab,
  init: function() {
    if (console.warn) {
      console.warn('WARNING: Jx.Button.Tab has been renamed to Jx.Tab');
    } else {
      console.log('WARNING: Jx.Button.Tab has been renamed to Jx.Tab');
    }
    this.parent();
  }
});/*
---

name: Jx.TabSet

description: A TabSet manages a set of Jx.Tab content areas by ensuring that only one of the content areas is visible (i.e. the active tab).

license: MIT-style license.

requires:
 - Jx.Tab

provides: [Jx.TabSet]

...
 */
// $Id$
/**
 * Class: Jx.TabSet
 *
 * Extends: <Jx.Object>
 *
 * A TabSet manages a set of <Jx.Tab> content areas by ensuring that only one
 * of the content areas is visible (i.e. the active tab).  TabSet does not
 * manage the actual tabs.  The instances of <Jx.Tab> that are to be managed
 * as a set have to be added to both a TabSet and a <Jx.Toolbar>.  The content
 * areas of the <Jx.Tab>s are sized to fit the content area that the TabSet
 * is managing.
 *
 * Example:
 * (code)
 * var tabBar = new Jx.Toolbar('tabBar');
 * var tabSet = new Jx.TabSet('tabArea');
 *
 * var tab1 = new Jx.Tab('tab 1', {contentID: 'content1'});
 * var tab2 = new Jx.Tab('tab 2', {contentID: 'content2'});
 * var tab3 = new Jx.Tab('tab 3', {contentID: 'content3'});
 * var tab4 = new Jx.Tab('tab 4', {contentURL: 'test_content.html'});
 *
 * tabSet.add(t1, t2, t3, t4);
 * tabBar.add(t1, t2, t3, t4);
 * (end)
 *
 * Events:
 * tabChange - the current tab has changed
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TabSet = new Class({
    Family: 'Jx.TabSet',
    Extends: Jx.Object,
    /**
     * Property: tabs
     * {Array} array of tabs that are managed by this tab set
     */
    tabs: null,
    /**
     * Property: domObj
     * {HTMLElement} The HTML element that represents this tab set in the DOM.
     * The content areas of each tab are sized to fill the domObj.
     */
    domObj : null,
    /**
     * Parameters:
     * domObj - {HTMLElement} an element or id of an element to put the
     * content of the tabs into.
     * options - an options object, only event handlers are supported
     * as options at this time.
     */
    parameters: ['domObj','options'],

    /**
     * APIMethod: init
     * Create a new instance of <Jx.TabSet> within a specific element of
     * the DOM.
     */
    init: function() {
        this.tabs = [];
        this.domObj = document.id(this.options.domObj);
        if (!this.domObj.hasClass('jxTabSetContainer')) {
            this.domObj.addClass('jxTabSetContainer');
        }
        this.setActiveTabFn = this.setActiveTab.bind(this);
    },
    /**
     * Method: resizeTabBox
     * Resize the tab set content area and propogate the changes to
     * each of the tabs managed by the tab set.
     */
    resizeTabBox: function() {
        if (this.activeTab && this.activeTab.content.resize) {
            this.activeTab.content.resize({forceResize: true});
        }
    },

    /**
     * Method: add
     * Add one or more <Jx.Tab>s to the TabSet.
     *
     * Parameters:
     * tab - {<Jx.Tab>} an instance of <Jx.Tab> to add to the tab set.  More
     * than one tab can be added by passing extra parameters to this method.
     */
    add: function() {
        $A(arguments).flatten().each(function(tab) {
            if (tab instanceof Jx.Tab) {
                tab.addEvent('down',this.setActiveTabFn);
                tab.tabSet = this;
                this.domObj.appendChild(tab.content);
                this.tabs.push(tab);
                if ((!this.activeTab || tab.options.active) && tab.options.enabled) {
                    tab.options.active = false;
                    tab.setActive(true);
                }
            }
        }, this);
        return this;
    },
    /**
     * Method: remove
     * Remove a tab from this TabSet.  Note that it is the caller's responsibility
     * to remove the tab from the <Jx.Toolbar>.
     *
     * Parameters:
     * tab - {<Jx.Tab>} the tab to remove.
     */
    remove: function(tab) {
        if (tab instanceof Jx.Tab && this.tabs.indexOf(tab) != -1) {
            this.tabs.erase(tab);
            if (this.activeTab == tab) {
                if (this.tabs.length) {
                    this.tabs[0].setActive(true);
                }
            }
            tab.removeEvent('down',this.setActiveTabFn);
            tab.content.dispose();
        }
    },
    /**
     * Method: setActiveTab
     * Set the active tab to the one passed to this method
     *
     * Parameters:
     * tab - {<Jx.Tab>} the tab to make active.
     */
    setActiveTab: function(tab) {
        if (this.activeTab && this.activeTab != tab) {
            this.activeTab.setActive(false);
        }
        this.activeTab = tab;
        if (this.activeTab.content.resize) {
          this.activeTab.content.resize({forceResize: true});
        }
        this.fireEvent('tabChange', [this, tab]);
    }
});



/*
---

name: Jx.TabBox

description: A convenience class to handle the common case of a single toolbar directly attached to the content area of the tabs.

license: MIT-style license.

requires:
 - Jx.Toolbar
 - Jx.Panel
 - Jx.TabSet

provides: [Jx.TabBox]

images:
 - tabbar.png
 - tabbar_bottom.png
 - tabbar_left.png
 - tabbar_right.png

...
 */
// $Id$
/**
 * Class: Jx.TabBox
 *
 * Extends: <Jx.Widget>
 *
 * A convenience class to handle the common case of a single toolbar
 * directly attached to the content area of the tabs.  It manages both a
 * <Jx.Toolbar> and a <Jx.TabSet> so that you don't have to.  If you are using
 * a TabBox, then tabs only have to be added to the TabBox rather than to
 * both a <Jx.TabSet> and a <Jx.Toolbar>.
 *
 * Example:
 * (code)
 * var tabBox = new Jx.TabBox('subTabArea', 'top');
 *
 * var tab1 = new Jx.Button.Tab('Tab 1', {contentID: 'content4'});
 * var tab2 = new Jx.Button.Tab('Tab 2', {contentID: 'content5'});
 *
 * tabBox.add(tab1, tab2);
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TabBox = new Class({
    Family: 'Jx.TabBox',
    Extends: Jx.Widget,
    options: {
        /* Option: parent
         * a DOM element to add the tab box to
         */
        parent: null,
        /* Option: position
         * the position of the tab bar in the box, one of 'top', 'right',
         * 'bottom' or 'left'.  Top by default.
         */
        position: 'top',
        /* Option: height
         * a fixed height in pixels for the tab box.  If not set, it will fill
         * its container
         */
        height: null,
        /* Option: width
         * a fixed width in pixels for the tab box.  If not set, it will fill
         * its container
         */
        width: null,
        /* Option: scroll
         * should the tab bar scroll its tabs if there are too many to fit
         * in the toolbar, true by default
         */
        scroll:true
    },

    /**
     * Property: tabBar
     * {<Jx.Toolbar>} the toolbar for this tab box.
     */
    tabBar: null,
    /**
     * Property: tabSet
     * {<Jx.TabSet>} the tab set for this tab box.
     */
    tabSet: null,
    /**
     * APIMethod: render
     * Create a new instance of a TabBox.
     */
    render : function() {
        this.parent();
        this.tabBar = new Jx.Toolbar({
            position: this.options.position,
            scroll: this.options.scroll
        });
        this.panel = new Jx.Panel({
            toolbars: [this.tabBar],
            hideTitle: true,
            height: this.options.height,
            width: this.options.width
        });
        this.panel.domObj.addClass('jxTabBox');
        this.tabSet = new Jx.TabSet(this.panel.content);
        this.tabSet.addEvent('tabChange', function(tabSet, tab) {
            this.showItem(tab);
        }.bind(this.tabBar));
        this.domObj = this.panel.domObj;
        /* when the panel changes size, the tab set needs to update
         * the content areas.
         */
         this.panel.addEvent('sizeChange', (function() {
             this.tabSet.resizeTabBox();
             this.tabBar.domObj.getParent('.jxBarContainer').retrieve('jxBarContainer').update();
             this.tabBar.domObj.getParent('.jxBarContainer').addClass('jxTabBar'+this.options.position.capitalize());
         }).bind(this));
        /* when tabs are added or removed, we might need to layout
         * the panel if the toolbar is or becomes empty
         */
        this.tabBar.addEvents({
            add: (function() {
                this.domObj.resize({forceResize: true});
            }).bind(this),
            remove: (function() {
                this.domObj.resize({forceResize: true});
            }).bind(this)
        });
        /* trigger an initial resize when first added to the DOM */
        this.addEvent('addTo', function() {
            this.domObj.resize({forceResize: true});
        });
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    /**
     * Method: add
     * Add one or more <Jx.Tab>s to the TabBox.
     *
     * Parameters:
     * tab - {<Jx.Tab>} an instance of <Jx.Tab> to add to the tab box.  More
     * than one tab can be added by passing extra parameters to this method.
     * Unlike <Jx.TabSet>, tabs do not have to be added to a separate
     * <Jx.Toolbar>.
     */
    add : function() {
        this.tabBar.add.apply(this.tabBar, arguments);
        this.tabSet.add.apply(this.tabSet, arguments);
        $A(arguments).flatten().each(function(tab){
            tab.addEvents({
                close: (function(){
                    this.tabBar.remove(tab);
                    this.tabSet.remove(tab);
                }).bind(this)
            });
        }, this);
        return this;
    },
    /**
     * Method: remove
     * Remove a tab from the TabSet.
     *
     * Parameters:
     * tab - {<Jx.Tab>} the tab to remove.
     */
    remove : function(tab) {
        this.tabBar.remove(tab);
        this.tabSet.remove(tab);
    }
});
/*
---

name: Jx.Toolbar.Separator

description:  A helper class that represents a visual separator in a Jx.Toolbar.

license: MIT-style license.

requires:
 - Jx.Toolbar

provides: [Jx.Toolbar.Separator]

images:
 - toolbar_separator_h.png
 - toolbar_separator_v.png

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Separator
 *
 * Extends: <Jx.Object>
 *
 * A helper class that represents a visual separator in a <Jx.Toolbar>
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Separator = new Class({
    Family: 'Jx.Toolbar.Separator',
    Extends: Jx.Widget,
    /**
     * APIMethod: render
     * Create a new Jx.Toolbar.Separator
     */
    render: function() {
        this.domObj = new Element('li', {'class':'jxToolItem'});
        this.domSpan = new Element('span', {'class':'jxBarSeparator'});
        this.domObj.appendChild(this.domSpan);
    }
});
/*
---

name: Jx.Tree

description: Jx.Tree displays hierarchical data in a tree structure of folders and nodes.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.List

provides: [Jx.Tree]

css:
 - tree

images:
 - tree.png
 - tree_vert_line.png
...
 */
// $Id$
/**
 * Class: Jx.Tree
 *
 * Jx.Tree displays hierarchical data in a tree structure of folders and nodes.
 *
 * Example:
 * (code)
 * (end)
 *
 * Extends: <Jx.Widget>
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tree = new Class({
    Family: 'Jx.Tree',
    Extends: Jx.Widget,
    parameters: ['options','container', 'selection'],
    pluginNamespace: 'Tree',
    /**
     * APIProperty: selection
     * {<Jx.Selection>} the selection object for this tree.
     */
    selection: null,
    /**
     * Property: ownsSelection
     * {Boolean} indicates if this object created the <Jx.Selection> object
     * or not.  If true then the selection object will be destroyed when the
     * tree is destroyed, otherwise the selection object will not be
     * destroyed.
     */
    ownsSelection: false,
    /**
     * Property: list
     * {<Jx.List>} the list object is used to manage the DOM elements of the
     * items added to the tree.
     */
    list: null,
    dirty: true,
    /**
     * APIProperty: domObj
     * {HTMLElement} the DOM element that contains the visual representation
     * of the tree.
     */
    domObj: null,
    options: {
        /**
         * Option: select
         * {Boolean} are items in the tree selectable?  See <Jx.Selection>
         * for other options relating to selections that can be set here.
         */
        select: true,
        /**
         * Option: template
         * the default HTML template for a tree can be overridden
         */
        template: '<ul class="jxTreeRoot"></ul>'
    },
    /**
     * APIProperty: classes
     * {Hash} a hash of property to CSS class names for extracting references
     * to DOM elements from the supplied templates.  Requires
     * domObj element, anything else is optional.
     */
    classes: new Hash({domObj: 'jxTreeRoot'}),
    
    frozen: false,
    
    /**
     * APIMethod: render
     * Render the Jx.Tree.
     */
    render: function() {
        this.parent();
        if ($defined(this.options.container) &&
            document.id(this.options.container)) {
            this.domObj = this.options.container;
        }

        if (this.options.selection) {
            this.selection = this.options.selection;
        } else if (this.options.select) {
            this.selection = new Jx.Selection(this.options);
            this.ownsSelection = true;
        }

        this.bound.select = function(item) {
            this.fireEvent('select', item.retrieve('jxTreeItem'));
        }.bind(this);
        this.bound.unselect = function(item) {
            this.fireEvent('unselect', item.retrieve('jxTreeItem'));
        }.bind(this);
        this.bound.onAdd = function(item) {this.update();}.bind(this);
        this.bound.onRemove = function(item) {this.update();}.bind(this);

        if (this.selection && this.ownsSelection) {
            this.selection.addEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
        }

        this.list = new Jx.List(this.domObj, {
                hover: true,
                press: true,
                select: true,
                onAdd: this.bound.onAdd,
                onRemove: this.bound.onRemove
            }, this.selection);
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    /**
     * APIMethod: freeze
     * stop the tree from processing updates every time something is added or
     * removed.  Used for bulk changes, call thaw() when done updating.  Note
     * the tree will still display the changes but it will delay potentially
     * expensive recursion across the entire tree on every change just to
     * update visual styles.
     */
    freeze: function() { this.frozen = true; },
    /**
     * APIMethod: thaw
     * unfreeze the tree and recursively update styles
     */
    thaw: function() { this.frozen = false; this.update(true); },
    
    setDirty: function(state) {
      this.dirty = state;
      if (state && this.owner && this.owner.setDirty) {
        this.owner.setDirty(state);
      }
    },

    /**
     * APIMethod: add
     * add one or more items to the tree at a particular position in the tree
     *
     * Parameters:
     * item - {<Jx.TreeItem>} or an array of items to be added
     * position - {mixed} optional location to add the items.  By default,
     * this is 'bottom' meaning the items are added at the end of the list.
     * See <Jx.List::add> for options
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    add: function(item, position) {
        if ($type(item) == 'array') {
            item.each(function(what){ this.add(what, position); }.bind(this) );
            return;
        }
        item.addEvents({
            add: function(what) { this.fireEvent('add', what).bind(this); },
            remove: function(what) { this.fireEvent('remove', what).bind(this); },
            disclose: function(what) { this.fireEvent('disclose', what).bind(this); }
        });
        item.setSelection(this.selection);
        item.owner = this;
        this.list.add(item, position);
        this.setDirty(true);
        this.update(true);
        return this;
    },
    /**
     * APIMethod: remove
     * remove an item from the tree
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the tree item to remove
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    remove: function(item) {
        item.removeEvents('add');
        item.removeEvents('remove');
        item.removeEvents('disclose');
        item.owner = null;
        this.list.remove(item);
        item.setSelection(null);
        this.setDirty(true);
        this.update(true);
        return this;
    },
    /**
     * APIMethod: replace
     * replaces one item with another
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the tree item to remove
     * withItem - {<Jx.TreeItem>} the tree item to insert
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    replace: function(item, withItem) {
        item.owner = null;
        withItem.owner = this;
        this.list.replace(item, withItem);
        withItem.setSelection(this.selection);
        item.setSelection(null);
        this.setDirty(true);
        this.update(true);
        return this;
    },

    /**
     * Method: cleanup
     * Clean up a Jx.Tree instance
     */
    cleanup: function() {
        // stop updates when removing existing items.
        this.freeze();
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
            this.selection.destroy();
            this.selection = null;
        }
        this.list.removeEvents({
          remove: this.bound.onRemove,
          add: this.bound.onAdd
        });
        this.list.destroy();
        this.list = null;
        this.bound.select = null;
        this.bound.unselect = null;
        this.bound.onRemove = null;
        this.bound.onAdd = null;
        this.parent();
    },
    
    /**
     * Method: update
     * Update the CSS of the Tree's DOM element in case it has changed
     * position
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     */
    update: function(shouldDescend, isLast) {
        // since the memory leak cleanup, it seems that update gets called
        // from the bound onRemove event after the list has been cleaned
        // up.  I suspect that there is a delayed function call for IE in
        // event handling (or some such thing) PS
        if (!this.list) return;
        if (this.frozen) return;
        
        if ($defined(isLast)) {
            if (isLast) {
                this.domObj.removeClass('jxTreeNest');
            } else {
                this.domObj.addClass('jxTreeNest');
            }
        }
        var last = this.list.count() - 1;
        this.list.each(function(item, idx){
            var lastItem = idx == last;
            if (item.retrieve('jxTreeFolder')) {
                item.retrieve('jxTreeFolder').update(shouldDescend, lastItem);
            }
            if (item.retrieve('jxTreeItem')) {
                item.retrieve('jxTreeItem').update(lastItem);
            }
        });
        this.setDirty(false);
    },

    /**
     * APIMethod: items
     * return an array of tree item instances contained in this tree.
     * Does not descend into folders but does return a reference to the
     * folders
     */
    items: function() {
        return this.list.items().map(function(item) {
            return item.retrieve('jxTreeItem');
        });
    },
    /**
     * APIMethod: empty
     * recursively empty this tree and any folders in it
     */
    empty: function() {
        this.list.items().each(function(item){
          var f = item.retrieve('jxTreeItem');
          if (f && f instanceof Jx.TreeFolder) {
            f.empty();
          }
          if (f && f instanceof Jx.TreeItem) {
            this.remove(f);
            f.destroy();
          }
        }, this);
        this.setDirty(true);
    },

    /**
     * APIMethod: findChild
     * Get a reference to a child node by recursively searching the tree
     *
     * Parameters:
     * path - {Array} an array of labels of nodes to search for
     *
     * Returns:
     * {Object} the node or null if the path was not found
     */
    findChild : function(path) {
        //path is empty - we are asking for this node
        if (path.length == 0) {
            return false;
        }
        //path has more than one thing in it, find a folder and descend into it
        var name = path[0];
        var result = false;
        this.list.items().some(function(item) {
            var treeItem = item.retrieve('jxTreeItem');
            if (treeItem && treeItem.getLabel() == name) {
                if (path.length > 0) {
                    var folder = item.retrieve('jxTreeFolder');
                    if (folder && path.length > 1) {
                        result = folder.findChild(path.slice(1, path.length));
                    } else {
                      result = treeItem;
                    }
                } else {
                    result = treeItem;
                }
            }
            return result;
        });
        return result;
    },
    
    /**
     * APIMethod: setSelection
     * sets the <Jx.Selection> object to be used by this tree.  Used primarily
     * by <Jx.TreeFolder> to propogate a single selection object throughout a
     * tree.
     *
     * Parameters:
     * selection - {<Jx.Selection>} the new selection object to use
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining
     */
    setSelection: function(selection) {
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents(this.bound);
            this.selection.destroy();
            this.ownsSelection = false;
        }
        this.selection = selection;
        this.list.setSelection(selection);
        this.list.each(function(item) {
            item.retrieve('jxTreeItem').setSelection(selection);
        });
        return this;
    }
});

/*
---

name: Jx.TreeItem

description: An item in a tree.

license: MIT-style license.

requires:
 - Jx.Widget

optional:
 - More/Drag

provides: [Jx.TreeItem]

images:
 - tree_hover.png

...
 */
// $Id$
/**
 * Class: Jx.TreeItem
 *
 * Extends: <Jx.Widget>
 *
 * An item in a tree.  An item is a leaf node that has no children.
 *
 * Jx.TreeItem supports selection via the click event.  The application
 * is responsible for changing the style of the selected item in the tree
 * and for tracking selection if that is important.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * click - triggered when the tree item is clicked
 *
 * Implements:
 * Events - MooTools Class.Extras
 * Options - MooTools Class.Extras
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TreeItem = new Class ({
    Family: 'Jx.TreeItem',
    Extends: Jx.Widget,
    selection: null,
    /**
     * Property: domObj
     * {HTMLElement} a reference to the HTML element that is the TreeItem
     * in the DOM
     */
    domObj : null,
    /**
     * Property: owner
     * {Object} the folder or tree that this item belongs to
     */
    owner: null,
    options: {
        /* Option: label
         * {String} the label to display for the TreeItem
         */
        label: '',
        /* Option: contextMenu
         * {<Jx.ContextMenu>} the context menu to trigger if there
         * is a right click on the node
         */
        contextMenu: null,
        /* Option: enabled
         * {Boolean} the initial state of the TreeItem.  If the
         * TreeItem is not enabled, it cannot be clicked.
         */
        enabled: true,
        selectable: true,
        /* Option: image
         * {String} URL to an image to use as the icon next to the
         * label of this TreeItem
         */
        image: null,
        /* Option: imageClass
         * {String} CSS class to apply to the image, useful for using CSS
         * sprites
         */
        imageClass: '',
        lastLeafClass: 'jxTreeLeafLast',
        template: '<li class="jxTreeContainer jxTreeLeaf"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a></li>',
        busyMask: {
          message: null
        }
    },
    classes: new Hash({
        domObj: 'jxTreeContainer',
        domA: 'jxTreeItem',
        domImg: 'jxTreeImage',
        domIcon: 'jxTreeIcon',
        domLabel: 'jxTreeLabel'
    }),

    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeItem with the associated options
     */
    render : function() {
        this.parent();

        this.domObj = this.elements.get('jxTreeContainer');
        this.domObj.store('jxTreeItem', this);
        this.domA.store('jxTreeItem', this);
        if (this.options.contextMenu) {
          this.domA.store('jxContextMenu', this.options.contextMenu);
        }
        /* the target for jxPressed, jxSelected, jxHover classes */
        this.domObj.store('jxListTarget', this.domA);

        if (!this.options.selectable) {
            this.domObj.addClass('jxUnselectable');
        }

        if (this.options.id) {
            this.domObj.id = this.options.id;
        }
        if (!this.options.enabled) {
            this.domObj.addClass('jxDisabled');
        }

        if (this.options.image && this.domIcon) {
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
            if (this.options.imageClass) {
                this.domIcon.addClass(this.options.imageClass);
            }

        }

        if (this.options.label && this.domLabel) {
            this.setLabel(this.options.label);
        }

        if (this.domA) {
            this.domA.addEvents({
                click: this.click.bind(this),
                dblclick: this.dblclick.bind(this),
                drag: function(e) { e.stop(); }
            });
            if (typeof Drag != 'undefined') {
                new Drag(this.domA, {
                    onStart: function() {this.stop();}
                });
            }
        }

        if ($defined(this.options.enabled)) {
            this.enable(this.options.enabled, true);
        }
    },
    
    setDirty: function(state) {
      if (state && this.owner && this.owner.setDirty) {
        this.owner.setDirty(state);
      }
    },
    
    /**
     * Method: finalize
     * Clean up the TreeItem and remove all DOM references
     */
    finalize: function() { this.destroy(); },
    /**
     * Method: finalizeItem
     * Clean up the TreeItem and remove all DOM references
     */
    cleanup: function() {
      this.domObj.eliminate('jxTreeItem');
      this.domA.eliminate('jxTreeItem');
      this.domA.eliminate('jxContextMenu');
      this.domObj.eliminate('jxListTarget');
      this.domObj.eliminate('jxListTargetItem');
      this.domA.removeEvents();
      this.owner = null;
      this.selection = null;
      this.parent();
    },
    /**
     * Method: update
     * Update the CSS of the TreeItem's DOM element in case it has changed
     * position
     *
     * Parameters:
     * isLast - {Boolean} is the item the last one or not?
     */
    update : function(isLast) {
        if (isLast) {
            this.domObj.addClass(this.options.lastLeafClass);
        } else {
            this.domObj.removeClass(this.options.lastLeafClass);
        }
    },
    click: function() {
        if (this.options.enabled) {
            this.fireEvent('click', this);
        }
    },
    dblclick: function() {
        if (this.options.enabled) {
            this.fireEvent('dblclick', this);
        }
    },
    /**
     * Method: select
     * Select a tree node.
     */
    select: function() {
        if (this.selection && this.options.enabled) {
            this.selection.select(this.domA);
        }
    },

    /**
     * Method: getLabel
     * Get the label associated with a TreeItem
     *
     * Returns:
     * {String} the name
     */
    getLabel: function() {
        return this.options.label;
    },

    /**
     * Method: setLabel
     * set the label of a tree item
     */
    setLabel: function(label) {
        this.options.label = label;
        if (this.domLabel) {
            this.domLabel.set('html',this.getText(label));
            this.setDirty(true);
        }
    },

    setImage: function(url, imageClass) {
        if (this.domIcon && $defined(url)) {
            this.options.image = url;
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
            this.setDirty(true);
        }
        if (this.domIcon && $defined(imageClass)) {
            this.domIcon.removeClass(this.options.imageClass);
            this.options.imageClass = imageClass;
            this.domIcon.addClass(imageClass);
            this.setDirty(true);
        }
    },
    enable: function(state, force) {
        if (this.options.enabled != state || force) {
            this.options.enabled = state;
            if (this.options.enabled) {
                this.domObj.removeClass('jxDisabled');
                this.fireEvent('enabled', this);
            } else {
                this.domObj.addClass('jxDisabled');
                this.fireEvent('disabled', this);
                if (this.selection) {
                    this.selection.unselect(document.id(this));
                }
            }
        }
    },

    /**
     * Method: propertyChanged
     * A property of an object has changed, synchronize the state of the
     * TreeItem with the state of the object
     *
     * Parameters:
     * obj - {Object} the object whose state has changed
     */
    propertyChanged : function(obj) {
        this.options.enabled = obj.isEnabled();
        if (this.options.enabled) {
            this.domObj.removeClass('jxDisabled');
        } else {
            this.domObj.addClass('jxDisabled');
        }
    },
    setSelection: function(selection){
        this.selection = selection;
    },
    
    /**
     * APIMethod: setBusy
     * set the busy state of the widget
     *
     * Parameters:
     * busy - {Boolean} true to set the widget as busy, false to set it as
     *    idle.
     */
    setBusy: function(state) {
      if (this.busy == state) {
        return;
      }
      this.busy = state;
      this.fireEvent('busy', this.busy);
      if (this.busy) {
        this.domImg.addClass(this.options.busyClass)
      } else {
        if (this.options.busyClass) {
          this.domImg.removeClass(this.options.busyClass);
        }
      }
    },
    changeText : function(lang) {
      this.parent();
      this.setLabel(this.options.label);
    }
});
/*
---

name: Jx.TreeFolder

description: A Jx.TreeFolder is an item in a tree that can contain other items. It is expandable and collapsible.

license: MIT-style license.

requires:
 - Jx.TreeItem
 - Jx.Tree

provides: [Jx.TreeFolder]

...
 */
// $Id$
/**
 * Class: Jx.TreeFolder
 *
 * A Jx.TreeFolder is an item in a tree that can contain other items.  It is
 * expandable and collapsible.
 *
 * Example:
 * (code)
 * (end)
 *
 * Extends:
 * <Jx.TreeItem>
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TreeFolder = new Class({
    Family: 'Jx.TreeFolder',
    Extends: Jx.TreeItem,
    /**
     * Property: tree
     * {<Jx.Tree>} a Jx.Tree instance for managing the folder contents
     */
    tree : null,
    
    options: {
        /* Option: open
         * is the folder open?  false by default.
         */
        open: false,
        /* folders will share a selection with the tree they are in */
        select: false,
        template: '<li class="jxTreeContainer jxTreeBranch"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a><ul class="jxTree"></ul></li>'
    },
    classes: new Hash({
        domObj: 'jxTreeContainer',
        domA: 'jxTreeItem',
        domImg: 'jxTreeImage',
        domIcon: 'jxTreeIcon',
        domLabel: 'jxTreeLabel',
        domTree: 'jxTree'
    }),
    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeFolder
     */
    render : function() {
        this.parent();
        this.domObj.store('jxTreeFolder', this);

        this.bound.toggle = this.toggle.bind(this);

        this.addEvents({
            click: this.bound.toggle,
            dblclick: this.bound.toggle
        });

        if (this.domImg) {
            this.domImg.addEvent('click', this.bound.toggle);
        }

        this.tree = new Jx.Tree({
            template: this.options.template,
            onAdd: function(item) {
                this.update();
                this.fireEvent('add', item);
            }.bind(this),
            onRemove: function(item) {
                this.update();
                this.fireEvent('remove', item);
            }.bind(this)
        }, this.domTree);
        if (this.options.open) {
            this.expand();
        } else {
            this.collapse();
        }

    },
    cleanup: function() {
      this.domObj.eliminate('jxTreeFolder');
      this.removeEvents({
        click: this.bound.toggle,
        dblclick: this.bound.toggle
      });
      if (this.domImg) {
        this.domImg.removeEvent('click', this.bound.toggle);
      }
      this.bound.toggle = null;
      this.tree.destroy();
      this.tree = null;
      this.parent();
    },
    /**
     * APIMethod: add
     * add one or more items to the folder at a particular position in the
     * folder
     *
     * Parameters:
     * item - {<Jx.TreeItem>} or an array of items to be added
     * position - {mixed} optional location to add the items.  By default,
     * this is 'bottom' meaning the items are added at the end of the list.
     * See <Jx.List::add> for options
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this object for chaining calls
     */
    add: function(item, position) {
        this.tree.add(item, position);
        return this;
    },
    /**
     * APIMethod: remove
     * remove an item from the folder
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the folder item to remove
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    remove: function(item) {
        this.tree.remove(item);
        return this;
    },
    /**
     * APIMethod: replace
     * replaces one item with another
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the tree item to remove
     * withItem - {<Jx.TreeItem>} the tree item to insert
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    replace: function(item, withItem) {
        this.tree.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: items
     * return an array of tree item instances contained in this tree.
     * Does not descend into folders but does return a reference to the
     * folders
     */
    items: function() {
        return this.tree.items();
    },
    /**
     * APIMethod: empty
     * recursively empty this folder and any folders in it
     */
    empty: function() {
        this.tree.empty();
    },
    /**
     * Method: update
     * Update the CSS of the TreeFolder's DOM element in case it has changed
     * position.
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     * isLast - {Boolean} is this the last item in the list?
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    update: function(shouldDescend,isLast) {
        /* avoid update if not attached to tree yet */
        if (!this.domObj.parentNode) return;
        
        if (this.tree.dirty || (this.owner && this.owner.dirty)) {
          if (!$defined(isLast)) {
              isLast = this.domObj.hasClass('jxTreeBranchLastOpen') ||
                       this.domObj.hasClass('jxTreeBranchLastClosed');
          }

          ['jxTreeBranchOpen','jxTreeBranchLastOpen','jxTreeBranchClosed',
          'jxTreeBranchLastClosed'].each(function(c){
              this.removeClass(c);
          }, this.domObj);

          var c = 'jxTreeBranch';
          c += isLast ? 'Last' : '';
          c += this.options.open ? 'Open' : 'Closed';
          this.domObj.addClass(c);
        }

        this.tree.update(shouldDescend, isLast);
    },
    /**
     * APIMethod: toggle
     * toggle the state of the folder between open and closed
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    toggle: function() {
        if (this.options.enabled) {
            if (this.options.open) {
                this.collapse();
            } else {
                this.expand();
            }
        }
        return this;
    },
    /**
     * APIMethod: expand
     * Expands the folder
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    expand : function() {
        this.options.open = true;
        document.id(this.tree).setStyle('display', 'block');
        this.setDirty(true);
        this.update(true);
        this.fireEvent('disclosed', this);
        return this;
    },
    /**
     * APIMethod: collapse
     * Collapses the folder
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    collapse : function() {
        this.options.open = false;
        document.id(this.tree).setStyle('display', 'none');
        this.setDirty(true);
        this.update(true);
        this.fireEvent('disclosed', this);
        return this;
    },
    /**
     * APIMethod: findChild
     * Get a reference to a child node by recursively searching the tree
     *
     * Parameters:
     * path - {Array} an array of labels of nodes to search for
     *
     * Returns:
     * {Object} the node or null if the path was not found
     */
    findChild : function(path) {
        //path is empty - we are asking for this node
        if (path.length == 0) {
            return this;
        } else {
            return this.tree.findChild(path);
        }
    },
    /**
     * Method: setSelection
     * sets the <Jx.Selection> object to be used by this folder.  Used
     * to propogate a single selection object throughout a tree.
     *
     * Parameters:
     * selection - {<Jx.Selection>} the new selection object to use
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    setSelection: function(selection) {
        this.tree.setSelection(selection);
        return this;
    },
    
    setDirty: function(state) {
      this.parent(state);
      if (this.tree) {
        this.tree.setDirty(true);
      }
    },
    
});/*
---

name: Jx.Slider

description: A wrapper for mootools' slider class to make it more Jx Friendly.

license: MIT-style license.

requires:
 - Jx.Widget
 - More/Slider

provides: [Jx.Slider]

css:
 - slider

...
 */
// $Id$
/**
 * Class: Jx.Slider
 * This class wraps the mootools-more slider class to make it more Jx friendly
 *
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
Jx.Slider = new Class({
    Family: 'Jx.Slider',
    Extends: Jx.Widget,

    options: {
        /**
         * Option: template
         * The template used to render the slider
         */
        template: '<div class="jxSliderContainer"><div class="jxSliderKnob"></div></div>',
        /**
         * Option: max
         * The maximum value the slider should have
         */
        max: 100,
        /**
         * Option: min
         * The minimum value the slider should ever have
         */
        min: 0,
        /**
         * Option: step
         * The distance between adjacent steps. For example, the default (1)
         * with min of 0 and max of 100, provides 100 steps between the min
         * and max values
         */
        step: 1,
        /**
         * Option: mode
         * Whether this is a vertical or horizontal slider
         */
        mode: 'horizontal',
        /**
         * Option: wheel
         * Whether the slider reacts to the scroll wheel.
         */
        wheel: true,
        /**
         * Option: snap
         * whether to snap to each step
         */
        snap: true,
        /**
         * Option: startAt
         * The value, or step, to put the slider at initially
         */
        startAt: 0,
        /**
         * Option: offset
         *
         */
        offset: 0,
        onChange: $empty,
        onComplete: $empty
    },
    classes: new Hash({
        domObj: 'jxSliderContainer',
        knob: 'jxSliderKnob'
    }),
    slider: null,
    knob: null,
    sliderOpts: null,
    /**
     * APIMethod: render
     * Create the slider but does not start it up due to issues with it
     * having to be visible before it will work properly.
     */
    render: function () {
        this.parent();
        
        /** 
         * Not sure why this is here...
         */
        /**
        if (this.domObj) {
            return;
        }
        **/

        this.sliderOpts = {
            range: [this.options.min, this.options.max],
            snap: this.options.snap,
            mode: this.options.mode,
            wheel: this.options.wheel,
            steps: (this.options.max - this.options.min) / this.options.step,
            offset: this.options.offset,
            onChange: this.change.bind(this),
            onComplete: this.complete.bind(this)
        };

    },
    /**
     * Method: change
     * Called when the slider moves
     */
    change: function (step) {
        this.fireEvent('change', [step, this]);
    },
    /**
     * Method: complete
     * Called when the slider stops moving and the mouse button is released.
     */
    complete: function (step) {
        this.fireEvent('complete', [step, this]);
    },
    /**
     * APIMethod: start
     * Call this method after the slider has been rendered in the DOM to start
     * it up and position the slider at the startAt poisition.
     */
    start: function () {
        if (!$defined(this.slider)) {
            this.slider = new Slider(this.domObj, this.knob, this.sliderOpts);
        }
        this.slider.set(this.options.startAt);
    },
    /**
     * APIMethod: set
     * set the value of the slider
     */
    set: function(value) {
      this.slider.set(value);
    }
});/*
---

name: Jx.Notice

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.ListItem

provides: [Jx.Notice]

images:
 - notice.png
 - notice_error.png
 - notice_warning.png
 - notice_success.png
 - icons.png


...
 */
// $Id$
/**
 * Class: Jx.Notice
 *
 * Extends: <Jx.ListItem>
 *
 * Events:
 * 
 * MooTools.lang Keys:
 * - notice.closeTip
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Notice = new Class({

    Family: 'Jx.Notice',
    Extends: Jx.ListItem,

    options: {
        /**
         * Option: fx
         * the effect to use on the notice when it is shown and hidden,
         * 'fade' by default
         */
        fx: 'fade',
        /**
         * Option: chrome
         * {Boolean} should the notice be displayed with chrome or not,
         * default is false
         */
        chrome: false,
        /**
         * Option: enabled
         * {Boolean} default is false
         */
        enabled: true,
        /**
         * Option: template
         * {String} the HTML template of a notice
         */
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + MooTools.lang.get('Jx','notice').closeTip + '"></a></div></li>',
        /**
         * Option: klass
         * {String} css class to add to the notice
         */
        klass: ''
    },

    classes: new Hash({
        domObj: 'jxNoticeItemContainer',
        domItem: 'jxNoticeItem',
        domContent: 'jxNotice',
        domClose: 'jxNoticeClose'
    }),

    /**
     * Method: render
     */
    render: function () {
        this.parent();
        
        if (this.options.klass) {
            this.domObj.addClass(this.options.klass);
        }
        if (this.domClose) {
            this.domClose.addEvent('click', this.close.bind(this));
        }
    },
    /**
     * APIMethod: close
     * close the notice
     */
    close: function() {
        this.fireEvent('close', this);
    },
    /**
     * APIMethod: show
     * show the notice
     */
    show: function(el, onComplete) {
        if (this.options.chrome) {
            this.showChrome();
        }
        if (this.options.fx) {
            document.id(el).adopt(this);
            if (onComplete) onComplete();
        } else {
            document.id(el).adopt(this);
            if (onComplete) onComplete();
        }
    },
    /**
     * APIMethod: hide
     * hide the notice
     */
    hide: function(onComplete) {
        if (this.options.chrome) {
            this.hideChrome();
        }
        if (this.options.fx) {
            document.id(this).dispose();
            if (onComplete) onComplete();
        } else {
            document.id(this).dispose();
            if (onComplete) onComplete();
        }
    },

    changeText : function(lang) {
        this.parent();
        //this.render();
        //this.processElements(this.options.template, this.classes);
    }
});
/**
 * Class: Jx.Notice.Information
 * A <Jx.Notice> subclass useful for displaying informational messages
 */
Jx.Notice.Information = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + MooTools.lang.get('Jx','notice').closeTip + '"></a></div></li>',
        klass: 'jxNoticeInformation'
    }
});
/**
 * Class: Jx.Notice.Success
 * A <Jx.Notice> subclass useful for displaying success messages
 */
Jx.Notice.Success = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + MooTools.lang.get('Jx','notice').closeTip + '"></a></div></li>',
        klass: 'jxNoticeSuccess'
    }
});
/**
 * Class: Jx.Notice.Success
 * A <Jx.Notice> subclass useful for displaying warning messages
 */
Jx.Notice.Warning = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Warning"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + MooTools.lang.get('Jx','notice').closeTip + '"></a></div></li>',
        klass: 'jxNoticeWarning'
    }
});
/**
 * Class: Jx.Notice.Error
 * A <Jx.Notice> subclass useful for displaying error messages
 */
Jx.Notice.Error = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Error"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + MooTools.lang.get('Jx','notice').closeTip + '"></a></div></li>',
        klass: 'jxNoticeError'
    }
});
/*
---

name: Jx.Notifier

description: Base class for notification areas that can hold temporary notices.

license: MIT-style license.

requires:
 - Jx.ListView
 - Jx.Notice
 - Core/Fx.Tween

provides: [Jx.Notifier]

css:
 - notification


...
 */
// $Id$
/**
 * Class: Jx.Notifier
 *
 * Extends: <Jx.ListView>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Notifier = new Class({
    
    Family: 'Jx.Notifier',
    Extends: Jx.ListView,
    
    options: {
        /**
         * Option: parent
         * The parent this notifier is to be placed in. If not specified, it
         * will be placed in the body of the document.
         */
        parent: null,
        /**
         * Option: template
         * This is the template for the notification container itself, not the
         * actual notice. The actual notice is below in the class property 
         * noticeTemplate.
         */
        template: '<div class="jxNoticeListContainer"><ul class="jxNoticeList"></ul></div>',
        /**
         * Option: listOptions
         * An object holding custom options for the internal Jx.List instance.
         */
        listOptions: { }
    },

    classes: new Hash({
        domObj: 'jxNoticeListContainer',
        listObj: 'jxNoticeList'
    }),
    
    /**
     * Method: render
     * render the widget
     */
    render: function () {
        this.parent();
        
        if (!$defined(this.options.parent)) {
            this.options.parent = document.body;
        }
        document.id(this.options.parent).adopt(this.domObj);
        
        this.addEvent('postRender', function() {
            if (Jx.type(this.options.items) == 'array') {
                this.options.items.each(function(item){
                    this.add(item);
                },this);
            }
        }.bind(this));
    },
    
    /**
     * APIMethod: add
     * Add a new notice to the notifier
     *
     * Parameters:
     * notice - {<Jx.Notice>} the notice to add
     */
    add: function (notice) {
        if (!(notice instanceof Jx.Notice)) {
            notice = new Jx.Notice({content: notice});
        }
        notice.addEvent('close', this.remove.bind(this));
        notice.show(this.listObj);
    },
    
    /**
     * APIMethod: remove
     * Add a new notice to the notifier
     *
     * Parameters:
     * notice - {<Jx.Notice>} the notice to remove
     */
    remove: function (notice) {
        if (this.domObj.hasChild(notice)) {
            notice.removeEvents('close');
            notice.hide();
        }
    }
});/*
---

name: Jx.Notifier.Float

description: A notification area that floats in a container above other content.

license: MIT-style license.

requires:
 - Jx.Notifier

provides: [Jx.Notifier.Float]

...
 */
// $Id$
/**
 * Class: Jx.Notifier.Float
 * A floating notice area for displaying notices, notices get chrome if
 * the notifier has chrome
 *
 * Extends: <Jx.Notifier>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Notifier.Float = new Class({
    
    Family: 'Jx.Notifier.Float',
    Extends: Jx.Notifier,
    
    options: {
        /**
         * Option: chrome
         * {Boolean} should the notifier have chrome - default true
         */
        chrome: true,
        /**
         * Option: fx
         * {String} the effect to use when showing and hiding the notifier,
         * default is null
         */
        fx: null,
        /**
         * Option: width
         * {Integer} the width in pixels of the notifier, default is 250
         */
        width: 250,
        /**
         * Option: position
         * {Object} position options to use with <Jx.Widget::position>
         * for positioning the Notifier
         */
        position: {
            horizontal: 'center center',
            vertical: 'top top'
        }
    },

    /**
     * Method: render
     * render the widget
     */
    render: function () {
        this.parent();
        this.domObj.setStyle('position','absolute');
        if ($defined(this.options.width)) {
            this.domObj.setStyle('width',this.options.width);
        }
        this.position(this.domObj, 
                      this.options.parent,
                      this.options.position);
    },
    
    /**
     * APIMethod: add
     * Add a new notice to the notifier
     *
     * Parameters:
     * notice - {<Jx.Notice>} the notice to add
     */
    add: function(notice) {
        if (!(notice instanceof Jx.Notice)) {
            notice = new Jx.Notice({content: notice});
        }
        notice.options.chrome = this.options.chrome;
        this.parent(notice);
    }
});/*
---

name: Jx.Scrollbar

description: An implementation of a custom CSS-styled scrollbar.

license: MIT-style license.

requires:
 - Jx.Slider

provides: [Jx.Scrollbar]

css:
 - scrollbar

...
 */
// $Id$
/**
 * Class: Jx.Scrollbar
 * Creates a custom scrollbar either vertically or horizontally (determined by
 * options). These scrollbars are designed to be styled entirely through CSS.
 * 
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 * 
 * Based in part on 'Mootools CSS Styled Scrollbar' on
 * http://solutoire.com/2008/03/10/mootools-css-styled-scrollbar/
 */
Jx.Scrollbar = new Class({
    
    Family: 'Jx.Scrollbar',
    
    Extends: Jx.Widget,
    
    Binds: ['scrollIt'],
    
    options: {
        /**
         * Option: direction
         * Determines which bars are visible. Valid options are 'horizontal'
         * or 'vertical'
         */
        direction: 'vertical',
        /**
         * Option: useMouseWheel
         * Whether to allow the mouse wheel to move the content. Defaults 
         * to true.
         */
        useMouseWheel: true,
        /**
         * Option: useScrollers
         * Whether to show the scrollers. Defaults to true.
         */
        useScrollers: true,
        /**
         * Option: scrollerInterval
         * The amount to scroll the content when using the scrollers. 
         * useScrollers option must be true. Default is 50 (px).
         */
        scrollerInterval: 50,
        /**
         * Option: template
         * the HTML template for a scrollbar
         */
        template: '<div class="jxScrollbarContainer"><div class="jxScrollLeft"></div><div class="jxSlider"></div><div class="jxScrollRight"></div></div>'
    },
    
    classes: new Hash({
        domObj: 'jxScrollbarContainer',
        scrollLeft: 'jxScrollLeft',
        scrollRight: 'jxScrollRight',
        sliderHolder: 'jxSlider'
    }),
    
    el: null,
    //element is the element we want to scroll. 
    parameters: ['element', 'options'],
    
    /**
     * Method: render
     * render the widget
     */
    render: function () {
        this.parent();
        this.el = document.id(this.options.element);
        if (this.el) {
            this.el.addClass('jxHas'+this.options.direction.capitalize()+'Scrollbar');
            
            //wrap content to make scroll work correctly
            var children = this.el.getChildren();
            this.wrapper = new Element('div',{
                'class': 'jxScrollbarChildWrapper'
            });
            
            /**
             * the wrapper needs the same settings as the original container
             * specifically, the width and height
             */ 
            this.wrapper.setStyles({
                width: this.el.getStyle('width'),
                height: this.el.getStyle('height')
            });
            
            children.inject(this.wrapper);
            this.wrapper.inject(this.el);
            
            this.domObj.inject(this.el);
            
            var scrollSize = this.wrapper.getScrollSize();
            var size = this.wrapper.getContentBoxSize();
            this.steps = this.options.direction==='horizontal'?scrollSize.x-size.width:scrollSize.y-size.height;
            this.slider = new Jx.Slider({
                snap: false,
                min: 0,
                max: this.steps,
                step: 1,
                mode: this.options.direction,
                onChange: this.scrollIt
                
            });
            
            if (!this.options.useScrollers) {
                this.scrollLeft.dispose();
                this.scrollRight.dispose();
                //set size of the sliderHolder
                if (this.options.direction === 'horizontal') {
                    this.sliderHolder.setStyle('width','100%');
                } else {
                    this.sliderHolder.setStyle('height', '100%');
                }
                
            } else {
                this.scrollLeft.addEvents({
                    mousedown: function () {
                        this.slider.slider.set(this.slider.slider.step - this.options.scrollerInterval);
                        this.pid = function () {
                            this.slider.slider.set(this.slider.slider.step - this.options.scrollerInterval);
                        }.periodical(1000, this);
                    }.bind(this),
                    mouseup: function () {
                        $clear(this.pid);
                    }.bind(this)
                });
                this.scrollRight.addEvents({
                    mousedown: function () {
                        this.slider.slider.set(this.slider.slider.step + this.options.scrollerInterval);
                        this.pid = function () {
                            this.slider.slider.set(this.slider.slider.step + this.options.scrollerInterval);
                        }.periodical(1000, this);
                    }.bind(this),
                    mouseup: function () {
                        $clear(this.pid);
                    }.bind(this)
                });
                //set size of the sliderHolder
                var holderSize, scrollerRightSize, scrollerLeftSize;
                if (this.options.direction === 'horizontal') {
                    scrollerRightSize = this.scrollRight.getMarginBoxSize().width;
                    scrollerLeftSize = this.scrollLeft.getMarginBoxSize().width;
                    holderSize = size.width - scrollerRightSize - scrollerLeftSize;
                    this.sliderHolder.setStyle('width', holderSize + 'px');
                } else {
                    scrollerRightSize = this.scrollRight.getMarginBoxSize().height;
                    scrollerLeftSize = this.scrollLeft.getMarginBoxSize().height;
                    holderSize = size.height - scrollerRightSize - scrollerLeftSize;
                    this.sliderHolder.setStyle('height', holderSize + 'px');
                }
            }
            document.id(this.slider).inject(this.sliderHolder);
            
            //allows mouse wheel to function
            if (this.options.useMouseWheel) {
                $$(this.el, this.domObj).addEvent('mousewheel', function(e){
                    e = new Event(e).stop();
                    var step = this.slider.slider.step - e.wheel * 30;
                    this.slider.slider.set(step);
                }.bind(this));
            }
            
            //stop slider if we leave the window
            document.id(document.body).addEvent('mouseleave', function(){ 
                this.slider.slider.drag.stop();
            }.bind(this));

            this.slider.start();
        }
    },
    
    /**
     * Method: scrollIt
     * scroll the content in response to the slider being moved.
     */
    scrollIt: function (step) {
        var x = this.options.direction==='horizontal'?step:0;
        var y = this.options.direction==='horizontal'?0:step;
        this.wrapper.scrollTo(x,y);
    }
});/*
---

name: Jx.Formatter

description: Base formatter object

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Formatter]

...
 */
 // $Id$
/**
 * Class: Jx.Formatter
 *
 * Extends: <Jx.Object>
 *
 * Base class used for specific implementations to coerce data into specific formats
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter = new Class({
    Family: 'Jx.Formatter',
    Extends: Jx.Object,

    /**
     * APIMethod: format
     * Empty method that must be overridden by subclasses to provide
     * the needed formatting functionality.
     */
    format: $empty
});/*
---

name: Jx.Formatter.Number

description: Formats numbers including negative and floats

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Number]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.Number
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats numbers. You can have it do the following
 *
 * o replace the decimal separator
 * o use/add a thousands separator
 * o change the precision (number of decimal places)
 * o format negative numbers with parenthesis
 *
 * Example:
 * (code)
 * (end)
 * 
 * MooTools.lang Keys:
 * - 'formatter.number'.decimalSeparator
 * - 'formatter.number'.thousandsSeparator
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Number = new Class({

    Extends: Jx.Formatter,

    options: {
        /**
         * Option: precision
         * The number of decimal places to round to
         */
        precision: 2,
        /**
         * Option: useParens
         * Whether negative numbers should be done with parenthesis
         */
        useParens: true,
        /**
         * Option: useThousands
         * Whether to use the thousands separator
         */
        useThousands: true
    },
    /**
     * APIMethod: format
     * Formats the provided number
     *
     * Parameters:
     * value - the raw number to format
     */
    format : function (value) {
            //first set the decimal
        if (Jx.type(value) === 'string') {
                //remove commas from the string
            var p = value.split(',');
            value = p.join('');
            value = value.toFloat();
        }
        value = value.toFixed(this.options.precision);

        //split on the decimalSeparator
        var parts = value.split('.');
        var dec = true;
        if (parts.length === 1) {
            dec = false;
        }
        //check for negative
        var neg = false;
        var main;
        var ret = '';
        if (parts[0].contains('-')) {
            neg = true;
            main = parts[0].substring(1, parts[0].length);
        } else {
            main = parts[0];
        }

        if (this.options.useThousands) {
            var l = main.length;
            var left = l % 3;
            var j = 0;
            for (var i = 0; i < l; i++) {
                ret = ret + main.charAt(i);
                if (i === left - 1 && i !== l - 1) {
                    ret = ret + this.getText({set:'Jx',key:'formatter.number',value:'thousandsSeparator'});
                } else if (i >= left) {
                    j++;
                    if (j === 3 && i !== l - 1) {
                        ret = ret + this.getText({set:'Jx',key:'formatter.number',value:'thousandsSeparator'});
                        j = 0;
                    }
                }

            }
        } else {
            ret = parts[0];
        }

        if (dec) {
            ret = ret + this.getText({set:'Jx',key:'formatter.number',value:'decimalSeparator'}) + parts[1];
        }
        if (neg && this.options.useParens) {
            ret = "(" + ret + ")";
        } else if (neg && !this.options.useParens) {
            ret = "-" + ret;
        }

        return ret;
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    }
});/*
---

name: Jx.Formatter.Currency

description: Formats input as currency. Currently only US currency is supported

license: MIT-style license.

requires:
 - Jx.Formatter.Number

provides: [Jx.Formatter.Currency]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.Currency
 *
 * Extends: <Jx.Formatter.Number>
 *
 * This class formats numbers as US currency. It actually
 * runs the value through Jx.Formatter.Number first and then
 * updates the returned value as currency.
 *
 * Example:
 * (code)
 * (end)
 * 
 * MooTools.lang Keys:
 * - 'formatter.currency'.sign
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Currency = new Class({

    Extends: Jx.Formatter.Number,

    options: {},
    /**
     * APIMethod: format
     * Takes a number and formats it as currency.
     *
     * Parameters:
     * value - the number to format
     */
    format: function (value) {

        this.options.precision = 2;

        value = this.parent(value);
        //check for negative
        var neg = false;
        if (value.contains('(') || value.contains('-')) {
            neg = true;
        }

        var ret;
        if (neg && !this.options.useParens) {
            ret = "-" + this.getText({set:'Jx',key:'formatter.currency',value:'sign'}) + value.substring(1, value.length);
        } else {
            ret = this.getText({set:'Jx',key:'formatter.currency',value:'sign'}) + value;
        }
        return ret;
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    }
});/*
---

name: Jx.Formatter.Date

description: Formats dates using the mootools-more Date extensions

license: MIT-style license.

requires:
 - More/Date.Extras
 - Jx.Formatter

provides: [Jx.Formatter.Date]
...
 */
// $Id$
/**
 * Class: Jx.Formatter.Date
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats dates using the mootools-more's
 * Date extensions. See the -more docs for details of
 * supported formats for parsing and formatting.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Date = new Class({

    Extends: Jx.Formatter,

    options: {
        /**
         * Option: format
         * The format to use. See the mootools-more Date
         * extension documentation for details on supported
         * formats
         */
        format: '%B %d, %Y'
    },
    /**
     * APIMethod: format
     * Does the work of formatting dates
     *
     * Parameters:
     * value - the text to format
     */
    format: function (value) {
        var d = Date.parse(value);
        return d.format(this.options.format);
    }
});/*
---

name: Jx.Formatter.URI

description: Formats uris using the mootools-more URI extensions

license: MIT-style license.

requires:
 - More/String.Extras
 - Jx.Formatter
 - More/URI

provides: [Jx.Formatter.URI]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.URI
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats URIs using the mootools-more's
 * URI extensions. See the -more docs for details of
 * supported formats for parsing and formatting.
 * 
 * @url http://mootools.net/docs/more/Native/URI
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Uri = new Class({

    Extends: Jx.Formatter,

    options: {
        /**
         * Option: format
         * The format to use. See the mootools-more URI options
         * to use within a {pattern}
         *   {string} will call the URI.toString() method
         */
        format: '<a href="{string}" target="_blank">{host}</a>'
    },
    /**
     * APIMethod: format
     * Does the work of formatting dates
     *
     * Parameters:
     * value - the text to format
     */
    format: function (value) {
      var uri        = new URI(value),
          uriContent = {},
          pattern    = new Array(),
          patternTmp = this.options.format.match(/\\?\{([^{}]+)\}/g);

      // remove bracktes
      patternTmp.each(function(e) {
        pattern.push(e.slice(1, e.length-1));
      });

      // build object that contains replacements
      for(var i = 0, j = pattern.length; i < j; i++) {
        switch(pattern[i]) {
          case 'string':
            uriContent[pattern[i]] = uri.toString();
            break;
          default:
            uriContent[pattern[i]] = uri.get(pattern[i]);
            break;
        }
      }
      return this.options.format.substitute(uriContent);
    }
});/*
---

name: Jx.Formatter.Boolean

description: Formats boolean input

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Boolean]
...
 */
// $Id$
/**
 * Class: Jx.Formatter.Boolean
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats boolean values. You supply the
 * text values for true and false in the options.
 *
 * Example:
 * (code)
 * (end)
 *
 * MooTools.lang Keys:
 * - 'formatter.boolean'.true
 * - 'formatter.boolean'.false
 * 
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Boolean = new Class({

    Extends: Jx.Formatter,

    options: {},
    /**
     * APIMethod: format
     * Takes a value, determines boolean equivalent and
     * displays the appropriate text value.
     *
     * Parameters:
     * value - the text to format
     */
    format : function (value) {
        var b = false;
        var t = Jx.type(value);
        switch (t) {
        case 'string':
            if (value === 'true') {
                b = true;
            }
            break;
        case 'number':
            if (value !== 0) {
                b = true;
            }
            break;
        case 'boolean':
            b = value;
            break;
        default:
            b = true;
        }
        return b ? this.getText({set:'Jx',key:'formatter.boolean',value:'true'}) : this.getText({set:'Jx',key:'formatter.boolean',value:'false'});
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    }

});/*
---

name: Jx.Formatter.Phone

description: Formats phone numbers in US format including area code

license: MIT-style license.

requires:
 - Jx.Formatter


provides: [Jx.Formatter.Phone]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.Phone
 *
 * Extends: <Jx.Formatter>
 *
 * Formats data as phone numbers. Currently only US-style phone numbers
 * are supported.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Phone = new Class({

    Extends: Jx.Formatter,

    options: {
        /**
         * Option: useParens
         * Whether to use parenthesis () around the area code.
         * Defaults to true
         */
        useParens: true,
        /**
         * Option: separator
         * The character to use as a separator in the phone number.
         * Defaults to a dash '-'.
         */
        separator: "-"
    },
    /**
     * APIMethod: format
     * Format the input as a phone number. This will strip all non-numeric
     * characters and apply the current default formatting
     *
     * Parameters:
     * value - the text to format
     */
    format : function (value) {
        //first strip any non-numeric characters
        var sep = this.options.separator;
        var v = '' + value;
        v = v.replace(/[^0-9]/g, '');

        //now check the length. For right now, we only do US phone numbers
        var ret = '';
        if (v.length === 11) {
            //do everything including the leading 1
            ret = v.charAt(0);
            v = v.substring(1);
        }
        if (v.length === 10) {
            //do the area code
            if (this.options.useParens) {
                ret = ret + "(" + v.substring(0, 3) + ")";
            } else {
                ret = ret + sep + v.substring(0, 3) + sep;
            }
            v = v.substring(3);
        }
        //do the rest of the number
        ret = ret + v.substring(0, 3) + sep + v.substring(3);
        return ret;
    }
});/*
---

name: Jx.Formatter.Text

description: Formats strings by limiting to a max length

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Text]

...
 */
// $Id: $
/**
 * Class: Jx.Formatter.Text
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats strings by limiting them to a maximum length
 * and replacing the remainder with an ellipsis.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2010, Hughes Gauthier.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Text = new Class({

  Extends: Jx.Formatter,

  options: {
    /**
     * Option: length
     * {Integer} default null, if set to an integer value greater than
     * 0 then the value will be truncated to length characters and
     * the remaining characters will be replaced by an ellipsis (...)
     */
    maxLength: null,
    /**
     * Option: ellipsis
     * {String} the text to use as the ellipsis when truncating a string
     * default is three periods (...)
     */
    ellipsis: '...'
  },

  format : function (value) {
    var text = '' + value,
        max = this.options.maxLength,
        ellipsis = this.options.ellipsis;

    if (max && text.length > max) {
      text = text.substr(0,max-ellipsis.length) + ellipsis;
    }

    return text;
  }
});/*
---

name: Jx.Field.Check

description: Represents a checkbox input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Checkbox]

...
 */
// $Id$
/**
 * Class: Jx.Field.Check
 *
 * Extends: <Jx.Field>
 *
 * This class represents a radio input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 *
 */
Jx.Field.Checkbox = new Class({

    Extends : Jx.Field,

    options : {
        /**
         * Option: template
         * The template used for rendering this field
         */
        template : '<span class="jxInputContainer"><input class="jxInputCheck" type="checkbox" name="{name}"/><label class="jxInputLabel"></label><span class="jxInputTag"></span></span>',
        /**
         * Option: checked
         * Whether this field is checked or not
         */
        checked : false,

        labelSeparator: ''
    },
    /**
     * Property: type
     * The type of this field
     */
    type : 'Check',

    /**
     * APIMethod: render
     * Creates a checkbox input field.
    */
    render : function () {
        this.parent();

        if ($defined(this.options.checked) && this.options.checked) {
            if (Browser.Engine.trident) {
                var parent = this.field.getParent();
                var sibling;
                if (parent) {
                    sibling = this.field.getPrevious();
                }
                this.field.setStyle('visibility','hidden');
                this.field.inject(document.id(document.body));
                this.field.checked = true;
                this.field.defaultChecked = true;
                this.field.dispose();
                this.field.setStyle('visibility','visible');
                if (sibling) {
                    this.field.inject(sibling, 'after');
                } else if (parent) {
                    this.field.inject(parent, 'top');
                }
            } else {
                this.field.set("checked", "checked");
                this.field.set("defaultChecked", "checked");
            }
        }

        // add click event to the label to toggle the checkbox
        if(this.label) {
          this.label.addEvent('click', function(ev) {
            this.setValue(this.getValue() != null ? false : true)
          }.bind(this));
        }
    },

    /**
     * APIMethod: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - Whether the box shouldbe checked or not. "checked" or "true" if it should be checked.
     */
    setValue : function (v) {
        if (!this.options.readonly) {
            if (v === 'checked' || v === 'true' || v === true) {
                this.field.set('checked', "checked");
            } else {
                this.field.erase('checked');
            }
        }
    },

    /**
     * APIMethod: getValue
     * Returns the current value of the field. The field must be
     * "checked" in order to return a value. Otherwise it returns null.
     */
    getValue : function () {
        if (this.field.get("checked")) {
            return this.field.get("value");
        } else {
            return null;
        }
    },

    /**
     * APIMethod: reset
     * Sets the field back to the value passed in the original
     * options. no IE hack is implemented because the field should
     * already be in the DOM when this is called.
     */
    reset : function () {
        if (this.options.checked) {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    },

    getChecked: function () {
        return this.field.get("checked");
    }

});
/*
---

name: Jx.Field.Radio

description: Represents a radio button input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Radio]

...
 */
// $Id$
/**
 * Class: Jx.Field.Radio
 *
 * Extends: <Jx.Field>
 *
 * This class represents a radio input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Radio = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: template
         * The template used to create this field
         */
        template: '<span class="jxInputContainer"><input class="jxInputRadio" type="radio" name="{name}"/><label class="jxInputLabel"></label><span class="jxInputTag"></span></span>',
        /**
         * Option: checked
         * whether this radio button is checked or not
         */
        checked: false,

        labelSeparator: ''
    },
    /**
     * Property: type
     * What kind of field this is
     */
    type: 'Radio',

    /**
     * APIMethod: render
     * Creates a radiobutton input field.
     */
    render: function () {
        this.parent();

        if ($defined(this.options.checked) && this.options.checked) {
            if (Browser.Engine.trident) {
                var parent = this.field.getParent();
                var sibling;
                if (parent) {
                    sibling = this.field.getPrevious();
                }
                this.field.setStyle('visibility','hidden');
                this.field.inject(document.id(document.body));
                this.field.checked = true;
                this.field.defaultChecked = true;
                this.field.dispose();
                this.field.setStyle('visibility','visible');
                if (sibling) {
                    this.field.inject(sibling, 'after');
                } else if (parent) {
                    this.field.inject(parent, 'top');
                }
            } else {
                this.field.set("checked", "checked");
                this.field.set("defaultChecked", "checked");
            }
        }

        // add click event to toggle the radio buttons
        this.label.addEvent('click', function(ev) {
          this.field.checked ? this.setValue(false) : this.setValue(true);
        }.bind(this));

    },

    /**
     * APIMethod: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to, "checked" it should be checked.
     */
    setValue: function (v) {
        if (!this.options.readonly) {
            if (v === 'checked' || v === 'true' || v === true) {
                this.field.set('checked', "checked");
            } else {
                this.field.erase('checked');
            }
        }
    },

    /**
     * APIMethod: getValue
     * Returns the current value of the field. The field must be "checked"
     * in order to return a value. Otherwise it returns null.
     */
    getValue: function () {
        if (this.field.get("checked")) {
            return this.field.get("value");
        } else {
            return null;
        }
    },

    /**
     * Method: reset
     * Sets the field back to the value passed in the original
     * options
     */
    reset: function () {
        if (this.options.checked) {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    }

});




/*
---

name: Jx.Field.Select

description: Represents a select, or drop down, input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Select]

...
 */
// $Id$
/**
 * Class: Jx.Field.Select
 *
 * Extends: <Jx.Field>
 *
 * This class represents a form select field.
 *
 * These fields are rendered as below.
 *
 * (code)
 * <div id='' class=''>
 *    <label for=''>A label for the field</label>
 *    <select id='' name=''>
 *      <option value='' selected=''>text</option>
 *    </select>
 * </div>
 * (end)
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 *
 */

Jx.Field.Select = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: multiple
         * {Boolean} optional, defaults to false.  If true, then the select
         * will support multi-select
         */
        mulitple: false,
        /**
         * Option: size
         * {Integer} optional, defaults to 1.  If set, then this specifies
         * the number of rows of the select that are visible
         */
        size: 1,
        /**
         * Option: comboOpts
         * Optional, defaults to null. if not null, this should be an array of
         * objects formated like [{value:'', selected: true|false,
         * text:''},...]
         */
        comboOpts: null,
        /**
         * Option: optGroups
         * Optional, defaults to null. if not null this should be an array of
         * objects defining option groups for this select. The comboOpts and
         * optGroups options are mutually exclusive. optGroups will always be
         * shown if defined.
         *
         * define them like [{name: '', options: [{value:'', selected: '',
         * text: ''}...]},...]
         */
        optGroups: null,
        /**
         * Option: template
         * The template for creating this select input
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><select class="jxInputSelect" name="{name}"></select><span class="jxInputTag"></span></span>'
    },
    /**
     * Property: type
     * Indictes this type of field.
     */
    type: 'Select',

    /**
     * APIMethod: render
     * Creates a select field.
     */
    render: function () {
        this.parent();
        this.field.addEvent('change', function() {this.fireEvent('change', this);}.bind(this));
        if ($defined(this.options.multiple)) {
          this.field.set('multiple', this.options.multiple);
        }
        if ($defined(this.options.size)) {
          this.field.set('size', this.options.size);
        }
        if ($defined(this.options.optGroups)) {
            this.options.optGroups.each(function(group){
                var gr = new Element('optGroup');
                gr.set('label',group.name);
                group.options.each(function(option){
                    var opt = new Element('option', {
                        'value': option.value,
                        'html': this.getText(option.text)
                    });
                    if ($defined(option.selected) && option.selected) {
                        opt.set("selected", "selected");
                    }
                    gr.grab(opt);
                },this);
                this.field.grab(gr);
            },this);
        } else if ($defined(this.options.comboOpts)) {
            this.options.comboOpts.each(function (item) {
                this.addOption(item);
            }, this);
        }
    },

    /**
     * Method: addOption
     * add an option to the select list
     *
     * Parameters:
     * item - The option to add.
     * position (optional) - an integer index or the string 'top'.
     *                     - default is to add at the bottom.
     */
    addOption: function (item, position) {
        var opt = new Element('option', {
            'value': item.value,
            'html': this.getText(item.text)
        });
        if ($defined(item.selected) && item.selected) {
            opt.set("selected", "selected");
        }
        var where = 'bottom';
        var field = this.field;
        if ($defined(position)) {
            if (Jx.type(position) == 'integer' &&
                (position >= 0  && position < field.options.length)) {
                field = this.field.options[position];
                where = 'before';
            } else if (position == 'top') {
                where = 'top';
            }

        }
        opt.inject(field, where);
    },

    /**
     * Method: removeOption
     * removes an option from the select list
     *
     * Parameters:
     *  item - The option to remove.
     */
    removeOption: function (item) {
        //TBD
    },
    /**
     * Method: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to.
     */
    setValue: function (v) {
        if (!this.options.readonly) {
            //loop through the options and set the one that matches v
            $$(this.field.options).each(function (opt) {
                if (opt.get('value') === v) {
                    document.id(opt).set("selected", true);
                }
            }, this);
        }
    },

    /**
     * Method: getValue
     * Returns the current value of the field.
     */
    getValue: function () {
        var index = this.field.selectedIndex;
        //check for a set "value" attribute. If not there return the text
        if (index > -1) {
            var ret = this.field.options[index].get("value");
            if (!$defined(ret)) {
                ret = this.field.options[index].get("text");
            }
            return ret;
        }
    },
    
    /**
     * APIMethod: empty
     * Empties all options from this select
     */
    empty: function () {
        if ($defined(this.field.options)) {
            $A(this.field.options).each(function (option) {
                this.field.remove(option);
            }, this);
        }
    }
});/*
---

name: Jx.Field.Textarea

description: Represents a textarea input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Textarea]

...
 */
// $Id$
/**
 * Class: Jx.Field.Textarea
 *
 * Extends: <Jx.Field>
 *
 * This class represents a textarea field.
 *
 * These fields are rendered as below.
 *
 * (code)
 * <div id='' class=''>
 *    <label for=''>A label for the field</label>
 *    <textarea id='' name='' rows='' cols=''>
 *      value/ext
 *    </textarea>
 * </div>
 * (end)
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 *
 */
Jx.Field.Textarea = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: rows
         * the number of rows to show
         */
        rows: null,
        /**
         * Option: columns
         * the number of columns to show
         */
        columns: null,
        /**
         * Option: template
         * the template used to render this field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><textarea class="jxInputTextarea" name="{name}"></textarea><span class="jxInputTag"></span></span>'
    },
    /**
     * Property: type
     * The type of field this is.
     */
    type: 'Textarea',
    /**
     * Property: errorClass
     * The class applied to error elements
     */
    errorClass: 'jxFormErrorTextarea',

    /**
     * APIMethod: render
     * Creates the input.
    */
    render: function () {
        this.parent();

        if ($defined(this.options.rows)) {
            this.field.set('rows', this.options.rows);
        }
        if ($defined(this.options.columns)) {
            this.field.set('cols', this.options.columns);
        }

        //TODO: Do we need to use OverText here as well??

    }
});/*
---

name: Jx.Field.Button

description: Represents a button input

license: MIT-style license.

requires:
 - Jx.Field
 - Jx.Button

provides: [Jx.Field.Button]

...
 */
/**
 * Class: Jx.Field.Button
 *
 * Extends: <Jx.Field>
 *
 * This class represents a button.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Button = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: buttonClass
         * choose the actual Jx.Button subclass to create for this form
         * field.  The default is to create a basic Jx.Button.  To create
         * a different kind of button, pass the class to this option, for
         * instance:
         * (code)
         * buttonClass: Jx.Button.Color
         * (end)
         */
        buttonClass: Jx.Button,
        
        /**
         * Option: buttonOptions
         */
        buttonOptions: {},
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><div class="jxInputButton"></div><span class="jxInputTag"></span></span>'
    },
    
    button: null,
    
    /**
     * Property: type
     * The type of this field
     */
    type: 'Button',

    processTemplate: function(template, classes, container) {
        var h = this.parent(template, classes, container);
        this.button = new this.options.buttonClass(this.options.buttonOptions);
        this.button.addEvent('click', function(){
          this.fireEvent('click');
        }.bind(this));
        var c = h.get('jxInputButton');
        if (c) {
            this.button.domObj.replaces(c);
        }
        this.button.setEnabled(!this.options.disabled);
        return h;
    },
    
    click: function() {
        this.button.clicked();
    },
    
    enable: function() {
      this.parent();
      this.button.setEnabled(true);
    },
    
    disable: function() {
      this.parent();
      this.button.setEnabled(false);
    }
});/*
---

name: Jx.Field.Combo

description: Represents an editable combo

license: MIT-style license.

requires:
 - Jx.Field
 - Jx.Button
 - Jx.Menu
 - Jx.Menu.Item
 - Jx.ButtonSet

provides: [Jx.Field.Combo]

...
 */
// $Id$
/**
 * Class: Jx.Field.Combo
 *
 * Extends: <Jx.Field>
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * change - 
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Combo = new Class({
    Family: 'Jx.Field.Combo',
    Extends: Jx.Field,
    pluginNamespace: 'Combo',

    options: {
        buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>',
        /* Option: template
         */
         template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputCombo"  name="{name}"><img class="jxInputIcon" src="'+Jx.aPixel.src+'"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>'
     },
     
     type: 'Combo',
     
    /**
     * APIMethod: render
     * create a new instance of Jx.Field.Combo
     */
    render: function() {
        this.classes.combine({
          wrapper: 'jxInputWrapper',
          revealer: 'jxInputRevealer',
          icon: 'jxInputIcon'
        });
        this.parent();
        
        var button = new Jx.Button({
          template: this.options.buttonTemplate,
          imageClass: 'jxInputRevealerIcon'
        }).addTo(this.revealer);

        this.menu = new Jx.Menu();
        this.menu.button = button;
        this.buttonSet = new Jx.ButtonSet();

        this.buttonSet = new Jx.ButtonSet({
            onChange: (function(set) {
                var button = set.activeButton;
                var l = button.options.label;
                if (l == '&nbsp;') {
                    l = '';
                }
                this.setLabel(l);
                var img = button.options.image;
                if (img.indexOf('a_pixel') != -1) {
                    img = '';
                }
                this.setImage(img, button.options.imageClass);

                this.fireEvent('change', this);
            }).bind(this)
        });
        if (this.options.items) {
            this.add(this.options.items);
        }
        var that = this;
        button.addEvent('click', function(e) {
            if (this.list.count() === 0) {
                return;
            }
            if (!button.options.enabled) {
                return;
            }
            this.contentContainer.setStyle('visibility','hidden');
            this.contentContainer.setStyle('display','block');
            document.id(document.body).adopt(this.contentContainer);
            /* we have to size the container for IE to render the chrome correctly
             * but just in the menu/sub menu case - there is some horrible peekaboo
             * bug in IE related to ULs that we just couldn't figure out
             */
            this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

            this.showChrome(this.contentContainer);

            this.position(this.contentContainer, that.field, {
                horizontal: ['left left', 'right right'],
                vertical: ['bottom top', 'top bottom'],
                offsets: this.chromeOffsets
            });

            this.contentContainer.setStyle('visibility','');

            document.addEvent('mousedown', this.bound.hide);
            document.addEvent('keyup', this.bound.keypress);

            this.fireEvent('show', this);
        }.bindWithEvent(this.menu));

        this.menu.addEvents({
            'show': (function() {
                //this.setActive(true);
            }).bind(this),
            'hide': (function() {
                //this.setActive(false);
            }).bind(this)
        });
    },
    
    setLabel: function(label) {
      if ($defined(this.field)) {
        this.field.value = this.getText(label);
      }
    },
    
    setImage: function(url, imageClass) {
      if ($defined(this.icon)) {
        this.icon.setStyle('background-image', 'url('+url+')');
        this.icon.setStyle('background-repeat', 'no-repeat');

        if (this.options.imageClass) {
            this.icon.removeClass(this.options.imageClass);
        }
        if (imageClass) {
            this.options.imageClass = imageClass;
            this.icon.addClass(imageClass);
            this.icon.setStyle('background-position','');
        } else {
            this.options.imageClass = null;
            this.icon.setStyle('background-position','center center');
        }
      }
      if (!url) {
        this.wrapper.addClass('jxInputIconHidden');
      } else {
        this.wrapper.removeClass('jxInputIconHidden');
      }
    },

    /**
     * Method: valueChanged
     * invoked when the current value is changed
     */
    valueChanged: function() {
        this.fireEvent('change', this);
    },

    setValue: function(value) {
        this.field.set('value', value);
        this.buttonSet.buttons.each(function(button){
          button.setActive(button.options.label === value);
        },this);
    },

    /**
     * Method: onKeyPress
     * Handle the user pressing a key by looking for an ENTER key to set the
     * value.
     *
     * Parameters:
     * e - {Event} the keypress event
     */
    onKeyPress: function(e) {
        if (e.key == 'enter') {
            this.valueChanged();
        }
    },

    /**
     * Method: add
     * add a new item to the pick list
     *
     * Parameters:
     * options - {Object} object with properties suitable to be passed to
     * a <Jx.Menu.Item.Options> object.  More than one options object can be
     * passed, comma separated or in an array.
     */
    add: function() {
        $A(arguments).flatten().each(function(opt) {
            var button = new Jx.Menu.Item($merge(opt,{
                toggle: true
            }));
            this.menu.add(button);
            this.buttonSet.add(button);
            if (opt.selected) {
              this.buttonSet.setActiveButton(button);
            }
        }, this);
    },

    /**
     * Method: remove
     * Remove the item at the given index.  Not implemented.
     *
     * Parameters:
     * idx - {Mixed} the item to remove by reference or by index.
     */
    remove: function(idx) {
      var item;
      if ($type(idx) == 'number' && idx < this.buttonSet.buttons.length) {
        item = this.buttonSet.buttons[idx];
      } else if ($type(idx) == 'string'){
        this.buttonSet.buttons.some(function(button){
            if (button.options.label === idx) {
                item = button;
                return true;
            }
            return false;
        },this);
      }
      if (item) {
        this.buttonSet.remove(item);
        this.menu.remove(item);
      }
    },
    /**
     * APIMethod: empty
     * remove all values from the combo
     */
    empty: function() {
      this.menu.empty();
      this.buttonSet.empty();
      this.setLabel('');
      this.setImage(Jx.aPixel.src);
    },
    
    enable: function() {
      this.parent();
      this.menu.setEnabled(true);
    },
    
    disable: function() {
      this.parent();
      this.menu.setEnabled(false);
    }
    
});/*
---

name: Jx.Field.Password

description: Represents a password input

license: MIT-style license.

requires:
 - Jx.Field.Text

provides: [Jx.Field.Password]

...
 */
// $Id$
/**
 * Class: Jx.Field.Password
 *
 * Extends: <Jx.Field.Text>
 *
 * This class represents a password input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Password = new Class({

    Extends: Jx.Field,

    options: {
        template: '<span class="jxInputContainer"><label class="jxInputLabel" ></label><input class="jxInputPassword" type="password" name="{name}"/><span class="jxInputTag"></span></span>'
    },

    type: 'Password'
});/*
---

name: Jx.Field.Color

description: Represents an input field with a jx.button.color

license: MIT-style license.

requires:
 - Jx.Text
 - Jx.Button.Color
 - Jx.Form
 - Jx.Plugin.Field.Validator

provides: [Jx.Field.Color]

...
 */
/**
 * Class: Jx.Field.Color
 *
 * Extends: <Jx.Field>
 *
 * This class provides a Jx.Field.Text in combination with a Jx.Button.Color
 * to have a Colorpicker with an input field.
 *
 * License:
 * Copyright (c) 2010, Paul Spener, Fred Warnock, Conrad Barthelmes
 *
 * This file is licensed under an MIT style license
 */
  Jx.Field.Color = new Class({
    Extends: Jx.Field,
    Binds: ['changed','hide','keyup','changeText'],
    type: 'Color',
    options: {
      buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>',
      /**
       * Option: template
       * The template used to render this field
       */
      template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputColor"  name="{name}"><img class="jxInputIcon" src="'+Jx.aPixel.src+'"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>',
      /**
       * Option: showOnHover
       * {Boolean} show the color palette when hovering over the input, default 
       * is false
       */
      showOnHover: false,
      /**
       *  Option: showDelay
       *  set time in milliseconds when to show the color field on mouseenter
       */
      showDelay: 250,
      /**
       * Option: errorMsg
       * error message for the validator.
       */
      errorMsg: 'Invalid Web-Color',
      /**
       * Option: color
       * a color to initialize the field with, defaults to #000000
       * (black) if not specified.
       */
      color: '#000000'

    },
    button: null,
    validator: null,
    render: function() {
        this.classes.combine({
          wrapper: 'jxInputWrapper',
          revealer: 'jxInputRevealer',
          icon: 'jxInputIcon'
        });
        this.parent();

      var self = this;
      if (!Jx.Field.Color.ColorPalette) {
          Jx.Field.Color.ColorPalette = new Jx.ColorPalette(this.options);
      }
      this.button = new Jx.Button.Flyout({
          template: this.options.buttonTemplate,
          imageClass: 'jxInputRevealerIcon',
          positionElement: this.field,
          onBeforeOpen: function() {
            if (Jx.Field.Color.ColorPalette.currentButton) {
                Jx.Field.Color.ColorPalette.currentButton.hide();
            }
            Jx.Field.Color.ColorPalette.currentButton = this;
            Jx.Field.Color.ColorPalette.addEvent('change', self.changed);
            Jx.Field.Color.ColorPalette.addEvent('click', self.hide);
            this.content.appendChild(Jx.Field.Color.ColorPalette.domObj);
            Jx.Field.Color.ColorPalette.domObj.setStyle('display', 'block');
          },
          onOpen: function() {
            /* setting these before causes an update problem when clicking on
             * a second color button when another one is open - the color
             * wasn't updating properly
             */
            Jx.Field.Color.ColorPalette.options.color = self.options.color;
            Jx.Field.Color.ColorPalette.updateSelected();
          }
        }).addTo(this.revealer);

      this.validator = new Jx.Plugin.Field.Validator({
        validators: [{
            validatorClass: 'colorHex',
            validator: {
              name: 'colorValidator',
              options: {
                validateOnChange: false,
                errorMsg: self.options.errorMsg,
                test: function(field,props) {
                  try {
                    var c = field.get('value').hexToRgb(true);
                    if(c == null) return false;
                    for(var i = 0; i < 3; i++) {
                      if(c[i].toString() == 'NaN') {
                        return false;
                      }
                    }
                  }catch(e) {
                    return false;
                  }
                  c = c.rgbToHex().toUpperCase();
                  self.setColor(c);
                  return true;
                }
              }
            }
        }],
        validateOnBlur: true,
        validateOnChange: true
      });
      this.validator.attach(this);
      this.field.addEvent('keyup', this.onKeyUp.bind(this));
      if (this.options.showOnHover) {
        this.field.addEvent('mouseenter', function(ev) {
          self.button.clicked.delay(self.options.showDelay, self.button);
        });
      }
      this.setValue(this.options.color);
      this.icon.setStyle('background-color', this.options.color);
      //this.addEvent('change', self.changed);
    },
    /*
     * Method: onKeyUp
     *
     * listens to the keyup event and validates the input for a hex color
     *
     */
    onKeyUp : function(ev) {
      var color = this.getValue();
      if (color.substring(0,1) == '#') {
          color = color.substring(1);
      }
      if (color.toLowerCase().match(/^[0-9a-f]{6}$/)) {
          this.options.color = '#' +color.toUpperCase();
          this.setColor(this.options.color);
      }
    },
    setColor: function(c) {
        this.options.color = c;
        this.setValue(c);
        this.icon.setStyle('background-color', c);
    },
    changed: function() {
        var c = Jx.Field.Color.ColorPalette.options.color;
        this.setColor(c);
    },
    hide: function() {
        this.button.setActive(false);
        Jx.Field.Color.ColorPalette.removeEvent('change', this.changed);
        Jx.Field.Color.ColorPalette.removeEvent('click', this.hide);

        this.button.hide();
        Jx.Field.Color.ColorPalette.currentButton = null;
    },
    changeText: function(lang) {
      this.parent();
    }
  });
