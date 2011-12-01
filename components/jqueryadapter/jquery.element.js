//===========================================
//  jQuery plugin - J+ Element Adapter
//===========================================

(function ($) {
	
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
		 * String.map 缩写。
		 * @type Object
		 */
		map = String.map,
		
		/**
		 * JPlus 简写。
		 * @namespace JPlus
		 */
		p = JPlus,
		
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
		 * 根据一个 id 获取元素。如果传入的id不是字符串，则直接返回参数。
		 * @param {String/Element/Control} id 要获取元素的 id 或元素。
		 */
		$$ = getElementById,
	
		/// #endif

		/// #ifdef ElementAttribute
	
		/**
		 * 表示事件的表达式。
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/// #endif
	
		/// #ifdef SupportIE8
	
		/**
		 * 获取元素的实际的样式属性。
		 * @param {Element} elem 需要获取属性的节点。
		 * @param {String} name 需要获取的CSS属性名字。
		 * @return {String} 返回样式字符串，肯能是 undefined、 auto 或空字符串。
		 */
		getStyle = $.css,

		/// #if defined(ElementAttribute) || defined(ElementStyle)
	
		/**
		 * 是否属性的正则表达式。
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
	
		/// #endif
		
		/// #ifdef ElementEvent
		
		/**
		 * @class Event
		 * 用来支持自定义事件的事件对象。
		 */
		pep = {
	
			/**
			 * 构造函数。
			 * @param {Object} target 事件对象的目标。
			 * @param {String} type 事件对象的类型。
			 * @param {Object} [e] 事件对象的属性。
			 * @constructor
			 */
			constructor: function (target, type, e) {
				
				var me = this;
				me.target = target;
				me.srcElement = $$(target.dom || target);
				me.type = type;
				apply(me, e);
			},

			/**
			 * 阻止事件的冒泡。
			 * @remark
			 * 默认情况下，事件会向父元素冒泡。使用此函数阻止事件冒泡。
			 */
			stopPropagation : function () {
				this.cancelBubble = true;
			},
					
			/**
			 * 取消默认事件发生。
			 * @remark
			 * 有些事件会有默认行为，如点击链接之后执行跳转，使用此函数阻止这些默认行为。
			 */
			preventDefault : function () {
				this.returnValue = false;
			},
			
			/**
			 * 停止默认事件和冒泡。
			 * @remark
			 * 此函数可以完全撤销事件。
			 * 事件处理函数中 return false 和调用 stop() 是不同的， return false 只会阻止当前事件其它函数执行，
			 * 而 stop() 只阻止事件冒泡和默认事件，不阻止当前事件其它函数。
			 */
			stop: function () {
				this.stopPropagation();
				this.preventDefault();
			}
			
		},
	
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
		
		/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
		
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
			removeEventListener: document.removeEventListener ? function (type, listener) {
			
				//  因为 IE 不支持，所以忽略 第三个参数。
				this.removeEventListener(type, listener, false);
				
			}:function (type, listener) {
			
				// IE8- 使用 detachEvent 。
				this.detachEvent('on' + type, listener);
				
			}
		
		},
		
		/// #endif
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 判断 body 节点的正则表达式。
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i,
		
		/**
		 * 测试是否是绝对位置的正则表达式。
		 * @type RegExp
		 */
		rMovable = /^(?:abs|fix)/,
		
		/**
		 * 获取窗口滚动大小的方法。
		 * @type Function
		 */
		getWindowScroll,
		
		/// #endif
	
		/**
		 * 一个点。
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
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			add: function (p) {
				return new Point(this.x + p.x, this.y + p.y);
			},
	
			/**
			 * 将一个点坐标减到当前值。
			 * @param {Point} p 值。
			 * @return {Point} this
			 */
			sub: function (p) {
				return new Point(this.x - p.x, this.y - p.y);
			}
			
		})),
		
		/**
		 * 文档对象。
		 * @class Document
		 * 文档对象是对原生 HTMLDocument 对象的补充， 因为 IE6/7 不存在这些对象。
		 * 扩展 Document 也会扩展 HTMLDocument。
		 */
		Document = p.Native(document.constructor || {prototype: document}),
		
		/**
		 * 所有控件基类。
		 * @class Control
		 * @abstract
		 * @extends Element
		 * 控件的周期：
		 * constructor  -  创建控件对于的 Javascript 类。 不建议重写，除非你知道你在做什么。
		 * create - 创建本身的 dom 节点。 可重写 - 默认使用  this.tpl 创建。
		 * init - 初始化控件本身。 可重写 - 默认为无操作。
		 * render - 渲染控件到文档。 不建议重写，如果你希望额外操作渲染事件，则重写。
		 * detach - 删除控件。不建议重写，如果一个控件用到多个 dom 内容需重写。
		 */
		Control = namespace(".Control", Class({
			
			/**
			 * 封装的节点。
			 * @type Element
			 */
			dom: null,
			
			/**
			 * xType 。
			 */
			xType: "control",
		
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
				me.dom = dom ? $$(dom) : me.create(opt);
				
				
				// 调用 init 初始化控件。
				me.init(opt);
				
				// 处理样式。
				if('style' in opt) {
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
			 * 创建当前节点的副本，并返回节点的包装。
			 * @param {cloneContent} 是否复制内容 。
		     * @return {Control} 新的控件。
			 */
			cloneNode: function (cloneContent) {
				return new this.constructor(this.dom.cloneNode(cloneContent));
			},
			
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
		ElementList = namespace(".ElementList", 
		
		/// #ifdef SupportIE6
		
		(navigator.isQuirks ? p.Object : Array)
		
		/// #else
		
		/// Array
		
		/// #endif
		
		.extend({
			
			/**
			 * 获取当前集合的元素个数。
			 * @type {Number}
			 * @property
			 */
			length: 0,
	
			/**
			 * 初始化   ElementList  实例。
			 * @param {Array/ElementList} doms 节点集合。
			 * @constructor
			 */
			constructor: function (doms) {
				
				if(doms) {
		
					
					var len = this.length = doms.length;
					while(len--)
						this[len] = doms[len];
		
					/// #ifdef SupportIE8
					
					// 检查是否需要为每个成员调用  $ 函数。
					if(!navigator.isStandard)
						o.update(this, $);
						
					/// #endif
				
				}
				
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
			 * 对每个元素执行 cloneNode, 并返回新的元素的集合。
			 * @param {Boolean} cloneContent 是否复制子元素。
			 * @return {ElementList} 复制后的新元素组成的新集合。
			 */
			cloneNode: function (cloneContent) {
				var i = this.length,
					r = new ElementList();
				while(i--)
					r[i] = this[i].cloneNode(cloneContent);
				return r;
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));
	
	/// #ifdef SupportIE6
	
	if(navigator.isQuirks) {
		map("pop shift", ap, apply(apply(ElementList.prototype, ap), {
			
			push: function() {
				return ap.push.apply(this, o.update(arguments, $));
			},
			
			unshift: function() {
				return ap.unshift.apply(this, o.update(arguments, $));
			}
			
		}));
	}
	
	/// #endif

	map("filter slice splice reverse", function(func) {
		return function() {
			return new ElementList(ap[func].apply(this, arguments));
		};
	}, ElementList.prototype);
	
	/**
	 * 根据 x, y 获取 {x: x y: y} 对象
	 * @param {Number/Point} x
	 * @param {Number} y
	 * @static
	 * @private
	 */
	Point.format = formatPoint;
		
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

			
			// 已经是 Element 或  ElementList。
			if(html.xType)
				return html;
			
			if(html.nodeType)
				return new Control(html);
				
			
			context = context && context.ownerDocument || document;
			
			if(/<\w+/.test(html) ) {

				var div =  $(html, context);
				
				return div.length === 1 ? $$(div[0]) : new ElementList(div);
			
			}
			
			return new Control( context.createTextNode(html));

		},
		
		/// #endif
		
		/// #ifdef ElementManipulation
			
		/**
		 * 判断指定节点之后有无存在子节点。
		 * @param {Element} elem 节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 如果确实存在子节点，则返回 true ， 否则返回 false 。
		 */
		hasChild: div.compareDocumentPosition ? function (elem, child) {
			return !!(elem.compareDocumentPosition(child) & 16);
		} : function (elem, child) {
			while(child = child.parentNode)
				if(elem === child)
					return true;
					
			return false;
		},
		
		/// #endif
		
		/// #ifdef ElementTraversing
		
		/**
		 * 用于 get 的名词对象。
		 * @type String
		 */
		treeWalkers: {
	
			// 全部子节点。
			all: 'all' in div ? function (elem, fn) { // 返回数组
				var r = new ElementList;
				ap.forEach.call(elem.all, function(elem) {
					if(fn(elem))
						r.push(elem);
				});
				return  r;
			} : function (elem, fn) {
				var r = new ElementList, doms = [elem];
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
			closest: function(elem, args) {
				return args(elem) ? elem : this.parent(elem, args);
			},
	
			// 全部上级节点。
			parents: createTreeWalker(false, 'parentNode'),
	
			// 后面的节点。
			nexts: createTreeWalker(false, 'nextSibling'),
	
			// 前面的节点。
			previouses: createTreeWalker(false, 'previousSibling'),
	
			// 奇数个。
			odd: function(elem, args) {
				return this.even(elem, !args);
			},
			
			// 偶数个。
			even: function (elem, args) {
				return this.children(elem, function (elem) {
					return args = !args;
				});
			},
	
			// 兄弟节点。
			siblings: function(elem, args) {
				return this.previouses(elem, args).concat(this.nexts(elem, args));
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
				var me = elem;
				while ( (me = me.offsetParent) && !rBody.test(me.nodeName) && getStyle(me, "position") === "static" );
				return $(me || getDocument(elem).body);
			}
	
		},

		/**
		 * 获取一个节点属性。
		 * @static
		 * @param {Element} elem 元素。
		 * @param {String} name 名字。
		 * @return {String} 属性。
		 */
		getAttr: $.attr,

		/**
		 * 检查是否含指定类名。
		 * @param {Element} elem 元素。
		 * @param {String} className 类名。
		 * @return {Boolean} 如果存在返回 true。
		 */
		hasClass: function (elem, className) {
			return $(elem).hasClass(className);
		},
		
		/**
		 * 获取元素的计算样式。
		 * @param {Element} dom 节点。
		 * @param {String} name 名字。
		 * @return {String} 样式。
		 */
		getStyle: getStyle,

		/**
		 * 读取样式字符串。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 */
		styleString:  getStyle,

		/**
		 * 读取样式数字。
		 * @param {Element} elem 元素。
		 * @param {String} name 属性名。必须使用骆驼规则的名字。
		 * @return {String} 字符串。
		 * @static
		 */
		styleNumber: styleNumber,

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
		styleNumbers: map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', {}, {}),
	
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
			$(elem).show();
		},
		
		/**
		 * 赋予元素的 display 属性 none。
		 * @param {Element} elem 元素。
		 */
		hide: function (elem) {
			$(elem).hide();
		},
		
		/**
		 * 获取指定css属性的当前值。
		 * @param {Element} elem 元素。
		 * @param {Object} styles 需要收集的属性。
		 * @return {Object} 收集的属性。
		 */
		getStyles: function (elem, styles) {

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

			apply(elem.style, styles);
		},
	
		/// #endif
		
		/// #if defined(ElementDimension) ||  defined(ElementStyle)

		/**
		 * 根据不同的内容进行计算。
		 * @param {Element} elem 元素。
		 * @param {String} type 输入。 一个 type 由多个句子用,连接，一个句子由多个词语用+连接，一个词语由两个字组成， 第一个字可以是下列字符之一: m b p t l r b h w  第二个字可以是下列字符之一: x y l t r b。词语也可以是: outer inner  。 
		 * @return {Number} 计算值。
		 * mx+sx ->  外大小。
		 * mx-sx ->  内大小。
		 */
		getSize: (function() {
			
			var borders = {
					m: 'margin#',
					b: 'border#Width',
					p: 'padding#'
				},
				map = {
					t: 'Top',
					r: 'Right',
					b: 'Bottom',
					l: 'Left'
				},
				init,
				tpl,
				rWord = /\w+/g;
				
			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl	= '(parseFloat(c["#"]) || 0)';
			} else {
				init = 'return ';
				tpl	= '(parseFloat(Element.getStyle(e, "#")) || 0)';
			}
			
			/**
			 * 翻译 type。
			 * @param {String} type 输入字符串。
			 * @return {String} 处理后的字符串。
			 */
			function format(type) {
				var t, f = type.charAt(0);
				switch(type.length) {
					
					// borders + map
					// borders + x|y
					// s + x|y
					case 2:
						t = type.charAt(1);
						if(t in map) {
							t = borders[f].replace('#', map[t]);
						} else {
							return f === 's' ? 'e.offset' + (t === 'x' ? 'Width' : 'Height')  :
									'(' + format(f + (t !== 'y' ? 'l' : 't')) + '+' + 
									format(f + (t === 'x' ? 'r' : 'b')) + ')';
						}
							
						break;
					
					// map
					// w|h
					case 1:
						if(f in map) {
							t = map[f].toLowerCase();
						} else if(f !== 'x' && f !== 'y') {
							return 'Element.styleNumber(e,"' + (f === 'h' ? 'height' : 'width') + '")';
						} else {
							return f;	
						}
						
						break;
						
					default:
						t = type;
				}
				
				return tpl.replace('#', t);
			}
			
			return function (elem, type) {
				return (e.sizeMap[type] || (e.sizeMap[type] = new Function("e", init + type.replace(rWord, format))))(elem);
			}
		
		})(),
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * 设置一个元素可拖动。
		 * @param {Element} elem 要设置的节点。
		 * @static
		 */
		setMovable: function (elem) {
			if(!rMovable.test(getStyle(elem, "position")))
				elem.style.position = "relative";
		},
		
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
										var args = arguments, r = new ElementList;
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
				
				
				
				
			}, [ElementList, Document, e, Control]);
			
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
			
			
			// 删除已经创建的事件。
			delete ee[events];
			
	
			// 对每个事件执行定义。
			map(events, Function.from(o.extendIf(Function.isFunction(baseEvent) ? {
	
				initEvent: baseEvent
	
			} : {
	
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
		
	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
	
	/**
	 * xType
	 * @type String
	 */
	.implementIf(apply({xType: "element"}, eventObj))
	
	/// #else
	
	/// .implementIf({xType: "element"})
		
	/// #endif
	
	.implement({
	
		/// #ifdef ElementManipulation

		/**
		 * 将当前节点添加到其它节点。
		 * @param {Element/String} elem=document.body 节点、控件或节点的 id 字符串。
		 * @return {Element} this
		 * this.appendTo(parent)  相当于 elem.appendChild(this) 。
		 * appendTo 同时执行  render(parent, null) 通知当前控件正在执行渲染。
		 */
		appendTo: function (parent) {
			
			// 切换到节点。
			parent = parent && parent !== true ? $(parent) : document.body;

			// 插入节点
			return this.render(parent, null);

		},
		
		/**
		 * 将当前列表添加到指定父节点。
		 * @param {Element/Control} parent 渲染的目标。
		 * @param {Element/Control} refNode 渲染的位置。
		 * @protected
		 */
		render: function (parent, refNode) {
			return parent.insertBefore(this.dom || this, refNode);
		},

		/**
		 * 删除元素子节点或本身。
		 * @param {Object/Undefined} child 子节点。
		 * @return {Element} this
		 */
		remove: function (child) {
			
			// 没有参数， 删除本身。
			if(!arguments.length)
				return this.detach();
				
			child.detach ? child.detach() : this.removeChild(child);
			return this;
		},
		
		/**
		 * 移除节点本身。
		 */
		detach: function() {
			var elem = this.dom || this;
			elem.parentNode && elem.parentNode.removeChild(elem);
			return this;
		},

		/**
		 * 释放节点所有资源。
		 */
		dispose: function () {
			this.detach();
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 设置连接的透明度。
		 * @param {Number} value 透明度， 0 - 1 。
		 * @return {Element} this
		 */
		setOpacity: function (value) {
			$(this.dom || this).css('opacity', value);
			return this;

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
			
			
			var thisElem = this.dom || this,
				targetZIndex = elem && (parseInt(getStyle(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;
			
			// 如果当前元素的 z-index 未超过目标值，则设置
			if(!(getStyle(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
			
			return this;
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute

		/**
		 * 快速设置节点全部属性和样式。
		 * @param {String/Object} name 名字。
		 * @param {Object} [value] 值。
		 * @return {Element} this
		 */
		set: function (name, value) {

			var me = this;

			if (typeof name === "string") {
				
				var elem = me.dom || me;

				// event 。
				if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css 。
				else if(elem.style && (name in elem.style || rStyle.test(name)))
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
		 * 设置值。
		 * @param {String/Boolean} 值。
		 * @return {Element} this
		 */
		setText: function (value) {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					$(elem).val(value);
					break;
				default:
					$(elem).text(value);
			}
			return  this;
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
			var me = this,
				p = formatPoint(x,y);

			if(p.x != null)
				me.setWidth(p.x - e.getSize(me.dom || me, 'bx+px'));
	
			if (p.y != null)
				me.setHeight(p.y - e.getSize(me.dom || me, 'by+py'));
	
			return me;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setWidth: function (value) {

			$(this.dom || this).width(value <= 0 ? 0 : value);
			return this;
		},

		/**
		 * 获取元素自身大小（不带滚动条）。
		 * @param {Number} value 值。
		 * @return {Element} this
		 */
		setHeight: function (value) {

			$(this.dom || this).height(value <= 0 ? 0 : value);
			return this;
		},
		
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 设置元素的相对位置。
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function (p) {

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
			x = formatPoint(x, y);
			$(this.dom || this).offset({left: x.x, top: x.y});
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
			var elem = this.dom || this, p = formatPoint(x, y);

			if(p.x != null)
				elem.scrollLeft = p.x;
			if(p.y != null)
				elem.scrollTop = p.y;
			return this;

		}
	
		/// #endif
		
	})
	
	/// #ifdef ElementEvent
	
	.implement(p.IEvent)
	
	/// #endif
	
	.implement({

		/**
		 * 获取透明度。
		 * @method
		 * @return {Number} 透明度。 0 - 1 范围。
		 */
		getOpacity: function () {
			return $.css(this.dom || this, 'opacity');
		},

		/**
		 * 获取值。
		 * @return {Object/String} 值。对普通节点返回 text 属性。
		 */
		getText: function () {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					return $(elem).val();
				default:
					return $(elem).text();
			}
		},
	
		/// #ifdef ElementDimension

		/**
		 * 获取元素可视区域大小。包括 border 大小。
		 * @return {Point} 位置。
		 */
		getSize: function () {
			var elem = this.dom || this;

			return new Point(elem.offsetWidth, elem.offsetHeight);
		},

		/**
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var elem = this.dom || this;

			return new Point(elem.scrollWidth, elem.scrollHeight);
		},
	
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * 获取元素的相对位置。
		 * @return {Point} 位置。
		 */
		getOffset: function () {

			// 如果设置过 left top ，这是非常轻松的事。
			var elem = $(this.dom || this),
				offset = elem.position();
				
			// 碰到 auto ， 空 变为 0 。
			return new Point(
				offset.left,
				offset.top
			);
		},

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: function () {

			var elem = $(this.dom || this),
				offset = elem.offset();

			return new Point(
				offset.left,
				offset.top
			    );
		},

		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll:  function () {
			var elem = this.dom || this;
			return new Point(elem.scrollLeft, elem.scrollTop);
		}

		/// #endif
		
	}, 2)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @method
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		findAll: function(selecter){
			return new ElementList($(this.dom || this).find(selecter));
		},

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
			
			return e.treeWalkers[treeWalker](this.dom || this, args);
		},
	
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 在某个位置插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @param {String} [where] 插入地点。 beforeBegin   节点外    beforeEnd   节点里
		 * afterBegin    节点外  afterEnd     节点里
		 * @return {Element} 插入的节点。
		 */
		insert: function (html, where) {

			var elem = this.dom || this, p, refNode = elem;

			html = e.parse(html, elem);

			switch (where) {
				case "afterBegin":
					p = this;
					refNode = elem.firstChild;
					break;
				case "afterEnd":
					refNode = elem.nextSibling;
				case "beforeBegin":
					p = elem.parentNode;
					break;
				default:
					p = this;
					refNode = null;
			}
			
			// 调用 HTML 的渲染。
			return html.render(p, refNode);
		},

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			
			
			// 如果新元素有适合自己的渲染函数。
			return e.parse(html, this.dom || this).render(this, null);
		},

		/**
		 * 将一个节点用另一个节点替换。
		 * @param {Element/String} html 内容。
		 * @return {Element} 替换之后的新元素。
		 */
		replaceWith: function (html) {
			var elem = this.dom || this;
			
			html = e.parse(html, elem);
			$(elem).replaceWith(html);
			return html;
		},
		
		/**
		 * 复制节点。
		 * @param {Boolean} cloneEvent=false 是否复制事件。
		 * @param {Boolean} contents=true 是否复制子元素。
		 * @param {Boolean} keepId=false 是否复制 id 。
		 * @return {Element} 元素。
		 */
		clone: function (cloneEvent, contents, keepId) {

			return $(this).clone(cloneEvent)[0];
		}
		
		/// #endif

	}, 3)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * 执行一个简单的选择器。
		 * @param {String} selecter 选择器。 如 h2 .cls attr=value 。
		 * @return {Element/undefined} 节点。
		 */
		find: function (selector) {
			return $$($(this.dom || this).find(selector)[0]);
		},
		
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * 判断一个节点是否包含一个节点。 一个节点包含自身。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		contains: function (child) {
			var elem = this.dom || this;
			child = child.dom || child;
			return child == elem || e.hasChild(elem, child);
		},

		/**
		 * 判断一个节点是否有子节点。
		 * @param {Element} child 子节点。
		 * @return {Boolean} 有返回true 。
		 */
		hasChild: function (child) {
			var elem = this.dom || this;
			return child ? e.hasChild(elem, child.dom || child) : elem.firstChild !== null;
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * 判断一个节点是否隐藏。
		 * @param {Element} elem 元素。
		 * @return {Boolean} 隐藏返回 true 。
		 */
		isHidden: function () {
			var elem = this.dom || this;

			return (elem.style.display || getStyle(elem, 'display')) === 'none';
		}
		
		/// #endif
		
	}, 4);
	
	getWindowScroll = 'pageXOffset' in window ? function () {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;
		
	/**
	 * @class Document
	 */
	Document.implement({
		
		/// #ifdef ElementManipulation

		/**
		 * 插入一个HTML 。
		 * @param {String/Element} html 内容。
		 * @return {Element} 元素。
		 */
		append: function (html) {
			return $$(this.body).append(html);
		},
	
		/// #endif
		
		/// #ifdef ElementCore

		/**
		 * 创建一个节点。
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function (tagName, className) {
			

			/// #ifdef SupportIE6

			var div = $$(this.createElement(tagName));

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
		 * 获取滚动区域大小。
		 * @return {Point} 位置。
		 */
		getScrollSize: function () {
			var html = this.dom,
				min = this.getSize(),
				body = this.body;
				
				
			return new Point(Math.max(html.scrollWidth, body.scrollWidth, min.x), Math.max(html.scrollHeight, body.scrollHeight, min.y));
		},
		
		/// #ifdef ElementOffset
		
		/// #endif

		/**
		 * 获取距父元素的偏差。
		 * @return {Point} 位置。
		 */
		getPosition: getWindowScroll,
		
		/**
		 * 获取滚动条已滚动的大小。
		 * @return {Point} 位置。
		 */
		getScroll: getWindowScroll,

		/**
		 * 滚到。
		 * @method setScroll
		 * @param {Number} x 坐标。
		 * @param {Number} y 坐标。
		 * @return {Document} this 。
		 */
		setScroll: function (x, y) {
			var doc = this, p = formatPoint(x, y);
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			doc.defaultView.scrollTo(p.x, p.y);

			return doc;
		},
		
		/// #endif
		
		/**
		 * 根据元素返回节点。
		 * @param {String} ... 对象的 id 或对象。
		 * @return {ElementList} 如果只有1个参数，返回元素，否则返回元素集合。
		 */
		getDom: function () {
			return arguments.length === 1 ? $$(this.getElementById(arguments[0])) :  new ElementList(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	/**
	 * @namespace Control
	 */
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
				Control.delegate(control, target, methods2, type2);
			
			
			map(methods, function(func) {
				switch (type) {
					case 2:
						return function(args1, args2, args3) {
							return this[target][func](args1, args2, args3);
						};
					case 3:
						return function(args1, args2) {
							return this[target][func](args1 && args1.dom || args1, args2 ? args2.dom || args2 : null);
						};
					default:
						return function(args1, args2, args3) {
							this[target][func](args1, args2, args3);
							return this;
						};
				}
			}, control.prototype);
			
			return Control.delegate;
		}
		
	});
	
	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);
	
	/**
	 * 将当前列表添加到指定父节点。
	 * @param {Element/Control} parent 渲染的目标。
	 * @param {Element/Control} refNode 渲染的位置。
	 * @protected
	 */
	ElementList.prototype.render = function (parent, refNode) {
			parent = parent.dom || parent;
			for(var i = 0, len = this.length; i < len; i++)
				parent.insertBefore(this[i], refNode);
	};

	/// #ifdef ElementCore
	
	/// #endif
		
	/// #ifdef ElementNode
	
	map('checked disabled selected', function (treeWalker) {
		return function(elem, args) {
			args = args !== false;
			return this.children(elem, function (elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);
	
	var setter = {};
	
	o.each({
		setStyle: 'css',
		empty: 'empty',
		setAttr: 'attr',
		addClass: 'addClass',
		removeClass: 'removeClass',
		toggleClass: 'toggleClass',
		setHtml: 'html',
		animate: 'animate',
		show: 'show',
		hide: 'hide',
		toggle: 'toggle'
	}, function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			me[func].apply(me, arguments);
			return this;
		}
	}, setter);
	
	e.implement(setter);
	
	o.each({
		getStyle: 'css',
		getAttr: 'attr',
		getHtml: 'html',
		getWidth: 'width',
		getHeight: 'height',
		hasClass: 'hasClass'
	},   function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			return me[func].apply(me, arguments);
		}
	}, setter = {});
	
	e.implement(setter, 2);
	
	
	
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
		
		$$ = function (id) {
			
			// 获取节点本身。
			var dom = getElementById(id);
	
			// 把 Element 成员复制到节点。
			// 根据 $version 决定是否需要拷贝，这样保证每个节点只拷贝一次。
			if(dom && dom.nodeType === 1 && dom.$version !== ep.$version)
				o.extendIf(dom, ep);
	
			return dom;
			
		};
		
		/**
		 * 返回当前文档默认的视图。
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function (e) {
			if(!e.stop) {
				e.target = $$(e.srcElement);
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
	
		try {
	
			//  修复IE6 因 css 改变背景图出现的闪烁。
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
	
		/// #endif
		
	}
	
	/// #endif
	
	apply(p, {
	
		$: $$,
		
		/**
		 * 元素。
		 */	
		Element: e,
		
		/// #ifdef ElementEvent
		
		/**
		 * 表示事件的参数。
		 * @class JPlus.Event
		 */
		Event: Class(pep),
		
		/// #endif
		
		/**
		 * 文档。
		 */
		Document: Document
			
	});
	
	map("$ Element Event Document", p, window, true);
	
	window.$$ = $$;
		
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
	
	/**
	 * 判断发生事件的元素是否在当前鼠标所在的节点内。
	 * @param {Event} e 事件对象。
	 * @return {Boolean} 返回是否应该触发  mouseenter。
	 */
	function checkMouseEnter(event) {
		
		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

	}
	
	o.extendIf(window, eventObj);
	
	document.onReady = function(fn){
		$(fn);
	};
	
	document.onLoad = function(fn){
		$(document).load(fn);
	};
	
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
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementTraversing
	
	/**
	 * 返回简单的遍历函数。
	 * @param {Boolean} getFirst 返回第一个还是返回所有元素。
	 * @param {String} next 获取下一个成员使用的名字。
	 * @param {String} first=next 获取第一个成员使用的名字。
	 * @return {Function} 遍历函数。
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first];
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					return $(node);
				node = node[next];
			}
			return node;
		} : function (elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first],
				r = new ElementList;
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
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
		
		return args;
	}
	
	/// #endif

	/**
	 * 读取样式数字。
	 * @param {Object} elem 元素。
	 * @param {Object} name 属性名。
	 * @return {Number} 数字。
	 */
	function styleNumber(elem, name) {
		return parseFloat($(elem).css(name));
	}
	
	/**
	 * 转换参数为标准点。
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x : {
			x:x,
			y:y
		};
	}
	
	var get = $.fn.get;
	
	$.fn.get = function(){
		return $$(get.apply(this, arguments));
	};

})(jQuery);


