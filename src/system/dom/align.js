//===========================================
//  让元素对齐到            align.js    A
//===========================================



/**
 * 获取一个节点对齐到另外节点后实际位置。
 */
Element.getAlignedPosition = function(target, elem, position, offsets){
	
};

Element.implement({
	
	
// 	
	  // getAlignToXY : function(el, p, o){
        // el = Ext.get(el), d = this.dom;
        // if(!el.dom){
            // throw "Element.alignTo with an element that doesn't exist";
        // }
        // var c = false; 
        // var p1 = "", p2 = "";
        // o = o || [0,0];
// 
        // if(!p){
            // p = "tl-bl";
        // }else if(p == "?"){
            // p = "tl-bl?";
        // }else if(p.indexOf("-") == -1){
            // p = "tl-" + p;
        // }
        // p = p.toLowerCase();
        // var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
        // if(!m){
           // throw "Element.alignTo with an invalid alignment " + p;
        // }
        // p1 = m[1], p2 = m[2], c = m[3] ? true : false;
// 
//         
//         
        // var a1 = this.getAnchorXY(p1, true);
        // var a2 = el.getAnchorXY(p2, false);
        // var x = a2[0] - a1[0] + o[0];
        // var y = a2[1] - a1[1] + o[1];
        // if(c){
//             
            // var w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
//             
            // var dw = D.getViewWidth()-5, dh = D.getViewHeight()-5;
// 
//             
//             
//             
            // var p1y = p1.charAt(0), p1x = p1.charAt(p1.length-1);
           // var p2y = p2.charAt(0), p2x = p2.charAt(p2.length-1);
           // var swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           // var swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));
// 
           // var doc = document;
           // var scrollX = (doc.documentElement.scrollLeft || doc.body.scrollLeft || 0)+5;
           // var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0)+5;
// 
           // if((x+w) > dw){
               // x = swapX ? r.left-w : dw-w;
           // }
           // if(x < scrollX){
               // x = swapX ? r.right : scrollX;
           // }
           // if((y+h) > dh){
               // y = swapY ? r.top-h : dh-h;
           // }
           // if (y < scrollY){
               // y = swapY ? r.bottom : scrollY;
           // }
        // }
        // return [x,y];
    // }
// 	
// 	
// 	
// 	
// 	
// 	
// 	
// 	
// 	
    // getConstrainToXY : function(){
        // var os = {top:0, left:0, bottom:0, right: 0};
// 
        // return function(el, local, offsets){
            // el = Ext.get(el);
            // offsets = offsets ? Ext.applyIf(offsets, os) : os;
// 
            // var vw, vh, vx = 0, vy = 0;
            // if(el.dom == document.body || el.dom == document){
                // vw = Ext.lib.Dom.getViewWidth();
                // vh = Ext.lib.Dom.getViewHeight();
            // }else{
                // vw = el.dom.clientWidth;
                // vh = el.dom.clientHeight;
                // if(!local){
                    // var vxy = el.getXY();
                    // vx = vxy[0];
                    // vy = vxy[1];
                // }
            // }
// 
            // var s = el.getScroll();
// 
            // vx += offsets.left + s.left;
            // vy += offsets.top + s.top;
// 
            // vw -= offsets.right;
            // vh -= offsets.bottom;
// 
            // var vr = vx+vw;
            // var vb = vy+vh;
// 
            // var xy = !local ? this.getXY() : [this.getLeft(true), this.getTop(true)];
            // var x = xy[0], y = xy[1];
            // var w = this.dom.offsetWidth, h = this.dom.offsetHeight;
// 
//             
            // var moved = false;
// 
//             
            // if((x + w) > vr){
                // x = vr - w;
                // moved = true;
            // }
            // if((y + h) > vb){
                // y = vb - h;
                // moved = true;
            // }
//             
            // if(x < vx){
                // x = vx;
                // moved = true;
            // }
            // if(y < vy){
                // y = vy;
                // moved = true;
            // }
            // return moved ? [x, y] : false;
        // };
    // }(),
	
alignTo : function(element, position, offsets){
        var xy = this.getAlignToXY(element, position, offsets);
        this.setXY(xy, this.preanim(arguments, 3));
        return this;
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


})