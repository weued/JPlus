//===========================================
//  元素。 提供最底层的 DOM 辅助函数。  
//  A: xuld
//  R: aki
//===========================================

(function (window) {
	
	
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
		
		/// #ifdef SupportIE6
		
		/**
		 * 元素。
		 * @type Function
		 * 如果页面已经存在 Element， 不管是不是用户自定义的，都直接使用。只需保证 Element 是一个函数即可。
		 */
		e = window.Element || function() {},
		
		/// #else
		
		/// e = window.Element,
		
		/// #endif
		
		/**
		 * 元素原型。
		 * @type Object
		 */
		ep = e.prototype,
	
		/**
		 * 用于测试的元素。
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
				 * @param {Object} target 事件对象的目标。
				 * @param {String} type 事件对象的类型。
				 * @param {Object} [e] 事件对象的属性。
				 * @constructor
				 */
				constructor: function (target, type, e) {
					assert.notNull(target, "JPlus.Event.prototype.constructor(target, type, e): 参数 {target} ~。");
					
					var me = this;
					me.target = target;
					me.srcElement = target.dom || target;
					me.type = type;
					apply(me, e);
				},
	
				/**
				 * 阻止事件的冒泡。
				 */
				stopPropagation : function () {
					this.cancelBubble = true;
				},
						
				/**
				 * 取消默认事件发生。
				 */
				preventDefault : function () {
					this.returnValue = false;
				},
				
				/**
				 * 停止默认事件和冒泡。
				 */
				stop: function () {
					this.stopPropagation();
					this.preventDefault();
				}
				
			}),
			
			/// #endif
			
			/**
			 * 元素。
			 */	
			Element: e,
			
			/**
			 * 文档。
			 */
			Document: document.constructor || {prototype: document}
				
		}),
		
		/// #ifdef ElementCore
		
		/**
		 * 元素缓存。
		 */
		cache = {},
	
		/**
		 * 是否为标签。
		 * @type RegExp
		 */
		rXhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	
		/**
		 * 无法复制的标签。
		 * @type RegExp
		 */
		rNoClone = /<(?:script|object|embed|option|style)/i,
	
		/**
		 * 是否为标签名。
		 * @type RegExp
		 */
		rTagName = /<([\w:]+)/,
		
		/**
		 * 包装。
		 * @type Object
		 */
		wrapMap = {
			$default:  navigator.isStandard ? [0, '', ''] : [1, '$<div>', '</div>'],
			option: [ 1, '<select multiple="multiple">', '</select>' ],
			legend: [ 1, '<fieldset>', '</fieldset>' ],
			thead: [ 1, '<table>', '</table>' ],
			tr: [ 2, '<table><tbody>', '</tbody></table>' ],
			td: [ 3, '<table><tbody><tr>', '</tr></tbody></table>' ],
			col: [ 2, '<table><tbody></tbody><colgroup>', '</colgroup></table>' ],
			area: [ 1, '<map>', '</map>' ]
		},
		
		/// #endif

		/// #ifdef ElementAttribute
	
		/**
		 * 表示事件的表达式。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
	
		/// #ifdef SupportIE8

		/**
		 * 透明度的正则表达式。
		 * @type RegExp
		 */
		rOpacity = /opacity=([^)]*)/,
	
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 null 或空字符串。
		 */
		getStyle = window.getComputedStyle ? function (elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			// 获取真实的样式
			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
	
			// 返回 , 在 火狐如果存在 IFrame， 则  computedStyle == null
			//    http://drupal.org/node/182569
			return computedStyle ? computedStyle[ name ] : null;
	
		} : function (elem, name) {
	
			assert.isElement(elem , "Element.getStyle(elem, name): 参数 {elem} ~。");
			
			// 特殊样式保存在 styles 。
			if(name in styles) {
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
			if (/^-?\d/.test(r) && !/^-?\d+(?:px)?$/i.test(r)) {
	
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
	
		/// getStyle = function (elem, name) {
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
		 * float 属性的名字。
		 * @type String
		 */
		styleFloat = 'cssFloat' in div.style ? 'cssFloat' : 'styleFloat',
		
		/**
		 * 特殊的样式。
		 * @type Object
		 */
		styles = {
			height: 'setHeight',
			width: 'setWidth'
		},
		
		/**
		 * 特殊属性集合。
		 * @type Object
		 */
		attributes = {
			innerText: 'innerText' in div ? 'innerText' : 'textContent',
			'for': 'htmlFor',
			'class': 'className'
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
			 * document.addEventListener('click', function () {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function (type, listener) {
				
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.addEventListener(type, listener, false);
				
			} : function (type, listener) {
				// IE8- 使用 attachEvent 。
				this.attachEvent('on' + type, listener);
			},
	
			/**
			 * 移除一个监听器。
			 * @method
			 * @param {String} type 类型。
			 * @param {Function} listener 函数。
			 *  @param {Boolean} state 类型。
			 * @seeAlso addEventListener
			 * @example
			 * <code>
			 * document.removeEventListener('click', function () {
			 * 
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function (type, listener,state) {
				this.removeEventListener(type, listener, state||false);
			}:function (type, listener) {
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
		domReady = navigator.isStandard ? 'DOMContentLoaded' : 'readystatechange',
		
		/// #else
		
		/// domReady = 'DOMContentLoaded',  
		
		/// #endif
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		rBody = /^(?:BODY|HTML)$/i,
	
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
			constructor: function (x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * 将 (x, y) 增值。
			 * @param {Number} value 值。
			 * @return {Point} this
			 */
			add: function (x, y) {
				//#cc Number.isNumber()会不会更好呢
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
			minus: function (p) {
	
				assert(p && 'x' in p && 'y' in p, "Point.prototype.minus(p): 参数 {p} 必须有 'x' 和 'y' 属性。", p);
				this.x -= p.x;
				this.y -= p.y;
				return this;
			},
	
			/**
			 * 复制当前对象。
			 * @return {Point} 坐标。
			 */
			clone: function () {
				return new Point(this.x, this.y);
			}
	
		})),
		
		/// #endif
		
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * @extends Element
		 * 控件的周期：
		 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
		 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
		 * init - 初始化控件本身。 可重写 - 默认为无操作。
		 * appendTo - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
		 * dispose - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
		 */
		Control = namespace(".Control", Class({
			
			/**
			 * 封装的节点。
			 * @type Element
			 */
			dom: null,
		
			/**
			 * 根据一个节点返回。
			 * @param {String/Element/Object} [options] 对象的 id 或对象或各个配置。
			 */
			constructor: function (options) {
				
				// 这是所有控件共用的构造函数。
				
				var me = this,
				
					// 临时的配置对象。
					opt = apply({}, me.options),
					
					// 当前实际的节点。
					dom;
				
				// 如果存在配置。
				if (options) {
					
					// 如果参数是一个 DOM 节点或 ID 。
					if (typeof options == 'string' || options.nodeType) {
						
						// 直接赋值， 在下面用 $ 获取节点 。
						dom = options;
					} else {
						
						// 否则 options 是一个对象。
						
						// 复制成员到临时配置。
						apply(opt, options);
						
						// 保存 dom 。
						dom = opt.dom;
						delete opt.dom;
					}
				}
				
				// 如果 dom 的确存在，使用已存在的， 否则使用 create(opt)生成节点。
				me.dom = dom ? p.$(dom) : me.create(opt);
				
				assert(me.dom && me.dom.nodeType, "Control.prototype.constructor(options): 当前实例的 dom 属性为空，或此属性不是 DOM 对象。(检查 options.dom 是否是合法的节点或ID(options 或 options.dom 指定的ID的节点不存在?) 或当前实例的 create 方法是否正确返回一个节点)\r\n当前控件: {dom} {xType}", me.dom, me.xType);
				
				// 调用 init 初始化控件。
				me.init(opt);
				
				// 处理样式。
				if('style' in opt) {
					assert(me.dom.style, "Control.prototype.constructor(options): 当前控件不支持样式。");
					me.dom.style.cssText += ';' + opt.style;
					delete opt.style;
				}
				
				// 复制各个选项。
				Object.set(me, opt);
			},
			
			/**
			 * 当被子类重写时，生成当前控件。
			 * @param {Object} options 选项。
			 * @protected
			 */
			create: function() {
				
				assert(this.tpl, "Control.prototype.create(): 当前类不存在 tpl 属性。Control.prototype.create 会调用 tpl 属性，根据这个属性中的 HTML 代码动态地生成节点并返回。子类必须定义 tpl 属性或重写 Control.prototype.create 方法。");
				
				// 转为对 tpl解析。
				return Element.parse(this.tpl);
			},
			
			/**
			 * 当被子类重写时，渲染控件。
			 * @method
			 * @param {Object} options 配置。
			 * @protected
			 */
			init: Function.empty,
			
			/**
			 * xType 。
			 */
			xType: "control",
			
			/**
		     * 创建并返回控件的副本。
		     * @param {Boolean} keepId=fasle 是否复制 id 。
		     * @return {Control} 新的控件。
		     */
			clone: function(keepId) {
				
				// 创建一个控件。
				return  new this.constructor(this.dom.nodeType === 1 ? this.dom.clone(false, true, keepId) : this.dom.cloneNode(!keepId));
				
			}
			
		})),
		
		/**
		 * 节点集合。
		 * @class ElementList
		 * @extends Array
		 * ElementList 是对元素数组的只读包装。
		 * ElementList 允许快速操作多个节点。
		 * ElementList 的实例一旦创建，则不允许修改其成员。
		 */
		ElementList = namespace(".ElementList", Array.extend({
	
			/**
			 * 初始化   ElementList  实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
			constructor: function (doms) {
	
				assert(doms && doms.length !== undefined, 'ElementList.prototype.constructor(doms): 参数 {doms} 必须是一个 NodeList 或 Array 类型的变量。', doms);
				
				var len = this.length = doms.length;
				while(len--)
					this[len] = doms[len];
	
				/// #ifdef SupportIE8
				
				// 检查是否需要为每个成员调用  $ 函数。
				if(!navigator.isStandard)
					o.update(this, p.$);
					
				/// #endif
				
			},
			
			/**
			 * 将参数数组添加到当前集合。
			 * @param {Element/ElementList} value 元素。
			 * @return this
			 */
			concat: function (value) {
				if(value) {
					value = value.length !== undefined ? value : [value];
					for(var i = 0, len = value.length; i < len; i++)
						this.include(value[i]);
				}
				
				return this;
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));
		
	/**
	 * @class Element
	 */
	apply(e, {
		
		/// #ifdef ElementCore
		
		/**
		 * 转换一个HTML字符串到节点。
		 * @param {String/Element} html 字符。
		 * @param {Element} context 生成节点使用的文档中的任何节点。
		 * @param {Boolean} cachable=true 是否缓存。
		 * @return {Element/TextNode/DocumentFragment} 元素。
		 * @static
		 */
		parse: function (html, context, cachable) {

			assert.notNull(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');
			
			if(html.nodeType) return html;
			
			if(html.dom) return html.dom;

			var div = cache[html];
			
			context = context && context.ownerDocument || document;
			
			assert(context.createElement, 'Element.parse(html, context, cachable): 参数 {context} 必须是 DOM 节点。', context);

			if (div && div.ownerDocument === context) {
				
				// 复制并返回节点的副本。
				div = div.cloneNode(true);
				
			} else {

				// 过滤空格  // 修正   XHTML
				var tag = rTagName.exec(html);

				if (tag) {
					
					assert.isString(html, 'Element.parse(html, context, cachable): 参数 {html} ~。');

					div = context.createElement("div");

					var wrap = wrapMap[tag[1].toLowerCase()] || wrapMap.$default;

					div.innerHTML = wrap[1] + html.trim().replace(rXhtmlTag, "<$1></$2>") + wrap[2];

					// 转到正确的深度
					for (tag = wrap[0]; tag--;)
						div = div.lastChild;

					// 一般使用最后的节点， 如果存在最后的节点，使用父节点。
					// 如果有多节点，则复制到片段对象。
					if(div.lastChild !== div.firstChild) {
						context = context.createDocumentFragment();
						
						while(div.firstChild)
							context.appendChild(p.$(div.firstChild));

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
				
				if(cachable !== undefined ? cachable : !rNoClone.test(html)) {
					cache[html] = div.cloneNode(true);
					
					//  特殊属性复制。
					//if (html = e.properties[div.tagName])
					//	cache[html][html] = div[html];
				}

			}
			
			return div;

		},
		
		/// #endif
		
		/// #ifdef ElementNode
			
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
		hasChild: div.compareDocumentPosition ? function (elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			return !!(elem.compareDocumentPosition(child) & 16);
		} : function (elem, child) {
			assert.isNode(elem, "Element.hasChild(elem, child): 参数 {elem} ~。");
			assert.isNode(child, "Element.hasChild(elem, child): 参数 {child} ~。");
			while(child = child.parentNode)
				if(elem === child)
					return true;
					
			return false;
		},
	
		/**
		 * 特殊属性集合。
		 * @type Object
		 * 特殊的属性，在节点复制时不会被复制，因此需要额外复制这些属性内容。
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
		treeWalkers: {
	
			// 全部子节点。
			all: 'all' in div ? function (elem, fn) { // 返回数组
				assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
				var r = new ElementList([]);
				ap.forEach.call(elem.all, function(elem){
					if(fn(elem))
						r.push(elem);
				});
				return  r;
			} : function (elem, fn) {
				assert.isFunction(fn, "Element.prototype.get('all', args): 参数 {args} ~。");
				var r = new ElementList([]), doms = [elem];
				while (elem = doms.pop()) {
					for(elem = elem.firstChild; elem; elem = elem.nextSibling)
						if (elem.nodeType === 1) {
							if (fn(elem))
								r.push(elem);
							doms.push(elem);
						}
				}
				
				return r;
			},
	
			// 上级节点。
			parent: createTreeWalker(true, 'parentNode'),
	
			// 第一个节点。
			first: createTreeWalker(true, 'nextSibling', 'firstChild'),
	
			// 后面的节点。
			next: createTreeWalker(true, 'nextSibling'),
	
			// 前面的节点。
			previous: createTreeWalker(true, 'previousSibling'),
	
			// 最后的节点。
			last: createTreeWalker(true, 'previousSibling', 'lastChild'),
			
			// 全部子节点。
			children: createTreeWalker(false, 'nextSibling', 'firstChild'),
			
			// 最相邻的节点。
			closest: function(elem, args){
				assert.isFunction(args, "Element.prototype.get('closest', args): 参数 {args} 必须是函数");
				return args(this) ? this : this.parent(elem, args);
			},
	
			// 全部上级节点。
			parents: createTreeWalker(false, 'parentNode'),
	
			// 后面的节点。
			nexts: createTreeWalker(false, 'nextSibling'),
	
			// 前面的节点。
			previouses: createTreeWalker(false, 'previousSibling'),
	
			// 奇数个。
			odd: function(elem, args){
				return this.even(elem, !args);
			},
			
			// 偶数个。
			even: function (elem, args) {
				return this.children(elem, function (elem) {
					return args = !args;
				});
			},
	
			// 兄弟节点。
			siblings: function(elem, args){
				var p = this.previouses(elem, args);
				p.push.apply(p, this.nexts(elem, args));
				return p;
			},
			
			// 号次。
			index: function (elem) {
				var i = 0;
				while(elem = elem.previousSibling)
					if(elem.nodeType === 1)
						i++;
				return i;
			},
			
			// 偏移父位置。
			offsetParent: function (elem) {
				while ( (elem = elem.offsetParent) && !isBody(elem) && checkPosition(elem, "static") );
				return p.$(elem || getDocument(elem).body);
			}
	
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
			assert(type in e.sizeMap, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");

			// 缓存 currentStyle 可以大大增加标准浏览器执行速度， 因此这里冗余代码。
			var value = 0, map = e.sizeMap[type], i = names.length, val, currentStyle = elem.ownerDocument.defaultView.getComputedStyle(elem, null);
			while(i--) {
				val = map[names.charAt(i)];
				value += (parseFloat(currentStyle[val[0]]) || 0) + (parseFloat(currentStyle[val[1]]) || 0);
			}

			return value;
		} : function (elem, type, names) {


			assert.isElement(elem, "Element.getSizes(elem, type, names): 参数 {elem} ~。");
			assert(type in e.sizeMap, "Element.getSizes(elem, type, names): 参数 {type} 必须是 \"x\" 或 \"y\"。", type);
			assert.isString(names, "Element.getSizes(elem, type, names): 参数 {names} ~。");

			var value = 0, map = e.sizeMap[type], i = names.length, val;
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
		sizeMap: {},
		
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
		show: function (elem) {
			
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
		hide: function (elem) {
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
		getAttr: function (elem, name) {

			assert.isNode(elem, "Element.getAttr(elem, name): 参数 {elem} ~。");
			
			// if(navigator.isSafari && name === 'selected' && elem.parentNode) { elem.parentNode.selectIndex; if(elem.parentNode.parentNode) elem.parentNode.parentNode.selectIndex; }
			
			var fix = attributes[name];
			
			// 如果是特殊属性，直接返回Property。
			if (fix) {
				
				if(fix.get)
					return fix.get(elem, name);
					
				assert(!elem[fix] || !elem[fix].nodeType, "Element.getAttr(elem, name): 表单内不能存在 {name} 的元素。", name);

				// 如果 这个属性是自定义属性。
				if(fix in elem)
					return elem[fix];
			}
			
			assert(elem.getAttributeNode, "Element.getAttr(elem, name): 参数 {elem} 不支持 getAttribute。", elem);

			// 获取属性节点，避免 IE 返回属性。
			fix = elem.getAttributeNode(name);
			
			// 如果不存在节点， name 为  null ，如果不存在节点值， 返回     null。
			return fix && (fix.value || null);

		},

		/**
		 * 检查是否含指定类名。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (elem, className) {
			assert.isNode(elem, "Element.hasClass(elem, className): 参数 {elem} ~。");
			assert(className && (!className.indexOf || !/[\s\r\n]/.test(className)), "Element.hasClass(elem, className): 参数 {className} 不能空，且不允许有空格和换行。");
			return (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function (elem, styles) {
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			var r = {};
			for(var style in styles) {
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * 设置指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 */
		setStyles: function (elem, styles) {
			assert.isElement(elem, "Element.getStyles(elem, styles): 参数 {elem} ~。");

			apply(elem.style, styles);
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function (elem) {
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
		 * 所谓的扩展，即一个类所需要的函数。
		 *
		 *
		 * DOM 方法 有 以下种
		 *
		 *  1,   其它    setText - 执行结果返回 this， 返回 this 。(默认)
		 *  2  getText - 执行结果是数据，返回结果数组。 
		 *  3  getElementById - 执行结果是DOM 或 ElementList，返回  ElementList 包装。
		 *  4   hasClass - 只要有一个返回等于 true 的值， 就返回这个值。
		 * 
		 *
		 *  参数 copyIf 仅内部使用。
		 */
		implement: function (members, listType, copyIf) {

			assert.notNull(members, "Element.implement" + (copyIf ? 'If' : '') + "(members, listType): 参数 {members} ~。");
			
			Object.each(members, function (value, func) {
				
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(!copyIf || !cls[func]) {
						
						if(!i) {
							switch (listType) {
								case 2:  //   return array
									value = function () {
										return this.invoke(func, arguments);
									};
									break;
									
								case 3:  //  return ElementList
									value = function () {
										var args = arguments, r = new ElementList([]);
										this.forEach(function (node) {
											r.concat(node[func].apply(node, args));
										});
										return r;
			
									};
									break;
								case 4: // return if true
									value = function () {
										var me = this, i = -1, item = null;
										while (++i < me.length && !item)
											item = me[i][func].apply(me[i], arguments);
										return item;
									};
									break;
								default:  // return  this
									value = function () {
										var me = this, len = me.length, i = -1;
										while (++i < len)
											me[i][func].apply(me[i], arguments);
										return this;
									};
									
							}
						}
						
						cls[func] = value;
					}
				}
				
				
				
				
			}, [ElementList, p.Document, e, Control]);
			
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
		 * @param {Number} listType = 1 说明如何复制到 ElementList 实例。
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
		 * 			这个函数提供一键定义依赖: JPlus.defineEvents('ctrlenter', 'keyup', function (e) { (判断事件) })
		 * 		</p>
		 * </li>
		 *
		 * @example
		 * <code>
		 *
		 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  在 FF 下用   mousewheel
		 * 替换   DOMMouseScroll 。
		 *
		 * Element.defineEvents('mouseenter', 'mouseover', function (e) {
		 * 	  if( !isMouseEnter(e) )   // mouseenter  是基于 mouseover 实现的事件，  因此在 不是
		 * mouseenter 时候 取消事件。
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function (events, baseEvent, initEvent) {
			
			var ee = p.Events.element;
			
			if(Object.isObject(events)) {
				p.Object.addEvents.call(this, events);
				return this;
			}
			
			assert.isString(events, "Element.addEvents(events, baseEvent, initEvent): 参数 {events} ~或对象。");
			
			// 删除已经创建的事件。
			delete ee[events];
			
			assert(!initEvent || ee[baseEvent], "Element.addEvents(events, baseEvent, initEvent): 不存在基础事件 {baseEvent}。");
	
			// 对每个事件执行定义。
			String.map(events, Function.from(Function.isFunction(baseEvent) ? o.extendIf({
	
				initEvent: baseEvent
	
			}, ee.$default) : {
	
				initEvent: initEvent ? function (e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
	
				//  如果存在 baseEvent，定义别名， 否则使用默认函数。
				add: function (elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
	
				remove: function (elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
	
			}), ee);
	
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
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this
		 * this.appendTo(elem)  相当于 elem.appendChild(this) 。
		 */
		appendTo: function (elem) {
			
			// 切换到节点。
			elem = elem && elem !== true ? p.$(elem) : document.body;

			assert(elem && elem.appendChild, 'Element.prototype.appendTo(elem): 参数 {elem} 必须是 DOM 节点或控件。', elem);
			
			// 插入节点
			elem.appendChild(this.dom || this);

			// 返回
			return this;
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/Undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function (child) {
			var me = this.dom || this;
			assert(!child || this.hasChild(child.dom || child), 'Element.prototype.remove(child): 参数 {child} 不是当前节点的子节点', child);
			
			// 如果指明 child ,则删除 这个子节点， 否则删除自己。
			child ? this.removeChild(child.dom || child) : ( me.parentNode && me.parentNode.removeChild(me) );
			return this;
		},

		/**
		 * 删除一个节点的所有子节点。
		 * @return {Element} this
		 */
		empty: function () {
			var me = this.dom || this;
			o.each(me.getElementsByTagName("*"), clean);
			while(me.lastChild)
				me.removeChild(me.lastChild);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 */
		dispose: function () {
			clean(this.dom || this);
			this.empty().remove();
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute

		/**
		 * 设置内容样式。
		 * @param {String} name CSS 属性名或 CSS 字符串。
		 * @param {String/Number} [value] CSS属性值， 数字如果不加单位，则自动转为像素。
		 * @return {Element} this
		 * setStyle('cssText') 不被支持，需要使用 name， value 来设置样式。
		 */
		setStyle: function (name, value) {

			assert.isString(name, "Element.prototype.setStyle(name, value): 参数 {name} ~。");
			
			// 获取样式
			var me = this;

			//没有键  返回  cssText
			if(name in styles) {
				
				// setHeight  setWidth   setOpacity
				return me[styles[name]](value);

			} else {
				name = name.replace(rStyle, formatStyle);
				
				assert(value || !isNaN(value), "Element.prototype.setStyle(name, value): 参数 {value} 不是正确的属性值。", value);

				//如果值是函数，运行。
				if (typeof value === "number" && !(name in e.styleNumbers))
					value += "px";
				
			}

			// 指定值。
			(me.dom || me).style[name] = value;

			return me;
		},

		/// #ifdef SupportIE8

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: 'opacity' in div.style ? function (value) {

			assert(value <= 1 && value >= 0, 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);

			//  标准浏览器使用   opacity
			(this.dom || this).style.opacity = value;
			return this;

		} : function (value) {

			var elem = this.dom || this, 
				style = elem.style;

			assert(!+value || (value <= 1 && value >= 0), 'Element.prototype.setOpacity(value): 参数 {value} 必须在 0~1 间。', value);
			
			if(value)
				value *= 100;
			
			value = value || value === 0 ? 'opacity=' + value : '';
			
			// 获取真实的滤镜。
			elem = styleString(elem, 'filter');
			
			assert(!/alpha\([^)]*\)/i.test(elem) || rOpacity.test(elem), 'Element.prototype.setOpacity(value): 当前元素的 {filter} CSS属性存在不属于 alpha 的 opacity， 将导致 setOpacity 不能正常工作。', me);
			
			// 当元素未布局，IE会设置失败，强制使生效。
			style.zoom = 1;

			// 设置值。
			style.filter = rOpacity.test(elem) ? elem.replace(rOpacity, value) : (elem + ' alpha(' + value + ')');
			
			return this;

		},

		/// #else

		/// setOpacity: function (value) {
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
		setAttr: function (name, value) {

			var elem = this.dom || this;
			
			/// #ifdef SupportIE6

			assert(name !== 'type' || elem.tagName !== "INPUT" || !elem.parentNode, "Element.prototype.setAttr(name, type): 无法修改此元素的 type 属性。");

			/// #endif

			// 如果是节点具有的属性。
			if (name in attributes) {
				
				if(attributes[name].set)
					attributes[name].set(elem, name, value);
				else {
					
					assert(elem.tagName !== 'FORM' || name !== 'className' || typeof me.className === 'string', "Element.prototype.setAttr(name, type): 表单内不能存在 name='className' 的节点。");
	
					elem[attributes[name]] = value;
				
				}
				
			} else if (value === null){
				
				assert(elem.removeAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 removeAttributeNode 方法");
				
				if(value = elem.getAttributeNode(name)) {
					value.nodeValue = '';
					elem.removeAttributeNode(value);
				}
			
			} else {
				
				assert(elem.getAttributeNode, "Element.prototype.setAttr(name, type): 当前元素不存在 getAttributeNode 方法");

				var node = elem.getAttributeNode(name);
				
				if(node)
					node.nodeValue = value;
				else
					elem.setAttribute(name, value);
				
			}

			return this;

		},

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function (name, value) {

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
				else
					me.setAttr(name, value);

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
		addClass: function (className) {
			var elem = this.dom || this;
			
			assert(className && !/[\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。");
			
			elem.className = elem.className ? elem.className + ' ' + className : className;
			
			return this;
		},

		/**
		 * 删除类名。
		 * @param {String} className 类名。
		 * @return {Element} this
		 */
		removeClass: function (className) {
			var elem = this.dom || this;
			
			assert(!className || !/[\s\r\n]/.test(className), "Element.prototype.addClass(className): 参数 {className} 不能空，且不允许有空格和换行。");
			
			elem.className = className != null ? elem.className.replace(new RegExp('\\b' + className + '\\b\\s*', "g"), '') : '';
			
			return this;
		},

		/**
		 * 切换类名。
		 * @param {String} className 类名。
		 * @param {Boolean} [toggle] 自定义切换的方式。如果为 true， 则加上类名，否则删除。
		 * @return {Element} this
		 */
		toggleClass: function (className, toggle) {
			return (toggle !== undefined ? !toggle : this.hasClass(className)) ? this.removeClass(className) : this.addClass(className);
		},

		/**
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function (value) {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
					if(elem.type === 'select-multiple' && value != null) {
						
						assert.isString(value, "Element.prototype.setText(value): 参数  {value} ~。");
					
						value = value.split(',');
						o.each(elem.options, function (e) {
							e.selected = value.indexOf(e.value) > -1;
						});
						
						break;

					}

				//  继续执行
				case "INPUT":
				case "TEXTAREA":
					elem.value = value;
					break;
				default:
					elem[attributes.innerText] = value;
			}
			return  this;
		},

		/**
		 * 设置 HTML 。
		 * @param {String} value 值。
		 * @return {Element} this
		 */
		setHtml: function (value) {

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
		show: function (duration, callBack) {
			
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
		hide: function (duration, callBack) {

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
		toggle: function (duration, callBack, type, flag) {
			return this[(flag === undefined ? this.isHidden() : flag) ? 'show' : 'hide']  (duration, callBack, type);
		},

		/**
		 * 设置元素不可选。
		 * @param {Boolean} value 是否可选。
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function (value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function (value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function (value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * 将元素引到最前。
		 * @param {Element} [elem] 参考元素。
		 * @return this
		 */
		bringToFront: function (elem) {
			
			assert(!elem || (elem.dom  && elem.dom.style) || elem.style, "Element.prototype.bringToFront(elem): 参数 {elem} 必须为 元素或为空。", elem);
			
			var thisElem = this.dom || this,
				targetZIndex = elem && (parseInt(styleString(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;
			
			// 如果当前元素的 z-index 未超过目标值，则设置
			if(!(styleString(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
			
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
		setSize: function (x, y) {
			return setSize(this, 'pb', x, y);
		},

		/**
		 * 改变大小。
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setOuterSize: function (x, y) {
			return setSize(this, 'mpb', x, y);
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setWidth: function (value) {

			(this.dom || this).style.width = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setHeight: function (value) {

			(this.dom || this).style.height = value > 0 ? value + 'px' : value <= 0 ? '0px' : value;
			return this;
		},

		/**
		 * 滚到。
		 * @param {Element} dom
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Element} this
		 */
		setScroll: function (x, y) {
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
		setOffset: function (p) {

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
		setPosition: function (x, y) {
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
	
	.implement({

		/// #ifdef ElementAttribute

		/**
		 * 获取节点样式。
		 * @param {String} key 键。
		 * @param {String} value 值。
		 * @return {String} 样式。
		 * getStyle() 不被支持，需要使用 name 来设置样式。
		 */
		getStyle: function (name) {

			assert.isString(name, "Element.prototypgetStyle(name): 参数 {name} ~。");

			var me = this.dom || this;

			return me.style[name = name.replace(rStyle, formatStyle)] || getStyle(me, name);

		},

		/// #ifdef SupportIE8

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: 'opacity' in div.style ? function () {
			return styleNumber(this.dom || this, 'opacity');
		} : function () {
			return rOpacity.test(styleString(this.dom || this, 'filter')) ? parseInt(RegExp.$1) / 100 : 1;
		},

		/// #else
		///
		/// getOpacity: function () {
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
		getAttr: function (name) {
			return e.getAttr(this.dom || this, name);
		},

		/**
		 * 检查是否含指定类名。
		 * @param {String} className
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (className) {
			return e.hasClass(this.dom || this, className);
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function () {
			var me = this.dom || this;

			switch(me.tagName) {
				case "SELECT":
					if(me.type != 'select-one') {
						var r = [];
						o.each(me.options, function (s) {
							if(s.selected && s.value)
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
		getHtml: function () {

			return (this.dom || this).innerHTML;
		},
	
		/// #ifdef ElementDimension

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var me = this.dom || this;

			return new Point(me.offsetWidth, me.offsetHeight);
		},

		/**
		 * 获取元素可视区域大小。包括 margin 大小。
		 * @return {Point} 位置。
		 */
		getOuterSize: function () {
			var me = this.dom || this;
			return this.getSize().add(e.getSizes(me, 'x', 'm'), e.getSizes(me, 'y', 'm'));
		},

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function () {

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
		getWidth: function () {
			return styleNumber(this.dom || this, 'width');
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @return {Point} 位置。
		 */
		getHeight: function () {
			return styleNumber(this.dom || this, 'height');
		},

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: div.getBoundingClientRect   ? function () {

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
		} : function () {

			var me = this.dom || this,
				elem = me,
				p = getScrolls(elem);

			while (elem && !isBody(elem)) {
				p.add(elem.offsetLeft, elem.offsetTop);
				if (navigator.isFirefox) {
					if (styleString(elem, 'MozBoxSizing') != 'border-box') {
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
			if (navigator.isFirefox && styleString(elem, 'MozBoxSizing') != 'border-box') {
				p.add(-styleNumber(me, 'borderLeftWidth'), -styleNumber(me, 'borderTopWidth'));
			}
			
			function add(elem) {
				p.add(styleNumber(elem, 'borderLeftWidth'),  styleNumber(elem, 'borderTopWidth'));
			}
			return p;
		},

		/**
		 * 获取包括滚动位置的位置。
		 * @param {Element/String/Boolean} relative 相对的节点。
		 * @return {Point} 位置。
		 */
		getOffsets: function ( relative) {
			var pos, me = this.dom || this;
			if (isBody(me))
				return new Point(0, 0);
			pos = this.getPosition().minus(getScrolls(me));
			if(relative) {
				
				relative = relative.dom || p.$(relative);

				assert.isElement(relative, "Element.prototype.getOffsets(relative): 参数 {relative} ~。");

				pos.minus(relative.getOffsets()).add( -styleNumber(me, 'marginLeft') - styleNumber(relative, 'borderLeftWidth') ,-styleNumber(me, 'marginTop') - styleNumber(relative,  'borderTopWidth') );
			}
			return pos;
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var me = this.dom || this;

			return new Point(me.scrollWidth, me.scrollHeight);
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll:  function () {
			var me = this.dom || this;
			return new Point(me.scrollLeft, me.scrollTop);
		}

		/// #endif
		
	}, 2)
	
	.implementIf({
		
		/// #ifdef ElementNode

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [swhere] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: 'insertAdjacentElement' in div ? function (html, swhere) {
			var me = this.dom || this;
			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数  {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			if(typeof html === 'string')
				me.insertAdjacentHTML(swhere, html);
			else
				me.insertAdjacentElement(swhere, html.dom || html);
			
			return p.$(me[{
				afterEnd: 'nextSibling',
				beforeBegin: 'previousSibling',
				afterBegin: 'firstChild'
			}[swhere] || 'lastChild']);
			
		} : function (html, swhere) {

			var me = this.dom || this;

			assert.isNode(me, "Element.prototype.insert(html, swhere): this.dom || this 返回的必须是 DOM 节点。");
			assert(!swhere || 'afterEnd beforeBegin afterBegin beforeEnd '.indexOf(swhere + ' ') != -1, "Element.prototype.insert(html, swhere): 参数 {swhere} 必须是 beforeBegin、beforeEnd、afterBegin 或 afterEnd 。", swhere);
			html = e.parse(html, me);

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
		append: function (html) {
			
			// this.appendChild 肯能不是原生的
			return this.appendChild(e.parse(html, this.dom || this));
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
		replaceWith: function (html) {
			var elem = this.dom || this;
			
			html = e.parse(html, elem);
			assert.isNode(html, "Element.prototype.replaceWith(html, escape): 参数 {html} ~或 html片段。");
			elem.parentNode && elem.parentNode.replaceChild(html, me);
			return html;
		},
	
		/// #endif
		
		/// #ifdef ElementNode

		/// #ifdef SupportIE6

		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: div.querySelectorAll ? function (selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			return new ElementList((this.dom || this).querySelectorAll(selecter));
		} : function (selecter) {
			assert.isString(selecter, "Element.prototype.findAll(selecter): 参数 {selecter} ~。");
			var current = new ElementList([this.dom || this]);
			selecter.split(' ').forEach( function (v) {
				current = findBy(current, v);
			});

			return current;
		},

		/// #else

		/// findAll: div.querySelectorAll,

		/// #endif

		/**
		 * 获得相匹配的节点。
		 * @param {String/Function/Number} treeWalker 遍历函数，该函数在 {#link Element.treeWalkers} 指定。
		 * @param {Object} [args] 传递给遍历函数的参数。
		 * @return {Element} 元素。
		 */
		get: function (treeWalker, args) {

			switch (typeof treeWalker) {
				case 'string':
					break;
				case 'function':
					args = treeWalker;
					treeWalker = 'all';
					break;
				case 'number':
					if(treeWalker < 0) {
						args = -treeWalker;
						treeWalker = 'last';
					} else {
						args = treeWalker;
						treeWalker = 'first';
					}
					
			}
			
			assert(Function.isFunction(e.treeWalkers[treeWalker]), 'Element.prototype.get(treeWalker, args): 不支持 {treeWalker}类型 的节点关联。', treeWalker);
			return e.treeWalkers[treeWalker](this.dom || this, args);
		},
		
		/**
		 * 复制节点。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
		clone: function (cloneEvent, contents, keepId) {

			assert.isElement(this, "Element.prototype.clone(cloneEvent, contents, keepid): this 必须是 nodeType = 1 的 DOM 节点。");
			
			var elem = this,
				clone = elem.cloneNode(contents = contents !== false);

			if (contents)
				for (var elemChild = elem.getElementsByTagName('*'), cloneChild = clone.getElementsByTagName('*'), i = elemChild.length; i--;)
					cleanClone(elemChild[i], cloneChild[i], cloneEvent, keepId);

			cleanClone(elem, clone, cloneEvent, keepId);

			return clone;
		},
		
		/// #endif
		
		/**
		 * xType
		 * @type String
		 */
		xType: "element"

	}, 3)
	
	.implement({
		
		/// #ifdef ElementNode

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function (child) {
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
		hasChild: function (child) {
			var me = this.dom || this;
			return child ? e.hasChild(me, child.dom || child) : me.firstChild !== null;
		},
		
		/// #endif

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function () {
			var me = this.dom || this;

			return (me.style.display || getStyle(me, 'display')) === 'none';
		},
		
		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: div.querySelector ? function (selecter) {
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			return (this.dom || this).querySelector(selecter);
		} : function (selecter) {
			var current = this.dom || this;
			assert.isString(selecter, "Element.prototype.find(selecter): 参数 {selecter} ~。");
			if(selecter.split(' ').each(function (v) {
				return !!(current = findBy(current, v)[0]);
			}))
				return p.$(current);
		}
		
	}, 4);
		
	/// #ifdef ElementDimension
	
	/**
	 * 获取滚动条已滚动的大小。
	 * @return {Point} 位置。
	 */
	var getWindowScroll = 'pageXOffset' in window ? function () {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;
		
	/// #endif
	
	/**
	 * @class Document
	 */
	p.Native(p.Document).implement({
		
		/// #ifdef ElementCore

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function (tagName, className) {
			
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
		getSize: function () {
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
		getScrollSize: function () {
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
		setScroll: function (x, y) {
			var p = adaptXY(x,y, this, 'getScroll');

			this.defaultView.scrollTo(p.x, p.y);

			return this;
		},
		
		/// #endif

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			return $(this.body).append(html);
		},
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function () {
			return arguments.length === 1 ? p.$(this.getElementById(arguments[0])) :  new ElementList(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	apply(Control, {
		
		/**
		 * 基类。
		 */
		base: e,
		
		/**
		 * 将指定名字的方法委托到当前对象指定的成员。
		 * @param {Object} control 类。
		 * @param {String} delegate 委托变量。
		 * @param {String} methods 所有成员名。
		 * @param {Number} type 类型。 1 - 返回本身 2 - 返回委托返回 3 - 返回自己，参数作为控件。 
		 * @param {String} [methods2] 成员。
		 * @param {String} [type2] 类型。
		 * 由于一个控件本质上是对 DOM 的封装， 因此经常需要将一个函数转换为对节点的调用。
		 */
		delegate: function(control, target, methods, type, methods2, type2) {
			
			if (methods2) 
				arguments.callee(control, target, methods2, type2);
			
			assert(control && control.prototype, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {control} 必须是一个类", control);
			assert.isNumber(type, "Control.delegate(control, target, methods, type, methods2, type2): 参数 {type} ~。");
			
			String.map(methods, function(func) {
				switch (type) {
					case 2:
						return function() {
							var me = this[target];
							return me[func].apply(me, arguments);
						};
					case 3:
						return function(control1, control2) {
							return this[target][func](control1 && control1.dom || control1, control2 ? control2.dom || control2 : null);
						};
					default:
						return function() {
							var me = this[target];
							me[func].apply(me, arguments);
							return this;
						};
				}
			}, control.prototype);
			
			return arguments.callee;
		}
		
	});
	
	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);
	
	assert.isNode(document.documentElement, "在 element.js 执行时，必须存在 document.documentElement 属性。请确认浏览器为标准浏览器， 且未使用  Quirks 模式。");
	
	/// #ifdef ElementCore
	
	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	/// #endif
		
	/// #ifdef ElementNode
	
	String.map('checked disabled selected', function (treeWalker) {
		return function(elem, args){
			args = args !== false;
			return this.children(elem, function (elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);
	
	/// #endif
	
	/**
	 * 获取节点本身。
	 */
	document.dom = document.documentElement;
	
	/// #ifdef SupportIE8

	if (navigator.isStandard) {

	/// #endif
		
		/// #ifdef ElementEvent
		
		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function (e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};
		
		/// #endif

	/// #ifdef SupportIE8
		
	} else {
		
		ep.$version = 1;
		
		p.$ = function (id) {
			
			var dom = getElementById(id);
	
			if(dom && dom.$version !== ep.$version) {
				o.extendIf(dom, ep);
			}
	
			return dom;
			
		};
		
		/**s
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function (e) {
			if(!e.stop) {
				e.target = p.$(e.srcElement);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				//  1 ： 单击  2 ：  中键点击 3 ： 右击
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
	
		e.properties.OBJECT = 'outerHTML';

		try {
	
			//  修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
	
		/// #endif
		
	}
	
	/// #endif
		
	/// #ifdef ElementEvent
	
	/**
	 * 默认事件。
	 * @type Object
	 * @hide
	 */
	namespace("JPlus.Events.element.$default", {

		/**
		 * 创建当前事件可用的参数。
		 * @param {Object} elem 对象。
		 * @param {Event} e 事件参数。
		 * @param {Object} target 事件目标。
		 * @return {Event} e 事件参数。
		 */
		trigger: function (elem, type, fn, e) {
			return fn(e = new p.Event(elem, type, e)) && (!elem[type = 'on' + type] || elem[type](e) !== false);
		},

		/**
		 * 事件触发后对参数进行处理。
		 * @param {Event} e 事件参数。
		 */
		initEvent: Function.empty,

		/**
		 * 添加绑定事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		add: function (elem, type, fn) {
			elem.addEventListener(type, fn, false);
		},

		/**
		 * 删除事件。
		 * @param {Object} elem 对象。
		 * @param {String} type 类型。
		 * @param {Function} fn 函数。
		 */
		remove: function (elem, type, fn) {
			elem.removeEventListener(type, fn, false);
		}

	});

	e.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
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
	
	String.map('x y', function (c, i) {
		c = e.sizeMap[c] = {};
		var tx = i ? ['Top', 'Bottom'] : ['Left', 'Right'];
		c.d = tx.invoke('toLowerCase', []);
		String.map('padding~ margin~ border~Width', function (v) {
			c[v.charAt(0)] = [v.replace('~', tx[0]), v.replace('~', tx[1])];
		});
	});
	
	//  下列属性应该直接使用。
	String.map("checked selected disabled value innerHTML textContent className autofocus autoplay async controls hidden loop open required scoped compact nowrap ismap declare noshade multiple noresize defer readOnly tabIndex defaultValue accessKey defaultChecked cellPadding cellSpacing rowSpan colSpan frameBorder maxLength useMap contentEditable", function (value) {
		attributes[value.toLowerCase()] = attributes[value] = value;
	});
	
	if(!navigator.isStandard){
		
		attributes.style = {
			
			get: function (elem, name) {
				return elem.style.cssText.toLowerCase();
			},
			
			set: function(elem, name, value) {
				elem.style.cssText = value;
			}
			
		};
		
		if(navigator.isQuirks) {
		
			attributes.value = {
				
				node: function(elem, name) {
					assert(elem.getAttributeNode, "Element.prototype.getAttr(name, type): 当前元素不存在 getAttributeNode 方法");
					return elem.tagName === 'BUTTON' ? elem.getAttributeNode(name) || {value: ''} : elem;
				},
				
				get: function (elem, name) {
					return this.node(elem, name).value;
				},
				
				set: function(elem, name, value) {
					this.node(elem, name).value = value || '';
				}
				
			};
		
			attributes.href = attributes.src = attributes.usemap = {
				
				get: function (elem, name) {
					return elem.getAttribute(name, 2);
				},
				
				set: function(elem, name, value) {
					elem.setAttribute(name, value);
				}
				
			};
			
		}
		
	}
	
	if(!('opacity' in div.style)) {
		styles.opacity = 'setOpacity';
	}
	
	/// #endif
	
	/// #ifdef ElementReady
		
	String.map('Ready Load', function (ReadyOrLoad, isLoad) {
	
		var readyOrLoad = ReadyOrLoad.toLowerCase(),
			isReadyOrLoad = isLoad ? 'isReady' : 'isLoaded';
			
		//  设置 onReady  Load
		document['on' + ReadyOrLoad] = function (fn) {
			
			// 忽略参数不是函数的调用。
			if(!Function.isFunction(fn))
				fn = 0;
			
			// 如果已载入，则直接执行参数。
			if(document[isReadyOrLoad]) {
				
				if(fn) fn.call(document);
			
			// 如果参数是函数。
			} else if(fn) {
				
				document.on(readyOrLoad, fn);
			
			// 触发事件。
			// 如果存在 JS 之后的 CSS 文件， 肯能导致 document.body 为空，此时延时执行 DomReady
			} else if(document.body) {
				
				// 如果 isReady, 则删除
				if(isLoad) {
					
					// 使用系统文档完成事件。
					fn = [window, readyOrLoad];
					
					// 确保  ready 触发。
					document.onReady();
					
				} else {
					
					fn = [document, domReady];
				}
				
				fn[0].removeEventListener(fn[1], arguments.callee, false);
				
				// 触发事件。
				if(document.trigger(readyOrLoad)) {
				
					// 先设置为已经执行。
					document[isReadyOrLoad] = true;
					
					// 删除事件。
					document.un(readyOrLoad);
					
				}
			} else {
				setTimeout(arguments.callee, 1);
			}
			
			return document;
		};
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
		document.addEventListener(domReady, document.onReady, false);
	
		window.addEventListener('load', document.onLoad, false);
		
		/// #ifdef SupportIE8
		
		// 只对 IE 检查。
		if (!navigator.isStandard) {
		
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
				
					document.onReady();
				})();
			}
		}
		
		/// #endif
		
	} else {
		setTimeout(document.onLoad, 1);
	}
	
	/// #endif
	
	String.map("$ Element Document", p, window, true);

	//       String.map("invoke each indexOf forEach push unshift pop shift include unique", ap, ElementList.prototype);

	String.map("filter slice splice", function(func){
		return function(){
			return new ElementList(ap[func].apply(this, arguments));
		};
	}, ElementList.prototype);
	
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
		assert(elem && (elem.nodeType || elem.setInterval), 'Element.getDocument(elem): 参数 {elem} 必须是节点。' , elem);
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementNode
	
	/**
	 * 返回简单的遍历函数。
	 * @param {Boolean} getFirst 返回第一个还是返回所有元素。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(elem, args){
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first];
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					return p.$(node);
				node = node[next];
			}
			return node;
		} : function (elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first],
				r = new ElementList([]);
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}

	/**
	 * 删除由于拷贝导致的杂项。
	 * @param {Element} srcElem 源元素。
	 * @param {Element} destElem 目的元素。
	 * @param {Boolean} cloneEvent=true 是否复制数据。
	 * @param {Boolean} keepId=false 是否留下ID。
	 * @return {Element} 元素。
	 */
	function cleanClone(srcElem, destElem, cloneEvent, keepId) {
		if (!keepId)
			destElem.removeAttribute('id');

		/// #ifdef SupportIE8

		if(destElem.clearAttributes) {
			
			// IE 会复制 自定义事件， 清楚它。
			destElem.clearAttributes();
			destElem.mergeAttributes(srcElem);
			// 在 IE delete destElem.$data  出现异常。
			destElem.removeAttribute("$data");


			if (srcElem.options)
				o.update(srcElem.options, 'selected', destElem.options, true);
		}

		/// #endif

		if (cloneEvent !== false)
			p.cloneEvent(srcElem, destElem);

		//  特殊属性复制。
		if (keepId = e.properties[srcElem.tagName])
			destElem[keepId] = srcElem[keepId];
	}
	
	/**
	 * 清除节点的引用。
	 * @param {Element} elem 要清除的元素。
	 */
	function clean(elem) {
		
		//  删除自定义属性。
		if (elem.clearAttributes)
			elem.clearAttributes();

		// 删除事件。
		p.IEvent.un.call(elem);
		
		// 删除句柄，以删除双重的引用。
		if(elem.$data)
			elem.$data = null;
		
	}

	/**
	 * 执行简单的选择器。
	 * @param {Element} elem 元素。
	 * @param {String} selector 选择器。
	 * @return {JPlus.ElementList} 元素集合。
	 */
	function findBy(elem, selector) {  return
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
	 * @param {Number/Function/String} args 参数。
	 * @return {Funtion} 函数。
	 */
	function getFilter(args) {
		switch(typeof args) {
			case 'number':
				return function (elem) {
					return --args < 0;
				};
			case 'string':
				args = args.toUpperCase();
				return function (elem) {
					return elem.tagName === args;
				};
		}
		
		assert.isFunction(args, "Element.prototype.get(treeWalker, args): 参数 {fn} 必须是一个函数、空、数字或字符串。", args);
		return args;
	}
	
	/// #endif
	
	/// #ifdef ElementEvent
	
	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发  mouseenter。
	 */
	function checkMouseEnter(event) {
		
		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

		/*var parent = e.relatedTarget;
		while (parent) {
			
			if(parent === this)
				return false;
				
			parent = parent.parentNode;
		}
*/
	}
	
	/// #endif
	
	/// #ifdef ElementAttribute
	
    /**
     * 到骆驼模式。
     * @param {String} all 全部匹配的内容。
     * @param {String} match 匹配的内容。
     * @return {String} 返回的内容。
     */
    function formatStyle(all, match) {
        return match ? match.toUpperCase() : styleFloat;
    }
	
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
			
			if(!value && value !== 0) {
				if(name in styles) {
					var style = e.getStyles(elem, e.display);
					e.setStyles(elem, e.display);
					value = parseFloat(getStyle(elem, name)) || 0;
					e.setStyles(elem, style);
				} else {
					value = 0;
				}
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

	

/**
* "mini" Selector Engine
* https://github.com/jamespadolsey/mini
* Copyright (c) 2009 James Padolsey
* -------------------------------------------------------
* Dual licensed under the MIT and GPL licenses.
* - http://www.opensource.org/licenses/mit-license.php
* - http://www.gnu.org/copyleft/gpl.html
* -------------------------------------------------------
* Version: 0.01 (BETA)
* 
*     * div
    * .example
    * body div
    * div, p
    * div, p, .example
    * div p
    * div > p
    * div.example
    * ul .example
    * #title
    * h1#title
    * div #title
    * ul.foo > * span

*/


var mini = (function(){
    
    var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
        exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
        exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
        exprNodeName = /^([\w\*\-_]+)/,
        na = [null,null];
    
    function _find(selector, context) {
        
        /**
* This is what you call via x()
* Starts everything off...
*/
        
        context = context || document;
        
        var simple = /^[\w\-_#]+$/.test(selector);
        
        if (!simple && context.querySelectorAll) {
            return realArray(context.querySelectorAll(selector));
        }
        
        if (selector.indexOf(',') > -1) {
            var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
            for(; sIndex < len; ++sIndex) {
                ret = ret.concat( _find(split[sIndex], context) );
            }
            return unique(ret);
        }
        
        var parts = selector.match(snack),
            part = parts.pop(),
            id = (part.match(exprId) || na)[1],
            className = !id && (part.match(exprClassName) || na)[1],
            nodeName = !id && (part.match(exprNodeName) || na)[1],
            collection;
            
        if (className && !nodeName && context.getElementsByClassName) {
            
            collection = realArray(context.getElementsByClassName(className));
            
        } else {
            
            collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
            
            if (className) {
                collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
            }
            
            if (id) {
                var byId = context.getElementById(id);
                return byId?[byId]:[];
            }
        }
        
        return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
        
    }
    
    function realArray(c) {
        
        /**
* Transforms a node collection into
* a real array
*/
        
        try {
            return Array.prototype.slice.call(c);
        } catch(e) {
            var ret = [], i = 0, len = c.length;
            for (; i < len; ++i) {
                ret[i] = c[i];
            }
            return ret;
        }
        
    }
    
    function filterParents(selectorParts, collection, direct) {
        
        /**
* This is where the magic happens.
* Parents are stepped through (upwards) to
* see if they comply with the selector.
*/
        
        var parentSelector = selectorParts.pop();
        
        if (parentSelector === '>') {
            return filterParents(selectorParts, collection, true);
        }
        
        var ret = [],
            r = -1,
            id = (parentSelector.match(exprId) || na)[1],
            className = !id && (parentSelector.match(exprClassName) || na)[1],
            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
            cIndex = -1,
            node, parent,
            matches;
            
        nodeName = nodeName && nodeName.toLowerCase();
            
        while ( (node = collection[++cIndex]) ) {
            
            parent = node.parentNode;
            
            do {
                
                matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                matches = matches && (!id || parent.id === id);
                matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                
                if (direct || matches) { break; }
                
            } while ( (parent = parent.parentNode) );
            
            if (matches) {
                ret[++r] = node;
            }
        }
        
        return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
        
    }
    
    
    var unique = (function(){
        
        var uid = +new Date();
                
        var data = (function(){
         
            var n = 1;
         
            return function(elem) {
         
                var cacheIndex = elem[uid],
                    nextCacheIndex = n++;
         
                if(!cacheIndex) {
                    elem[uid] = nextCacheIndex;
                    return true;
                }
         
                return false;
         
            };
         
        })();
        
        return function(arr) {
        
            /**
* Returns a unique array
*/
            
            var length = arr.length,
                ret = [],
                r = -1,
                i = 0,
                item;
                
            for (; i < length; ++i) {
                item = arr[i];
                if (data(item)) {
                    ret[++r] = item;
                }
            }
            
            uid += 1;
            
            return ret;
    
        };
    
    })();
    
    function filterByAttr(collection, attr, regex) {
        
        /**
* Filters a collection by an attribute.
*/
        
        var i = -1, node, r = -1, ret = [];
        
        while ( (node = collection[++i]) ) {
            if (regex.test(node[attr])) {
                ret[++r] = node;
            }
        }
        
        return ret;
    }
    
    return _find;
    
})();
