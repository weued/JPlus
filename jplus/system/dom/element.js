//===========================================
//  元素: 提供最底层的 DOM 辅助函数。  
//  A xuld
//===========================================

(function(window) {
	
	
	//  可用的宏     
	// ElementSplit - 是否将当前文件分开为子文件
	// ElementCore - 核心部分
	// ElementNode - 节点部分
	// ElementAttribute - 属性部分
	// ElementEvent - 事件部分
	// ElementReady - 加载部分
	// ElementDimension - 定位部分
	
	/// #ifndef ElementSplit
	/// #define ElementCore
	/// #define ElementNode
	/// #define ElementAttribute
	/// #define ElementEvent
	/// #define ElementReady
	/// #define ElementDimension
	/// #endif
	
	/**
	 * Object  简写。
	 * @type Object
	 */
	var o = Object,
	
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
	
		/**
		 * 数组原型。
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * document 简写。
		 * @type Document
		 */
		document = window.document,
	
		/**
		 * 被测元素。
		 * @type Element
		 */
		div = document.createElement('DIV'),
		
		/**
		 * JPlus 简写。
		 * @namespace JPlus
		 */
		p = apply(JPlus, {
			
			/**
			 * 根据一个 id 或 对象获取节点。
			 * @param {String/Element} id 对象的 id 或对象。
			 */
			$: getElementById,
			
			/// #ifdef ElementEvent
			
			/**
			 * 表示事件的参数。
			 * @class JPlus.Event
			 */
			Event: Class({
		
				/**
				 * 构造函数。
				 * @param {Object} target
				 * @constructor
				 */
				constructor: function(target, type, e) {
					var me = this;
					me.target = target;
					me.srcElement = target.dom || target;
					me.type = type;
		
					if(e)
						apply(me, e);
				},
		
				/**
				 * 阻止事件的冒泡。
				 */
				stopPropagation : function() {
					this.cancelBubble = true;
				},
		
				/**
				 * 取消默认事件发生。
				 */
				preventDefault : function() {
					this.returnValue = false;
				},
				
				/**
				 * 停止默认事件和冒泡。
				 */
				stop: function(){
					this.stopPropagation();
					this.preventDefault();
				}
		
			}),
			
			/// #endif
			
			/**
			 * 元素。
			 */	
			Element: Class(function(dom){this.dom = dom;}),
			
			/**
			 * 文档。
			 */
			Document: document.constructor || {prototype: document}
			
		}),
		
		/// #ifdef SupportIE6
		
		/**
		 * 元素。
		 * @type Function
		 * 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
		 */
		e = window.Element || p.Element,
		
		/// #else
		
		/// e = window.Element,
		
		/// #endif
		
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
		
		/// #ifdef ElementCore
		
		/**
		 * 元素缓存。
		 */
		cache = {},
	
		/**
		 * 是否为标签。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\window:]+)[^>]*)\/>/ig,
	
		/**
		 * 无法复制的标签。
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)/i,
	
		/**
		 * 是否为标签名。
		 * @type RegExp
		 */
		rTagName = /<([\window:]+)/,
		
		/**
		 * 包装。
		 * @type Object
		 */
		wrapMap = {
			option: [ 1, '<select multiple="multiple">', '</select>' ],
			legend: [ 1, '<fieldset>', '</fieldset>' ],
			thead: [ 1, '<table>', '</table>' ],
			tr: [ 2, '<table><tbody>', '</tbody></table>' ],
			td: [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ],
			col: [ 2, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
			area: [ 1, '<map>', '</map>' ]
		},
		
		/// #endif
		
		/// #ifdef ElementNode
		
		/**
		 * 属性。
		 * @type RegExp
		 */
		rAttr = /^\[\s*([^=]+?)(\s*=\s*(['"])([\s\S]*)\3)?\s*\]$/,
	
		/**
		 * @type Object
		 */
		childMap = 'firstElementChild' in div ?
			[walk, 'nextElementSibling', 'firstElementChild', 'parentNode', 'previousElementSibling', 'lastElementChild'] :
			[walk, 'nextSibling', 'firstChild', 'parentNode', 'previousSibling', 'lastChild'],
	
		/**
		 * 查找一个节点。
		 * @param {Element} elem 父节点。
		 * @param {Function} fn 查找函数。
		 * @return {Element} 节点。
		 */
		find = 'all' in div ? function(elem, fn) { // 返回数组
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			return  ap.filter.call(elem.all, fn);
		} : function(elem, fn) {
			assert.isFunction(fn, "Element.prototype.find(elem, fn): 参数 {fn} ~。");
			if(!elem.firstChild) return [];
			var ds = [], doms = [elem], p, nx;
			while (doms.length) {
				p = doms.pop();
				nx = p.firstChild;
				do {
					if (nx.nodeType != 1)
						continue;
					if (fn(nx)) {
						ds.push(nx);
					}
	
					if(nx.firstChild)
						doms.push(nx);
				} while(nx = nx.nextSibling);
			}
	
			return ds;
		},
		
		/// #endif

		/// #ifdef ElementAttribute

		/**
		 * 透明度的正则表达式。
		 * @type RegExp
		 */
		rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 是否为像素的正则表达式。
		 * @type RegExp
		 */
		rNumPx = /^-?\d+(?:px)?$/i,
	
		/**
		 * 是否为数字的正则表达式。
		 * @type RegExp
		 */
		rNum = /^-?\d/,
	
		/**
		 * 事件名。
		 * @type RegExp
		 */
		rEventName = /^on(\window+)/,
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /\-|float/,
	
		/**
		 * borderTopWidth 简写。
		 * @type String
		 */
		borderTopWidth = 'borderTopWidth',
	
		/**
		 * borderLeftWidth 简写。
		 * @type String
		 */
		borderLeftWidth = 'borderLeftWidth',
	
		/// #ifdef SupportIE8
	
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @private
		 */
		getStyle = window.getComputedStyle ? function(elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			// 获取样式
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;
	
		} : function(elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			if(name in styles){
				switch(name) {
					case 'height':
						return elem.offsetHeight === 0 ? 'auto' : elem.offsetHeight - e.getSizes(elem, 'y', 'pb') + 'px';
					case 'width':
						return elem.offsetWidth === 0 ? 'auto' : elem.offsetWidth - e.getSizes(elem, 'x', 'pb') + 'px';
					case 'opacity':
						return ep.getOpacity.call(elem).toString();
		
				}
			}
			
			var r = elem.currentStyle;
			
			if(!r)
				return "";
			
			r = r[name];
	
			// 来自 jQuery
	
			// 如果返回值不是一个带px的 数字。 转换为像素单位
			if (!rNumPx.test(r) && rNum.test(r)) {
	
				// 保存初始值
				var style = elem.style,  left = style.left, rsLeft = elem.runtimeStyle.left;
	
				// 放入值来计算
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = name === "fontSize" ? "1em" : (r || 0);
				r = style.pixelLeft + "px";
	
				// 回到初始值
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
	
			}
	
			return r;
		},
	
		/// #else
	
		/// getStyle = function(elem, name) {
		///
		/// 	// 获取样式
		/// 	var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
		///
		/// 	// 返回
		/// 	return computedStyle ? computedStyle[ name ] : null;
		///
		/// },
	
		/// #endif
		
		/**
		 * 特殊的样式。
		 * @type Object
		 */
		styles = {
			'float': 'cssFloat' in div.style ? 'cssFloat' : 'styleFloat',
			height: 'setHeight',
			width: 'setWidth'
		},
		
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		attributes = {
			innerText: 'innerText' in div ? 'innerText' : 'textContent',
			"for": "htmlFor",
			"class": "className"
		},
		
		/// #endif
		
		/// #ifdef ElementEvent
		
		pep = p.Event.prototype,
	
		/**
		 * @type Function
		 */
		initUIEvent,
	
		/**
		 * @type Function
		 */
		initMouseEvent,
	
		/**
		 * @type Function
		 */
		initKeyboardEvent,
		
		/// #endif
		
		/// #if !defind(SupportIE8) && (ElementEvent || ElementReady)
		
		/**
		 * 扩展的事件对象。
		 */
		eventObj = {
			
			/**
			 * 绑定一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso removeEventListener
			 * @example
			 * <code>
			 * document.addEventListener('click', function() {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function(type, listener) {
				
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.addEventListener(type, listener, false);
				
			} : function(type, listener) {
				
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, listener);
				
			},
	
			/**
			 * 移除一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 * @seeAlso addEventListener
			 * @example
			 * <code>
			 * document.removeEventListener('click', function() {
			 * 
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function(type, listener) {
				
				this.removeEventListener(type, listener, false);
				
			} : function(type, listener) {
				
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, listener);
				
			}
		
		},
		
		/// #endif
	
		/// #ifdef ElementReady
		
		/// #ifdef SupportIE8
		
		/**
		 * 浏览器使用的真实的 DOMContentLoaded 事件名字。
		 * @type String
		 */
		domReady = navigator.isStd ? 'DOMContentLoaded' : 'readystatechange',
		
		/// #else
		
		/// domReady = 'DOMContentLoaded',  
		
		/// #endif
		
		/**
		 * Ready 实际所执行的函数。
		 * @type Function
		 */
		doReady,
		
		/**
		 * Load 实际所执行的函数。
		 * @type Function
		 */
		doLoad,
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		rBody = /^(?:body|html)$/i,
	
		/**
		 * 表示一个点。
		 * @class Point
		 */
		Point = namespace(".Point", Class({
	
			/**
			 * 初始化 Point 的实例。
			 * @param {Number} x X 坐标。
			 * @param {Number} y Y 坐标。
			 * @constructor Point
			 */
			constructor: function(x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * 将 (x, y) 增值。
			 * @param {Number} value 值。
			 * @return {Point} this
			 */
			add: function(x, y) {
	
				assert(typeof x == 'number' && typeof y == 'number', "Point.prototype.add(x, y): 参数 x 和 参数 y 必须是数字。");
				this.x += x;
				this.y += y;
				return this;
			},
	
			/**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			minus: function(p) {
	
				assert(p && 'x' in p && 'y' in p, "Point.prototype.minus(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				this.x -= p.x;
				this.y -= p.y;
				return this;
			},
	
			/**
			 * 复制当前对象。
			 * @return {Point} 坐标。
			 */
			clone: function() {
				return new Point(this.x, this.y);
			}
	
		})),
	
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getWindowScroll = 'pageXOffset' in window ? function() {
			var win = this.defaultView;
			return new Point(win.pageXOffset, win.pageYOffset);
		} : getScroll,
		
		/// #endif
		
		/**
		 * 节点集合。
		 * @class ElementList
		 * @extends Element
		 * ElementList 是对元素数组的只读包装。
		 * ElementList 允许快速操作多个节点。
		 * ElementList 的实例一旦创建，则不允许修改其成员。
		 */
		el = namespace(".ElementList", Class({
	
			/**
			 * 初始化   ElementList  实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
			constructor: function(doms) {
	
				assert(doms && doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);
	
				/// #ifdef SupportIE8
				
				// 检查是否需要为每个成员调用  $ 函数。
				if(!navigator.isStd)
					doms = o.update(doms, p.$, []);
	
				
				/// #endif
				
				this.doms = doms;
	
			},
			
			/**
			 * 使用指定函数过滤当前集合，返回符合要求的元素组成的新的集合。
			 * @param {Function} fn 函数。参数 value, index, this。
			 * @param {Object} bind 绑定的对象。
			 * @return {ElementList} 元素列表。
			 */
			filter: function(fn, bind){
				return new el(ap.filter.call(this.doms, fn, bind));
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));

		
	/**
	 * @namespace document
	 */
	p.Native(p.Document).implement({

		/**
		 * 获取节点本身。
		 */
		dom: document.documentElement,
		
		/// #ifdef ElementCore

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function(tagName, className) {
			
			assert.isString(tagName, 'Document.prototype.create(tagName, className): 参数 {tagName} ~。');

			/// #ifdef SupportIE6

			var div = p.$(this.createElement(tagName));

			/// #else

			/// var div = this.createElement(tagName);

			/// #endif

			div.className = className;

			return div;
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 获取元素可视区域大小。包括 margin 和 border 大小。
		 * @method getSize
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var doc = this.dom;

			return new Point(doc.clientWidth, doc.clientHeight);
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @method getScroll
		 * @return {Point} 位置。
		 */
		getScroll: getWindowScroll,

		/**
		 * 获取距父元素的偏差。
		 * @method getOffsets
		 * @return {Point} 位置。
		 */
		getPosition: getWindowScroll,

		/**
		 * 获取滚动区域大小。
		 * @method getScrollSize
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var html = this.dom,
				min = this.getSize(),
				max = Math.max,
				body = this.body;


			return new Point(max(html.scrollWidth, body.scrollWidth, min.x), max(html.scrollHeight, body.scrollHeight, min.y));
		},

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function(x, y) {
			var p = adaptXY(x,y, this, 'getScroll');

			this.defaultView.scrollTo(p.x, p.y);

			return this;
		},
		
		/// #endif
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function() {
			return arguments.length === 1 ? p.$(this.getElementById(arguments[0])) :  new el(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	/**
	 * @class Element
	 */
	apply(e, {
		
		/// #ifdef ElementCore
		
		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function(html, context, cachable) {

			assert.notNull(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');
			
			if(html.nodeType) return html;
			
			if(html.dom) return html.dom;

			assert.isString(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

			var div = cache[html = html.trim()];
			
			context = context ? getDocument(context) : document;
			
			assert(context.createElement, 'Element.parse(html, context, cachable): 参数 {context} 必须是 DOM 节点。', context);

			if (!div || div.ownerDocument !== context) {
				
				html = html.replace(rXhtmlTag, "<$1></$2>");

				// 过滤空格  // 修正   XHTML
				var tag = rTagName.exec(html),
					notSaveInCache = cachable !== undefined ? cachable : rNoClone.test(html);


				if (tag) {

					div = context.createElement("div");

					var wrap = wrapMap[tag[1].toLowerCase()];

					if (wrap) {
						div.innerHTML = wrap[1] + html + wrap[2];

						// 转到正确的深度
						while (wrap[0]--)
							div = div.lastChild;

					} else
						div.innerHTML = html;

					// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
					// 如果有多节点，则复制到片段对象。
					if(div.lastChild !== div.firstChild) {
						context = context.createDocumentFragment();

						while(div.firstChild)
							context.appendChild(div.firstChild);

						div = context;
					} else {

						/// #ifdef SupportIE8

						div = p.$(div.lastChild);

						/// #endif
						
						assert(div, "Element.parse(html, context, cachable): 无法根据 {html} 创建节点。", html);
					}

				} else {

					// 创建文本节点。
					div = context.createTextNode(html);
				}

			}

			if(!notSaveInCache)
				cache[html] = div.clone ? div.clone(false, true) : div.cloneNode(true);

			return div;

		},
		
		/// #endif
		
		/// #ifdef ElementNode
			
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 * @static
		 */
		hasChild: !div.compareDocumentPosition ? function(elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			while(child = child.parentNode) {
				if(elem === child)
					return true;
			}
			return false;
		} : function(elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			return !!(elem.compareDocumentPosition(child) & 16);
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @param {Element} elem 节点。
		 * @static
		 */
		empty: function (elem) {
			assert.isNode(elem, "Element.empty(elem): 参数 {elem} ~。");
			while(elem.lastChild)
				e.dispose(elem.lastChild);
		},

		/**
		 * 释放节点所有资源。
		 * @param {Element} elem 节点。
		 * @static
		 */
		dispose: function (elem) {
			assert.isNode(elem, "Element.dispose(elem): 参数 {elem} ~。");
			
			//删除事件
			if (elem.clearAttributes) {
				elem.clearAttributes();
			}

			p.IEvent.un.call(elem);
			
			if(elem.$data)
				elem.$data = null;

			e.empty(elem);

			elem.parentNode && elem.parentNode.removeChild(elem);

		},
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		properties: {
			INPUT: 'checked',
			OPTION: 'selected',
			TEXTAREA: 'value'
		},
		
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		nodeMaps: {
	
			// 全部子节点。
			children: [function(elem, fn) {
				return new el(find(elem,  fn));
			}],
	
			// 上级节点。
			parent: [walk, childMap[3], childMap[3]],
	
			// 直接的子节点。
			child: [dir, childMap[1], childMap[2]],
	
			// 后面的节点。
			next: [walk, childMap[1]],
	
			// 前面的节点。
			previous: [walk, childMap[4], childMap[4]],
	
			// 第一个节点。
			first: childMap,
	
			// 最后的节点。
			last: [walk, childMap[4], childMap[5]],
	
			// 全部上级节点。
			parents: [dir, childMap[3]],
	
			// 前面的节点。
			previouses: [dir, childMap[4]],
	
			// 后面的节点。
			nexts: [dir, childMap[1]],
	
			// 奇数或偶数个。
			odd: [function(elem, fn) {
				return dir(elem, function() {
					return fn = fn === false;
				}, childMap[1], childMap[2]);
			}],
	
			// 兄弟节点。
			siblings: [function(elem, fn) {
				return dir(elem, function(node) {
					return node != elem && fn(elem);
				}, childMap[1], childMap[2]);
	
			}]
	
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute
		
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 * @static
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleString:  styleString,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * 将 offsetWidth 转为 style.width。
		 * @private
		 * @param {Element} elem 元素。
		 * @param {Number} width 输入。
		 * @return {Number} 转换后的大小。
		 * @static
		 */
		getSizes: window.getComputedStyle ? function (elem, type, names) {

			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in e.styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");


			var value = 0, map = e.styleMaps[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}

			return value;
		} : function (elem, type, names) {


			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in e.styleMaps, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");

			var value = 0, map = e.styleMaps[type], i = names.length, val;
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(getStyle(elem, val[0])) || 0) + (parseFloat(getStyle(elem, val[1])) || 0);
			}

			return value;
		},
		
		/**
		 * 特殊的样式集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		styles: styles,

		/**
		 * 特殊属性集合。
		 * @property
		 * @type Object
		 * @static
		 * @private
		 */
		attributes: attributes,

		/**
		 * 样式表。
		 * @static
		 * @type Object
		 */
		styleMaps: {},
		
		/**
		 * 显示元素的样式。
		 * @static
		 * @type Object
		 */
		display: { position: "absolute", visibility: "visible", display: "block" },

		/**
		 * 不需要单位的 css 属性。
		 * @static
		 * @type Object
		 */
		styleNumbers: String.map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', Function.returnTrue, {}),
	
		/**
		 * 默认最大的 z-index 。
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * 清空元素的 display 属性。
		 * @param {Element} elem 元素。
		 */
		show: function(elem){
			
			// 普通元素 设置为 空， 因为我们不知道这个元素本来的 display 是 inline 还是 block
			elem.style.display = '';
			
			// 如果元素的 display 仍然为 none , 说明通过 CSS 实现的隐藏。这里默认将元素恢复为 block。
			if(getStyle(elem, 'display') === 'none')
				elem.style.display = p.getData(elem, 'display') || 'block';
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function(elem){
			var currentDisplay = styleString(elem, 'display');
			if(currentDisplay !== 'none') {
				p.setData(elem, 'display', currentDisplay);
				elem.style.display = 'none';
			}
		},

		/**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(elem, name) {

			assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");

			
			if(name in attributes){
				
				/// #ifdef SupportIE6
				if(navigator.isQuirks && /^(href|src)$/.test(name)) {
					return elem.getAttribute(name, 2);
				}
				/// #endif
				
				// if(navigator.isSafari && name === 'selected' && elem.parentNode){ elem.parentNode.selectIndex; if(elem.parentNode.parentNode) elem.parentNode.parentNode.selectIndex; }
				
				name = attributes[name];
			}

			// 如果是节点具有的属性
			if (name in elem) {

				// 表单上的元素，返回节点属性值
				if (elem.nodeName === "FORM") {
					var node = elem.getAttributeNode(name);
					return node && node.nodeValue;
				}

				return elem[name];
			}

			return elem.getAttribute(name); // 有些属性在 IE 需要参数获取

		},

		/**
		 * 检查是否含指定类名。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(elem, className) {
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function(elem, styles){
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			var r = {};
			for(var style in styles){
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * 设置指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 */
		setStyles: function(elem, styles){
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			o.extend(elem.style, styles);
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function(elem) {
			assert.isElement(elem, "Element.setMovable(elem): 参数 elem ~。");
			if(!checkPosition(elem, "absolute"))
				elem.style.position = "relative";
		},

		/**
		 * 检查元素的 position 是否和指定的一致。
		 * @param {Element} elem 元素。
		 * @param {String} position 方式。
		 * @return {Boolean} 一致，返回 true 。
		 * @static
		 */
		checkPosition: checkPosition,

		/**
		 * 根据 x, y 获取 {x: x y: y} 对象
		 * @param {Number/Point} x
		 * @param {Number} y
		 * @static
		 * @private
		 */
		getXY: getXY,
		
		/// #endif
		
		/**
		 * 将一个成员附加到 Element 对象和相关类。
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
		 * @return {Element} this
		 * @static
		 * 对 Element 扩展，内部对 Element ElementList document 皆扩展。
		 * 这是由于不同的函数需用不同的方法扩展，必须指明扩展类型。
		 * 所谓的扩展，即一个类含需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1, setText - 执行结果返回 this， 返回 this 。(默认)
		 *  2      其它  getText - 执行结果是数据，返回结果数组。 
		 *  3  getElementById - 执行结果是DOM，返回  ElementList 包装。
		 *  4  getElementsByTagName - 执行结果是DOM数组，返回  ElementList 包装。
		 * 
		 * 
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (members, listType, copyIf) {

			assert.notNull(members, "Element.implement" + (copyIf ? 'If' : '') + "(members, listType): 参数 {members} ~。");
			
			Object.each(members, function (value, key) {
				
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(cls && (!copyIf || !cls[key])) {
						
						if(!i) {
							switch (listType) {
								case 2:  //   return this
									value = function() {
										return this.invoke(key, arguments);
									};
									break;
								case 3:  //  return  ElementList(dom)
									value = function() {
										return new el(this.invoke(key, arguments));
									};
									break;
									
								case 4:  //  return ElementList(ElementList)
									value = function() {
										var args = arguments, r = [];
										this.forEach(function(node){
											var t = node[key].apply(node, args);
											if(t){
												r.push.apply(r, t.doms || [t]);
											}
										});
										return new el(r);
			
									};
									break;
									
								default:  // return return
									value = function() {
										var doms = this.doms, l = doms.length, i = -1;
										while (++i < l)
											doms[i][key].apply(doms[i], arguments);
										return this;
									};
									
							}
						}
						
						cls[key] = value;
					}
				}
				
				
				
				
			}, [el, p.Document, p.Element, e != p.Element && e]);
			
			/// #ifdef SupportIE8

			if(ep.$version) {
				ep.$version++;
			}

			/// #endif

			return this;
		},

		/**
		 * 若不存在，则将一个对象附加到 Element 对象。
		 * @static
		 * @param {Object} obj 要附加的对象。
		 * @param {Number} listType 说明如何复制到 ElementList 实例。
		 * @param {Number} docType 说明如何复制到 Document 实例。
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},
		
		/**
		 * 定义事件。
		 * @param {String} 事件名。
		 * @param {Function} trigger 触发器。
		 * @return {Function} 函数本身
		 * @static
		 * @memberOf Element
		 * 原则 Element.addEvents 可以解决问题。 但由于 DOM 的特殊性，额外提供 defineEvents 方便定义适合 DOM 的事件。
		 * defineEvents 主要解决 3 个问题:
		 * <ol>
		 * <li> 多个事件使用一个事件信息。
		 *      <p>
		 * 	 	 	所有的 DOM 事件的  add 等 是一样的，因此这个函数提供一键定义: JPlus.defineEvents('e1 e2 e3')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件别名。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件是另外一个事件的别名。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('mousewheel', 'DOMMouseScroll')
		 * 		</p>
		 * </li>
		 *
		 * <li> 事件委托。
		 *      <p>
		 * 	 	 	一个自定义 DOM 事件经常依赖已有的事件。一个事件由另外一个事件触发， 比如 ctrlenter 是在 keyup 基础上加工的。
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('ctrlenter', 'keyup', function(e){ (判断事件) })
		 * 		</p>
		 * </li>
		 *
		 * @example
		 * <code>
		 *
		 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
		 * 替换   DOMMouseScroll 。
		 *
		 * Element.defineEvents('mouseenter', 'mouseover', function(e){
		 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
		 * mouseenter 时候 取消事件。
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function(events, baseEvent, initEvent) {
			
			var ee = p.Events.element;
			
			if(Object.isObject(events)){
				return p.Object.addEvents.call(e, events);	
			}
	
			// 删除已经创建的事件。
			delete ee[events];
	
			// 对每个事件执行定义。
			String.map(events, Function.from(!Function.isFunction(baseEvent) ? {
	
				initEvent: initEvent ? function(e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
	
				//  如果存在 baseEvent，定义别名， 否则使用默认函数。
				add: function(elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
	
				remove: function(elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
	
			} : o.extendIf({
	
				initEvent: baseEvent
	
			}, ee.$default)), ee);
	
			return e.addEvents;
		},
		
		/**
		 * 获取元素的文档。
		 * @param {Element} elem 元素。
		 * @return {Document} 文档。
		 */
		getDocument: getDocument
		
	})
	
	.implement({
	
		/// #ifdef ElementNode

		/**
		 * 设置节点的父节点。
		 * @method renderTo
		 * @param {Element} elem 节点。
		 * @return {Element} this
		 */
		renderTo: function(elem) {

			elem = elem && elem !== true ? p.$(elem) : document.body;

			assert(elem.appendChild, 'Element.prototype.renderTo(elem): 参数 {elem} ~ 必须是 DOM 节点或控件。');
			
			var me = this.dom || this;
			
			if (me.parentNode !== elem) {

				// 插入节点
				elem.appendChild(me);
			}

			// 返回
			return this;
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function(child) {
			var me = this.dom || this;
			assert(!child || this.hasChild(child.dom || child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
			child ? this.removeChild(child.dom || child) : ( me.parentNode && me.parentNode.removeChild(me) );
			return this;
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function() {
			e.empty(this.dom || this);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 * @method dispose
		 */
		dispose: function() {
			e.dispose(this.dom || this);
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute

		/**
		 * 设置内容样式。
		 * @param {String} name 键。
		 * @param {String/Number} value 值。
		 * @return {Element} this
		 */
		setStyle: function(name, value) {

			assert.isString(name, "Element.prototype.setStyle(name, value): 参数 {name} ~。");

			// 获取样式
			var me = this, style = (me.dom || me).style;

			//没有键  返回  cssText
			if (arguments.length == 1) {
				style.cssText = name;
			} else {

				if(name in styles) {

					name = styles[name];
					
					if(me[name]){
						return me[name](value);
					}

				} else {
					name = name.toCamelCase();
	
					//如果值是函数，运行。
					if (typeof value === "number" && !(name in e.styleNumbers))
						value += "px";
					
				}

				// 指定值
				style[name] = value;
			}

			return me;
		},

		/// #ifdef SupportIE8

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: !('opacity' in div.style) ? function(value) {

			var style = (this.dom || this).style;

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			// 当元素未布局，IE会设置失败，强制使生效
			style.zoom = 1;

			// 设置值
			style.filter = (style.filter || 'alpha(opacity=?)').replace(rOpacity, "opacity=" + value * 100);

			//返回值， 保证是字符串  值为  0 - 100
			return this;

		} : function(value) {

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			//  标准浏览器使用   opacity
			(this.dom || this).style.opacity = value;
			return this;

		},

		/// #else

		/// setOpacity: function(value) {
		///	
		/// 	assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);
		///
		///     //  标准浏览器使用   opacity
		///     (this.dom || this).style.opacity = value;
		///     return this;
		///
		/// },

		/// #endif
		
		/**
		 * 设置节点属性。
		 * @param {String} name 名字。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setAttr: function(name, value) {

			//简写
			var me = this.dom || this;

			//属性
			name = attributes[name] || name;

			// 如果是节点具有的属性
			if (name in me) {


				/// #ifdef SupportIE6

				assert(name != 'type' || me.nodeName != "INPUT" || !me.parentNode, "此元素 type 属性不能修改");

				/// #endif

				me[name] = value;
			} else {
				if (value === null)
					me.removeAttribute(name);
				else
					// 使用DOM设置属性
					me.setAttribute(name, value);
			}

			return this;

		},

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function(name, value) {

			var me = this;

			if (typeof name === "string") {
				
				var dom = me.dom || me;

				// event 。
				if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css 。
				else if(dom.style && (name in dom.style || rStyle.test(name)))
					me.setStyle(name, value);

				// attr 。
				else if(name in dom)
					dom[name] = value;

				// Object 。
				else
					me[name] = value;

			} else if(o.isObject(name)) {

				for(value in name)
					me.set(value, name[value]);

			}

			return me;


		},

		/**
		 * 增加类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		addClass: function(className) {
			var me = this.dom || this;

			if(!me.className)
				me.className = className;
			else
				me.className += ' ' + className;
			return this;
		},

		/**
		 * 删除类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		removeClass: function(className) {
			
			var me = this.dom || this;

			me.className = className ? me.className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
			return this;
		},

		/**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return {Element} this
		 */
		toggleClass: function(className, toggle) {
			return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(  className  );
		},

		/**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function(value) {
			var me = this.dom || this;

			switch(me.tagName) {
				case "SELECT":
					if(me.type === 'select-multiple' && value) {
						
						assert.isString(value, "Element.prototype.setText(value): 参数  {value} ~。");
					
						value = value.split(',');
						o.each(me.options, function(e) {
							e.selected = value.indexOf(e.value) > -1;
						});
						
						break;

					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					me.value = value;
					break;
				default:
					me[attributes.innerText] = value;
			}
			return  this;
		},

		/**
		 * 设置 HTML 。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setHtml: function(value) {

			(this.dom || this).innerHTML = value;
			return this;
		},

		/**
		 * 显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		show: function(duration, callBack) {
			
			e.show(this.dom || this);
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 隐藏当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		hide: function(duration, callBack) {

			e.hide(this.dom || this);
			if(callBack)
				setTimeout(callBack, 0);
			return this;
		},

		/**
		 * 切换显示当前元素。
		 * @param {Number} duration=500 时间。
		 * @param {Function} [callBack] 回调。
		 * @param {String} [type] 方式。
		 * @return {Element} this
		 */
		toggle: function(duration, callBack, type, flag) {
			return this[(flag === undefined ? this.isHidden() : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function(value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function(value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function(value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function(elem) {
			
			assert(!elem || (elem.dom  && elem.dom.style) || elem.style, "Element.prototype.bringToFront(elem): 参数 {elem} 必须为 元素或为空。", elem);
			
			var me = this.dom || this;

			me.style.zIndex = Math.max(parseInt(styleString(me, 'zIndex')) || 0, elem && (parseInt(styleString(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++);
			return this;
		},
	
		/// #endif
	
		/// #ifdef ElementDimension

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setSize: function(x, y) {
			return setSize(this, 'pb', x, y);
		},

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setOuterSize: function(x, y) {
			return setSize(this, 'mpb', x, y);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setWidth: function(value) {

			(this.dom || this).style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : '';
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Element} this
		 */
		setHeight: function(value) {

			(this.dom || this).style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : '';
			return this;
		},

		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function(x, y) {
			var me = this.dom || this, p = getXY(x,y);

			if(p.x != null)
				me.scrollLeft = p.x;
			if(p.y != null)
				me.scrollTop = p.y;
			return this;

		},

		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function(p) {

			assert(o.isObject(p) && 'x' in p && 'y' in p, "Element.prototype.setOffset(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
			var s = (this.dom || this).style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
		 * 设置元素的固定位置。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setPosition: function(x, y) {
			var me = this, offset = me.getOffset().minus(me.getPosition()), p = getXY(x,y);

			if (p.y)
				offset.y += p.y;
				
			if (p.x)
				offset.x += p.x;

			e.setMovable(me.dom || me);

			return me.setOffset(offset);
		}
	
		/// #endif
		
	})
	
	/// #ifdef ElementEvent
	
	.implement(p.IEvent)
	
	/// #endif
		
	/// #if !defind(SupportIE8) && (ElementEvent || ElementReady)
	
	.implementIf(eventObj)
		
	/// #endif
	
	.implementIf({
		
		/**
		 * xType
		 * @type String
		 */
		xType: "element"

	})
	
	.implement({
		
		/// #ifdef ElementNode

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function(child) {
			var me = this.dom || this;
			assert.isNode(me, "Element.prototype.contains(child): this.dom || this 返回的必须是 DOM 节点。");
			assert.notNull(child, "Element.prototype.contains(child):参数 {child} ~。");
			child = child.dom || child;
			return child == me || e.hasChild(me, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function(child) {
			var me = this.dom || this;
			return child ? e.hasChild(me, child.dom || child) : me.firstChild !== null;
		},
		
		/// #endif

		/// #ifdef ElementAttribute

		/**
		 * 获取节点样式。
		 * @param {String} key 键。
		 * @param {String} value 值。
		 * @return {String} 样式。
		 */
		getStyle: function(name) {

			assert.isString(name, "Element.prototypgetStyle(name): 参数 {name} ~。");

			var me = this.dom || this;

			return me.style[name = name.toCamelCase()] || getStyle(me, name);

		},

		/// #ifdef SupportIE8

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: !('opacity' in div.style) ? function() {

			return rOpacity.test(styleString(this.dom || this, 'filter')) ? parseInt(RegExp.$1) / 100 : 1;

		} : function() {

			return styleNumber(this.dom || this, 'opacity');

		},

		/// #else
		///
		/// getOpacity: function() {
		///
		///    return parseFloat(styleString(this.dom || this, 'opacity')) || 0;
		///
		/// },

		/// #endif

		/**
		 * 获取一个节点属性。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: function(name) {
			return e.getAttr(this.dom || this, name);
		},

		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function(className) {
			return e.hasClass(this.dom || this, className);
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function() {
			var me = this.dom || this;

			switch(me.tagName) {
				case "SELECT":
					if(me.type != 'select-one') {
						var r = [];
						o.each(me.options, function(s) {
							if(s.selected)
								r.push(s.value)
						});

						return r.join(',');
					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					return me.value;
				default:
					return me[attributes.innerText];
			}
		},

		/**
		 * 获取值。
		 * @return {String} 值。
		 */
		getHtml: function() {

			return (this.dom || this).innerHTML;
		},

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function() {
			var me = this.dom || this;

			return (me.style.display || getStyle(me, 'display')) === 'none';
		},
	
		/// #ifdef ElementDimension

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function() {
			var me = this.dom || this;

			return new Point(me.scrollWidth, me.scrollHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function() {
			var me = this.dom || this;

			return new Point(me.offsetWidth, me.offsetHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 margin 大小。
		 * @return {Point} 位置。
		 */
		getOuterSize: function() {
			var me = this.dom || this;
			return this.getSize().add(e.getSizes(me, 'x', 'm'), e.getSizes(me, 'y', 'm'));
		},

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function() {

			// 如果设置过 left top ，这是非常轻松的事。
			var me = this.dom || this,
				left = me.style.left,
				top = me.style.top;

			// 如果未设置过。
			if (!left || !top) {

				// 绝对定位需要返回绝对位置。
				if(checkPosition(me, 'absolute'))
					return this.getOffsets(this.getOffsetParent());

				// 非绝对的只需检查 css 的style。
				left = getStyle(me, 'left');
				top = getStyle(me, 'top');
			}

			// 碰到 auto ， 空 变为 0 。
			return new Point(parseFloat(left) || 0, parseFloat(top) || 0);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getWidth: function() {
			return styleNumber(this.dom || this, 'width');
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getHeight: function() {
			return styleNumber(this.dom || this, 'height');
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getScroll,

		/**
		 * 获取元素的上下左右大小。
		 * @return {Rectange} 大小。
		 */
		getBound: function() {
			var p = this.getPosition(), s = this.getSize();
			return {
				left: p.x,
				top: p.y,
				width: s.x,
				height: s.y,
				right: p.x + s.x,
				bottom: p.y + s.y
			};
		},

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect   ? function() {

			var me = this.dom || this,
				bound = me.getBoundingClientRect(),
				doc = getDocument(me),
				html = doc.dom,
				htmlScroll = checkPosition(me, 'fixed') ? {
					x:0,
					y:0
				} : doc.getScroll();

			return new Point(
				bound.left+ htmlScroll.x - html.clientLeft,
				bound.top + htmlScroll.y - html.clientTop
			    );
		} : function() {

			var me = this.dom || this,
				elem = me,
				p = getScrolls(elem);

			while (elem && !isBody(elem)) {
				p.add(elem.offsetLeft, elem.offsetTop);
				if (navigator.isFirefox) {
					if (nborderBox(elem)) {
						add(elem);
					}
					var parent = elem.parentNode;
					if (parent && styleString(parent, 'overflow') != 'visible') {
						add(parent);
					}
				} else if (elem != me && navigator.isSafari) {
					add(elem);
				}

				elem = elem.offsetParent;
			}
			if (navigator.isFirefox && nborderBox(me)) {
				p.add(-styleNumber(me, borderLeftWidth), -styleNumber(me, borderTopWidth));
			}
			
			function add(elem){
				p.add(styleNumber(elem, borderLeftWidth),  styleNumber(elem, borderTopWidth));
			}
			return p;
		},

		/**
		 * 获取包括滚动位置的位置。
		 * @param {Element/String/Boolean} relative 相对的节点。
		 * @return {Point} 位置。
		 */
		getOffsets: function( relative) {
			var pos, me = this.dom || this;
			if (isBody(me))
				return new Point(0, 0);
			pos = this.getPosition().minus(getScrolls(me));
			if(relative) {
				
				relative = relative.dom || p.$(relative);

				assert.isElement(relative, "Element.prototype.getOffsets(relative): 参数 {relative} ~。");

				pos.minus(relative.getOffsets()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, borderLeftWidth) ,-styleNumber(me, 'marginTop') - styleNumber(relative,  borderTopWidth) );
			}
			return pos;
		},

		/**
		 * 获取用于作为父元素的节点。
		 * @return {Element} 元素。
		 */
		getOffsetParent: function() {
			var me = this.dom || this, elem = me.offsetParent || getDocument(me).body;
			while ( elem && !isBody(elem) && checkPosition(elem, "static") ) {
				elem = elem.offsetParent;
			}
			return elem;
		}

		/// #endif
		
	}, 2)
	
	.implement({
		
		/// #ifdef ElementNode

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: div.querySelector ? function(selecter) {
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			return (this.dom || this).querySelector(selecter);
		} : function(selecter) {
			var current = this.dom || this;
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			if(selecter.split(' ').each(function(v) {
				return !!(current = findBy(current, v)[0]);
			}))
				return p.$(current);
		},

		/// #else

		/// find: div.querySelector,

		/// #endif

		/**
		 * 复制节点。
		 * @param {Boolean} copyDataAndEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepid=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
		clone: function(copyDataAndEvent, contents, keepid) {

			assert.isNode(this.dom || this, "Element.prototype.clone(copyDataAndEvent, contents, keepid): this.dom || this 返回的必须是 DOM 节点。");

			var elem = this.dom || this,
			clone = elem.cloneNode(contents = contents !== false);

			if (contents) {
				for (var ce = clone.getElementsByTagName('*'), te = elem.getElementsByTagName('*'), i = ce.length; i--;)
					clean(ce[i], te[i], copyDataAndEvent, keepid);
			}

			clean(elem, clone, copyDataAndEvent, keepid);

			/// #ifdef SupportIE6

			if (navigator.isQuirks) {
				o.update(elem.getElementsByTagName('object'), 'outerHTML', clone.getElementsByTagName('object'), true);
			}

			/// #endif

			return clone;
		},

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [swhere] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: 'insertAdjacentElement' in div ? function(html, swhere) {
			var me = this.dom || this;
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert.notNull(html, "Element.prototype.insert(html, swhere): 参数  {html} ~。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数  {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if(typeof html === 'string')
				me.insertAdjacentHTML(swhere, html);
			else
				me.insertAdjacentElement(swhere, html.dom || html);
			switch (swhere) {
				case "afterEnd":
					html = me.nextSibling;
					break;
				case "beforeBegin":
					html = me.previousSibling;
					break;
				case "afterBegin":
					html = me.firstChild;
					break;
				default:
					html = me.lastChild;
					break;
			}

			return p.$(html);
		} : function(html, swhere) {

			var me = this.dom || this;

			assert.notNull(html, "Element.prototype.insert(html, swhere): 参数 {html} ~。");
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if (!html.nodeType) {
				html = html.dom || e.parse(html, getDocument(me));
			}

			switch (swhere) {
				case "afterEnd":
					if(!me.nextSibling) {

						assert(me.parentNode != null, "Element.prototype.insert(html, swhere): 节点无父节点时无法插入 {this}", me);

						me.parentNode.appendChild(html);
						break;
					}

					me = me.nextSibling;
				case "beforeBegin":
					assert(me.parentNode != null, "Element.prototype.insert(html, swhere): 节点无父节点时无法插入 {this}", me);
					me.parentNode.insertBefore(html, me);
					break;
				case "afterBegin":
					if (me.firstChild) {
						me.insertBefore(html, me.firstChild);
						break;
					}
				default:
					assert(arguments.length == 1 || !swhere || swhere == 'beforeEnd' || swhere == 'afterBegin', 'Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。', swhere);
					me.appendChild(html);
					break;
			}

			return html;
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function(html) {
			var me = this;


			assert.notNull(html, "Element.prototype.append(html, escape): 参数 {html} ~。");

			if(!html.nodeType) {
				html = html.dom || e.parse(html, getDocument(me.dom || me));
			}

			assert.isNode(html, "Element.prototype.append(html, escape): 参数 {html} 不是合法的 节点或 HTML 片段。");
			return me.appendChild(html);
		},

		/**
		 * 将一个节点用html包围。
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		wrapWith: function(html) {
			html = this.replaceWith(html);
			while(html.lastChild)
				html = html.lastChild;
			html.appendChild(this.dom || this);
			return html;
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {String} html 内容。
		 * @return {Element} 元素。
		 */
		replaceWith: function(html) {
			var me = this.dom || this;

			assert.notNull(html, "Element.prototype.replaceWith(html): 参数 {html} ~。");
			if (!html.nodeType) {
				html = html.dom || e.parse(html, getDocument(me));
			}


			assert(me.parentNode, 'Element.prototype.replaceWith(html): 当前节点无父节点，不能执行此方法 {this}', me);
			assert.isNode(html, "Element.prototype.replaceWith(html, escape): 参数 {html} ~或 HTM 片段。");
			me.parentNode.replaceChild(html, me);
			return html;
		}
		
		/// #endif

	}, 3)
	
	.implementIf({
		
		/// #ifdef ElementNode

		/**
		 * 根据属性获得元素内容。
		 * @param {Strung} name 属性名。
		 * @param {Strung} value 属性值。
		 * @return {Array} 节点集合。
		 */
		getElementsByAttribute: function(name, value) {
			return find(this.dom || this, value === undefined ? function(elem){
				return !!e.getAttr(elem, name);
			} : function(elem) {

				// 或者属性值 == value 且 value 非空
				// 或者 value空， 属性值非空
				return e.getAttr(elem, name) === value;
			});

		},

		/// #ifdef SupportIE6

		/**
		 * 根据类名返回子节点。
		 * @param {Strung} className 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByClassName: function(className) {
			assert.isString(className, "Element.prototype.getElementsByClassName(classname): 参数 {classname} ~。");
			className = className.split(/\s/); 
			return find(this.dom || this, function(elem) {
				var i = className.length;
				while(i--) if(!e.hasClass(elem, className[i])) return false;
                return true;
			});

		},

		/// #else

		/// getElementsByClassName:  function(name) {
		/// 	return this.getElementsByClassName(name);
		/// },

		/// #endif

		// 使     ElementList 支持此函数
		
		/**
		 * 根据标签返回子节点。
		 * @param {Strung} name 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByTagName: function(name) {
			return this.getElementsByTagName(name);
		},

		/**
		 * 根据名字返回子节点。
		 * @param {Strung} classname 类名。
		 * @return {Array} 节点集合。
		 */
		getElementsByName: function(name) {
			return this.getElementsByAttribute('name', name);
		},

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: div.querySelectorAll ? function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			return new el((this.dom || this).querySelectorAll(selecter));
		} : function(selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			var current = new el([this.dom || this]);
			selecter.split(' ').forEach( function(v) {
				current = findBy(current, v);
			});

			return current;
		},

		/// #else

		/// findAll: div.querySelectorAll,

		/// #endif

		/**
		 * 获得相匹配的节点。
		 * @param {String} type 类型。
		 * @param {Function/Number} fn 过滤函数或索引或标签。
		 * @return {Element} 元素。
		 */
		get: function(type, fn) {

			// 如果 type 为函数， 表示 默认所有子节点。
			switch (typeof type) {
				case 'string':
					fn = fn ? getFilter(fn) : Function.returnTrue;
					break;
				case 'function':
					fn = type;
					type = 'children';
					break;
				case 'number':
					fn = getFilter(type);
					type = 'first';
			}

			var n = e.nodeMaps[type];
			assert(n, 'Element.prototype.get(type, fn): 函数不支持 {0}类型 的节点关联。', type);
			return n[0](this.dom || this, fn, n[1], n[2]);
		}
		
		/// #endif

	}, 4);
		
	assert.isNode(document.documentElement, "在 element.js 执行时，必须存在 document.documentElement 属性。请确认浏览器为标准浏览器， 且未使用  Quirks 模式。");
	
	/// #ifdef ElementCore
	
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	/// #endif
	
	/// #ifdef SupportIE8

	if (navigator.isStd) {

	/// #endif
		
		/// #ifdef ElementEvent
		
		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function(e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};
		
		/// #endif

	/// #ifdef SupportIE8
		
	} else {
		
		ep.$version = 1;
		
		p.$ = function(id) {
			
			var dom = getElementById(id);
	
			if(dom && dom.$version !== ep.$version) {
				o.extendIf(dom, ep);
			}
	
			return dom;
			
		};
		
		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function(e) {
			if(!e.preventDefault){
				e.target = e.srcElement ? p.$(e.srcElement) : (e.srcElement = document);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function(event) {
			if(!e.preventDefault){
				initUIEvent(event);
				event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
				var dom = getDocument(event.target).dom;
				event.pageX = event.clientX + dom.scrollLeft;
				event.pageY = event.clientY + dom.scrollTop;
				event.layerX = event.x;
				event.layerY = event.y;
				//  1 ： 单击  2 ：  中键点击 3 ： 右击
				event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function(e) {
			if(!e.preventDefault){
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
		
		/// #endif

		try {
	
			//  修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
		
	}
	
	/// #endif
		
	/// #ifdef ElementEvent
	
	/**
	 * 默认事件。
	 * @type Object
	 * @hide
	 */
	namespace(".Events.element.$default", {

		/**
		 * 创建当前事件可用的参数。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		trigger: function(elem, type, fn, e) {
			e = new p.Event(elem, type, e);
			return fn(e) || (elem[type = 'on' + type] && elem[type](e) !== false);
		},

		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		initEvent: Function.empty,

		/**
		 * 添加绑定事件。
		 * @param {Object} obj 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		add: function(obj, type, fn) {
			obj.addEventListener(type, fn, false);
		},

		/**
		 * 删除事件。
		 * @param {Object} obj 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		remove: function(obj, type, fn) {
			obj.removeEventListener(type, fn, false);
		}

	});

	e.addEvents
		("click dblclick mouseup mousedown contextmenu mouseover mouseout mousemove selectstart selectend mouseenter mouseleave", initMouseEvent)
		("mousewheel DOMMouseScroll blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if (navigator.isFirefox)
		e.addEvents('mousewheel', 'DOMMouseScroll');

	if (!navigator.isIE)
		e.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	
	/// #endif
	
	/// #if !defind(SupportIE8) && (ElementEvent || ElementReady)
	
	o.extendIf(window, eventObj);
		
	/// #endif
		
	/// #ifdef ElementAttribute
	
	String.map('x y', function(c, i){
		c = e.styleMaps[c] = {};
		var tx = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
		c.d = tx.invoke('toLowerCase', []);
		String.map('padding~ margin~ border~Width', function(v){
			c[v.charAt(0)] = [v.replace('~', tx[0]), v.replace('~', tx[1])];
		});
	});
	
	String.map("href src defaultValue accessKey cellPadding cellSpacing rowSpan colSpan frameBorder maxLength readOnly tabIndex useMap contentEditable", function(value) {
		attributes[value.toLowerCase()] = value;
	});
	
	if(!('opacity' in div.style)){
		styles.opacity = 'setOpacity';
	}
	
	/// #endif
	
	/// #ifdef ElementReady
		
	String.map('Ready Load', function(ReadyOrLoad, isReady){
	
		var readyOrLoad = ReadyOrLoad.toLowerCase(),
			isReadyOrLoad = 'is' + ReadyOrLoad;
			
		//  设置 onReady  Load
		document['on' + ReadyOrLoad] = function(fn) {

			assert.isFunction(fn, "document.on" +  ReadyOrLoad + "(fn): 参数 {fn} ~。");
			
			if(document[isReadyOrLoad])
				fn.call(document);
			else
				// 已经完成则执行函数，否则 on 。
				document.on(readyOrLoad, fn);
			
			return document;
		};
		
		function doReadyLoad(){
		
			document[isReadyOrLoad] = true;
			
			if(document.isReady) {
				document.removeEventListener(domReady, doReadyLoad, false);
			} else {
				// 使用系统文档完成事件。
				window.removeEventListener(readyOrLoad, doReadyLoad, false);
				doReady();
				doReady = doLoad = null;
			}
		
			document.trigger(readyOrLoad);
			
		}
		
		if(isReady)
			doLoad = doReadyLoad;
		else
			doReady = doReadyLoad;
	});
	
	/**
	 * 页面加载时执行。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onReady
	 */
	
	/**
	 * 在文档载入的时候执行函数。
	 * @param {Functon} fn 执行的函数。
	 * @member document.onLoad
	 */
		
	// 如果readyState 不是  complete, 说明文档正在加载。
	if (document.readyState !== "complete") { 

		// 使用系统文档完成事件。
		document.addEventListener(domReady, doReady, false);
	
		window.addEventListener('load', doLoad, false);
		
		/// #ifdef SupportIE8
		
		// 只对 IE 检查。
		if (!navigator.isStd) {
		
			// 来自 jQuery

			//   如果是 IE 且不是框架
			var topLevel = false;

			try {
				topLevel = window.frameElement == null;
			} catch(e) {}

			if ( topLevel && document.documentElement.doScroll) {
				
				/**
				 * 为 IE 检查状态。
				 * @private
				 */
				(function () {
					if (document.isReady) {
						return;
					}
				
					try {
						//  http:// javascript.nwbox.com/IEContentLoaded/
						document.documentElement.doScroll("left");
					} catch(e) {
						setTimeout( arguments.callee, 1 );
						return;
					}
				
					doReady();
				})();
			}
		}
		
		/// #endif
		
	} else {
		setTimeout(doLoad, 1);
	}
	
	/// #endif
	
	String.map("$ Element Document", p, window, true);

	String.map("invoke each indexOf forEach", function(func){
		el.prototype[func] = function(){
			return ap[func].apply(this.doms, arguments);
		};
	});

	/**
	 * @class
	 */

	/**
	 * 根据一个 id 或 对象获取节点。
	 * @param {String/Element} id 对象的 id 或对象。
	 * @return {Element} 元素。
	 */
	function getElementById(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	}
	
	/**
	 * 获取元素的文档。
	 * @param {Element} elem 元素。
	 * @return {Document} 文档。
	 */
	function getDocument(elem) {
		assert.isNode(elem, 'Element.getDocument(elem): 参数 {elem} ~。');
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementNode

	/**
	 * 返回元素指定节点。
	 * @param {Element} elem 节点。
	 * @param {Number/Function/undefined/undefined} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {Element} 节点。
	 */
	function walk(elem, fn, walk, first) {
		elem = elem[first];
		while (elem) {
			if (elem.nodeType == 1 && fn(elem)) {
				return p.$(elem);
			}
			elem = elem[walk];
		}
		return null;
	}

	/**
	 * 返回元素满足条件的节点的列表。
	 * @param {Element} elem 节点。
	 * @param {Function} fn 过滤函数。
	 * @param {String} walk 路径。
	 * @param {String} first 第一个节点。
	 * @return {ElementList} 集合。
	 */
	function dir(elem, fn, walk, first) {
		elem = elem[first || walk];
		var es = [];
		while (elem) {
			if (elem.nodeType == 1 && fn(elem)) {
				es.push(elem);
			}
			elem = elem[walk];
		}
		return new el(es);
	}

	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} copyDataAndEvent=true 是否复制数据。
	 * @param {Boolean} keepid=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function clean(srcElem, destElem, copyDataAndEvent, keepid) {
		if (!keepid)
			destElem.removeAttribute('id');

		/// #ifdef SupportIE8

		if( destElem.mergeAttributes) {

			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data  出现异常。
			destElem.removeAttribute("$data");


			if (srcElem.options) {
				o.update(srcElem.options, 'selected', destElem.options, true);
			}
		}

		/// #endif

		if (copyDataAndEvent) {
			p.cloneData(destElem, srcElem);
		}


		var prop = e.properties[srcElem.tagName];
		if (prop)
			destElem[prop] = srcElem[prop];
	}

	/**
	 * 执行简单的选择器。
	 * @param {Element} elem 元素。
	 * @param {String} selector 选择器。
	 * @return {JPlus.ElementList} 元素集合。
	 */
	function findBy(elem, selector) {
		switch(selector.charAt(0)) {
			case '.':
				elem = elem.getElementsByClassName(selector.replace(/\./g, ' '));
				break;
			case '[':
				var s = rAttr.exec(selector);
				assert(s && s[1], "Element.prototype.find(selector): 参数 {selector} 不是合法的选择器。 属性选择器如: [checked='checked']", selector);
				elem = elem.getElementsByAttribute(s[1], s[4]);
				break;
			default:
				elem = elem.getElementsByTagName(selector);
				break;
		}

		return elem;
	}

	/**
	 * 获取一个选择器。
	 * @param {Number/Function/String} fn
	 * @return {Funtion} 函数。
	 */
	function getFilter(fn) {
		var t;
		switch(typeof fn){
			case 'number':
				t = fn;
				fn = function(elem) {
					return --t < 0;
				};
				break;
			case 'string':
				t = fn.toUpperCase();
				fn = function(elem) {
					return elem.tagName === t;
				};
		}
		
		assert.isFunction(fn, "Element.prototype.get(type, fn): 参数 {fn} 必须是一个函数、数字或字符串。", fn);
		return fn;
	}
	
	/// #endif
	
	/// #ifdef ElementEvent
	
	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 */
	function checkMouseEnter(e) {

		var parent = e.relatedTarget;
		while (parent && parent != this) {
			parent = parent.parentNode;
		}

		return this != parent;
	}
	
	/// #endif
	
	/// #ifdef ElementAttribute
	
	/**
	 * 读取样式字符串。
	 * @param {Element} elem 元素。
	 * @param {String} name 属性名。
	 * @return {String} 字符串。
	 */
	function styleString(elem, name) {
		return elem.style[name] || getStyle(elem, name);
	}

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		var value = parseFloat(elem.style[name]);
		if(!value && value !== 0) {
			value = parseFloat(getStyle(elem, name));
		}
		
		if(!value && value !== 0) {
			if(name in styles){
				var style = e.getStyles(elem, e.display);
				e.setStyles(elem, e.display);
				value= parseFloat(getStyle(elem, name)) || 0;
				e.setStyles(elem, style);
			} else {
				value = 0;
			}
		}
		
		return value;
	}
	
	/**
	 * 检查元素的 position 是否和指定的一致。
	 * @param {Element} elem 元素。
	 * @param {String} position 方式。
	 * @return {Boolean} 一致，返回 true 。
	 */
	function checkPosition(elem, position) {
		return styleString(elem, "position") === position;
	}

	/**
	 * 获取一个元素滚动。
	 * @return {Point} 大小。
	 */
	function getScroll() {
		var doc = this.dom || this;
		return new Point(doc.scrollLeft, doc.scrollTop);
	}

	/**
	 * 检查是否为 body 。
	 * @param {Element} elem 内容。
	 * @return {Boolean} 是否为文档或文档跟节点。
	 */
	function isBody(elem) {
		return rBody.test(elem.nodeName);
	}
	
	/**
	 * 设置元素的宽或高。
	 * @param {Element/Control} me 元素。
	 * @param {String} fix 修正的边框。
	 * @param {Number} x 宽。
	 * @param {Number} y 宽。
	 */
	function setSize(elem, fix, x ,y) {
		var p = getXY(x,y);

		if(p.x != null)
			elem.setWidth(p.x - e.getSizes(elem.dom || elem, 'x', fix));

		if (p.y != null)
			elem.setHeight(p.y - e.getSizes(elem.dom || elem, 'y', fix));

		return elem;
	}

	/**
	 * 未使用盒子边框
	 * @param {Element} elem 元素。
	 * @return {Boolean} 是否使用。
	 */
	function nborderBox(elem) {
		return styleString(elem, 'MozBoxSizing') != 'border-box';
	}

	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function getXY(x, y) {
		return x && typeof x === 'object' ? x : {
			x:x,
			y:y
		};
	}

	/**
	 * 获取默认的位置。
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} obj
	 * @param {Object} method
	 */
	function adaptXY(x, y, obj, method) {
		var p = getXY(x, y);
		if(p.x == null)
			p.x = obj[method]().x;
		if(p.y == null)
			p.y = obj[method]().y;
		assert(!isNaN(p.x) && !isNaN(p.y), "adaptXY(x, y, obj, method): 参数 {x}或{y} 不是合法的数字。(method = {method})", x, y, method);
		return p;
	}

	/**
	 * 获取一个元素的所有滚动大小。
	 * @param {Element} elem 元素。
	 * @return {Point} 偏差。
	 */
	function getScrolls(elem) {
		var p = new Point(0, 0);
		elem = elem.parentNode;
		while (elem && !isBody(elem)) {
			p.add(-elem.scrollLeft, -elem.scrollTop);
			elem = elem.parentNode;
		}
		return p;
	}
	
	/// #endif

})(this);

